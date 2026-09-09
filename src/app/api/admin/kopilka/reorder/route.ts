import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/kopilka/auth";

/** Body: { type: "category"|"item", items: { id, sortOrder }[] } */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { type, items } = await req.json();
  if (!Array.isArray(items) || (type !== "category" && type !== "item")) {
    return NextResponse.json({ error: "type + items required" }, { status: 400 });
  }
  const db = await getDb();
  if (type === "category") {
    for (const row of items) {
      await db.designBankCategory.update({ where: { id: row.id }, data: { sortOrder: row.sortOrder } });
    }
  } else {
    for (const row of items) {
      await db.designBankItem.update({ where: { id: row.id }, data: { sortOrder: row.sortOrder } });
    }
  }
  return NextResponse.json({ ok: true });
}
