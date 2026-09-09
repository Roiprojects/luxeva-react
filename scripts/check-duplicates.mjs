import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const dir = 'public/assets/stock/drive-kitchen';
const files = fs.readdirSync(dir);
const map = {};

for (const f of files) {
  const buf = fs.readFileSync(path.join(dir, f));
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  map[f] = hash.slice(0, 10);
}

console.log(map);
