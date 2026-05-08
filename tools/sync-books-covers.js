const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BOOKS_JSON_PATH = path.join(ROOT, 'source', '_data', 'books.json');
const COVERS_DIR = path.join(ROOT, 'source', 'medias', 'books', 'covers');
const COVER_PUBLIC_BASE = '/medias/books/covers/';
const FORCE = process.argv.includes('--force');

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
};

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractDoubanId(url) {
  const match = String(url || '').match(/subject\/(\d+)/);
  return match ? match[1] : '';
}

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') return ext;
  } catch (e) {
    // ignore
  }
  return '.jpg';
}

function toLargeCover(url) {
  const raw = String(url || '');
  if (!raw) return '';
  return raw
    .replace('/view/subject/s/public/', '/view/subject/l/public/')
    .replace('/view/subject/m/public/', '/view/subject/l/public/');
}

async function fetchText(url) {
  let lastErr = null;
  for (let i = 0; i < 2; i++) {
    try {
      const res = await fetch(url, { headers: REQUEST_HEADERS, redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status} when GET ${url}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw lastErr;
}

function extractCoverFromDoubanHtml(html) {
  if (!html) return '';

  const og = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (og && og[1]) return og[1];

  const img = html.match(/<img[^>]*src=["'](https:\/\/img\d+\.doubanio\.com\/view\/subject\/[sml]\/public\/[^"']+)["']/i);
  if (img && img[1]) return img[1];

  return '';
}

async function downloadCover(url, referer, outputFilePath) {
  const res = await fetch(url, {
    headers: {
      ...REQUEST_HEADERS,
      Referer: referer
    },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} when GET ${url}`);
  const arr = await res.arrayBuffer();
  await fsp.writeFile(outputFilePath, Buffer.from(arr));
}

function hasLocalCoverFile(coverLocal) {
  if (!coverLocal || !coverLocal.startsWith(COVER_PUBLIC_BASE)) return false;
  const fileName = coverLocal.slice(COVER_PUBLIC_BASE.length);
  if (!fileName) return false;
  return fs.existsSync(path.join(COVERS_DIR, fileName));
}

async function main() {
  await fsp.mkdir(COVERS_DIR, { recursive: true });

  const text = await fsp.readFile(BOOKS_JSON_PATH, 'utf8');
  const data = JSON.parse(text.replace(/^\uFEFF/, ''));
  const books = Array.isArray(data) ? data : data.books;
  if (!Array.isArray(books)) throw new Error('books.json must be an array or { "books": [] }');

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const title = book && book.title ? book.title : `book-${i + 1}`;
    const douban = book && book.douban ? String(book.douban).trim() : '';

    if (!douban) {
      console.log(`[skip] ${title}: missing douban link`);
      skipped += 1;
      continue;
    }

    if (!FORCE && hasLocalCoverFile(book.coverLocal)) {
      console.log(`[skip] ${title}: local cover already exists`);
      skipped += 1;
      continue;
    }

    try {
      const html = await fetchText(douban);
      const rawCover = extractCoverFromDoubanHtml(html);
      if (!rawCover) throw new Error('cannot find cover url in douban page');

      const largeCover = toLargeCover(rawCover);
      const ext = extFromUrl(largeCover);
      const id = extractDoubanId(douban);
      const slug = slugify(book.slug || title) || `book-${i + 1}`;
      const fileName = `${id || slug}-${slug}${ext}`;
      const outputPath = path.join(COVERS_DIR, fileName);

      await downloadCover(largeCover, douban, outputPath);

      book.coverLocal = `${COVER_PUBLIC_BASE}${fileName}`;
      updated += 1;
      console.log(`[ok] ${title} -> ${book.coverLocal}`);
    } catch (err) {
      if (hasLocalCoverFile(book.coverLocal)) {
        skipped += 1;
        console.log(`[skip] ${title}: ${err.message}; keep existing local cover`);
      } else {
        failed += 1;
        console.log(`[fail] ${title}: ${err.message}`);
      }
    }
  }

  if (!Array.isArray(data)) data.books = books;
  await fsp.writeFile(BOOKS_JSON_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  console.log(`\nDone. updated=${updated}, skipped=${skipped}, failed=${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
