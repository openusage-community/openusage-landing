export type ProviderCatalogItem = {
  id: string
  name: string
  brandColor: string
}

// Snapshot of /home/sbaikov/Desktop/Projects/openusage/plugins/*/plugin.json.
// Keep this list and the matching public SVG files in sync with the app's production plugins.
export const providerCatalog: readonly ProviderCatalogItem[] = [
  { id: "amp", name: "Amp", brandColor: "#F34E3F" },
  { id: "antigravity", name: "Antigravity", brandColor: "#4285F4" },
  { id: "claude", name: "Claude", brandColor: "#DE7356" },
  { id: "codex", name: "Codex", brandColor: "#74AA9C" },
  { id: "copilot", name: "Copilot", brandColor: "#A855F7" },
  { id: "cursor", name: "Cursor", brandColor: "#000000" },
  { id: "factory", name: "Factory", brandColor: "#020202" },
  { id: "gemini", name: "Gemini", brandColor: "#4285F4" },
  { id: "grok", name: "Grok", brandColor: "#000000" },
  { id: "jetbrains-ai-assistant", name: "JetBrains AI Assistant", brandColor: "#7d5fe6" },
  { id: "kimi", name: "Kimi", brandColor: "#000000" },
  { id: "kiro", name: "Kiro", brandColor: "#C09CFF" },
  { id: "minimax", name: "MiniMax", brandColor: "#F5433C" },
  { id: "opencode-go", name: "OpenCode Go", brandColor: "#000000" },
  { id: "perplexity", name: "Perplexity", brandColor: "#20808D" },
  { id: "synthetic", name: "Synthetic", brandColor: "#000000" },
  { id: "windsurf", name: "Windsurf", brandColor: "#111111" },
  { id: "zai", name: "Z.ai", brandColor: "#2D2D2D" },
]
