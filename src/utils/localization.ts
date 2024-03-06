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
  "link.projects" : {
    pl: "Zobacz moje projekty",
    en: "Check out my projects",
  },
  "link.github-projects" : {
    pl: "Zobacz więcej na moim GitHubie",
    en: "Find more on my GitHub",
  },
};

export function translate(
  key: keyof typeof translations,
  lang: string,
) {
  return translations[key][lang as "pl" | "en"];
}

export function localizeUrl(url: string, lang: string) {
  return `/${lang}${url}`;
}
