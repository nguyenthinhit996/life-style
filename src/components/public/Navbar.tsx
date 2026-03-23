'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import NavRabbit from '@/components/public/NavRabbit'
const NavGrass = dynamic(() => import('@/components/public/NavGrass'), { ssr: false })

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#F8FAFC]/85 backdrop-blur-md after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-violet-500 after:to-cyan-400 after:opacity-60">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-2xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Life·style
          </span>
        </Link>

        {/* Rabbit track — fills space between logo and nav links */}
        <span className="relative mx-3 hidden h-full flex-1 self-stretch sm:block overflow-visible">
          <NavRabbit />
        </span>

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-1 sm:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-md px-3 py-1.5 text-base font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-slate-500 hover:bg-violet-50 hover:text-violet-600',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="ml-auto rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Grass + flowers strip along the bottom of the navbar */}
      <NavGrass />

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-[#E2E8F0] bg-white px-4 py-3 sm:hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-slate-500 hover:bg-violet-50 hover:text-violet-600',
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
