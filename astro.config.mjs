import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
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
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
});
