import { GeneratedVariant, ListingSet, DuplicateScanResult, UniqueRecipe } from "./types";
import {
  computePHash,
  computeDHash,
  computeColorHistogram,
  calculateSimilarity,
  calculateColorSimilarity,
  calculateComprehensiveSimilarity,
  analyzeImage,
} from "./phash";
import { generateRandomParams, applyTransforms, PRESET_RECIPES } from "./transforms";
import { generateRealisticExif, injectExifIntoDataUrl } from "./exif-spoofer";

/**
 * Loads an image File or Blob into an HTMLImageElement
 */
export function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Loads an image from a DataURL
 */
export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });
}

/**
 * Candidate Competition Pipeline
 * Generates `requestedCount` optimized variants from a single original image
 */
export async function generateOptimizedVariants(
  sourceImage: HTMLImageElement,
  originalFileName: string,
  recipe: UniqueRecipe,
  requestedCount: number = 10,
  onProgress?: (done: number, total: number) => void
): Promise<GeneratedVariant[]> {
  // 1. Analyze Original Image
  const origAnalysis = analyzeImage(sourceImage);
  const origPHash = origAnalysis.phash;
  const origDHash = origAnalysis.dhash;

  // 2. Candidate Pool Size = requestedCount * 2.5
  const poolSize = Math.max(requestedCount * 2, requestedCount + 6);
  const candidateList: GeneratedVariant[] = [];

  for (let i = 0; i < poolSize; i++) {
    const params = generateRandomParams(recipe);
    const { canvas, dataUrl, qualityScore } = applyTransforms(
      sourceImage,
      params,
      recipe.qualityLevel
    );

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let pHash = "0".repeat(64);
    let dHash = "0".repeat(64);
    let colorHist = new Array(64).fill(0);
    if (ctx) {
      pHash = computePHash(ctx);
      dHash = computeDHash(ctx, canvas.width, canvas.height);
      colorHist = computeColorHistogram(ctx, canvas.width, canvas.height);
    }

    const { structural, color, overall } = calculateComprehensiveSimilarity(
      origPHash,
      origDHash,
      origAnalysis.colorHistogram,
      pHash,
      dHash,
      colorHist
    );
    const uniqueness = 100 - overall;

    candidateList.push({
      id: `var-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 6)}`,
      originalName: originalFileName,
      dataUrl,
      phash: pHash,
      dhash: dHash,
      colorHistogram: colorHist,
      structuralSimilarity: structural,
      colorSimilarity: color,
      similarityToOriginal: overall,
      uniquenessScore: uniqueness,
      qualityScore,
      peerMaxSimilarity: 0,
      parametersUsed: {
        crop: Math.round(params.crop * 10) / 10,
        rotate: Math.round(params.rotate * 100) / 100,
        brightness: Math.round(params.brightness * 10) / 10,
        contrast: Math.round(params.contrast * 10) / 10,
        saturation: Math.round(params.saturation * 10) / 10,
        noise: Math.round(params.noise),
      },
    });

    if (onProgress) {
      onProgress(i + 1, poolSize);
    }
  }

  // 3. Selection with Diversity Filter (discarding variants that are too close to each other)
  const selected: GeneratedVariant[] = [];

  // Sort candidate pool by fitness (balance of uniqueness and quality)
  candidateList.sort((a, b) => {
    const scoreA = a.qualityScore * 0.4 + a.uniquenessScore * 0.6;
    const scoreB = b.qualityScore * 0.4 + b.uniquenessScore * 0.6;
    return scoreB - scoreA;
  });

  for (const candidate of candidateList) {
    if (selected.length >= requestedCount) break;

    // Check similarity against already accepted variants (Structural + Color)
    let maxPeerSim = 0;
    for (const prev of selected) {
      const { overall: peerSim } = calculateComprehensiveSimilarity(
        candidate.phash,
        candidate.dhash,
        candidate.colorHistogram,
        prev.phash,
        prev.dhash,
        prev.colorHistogram
      );
      if (peerSim > maxPeerSim) {
        maxPeerSim = peerSim;
      }
    }

    // If candidate is too identical to an already accepted variant (> 90%), skip to preserve diversity
    if (selected.length > 0 && maxPeerSim > 90) {
      continue;
    }

    candidate.peerMaxSimilarity = maxPeerSim;
    selected.push(candidate);
  }

  // If strict filter left us with fewer items, fill up with remaining best
  if (selected.length < requestedCount) {
    for (const candidate of candidateList) {
      if (selected.length >= requestedCount) break;
      if (!selected.find((s) => s.id === candidate.id)) {
        selected.push(candidate);
      }
    }
  }

  // 4. Inject EXIF metadata & strip AI signatures for all accepted variants
  const exifProfile = recipe.exifProfile || "random_mix";
  for (let idx = 0; idx < selected.length; idx++) {
    const variant = selected[idx];
    const exif = generateRealisticExif(exifProfile, idx % 7, idx * 17);
    const { blob, dataUrl: injectedDataUrl } = injectExifIntoDataUrl(variant.dataUrl, exif);
    variant.exifData = exif;
    variant.dataUrl = injectedDataUrl;
    variant.blob = blob;
    variant.aiSignaturesCleaned = true;
  }

  return selected;
}

/**
 * Multi-Set Assembler for Mass-Posting
 * Given N source photos, generates M unique non-overlapping sets for M listings
 */
export async function assembleListingSets(
  sourceImages: { file: File; name: string }[],
  listingsCount: number = 10,
  photosPerListing: number = 4,
  recipe: UniqueRecipe = PRESET_RECIPES.mass_posting,
  onProgress?: (done: number, total: number) => void
): Promise<ListingSet[]> {
  if (sourceImages.length === 0) return [];

  const loadedSources: { img: HTMLImageElement; name: string }[] = [];
  for (const s of sourceImages) {
    const img = await loadImageFromFile(s.file);
    loadedSources.push({ img, name: s.name });
  }

  const listingSets: ListingSet[] = [];
  const totalSteps = listingsCount;

  for (let i = 0; i < listingsCount; i++) {
    // Pick main image with cyclic rotation so every listing has a different primary angle
    const mainSourceIdx = i % loadedSources.length;
    const mainSource = loadedSources[mainSourceIdx];

    // Generate unique main variant
    const [mainVariant] = await generateOptimizedVariants(
      mainSource.img,
      mainSource.name,
      recipe,
      1
    );

    // Pick additional images from the remaining source photos
    const additionalVariants: GeneratedVariant[] = [];
    const neededAdditional = Math.min(photosPerListing - 1, loadedSources.length - 1);

    for (let a = 0; a < neededAdditional; a++) {
      const addIdx = (mainSourceIdx + 1 + a) % loadedSources.length;
      const addSource = loadedSources[addIdx];
      const [addVar] = await generateOptimizedVariants(
        addSource.img,
        addSource.name,
        recipe,
        1
      );
      additionalVariants.push(addVar);
    }

    listingSets.push({
      setIndex: i + 1,
      title: `Объявление #${i + 1}`,
      mainImage: mainVariant,
      additionalImages: additionalVariants,
    });

    if (onProgress) {
      onProgress(i + 1, totalSteps);
    }
  }

  return listingSets;
}

/**
 * Scans an array of uploaded image files for duplicates and near-duplicates
 */
export async function scanForDuplicates(
  files: { file: File; name: string }[],
  onProgress?: (done: number, total: number) => void
): Promise<{ results: DuplicateScanResult[]; totalDuplicates: number; totalUnique: number }> {
  const analyzed: {
    name: string;
    preview: string;
    phash: string;
    dhash: string;
    colorHistogram: number[];
  }[] = [];

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const img = await loadImageFromFile(f.file);
    const analysis = analyzeImage(img);

    // Small preview thumbnail for UI
    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = 120;
    thumbCanvas.height = 120;
    const thumbCtx = thumbCanvas.getContext("2d");
    if (thumbCtx) {
      thumbCtx.drawImage(img, 0, 0, 120, 120);
    }

    analyzed.push({
      name: f.name,
      preview: thumbCanvas.toDataURL("image/jpeg", 0.75),
      phash: analysis.phash,
      dhash: analysis.dhash,
      colorHistogram: analysis.colorHistogram,
    });

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  const results: DuplicateScanResult[] = [];
  const duplicateFiles = new Set<string>();

  // Pairwise comparison (Structural + Color Histogram)
  for (let i = 0; i < analyzed.length; i++) {
    for (let j = i + 1; j < analyzed.length; j++) {
      const a = analyzed[i];
      const b = analyzed[j];
      const { structural, color, overall } = calculateComprehensiveSimilarity(
        a.phash,
        a.dhash,
        a.colorHistogram,
        b.phash,
        b.dhash,
        b.colorHistogram
      );

      if (overall >= 80) {
        duplicateFiles.add(a.name);
        duplicateFiles.add(b.name);
        results.push({
          fileA: a.name,
          fileB: b.name,
          structuralSimilarity: structural,
          colorSimilarity: color,
          similarity: overall,
          isDuplicate: overall >= 88,
          previewA: a.preview,
          previewB: b.preview,
        });
      }
    }
  }

  // Sort by highest similarity first
  results.sort((a, b) => b.similarity - a.similarity);

  const totalDuplicates = duplicateFiles.size;
  const totalUnique = files.length - totalDuplicates;

  return { results, totalDuplicates, totalUnique };
}
