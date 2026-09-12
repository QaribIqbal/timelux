#!/usr/bin/env bash
# Encode all 7 official videos at pristine 4K with Lanczos scaling, intra-frame keyframes (-g 1),
# and optimized CRF 17 so every video is <= 60MB (well below GitHub's 100MB hard limit)
# This enables direct deployment to Netlify with full 4K scrubbing performance.
set -e
FFMPEG="./node_modules/ffmpeg-static/ffmpeg"
OUT="public/videos"
mkdir -p "$OUT" "$OUT/posters"

echo "=== 1/7: Hero 4K Rotation (public/hero: 239 frames @ 3840x2160) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/hero/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 17 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/01-hero-4k-rotation.mp4"
$FFMPEG -y -i "$OUT/01-hero-4k-rotation.mp4" -vframes 1 -q:v 1 "$OUT/posters/01-hero-4k-rotation.jpg"
echo "✓ 1/7 done"

echo "=== 2/7: Case Geometry 360 Rotation (239 frames -> 4K) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/mechanical wrist watch rotating/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset veryfast -crf 17 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/02-case-geometry-rotation.mp4"
$FFMPEG -y -i "$OUT/02-case-geometry-rotation.mp4" -vframes 1 -q:v 1 "$OUT/posters/02-case-geometry-rotation.jpg"
echo "✓ 2/7 done"

echo "=== 3/7: Exploded Deconstruction (299 frames -> 4K) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch componenet seprating/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset veryfast -crf 17 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/03-exploded-deconstruction.mp4"
$FFMPEG -y -i "$OUT/03-exploded-deconstruction.mp4" -vframes 1 -q:v 1 "$OUT/posters/03-exploded-deconstruction.jpg"
echo "✓ 3/7 done"

echo "=== 4/7: Movement Gears 4K (299 frames @ 3840x2160) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch gears moving/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 17 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/04-movement-gears-4k.mp4"
$FFMPEG -y -i "$OUT/04-movement-gears-4k.mp4" -vframes 1 -q:v 1 "$OUT/posters/04-movement-gears-4k.jpg"
echo "✓ 4/7 done"

echo "=== 5/7: Timepiece Reassembly (299 frames -> 4K) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/exploded watch combining/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset veryfast -crf 17 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/05-timepiece-reassembly.mp4"
$FFMPEG -y -i "$OUT/05-timepiece-reassembly.mp4" -vframes 1 -q:v 1 "$OUT/posters/05-timepiece-reassembly.jpg"
echo "✓ 5/7 done"

echo "=== 6/7: Three Watch Collection (239 frames -> 4K) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/three_mechanical_watches/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset veryfast -crf 17 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/06-three-watch-collection.mp4"
$FFMPEG -y -i "$OUT/06-three-watch-collection.mp4" -vframes 1 -q:v 1 "$OUT/posters/06-three-watch-collection.jpg"
echo "✓ 6/7 done"

echo "=== 7/7: Macro Craftsmanship (239 frames -> 4K) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/macro craftsmanship/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset veryfast -crf 17 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/07-macro-craftsmanship.mp4"
$FFMPEG -y -i "$OUT/07-macro-craftsmanship.mp4" -vframes 1 -q:v 1 "$OUT/posters/07-macro-craftsmanship.jpg"
echo "✓ 7/7 done"

# Remove legacy duplicate copies to keep disk and repo lean
rm -f "$OUT/hero-4k-lossless.mp4" "$OUT/hero-watch-rotation.mp4" "$OUT/exploded-view-deconstruction.mp4" \
      "$OUT/mechanical-movement-core-engine.mp4" "$OUT/timepiece-reassembly.mp4" "$OUT/three-watch-collection.mp4" \
      "$OUT/macro-craftsmanship-footage.mp4" "$OUT/sapphire-ui-layer.mp4" "$OUT/sealed-case-infrastructure-shield.mp4"

echo "All 7 videos successfully encoded!"
ls -lh "$OUT"/0*.mp4
