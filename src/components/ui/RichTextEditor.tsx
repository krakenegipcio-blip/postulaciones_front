import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Code } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Escribe aquí...', disabled = false }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor outline-none min-h-[150px] max-h-[300px] overflow-y-auto p-4 text-sm text-slate-200',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className={`border border-slate-600 rounded-lg bg-slate-700/50 flex flex-col ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-600 bg-slate-800 rounded-t-lg">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
        >
          <Italic size={14} />
        </button>
        <div className="w-px h-4 bg-slate-600 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
        >
          <ListOrdered size={14} />
        </button>
        <div className="w-px h-4 bg-slate-600 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('codeBlock') ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
        >
          <Code size={14} />
        </button>
      </div>
      <EditorContent editor={editor} className="flex-1 cursor-text bg-slate-800/30 rounded-b-lg" />
    </div>
  );
}
