// components/RichEditor.tsx
'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function RichEditor({
  content,
  onChange
}: {
  content: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })
  return <EditorContent editor={editor} className="prose border p-4 rounded bg-white" />
}
