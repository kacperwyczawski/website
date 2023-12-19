import { defineConfig, squooshImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    tailwind()
  ],
  image: {
    service: squooshImageService()
  },
  site: "https://wyczawski.dev/"
});
