import { z } from "astro:schema";
import { defineAction } from "astro:actions";
import { getCollection } from "astro:content";

export const categories = {
    getCategories: defineAction({
        input: z.null(),
        handler: async () => {
            const allArticles = await getCollection("articles");

            const categories = [
                ...new Set(allArticles.map((article) => article.data.category)),
            ];

            return {success: true, categories}
        }
    }),
    filterByCategory: defineAction({
        input: z.object({
            category: z.string()
        }),
        handler: async ({ category }) => {

            const articles = []

            const allArticles = await getCollection("articles");
            
            if (category === "all") {
                articles.push(...allArticles);
                return { success: true, articles };
            }

            const filteredArticles = allArticles.filter((article) => article.data.category.toLowerCase() === category.toLowerCase());

            articles.push(...filteredArticles);

            return { success: true, articles};
        }
    })
};