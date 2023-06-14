import { z, defineCollection} from "astro:content";

const definitionsCollection = defineCollection({
    type: "data",
    schema: z.object({
        socialLinks: z.object({
            print: z.array(z.object({
                icon: z.string(),
                text: z.string()
            })),
            web: z.array(z.object({
                icon: z.string(),
                text: z.string(),
                url: z.string().url()
            })),
        }),
        aboutMe: z.string(),
        skills: z.array(z.object({
            icon: z.string(),
            title: z.string(),
            preferred: z.array(z.string()),
            other: z.array(z.string())
        })),
        workExperience: z.array(z.object({
            date: z.string(),
            location: z.string(),
            type: z.string(),
            title: z.string(),
            company: z.string(),
            companyUrl: z.string().url(),
        })),
        education: z.array(z.object({
            date: z.string(),
            location: z.string(),
            title: z.string(),
            school: z.string(),
            schoolUrl: z.string().url(),
        })),
    })
});

export const collections = {
    "definitions": definitionsCollection,
}