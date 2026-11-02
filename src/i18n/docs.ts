import { getCollection } from 'astro:content';
import type { Locale } from './locales';
export async function getDocs(locale: Locale) {
  const docs =
    locale === 'es'
      ? await getCollection('docs')
      : await getCollection('docsLocalized', ({ id }) => id.startsWith(locale + '/'));
  return docs
    .map((doc) => ({ ...doc, slug: doc.id.split('/').at(-1)! }))
    .sort((a, b) => a.data.order - b.data.order);
}
