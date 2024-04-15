import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {port: 3000},
  test:{exclude:["tests/Playwright/*"]},

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
});
