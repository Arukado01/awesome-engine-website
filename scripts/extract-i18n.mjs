import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { collectMessages } from '../src/i18n/html.mjs';
import { globSync } from 'node:fs';
const phrases = new Set();
for (const file of globSync('dist/**/*.html')) {
  if (/dist[\\/](en|pt|fr|de|ja|zh)[\\/]/.test(file)) continue;
  for (const phrase of collectMessages(readFileSync(file, 'utf8'))) phrases.add(phrase);
}
const ui = JSON.parse(readFileSync('src/i18n/ui-messages.json', 'utf8'));
for (const phrase of Object.values(ui)) phrases.add(phrase);
for (const phrase of [
  'Idioma',
  'Elegir idioma',
  'Buscar idioma',
  'Buscar idioma…',
  'No se encontraron idiomas.',
  'Español',
  'Inglés',
  'Portugués',
  'Francés',
  'Alemán',
  'Japonés',
  'Chino simplificado',
  'El idioma se indica en la dirección de cada página. No se guarda como un identificador personal.',
])
  phrases.add(phrase);
mkdirSync('src/i18n/catalogs', { recursive: true });
const catalog = Object.fromEntries([...phrases].sort().map((phrase) => [phrase, phrase]));
writeFileSync('src/i18n/catalogs/es.json', JSON.stringify(catalog, null, 2) + '\n');
console.log('Catalog:', Object.keys(catalog).length, 'phrases');
