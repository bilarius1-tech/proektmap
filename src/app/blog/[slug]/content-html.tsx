'use client';

export default function ContentHtml({ content }: { content: string }) {
  let html = content || '';
  html = html.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\u0026/g, '&');
  html = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  return <div className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
