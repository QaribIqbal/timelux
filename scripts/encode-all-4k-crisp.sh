#!/usr/bin/env bash
# Encode ALL remaining sequences to true 3840x2160 (4K) with Lanczos super-resolution,
# subtle high-frequency edge sharpening (unsharp=7:7:1.15:7:7:0.0),
# All-Intra keyframes (-g 1 -keyint_min 1), and pristine CRF 10 visually lossless quality.
set -e
FFMPEG="./node_modules/ffmpeg-static/ffmpeg"
OUT="public/videos"
mkdir -p "$OUT" "$OUT/posters"
echo "=== 2/7: Case Geometry 360 Rotation (ALL 239 frames -> 4K @ 3840x2160, CRF 10, Intra-Frame) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/mechanical wrist watch rotating/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=7:7:1.15:7:7:0.0" \
  -c:v libx264 -preset veryfast -crf 10 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/02-case-geometry-rotation.mp4"
$FFMPEG -y -i "$OUT/02-case-geometry-rotation.mp4" -vframes 1 -q:v 1 "$OUT/posters/02-case-geometry-rotation.jpg"
echo "✓ 2/7 done"

echo "=== 3/7: Exploded Deconstruction (ALL 299 frames -> 4K @ 3840x2160, CRF 10, Intra-Frame) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch componenet seprating/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=7:7:1.15:7:7:0.0" \
  -c:v libx264 -preset veryfast -crf 10 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/03-exploded-deconstruction.mp4"
$FFMPEG -y -i "$OUT/03-exploded-deconstruction.mp4" -vframes 1 -q:v 1 "$OUT/posters/03-exploded-deconstruction.jpg"
echo "✓ 3/7 done"

echo "=== 4/7: Movement Gears 4K (ALL 299 frames -> 4K @ 3840x2160, CRF 10, Intra-Frame) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/watch gears moving/ezgif-frame-*.png" \
  -vf "unsharp=7:7:1.15:7:7:0.0" \
  -c:v libx264 -preset veryfast -crf 10 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/04-movement-gears-4k.mp4"
$FFMPEG -y -i "$OUT/04-movement-gears-4k.mp4" -vframes 1 -q:v 1 "$OUT/posters/04-movement-gears-4k.jpg"
echo "✓ 4/7 done"

echo "=== 5/7: Timepiece Reassembly (ALL 299 frames -> 4K @ 3840x2160, CRF 10, Intra-Frame) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/exploded watch combining/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=7:7:1.15:7:7:0.0" \
  -c:v libx264 -preset veryfast -crf 10 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/05-timepiece-reassembly.mp4"
$FFMPEG -y -i "$OUT/05-timepiece-reassembly.mp4" -vframes 1 -q:v 1 "$OUT/posters/05-timepiece-reassembly.jpg"
echo "✓ 5/7 done"

echo "=== 6/7: Three Watch Collection (ALL 239 frames -> 4K @ 3840x2160, CRF 10, Intra-Frame) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/three_mechanical_watches/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=7:7:1.15:7:7:0.0" \
  -c:v libx264 -preset veryfast -crf 10 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/06-three-watch-collection.mp4"
$FFMPEG -y -i "$OUT/06-three-watch-collection.mp4" -vframes 1 -q:v 1 "$OUT/posters/06-three-watch-collection.jpg"
echo "✓ 6/7 done"

echo "=== 7/7: Macro Craftsmanship (ALL 239 frames -> 4K @ 3840x2160, CRF 10, Intra-Frame) ==="
$FFMPEG -y -framerate 30 \
  -pattern_type glob -i "public/macro craftsmanship/ezgif-frame-*.png" \
  -vf "scale=3840:2160:flags=lanczos,unsharp=7:7:1.15:7:7:0.0" \
  -c:v libx264 -preset veryfast -crf 10 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/07-macro-craftsmanship.mp4"
$FFMPEG -y -i "$OUT/07-macro-craftsmanship.mp4" -vframes 1 -q:v 1 "$OUT/posters/07-macro-craftsmanship.jpg"
echo "✓ 7/7 done"

# Mirror legacy filenames
cp "$OUT/02-case-geometry-rotation.mp4" "$OUT/hero-watch-rotation.mp4" || true
cp "$OUT/03-exploded-deconstruction.mp4" "$OUT/exploded-view-deconstruction.mp4"
cp "$OUT/04-movement-gears-4k.mp4" "$OUT/mechanical-movement-core-engine.mp4"
cp "$OUT/05-timepiece-reassembly.mp4" "$OUT/timepiece-reassembly.mp4"
cp "$OUT/06-three-watch-collection.mp4" "$OUT/three-watch-collection.mp4"
cp "$OUT/07-macro-craftsmanship.mp4" "$OUT/macro-craftsmanship-footage.mp4"

cp "$OUT/posters/02-case-geometry-rotation.jpg" "$OUT/posters/hero-watch-rotation.jpg" || true
cp "$OUT/posters/03-exploded-deconstruction.jpg" "$OUT/posters/exploded-view-deconstruction.jpg"
cp "$OUT/posters/04-movement-gears-4k.jpg" "$OUT/posters/mechanical-movement-core-engine.jpg"
cp "$OUT/posters/05-timepiece-reassembly.jpg" "$OUT/posters/timepiece-reassembly.jpg"
cp "$OUT/posters/06-three-watch-collection.jpg" "$OUT/posters/three-watch-collection.jpg"
cp "$OUT/posters/07-macro-craftsmanship.jpg" "$OUT/posters/macro-craftsmanship-footage.jpg"

echo "ALL 7 FOLDERS NOW PRODUCED AT 4K RES, INTRA-FRAME KEYFRAMES, CRF 10 VISUAL FIDELITY!"
ls -lh "$OUT"/0*.mp4
