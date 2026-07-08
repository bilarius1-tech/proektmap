import { getDb } from "@/lib/db/index";
import UsersClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const db = await getDb();
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true, projects: true } } },
  });
  return <UsersClient users={JSON.parse(JSON.stringify(users))} />;
}
