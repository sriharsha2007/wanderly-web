import { Globe, Users, Star, Shield, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const team = [
  { name: 'Sarah Chen', role: 'Founder', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=300', bio: 'Former travel blogger' },
  { name: 'Marcus Rivera', role: 'Head of Product', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=300', bio: '15 years in travel tech' },
  { name: 'Aisha Patel', role: 'Community Lead', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=300', bio: 'Built communities across 50+ countries' },
]

const values = [
  { icon: Globe, title: 'Authentic Discovery', description: 'Finding experiences that connect you to the heart of each destination.' },
  { icon: Users, title: 'Community-Driven', description: 'Real reviews from real adventurers.' },
  { icon: Star, title: 'Quality Over Quantity', description: 'Every destination carefully curated.' },
  { icon: Shield, title: 'Trusted Information', description: 'Accurate, up-to-date information you can rely on.' },
]

export default function About() {
  return (
    <div className="pt-20 bg-white dark:bg-sand-900">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0"><img src="https://images.pexels.com/photos/1473470/pexels-photo-1473470.jpeg?w=1920" alt="Travel" className="w-full h-full object-cover opacity-20" /></div>
        <div className="relative z-10 container text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-sand-900 dark:text-white mb-6">Our Story</h1>
          <p className="text-xl text-sand-600 dark:text-sand-300 max-w-2xl mx-auto">Wanderly was born from a simple idea: make travel planning enjoyable, not overwhelming.</p>
        </div>
      </section>

      <section className="py-20 bg-sand-50 dark:bg-sand-950">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-semibold text-sand-900 dark:text-white mb-6">The Journey Begins</h2>
              <div className="space-y-4 text-sand-600 dark:text-sand-300">
                <p>In 2023, our founder Sarah was planning a three-month trip through Southeast Asia. Like millions of travelers, she found herself buried in browser tabs, scattered bookmarks, and conflicting information.</p>
                <p>There had to be a better way — a place where you could discover incredible destinations, plan your entire itinerary, and share your experiences with fellow adventurers.</p>
                <p>Today, Wanderly is home to thousands of travelers who plan their adventures with us every day.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 text-center"><div className="text-4xl font-bold text-primary-500 mb-2">500+</div><div className="text-sand-600 dark:text-sand-400">Destinations</div></div>
              <div className="card p-6 text-center bg-primary-50 dark:bg-primary-900"><div className="text-4xl font-bold text-primary-500 mb-2">10K+</div><div className="text-sand-600 dark:text-sand-400">Travelers</div></div>
              <div className="card p-6 text-center bg-secondary-50 dark:bg-secondary-900"><div className="text-4xl font-bold text-secondary-500 mb-2">25K+</div><div className="text-sand-600 dark:text-sand-400">Reviews</div></div>
              <div className="card p-6 text-center"><div className="text-4xl font-bold text-amber-500 mb-2">150+</div><div className="text-sand-600 dark:text-sand-400">Countries</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12"><h2 className="text-3xl font-serif font-semibold text-sand-900 dark:text-white mb-4">What We Stand For</h2></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-hero flex items-center justify-center"><Icon className="w-8 h-8 text-white" /></div>
                  <h3 className="font-semibold text-lg text-sand-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-sand-600 dark:text-sand-400 text-sm">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand-50 dark:bg-sand-950">
        <div className="container">
          <div className="text-center mb-12"><h2 className="text-3xl font-serif font-semibold text-sand-900 dark:text-white mb-4">Meet the Team</h2></div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center">
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-semibold text-sand-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">{member.role}</p>
                <p className="text-sm text-sand-600 dark:text-sand-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero">
        <div className="container text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8">Join thousands of travelers who trust Wanderly.</p>
          <Link to="/explore" className="btn bg-white text-primary-600 hover:bg-sand-50 px-8 py-3 text-lg"><MapPin className="w-5 h-5 mr-2" />Explore Destinations</Link>
        </div>
      </section>
    </div>
  )
}
