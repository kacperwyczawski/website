import { defineConfig, squooshImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      customPages: ["https://autocut.wyczawski.dev/"],
    }),
  ],
  image: {
    service: squooshImageService(),
  },
  site: "https://wyczawski.dev/",
});
