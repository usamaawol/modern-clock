const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source SVG (we created public/icons/icon-512.svg earlier)
const src = path.join(__dirname, '..', 'public', 'icons', 'icon-512.svg');
const outDir = path.join(__dirname, '..', 'public', 'png-icons');

const sizes = [48, 72, 96, 144, 192, 256, 384, 512, 1024];

async function generate() {
  if (!fs.existsSync(src)) {
    console.error('Source SVG not found:', src);
    process.exit(1);
  }
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const size of sizes) {
    const out = path.join(outDir, `icon-${size}.png`);
    try {
      await sharp(src)
        .resize(size, size)
        .png({ quality: 90 })
        .toFile(out);
      console.log('Written', out);
    } catch (err) {
      console.error('Failed to write', out, err);
    }
  }

  // Also generate a simple splash (centered) - 1242x2436 (example large)
  const splashOut = path.join(outDir, 'splash-1242x2436.png');
  try {
    await sharp(src)
      .resize(1242, 1242)
      .png({ quality: 90 })
      .toFile(splashOut);
    console.log('Written', splashOut);
  } catch (err) {
    console.error('Failed to write splash', err);
  }

  console.log('Icon generation complete. Look in public/png-icons/');
}

generate();
