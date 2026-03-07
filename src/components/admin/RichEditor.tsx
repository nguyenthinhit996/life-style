'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

// Extend Image to support inline width
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: attrs => (attrs.width ? { style: `width:${attrs.width};height:auto` } : {}),
        parseHTML: el => el.style.width || null,
      },
    }
  },
})
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import ImagePickerModal from '@/components/admin/ImagePickerModal'

// ─── Types ────────────────────────────────────────────────────────────────────
interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  onPreview?: () => void
  showPreview?: boolean
}

// ─── Toolbar button helper ─────────────────────────────────────────────────────
function Btn({
  active, disabled, onClick, title, children,
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-7 min-w-[28px] items-center justify-center rounded px-1.5 text-xs font-medium transition',
        active
          ? 'bg-white/15 text-white'
          : 'text-slate-400 hover:bg-white/10 hover:text-white',
        disabled && 'cursor-not-allowed opacity-30',
      )}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="mx-0.5 h-5 w-px bg-white/10" />
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function RichEditor({ value, onChange, onPreview, showPreview }: RichEditorProps) {
  const [linkUrl, setLinkUrl]             = useState('')
  const [showLinkInput, setShowLinkInput]   = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-violet-400 underline' } }),
      ResizableImage.configure({ HTMLAttributes: { class: 'rounded-lg my-4' } }),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[520px] outline-none p-5 text-slate-200 leading-relaxed',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const addLink = useCallback(() => {
    if (!editor || !linkUrl.trim()) return
    editor.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const insertImage = useCallback((url: string, size: 'small' | 'medium' | 'large' | 'full') => {
    if (!editor || !url.trim()) return
    const widths = { small: '30%', medium: '55%', large: '80%', full: '100%' }
    editor.chain().focus().setImage({ src: url, width: widths[size] } as any).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="relative">

      {/* ── Floating Toolbar ── */}
      <div className="sticky top-4 z-10 mb-3">
        <div className="flex flex-wrap items-center gap-0.5 rounded-xl border border-white/[0.12] bg-[#0e1829]/90 px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">

        {/* History */}
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}>
          ↩
        </Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}>
          ↪
        </Btn>

        <Sep />

        {/* Headings */}
        <Btn title="Heading 1" active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </Btn>
        <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Btn>
        <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Btn>

        <Sep />

        {/* Inline marks */}
        <Btn title="Bold (Ctrl+B)" active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </Btn>
        <Btn title="Italic (Ctrl+I)" active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </Btn>
        <Btn title="Underline (Ctrl+U)" active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </Btn>
        <Btn title="Strikethrough" active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </Btn>
        <Btn title="Highlight" active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <span className="rounded bg-yellow-400/30 px-0.5 text-yellow-300">H</span>
        </Btn>
        <Btn title="Inline code" active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          <code className="font-mono">`c`</code>
        </Btn>

        <Sep />

        {/* Alignment */}
        <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          ≡
        </Btn>
        <Btn title="Align center" active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          ≡
        </Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          ≡
        </Btn>

        <Sep />

        {/* Lists & blocks */}
        <Btn title="Bullet list" active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </Btn>
        <Btn title="Numbered list" active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </Btn>
        <Btn title="Block quote" active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </Btn>
        <Btn title="Code block" active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <code className="font-mono text-[10px]">{'</>'}</code>
        </Btn>
        <Btn title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ─
        </Btn>

        <Sep />

        {/* Link */}
        <Btn title="Insert link" active={editor.isActive('link') || showLinkInput}
          onClick={() => { setShowImagePicker(false); setShowLinkInput(v => !v) }}>
          🔗
        </Btn>

        {/* Image */}
        <Btn title="Insert image" active={showImagePicker}
          onClick={() => { setShowLinkInput(false); setShowImagePicker(true) }}>
          🖼
        </Btn>

        {/* Clear formatting */}
        <Btn title="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          ✕
        </Btn>

        {/* Preview toggle */}
        {onPreview && (
          <>
            <Sep />
            <button
              type="button"
              onClick={onPreview}
              className={cn(
                'flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-semibold transition',
                showPreview
                  ? 'bg-violet-600 text-white'
                  : 'border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white',
              )}
            >
              {showPreview ? '✎ Edit' : '👁 Preview'}
            </button>
          </>
        )}
        </div>{/* end floating inner */}

        {/* ── Link input popup ── */}
        {showLinkInput && (
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0e1829]/95 px-3 py-2 shadow-lg backdrop-blur-md">
            <input
              autoFocus
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addLink(); if (e.key === 'Escape') setShowLinkInput(false) }}
              placeholder="https://..."
              className="flex-1 rounded bg-white/5 px-3 py-1 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button type="button" onClick={addLink}
              className="rounded bg-violet-600 px-3 py-1 text-xs font-semibold text-white hover:bg-violet-500">
              Insert
            </button>
            <button type="button" onClick={() => setShowLinkInput(false)}
              className="rounded px-2 py-1 text-xs text-slate-500 hover:text-white">
              Cancel
            </button>
          </div>
        )}

        {/* ── Image picker modal ── (rendered via portal below) */}
      </div>{/* end sticky wrapper */}

      {/* ── Editor area ── */}
      <div className="overflow-clip rounded-xl border border-white/[0.08] bg-[#0C1524]">
        <EditorContent editor={editor} />

        {/* ── Word count ── */}
        <div className="flex justify-end border-t border-white/[0.05] px-4 py-1.5">
          <span className="text-[11px] text-slate-700">
            {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>

      {/* ── Image picker modal ── */}
      {showImagePicker && (
        <ImagePickerModal
          onInsert={insertImage}
          onClose={() => setShowImagePicker(false)}
        />
      )}

    </div>
  )
}
