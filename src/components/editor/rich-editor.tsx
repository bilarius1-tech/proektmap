"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Code, ImageIcon, Heading1, Heading2, Heading3, Video, Upload } from "lucide-react";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

export default function RichEditor({ content, onChange, placeholder }: { content: string; onChange: (html: string) => void; placeholder?: string }) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Image.configure({ HTMLAttributes: { class: "blog-img" } }),
      Youtube.configure({ width: 840, height: 472, modestBranding: true }),
      Placeholder.configure({ placeholder: placeholder || "..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return <div style={{ padding: 20, border: "1px solid var(--color-border)", color: "var(--color-text-tertiary)" }}>Загрузка редактора...</div>;

  async function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          const alt = prompt("Alt-текст для фото (для SEO):", file.name.replace(/\.[^.]+$/, ""));
          editor?.chain().focus().setImage({ src: data.url, alt: alt || "" }).run();
        }
      } catch (err) { console.error("Upload failed", err); }
      setUploading(false);
    };
    input.click();
  }

  function addVideo() {
    const url = prompt("Ссылка на видео (YouTube, VK, Rutube):");
    if (!url) return;
    
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      editor?.chain().focus().setYoutubeVideo({ src: url, width: 840, height: 472 }).run();
    } else {
      let embed = url;
      if (url.includes("rutube.ru")) {
        const m = url.match(/video\/([\w]+)/);
        embed = "https://rutube.ru/play/embed/" + (m ? m[1] : url.split("/").pop());
      } else if (url.includes("vk.com/video") || url.includes("vkvideo.ru")) {
        embed = url.replace("/video", "/video_ext").replace("vkvideo.ru", "vk.com");
        if (!embed.includes("oid=")) embed += (embed.includes("?") ? "&" : "?") + "oid=-1";
      }
      editor?.chain().focus().insertContent('<div class="video-embed"><iframe src="' + embed + '" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;"></iframe></div>').run();
    }
  }

  const Btn = ({ onClick, icon, active, title }: any) => (
    <button onClick={onClick} title={title} type="button" style={{
      padding: "6px 8px", border: "1px solid var(--color-border)", borderRadius: 0,
      background: active ? "var(--color-accent-light)" : "transparent",
      color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
      cursor: "pointer", display: "flex", alignItems: "center",
    }}>{icon}</button>
  );

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: 0, overflow: "hidden" }}>
      <div style={{
        display: "flex", gap: 2, padding: "8px 10px", background: "var(--color-bg-secondary)",
        borderBottom: "1px solid var(--color-border)", flexWrap: "wrap",
      }}>
        <Btn onClick={() => editor?.chain().focus().toggleBold().run()} icon={<Bold size={16} />} active={editor?.isActive("bold")} title="Жирный" />
        <Btn onClick={() => editor?.chain().focus().toggleItalic().run()} icon={<Italic size={16} />} active={editor?.isActive("italic")} title="Курсив" />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} icon={<Heading1 size={16} />} active={editor?.isActive("heading", { level: 1 })} title="H1" />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} icon={<Heading2 size={16} />} active={editor?.isActive("heading", { level: 2 })} title="H2" />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} icon={<Heading3 size={16} />} active={editor?.isActive("heading", { level: 3 })} title="H3" />
        <Btn onClick={() => editor?.chain().focus().toggleBulletList().run()} icon={<List size={16} />} active={editor?.isActive("bulletList")} title="Список" />
        <Btn onClick={() => editor?.chain().focus().toggleOrderedList().run()} icon={<ListOrdered size={16} />} active={editor?.isActive("orderedList")} title="Нумерованный" />
        <Btn onClick={() => editor?.chain().focus().toggleBlockquote().run()} icon={<Quote size={16} />} active={editor?.isActive("blockquote")} title="Цитата" />
        <Btn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} icon={<Code size={16} />} active={editor?.isActive("codeBlock")} title="Код" />
        <div style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={addImage} icon={uploading ? <span style={{ fontSize: 10 }}>...</span> : <ImageIcon size={16} />} active={false} title={uploading ? "Загрузка..." : "Загрузить фото"} />
        <Btn onClick={addVideo} icon={<Video size={16} />} active={false} title="Вставить видео" />
      </div>
      <div style={{ padding: "12px 16px", minHeight: 300 }}>
        <style>{`
          .ProseMirror { outline: none; min-height: 300px; font-size: var(--text-s); line-height: 1.8; font-family: var(--font-body); }
          .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--color-text-tertiary); pointer-events: none; float: left; height: 0; }
          .ProseMirror img { max-width: 100%; height: auto; margin: 1em 0; }
          .ProseMirror iframe { max-width: 100%; }
          .ProseMirror h1 { font-size: var(--text-xxl); font-weight: 800; }
          .ProseMirror h2 { font-size: var(--text-xl); font-weight: 700; }
          .ProseMirror h3 { font-size: var(--text-l); font-weight: 600; }
          .ProseMirror blockquote { border-left: 3px solid var(--color-accent); padding: 8px 16px; color: var(--color-text-secondary); margin: 1em 0; background: var(--color-accent-light); border-radius: 0; }
          .ProseMirror pre { background: #1e1e2e; color: #cdd6f4; padding: 16px; font-size: var(--text-xs); overflow-x: auto; margin: 1em 0; }
          .ProseMirror code { background: var(--color-bg-secondary); padding: 2px 6px; font-size: 0.9em; }
          .ProseMirror pre code { background: none; padding: 0; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 24px; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
