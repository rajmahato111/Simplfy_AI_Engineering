#!/usr/bin/env bash
# Creates .env from .env.example with a fresh AUTH_SECRET (file is gitignored).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SECRET="$(openssl rand -base64 32)"
cp "$ROOT/.env.example" "$ROOT/.env"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|AUTH_SECRET=generate-with-openssl-rand-base64-32|AUTH_SECRET=${SECRET}|" "$ROOT/.env"
else
  sed -i "s|AUTH_SECRET=generate-with-openssl-rand-base64-32|AUTH_SECRET=${SECRET}|" "$ROOT/.env"
fi
echo "Wrote $ROOT/.env — fill in ANTHROPIC_API_KEY, STRIPE_SECRET_KEY, OAuth as needed."
