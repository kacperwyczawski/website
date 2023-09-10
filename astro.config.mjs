import { defineConfig, squooshImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";

import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), prefetch({
    selector: "a[href^='/']", // prefetch links that start with "/"
  })],
  site: "https://kacperwyczawski.github.io",
  base: "/",
  image: {
    service: squooshImageService()
  }
});