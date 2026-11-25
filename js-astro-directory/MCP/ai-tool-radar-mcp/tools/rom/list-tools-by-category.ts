import { type ApiTool, romRequest, pagedPath } from "../../lib/tools.ts";

const executeFunction = async ({ id, page }: any) =>
    romRequest(pagedPath(`/tools/category/${id}`, Number(page) || 1));

const apiTool: ApiTool = {
    function: executeFunction,
    definition: {
        type: "function",
        function: {
            name: "list_tools_by_category",
            description:
                "List AI tools in a given category, newest first, 24 per page. Returns a { data, meta, links } envelope; follow links.next for more pages. Use list_categories to discover valid ids.",
            parameters: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: 'Category id, e.g. "art" (lowercase, hyphenated).',
                        pattern: "^[a-z0-9-]+$",
                    },
                    page: {
                        type: "integer",
                        description: "Page number (1-based). Defaults to 1.",
                        minimum: 1,
                    },
                },
                required: ["id"],
            },
        },
    },
};

export { apiTool };
