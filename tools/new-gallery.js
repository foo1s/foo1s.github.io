#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const slug = process.argv[2];
const title = process.argv[3];
const dateArg = process.argv[4];
const descriptionArg = process.argv[5];

function usage() {
  console.log("Usage:");
  console.log('  node tools/new-gallery.js <slug> "<title>" [YYYY-MM-DD] ["description"]');
}

if (!slug || !title) {
  usage();
  process.exit(1);
}

const safeSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
if (!safeSlug) {
  console.error("Invalid slug.");
  process.exit(1);
}

const dateOnly = dateArg || new Date().toISOString().slice(0, 10);
const datetime = `${dateOnly} 12:00:00`;
const description = descriptionArg || "Short description here.";

const galleryDir = path.join(root, "source", "galleries", safeSlug);
const mediaDir = path.join(root, "source", "medias", "galleries", safeSlug);
const targetFile = path.join(galleryDir, "index.md");

if (fs.existsSync(targetFile)) {
  console.error(`Gallery already exists: ${targetFile}`);
  process.exit(1);
}

fs.mkdirSync(galleryDir, { recursive: true });
fs.mkdirSync(mediaDir, { recursive: true });

const content = `---\n` +
`title: "${title}"\n` +
`date: ${datetime}\n` +
`layout: gallery\n` +
`description: "${description}"\n` +
`photos:\n` +
`  - /medias/galleries/${safeSlug}/photo-01.jpg\n` +
`  - /medias/galleries/${safeSlug}/photo-02.jpg\n` +
`---\n`;

fs.writeFileSync(targetFile, content, "utf8");

console.log(`Created gallery page: ${targetFile}`);
console.log(`Put images in: ${mediaDir}`);
