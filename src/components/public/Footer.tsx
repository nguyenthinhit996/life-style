import Link from 'next/link'
import { Github } from 'lucide-react'

const footerLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#334155]/50 bg-[#0C1524]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text font-display text-base font-bold tracking-tight text-transparent">
              life·style
            </span>
            <p className="text-xs text-[#94A3B8]">
              Tutorials on Code &amp; Language
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-4">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
            >
              <Github size={16} />
            </a>
          </nav>
        </div>

        <p className="mt-6 text-center text-xs text-[#475569]">
          © {new Date().getFullYear()} life·style · Built with Next.js
        </p>
      </div>
    </footer>
  )
}
