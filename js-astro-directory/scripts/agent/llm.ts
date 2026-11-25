// Thin NVIDIA NIM wrapper. OpenAI-compatible, so only base URL + key change to swap providers.
// The model must support function/tool calling (we force a single tool call and read its JSON
// arguments). Override with NVIDIA_MODEL if the default is retired.

const BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const MODEL = process.env.NVIDIA_MODEL || 'minimaxai/minimax-m3.1-flash';
// NIM cold starts and reasoning-style models can take a while before emitting the forced tool call.
const REQUEST_TIMEOUT_MS = 90_000;
// The tool arguments are small JSON; this caps any runaway generation.
const MAX_TOKENS = 1024;

interface ToolSchema {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}

interface GenerateOptions {
    system: string;
    user: string;
    tool: ToolSchema;
    temperature?: number;
    maxRetries?: number;
}

function requireKey(): string {
    const key = process.env.NVIDIA_API_KEY;
    if (!key) throw new Error('NVIDIA_API_KEY is not set.');
    return key;
}

// Returns the parsed arguments object from a forced tool call.
export async function generateObject<T>(opts: GenerateOptions): Promise<T> {
    const { system, user, tool, temperature = 0.2, maxRetries = 2 } = opts;
    const key = requireKey();

    let lastErr: Error | null = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const response = await fetch(`${BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                signal: controller.signal,
                body: JSON.stringify({
                    model: MODEL,
                    temperature,
                    max_tokens: MAX_TOKENS,
                    messages: [
                        { role: 'system', content: system },
                        { role: 'user', content: user },
                    ],
                    tools: [{ type: 'function', function: tool }],
                    tool_choice: { type: 'function', function: { name: tool.name } },
                }),
            });

            if (!response.ok) {
                const text = await response.text().catch(() => '');
                throw new Error(`NIM HTTP ${response.status}: ${text.slice(0, 200)}`);
            }

            const data: any = await response.json();
            const call = data?.choices?.[0]?.message?.tool_calls?.[0];
            const argsStr = call?.function?.arguments;
            if (!argsStr) throw new Error('Model did not return a tool call.');
            return JSON.parse(argsStr) as T;
        } catch (err: any) {
            lastErr = err instanceof Error ? err : new Error(String(err));
        } finally {
            clearTimeout(timeoutId);
        }
    }
    throw lastErr || new Error('LLM call failed.');
}
