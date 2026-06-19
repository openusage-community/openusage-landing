import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import {
  buildCommunityArticlePreview,
  buildFallbackCommunityArticlePreview,
} from "./community-metadata.mjs"

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sourcePath = resolve(rootDir, "src/community-articles.json")
const generatedPath = resolve(rootDir, "src/generated/community-article-previews.json")

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"))
  } catch (error) {
    if (error?.code === "ENOENT") {
      return fallback
    }

    throw error
  }
}

function validateEntry(entry, index) {
  if (!entry || typeof entry !== "object" || typeof entry.url !== "string" || entry.url.trim() === "") {
    throw new Error(`Community article at index ${index} must include a url string.`)
  }

  return {
    ...entry,
    url: entry.url.trim(),
  }
}

async function fetchArticleHtml(url) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "OpenUsage landing metadata updater (+https://github.com/openusage-community/openusage-landing)",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

export async function updateCommunityArticles({
  readPath = sourcePath,
  writePath = generatedPath,
} = {}) {
  const sourceEntries = await readJson(readPath, [])
  const existingPreviews = await readJson(writePath, [])

  if (!Array.isArray(sourceEntries)) {
    throw new Error("src/community-articles.json must contain an array.")
  }

  if (!Array.isArray(existingPreviews)) {
    throw new Error("src/generated/community-article-previews.json must contain an array.")
  }

  const existingByUrl = new Map(existingPreviews.map((preview) => [preview.url, preview]))
  const previews = []

  for (const [index, rawEntry] of sourceEntries.entries()) {
    const entry = validateEntry(rawEntry, index)
    const existingPreview = existingByUrl.get(entry.url)

    try {
      const html = await fetchArticleHtml(entry.url)
      previews.push(buildCommunityArticlePreview({ entry, html, existingPreview }))
    } catch (error) {
      console.error(error)
      previews.push(buildFallbackCommunityArticlePreview(entry, existingPreview))
    }
  }

  await mkdir(dirname(writePath), { recursive: true })
  await writeFile(writePath, `${JSON.stringify(previews, null, 2)}\n`)

  return previews
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await updateCommunityArticles()
}
