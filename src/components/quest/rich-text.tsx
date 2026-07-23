'use client';

import React from 'react';
import Term from '@/components/glossary/tooltip-term';

export default function RichText({ text }: { text: string }) {
  // Split text by {{Term|slug}} or {{Term|slug|display}} and [text](url)
  const regex = /(\{\{Term\|([^}]+)\}\})|(\[([^\]]+)\]\(([^)]+)\))/g;
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const chunk = text.slice(lastIndex, match.index);
      if (chunk.trim()) {
        // Render chunk as HTML (from Tiptap) or plain text
        segments.push(
          <span key={'h' + lastIndex} dangerouslySetInnerHTML={{ __html: chunk }} />
        );
      }
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
    const chunk = text.slice(lastIndex);
    segments.push(
      <span key={'h' + lastIndex} dangerouslySetInnerHTML={{ __html: chunk }} />
    );
  }
  return React.createElement('div', {
    style: { fontSize: 'var(--text-s)', lineHeight: 1.7, color: 'var(--color-text-secondary)', maxWidth: 700, marginBottom: 'var(--space-xl)' },
    className: 'rich-text-content'
  }, ...segments);
}
