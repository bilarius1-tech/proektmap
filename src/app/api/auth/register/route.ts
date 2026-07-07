import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Пароль минимум 6 символов" }, { status: 400 });

  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ error: "DB not configured" }, { status: 500 });
  
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 });

  const passwordHash = await hash(password, 10);
  await db.user.create({ data: { email: email.toLowerCase(), passwordHash } });

  await db.$disconnect();
  return NextResponse.json({ ok: true });
}
