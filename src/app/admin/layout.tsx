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
    <div className="flex min-h-screen bg-[#070D1A] text-white">
      <Sidebar user={session.user} />
      <main
        className="flex-1 overflow-y-auto p-8"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.04) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      >
        {children}
      </main>
    </div>
  )
}
