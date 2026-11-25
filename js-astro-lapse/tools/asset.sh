#!/bin/bash
# Download a Framer image at full colour. Plain PNG requests come back as a
# 256-colour palette version, so always ask for WebP.
# usage: tools/asset.sh <framerusercontent url> <public path, e.g. public/assets/blog/cover.webp>
set -e
url="${1%%\?*}"; out="$2"; mkdir -p "$(dirname "$out")"
case "$url" in
  *.mp4|*.svg) curl -sfL "$url" -o "$out" ;;
  *) curl -sfL -H "Accept: image/webp,image/*" "$url" -o "$out" ;;
esac
file "$out"
