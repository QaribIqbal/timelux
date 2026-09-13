import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const deliveries = [
  [
    "assets/video-masters/06-three-watch-collection.76bdaf35.mp4",
    "public/videos/optimized/06-three-watch-collection.mp4",
  ],
  [
    "assets/video-masters/07-macro-craftsmanship.9792d978.mp4",
    "public/videos/optimized/07-macro-craftsmanship.mp4",
  ],
];

mkdirSync("public/videos/optimized", { recursive: true });

for (const [input, output] of deliveries) {
  const result = spawnSync(ffmpegPath, [
    "-y",
    "-i", input,
    "-vf", "scale=-2:720:flags=lanczos",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    output,
  ], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
