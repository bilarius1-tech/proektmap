'use client';

import { useEffect, useState } from 'react';

export default function ContentHtml({ content }: { content: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let h = content || '';
    // Fix RSC unicode escapes
    h = h.replace(/\u003c/g, '<').replace(/\u003e/g, '>').replace(/\u0026/g, '&');
    h = h.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    // Fix old upload paths to use API
    h = h.replace(/src="\/uploads\//g, 'src="/api/media/');
    setHtml(h);
  }, [content]);

  return <div className="blog-content" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
