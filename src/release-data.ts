export type DownloadPlatform = "linux" | "macos"

export type DownloadOption = {
  label: string
  detail: string
  fileName: string
  href: string
}

export type PlatformDownloadOptions = {
  title: string
  intro: string
  options: DownloadOption[]
}

export type ReleaseDownloadOptions = {
  tag: string
  releaseUrl: string
  options: Record<DownloadPlatform, PlatformDownloadOptions>
}

type GitHubReleaseAsset = {
  name: string
  browser_download_url: string
}

type GitHubRelease = {
  tag_name: string
  html_url?: string
  assets: GitHubReleaseAsset[]
}

const latestReleaseUrl = "https://api.github.com/repos/openusage-community/openusage/releases/latest"

function findAsset(assets: GitHubReleaseAsset[], matcher: (name: string) => boolean): GitHubReleaseAsset | undefined {
  return assets.find((asset) => matcher(asset.name))
}

function toOption(asset: GitHubReleaseAsset | undefined, label: string, detail: string): DownloadOption | null {
  if (!asset) {
    return null
  }

  return {
    label,
    detail,
    fileName: asset.name,
    href: asset.browser_download_url,
  }
}

function compactOptions(options: Array<DownloadOption | null>): DownloadOption[] {
  return options.filter((option): option is DownloadOption => option !== null)
}

export function buildReleaseDownloadOptions(release: GitHubRelease): ReleaseDownloadOptions {
  const assets = release.assets

  return {
    tag: release.tag_name,
    releaseUrl: release.html_url ?? `https://github.com/openusage-community/openusage/releases/tag/${release.tag_name}`,
    options: {
      linux: {
        title: "Download OpenUsage for Linux",
        intro: "Choose the package for your distro. The download starts immediately after selection.",
        options: compactOptions([
          toOption(findAsset(assets, (name) => name.endsWith("_amd64.deb")), "Ubuntu / Debian", "Best for Ubuntu, Debian, Linux Mint, Pop!_OS"),
          toOption(findAsset(assets, (name) => name.endsWith(".rpm")), "Fedora / RHEL", "Best for Fedora, Red Hat, CentOS, openSUSE"),
          toOption(findAsset(assets, (name) => name.endsWith("_amd64.AppImage")), "AppImage", "Portable build for most modern Linux desktops"),
        ]),
      },
      macos: {
        title: "Download OpenUsage for macOS",
        intro: "Choose the Mac chip type. The download starts immediately after selection.",
        options: compactOptions([
          toOption(findAsset(assets, (name) => name.endsWith("_aarch64.dmg")), "Apple Silicon", "For M1, M2, M3, and M4 Macs"),
          toOption(findAsset(assets, (name) => name.endsWith("_x64.dmg")), "Intel Mac", "For older x64 Intel Macs"),
        ]),
      },
    },
  }
}

export async function fetchLatestReleaseDownloadOptions(fetchImpl: typeof fetch = fetch): Promise<ReleaseDownloadOptions> {
  const response = await fetchImpl(latestReleaseUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub latest release request failed with ${response.status}`)
  }

  return buildReleaseDownloadOptions(await response.json() as GitHubRelease)
}
