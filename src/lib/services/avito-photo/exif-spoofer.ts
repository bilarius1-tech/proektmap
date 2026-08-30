/**
 * EXIF & Metadata Spoofer for Avito Photo Lab
 * Generates coherent, realistic camera & shooting metadata (Apple, Samsung, Xiaomi, Sony)
 * and injects a valid APP1 EXIF segment into JPEG binary buffers, stripping editor signatures.
 */

export type ExifCameraProfile =
  | "iphone_15_pro"
  | "iphone_14"
  | "samsung_s24"
  | "xiaomi_14"
  | "sony_a7m4"
  | "random_mix";

export interface GeneratedExif {
  make: string;
  model: string;
  software: string;
  lensModel: string;
  dateTime: string;
  iso: number;
  focalLength: number; // in mm, e.g. 6.86 or 24.0
  fNumber: number; // e.g. 1.8
  exposureTime: string; // e.g. "1/160"
  exposureFraction: [number, number]; // [1, 160]
}

export interface CameraProfileDefinition {
  id: ExifCameraProfile;
  name: string;
  make: string;
  model: string;
  softwares: string[];
  lensModel: string;
  focalLengths: number[];
  fNumbers: number[];
  isoRange: [number, number];
  exposureRange: [number, number]; // denominator range: e.g. 100 to 500
}

export const EXIF_PROFILES: Record<Exclude<ExifCameraProfile, "random_mix">, CameraProfileDefinition> = {
  iphone_15_pro: {
    id: "iphone_15_pro",
    name: "📱 Apple iPhone 15 Pro",
    make: "Apple",
    model: "iPhone 15 Pro",
    softwares: ["17.5.1", "17.6.1", "18.0", "17.4.1"],
    lensModel: "iPhone 15 Pro back triple camera 6.86mm f/1.78",
    focalLengths: [6.86, 2.22, 9.0],
    fNumbers: [1.78, 2.2, 2.8],
    isoRange: [50, 160],
    exposureRange: [80, 500],
  },
  iphone_14: {
    id: "iphone_14",
    name: "📱 Apple iPhone 14",
    make: "Apple",
    model: "iPhone 14",
    softwares: ["17.4.1", "17.5", "16.7.2"],
    lensModel: "iPhone 14 back dual camera 5.7mm f/1.5",
    focalLengths: [5.7, 1.54],
    fNumbers: [1.5, 2.4],
    isoRange: [64, 200],
    exposureRange: [60, 400],
  },
  samsung_s24: {
    id: "samsung_s24",
    name: "📱 Samsung Galaxy S24 Ultra",
    make: "Samsung",
    model: "SM-S928B",
    softwares: ["S928BXXU1AXCA", "S928BXXU2AXE4", "OneUI 6.1"],
    lensModel: "Samsung S24 Ultra Primary 24mm f/1.7",
    focalLengths: [6.3, 7.9, 18.6],
    fNumbers: [1.7, 2.4, 3.4],
    isoRange: [50, 250],
    exposureRange: [100, 640],
  },
  xiaomi_14: {
    id: "xiaomi_14",
    name: "📱 Xiaomi 14 Leica",
    make: "Xiaomi",
    model: "23127PN0CG",
    softwares: ["Xiaomi HyperOS 1.0.8.0.UNCMIXM", "HyperOS 1.0.4.0"],
    lensModel: "Leica Summilux 23mm f/1.6",
    focalLengths: [6.55, 9.0],
    fNumbers: [1.6, 2.0],
    isoRange: [50, 200],
    exposureRange: [125, 500],
  },
  sony_a7m4: {
    id: "sony_a7m4",
    name: "📷 Sony Alpha 7 IV (Камера)",
    make: "SONY",
    model: "ILCE-7M4",
    softwares: ["ILCE-7M4 v3.00", "ILCE-7M4 v2.01"],
    lensModel: "FE 24-70mm F2.8 GM II",
    focalLengths: [28.0, 35.0, 50.0, 70.0],
    fNumbers: [2.8, 3.5, 4.0],
    isoRange: [100, 400],
    exposureRange: [125, 800],
  },
};

/**
 * Generates realistic coherent metadata for a given profile with optional date offset
 */
export function generateRealisticExif(
  profileChoice: ExifCameraProfile = "iphone_15_pro",
  dayOffset: number = 0,
  timeOffsetMinutes: number = 0
): GeneratedExif {
  let profileKey: Exclude<ExifCameraProfile, "random_mix">;

  if (profileChoice === "random_mix") {
    const keys = Object.keys(EXIF_PROFILES) as Exclude<ExifCameraProfile, "random_mix">[];
    profileKey = keys[Math.floor(Math.random() * keys.length)];
  } else {
    profileKey = profileChoice;
  }

  const p = EXIF_PROFILES[profileKey];
  const software = p.softwares[Math.floor(Math.random() * p.softwares.length)];
  const focalLength = p.focalLengths[Math.floor(Math.random() * p.focalLengths.length)];
  const fNumber = p.fNumbers[Math.floor(Math.random() * p.fNumbers.length)];

  // Random ISO in range rounded to 10
  const rawIso = p.isoRange[0] + Math.random() * (p.isoRange[1] - p.isoRange[0]);
  const iso = Math.round(rawIso / 10) * 10;

  // Realistic Shutter speed (e.g. 1/125, 1/160, 1/200, 1/250, 1/320, 1/400)
  const commonDenoms = [60, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640].filter(
    (d) => d >= p.exposureRange[0] && d <= p.exposureRange[1]
  );
  const denom = commonDenoms.length > 0
    ? commonDenoms[Math.floor(Math.random() * commonDenoms.length)]
    : 160;

  // Date: recent date (1-7 days ago or custom offset), realistic daytime hours (09:00 - 20:00)
  const now = new Date();
  const targetDate = new Date(now.getTime() - (dayOffset * 86400000 + timeOffsetMinutes * 60000));

  // Set realistic daytime if hour is middle of night
  if (targetDate.getHours() < 9 || targetDate.getHours() > 21) {
    targetDate.setHours(10 + Math.floor(Math.random() * 8));
    targetDate.setMinutes(Math.floor(Math.random() * 59));
    targetDate.setSeconds(Math.floor(Math.random() * 59));
  }

  const Y = targetDate.getFullYear();
  const M = String(targetDate.getMonth() + 1).padStart(2, "0");
  const D = String(targetDate.getDate()).padStart(2, "0");
  const h = String(targetDate.getHours()).padStart(2, "0");
  const m = String(targetDate.getMinutes()).padStart(2, "0");
  const s = String(targetDate.getSeconds()).padStart(2, "0");
  const dateTimeStr = `${Y}:${M}:${D} ${h}:${m}:${s}`;

  return {
    make: p.make,
    model: p.model,
    software,
    lensModel: p.lensModel,
    dateTime: dateTimeStr,
    iso,
    focalLength,
    fNumber,
    exposureTime: `1/${denom}`,
    exposureFraction: [1, denom],
  };
}

/**
 * Builds a valid TIFF/EXIF binary buffer in Little Endian (II) byte order
 */
export function buildTiffBuffer(exif: GeneratedExif): Uint8Array {
  // We collect all data values that exceed 4 bytes into a heap area
  const heap: number[] = [];
  function addHeapString(str: string): { offset: number; length: number } {
    const offset = heap.length;
    for (let i = 0; i < str.length; i++) {
      heap.push(str.charCodeAt(i));
    }
    heap.push(0); // Null terminator
    return { offset, length: str.length + 1 };
  }

  function addHeapRational(num: number, denom: number): number {
    const offset = heap.length;
    // 4 bytes num (LE)
    heap.push(num & 0xff, (num >> 8) & 0xff, (num >> 16) & 0xff, (num >> 24) & 0xff);
    // 4 bytes denom (LE)
    heap.push(denom & 0xff, (denom >> 8) & 0xff, (denom >> 16) & 0xff, (denom >> 24) & 0xff);
    return offset;
  }

  // Pre-encode strings & rationals to calculate heap layout
  const makeStr = addHeapString(exif.make);
  const modelStr = addHeapString(exif.model);
  const softStr = addHeapString(exif.software);
  const dateStr = addHeapString(exif.dateTime);
  const lensStr = addHeapString(exif.lensModel);

  // Rationals
  const expTimeOffset = addHeapRational(exif.exposureFraction[0], exif.exposureFraction[1]);
  const fNumOffset = addHeapRational(Math.round(exif.fNumber * 100), 100);
  const focalOffset = addHeapRational(Math.round(exif.focalLength * 100), 100);

  // Layout sizes:
  // TIFF Header: 8 bytes
  // IFD0: 2 bytes count + 6 entries * 12 bytes + 4 bytes nextIFD = 78 bytes
  // IFD0 starts at offset 8, ends at 86.
  // Exif SubIFD starts at offset 86:
  // 2 bytes count + 8 entries * 12 bytes + 4 bytes nextIFD = 102 bytes
  // Exif SubIFD ends at offset 86 + 102 = 188.
  // Heap starts at offset 188.
  const ifd0Offset = 8;
  const exifSubIfdOffset = ifd0Offset + 2 + 6 * 12 + 4; // 8 + 78 = 86
  const heapStartOffset = exifSubIfdOffset + 2 + 8 * 12 + 4; // 86 + 102 = 188

  const totalSize = heapStartOffset + heap.length;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // 1. TIFF Header (Little Endian "II")
  buffer[0] = 0x49; // 'I'
  buffer[1] = 0x49; // 'I'
  view.setUint16(2, 42, true); // 0x002A
  view.setUint32(4, ifd0Offset, true); // Offset to IFD0 (8)

  // 2. IFD0
  let pos = ifd0Offset;
  view.setUint16(pos, 6, true); // 6 tags in IFD0
  pos += 2;

  function writeEntry(
    tagId: number,
    type: number,
    count: number,
    valOrHeapOffset: number,
    isHeap: boolean
  ) {
    view.setUint16(pos, tagId, true);
    view.setUint16(pos + 2, type, true);
    view.setUint32(pos + 4, count, true);
    if (isHeap) {
      view.setUint32(pos + 8, heapStartOffset + valOrHeapOffset, true);
    } else {
      view.setUint32(pos + 8, valOrHeapOffset, true);
    }
    pos += 12;
  }

  // Tag 0x010F: Make (ASCII)
  writeEntry(0x010f, 2, makeStr.length, makeStr.offset, true);
  // Tag 0x0110: Model (ASCII)
  writeEntry(0x0110, 2, modelStr.length, modelStr.offset, true);
  // Tag 0x0112: Orientation (SHORT: 1 = Top-Left / Normal)
  writeEntry(0x0112, 3, 1, 1, false);
  // Tag 0x0131: Software (ASCII)
  writeEntry(0x0131, 2, softStr.length, softStr.offset, true);
  // Tag 0x0132: DateTime (ASCII)
  writeEntry(0x0132, 2, dateStr.length, dateStr.offset, true);
  // Tag 0x8769: ExifIFDPointer (LONG)
  writeEntry(0x8769, 4, 1, exifSubIfdOffset, false);

  // Next IFD offset = 0
  view.setUint32(pos, 0, true);
  pos += 4;

  // 3. Exif SubIFD
  view.setUint16(pos, 8, true); // 8 tags in SubIFD
  pos += 2;

  // Tag 0x829A: ExposureTime (RATIONAL)
  writeEntry(0x829a, 5, 1, expTimeOffset, true);
  // Tag 0x829D: FNumber (RATIONAL)
  writeEntry(0x829d, 5, 1, fNumOffset, true);
  // Tag 0x8827: ISOSpeedRatings (SHORT)
  writeEntry(0x8827, 3, 1, exif.iso, false);
  // Tag 0x9003: DateTimeOriginal (ASCII)
  writeEntry(0x9003, 2, dateStr.length, dateStr.offset, true);
  // Tag 0x9004: DateTimeDigitized (ASCII)
  writeEntry(0x9004, 2, dateStr.length, dateStr.offset, true);
  // Tag 0x920A: FocalLength (RATIONAL)
  writeEntry(0x920a, 5, 1, focalOffset, true);
  // Tag 0xA001: ColorSpace (SHORT: 1 = sRGB)
  writeEntry(0xa001, 3, 1, 1, false);
  // Tag 0xA434: LensModel (ASCII)
  writeEntry(0xa434, 2, lensStr.length, lensStr.offset, true);

  // Next SubIFD offset = 0
  view.setUint32(pos, 0, true);
  pos += 4;

  // 4. Copy Heap Data
  for (let i = 0; i < heap.length; i++) {
    buffer[heapStartOffset + i] = heap[i];
  }

  return buffer;
}

/**
 * Injects realistic EXIF metadata into a JPEG binary buffer (strips old JFIF / editor headers)
 */
export function injectExifIntoJpeg(jpegBuffer: Uint8Array, exif: GeneratedExif): Uint8Array {
  // Verify JPEG SOI marker
  if (jpegBuffer[0] !== 0xff || jpegBuffer[1] !== 0xd8) {
    return jpegBuffer; // Not a valid JPEG, return untouched
  }

  const tiffData = buildTiffBuffer(exif);

  // Create APP1 segment
  // Marker (2) + Length (2) + "Exif\0\0" (6) + TIFF
  const app1Length = 2 + 6 + tiffData.length;
  const app1Segment = new Uint8Array(2 + app1Length);
  app1Segment[0] = 0xff;
  app1Segment[1] = 0xe1;
  app1Segment[2] = (app1Length >> 8) & 0xff;
  app1Segment[3] = app1Length & 0xff;
  // "Exif\0\0"
  app1Segment[4] = 0x45;
  app1Segment[5] = 0x78;
  app1Segment[6] = 0x69;
  app1Segment[7] = 0x66;
  app1Segment[8] = 0x00;
  app1Segment[9] = 0x00;
  app1Segment.set(tiffData, 10);

  // Find where original image stream starts (skip existing APP0/APP1 segments)
  let offset = 2;
  while (offset < jpegBuffer.length - 4) {
    if (jpegBuffer[offset] === 0xff) {
      const marker = jpegBuffer[offset + 1];
      // APP0 (0xE0) or APP1 (0xE1) or APP2-APP15 (0xE2..0xEF) or COM (0xFE)
      if ((marker >= 0xe0 && marker <= 0xef) || marker === 0xfe) {
        const segLen = (jpegBuffer[offset + 2] << 8) | jpegBuffer[offset + 3];
        offset += 2 + segLen;
        continue;
      }
    }
    break;
  }

  const restOfJpeg = jpegBuffer.subarray(offset);
  const result = new Uint8Array(2 + app1Segment.length + restOfJpeg.length);

  // SOI
  result[0] = 0xff;
  result[1] = 0xd8;
  // APP1
  result.set(app1Segment, 2);
  // Rest of image
  result.set(restOfJpeg, 2 + app1Segment.length);

  return result;
}

/**
 * Detects AI generation signatures, C2PA manifests, IPTC AI tags, and editor footprints in binary buffer
 */
export function detectAiMarkersInBuffer(buffer: Uint8Array): { hasAiMarkers: boolean; details: string[] } {
  const details: string[] = [];
  // Convert first 64KB to ASCII string for quick header analysis
  const scanLimit = Math.min(buffer.length, 65536);
  let headerText = "";
  for (let i = 0; i < scanLimit; i++) {
    const code = buffer[i];
    if (code >= 32 && code <= 126) {
      headerText += String.fromCharCode(code);
    } else {
      headerText += " ";
    }
  }

  // 1. C2PA / Content Credentials manifests
  if (/c2pa|claim_generator|Content Credentials/i.test(headerText)) {
    details.push("C2PA / Content Credentials манифест (Adobe / DALL-E / Google)");
  }

  // 2. IPTC / XMP AI DigitalSourceType
  if (/trainedAlgorithmicMedia|compositeSynthetic|DigitalSourceType/i.test(headerText)) {
    details.push("IPTC AI тег 'trainedAlgorithmicMedia' (метка сгенерированного контента)");
  }

  // 3. Known AI Engines & WebUI signatures
  if (/midjourney/i.test(headerText)) {
    details.push("Сигнатура Midjourney в заголовке");
  }
  if (/dall-e|openai/i.test(headerText)) {
    details.push("Сигнатура OpenAI DALL-E");
  }
  if (/comfyui|automatic1111|invokeai|fooocus|flux\.1|novelai/i.test(headerText)) {
    details.push("Сигнатура генератора (ComfyUI / A1111 / Flux)");
  }
  if (/photoshop|canva|figma/i.test(headerText)) {
    details.push("Метаданные графического редактора (Photoshop/Canva/Figma)");
  }

  return {
    hasAiMarkers: details.length > 0,
    details,
  };
}

/**
 * Detects AI signatures from an uploaded File or Blob
 */
export async function detectAiMarkersInFile(file: File | Blob): Promise<{ hasAiMarkers: boolean; details: string[] }> {
  try {
    const slice = file.slice(0, 65536);
    const arrayBuffer = await slice.arrayBuffer();
    return detectAiMarkersInBuffer(new Uint8Array(arrayBuffer));
  } catch {
    return { hasAiMarkers: false, details: [] };
  }
}

/**
 * Converts a DataURL to a Blob with injected EXIF
 */
export function injectExifIntoDataUrl(dataUrl: string, exif: GeneratedExif): { blob: Blob; dataUrl: string } {
  const parts = dataUrl.split(",");
  const rawBase64 = parts[1];
  const binaryStr = atob(rawBase64);
  const u8arr = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    u8arr[i] = binaryStr.charCodeAt(i);
  }

  const injected = injectExifIntoJpeg(u8arr, exif);
  const blob = new Blob([injected as unknown as BlobPart], { type: "image/jpeg" });

  // Convert injected buffer back to base64 DataURL
  let binary = "";
  const len = injected.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(injected[i]);
  }
  const newDataUrl = `data:image/jpeg;base64,${btoa(binary)}`;

  return { blob, dataUrl: newDataUrl };
}
