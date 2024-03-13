import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig, squooshImageService } from "astro/config";

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
});
