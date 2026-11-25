import { collection, fields } from "@keystatic/core";

export const categoriesKs = collection({
  label: "Categories",
  slugField: "path",
  path: "src/content/categories/*/",
  format: { data: "json" },
  schema: {
    title: fields.text({
      label: "Title",
      description: "The title of the category.",
    }),
    path: fields.text({
      label: "Path",
      description: "The path of the category.",
    }),
  },
});
