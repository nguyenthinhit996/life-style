import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a URL-safe slug from a title
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// e.g. "2026-03-07" → "Mar 7, 2026"
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// Estimate read time from HTML content
export function calcReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
