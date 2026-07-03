import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, User, LogOut, MapPin, Heart, Compass, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { cn } from '../lib/utils'

const navLinks = [
  { name: 'Explore', path: '/explore', icon: Compass },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileMenuOpen(false); setIsUserMenuOpen(false) }, [location])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-white/90 dark:bg-sand-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-sand-900 dark:text-white group-hover:text-primary-500 transition-colors">Wanderly</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link key={link.path} to={link.path} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all', isActive ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400' : 'text-sand-600 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800 hover:text-sand-900 dark:hover:text-white')}>
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-sand-600 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-sand-100 dark:hover:bg-sand-800 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-sand-800 rounded-xl shadow-xl py-2 animate-scale-in">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-sand-700 dark:text-sand-200 hover:bg-sand-50 dark:hover:bg-sand-700"><LayoutDashboard className="w-4 h-4" />Dashboard</Link>
                    <Link to="/itinerary" className="flex items-center gap-3 px-4 py-2 text-sm text-sand-700 dark:text-sand-200 hover:bg-sand-50 dark:hover:bg-sand-700"><MapPin className="w-4 h-4" />My Trips</Link>
                    <Link to="/dashboard?tab=wishlist" className="flex items-center gap-3 px-4 py-2 text-sm text-sand-700 dark:text-sand-200 hover:bg-sand-50 dark:hover:bg-sand-700"><Heart className="w-4 h-4" />Wishlist</Link>
                    <hr className="my-2 border-sand-200 dark:border-sand-700" />
                    <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"><LogOut className="w-4 h-4" />Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg text-sand-600 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-sand-900 border-t border-sand-200 dark:border-sand-800">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return <Link key={link.path} to={link.path} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg font-medium', location.pathname === link.path ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400' : 'text-sand-600 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800')}><Icon className="w-5 h-5" />{link.name}</Link>
            })}
            {!user && (
              <>
                <hr className="my-2 border-sand-200 dark:border-sand-700" />
                <Link to="/login" className="block px-4 py-3 text-center font-medium text-sand-600 dark:text-sand-300">Sign In</Link>
                <Link to="/signup" className="block btn-primary text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
