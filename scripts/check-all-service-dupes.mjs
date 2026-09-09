import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const content = fs.readFileSync('src/lib/content.ts', 'utf8');

// Match all pic("...", "...")
const regex = /pic\("([^"]+)",\s*"([^"]+)"\)/g;
let match;
const allPics = [];
while ((match = regex.exec(content)) !== null) {
  allPics.push({ relPath: match[1], alt: match[2] });
}

console.log(`Total pic() calls: ${allPics.length}`);

// Check for exact relPath duplicates within the same service
// Let's parse services
const serviceBlocks = content.split(/\{\s*slug:\s*"/).slice(1);
for (const b of serviceBlocks) {
  const slug = b.split('"')[0];
  const servicePics = [];
  let m;
  const reg = /pic\("([^"]+)"/g;
  while ((m = reg.exec(b)) !== null) {
    servicePics.push(m[1]);
  }
  const seen = new Set();
  const dupes = [];
  for (const p of servicePics) {
    if (seen.has(p)) dupes.push(p);
    seen.add(p);
  }
  if (dupes.length > 0) {
    console.log(`Service [${slug}] has duplicate path:`, dupes);
  }

  // Check file hashes
  const fileHashes = {};
  for (const p of servicePics) {
    const fullPath = path.join('public', 'assets', 'stock', p);
    if (fs.existsSync(fullPath)) {
      const buf = fs.readFileSync(fullPath);
      const hash = crypto.createHash('sha256').update(buf).digest('hex');
      if (!fileHashes[hash]) fileHashes[hash] = [];
      fileHashes[hash].push(p);
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  }

  for (const [hash, list] of Object.entries(fileHashes)) {
    if (list.length > 1) {
      console.log(`Service [${slug}] has identical file content:`, list);
    }
  }
}
