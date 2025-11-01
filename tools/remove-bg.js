/*
Simple background removal script using Jimp.
This is a best-effort approach: it picks the most common color near the image corners
and makes pixels sufficiently close to that color transparent.

Usage (from project root):
  npm install jimp
  node tools/remove-bg.js "profile.jpeg" "assets/char1.png"
  node tools/remove-bg.js "WhatsApp Image 2025-10-07 at 2.38.56 PM (1).jpeg" "assets/char2.png"
  node tools/remove-bg.js "WhatsApp Image 2025-10-07 at 2.38.56 PM (2).jpeg" "assets/char3.png"

Notes:
- This is not a perfect background remover. It works best for photos with relatively
  uniform background colors (plain walls, studio backgrounds).
- If you need high-quality removal, consider manual editing or a dedicated tool.
*/

const Jimp = require('jimp');
const fs = require('fs');

async function mostCommonCornerColor(image) {
  // sample small patches in corners
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  const samples = [];
  const patch = 8;

  const coords = [
    {x: 4, y: 4},
    {x: w - patch - 4, y: 4},
    {x: 4, y: h - patch - 4},
    {x: w - patch - 4, y: h - patch - 4}
  ];

  for (const c of coords) {
    const pixels = [];
    for (let dx = 0; dx < patch; dx++) {
      for (let dy = 0; dy < patch; dy++) {
        const px = image.getPixelColor(c.x + dx, c.y + dy);
        const rgba = Jimp.intToRGBA(px);
        pixels.push([rgba.r, rgba.g, rgba.b]);
      }
    }
    // average
    const avg = pixels.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0,0,0]).map(v => Math.round(v / pixels.length));
    samples.push(avg);
  }

  // return median-like by averaging samples
  const avgAll = samples.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0,0,0]).map(v => Math.round(v / samples.length));
  return avgAll; // [r,g,b]
}

function colorDistanceSq(a, b) {
  return (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]) + (a[2]-b[2])*(a[2]-b[2]);
}

async function removeBackground(inputPath, outputPath, options = {}) {
  const tolerance = options.tolerance || 60; // color distance threshold
  const soften = options.soften || 12; // how much to feather alpha near threshold

  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    process.exit(1);
  }

  const image = await Jimp.read(inputPath);
  const bgColor = await mostCommonCornerColor(image);
  console.log('Detected background color (approx):', bgColor);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    const dist = colorDistanceSq([r,g,b], bgColor);
    if (dist <= tolerance * tolerance) {
      // fully transparent
      this.bitmap.data[idx + 3] = 0;
    } else if (dist <= (tolerance + soften) * (tolerance + soften)) {
      // partial transparency near the edge
      const factor = (dist - tolerance * tolerance) / ((tolerance + soften) * (tolerance + soften) - tolerance * tolerance);
      // factor in [0..1] where 0 -> fully transparent, 1 -> fully opaque
      const alpha = Math.round(255 * factor);
      this.bitmap.data[idx + 3] = Math.min(255, Math.max(0, alpha));
    } else {
      // keep alpha
    }
  });

  await image.rgba(true).writeAsync(outputPath);
  console.log('Wrote', outputPath);
}

// CLI
(async () => {
  const argv = process.argv.slice(2);
  if (argv.length < 2) {
    console.error('Usage: node tools/remove-bg.js <input> <output> [tolerance] [soften]');
    process.exit(2);
  }

  const input = argv[0];
  const output = argv[1];
  const tolerance = argv[2] ? parseInt(argv[2], 10) : undefined;
  const soften = argv[3] ? parseInt(argv[3], 10) : undefined;

  try {
    await removeBackground(input, output, { tolerance, soften });
  } catch (err) {
    console.error('Error:', err);
  }
})();
