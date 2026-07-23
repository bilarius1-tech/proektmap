import { getDb } from './src/lib/db/index';

async function main() {
  const db = await getDb();

  interface Rel {
    sourceType: string;
    sourceSlug: string;
    targetType: string;
    targetSlug: string;
    relType: string;
    weight: number;
  }

  const rels: Rel[] = [
    // =====================================================
    // AI Tools → Glossary (uses)
    // =====================================================
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "glossary", targetSlug: "agent", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "glossary", targetSlug: "prompt", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "glossary", targetSlug: "frontend", relType: "uses", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "glossary", targetSlug: "refactor", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "glossary", targetSlug: "nextjs", relType: "uses", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "reasonix", targetType: "glossary", targetSlug: "agent", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "reasonix", targetType: "glossary", targetSlug: "refactor", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "reasonix", targetType: "glossary", targetSlug: "iteration", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "reasonix", targetType: "glossary", targetSlug: "token", relType: "uses", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "vibecraft", targetType: "glossary", targetSlug: "frontend", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "vibecraft", targetType: "glossary", targetSlug: "prompt", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "vibecraft", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "vibecraft", targetType: "glossary", targetSlug: "mvp", relType: "uses", weight: 4 },

    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "glossary", targetSlug: "agent", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "glossary", targetSlug: "refactor", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "glossary", targetSlug: "backend", relType: "uses", weight: 4 },

    { sourceType: "ai-tool", sourceSlug: "aider", targetType: "glossary", targetSlug: "git-glossary", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "aider", targetType: "glossary", targetSlug: "iteration", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "aider", targetType: "glossary", targetSlug: "refactor", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "aider", targetType: "glossary", targetSlug: "token", relType: "uses", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "glossary", targetSlug: "supabase", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "glossary", targetSlug: "frontend", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "glossary", targetSlug: "database", relType: "uses", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "bolt-new", targetType: "glossary", targetSlug: "nextjs", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "bolt-new", targetType: "glossary", targetSlug: "frontend", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "bolt-new", targetType: "glossary", targetSlug: "backend", relType: "uses", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "bolt-new", targetType: "glossary", targetSlug: "supabase", relType: "uses", weight: 4 },

    { sourceType: "ai-tool", sourceSlug: "v0-by-vercel", targetType: "glossary", targetSlug: "react", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "v0-by-vercel", targetType: "glossary", targetSlug: "tailwind-css-stack", relType: "uses", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "v0-by-vercel", targetType: "glossary", targetSlug: "frontend", relType: "uses", weight: 4 },

    { sourceType: "ai-tool", sourceSlug: "gigacode", targetType: "glossary", targetSlug: "refactor", relType: "uses", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "gigacode", targetType: "glossary", targetSlug: "backend", relType: "uses", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "gigacode", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },

    // =====================================================
    // AI Tools → Prompts (used-in)
    // =====================================================
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "prompt", targetSlug: "seo-auditor", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "prompt", targetSlug: "saas-architect", relType: "used-in", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "prompt", targetSlug: "code-reviewer", relType: "used-in", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "prompt", targetSlug: "docs-generator", relType: "used-in", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "reasonix", targetType: "prompt", targetSlug: "code-reviewer", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "reasonix", targetType: "prompt", targetSlug: "saas-architect", relType: "used-in", weight: 4 },

    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "prompt", targetSlug: "saas-architect", relType: "used-in", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "prompt", targetSlug: "mcp-builder", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "prompt", targetSlug: "code-reviewer", relType: "used-in", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "v0-by-vercel", targetType: "prompt", targetSlug: "design-system", relType: "used-in", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "v0-by-vercel", targetType: "prompt", targetSlug: "docs-generator", relType: "used-in", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "vibecraft", targetType: "prompt", targetSlug: "design-system", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "vibecraft", targetType: "prompt", targetSlug: "site-consultant", relType: "used-in", weight: 4 },

    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "prompt", targetSlug: "site-consultant", relType: "used-in", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "prompt", targetSlug: "design-system", relType: "used-in", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "bolt-new", targetType: "prompt", targetSlug: "mcp-builder", relType: "used-in", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "aider", targetType: "prompt", targetSlug: "code-reviewer", relType: "used-in", weight: 4 },

    // =====================================================
    // AI Tools → Patterns (used-in)
    // =====================================================
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "pattern", targetSlug: "ai-consultant", relType: "used-in", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "pattern", targetSlug: "ai-seo-auditor", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "pattern", targetSlug: "telegram-orders", relType: "used-in", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "cursor", targetType: "pattern", targetSlug: "ai-landing", relType: "used-in", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "pattern", targetSlug: "ai-consultant", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "pattern", targetSlug: "ai-seo-auditor", relType: "used-in", weight: 3 },
    { sourceType: "ai-tool", sourceSlug: "lovable", targetType: "pattern", targetSlug: "ai-landing", relType: "used-in", weight: 4 },

    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "pattern", targetSlug: "ai-consultant", relType: "used-in", weight: 5 },
    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "pattern", targetSlug: "ai-landing", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "claude-code", targetType: "pattern", targetSlug: "business-dashboard", relType: "used-in", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "aider", targetType: "pattern", targetSlug: "ai-consultant", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "aider", targetType: "pattern", targetSlug: "ai-content-generator", relType: "used-in", weight: 3 },

    { sourceType: "ai-tool", sourceSlug: "bolt-new", targetType: "pattern", targetSlug: "ai-landing", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "v0-by-vercel", targetType: "pattern", targetSlug: "ai-landing", relType: "used-in", weight: 4 },
    { sourceType: "ai-tool", sourceSlug: "vibecraft", targetType: "pattern", targetSlug: "ai-consultant", relType: "used-in", weight: 3 },

    // =====================================================
    // MCP → Glossary (uses)
    // =====================================================
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "glossary", targetSlug: "git-glossary", relType: "uses", weight: 5 },
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 4 },
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "glossary", targetSlug: "token", relType: "uses", weight: 3 },

    { sourceType: "mcp", sourceSlug: "firecrawl-mcp", targetType: "glossary", targetSlug: "seo-glossary", relType: "uses", weight: 5 },
    { sourceType: "mcp", sourceSlug: "firecrawl-mcp", targetType: "glossary", targetSlug: "sitemap-glossary", relType: "uses", weight: 4 },
    { sourceType: "mcp", sourceSlug: "firecrawl-mcp", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },

    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "glossary", targetSlug: "database", relType: "uses", weight: 5 },
    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "glossary", targetSlug: "supabase", relType: "uses", weight: 5 },
    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },

    { sourceType: "mcp", sourceSlug: "telegram-mcp", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 4 },
    { sourceType: "mcp", sourceSlug: "telegram-mcp", targetType: "glossary", targetSlug: "prompt", relType: "uses", weight: 3 },
    { sourceType: "mcp", sourceSlug: "telegram-mcp", targetType: "glossary", targetSlug: "token", relType: "uses", weight: 3 },

    { sourceType: "mcp", sourceSlug: "filesystem", targetType: "glossary", targetSlug: "token", relType: "uses", weight: 2 },
    { sourceType: "mcp", sourceSlug: "filesystem", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 2 },

    { sourceType: "mcp", sourceSlug: "postgres-mcp", targetType: "glossary", targetSlug: "database", relType: "uses", weight: 5 },
    { sourceType: "mcp", sourceSlug: "postgres-mcp", targetType: "glossary", targetSlug: "api", relType: "uses", weight: 3 },

    // =====================================================
    // MCP → AI Tools (used-with)
    // =====================================================
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "ai-tool", targetSlug: "cursor", relType: "used-with", weight: 5 },
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "ai-tool", targetSlug: "reasonix", relType: "used-with", weight: 4 },
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "ai-tool", targetSlug: "windsurf-devin-desktop", relType: "used-with", weight: 3 },

    { sourceType: "mcp", sourceSlug: "firecrawl-mcp", targetType: "ai-tool", targetSlug: "cursor", relType: "used-with", weight: 5 },
    { sourceType: "mcp", sourceSlug: "firecrawl-mcp", targetType: "ai-tool", targetSlug: "aider", relType: "used-with", weight: 3 },

    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "ai-tool", targetSlug: "cursor", relType: "used-with", weight: 4 },
    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "ai-tool", targetSlug: "lovable", relType: "used-with", weight: 5 },
    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "ai-tool", targetSlug: "bolt-new", relType: "used-with", weight: 4 },

    { sourceType: "mcp", sourceSlug: "postgres-mcp", targetType: "ai-tool", targetSlug: "cursor", relType: "used-with", weight: 3 },
    { sourceType: "mcp", sourceSlug: "postgres-mcp", targetType: "ai-tool", targetSlug: "claude-code", relType: "used-with", weight: 3 },

    { sourceType: "mcp", sourceSlug: "telegram-mcp", targetType: "ai-tool", targetSlug: "cursor", relType: "used-with", weight: 3 },
    { sourceType: "mcp", sourceSlug: "telegram-mcp", targetType: "ai-tool", targetSlug: "vibecraft", relType: "used-with", weight: 3 },

    // =====================================================
    // MCP → Patterns (used-in)
    // =====================================================
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "pattern", targetSlug: "ai-consultant", relType: "used-in", weight: 4 },
    { sourceType: "mcp", sourceSlug: "github-mcp", targetType: "pattern", targetSlug: "telegram-orders", relType: "used-in", weight: 3 },

    { sourceType: "mcp", sourceSlug: "firecrawl-mcp", targetType: "pattern", targetSlug: "ai-seo-auditor", relType: "used-in", weight: 5 },

    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "pattern", targetSlug: "ai-consultant", relType: "used-in", weight: 4 },
    { sourceType: "mcp", sourceSlug: "supabase-mcp", targetType: "pattern", targetSlug: "ai-landing", relType: "used-in", weight: 3 },

    { sourceType: "mcp", sourceSlug: "telegram-mcp", targetType: "pattern", targetSlug: "telegram-orders", relType: "used-in", weight: 5 },
    { sourceType: "mcp", sourceSlug: "telegram-mcp", targetType: "pattern", targetSlug: "telegram-support-bot", relType: "used-in", weight: 4 },

    // =====================================================
    // Patterns → Glossary (depends-on)
    // =====================================================
    { sourceType: "pattern", sourceSlug: "ai-consultant", targetType: "glossary", targetSlug: "agent", relType: "depends-on", weight: 5 },
    { sourceType: "pattern", sourceSlug: "ai-consultant", targetType: "glossary", targetSlug: "rag", relType: "depends-on", weight: 4 },
    { sourceType: "pattern", sourceSlug: "ai-consultant", targetType: "glossary", targetSlug: "frontend", relType: "depends-on", weight: 3 },
    { sourceType: "pattern", sourceSlug: "ai-consultant", targetType: "glossary", targetSlug: "api", relType: "depends-on", weight: 4 },

    { sourceType: "pattern", sourceSlug: "telegram-orders", targetType: "glossary", targetSlug: "api", relType: "depends-on", weight: 4 },
    { sourceType: "pattern", sourceSlug: "telegram-orders", targetType: "glossary", targetSlug: "prompt", relType: "depends-on", weight: 3 },
    { sourceType: "pattern", sourceSlug: "telegram-orders", targetType: "glossary", targetSlug: "saas", relType: "depends-on", weight: 4 },

    { sourceType: "pattern", sourceSlug: "ai-seo-auditor", targetType: "glossary", targetSlug: "seo-glossary", relType: "depends-on", weight: 5 },
    { sourceType: "pattern", sourceSlug: "ai-seo-auditor", targetType: "glossary", targetSlug: "sitemap-glossary", relType: "depends-on", weight: 4 },
    { sourceType: "pattern", sourceSlug: "ai-seo-auditor", targetType: "glossary", targetSlug: "api", relType: "depends-on", weight: 3 },

    { sourceType: "pattern", sourceSlug: "ai-landing", targetType: "glossary", targetSlug: "frontend", relType: "depends-on", weight: 4 },
    { sourceType: "pattern", sourceSlug: "ai-landing", targetType: "glossary", targetSlug: "mvp-glossary", relType: "depends-on", weight: 4 },
    { sourceType: "pattern", sourceSlug: "ai-landing", targetType: "glossary", targetSlug: "saas", relType: "depends-on", weight: 5 },

    // =====================================================
    // Patterns → AI Tools (uses)
    // =====================================================
    { sourceType: "pattern", sourceSlug: "ai-consultant", targetType: "ai-tool", targetSlug: "cursor", relType: "uses", weight: 5 },
    { sourceType: "pattern", sourceSlug: "ai-consultant", targetType: "ai-tool", targetSlug: "lovable", relType: "uses", weight: 4 },
    { sourceType: "pattern", sourceSlug: "ai-seo-auditor", targetType: "ai-tool", targetSlug: "cursor", relType: "uses", weight: 4 },
    { sourceType: "pattern", sourceSlug: "ai-landing", targetType: "ai-tool", targetSlug: "vibecraft", relType: "uses", weight: 4 },
    { sourceType: "pattern", sourceSlug: "telegram-orders", targetType: "ai-tool", targetSlug: "cursor", relType: "uses", weight: 3 },
    { sourceType: "pattern", sourceSlug: "business-dashboard", targetType: "ai-tool", targetSlug: "cursor", relType: "uses", weight: 3 },
  ];

  console.log('Seeding ' + rels.length + ' relations...');
  console.log('');

  let ok = 0;
  let err = 0;

  for (const r of rels) {
    try {
      await db.relation.upsert({
        where: {
          sourceType_sourceSlug_targetType_targetSlug: {
            sourceType: r.sourceType,
            sourceSlug: r.sourceSlug,
            targetType: r.targetType,
            targetSlug: r.targetSlug,
          },
        },
        create: {
          sourceType: r.sourceType,
          sourceSlug: r.sourceSlug,
          targetType: r.targetType,
          targetSlug: r.targetSlug,
          relType: r.relType,
          weight: r.weight,
        },
        update: {
          relType: r.relType,
          weight: r.weight,
        },
      });
      ok++;
      console.log('OK [' + ok + '/' + rels.length + ']: ' + r.sourceSlug + ' → ' + r.targetSlug);
    } catch (e) {
      err++;
      console.log('ERR: ' + r.sourceSlug + ' → ' + r.targetSlug + ': ' + (e as any).message);
    }
  }

  console.log('');
  console.log('Done: ' + ok + ' success, ' + err + ' errors');
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
