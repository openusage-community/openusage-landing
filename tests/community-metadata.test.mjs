import assert from "node:assert/strict"
import { test } from "node:test"
import { buildCommunityArticlePreview } from "../scripts/community-metadata.mjs"

const fixtureHtml = `
<!doctype html>
<html>
  <head>
    <title>Fallback title</title>
    <meta property="og:title" content="OpenUsage Review">
    <meta property="og:description" content="A useful review of OpenUsage.">
    <meta property="og:image" content="/images/openusage-card.png">
    <meta property="og:site_name" content="AI Notes">
    <meta property="article:published_time" content="2026-06-18T10:00:00.000Z">
  </head>
  <body></body>
</html>
`

test("buildCommunityArticlePreview extracts OpenGraph metadata and resolves images", () => {
  const preview = buildCommunityArticlePreview({
    entry: { url: "https://example.com/posts/openusage" },
    html: fixtureHtml,
  })

  assert.equal(preview.url, "https://example.com/posts/openusage")
  assert.equal(preview.title, "OpenUsage Review")
  assert.equal(preview.description, "A useful review of OpenUsage.")
  assert.equal(preview.image, "https://example.com/images/openusage-card.png")
  assert.equal(preview.source, "AI Notes")
  assert.equal(preview.publishedAt, "2026-06-18T10:00:00.000Z")
})

test("buildCommunityArticlePreview falls back to title and hostname", () => {
  const preview = buildCommunityArticlePreview({
    entry: { url: "https://blog.example.org/openusage" },
    html: "<html><head><title>Plain article</title></head></html>",
  })

  assert.equal(preview.title, "Plain article")
  assert.equal(preview.source, "blog.example.org")
  assert.equal(preview.description, "")
  assert.equal(preview.image, "")
})

test("buildCommunityArticlePreview preserves manual overrides", () => {
  const preview = buildCommunityArticlePreview({
    entry: {
      url: "https://example.com/posts/openusage",
      title: "Manual title",
      description: "Manual description",
      image: "https://cdn.example.com/manual.png",
      source: "Manual Source",
      publishedAt: "2026-06-19",
    },
    html: fixtureHtml,
  })

  assert.equal(preview.title, "Manual title")
  assert.equal(preview.description, "Manual description")
  assert.equal(preview.image, "https://cdn.example.com/manual.png")
  assert.equal(preview.source, "Manual Source")
  assert.equal(preview.publishedAt, "2026-06-19")
})
