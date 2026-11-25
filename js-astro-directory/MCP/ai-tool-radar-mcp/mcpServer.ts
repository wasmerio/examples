#!/usr/bin/env bun

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
    type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { discoverTools, type ToolWithDefinition } from "./lib/tools.ts";
import pkg from "./package.json" with { type: "json" };

const SERVER_NAME = process.env.SERVER_NAME || pkg.name;
const SERVER_VERSION = process.env.SERVER_VERSION || pkg.version;

function transformTools(tools: ToolWithDefinition[]): Tool[] {
    return tools
        .map((tool) => {
            const fn = tool.definition?.function;
            if (!fn) return undefined;
            return {
                name: fn.name,
                description: fn.description,
                inputSchema: fn.parameters,
            } as Tool;
        })
        .filter((t): t is Tool => t !== undefined);
}

type ParameterSchema = NonNullable<ToolWithDefinition["definition"]["function"]["parameters"]>;

// Validate arguments against the tool's advertised JSON Schema (the subset the
// tools use: type, pattern, minimum, maximum, enum). Returns an error message
// for InvalidParams, or null when the arguments are valid.
function validateArguments(
    schema: ParameterSchema | undefined,
    args: Record<string, unknown>,
): string | null {
    if (!schema) return null;

    for (const key of schema.required ?? []) {
        if (!(key in args)) return `Missing required parameter: ${key}`;
    }

    const properties = schema.properties ?? {};
    for (const [key, value] of Object.entries(args)) {
        const prop = properties[key];
        if (!prop) continue;

        const type = prop.type as string | undefined;
        if (type === "integer") {
            if (typeof value !== "number" || !Number.isInteger(value)) {
                return `Parameter "${key}" must be an integer`;
            }
        } else if (type === "number") {
            if (typeof value !== "number") return `Parameter "${key}" must be a number`;
        } else if (type === "string") {
            if (typeof value !== "string") return `Parameter "${key}" must be a string`;
        } else if (type === "boolean") {
            if (typeof value !== "boolean") return `Parameter "${key}" must be a boolean`;
        }

        if (typeof value === "number") {
            if (typeof prop.minimum === "number" && value < prop.minimum) {
                return `Parameter "${key}" must be >= ${prop.minimum}`;
            }
            if (typeof prop.maximum === "number" && value > prop.maximum) {
                return `Parameter "${key}" must be <= ${prop.maximum}`;
            }
        }

        if (typeof value === "string" && typeof prop.pattern === "string") {
            if (!new RegExp(prop.pattern).test(value)) {
                return `Parameter "${key}" must match pattern ${prop.pattern}`;
            }
        }

        if (Array.isArray(prop.enum) && !prop.enum.includes(value)) {
            return `Parameter "${key}" must be one of: ${prop.enum.join(", ")}`;
        }
    }

    return null;
}

function setupServerHandlers(server: Server, tools: ToolWithDefinition[], transformedTools: Tool[]) {
    const toolMap = new Map(tools.map((tool) => [tool.definition.function.name, tool]));

    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: transformedTools,
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const toolName = request.params.name;
        const tool = toolMap.get(toolName);
        if (!tool) {
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
        }
        const args = request.params.arguments || {};
        const error = validateArguments(tool.definition?.function?.parameters, args);
        if (error) {
            throw new McpError(ErrorCode.InvalidParams, error);
        }
        try {
            const result = await tool.function(args);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        } catch (error: any) {
            console.error("[Error] Failed to fetch data:", error);
            return {
                content: [{ type: "text", text: `API error: ${error.message}` }],
                isError: true,
            };
        }
    });
}

async function run() {
    const tools = await discoverTools();
    const transformedTools = transformTools(tools);

    const server = new Server(
        { name: SERVER_NAME, version: SERVER_VERSION },
        { capabilities: { tools: {} } },
    );
    server.onerror = (error) => console.error("[Error]", error);
    setupServerHandlers(server, tools, transformedTools);

    process.on("SIGINT", async () => {
        await server.close();
        process.exit(0);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

run().catch(console.error);
