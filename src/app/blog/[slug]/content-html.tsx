'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ContentHtml({ content, tocHeadings }: { content: string; tocHeadings?: { level: number; text: string; id: string }[] }) {
  const [html, setHtml] = useState('');
  const [lightbox, setLightbox] = useState<string | null>(null);

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

  return (
    <>
      <div id="blog-content-area" className="blog-content" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />

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
