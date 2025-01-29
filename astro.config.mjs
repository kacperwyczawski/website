import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, passthroughImageService } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://wyczawski.dev",
	vite: {
		plugins: [
			tailwindcss()
		],
	},
	integrations: [
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
	i18n: {
		locales: ["pl", "en"],
		defaultLocale: "en",
	},
	image: {
		service: passthroughImageService(),
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "load",
	},
});
