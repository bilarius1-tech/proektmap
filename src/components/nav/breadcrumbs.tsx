'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

// Route label map
const ROUTE_LABELS: Record<string, string> = {
  patterns: 'Паттерны',
  mcp: 'MCP-серверы',
  glossary: 'Глоссарий',
  blog: 'Блог',
  prompts: 'Промты',
  'ai-tools': 'AI-инструменты',
  models: 'AI Модели',
  architecture: 'Карта метро',
  specialists: 'Специалисты',
  dashboard: 'Кабинет',
  admin: 'Админка',
  privacy: 'Политика',
  terms: 'Условия',
  offer: 'Оферта',
  contacts: 'Контакты',
  auth: 'Вход',
};

export default function Breadcrumbs({ pathname, pageTitle }: { pathname: string; pageTitle?: string }) {
  const crumbs = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    return parts.map((part, i) => {
      const href = '/' + parts.slice(0, i + 1).join('/');
      const label = i === parts.length - 1 && pageTitle
        ? pageTitle
        : ROUTE_LABELS[part] || part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return { href, label };
    });
  }, [pathname, pageTitle]);

  if (crumbs.length <= 1) return null;

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', padding: 'var(--space-s) 0', flexWrap: 'wrap' }}>
      <Link href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Home size={12} />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronRight size={10} style={{ opacity: 0.4 }} />
          {i === crumbs.length - 1 ? (
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{crumb.label}</span>
          ) : (
            <Link href={crumb.href} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
