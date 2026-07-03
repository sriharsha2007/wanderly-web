import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, Grid, List, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Destination, DestinationType, BudgetLevel } from '../types'
import DestinationCard from '../components/DestinationCard'
import SearchBar from '../components/SearchBar'
import { cn, getBudgetLabel, getTypeLabel } from '../lib/utils'

const destinationTypes: DestinationType[] = ['beach', 'mountain', 'heritage', 'adventure', 'city', 'countryside']
const budgetLevels: BudgetLevel[] = ['budget', 'mid-range', 'luxury']

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [countries, setCountries] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const selectedType = searchParams.get('type') as DestinationType | null
  const selectedBudget = searchParams.get('budget') as BudgetLevel | null
  const selectedCountry = searchParams.get('country')
  const searchQuery = searchParams.get('q') || ''

  useEffect(() => { fetchDestinations(); fetchCountries() }, [selectedType, selectedBudget, selectedCountry, searchQuery])

  async function fetchCountries() {
    const { data } = await supabase.from('destinations').select('country').order('country')
    if (data) setCountries([...new Set(data.map(d => d.country))])
  }

  async function fetchDestinations() {
    setLoading(true)
    let query = supabase.from('destinations').select('*')
    if (selectedType) query = query.eq('type', selectedType)
    if (selectedBudget) query = query.eq('budget_level', selectedBudget)
    if (selectedCountry) query = query.eq('country', selectedCountry)
    if (searchQuery) query = query.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,country.ilike.%${searchQuery}%`)
    const { data, error } = await query.order('rating', { ascending: false })
    if (!error) setDestinations(data || [])
    setLoading(false)
  }

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
  }
  const clearAll = () => setSearchParams({})

  return (
    <div className="pt-20 min-h-screen bg-sand-50 dark:bg-sand-950">
      <div className="bg-white dark:bg-sand-900 border-b border-sand-200 dark:border-sand-700 py-8">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-sand-900 dark:text-white mb-6">Explore Destinations</h1>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1"><SearchBar defaultValue={searchQuery} onSearch={(q) => updateFilter('q', q || null)} /></div>
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden btn-outline flex items-center justify-center gap-2"><Filter className="w-4 h-4" />Filters</button>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg', viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-400')}><Grid className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg', viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-400')}><List className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - sidebar on desktop, drawer on mobile */}
          <aside className={cn('md:w-56 shrink-0', showFilters ? 'block' : 'hidden md:block')}>
            <div className="card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sand-900 dark:text-white">Filters</h3>
                {(selectedType || selectedBudget || selectedCountry) && <button onClick={clearAll} className="text-sm text-primary-600">Clear all</button>}
              </div>
              <div>
                <p className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-2">Type</p>
                <div className="space-y-1">
                  <button onClick={() => updateFilter('type', null)} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm', !selectedType ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-600 hover:bg-sand-50')}>All Types</button>
                  {destinationTypes.map(type => (
                    <button key={type} onClick={() => updateFilter('type', type)} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm', selectedType === type ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-600 hover:bg-sand-50')}>{getTypeLabel(type)}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-2">Budget</p>
                <div className="space-y-1">
                  <button onClick={() => updateFilter('budget', null)} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm', !selectedBudget ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-600 hover:bg-sand-50')}>Any Budget</button>
                  {budgetLevels.map(budget => (
                    <button key={budget} onClick={() => updateFilter('budget', budget)} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm', selectedBudget === budget ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-600 hover:bg-sand-50')}>{getBudgetLabel(budget)}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-2">Country</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button onClick={() => updateFilter('country', null)} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm', !selectedCountry ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-600 hover:bg-sand-50')}>All Countries</button>
                  {countries.map(country => (
                    <button key={country} onClick={() => updateFilter('country', country)} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm', selectedCountry === country ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-sand-600 hover:bg-sand-50')}>{country}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><div className="spinner" /></div>
            ) : destinations.length > 0 ? (
              <>
                <p className="text-sm text-sand-600 dark:text-sand-400 mb-4">{destinations.length} destination{destinations.length !== 1 ? 's' : ''}</p>
                <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4')}>
                  {destinations.map(destination => <DestinationCard key={destination.id} destination={destination} />)}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <MapPin className="w-12 h-12 text-sand-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">No destinations found</h3>
                <p className="text-sand-600 dark:text-sand-400 mb-4">Try adjusting your filters</p>
                <button onClick={clearAll} className="btn-primary">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
