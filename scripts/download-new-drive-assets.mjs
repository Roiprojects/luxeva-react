import fs from 'fs';
import path from 'path';
import https from 'https';

const driveResults = JSON.parse(fs.readFileSync('scratch/drive_results.json', 'utf8'));

const folderMapping = {
  "design and planning": "drive-design-planning",
  "dining": "drive-dining",
  "electrical works": "drive-electrical",
  "home automation": "drive-automation",
  "office setup": "drive-office",
  "study home office set-up": "drive-study",
  "UPVC windows and partitions": "drive-upvc"
};

function downloadFile(id, destPath) {
  return new Promise((resolve, reject) => {
    const url = `https://lh3.googleusercontent.com/d/${id}`;
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${id}: HTTP ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const [categoryName, dirName] of Object.entries(folderMapping)) {
    const category = driveResults[categoryName];
    if (!category) continue;
    const targetDir = path.join('public', 'assets', 'stock', dirName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log(`Downloading ${category.items.length} images for ${categoryName} -> ${targetDir}...`);
    let idx = 1;
    for (const item of category.items) {
      if (!item.id) {
        console.warn(`No ID for ${item.name}`);
        continue;
      }
      // Clean filename or sequential name
      const ext = path.extname(item.name) || '.jpeg';
      // Normalize extension
      const safeExt = ext.toLowerCase().includes('png') ? '.png' : (ext.toLowerCase().includes('jpg') || ext.toLowerCase().includes('jpeg') ? '.jpeg' : '.jpeg');
      const filename = `${dirName.replace('drive-', '')}-${idx}${safeExt}`;
      const destPath = path.join(targetDir, filename);

      try {
        await downloadFile(item.id, destPath);
        const stats = fs.statSync(destPath);
        console.log(`  ✓ Saved ${filename} (${stats.size} bytes)`);
      } catch (err) {
        console.error(`  ✗ Error saving ${filename}: ${err.message}`);
      }
      idx++;
    }
  }
  console.log('All downloads completed!');
}

main().catch(console.error);
