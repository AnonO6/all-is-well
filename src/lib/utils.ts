import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getMoodLabel(score: number) {
  if (score <= 2) return 'Struggling'
  if (score <= 4) return 'Low'
  if (score <= 6) return 'Okay'
  if (score <= 8) return 'Good'
  return 'Great'
}

export function getMoodEmoji(score: number) {
  if (score <= 2) return '😔'
  if (score <= 4) return '😕'
  if (score <= 6) return '😐'
  if (score <= 8) return '🙂'
  return '😊'
}
