'use client'
import { useState, useEffect } from 'react'

export default function AdminAboutPage() {
  const [bio, setBio]               = useState('')
  const [skills, setSkills]         = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [github, setGithub]         = useState('')
  const [linkedin, setLinkedin]     = useState('')
  const [twitter, setTwitter]       = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  useEffect(() => {
    fetch('/api/about').then(r => r.json()).then(data => {
      setBio(data.bio ?? '')
      setSkills(data.skills ?? [])
      setGithub(data.social?.github ?? '')
      setLinkedin(data.social?.linkedin ?? '')
      setTwitter(data.social?.twitter ?? '')
    })
  }, [])

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills(prev => [...prev, s])
    setSkillInput('')
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, skills, social: { github, linkedin, twitter } }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const socialFields = [
    { label: 'GitHub', value: github, setter: setGithub },
    { label: 'LinkedIn', value: linkedin, setter: setLinkedin },
    { label: 'Twitter / X', value: twitter, setter: setTwitter },
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold">About Page</h1>
      <div className="flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={5}
            className="input-style resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-400">Skills</label>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add skill…"
              className="input-style flex-1"
            />
            <button onClick={addSkill}
              className="rounded-lg bg-white/10 px-3 text-sm text-slate-300 hover:bg-white/20">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1 rounded-full bg-cyan-500/15 px-3 py-0.5 text-xs text-cyan-300">
                {s}
                <button onClick={() => setSkills(sk => sk.filter(x => x !== s))} className="hover:text-white">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-400">Social Links</label>
          {socialFields.map(({ label, value, setter }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-24 text-sm text-slate-500">{label}</span>
              <input
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder="https://..."
                className="input-style flex-1"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="text-sm text-emerald-400">✓ Saved!</span>}
        </div>

      </div>
    </div>
  )
}
