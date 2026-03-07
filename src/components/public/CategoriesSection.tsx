import Link from 'next/link'

const categories = [
  {
    slug: 'IT',
    label: 'IT & Code',
    icon: '💻',
    description: 'Java, JavaScript, Python, AI — programming tutorials and tools.',
    gradient: 'from-violet-500/20 to-violet-900/5',
    border: 'border-violet-500/25',
    hover: 'hover:border-violet-400/50',
    badge: 'bg-violet-500/20 text-violet-300',
  },
  {
    slug: 'ENGLISH',
    label: 'English',
    icon: '📚',
    description: 'Language learning tips, writing skills, and vocabulary for devs.',
    gradient: 'from-cyan-500/20 to-cyan-900/5',
    border: 'border-cyan-500/25',
    hover: 'hover:border-cyan-400/50',
    badge: 'bg-cyan-500/20 text-cyan-300',
  },
  {
    slug: 'LIFESTYLE',
    label: 'Lifestyle',
    icon: '🌿',
    description: 'Productivity systems, habits, mindset, and the art of balance.',
    gradient: 'from-emerald-500/20 to-emerald-900/5',
    border: 'border-emerald-500/25',
    hover: 'hover:border-emerald-400/50',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
]

export default function CategoriesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Explore by Topic
          </h2>
          <p className="mt-3 text-white/50 font-body text-base">
            Three areas I write about — pick what interests you most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className={`group relative flex flex-col p-7 rounded-2xl border bg-gradient-to-b ${cat.gradient} ${cat.border} ${cat.hover} transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}
            >
              <span className="text-4xl mb-4">{cat.icon}</span>
              <span className={`self-start text-xs font-mono px-2 py-0.5 rounded-full mb-3 ${cat.badge}`}>
                {cat.label}
              </span>
              <p className="text-sm text-white/60 font-body leading-relaxed flex-1">
                {cat.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono text-white/30 group-hover:text-white/70 transition-colors">
                View all posts <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
