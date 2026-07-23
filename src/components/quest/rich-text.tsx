'use client';

import React from 'react';
import Term from '@/components/glossary/tooltip-term';

export default function RichText({ text }: { text: string }) {
  const regex = /(\{\{Term\|([^}]+)\}\})|(\[([^\]]+)\]\(([^)]+)\))/g;

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(React.createElement('span', { key: 't' + lastIndex }, text.slice(lastIndex, match.index)));
    }
    if (match[1]) {
      segments.push(React.createElement(Term, { key: 'term' + match.index, term: match[2] }));
    } else if (match[3]) {
      segments.push(React.createElement('a', {
        key: 'link' + match.index, href: match[5], target: '_blank', rel: 'noopener noreferrer',
        style: { color: 'var(--color-accent)', textDecoration: 'underline', fontWeight: 500 }
      }, match[4] + ' ↗'));
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push(React.createElement('span', { key: 't' + lastIndex }, text.slice(lastIndex)));
  }
  return React.createElement('p', {
    style: { fontSize: 'var(--text-s)', lineHeight: 1.7, color: 'var(--color-text-secondary)', maxWidth: 700, marginBottom: 'var(--space-xl)', whiteSpace: 'pre-line' }
  }, ...segments);
}
