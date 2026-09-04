import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Boxes,
  Check,
  Clock3,
  FileCheck2,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Layers,
} from "lucide-react";
import { guidedAvitoSolution } from "../avito-guided-data";
import ArsenalBridgePanel from "@/components/arsenal/arsenal-bridge-panel";

export const metadata: Metadata = {
  title: "Запустить AI-магазин на Авито — готовое инженерное решение",
  description: "Пошаговый маршрут запуска бизнеса на Авито: от анализа ниши и AI-копирайтинга до уникализации фото, сборки XML-фида и AI-автоответов.",
  alternates: { canonical: "https://proektmap.ru/resheniya/avito-business" },
};

const launchArtifacts = guidedAvitoSolution.steps.map((step) => step.artifact);

export default function AvitoBusinessSolutionPage() {
  return (
    <div className="solutions-page">
      <main className="solutions-shell solution-detail">
        <nav className="solution-breadcrumb" aria-label="Навигация">
          <Link href="/resheniya"><ArrowLeft size={15} /> Все решения</Link>
          <span>/</span>
          <span>AI-магазин на Авито</span>
        </nav>

        <section className="solution-detail-hero">
          <div className="solution-detail-copy">
            <div className="solutions-eyebrow"><Sparkles size={16} /> Готовый инженерный маршрут</div>
            <h1>Запустить AI-магазин на Авито</h1>
            <p>{guidedAvitoSolution.subtitle}: стек, сервисы, промпты и инструменты уже выбраны ProektMap.</p>
            <div className="solution-detail-meta">
              <span><Route size={16} /> {guidedAvitoSolution.steps.length} готовых шагов</span>
              <span><Clock3 size={16} /> {guidedAvitoSolution.duration}</span>
              <span><ShieldCheck size={16} /> Проверяемый запуск</span>
            </div>
            <div className="solutions-hero-actions">
              <Link href="/resheniya/avito-business/workspace" className="solutions-button solutions-button-primary">
                Начать маршрут <ArrowRight size={18} />
              </Link>
              <a href="#route" className="solutions-button solutions-button-secondary">Посмотреть этапы</a>
            </div>
          </div>

          <aside className="solution-result-contract">
            <div className="solution-result-icon"><ShoppingBag size={24} /></div>
            <span>Контракт результата</span>
            <h2>Что будет готово на финише</h2>
            <p>{guidedAvitoSolution.result}</p>
            <div className="solution-result-checks">
              {[
                "20+ опубликованных карточек через Автозагрузку",
                "Уникализированные фото в 4:3 с защитой центра 1:1",
                "Легитимный EXIF физических камер (iPhone/Samsung)",
                "AI-ассистент в чатах с ответом до 60 секунд",
              ].map((item) => <div key={item}><Check size={16} /> {item}</div>)}
            </div>
          </aside>
        </section>

        <section className="solution-route-section" id="route" aria-labelledby="avito-route-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Карта выполнения</span>
              <h2 id="avito-route-title">Путь от анализа ниши до первых продаж</h2>
            </div>
            <p>Каждый шаг содержит готовую рекомендацию, команду или промпт, ссылку на инструмент и понятную проверку.</p>
          </div>

          <div className="solution-route">
            {guidedAvitoSolution.steps.map((phase, index) => (
              <article className="solution-route-card" key={phase.slug}>
                <div className="solution-route-marker">
                  <span>{index + 1}</span>
                  {index < guidedAvitoSolution.steps.length - 1 && <i aria-hidden />}
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

        <ArsenalBridgePanel solutionSlug="avito-business" />

        <section className="solution-pack-section" aria-labelledby="avito-pack-title">
          <div className="solution-pack-copy">
            <span className="solutions-kicker">Готовый технический путь</span>
            <h2 id="avito-pack-title">На выходе остаётся работающий магазин</h2>
            <p>ProektMap заранее выбрал связку: парсинг конкурентов, Avito Photo Lab, официальный XML-фид Автозагрузки и AI-автоответы.</p>
          </div>
          <div className="solution-pack-grid">
            {launchArtifacts.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><Boxes size={18} /><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className="solution-context-section" aria-labelledby="avito-context-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Связи экосистемы</span>
              <h2 id="avito-context-title">Инструменты и сервисы в контексте маршрута</h2>
            </div>
            <p>В процессе выполнения шагов вы используете встроенные инструменты и каталоги ProektMap.</p>
          </div>
          <div className="solution-context-grid">
            <div className="solution-context-card">
              <span className="solution-context-kicker">Инструмент ProektMap</span>
              <strong>Avito Photo Lab</strong>
              <p>Уникализация фотографий, контроль сходства pHash/RGB Cube, охранная зона 4:3 и генератор XML/CSV фидов.</p>
              <Link href="/services/avito-photo-uniquizer" className="solutions-inline-link">Открыть утилиту →</Link>
            </div>
            <div className="solution-context-card">
              <span className="solution-context-kicker">Каталог сервисов</span>
              <strong>Экосистема инструментов для Авито</strong>
              <p>80+ проверенных парсеров, расширений, сервисов автопостинга, бидеров и CRM для продавцов.</p>
              <Link href="/avito" className="solutions-inline-link">Открыть каталог /avito →</Link>
            </div>
          </div>
        </section>

        <section className="solution-cta-card">
          <div>
            <h2>Готовы запустить системный бизнес на Авито?</h2>
            <p>Переходите в рабочую зону, следуйте готовым шагам и соберите первый продающий фид.</p>
          </div>
          <Link href="/resheniya/avito-business/workspace" className="solutions-button solutions-button-primary">
            Открыть рабочую зону <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
