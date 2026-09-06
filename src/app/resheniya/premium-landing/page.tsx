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
import { guidedPremiumLandingSolution } from "../premium-landing-guided-data";
import ArsenalBridgePanel from "@/components/arsenal/arsenal-bridge-panel";

export const metadata: Metadata = {
  title: "Премиум-шаблон сайта без AI-скуфа — готовое AI-решение | ProektMap",
  description:
    "Маршрут вайбкодера: editorial-лендинг на Next.js с DESIGN.md и AI Skills. Даже на простых моделях — без Inter, фиолетового градиента и карточного hero. Проверено из РФ.",
  alternates: { canonical: "https://proektmap.ru/resheniya/premium-landing" },
};

const launchArtifacts = guidedPremiumLandingSolution.steps.map((step) => step.artifact);

export default function PremiumLandingSolutionPage() {
  const s = guidedPremiumLandingSolution;
  return (
    <div className="solutions-page">
      <main className="solutions-shell solution-detail">
        <nav className="solution-breadcrumb" aria-label="Навигация">
          <Link href="/resheniya">
            <ArrowLeft size={15} /> Все решения
          </Link>
          <span>/</span>
          <span>Премиум-шаблон</span>
        </nav>

        <section className="solution-detail-hero">
          <div className="solution-detail-copy">
            <div className="solutions-eyebrow">
              <Sparkles size={16} /> Готовый инженерный маршрут · анти AI-скуф
            </div>
            <h1>Собрать премиум-шаблон сайта без AI-скуфа</h1>
            <p>
              {s.subtitle}: направление, DESIGN.md, Premium Landing Stack и промпты с примерами плохо/хорошо уже
              выбраны ProektMap. Подходит даже для простых моделей — сила в правилах, не в «магии» LLM.
            </p>
            <div className="solution-detail-meta">
              <span>
                <Route size={16} /> {s.steps.length} готовых шагов
              </span>
              <span>
                <Clock3 size={16} /> {s.duration}
              </span>
              <span>
                <ShieldCheck size={16} /> Проверено из РФ
              </span>
            </div>
            <div className="solutions-hero-actions">
              <Link
                href="/resheniya/premium-landing/workspace"
                className="solutions-button solutions-button-primary"
              >
                Начать маршрут <ArrowRight size={18} />
              </Link>
              <a href="#route" className="solutions-button solutions-button-secondary">
                Посмотреть этапы
              </a>
              <Link href="/ai-skills" className="solutions-button solutions-button-secondary">
                AI Skills
              </Link>
            </div>
          </div>

          <aside className="solution-result-contract">
            <div className="solution-result-icon">
              <Palette size={24} />
            </div>
            <span>Контракт результата</span>
            <h2>Что будет готово на финише</h2>
            <p>{s.result}</p>
            <div className="solution-result-checks">
              {[
                "Editorial landing на Next.js",
                "DESIGN.md + токены + характерные шрифты",
                "Чеклист anti-slop и mobile 375",
                "Путь сборки/деплоя без обязательного VPN",
              ].map((item) => (
                <div key={item}>
                  <Check size={16} /> {item}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section
          style={{
            margin: "0 0 28px",
            padding: "16px 18px",
            border: "1px solid rgba(15,118,110,0.35)",
            background: "rgba(15,118,110,0.06)",
          }}
          aria-label="Доверие: проверено из РФ"
        >
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <ShieldCheck size={22} color="#0f766e" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ display: "block", marginBottom: 6 }}>Проверено из РФ</strong>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
                Основной путь не требует VPN для сборки. Деплой рекомендуем на Beget / Timeweb / VPS. Skills ставятся
                из открытых репозиториев; community-skill читайте перед установкой. Оплата западным PaaS не обязательна
                для финиша маршрута.
              </p>
            </div>
          </div>
        </section>

        <section className="solution-route-section" id="route" aria-labelledby="premium-route-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Карта выполнения</span>
              <h2 id="premium-route-title">От направления до URL без AI-скуфа</h2>
            </div>
            <p>В каждом шаге — рекомендация, команда или промпт с плохо/хорошо и наблюдаемая проверка.</p>
          </div>

          <div className="solution-route">
            {s.steps.map((phase, index) => (
              <article className="solution-route-card" key={phase.slug}>
                <div className="solution-route-marker">
                  <span>{index + 1}</span>
                  {index < s.steps.length - 1 && <i aria-hidden />}
                </div>
                <div className="solution-route-content">
                  <div className="solution-route-topline">
                    <span>Шаг {index + 1}</span>
                    <span>
                      <Clock3 size={14} /> {phase.duration}
                    </span>
                  </div>
                  <h3>{phase.title}</h3>
                  <p>{phase.explanation}</p>
                  <div className="solution-route-outcome">
                    <Target size={17} />
                    <div>
                      <span>Результат</span>
                      <strong>{phase.goal}</strong>
                    </div>
                  </div>
                  <div className="solution-route-artifact">
                    <FileCheck2 size={16} /> {phase.artifact}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ArsenalBridgePanel solutionSlug="premium-landing" />

        <section className="solution-pack-section" aria-labelledby="premium-pack-title">
          <div className="solution-pack-copy">
            <span className="solutions-kicker">Готовый технический путь</span>
            <h2 id="premium-pack-title">Стек уже выбран</h2>
            <p>
              Next.js, DESIGN.md, Premium Landing Stack (/ai-skills) и editorial-направление. Пользователь не
              проектирует архитектуру — выполняет маршрут.
            </p>
            <ul style={{ margin: "12px 0 0", paddingLeft: 18, lineHeight: 1.55, fontSize: 14 }}>
              {s.defaultStack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="solution-pack-grid">
            {launchArtifacts.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Boxes size={18} />
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="solution-context-section" aria-labelledby="premium-context-title">
          <div className="solutions-section-heading">
            <div>
              <span className="solutions-kicker">Экосистема по шагам</span>
              <h2 id="premium-context-title">Skills и дизайн-система внутри маршрута</h2>
            </div>
          </div>
          <div className="solution-context-groups">
            {[s.steps[1], s.steps[2], s.steps[5]].map((phase) => (
              <article className="solution-context-group" key={phase.slug}>
                <span>Шаг {s.steps.indexOf(phase) + 1}</span>
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
            <span className="solutions-kicker">Первый нестандартный шаблон</span>
            <h2>Соберите премиум-лендинг по готовым шагам</h2>
            <p>
              Даже слабая модель держит характер, если есть DESIGN.md, запреты и Premium Landing Stack. Следующий шаг
              открывается после понятного результата.
            </p>
          </div>
          <Link
            href="/resheniya/premium-landing/workspace"
            className="solutions-button solutions-button-primary"
          >
            Открыть рабочую зону <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </div>
  );
}
