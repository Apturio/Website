// Run: node --test scripts/test-image-loader.ts
import test from 'node:test'
import assert from 'node:assert/strict'

import imageLoader, { isOptimizable, toLocalPath } from '../src/lib/image-loader.ts'

test('toLocalPath: uploads always resolve to the local path, any origin', () => {
  assert.equal(toLocalPath('https://apturio.com/api/media/file/a%20b.jpg'), '/api/media/file/a%20b.jpg')
  assert.equal(toLocalPath('http://localhost:3000/api/media/file/a.png'), '/api/media/file/a.png')
  assert.equal(toLocalPath('https://www.apturio.com/api/media/file/a.png'), '/api/media/file/a.png')
  assert.equal(toLocalPath('/api/media/file/a.png'), '/api/media/file/a.png')
  assert.equal(toLocalPath('https://apturio.com/brand/logo.png'), '/brand/logo.png')
  assert.equal(toLocalPath('https://vibe.filesafe.space/x/y.png'), 'https://vibe.filesafe.space/x/y.png')
})

test('isOptimizable: skips svg, gif, data and blob', () => {
  assert.equal(isOptimizable('/api/media/file/a.jfif'), true)
  assert.equal(isOptimizable('/api/media/file/a.svg'), false)
  assert.equal(isOptimizable('/api/media/file/a.GIF?x=1'), false)
  assert.equal(isOptimizable('data:image/png;base64,AAAA'), false)
  assert.equal(isOptimizable(''), false)
})

test('loader: built-in optimizer by default, Cloudinary fetch when configured', () => {
  delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  assert.equal(
    imageLoader({ src: 'https://apturio.com/api/media/file/a b.jpg', width: 640 }),
    '/_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fa%20b.jpg&w=640&q=75',
  )
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'demo'
  assert.equal(
    imageLoader({ src: '/api/media/file/a.jpg', width: 800 }),
    'https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_800,c_limit/https%3A%2F%2Fapturio.com%2Fapi%2Fmedia%2Ffile%2Fa.jpg',
  )
  delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
})
