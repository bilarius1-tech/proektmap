import { getDb } from "@/lib/db/index";

export default async function DesignTokens() {
  let accent = "#0fb880";
  let headingFont = "Montserrat";
  let bodyFont = "Inter";
  let radius = 0;

  try {
    const db = await getDb();
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (settings) {
      if (settings.accentColor) accent = settings.accentColor;
      if (settings.headingFont) headingFont = settings.headingFont;
      if (settings.bodyFont) bodyFont = settings.bodyFont;
      radius = settings.borderRadius ?? 0;
    }
  } catch {}

  const accentLight = accent + "20";
  const r = (n: number) => radius > 0 ? (radius + n) + "px" : "0";

  const css = `
    :root {
      --color-accent: ${accent};
      --color-accent-light: ${accentLight};
      --color-bg-primary: #ffffff;
      --color-bg-secondary: #f5f5f3;
      --color-bg-tertiary: #ebebe8;
      --color-text-primary: #1a1a1a;
      --color-text-secondary: #5c5c50;
      --color-text-tertiary: #8c8c80;
      --color-border: #d4d4cc;
      --color-border-light: #e5e5e0;
      --color-warning: #f59e0b;
      --color-warning-light: #fef3c7;
      --color-error: #e53e3e;
      --color-error-light: #fed7d7;
      --font-heading: "${headingFont}", "Inter", sans-serif;
      --font-body: "${bodyFont}", "Inter", sans-serif;
      --font-mono: "JetBrains Mono", "Fira Code", monospace;
      --radius-s: ${r(0)};
      --radius-m: ${r(4)};
      --radius-l: ${r(8)};
      --radius-full: ${radius > 0 ? "9999px" : "0"};
      --shadow-s: ${radius > 4 ? "0 2px 8px rgba(0,0,0,0.06)" : "none"};
      --shadow-l: ${radius > 4 ? "0 4px 16px rgba(0,0,0,0.08)" : "none"};
      --text-xs: 12px;
      --text-s: 14px;
      --text-m: 16px;
      --text-l: 20px;
      --text-xl: 28px;
      --text-xxl: 36px;
      --text-xxxl: 48px;
      --space-xs: 4px;
      --space-s: 8px;
      --space-m: 16px;
      --space-l: 24px;
      --space-xl: 40px;
    }

    /* Dark theme — Swiss monochrome */
    [data-theme="dark"] {
      --color-bg-primary: #1a1a1a;
      --color-bg-secondary: #242424;
      --color-bg-tertiary: #2e2e2e;
      --color-text-primary: #f5f5f3;
      --color-text-secondary: #b0b0a4;
      --color-text-tertiary: #6e6e64;
      --color-border: #3e3e38;
      --color-border-light: #2e2e2a;
      --color-warning-light: #3d2e00;
      --color-error-light: #3d1010;
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
