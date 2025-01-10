import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig, passthroughImageService } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://wyczawski.dev",
	integrations: [
		tailwind(),
		sitemap({
			customPages: [
				"https://autocut.wyczawski.dev/",
				"https://arx.wyczawski.dev/",
			],
			i18n: {
				defaultLocale: "en",
				locales: {
					pl: "pl-PL",
				},
			},
		}),
	],
	image: {
		service: passthroughImageService(),
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "load",
	},
});
