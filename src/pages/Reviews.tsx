import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, Calendar, Trash2, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Review, Destination } from '../types'
import StarRating from '../components/StarRating'

export default function Reviews() {
  const [searchParams, setSearchParams] = useSearchParams()
  const destinationId = searchParams.get('destination')
  const { user } = useAuth()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [reviews, setReviews] = useState<(Review & { destination: Destination })[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewingDestination, setReviewingDestination] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewContent, setReviewContent] = useState('')
  const [creatingReview, setCreatingReview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchData() }, [user])
  useEffect(() => { if (destinationId && destinations.length > 0) { const dest = destinations.find(d => d.id === destinationId); if (dest) { setSelectedDestination(dest); setReviewingDestination(true) } } }, [destinationId, destinations])

  async function fetchData() {
    setLoading(true)
    const { data: dests } = await supabase.from('destinations').select('*').order('name')
    if (dests) setDestinations(dests)
    const { data: revs } = await supabase.from('reviews').select('*, destination:destinations(*)').order('created_at', { ascending: false })
    if (revs) setReviews(revs as typeof reviews)
    setLoading(false)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedDestination) return
    setError(null); setCreatingReview(true)
    const { error: insertError } = await supabase.from('reviews').insert({ user_id: user.id, destination_id: selectedDestination.id, rating: reviewRating, title: reviewTitle || null, content: reviewContent })
    if (insertError) { setError(insertError.code === '23505' ? 'You have already reviewed this destination.' : 'Failed to submit review.') }
    else { fetchData(); setReviewingDestination(false); setSelectedDestination(null); setReviewRating(5); setReviewTitle(''); setReviewContent('') }
    setCreatingReview(false)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Delete your review?')) return
    await supabase.from('reviews').delete().eq('id', reviewId)
    fetchData()
  }

  if (loading) return <div className="pt-20 flex justify-center items-center min-h-[60vh]"><div className="spinner" /></div>

  return (
    <div className="pt-20 bg-sand-50 dark:bg-sand-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl md:text-4xl font-serif font-semibold text-sand-900 dark:text-white">Reviews</h1><p className="text-sand-600 dark:text-sand-400 mt-2">Read and share travel experiences</p></div>
          {user && <button onClick={() => setReviewingDestination(true)} className="btn-primary"><Star className="w-4 h-4 mr-2" />Write Review</button>}
        </div>

        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {review.destination && <Link to={`/destination/${review.destination.id}`}><img src={review.destination.image_url} alt={review.destination.name} className="w-16 h-16 rounded-lg object-cover" /></Link>}
                    <div>
                      {review.destination && <Link to={`/destination/${review.destination.id}`} className="font-semibold text-sand-900 dark:text-white hover:text-primary-600">{review.destination.name}</Link>}
                      <div className="flex items-center gap-2 mt-1"><StarRating value={review.rating} readonly size="sm" /></div>
                    </div>
                  </div>
                  {user?.id === review.user_id && <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-sand-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
                {review.title && <h3 className="font-medium text-sand-800 dark:text-sand-100 mb-2">{review.title}</h3>}
                <p className="text-sand-600 dark:text-sand-300 text-sm mb-3">{review.content}</p>
                <div className="flex items-center gap-4 text-xs text-sand-500">
                  {review.visit_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Visited {new Date(review.visit_date).toLocaleDateString()}</span>}
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="text-center py-20"><Star className="w-12 h-12 text-sand-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">No reviews yet</h3><p className="text-sand-600 dark:text-sand-400">Be the first to share your experience!</p></div>}
      </div>

      {reviewingDestination && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-sand-800 rounded-2xl p-6 max-w-lg w-full animate-scale-in my-8">
            <div className="flex items-center justify-between mb-6"><h3 className="font-serif text-xl font-semibold text-sand-900 dark:text-white">Write a Review</h3><button onClick={() => { setReviewingDestination(false); setSelectedDestination(null); setSearchParams({}) }} className="text-2xl text-sand-400 hover:text-sand-600">&times;</button></div>
            {!selectedDestination ? (
              <div className="space-y-4">
                <p className="text-sand-600 dark:text-sand-400">Select a destination:</p>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {destinations.map((dest) => (
                    <button key={dest.id} onClick={() => setSelectedDestination(dest)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sand-50 dark:hover:bg-sand-700">
                      <img src={dest.image_url} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="text-left"><p className="font-medium text-sand-900 dark:text-white">{dest.name}</p><p className="text-sm text-sand-500">{dest.country}</p></div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-sand-50 dark:bg-sand-700 rounded-lg">
                  <img src={selectedDestination.image_url} alt={selectedDestination.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div><p className="font-medium text-sand-900 dark:text-white">{selectedDestination.name}</p><p className="text-sm text-sand-500">{selectedDestination.country}</p></div>
                </div>
                <div><label className="label">Your Rating *</label><StarRating value={reviewRating} onChange={setReviewRating} size="lg" /></div>
                <div><label className="label">Title (optional)</label><input type="text" className="input" placeholder="Summarize your experience" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} /></div>
                <div><label className="label">Your Review *</label><textarea className="input min-h-[120px]" placeholder="Share your experience..." value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} required /></div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setSelectedDestination(null); setError(null) }} className="flex-1 btn-outline">Back</button>
                  <button type="submit" disabled={!reviewContent || creatingReview} className="flex-1 btn-primary"><Send className="w-4 h-4 mr-2" />{creatingReview ? 'Submitting...' : 'Submit Review'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
