import { z, defineCollection } from "astro:content";

const indexCollection = defineCollection({
  type: "data",
  schema: z.object({
    pl: z.string(),
    en: z.string(),
  }),
});
const linksCollection = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      icon: z.string(),
      name: z.string(),
      url: z.string().url(),
    }),
  ),
});
const projectsCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      status: z.string().optional(),
      technologies: z.array(z.string()),
      description: z.string(),
      sourceUrl: z.string().url().optional(),
      liveUrl: z.string().url().optional(),
      image: image().optional(),
    }),
});
const resumeCollection = defineCollection({
  type: "data",
  schema: z.object({
    skills: z.array(
      z.object({
        icon: z.string(),
        title: z.string(),
        titlePl: z.string().optional(),
        preferred: z.array(z.string()),
        other: z.array(z.string()),
      }),
    ),
    workExperience: z.array(
      z.object({
        date: z.string(),
        datePl: z.string().optional(),
        location: z.string(),
        locationPl: z.string(),
        type: z.string(),
        typePl: z.string(),
        title: z.string(),
        titlePl: z.string().optional(),
        companyName: z.string(),
        companyUrl: z.string().url(),
      }),
    ),
    education: z.array(
      z.object({
        date: z.string(),
        datePl: z.string().optional(),
        location: z.string(),
        locationPl: z.string(),
        title: z.string(),
        titlePl: z.string(),
        schoolName: z.string(),
        schoolUrl: z.string().url(),
      }),
    ),
  }),
});

export const collections = {
  index: indexCollection,
  links: linksCollection,
  projects: projectsCollection,
  resume: resumeCollection,
};
