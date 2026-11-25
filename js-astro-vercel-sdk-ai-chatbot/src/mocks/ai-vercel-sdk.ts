export type Role = "user" | "assistant";

export type ChatMessage = {
  role: Role;
  content: string;
};

export type Provider = "openai" | "anthropic" | "google" | "groq" | string;

export type GenerateChatOptions = {
  provider?: Provider;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

export function hasProviderKey(provider: Provider): boolean {
  const map: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
  };
  const specific = map[provider];
  return Boolean(process.env.AI_API_KEY || specific);
}

export async function generateChat({ provider = "openai", model, messages }: GenerateChatOptions) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const hasKey = hasProviderKey(provider);
  const header = hasKey
    ? `Calling ${provider} • ${model} (mock)`
    : `Missing API key for ${provider}. Returning a mock response.`;

  const body = lastUser?.content?.trim()
    ? `You said: "${lastUser.content}"\n\nReplace this with a real streamed response.`
    : `No prompt provided. Replace this helper with your real AI call.`;

  return [header, body].join("\n\n");
}

