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
  devToolbar: {
    enabled: false,
  },
  redirects: {
    "/": "/en/", // frequent
    "/projects": "/en/projects", // probably not used
    "/resume": "/en/cv", // probably not used
    "/en/resume": "/en/cv", // probably not used
  }
});
