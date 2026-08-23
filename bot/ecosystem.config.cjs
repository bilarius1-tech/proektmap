module.exports = {
  apps: [
    {
      name: "proektmap-bot",
      cwd: "/var/www/www-root/data/www/proektmap.ru/bot",
      script: "index.ts",
      interpreter: "node",
      interpreter_args: "--import tsx",
      max_memory_restart: "300M",
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
