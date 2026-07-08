import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ authenticated: false });
  return NextResponse.json({
    authenticated: true,
    email: (session.user as any).email,
    role: (session.user as any).role,
  });
}
