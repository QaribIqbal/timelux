#!/usr/bin/env bash
# Re-encode all 8 videos at native source resolution, CRF 18 (high quality)
# Sources are 2560x1440 (2K) or 3840x2160 (4K)
set -e
FFMPEG="./node_modules/ffmpeg-static/ffmpeg"
OUT="public/videos"
mkdir -p "$OUT"

echo "== 1/8  hero-watch-rotation  (2560x1440, 30fps) =="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/mechanical wrist watch rotating/ezgif-frame-*.png" \
  -vf "scale=2560:1440:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/hero-watch-rotation.mp4"
echo "✓ hero done"

echo "== 2/8  exploded-view-deconstruction  (2560x1440, 30fps) =="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch componenet seprating/ezgif-frame-*.png" \
  -vf "scale=2560:1440:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/exploded-view-deconstruction.mp4"
echo "✓ exploded done"

echo "== 3/8  sapphire-ui-layer  (frames 1-140, 2560x1440) =="
SAPPHIRE_FRAMES=$(ls "public/watch componenet seprating/ezgif-frame-"*.png | head -140 | tr '\n' '|' | sed 's/|$//')
# Use select filter to pick first 140 frames
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch componenet seprating/ezgif-frame-*.png" \
  -vf "select='lte(n\,139)',scale=2560:1440:flags=lanczos,setpts=N/FRAME_RATE/TB" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/sapphire-ui-layer.mp4"
echo "✓ sapphire done"

echo "== 4/8  mechanical-movement-core-engine  (3840x2160, 30fps) =="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch gears moving/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/mechanical-movement-core-engine.mp4"
echo "✓ movement done"

echo "== 5/8  sealed-case-infrastructure-shield  (frames 145-299, 2560x1440) =="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch componenet seprating/ezgif-frame-*.png" \
  -vf "select='gte(n\,144)',scale=2560:1440:flags=lanczos,setpts=N/FRAME_RATE/TB" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/sealed-case-infrastructure-shield.mp4"
echo "✓ shield done"

echo "== 6/8  timepiece-reassembly  (2560x1440, 30fps) =="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/exploded watch combining/ezgif-frame-*.png" \
  -vf "scale=2560:1440:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/timepiece-reassembly.mp4"
echo "✓ reassembly done"

echo "== 7/8  three-watch-collection  (2560x1440, 30fps) =="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/three_mechanical_watches/ezgif-frame-*.png" \
  -vf "scale=2560:1440:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/three-watch-collection.mp4"
echo "✓ collection done"

echo "== 8/8  macro-craftsmanship-footage  (2560x1440, 30fps) =="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/macro craftsmanship/ezgif-frame-*.png" \
  -vf "scale=2560:1440:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/macro-craftsmanship-footage.mp4"
echo "✓ macro done"

echo ""
echo "== Extracting new poster frames at native resolution =="
mkdir -p "$OUT/posters"
for VIDEO in "$OUT"/*.mp4; do
  NAME=$(basename "$VIDEO" .mp4)
  $FFMPEG -y -i "$VIDEO" -vframes 1 -q:v 2 "$OUT/posters/$NAME.jpg"
  echo "  poster: $NAME.jpg"
done

echo ""
echo "ALL DONE. Listing new file sizes:"
ls -lh "$OUT"/*.mp4
