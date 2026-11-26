#!/usr/bin/env bash
# Builds the scroll-scrubbed background film from your clips, in order.
# Usage: media-src/build-film.sh clip1.mp4 clip2.mp4 [...]
#   Clips: any count ≥ 2, ideally 1920x1080 / 24 fps (AI video, stock, screen
#   recordings…). No clips yet? Run media-src/demo-clips.sh first.
# Writes public/media/film/: film-scrub-1080.mp4 (desktop), film-scrub-540.mp4
# (touch), film-poster.jpg and film-chapters.json (where each clip starts).
set -euo pipefail
(( $# >= 2 )) || { echo "usage: $0 clip1.mp4 clip2.mp4 [...]" >&2; exit 1; }
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; OUT="$ROOT/public/media/film"; XF=0.6
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"
CLIPS=("$@"); N=${#CLIPS[@]}
durs=(); for c in "${CLIPS[@]}"; do durs+=("$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$c")"); done
# Chain crossfades; record where each chapter starts in the joined film.
inputs=(); for c in "${CLIPS[@]}"; do inputs+=(-i "$c"); done
filter=""; prev="[0:v]"; offset=0; starts="0"
for (( i = 1; i < N; i++ )); do
  offset=$(echo "$offset + ${durs[$((i-1))]} - $XF" | bc -l)
  starts+=" $(printf '%.3f' "$offset")"
  out="[v$i]"
  filter+="${prev}[$i:v]xfade=transition=fade:duration=$XF:offset=$(printf '%.3f' "$offset")${out};"
  prev="$out"
done
filter+="${prev}scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p,setsar=1[vout]"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$filter" -map "[vout]" -r 24 -c:v libx264 -crf 14 -preset slow -an "$TMP/master.mp4"
total=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/master.mp4")
# Desktop: 1080p with a keyframe every 6 frames, so a seek decodes at most 5
# frames. Cloudflare Pages rejects files > 25 MiB, so raise CRF until it fits.
for crf in 26 27 28 29 30 32; do
  ffmpeg -v error -y -i "$TMP/master.mp4" -c:v libx264 -preset slow -tune film -crf $crf -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an "$OUT/film-scrub-1080.mp4"
  size=$(wc -c < "$OUT/film-scrub-1080.mp4" | tr -d ' ')
  echo "desktop 1080p crf $crf: $size bytes"
  (( size < 25000000 )) && break
done
# Touch: 540p at 12 fps, every frame a keyframe — phones seek instantly.
ffmpeg -v error -y -i "$TMP/master.mp4" -vf "scale=960:-2,fps=12" -c:v libx264 -preset slow -tune film -crf 30 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an "$OUT/film-scrub-540.mp4"
ffmpeg -v error -y -i "$TMP/master.mp4" -frames:v 1 -vf scale=1920:-2 -q:v 3 "$OUT/film-poster.jpg"
python3 - "$total" $starts > "$OUT/film-chapters.json" <<'PY'
import json, sys
total = float(sys.argv[1]); starts = [float(x) for x in sys.argv[2:]]
print(json.dumps({"duration": round(total, 3), "chapters": [
  {"id": f"chapter-{i + 1}", "start": round(s, 3), "progress": round(s / total, 4)} for i, s in enumerate(starts)]}, indent=2))
PY
ls -la "$OUT"
