import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}
export function getBudgetLabel(budget: string): string {
  const labels: Record<string, string> = { budget: 'Budget-friendly', 'mid-range': 'Mid-range', luxury: 'Luxury' }
  return labels[budget] || budget
}
export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = { beach: 'Beach', mountain: 'Mountain', heritage: 'Heritage', adventure: 'Adventure', city: 'City', countryside: 'Countryside' }
  return labels[type] || type
}
