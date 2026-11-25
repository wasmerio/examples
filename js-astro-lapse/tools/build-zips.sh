#!/usr/bin/env bash
# Regenerate the Next build, check both builds compile, and pack the zips:
#   zips/lapse-astro.zip, zips/lapse-next.zip, zips/lapse-code.zip (both).
# The Astro project is this folder; the Next project is next/.
# Dev-only files (tools, ref, launch, comparison builds, env files) never ship.
set -euo pipefail
cd "$(dirname "$0")/.."

cp buyer-docs/NEXT_README.md next/README.md
node tools/astro-to-next.mjs
node tools/collect-css.mjs
rsync -a --delete public/ next/public/
npx astro build > /dev/null
(cd next && npx next build > /dev/null)

stage=$(mktemp -d); trap 'rm -rf "$stage"' EXIT
mkdir -p "$stage/astro" "$stage/next"
rsync -a \
  --exclude node_modules --exclude dist --exclude .astro --exclude .vercel --exclude '.env*' \
  --exclude .git --exclude .gitignore --exclude .vercelignore --exclude .DS_Store \
  --exclude /tools --exclude /ref --exclude /launch --exclude /next --exclude /zips --exclude /buyer-docs \
  --exclude /.baseline-dist --exclude /.compare-astro --exclude /.compare-next --exclude README.md \
  ./ "$stage/astro/"
rsync -a --exclude node_modules --exclude .next --exclude out --exclude '.env*' --exclude .vercel \
  --exclude next-env.d.ts --exclude tsconfig.tsbuildinfo --exclude AGENTS.md --exclude CLAUDE.md --exclude .DS_Store --exclude README.md \
  next/ "$stage/next/"
cp buyer-docs/ASTRO_README.md "$stage/astro/README.md"
cp next/README.md "$stage/next/README.md"
cp LICENSE "$stage/next/LICENSE"
# Generated-file banners point at the Astro source and the generator, which the
# Next-only download does not include: say what the files are instead.
find "$stage/next/src" -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.js' \) -exec sed -i '' -E '1s#^// GENERATED (from|by) .*#// Lapse for Next.js. Generated from the Lapse Astro source; edit freely.#' {} +
sed -i '' -E '1s#^/\* GENERATED .*\*/#/* Lapse for Next.js: every style in one sheet. Tokens first. */#' "$stage/next/src/styles/site.css"

# Nothing that identifies the demo deployment ships.
if grep -rIl 'polar_cl_\|G-ZDTVFGHC5K\|apollostudio' "$stage"; then echo "demo-only values in bundle" >&2; exit 1; fi
if find "$stage" -name '.env*' -o -name node_modules | grep .; then echo "env files or node_modules in bundle" >&2; exit 1; fi

rm -rf zips && mkdir zips
for s in astro next; do
  d="$stage/pack-$s"; mkdir -p "$d"
  cp -R "$stage/$s" "$d/"; cp buyer-docs/LICENSES.txt "$d/"
  sed '/^| `/d; /^| Folder/d; /^| ---/d; s/^Two builds of the same site.*/The Lapse site for '"$( [ $s = astro ] && echo Astro || echo Next.js )"'. Start with the README in the folder./' buyer-docs/README.md > "$d/README.md"
  (cd "$d" && zip -rq "$OLDPWD/zips/lapse-$s.zip" . -x '*.DS_Store')
done
d="$stage/pack-all"; mkdir -p "$d"; cp -R "$stage/astro" "$stage/next" "$d/"; cp buyer-docs/README.md buyer-docs/LICENSES.txt "$d/"
(cd "$d" && zip -rq "$OLDPWD/zips/lapse-code.zip" . -x '*.DS_Store')
ls -lh zips | awk 'NR>1 {printf "  %-18s %s\n", $9, $5}'
