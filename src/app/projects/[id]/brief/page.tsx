import { auth } from "@/lib/auth";
import BriefClient from "./client";

export const dynamic = "force-dynamic";

export default async function BriefPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  return <BriefClient projectId={id} isLoggedIn={!!session?.user} />;
}
