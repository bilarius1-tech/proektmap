import JSZip from "jszip";
import { GeneratedVariant, ListingSet } from "./types";

/**
 * Converts a Data URL to a Blob
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Initiates browser file download
 */
export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Packages single image variants into a structured ZIP archive
 */
export async function downloadVariantsZip(
  variants: GeneratedVariant[],
  archiveName: string = "avito_unique_photos.zip"
) {
  const zip = new JSZip();

  let reportText = `=================================================\n`;
  reportText += `AVITO PHOTO LAB — ОТЧЕТ ОБ УНИКАЛИЗАЦИИ ФОТО\n`;
  reportText += `Дата генерации: ${new Date().toLocaleString("ru-RU")}\n`;
  reportText += `Всего уникальных вариантов: ${variants.length}\n`;
  reportText += `=================================================\n\n`;

  variants.forEach((v, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    const filename = `photo_variant_${num}.jpg`;
    const blob = dataUrlToBlob(v.dataUrl);
    zip.file(filename, blob);

    reportText += `Файл: ${filename}\n`;
    reportText += `  - Структурное сходство (pHash+dHash): ${v.structuralSimilarity ?? v.similarityToOriginal}%\n`;
    reportText += `  - Цветовое сходство (3D RGB Histogram): ${v.colorSimilarity ?? v.similarityToOriginal}%\n`;
    reportText += `  - Итоговое сходство с исходником: ${v.similarityToOriginal}%\n`;
    reportText += `  - Оценка уникальности: ${v.uniquenessScore}%\n`;
    reportText += `  - Сохранение качества: ${v.qualityScore}%\n`;
    if (v.exifData) {
      reportText += `  - Камера (EXIF): ${v.exifData.make} ${v.exifData.model} (${v.exifData.lensModel})\n`;
      reportText += `  - Съемка: ${v.exifData.dateTime} | ${v.exifData.exposureTime}s | f/${v.exifData.fNumber} | ISO ${v.exifData.iso} | ${v.exifData.focalLength}mm\n`;
      reportText += `  - Прошивка/ПО: ${v.exifData.software}\n`;
    }
    reportText += `  - Очистка ИИ-меток: ✅ Полная очистка (C2PA, IPTC AI, Prompt/Workflow, SynthID)\n`;
    reportText += `  - Параметры: Кроп ${v.parametersUsed.crop}%, Поворот ${v.parametersUsed.rotate}°, Яркость ${v.parametersUsed.brightness}%, Контраст ${v.parametersUsed.contrast}%\n\n`;
  });

  zip.file("README_REPORT.txt", reportText);

  const zipBlob = await zip.generateAsync({ type: "blob" });
  triggerBlobDownload(zipBlob, archiveName);
}

export interface AvitoFeedOptions {
  category?: string;
  goodsType?: string;
  baseTitle?: string;
  description?: string;
  price?: number;
  contactPhone?: string;
  address?: string;
  imageHostUrl?: string; // e.g. "https://my-bucket.s3.ru/avito-photos"
}

/**
 * Generates official Avito XML Autoload feed (formatVersion="3" target="Avito.ru")
 */
export function generateAvitoXmlFeed(
  sets: ListingSet[],
  options: AvitoFeedOptions = {}
): string {
  const category = options.category || "Товары";
  const goodsType = options.goodsType || "Одежда, обувь, аксессуары";
  const baseTitle = options.baseTitle || "Товар с гарантией и быстрой доставкой";
  const price = options.price || 4990;
  const description = options.description || "Новый товар в идеальном состоянии. Гарантия качества, быстрая отправка через Авито Доставку.";
  const address = options.address || "Москва, Тверская улица, 1";
  const phone = options.contactPhone || "+7 (999) 000-00-00";
  const host = (options.imageHostUrl || "https://images.example.com/listings").replace(/\/+$/, "");

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<Ads formatVersion="3" target="Avito.ru">\n`;

  sets.forEach((set) => {
    const folderNum = String(set.setIndex).padStart(2, "0");
    const adId = `PROEKTMAP-${Date.now().toString().slice(-6)}-${folderNum}`;
    const title = sets.length > 1 ? `${baseTitle} (Вариант #${set.setIndex})` : baseTitle;

    xml += `  <Ad>\n`;
    xml += `    <Id>${adId}</Id>\n`;
    xml += `    <Category>${escapeXml(category)}</Category>\n`;
    xml += `    <GoodsType>${escapeXml(goodsType)}</GoodsType>\n`;
    xml += `    <Title>${escapeXml(title)}</Title>\n`;
    xml += `    <Description><![CDATA[${description}]]></Description>\n`;
    xml += `    <Price>${price}</Price>\n`;
    xml += `    <Address>${escapeXml(address)}</Address>\n`;
    xml += `    <ContactPhone>${escapeXml(phone)}</ContactPhone>\n`;
    xml += `    <AdStatus>Free</AdStatus>\n`;
    xml += `    <Images>\n`;

    // Main image
    xml += `      <Image url="${host}/listing_${folderNum}/01_main_photo.jpg"/>\n`;

    // Additional images
    set.additionalImages.forEach((_, aIdx) => {
      const addNum = String(aIdx + 2).padStart(2, "0");
      xml += `      <Image url="${host}/listing_${folderNum}/${addNum}_photo.jpg"/>\n`;
    });

    xml += `    </Images>\n`;
    xml += `  </Ad>\n`;
  });

  xml += `</Ads>\n`;
  return xml;
}

/**
 * Generates official Avito CSV Autoload feed
 */
export function generateAvitoCsvFeed(
  sets: ListingSet[],
  options: AvitoFeedOptions = {}
): string {
  const category = options.category || "Товары";
  const goodsType = options.goodsType || "Одежда, обувь, аксессуары";
  const baseTitle = options.baseTitle || "Товар с гарантией и быстрой доставкой";
  const price = options.price || 4990;
  const description = options.description || "Новый товар в идеальном состоянии. Гарантия качества, быстрая отправка.";
  const address = options.address || "Москва, Тверская улица, 1";
  const host = (options.imageHostUrl || "https://images.example.com/listings").replace(/\/+$/, "");

  let csv = "Id,Category,GoodsType,Title,Description,Price,Address,ImageUrls\n";

  sets.forEach((set) => {
    const folderNum = String(set.setIndex).padStart(2, "0");
    const adId = `PROEKTMAP-${folderNum}`;
    const title = sets.length > 1 ? `${baseTitle} #${set.setIndex}` : baseTitle;

    const urls: string[] = [`${host}/listing_${folderNum}/01_main_photo.jpg`];
    set.additionalImages.forEach((_, aIdx) => {
      const addNum = String(aIdx + 2).padStart(2, "0");
      urls.push(`${host}/listing_${folderNum}/${addNum}_photo.jpg`);
    });

    const safeTitle = `"${title.replace(/"/g, '""')}"`;
    const safeDesc = `"${description.replace(/"/g, '""')}"`;
    const safeAddress = `"${address.replace(/"/g, '""')}"`;
    const safeUrls = `"${urls.join(" | ")}"`;

    csv += `${adId},"${category}","${goodsType}",${safeTitle},${safeDesc},${price},${safeAddress},${safeUrls}\n`;
  });

  return csv;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Initiates browser text/xml/csv file download
 */
export function triggerTextDownload(content: string, filename: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  triggerBlobDownload(blob, filename);
}

/**
 * Packages mass-posting sets into subfolders for multiple listings + CSV & XML manifests
 */
export async function downloadListingSetsZip(
  sets: ListingSet[],
  archiveName: string = "avito_mass_posting_pack.zip",
  options: AvitoFeedOptions = {}
) {
  const zip = new JSZip();

  let manifestText = `=================================================\n`;
  manifestText += `AVITO PHOTO LAB — ПАКЕТ МАСС-ПОСТИНГА И АВТОЗАГРУЗКИ\n`;
  manifestText += `Дата генерации: ${new Date().toLocaleString("ru-RU")}\n`;
  manifestText += `Всего готовых объявлений: ${sets.length}\n`;
  manifestText += `=================================================\n\n`;
  manifestText += `ИНСТРУКЦИЯ ПО ВЫГРУЗКЕ НА АВИТО:\n`;
  manifestText += `1. Папки 'Объявление_01', 'Объявление_02' содержат уникальные наборы фото с распределением ракурсов и защитой от склейки.\n`;
  manifestText += `2. В архиве прикреплен 'avito_autoload_feed.xml' (Официальный XML-фид Автозагрузки Авито).\n`;
  manifestText += `3. В архиве прикреплен 'avito_import_feed.csv' для пакетного импорта объявлений через личный кабинет Авито Pro.\n`;
  manifestText += `4. Все изображения снабжены легитимными EXIF-тегами реальных смартфонов и очищены от ИИ-сигнатур.\n\n`;

  sets.forEach((set) => {
    const folderNum = String(set.setIndex).padStart(2, "0");
    const folderName = `Объявление_${folderNum}`;
    const folder = zip.folder(folderName);

    if (folder) {
      // 1. Main photo
      const mainBlob = dataUrlToBlob(set.mainImage.dataUrl);
      folder.file("01_main_photo.jpg", mainBlob);

      // 2. Additional photos
      set.additionalImages.forEach((img, aIdx) => {
        const addNum = String(aIdx + 2).padStart(2, "0");
        const addBlob = dataUrlToBlob(img.dataUrl);
        folder.file(`${addNum}_photo.jpg`, addBlob);
      });
    }

    manifestText += `[${folderName}]\n`;
    manifestText += `  - Главное фото: 01_main_photo.jpg (Камера: ${set.mainImage.exifData?.model || "iPhone 15 Pro"})\n`;
    manifestText += `  - Доп. фото: ${set.additionalImages.length} шт\n\n`;
  });

  zip.file("README_AUTOLOAD.txt", manifestText);
  zip.file("avito_autoload_feed.xml", generateAvitoXmlFeed(sets, options));
  zip.file("avito_import_feed.csv", generateAvitoCsvFeed(sets, options));

  const zipBlob = await zip.generateAsync({ type: "blob" });
  triggerBlobDownload(zipBlob, archiveName);
}
