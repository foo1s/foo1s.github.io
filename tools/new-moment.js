#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const contentArg = process.argv[2];
const imagesArg = process.argv[3] || "";

function usage() {
  console.log("Usage:");
  console.log('  npm run moment:new -- "随手写一点想法"');
  console.log('  npm run moment:new -- "带图片的一条" "/medias/moments/photo-01.jpg,/medias/moments/photo-02.jpg"');
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function localDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

if (!contentArg) {
  usage();
  process.exit(1);
}

const dataFile = path.join(root, "source", "_data", "moments.json");
const content = String(contentArg).replace(/\\n/g, "\n").trim();
const images = imagesArg
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

if (!content) {
  console.error("Moment content cannot be empty.");
  process.exit(1);
}

let moments = [];
if (fs.existsSync(dataFile)) {
  moments = JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

moments.unshift({
  date: localDateTime(),
  content,
  images
});

fs.writeFileSync(dataFile, `${JSON.stringify(moments, null, 2)}\n`, "utf8");

console.log(`Added moment to ${dataFile}`);
console.log("Run `npx hexo g` to regenerate the site.");
