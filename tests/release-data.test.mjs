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

const { buildReleaseDownloadOptions } = await import(`../${outDir}/release-data.js`)

test("builds download options from latest GitHub release assets", () => {
  const release = buildReleaseDownloadOptions({
    tag_name: "v0.7.0",
    html_url: "https://github.com/openusage-community/openusage/releases/tag/v0.7.0",
    assets: [
      { name: "OpenUsage_0.7.0_amd64.deb", browser_download_url: "https://example.com/deb" },
      { name: "OpenUsage-0.7.0-1.x86_64.rpm", browser_download_url: "https://example.com/rpm" },
      { name: "OpenUsage_0.7.0_amd64.AppImage", browser_download_url: "https://example.com/appimage" },
      { name: "OpenUsage_0.7.0_aarch64.dmg", browser_download_url: "https://example.com/silicon" },
      { name: "OpenUsage_0.7.0_x64.dmg", browser_download_url: "https://example.com/intel" },
    ],
  })

  assert.equal(release.tag, "v0.7.0")
  assert.equal(release.options.linux.options[0].fileName, "OpenUsage_0.7.0_amd64.deb")
  assert.equal(release.options.linux.options[0].href, "https://example.com/deb")
  assert.equal(release.options.linux.options[1].fileName, "OpenUsage-0.7.0-1.x86_64.rpm")
  assert.equal(release.options.linux.options[2].fileName, "OpenUsage_0.7.0_amd64.AppImage")
  assert.equal(release.options.macos.options[0].fileName, "OpenUsage_0.7.0_aarch64.dmg")
  assert.equal(release.options.macos.options[1].fileName, "OpenUsage_0.7.0_x64.dmg")
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
})
