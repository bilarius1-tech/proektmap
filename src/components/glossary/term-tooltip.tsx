'use client';

import { useState, useEffect, useRef } from 'react';
import { ExternalLink, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TermData {
  title: string;
  slug: string;
  shortDescription: string;
  difficulty: string;
  relatedPatterns?: string[];
  relatedPrompts?: string[];
  relatedMcp?: string[];
}

const TERM_CACHE: Record<string, TermData> = {};

export default function TermTooltip({ term, children }: { term: string; children?: React.ReactNode }) {
  const [data, setData] = useState<TermData | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (visible && !data && !loading) {
      setLoading(true);
      // Check cache first
      if (TERM_CACHE[term]) {
        setData(TERM_CACHE[term]);
        setLoading(false);
        return;
      }
      // Fetch from API
      fetch(`/api/glossary/term/${encodeURIComponent(term)}`)
        .then(r => r.json())
        .then(d => {
          if (d.term) {
            TERM_CACHE[term] = d.term;
            setData(d.term);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [visible, term]);

  const show = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), 300);
  };
  const hide = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 200);
  };

  const diffColor = data?.difficulty === 'beginner' ? '#22c55e' : data?.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444';

  return (
    <span style={{ position: 'relative', display: 'inline' }} onMouseEnter={show} onMouseLeave={hide}>
      <span style={{
        borderBottom: '1px dashed var(--color-accent)',
        cursor: 'help',
        color: 'var(--color-accent)',
        fontWeight: 600,
      }}>
        {children || term}
      </span>

      {visible && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          zIndex: 500, marginBottom: 8, width: 320,
          background: 'var(--color-bg-primary)',
          borderRadius: 0, border: '2px solid var(--color-accent)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          padding: 'var(--space-m)',
          fontSize: 'var(--text-xs)',
          animation: 'termIn 0.2s ease',
          pointerEvents: 'auto',
        }} onMouseEnter={show} onMouseLeave={hide}>
          {loading ? (
            <div style={{ color: 'var(--color-text-tertiary)' }}>Загрузка...</div>
          ) : data ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BookOpen size={14} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-s)', color: 'var(--color-text-primary)' }}>{data.title}</span>
                </div>
                <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: diffColor + '20', color: diffColor, fontWeight: 600 }}>
                  {data.difficulty === 'beginner' ? '🟢' : data.difficulty === 'intermediate' ? '🟡' : '🔴'}
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                {data.shortDescription}
              </p>
              <Link href={`/glossary/${data.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                Подробнее <ArrowRight size={10} />
              </Link>
            </>
          ) : (
            <div style={{ color: 'var(--color-text-tertiary)' }}>Термин не найден</div>
          )}
        </div>
      )}

      <style>{`
        @keyframes termIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </span>
  );
}

// Auto-link component: parses text and turns known terms into TermTooltips
export function TermifyText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  // Simple split by known patterns — for full version, use the glossary API
  return <span className={className}>{text}</span>;
}
