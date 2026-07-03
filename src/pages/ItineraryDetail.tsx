import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, MapPin, Trash2, Calendar, GripVertical, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Itinerary, ItineraryDay, Destination } from '../types'
import { formatDate, cn } from '../lib/utils'

interface Entry { id: string; itinerary_day_id: string; destination_id: string; entry_order: number; destination?: Destination }

export default function ItineraryDetail() {
  const { id } = useParams<string>()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [days, setDays] = useState<ItineraryDay[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDay, setShowAddDay] = useState(false)
  const [showAddDestination, setShowAddDestination] = useState<string | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (id) { fetchItinerary(); fetchDestinations() } }, [id])

  async function fetchItinerary() {
    setLoading(true)
    const { data: trip } = await supabase.from('itineraries').select('*').eq('id', id).maybeSingle()
    if (trip) {
      setItinerary(trip)
      const { data: tripDays } = await supabase.from('itinerary_days').select('*, entries:itinerary_entries(*, destination:destinations(*))').eq('itinerary_id', id).order('day_number', { ascending: true })
      if (tripDays) {
        tripDays.forEach((day: ItineraryDay) => {
          if (day.entries) day.entries.sort((a: Entry, b: Entry) => a.entry_order - b.entry_order)
        })
        setDays(tripDays)
      }
    }
    setLoading(false)
  }

  async function fetchDestinations() {
    const { data } = await supabase.from('destinations').select('*').order('name')
    if (data) setDestinations(data)
  }

  const filteredDestinations = searchQuery ? destinations.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase())) : destinations

  const addDay = async () => {
    setSaving(true)
    const dayNumber = days.length + 1
    const { data } = await supabase.from('itinerary_days').insert({ itinerary_id: id, day_number: dayNumber }).select().maybeSingle()
    if (data) setDays([...days, { ...data, entries: [] }])
    setShowAddDay(false); setSaving(false)
  }

  const removeDay = async (dayId: string) => {
    if (!confirm('Delete this day?')) return
    await supabase.from('itinerary_days').delete().eq('id', dayId)
    fetchItinerary()
  }

  const addDestinationToDay = async (dayId: string) => {
    if (!selectedDestination) return
    setSaving(true)
    const day = days.find(d => d.id === dayId)
    const entryCount = day?.entries?.length || 0
    await supabase.from('itinerary_entries').insert({ itinerary_day_id: dayId, destination_id: selectedDestination, entry_order: entryCount })
    fetchItinerary()
    setShowAddDestination(null); setSelectedDestination(''); setSearchQuery(''); setSaving(false)
  }

  const removeEntry = async (entryId: string) => {
    await supabase.from('itinerary_entries').delete().eq('id', entryId)
    fetchItinerary()
  }

  const handleDrop = async (e: React.DragEvent, targetDayId: string) => {
    const entryId = e.dataTransfer.getData('entryId')
    const sourceDayId = e.dataTransfer.getData('sourceDayId')
    if (sourceDayId !== targetDayId) {
      await supabase.from('itinerary_entries').update({ itinerary_day_id: targetDayId }).eq('id', entryId)
      fetchItinerary()
    }
  }

  if (loading) return <div className="pt-20 flex justify-center items-center min-h-[60vh]"><div className="spinner" /></div>
  if (!itinerary) return <div className="pt-20 text-center"><h1 className="text-2xl font-bold">Trip not found</h1><Link to="/itinerary" className="btn-primary mt-4">Go to My Trips</Link></div>

  return (
    <div className="pt-20 bg-sand-50 dark:bg-sand-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-sand-900 dark:text-white">{itinerary.name}</h1>
            {itinerary.description && <p className="text-sand-600 dark:text-sand-400 mt-2">{itinerary.description}</p>}
            <div className="flex items-center gap-4 mt-3 text-sm text-sand-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{days.length} days</span>
              {itinerary.start_date && <span>{formatDate(itinerary.start_date)}{itinerary.end_date && ` - ${formatDate(itinerary.end_date)}`}</span>}
            </div>
          </div>
          <button onClick={() => setShowAddDay(true)} className="btn-primary"><Plus className="w-4 h-4 mr-2" />Add Day</button>
        </div>

        {days.length > 0 ? (
          <div className="space-y-6">
            {days.map((day) => (
              <div key={day.id} className="card p-4" onDrop={(e) => handleDrop(e, day.id)} onDragOver={(e) => e.preventDefault()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="font-semibold text-primary-600 dark:text-primary-400">{day.day_number}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sand-900 dark:text-white">Day {day.day_number}</h3>
                      {day.date && <p className="text-sm text-sand-500">{formatDate(day.date)}</p>}
                    </div>
                  </div>
                  <button onClick={() => removeDay(day.id)} className="p-2 text-sand-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                {day.entries && day.entries.length > 0 ? (
                  <div className="space-y-3">
                    {(day.entries as Entry[]).map((entry) => (
                      <div key={entry.id} draggable onDragStart={(e) => { e.dataTransfer.setData('entryId', entry.id); e.dataTransfer.setData('sourceDayId', day.id) }} className="flex items-center gap-4 p-3 bg-sand-50 dark:bg-sand-800 rounded-lg cursor-move group">
                        <GripVertical className="w-4 h-4 text-sand-400 opacity-0 group-hover:opacity-100" />
                        {entry.destination && (
                          <>
                            <img src={entry.destination.image_url} alt={entry.destination.name} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <Link to={`/destination/${entry.destination.id}`} className="font-medium text-sand-900 dark:text-white hover:text-primary-600">{entry.destination.name}</Link>
                              <p className="text-sm text-sand-500">{entry.destination.city && `${entry.destination.city}, `}{entry.destination.country}</p>
                            </div>
                          </>
                        )}
                        <button onClick={() => removeEntry(entry.id)} className="p-2 text-sand-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-sand-200 dark:border-sand-700 rounded-lg p-6 text-center">
                    <MapPin className="w-8 h-8 text-sand-300 mx-auto mb-2" />
                    <p className="text-sand-500 text-sm">Drop destinations here or add one</p>
                  </div>
                )}
                <button onClick={() => setShowAddDestination(day.id)} className="mt-4 w-full btn-ghost text-sm justify-center"><Plus className="w-4 h-4 mr-2" />Add Destination</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-sand-300 mx-auto mb-4" />
            <p className="text-sand-500 mb-4">No days planned yet</p>
            <button onClick={() => setShowAddDay(true)} className="btn-primary">Add Your First Day</button>
          </div>
        )}
      </div>

      {showAddDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-sand-800 rounded-2xl p-6 max-w-sm w-full animate-scale-in">
            <h3 className="font-serif text-xl font-semibold text-sand-900 dark:text-white mb-4">Add Day</h3>
            <p className="text-sand-600 dark:text-sand-400 mb-6">Add day {days.length + 1}?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowAddDay(false)} className="flex-1 btn-outline">Cancel</button>
              <button onClick={addDay} disabled={saving} className="flex-1 btn-primary">{saving ? 'Adding...' : 'Add Day'}</button>
            </div>
          </div>
        </div>
      )}

      {showAddDestination && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-sand-800 rounded-2xl p-6 max-w-md w-full animate-scale-in max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="font-serif text-xl font-semibold text-sand-900 dark:text-white mb-4">Add Destination</h3>
            <input type="text" placeholder="Search destinations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input w-full mb-4" />
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {filteredDestinations.slice(0, 10).map((dest) => (
                <button key={dest.id} onClick={() => setSelectedDestination(dest.id)} className={cn('w-full flex items-center gap-3 p-3 rounded-lg', selectedDestination === dest.id ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-sand-50 dark:hover:bg-sand-700')}>
                  <img src={dest.image_url} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="text-left"><p className="font-medium text-sand-900 dark:text-white">{dest.name}</p><p className="text-sm text-sand-500">{dest.country}</p></div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowAddDestination(null); setSelectedDestination(''); setSearchQuery('') }} className="flex-1 btn-outline">Cancel</button>
              <button onClick={() => addDestinationToDay(showAddDestination)} disabled={!selectedDestination || saving} className="flex-1 btn-primary">{saving ? 'Adding...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
