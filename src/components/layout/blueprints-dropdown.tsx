'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface BlueprintItem {
  id: string;
  title: string;
  slug: string;
  icon: string;
  difficulty: string;
}

const ICON_MAP: Record<string, string> = {
  Globe: '🌐', Bot: '🤖', Users: '👥', Store: '🛒', ShoppingBag: '🛍️',
  Gamepad2: '🎮', Rocket: '🚀', MessageSquare: '💬', Brain: '🧠',
  Database: '🗄️', Package: '📦', ShoppingCart: '🛒', CreditCard: '💳',
  CheckCircle: '✅', Bell: '🔔', Shield: '🛡️', Home: '🏠', LayoutGrid: '📋',
  User: '👤', UserPlus: '👥', Kanban: '📊', Contact: '📇', CheckSquare: '☑️',
  FileText: '📄', BrainCircuit: '⚡', Banknote: '💵',
};

function getIcon(iconName: string): string {
  return ICON_MAP[iconName] || '📄';
}

function getDifficulty(d: string): string {
  if (d === 'easy') return '🟢';
  if (d === 'hard') return '🔴';
  return '🟡';
}

export default function BlueprintsDropdown({ blueprints }: { blueprints: BlueprintItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function onMouseEnter() {
    clearTimeout(timer.current);
    setOpen(true);
  }
  function onMouseLeave() {
    timer.current = setTimeout(() => setOpen(false), 200);
  }

  if (blueprints.length === 0) {
    return (
      <Link href="/blueprints" style={{
        color: 'var(--color-text-secondary)', fontSize: 'var(--text-s)',
        textDecoration: 'none', padding: '6px 12px', borderRadius: 'var(--radius-s)',
        whiteSpace: 'nowrap',
      }}>
        Карта роста
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ position: 'relative' }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: open ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontSize: 'var(--text-s)', textDecoration: 'none',
          padding: '6px 12px', borderRadius: 'var(--radius-s)', transition: 'all 0.1s',
          background: open ? 'var(--color-accent-light)' : 'transparent',
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        🗺️ Карта роста
        <ChevronDown size={14} style={{
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }} />
      </button>

      {open && (
        <div
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={onMouseLeave}
          style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            marginTop: 8, zIndex: 200,
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-l)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            padding: 'var(--space-l)',
            minWidth: 480,
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          <div style={{
            position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
            width: 12, height: 12, background: 'var(--color-bg-primary)',
            borderLeft: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)',
            rotate: '45deg',
          }} />

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 'var(--space-m)', paddingBottom: 'var(--space-s)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>
              Blueprints ({blueprints.length})
            </span>
            <Link
              href="/blueprints"
              onClick={() => setOpen(false)}
              style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textDecoration: 'none' }}
            >
              Все →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-xs)',
          }}>
            {blueprints.map(bp => (
              <Link
                key={bp.id}
                href={`/blueprints/${bp.slug}`}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 'var(--radius-m)',
                  textDecoration: 'none', color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-s)', fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-light)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>
                  {getIcon(bp.icon)}
                </span>
                <span style={{ flex: 1 }}>{bp.title}</span>
                <span style={{ fontSize: 12 }}>{getDifficulty(bp.difficulty)}</span>
              </Link>
            ))}
          </div>

          <div style={{
            marginTop: 'var(--space-m)', paddingTop: 'var(--space-s)',
            borderTop: '1px solid var(--color-border)',
            fontSize: 11, color: 'var(--color-text-secondary)',
            textAlign: 'center',
          }}>
            Выбери Blueprint и пройди путь от идеи до запуска с AI-консультантом
          </div>
        </div>
      )}
    </div>
  );
}
