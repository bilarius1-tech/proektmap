"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Quote, Code, ImageIcon, Heading1, Heading2, Heading3,
  Video, Upload, X, Search, Grid, Table as TableIcon, Sparkles, Wand2,
  Strikethrough, Highlighter, LinkIcon, AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";

export default function RichEditor({ content, onChange, placeholder }: {
  content: string; onChange: (html: string) => void; placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ url: string; name: string }[]>([]);
  const [mediaSearch, setMediaSearch] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Image.configure({}),
      Youtube.configure({ width: 840, height: 472, modestBranding: true }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener" } }),
      Placeholder.configure({ placeholder: placeholder || "Начните писать..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return <div style={{ padding: 20, border: "1px solid var(--color-border)", color: "var(--color-text-tertiary)" }}>Загрузка редактора...</div>;

  // IMAGE: upload from computer
  async function addImage() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      setUploading(true);
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) editor?.chain().focus().setImage({ src: data.url }).run();
      setUploading(false);
    };
    input.click();
  }

  // MEDIA GALLERY
  async function openMedia() {
    const res = await fetch("/api/admin/media"); const data = await res.json();
    setMediaFiles(data.files || []); setMediaSearch(""); setMediaOpen(true);
  }
  function pickMedia(url: string) { editor?.chain().focus().setImage({ src: url }).run(); setMediaOpen(false); }
  const filtered = mediaFiles.filter(f => !mediaSearch || f.name.toLowerCase().includes(mediaSearch.toLowerCase()));

  // VIDEO
  function addVideo() {
    const url = prompt("Ссылка на видео (YouTube, VK, Rutube):"); if (!url) return;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    } else {
      let embed = url;
      if (url.includes("rutube.ru")) { const m = url.match(/video\/([\w]+)/); embed = "https://rutube.ru/play/embed/" + (m ? m[1] : ""); }
      else if (url.includes("vk.com/video") || url.includes("vkvideo.ru")) {
        if (!embed.includes("/video_ext")) embed = embed.replace("/video", "/video_ext");
        if (embed.includes("vkvideo.ru")) embed = embed.replace("vkvideo.ru", "vk.com");
        // Extract oid and id from URL like video-219351616_456239242
        const vkMatch = embed.match(/video_ext-?(\d+)_(\d+)/);
        if (vkMatch) {
          embed = "https://vk.com/video_ext.php?oid=-" + vkMatch[1] + "&id=" + vkMatch[2] + "&hd=2";
        }
        if (!embed.includes("oid=")) embed += (embed.includes("?") ? "&" : "?") + "oid=-1";
      }
      editor?.chain().focus().insertContent('<div class="video-embed"><iframe src="' + embed + '" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;"></iframe></div>').run();
    }
  }

  // TABLE
  function addTable() { editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); }

  // LINK
  function addLink() { const u = prompt("URL:"); if (u) editor?.chain().focus().setLink({ href: u }).run(); }


  async function aiEnhance(mode: string) {
    const text = editor?.getText();
    if (!text || text.length < 30) { alert("Текст слишком короткий"); return; }
    try {
      const res = await fetch("/api/blog/ai-enhance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, mode }) });
      const data = await res.json();
      if (data.html) { editor?.commands.setContent(data.html); onChange(data.html); }
    } catch { alert("Ошибка AI"); }
  }


  const Btn = ({ onClick, icon, active, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} type="button" style={{
      padding: "6px 8px", border: "1px solid var(--color-border)", borderRadius: 0,
      background: active ? "var(--color-accent-light)" : "transparent",
      color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
      display: "flex", alignItems: "center",
    }}>{icon}</button>
  );

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: 0, overflow: "hidden" }}>
      {/* TOOLBAR */}
      <div style={{ display: "flex", gap: 2, padding: "8px 10px", background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)", flexWrap: "wrap", alignItems: "center" }}>
        <Btn onClick={() => editor?.chain().focus().toggleBold().run()} icon={<Bold size={16} />} active={editor?.isActive("bold")} />
        <Btn onClick={() => editor?.chain().focus().toggleItalic().run()} icon={<Italic size={16} />} active={editor?.isActive("italic")} />
        <Btn onClick={() => editor?.chain().focus().toggleUnderline().run()} icon={<UnderlineIcon size={16} />} active={editor?.isActive("underline")} />
        <Btn onClick={() => editor?.chain().focus().toggleStrike().run()} icon={<Strikethrough size={16} />} active={editor?.isActive("strike")} />
        <Btn onClick={() => editor?.chain().focus().toggleHighlight().run()} icon={<Highlighter size={16} />} active={editor?.isActive("highlight")} />
        <span style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} icon={<Heading1 size={16} />} active={editor?.isActive("heading", { level: 1 })} />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} icon={<Heading2 size={16} />} active={editor?.isActive("heading", { level: 2 })} />
        <Btn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} icon={<Heading3 size={16} />} active={editor?.isActive("heading", { level: 3 })} />
        <span style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={() => editor?.chain().focus().toggleBulletList().run()} icon={<List size={16} />} active={editor?.isActive("bulletList")} />
        <Btn onClick={() => editor?.chain().focus().toggleOrderedList().run()} icon={<ListOrdered size={16} />} active={editor?.isActive("orderedList")} />
        <Btn onClick={() => editor?.chain().focus().toggleBlockquote().run()} icon={<Quote size={16} />} active={editor?.isActive("blockquote")} />
        <Btn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} icon={<Code size={16} />} active={editor?.isActive("codeBlock")} />
        <span style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={addLink} icon={<LinkIcon size={16} />} active={editor?.isActive("link")} />
        <Btn onClick={() => editor?.chain().focus().unsetLink().run()} icon={<X size={14} />} active={false} />
        <span style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={() => editor?.chain().focus().setTextAlign("left").run()} icon={<AlignLeft size={16} />} active={editor?.isActive({ textAlign: "left" })} />
        <Btn onClick={() => editor?.chain().focus().setTextAlign("center").run()} icon={<AlignCenter size={16} />} active={editor?.isActive({ textAlign: "center" })} />
        <Btn onClick={() => editor?.chain().focus().setTextAlign("right").run()} icon={<AlignRight size={16} />} active={editor?.isActive({ textAlign: "right" })} />
        <span style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <Btn onClick={addImage} icon={uploading ? <span style={{ fontSize: 10 }}>...</span> : <ImageIcon size={16} />} active={false} disabled={uploading} />
        <Btn onClick={openMedia} icon={<Grid size={16} />} active={false} />
        <Btn onClick={addVideo} icon={<Video size={16} />} active={false} />
        <Btn onClick={addTable} icon={<TableIcon size={16} />} active={false} />
        <span style={{ width: 1, height: 20, background: "var(--color-border)", margin: "0 4px" }} />
        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", padding: "0 4px" }}>AI</span>
        <Btn onClick={() => aiEnhance("reformat")} icon={<Wand2 size={16} />} active={false} />
        <Btn onClick={() => aiEnhance("expand")} icon={<Sparkles size={16} />} active={false} />
      </div>

      {/* EDITOR */}
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

      {/* MEDIA MODAL */}
      {mediaOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }} onClick={() => setMediaOpen(false)}>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", width: "min(90vw, 750px)", maxHeight: "85vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
              <h3 style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)", margin: 0 }}>Медиагалерея</h3>
              <button onClick={() => setMediaOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-text-secondary)" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-m)" }}>
              <div style={{ flex: 1, display: "flex" }}>
                <input value={mediaSearch} onChange={e => setMediaSearch(e.target.value)} placeholder="Поиск..." style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", outline: "none", borderRadius: 0 }} />
                <span style={{ padding: "8px 10px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderLeft: "none", color: "var(--color-text-tertiary)" }}><Search size={14} /></span>
              </div>
              <button onClick={addImage} style={{ padding: "8px 16px", background: "var(--color-accent)", color: "#fff", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", borderRadius: 0, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}><Upload size={14} /> Загрузить</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
              {filtered.map((f, i) => (
                <div key={i} onClick={() => pickMedia(f.url)} style={{ cursor: "pointer", border: "1px solid var(--color-border)", padding: 4, textAlign: "center" }}>
                  <img src={f.url} alt={f.name} style={{ width: "100%", height: 80, objectFit: "cover", marginBottom: 4 }} />
                  <div style={{ fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-text-secondary)" }}>{f.name}</div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>{mediaSearch ? "Ничего не найдено" : "Нет файлов. Загрузите через кнопку выше."}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
