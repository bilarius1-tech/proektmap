'use client';

import { useState, useEffect, useRef } from 'react';
import { BookOpen, Star, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

interface TermData {
  term: string;
  slug: string;
  definition: string;
  simpleExplanation: string;
  level: string;
  category: string;
  relatedTerms: string;
}

// Client-side cache — loaded once
let termCache: Record<string, TermData> | null = null;

async function loadTerms(): Promise<Record<string, TermData>> {
  if (termCache) return termCache;
  try {
    const res = await fetch('/api/glossary');
    const data = await res.json();
    termCache = {};
    for (const t of data.terms || []) {
      termCache[t.term.toLowerCase()] = t;
      termCache[t.slug.toLowerCase()] = t;
    }
  } catch { termCache = {}; }
  return termCache || {};
}

export default function Term({ term }: { term: string }) {
  const [data, setData] = useState<TermData | null>(null);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<any>(null);

  useEffect(() => {
    loadTerms().then(cache => {
      const found = cache[term.toLowerCase()];
      if (found) setData(found);
    });
  }, [term]);

  if (!data) return <span>{term}</span>;

  const levelEmoji = data.level === 'beginner' ? '🟢' : data.level === 'intermediate' ? '🟡' : '🔴';
  const related = data.relatedTerms ? data.relatedTerms.split(',').slice(0, 3) : [];

  return (
    <span
      ref={ref}
      style={{
        display: 'inline',
        borderBottom: '2px dotted var(--color-accent)',
        cursor: 'help',
        position: 'relative',
        color: 'var(--color-accent)',
        fontWeight: 600,
      }}
      onMouseEnter={() => {
        clearTimeout(timer.current);
        setShow(true);
      }}
      onMouseLeave={() => {
        timer.current = setTimeout(() => setShow(false), 300);
      }}
    >
      {term}
      {show && (
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            width: 320,
            padding: 'var(--space-m)',
            background: 'var(--color-bg-primary)',
            borderRadius: 0,
            border: '2px solid var(--color-accent)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            fontSize: 'var(--text-xs)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            animation: 'termIn 0.2s ease',
          }}
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={() => setShow(false)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={14} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontWeight: 700, fontSize: 'var(--text-s)' }}>{data.term}</span>
            </div>
            <span style={{ fontSize: 14 }}>{levelEmoji}</span>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
            {data.simpleExplanation || data.definition}
          </p>

          {related.length > 0 && (
            <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 6 }}>
              <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Связанные термины:</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {related.map((r: string) => (
                  <Link key={r} href={`/glossary/${r.trim().toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', fontSize: 9, fontWeight: 600, textDecoration: 'none' }}>
                    {r.trim()}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link href={`/glossary/${data.slug}`}
            style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 9, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>
            <ExternalLink size={10} /> Подробнее в глоссарии
          </Link>
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
