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
import { ecosystemResources, saasSolution } from "../data";

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
            <div className="solutions-eyebrow"><Sparkles size={16} /> Пилот нового формата</div>
            <h1>{saasSolution.title}</h1>
            <p>{saasSolution.description}</p>
            <div className="solution-detail-meta">
              <span><Route size={16} /> {saasSolution.phases.length} этапов</span>
              <span><Clock3 size={16} /> {saasSolution.duration}</span>
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
            <p>{saasSolution.result}</p>
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
              <h2 id="route-title">Путь от проблемы до первого результата</h2>
            </div>
            <p>Каждая точка заканчивается конкретным артефактом и проверкой.</p>
          </div>

          <div className="solution-route">
            {saasSolution.phases.map((phase, index) => (
              <article className="solution-route-card" key={phase.slug}>
                <div className="solution-route-marker">
                  <span>{index + 1}</span>
                  {index < saasSolution.phases.length - 1 && <i aria-hidden />}
                </div>
                <div className="solution-route-content">
                  <div className="solution-route-topline">
                    <span>Этап {index + 1}</span>
                    <span><Clock3 size={14} /> {phase.time}</span>
                  </div>
                  <h3>{phase.title}</h3>
                  <p>{phase.description}</p>
                  <div className="solution-route-outcome">
                    <Target size={17} />
                    <div><span>Результат</span><strong>{phase.outcome}</strong></div>
                  </div>
                  <div className="solution-route-artifact">
                    <FileCheck2 size={16} /> {phase.artifact}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="solution-pack-section" aria-labelledby="pack-title">
          <div className="solution-pack-copy">
            <span className="solutions-kicker">Launch Pack</span>
            <h2 id="pack-title">На выходе остаётся не сертификат, а собранный проект</h2>
            <p>Паспорт растёт после каждого этапа и сохраняет решения, причины, артефакты и результаты проверок.</p>
          </div>
          <div className="solution-pack-grid">
            {[
              "Problem Brief",
              "MVP Contract",
              "Offer & Pricing",
              "User Flow",
              "Architecture Pack",
              "Working Vertical Slice",
              "Payment-ready Build",
              "Launch Pack",
            ].map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><Boxes size={18} /><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className="solution-context-section" aria-labelledby="context-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Связанные ветки</span>
              <h2 id="context-title">Ресурсы появляются в контексте работы</h2>
            </div>
          </div>
          <div className="solution-context-grid">
            {ecosystemResources.map((resource) => (
              <Link href={resource.href} key={resource.href} className="solution-context-card">
                <span>{resource.kind}</span>
                <h3>{resource.label}</h3>
                <p>{resource.description}</p>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </section>

        <section className="solution-final-cta">
          <div>
            <span className="solutions-kicker">Интерактивный каркас</span>
            <h2>Посмотрите, как работает одна текущая миссия</h2>
            <p>Это безопасный UX-прототип без подключения к старой логике Blueprint и базе прогресса.</p>
          </div>
          <Link href="/resheniya/saas-product/workspace" className="solutions-button solutions-button-primary">
            Открыть рабочую зону <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
