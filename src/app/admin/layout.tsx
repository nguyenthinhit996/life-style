import { auth } from '@/lib/auth'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Unauthenticated: proxy.ts already redirects non-login routes → /admin/login.
  // For the login page itself, just render it without the shell.
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-[#070D1A] text-white">
      <div className="hidden lg:flex">
        <Sidebar user={session.user} />
      </div>
      <main
        className="flex-1 overflow-y-auto p-4 lg:p-8"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.04) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="lg:hidden mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          Admin panel is optimised for desktop. Some features may be limited on mobile.
        </div>
        {children}
      </main>
    </div>
  )
}
