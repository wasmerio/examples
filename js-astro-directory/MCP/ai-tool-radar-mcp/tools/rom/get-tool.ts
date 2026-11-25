import { type ApiTool, romRequest } from "../../lib/tools.ts";

const executeFunction = async ({ slug }: any) => romRequest(`/tools/${slug}.json`);

const apiTool: ApiTool = {
    function: executeFunction,
    definition: {
        type: "function",
        function: {
            name: "get_tool",
            description:
                "Get a single AI tool from the Rise of Machine directory by slug, including its full description and related tools.",
            parameters: {
                type: "object",
                properties: {
                    slug: {
                        type: "string",
                        description: 'Tool slug, e.g. "cursor" (lowercase, hyphenated).',
                        pattern: "^[a-z0-9-]+$",
                    },
                },
                required: ["slug"],
            },
        },
    },
};

export { apiTool };
