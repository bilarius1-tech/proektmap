import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  Clock3,
  FileCheck2,
  Palette,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { guidedDesignerAgentSolution } from "../designer-agent-guided-data";
import PlatipomiruCallout from "@/components/resheniya/platipomiru-callout";

export const metadata: Metadata = {
  title: "AI-агенты для дизайнера — путь от брифа до Figma | ProektMap",
  description:
    "Путь дизайнера: агент превращает бриф в живой прототип, читает Figma через MCP, собирает экраны внутри дизайн-системы и находит расхождения макетов.",
  alternates: { canonical: "https://proektmap.ru/resheniya/designer-agent" },
};

const mediaItems = [
  {
    src: "/uploads/designer-agent/01-agent-figma-system.png",
    caption: "Агент читает Figma: компоненты, стили, токены — и собирает новые экраны внутри вашей системы.",
    alt: "Агент подключён к Figma и видит структуру файла",
  },
  {
    src: "/uploads/designer-agent/02-figma-audit-list.png",
    caption: "Обратная задача: аудит макетов на расхождения с системой списком за минуты.",
    alt: "Список расхождений макетов с дизайн-системой",
  },
  {
    src: "/uploads/designer-agent/03-prototype-flow.png",
    caption: "Живой прототип из брифа — логика проверяется до макета.",
    alt: "Живой прототип из текстового брифа",
  },
  {
    src: "/uploads/designer-agent/04-prototype-figma-layers.png",
    caption: "Проверенное решение переносится в Figma слоями — внутри системы.",
    alt: "Перенос прототипа в Figma слоями",
  },
  {
    src: "/uploads/designer-agent/05-mcp-scheme.png",
    caption: "MCP — способ подключить агента к Figma и другим сервисам.",
    alt: "Схема подключения агента через MCP",
  },
  {
    src: "/uploads/designer-agent/06-claude-vs-codex.png",
    caption: "Два рабочих варианта: Claude Code (сила) или Codex (доступность).",
    alt: "Сравнение Claude Code и Codex",
  },
  {
    src: "/uploads/designer-agent/07-skills-import.png",
    caption: "Чужие скиллы не копируют целиком — полезное переносят в свой файл правил.",
    alt: "Перенос полезного из чужого скилла в свой",
  },
];

const launchArtifacts = guidedDesignerAgentSolution.steps.map((step) => step.artifact);

export default function DesignerAgentSolutionPage() {
  return (
    <div className="solutions-page">
      <main className="solutions-shell solution-detail">
        <nav className="solution-breadcrumb" aria-label="Навигация">
          <Link href="/resheniya"><ArrowLeft size={15} /> Все решения</Link>
          <span>/</span>
          <span>AI-агенты для дизайнера</span>
        </nav>

        <div style={{ marginBottom: 20 }}>
          <PlatipomiruCallout compact />
        </div>

        <section className="solution-detail-hero">
          <div className="solution-detail-copy">
            <div className="solutions-eyebrow"><Sparkles size={16} /> Путь дизайнера · агент на компьютере</div>
            <h1>AI-агенты для дизайнера</h1>
            <p>
              {guidedDesignerAgentSolution.subtitle}. Не генератор картинок и не чат в браузере —
              агент читает ваши файлы, работает в Figma через MCP и собирает живой прототип.
            </p>
            <div className="solution-detail-meta">
              <span><Route size={16} /> {guidedDesignerAgentSolution.steps.length} готовых шагов</span>
              <span><Clock3 size={16} /> {guidedDesignerAgentSolution.duration}</span>
              <span><ShieldCheck size={16} /> Логика проверяется до макета</span>
            </div>
            <div className="solutions-hero-actions">
              <Link href="/resheniya/designer-agent/workspace" className="solutions-button solutions-button-primary">
                Начать маршрут <ArrowRight size={18} />
              </Link>
              <a href="#route" className="solutions-button solutions-button-secondary">Посмотреть этапы</a>
            </div>
          </div>

          <aside className="solution-result-contract">
            <div className="solution-result-icon"><Palette size={24} /></div>
            <span>Контракт результата</span>
            <h2>Что будет готово на финише</h2>
            <p>{guidedDesignerAgentSolution.result}</p>
            <div className="solution-result-checks">
              {[
                "Живой прототип продукта из текстового брифа",
                "Агент подключён к Figma через MCP",
                "Новые экраны собираются внутри вашей дизайн-системы",
                "Аудит макетов на расхождения — списком за минуты",
              ].map((item) => <div key={item}><Check size={16} /> {item}</div>)}
            </div>
          </aside>
        </section>

        {/* Демо: из брифа в живой прототип */}
        <section className="solution-route-section" aria-labelledby="demo-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Демо в работе</span>
              <h2 id="demo-title">Из брифа — в живой прототип</h2>
            </div>
            <p>На входе текстовое описание продукта, на выходе — интерфейс, который открывается в браузере: переходы, состояния, формы, пустые экраны.</p>
          </div>
          <video
            controls
            preload="metadata"
            src="/uploads/designer-agent-demo.mp4"
            style={{ width: "100%", maxWidth: 860, display: "block", margin: "0 auto", border: "1px solid var(--color-border)", background: "#0f172a", borderRadius: 8 }}
          >
            Ваш браузер не поддерживает видео.
          </video>
        </section>

        {/* Медиа-галерея */}
        <section className="solution-route-section" aria-labelledby="media-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Как это выглядит</span>
              <h2 id="media-title">Скриншоты из реальной работы</h2>
            </div>
            <p>Три примера из работы дизайнера с агентом и ключевые понятия маршрута.</p>
          </div>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {mediaItems.map((m) => (
              <figure
                key={m.src}
                style={{ margin: 0, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", overflow: "hidden" }}
              >
                <img
                  src={m.src}
                  alt={m.alt}
                  loading="lazy"
                  style={{ width: "100%", display: "block", background: "#fff" }}
                />
                <figcaption style={{ padding: "10px 12px", fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
                  {m.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="solution-route-section" id="route" aria-labelledby="designer-route-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Карта выполнения</span>
              <h2 id="designer-route-title">Путь дизайнера с AI-агентом</h2>
            </div>
            <p>Каждый шаг содержит готовую рекомендацию, промпт для агента и понятную проверку результата.</p>
          </div>

          <div className="solution-route">
            {guidedDesignerAgentSolution.steps.map((phase, index) => (
              <article className="solution-route-card" key={phase.slug}>
                <div className="solution-route-marker">
                  <span>{index + 1}</span>
                  {index < guidedDesignerAgentSolution.steps.length - 1 && <i aria-hidden />}
                </div>
                <div className="solution-route-content">
                  <div className="solution-route-topline">
                    <span>Шаг {index + 1}</span>
                    <span><Clock3 size={14} /> {phase.duration}</span>
                  </div>
                  <h3>{phase.title}</h3>
                  <p>{phase.explanation}</p>
                  <div className="solution-route-outcome">
                    <Target size={17} />
                    <div><span>Результат</span><strong>{phase.goal}</strong></div>
                  </div>
                  <div className="solution-route-artifact">
                    <FileCheck2 size={16} /> {phase.artifact}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="solution-pack-section" aria-labelledby="designer-pack-title">
          <div className="solution-pack-copy">
            <span className="solutions-kicker">Что остаётся у вас</span>
            <h2 id="designer-pack-title">Процесс, а не разовый эксперимент</h2>
            <p>Среда агента, подключение к Figma, дизайн-система в файлах и скиллы под ваши задачи — дальше каждая новая задача идёт быстрее.</p>
          </div>
          <div className="solution-pack-grid">
            {launchArtifacts.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><Boxes size={18} /><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className="solution-cta-card">
          <div>
            <h2>Готовы попробовать агента в своей работе?</h2>
            <p>Переходите в рабочую зону: разверните среду, подключите Figma и соберите первый живой прототип из своего брифа.</p>
          </div>
          <Link href="/resheniya/designer-agent/workspace" className="solutions-button solutions-button-primary">
            Открыть рабочую зону <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
