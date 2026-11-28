import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Documentation code uses the same palette as the engine snippet on the home page.
const engineCodeTheme = {
  name: 'awesome-engine',
  type: 'dark',
  colors: { 'editor.background': '#11141d', 'editor.foreground': '#d5d9e5' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#838b9e' } },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'storage.modifier',
        'constant.language',
        'keyword.control.directive',
        'meta.preprocessor',
        'entity.name.tag',
        'support.type.property-name',
      ],
      settings: { foreground: '#c2b2ff' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'entity.other.attribute-name'],
      settings: { foreground: '#b7efce' },
    },
    {
      scope: ['string', 'constant.character', 'constant.other.symbol'],
      settings: { foreground: '#e8bd7c' },
    },
    { scope: ['constant.numeric'], settings: { foreground: '#ff9c9c' } },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.name.namespace',
        'entity.name.scope-resolution',
        'support.type',
        'support.class',
      ],
      settings: { foreground: '#f2f2f5' },
    },
    {
      scope: ['punctuation', 'keyword.operator', 'meta.brace'],
      settings: { foreground: '#a4a8b7' },
    },
  ],
};

export default defineConfig({
  site: 'https://awesome-engine-web-arukado.web.app',
  output: 'static',
  outDir: process.env.AE_E2E_BUILD === 'true' ? './.e2e-dist' : './dist',
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !/\/404(?:\.html|\/)$/.test(page),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en', pt: 'pt-BR', fr: 'fr', de: 'de', ja: 'ja', zh: 'zh-Hans' },
      },
    }),
  ],
  markdown: { shikiConfig: { theme: engineCodeTheme } },
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
});
