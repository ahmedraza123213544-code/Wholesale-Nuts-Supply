import { createWriteStream, existsSync, unlinkSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { cwd } from "process";

const require = createRequire(import.meta.url);
const archiver = require("archiver");

const root = cwd();
const outDir = path.join(root, "out");
const zipPath = path.join(root, "out.zip");

if (!existsSync(outDir)) {
  console.error("Missing out/ folder. Run next build with output: 'export' first.");
  process.exit(1);
}

if (existsSync(zipPath)) {
  unlinkSync(zipPath);
  console.log("Removed old out.zip");
}

await new Promise((resolve, reject) => {
  const output = createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    const mb = (archive.pointer() / (1024 * 1024)).toFixed(2);
    console.log(`Created out.zip (${mb} MB) — upload this to Hostinger.`);
    resolve();
  });
  archive.on("error", reject);

  archive.pipe(output);
  archive.directory(outDir, false);
  archive.finalize();
});
