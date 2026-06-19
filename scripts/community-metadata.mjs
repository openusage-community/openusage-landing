import * as cheerio from "cheerio"

function getMetaContent($, selectors) {
  for (const selector of selectors) {
    const value = $(selector).attr("content")?.trim()
    if (value) return value
  }
  return ""
}

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function resolveUrl(value, baseUrl) {
  if (!value) return ""
  try {
    return new URL(value, baseUrl).toString()
  } catch {
    return ""
  }
}

function cleanText(value) {
  return value?.replace(/\s+/g, " ").trim() ?? ""
}

export function buildCommunityArticlePreview({ entry, html, existingPreview }) {
  const $ = cheerio.load(html)
  const title = cleanText(
    entry.title
      ?? getMetaContent($, [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
        'meta[name="title"]',
      ])
      ?? ""
  ) || cleanText($("title").first().text()) || existingPreview?.title || entry.url
  const description = cleanText(
    entry.description
      ?? getMetaContent($, [
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[name="description"]',
      ])
      ?? existingPreview?.description
      ?? ""
  )
  const image = resolveUrl(
    entry.image
      ?? getMetaContent($, [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
        'meta[property="og:image:url"]',
      ])
      ?? existingPreview?.image
      ?? "",
    entry.url
  )
  const source = cleanText(
    entry.source
      ?? getMetaContent($, [
        'meta[property="og:site_name"]',
        'meta[name="application-name"]',
      ])
      ?? existingPreview?.source
      ?? ""
  ) || getHostname(entry.url)
  const publishedAt = cleanText(
    entry.publishedAt
      ?? getMetaContent($, [
        'meta[property="article:published_time"]',
        'meta[name="date"]',
        'meta[name="publish_date"]',
      ])
      ?? existingPreview?.publishedAt
      ?? ""
  )

  return {
    url: entry.url,
    title,
    description,
    image,
    source,
    publishedAt,
  }
}

export function buildFallbackCommunityArticlePreview(entry, existingPreview) {
  return {
    url: entry.url,
    title: cleanText(entry.title ?? existingPreview?.title ?? entry.url),
    description: cleanText(entry.description ?? existingPreview?.description ?? ""),
    image: resolveUrl(entry.image ?? existingPreview?.image ?? "", entry.url),
    source: cleanText(entry.source ?? existingPreview?.source ?? "") || getHostname(entry.url),
    publishedAt: cleanText(entry.publishedAt ?? existingPreview?.publishedAt ?? ""),
  }
}
