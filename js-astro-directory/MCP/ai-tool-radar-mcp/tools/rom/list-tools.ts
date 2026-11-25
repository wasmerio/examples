import { type ApiTool, romRequest, pagedPath } from "../../lib/tools.ts";

const executeFunction = async ({ page }: any) =>
    romRequest(pagedPath("/tools", Number(page) || 1));

const apiTool: ApiTool = {
    function: executeFunction,
    definition: {
        type: "function",
        function: {
            name: "list_tools",
            description:
                "List AI tools from the Rise of Machine directory, newest first, 24 per page. Returns a { data, meta, links } envelope; follow links.next for more pages.",
            parameters: {
                type: "object",
                properties: {
                    page: {
                        type: "integer",
                        description: "Page number (1-based). Defaults to 1.",
                        minimum: 1,
                    },
                },
                required: [],
            },
        },
    },
};

export { apiTool };
