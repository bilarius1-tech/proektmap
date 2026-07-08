import { auth } from "@/lib/auth";
import GearAssistant from "./gear-assistant";

export default async function AssistantWrapper() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isPro = isLoggedIn && ((session.user as any)?.subscription === "pro" || (session.user as any)?.role === "admin");

  return <GearAssistant isLoggedIn={isLoggedIn} isPro={isPro} />;
}
