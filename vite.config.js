import { defineConfig } from 'vite'
import svelte from '@svitejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        //todo configure manifest and assets for it
        // content of manifest
      },
      workbox: {
        // workbox options for generateSW
      },
    }),
    svelte({ preprocess: sveltePreprocess() }),
  ],
  server: { port: 9001 },
  define: {
    // 'process.env': {},
    // global: {},
  },
})
