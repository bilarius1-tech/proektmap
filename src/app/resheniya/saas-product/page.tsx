import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  Clock3,
  FileCheck2,
  Flag,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { guidedSaasSolution } from "../guided-data";
import SolutionSkillsStack from "@/components/skills/solution-skills-stack";

export const metadata: Metadata = {
  title: "Запустить SaaS-продукт — готовое AI-решение",
  description: "Маршрут запуска SaaS: от проверки проблемы и MVP до работающего продукта, оплаты и первого внешнего результата.",
  alternates: { canonical: "https://proektmap.ru/resheniya/saas-product" },
};

export default function SaasSolutionPage() {
  return (
    <div className="solutions-page">
      <main className="solutions-shell solution-detail">
        <nav className="solution-breadcrumb" aria-label="Навигация">
          <Link href="/resheniya"><ArrowLeft size={15} /> Все решения</Link>
          <span>/</span>
          <span>SaaS-продукт</span>
        </nav>

        <section className="solution-detail-hero">
          <div className="solution-detail-copy">
            <div className="solutions-eyebrow"><Sparkles size={16} /> Готовый инженерный маршрут</div>
            <h1>Запустить SaaS-продукт</h1>
            <p>{guidedSaasSolution.subtitle}: программы, модели, команды и промпты уже выбраны ProektMap.</p>
            <div className="solution-detail-meta">
              <span><Route size={16} /> {guidedSaasSolution.steps.length} готовых шагов</span>
              <span><Clock3 size={16} /> {guidedSaasSolution.duration}</span>
              <span><ShieldCheck size={16} /> Проверяемый результат</span>
            </div>
            <div className="solutions-hero-actions">
              <Link href="/resheniya/saas-product/workspace" className="solutions-button solutions-button-primary">
                Открыть прототип маршрута <ArrowRight size={18} />
              </Link>
              <a href="#route" className="solutions-button solutions-button-secondary">Посмотреть этапы</a>
            </div>
          </div>

          <aside className="solution-result-contract">
            <div className="solution-result-icon"><Flag size={24} /></div>
            <span>Контракт результата</span>
            <h2>Что будет готово на финише</h2>
            <p>{guidedSaasSolution.result}</p>
            <div className="solution-result-checks">
              {[
                "Production URL и основной сценарий",
                "Авторизация и изоляция данных",
                "Тестовая оплата через ЮKassa",
                "Первый внешний сигнал ценности",
              ].map((item) => <div key={item}><Check size={16} /> {item}</div>)}
            </div>
          </aside>
        </section>

        <section className="solution-route-section" id="route" aria-labelledby="route-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Карта выполнения</span>
              <h2 id="route-title">Путь от рабочего места до production</h2>
            </div>
            <p>Каждая точка заканчивается конкретным артефактом и проверкой.</p>
          </div>

          <div className="solution-route">
            {guidedSaasSolution.steps.map((phase, index) => (
              <article className="solution-route-card" key={phase.slug}>
                <div className="solution-route-marker">
                  <span>{index + 1}</span>
                  {index < guidedSaasSolution.steps.length - 1 && <i aria-hidden />}
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

        <SolutionSkillsStack />

        <section className="solution-pack-section" aria-labelledby="pack-title">
          <div className="solution-pack-copy">
            <span className="solutions-kicker">Launch Pack</span>
            <h2 id="pack-title">На выходе остаётся не сертификат, а собранный проект</h2>
            <p>ProektMap заранее выбрал стек и последовательность. После каждого шага остаётся работающий технический результат.</p>
          </div>
          <div className="solution-pack-grid">
            {guidedSaasSolution.steps.map((step) => step.artifact).map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><Boxes size={18} /><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className="solution-context-section" aria-labelledby="context-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Три примера контекста</span>
              <h2 id="context-title">Ресурс появляется только тогда, когда помогает этапу</h2>
            </div>
          </div>
          <div className="solution-context-groups">
            {[guidedSaasSolution.steps[0], guidedSaasSolution.steps[3], guidedSaasSolution.steps[8]].map((phase) => (
              <article className="solution-context-group" key={phase.slug}>
                <span>Шаг {guidedSaasSolution.steps.indexOf(phase) + 1}</span>
                <h3>{phase.title}</h3>
                <p>{phase.goal}</p>
                <div>
                  {phase.references.map((resource) => (
                    <Link href={resource.href} key={`${resource.kind}-${resource.href}`}>
                      {resource.label} <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="solution-final-cta">
          <div>
            <span className="solutions-kicker">Можно начать без проектирования</span>
            <h2>Выполняйте готовые инструкции по порядку</h2>
            <p>Cursor, модели, GitHub, стек, команды и промпты уже выбраны. Пользователь только выполняет и проверяет результат.</p>
          </div>
          <Link href="/resheniya/saas-product/workspace" className="solutions-button solutions-button-primary">
            Открыть рабочую зону <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
