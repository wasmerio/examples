import { z } from 'zod';

export const socialSchema = z.object({
    plattform: z.string(),
    url: z.url(),
    username: z.string().optional(),
})

export const profileSchema = z.object ({
    name: z.string(),
    title: z.string(), // Job title
    email: z.email(),
    phone: z.string().optional(),
    location: z.string().optional(), // City, Country
    website: z.url().optional(), // Personal website
    avatar: z.string().default("/avatar.svg"), // Path or URL to the avatar image
    bio: z.string().optional(), // About me
    socials: z.array(socialSchema).default([]),
})

export const experienceSchema = z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    startDate: z.string(), // exp. '2020-01-01 or 'Jan 2022'
    endDate: z.string().nullish(), // Present if not provided / null
    current: z.boolean().default(false),
    description: z.string().optional(), // Job description
    highlights: z.array(z.string()).default([]), // exp. ['Built a custom CMS', 'Implemented responsive design']
    technologies: z.array(z.string()).default([]), // exp. ['React', 'Node.js', 'MongoDB']
})

export const educationItemSchema = z.object({
    institution: z.string(),
    degree: z.string(), // exp. 'Bachelor of Science'
    fieldOfStudy: z.string().optional(),
    startDate: z.string(), // exp. '2015-09-01'
    endDate: z.string().nullish(), // Present if not provided / null
    location: z.string().optional(),
    highlights: z.array(z.string()).default([]), // exp. ['GPA: 3.5/4.0']
})

export const skillCategorySchema = z.object({
    category: z.string(), // exp. 'Language', 'Framework'
    skills: z.array(z.string()), // exp. ['JavaScript', 'React', 'Node.js']
})

export const projectItemSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    url: z.url().optional(),
    technologies: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
})

export const certificationsSchema = z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.string(),
    url: z.url().optional(),
})

export const languageItemSchema = z.object({
    language: z.string(),
    fluency: z.string(),
})

export const cvSchema = z.object({
    profile: profileSchema,
    experience: z.array(experienceSchema).default([]),
    education: z.array(educationItemSchema).default([]),
    skills: z.array(skillCategorySchema).default([]),
    projects: z.array(projectItemSchema).default([]),
    certifications: z.array(certificationsSchema).default([]),
    languages: z.array(languageItemSchema).default([]),
});

export type CVData = z.infer<typeof cvSchema>;