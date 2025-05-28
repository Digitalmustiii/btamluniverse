import React, { useRef } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapUnderline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family'
import TiptapSubscript from '@tiptap/extension-subscript'
import TiptapSuperscript from '@tiptap/extension-superscript'
import Link from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import { Node } from '@tiptap/core'
import type { Level } from '@tiptap/extension-heading'

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Link2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon, 
  Image as ImageIcon,
  Undo, Redo, Upload, Video as VideoIcon, Youtube
} from 'lucide-react'

// Custom Video Extension
const VideoExtension = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      width: {
        default: '100%',
      },
      height: {
        default: 'auto',
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['video', HTMLAttributes]
  },
  
  addCommands() {
    return {
      setVideo: (options: Record<string, unknown>) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})

// Custom YouTube Extension
const YouTubeExtension = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: 560,
      },
      height: {
        default: 315,
      },
      frameborder: {
        default: "0",
      },
      allow: {
        default: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      },
      allowfullscreen: {
        default: true,
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
      },
      {
        tag: 'iframe[src*="youtu.be"]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['iframe', HTMLAttributes]
  },
  
  addCommands() {
    return {
      setYouTube: (options: Record<string, unknown>) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: Record<string, unknown>) => ReturnType
    }
    youtube: {
      setYouTube: (options: Record<string, unknown>) => ReturnType
    }
  }
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  onFileUpload?: (file: File) => Promise<string> // Returns URL after upload
}

const MenuBar = ({ editor, onFileUpload }: { editor: Editor | null, onFileUpload?: (file: File) => Promise<string> }) => {
  const imageInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null
  }

  const addImageFromUrl = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addVideoFromUrl = () => {
    const url = window.prompt('Enter video URL:')
    if (url) {
      // Use insertContent directly instead of custom command
      editor.chain().focus().insertContent({
        type: 'video',
        attrs: { src: url, controls: true }
      }).run()
    }
  }

  const addYouTubeVideo = () => {
    const url = window.prompt('Enter YouTube URL:')
    if (url) {
      // Convert YouTube URL to embed format
      let embedUrl = url
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }
      
      // Use insertContent directly instead of custom command
      editor.chain().focus().insertContent({
        type: 'youtube',
        attrs: {
          src: embedUrl,
          width: 560,
          height: 315,
          frameborder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: true
        }
      }).run()
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onFileUpload) {
      try {
        const url = await onFileUpload(file)
        editor.chain().focus().setImage({ src: url }).run()
      } catch {
        alert('Failed to upload image')
      }
    } else if (file) {
      // Fallback: create object URL for local preview
      const url = URL.createObjectURL(file)
      editor.chain().focus().setImage({ src: url }).run()
    }
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      {/* Hidden file input for images only */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Headers */}
      <select
        className="px-2 py-1 border border-gray-300 rounded text-sm"
        onChange={(e) => {
          const raw = parseInt(e.target.value, 10)
          const level = raw as Level

          if (raw === 0) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().toggleHeading({ level }).run()
          }
        }}
        value={
          editor.isActive('heading', { level: 1 }) ? 1 :
          editor.isActive('heading', { level: 2 }) ? 2 :
          editor.isActive('heading', { level: 3 }) ? 3 :
          editor.isActive('heading', { level: 4 }) ? 4 :
          editor.isActive('heading', { level: 5 }) ? 5 :
          editor.isActive('heading', { level: 6 }) ? 6 : 0
        }
      >
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
        <option value={4}>Heading 4</option>
        <option value={5}>Heading 5</option>
        <option value={6}>Heading 6</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Basic formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <Bold size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <Italic size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <UnderlineIcon size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 rounded ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text color */}
      <input
        type="color"
        onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
        className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
        title="Text Color"
      />

      {/* Highlight */}
      <input
        type="color"
        onInput={(e) => editor.chain().focus().setHighlight({ color: (e.target as HTMLInputElement).value }).run()}
        className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
        title="Highlight Color"
      />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Subscript/Superscript */}
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`p-1 rounded ${editor.isActive('subscript') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <SubscriptIcon size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`p-1 rounded ${editor.isActive('superscript') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <SuperscriptIcon size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <List size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <ListOrdered size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <AlignLeft size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <AlignCenter size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <AlignRight size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-1 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <AlignJustify size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Blockquote & Code */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <Quote size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1 rounded ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
      >
        <Code size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Link */}
      <button
        onClick={addLink}
        className={`p-1 rounded ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
        type="button"
        title="Add Link"
      >
        <Link2 size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Image options - kept both URL and upload */}
      <div className="flex items-center gap-1">
        <button
          onClick={addImageFromUrl}
          className="p-1 rounded hover:bg-gray-100"
          type="button"
          title="Add Image from URL"
        >
          <ImageIcon size={16} />
        </button>
        
        <button
          onClick={() => imageInputRef.current?.click()}
          className="p-1 rounded hover:bg-gray-100"
          type="button"
          title="Upload Image"
        >
          <Upload size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Video options - removed upload, kept URL and YouTube embedding */}
      <div className="flex items-center gap-1">
        <button
          onClick={addVideoFromUrl}
          className="p-1 rounded hover:bg-gray-100"
          type="button"
          title="Embed Video from URL"
        >
          <VideoIcon size={16} />
        </button>
        
        <button
          onClick={addYouTubeVideo}
          className="p-1 rounded hover:bg-gray-100"
          type="button"
          title="Embed YouTube Video"
        >
          <Youtube size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1 rounded hover:bg-gray-100"
        disabled={!editor.can().undo()}
        type="button"
      >
        <Undo size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1 rounded hover:bg-gray-100"
        disabled={!editor.can().redo()}
        type="button"
      >
        <Redo size={16} />
      </button>
    </div>
  )
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your article...",
  height = "400px",
  onFileUpload
}: RichTextEditorProps) {
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapUnderline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      TiptapSubscript,
      TiptapSuperscript,
      Link.configure({
        openOnClick: false,
      }),
      TiptapImage,
      VideoExtension,
      YouTubeExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <MenuBar editor={editor} onFileUpload={onFileUpload} />
      <div 
        style={{ minHeight: height }}
        className="p-4"
      >
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          className="min-h-full"
        />
      </div>
      
      <style jsx global>{`
        .ProseMirror {
          min-height: ${height};
          font-size: 16px;
          line-height: 1.6;
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        .ProseMirror h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        .ProseMirror h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; }
        .ProseMirror h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; }
        .ProseMirror h6 { font-size: 0.75em; font-weight: bold; margin: 1.67em 0; }
        
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          margin: 1.5em 0;
          padding-left: 1em;
          color: #6b7280;
        }
        
        .ProseMirror pre {
          background: #f3f4f6;
          color: #374151;
          font-family: 'JetBrainsMono', 'SFMono-Regular', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }
        
        .ProseMirror code {
          background-color: #f3f4f6;
          color: #374151;
          font-size: 0.9em;
          padding: 0.25em 0.4em;
          border-radius: 0.25rem;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }
        
        .ProseMirror li {
          margin: 0.25em 0;
        }
        
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 0.5rem;
        }
        
        .ProseMirror video {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 0.5rem;
        }
        
        .ProseMirror iframe {
          max-width: 100%;
          margin: 1em 0;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  )
}