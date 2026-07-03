import { Link } from 'react-router-dom'
import { MapPin, Star, DollarSign } from 'lucide-react'
import type { Destination } from '../types'
import { cn, getBudgetLabel } from '../lib/utils'

interface Props { destination: Destination; className?: string }

export default function DestinationCard({ destination, className }: Props) {
  return (
    <Link to={`/destination/${destination.id}`} className={cn('card card-hover group', className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', destination.budget_level === 'budget' && 'bg-green-500/90 text-white', destination.budget_level === 'mid-range' && 'bg-amber-500/90 text-white', destination.budget_level === 'luxury' && 'bg-purple-500/90 text-white')}>
            {getBudgetLabel(destination.budget_level)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl font-semibold text-white mb-1 line-clamp-1">{destination.name}</h3>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.city ? `${destination.city}, ` : ''}{destination.country}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-medium text-sand-900 dark:text-white">{destination.rating.toFixed(1)}</span>
            <span className="text-sm text-sand-500">({destination.review_count} reviews)</span>
          </div>
          {destination.average_cost && (
            <div className="flex items-center gap-1 text-sand-600 dark:text-sand-300">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">${destination.average_cost}</span>
              <span className="text-sm">/day</span>
            </div>
          )}
        </div>
        <p className="text-sm text-sand-600 dark:text-sand-400 line-clamp-2">{destination.description}</p>
      </div>
    </Link>
  )
}
