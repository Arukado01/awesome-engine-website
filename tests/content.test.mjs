import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { updates } from '../src/data/updates.ts';
import { games, technologies } from '../src/data/engine.ts';
test('el historial conserva commits únicos, fuentes y fechas descendentes', () => {
  assert.ok(updates.length >= 16);
  assert.deepEqual(
    updates.slice(0, 6).map((u) => u.id),
    ['19264a1', 'f0e88ed', '8e733f0', '5387503', '67f81e3', '509f0bf'],
  );
  assert.equal(new Set(updates.map((u) => u.id)).size, updates.length);
  for (let i = 0; i < updates.length; i++) {
    const u = updates[i];
    assert.match(u.id, /^[0-9a-f]{7}$/);
    assert.match(
      u.source,
      /^https:\/\/github.com\/Arukado01\/AwesomeEngine\/commit\/[0-9a-f]{40}$/,
    );
    assert.equal(u.status, 'implemented');
    assert.ok(Number.isFinite(Date.parse(u.date)));
    if (i) assert.ok(Date.parse(updates[i - 1].date) >= Date.parse(u.date));
    assert.ok([u.added, u.fixed, u.performance, u.architecture].some((a) => a.length > 0));
  }
});
test('la información del motor mantiene alcance y estados verificables', () => {
  assert.equal(games.length, 7);
  assert.equal(new Set(games.map((g) => g.id)).size, 7);
  assert.ok(technologies.some((t) => t.name === 'SFML' && t.version === '3.1.0'));
});
test('las nueve guías tienen orden único, enlaces de fuente y destinos internos existentes', () => {
  const names = readdirSync('src/content/docs').filter((x) => x.endsWith('.md'));
  assert.equal(names.length, 9);
  const orders = [];
  for (const name of names) {
    const text = readFileSync(`src/content/docs/${name}`, 'utf8');
    assert.match(text, /^---\r?\n/);
    for (const field of ['title', 'description', 'category', 'order'])
      assert.match(text, new RegExp(`^${field}:`, 'm'));
    orders.push(text.match(/^order:\s*(\d+)/m)?.[1]);
    assert.match(
      text,
      /github.com\/Arukado01\/AwesomeEngine\/blob\/f0e88edffae35efb3cc208e8eea651d1b559cbaa/,
    );
    for (const match of text.matchAll(/\]\(\/docs\/([\w-]+)\//g))
      assert.ok(names.includes(`${match[1]}.md`), `${name}: ${match[1]}`);
  }
  assert.equal(new Set(orders).size, names.length);
});
test('el formulario inactivo nunca ofrece un éxito ficticio', () => {
  const result = JSON.parse(
    readFileSync('public/api/contact-unavailable.json', 'utf8').replace(/^\uFEFF/, ''),
  );
  assert.equal(result.ok, false);
  assert.ok(result.message);
  const source = readFileSync('src/scripts/contact.ts', 'utf8');
  assert.match(source, /result\.ok\s*!==\s*true/);
  assert.match(source, /response\.ok/);
});
test('manifest multimedia: solo archivos reales, rutas seguras y duraciones solicitadas', () => {
  if (!existsSync('src/data/showcase-media.json')) return;
  const entries = JSON.parse(
    readFileSync('src/data/showcase-media.json', 'utf8').replace(/^\uFEFF/, ''),
  );
  for (const g of entries) {
    assert.ok(['runner', 'plagetale'].includes(g.id));
    assert.ok(g.screenshots.length >= 1);
    for (const s of g.screenshots) {
      assert.match(s.src, /^\/media\/showcase\/(runner|plagetale)\/screenshots\/[\w-]+\.png$/);
      assert.ok(existsSync(`public${s.src}`));
      assert.ok(s.alt && s.title);
    }
    for (const [i, v] of g.videos.entries()) {
      assert.ok(existsSync(`public${v.src}`));
      assert.ok(existsSync(`public${v.poster}`));
      assert.ok(v.duration >= (i === 0 ? 30 : 20) && v.duration <= (i === 0 ? 60 : 40));
    }
  }
});
