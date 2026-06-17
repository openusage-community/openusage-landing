export const REFRESH_COOLDOWN_MS = 300_000

export type AutoUpdateIntervalMinutes = 5 | 15 | 30 | 60
export type ThemeMode = "system" | "light" | "dark"
export type DisplayMode = "used" | "left"
export type ResetTimerDisplayMode = "relative" | "absolute"
export type TimeFormatMode = "auto" | "12h" | "24h"
export type MenubarIconStyle = "provider" | "bars" | "donut"
export type GlobalShortcut = string | null

export const AUTO_UPDATE_OPTIONS: { value: AutoUpdateIntervalMinutes; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
]

export const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

export const DISPLAY_MODE_OPTIONS: { value: DisplayMode; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "used", label: "Used" },
]

export const RESET_TIMER_DISPLAY_OPTIONS: { value: ResetTimerDisplayMode; label: string }[] = [
  { value: "relative", label: "Relative" },
  { value: "absolute", label: "Absolute" },
]

export const TIME_FORMAT_OPTIONS: { value: TimeFormatMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "12h", label: "12-hour" },
  { value: "24h", label: "24-hour" },
]

export const MENUBAR_ICON_STYLE_OPTIONS: { value: MenubarIconStyle; label: string }[] = [
  { value: "provider", label: "Plugin" },
  { value: "donut", label: "Donut" },
  { value: "bars", label: "Bars" },
]
