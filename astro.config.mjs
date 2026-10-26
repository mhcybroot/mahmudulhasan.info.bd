import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mahmudulhasan.info.bd',
  integrations: [tailwind(), sitemap()],
  vite: {
    build: {
      target: 'es2022',
      cssCodeSplit: true,
    },
  },
});
