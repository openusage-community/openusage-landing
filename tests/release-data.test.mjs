import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync } from "node:fs"
import { test } from "node:test"

const outDir = ".tmp-tests/release-data"

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true })
}

execFileSync("npx", [
  "tsc",
  "src/release-data.ts",
  "--ignoreConfig",
  "--outDir",
  outDir,
  "--module",
  "NodeNext",
  "--moduleResolution",
  "NodeNext",
  "--target",
  "ES2022",
  "--strict",
  "--skipLibCheck",
], { stdio: "inherit" })

const { buildReleaseDownloadOptions, fetchLatestReleaseDownloadOptions } = await import(`../${outDir}/release-data.js`)

test("builds download options from latest GitHub release assets", () => {
  const release = buildReleaseDownloadOptions({
    tag_name: "v0.7.0",
    html_url: "https://github.com/openusage-community/openusage/releases/tag/v0.7.0",
    assets: [
      { name: "OpenUsage_0.7.0_amd64.deb", browser_download_url: "https://example.com/deb" },
      { name: "OpenUsage-0.7.0-1.x86_64.rpm", browser_download_url: "https://example.com/rpm" },
      { name: "OpenUsage_0.7.0_amd64.AppImage", browser_download_url: "https://example.com/appimage" },
      { name: "OpenUsage_0.7.0_x64-setup.exe", browser_download_url: "https://example.com/windows-exe" },
      { name: "OpenUsage_0.7.0_x64_en-US.msi", browser_download_url: "https://example.com/windows-msi" },
      { name: "openusage_0.7.0_windows_amd64.zip", browser_download_url: "https://example.com/windows-zip" },
    ],
  })

  assert.equal(release.tag, "v0.7.0")
  assert.equal(release.options.linux.options[0].fileName, "OpenUsage_0.7.0_amd64.deb")
  assert.equal(release.options.linux.options[0].href, "https://example.com/deb")
  assert.equal(release.options.linux.options[1].fileName, "OpenUsage-0.7.0-1.x86_64.rpm")
  assert.equal(release.options.linux.options[2].fileName, "OpenUsage_0.7.0_amd64.AppImage")
  assert.equal(release.options.macos.title, "Download OpenUsage for macOS")
  assert.match(release.options.macos.intro, /Homebrew/)
  assert.equal(release.options.macos.options.length, 0)
  assert.equal(release.options.windows.options[0].href, "https://example.com/windows-exe")
  assert.equal(release.options.windows.options[1].href, "https://example.com/windows-msi")
  assert.equal(release.options.windows.options[2].href, "https://example.com/windows-zip")
})

test("omits missing package options instead of inventing URLs", () => {
  const release = buildReleaseDownloadOptions({
    tag_name: "v0.7.1",
    assets: [
      { name: "OpenUsage_0.7.1_amd64.deb", browser_download_url: "https://example.com/deb" },
    ],
  })

  assert.equal(release.options.linux.options.length, 1)
  assert.equal(release.options.macos.options.length, 0)
  assert.equal(release.options.windows.options.length, 0)
})

test("fetches latest release without browser cache", async () => {
  const calls = []
  const release = await fetchLatestReleaseDownloadOptions(async (url, init) => {
    calls.push({ url, init })

    return {
      ok: true,
      json: async () => ({
        tag_name: "v0.7.2",
        assets: [],
      }),
    }
  })

  assert.equal(release.tag, "v0.7.2")
  assert.equal(calls[0].init.cache, "no-store")
  assert.equal(calls[0].init.headers.Accept, "application/vnd.github+json")
})
