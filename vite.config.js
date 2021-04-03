import { defineConfig } from 'vite'
import svelte from '@svitejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({ preprocess: sveltePreprocess() })],
  server: { port: 9001 },
  define: {
    // 'process.env': {},
    // global: {},
  },
})
