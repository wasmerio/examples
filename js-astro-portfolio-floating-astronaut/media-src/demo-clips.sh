#!/usr/bin/env bash
# Generates five abstract demo clips with ffmpeg alone (no downloads, no AI
# video), so the template has a working scroll film out of the box. Each clip
# renders small and is upscaled — the soft, blurred look hides it and keeps
# the whole run under a minute.
# Usage: media-src/demo-clips.sh [out-dir]   → out-dir/1..5.mp4 (1080p, 24 fps, 6 s)
set -euo pipefail
OUT="${1:-$(dirname "$0")/clips}"; mkdir -p "$OUT"
S=480x270; D=6; R=24
gen() {
  ffmpeg -v error -y -f lavfi -i "$1" -vf "$2,scale=1920:1080:flags=bicubic,gblur=sigma=6" \
    -t "$D" -c:v libx264 -crf 16 -pix_fmt yuv420p "$OUT/$3.mp4"
  echo "clip $3 → $OUT/$3.mp4"
}
g() { echo "gradients=s=${S}:n=$1:speed=$2:type=$3:$4:d=${D}:r=${R}"; }
gen "$(g 4 0.02 radial c0=0x02100a:c1=0x0b5c34:c2=0x3dff8f:c3=0x04140b)" "gblur=sigma=8" 1
gen "$(g 5 0.015 circular c0=0x010805:c1=0x0a4a2c:c2=0x02140d:c3=0x2fbf75:c4=0x010805)" "gblur=sigma=14" 2
gen "$(g 4 0.025 linear c0=0x01060a:c1=0x0b4f3d:c2=0x02140d:c3=0x37c995)" "gblur=sigma=40,hue=H=t*0.12" 3
gen "$(g 5 0.03 spiral c0=0x000000:c1=0x1fd47a:c2=0x063d22:c3=0x9dffcb:c4=0x000000)" "gblur=sigma=10" 4
gen "$(g 6 0.02 radial c0=0x000000:c1=0x0d6b3f:c2=0x000000:c3=0x7dffb8:c4=0x031a0e:c5=0x000000)" "gblur=sigma=20" 5
