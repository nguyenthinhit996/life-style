'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, FilePlus, BookOpen,
  Layers, User, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/posts',     label: 'All Posts',  icon: FileText },
  { href: '/admin/posts/new', label: 'New Post',   icon: FilePlus },
  { href: '/admin/series',    label: 'Series',     icon: BookOpen },
  { href: '/admin/chapters',  label: 'Chapters',   icon: Layers },
  { href: '/admin/about',     label: 'About Page', icon: User },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col justify-between border-r border-white/10 bg-[#0F172A] px-4 py-6">
      {/* Logo */}
      <div>
        <div className="mb-8 px-2 text-xl font-bold text-white">
          Life‑Style <span className="text-violet-400">Admin</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                  active
                    ? 'border-l-2 border-violet-500 bg-violet-500/10 text-violet-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User + logout */}
      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <span className="mt-1 inline-block rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
            Admin
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
