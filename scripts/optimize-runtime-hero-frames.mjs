import { cpus } from "node:os";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = path.resolve("assets/hero-sequence-masters/20260912");
const outputRoot = path.resolve("public/hero-sequences/20260913");
const runtimeWidth = 1920;
const workers = Math.min(Math.max(2, cpus().length - 1), 6);

for (const id of await readdir(sourceRoot)) {
  const sourceDir = path.join(sourceRoot, id);
  const outputDir = path.join(outputRoot, id);
  const files = (await readdir(sourceDir)).filter((file) => file.endsWith(".webp")).sort();
  await mkdir(outputDir, { recursive: true });

  let nextIndex = 0;
  await Promise.all(Array.from({ length: workers }, async () => {
    while (nextIndex < files.length) {
      const file = files[nextIndex++];
      await sharp(path.join(sourceDir, file))
        .resize({ width: runtimeWidth, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6, smartSubsample: true })
        .toFile(path.join(outputDir, file));
    }
  }));

  console.log(`${id}: ${files.length} runtime WebP frames`);
}
