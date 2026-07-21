import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import MCPDetailClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const server = await db.mCPServer.findUnique({ where: { slug } });
  if (!server) return { title: "Не найдено" };
  return {
    title: `${server.name} — MCP-сервер`,
    description: server.description,
  };
}

export default async function Page({ params }: any) {
  const { slug } = await params;
  const db = await getDb();
  const server = await db.mCPServer.findUnique({ where: { slug } });
  if (!server) notFound();
  return <MCPDetailClient server={JSON.parse(JSON.stringify(server))} />;
}
