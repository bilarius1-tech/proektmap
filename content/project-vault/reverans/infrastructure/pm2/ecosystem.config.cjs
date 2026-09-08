/**
 * Reverans PM2 pattern (sanitized for Vault).
 * Production loads secrets from web/.env + secrets/* files — never commit values.
 * See docs/SECRETS.md in this package.
 */
module.exports = {
  apps: [
    {
      name: "reverans",
      cwd: "/var/www/reverans/web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3050 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3050",
        NEXTAUTH_URL: "https://reverans.online",
        NEXT_PUBLIC_SITE_URL: "https://reverans.online",
        // Injected at runtime from files / .env on VPS (not in this package):
        // DATABASE_URL, NEXTAUTH_SECRET, YANDEX_*, TBANK_*, NODE_EXTRA_CA_CERTS
      },
      max_memory_restart: "500M",
      time: true,
    },
  ],
};
