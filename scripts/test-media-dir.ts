// Run: node --test scripts/test-media-dir.ts
import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveMediaDir } from '../src/lib/media-dir.ts'

test('MEDIA_DIR wins', () => {
  assert.equal(resolveMediaDir('/anywhere', '/data/media'), '/data/media')
})

test('Hostinger release dir maps to <site>/media (survives deploys)', () => {
  const site = '/home/u904866276/domains/apturio.com'
  assert.equal(resolveMediaDir(`${site}/hbuilds/versions/01a0fd44-7fa1-7163-a087-df75eaea7bd3/nodejs`), `${site}/media`)
  assert.equal(resolveMediaDir(`${site}/hbuilds/current/nodejs`), `${site}/media`)
})

test('every release resolves to the same media folder', () => {
  const site = '/home/u/domains/x.com'
  assert.equal(
    resolveMediaDir(`${site}/hbuilds/versions/aaa/nodejs`),
    resolveMediaDir(`${site}/hbuilds/versions/bbb/nodejs`),
  )
})

test('anywhere else falls back to <cwd>/media', () => {
  assert.equal(resolveMediaDir('/Users/juan/project'), '/Users/juan/project/media')
  assert.equal(resolveMediaDir('/srv/app/versions/x/nodejs'), '/srv/app/versions/x/nodejs/media')
})
