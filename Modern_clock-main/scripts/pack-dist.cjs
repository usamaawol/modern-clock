const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

async function pack() {
  const distDir = path.resolve(__dirname, '..', 'dist');
  const outPath = path.resolve(__dirname, '..', 'dist.zip');

  if (!fs.existsSync(distDir)) {
    console.error('dist/ folder not found. Run `npm run build:web` first.');
    process.exit(2);
  }

  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Created ${outPath} (${archive.pointer()} total bytes)`);
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') console.warn(err);
    else throw err;
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(distDir, false);
  await archive.finalize();
}

pack().catch((err) => {
  console.error(err);
  process.exit(1);
});
