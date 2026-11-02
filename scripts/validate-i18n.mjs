import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join } from 'node:path';
import { collectMessages } from '../src/i18n/html.mjs';
const outDir = process.env.AE_E2E_BUILD === 'true' ? '.e2e-dist' : 'dist';
const locales = ['en', 'pt', 'fr', 'de', 'ja', 'zh'];
const source = JSON.parse(readFileSync('src/i18n/catalogs/es.json', 'utf8'));
const required = new Set(
  Object.values(JSON.parse(readFileSync('src/i18n/ui-messages.json', 'utf8'))),
);
const spanishFiles = [...globSync('**/*.html', { cwd: outDir })].filter(
  (file) => !/^(en|pt|fr|de|ja|zh)[\\/]/.test(file),
);
for (const file of spanishFiles)
  for (const phrase of collectMessages(readFileSync(join(outDir, file), 'utf8')))
    required.add(phrase);
const missingSource = [...required].filter((phrase) => !Object.hasOwn(source, phrase));
if (missingSource.length)
  throw new Error('New untranslated source phrases: ' + JSON.stringify(missingSource, null, 2));
for (const locale of locales) {
  const catalog = JSON.parse(readFileSync('src/i18n/catalogs/' + locale + '.json', 'utf8'));
  const missing = [...required].filter(
    (phrase) => typeof catalog[phrase] !== 'string' || !catalog[phrase].trim(),
  );
  if (missing.length)
    throw new Error(locale + ': incomplete translation: ' + JSON.stringify(missing, null, 2));
  const pages = [...globSync(locale + '/**/*.html', { cwd: outDir })];
  if (pages.length !== spanishFiles.length)
    throw new Error(locale + ': expected ' + spanishFiles.length + ' pages, got ' + pages.length);
}
console.log(
  'Translations verified: ' +
    (locales.length + 1) +
    ' languages, ' +
    spanishFiles.length +
    ' pages per language, ' +
    required.size +
    ' source phrases.',
);
