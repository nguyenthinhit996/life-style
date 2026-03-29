'use client'
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, ReactNodeViewProps } from '@tiptap/react'
import React from 'react'

// ── Editor NodeView (content always visible so author can edit) ───────────────
function DetailsNodeView({ node, updateAttributes }: ReactNodeViewProps) {
  return (
    <NodeViewWrapper
      as="div"
      data-type="details-block"
      className="my-3 overflow-hidden rounded-xl border border-violet-500/40 bg-violet-950/20 not-prose"
    >
      {/* Summary / question row */}
      <div className="flex items-center gap-2 border-b border-violet-500/20 bg-violet-900/30 px-4 py-2.5">
        <svg
          className="h-3.5 w-3.5 shrink-0 text-violet-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <input
          value={(node.attrs.summary as string) ?? 'Click to expand'}
          onChange={e => updateAttributes({ summary: e.target.value })}
          placeholder="Summary / question…"
          className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder-slate-600"
        />
        <span className="shrink-0 rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-violet-300">
          Details
        </span>
      </div>

      {/* Answer / body (always open in editor) */}
      <div className="px-4 py-3 text-slate-300">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}

// ── TipTap Node definition ────────────────────────────────────────────────────
export const DetailsBlock = Node.create({
  name: 'detailsBlock',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      summary: {
        default: 'Click to expand',
        parseHTML: el =>
          (el as HTMLElement).querySelector('summary')?.textContent?.trim() || 'Click to expand',
        renderHTML: () => ({}), // injected manually in renderHTML below
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'details',
        getAttrs: dom => ({
          summary:
            (dom as HTMLElement).querySelector('summary')?.textContent?.trim() ||
            'Click to expand',
        }),
        // use the .details-content div as the content area; fall back to the whole element
        contentElement: (dom: HTMLElement) =>
          dom.querySelector('.details-content') ?? dom,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'details',
      mergeAttributes(HTMLAttributes, { class: 'details-block' }),
      ['summary', {}, node.attrs.summary as string],
      ['div', { class: 'details-content' }, 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DetailsNodeView)
  },
})
