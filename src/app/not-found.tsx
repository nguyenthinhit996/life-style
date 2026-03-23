import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent select-none">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-800">
          Page not found
        </h1>
        <p className="mt-3 text-slate-500 font-body">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-body font-medium transition-colors text-sm"
          >
            ← Back to Home
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 rounded-xl border border-slate-200 hover:border-violet-300 text-slate-500 hover:text-violet-600 font-body font-medium transition-colors text-sm"
          >
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
