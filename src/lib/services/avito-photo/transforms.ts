import { UniquePreset, UniqueRecipe } from "./types";

export const PRESET_RECIPES: Record<UniquePreset, UniqueRecipe> = {
  natural: {
    name: "🟢 Natural (Бережный)",
    preset: "natural",
    cropMin: 0.5,
    cropMax: 2.0,
    rotateMin: -0.25,
    rotateMax: 0.25,
    brightnessMin: -2.5,
    brightnessMax: 2.5,
    contrastMin: -2.0,
    contrastMax: 2.5,
    saturationMin: -2.0,
    saturationMax: 2.0,
    noiseLevel: 15,
    subpixelShift: true,
    safeZoneProtection: true,
    exifProfile: "iphone_15_pro",
    cleanAiSignatures: true,
    qualityLevel: 0.94,
    targetSimilarityMin: 75,
    targetSimilarityMax: 90,
  },
  standard: {
    name: "🟡 Standard (Оптимальный для Авито)",
    preset: "standard",
    cropMin: 1.5,
    cropMax: 4.0,
    rotateMin: -0.5,
    rotateMax: 0.5,
    brightnessMin: -4.5,
    brightnessMax: 4.5,
    contrastMin: -4.0,
    contrastMax: 4.5,
    saturationMin: -3.5,
    saturationMax: 3.5,
    noiseLevel: 35,
    subpixelShift: true,
    safeZoneProtection: true,
    exifProfile: "random_mix",
    cleanAiSignatures: true,
    qualityLevel: 0.92,
    targetSimilarityMin: 65,
    targetSimilarityMax: 82,
  },
  mass_posting: {
    name: "🔵 Mass-Posting (Для серий объявлений)",
    preset: "mass_posting",
    cropMin: 2.5,
    cropMax: 6.0,
    rotateMin: -0.8,
    rotateMax: 0.8,
    brightnessMin: -6.0,
    brightnessMax: 6.0,
    contrastMin: -5.5,
    contrastMax: 6.0,
    saturationMin: -5.0,
    saturationMax: 5.0,
    noiseLevel: 55,
    subpixelShift: true,
    safeZoneProtection: true,
    exifProfile: "random_mix",
    cleanAiSignatures: true,
    qualityLevel: 0.90,
    targetSimilarityMin: 50,
    targetSimilarityMax: 75,
  },
  ai_studio: {
    name: "🟣 AI Studio (Product Lock)",
    preset: "ai_studio",
    cropMin: 1.0,
    cropMax: 3.0,
    rotateMin: -0.3,
    rotateMax: 0.3,
    brightnessMin: -3.0,
    brightnessMax: 3.0,
    contrastMin: -3.0,
    contrastMax: 3.0,
    saturationMin: -3.0,
    saturationMax: 3.0,
    noiseLevel: 25,
    subpixelShift: true,
    safeZoneProtection: true,
    exifProfile: "iphone_15_pro",
    cleanAiSignatures: true,
    qualityLevel: 0.93,
    targetSimilarityMin: 40,
    targetSimilarityMax: 70,
  },
  custom: {
    name: "⚙️ Пользовательский",
    preset: "custom",
    cropMin: 1.0,
    cropMax: 5.0,
    rotateMin: -0.5,
    rotateMax: 0.5,
    brightnessMin: -5.0,
    brightnessMax: 5.0,
    contrastMin: -5.0,
    contrastMax: 5.0,
    saturationMin: -4.0,
    saturationMax: 4.0,
    noiseLevel: 35,
    subpixelShift: true,
    safeZoneProtection: true,
    exifProfile: "random_mix",
    cleanAiSignatures: true,
    qualityLevel: 0.92,
    targetSimilarityMin: 60,
    targetSimilarityMax: 85,
  },
};

export interface MutationParams {
  crop: number;
  rotate: number;
  brightness: number;
  contrast: number;
  saturation: number;
  noise: number;
  shiftX: number;
  shiftY: number;
}

/**
 * Generates randomized but controlled parameters within a recipe range
 */
export function generateRandomParams(recipe: UniqueRecipe): MutationParams {
  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  // If safeZoneProtection is active, restrict subpixel shifts to avoid drifting 1:1 safe core
  const maxShift = recipe.safeZoneProtection ? 0.8 : 1.5;

  return {
    crop: rand(recipe.cropMin, recipe.cropMax),
    rotate: rand(recipe.rotateMin, recipe.rotateMax),
    brightness: rand(recipe.brightnessMin, recipe.brightnessMax),
    contrast: rand(recipe.contrastMin, recipe.contrastMax),
    saturation: rand(recipe.saturationMin, recipe.saturationMax),
    noise: rand(recipe.noiseLevel * 0.7, recipe.noiseLevel * 1.3),
    shiftX: rand(-maxShift, maxShift),
    shiftY: rand(-maxShift, maxShift),
  };
}

/**
 * Applies controlled transformations onto an image using Canvas 2D
 */
export function applyTransforms(
  img: HTMLImageElement,
  params: MutationParams,
  outputQuality: number = 0.92
): { canvas: HTMLCanvasElement; dataUrl: string; qualityScore: number } {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  // Max bounds for memory safety and fast web performance
  const maxDim = 1920;
  let targetW = origW;
  let targetH = origH;
  if (origW > maxDim || origH > maxDim) {
    const scale = Math.min(maxDim / origW, maxDim / origH);
    targetW = Math.round(origW * scale);
    targetH = Math.round(origH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Could not acquire 2D Canvas context");
  }

  // 1. Calculate Crop & Subpixel Pan
  const cropFactor = 1 - params.crop / 100;
  const srcW = origW * cropFactor;
  const srcH = origH * cropFactor;
  const maxOffsetX = (origW - srcW) / 2;
  const maxOffsetY = (origH - srcH) / 2;
  const offsetX = maxOffsetX + (params.shiftX / 100) * maxOffsetX;
  const offsetY = maxOffsetY + (params.shiftY / 100) * maxOffsetY;

  // 2. Rotate with edge bleed fix
  ctx.save();
  ctx.translate(targetW / 2, targetH / 2);
  ctx.rotate((params.rotate * Math.PI) / 180);
  ctx.translate(-targetW / 2, -targetH / 2);

  // Draw scaled & cropped source
  ctx.drawImage(img, offsetX, offsetY, srcW, srcH, 0, 0, targetW, targetH);
  ctx.restore();

  // 3. Apply Color Shifts & Micro-Noise via Pixel Array
  const imgData = ctx.getImageData(0, 0, targetW, targetH);
  const data = imgData.data;
  const len = data.length;

  const brightMult = 1 + params.brightness / 100;
  const contrastFactor = (259 * (params.contrast * 2.55 + 255)) / (255 * (259 - params.contrast * 2.55));
  const satMult = 1 + params.saturation / 100;
  const noiseAmp = (params.noise / 100) * 8; // max ~4-5 levels of high-frequency noise

  // Fast integer/float loop
  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    r *= brightMult;
    g *= brightMult;
    b *= brightMult;

    // Contrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // Saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + satMult * (r - gray);
    g = gray + satMult * (g - gray);
    b = gray + satMult * (b - gray);

    // High frequency micro-noise (pseudo-random per pixel)
    if (noiseAmp > 0) {
      const n = (Math.random() - 0.5) * noiseAmp;
      r += n;
      g += n;
      b += n;
    }

    // Clamp
    data[i] = r < 0 ? 0 : r > 255 ? 255 : r;
    data[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
    data[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
  }

  ctx.putImageData(imgData, 0, 0);

  // Calculate Quality Score (penalize extreme contrast/clipping)
  const qualityScore = Math.round(
    100 -
      Math.abs(params.brightness) * 1.2 -
      Math.abs(params.contrast) * 1.5 -
      Math.abs(params.rotate) * 3 -
      params.noise * 0.1
  );

  const dataUrl = canvas.toDataURL("image/jpeg", outputQuality);

  return {
    canvas,
    dataUrl,
    qualityScore: Math.min(100, Math.max(80, qualityScore)),
  };
}

/**
 * Crops any image to official Avito 4:3 ratio from center
 */
export function cropImageTo4x3(
  img: HTMLImageElement,
  outputQuality: number = 0.94
): { canvas: HTMLCanvasElement; dataUrl: string; width: number; height: number } {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const currentRatio = origW / (origH || 1);
  const targetRatio = 4 / 3;

  let srcX = 0;
  let srcY = 0;
  let srcW = origW;
  let srcH = origH;

  if (currentRatio > targetRatio) {
    // Too wide -> crop sides
    srcW = origH * targetRatio;
    srcX = (origW - srcW) / 2;
  } else {
    // Too tall -> crop top/bottom
    srcH = origW / targetRatio;
    srcY = (origH - srcH) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(srcW);
  canvas.height = Math.round(srcH);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", outputQuality);

  return { canvas, dataUrl, width: canvas.width, height: canvas.height };
}

/**
 * Fits any image into a 4:3 canvas with smart background fill (keeps full original image intact)
 */
export function padImageTo4x3(
  img: HTMLImageElement,
  fillMode: "blur" | "dark" | "white" = "blur",
  outputQuality: number = 0.94
): { canvas: HTMLCanvasElement; dataUrl: string; width: number; height: number } {
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;
  const currentRatio = origW / (origH || 1);
  const targetRatio = 4 / 3;

  let targetW = origW;
  let targetH = origH;

  if (currentRatio > targetRatio) {
    // Wider than 4:3 -> expand height
    targetH = Math.round(origW / targetRatio);
  } else {
    // Taller/square -> expand width
    targetW = Math.round(origH * targetRatio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  // Background fill
  if (fillMode === "blur") {
    // Draw stretched and blurred image background
    ctx.filter = "blur(28px) brightness(0.65) saturate(1.2)";
    ctx.drawImage(img, -20, -20, targetW + 40, targetH + 40);
    ctx.filter = "none";
  } else if (fillMode === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
  } else {
    ctx.fillStyle = "#121316";
    ctx.fillRect(0, 0, targetW, targetH);
  }

  // Center original image
  const destX = (targetW - origW) / 2;
  const destY = (targetH - origH) / 2;
  ctx.drawImage(img, destX, destY, origW, origH);

  const dataUrl = canvas.toDataURL("image/jpeg", outputQuality);
  return { canvas, dataUrl, width: targetW, height: targetH };
}
