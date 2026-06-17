import type { ManifestLine, MetricLine, PluginDisplayState, PluginLink, PluginMeta, PluginOutput } from "@/lib/plugin-types"

type DemoProviderSource = {
  id: string
  name: string
  plan: string
  brandColor: string
  icon: string
  links?: PluginLink[]
  lines: MetricLine[]
  overviewLabels: string[]
}

const assetBaseUrl = import.meta.env.BASE_URL

function inHours(now: number, hours: number) {
  return new Date(now + hours * 60 * 60 * 1000).toISOString()
}

function inDays(now: number, days: number) {
  return new Date(now + days * 24 * 60 * 60 * 1000).toISOString()
}

function buildManifest(lines: MetricLine[], overviewLabels: string[]): ManifestLine[] {
  const overview = new Set(overviewLabels)
  return lines.map((line) => ({
    type: line.type,
    label: line.label,
    scope: overview.has(line.label) ? "overview" : "detail",
  }))
}

function providerToState(provider: DemoProviderSource, now: number): PluginDisplayState {
  const meta: PluginMeta = {
    id: provider.id,
    name: provider.name,
    iconUrl: provider.icon,
    brandColor: provider.brandColor,
    lines: buildManifest(provider.lines, provider.overviewLabels),
    links: provider.links,
    primaryCandidates: provider.overviewLabels,
  }
  const data: PluginOutput = {
    providerId: provider.id,
    displayName: provider.name,
    plan: provider.plan,
    lines: provider.lines,
    iconUrl: provider.icon,
  }

  return {
    meta,
    data,
    loading: false,
    error: null,
    lastManualRefreshAt: null,
    lastUpdatedAt: now - 42_000,
  }
}

export function getDemoPluginStates(now = Date.now()): PluginDisplayState[] {
  const hour = 60 * 60 * 1000
  const week = 7 * 24 * hour
  const day = 24 * hour

  const providers: DemoProviderSource[] = [
    {
      id: "claude",
      name: "Claude",
      plan: "Max 5x",
      brandColor: "#DE7356",
      icon: `${assetBaseUrl}references/plugins/claude.svg`,
      links: [{ label: "Usage dashboard", url: "https://claude.ai/settings/usage" }],
      overviewLabels: ["Session", "Weekly"],
      lines: [
        { type: "progress", label: "Session", used: 62, limit: 100, format: { kind: "percent" }, color: "#DE7356", resetsAt: inHours(now, 2.25), periodDurationMs: 5 * hour },
        { type: "progress", label: "Weekly", used: 71, limit: 100, format: { kind: "percent" }, color: "#DE7356", resetsAt: inDays(now, 3), periodDurationMs: week },
        { type: "progress", label: "Sonnet", used: 82, limit: 100, format: { kind: "percent" }, color: "#DE7356", resetsAt: inHours(now, 4), periodDurationMs: 5 * hour },
        { type: "text", label: "Today", value: "37 prompts, 9 useful outputs" },
      ],
    },
    {
      id: "codex",
      name: "Codex",
      plan: "Plus",
      brandColor: "#74AA9C",
      icon: `${assetBaseUrl}references/plugins/codex.svg`,
      links: [{ label: "ChatGPT", url: "https://chatgpt.com" }],
      overviewLabels: ["Session", "Weekly"],
      lines: [
        { type: "progress", label: "Session", used: 28, limit: 100, format: { kind: "percent" }, color: "#74AA9C", resetsAt: inHours(now, 5), periodDurationMs: 5 * hour },
        { type: "progress", label: "Weekly", used: 43, limit: 100, format: { kind: "percent" }, color: "#74AA9C", resetsAt: inDays(now, 5), periodDurationMs: week },
        { type: "progress", label: "Reviews", used: 7, limit: 20, format: { kind: "count", suffix: "reviews" }, color: "#74AA9C", resetsAt: inDays(now, 5), periodDurationMs: week },
        { type: "progress", label: "Credits", used: 41, limit: 100, format: { kind: "count", suffix: "credits" }, color: "#74AA9C", resetsAt: inDays(now, 5), periodDurationMs: week },
      ],
    },
    {
      id: "cursor",
      name: "Cursor",
      plan: "Pro",
      brandColor: "#111827",
      icon: `${assetBaseUrl}references/plugins/cursor.svg`,
      links: [{ label: "Cursor dashboard", url: "https://cursor.com/settings" }],
      overviewLabels: ["Credits", "Requests"],
      lines: [
        { type: "progress", label: "Credits", used: 86, limit: 100, format: { kind: "count", suffix: "credits" }, color: "#111827", resetsAt: inDays(now, 2), periodDurationMs: 30 * day },
        { type: "progress", label: "Requests", used: 118, limit: 500, format: { kind: "count", suffix: "requests" }, color: "#111827", resetsAt: inDays(now, 2), periodDurationMs: 30 * day },
        { type: "progress", label: "Auto usage", used: 64, limit: 100, format: { kind: "percent" }, color: "#111827", resetsAt: inDays(now, 2), periodDurationMs: 30 * day },
        { type: "badge", label: "Pace", text: "Watch", color: "#E11D48" },
      ],
    },
    {
      id: "gemini",
      name: "Gemini",
      plan: "Advanced",
      brandColor: "#4285F4",
      icon: `${assetBaseUrl}references/plugins/gemini.svg`,
      overviewLabels: ["Pro", "Flash"],
      lines: [
        { type: "progress", label: "Pro", used: 32, limit: 100, format: { kind: "percent" }, color: "#4285F4", resetsAt: inDays(now, 9), periodDurationMs: 30 * day },
        { type: "progress", label: "Flash", used: 14, limit: 100, format: { kind: "percent" }, color: "#4285F4", resetsAt: inDays(now, 9), periodDurationMs: 30 * day },
        { type: "progress", label: "Deep Research", used: 4, limit: 20, format: { kind: "count", suffix: "runs" }, color: "#4285F4", resetsAt: inDays(now, 9), periodDurationMs: 30 * day },
        { type: "text", label: "Account", value: "personal workspace" },
      ],
    },
    {
      id: "kimi",
      name: "Kimi",
      plan: "Moonshot",
      brandColor: "#000000",
      icon: `${assetBaseUrl}references/plugins/kimi.svg`,
      overviewLabels: ["Session", "Weekly"],
      lines: [
        { type: "progress", label: "Session", used: 46, limit: 100, format: { kind: "percent" }, color: "#111827", resetsAt: inHours(now, 3), periodDurationMs: 5 * hour },
        { type: "progress", label: "Weekly", used: 58, limit: 100, format: { kind: "percent" }, color: "#111827", resetsAt: inDays(now, 4), periodDurationMs: week },
        { type: "text", label: "Today", value: "18 long-context prompts" },
        { type: "badge", label: "Pace", text: "Healthy", color: "#16A34A" },
      ],
    },
    {
      id: "perplexity",
      name: "Perplexity",
      plan: "Pro",
      brandColor: "#20808D",
      icon: `${assetBaseUrl}references/plugins/perplexity.svg`,
      overviewLabels: ["API credits", "Deep Research"],
      lines: [
        { type: "progress", label: "API credits", used: 22, limit: 100, format: { kind: "percent" }, color: "#20808D", resetsAt: inDays(now, 11), periodDurationMs: 30 * day },
        { type: "text", label: "Deep Research", value: "6 runs left" },
        { type: "text", label: "Queries", value: "42 this week" },
        { type: "text", label: "Labs", value: "3 exports" },
      ],
    },
  ]

  return providers.map((provider) => providerToState(provider, now))
}
