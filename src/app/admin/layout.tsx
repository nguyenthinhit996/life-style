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
    <div className="flex min-h-screen bg-[#0F172A] text-white">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
