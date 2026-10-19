import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
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

/**
 * Связывает вход через Яндекс с users по стабильному Yandex ID (user_identities).
 * Яндекс подтверждает владение почтой, поэтому email помечается подтверждённым.
 */
async function linkYandexAccount(input: { yandexId: string; email: string; name?: string | null; image?: string | null }) {
  const db = getAuthPrisma();
  const now = new Date();
  const identity = await db.userIdentity.findUnique({
    where: { provider_providerAccountId: { provider: "yandex", providerAccountId: input.yandexId } },
    include: { user: true },
  });

  let dbUser = identity?.user ?? (await db.user.findUnique({ where: { email: input.email } }));

  // Пользователь сменил основной адрес в Яндексе: переносим его на тот же аккаунт, если адрес свободен.
  if (identity && dbUser && dbUser.email !== input.email) {
    const taken = await db.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (!taken) {
      dbUser = await db.user.update({ where: { id: dbUser.id }, data: { email: input.email } });
    } else {
      console.warn("[auth] Yandex email changed to an address owned by another user; keeping link as is");
    }
  }

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        email: input.email,
        name: input.name || input.email.split("@")[0],
        role: "user",
        subscription: "free",
        avatar: input.image || "",
        emailVerified: now,
      },
    });
  } else {
    const data: { emailVerified?: Date; passwordHash?: string; avatar?: string } = {};
    if (!dbUser.emailVerified) {
      data.emailVerified = now;
      // Пароль ставили без подтверждения почты: его мог задать кто угодно. Владелец почты вошёл через Яндекс — гасим пароль.
      if (!identity && dbUser.passwordHash) data.passwordHash = "";
    }
    if (input.image && (!dbUser.avatar || dbUser.avatar.startsWith("/api/avatar"))) data.avatar = input.image;
    if (Object.keys(data).length) await db.user.update({ where: { id: dbUser.id }, data });
  }

  await db.userIdentity.upsert({
    where: { provider_providerAccountId: { provider: "yandex", providerAccountId: input.yandexId } },
    create: { userId: dbUser.id, provider: "yandex", providerAccountId: input.yandexId, email: input.email, lastLoginAt: now },
    update: { email: input.email, lastLoginAt: now },
  });
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
  pages: { signIn: "/auth" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "yandex") {
        // Без email не можем привязать вход к users.id: сессия получила бы Yandex ID вместо нашего id.
        if (!user.email) return "/auth?error=YandexNoEmail";
        try {
          await linkYandexAccount({
            yandexId: account.providerAccountId,
            email: user.email.toLowerCase(),
            name: user.name,
            image: user.image,
          });
        } catch (e) { console.error("Yandex signIn error:", e instanceof Error ? e.message : e); }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Credentials: DB uuid. Yandex OAuth: provider subject id — overwritten below by email lookup.
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role || "user";
        token.subscription = (user as any).subscription || "free";
      }
      if (token.email) {
        try {
          const db = getAuthPrisma();
          const email = String(token.email).toLowerCase();
          const dbUser = await db.user.findUnique({ where: { email } });
          if (dbUser) {
            // Always use our users.id — never leave Yandex/OAuth subject as session user id
            // (otherwise blog_posts.authorId FK and other User FKs break).
            token.id = dbUser.id;
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
        if (token.email) session.user.email = String(token.email).toLowerCase();
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export async function auth() { return getServerSession(authOptions); }
