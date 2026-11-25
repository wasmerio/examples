import { type ApiTool, romRequest } from "../../lib/tools.ts";

const executeFunction = async () => romRequest("/categories.json");

const apiTool: ApiTool = {
    function: executeFunction,
    definition: {
        type: "function",
        function: {
            name: "list_categories",
            description:
                "List all categories in the Rise of Machine directory with their tool counts. Use a category id with list_tools_by_category.",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
};

export { apiTool };
