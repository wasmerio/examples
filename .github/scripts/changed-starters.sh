#!/usr/bin/env bash
set -euo pipefail

base=$1
head=$2

git diff --name-only --no-renames -z "$base...$head" -- |
  while IFS= read -r -d '' file; do
    case "$file" in
      _shared/starter-ui/*|scripts/sync-starter-ui.mjs)
        if git cat-file -e "$head:_shared/starter-ui/wasmer-starter-ui.js" 2>/dev/null; then
          printf '%s\n' '_shared/starter-ui'
        fi
        continue
        ;;
      Anybuild.*) folder=${file#Anybuild.} ;;
      */*) folder=${file%%/*} ;;
      *) continue ;;
    esac

    case "$folder" in
      fail-*|skip-*|scripts|_shared|reports) continue ;;
    esac
    [[ $folder =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]] || continue
    [[ $(git cat-file -t "$head:$folder" 2>/dev/null || true) == tree ]] || continue
    case "$folder" in
      go-*|js-*|php-*|python-*) printf '%s\n' "$folder"; continue ;;
    esac

    for manifest in Anybuild app.yaml wasmer.toml Staticfile package.json pyproject.toml \
      requirements.txt composer.json go.mod Gemfile Cargo.toml; do
      if git cat-file -e "$head:$folder/$manifest" 2>/dev/null; then
        printf '%s\n' "$folder"
        break
      fi
    done
  done | LC_ALL=C sort -u
