import fs from "fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { shopFilePath } from "@/lib/shop/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!/^[a-f0-9]{48}$/.test(token)) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }

  const db = await getDb();
  const order = await db.shopOrder.findUnique({
    where: { publicToken: token },
    include: { items: true },
  });
  if (!order || order.status !== "paid") {
    return NextResponse.json({ error: "Файл доступен после оплаты" }, { status: 403 });
  }

  const item = order.items[0];
  if (!item?.fileName) {
    return NextResponse.json({ error: "В заказе нет файла" }, { status: 404 });
  }

  let full: string;
  try {
    full = shopFilePath(item.fileName);
  } catch {
    return NextResponse.json({ error: "Файл недоступен" }, { status: 404 });
  }
  if (!fs.existsSync(full)) {
    return NextResponse.json({ error: "Файл не найден на сервере" }, { status: 404 });
  }

  const downloadName = item.originalName || item.fileName;
  const webStream = Readable.toWeb(fs.createReadStream(full)) as ReadableStream;
  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
