#!/usr/bin/env node
/**
 * Builds the favicon set from the brand wordmark (public/brand/apturio-logo.png):
 * the lowercase "a" in white on the brand-color rounded square.
 *
 *   node scripts/generate-favicons.mjs
 *
 * Output (public/): favicon.ico (16/32/48), icon-192.png, icon-512.png, apple-touch-icon.png
  */
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const LOGO = 'public/brand/apturio-logo.png'
const BRAND = '#787DFF'
// Bounding box of the "a" glyph inside the 1670x484 wordmark.
const GLYPH = { left: 0, top: 112, width: 272, height: 270 }

const glyph = await sharp(LOGO)
  .extract(GLYPH)
  // Recolor to white, keep the alpha channel.
  .ensureAlpha()
  .linear([0, 0, 0, 1], [255, 255, 255, 0])
  .png()
  .toBuffer()

async function render(size, rounded = true) {
  const radius = rounded ? Math.round(size * 0.22) : 0
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`,
  )
  const inner = Math.round(size * 0.58)
  const a = await sharp(glyph).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: BRAND } })
    .composite([{ input: a, gravity: 'centre' }, { input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

const sizes = { 'public/icon-192.png': 192, 'public/icon-512.png': 512, 'public/apple-touch-icon.png': 180 }
for (const [file, size] of Object.entries(sizes)) {
  // iOS rounds the corners itself and paints transparency black, so the touch icon is square.
  writeFileSync(file, await render(size, !file.includes('apple')))
}

// PNG-in-ICO container (supported by every current browser).
const entries = []
for (const s of [16, 32, 48]) entries.push({ s, data: await render(s) })
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(entries.length, 4)
let offset = 6 + entries.length * 16
const dir = entries.map(({ s, data }) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(s, 0)
  e.writeUInt8(s, 1)
  e.writeUInt16LE(1, 4)
  e.writeUInt16LE(32, 6)
  e.writeUInt32LE(data.length, 8)
  e.writeUInt32LE(offset, 12)
  offset += data.length
  return e
})
writeFileSync('public/favicon.ico', Buffer.concat([header, ...dir, ...entries.map((e) => e.data)]))
console.log('favicons written to public/')
