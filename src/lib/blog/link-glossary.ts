export type BlogGlossaryTerm = {
  term: string;
  slug: string;
  explanation: string;
};

const BLOCKED_TAGS = new Set(["a", "code", "pre", "script", "style", "h1", "h2", "h3", "h4", "h5", "h6"]);

function normalize(value: string): string {
  return value.toLocaleLowerCase("ru").replace(/ё/g, "е").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function linkGlossaryTerms(html: string, terms: BlogGlossaryTerm[], limit = 12): string {
  const validTerms = terms
    .filter((item) => item.term.trim().length >= 2 && item.slug.trim())
    .sort((a, b) => b.term.length - a.term.length);
  if (!html || validTerms.length === 0 || limit <= 0) return html;

  const byTerm = new Map(validTerms.map((item) => [normalize(item.term), item]));
  const alternatives = validTerms.map((item) => escapeRegExp(item.term.trim())).join("|");
  const termPattern = new RegExp(`(^|[^a-zа-яё0-9])(${alternatives})(?=$|[^a-zа-яё0-9])`, "giu");
  const linkedSlugs = new Set<string>();
  const parts = html.split(/(<[^>]+>)/g);
  let blockedDepth = 0;

  return parts.map((part) => {
    if (part.startsWith("<")) {
      const closing = part.match(/^<\s*\/\s*([a-z0-9]+)/i);
      const opening = part.match(/^<\s*([a-z0-9]+)/i);
      if (closing && BLOCKED_TAGS.has(closing[1].toLowerCase())) {
        blockedDepth = Math.max(0, blockedDepth - 1);
      } else if (opening && BLOCKED_TAGS.has(opening[1].toLowerCase()) && !/\/\s*>$/.test(part)) {
        blockedDepth++;
      }
      return part;
    }

    if (blockedDepth > 0 || linkedSlugs.size >= limit) return part;

    return part.replace(termPattern, (match, prefix: string, matchedTerm: string) => {
      const item = byTerm.get(normalize(matchedTerm));
      if (!item || linkedSlugs.has(item.slug) || linkedSlugs.size >= limit) return match;
      linkedSlugs.add(item.slug);
      const explanation = escapeAttribute(item.explanation || `Термин «${item.term}» в глоссарии ProektMap`);
      return `${prefix}<a class="glossary-term-link" href="/glossary/${encodeURIComponent(item.slug)}" title="${explanation}" data-glossary-explanation="${explanation}">${matchedTerm}</a>`;
    });
  }).join("");
}
