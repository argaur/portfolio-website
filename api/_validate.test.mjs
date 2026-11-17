// Run: node --test api/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, originAllowed } from './_validate.mjs';

test('accepts a full valid submission and trims fields', () => {
  const r = validate({ email: ' a@b.co ', name: ' Ann ', interest: 'role', note: ' hi ', source: '/#contact' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.row, { email: 'a@b.co', name: 'Ann', interest: 'role', note: 'hi', source: '/#contact' });
});

test('optional fields become null', () => {
  const r = validate({ email: 'a@b.co' });
  assert.deepEqual(r.row, { email: 'a@b.co', name: null, interest: null, note: null, source: null });
});

test('rejects bad email, unknown interest, oversize fields, non-objects', () => {
  assert.equal(validate({ email: 'nope' }).ok, false);
  assert.equal(validate({ email: 'a@b.co', interest: 'spam' }).ok, false);
  assert.equal(validate({ email: 'a@b.co', note: 'x'.repeat(1001) }).ok, false);
  assert.equal(validate({ email: 'a@b.co', name: 'x'.repeat(101) }).ok, false);
  assert.equal(validate({ email: 'a@' + 'b'.repeat(260) + '.co' }).ok, false);
  assert.equal(validate(null).ok, false);
  assert.equal(validate({ email: 42 }).ok, false);
});

test('honeypot is flagged as a bot', () => {
  const r = validate({ email: 'a@b.co', website: 'http://spam' });
  assert.equal(r.ok, true);
  assert.equal(r.bot, true);
});

test('origin allow-list', () => {
  assert.equal(originAllowed('https://gauravg.dev'), true);
  assert.equal(originAllowed('https://gauravg-portfolio.vercel.app'), true);
  assert.equal(originAllowed('https://portfolio-website-abc123-argaurs-projects.vercel.app'), true);
  assert.equal(originAllowed('http://localhost:8765'), true);
  assert.equal(originAllowed('https://evil.example'), false);
  assert.equal(originAllowed('https://gauravg.dev.evil.example'), false);
  assert.equal(originAllowed(null), false);
});
