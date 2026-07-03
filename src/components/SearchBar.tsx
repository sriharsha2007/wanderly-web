import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, X } from 'lucide-react'

interface Props { variant?: 'hero' | 'inline'; defaultValue?: string; onSearch?: (query: string) => void }

export default function SearchBar({ variant = 'inline', defaultValue = '', onSearch }: Props) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
    else navigate(`/explore${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-sand-800 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
            <input type="text" placeholder="Where do you want to go?" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-12 pr-10 py-4 text-lg bg-sand-50 dark:bg-sand-700 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 text-sand-900 dark:text-white placeholder-sand-400" />
            {query && <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-sand-200 dark:hover:bg-sand-600"><X className="w-4 h-4 text-sand-400" /></button>}
          </div>
          <div className="md:w-64 relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
            <input type="text" placeholder="When?" className="w-full pl-12 pr-4 py-4 text-lg bg-sand-50 dark:bg-sand-700 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 text-sand-900 dark:text-white placeholder-sand-400" />
          </div>
          <button type="submit" className="btn-primary py-4 px-8 text-lg rounded-xl"><Search className="w-5 h-5 mr-2" />Search</button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
      <input type="text" placeholder="Search destinations..." value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-12" />
      {query && <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-sand-100 dark:hover:bg-sand-700"><X className="w-4 h-4 text-sand-400" /></button>}
    </form>
  )
}
