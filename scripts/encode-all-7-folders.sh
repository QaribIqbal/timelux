#!/usr/bin/env bash
# Encode ALL 7 folders using ALL frames with intra-frame keyframes (-g 1) and CRF 14
# This guarantees pristine native sharpness, zero seek latency, and zero inter-frame blur.
set -e
FFMPEG="./node_modules/ffmpeg-static/ffmpeg"
OUT="public/videos"
mkdir -p "$OUT" "$OUT/posters"

echo "=== 1/7: Hero 4K Rotation (public/hero: 239 frames @ 3840x2160) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/hero/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 14 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/01-hero-4k-rotation.mp4"
$FFMPEG -y -i "$OUT/01-hero-4k-rotation.mp4" -vframes 1 -q:v 1 "$OUT/posters/01-hero-4k-rotation.jpg"
echo "✓ 1/7 done"

echo "=== 2/7: Case & Bracelet 360 Rotation (public/mechanical wrist watch rotating: 239 frames @ 2560x1440) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/mechanical wrist watch rotating/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 14 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/02-case-geometry-rotation.mp4"
$FFMPEG -y -i "$OUT/02-case-geometry-rotation.mp4" -vframes 1 -q:v 1 "$OUT/posters/02-case-geometry-rotation.jpg"
echo "✓ 2/7 done"

echo "=== 3/7: Exploded Deconstruction (public/watch componenet seprating: ALL 299 frames @ 2560x1440) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch componenet seprating/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 14 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/03-exploded-deconstruction.mp4"
$FFMPEG -y -i "$OUT/03-exploded-deconstruction.mp4" -vframes 1 -q:v 1 "$OUT/posters/03-exploded-deconstruction.jpg"
echo "✓ 3/7 done"

echo "=== 4/7: Movement Gears 4K (public/watch gears moving: ALL 299 frames @ 3840x2160) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch gears moving/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 14 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/04-movement-gears-4k.mp4"
$FFMPEG -y -i "$OUT/04-movement-gears-4k.mp4" -vframes 1 -q:v 1 "$OUT/posters/04-movement-gears-4k.jpg"
echo "✓ 4/7 done"

echo "=== 5/7: Timepiece Reassembly (public/exploded watch combining: ALL 299 frames @ 2560x1440) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/exploded watch combining/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 14 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/05-timepiece-reassembly.mp4"
$FFMPEG -y -i "$OUT/05-timepiece-reassembly.mp4" -vframes 1 -q:v 1 "$OUT/posters/05-timepiece-reassembly.jpg"
echo "✓ 5/7 done"

echo "=== 6/7: Three Watch Collection (public/three_mechanical_watches: ALL 239 frames @ 2560x1440) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/three_mechanical_watches/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 14 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/06-three-watch-collection.mp4"
$FFMPEG -y -i "$OUT/06-three-watch-collection.mp4" -vframes 1 -q:v 1 "$OUT/posters/06-three-watch-collection.jpg"
echo "✓ 6/7 done"

echo "=== 7/7: Macro Craftsmanship (public/macro craftsmanship: ALL 239 frames @ 2560x1440) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/macro craftsmanship/ezgif-frame-*.png" \
  -c:v libx264 -preset veryfast -crf 14 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/07-macro-craftsmanship.mp4"
$FFMPEG -y -i "$OUT/07-macro-craftsmanship.mp4" -vframes 1 -q:v 1 "$OUT/posters/07-macro-craftsmanship.jpg"
echo "✓ 7/7 done"

# Also maintain symlinks / copies for previous file names to preserve compatibility
cp "$OUT/01-hero-4k-rotation.mp4" "$OUT/hero-watch-rotation.mp4"
cp "$OUT/posters/01-hero-4k-rotation.jpg" "$OUT/posters/hero-watch-rotation.jpg"

cp "$OUT/03-exploded-deconstruction.mp4" "$OUT/exploded-view-deconstruction.mp4"
cp "$OUT/posters/03-exploded-deconstruction.jpg" "$OUT/posters/exploded-view-deconstruction.jpg"

cp "$OUT/04-movement-gears-4k.mp4" "$OUT/mechanical-movement-core-engine.mp4"
cp "$OUT/posters/04-movement-gears-4k.jpg" "$OUT/posters/mechanical-movement-core-engine.jpg"

cp "$OUT/05-timepiece-reassembly.mp4" "$OUT/timepiece-reassembly.mp4"
cp "$OUT/posters/05-timepiece-reassembly.jpg" "$OUT/posters/timepiece-reassembly.jpg"

cp "$OUT/06-three-watch-collection.mp4" "$OUT/three-watch-collection.mp4"
cp "$OUT/posters/06-three-watch-collection.jpg" "$OUT/posters/three-watch-collection.jpg"

cp "$OUT/07-macro-craftsmanship.mp4" "$OUT/macro-craftsmanship-footage.mp4"
cp "$OUT/posters/07-macro-craftsmanship.jpg" "$OUT/posters/macro-craftsmanship-footage.jpg"

echo "ALL 7 FOLDERS ENCODED WITH ALL INTRA-FRAMES AT FULL QUALITY!"
ls -lh "$OUT"/0*.mp4
