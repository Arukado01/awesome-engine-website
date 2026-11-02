import { Buffer } from 'node:buffer';
import sharp from 'sharp';
await sharp('public/media/showcase/runner/screenshots/runner-gameplay.png')
  .webp({ quality: 90 })
  .toFile('public/images/runner-hero.webp');
await sharp('public/images/awesome-engine-mark.svg')
  .resize(512, 512)
  .png()
  .toFile('public/images/awesome-engine-logo.png');
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#101218"/><path d="M20 3 37 33H27L20 20 13 33H3L20 3Z" fill="#f2f2f5"/><path d="m20 28 5 9H15l5-9Z" fill="#c2b2ff"/></svg>`;
await sharp(Buffer.from(favicon)).png().toFile('public/favicon.png');
const logo = await sharp('public/images/awesome-engine-logo.png').resize(90, 90).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#101218"/><text x="185" y="110" fill="#c2b2ff" font-family="Arial" font-size="23" letter-spacing="3">AWESOME ENGINE</text><text x="65" y="275" fill="#f2f2f5" font-family="Arial" font-weight="bold" font-size="76">Ideas en código.</text><text x="65" y="370" fill="#c2b2ff" font-family="Arial" font-weight="bold" font-size="76">Mundos en movimiento.</text><path d="M65 455H1135" stroke="#303440"/><text x="65" y="530" fill="#a4a8b7" font-family="Arial" font-size="23">C++20 · SFML · Motor 2D de código abierto</text></svg>`;
await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: 65, top: 50 }])
  .png()
  .toFile('public/images/og-cover.png');
console.log('Approved A mark, transparent 512px PNG, favicon and Open Graph generated.');
