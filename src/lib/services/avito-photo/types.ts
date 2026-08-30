import type { GeneratedExif, ExifCameraProfile } from "./exif-spoofer";

export type UniquePreset = "natural" | "standard" | "mass_posting" | "ai_studio" | "custom";

export interface UniqueRecipe {
  name: string;
  preset: UniquePreset;
  cropMin: number; // in %
  cropMax: number;
  rotateMin: number; // in degrees
  rotateMax: number;
  brightnessMin: number; // in % (-10 to +10)
  brightnessMax: number;
  contrastMin: number; // in % (-10 to +10)
  contrastMax: number;
  saturationMin: number; // in % (-10 to +10)
  saturationMax: number;
  noiseLevel: number; // 0 to 100
  subpixelShift: boolean;
  safeZoneProtection?: boolean; // Protect 1:1 central text & badges from edge clipping
  exifProfile?: ExifCameraProfile; // Camera profile for spoofing
  cleanAiSignatures?: boolean; // Strip C2PA, XMP, IPTC AI flags & SynthID
  qualityLevel: number; // 0.85 - 0.96
  targetSimilarityMin: number; // % e.g. 60
  targetSimilarityMax: number; // % e.g. 90
}

export interface ImageAnalysis {
  width: number;
  height: number;
  aspectRatio: number;
  phash: string;
  dhash: string;
  colorHistogram: number[];
  dominantColor?: string;
  brightness: number;
  hasAiMarkers?: boolean;
}

export interface GeneratedVariant {
  id: string;
  originalName: string;
  dataUrl: string;
  blob?: Blob;
  phash: string;
  dhash: string;
  colorHistogram: number[];
  structuralSimilarity: number; // 0 - 100% (based on pHash + dHash)
  colorSimilarity: number; // 0 - 100% (based on 64-bin 3D RGB histogram)
  similarityToOriginal: number; // 0 - 100% (overall weighted similarity)
  uniquenessScore: number; // 0 - 100% (100 - similarityToOriginal)
  qualityScore: number; // 0 - 100% (estimated quality/sharpness preservation)
  peerMaxSimilarity: number; // highest similarity to any other generated variant in set
  exifData?: GeneratedExif;
  aiSignaturesCleaned?: boolean;
  parametersUsed: {
    crop: number;
    rotate: number;
    brightness: number;
    contrast: number;
    saturation: number;
    noise: number;
  };
}

export interface ListingSet {
  setIndex: number;
  title: string;
  mainImage: GeneratedVariant;
  additionalImages: GeneratedVariant[];
}

export interface DuplicateScanResult {
  fileA: string;
  fileB: string;
  structuralSimilarity: number;
  colorSimilarity: number;
  similarity: number; // percentage (overall weighted)
  isDuplicate: boolean; // >= 88%
  previewA: string;
  previewB: string;
}
