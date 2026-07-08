import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";
import DashboardClient from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const db = await getDb();
  const email = (session.user as any).email?.toLowerCase();
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, subscription: true, xp: true, level: true, streak: true, avatar: true, bio: true, status: true, skills: true, publicProfile: true },
  });
  if (!user) return null;

  // User's posts
  const posts = await db.blogPost.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" }, take: 5,
    include: { category: { select: { name: true } } },
  });

  // Blueprints with progress
  const blueprints = await db.blueprint.findMany({
    include: {
      _count: { select: { stages: true } },
    },
  });

  // Completed decisions for progress
  const completed = await db.projectDecision.findMany({
    where: { projectId: "demo", status: "done" },
    select: { decisionId: true },
  });
  const completedIds = new Set(completed.map(c => c.decisionId));

  // Global stats
  const totalUsers = await db.user.count();
  const totalPosts = await db.blogPost.count({ where: { status: "published" } });
  const totalDecisions = await db.decision.count();

  return (
    <DashboardClient
      user={JSON.parse(JSON.stringify(user))}
      posts={JSON.parse(JSON.stringify(posts))}
      blueprints={JSON.parse(JSON.stringify(blueprints))}
      completedIds={JSON.parse(JSON.stringify([...completedIds]))}
      stats={{ totalUsers, totalPosts, totalDecisions }}
      isAdmin={user.role === "admin"}
      isPro={user.subscription === "pro" || user.role === "admin"}
    />
  );
}
