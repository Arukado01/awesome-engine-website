export const locales = ['es', 'en', 'pt', 'fr', 'de', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const localeInfo: Record<
  Locale,
  { name: string; html: string; og: string; search: string }
> = {
  es: {
    name: 'Español',
    html: 'es',
    og: 'es_CO',
    search: 'español spanish espanol spanisch espagnol スペイン語 西班牙语',
  },
  en: {
    name: 'English',
    html: 'en',
    og: 'en_US',
    search: 'inglés english ingles anglais englisch inglês 英語 英语',
  },
  pt: {
    name: 'Português',
    html: 'pt-BR',
    og: 'pt_BR',
    search: 'portugués portuguese portugues brasil portugiesisch portugais ポルトガル語 葡萄牙语',
  },
  fr: {
    name: 'Français',
    html: 'fr',
    og: 'fr_FR',
    search: 'francés french francais frances französisch francês フランス語 法语',
  },
  de: {
    name: 'Deutsch',
    html: 'de',
    og: 'de_DE',
    search: 'alemán german deutsch aleman allemand alemão ドイツ語 德语',
  },
  ja: {
    name: '日本語',
    html: 'ja',
    og: 'ja_JP',
    search: 'japonés japanese nihongo japones japanisch japonais japonês 日本語 日语',
  },
  zh: {
    name: '简体中文',
    html: 'zh-Hans',
    og: 'zh_CN',
    search: 'chino chinese simplified mandarin 中文 chinesisch chinois chinês 中国語 简体中文',
  },
};
export function getLocale(pathname: string): Locale {
  const prefix = pathname.split('/')[1];
  return locales.includes(prefix as Locale) ? (prefix as Locale) : 'es';
}
export function withoutLocale(path: string) {
  const locale = getLocale(path);
  return locale === 'es' ? path : path.replace(new RegExp('^/' + locale + '(?=/|$)'), '') || '/';
}
export function localizedPath(path: string, locale: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const bare = withoutLocale(path);
  if (
    !/^\/(?:$|[?#]|(?:motor|showcase|docs|evolucion|contacto|privacidad|404)(?:\/|[?#]|$))/.test(
      bare,
    ) &&
    bare !== '/404.html'
  )
    return path;
  const route = bare === '/404.html' ? '/404/' : bare;
  return locale === 'es' ? (route === '/404/' ? '/404.html' : route) : '/' + locale + route;
}
