import type { Metadata } from 'next'
import { getAbout } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About — Life-Style',
  description: "Learn more about Peter — the developer and English enthusiast behind life·style.",
}

const skillCategories = [
  { label: 'Programming', skills: ['Java', 'JavaScript', 'TypeScript', 'Python'] },
  { label: 'Web', skills: ['Next.js', 'React', 'Node.js', 'Tailwind CSS'] },
  { label: 'English', skills: ['C1 Level', 'Technical Writing', 'English for Devs'] },
]

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile banner */}
        <header className="mb-12 text-center">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white">
            P
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-800">
            Hi, I&apos;m Peter
          </h1>
          <p className="mt-2 font-mono text-violet-400 text-sm">
            Software Developer · English Enthusiast · Lifelong Learner
          </p>
          {/* Social links */}
          {about?.social && (
            <div className="mt-4 flex items-center justify-center gap-4">
              {about.social.github && (
                <a
                  href={about.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-slate-400 hover:text-violet-600 transition-colors"
                >
                  GitHub →
                </a>
              )}
              {about.social.linkedin && (
                <a
                  href={about.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-slate-400 hover:text-violet-600 transition-colors"
                >
                  LinkedIn →
                </a>
              )}
              {about.social.twitter && (
                <a
                  href={about.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-slate-400 hover:text-violet-600 transition-colors"
                >
                  Twitter →
                </a>
              )}
            </div>
          )}
        </header>

        {/* Bio */}
        {about?.bio ? (
          <section className="mb-12">
            <p className="text-slate-600 font-body text-lg leading-relaxed text-center">
              {about.bio}
            </p>
          </section>
        ) : (
          <section className="mb-12">
            <p className="text-slate-600 font-body text-lg leading-relaxed text-center">
              I&apos;m a software developer and English enthusiast. I write about Java,
              JavaScript, Python, AI, and effective English for developers.
            </p>
          </section>
        )}

        {/* Skills */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-slate-800 text-center mb-8">
            What I Work With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {skillCategories.map((cat) => (
              <div
                key={cat.label}
                className="rounded-2xl bg-white border border-slate-200 p-5"
              >
                <h3 className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-3">
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(about?.skills?.filter((s) => cat.skills.includes(s)) ?? cat.skills).map(
                    (skill) => (
                      <span
                        key={skill}
                        className="text-xs font-mono px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-200"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All skills chips */}
        {about?.skills && about.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-slate-800 text-center mb-5">
              All Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {about.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm font-mono px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center">
          <p className="text-slate-500 font-body mb-4">
            Want to see what I&apos;ve been writing about?
          </p>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-body text-sm font-semibold transition-colors"
          >
            Browse the Blog →
          </a>
        </section>
      </div>
    </div>
  )
}
