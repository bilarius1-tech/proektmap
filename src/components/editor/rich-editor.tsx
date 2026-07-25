"use client";

import React, { useState } from "react"; import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Code, ImageIcon, Heading1, Heading2, Heading3, Heading4, Undo, Redo, Video, Upload } from "lucide-react";

export default function RichEditor({ content, onChange, placeholder }: { content: string; onChange: (html: string) => void; placeholder?: string }) {
  
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{url:string,name:string}[]>([]);

  async function loadMedia() {
    try { const res = await fetch("/api/admin/media"); const data = await res.json(); setMediaFiles(data.files || []); } catch { setMediaFiles([]); }
  }

  function insertMedia(url: string) { editor?.chain().focus().setImage({ src: url }).run(); setMediaOpen(false); }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Image.configure({ allowBase64: false }),
      Youtube.configure({ width: 840, height: 472 }),
      Placeholder.configure({ placeholder: placeholder || "Начните писать..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  async function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) editor.chain().focus().setImage({ src: data.url }).run();
    };
    input.click();
  }

  function addVideo() {
    const url = prompt("Ссылка на видео (YouTube):");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url, width: 840, height: 472 }).run();
  }

  function addCodeBlock() { editor.chain().focus().toggleCodeBlock().run(); }

  const btn = (onClick: () => void, icon: any, active = false, title = "") => (
    <button onClick={onClick} title={title} style={{
      padding: "6px 8px", background: active ? "var(--color-accent-light)" : "transparent",
      border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-s)",
      cursor: "pointer", color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
      display: "flex", alignItems: "center",
    }}>{icon}</button>
  );

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
      <div style={{
        display: "flex", gap: 2, padding: "8px 10px", background: "var(--color-bg-secondary)",
        borderBottom: "1px solid var(--color-border-light)", flexWrap: "wrap", alignItems: "center",
      }}>
        {btn(() => editor.chain().focus().undo().run(), <Undo size={14} />, false, "Отменить")}
        {btn(() => editor.chain().focus().redo().run(), <Redo size={14} />, false, "Повторить")}
        <div style={{ width: 1, height: 20, background: "var(--color-border-light)", margin: "0 4px" }} />
        {btn(() => editor.chain().focus().toggleBold().run(), <Bold size={16} />, editor.isActive("bold"), "Жирный")}
        {btn(() => editor.chain().focus().toggleItalic().run(), <Italic size={16} />, editor.isActive("italic"), "Курсив")}
        <div style={{ width: 1, height: 20, background: "var(--color-border-light)", margin: "0 4px" }} />
        {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={16} />, editor.isActive("heading", { level: 1 }), "Заголовок 1")}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={16} />, editor.isActive("heading", { level: 2 }), "Заголовок 2")}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={16} />, editor.isActive("heading", { level: 3 }), "Заголовок 3")}
        {btn(() => editor.chain().focus().toggleHeading({ level: 4 }).run(), <Heading4 size={16} />, editor.isActive("heading", { level: 4 }), "Заголовок 4")}
        <div style={{ width: 1, height: 20, background: "var(--color-border-light)", margin: "0 4px" }} />
        {btn(() => editor.chain().focus().toggleBulletList().run(), <List size={16} />, editor.isActive("bulletList"), "Маркированный список")}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={16} />, editor.isActive("orderedList"), "Нумерованный список")}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), <Quote size={16} />, editor.isActive("blockquote"), "Цитата")}
        {btn(addCodeBlock, <Code size={16} />, editor.isActive("codeBlock"), "Блок кода")}
        <div style={{ width: 1, height: 20, background: "var(--color-border-light)", margin: "0 4px" }} />
        {btn(addImage, <ImageIcon size={16} />, false, "Загрузить фото")}
        {btn(addVideo, <Video size={16} />, false, "Вставить видео")}
      </div>
      <div style={{ padding: "12px 16px", minHeight: 300 }}>
        <style>{`
          .ProseMirror { outline: none; min-height: 300px; font-size: var(--text-s); line-height: 1.8; }
          .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--color-text-tertiary); float: left; pointer-events: none; height: 0; }
          .ProseMirror h1 { font-size: var(--text-xxl); font-weight: 800; margin: 1.2em 0 0.5em; }
          .ProseMirror h2 { font-size: var(--text-xl); font-weight: 700; margin: 1.1em 0 0.4em; }
          .ProseMirror h3 { font-size: var(--text-l); font-weight: 600; margin: 1em 0 0.3em; }
          .ProseMirror h4 { font-size: var(--text-m); font-weight: 600; margin: 0.9em 0 0.2em; }
          .ProseMirror blockquote { border-left: 3px solid var(--color-accent); padding: 8px 16px; color: var(--color-text-secondary); margin: 1em 0; background: var(--color-accent-light); border-radius: 0 var(--radius-s) var(--radius-s) 0; }
          .ProseMirror pre { background: #1e1e2e; color: #cdd6f4; padding: 16px; border-radius: var(--radius-m); font-family: var(--font-mono); font-size: var(--text-xs); overflow-x: auto; margin: 1em 0; }
          .ProseMirror code { background: var(--color-bg-secondary); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.9em; }
          .ProseMirror pre code { background: none; padding: 0; font-size: inherit; }
          .ProseMirror img { max-width: 100%; border-radius: var(--radius-m); margin: 1em 0; cursor: pointer; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin: 0.5em 0; }
          .ProseMirror li { margin: 0.25em 0; }
          .ProseMirror .video-embed { margin: 1em 0; }
          .ProseMirror .video-embed iframe { width: 100%; aspect-ratio: 16/9; border-radius: var(--radius-m); }
        `}</style>
        <EditorContent editor={editor} />
      </div>

      {mediaOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }} onClick={() => setMediaOpen(false)}>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", width: 600, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <h3 style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)", margin: 0 }}>Медиа</h3>
              <button onClick={() => setMediaOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>x</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
              {mediaFiles.map((f, i) => (
                <div key={i} onClick={() => insertMedia(f.url)} style={{ cursor: "pointer", border: "1px solid var(--color-border)", padding: 4, textAlign: "center" }}>
                  <img src={f.url} alt={f.name} style={{ width: "100%", height: 60, objectFit: "cover", marginBottom: 4 }} />
                  <div style={{ fontSize: 9 }}>{f.name}</div>
                </div>
              ))}
              {mediaFiles.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "var(--space-l)", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>Нет файлов</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
