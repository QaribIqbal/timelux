import { cpus } from "node:os";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = "/Users/qaribiqbal/.Trash/timelux-raw-frame-sources-20260912";
const outputRoot = path.resolve("public/hero-sequences/20260912");

const sequences = [
  ["hero", "hero", 239],
  ["geometry", "mechanical wrist watch rotating", 239],
  ["deconstruction", "watch componenet seprating", 299],
  ["movement", "watch gears moving", 299],
  ["reassembly", "exploded watch combining", 299],
];

const numericSort = new Intl.Collator(undefined, { numeric: true }).compare;

async function convertSequence([id, sourceName, expectedCount]) {
  const sourceDir = path.join(sourceRoot, sourceName);
  const files = (await readdir(sourceDir))
    .filter((file) => file.endsWith(".png"))
    .sort(numericSort);

  if (files.length !== expectedCount) {
    throw new Error(`${id}: expected ${expectedCount} PNG frames, found ${files.length}`);
  }

  const outputDir = path.join(outputRoot, id);
  await mkdir(outputDir, { recursive: true });

  const workers = Math.min(Math.max(2, cpus().length - 1), 6);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (nextIndex < files.length) {
        const index = nextIndex++;
        const inputPath = path.join(sourceDir, files[index]);
        const outputPath = path.join(outputDir, `frame-${String(index + 1).padStart(4, "0")}.webp`);

        try {
          await stat(outputPath);
          continue;
        } catch {
          await sharp(inputPath)
            .webp({ quality: 86, effort: 6, smartSubsample: true })
            .toFile(outputPath);
        }
      }
    })
  );

  console.log(`${id}: ${files.length} WebP frames`);
}

for (const sequence of sequences) {
  await convertSequence(sequence);
}
