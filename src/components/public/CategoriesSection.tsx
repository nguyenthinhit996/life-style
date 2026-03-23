import Link from 'next/link'

const categories = [
  {
    slug: 'IT',
    label: 'IT & Code',
    icon: '💻',
    description: 'Java, JavaScript, Python, AI — programming tutorials and tools.',
    gradient: 'from-violet-50 to-white',
    border: 'border-slate-200',
    hover: 'hover:border-violet-300',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    slug: 'ENGLISH',
    label: 'English',
    icon: '📚',
    description: 'Language learning tips, writing skills, and vocabulary for devs.',
    gradient: 'from-cyan-50 to-white',
    border: 'border-slate-200',
    hover: 'hover:border-cyan-300',
    badge: 'bg-cyan-100 text-cyan-700',
  },
  {
    slug: 'LIFESTYLE',
    label: 'Lifestyle',
    icon: '🌿',
    description: 'Productivity systems, habits, mindset, and the art of balance.',
    gradient: 'from-emerald-50 to-white',
    border: 'border-slate-200',
    hover: 'hover:border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-700',
  },
]

export default function CategoriesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F172A]">
            Explore by Topic
          </h2>
          <p className="mt-3 text-slate-500 font-body text-base">
            Three areas I write about — pick what interests you most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className={`group relative flex flex-col p-7 rounded-2xl border bg-gradient-to-b ${cat.gradient} ${cat.border} ${cat.hover} transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/8`}
            >
              <span className="text-4xl mb-4">{cat.icon}</span>
              <span className={`self-start text-xs font-mono px-2 py-0.5 rounded-full mb-3 ${cat.badge}`}>
                {cat.label}
              </span>
              <p className="text-sm text-slate-500 font-body leading-relaxed flex-1">
                {cat.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 group-hover:text-violet-600 transition-colors">
                View all posts <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
