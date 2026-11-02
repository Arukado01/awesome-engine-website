import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://awesome-engine-web-arukado.web.app',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
});
