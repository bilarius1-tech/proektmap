import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Boxes,
  Check,
  Clock3,
  FileCheck2,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { guidedTelegramSolution } from "../telegram-guided-data";

export const metadata: Metadata = {
  title: "Запустить Telegram-бота — готовое AI-решение",
  description: "Готовый маршрут создания Telegram-бота на TypeScript и grammY: от BotFather до рабочей команды /start и запуска на VPS.",
  alternates: { canonical: "https://proektmap.ru/resheniya/telegram-bot" },
};

const launchArtifacts = guidedTelegramSolution.steps.map((step) => step.artifact);

export default function TelegramBotSolutionPage() {
  return (
    <div className="solutions-page">
      <main className="solutions-shell solution-detail">
        <nav className="solution-breadcrumb" aria-label="Навигация">
          <Link href="/resheniya"><ArrowLeft size={15} /> Все решения</Link>
          <span>/</span>
          <span>Telegram-бот</span>
        </nav>

        <section className="solution-detail-hero">
          <div className="solution-detail-copy">
            <div className="solutions-eyebrow"><Sparkles size={16} /> Готовый инженерный маршрут</div>
            <h1>Запустить Telegram-бота</h1>
            <p>{guidedTelegramSolution.subtitle}: стек, команды и промпты уже выбраны ProektMap.</p>
            <div className="solution-detail-meta">
              <span><Route size={16} /> {guidedTelegramSolution.steps.length} готовых шагов</span>
              <span><Clock3 size={16} /> {guidedTelegramSolution.duration}</span>
              <span><ShieldCheck size={16} /> Проверяемый запуск</span>
            </div>
            <div className="solutions-hero-actions">
              <Link href="/resheniya/telegram-bot/workspace" className="solutions-button solutions-button-primary">
                Начать маршрут <ArrowRight size={18} />
              </Link>
              <a href="#route" className="solutions-button solutions-button-secondary">Посмотреть этапы</a>
            </div>
          </div>

          <aside className="solution-result-contract">
            <div className="solution-result-icon"><Bot size={24} /></div>
            <span>Контракт результата</span>
            <h2>Что будет готово на финише</h2>
            <p>{guidedTelegramSolution.result}</p>
            <div className="solution-result-checks">
              {[
                "Публичный @username и рабочий /start",
                "Команда /help со списком действий",
                "Один процесс PM2 на VPS",
                "BOT_TOKEN не попадает в Git",
              ].map((item) => <div key={item}><Check size={16} /> {item}</div>)}
            </div>
          </aside>
        </section>

        <section className="solution-route-section" id="route" aria-labelledby="telegram-route-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Карта выполнения</span>
              <h2 id="telegram-route-title">Путь от рабочего места до команды /start</h2>
            </div>
            <p>Каждый шаг содержит готовую рекомендацию, команду или промпт и понятную проверку.</p>
          </div>

          <div className="solution-route">
            {guidedTelegramSolution.steps.map((phase, index) => (
              <article className="solution-route-card" key={phase.slug}>
                <div className="solution-route-marker">
                  <span>{index + 1}</span>
                  {index < guidedTelegramSolution.steps.length - 1 && <i aria-hidden />}
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

        <section className="solution-pack-section" aria-labelledby="telegram-pack-title">
          <div className="solution-pack-copy">
            <span className="solutions-kicker">Готовый технический путь</span>
            <h2 id="telegram-pack-title">На выходе остаётся работающий проект</h2>
            <p>ProektMap заранее выбрал TypeScript, grammY, long polling и PM2. Пользователь выполняет инструкции по порядку.</p>
          </div>
          <div className="solution-pack-grid">
            {launchArtifacts.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><Boxes size={18} /><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className="solution-context-section" aria-labelledby="telegram-context-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Ресурсы по моменту задачи</span>
              <h2 id="telegram-context-title">Нужный хаб появляется внутри этапа</h2>
            </div>
          </div>
          <div className="solution-context-groups">
            {[guidedTelegramSolution.steps[0], guidedTelegramSolution.steps[4], guidedTelegramSolution.steps[8]].map((phase) => (
              <article className="solution-context-group" key={phase.slug}>
                <span>Шаг {guidedTelegramSolution.steps.indexOf(phase) + 1}</span>
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
            <h2>Соберите рабочую команду /start по готовым шагам</h2>
            <p>Стек, структура проекта, обработчик команд, проверки и deploy уже определены. Следующий шаг открывается после понятного результата.</p>
          </div>
          <Link href="/resheniya/telegram-bot/workspace" className="solutions-button solutions-button-primary">
            Открыть рабочую зону <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
