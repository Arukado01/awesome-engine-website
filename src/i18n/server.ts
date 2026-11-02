import type { Locale } from './locales';
const catalogs = import.meta.glob<{ default: Record<string, string> }>('./catalogs/*.json', {
  eager: true,
});
export function translate(locale: Locale, source: string) {
  return locale === 'es'
    ? source
    : catalogs['./catalogs/' + locale + '.json']?.default[source] || source;
}
