import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { test } from "node:test"

const providers = [
  ["amp", "Amp", "#F34E3F"],
  ["antigravity", "Antigravity", "#4285F4"],
  ["claude", "Claude", "#DE7356"],
  ["codex", "Codex", "#74AA9C"],
  ["copilot", "Copilot", "#A855F7"],
  ["cursor", "Cursor", "#000000"],
  ["factory", "Factory", "#020202"],
  ["gemini", "Gemini", "#4285F4"],
  ["grok", "Grok", "#000000"],
  ["jetbrains-ai-assistant", "JetBrains AI Assistant", "#7d5fe6"],
  ["kimi", "Kimi", "#000000"],
  ["kiro", "Kiro", "#C09CFF"],
  ["minimax", "MiniMax", "#F5433C"],
  ["opencode-go", "OpenCode Go", "#000000"],
  ["perplexity", "Perplexity", "#20808D"],
  ["synthetic", "Synthetic", "#000000"],
  ["windsurf", "Windsurf", "#111111"],
  ["zai", "Z.ai", "#2D2D2D"],
]

test("provider catalog lists every production OpenUsage plugin with a local SVG", async () => {
  const catalog = await readFile(new URL("../src/provider-catalog.ts", import.meta.url), "utf8")

  assert.equal(providers.length, 18)
  assert.doesNotMatch(catalog, /id:\s*"mock"/)

  for (const [id, name, brandColor] of providers) {
    assert.match(catalog, new RegExp(`id: "${id}", name: "${name}", brandColor: "${brandColor}"`))
    assert.equal(existsSync(new URL(`../public/references/plugins/${id}.svg`, import.meta.url)), true)
  }
})

test("landing renders the catalog as a navigable, semantic provider section", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8")

  assert.match(app, /import \{ providerCatalog \} from "\.\/provider-catalog"/)
  assert.match(app, /href="#providers"/)
  assert.match(app, /handleSectionLinkClick\(event, "providers"\)/)
  assert.match(app, /<section id="providers" aria-labelledby="providers-title">/)
  assert.match(app, /<ul className="provider-grid" aria-label="Supported AI providers">/)
  assert.match(app, /providerCatalog\.map/)
  assert.match(app, /backgroundColor: getProviderIconColor\(provider\.brandColor, isDark\)/)
  assert.match(app, /WebkitMaskImage/)
  assert.match(app, /maskImage/)
  assert.match(app, /providerCatalog\.length/)
})
