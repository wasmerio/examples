import { type ApiTool, romRequest } from "../../lib/tools.ts";

const executeFunction = async () => romRequest("/tools-all.json");

const apiTool: ApiTool = {
    function: executeFunction,
    definition: {
        type: "function",
        function: {
            name: "get_all_tools",
            description:
                "Get every AI tool in the Rise of Machine directory in a single response, with full records (body and related tools). Large payload — prefer list_tools or search_tools when you only need a subset.",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
        },
    },
};

export { apiTool };
