#!/usr/bin/env bash
# Render an SVG diagram to PNG for visual QC.
#
# Usage: bash scripts/render-diagram.sh path/to/diagram.svg [out.png]
# Output: path/to/diagram.qc.png (2x scale) — gitignored, for review only.
#
# NOTE: this headless Chromium build truncates painting when the window is
# short (content below ~y=60 goes missing). We render with a tall window and
# crop to the SVG's declared size. Do not "simplify" this away.
set -euo pipefail

SVG="$(realpath "$1")"
OUT="${2:-${SVG%.svg}.qc.png}"

W=$(grep -o 'width="[0-9]*"' "$SVG" | head -1 | grep -o '[0-9]*')
H=$(grep -o 'height="[0-9]*"' "$SVG" | head -1 | grep -o '[0-9]*')
if [ -z "$W" ] || [ -z "$H" ]; then
  echo "ERROR: root <svg> must declare integer width/height attributes" >&2
  exit 1
fi
WINH=$(( H > 400 ? H : 400 ))

TMP="$(mktemp -t qc-XXXXXX.png)"
/opt/pw-browsers/chromium --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=2 --screenshot="$TMP" \
  --window-size="${W},${WINH}" "file://$SVG" 2>/dev/null

python3 - "$TMP" "$OUT" "$W" "$H" <<'PY'
import sys
from PIL import Image
tmp, out, w, h = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
Image.open(tmp).convert("RGB").crop((0, 0, 2 * w, 2 * h)).save(out)
PY
rm -f "$TMP"
echo "$OUT"
