import { Hono } from "hono"
import { paymentMiddleware, x402ResourceServer } from "@x402/hono"
import { HTTPFacilitatorClient } from "@x402/core/server"
import type { Network } from "@x402/core/types"
import { ExactSvmScheme } from "@x402/svm/exact/server"

interface AssetFetcher {
  fetch(request: Request): Promise<Response>
}

interface Env {
  ASSETS: AssetFetcher
  X402_ENABLED?: string
  X402_PAY_TO?: string
  X402_NETWORK?: string
  X402_PRICE?: string
  X402_FACILITATOR_URL?: string
  X402_BOT_ONLY?: string
  X402_BOT_SCORE_THRESHOLD?: string
  X402_PROTECTED_PATTERNS?: string
}

interface GatewayConfig {
  payTo: string
  network: Network
  price: string
  facilitatorUrl: string
  botOnly: boolean
  botScoreThreshold: number
  protectedPatterns: string[]
}

const DEFAULT_NETWORK = "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
const DEFAULT_PROTECTED_PATTERNS = [
  "/api",
  "/api/",
  "/api/v1",
  "/api/v1/",
  "/en/posts/",
  "/zh/posts/",
  "/fr/posts/",
  "/es/posts/",
  "/ru/posts/",
  "/ja/posts/",
  "/ko/posts/",
  "/pt/posts/",
  "/de/posts/",
  "/id/posts/",
  "/ar/posts/",
]
const PAYMENT_ROUTES = [
  "GET /api",
  "GET /api/v1",
  "GET /en/posts/*",
  "GET /zh/posts/*",
  "GET /fr/posts/*",
  "GET /es/posts/*",
  "GET /ru/posts/*",
  "GET /ja/posts/*",
  "GET /ko/posts/*",
  "GET /pt/posts/*",
  "GET /de/posts/*",
  "GET /id/posts/*",
  "GET /ar/posts/*",
]
const BOT_USER_AGENT_RE =
  /\b(bot|crawler|spider|slurp|gptbot|claudebot|anthropic|perplexity|bytespider|ccbot|amazonbot|applebot|google-extended)\b/i

function acceptsMarkdown(request: Request): boolean {
  return request.headers
    .get("Accept")
    ?.split(",")
    .some((value) => value.trim().toLowerCase().startsWith("text/markdown")) ?? false
}

function normalizeBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase())
}

function normalizePatterns(value: string | undefined): string[] {
  const patterns = (value ?? "")
    .split(",")
    .map((pattern) => pattern.trim())
    .filter(Boolean)
  return patterns.length > 0 ? patterns : DEFAULT_PROTECTED_PATTERNS
}

function normalizeThreshold(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10)
  if (!Number.isFinite(parsed)) return 30
  return Math.min(99, Math.max(1, parsed))
}

function readConfig(env: Env): GatewayConfig | null {
  if (!normalizeBoolean(env.X402_ENABLED, false)) return null

  const payTo = (env.X402_PAY_TO ?? "").trim()
  if (!payTo) return null

  return {
    payTo,
    network: ((env.X402_NETWORK ?? DEFAULT_NETWORK).trim() ||
      DEFAULT_NETWORK) as Network,
    price: (env.X402_PRICE ?? "$0.01").trim() || "$0.01",
    facilitatorUrl:
      (env.X402_FACILITATOR_URL ?? "https://x402.org/facilitator").trim() ||
      "https://x402.org/facilitator",
    botOnly: normalizeBoolean(env.X402_BOT_ONLY, true),
    botScoreThreshold: normalizeThreshold(env.X402_BOT_SCORE_THRESHOLD),
    protectedPatterns: normalizePatterns(env.X402_PROTECTED_PATTERNS),
  }
}

function isApiProbe(pathname: string): boolean {
  return pathname === "/api" || pathname === "/api/" || pathname === "/api/v1" || pathname === "/api/v1/"
}

function isProtectedPath(pathname: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith("/")) return pathname.startsWith(pattern)
    return pathname === pattern
  })
}

function botScore(request: Request): number | undefined {
  const cf = (
    request as Request & {
      cf?: { botManagement?: { score?: number } }
    }
  ).cf
  const score = cf?.botManagement?.score
  return typeof score === "number" ? score : undefined
}

function isBotRequest(request: Request, threshold: number): boolean {
  const score = botScore(request)
  if (score !== undefined) return score <= threshold
  return BOT_USER_AGENT_RE.test(request.headers.get("User-Agent") ?? "")
}

function shouldCharge(request: Request, config: GatewayConfig): boolean {
  const { pathname } = new URL(request.url)
  if (!isProtectedPath(pathname, config.protectedPatterns)) return false
  if (isApiProbe(pathname)) return true
  return !config.botOnly || isBotRequest(request, config.botScoreThreshold)
}

function paymentRoutes(config: GatewayConfig) {
  return Object.fromEntries(
    PAYMENT_ROUTES.map((route) => [
      route,
      {
        accepts: {
          scheme: "exact",
          price: config.price,
          network: config.network,
          payTo: config.payTo,
        },
        description: "Access to protected content",
        mimeType: "text/html",
      },
    ])
  )
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractAttribute(html: string, pattern: RegExp): string | undefined {
  return decodeHtml(pattern.exec(html)?.[1]?.trim() ?? "")
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function htmlToMarkdown(html: string): string {
  const title =
    extractAttribute(html, /<title[^>]*>([^<]*)<\/title>/i) ||
    extractAttribute(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  const description = extractAttribute(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
  )
  const image = extractAttribute(
    html,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  )
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean)

  const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html
  let body = main
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<img[^>]+alt=["']([^"']*)["'][^>]+src=["']([^"']+)["'][^>]*>/gi, "![$1]($2)")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/section>/gi, "\n")

  body = stripTags(body)

  const frontmatter = [
    "---",
    title ? `title: ${JSON.stringify(title)}` : "",
    description ? `description: ${JSON.stringify(description)}` : "",
    image ? `image: ${JSON.stringify(image)}` : "",
    "---",
  ].filter(Boolean)

  const sections = [frontmatter.join("\n"), body]
  if (jsonLd.length > 0) sections.push(["```json", jsonLd.join("\n"), "```"].join("\n"))

  return `${sections.filter(Boolean).join("\n\n")}\n`
}

function markdownTokenCount(markdown: string): string {
  return String(Math.max(1, Math.ceil(markdown.split(/\s+/).filter(Boolean).length * 1.35)))
}

async function markdownResponse(request: Request, env: Env): Promise<Response | null> {
  if (!acceptsMarkdown(request)) return null

  const response = await env.ASSETS.fetch(request)
  const contentType = response.headers.get("Content-Type") ?? ""
  if (!contentType.toLowerCase().includes("text/html")) return response

  const markdown = htmlToMarkdown(await response.text())
  const headers = new Headers(response.headers)
  headers.set("Content-Type", "text/markdown; charset=utf-8")
  headers.set("Vary", "Accept")
  headers.set("x-markdown-tokens", markdownTokenCount(markdown))
  headers.delete("Content-Length")

  return new Response(markdown, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function createApp(config: GatewayConfig) {
  const app = new Hono<{ Bindings: Env }>()
  const facilitator = new HTTPFacilitatorClient({
    url: config.facilitatorUrl,
  })
  const resourceServer = new x402ResourceServer(facilitator).register(
    config.network,
    new ExactSvmScheme()
  )

  app.use(
    "*",
    paymentMiddleware(paymentRoutes(config), resourceServer)
  )
  app.get("/api", (c) =>
    c.json({
      protocol: "x402",
      network: config.network,
      price: config.price,
      protected: true,
    })
  )
  app.get("/api/v1", (c) =>
    c.json({
      protocol: "x402",
      version: "1",
      network: config.network,
      price: config.price,
      protected: true,
    })
  )
  app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw))

  return app
}

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    const config = readConfig(env)
    if (!config || !shouldCharge(request, config)) {
      return (await markdownResponse(request, env)) ?? env.ASSETS.fetch(request)
    }

    return await createApp(config).fetch(request, env)
  },
}
