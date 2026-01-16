import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

async function ensureCleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function copyIfExists(file) {
  const src = path.join(ROOT, file);
  try {
    await fs.access(src);
  } catch {
    return;
  }
  await fs.copyFile(src, path.join(DIST, file));
}

async function main() {
  await ensureCleanDir(DIST);

  const files = [
    "index.html",
    "privacy.html",
    "terms.html",
    "refund.html",
    "robots.txt",
    "sitemap.xml",
    "CNAME",
    "koramangala.html",
    "indiranagar.html",
    "therapist-hiring.html",
  ];

  for (const file of files) {
    await copyIfExists(file);
  }

  await copyDir(path.join(ROOT, "assets"), path.join(DIST, "assets"));
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
