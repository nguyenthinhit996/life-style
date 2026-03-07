'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#334155]/50 bg-[#0C1524]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            life·style
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-[#7C3AED]/15 text-violet-300'
                  : 'text-[#94A3B8] hover:bg-[#334155]/40 hover:text-[#F8FAFC]',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="rounded-md p-2 text-[#94A3B8] hover:bg-[#334155]/40 hover:text-[#F8FAFC] sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-[#334155]/50 bg-[#0C1524] px-4 py-3 sm:hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-[#7C3AED]/15 text-violet-300'
                  : 'text-[#94A3B8] hover:bg-[#334155]/40 hover:text-[#F8FAFC]',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
