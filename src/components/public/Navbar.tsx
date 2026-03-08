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
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight group"
        >
          {/* Animated icon */}
          <span className="relative flex h-7 w-7 items-center justify-center">
            {/* Spinning gradient ring */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 via-cyan-400 to-violet-500 animate-spin [animation-duration:3s] opacity-80 group-hover:opacity-100 transition-opacity" />
            {/* Inner dark circle */}
            <span className="absolute inset-[2px] rounded-full bg-[#0C1524]" />
            {/* Center glyph */}
            <svg
              className="relative z-10 h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              {/* Stylised "L" + pulse dot */}
              <path
                d="M4 3 L4 11 L10 11"
                stroke="url(#ng)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="11" r="1.5" fill="url(#ng)">
                <animate attributeName="r" values="1.5;2.2;1.5" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <defs>
                <linearGradient id="ng" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          </span>
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
