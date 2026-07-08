import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    const cwd = "/var/www/www-root/data/www/proektmap.ru";
    const { stdout, stderr } = await execAsync(
      `cd ${cwd} && DATABASE_URL="postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" npx tsx prisma/seed.ts`,
      { timeout: 30000 }
    );
    return NextResponse.json({ ok: true, output: stdout, error: stderr || null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message, stderr: e.stderr, stdout: e.stdout }, { status: 500 });
  }
}
