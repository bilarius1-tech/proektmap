import fs from "fs";
import path from "path";

const ALLOWED_EXT = new Set(["pdf", "zip", "epub"]);

export function shopStorageDir() {
  return path.resolve(process.cwd(), "storage", "shop");
}

export function assertShopFileName(fileName: string) {
  const base = path.basename(fileName);
  if (!base || base !== fileName || base.includes("..")) {
    throw new Error("Некорректное имя файла");
  }
  if (!/^[\w.\-]+$/.test(base)) {
    throw new Error("Имя файла содержит недопустимые символы");
  }
  const ext = base.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Допустимы файлы pdf, zip и epub");
  }
  return base;
}

export function shopFilePath(fileName: string) {
  const base = assertShopFileName(fileName);
  const root = shopStorageDir();
  const full = path.resolve(root, base);
  if (!full.startsWith(root + path.sep)) {
    throw new Error("Файл вне хранилища магазина");
  }
  return full;
}

export function ensureShopStorage() {
  const dir = shopStorageDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function shopFileExists(fileName: string) {
  if (!fileName) return false;
  try {
    return fs.existsSync(shopFilePath(fileName));
  } catch {
    return false;
  }
}
