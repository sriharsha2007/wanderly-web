import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { User, MapPin, Heart, Star, Settings, Edit2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Itinerary, WishlistItem, Review, Destination } from '../types'
import DestinationCard from '../components/DestinationCard'
import { formatDate, cn } from '../lib/utils'

type TabType = 'overview' | 'trips' | 'wishlist' | 'reviews' | 'settings'

export default function Dashboard() {
  const { user, profile, updateProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [wishlist, setWishlist] = useState<(WishlistItem & { destination: Destination })[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType
    if (tab && ['overview', 'trips', 'wishlist', 'reviews', 'settings'].includes(tab)) setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    if (user) {
      fetchData()
      if (profile) { setFullName(profile.full_name || ''); setBio(profile.bio || '') }
    }
  }, [user, profile])

  async function fetchData() {
    setLoading(true)
    const [tripsRes, wishlistRes, reviewsRes] = await Promise.all([
      supabase.from('itineraries').select('*, days:itinerary_days(id)').eq('user_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('wishlists').select('*, destination:destinations(*)').eq('user_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('reviews').select('*, destination:destinations(id, name, image_url)').eq('user_id', user!.id).order('created_at', { ascending: false })
    ])
    if (tripsRes.data) setItineraries(tripsRes.data)
    if (wishlistRes.data) setWishlist(wishlistRes.data as typeof wishlist)
    if (reviewsRes.data) setReviews(reviewsRes.data)
    setLoading(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateProfile({ full_name: fullName, bio })
    setSaving(false); setEditingProfile(false)
  }

  const handleRemoveFromWishlist = async (id: string) => {
    if (!confirm('Remove from wishlist?')) return
    await supabase.from('wishlists').delete().eq('id', id)
    fetchData()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'trips', label: 'My Trips', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'reviews', label: 'My Reviews', icon: Star, count: reviews.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (loading) return <div className="pt-20 flex justify-center items-center min-h-[60vh]"><div className="spinner" /></div>

  return (
    <div className="pt-20 bg-sand-50 dark:bg-sand-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-56 shrink-0">
            <div className="card p-6 mb-4">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4"><User className="w-10 h-10 text-primary-600 dark:text-primary-400" /></div>
              <h2 className="font-semibold text-center text-sand-900 dark:text-white">{profile?.full_name || 'Traveler'}</h2>
              <p className="text-sm text-center text-sand-500">{profile?.email}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left', activeTab === tab.id ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-800')}>
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">{tab.count}</span>}
                  </button>
                )
              })}
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white">Welcome back, {profile?.full_name || 'Traveler'}!</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card p-4"><MapPin className="w-8 h-8 text-primary-500 mb-2" /><p className="text-2xl font-bold text-sand-900 dark:text-white">{itineraries.length}</p><p className="text-sm text-sand-500">Trips</p></div>
                  <div className="card p-4"><Heart className="w-8 h-8 text-red-500 mb-2" /><p className="text-2xl font-bold text-sand-900 dark:text-white">{wishlist.length}</p><p className="text-sm text-sand-500">Saved</p></div>
                  <div className="card p-4"><Star className="w-8 h-8 text-amber-500 mb-2" /><p className="text-2xl font-bold text-sand-900 dark:text-white">{reviews.length}</p><p className="text-sm text-sand-500">Reviews</p></div>
                </div>
                {wishlist.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg text-sand-900 dark:text-white mb-3">From Your Wishlist</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.slice(0, 3).map((item) => <DestinationCard key={item.id} destination={item.destination} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'trips' && (
              <div>
                <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white mb-6">My Trips</h1>
                {itineraries.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {itineraries.map((trip) => (
                      <div key={trip.id} className="card p-4">
                        <h3 className="font-semibold text-sand-900 dark:text-white mb-1">{trip.name}</h3>
                        <p className="text-sm text-sand-500 mb-2">{trip.days?.length || 0} days{trip.start_date && ` • ${formatDate(trip.start_date)}`}</p>
                        <span className={cn('px-2 py-1 rounded-full text-xs', trip.status === 'planning' && 'bg-blue-100 text-blue-700', trip.status === 'booked' && 'bg-green-100 text-green-700', trip.status === 'completed' && 'bg-purple-100 text-purple-700')}>{trip.status}</span>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-12"><MapPin className="w-12 h-12 text-sand-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">No trips yet</h3><Link to="/itinerary" className="btn-primary">Create Trip</Link></div>}
              </div>
            )}
            {activeTab === 'wishlist' && (
              <div>
                <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white mb-6">My Wishlist</h1>
                {wishlist.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="relative">
                        <DestinationCard destination={item.destination} />
                        <button onClick={() => handleRemoveFromWishlist(item.id)} className="absolute top-3 right-3 p-2 bg-white dark:bg-sand-800 rounded-full shadow-md"><Heart className="w-4 h-4 text-red-500 fill-red-500" /></button>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-12"><Heart className="w-12 h-12 text-sand-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">Your wishlist is empty</h3><Link to="/explore" className="btn-primary">Explore Destinations</Link></div>}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white mb-6">My Reviews</h1>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="card p-4">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex gap-0.5">{[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
                          <span className="text-sm text-sand-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        {review.title && <h3 className="font-medium text-sand-900 dark:text-white">{review.title}</h3>}
                        <p className="text-sand-600 dark:text-sand-400">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-12"><Star className="w-12 h-12 text-sand-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">No reviews yet</h3><Link to="/reviews" className="btn-primary">Write Review</Link></div>}
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-serif font-semibold text-sand-900 dark:text-white mb-6">Account Settings</h1>
                <div className="card p-6">
                  {editingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div><label className="label">Full Name</label><input type="text" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                      <div><label className="label">Bio</label><textarea className="input min-h-[80px]" value={bio} onChange={(e) => setBio(e.target.value)} /></div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setEditingProfile(false)} className="flex-1 btn-outline">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-1 btn-primary">{saving ? 'Saving...' : 'Save'}</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm text-sand-500">Full Name</p><p className="text-sand-900 dark:text-white">{profile?.full_name || 'Not set'}</p></div>
                        <button onClick={() => setEditingProfile(true)} className="p-2 hover:bg-sand-100 dark:hover:bg-sand-700 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      </div>
                      <div><p className="text-sm text-sand-500">Email</p><p className="text-sand-900 dark:text-white">{profile?.email}</p></div>
                      <div><p className="text-sm text-sand-500">Bio</p><p className="text-sand-900 dark:text-white">{profile?.bio || 'No bio yet'}</p></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
