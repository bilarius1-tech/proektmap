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
} from "lucide-react";
import { ecosystemResources, saasSolution } from "./data";

export const metadata: Metadata = {
  title: "Готовые решения AI — от идеи до работающего продукта",
  description: "Пошаговые маршруты запуска AI-продуктов. Решения, действия, артефакты и проверка результата — от идеи до production.",
  alternates: { canonical: "https://proektmap.ru/resheniya" },
};

const futureSolutions = [
  {
    title: "Запустить Telegram-бота",
    description: "От сценария и команд до платежей, Mini App и публикации.",
    icon: Bot,
    label: "Следующий маршрут",
  },
  {
    title: "Создать корпоративный сайт",
    description: "От структуры и контента до заявок, аналитики и SEO.",
    icon: Layers3,
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
              Не курс и не список статей. Профессиональный маршрут, который ведёт от идеи
              до проверенного результата — через решения, действия, артефакты и контрольные точки.
            </p>
            <div className="solutions-hero-actions">
              <Link href="/resheniya/saas-product" className="solutions-button solutions-button-primary">
                Посмотреть маршрут SaaS <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="solutions-button solutions-button-secondary">
                Как это работает
              </a>
            </div>
          </div>

          <div className="solutions-model-card" aria-label="Модель прохождения готового решения">
            <div className="solutions-model-card-title"><Route size={18} /> Одна ясная модель прогресса</div>
            <div className="solutions-model-flow">
              {["Цель", "Решение", "Действие", "Артефакт", "Проверка"].map((item, index) => (
                <div className="solutions-model-step" key={item}>
                  <span>{index + 1}</span>
                  <strong>{item}</strong>
                  {index < 4 && <ArrowRight size={14} aria-hidden />}
                </div>
              ))}
            </div>
            <p>Процент растёт только после проверенного результата, а не после чтения карточки.</p>
          </div>
        </div>
      </section>

      <main className="solutions-shell solutions-main">
        <section className="solutions-section" aria-labelledby="pilot-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Пилотный маршрут</span>
              <h2 id="pilot-title">Первое готовое решение</h2>
            </div>
            <span className="solutions-status-badge">UX-прототип</span>
          </div>

          <Link href="/resheniya/saas-product" className="solutions-feature-card">
            <div className="solutions-feature-main">
              <div className="solutions-feature-icon"><Rocket size={30} /></div>
              <div>
                <span className="solutions-kicker">Для основателя и AI-инженера</span>
                <h3>{saasSolution.title}</h3>
                <p>{saasSolution.description}</p>
              </div>
            </div>

            <div className="solutions-feature-result">
              <span>Результат маршрута</span>
              <strong>{saasSolution.result}</strong>
            </div>

            <div className="solutions-feature-meta">
              <span><Route size={16} /> {saasSolution.phases.length} этапов</span>
              <span><Clock3 size={16} /> {saasSolution.duration}</span>
              <span><Boxes size={16} /> 8 итоговых артефактов</span>
              <span className="solutions-feature-link">Открыть решение <ArrowRight size={16} /></span>
            </div>
          </Link>
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
              { icon: Compass, title: "Фиксируем финиш", text: "До старта определяем измеримый результат продукта." },
              { icon: Route, title: "Идём по этапам", text: "На экране одна текущая миссия, а не сорок открытых карточек." },
              { icon: Boxes, title: "Собираем продукт", text: "Каждый этап оставляет файл, схему, URL или работающую функцию." },
              { icon: CheckCircle2, title: "Доказываем готовность", text: "Проверки и доказательства открывают следующий этап." },
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
              <Link href="/resheniya/saas-product/workspace" className="solutions-text-link">
                Посмотреть рабочую зону <ArrowRight size={16} />
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
