import { defineMiddleware } from 'astro:middleware';
import { getLocale, localizedPath } from './i18n/locales';
import { localizeHtml } from './i18n/html.mjs';
const catalogs = import.meta.glob<{ default: Record<string, string> }>('./i18n/catalogs/*.json', {
  eager: true,
});
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const locale = getLocale(context.url.pathname);
  if (locale === 'es' || !response.headers.get('content-type')?.includes('text/html'))
    return response;
  const catalog = catalogs['./i18n/catalogs/' + locale + '.json']?.default;
  if (!catalog) throw new Error('Missing translation catalog: ' + locale);
  const html = localizeHtml(await response.text(), locale, catalog, localizedPath);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, { status: response.status, headers });
});
