"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

const CATEGORIES = ["LLM","Image","Voice","Code","Business","OpenSource","Assistant","Agent"];
const PRICING = ["free","freemium","paid"];

const lab: any = { display:"block",fontSize:10,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:4 };
const inp: any = { width:"100%",padding:"8px 10px",border:"1px solid var(--color-border)",fontSize:"var(--text-xs)",outline:"none",borderRadius:"var(--radius-s)",background:"var(--color-bg-primary)",color:"var(--color-text-primary)",boxSizing:"border-box" };

export default function RussianAIAdmin({ data }: { data: any[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(data);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditing({ name:"",slug:"",company:"",category:"LLM",description:"",website:"",pricing:"free",hasApi:false,isOpenSource:false,rating:5,isPublished:true,sortOrder:0,logo:"" });
  }
  function startEdit(p: any) { setEditing({ ...p }); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing.name) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/admin/russian-ai", { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(editing) });
    setSaving(false); setEditing(null); router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить проект?")) return;
    await fetch("/api/admin/russian-ai?id=" + id, { method:"DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize:"var(--text-xl)",fontWeight:800,margin:0 }}>🇷🇺 Российский AI</h1>
          <p style={{ color:"var(--color-text-tertiary)",fontSize:"var(--text-s)" }}>{projects.length} проектов</p>
        </div>
        <button onClick={startNew} className="btn btn-primary"><Plus size={16} /> Добавить</button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",gap:"var(--space-m)" }}>
        {projects.map(p => (
          <div key={p.id} style={{ padding:"var(--space-m)",background:"var(--color-bg-primary)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-m)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"var(--space-s)" }}>
              <div>
                <div style={{ fontWeight:700,fontSize:"var(--text-s)" }}>{p.name}</div>
                <div style={{ fontSize:11,color:"var(--color-text-tertiary)" }}>{p.company} · {p.category}</div>
              </div>
              <div style={{ display:"flex",gap:4 }}>
                <button onClick={() => startEdit(p)} className="btn btn-ghost" style={{ padding:4 }}><Edit size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-ghost" style={{ padding:4,color:"var(--color-error)" }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              <span style={{ fontSize:10,padding:"2px 6px",background:"var(--color-bg-secondary)",borderRadius:"var(--radius-s)" }}>{p.pricing}</span>
              {p.hasApi && <span style={{ fontSize:10,padding:"2px 6px",background:"var(--color-accent-light)",borderRadius:"var(--radius-s)",color:"var(--color-accent)" }}>API</span>}
              {p.isOpenSource && <span style={{ fontSize:10,padding:"2px 6px",background:"#fef3c7",borderRadius:"var(--radius-s)",color:"#92400e" }}>OSS</span>}
              <span style={{ fontSize:10,padding:"2px 6px" }}>★{p.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={() => setEditing(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"var(--color-bg-primary)",borderRadius:"var(--radius-xl)",width:"90%",maxWidth:560,padding:"var(--space-xl)",boxShadow:"var(--shadow-l)",maxHeight:"90vh",overflowY:"auto" }}>
            <h2 style={{ fontSize:"var(--text-l)",fontWeight:800,marginBottom:"var(--space-l)" }}>{editing.id ? "Редактировать" : "Новый проект"}</h2>
            <form onSubmit={handleSave} style={{ display:"flex",flexDirection:"column",gap:"var(--space-s)" }}>
              <div><label style={lab}>Название</label><input style={inp} value={editing.name} onChange={e => setEditing({...editing,name:e.target.value})} required /></div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--space-s)" }}>
                <div><label style={lab}>Slug</label><input style={inp} value={editing.slug} onChange={e => setEditing({...editing,slug:e.target.value})} /></div>
                <div><label style={lab}>Компания</label><input style={inp} value={editing.company} onChange={e => setEditing({...editing,company:e.target.value})} /></div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--space-s)" }}>
                <div><label style={lab}>Категория</label><select style={inp} value={editing.category} onChange={e => setEditing({...editing,category:e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label style={lab}>Цена</label><select style={inp} value={editing.pricing} onChange={e => setEditing({...editing,pricing:e.target.value})}>{PRICING.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label style={lab}>Рейтинг</label><input style={inp} type="number" min={1} max={10} value={editing.rating} onChange={e => setEditing({...editing,rating:parseInt(e.target.value)||5})} /></div>
              </div>
              <div><label style={lab}>Описание</label><textarea style={{...inp,minHeight:60}} value={editing.description||""} onChange={e => setEditing({...editing,description:e.target.value})} /></div>
              <div><label style={lab}>Сайт</label><input style={inp} value={editing.website||""} onChange={e => setEditing({...editing,website:e.target.value})} /></div>
              <div><label style={lab}>Лого (URL)</label><input style={inp} value={editing.logo||""} onChange={e => setEditing({...editing,logo:e.target.value})} /></div>
              <div style={{ display:"flex",gap:"var(--space-m)",alignItems:"center" }}>
                <label style={{ display:"flex",alignItems:"center",gap:6,fontSize:"var(--text-xs)",cursor:"pointer" }}><input type="checkbox" checked={editing.hasApi} onChange={e => setEditing({...editing,hasApi:e.target.checked})} /> API</label>
                <label style={{ display:"flex",alignItems:"center",gap:6,fontSize:"var(--text-xs)",cursor:"pointer" }}><input type="checkbox" checked={editing.isOpenSource} onChange={e => setEditing({...editing,isOpenSource:e.target.checked})} /> Open Source</label>
                <label style={{ display:"flex",alignItems:"center",gap:6,fontSize:"var(--text-xs)",cursor:"pointer" }}><input type="checkbox" checked={editing.isPublished} onChange={e => setEditing({...editing,isPublished:e.target.checked})} /> Опубликован</label>
              </div>
              <div style={{ display:"flex",gap:"var(--space-s)" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "..." : "Сохранить"}</button>
                <button type="button" onClick={() => setEditing(null)} className="btn btn-secondary">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
