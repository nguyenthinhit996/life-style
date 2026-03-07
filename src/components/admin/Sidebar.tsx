'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, FilePlus, BookOpen,
  Layers, User, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navSections = [
  {
    label: 'Content',
    items: [
      { href: '/admin',           label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/posts',     label: 'All Posts', icon: FileText },
      { href: '/admin/posts/new', label: 'New Post',  icon: FilePlus },
    ],
  },
  {
    label: 'Manage',
    items: [
      { href: '/admin/series',   label: 'Series',    icon: BookOpen },
      { href: '/admin/chapters', label: 'Chapters',  icon: Layers },
      { href: '/admin/about',    label: 'About Page', icon: User },
    ],
  },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const initials = (user?.name ?? 'P')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className="relative flex w-56 flex-none flex-col border-r border-white/[0.06] bg-[#070D1A] px-3 py-5">

      {/* Brand monogram */}
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 text-[11px] font-black tracking-tight text-white shadow-lg shadow-violet-900/40 select-none">
          LS
        </div>
        <div>
          <p className="font-display text-[13px] font-bold leading-none tracking-tight text-white">Life‑Style</p>
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">Admin Panel</p>
        </div>
      </div>

      {/* Grouped navigation */}
      <nav className="flex flex-1 flex-col gap-5">
        {navSections.map(section => (
          <div key={section.label}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-100',
                      active
                        ? 'text-white'
                        : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300',
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-violet-500" />
                    )}
                    <Icon
                      size={14}
                      strokeWidth={active ? 2.5 : 1.5}
                      className={active ? 'text-violet-400' : 'transition group-hover:text-slate-300'}
                    />
                    <span className={cn(active ? 'font-semibold' : 'font-normal')}>{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <div className="mb-2 flex items-center gap-2.5 px-1">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-[11px] font-bold text-white shadow shadow-violet-900/30">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{user?.name}</p>
            <p className="truncate text-[10px] text-slate-600">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
