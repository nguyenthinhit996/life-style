'use client'

import { useEffect, useRef } from 'react'

interface Props {
  html: string
  className?: string
}

export default function ContentRenderer({ html, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const pres = container.querySelectorAll('pre')
    pres.forEach((pre) => {
      // Avoid double-adding
      if (pre.querySelector('[data-copy-btn]')) return

      // Wrap pre in a relative container if not already
      if (pre.parentElement && !pre.parentElement.classList.contains('code-block-wrapper')) {
        const wrapper = document.createElement('div')
        wrapper.className = 'code-block-wrapper relative group/code'
        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(pre)
      }

      const btn = document.createElement('button')
      btn.setAttribute('data-copy-btn', 'true')
      btn.setAttribute('aria-label', 'Copy code')
      btn.className =
        'absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono ' +
        'bg-slate-100 text-slate-500 border border-slate-200 ' +
        'opacity-0 group-hover/code:opacity-100 transition-all duration-150 ' +
        'hover:bg-slate-200 hover:text-slate-700 hover:border-slate-300 cursor-pointer select-none'
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy`

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')
        const text = code?.innerText ?? pre.innerText
        try {
          await navigator.clipboard.writeText(text)
          btn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied!`
          btn.style.color = '#4ade80'
          btn.style.borderColor = 'rgba(74,222,128,0.4)'
          setTimeout(() => {
            btn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy`
            btn.style.color = ''
            btn.style.borderColor = ''
          }, 2000)
        } catch {
          // clipboard not available
        }
      })

      const wrapper = pre.parentElement?.classList.contains('code-block-wrapper')
        ? pre.parentElement
        : pre
      ;(wrapper as HTMLElement).style.position = 'relative'
      wrapper.appendChild(btn)
    })
  }, [html])

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
