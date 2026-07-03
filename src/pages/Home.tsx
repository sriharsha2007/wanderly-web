import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Destination } from '../types'
import SearchBar from '../components/SearchBar'
import DestinationCard from '../components/DestinationCard'
import { Star, Globe, Shield, Calendar, ArrowRight, MapPin, Users } from 'lucide-react'

const testimonials = [
  { name: 'Sarah Chen', location: 'San Francisco', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150', quote: 'Wanderly helped me plan my honeymoon across Southeast Asia!', rating: 5 },
  { name: 'Marcus Johnson', location: 'London', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150', quote: 'Discovered hidden gems I never would have found on my own.', rating: 5 },
  { name: 'Emily Rodriguez', location: 'Buenos Aires', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150', quote: 'Best travel app! The reviews are incredibly helpful.', rating: 5 },
]

const whyWanderly = [
  { icon: Globe, title: 'Discover Hidden Gems', description: 'Explore curated destinations from bustling cities to remote beaches.' },
  { icon: Calendar, title: 'Plan Effortlessly', description: 'Build your perfect itinerary with our intuitive trip planner.' },
  { icon: Users, title: 'Real Reviews', description: 'Read honest reviews from fellow travelers.' },
  { icon: Shield, title: 'Travel Smart', description: 'Get up-to-date info on entry requirements and best times to visit.' },
]

export default function Home() {
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDestinations() }, [])
  async function fetchDestinations() {
    try {
      const { data, error } = await supabase.from('destinations').select('*').order('rating', { ascending: false }).limit(6)
      if (error) throw error
      setFeaturedDestinations(data || [])
    } catch { } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('https://images.pexels.com/photos/1473470/pexels-photo-1473470.jpeg?w=1920')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 z-10" />
        <div className="relative z-30 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">Your Next Adventure <br /><span className="text-gradient">Awaits</span></h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up">Discover extraordinary destinations, build personalized itineraries, and share your travel stories.</p>
          <div className="animate-slide-up"><SearchBar variant="hero" /></div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>500+ Destinations</span></div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>10,000+ Travelers</span></div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span>4.9 Rating</span></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-sand-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle mx-auto">Hand-picked destinations loved by travelers worldwide</p>
          </div>
          {loading ? <div className="flex justify-center py-12"><div className="spinner" /></div> : featuredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDestinations.map((destination, index) => (
                <div key={destination.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <DestinationCard destination={destination} />
                </div>
              ))}
            </div>
          ) : <div className="text-center py-12 text-sand-500"><p>No destinations available yet.</p></div>}
          <div className="text-center mt-10">
            <Link to="/explore" className="btn-outline">View All Destinations<ArrowRight className="w-4 h-4 ml-2" /></Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand-50 dark:bg-sand-950">
        <div className="container">
          <div className="text-center mb-12"><h2 className="section-title">Why Wanderly?</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyWanderly.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="card p-6 text-center bg-white dark:bg-sand-900">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-sand-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sand-600 dark:text-sand-400 text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-sand-900">
        <div className="container">
          <div className="text-center mb-12"><h2 className="section-title">What Travelers Say</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6 bg-sand-50 dark:bg-sand-800">
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-sand-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-sand-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">{[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-sand-600 dark:text-sand-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero">
        <div className="container text-center text-white">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8">Join thousands of travelers who plan their adventures with Wanderly.</p>
          <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-sand-50 px-8 py-3 text-lg">Create Free Account<ArrowRight className="w-5 h-5 ml-2" /></Link>
        </div>
      </section>
    </div>
  )
}
