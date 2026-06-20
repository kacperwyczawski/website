import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, passthroughImageService, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://wyczawski.dev",
	fonts: [
		{
			name: "Inter",
			cssVariable: "--font-inter",
			provider: fontProviders.google(),
			weights: ["100 900"],
			fallbacks: ["sans-serif"]
		},
		{
			name: "Sora",
			cssVariable: "--font-sora",
			provider: fontProviders.google(),
			weights: ["100 800"],
			fallbacks: ["sans-serif"]
		},
		{
			name: "Fira Code",
			cssVariable: "--font-fira-code",
			provider: fontProviders.google(),
			weights: ["300 700"],
			fallbacks: ["monospace"]
		}
	],
	vite: {
		plugins: [tailwindcss()],
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
					en: "en-US",
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
	devToolbar: {
		enabled: false,
	},
});
