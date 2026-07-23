import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import MCPDetailClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const session = await auth();
  const isLoggedIn = !!session?.user;
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
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const db = await getDb();
  const server = await db.mCPServer.findUnique({ where: { slug } });
  if (!server) notFound();
  return <>
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"SoftwareApplication",
        "name":server.name,"description":(server.description||"").substring(0,200),
        "applicationCategory":"DeveloperApplication",
        "aggregateRating":{"@type":"AggregateRating","ratingValue":server.rating,"bestRating":"10","ratingCount":server.stars>0?server.stars:1}
      })}}
    />
    <MCPDetailClient server={JSON.parse(JSON.stringify(server))} isLoggedIn={isLoggedIn} />
  </>;
}
