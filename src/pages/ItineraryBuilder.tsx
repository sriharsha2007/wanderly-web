import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Trash2, Calendar, MoreVertical } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Itinerary } from '../types'
import { formatDate, cn } from '../lib/utils'

export default function ItineraryBuilder() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTripName, setNewTripName] = useState('')
  const [creating, setCreating] = useState(false)
  const [actionTripId, setActionTripId] = useState<string | null>(null)

  useEffect(() => { if (user && !authLoading) fetchItineraries() }, [user, authLoading])

  async function fetchItineraries() {
    setLoading(true)
    const { data } = await supabase.from('itineraries').select('*, days:itinerary_days(id)').eq('user_id', user!.id).order('created_at', { ascending: false })
    if (data) setItineraries(data)
    setLoading(false)
  }

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTripName.trim()) return
    setCreating(true)
    const { data } = await supabase.from('itineraries').insert({ user_id: user!.id, name: newTripName }).select().maybeSingle()
    setShowCreateModal(false); setNewTripName('')
    if (data) navigate(`/itinerary/${data.id}`)
    else fetchItineraries()
    setCreating(false)
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Delete this trip?')) return
    await supabase.from('itineraries').delete().eq('id', tripId)
    fetchItineraries()
  }

  if (authLoading || loading) return <div className="pt-20 flex justify-center items-center min-h-[60vh]"><div className="spinner" /></div>

  return (
    <div className="pt-20 bg-sand-50 dark:bg-sand-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-sand-900 dark:text-white">My Trips</h1>
            <p className="text-sand-600 dark:text-sand-400 mt-2">Plan and manage your travel itineraries</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary"><Plus className="w-5 h-5 mr-2" />New Trip</button>
        </div>

        {itineraries.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((trip) => (
              <div key={trip.id} className="card group overflow-visible">
                <div className="relative h-40 bg-gradient-hero rounded-t-2xl">
                  <div className="absolute inset-0 flex items-center justify-center"><MapPin className="w-12 h-12 text-white/30" /></div>
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <button onClick={() => setActionTripId(actionTripId === trip.id ? null : trip.id)} className="p-2 rounded-full bg-white/20 hover:bg-white/30"><MoreVertical className="w-4 h-4 text-white" /></button>
                      {actionTripId === trip.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-sand-800 rounded-lg shadow-xl py-1 z-10">
                          <Link to={`/itinerary/${trip.id}`} className="block px-3 py-2 text-sm text-sand-700 dark:text-sand-200 hover:bg-sand-50 dark:hover:bg-sand-700">Edit</Link>
                          <button onClick={() => handleDeleteTrip(trip.id)} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', trip.status === 'planning' && 'bg-blue-100 text-blue-700', trip.status === 'booked' && 'bg-green-100 text-green-700', trip.status === 'completed' && 'bg-purple-100 text-purple-700')}>{trip.status}</span>
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/itinerary/${trip.id}`}>
                    <h3 className="font-semibold text-lg text-sand-900 dark:text-white hover:text-primary-600">{trip.name}</h3>
                  </Link>
                  {trip.description && <p className="text-sand-600 dark:text-sand-400 text-sm mt-1 line-clamp-2">{trip.description}</p>}
                  <div className="flex items-center gap-4 mt-3 text-sm text-sand-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{trip.days?.length || 0} days</span>
                    {trip.start_date && <span>{formatDate(trip.start_date)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-sand-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">No trips yet</h3>
            <p className="text-sand-600 dark:text-sand-400 mb-4">Start planning your next adventure!</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">Create Your First Trip</button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-sand-800 rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-serif text-xl font-semibold text-sand-900 dark:text-white mb-4">Create New Trip</h3>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="label">Trip Name *</label>
                <input type="text" className="input" placeholder="Summer Europe Trip" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 btn-outline">Cancel</button>
                <button type="submit" disabled={!newTripName.trim() || creating} className="flex-1 btn-primary">{creating ? 'Creating...' : 'Create Trip'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
