import { ImageAnalysis } from "./types";

/**
 * Calculates 64-bit difference hash (dHash) from image data
 */
export function computeDHash(ctx: CanvasRenderingContext2D, width: number, height: number): string {
  // Create offscreen canvas 9x8 for gradient comparison
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 9;
  tempCanvas.height = 8;
  const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
  if (!tempCtx) return "0".repeat(64);

  tempCtx.drawImage(ctx.canvas, 0, 0, 9, 8);
  const imgData = tempCtx.getImageData(0, 0, 9, 8).data;

  // Convert to grayscale 9x8 matrix
  const grays: number[][] = [];
  for (let y = 0; y < 8; y++) {
    const row: number[] = [];
    for (let x = 0; x < 9; x++) {
      const idx = (y * 9 + x) * 4;
      // standard luminance formula: 0.299 R + 0.587 G + 0.114 B
      const gray = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
      row.push(gray);
    }
    grays.push(row);
  }

  // Compare adjacent pixels
  let hash = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      hash += grays[y][x] < grays[y][x + 1] ? "1" : "0";
    }
  }

  return hash;
}

/**
 * Calculates 64-bit Perceptual Hash (pHash) using DCT approximation on 32x32 sample
 */
export function computePHash(ctx: CanvasRenderingContext2D): string {
  const size = 32;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = size;
  tempCanvas.height = size;
  const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
  if (!tempCtx) return "0".repeat(64);

  tempCtx.drawImage(ctx.canvas, 0, 0, size, size);
  const imgData = tempCtx.getImageData(0, 0, size, size).data;

  // 32x32 Grayscale matrix
  const matrix: number[][] = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      row.push(0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2]);
    }
    matrix.push(row);
  }

  // 1D DCT on rows and cols for top-left 8x8 low frequencies
  const dctMatrix: number[][] = [];
  for (let u = 0; u < 8; u++) {
    const row: number[] = [];
    for (let v = 0; v < 8; v++) {
      let sum = 0;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          sum +=
            matrix[y][x] *
            Math.cos(((2 * x + 1) * u * Math.PI) / (2 * size)) *
            Math.cos(((2 * y + 1) * v * Math.PI) / (2 * size));
        }
      }
      const alphaU = u === 0 ? 1 / Math.sqrt(size) : Math.sqrt(2 / size);
      const alphaV = v === 0 ? 1 / Math.sqrt(size) : Math.sqrt(2 / size);
      row.push(sum * alphaU * alphaV);
    }
    dctMatrix.push(row);
  }

  // Compute average of 8x8 DCT (excluding DC term [0][0])
  let total = 0;
  for (let u = 0; u < 8; u++) {
    for (let v = 0; v < 8; v++) {
      if (u === 0 && v === 0) continue;
      total += dctMatrix[u][v];
    }
  }
  const avg = total / 63;

  // Build 64-bit hash
  let hash = "";
  for (let u = 0; u < 8; u++) {
    for (let v = 0; v < 8; v++) {
      hash += dctMatrix[u][v] > avg ? "1" : "0";
    }
  }

  return hash;
}

/**
 * Calculates Hamming distance between two binary hash strings
 */
export function hammingDistance(hash1: string, hash2: string): number {
  let dist = 0;
  const len = Math.min(hash1.length, hash2.length);
  for (let i = 0; i < len; i++) {
    if (hash1[i] !== hash2[i]) {
      dist++;
    }
  }
  return dist + Math.abs(hash1.length - hash2.length);
}

/**
 * Calculates 64-bin 3D RGB Color Histogram (4 bins per R, G, B channel -> 4x4x4 = 64)
 */
export function computeColorHistogram(ctx: CanvasRenderingContext2D, width: number, height: number): number[] {
  // Downsample to 64x64 for ultra-fast color distribution profiling
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = 64;
  sampleCanvas.height = 64;
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) return new Array(64).fill(0);

  sampleCtx.drawImage(ctx.canvas, 0, 0, 64, 64);
  const data = sampleCtx.getImageData(0, 0, 64, 64).data;
  const totalPixels = 64 * 64;
  const hist = new Array(64).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    const rBin = Math.min(3, Math.floor(data[i] / 64));
    const gBin = Math.min(3, Math.floor(data[i + 1] / 64));
    const bBin = Math.min(3, Math.floor(data[i + 2] / 64));
    const binIdx = rBin * 16 + gBin * 4 + bBin;
    hist[binIdx]++;
  }

  // Normalize histogram to 0..1
  for (let i = 0; i < 64; i++) {
    hist[i] = hist[i] / totalPixels;
  }

  return hist;
}

/**
 * Calculates Color Histogram Intersection similarity (0 - 100%)
 */
export function calculateColorSimilarity(hist1: number[], hist2: number[]): number {
  if (!hist1 || !hist2 || hist1.length !== 64 || hist2.length !== 64) return 100;
  let intersection = 0;
  for (let i = 0; i < 64; i++) {
    intersection += Math.min(hist1[i], hist2[i]);
  }
  return Math.round(Math.min(1, Math.max(0, intersection)) * 100);
}

/**
 * Calculates structural similarity percentage (100% = identical, 0% = completely different)
 * Combines pHash (65% weight) and dHash (35% weight)
 */
export function calculateSimilarity(
  pHash1: string,
  dHash1: string,
  pHash2: string,
  dHash2: string
): number {
  const pDist = hammingDistance(pHash1, pHash2); // 0 to 64
  const dDist = hammingDistance(dHash1, dHash2); // 0 to 64

  // In perceptual hashing, 0-10 bits difference means highly similar / duplicate
  // Distance of 32+ is effectively uncorrelated (0% similar)
  const pSim = Math.max(0, 1 - pDist / 32);
  const dSim = Math.max(0, 1 - dDist / 32);

  const weightedScore = pSim * 0.65 + dSim * 0.35;
  return Math.round(weightedScore * 100);
}

/**
 * Calculates Comprehensive Similarity combining Structural (65%) + Color Histogram (35%)
 */
export function calculateComprehensiveSimilarity(
  pHash1: string,
  dHash1: string,
  hist1: number[],
  pHash2: string,
  dHash2: string,
  hist2: number[]
): { structural: number; color: number; overall: number } {
  const structural = calculateSimilarity(pHash1, dHash1, pHash2, dHash2);
  const color = calculateColorSimilarity(hist1, hist2);
  const overall = Math.round(structural * 0.65 + color * 0.35);

  return { structural, color, overall };
}

/**
 * Helper to analyze an image element or canvas
 */
export function analyzeImage(img: HTMLImageElement): ImageAnalysis {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      width: canvas.width,
      height: canvas.height,
      aspectRatio: canvas.width / (canvas.height || 1),
      phash: "0".repeat(64),
      dhash: "0".repeat(64),
      colorHistogram: new Array(64).fill(0),
      brightness: 128,
    };
  }

  ctx.drawImage(img, 0, 0);
  const p = computePHash(ctx);
  const d = computeDHash(ctx, canvas.width, canvas.height);
  const hist = computeColorHistogram(ctx, canvas.width, canvas.height);

  return {
    width: canvas.width,
    height: canvas.height,
    aspectRatio: canvas.width / (canvas.height || 1),
    phash: p,
    dhash: d,
    colorHistogram: hist,
    brightness: 128,
  };
}
