import { useMemo, useState } from "react"
import { demoProviders, type DemoProvider, type Metric } from "./demo-data"

type View = "home" | "settings" | string
type DisplayMode = "used" | "left"

function getRelativeLuminance(hexColor: string) {
  const hex = hexColor.replace("#", "")
  if (hex.length !== 6) return 1

  const channels = [0, 2, 4].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function isDarkBrand(provider: DemoProvider) {
  return getRelativeLuminance(provider.brandColor) < 0.16
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 2a8 8 0 1 1-8 8 8 8 0 0 1 8-8Zm4.7 3.4a.7.7 0 0 1 .9.9l-4.1 5.1a2 2 0 1 1-2.8-2.8Zm.8 3.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1ZM6.5 11a1 1 0 1 1-1 1 1 1 0 0 1 1-1ZM12 5.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.4 13.5a7.6 7.6 0 0 0 .1-1.5 7.6 7.6 0 0 0-.1-1.5l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6A8 8 0 0 0 7 6.6l-2.4-1-2 3.4 2 1.5a7.6 7.6 0 0 0-.1 1.5 7.6 7.6 0 0 0 .1 1.5l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 2.6 1.5L10 21.5h4l.4-2.6A8 8 0 0 0 17 17.4l2.4 1 2-3.4ZM12 15.3a3.3 3.3 0 1 1 3.3-3.3 3.3 3.3 0 0 1-3.3 3.3Z" />
    </svg>
  )
}

function StatusDot({ status }: { status: DemoProvider["status"] }) {
  return <span className={`preview-status ${status}`} aria-label={status} />
}

function MetricLine({ metric, displayMode }: { metric: Metric; displayMode: DisplayMode }) {
  if (metric.type === "text") {
    return (
      <div className="preview-text-line">
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
      </div>
    )
  }

  if (metric.type === "badge") {
    return (
      <div className="preview-text-line">
        <span>{metric.label}</span>
        <b className="preview-badge" style={{ color: metric.color, borderColor: metric.color }}>{metric.value}</b>
      </div>
    )
  }

  const shown = displayMode === "used" ? metric.used : Math.max(0, metric.limit - metric.used)
  const percent = Math.max(0, Math.min(100, (shown / metric.limit) * 100))
  const label = metric.suffix === "$"
    ? `$${shown.toFixed(2)}${displayMode === "left" ? " left" : ""}`
    : `${Math.round(shown)} ${metric.suffix}${displayMode === "left" ? " left" : ""}`

  return (
    <div className="preview-metric">
      <div className="preview-metric-head">
        <span>{metric.label}</span>
        <small>{metric.resets}</small>
      </div>
      <div className="preview-progress" aria-label={`${metric.label} ${label}`}>
        <i style={{ width: `${percent}%`, background: metric.color }} />
      </div>
      <div className="preview-metric-foot">
        <span>{label}</span>
        <span>{metric.suffix === "$" ? `$${metric.limit}` : `${metric.limit} ${metric.suffix}`} limit</span>
      </div>
    </div>
  )
}

function ProviderCard({
  provider,
  displayMode,
  refreshing,
  onOpen,
  onRefresh,
}: {
  provider: DemoProvider
  displayMode: DisplayMode
  refreshing: boolean
  onOpen: () => void
  onRefresh: () => void
}) {
  return (
    <article className={refreshing ? "preview-provider is-refreshing" : "preview-provider"}>
      <button className="preview-provider-title" type="button" onClick={onOpen}>
        <span>
          <img className={isDarkBrand(provider) ? "preview-provider-icon is-dark-brand" : "preview-provider-icon"} src={provider.icon} alt="" />
          <strong>{provider.name}</strong>
          <StatusDot status={provider.status} />
        </span>
        <em>{provider.plan}</em>
      </button>
      <div className="preview-provider-actions">
        <button type="button" onClick={onRefresh}>{refreshing ? "Refreshing..." : "Refresh usage"}</button>
        <button type="button" onClick={onOpen}>Details</button>
      </div>
      {provider.metrics.map((metric) => (
        <MetricLine key={`${provider.id}-${metric.label}`} metric={metric} displayMode={displayMode} />
      ))}
    </article>
  )
}

function SideNav({
  activeView,
  onViewChange,
}: {
  activeView: View
  onViewChange: (view: View) => void
}) {
  return (
    <nav className="preview-sidenav" aria-label="Demo app navigation">
      <button className={activeView === "home" ? "active" : ""} type="button" aria-label="Overview" onClick={() => onViewChange("home")}>
        <GaugeIcon />
      </button>
      {demoProviders.map((provider) => (
        <button key={provider.id} className={activeView === provider.id ? "active" : ""} type="button" aria-label={provider.name} onClick={() => onViewChange(provider.id)}>
          <span className={isDarkBrand(provider) ? "preview-mask-icon is-dark-brand" : "preview-mask-icon"} style={{ backgroundColor: provider.brandColor, maskImage: `url(${provider.icon})`, WebkitMaskImage: `url(${provider.icon})` }} />
        </button>
      ))}
      <span className="preview-spacer" />
      <button className={activeView === "settings" ? "active" : ""} type="button" aria-label="Settings" onClick={() => onViewChange("settings")}>
        <SettingsIcon />
      </button>
    </nav>
  )
}

function SettingsView({
  displayMode,
  setDisplayMode,
}: {
  displayMode: DisplayMode
  setDisplayMode: (mode: DisplayMode) => void
}) {
  return (
    <div className="preview-settings">
      <h3>Settings</h3>
      <label>
        <span>Display mode</span>
        <select value={displayMode} onChange={(event) => setDisplayMode(event.target.value as DisplayMode)}>
          <option value="used">Used</option>
          <option value="left">Left</option>
        </select>
      </label>
      <label>
        <span>Auto refresh</span>
        <input type="checkbox" defaultChecked />
      </label>
      <label>
        <span>Start on login</span>
        <input type="checkbox" defaultChecked />
      </label>
      <div className="preview-settings-list">
        {demoProviders.map((provider) => (
          <span key={provider.id}>
            <img className={isDarkBrand(provider) ? "preview-settings-icon is-dark-brand" : "preview-settings-icon"} src={provider.icon} alt="" />
            {provider.name}
            <input type="checkbox" defaultChecked />
          </span>
        ))}
      </div>
    </div>
  )
}

export function AppPreview() {
  const [activeView, setActiveView] = useState<View>("home")
  const [displayMode, setDisplayMode] = useState<DisplayMode>("used")
  const [refreshingId, setRefreshingId] = useState<string | null>(null)

  const selectedProvider = useMemo(
    () => demoProviders.find((provider) => provider.id === activeView) ?? null,
    [activeView],
  )

  const refreshProvider = (providerId: string) => {
    setRefreshingId(providerId)
    window.setTimeout(() => setRefreshingId(null), 850)
  }

  return (
    <div className="app-preview" aria-label="Interactive OpenUsage preview">
      <div className="preview-arrow" />
      <div className="preview-shell">
        <SideNav activeView={activeView} onViewChange={setActiveView} />
        <div className="preview-main">
          <div className="preview-toolbar">
            <span>OpenUsage preview</span>
            <button type="button" onClick={() => demoProviders.forEach((provider) => refreshProvider(provider.id))}>Refresh all</button>
          </div>
          {activeView === "settings" ? (
            <SettingsView displayMode={displayMode} setDisplayMode={setDisplayMode} />
          ) : selectedProvider ? (
            <div className="preview-detail">
              <button className="preview-back" type="button" onClick={() => setActiveView("home")}>Overview</button>
              <ProviderCard
                provider={{ ...selectedProvider, metrics: [...selectedProvider.metrics, ...selectedProvider.detail] }}
                displayMode={displayMode}
                refreshing={refreshingId === selectedProvider.id}
                onOpen={() => setActiveView(selectedProvider.id)}
                onRefresh={() => refreshProvider(selectedProvider.id)}
              />
            </div>
          ) : (
            <div className="preview-overview">
              {demoProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  displayMode={displayMode}
                  refreshing={refreshingId === provider.id}
                  onOpen={() => setActiveView(provider.id)}
                  onRefresh={() => refreshProvider(provider.id)}
                />
              ))}
            </div>
          )}
          <footer className="preview-footer">
            <span>v0.6.30</span>
            <span>Updated just now</span>
          </footer>
        </div>
      </div>
    </div>
  )
}
