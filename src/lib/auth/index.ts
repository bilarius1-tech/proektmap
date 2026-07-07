import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";

let _authPrisma: PrismaClient | null = null;
function getAuthPrisma() {
  if (_authPrisma) return _authPrisma;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  _authPrisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  return _authPrisma;
}

export const authOptions: NextAuthOptions = {
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID || "",
      clientSecret: process.env.YANDEX_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const db = getAuthPrisma();
        const user = await db.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
        if (!user?.passwordHash) return null;
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role, subscription: user.subscription } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth", error: "/auth" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "yandex" && user.email) {
        const db = getAuthPrisma();
        const email = user.email.toLowerCase();
        let dbUser = await db.user.findUnique({ where: { email } });
        if (!dbUser) {
          // Yandex users: free tier, 0 balance
          dbUser = await db.user.create({
            data: { email, name: user.name || "", passwordHash: "", role: "user", subscription: "free" },
          });
        }
        (user as any).id = dbUser.id;
        (user as any).role = dbUser.role;
        (user as any).subscription = dbUser.subscription;
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role || "user";
        token.subscription = (user as any).subscription || "free";
      }
      // Refresh from DB on every call to keep role/subscription updated
      if (token.email) {
        try {
          const db = getAuthPrisma();
          const dbUser = await db.user.findUnique({ where: { email: token.email as string } });
          if (dbUser) {
            token.role = dbUser.role;
            token.subscription = dbUser.subscription;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "user";
        (session.user as any).subscription = token.subscription || "free";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export async function auth() { return getServerSession(authOptions); }
