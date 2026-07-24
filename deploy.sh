#!/bin/bash
# Deploy ProektMap to production
set -e
echo "🚀 Deploying ProektMap..."
echo "📤 Pushing to GitHub..."
git push origin main
echo "📥 Pulling on server + build..."
ssh root@109.196.165.106 "
  cd /var/www/www-root/data/www/proektmap.ru &&
  git pull origin main &&
  rm -rf .next &&
  npx next build &&
  pm2 restart proektmap --update-env &&
  nginx -s reload
"
echo "✅ Done! https://proektmap.ru"
