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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import Color from '@tiptap/extension-color'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { DetailsBlock } from '@/components/admin/extensions/DetailsBlock'

const lowlight = createLowlight(common)
import { TextStyle } from '@tiptap/extension-text-style'
import { useEffect, useState, useCallback, useRef, useId } from 'react'
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
  const [linkUrl, setLinkUrl]               = useState('')
  const [showLinkInput, setShowLinkInput]   = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showTableMenu, setShowTableMenu]   = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const tableMenuRef   = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-violet-400 underline' } }),
      ResizableImage.configure({ HTMLAttributes: { class: 'rounded-lg my-4' } }),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
      DetailsBlock,
      Table.configure({ resizable: false, HTMLAttributes: { class: 'border-collapse w-full my-4' } }),
      TableRow,
      TableHeader,
      TableCell,
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

  // Close color picker when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
    }
    if (showColorPicker) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showColorPicker])

  // Close table menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setShowTableMenu(false)
      }
    }
    if (showTableMenu) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showTableMenu])

  const COLORS = [
    { label: 'Default',   value: '' },
    { label: 'White',     value: '#ffffff' },
    { label: 'Slate',     value: '#94a3b8' },
    { label: 'Red',       value: '#f87171' },
    { label: 'Orange',    value: '#fb923c' },
    { label: 'Yellow',    value: '#facc15' },
    { label: 'Green',     value: '#4ade80' },
    { label: 'Teal',      value: '#2dd4bf' },
    { label: 'Blue',      value: '#60a5fa' },
    { label: 'Violet',    value: '#a78bfa' },
    { label: 'Pink',      value: '#f472b6' },
    { label: 'Rose',      value: '#fb7185' },
  ]

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
        <Btn title="Highlight text (marker)" active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <span className="relative inline-flex items-center font-bold italic">
            <span className="relative z-10 px-0.5 text-[11px]">A</span>
            <span className="absolute bottom-0 left-0 right-0 h-[5px] rounded-sm bg-yellow-400/70" />
          </span>
        </Btn>

        {/* Text color */}
        <div ref={colorPickerRef} className="relative">
          <button
            type="button"
            title="Text color"
            onClick={() => setShowColorPicker(v => !v)}
            className={cn(
              'flex h-7 min-w-[28px] flex-col items-center justify-center rounded px-1.5 transition',
              showColorPicker ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white',
            )}
          >
            <span className="text-xs font-bold leading-none">A</span>
            <span
              className="mt-0.5 h-[3px] w-4 rounded-full"
              style={{ backgroundColor: (editor.getAttributes('textStyle').color as string) || '#ffffff' }}
            />
          </button>
          {showColorPicker && (
            <div className="absolute left-0 top-full z-20 mt-1.5 w-48 grid grid-cols-4 gap-2.5 rounded-2xl border border-white/[0.12] bg-[#0e1829] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    if (!c.value) editor.chain().focus().unsetColor().run()
                    else editor.chain().focus().setColor(c.value).run()
                    setShowColorPicker(false)
                  }}
                  className={cn(
                    'h-6 w-6 rounded-lg border-2 transition hover:scale-110 hover:border-white/50',
                    c.value === '' ? 'border-white/20 bg-gradient-to-br from-slate-600 to-slate-800' : 'border-white/10',
                  )}
                  style={c.value ? { backgroundColor: c.value } : {}}
                />
              ))}
            </div>
          )}
        </div>

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
        </Btn>        {editor.isActive('codeBlock') && (
          <select
            value={editor.getAttributes('codeBlock').language || ''}
            onChange={e =>
              editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value || null }).run()
            }
            className="h-7 rounded-lg border border-white/10 bg-[#0e1829] px-1.5 text-xs text-slate-300 outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">auto</option>
            {['javascript','typescript','jsx','tsx','python','java','go','rust','c','cpp','bash','sh','css','html','json','sql','markdown','yaml','php','ruby','swift','kotlin'].map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        )}        <Btn title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ─
        </Btn>
        <Btn
          title="Details / collapsible answer block"
          active={editor.isActive('detailsBlock')}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'detailsBlock',
                attrs: { summary: 'Click to expand' },
                content: [{ type: 'paragraph' }],
              })
              .run()
          }
        >
          <span className="text-[11px]">▶ Details</span>
        </Btn>

        <Sep />

        {/* Table */}
        <div ref={tableMenuRef} className="relative">
          <Btn title="Table" active={editor.isActive('table') || showTableMenu}
            onClick={() => setShowTableMenu(v => !v)}>
            <span className="text-[11px]">⊞ Table</span>
          </Btn>
          {showTableMenu && (
            <div className="absolute left-0 top-full z-30 mt-1.5 min-w-[180px] rounded-2xl border border-white/[0.12] bg-[#0e1829] py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              {[{
                label: 'Insert table (3×3)',
                action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
              }, {
                label: 'Add row above',
                action: () => editor.chain().focus().addRowBefore().run(),
              }, {
                label: 'Add row below',
                action: () => editor.chain().focus().addRowAfter().run(),
              }, {
                label: 'Delete row',
                action: () => editor.chain().focus().deleteRow().run(),
              }, {
                label: 'Add column before',
                action: () => editor.chain().focus().addColumnBefore().run(),
              }, {
                label: 'Add column after',
                action: () => editor.chain().focus().addColumnAfter().run(),
              }, {
                label: 'Delete column',
                action: () => editor.chain().focus().deleteColumn().run(),
              }, {
                label: 'Merge cells',
                action: () => editor.chain().focus().mergeCells().run(),
              }, {
                label: 'Split cell',
                action: () => editor.chain().focus().splitCell().run(),
              }, {
                label: 'Toggle header row',
                action: () => editor.chain().focus().toggleHeaderRow().run(),
              }, {
                label: 'Delete table',
                action: () => editor.chain().focus().deleteTable().run(),
                danger: true,
              }].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => { item.action(); setShowTableMenu(false) }}
                  className={cn(
                    'w-full px-4 py-1.5 text-left text-xs transition hover:bg-white/5',
                    (item as { danger?: boolean }).danger ? 'text-red-400 hover:text-red-300' : 'text-slate-300 hover:text-white',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

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
