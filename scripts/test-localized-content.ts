// Run: node --test scripts/test-localized-content.ts
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  docHasLocaleContent,
  hasLocaleContent,
  lexicalPlainText,
  localeValue,
} from '../src/lib/localized-content.ts'

const lex = (...paras: string[]) => ({
  root: {
    type: 'root',
    children: paras.map((t) => ({ type: 'paragraph', children: [{ type: 'text', text: t }] })),
  },
})

test('lexicalPlainText', () => {
  assert.equal(lexicalPlainText(lex('Hola', 'mundo')).trim(), 'Hola  mundo'.replace('  ', ' '))
  assert.equal(lexicalPlainText(null), '')
  assert.equal(lexicalPlainText(undefined), '')
  assert.equal(lexicalPlainText({ root: { children: [] } }).trim(), '')
  assert.equal(lexicalPlainText(lex('   ')).trim(), '')
})

test('posts: need title + slug + body in THIS locale', () => {
  const ok = { title: 'T', slug: 's', content: lex('texto') }
  assert.equal(hasLocaleContent('posts', ok), true)
  assert.equal(hasLocaleContent('posts', { ...ok, title: '' }), false)
  assert.equal(hasLocaleContent('posts', { ...ok, title: null }), false)
  assert.equal(hasLocaleContent('posts', { ...ok, slug: null }), false)
  assert.equal(hasLocaleContent('posts', { ...ok, slug: '  ' }), false)
  assert.equal(hasLocaleContent('posts', { ...ok, content: null }), false)
  assert.equal(hasLocaleContent('posts', { ...ok, content: lex('') }), false)
  assert.equal(hasLocaleContent('posts', { title: 'T', slug: 's', content: { root: { children: [] } } }), false)
})

test('pages: need title + slug + at least one block', () => {
  assert.equal(hasLocaleContent('pages', { title: 'T', slug: 's', layout: [{ blockType: 'hero' }] }), true)
  assert.equal(hasLocaleContent('pages', { title: 'T', slug: 's', layout: [] }), false)
  assert.equal(hasLocaleContent('pages', { title: 'T', slug: 's', layout: null }), false)
  assert.equal(hasLocaleContent('pages', { title: 'T', slug: null, layout: [{}] }), false)
})

test('categories need title + slug; authors need a bio in that locale', () => {
  assert.equal(hasLocaleContent('categories', { title: 'C', slug: 'c' }), true)
  assert.equal(hasLocaleContent('categories', { title: 'C', slug: null }), false)
  assert.equal(hasLocaleContent('authors', { bio: 'Escribe sobre ventas.' }), true)
  assert.equal(hasLocaleContent('authors', { bio: '' }), false)
  assert.equal(hasLocaleContent('authors', {}), false)
  const author = { bio: { en: 'Writes about sales.', es: null }, role: { en: 'Head', es: null } }
  assert.equal(docHasLocaleContent('authors', author, 'en'), true)
  assert.equal(docHasLocaleContent('authors', author, 'es'), false)
})

test('docHasLocaleContent: reads a locale:"all" doc per locale', () => {
  const spanishOnly = {
    title: { en: null, es: 'Hola' },
    slug: { en: null, es: 'hola' },
    content: { en: null, es: lex('cuerpo') },
  }
  assert.equal(docHasLocaleContent('posts', spanishOnly, 'es'), true)
  assert.equal(docHasLocaleContent('posts', spanishOnly, 'en'), false)

  const bilingual = {
    title: { en: 'Hi', es: 'Hola' },
    slug: { en: 'hi', es: 'hola' },
    content: { en: lex('body'), es: lex('cuerpo') },
  }
  assert.equal(docHasLocaleContent('posts', bilingual, 'en'), true)
  assert.equal(docHasLocaleContent('posts', bilingual, 'es'), true)

  // title + slug written in EN but body still empty: not published in EN yet
  const half = { ...bilingual, content: { en: lex(''), es: lex('cuerpo') } }
  assert.equal(docHasLocaleContent('posts', half, 'en'), false)
  assert.equal(docHasLocaleContent('posts', half, 'es'), true)

  // English-only page
  const enPage = { title: { en: 'A' }, slug: { en: 'a' }, layout: { en: [{}], es: [] } }
  assert.equal(docHasLocaleContent('pages', enPage, 'en'), true)
  assert.equal(docHasLocaleContent('pages', enPage, 'es'), false)
})

test('localeValue only unwraps locale-keyed objects (never a Lexical state)', () => {
  assert.deepEqual(localeValue({ en: 'a', es: 'b' }, 'es'), 'b')
  assert.equal(localeValue('plain', 'en'), undefined)
  assert.equal(localeValue(lex('x'), 'en'), undefined)
  assert.equal(localeValue(null, 'en'), undefined)
})
