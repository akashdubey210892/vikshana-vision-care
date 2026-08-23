import JSZip from "jszip";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "public", "source-code.zip");

const exclude = [
  "node_modules",
  ".git",
  "dist",
  ".env",
  ".env.local",
  ".env.*",
  "public/source-code.zip",
  ".lovable",
  "bun.lockb",
  "package-lock.json",
  ".DS_Store",
  "tmp",
  "temp",
  "coverage",
  ".turbo",
  ".cache",
  "*.log",
];

function shouldInclude(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  for (const pattern of exclude) {
    if (pattern.includes("*")) {
      const regex = new RegExp(
        "^" + pattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$"
      );
      if (regex.test(rel)) return false;
    } else if (rel === pattern || rel.startsWith(pattern + "/")) {
      return false;
    }
  }
  return true;
}

function addDir(zipFolder, realDir) {
  const entries = fs.readdirSync(realDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(realDir, entry.name);
    if (!shouldInclude(fullPath)) continue;
    if (entry.isDirectory()) {
      const childFolder = zipFolder.folder(entry.name);
      addDir(childFolder, fullPath);
    } else {
      zipFolder.file(entry.name, fs.readFileSync(fullPath));
    }
  }
}

async function main() {
  const zip = new JSZip();
  addDir(zip, root);
  const content = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
  console.log(
    `Created ${outPath} (${(content.length / 1024).toFixed(1)} KB)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
