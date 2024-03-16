export const translations = {
	"nav.projects": {
		pl: "Projekty",
		en: "Projects",
	},
	"section.about": {
		pl: "O mnie",
		en: "About me",
	},
	"section.skills": {
		pl: "Umiejętności",
		en: "My skills",
	},
	"section.workExperience": {
		pl: "Doświadczenie zawodowe",
		en: "Work experience",
	},
	"section.education": {
		pl: "Edukacja",
		en: "Education",
	},
	"link.projects": {
		pl: "Zobacz moje projekty",
		en: "Check out my projects",
	},
	"link.github-projects": {
		pl: "Zobacz więcej na moim GitHubie",
		en: "Find more on my GitHub",
	},
	"link.cv-print": {
		pl: "Wersja PDF lub do wydruku",
		en: "PDF or printing version",
	},
	"link.go-back": {
		pl: "Wróć",
		en: "Go back",
	},
	"cv-print.info": {
		pl: "Aby uzyskać PDF, skorzystaj z opcji drukowania w przeglądarce. Wybierz format A4 i drukuj jako PDF.",
		en: "In order to get PDF, please use the print option in your browser. Select A4 paper size and print as PDF. Currently available only in Polish.",
	},
	"cv.internship": {
		pl: "Praktyka",
		en: "Internship",
	},
	"cv.paid-internship": {
		pl: "Staż",
		en: "Paid internship",
	},
	"cv.present": {
		pl: "Obecnie",
		en: "Present",
	},
	"cv.conjunction": {
		pl: "w",
		en: "at",
	},
	"misc.last-updated": {
		pl: "Ostatnio zaktualizowano",
		en: "Last updated",
	},
};

export function translate(key: keyof typeof translations, lang?: string) {
	return translations[key][(lang ?? "en") as "pl" | "en"];
}

export function localizeUrl(url: string, lang?: string) {
	// return `/${lang}${url}`;
	if (lang) return `/${lang}${url}`;
	return url;
}
