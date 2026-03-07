'use client'

export default function ShareButton() {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }
  return (
    <button
      onClick={copyLink}
      className="text-sm font-mono text-violet-400 hover:text-violet-300 transition-colors"
    >
      Copy link
    </button>
  )
}
