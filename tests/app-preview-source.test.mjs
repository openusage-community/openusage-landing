import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"

test("hero preview uses the vendored OpenUsage UI shell", async () => {
  const appPreview = await readFile(new URL("../src/AppPreview.tsx", import.meta.url), "utf8")

  assert.match(appPreview, /OpenUsagePreviewShell/)
  assert.doesNotMatch(appPreview, /preview-provider/)
  assert.doesNotMatch(appPreview, /preview-progress/)
})

test("settings preview controls are wired to demo state", async () => {
  const settingsPreview = await readFile(new URL("../src/openusage-preview/SettingsPreview.tsx", import.meta.url), "utf8")
  const previewShell = await readFile(new URL("../src/openusage-preview/OpenUsagePreviewShell.tsx", import.meta.url), "utf8")

  assert.doesNotMatch(settingsPreview, /onToggle=\{\(\) => undefined\}/)
  assert.doesNotMatch(settingsPreview, /onClick=\{\(\) => undefined\}/)
  assert.match(settingsPreview, /onPluginToggle/)
  assert.match(settingsPreview, /onThemeModeChange/)
  assert.match(settingsPreview, /onAutoUpdateIntervalChange/)
  assert.match(settingsPreview, /onMenubarIconStyleChange/)
  assert.match(previewShell, /enabledPluginIds/)
})

test("settings preview supports dragging providers to reorder them", async () => {
  const settingsPreview = await readFile(new URL("../src/openusage-preview/SettingsPreview.tsx", import.meta.url), "utf8")
  const previewShell = await readFile(new URL("../src/openusage-preview/OpenUsagePreviewShell.tsx", import.meta.url), "utf8")

  assert.match(settingsPreview, /DndContext/)
  assert.match(settingsPreview, /SortableContext/)
  assert.match(settingsPreview, /useSortable/)
  assert.match(settingsPreview, /arrayMove/)
  assert.match(settingsPreview, /onPluginReorder/)
  assert.match(settingsPreview, /handleDragEnd/)
  assert.match(previewShell, /reorderPlugins/)
  assert.match(previewShell, /onPluginReorder=\{reorderPlugins\}/)
})

test("hero preview follows the landing theme like the real OpenUsage panel", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8")
  const appPreview = await readFile(new URL("../src/AppPreview.tsx", import.meta.url), "utf8")
  const previewShell = await readFile(new URL("../src/openusage-preview/OpenUsagePreviewShell.tsx", import.meta.url), "utf8")
  const sideNav = await readFile(new URL("../src/openusage-preview/SideNav.tsx", import.meta.url), "utf8")

  assert.match(app, /<AppPreview releaseTag=\{release\?\.tag\} themeMode=\{isDark \? "dark" : "light"\} \/>/)
  assert.match(appPreview, /themeMode\?: ThemeMode/)
  assert.match(previewShell, /initialThemeMode = "dark"/)
  assert.match(previewShell, /resolvedThemeMode === "dark"/)
  assert.match(previewShell, /matchMedia\("\(prefers-color-scheme: dark\)"\)/)
  assert.doesNotMatch(sideNav, /isDark\s*$/m)
})

test("desktop navbar items share the same larger sizing tokens", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8")

  assert.match(styles, /--nav-item-font-size:\s*1\.08rem/)
  assert.match(styles, /--nav-action-height:\s*48px/)
  assert.match(styles, /\.nav-links\s*\{[^}]*font-size:\s*var\(--nav-item-font-size\)/s)
  assert.match(styles, /\.nav \.mini-cta\s*\{[^}]*min-height:\s*var\(--nav-action-height\)[^}]*font-size:\s*var\(--nav-item-font-size\)/s)
  assert.match(styles, /\.theme-toggle\s*\{[^}]*min-height:\s*var\(--nav-action-height\)[^}]*font-size:\s*var\(--nav-item-font-size\)/s)
})

test("logo links back to the hero section with smooth scrolling", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8")

  assert.match(app, /<header id="top" className="hero">/)
  assert.match(app, /href="#top"/)
  assert.match(app, /onClick=\{\(event\) => handleSectionLinkClick\(event, "top"\)\}/)
  assert.doesNotMatch(app, /<div className="logo" aria-label="OpenUsage">/)
})
