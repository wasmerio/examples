import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? process.env.HEAD ?? "main";

export default defineConfig({
	branch,
	build: {
		outputFolder: "admin",
		publicFolder: "public",
	},
	// Get this from tina.io
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? null,
	media: {
		tina: {
			mediaRoot: "/src/assets",
			publicFolder: "public",
		},
	},
	// See docs on content modelling for more info on how to setup new content models: https://tina.io/docs/schema/
	schema: {
		collections: [
			{
				defaultItem: () => ({
					draft: false,
					publishedDate: new Date().toISOString(),
				}),
				fields: [
					{
						label: "Slug",
						name: "slug",
						required: true,
						type: "string",
					},
					{
						isTitle: true,
						label: "Title",
						name: "title",
						required: true,
						type: "string",
						ui: {
							validate: (val: string) => {
								if (val.length > 60) {
									return "Title must be less than 60 characters";
								}
								return;
							},
						},
					},
					{
						label: "Description",
						name: "description",
						required: true,
						type: "string",
						ui: {
							validate: (val: string) => {
								if (val.length < 50 || val.length > 160) {
									return "Description must be between 50 and 160 characters";
								}
								return;
							},
						},
					},
					{
						label: "Published Date",
						name: "publishedDate",
						required: true,
						type: "datetime",
					},
					{
						label: "Updated Date",
						name: "updatedDate",
						type: "datetime",
					},
					{
						label: "Draft",
						name: "draft",
						required: true,
						type: "boolean",
					},
					{
						isBody: true,
						label: "Body",
						name: "body",
						type: "rich-text",
					},
				],
				format: "mdx",
				label: "Posts",
				name: "post",
				path: "src/posts",
			},
		],
	},
	// Get this from tina.io
	token: process.env.TINA_TOKEN ?? null,
});
