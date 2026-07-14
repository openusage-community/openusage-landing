# Windows Release Downloads Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Windows platform card list published Windows installer choices from the latest public OpenUsage release.

**Architecture:** Extend the existing release-download data model so it maps matching Windows assets into the same `DownloadOption` contract used by Linux. The existing modal renders the platform configuration unchanged; the Windows card only opens that modal.

**Tech Stack:** React 19, TypeScript, Vite, Node test runner.

## Global Constraints

- Use only assets published on the public GitHub Release; never GitHub Actions artifacts.
- Recognize NSIS `.exe`, `.msi`, and portable `_windows_amd64.zip` packages.
- Preserve Linux and macOS download behavior.
- Preserve the existing GitHub Releases fallback when matching assets are absent.

---

### Task 1: Map Windows release assets

**Files:**
- Modify: `tests/release-data.test.mjs`
- Modify: `src/release-data.ts`

**Interfaces:**
- Consumes: `buildReleaseDownloadOptions(release: GitHubRelease)`.
- Produces: `release.options.windows: PlatformDownloadOptions` containing zero to three `DownloadOption` values.

- [ ] **Step 1: Write the failing test**

Add Windows assets to the first `buildReleaseDownloadOptions` fixture and assert all three results:

```js
{ name: "OpenUsage_0.7.0_x64-setup.exe", browser_download_url: "https://example.com/windows-exe" },
{ name: "OpenUsage_0.7.0_x64_en-US.msi", browser_download_url: "https://example.com/windows-msi" },
{ name: "openusage_0.7.0_windows_amd64.zip", browser_download_url: "https://example.com/windows-zip" },

assert.equal(release.options.windows.options[0].href, "https://example.com/windows-exe")
assert.equal(release.options.windows.options[1].href, "https://example.com/windows-msi")
assert.equal(release.options.windows.options[2].href, "https://example.com/windows-zip")
```

Add an assertion in the missing-package fixture:

```js
assert.equal(release.options.windows.options.length, 0)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern "builds download options"`

Expected: FAIL because `release.options.windows` does not exist.

- [ ] **Step 3: Write minimal implementation**

Extend the platform union and return configuration:

```ts
export type DownloadPlatform = "linux" | "macos" | "windows"

windows: {
  title: "Download OpenUsage for Windows",
  intro: "Choose the installer that fits your Windows environment.",
  options: compactOptions([
    toOption(findAsset(assets, (name) => name.endsWith(".exe")), "Windows installer", "Recommended for most Windows PCs"),
    toOption(findAsset(assets, (name) => name.endsWith(".msi")), "MSI installer", "Best for managed or enterprise Windows devices"),
    toOption(findAsset(assets, (name) => name.endsWith("_windows_amd64.zip")), "Portable ZIP", "Run without installing"),
  ]),
},
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`

Expected: all release-data tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/release-data.ts tests/release-data.test.mjs
git commit -m "feat: add Windows release downloads"
```

### Task 2: Activate the Windows platform card

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `DownloadPlatform` including `"windows"` and `release.options.windows`.
- Produces: an enabled Windows card that calls `openDownloadModal("windows")`.

- [ ] **Step 1: Update the modal platform logic**

Replace the Linux/macOS-only title selection with the generic release config for non-macOS platforms:

```tsx
const isMacOs = platform === "macos"
const fallbackTitle = `Download OpenUsage for ${platform === "windows" ? "Windows" : "Linux"}`
const modalTitle = isMacOs ? "Download OpenUsage for macOS" : config?.title ?? fallbackTitle
```

- [ ] **Step 2: Enable the Windows card**

Replace the disabled card markup:

```tsx
<button className="platform-card" type="button" onClick={() => openDownloadModal("windows")}>
  <PlatformLogo file="windows-logo.svg" className="platform-logo-windows" />
  <span className="platform-status">Available now</span>
  <h3>Windows</h3>
  <p>Choose an installer for Windows to start tracking your AI usage locally.</p>
</button>
```

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: TypeScript compilation and Vite production build finish with exit code 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: enable Windows downloads"
```

### Task 3: Final verification and publish

**Files:**
- Verify: `src/release-data.ts`
- Verify: `src/App.tsx`
- Verify: `tests/release-data.test.mjs`

- [ ] **Step 1: Verify the full automated suite**

Run: `npm test && npm run build`

Expected: tests pass and build exits 0.

- [ ] **Step 2: Inspect the intended diff**

Run: `git diff origin/main...HEAD -- src/release-data.ts src/App.tsx tests/release-data.test.mjs docs/superpowers`

Expected: only the Windows release mapping, enabled card, tests, design, and plan are present.

- [ ] **Step 3: Push the commits**

Run: `git push origin main`

Expected: remote `main` is updated with the design, plan, and implementation commits.
