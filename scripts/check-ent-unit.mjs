import fs from 'fs';
import crypto from 'crypto';
const content = fs.readFileSync('src/lib/content.ts', 'utf8');

// Find entertainment unit service
const serviceMatch = content.match(/slug:\s*"entertainment-unit"[\s\S]*?published:\s*true/);
if (serviceMatch) {
  const serviceBlock = serviceMatch[0];
  const heroMatch = serviceBlock.match(/heroImage:\s*pic\("([^"]+)"/);
  const galleryStart = serviceBlock.indexOf("gallery: [");
  const galleryEnd = serviceBlock.indexOf("],\n    featured", galleryStart);
  const galleryBlock = serviceBlock.substring(galleryStart, galleryEnd + 1);

  console.log('=== Entertainment Unit Service ===');
  if (heroMatch) {
    console.log('HERO:', heroMatch[1]);
    const fp = 'public/assets/stock/' + heroMatch[1];
    console.log('  Exists:', fs.existsSync(fp));
  }

  const galleryItems = [...galleryBlock.matchAll(/pic\("([^"]+)"/g)];
  console.log('\nGALLERY:');
  galleryItems.forEach((item, i) => {
    const fp = 'public/assets/stock/' + item[1];
    console.log(`  ${i+1}. ${item[1]} -> ${fs.existsSync(fp) ? 'OK' : 'MISSING'}`);
  });
}

// Check all services for duplicate gallery images
console.log('\n=== Checking ALL services for duplicate gallery images ===');
const serviceRegex = /slug:\s*"([^"]+)"[\s\S]*?published:\s*true/g;
let serviceMatch2;
while ((serviceMatch2 = serviceRegex.exec(content)) !== null) {
  const slug = serviceMatch2[1];
  const serviceBlock = serviceMatch2[0];
  const srcSet = new Set();
  const duplicates = [];
  for (const match of serviceBlock.matchAll(/pic\("([^"]+)"/g)) {
    if (srcSet.has(match[1])) duplicates.push(match[1]);
    srcSet.add(match[1]);
  }
  if (duplicates.length > 0) {
    console.log(`\nService "${slug}" has DUPLICATE images:`);
    duplicates.forEach(d => console.log(`  - ${d}`));
  }
}

// Check all folders for duplicate files by content (same MD5)
console.log('\n=== Checking for duplicate image files across all stock folders ===');
const stockDir = 'public/assets/stock';
const dirs = fs.readdirSync(stockDir, { withFileTypes: true }).filter(d => d.isDirectory());
const hashToFiles = new Map();
for (const dir of dirs) {
  const dirPath = stockDir + '/' + dir.name;
  const files = fs.readdirSync(dirPath).filter(f => /\.(jpeg|jpg|png|webp)$/i.test(f));
  for (const file of files) {
    const filePath = dirPath + '/' + file;
    const hash = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
    if (!hashToFiles.has(hash)) hashToFiles.set(hash, []);
    hashToFiles.get(hash).push(filePath);
  }
}
let dupFound = false;
for (const [hash, files] of hashToFiles.entries()) {
  if (files.length > 1) {
    dupFound = true;
    console.log(`\nDUPLICATE files (same content):`);
    files.forEach(f => console.log(`  - ${f}`));
  }
}
if (!dupFound) console.log('  No duplicate files found by content.');
