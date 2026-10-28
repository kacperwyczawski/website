import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://wyczawski.dev",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      customPages: ["https://autocut.wyczawski.dev/", "https://arx.wyczawski.dev/"],
    }),
  ],
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: "always",
  },
});
