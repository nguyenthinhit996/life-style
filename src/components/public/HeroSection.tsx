import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-400/8 blur-[100px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #0F172A 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl px-6">
        <span className="inline-block font-mono text-cyan-600 text-sm tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-50">
          Welcome to my world
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight">
          <span className="text-[#0F172A]">Thoughts on </span>
          <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
            Code & English
          </span>
          <br />
          <span className="text-[#0F172A]">and Life</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-500 font-body max-w-2xl mx-auto leading-relaxed">
          A personal blog and tutorial hub where I write about technology, language
          learning, and everyday life. Structured series with a book-like experience.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-body font-semibold transition-colors duration-200 text-sm shadow-lg shadow-violet-500/20"
          >
            Browse Blog →
          </Link>
          <Link
            href="/about"
            className="px-8 py-3.5 rounded-xl border border-slate-200 hover:border-violet-300 text-slate-500 hover:text-violet-600 font-body font-semibold transition-colors duration-200 text-sm"
          >
            About Me
          </Link>
        </div>
      </div>
    </section>
  )
}
