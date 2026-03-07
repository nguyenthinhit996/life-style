'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const toolbarBtn = 'rounded px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30'

export default function RichEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[320px] outline-none prose prose-invert max-w-none p-4',
      },
    },
  })

  // Sync external value changes (e.g. when editing an existing post)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-white/10 bg-white/[0.03] p-2">
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('bold') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('italic') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </button>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('heading', { level: 2 }) && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('heading', { level: 3 }) && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <span className="mx-1 text-white/20">|</span>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('bulletList') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('orderedList') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('blockquote') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          &ldquo; Quote
        </button>
        <span className="mx-1 text-white/20">|</span>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('code') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          `code`
        </button>
        <button type="button"
          className={cn(toolbarBtn, editor.isActive('codeBlock') && 'bg-white/10 text-white')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          ```block
        </button>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
