import fs from 'fs';
const content = fs.readFileSync('src/lib/content.ts', 'utf8');
// Match actual interpolated paths like /assets/stock/xxx or ${IMG}/xxx
const regex = /\$\{IMG\}\/(drive-[^`"'\s,}\]]+|[a-z]+-[a-z0-9-]+\.(jpeg|jpg|png|webp))/g;
const paths = new Set();
let m;
while ((m = regex.exec(content)) !== null) paths.add(m[1]);

const missing = [];
const found = [];
for (const p of paths) {
  const fp = 'public/assets/stock/' + p;
  if (!fs.existsSync(fp)) missing.push(p);
  else found.push(p);
}
console.log('Total unique paths:', paths.size);
console.log('Found:', found.length);
console.log('Missing:', missing.length);
missing.forEach(p => console.log('  MISSING:', p));
