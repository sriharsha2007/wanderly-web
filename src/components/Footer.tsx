import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-sand-900 text-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif text-xl font-semibold text-white">Wanderly</span>
            </Link>
            <p className="text-sand-400 max-w-md mb-4">Discover the world's most incredible destinations, build your dream itineraries, and share your travel experiences.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-sand-400 hover:text-white transition-colors">All Destinations</Link></li>
              <li><Link to="/about" className="text-sand-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sand-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/reviews" className="text-sand-400 hover:text-white transition-colors">Reviews</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sand-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sand-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sand-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sand-500 text-sm">&copy; {currentYear} Wanderly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
