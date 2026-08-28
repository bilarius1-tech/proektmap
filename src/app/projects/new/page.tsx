import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewProjectClient from "./client";

export const metadata: Metadata = {
  title: "Добавить работу в портфолио вайбкодера — AI-кейсы | ProektMap",
  description: "Опубликуйте созданный с помощью AI проект, бот, SaaS или веб-сервис в каталоге работ ProektMap.",
};

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth?callbackUrl=/projects/new");
  }

  return <NewProjectClient user={session.user} />;
}
