import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../lib/utils'

interface Props { value: number; onChange?: (rating: number) => void; readonly?: boolean; size?: 'sm' | 'md' | 'lg' }

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  const [hoveredRating, setHoveredRating] = useState(0)
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' }
  const currentRating = hoveredRating || value

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button key={rating} type="button" disabled={readonly} className={cn('p-0.5 focus:outline-none', readonly && 'cursor-default', !readonly && 'cursor-pointer')} onMouseEnter={() => !readonly && setHoveredRating(rating)} onMouseLeave={() => !readonly && setHoveredRating(0)} onClick={() => !readonly && onChange?.(rating)}>
          <Star className={cn(sizeClasses[size], 'transition-colors', rating <= currentRating ? 'text-amber-400 fill-amber-400' : 'text-sand-300 dark:text-sand-600')} />
        </button>
      ))}
    </div>
  )
}
