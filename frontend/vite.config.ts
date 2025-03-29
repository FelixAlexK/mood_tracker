import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@backend": fileURLToPath(new URL("../backend", import.meta.url)),
    },
  },

  server: {

    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,

      },
    },
  },
});
