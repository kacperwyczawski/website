import { defineCollection, z } from "astro:content";

const aboutCollection = defineCollection({
	type: "data",
	schema: z.object({
		pl: z.string(),
		en: z.string(),
		plCv: z.string(),
	}),
});
const projectsCollection = defineCollection({
	type: "data",
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			status: z.string().optional(),
			technologies: z.array(z.string()),
			description: z.string(),
			descriptionPl: z.string(),
			sourceUrl: z.string().url().optional(),
			liveUrl: z.string().url().optional(),
			image: image().optional(),
		}),
});
const cvCollection = defineCollection({
	type: "data",
	schema: z.object({
		contact: z.array(
			z.object({
				url: z.string().url(),
				display: z.string(),
			}),
		),
		skills: z.array(
			z.object({
				icon: z.string(),
				name: z.string(),
				namePolish: z.string().optional(),
				items: z.array(
					z.object({
						name: z.string(),
						preferred: z.boolean(),
					}),
				),
			}),
		),
		workExperience: z.array(
			z.object({
				dateStart: z.date(),
				dateEnd: z.date().optional(),
				location: z.string(),
				locationPolish: z.string(),
				type: z.enum(["internship", "paid-internship"]),
				title: z.string(),
				titlePolish: z.string().optional(),
				companyName: z.string(),
				companyUrl: z.string().url(),
			}),
		),
		education: z.array(
			z.object({
				dateStart: z.date(),
				dateEnd: z.date().optional(),
				location: z.string(),
				locationPolish: z.string(),
				title: z.string(),
				titlePolish: z.string(),
				schoolName: z.string(),
				schoolUrl: z.string().url(),
				accomplishments: z.array(
					z.object({
						name: z.string(),
						namePolish: z.string(),
						value: z.string(),
					}),
				),
			}),
		),
	}),
});

export const collections = {
	about: aboutCollection,
	projects: projectsCollection,
	cv: cvCollection,
};
