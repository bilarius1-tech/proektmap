"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Highlight from "@tiptap/extension-highlight";


import {
  Bold, Italic,  List, ListOrdered, Quote, Code,
  ImageIcon, Heading1, Heading2, Heading3, Video, Upload, Table as TableIcon,
  Strikethrough, Highlighter, LinkIcon, AlignLeft, AlignCenter, AlignRight,
  X, Check, Search, Grid
} from "lucide-react";

export default function RichEditor({ content, onChange, placeholder }: {
  content: string; onChange: (html: string) => void; placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ url: string; name: string }[]>([]);
  const [mediaSearch, setMediaSearch] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ width: 840, height: 472, modestBranding: true }),
      TableRow, TableHeader, TableCell, Table.configure({ resizable: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      
      
      Placeholder.configure({ placeholder: placeholder || "Начните писать..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return <div style={{ padding: 20, border: "1px solid var(--color-border)" }}>Загрузка...</div>;

  // ---- IMAGE UPLOAD ----
  async function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          editor?.chain().focus().setImage({ src: data.url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
        }
      } catch {}
      setUploading(false);
    };
    input.click();
  }

  // ---- MEDIA LIBRARY ----
  async function loadMedia() {
    try { const r = await fetch("/api/admin/media"); const d = await r.json(); setMediaFiles(d.files || []); } catch {}
    setMediaOpen(true);
  }
  function insertMedia(url: string) { editor?.chain().focus().setImage({ src: url }).run(); setMediaOpen(false); }
  const filteredMedia = mediaFiles.filter(f => f.name.toLowerCase().includes(mediaSearch.toLowerCase()) || f.url.includes(mediaSearch));

  // ---- VIDEO ----
  function addVideo() {
    const url = prompt("Ссылка на видео (YouTube, VK, Rutube):");
    if (!url) return;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    } else {
      let embed = url;
      if (url.includes("rutube.ru")) { const m = url.match(/video\/([\w]+)/); embed = "https://rutube.ru/play/embed/" + (m ? m[1] : url.split("/").pop()); }
      else if (url.includes("vk.com/video") || url.includes("vkvideo.ru")) {
        embed = url.replace("/video", "/video_ext").replace("vkvideo.ru", "vk.com");
        if (!embed.includes("oid=")) embed += (embed.includes("?") ? "&" : "?") + "oid=-1";
      }
      editor?.chain().focus().insertContent('<div class="video-embed"><iframe src="' + embed + '" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;"></iframe></div>').run();
    }
  }

  // ---- TABLE ----
  function addTable() { editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); }

  // ---- LINK ----
  function addLink() { const u = prompt("URL:"); if (u) editor?.chain().focus().setLink({ href: u }).run(); }
  function removeLink() { editor?.chain().focus().unsetLink().run(); }

  // ---- ALIGNMENT ----
  const align = (dir: string) => editor?.chain().focus().setTextAlign(dir).run();

  const Btn = ({ onClick, icon, active, title, disabled }: any) => (
    <button onClick={onClick} title={title} disabled={disabled} type="button" style={{
      padding: "6px 8px", border: "1px solid var(--color-border)", borderRadius: 0,
      background: active ? "var(--color-accent-light)" : "transparent",
      color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
      display: "flex", alignItems: "center",
    }}>{icon}</button>
  );

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: 0, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 2, padding: "8px 10px", background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)", flexWrap: "wrap", alignItems: "center" }}>
        <Btn onClick={() => editor?.chain().focus().toggleBold().run()} icon={<Bold size={16} />} active={editor?.isActive("bold")} title="Жирный (Ctrl+B)" />
        <Btn onClick={() => editor?.chain().focus().toggleItalic().run()} icon={<Italic size={16} />} active={editor?.isActive("italic")} title="Курсив" />
        <Btn onClick={() => editor?.chain().focus().toggleStrike().run()} icon={<Strikethrough size={16} />} active={editor?.isActive("strike")} title="Зачёркнутый" />
        <Btn onClick={() => editor?.chain().focus().toggleHighlight().run()} icon={<Highlighter size={16} />} active={editor?.isActive("highlight")} title="Выделить" />
        <div style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} icon={<Heading1 size={16} />} active={editor?.isActive("heading", { level: 1 })} title="H1" />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} icon={<Heading2 size={16} />} active={editor?.isActive("heading", { level: 2 })} title="H2" />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} icon={<Heading3 size={16} />} active={editor?.isActive("heading", { level: 3 })} title="H3" />
        <div style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={() => editor?.chain().focus().toggleBulletList().run()} icon={<List size={16} />} active={editor?.isActive("bulletList")} title="Список" />
        <Btn onClick={() => editor?.chain().focus().toggleOrderedList().run()} icon={<ListOrdered size={16} />} active={editor?.isActive("orderedList")} title="Нумерованный" />
        <Btn onClick={() => editor?.chain().focus().toggleBlockquote().run()} icon={<Quote size={16} />} active={editor?.isActive("blockquote")} title="Цитата" />
        <Btn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} icon={<Code size={16} />} active={editor?.isActive("codeBlock")} title="Код" />
        <div style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={addLink} icon={<LinkIcon size={16} />} active={editor?.isActive("link")} title="Ссылка" />
        <Btn onClick={removeLink} icon={<X size={14} />} active={false} title="Убрать ссылку" />
        <div style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={() => align("left")} icon={<AlignLeft size={16} />} active={editor?.isActive({ textAlign: "left" })} title="Слева" />
        <Btn onClick={() => align("center")} icon={<AlignCenter size={16} />} active={editor?.isActive({ textAlign: "center" })} title="По центру" />
        <Btn onClick={() => align("right")} icon={<AlignRight size={16} />} active={editor?.isActive({ textAlign: "right" })} title="Справа" />
        <div style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={addImage} icon={uploading ? <span style={{ fontSize: 10 }}>...</span> : <ImageIcon size={16} />} active={false} title={uploading ? "Загрузка..." : "Загрузить фото"} />
        <Btn onClick={loadMedia} icon={<Grid size={16} />} active={false} title="Медиагалерея" />
        <Btn onClick={addVideo} icon={<Video size={16} />} active={false} title="Вставить видео" />
        <Btn onClick={addTable} icon={<TableIcon size={16} />} active={false} title="Вставить таблицу" />
      </div>

      {/* Editor */}
      <div style={{ padding: "12px 16px", minHeight: 400 }}>
        <style>{`
          .ProseMirror { outline: none; min-height: 400px; font-size: var(--text-s); line-height: 1.8; font-family: var(--font-body); }
          .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--color-text-tertiary); pointer-events: none; float: left; height: 0; }
          .ProseMirror img { max-width: 100%; height: auto; margin: 1em 0; cursor: pointer; }
          .ProseMirror img.ProseMirror-selectednode { outline: 2px solid var(--color-accent); }
          .ProseMirror iframe { max-width: 100%; }
          .ProseMirror h1 { font-size: var(--text-xxl); font-weight: 800; margin: 1.2em 0 0.5em; }
          .ProseMirror h2 { font-size: var(--text-xl); font-weight: 700; margin: 1.1em 0 0.4em; }
          .ProseMirror h3 { font-size: var(--text-l); font-weight: 600; margin: 1em 0 0.3em; }
          .ProseMirror blockquote { border-left: 3px solid var(--color-accent); padding: 8px 16px; color: var(--color-text-secondary); margin: 1em 0; background: var(--color-accent-light); }
          .ProseMirror pre { background: #1e1e2e; color: #cdd6f4; padding: 16px; font-size: var(--text-xs); overflow-x: auto; margin: 1em 0; }
          .ProseMirror code { background: var(--color-bg-secondary); padding: 2px 6px; font-size: 0.9em; }
          .ProseMirror pre code { background: none; padding: 0; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin: 0.5em 0; }
          .ProseMirror li { margin: 0.25em 0; }
          .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          .ProseMirror th { background: var(--color-bg-secondary); border: 1px solid var(--color-border); padding: 8px 12px; font-weight: 600; text-align: left; }
          .ProseMirror td { border: 1px solid var(--color-border); padding: 8px 12px; }
          .ProseMirror mark { background: #fef08a; padding: 0 2px; border-radius: 2px; }
          .ProseMirror a { color: var(--color-accent); text-decoration: underline; }
          .ProseMirror .video-embed { margin: 1em 0; }
          .ProseMirror .video-embed iframe { width: 100%; aspect-ratio: 16/9; border-radius: var(--radius-m); }
        `}</style>
        <EditorContent editor={editor} />
      </div>

      {/* Media Gallery Modal */}
      {mediaOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }} onClick={() => setMediaOpen(false)}>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", width: "min(90vw, 750px)", maxHeight: "85vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <h3 style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)", margin: 0 }}>Медиагалерея</h3>
              <button onClick={() => setMediaOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-text-secondary)" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-m)" }}>
              <div style={{ flex: 1, display: "flex", gap: 0 }}>
                <input value={mediaSearch} onChange={e => setMediaSearch(e.target.value)} placeholder="Поиск по имени файла..." style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", outline: "none", borderRadius: 0 }} />
                <span style={{ padding: "8px 10px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderLeft: "none", color: "var(--color-text-tertiary)" }}><Search size={14} /></span>
              </div>
              <button onClick={addImage} style={{ padding: "8px 16px", background: "var(--color-accent)", color: "#fff", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", borderRadius: 0, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                <Upload size={14} /> Загрузить
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
              {filteredMedia.map((f, i) => (
                <div key={i} onClick={() => insertMedia(f.url)} style={{ cursor: "pointer", border: "1px solid var(--color-border)", padding: 4, textAlign: "center", background: "var(--color-bg-primary)", borderRadius: 0 }}>
                  <img src={f.url} alt={f.name} style={{ width: "100%", height: 80, objectFit: "cover", marginBottom: 4, borderRadius: 0 }} />
                  <div style={{ fontSize: 9, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                </div>
              ))}
              {filteredMedia.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>
                  {mediaSearch ? "Ничего не найдено" : "Нет файлов. Загрузите первое фото кнопкой выше."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
