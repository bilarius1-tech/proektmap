import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright-core"],
  experimental: {
    serverActions: {
      bodySizeLimit: "80mb",
    },
  },
};
export default nextConfig;
