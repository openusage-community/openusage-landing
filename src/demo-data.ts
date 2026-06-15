export type Metric =
  | {
      type: "progress"
      label: string
      used: number
      limit: number
      suffix: string
      color: string
      resets: string
    }
  | {
      type: "text"
      label: string
      value: string
    }
  | {
      type: "badge"
      label: string
      value: string
      color: string
    }

export type DemoProvider = {
  id: string
  name: string
  plan: string
  brandColor: string
  icon: string
  status: "ahead" | "on-track" | "behind"
  metrics: Metric[]
  detail: Metric[]
}

export const demoProviders: DemoProvider[] = [
  {
    id: "claude",
    name: "Claude",
    plan: "Max 5x",
    brandColor: "#DE7356",
    icon: "/references/plugins/claude.svg",
    status: "on-track",
    metrics: [
      { type: "progress", label: "Session", used: 62, limit: 100, suffix: "%", color: "#DE7356", resets: "resets in 2h 14m" },
      { type: "progress", label: "Weekly", used: 71, limit: 100, suffix: "%", color: "#DE7356", resets: "resets Monday" },
    ],
    detail: [
      { type: "progress", label: "Sonnet", used: 82, limit: 100, suffix: "%", color: "#DE7356", resets: "runs out in 4h" },
      { type: "progress", label: "Claude Design", used: 38, limit: 100, suffix: "%", color: "#DE7356", resets: "resets tomorrow" },
      { type: "text", label: "Today", value: "37 prompts, 9 useful outputs" },
    ],
  },
  {
    id: "codex",
    name: "Codex",
    plan: "Plus",
    brandColor: "#74AA9C",
    icon: "/references/plugins/codex.svg",
    status: "ahead",
    metrics: [
      { type: "progress", label: "Session", used: 28, limit: 100, suffix: "%", color: "#74AA9C", resets: "resets in 5h" },
      { type: "progress", label: "Weekly", used: 43, limit: 100, suffix: "%", color: "#74AA9C", resets: "resets Friday" },
    ],
    detail: [
      { type: "progress", label: "Reviews", used: 7, limit: 20, suffix: "reviews", color: "#74AA9C", resets: "12 left" },
      { type: "progress", label: "Credits", used: 41, limit: 100, suffix: "credits", color: "#74AA9C", resets: "59 left" },
      { type: "text", label: "Today", value: "4 implementation runs" },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    plan: "Pro",
    brandColor: "#111827",
    icon: "/references/plugins/cursor.svg",
    status: "behind",
    metrics: [
      { type: "progress", label: "Credits", used: 86, limit: 100, suffix: "credits", color: "#111827", resets: "runs out soon" },
      { type: "progress", label: "Requests", used: 118, limit: 500, suffix: "requests", color: "#111827", resets: "382 left" },
    ],
    detail: [
      { type: "progress", label: "Auto usage", used: 64, limit: 100, suffix: "%", color: "#111827", resets: "36% left" },
      { type: "progress", label: "API usage", used: 19, limit: 100, suffix: "%", color: "#111827", resets: "low usage" },
      { type: "badge", label: "Pace", value: "Watch", color: "#E11D48" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    plan: "Advanced",
    brandColor: "#4285F4",
    icon: "/references/plugins/gemini.svg",
    status: "ahead",
    metrics: [
      { type: "progress", label: "Pro", used: 32, limit: 100, suffix: "%", color: "#4285F4", resets: "68% left" },
      { type: "progress", label: "Flash", used: 14, limit: 100, suffix: "%", color: "#4285F4", resets: "86% left" },
    ],
    detail: [
      { type: "text", label: "Account", value: "personal workspace" },
      { type: "progress", label: "Deep Research", used: 4, limit: 20, suffix: "runs", color: "#4285F4", resets: "16 left" },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    plan: "$24.18 credits",
    brandColor: "#6467F2",
    icon: "/references/plugins/openrouter.svg",
    status: "on-track",
    metrics: [
      { type: "progress", label: "Credits", used: 15.82, limit: 40, suffix: "$", color: "#6467F2", resets: "$24.18 left" },
      { type: "badge", label: "Tier", value: "Paid", color: "#6467F2" },
    ],
    detail: [
      { type: "text", label: "Spent", value: "$15.82 this month" },
      { type: "text", label: "Remaining", value: "$24.18" },
      { type: "progress", label: "Key limit", used: 39, limit: 100, suffix: "%", color: "#6467F2", resets: "healthy" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    plan: "Pro",
    brandColor: "#20808D",
    icon: "/references/plugins/perplexity.svg",
    status: "ahead",
    metrics: [
      { type: "progress", label: "API credits", used: 22, limit: 100, suffix: "%", color: "#20808D", resets: "78% left" },
      { type: "text", label: "Deep Research", value: "6 runs left" },
    ],
    detail: [
      { type: "text", label: "Queries", value: "42 this week" },
      { type: "text", label: "Labs", value: "3 exports" },
      { type: "text", label: "Agentic Research", value: "ready" },
    ],
  },
]
