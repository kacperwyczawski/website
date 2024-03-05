import { z, defineCollection } from "astro:content";

const indexCollection = defineCollection({
  type: "content",
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
        preferred: z.array(z.string()),
        other: z.array(z.string()),
      }),
    ),
    workExperience: z.array(
      z.object({
        date: z.string(),
        location: z.string(),
        type: z.string(),
        title: z.string(),
        companyName: z.string(),
        companyUrl: z.string().url(),
      }),
    ),
    education: z.array(
      z.object({
        date: z.string(),
        location: z.string(),
        title: z.string(),
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
