#!/bin/sh
# Helper to run dev / deploy / test for the email-cloudflare-resend worker submodule.
# Usage: npm run email:dev | npm run email:deploy | npm run email:test

SUBMODULE="integrations/email-cloudflare-resend"

if [ ! -d "$SUBMODULE" ]; then
  echo "⚠️  Submodule missing. Run: git submodule update --init"
  exit 1
fi

cd "$SUBMODULE" || exit 1

if [ -z "$1" ]; then
  echo "Usage: $0 <dev|deploy|test>"
  exit 1
fi

npm run "$1"
