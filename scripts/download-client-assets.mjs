import https from 'https';
import fs from 'fs';
import path from 'path';

const folders = [
  {
    key: "plumbing",
    id: "1gPa52d5b62Fc5Kgx9BPsTHjEJzhHoq6j",
    dir: "public/assets/stock/drive-plumbing",
    prefix: "plumbing",
    heroOriginalNameMatch: "Plumbing services"
  },
  {
    key: "invisible-grills",
    id: "1yGIIZqkscIdX0UR5bYRi1LRwzpiB_WHs",
    dir: "public/assets/stock/drive-invisible-grills",
    prefix: "invisible-grills"
  },
  {
    key: "fabrication",
    id: "1acMgDEmBpmtlrGnxil6wSq5VFobqCTuz",
    dir: "public/assets/stock/drive-fabrication",
    prefix: "fabrication"
  },
  {
    key: "digital-locks",
    id: "1XgtN57_6Wq3ZduMl0jDlDLnPlWOFsJ43",
    dir: "public/assets/stock/drive-digital-locks",
    prefix: "digital-locks"
  },
  {
    key: "sofa",
    id: "1glchCh-E8J3r5W88gS5xFeBEQqnqMKAM",
    dir: "public/assets/stock/drive-sofa",
    prefix: "sofa"
  },
  {
    key: "wallpaper",
    id: "1-5qxCSh1OxdyqSYKH4hUYtiXY0SNkQlp",
    dir: "public/assets/stock/drive-wallpaper",
    prefix: "wallpaper"
  },
  {
    key: "commercial-showroom",
    id: "183OqLD-_qzdh-Qkv2nIF6B666SlqZO9o",
    dir: "public/assets/stock/drive-commercial-showroom",
    prefix: "commercial-showroom",
    heroOriginalNameMatch: "Commercial & Showroom Interior"
  },
  {
    key: "home-automation",
    id: "1XhVEc21lkmAW7w5BquPmGJzde7ntkFD7",
    dir: "public/assets/stock/drive-automation",
    prefix: "automation"
  }
];

function fetchFolderHtml(folderId) {
  return new Promise((resolve, reject) => {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    };

    function doRequest(reqUrl) {
      https.get(reqUrl, options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doRequest(res.headers.location);
        }
        let html = '';
        res.on('data', chunk => html += chunk);
        res.on('end', () => resolve(html));
      }).on('error', reject);
    }

    doRequest(url);
  });
}

function parseImagesFromHtml(html) {
  const regex = /aria-label="([^"]+?)"[\s\S]{1,300}?([a-zA-Z0-9_-]{33})/g;
  let m;
  const items = new Map();
  while ((m = regex.exec(html)) !== null) {
    const label = m[1];
    const id = m[2];
    if (label.includes('Image') || /\.(jpe?g|png|webp)/i.test(label)) {
      const cleanName = label.replace(/\s+(Image|Shared|Google|File|Folder|Photo).*/i, '').trim();
      if (!items.has(id)) {
        items.set(id, cleanName);
      }
    }
  }
  return items;
}

function downloadFile(id, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const url = `https://lh3.googleusercontent.com/d/${id}`;
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          if (redirectRes.statusCode !== 200) {
            return reject(new Error(`HTTP ${redirectRes.statusCode}`));
          }
          const fileStream = fs.createWriteStream(destPath);
          redirectRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) {
        if (retries > 0) {
          console.warn(`    Retry downloading ${id} (status: ${res.statusCode})...`);
          setTimeout(() => {
            downloadFile(id, destPath, retries - 1).then(resolve).catch(reject);
          }, 1000);
          return;
        }
        return reject(new Error(`Failed to download ${id}: HTTP ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => {
          downloadFile(id, destPath, retries - 1).then(resolve).catch(reject);
        }, 1000);
      } else {
        reject(err);
      }
    });
  });
}

async function main() {
  console.log('=== Starting Download of Client Drive Assets ===\n');

  const summary = {};

  for (const f of folders) {
    console.log(`Processing ${f.key} (Folder ID: ${f.id})...`);
    if (!fs.existsSync(f.dir)) {
      fs.mkdirSync(f.dir, { recursive: true });
    }

    const html = await fetchFolderHtml(f.id);
    const images = parseImagesFromHtml(html);
    console.log(`  Found ${images.size} images in Drive folder.`);

    // Convert map to array
    const imageList = [];
    for (const [id, name] of images.entries()) {
      imageList.push({ id, name });
    }

    // Sort: if heroOriginalNameMatch is present, put that first
    if (f.heroOriginalNameMatch) {
      imageList.sort((a, b) => {
        const aHero = a.name.toLowerCase().includes(f.heroOriginalNameMatch.toLowerCase());
        const bHero = b.name.toLowerCase().includes(f.heroOriginalNameMatch.toLowerCase());
        if (aHero && !bHero) return -1;
        if (!aHero && bHero) return 1;
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      });
    } else {
      // Natural alphanumeric sort by original name
      imageList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    }

    const downloaded = [];
    let idx = 1;
    for (const item of imageList) {
      const origExt = path.extname(item.name).toLowerCase();
      const ext = origExt === '.png' ? '.png' : (origExt === '.webp' ? '.webp' : '.jpeg');
      const filename = `${f.prefix}-${idx}${ext}`;
      const destPath = path.join(f.dir, filename);

      try {
        await downloadFile(item.id, destPath);
        const stats = fs.statSync(destPath);
        console.log(`  ✓ Saved ${filename} (${stats.size} bytes) [from ${item.name}]`);
        downloaded.push({ filename, size: stats.size, originalName: item.name });
      } catch (err) {
        console.error(`  ✗ Error saving ${filename}: ${err.message}`);
      }
      idx++;
    }

    summary[f.key] = downloaded;
    console.log(`Finished ${f.key}: ${downloaded.length} images saved to ${f.dir}.\n`);
  }

  fs.writeFileSync('scripts/downloaded-assets-summary.json', JSON.stringify(summary, null, 2));
  console.log('=== All Downloads Complete! Summary saved to scripts/downloaded-assets-summary.json ===');
}

main().catch(console.error);
