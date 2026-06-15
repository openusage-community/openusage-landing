import { type MouseEvent, useEffect, useState } from "react"
import { AppPreview } from "./AppPreview"
import {
  type DownloadPlatform,
  type ReleaseDownloadOptions,
  fetchLatestReleaseDownloadOptions,
} from "./release-data"

const assetBaseUrl = import.meta.env.BASE_URL
const releasesUrl = "https://github.com/openusage-community/openusage/releases"

const features = [
  ["Capture", "Log usage as you work", "OpenUsage watches prompts, model calls, and subscription activity across your AI tools, then turns scattered activity into one calm daily ledger.", "Browser, desktop, and manual entries"],
  ["Understand", "See what actually helped", "Tag sessions by project, outcome, or mood. The timeline reveals which tools saved time, which created rework, and where your best ideas started.", "Project notes, outcomes, and time saved"],
  ["Control", "Set personal AI budgets", "Know when a free trial is about to renew, when token spend is creeping up, or when a cheaper workflow could do the same job.", "Renewal alerts and monthly caps"],
  ["Export", "Own your usage history", "Download clean CSV or Markdown summaries for taxes, client recaps, research journals, or simply remembering what worked last month.", "Portable history, no lock-in"],
]

const faqs = [
  ["Is OpenUsage another AI chat app?", "No. It is the personal usage layer for the AI tools you already use. The point is to reveal cost, value, and patterns across your existing workflow."],
  ["Do I need to connect every account?", "No. OpenUsage detects supported providers you already use and pulls their usage into the ledger automatically. Manual entries are only for anything outside the supported set."],
  ["Who is this for?", "Individuals who use several AI products: freelancers, students, creators, researchers, and operators who want a clearer view of what is worth keeping."],
  ["How private is the ledger?", "OpenUsage is designed around metadata first: tool, time, cost, tags, and outcome. Sensitive prompt text can be excluded or stored locally in future desktop mode."],
]

let activeScrollFrame = 0

function smoothScrollToElement(element: HTMLElement, onComplete?: () => void) {
  const startY = window.scrollY
  const targetY = startY + element.getBoundingClientRect().top
  const distance = targetY - startY
  const duration = 650
  const startTime = performance.now()

  if (activeScrollFrame) {
    cancelAnimationFrame(activeScrollFrame)
  }

  function animateScroll(now: number) {
    const progress = Math.min((now - startTime) / duration, 1)
    const easedProgress = 1 - Math.pow(1 - progress, 3)

    window.scrollTo(0, Math.round(startY + distance * easedProgress))

    if (progress < 1) {
      activeScrollFrame = requestAnimationFrame(animateScroll)
    } else {
      activeScrollFrame = 0
      onComplete?.()
    }
  }

  activeScrollFrame = requestAnimationFrame(animateScroll)
}

function setHashWithoutScrollJump(sectionId: string) {
  const currentX = window.scrollX
  const currentY = window.scrollY

  window.history.pushState(null, "", `#${sectionId}`)
  window.scrollTo(currentX, currentY)
}

function LogoMark() {
  return (
    <div className="logo" aria-label="OpenUsage">
      <img src={`${assetBaseUrl}references/logo1-2.png`} alt="OpenUsage logo" />
      <span>OpenUsage Community</span>
    </div>
  )
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: 8 }}>
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.33-3.76-1.33-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .1.92 2.43 3.16 1.72.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15.9-.25 1.85-.38 2.8-.38.95 0 1.9.13 2.8.38 2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.24-5.11 5.52.4.34.76 1.02.76 2.06v3.05c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  )
}

function PlatformLogo({ file, className }: { file: string; className: string }) {
  return <img className={`platform-logo ${className}`} src={`${assetBaseUrl}references/${file}`} alt="" aria-hidden="true" />
}

function DownloadModal({
  platform,
  release,
  releaseError,
  onClose,
}: {
  platform: DownloadPlatform
  release: ReleaseDownloadOptions | null
  releaseError: string | null
  onClose: () => void
}) {
  const config = release?.options[platform]
  const title = platform === "linux" ? "Download OpenUsage for Linux" : "Download OpenUsage for macOS"

  return (
    <div className="download-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="download-modal" role="dialog" aria-modal="true" aria-labelledby="download-modal-title" onClick={(event) => event.stopPropagation()}>
        <button className="download-modal-close" type="button" aria-label="Close download options" onClick={onClose}>×</button>
        <span className="kicker">{release ? `Latest release ${release.tag}` : "Loading latest release"}</span>
        <h2 id="download-modal-title">{config?.title ?? title}</h2>
        <p>{config?.intro ?? "Fetching the newest release from GitHub."}</p>
        {!release && !releaseError ? (
          <div className="download-options">
            <div className="download-option" aria-live="polite">
              <span>
                <strong>Checking GitHub</strong>
                <small>Release assets will appear here automatically.</small>
              </span>
              <em>Please wait</em>
            </div>
          </div>
        ) : releaseError || config?.options.length === 0 ? (
          <div className="download-options">
            <a className="download-option" href={releasesUrl}>
              <span>
                <strong>Open GitHub Releases</strong>
                <small>{releaseError ?? "No matching package was found for this platform in the latest release."}</small>
              </span>
              <em>Manual download</em>
            </a>
          </div>
        ) : (
          <div className="download-options">
            {config?.options.map((option) => (
              <a className="download-option" href={option.href} key={option.fileName} onClick={onClose}>
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
                <em>{option.fileName}</em>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [downloadPlatform, setDownloadPlatform] = useState<DownloadPlatform | null>(null)
  const [release, setRelease] = useState<ReleaseDownloadOptions | null>(null)
  const [releaseError, setReleaseError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    fetchLatestReleaseDownloadOptions()
      .then((latestRelease) => {
        if (isCancelled) {
          return
        }

        setRelease(latestRelease)
        setReleaseError(null)
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return
        }

        console.error(error)
        setReleaseError("Latest release data is unavailable right now.")
      })

    return () => {
      isCancelled = true
    }
  }, [])

  function refreshLatestRelease({ clearRelease = false } = {}) {
    if (clearRelease) {
      setRelease(null)
    }

    fetchLatestReleaseDownloadOptions()
      .then((latestRelease) => {
        setRelease(latestRelease)
        setReleaseError(null)
      })
      .catch((error: unknown) => {
        console.error(error)
        setReleaseError("Latest release data is unavailable right now.")
      })
  }

  function openDownloadModal(platform: DownloadPlatform) {
    setDownloadPlatform(platform)
    refreshLatestRelease({ clearRelease: true })
  }

  function handleSectionLinkClick(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
    const section = document.getElementById(sectionId)

    if (!section) {
      return
    }

    event.preventDefault()
    setIsMenuOpen(false)
    smoothScrollToElement(section, () => setHashWithoutScrollJump(sectionId))
  }

  return (
    <main className={isDark ? "theme-dark" : "theme-light"}>
      <div className="page">
        <nav className="nav" aria-label="Primary navigation">
          <LogoMark />
          <button className="menu-toggle" type="button" aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} aria-controls="primary-menu" onClick={() => setIsMenuOpen((current) => !current)}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <div id="primary-menu" className={isMenuOpen ? "nav-links is-open" : "nav-links"}>
            <a href="#features" onClick={(event) => handleSectionLinkClick(event, "features")}>Features</a>
            <a href="#platforms" onClick={(event) => handleSectionLinkClick(event, "platforms")}>Platforms</a>
            <a href="#proof" onClick={(event) => handleSectionLinkClick(event, "proof")}>Proof</a>
            <a href="#faq" onClick={(event) => handleSectionLinkClick(event, "faq")}>FAQ</a>
            <a className="mini-cta" href="#platforms" onClick={(event) => handleSectionLinkClick(event, "platforms")}>Download</a>
            <button className="theme-toggle" type="button" aria-pressed={isDark} onClick={() => setIsDark((current) => !current)}>
              <span className="dot" aria-hidden="true" />
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>
          </div>
        </nav>

        <header className="hero">
          <div className="hero-copy">
            <h1>Know which AI tools are worth keeping. <span className="tagline">Stop guessing.</span></h1>
            <p className="subhead">OpenUsage is a private command center for individuals using ChatGPT, Claude, Cursor, image models, and niche assistants. Track cost, time saved, renewals, and outcomes in one blue notebook for your AI life.</p>
            <div className="actions">
              <a className="btn primary" href="#platforms" onClick={(event) => handleSectionLinkClick(event, "platforms")}>Download for free</a>
              <a className="btn secondary" href="https://github.com/openusage-community/openusage" aria-label="Open OpenUsage on GitHub"><GithubIcon />Github</a>
            </div>
            <div className="trust-line" aria-label="Product highlights">
              <span>Live app preview</span>
              <span>Real provider layout</span>
              <span>Demo data included</span>
            </div>
          </div>
          <div className="visual">
            <AppPreview releaseTag={release?.tag} />
          </div>
        </header>

        <section id="features" aria-labelledby="features-title">
          <div className="section-head">
            <h2 id="features-title">A ledger for the AI you actually use.</h2>
            <p>Inspired by focused productivity tools, OpenUsage keeps the interface practical: one timeline, clear signals, no performative dashboards. Every entry answers: what did I use, what did it cost, and did it help?</p>
          </div>
          <div className="features">
            {features.map(([kicker, title, body, detail]) => (
              <article className="feature" key={title}>
                <span className="kicker">{kicker}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <small>{detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="platforms" aria-labelledby="platforms-title">
          <div className="section-head">
            <h2 id="platforms-title">Supported operating systems.</h2>
            <p>OpenUsage is designed as a desktop companion for personal AI work. Start on Linux or macOS today, with Windows support coming soon.</p>
          </div>
          <div className="platforms" aria-label="Supported operating systems">
            <button className="platform-card" type="button" onClick={() => openDownloadModal("linux")}>
              <PlatformLogo file="linux-tux-svgrepo-com.svg" className="platform-logo-linux" />
              <span className="platform-status">Available now</span>
              <h3>Linux</h3>
              <p>A focused desktop build for personal AI ledgers on Ubuntu, Fedora, Arch, and other modern distributions.</p>
            </button>
            <button className="platform-card" type="button" onClick={() => openDownloadModal("macos")}>
              <PlatformLogo file="apple-173-svgrepo-com-2.svg" className="platform-logo-macos" />
              <span className="platform-status">Available now</span>
              <h3>macOS</h3>
              <p>Native-feeling tracking for Mac workflows across research, writing, coding, and creative AI tools.</p>
            </button>
            <button className="platform-card coming" type="button" disabled>
              <PlatformLogo file="windows-logo.svg" className="platform-logo-windows" />
              <span className="platform-status">Coming soon</span>
              <h3>Windows</h3>
              <p>A Windows build is on the roadmap so the same free, open-source ledger can follow every desktop workflow.</p>
            </button>
          </div>
        </section>

        <section id="proof" aria-labelledby="proof-title">
          <div className="proof-band">
            <div>
              <h2 id="proof-title">OpenUsage Community is built in the open.</h2>
              <blockquote>Track the AI providers you already use, keep Linux support first-class, and own a desktop ledger that stays free to inspect, run, and improve.</blockquote>
            </div>
            <div className="proof-stats">
              <div><b>15+</b><span>providers supported across chat, coding, search, and creative AI tools</span></div>
              <div><b>Linux</b><span>first-class builds for AppImage, deb, and rpm workflows</span></div>
              <div><b>MIT</b><span>licensed so the code stays simple to inspect, fork, and reuse</span></div>
              <div><b>Open</b><span>source project with community-maintained releases and contributions</span></div>
            </div>
          </div>
        </section>

        <section id="pricing" aria-labelledby="pricing-title">
          <div className="pricing">
            <div className="price-copy">
              <span className="kicker">Free and open source</span>
              <h2 id="pricing-title">Use OpenUsage for free. Keep the code in the open.</h2>
              <p className="subhead" style={{ marginTop: 20 }}>OpenUsage is not another subscription to justify. The app is completely free and open source, so individuals can inspect how their AI usage ledger works, run it on their own terms, and contribute improvements back.</p>
              <div className="open-note" aria-label="Open source principles">
                <span>Free to use</span>
                <span>Source available</span>
                <span>No paid tier teaser</span>
              </div>
            </div>
            <div className="price-card">
              <span className="eyebrow">Open access</span>
              <div className="price"><strong>$0</strong><span>open source forever</span></div>
              <ul className="checks">
                <li>Track your AI tools and keep a personal usage history</li>
                <li>Renewal reminders and monthly spend summaries</li>
                <li>Review the source before trusting it with your workflow</li>
                <li>Export clean records without an upgrade prompt</li>
              </ul>
              <a className="btn primary" href="https://github.com/openusage-community/openusage">View the open-source project</a>
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-title">
          <div className="section-head">
            <h2 id="faq-title">Questions before you open the ledger?</h2>
            <p>OpenUsage is intentionally narrow: better awareness for individuals, without turning your personal AI habits into enterprise software.</p>
          </div>
          <div className="faq-grid">
            {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section id="origin" aria-labelledby="origin-title">
          <div className="origin-story">
            <div>
              <span className="kicker">Project origin</span>
              <h2 id="origin-title">Built on the original OpenUsage.</h2>
            </div>
            <div className="origin-copy">
              <p>OpenUsage Community is an independent, community-maintained continuation of the original OpenUsage project by Robin Ebers.</p>
              <p>This fork keeps the cross-platform Tauri direction alive, with stronger focus on Linux releases, working macOS builds, and provider contributions from the community.</p>
              <div className="origin-links" aria-label="Original project links">
                <a className="btn secondary" href="https://github.com/robinebers/openusage">Original OpenUsage</a>
                <a className="btn secondary" href="https://github.com/robinebers">Robin Ebers</a>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <LogoMark />
          <div className="footer-links" aria-label="Footer links">
            <a href="#features" onClick={(event) => handleSectionLinkClick(event, "features")}>Features</a>
            <a href="mailto:peterbaikov12@proton.me">Contact</a>
          </div>
          <span>© 2026 OpenUsage. Own your AI footprint.</span>
        </footer>
      </div>
      {downloadPlatform ? <DownloadModal platform={downloadPlatform} release={release} releaseError={releaseError} onClose={() => setDownloadPlatform(null)} /> : null}
    </main>
  )
}
