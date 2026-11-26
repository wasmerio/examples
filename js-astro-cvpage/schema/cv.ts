import { z } from "zod";

export const githubInfo = z.object({
    type: z.literal("v0.github"),
    name: z.string(),
    username: z.string()
})
export const googleScholarInfo = z.object({
    type: z.literal("v0.google-scholar"),
    name: z.string(),
    id: z.string()
})
export const emailInfo = z.object({
    type: z.literal("v0.email"),
    email: z.string().email()
})
export const phoneInfo = z.object({
    type: z.literal("v0.phone"),
    number: z.string()
})
export const InfoSchema = z.union([githubInfo, googleScholarInfo, emailInfo, phoneInfo])
export const markdownSchema = z.object({
    type: z.literal("v0.markdown"),
    content: z.string()
})
export const unorderedListWithTimeSchema = z.object({
    type: z.literal("v0.unordered-list-with-time"),
    title: z.string(),
    time: z.string().optional(),
    content: z.string().optional(),
})
export const unorderedListSchema = z.object({
    type: z.literal("v0.unordered-list"),
    title: z.string(),
    content: z.string().optional(),
})
export const contentSchema = z.union([markdownSchema, unorderedListWithTimeSchema, unorderedListSchema])
export const contentsSchema = z.array(z.object({
    title: z.string(),
    content: z.array(contentSchema)
}));
export const cvSchema = z.object({
    lang: z.string().optional(),
    name: z.string(),
    info: z.array(InfoSchema),
    content: contentsSchema,
})