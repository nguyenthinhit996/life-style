import { common, createLowlight } from 'lowlight'
import type { Element, Text, Root } from 'hast'

const lowlight = createLowlight(common)

type HastNode = Element | Text | Root | { type: string; children?: HastNode[]; value?: string; properties?: Record<string, unknown> }

function hastToHtml(node: HastNode): string {
  if (!node) return ''
  if (node.type === 'text') {
    const val = (node as Text).value ?? ''
    return val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
  if (node.type === 'element') {
    const el = node as Element
    const cls = (el.properties?.className as string[] | undefined)?.join(' ') ?? ''
    const inner = (el.children ?? []).map(hastToHtml).join('')
    return `<span${cls ? ` class="${cls}"` : ''}>${inner}</span>`
  }
  if (node.type === 'root') {
    const root = node as Root
    return (root.children ?? []).map(hastToHtml).join('')
  }
  return ''
}

/**
 * Takes TipTap / richer HTML and applies lowlight syntax highlighting
 * to every <pre><code ...>...</code></pre> block.
 */
export function applyHighlighting(html: string): string {
  return html.replace(
    /<pre><code(?: class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_, lang: string | undefined, raw: string = '') => {
      const code = raw
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
      try {
        const tree = lang
          ? lowlight.highlight(lang, code)
          : lowlight.highlightAuto(code)
        const highlighted = hastToHtml(tree as HastNode)
        return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${highlighted}</code></pre>`
      } catch {
        return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${raw}</code></pre>`
      }
    },
  )
}
