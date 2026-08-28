import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

function generateSlug(title: string): string {
  const ru: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };
  const translit = title
    .toLowerCase()
    .split("")
    .map(char => ru[char] || char)
    .join("");
  return translit
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `project-${Date.now().toString(36)}`;
}

// GET — список проектов
export async function GET(req: NextRequest) {
  const db = await getDb();
  const userId = req.nextUrl.searchParams.get("userId");
  const where: any = { isPublished: true, moderationStatus: "approved" };
  if (userId) {
    where.userId = userId;
    // If querying by userId, allow viewing user's own projects
    delete where.moderationStatus;
  }
  const projects = await db.aiProject.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          status: true,
          headline: true,
          xp: true,
        },
      },
    },
  });
  return NextResponse.json(projects);
}

// POST — создание проекта пользователем
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Для публикации работы необходимо авторизоваться" }, { status: 401 });
  }

  const db = await getDb();
  const email = (session.user as any).email?.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  const body = await req.json();
  const {
    title,
    description,
    category = "SaaS",
    url = "",
    githubUrl = "",
    telegramUrl = "",
    techStack = "",
    aiTools = "",
    screenshot = "",
    screenshots = [],
    aiRecipe = "",
    timeSpent = "",
    status = "Запущен",
  } = body;

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Укажите название проекта" }, { status: 400 });
  }

  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  while (await db.aiProject.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const isAdmin = user.role === "admin";
  const moderationStatus = isAdmin ? "approved" : "pending";

  const project = await db.aiProject.create({
    data: {
      userId: user.id,
      title: title.trim(),
      slug,
      description: (description || "").trim(),
      category,
      url: (url || "").trim(),
      githubUrl: (githubUrl || "").trim(),
      telegramUrl: (telegramUrl || "").trim(),
      techStack: (techStack || "").trim(),
      aiTools: (aiTools || "").trim(),
      screenshot: screenshot || (screenshots[0] || ""),
      screenshots: JSON.stringify(screenshots || []),
      aiRecipe: (aiRecipe || "").trim(),
      timeSpent: (timeSpent || "").trim(),
      status,
      language: "ru",
      featured: false,
      authorName: user.name || user.email.split("@")[0],
      authorAvatar: user.avatar || "",
      authorUrl: `/profile/${user.id}`,
      isPublished: true,
      moderationStatus,
    },
  });

  // Автоматически включаем пользователю публичный профиль вайбкодера
  if (!user.publicProfile) {
    await db.user.update({
      where: { id: user.id },
      data: { publicProfile: true },
    }).catch(() => {});
  }

  // Начисляем пользователю +150 XP за публикацию проекта в портфолио!
  await db.user.update({
    where: { id: user.id },
    data: { xp: { increment: 150 } },
  }).catch(() => {});

  return NextResponse.json({ ok: true, project, moderationStatus });
}

// PUT — обновление проекта
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const email = (session.user as any).email?.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { id, screenshots, ...rest } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const existing = await db.aiProject.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Only owner or admin can edit
  if (existing.userId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData: any = { ...rest };
  if (screenshots) {
    updateData.screenshots = typeof screenshots === "string" ? screenshots : JSON.stringify(screenshots);
    if (!updateData.screenshot && Array.isArray(screenshots) && screenshots.length > 0) {
      updateData.screenshot = screenshots[0];
    }
  }

  const project = await db.aiProject.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ ok: true, project });
}

// DELETE — удаление проекта
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const db = await getDb();
  const email = (session.user as any).email?.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await db.aiProject.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  if (existing.userId !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.aiProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
