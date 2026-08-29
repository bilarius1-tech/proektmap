import fs from "fs";
import path from "path";
import { SITE_TREE, PUBLIC_SEO_ROUTES } from "../src/app/sitemap/site-map-data";

// Directories/prefixes that should not be in the public SEO sitemap
const PRIVATE_OR_INTERNAL_PREFIXES = [
  "/admin",
  "/dashboard",
  "/verify",
  "/api",
  "/projects",
  "/profile",
];

// Dynamic parameter patterns that are generated dynamically in sitemap.ts
const KNOWN_DYNAMIC_GENERATORS: Record<string, string> = {
  "/skills/[slug]": "CAPABILITY_SKILLS (static array)",
  "/glossary/[slug]": "db.glossaryTerm (Prisma)",
  "/blog/[slug]": "db.blogPost (Prisma)",
  "/ai-tools/[slug]": "db.aITool (Prisma)",
  "/mcp/[slug]": "db.mCPServer (Prisma)",
  "/solutions/[slug]": "db.solution (Prisma)",
  "/patterns/[slug]": "db.buildPattern (Prisma)",
  "/russian-ai/[slug]": "db.russianAIProject (Prisma)",
  "/ai-workshop/[slug]": "db.aiProject (Prisma)",
  "/sandbox/creative-library/[slug]": "CREATIVE_TOOLS (data)",
  "/sandbox/vibe-blocks/[slug]": "VIBE_KITS (data)",
  "/ui-patterns/[slug]": "UI_PATTERNS (data)",
  "/blueprints/[slug]": "Legacy / DB",
  "/[blueprint]": "Legacy / DB",
  "/blog/author/[email]": "Dynamic author",
};

interface ValidationResult {
  errors: string[];
  warnings: string[];
  stats: {
    totalPagesFound: number;
    staticPublicPages: number;
    dynamicPublicPages: number;
    privatePages: number;
    sitemapTreeEntries: number;
    publicSeoRoutes: number;
  };
}

function findPageFiles(dir: string, baseDir: string = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let pages: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pages = pages.concat(findPageFiles(fullPath, baseDir));
    } else if (entry.name === "page.tsx" || entry.name === "page.ts" || entry.name === "page.js") {
      pages.push(fullPath);
    }
  }

  return pages;
}

function filePathToRoute(filePath: string, appDir: string): string {
  const relative = path.relative(appDir, filePath);
  let route = "/" + path.dirname(relative).replace(/\\/g, "/");
  if (route === "/.") route = "/";
  return route;
}

function extractAllHrefsFromTree(): string[] {
  const hrefs: string[] = [];
  function traverse(items: any[]) {
    for (const item of items) {
      if (item.href) hrefs.push(item.href);
      if (item.children && Array.isArray(item.children)) {
        traverse(item.children);
      }
    }
  }
  for (const group of SITE_TREE) {
    traverse(group.items);
  }
  return hrefs;
}

export function validateSitemap(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const appDir = path.resolve(process.cwd(), "src/app");
  if (!fs.existsSync(appDir)) {
    errors.push(`Директория app не найдена: ${appDir}`);
    return { errors, warnings, stats: { totalPagesFound: 0, staticPublicPages: 0, dynamicPublicPages: 0, privatePages: 0, sitemapTreeEntries: 0, publicSeoRoutes: 0 } };
  }

  const pageFiles = findPageFiles(appDir);
  const treeHrefs = extractAllHrefsFromTree();
  const treeHrefsSet = new Set(treeHrefs);
  const publicSeoRoutesSet = new Set(PUBLIC_SEO_ROUTES);

  let staticPublicCount = 0;
  let dynamicPublicCount = 0;
  let privateCount = 0;

  // 1. Check all discovered pages in src/app
  for (const file of pageFiles) {
    const route = filePathToRoute(file, appDir);

    // Private / Internal routes
    const isPrivate = PRIVATE_OR_INTERNAL_PREFIXES.some(prefix => route === prefix || route.startsWith(prefix + "/"));
    if (isPrivate) {
      privateCount++;
      // Ensure private route is NOT in PUBLIC_SEO_ROUTES
      if (publicSeoRoutesSet.has(route)) {
        errors.push(`Приватный маршрут ${route} попал в PUBLIC_SEO_ROUTES (sitemap.xml)!`);
      }
      continue;
    }

    // Dynamic routes (e.g. /skills/[slug])
    if (route.includes("[")) {
      dynamicPublicCount++;
      if (!KNOWN_DYNAMIC_GENERATORS[route]) {
        warnings.push(`Динамический маршрут ${route} не зарегистрирован в KNOWN_DYNAMIC_GENERATORS. Проверьте, добавлен ли он в sitemap.ts.`);
      }
      continue;
    }

    // Static public routes
    staticPublicCount++;

    // Check if present in SITE_TREE (site-map-data.ts)
    if (!treeHrefsSet.has(route)) {
      errors.push(`Страница ${route} (${path.relative(process.cwd(), file)}) отсутствует в SITE_TREE (src/app/sitemap/site-map-data.ts)!`);
    }

    // Check if present in PUBLIC_SEO_ROUTES
    if (!publicSeoRoutesSet.has(route)) {
      // Special check: is it an intentionally excluded public technical endpoint?
      const allowedExclusions = ["/sitemap.xml", "/llms.txt", "/blog/rss.xml"];
      if (!allowedExclusions.includes(route)) {
        warnings.push(`Страница ${route} есть в SITE_TREE, но не попала в PUBLIC_SEO_ROUTES.`);
      }
    }

    // Check Metadata in page.tsx
    const fileContent = fs.readFileSync(file, "utf8");
    const hasMetadata = fileContent.includes("export const metadata") ||
      fileContent.includes("export async function generateMetadata") ||
      fileContent.includes("export function generateMetadata") ||
      fileContent.includes("Metadata =");

    if (!hasMetadata) {
      // Check if it's a client-only wrapper with metadata in parent or special component
      if (!fileContent.includes('"use client"') && !fileContent.includes("'use client'")) {
        warnings.push(`Страница ${route} (${path.relative(process.cwd(), file)}) не содержит явного экспорта metadata / generateMetadata.`);
      }
    }
  }

  // 2. Check if SITE_TREE has dead links (hrefs that do not exist in src/app)
  const existingRoutesSet = new Set(pageFiles.map(f => filePathToRoute(f, appDir)));
  for (const href of treeHrefs) {
    if (href.startsWith("http") || href.endsWith(".xml") || href.endsWith(".txt")) continue;
    if (!existingRoutesSet.has(href)) {
      // Is it a known sub-path or dynamic route?
      const matchesExisting = pageFiles.some(f => {
        const r = filePathToRoute(f, appDir);
        if (r === href) return true;
        // Check if matching dynamic pattern e.g. /skills/saas-architecture -> /skills/[slug]
        const rPattern = "^" + r.replace(/\[[^\]]+\]/g, "[^/]+") + "$";
        return new RegExp(rPattern).test(href);
      });

      if (!matchesExisting) {
        errors.push(`В карте сайта (SITE_TREE) указан маршрут ${href}, но соответствующий файл src/app${href}/page.tsx не существует!`);
      }
    }
  }

  // 3. Check for duplicates in SITE_TREE
  const seenHrefs = new Set<string>();
  const duplicates: string[] = [];
  for (const href of treeHrefs) {
    if (seenHrefs.has(href)) {
      duplicates.push(href);
    } else {
      seenHrefs.add(href);
    }
  }
  if (duplicates.length > 0) {
    warnings.push(`Дубликаты ссылок в SITE_TREE: ${duplicates.join(", ")}`);
  }

  return {
    errors,
    warnings,
    stats: {
      totalPagesFound: pageFiles.length,
      staticPublicPages: staticPublicCount,
      dynamicPublicPages: dynamicPublicCount,
      privatePages: privateCount,
      sitemapTreeEntries: treeHrefs.length,
      publicSeoRoutes: PUBLIC_SEO_ROUTES.length,
    },
  };
}

// Run CLI
if (require.main === module || process.argv[1]?.includes("validate-sitemap")) {
  console.log("🔍 Проверка карты сайта и SEO-маршрутов ProektMap...\n");
  const result = validateSitemap();

  console.log("📊 Статистика:");
  console.log(`   - Всего файлов page.tsx: ${result.stats.totalPagesFound}`);
  console.log(`   - Публичных статических страниц: ${result.stats.staticPublicPages}`);
  console.log(`   - Динамических шаблонов ([slug]): ${result.stats.dynamicPublicPages}`);
  console.log(`   - Приватных/админ страниц: ${result.stats.privatePages}`);
  console.log(`   - Пунктов в дереве SITE_TREE: ${result.stats.sitemapTreeEntries}`);
  console.log(`   - Страниц в PUBLIC_SEO_ROUTES (sitemap.xml): ${result.stats.publicSeoRoutes}\n`);

  if (result.warnings.length > 0) {
    console.log(`⚠️  Предупреждения (${result.warnings.length}):`);
    for (const w of result.warnings) {
      console.log(`   • ${w}`);
    }
    console.log("");
  }

  if (result.errors.length > 0) {
    console.error(`❌ ОШИБКИ (${result.errors.length}):`);
    for (const err of result.errors) {
      console.error(`   ✖ ${err}`);
    }
    console.error("\n❌ Проверка не пройдена! Зарегистрируйте недостающие страницы в src/app/sitemap/site-map-data.ts\n");
    process.exit(1);
  } else {
    console.log("✅ ВСЕ страницы корректно зарегистрированы в карте сайта и SEO-конфигурации!");
    process.exit(0);
  }
}
