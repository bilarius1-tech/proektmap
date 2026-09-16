"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ShpargalkaPack, ShpargalkaPrompt } from "@/lib/shpargalka";
import { PromptCard, chipStyle } from "./shpargalka-ui";

export default function ShpargalkaCatalog({
  prompts,
  tasks,
  packsForFilter,
}: {
  prompts: ShpargalkaPrompt[];
  tasks: string[];
  packsForFilter?: ShpargalkaPack[];
}) {
  const [query, setQuery] = useState("");
  const [pack, setPack] = useState("all");
  const [task, setTask] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((item) => {
      const inPack = pack === "all" || item.pack === pack;
      const inTask = task === "all" || item.task === task;
      if (!inPack || !inTask) return false;
      if (!q) return true;
      const hay = `${item.title} ${item.task} ${item.body} ${item.why}`.toLowerCase();
      return hay.includes(q);
    });
  }, [prompts, query, pack, task]);

  const isBrowseAll = pack === "all" && task === "all" && !query.trim() && Boolean(packsForFilter);
  const visible = isBrowseAll ? filtered.slice(0, 12) : filtered;

  const visibleTasks = useMemo(() => {
    const source = pack === "all" ? prompts : prompts.filter((item) => item.pack === pack);
    return [...new Set(source.map((item) => item.task))];
  }, [prompts, pack]);

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search
          size={18}
          aria-hidden
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти: резюме, Excel, оффер, баг, лендинг…"
          aria-label="Поиск по шаблонам"
          style={{
            width: "100%",
            padding: "14px 16px 14px 44px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            fontSize: 16,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "var(--font-body)",
            minHeight: 52,
          }}
        />
      </div>

      {packsForFilter && packsForFilter.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: "var(--color-text-tertiary)", marginBottom: 8 }}>
            ПРОФЕССИЯ
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" onClick={() => { setPack("all"); setTask("all"); }} style={chipStyle(pack === "all")}>
              Все · {prompts.length}
            </button>
            {packsForFilter.map((item) => {
              const count = prompts.filter((p) => p.pack === item.slug).length;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => { setPack(item.slug); setTask("all"); }}
                  style={chipStyle(pack === item.slug)}
                >
                  {item.title} · {count}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(!packsForFilter || pack !== "all") && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: "var(--color-text-tertiary)", marginBottom: 8 }}>
            ЗАДАЧА
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" onClick={() => setTask("all")} style={chipStyle(task === "all")}>
              Все задачи
            </button>
            {(packsForFilter ? visibleTasks : tasks).map((item) => (
              <button key={item} type="button" onClick={() => setTask(item)} style={chipStyle(task === item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--color-text-secondary)" }}>
        {isBrowseAll
          ? `Витрина: ${visible.length} из ${filtered.length}. Выберите профессию, задачу или введите поиск — откроется вся подборка.`
          : `Найдено: ${filtered.length}`}
      </p>

      {visible.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "40px 0" }}>
          Ничего не нашлось. Сбросьте фильтр или попробуйте другое слово: «оффер», «формула», «резюме».
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: 16,
          }}
        >
          {visible.map((item) => (
            <PromptCard key={item.id} prompt={item} />
          ))}
        </div>
      )}
    </div>
  );
}
