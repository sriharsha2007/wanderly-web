import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Heart, Plus, ChevronLeft, ChevronRight, DollarSign, Clock, Globe, User, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Destination, Review, Itinerary } from '../types'
import StarRating from '../components/StarRating'
import { cn } from '../lib/utils'

export default function DestinationDetail() {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAddToItinerary, setShowAddToItinerary] = useState(false)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>('')

  useEffect(() => {
    if (id) {
      fetchDestination()
      fetchReviews()
      if (user) { checkWishlist(); fetchItineraries() }
    }
  }, [id, user])

  async function fetchDestination() {
    const { data } = await supabase.from('destinations').select('*').eq('id', id).maybeSingle()
    setDestination(data); setLoading(false)
  }
  async function fetchReviews() {
    const { data } = await supabase.from('reviews').select('*, profiles(id, full_name)').eq('destination_id', id).order('created_at', { ascending: false }).limit(10)
    if (data) setReviews(data)
  }
  async function checkWishlist() {
    const { data } = await supabase.from('wishlists').select('id').eq('user_id', user!.id).eq('destination_id', id).maybeSingle()
    setIsWishlisted(!!data)
  }
  async function fetchItineraries() {
    const { data } = await supabase.from('itineraries').select('*, days:itinerary_days(id)').eq('user_id', user!.id).order('created_at', { ascending: false })
    if (data) setItineraries(data)
  }

  const images = destination ? [destination.image_url, ...destination.gallery_urls].filter(Boolean) : []

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return }
    if (isWishlisted) {
      await supabase.from('wishlists').delete().match({ user_id: user.id, destination_id: id })
    } else {
      await supabase.from('wishlists').insert({ user_id: user.id, destination_id: id })
    }
    setIsWishlisted(!isWishlisted)
  }

  const handleAddToItinerary = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedItinerary || !selectedDay) { alert('Please select an itinerary and day'); return }
    const { count } = await supabase.from('itinerary_entries').select('*', { count: 'exact', head: true }).eq('itinerary_day_id', selectedDay)
    await supabase.from('itinerary_entries').insert({ itinerary_day_id: selectedDay, destination_id: id, entry_order: count || 0 })
    setShowAddToItinerary(false)
    alert('Destination added to your itinerary!')
  }

  if (loading) return <div className="pt-20 flex justify-center items-center min-h-[60vh]"><div className="spinner" /></div>
  if (!destination) return <div className="pt-20 text-center"><h1 className="text-2xl font-bold">Destination not found</h1><Link to="/explore" className="btn-primary mt-4">Browse Destinations</Link></div>

  return (
    <div className="pt-20 bg-sand-50 dark:bg-sand-950">
      <div className="relative h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0 overflow-hidden">
          <img src={images[currentImageIndex]} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        {images.length > 1 && (
          <>
            <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30"><ChevronLeft className="w-6 h-6 text-white" /></button>
            <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30"><ChevronRight className="w-6 h-6 text-white" /></button>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">{destination.name}</h1>
            <div className="flex items-center gap-2 text-white/90"><MapPin className="w-5 h-5" /><span>{destination.city ? `${destination.city}, ` : ''}{destination.country}</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6">
              <h2 className="font-serif text-2xl font-semibold text-sand-900 dark:text-white mb-4">About</h2>
              <p className="text-sand-600 dark:text-sand-300 leading-relaxed">{destination.description}</p>
            </div>
            <div className="card p-6">
              <h2 className="font-serif text-2xl font-semibold text-sand-900 dark:text-white mb-4">Reviews</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-sand-900 dark:text-white">{destination.rating.toFixed(1)}</div>
                <div><StarRating value={destination.rating} readonly size="lg" /><p className="text-sm text-sand-500 mt-1">{destination.review_count} reviews</p></div>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-6 border-t border-sand-200 dark:border-sand-700 pt-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"><User className="w-5 h-5 text-primary-600" /></div>
                        <div>
                          <p className="font-medium text-sand-900 dark:text-white">{review.profiles?.full_name || 'Anonymous'}</p>
                          <p className="text-sm text-sand-500">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="ml-auto"><StarRating value={review.rating} readonly size="sm" /></div>
                      </div>
                      {review.title && <h4 className="font-medium text-sand-800 dark:text-sand-100">{review.title}</h4>}
                      <p className="text-sand-600 dark:text-sand-300">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sand-500 border-t border-sand-200 dark:border-sand-700 pt-6">No reviews yet.</p>}
              <div className="border-t border-sand-200 dark:border-sand-700 pt-6 mt-6">
                {user ? <Link to={`/reviews?destination=${id}`} className="btn-primary">Write a Review</Link> : <Link to="/login" className="btn-outline">Sign in to write a review</Link>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center"><Clock className="w-6 h-6 text-primary-600" /></div>
                <div><p className="text-sm text-sand-500">Best Time to Visit</p><p className="font-medium text-sand-900 dark:text-white">{destination.best_time_to_visit || 'Year-round'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center"><DollarSign className="w-6 h-6 text-secondary-600" /></div>
                <div><p className="text-sm text-sand-500">Budget Level</p><p className="font-medium text-sand-900 dark:text-white capitalize">{destination.budget_level.replace('-', ' ')}{destination.average_cost && ` (~$${destination.average_cost}/day)`}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-sand-100 dark:bg-sand-800 flex items-center justify-center"><Globe className="w-6 h-6 text-sand-600" /></div>
                <div><p className="text-sm text-sand-500">Entry Requirements</p><p className="font-medium text-sand-900 dark:text-white text-sm">{destination.entry_requirements || 'No special requirements'}</p></div>
              </div>
            </div>
            <div className="card p-6 space-y-3">
              <button onClick={handleWishlist} className={cn('w-full btn', isWishlisted ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 'btn-outline')}>
                <Heart className={cn('w-5 h-5 mr-2', isWishlisted && 'fill-current')} />{isWishlisted ? 'Saved' : 'Add to Wishlist'}
              </button>
              <button onClick={() => user ? setShowAddToItinerary(true) : navigate('/login')} className="w-full btn-primary"><Plus className="w-5 h-5 mr-2" />Add to Itinerary</button>
              <button className="w-full btn-ghost"><Share2 className="w-5 h-5 mr-2" />Share</button>
            </div>
          </div>
        </div>
      </div>

      {showAddToItinerary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-sand-800 rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-serif text-xl font-semibold text-sand-900 dark:text-white mb-4">Add to Itinerary</h3>
            {itineraries.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="label">Select Itinerary</label>
                  <select className="input" value={selectedItinerary?.id || ''} onChange={(e) => { const it = itineraries.find(i => i.id === e.target.value); setSelectedItinerary(it || null); if (it?.days?.length) setSelectedDay(it.days[0].id) }}>
                    <option value="">Choose itinerary...</option>
                    {itineraries.map((it) => <option key={it.id} value={it.id}>{it.name}</option>)}
                  </select>
                </div>
                {selectedItinerary?.days && selectedItinerary.days.length > 0 && (
                  <div>
                    <label className="label">Select Day</label>
                    <select className="input" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                      {selectedItinerary.days.map((day, idx) => <option key={day.id} value={day.id}>Day {idx + 1}</option>)}
                    </select>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowAddToItinerary(false)} className="flex-1 btn-outline">Cancel</button>
                  <button onClick={handleAddToItinerary} disabled={!selectedItinerary || !selectedDay} className="flex-1 btn-primary">Add</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sand-600 dark:text-sand-400 mb-4">You don't have any itineraries yet.</p>
                <Link to="/itinerary" className="btn-primary" onClick={() => setShowAddToItinerary(false)}>Create Your First Trip</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
