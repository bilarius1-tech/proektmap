import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  Clock3,
  Compass,
  Layers3,
  Rocket,
  Route,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import ClaudeAcademyCallout from "@/components/academy/claude-academy-callout";
import NeuroCatalogCallout from "@/components/arsenal/neuro-catalog-callout";
import { ecosystemResources } from "./data";
import { guidedSaasSolution } from "./guided-data";
import { guidedTelegramSolution } from "./telegram-guided-data";
import { guidedAvitoSolution } from "./avito-guided-data";

export const metadata: Metadata = {
  title: "Готовые решения AI — от идеи до работающего продукта",
  description: "Пошаговые маршруты запуска AI-продуктов. Решения, действия, артефакты и проверка результата — от идеи до production.",
  alternates: { canonical: "https://proektmap.ru/resheniya" },
};

const futureSolutions = [
  {
    title: "Создать корпоративный сайт",
    description: "От структуры и контента до заявок, аналитики и SEO.",
    icon: Layers3,
    label: "В разработке",
  },
  {
    title: "Собрать CRM-систему",
    description: "От сущностей и воронки до заявок, статусов и уведомлений.",
    icon: Boxes,
    label: "В разработке",
  },
];

export default function ResheniyaPage() {
  return (
    <div className="solutions-page">
      <section className="solutions-hero">
        <div className="solutions-shell solutions-hero-grid">
          <div>
            <div className="solutions-eyebrow"><Sparkles size={16} /> Новый центр ProektMap</div>
            <h1>Готовые решения AI</h1>
            <p className="solutions-hero-lead">
              Мы уже выбрали основной стек, программы, модели и порядок действий.
              Выберите продукт, выполняйте готовые инструкции и доведите его до интернета.
            </p>
            <div className="solutions-hero-actions">
              <Link href="/resheniya/saas-product" className="solutions-button solutions-button-primary">
                Маршрут SaaS <ArrowRight size={18} />
              </Link>
              <Link href="/resheniya/avito-business" className="solutions-button solutions-button-secondary">
                Магазин на Авито
              </Link>
              <Link href="/resheniya/telegram-bot" className="solutions-button solutions-button-secondary">
                Telegram-бот
              </Link>
            </div>
          </div>

          <div className="solutions-model-card" aria-label="Модель прохождения готового решения">
            <div className="solutions-model-card-title"><Route size={18} /> Одна ясная модель прогресса</div>
            <div className="solutions-model-flow">
              {["Продукт", "Рекомендация", "Команда", "Результат", "Проверка"].map((item, index) => (
                <div className="solutions-model-step" key={item}>
                  <span>{index + 1}</span>
                  <strong>{item}</strong>
                  {index < 4 && <ArrowRight size={14} aria-hidden />}
                </div>
              ))}
            </div>
            <p>Один главный путь вместо анкеты и десяти равноправных вариантов.</p>
          </div>
        </div>
      </section>

      <main className="solutions-shell solutions-main">
        <ClaudeAcademyCallout
          style={{ marginBottom: 16 }}
          secondaryHref="#available-title"
          secondaryLabel="К маршрутам ниже"
        />
        <NeuroCatalogCallout
          style={{ marginBottom: 28 }}
          secondaryHref="/arsenal/vibe-coder"
          secondaryLabel="Стек: агент-кодер"
        />

        <section className="solutions-section" aria-labelledby="available-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Можно начать сейчас</span>
              <h2 id="available-title">Доступные готовые решения</h2>
            </div>
            <span className="solutions-status-badge">3 маршрута</span>
          </div>

          <div className="solutions-feature-list">
            <Link href="/resheniya/avito-business" className="solutions-feature-card">
              <div className="solutions-feature-main">
                <div className="solutions-feature-icon" style={{ background: "rgba(239, 68, 68, 0.12)", color: "#ef4444" }}><ShoppingBag size={30} /></div>
                <div>
                  <span className="solutions-kicker">Для селлеров, авитологов и AI-предпринимателей</span>
                  <h3>Запустить AI-магазин на Авито</h3>
                  <p>Готовый путь от анализа спроса и AI-офферов до уникализации фото, XML-автозагрузки и автоответов.</p>
                </div>
              </div>

              <div className="solutions-feature-result">
                <span>Результат маршрута</span>
                <strong>{guidedAvitoSolution.result}</strong>
              </div>

              <div className="solutions-feature-meta">
                <span><Route size={16} /> {guidedAvitoSolution.steps.length} готовых шагов</span>
                <span><Clock3 size={16} /> {guidedAvitoSolution.duration}</span>
                <span><Boxes size={16} /> стек и сервисы выбраны</span>
                <span className="solutions-feature-link">Открыть решение <ArrowRight size={16} /></span>
              </div>
            </Link>

            <Link href="/resheniya/saas-product" className="solutions-feature-card">
              <div className="solutions-feature-main">
                <div className="solutions-feature-icon"><Rocket size={30} /></div>
                <div>
                  <span className="solutions-kicker">Для основателя и AI-инженера</span>
                  <h3>Запустить SaaS-продукт</h3>
                  <p>Готовый путь от установки Cursor и выбора моделей до авторизации, AI, оплаты и production.</p>
                </div>
              </div>

              <div className="solutions-feature-result">
                <span>Результат маршрута</span>
                <strong>{guidedSaasSolution.result}</strong>
              </div>

              <div className="solutions-feature-meta">
                <span><Route size={16} /> {guidedSaasSolution.steps.length} готовых шагов</span>
                <span><Clock3 size={16} /> {guidedSaasSolution.duration}</span>
                <span><Boxes size={16} /> стек и промпты выбраны</span>
                <span className="solutions-feature-link">Открыть решение <ArrowRight size={16} /></span>
              </div>
            </Link>

            <Link href="/resheniya/telegram-bot" className="solutions-feature-card">
              <div className="solutions-feature-main">
                <div className="solutions-feature-icon"><Bot size={30} /></div>
                <div>
                  <span className="solutions-kicker">Для бизнеса, специалиста и AI-инженера</span>
                  <h3>Запустить Telegram-бота</h3>
                  <p>Готовый путь от BotFather и grammY до рабочей команды /start и запуска на VPS.</p>
                </div>
              </div>

              <div className="solutions-feature-result">
                <span>Результат маршрута</span>
                <strong>{guidedTelegramSolution.result}</strong>
              </div>

              <div className="solutions-feature-meta">
                <span><Route size={16} /> {guidedTelegramSolution.steps.length} готовых шагов</span>
                <span><Clock3 size={16} /> {guidedTelegramSolution.duration}</span>
                <span><Boxes size={16} /> стек и команды выбраны</span>
                <span className="solutions-feature-link">Открыть решение <ArrowRight size={16} /></span>
              </div>
            </Link>
          </div>
        </section>

        <section className="solutions-section" id="how-it-works" aria-labelledby="process-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Процесс выполнения</span>
              <h2 id="process-title">Всегда понятно, что делать дальше</h2>
            </div>
          </div>
          <div className="solutions-process-grid">
            {[
              { icon: Compass, title: "Выбираем продукт", text: "SaaS или Telegram-бот — без проектирования собственного маршрута." },
              { icon: Route, title: "Следуем рекомендации", text: "ProektMap уже выбрал программу, модели, стек и порядок." },
              { icon: Boxes, title: "Копируем и запускаем", text: "На каждом шаге есть точная команда или готовый промпт." },
              { icon: CheckCircle2, title: "Проверяем результат", text: "Следующий шаг открывается после понятного наблюдаемого результата." },
            ].map(({ icon: Icon, title, text }, index) => (
              <article className="solutions-process-card" key={title}>
                <div className="solutions-process-number">{index + 1}</div>
                <Icon size={22} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="solutions-section" aria-labelledby="ecosystem-title">
          <div className="solutions-ecosystem">
            <div className="solutions-ecosystem-intro">
              <span className="solutions-kicker">Экосистема вокруг результата</span>
              <h2 id="ecosystem-title">Весь ProektMap работает на текущий этап</h2>
              <p>
                Глоссарий, модели, инструменты и Skills не живут отдельно. Маршрут показывает
                нужную ветку именно тогда, когда она помогает принять решение или выполнить действие.
              </p>
              <Link href="#available-title" className="solutions-text-link">
                Открыть доступные маршруты <ArrowRight size={16} />
              </Link>
            </div>
            <div className="solutions-ecosystem-map">
              <div className="solutions-ecosystem-center">
                <Route size={24} />
                <strong>/resheniya</strong>
                <span>текущая миссия</span>
              </div>
              <div className="solutions-resource-cloud">
                {ecosystemResources.map((resource) => (
                  <Link href={resource.href} key={resource.href} className="solutions-resource-pill">
                    <span>{resource.kind}</span>
                    <strong>{resource.label}</strong>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="solutions-section" aria-labelledby="future-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Следующие решения</span>
              <h2 id="future-title">Единая логика для разных результатов</h2>
            </div>
          </div>
          <div className="solutions-future-grid">
            {futureSolutions.map(({ title, description, icon: Icon, label }) => (
              <article className="solutions-future-card" key={title}>
                <div className="solutions-future-icon"><Icon size={23} /></div>
                <span>{label}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
