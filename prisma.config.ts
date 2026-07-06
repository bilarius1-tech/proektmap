import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    directory: "./prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public",
  },
});
