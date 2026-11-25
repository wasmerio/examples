import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export interface ApiTool {
    definition: {
        type: "function";
        function: {
            name: string;
            description?: string;
            parameters?: {
                type: string;
                properties: Record<string, any>;
                required?: string[];
            };
        };
    };
    function: (args: any) => Promise<any>;
}

export type ToolWithDefinition = ApiTool & { path: string };

const toolsDir = fileURLToPath(new URL("../tools", import.meta.url));

export async function discoverTools(): Promise<ToolWithDefinition[]> {
    const glob = new Bun.Glob("rom/**/*.ts");
    const tools: ToolWithDefinition[] = [];
    for await (const file of glob.scan({ cwd: toolsDir })) {
        const module = await import(pathToFileURL(path.join(toolsDir, file)).href);
        const apiTool = module.apiTool as ApiTool | undefined;
        if (!apiTool?.definition?.function?.name) continue;
        tools.push({ ...apiTool, path: file } as ToolWithDefinition);
    }
    tools.sort((a, b) =>
        a.definition.function.name.localeCompare(b.definition.function.name),
    );
    return tools;
}

const BASE = (process.env.RISEOFMACHINE_API_BASE?.replace(/\/$/, "") ??
    "https://riseofmachine.com/api/v1");

const REQUEST_TIMEOUT_MS = 15000;

export interface RomRequestOptions {
    query?: Record<string, string | number | boolean | undefined | null>;
}

// Shared request helper: no auth (the API is public), tolerates empty/non-JSON
// bodies, and surfaces non-2xx responses as thrown errors.
export async function romRequest(endpoint: string, options: RomRequestOptions = {}): Promise<any> {
    const url = new URL(`${BASE}${endpoint}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
        }
    }

    let response: Response;
    try {
        response = await fetch(url.toString(), {
            headers: { accept: "application/json" },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        if (error instanceof DOMException && error.name === "TimeoutError") {
            throw new Error(
                `Rise of Machine API request timed out after ${REQUEST_TIMEOUT_MS}ms`,
            );
        }
        throw error;
    }
    const text = await response.text();
    let data: any;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        const message = (data && (data.message || data.error)) || response.statusText;
        throw new Error(`Rise of Machine API ${response.status}: ${message}`);
    }

    return data ?? { success: true, status: response.status };
}

// Path for page 1 vs page n (the API splits these across two route shapes).
export function pagedPath(base: string, page: number): string {
    const n = Math.max(1, Math.floor(page));
    return n <= 1 ? `${base}.json` : `${base}/page/${n}.json`;
}
