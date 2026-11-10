// Run: node --test scripts/test-cloudinary-paths.ts
import test from 'node:test'
import assert from 'node:assert/strict'

import { deliveryUrl, publicIdFor, resourceTypeFor, safeFilename } from '../src/lib/cloudinary-paths.ts'

test('resourceTypeFor: by extension', () => {
  assert.equal(resourceTypeFor('a.PNG'), 'image')
  assert.equal(resourceTypeFor('a.mp4'), 'video')
  assert.equal(resourceTypeFor('a.pdf'), 'raw')
  assert.equal(resourceTypeFor('noext'), 'raw')
})

test('publicIdFor: images drop the extension, raw files keep it', () => {
  assert.equal(publicIdFor('a b.png'), 'apturio/media/a b')
  assert.equal(publicIdFor('guide.pdf'), 'apturio/media/guide.pdf')
  assert.equal(publicIdFor('x.tar.gz'), 'apturio/media/x.tar.gz')
  assert.equal(publicIdFor('a.v2.jpg'), 'apturio/media/a.v2')
})

test('deliveryUrl: encodes each segment and keeps the original extension', () => {
  assert.equal(deliveryUrl('demo', 'a b.png'), 'https://res.cloudinary.com/demo/image/upload/apturio/media/a%20b.png')
  assert.equal(deliveryUrl('demo', 'guide.pdf'), 'https://res.cloudinary.com/demo/raw/upload/apturio/media/guide.pdf')
})

test('jfif: stored as image, delivered as .jpg', () => {
  assert.equal(resourceTypeFor('a.jfif'), 'image')
  assert.equal(deliveryUrl('demo', 'a b.jfif'), 'https://res.cloudinary.com/demo/image/upload/apturio/media/a%20b.jpg')
})

test('safeFilename: removes characters Cloudinary rejects', () => {
  assert.equal(safeFilename('50% off?.png'), '50- off-.png')
  assert.equal(safeFilename('a b.png'), 'a b.png')
})
