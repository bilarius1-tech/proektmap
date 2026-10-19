import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

// POST — send verification email (or just generate token)
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const db = await getDb();
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.emailVerified) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  await db.user.update({ where: { id: user.id }, data: { verifyToken: token } });

  // Ссылка уходит только владельцу ящика: в ответе её быть не должно, иначе подтвердить можно чужой email.
  const verifyUrl = "https://proektmap.ru/verify?token=" + token;
  console.log("Verify URL:", verifyUrl);

  return NextResponse.json({ ok: true });
}

// GET — verify token
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });
  const db = await getDb();
  const user = await db.user.findFirst({ where: { verifyToken: token } });
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  await db.user.update({ where: { id: user.id }, data: { emailVerified: new Date(), verifyToken: null } });
  return NextResponse.json({ ok: true, verified: true });
}
