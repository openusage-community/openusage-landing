import { useEffect, useMemo, useState } from "react"
import { OverviewPage } from "./OverviewPage"
import { ProviderDetailPage } from "./ProviderDetailPage"
import { SettingsPreview } from "./SettingsPreview"
import { SideNav, type ActiveView, type NavPlugin } from "./SideNav"
import { getDemoPluginStates } from "@/demo-data"
import type { PluginDisplayState } from "@/lib/plugin-types"
import type {
  AutoUpdateIntervalMinutes,
  DisplayMode,
  MenubarIconStyle,
  ResetTimerDisplayMode,
  ThemeMode,
  TimeFormatMode,
} from "@/lib/settings"

function toNavPlugin(plugin: PluginDisplayState): NavPlugin {
  return {
    id: plugin.meta.id,
    name: plugin.meta.name,
    iconUrl: plugin.meta.iconUrl,
    brandColor: plugin.meta.brandColor,
  }
}

function PreviewFooter({
  releaseTag,
  onRefreshAll,
}: {
  releaseTag?: string
  onRefreshAll: () => void
}) {
  return (
    <div className="flex justify-between items-center h-8 pt-1.5 border-t">
      <button
        type="button"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        OpenUsage {releaseTag ?? "latest"}
      </button>
      <button
        type="button"
        onClick={onRefreshAll}
        className="text-xs text-muted-foreground tabular-nums hover:text-foreground transition-colors cursor-pointer"
        title="Refresh now"
      >
        Refresh all
      </button>
    </div>
  )
}

function useResolvedThemeMode(themeMode: ThemeMode) {
  const [resolvedThemeMode, setResolvedThemeMode] = useState<"light" | "dark">(() => {
    if (themeMode !== "system") return themeMode
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    if (themeMode !== "system") {
      setResolvedThemeMode(themeMode)
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const applySystemTheme = () => {
      setResolvedThemeMode(mediaQuery.matches ? "dark" : "light")
    }

    applySystemTheme()
    mediaQuery.addEventListener("change", applySystemTheme)
    return () => mediaQuery.removeEventListener("change", applySystemTheme)
  }, [themeMode])

  return resolvedThemeMode
}

export function OpenUsagePreviewShell({
  releaseTag,
  initialThemeMode = "dark",
}: {
  releaseTag?: string
  initialThemeMode?: ThemeMode
}) {
  const [activeView, setActiveView] = useState<ActiveView>("home")
  const [plugins, setPlugins] = useState(() => getDemoPluginStates())
  const [enabledPluginIds, setEnabledPluginIds] = useState(() =>
    getDemoPluginStates().map((plugin) => plugin.meta.id)
  )
  const [autoUpdateInterval, setAutoUpdateInterval] = useState<AutoUpdateIntervalMinutes>(15)
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialThemeMode)
  const [displayMode, setDisplayMode] = useState<DisplayMode>("used")
  const [resetTimerDisplayMode, setResetTimerDisplayMode] = useState<ResetTimerDisplayMode>("relative")
  const [timeFormatMode, setTimeFormatMode] = useState<TimeFormatMode>("auto")
  const [menubarIconStyle, setMenubarIconStyle] = useState<MenubarIconStyle>("provider")
  const resolvedThemeMode = useResolvedThemeMode(themeMode)

  useEffect(() => {
    setThemeMode(initialThemeMode)
  }, [initialThemeMode])

  const enabledPlugins = useMemo(
    () => plugins.filter((plugin) => enabledPluginIds.includes(plugin.meta.id)),
    [enabledPluginIds, plugins],
  )
  const navPlugins = useMemo(() => enabledPlugins.map(toNavPlugin), [enabledPlugins])
  const selectedPlugin = useMemo(
    () => enabledPlugins.find((plugin) => plugin.meta.id === activeView) ?? null,
    [activeView, enabledPlugins],
  )

  const refreshPlugin = (pluginId: string) => {
    const startedAt = Date.now()
    setPlugins((current) =>
      current.map((plugin) =>
        plugin.meta.id === pluginId
          ? { ...plugin, loading: true, lastManualRefreshAt: startedAt }
          : plugin
      )
    )
    window.setTimeout(() => {
      setPlugins((current) =>
        current.map((plugin) =>
          plugin.meta.id === pluginId
            ? { ...plugin, loading: false, lastUpdatedAt: Date.now() }
            : plugin
        )
      )
    }, 700)
  }

  const refreshAll = () => {
    enabledPlugins.forEach((plugin) => refreshPlugin(plugin.meta.id))
  }

  const togglePlugin = (pluginId: string) => {
    setEnabledPluginIds((current) => {
      const isEnabled = current.includes(pluginId)
      if (isEnabled && current.length === 1) return current
      const next = isEnabled
        ? current.filter((id) => id !== pluginId)
        : [...current, pluginId]
      if (activeView === pluginId && isEnabled) {
        setActiveView("home")
      }
      return next
    })
  }

  const reorderPlugins = (orderedIds: string[]) => {
    setPlugins((current) => {
      const pluginById = new Map(current.map((plugin) => [plugin.meta.id, plugin]))
      const orderedPlugins = orderedIds
        .map((pluginId) => pluginById.get(pluginId))
        .filter((plugin): plugin is PluginDisplayState => Boolean(plugin))
      const orderedIdSet = new Set(orderedIds)
      const missingPlugins = current.filter((plugin) => !orderedIdSet.has(plugin.meta.id))

      return [...orderedPlugins, ...missingPlugins]
    })
  }

  const toggleResetTimerDisplayMode = () => {
    setResetTimerDisplayMode((current) => current === "relative" ? "absolute" : "relative")
  }

  return (
    <div
      className={`app-preview openusage-preview-root ${resolvedThemeMode === "dark" ? "dark" : ""}`}
      aria-label="OpenUsage app preview"
    >
      <div
        tabIndex={-1}
        className="flex flex-col items-center p-6 pt-1.5 bg-transparent outline-none"
      >
        <div className="tray-arrow" />
        <div className="relative bg-card rounded-xl overflow-hidden select-none w-full shadow-lg flex flex-col preview-panel">
          <div className="flex flex-1 min-h-0 flex-row">
            <SideNav
              activeView={activeView}
              onViewChange={setActiveView}
              plugins={navPlugins}
              isDark={resolvedThemeMode === "dark"}
            />
            <div className="flex-1 flex flex-col px-3 pt-2 pb-1.5 min-w-0 bg-card dark:bg-muted/50">
              <div className="relative flex-1 min-h-0">
                <div className="h-full overflow-y-auto scrollbar-none">
                  {activeView === "home" ? (
                    <OverviewPage
                      plugins={enabledPlugins}
                      onRetryPlugin={refreshPlugin}
                      displayMode={displayMode}
                      resetTimerDisplayMode={resetTimerDisplayMode}
                      timeFormatMode={timeFormatMode}
                      onResetTimerDisplayModeToggle={toggleResetTimerDisplayMode}
                    />
                  ) : activeView === "settings" ? (
                    <SettingsPreview
                      plugins={plugins.map((plugin) => ({
                        ...toNavPlugin(plugin),
                        enabled: enabledPluginIds.includes(plugin.meta.id),
                      }))}
                      autoUpdateInterval={autoUpdateInterval}
                      themeMode={themeMode}
                      displayMode={displayMode}
                      resetTimerDisplayMode={resetTimerDisplayMode}
                      timeFormatMode={timeFormatMode}
                      menubarIconStyle={menubarIconStyle}
                      onPluginToggle={togglePlugin}
                      onPluginReorder={reorderPlugins}
                      onAutoUpdateIntervalChange={setAutoUpdateInterval}
                      onThemeModeChange={setThemeMode}
                      onDisplayModeChange={setDisplayMode}
                      onResetTimerDisplayModeChange={setResetTimerDisplayMode}
                      onTimeFormatModeChange={setTimeFormatMode}
                      onMenubarIconStyleChange={setMenubarIconStyle}
                    />
                  ) : (
                    <ProviderDetailPage
                      plugin={selectedPlugin}
                      onRetry={selectedPlugin ? () => refreshPlugin(selectedPlugin.meta.id) : undefined}
                      displayMode={displayMode}
                      resetTimerDisplayMode={resetTimerDisplayMode}
                      timeFormatMode={timeFormatMode}
                      onResetTimerDisplayModeToggle={toggleResetTimerDisplayMode}
                    />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card dark:from-muted/50 to-transparent transition-opacity duration-200 opacity-100" />
              </div>
              <PreviewFooter releaseTag={releaseTag} onRefreshAll={refreshAll} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
