'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback, useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, ImageIcon, LinkIcon, Heading1, Heading2, Code, Upload, X } from 'lucide-react';

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ url: string; name: string }[]>([]);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: 'outline: none; min-height: 200px; padding: 12px; font-size: var(--text-xs); line-height: 1.6; font-family: var(--font-body);',
      },
    },
    immediatelyRender: false,
  });

  const addImage = useCallback(() => {
    const url = window.prompt('URL изображения:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('URL ссылки:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const loadMedia = async () => {
    setMediaLoaded(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setMediaFiles(data.files || []);
    } catch { setMediaFiles([]); }
    setMediaOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          setMediaFiles(prev => [...prev, { url: data.url, name: file.name }]);
          if (editor) {
            editor.chain().focus().setImage({ src: data.url }).run();
          }
        }
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const insertMedia = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
      setMediaOpen(false);
    }
  };

  const ToolbarBtn = ({ onClick, children, title, active }: any) => (
    <button type="button" onClick={onClick} title={title}
      style={{
        padding: '4px 8px', border: 'none', borderRadius: 0,
        background: active ? 'var(--color-accent)' : 'transparent',
        color: active ? '#fff' : 'var(--color-text-secondary)',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        fontSize: 12,
      }}>
      {children}
    </button>
  );

  if (!editor) return <div style={{ height: 200, border: '1px solid var(--color-border)', padding: 12 }}>Загрузка редактора...</div>;

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 2, padding: '4px 6px',
        border: '1px solid var(--color-border)', borderBottom: 'none',
        background: 'var(--color-bg-secondary)',
      }}>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Жирный (Ctrl+B)">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Курсив (Ctrl+I)">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Заголовок 1">
          <Heading1 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Заголовок 2">
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Список">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Нумерованный список">
          <ListOrdered size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Код">
          <Code size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Ссылка">
          <LinkIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={addImage} title="Изображение (URL)">
          <ImageIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={loadMedia} title="Медиа-галерея">
          <Upload size={14} /> Галерея
        </ToolbarBtn>
      </div>

      {/* Editor */}
      <div style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-primary)',
      }}>
        <EditorContent editor={editor} />
      </div>

      {/* Media Gallery Modal */}
      {mediaOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
        }} onClick={() => setMediaOpen(false)}>
          <div style={{
            background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
            borderRadius: 0, padding: 'var(--space-xl)', width: 'min(90vw, 700px)',
            maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-l)' }}>
              <h3 style={{ fontSize: 'var(--text-l)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Медиа-галерея</h3>
              <button onClick={() => setMediaOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Upload button */}
            <div style={{ marginBottom: 'var(--space-m)' }}>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload}
                style={{ display: 'none' }} id="media-upload" />
              <label htmlFor="media-upload" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                background: 'var(--color-accent)', color: '#fff', cursor: 'pointer',
                fontWeight: 600, fontSize: 'var(--text-xs)',
              }}>
                <Upload size={14} /> {uploading ? 'Загрузка...' : 'Загрузить изображения'}
              </label>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {mediaFiles.map((f, i) => (
                <div key={i} onClick={() => insertMedia(f.url)} style={{
                  cursor: 'pointer', border: '1px solid var(--color-border)',
                  padding: 4, textAlign: 'center', fontSize: 10,
                }}>
                  <img src={f.url} alt={f.name} style={{
                    width: '100%', height: 80, objectFit: 'cover',
                    marginBottom: 4,
                  }} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </div>
                </div>
              ))}
              {mediaFiles.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 'var(--space-l)', fontSize: 'var(--text-xs)' }}>
                  Нет загруженных файлов
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
