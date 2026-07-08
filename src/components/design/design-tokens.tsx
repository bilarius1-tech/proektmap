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

  // Map accent to light/dark variants
  const accentLight = accent + "15";
  const radiusS = radius > 0 ? radius + "px" : "0";
  const radiusM = radius > 0 ? (radius + 4) + "px" : "0";
  const radiusL = radius > 0 ? (radius + 8) + "px" : "0";
  const radiusFull = radius > 0 ? "9999px" : "0";

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
      --radius-s: ${radiusS};
      --radius-m: ${radiusM};
      --radius-l: ${radiusL};
      --radius-full: ${radiusFull};
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
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
