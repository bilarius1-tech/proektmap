'use client';

import { useEffect, useState } from 'react';
import { BookOpen, X } from 'lucide-react';

export default function ContentHtml({ content, tocHeadings }: { content: string; tocHeadings?: { level: number; text: string; id: string }[] }) {
  const [html, setHtml] = useState('');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [glossaryTooltip, setGlossaryTooltip] = useState<{ text: string; left: number; top: number; above: boolean } | null>(null);

  useEffect(() => {
    let h = content || '';
    h = h.replace(/\u003c/g, '<').replace(/\u003e/g, '>').replace(/\u0026/g, '&');
    h = h.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    h = h.replace(/src="\/uploads\//g, 'src="/api/media/');

    // Inject IDs into h2/h3 for TOC anchor links
    if (tocHeadings?.length) {
      let idx = 0;
      h = h.replace(/<h([23])([^>]*)>(.+?)<\/h[23]>/gi, (match: string, level: string, attrs: string, inner: string) => {
        if (idx < tocHeadings!.length) {
          const id = tocHeadings![idx].id;
          idx++;
          // Only add id if not already present
          if (!/\bid\s*=/i.test(attrs)) {
            return '<h' + level + attrs + ' id="' + id + '">' + inner + '</h' + level + '>';
          }
        }
        return match;
      });
    }

    setHtml(h);
  }, [content]);

  // Lightbox: listen for clicks on images within the rendered content
  useEffect(() => {
    if (!html) return;
    const container = document.getElementById('blog-content-area');
    if (!container) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const src = target.getAttribute('src');
        if (src) setLightbox(src);
      }
    };
    container.addEventListener('click', handler);
    return () => container.removeEventListener('click', handler);
  }, [html]);

  // Glossary links: show the short explanation on hover/focus, navigate on click.
  useEffect(() => {
    if (!html) return;
    const container = document.getElementById('blog-content-area');
    if (!container) return;

    const show = (target: EventTarget | null) => {
      const anchor = (target as HTMLElement | null)?.closest?.('a.glossary-term-link') as HTMLAnchorElement | null;
      if (!anchor) return;
      const text = anchor.dataset.glossaryExplanation || anchor.title;
      if (!text) return;
      const rect = anchor.getBoundingClientRect();
      const above = rect.bottom + 130 > window.innerHeight;
      setGlossaryTooltip({
        text,
        left: Math.max(170, Math.min(window.innerWidth - 170, rect.left + rect.width / 2)),
        top: above ? rect.top - 8 : rect.bottom + 8,
        above,
      });
    };
    const hide = (event: Event) => {
      const related = (event as MouseEvent).relatedTarget as Node | null;
      const anchor = (event.target as HTMLElement | null)?.closest?.('a.glossary-term-link');
      if (anchor && related && anchor.contains(related)) return;
      setGlossaryTooltip(null);
    };
    const handleMouseOver = (event: MouseEvent) => show(event.target);
    const handleFocusIn = (event: FocusEvent) => show(event.target);

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', hide);
    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', hide);
    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', hide);
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', hide);
    };
  }, [html]);

  return (
    <>
      <div id="blog-content-area" className="blog-content" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />

      {glossaryTooltip && (
        <div role="tooltip" style={{
          position: 'fixed',
          zIndex: 1000,
          left: glossaryTooltip.left,
          top: glossaryTooltip.top,
          transform: glossaryTooltip.above ? 'translate(-50%, -100%)' : 'translateX(-50%)',
          width: 'min(320px, calc(100vw - 32px))',
          padding: '10px 12px',
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-accent)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-xs)',
          lineHeight: 1.5,
          pointerEvents: 'none',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}>
          <BookOpen size={14} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
          <span>{glossaryTooltip.text}</span>
        </div>
      )}

      {lightbox && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }} onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{
            position: 'absolute', top: 20, right: 20, background: 'none', border: 'none',
            color: '#fff', cursor: 'pointer', zIndex: 1,
          }}><X size={32} /></button>
          <img src={lightbox} alt="" style={{
            maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', cursor: 'default',
          }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
