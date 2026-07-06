import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: { url: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" },
});
