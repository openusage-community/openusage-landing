import { OpenUsagePreviewShell } from "@/openusage-preview/OpenUsagePreviewShell"
import type { ThemeMode } from "@/lib/settings"

export function AppPreview({ releaseTag, themeMode }: { releaseTag?: string; themeMode?: ThemeMode }) {
  return <OpenUsagePreviewShell releaseTag={releaseTag} initialThemeMode={themeMode} />
}
