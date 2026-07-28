import { codeToHtml } from 'shiki';

const CODE_BLOCK_RE = /<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/gi;

export async function highlightCodeBlocks(html: string): Promise<string> {
  const blocks: { match: string; lang: string; code: string }[] = [];
  let m: RegExpExecArray | null;

  CODE_BLOCK_RE.lastIndex = 0;
  while ((m = CODE_BLOCK_RE.exec(html)) !== null) {
    const lang = m[1] || 'text';
    const rawCode = m[2]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'");
    blocks.push({ match: m[0], lang, code: rawCode });
  }

  const highlighted: string[] = await Promise.all(
    blocks.map(async (b) => {
      try {
        return await codeToHtml(b.code, {
          lang: b.lang,
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        });
      } catch {
        return '<pre class="shiki-fallback"><code>' + b.match.replace(/<\/?[^>]+>/g, '') + '</code></pre>';
      }
    })
  );

  let result = html;
  for (let i = 0; i < blocks.length; i++) {
    const escaped = blocks[i].match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped), highlighted[i]);
  }

  return result;
}
