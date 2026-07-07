import { auth } from "@/lib/auth";
import Link from "next/link";
import UserMenu from "./user-menu";

export default async function AuthBlock() {
  const session = await auth();
  if (session?.user) return <UserMenu user={session.user} />;
  return (
    <Link href="/auth" className="btn btn-primary" style={{ textDecoration: "none", fontSize: "var(--text-xs)", padding: "6px 14px" }}>Войти</Link>
  );
}
