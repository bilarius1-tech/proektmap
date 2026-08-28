import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const db = await getDb();
  const email = (session.user as any).email?.toLowerCase();

  const { avatar, name, bio, status, headline, telegram, github, website, skills, publicProfile } = data;
  
  await db.user.update({
    where: { email },
    data: {
      name: name !== undefined ? name : undefined,
      bio: bio !== undefined ? bio : undefined,
      status: status !== undefined ? status : undefined,
      headline: headline !== undefined ? headline : undefined,
      telegram: telegram !== undefined ? telegram : undefined,
      github: github !== undefined ? github : undefined,
      website: website !== undefined ? website : undefined,
      skills: skills !== undefined ? skills : undefined,
      publicProfile: publicProfile !== undefined ? publicProfile : undefined,
      avatar: avatar !== undefined ? avatar : undefined,
    },
  });
  return NextResponse.json({ ok: true });
}
