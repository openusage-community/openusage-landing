# Windows release downloads

## Goal

Make the Windows platform card available and let visitors choose the Windows
installer supplied by the latest public OpenUsage GitHub Release.

## Scope

- Extend the existing release-download model with a `windows` platform.
- Detect the three Windows artifacts published by the release pipeline:
  NSIS `.exe`, `.msi`, and portable `_windows_amd64.zip`.
- Reuse the existing download modal and its fallback to GitHub Releases when
  an asset is not available.
- Change the Windows platform card from disabled "Coming soon" to an active
  download entry point.

## Non-goals

- Change the Linux or macOS download behavior.
- Link to GitHub Actions artifacts, which may require authentication or expire.
- Publish or modify release assets in the OpenUsage application repository.

## Data flow and failure behavior

On page load and when the modal opens, the site requests the latest GitHub
Release. `release-data.ts` maps only matching, published assets into download
options. The existing modal renders those options. If the request fails or the
release has no matching Windows assets, it links visitors to GitHub Releases
instead of inventing a URL.

## Verification

Unit tests cover mapping all Windows package types and omitting unavailable
assets. The existing release-data tests and the production build must pass.
