"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Code, ImageIcon, Heading1, Heading2, Undo, Redo } from "lucide-react";

export default function RichEditor({ content, onChange, placeholder }: { content: string; onChange: (html: string) => void; placeholder?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder || "Начните писать..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function addImage() {
    const url = prompt("URL изображения:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  function addCodeBlock() {
    editor.chain().focus().toggleCodeBlock().run();
  }

  const btn = (onClick: () => void, icon: any, active = false) => (
    <button onClick={onClick} style={{
      padding: "6px 8px", background: active ? "var(--color-accent-light)" : "transparent",
      border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-s)",
      cursor: "pointer", color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
      display: "flex", alignItems: "center",
    }}>{icon}</button>
  );

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
      <div style={{
        display: "flex", gap: 4, padding: "8px 10px", background: "var(--color-bg-secondary)",
        borderBottom: "1px solid var(--color-border-light)", flexWrap: "wrap",
      }}>
        {btn(() => editor.chain().focus().toggleBold().run(), <Bold size={16} />, editor.isActive("bold"))}
        {btn(() => editor.chain().focus().toggleItalic().run(), <Italic size={16} />, editor.isActive("italic"))}
        <div style={{ width: 1, background: "var(--color-border-light)", margin: "0 4px" }} />
        {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={16} />, editor.isActive("heading", { level: 1 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={16} />, editor.isActive("heading", { level: 2 }))}
        <div style={{ width: 1, background: "var(--color-border-light)", margin: "0 4px" }} />
        {btn(() => editor.chain().focus().toggleBulletList().run(), <List size={16} />, editor.isActive("bulletList"))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={16} />, editor.isActive("orderedList"))}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), <Quote size={16} />, editor.isActive("blockquote"))}
        {btn(addCodeBlock, <Code size={16} />, editor.isActive("codeBlock"))}
        {btn(addImage, <ImageIcon size={16} />)}
        <div style={{ flex: 1 }} />
        {btn(() => editor.chain().focus().undo().run(), <Undo size={14} />)}
        {btn(() => editor.chain().focus().redo().run(), <Redo size={14} />)}
      </div>
      <div style={{ padding: "12px 16px", minHeight: 300 }}>
        <style>{`
          .ProseMirror { outline: none; min-height: 300px; font-size: var(--text-s); line-height: 1.8; }
          .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--color-text-tertiary); float: left; pointer-events: none; height: 0; }
          .ProseMirror h1 { font-size: var(--text-xl); font-weight: 800; margin: 1em 0 0.5em; }
          .ProseMirror h2 { font-size: var(--text-l); font-weight: 700; margin: 1em 0 0.5em; }
          .ProseMirror blockquote { border-left: 3px solid var(--color-accent); padding-left: 16px; color: var(--color-text-secondary); margin: 1em 0; }
          .ProseMirror pre { background: var(--color-bg-secondary); padding: 12px 16px; border-radius: var(--radius-m); font-family: var(--font-mono); font-size: var(--text-xs); overflow-x: auto; }
          .ProseMirror code { background: var(--color-bg-secondary); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.9em; }
          .ProseMirror img { max-width: 100%; border-radius: var(--radius-m); margin: 1em 0; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin: 0.5em 0; }
          .ProseMirror li { margin: 0.25em 0; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
