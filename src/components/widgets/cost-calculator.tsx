"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Check, ArrowRight, Globe, Server, Database, CreditCard, Bot, Shield, Smartphone, Mail } from "lucide-react";

interface Option {
  id: string;
  label: string;
  desc: string;
  icon: any;
  price: number;
  period: string;
}

const options: Option[] = [
  { id: "domain", label: "Домен .ru", desc: "Beget, 200–600 ₽/год", icon: Globe, price: 50, period: "₽/мес" },
  { id: "hosting", label: "Хостинг VDS", desc: "Beget/TimeWeb, 400–1500 ₽/мес", icon: Server, price: 600, period: "₽/мес" },
  { id: "db", label: "PostgreSQL", desc: "База данных на VDS", icon: Database, price: 0, period: "включено" },
  { id: "ssl", label: "SSL сертификат", desc: "LetsEncrypt — бесплатно", icon: Shield, price: 0, period: "бесплатно" },
  { id: "payments", label: "Приём платежей", desc: "ЮKassa, комиссия 3.5%", icon: CreditCard, price: 0, period: "3.5% с оборота" },
  { id: "ai_model", label: "AI-модель", desc: "YandexGPT / DeepSeek", icon: Bot, price: 500, period: "₽/мес (базово)" },
  { id: "miniapp", label: "Mini App", desc: "Веб-приложение в Telegram", icon: Smartphone, price: 0, period: "включено в хостинг" },
  { id: "email_sending", label: "Отправка писем", desc: "EmailJS / Nodemailer", icon: Mail, price: 0, period: "бесплатно до 200/мес" },
];

export default function CostCalculator() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["domain", "hosting", "ssl"]));

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const total = Array.from(selected).reduce((sum, id) => {
    const opt = options.find(o => o.id === id);
    return sum + (opt?.price || 0);
  }, 0);

  const selectedItems = options.filter(o => selected.has(o.id));

  return (
    <div className="home-widget-card home-cost-calculator" style={{
      background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-l)", overflow: "hidden", maxWidth: 640, margin: "0 auto",
    }}>
      {/* Header */}
      <div className="home-widget-header" style={{
        padding: "var(--space-l) var(--space-xl)",
        background: "linear-gradient(135deg, #fef3c7, var(--color-bg-primary))",
        borderBottom: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Calculator size={24} style={{ color: "#f59e0b" }} />
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>
            Калькулятор стоимости
          </h3>
          <p className="home-widget-subtitle" style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
            Выбери что нужно — увидишь итоговую цену в месяц
          </p>
        </div>
      </div>

      <div className="home-widget-content" style={{ padding: "var(--space-xl)" }}>
        {/* Checkboxes */}
        <div className="home-cost-options" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-xl)" }}>
          {options.map(opt => {
            const Icon = opt.icon;
            const isSelected = selected.has(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className="home-cost-option"
                aria-pressed={isSelected}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: "var(--radius-m)",
                  border: isSelected ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                  background: isSelected ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "all 0.15s", width: "100%",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "var(--radius-s)",
                  border: isSelected ? "2px solid var(--color-accent)" : "2px solid var(--color-border)",
                  background: isSelected ? "var(--color-accent)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s",
                }}>
                  {isSelected && <Check size={14} style={{ color: "#fff" }} />}
                </div>
                <Icon size={18} style={{ color: isSelected ? "var(--color-accent)" : "var(--color-text-secondary)", flexShrink: 0 }} />
                <div className="home-cost-option-copy" style={{ flex: 1, minWidth: 0 }}>
                  <div className="home-cost-option-title" style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>{opt.label}</div>
                  <div className="home-cost-option-description" style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{opt.desc}</div>
                </div>
                <div className="home-cost-option-price" style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", flexShrink: 0, textAlign: "right" }}>
                  {opt.price > 0 ? `${opt.price} ${opt.period}` : opt.period}
                </div>
              </button>
            );
          })}
        </div>

        {/* Total */}
        <div className="home-cost-total" style={{
          background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)",
          padding: "var(--space-xl)", border: "1px solid var(--color-border)",
        }}>
          <div className="home-cost-total-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
            <div style={{ fontSize: "var(--text-s)", fontWeight: 600, fontFamily: "var(--font-heading)" }}>
              Итого в месяц
            </div>
            <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>
              {total.toLocaleString()} ₽
            </div>
          </div>

          {/* Breakdown */}
          {selectedItems.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "var(--space-m)" }}>
              {selectedItems.map(opt => (
                <div key={opt.id} className="home-cost-breakdown-row" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-secondary)" }}>
                  <span>{opt.label}</span>
                  <span style={{ fontWeight: 600 }}>{opt.price > 0 ? `${opt.price} ₽` : opt.period}</span>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <p className="home-cost-note" style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 var(--space-m)" }}>
            Это базовая оценка. Реальные затраты зависят от нагрузки, трафика и выбранных тарифов.
            Комиссия ЮKassa (3.5%) не включена — зависит от оборота.
          </p>

          <Link href="/blueprints" className="home-cost-cta" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 24px", borderRadius: "var(--radius-m)",
            background: "var(--color-accent)", color: "#fff",
            textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700,
            transition: "all 0.15s",
          }}>
            Начать проект с этим стеком <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
