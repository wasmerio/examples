export const normalMarkdownSource = (source: string) => source
  .replace(/<llm-only\b[^>]*>[\s\S]*?<\/llm-only>/giu, '')
  .replace(/<\/?llm-exclude\b[^>]*>/giu, '')

export const llmMarkdownSource = (source: string) => source
  .replace(/<llm-exclude\b[^>]*>[\s\S]*?<\/llm-exclude>/giu, '')
  .replace(/<\/?llm-only\b[^>]*>/giu, '')
