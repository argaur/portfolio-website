# My Portfolio

## Why This Exists

Public portfolio for Gaurav Gupta. It shows PM and AI strategy work to founders, teams and recruiters. Positioning is freelance first, with a remote Senior PM role as the parallel track (2026-10-10).

**Success metric:** a visitor lands, moves through all 7 panels and every case-study and project page with no broken states, and each page reads as a polished, credible artifact.

> The email gate exists in code (`gate.js`) but is **disabled site-wide** (session 15), because it was blocking visitors. The `#gate` overlay starts with `gate-hidden` so it never flashes on load (2026-10-11). Do not re-enable without an explicit ask.

## Out of Scope (do not build unless explicitly asked)

- Any npm package, bundler, or build step. The site ships by opening files in a browser.
- Blog or writing section
- Contact form (social links are enough)
- Analytics **beyond anonymous pageviews**. `analytics.js` (PostHog, pageviews only) is in scope since session 18. Custom events, `identify()`, autocapture, session replay and trailer play tracking are not.
- RAG chatbot (separate project, not part of this repo)

## What this is
A personal portfolio website: plain HTML, CSS and vanilla JavaScript, no build step. **Tailwind is loaded via CDN at runtime** (`cdn.tailwindcss.com`, config inline in `index.html`), so new markup may use Tailwind utilities alongside the custom tokens. "No build step, opens in a browser" still holds. "No framework runtime" does **not**.

## Design: "Kinetic Precision" (v3, current)
- Dark theme by default, with a light-mode toggle on desktop (`#theme-toggle`, 768px and up). Kept and fixed in session 19.
- Tokens: `--bg-base: #0e0e12`, surfaces `#0c0d11 / #16161e / #1a1a22 / #242432`, `--border: #2a2a38`, text `#ece8e2` / `#9896a0` / `#56546e`, accent gold `--accent: #c9a84c` (`--accent-dim #8a6f2e`), `--green-signal: #4caf74` (live and verified dots only).
- Fonts: **Space Mono** (display, mono uppercase micro-labels) and **DM Sans** (body and UI).
- `--radius: 0px`. **No `border-radius` anywhere** on the main site.
- Strict 8px spacing grid. Gold is the single accent, used sparingly.
- `body.theme-light` lives in `index.html`'s embedded `<style>`. Light-mode accent text and borders use darkened gold `#6e5824`, because `#c9a84c` fails WCAG AA on cream.
- The retired v2 "Blueprint to Bits" system (Cormorant, navy/cream/terracotta) is gone. Any reference to it is stale.

## Navigation structure
- **Panel-based SPA.** `body` has `overflow: hidden`. Each section is a fixed-height panel switched by nav clicks.
- `activatePanel(panelId, updateHash)` is global. A delegated listener wires **every** `[data-panel="panel-X"]` element, so any in-page link with that attribute switches panels. Nav switchers are `<a href="#hash" data-panel>`. Hash routing works on load.
- **Mobile nav:** hamburger (`.nav-hamburger`) opens a full-screen overlay (`#nav-overlay`). ESC or a panel link closes it.
- **7 panels:** Home, Experience (Work was merged into it), Projects, Skills, Philosophy, Credentials, Contact. Hashes: `#home #experience #projects #skills #philosophy #credentials #contact`.
- `#panel-skills` and `#panel-philosophy` share the `.skill-block delay-N` class pattern. Always scope edits by `#panel-*`, never by class alone.

## Home and Contact
- **Hero:** "Two doors, freelance first". The left door is founders and teams (PRD-led product sprints), the right door is hiring (Senior PM, remote). Stats row below.
- **Motion:** `hero-motion.js` draws Plan to Product v2 on `#p2p-home` and `#p2p-contact`. It goes sketch, plan, floor-by-floor build, then SHIP and LIVE, with an in-frame "01 PROBLEM / 02 SYSTEM / 03 PRODUCT" strip. Contact restarts the story each time the panel opens. It pauses off-screen and in background tabs, and re-renders on theme change.
- **No reduced-motion skip on gentle motion.** Windows "Animation effects: off" sets `prefers-reduced-motion: reduce`, and a skip froze the hero twice (2026-06-04, 2026-10-11). Test with Playwright `reduced_motion='reduce'` and expect the animation to play.

## Projects panel
- A domain tile grid (`#proj-grid`, `.proj-tile`) with filter chips and a summary computed into `#proj-summary`. **15 projects across 11 domains**, plus 2 career tiles (JindalX, architecture).
- The first featured tile is kicker "JindalX", title "Talent Management Suite", linking to `case-study-jindalx-talent.html`.
- Modal data lives in `V3_PROJECTS` in `index.html`, keyed `cs-1` to `cs-6` and `pp-0` to `pp-8`. `cs-0` (Rethink CRM) was removed on 2026-10-11.

## Tech constraints
- Plain HTML, CSS and vanilla JavaScript. External runtime deps: **Tailwind CDN** and the **Supabase JS client**, both via CDN. No npm, no bundler, no build.
- The site must work by opening `index.html` in a browser.

## File structure
- `index.html`: the 7-panel SPA, modal overlay and mobile nav overlay. Most JS is inline: panel switching, progressive reveal, experience accordion, project tiles and filters, unified item modal, `V3_PROJECTS`.
- `hero-motion.js`: the Home and Contact canvas (see above). Replaced `plan-to-product.js`, which is deleted.
- `styles.css`: **dead file**. No page loads it since the v3 rebuild. It is in `.vercelignore`.
- `services.html`: the Services page, two equal tracks (workflow automation, AI product sprint), **no prices**. Linked from the founders door on Home. Self-contained, Kinetic Precision tokens.
- `builds.html` and `builds/<slug>/`: two-day demo builds (added 2026-10-17). Each build is a self-contained folder that loads `/analytics.js` and adds `posthog.register({ build: '<slug>' })`. The process and queue live in `Documents\Projects\builds`, not here. `builds.html` is **not linked anywhere until build 1 ships**, because an empty page would be a broken state.
- `404.html`, `sitemap.xml`, `robots.txt`, `assets/og.jpg` (1200x630 share image, used by every page's `og:image`).
- `trailer.js`: renders each page's `#showcase` (see Trailers).
- `nav-hint.js`: fades the right edge of the case-page mobile nav strip while more links are off-screen. Loaded by all 16 case and project pages.
- `gate.js`: email-gate logic, **loaded but short-circuited**. Do not edit without an ask.
- `analytics.js`: PostHog loader, **pageviews only**. Loaded by all 19 public pages (`index`, `services`, 8 `case-study-*`, 8 `project-*`, `g-os`). Reports into the shared "Web Fleet" PostHog project with super-property `project: 'portfolio-website'`, which is how the fleet dashboard separates sites. Skips localhost and `file://`. The `phc_` token is a public client key, meant to ship in the page.
- `vercel.json`: redirects and security headers (CSP is report-only). `/case-study-founder-crm.html` (and the extensionless path) go to `case-study-siteline.html#origin`, and the old `assets/` resume path goes to `/GauravGupta_Resume_2026.pdf`, all permanent 308. Published URLs are never allowed to 404.
- `assets/trailers/<slug>.mp4` and `.jpg`: trailer clips and posters.
- `app.js`: **dead file**, not referenced. `tabs.js`: empty stub. `favicon.svg`: GG monogram.
- `case-study.css` was deleted in session 17. Every case and project page is self-contained.
- `.vercelignore` keeps internal files out of the deployment, so they 404 on gauravg.dev: this file, `PORTFOLIO_PLAN.md`, `README.md`, `NEEDS-YOU.md`, `app.js`, `tabs.js`, `playwright-audit.js`, `.archive/`, `collab-runs/`, `_tmp/`, `styles.css`, `photo.jpg`, the old `assets/` resume, `AGENTS.md`, `GEMINI.md`. Add any new internal file there. Keep `prd-templates/`, because `g-os.html` fetches it.
- `NEEDS-YOU.md`, `_tmp/` and `collab-runs/` are working files. Never commit `NEEDS-YOU.md`. `_tmp/` is gitignored.

## Case-study and project pages: per-product design skins
Every page follows the **`case-study-siteline.html` pattern**: one continuous scroll page with a fixed top nav whose `.nav-link` anchors jump to sections (scrollspy-highlighted). Each page **wears its own product's design language** (self-contained `:root` tokens and fonts), single theme, no toggle.

Shared scaffold: fixed `nav` (`.nav-back`, `.nav-link` anchors, `.nav-index`), then `.hero-wrap>.hero` (two-tone `<h1>` with muted `<em>`), an At a glance block, the `#showcase` trailer section, `#documentation` (`.docs-tabs` plus inline SVG `.docs-panel`), then id'd `.sec` blocks, then `footer`. Components: `.label`, `.sec`/`.sec-head`, `.prose`, `.callout`, `.stats`/`.stat`, `.cards`/`.card`, `.table-wrap`+`table`, `.two-col`, `.lnk`, `.meta-row`/`.meta-tag`. Under 580px, `.nav-right` scrolls sideways. Verify with Playwright and `python -m http.server`: overflow at 320, 390 and 768, `page.on('pageerror')`. Use `C:\Python313\python.exe -X utf8`, because the default `python` lacks Playwright.

**8 case studies:**

| # | Product | Page | Skin | Live / source |
|---|---------|------|------|---------------|
| 02 | Blinkit Command Hub | case-study-blinkit.html | dark ops-room, Mulish, yellow and green | blinkit-command-hub.vercel.app, picker-blinkit-app.lovable.app |
| 03 | YouTube 2.0 (concept) | case-study-youtube.html | dark, Roboto, red for CTA | 3 Lovable prototypes and Claude artifacts |
| 04 | Trivo (group travel) | case-study-group-travel.html | light cream, Fraunces, pink/coral/lilac | trivo.gauravg.dev, gh argaur/group-travel-pwa |
| 05 | Vitae | case-study-vitae.html | light, Plus Jakarta, clinical blue-white (template) | vitaehealth.vercel.app, gh argaur/vitae |
| 06 | Personal AI Assistant (archived) | case-study-personal-ai-assistant.html | dark terminal, JetBrains Mono, green | gh argaur/personal-ai-assistant |
| 07 | SitelineCRM | case-study-siteline.html | light, Manrope, no accent (the reference) | siteline.gauravg.dev, gh argaur/siteline-crm |
| 08 | Vittam | case-study-vittam.html | light, DM Serif Display | finance.gauravg.dev |
| none | JindalX Talent Management Suite | case-study-jindalx-talent.html | light, Work Sans | private, enterprise |

Siteline's `#origin` section ("08, Where it started") holds Rethink CRM as v0, merged on 2026-10-11. Number 01 is no longer used. JindalX claims must trace to `G:\My Drive\Career\micro1-pm-po-ats-story.md`. Never name micro1 or its client.

**8 project pages:** `project-pm-pathfinder.html` (dark indigo, Space Grotesk, soft corners), `project-ai-humancap-sim.html` (light warm, Source Serif, ochre/sage), `project-homelab.html` (dark, JetBrains Mono), `project-portfolio.html` (dark, Space Mono, 0px, gold), `project-gws-cli.html` (dark terminal, Roboto Mono, Google colors), `project-life-os.html` (dark, DM Sans, mint), `project-gst-notice.html` (light cream, Source Serif, navy), `project-rulecard.html` (light/dark auto, IBM Plex, navy; live at rulecard.gauravg.dev).

`case-study-vitae.html` is the **golden template**. For a rebuild or a new page, copy its scaffold and enhancement code, then swap only `:root` and fonts.

## Trailers
- `#showcase` on each page picks, in order: `data-src` (an mp4 in `assets/trailers/`), then `data-embed` (YouTube, Vimeo, Loom or Drive only), then an `<ol class="trailer-slides">` reel, then `?trailer=preview`. With none, the section stays hidden.
- **Trailers film the real live product, never slides or mockups.** Slide reels are only for products with no public platform.
- **Video (8):** Blinkit, Notice Explained, AI vs Human Capital, YouTube 2.0, this site, Vittam, PM Pathfinder, RuleCard.
- **Slide reels (5):** JindalX, Personal AI Assistant, life-os, Homelab, GWS CLI.
- **None yet (3):** Siteline, Trivo and Vitae are unwired until test accounts exist. Landing-page-only footage was rejected.
- Reels autoplay under reduced motion, with no transition. No play tracking.
- Record with Playwright behind a guard that blocks every POST, PUT, PATCH and DELETE. Never sign up, log in with real credentials or write data on a live product. life-os is never filmed against real data.

## Supabase integration
- Client loaded via CDN (`@supabase/supabase-js@2`). Project `nvwjekhguijinfuylytl.supabase.co`, table `subscribers(email text)`, anon key in `gate.js` (insert only, RLS on). Gate flow is disabled.

## About me
- Gaurav Gupta, Senior Product Manager and AI Strategist, Jaipur, India.

---

## Project conventions
- For a page rebuild or a new page, copy the Vitae template. Pages are self-contained, so page work does not conflict across files.
- Public copy must trace to a sourced facts document. Unconfirmed claims stay off the site.
- No em-dashes in visible copy.

---

## Deploy

**Deploy target:** Vercel, project `argaurs-projects/portfolio-website`, ID `prj_rc841Ix97qlakTS5D6kmgLifE7mX`, org `team_3VVVuqz6VHXjBQCANdWIY7OF`. Runtime is **static** (`framework: null`, no build, no functions). `vercel.json` holds redirects and headers only. Deploys automatically on push to `main`. Live URL `gauravg.dev`. The old `gauravg-portfolio.vercel.app` domain serves the same deployment.

## Status

- **State:** live on `main` (2026-10-15, career dates verified against employment documents). 7 panels, 15 projects, 8 case studies, 8 project pages, plus `services.html`. Session history lives in `memory/session-*.md`, not here.
- **Last session, 2026-10-12:**
  - Review backlog batch (`fc7f5f2`): hero pause control, nav-hint on both edges, six case pages fixed for a11y, sourcing and disclaimers, sitemap, 404, share image, redirects.
  - Services page published (`c4bfb56`): two tracks, no prices, proof is `/#projects`.
  - Resume softened, then swapped for the approved Oct 2026 version (`3e305dd`). The site is the single source of truth for resume claims.
- **Previous, 2026-10-11:** hero motion as `hero-motion.js`, Rethink CRM merged into Siteline, live-product trailers (`6124d38`).
- **Open (see `NEEDS-YOU.md`):**
  - Test accounts for the Siteline, Trivo and Vitae trailers.
  - A life-os demo mode, or keep its reel.
  - Bugs in other repos: Blinkit check-in never ticks, the RuleCard page shows PLACEHOLDER text.
- **Also open:**
  - Confirm Vitae's "Rethink AI-First Buildathon, 3rd place" and Trivo's anonymized quote labels.
  - Siteline says the bot runs on Railway. Update it when the bot moves.
  - Taccomacco "6 months" claim.
  - Graduate the "Now Building" chips (RAS Prep, learning-hub) as they ship.
  - Google Analytics cert has no verify link.
  - Sync `g-os.html` from a Claude Optimisation session.
- **Career dates (2026-10-16, replaces 2026-10-15):** JindalX is one entry with its progression: Product Manager to Senior Product Manager, Digital Transformation, Jul 2022 to May 2025. Joined as PM Jul 2022, promoted Apr 2024, employee to Jan 2025, retained as a consultant Feb to May 2025. Never imply Senior PM since 2022. Rethink Product Consultant carries no delivery claim; personal builds stay under Independent. OneValley Sep 2020 to May 2022. Proof lives in `G:\My Drive\Career\Employment Records\README.md`. Change a date only after its document is there.
- **Last updated:** 2026-10-15

## Model notes
**This section expires. Review it at every model launch and every Claude Code version bump.**
Current as of 2026-08-05: Opus 5 / Sonnet 5 / Fable 5, Claude Code 2.1.222.
Re-checked 2026-08-07 by `Claude Optimisation/scripts/claude-md-eval.sh`, after five
contract-drift rules were added to it. Clean on that run.
- Delegation is not automatic. Claude Code 2.1.219 and later suppress subagents on Opus 5 unless
  the user asks for one, so name the agent when you want it.
- Do not add verification, anti-laziness or hedging instructions. These models self-verify, are
  direct by default, and obey a hedge literally by reporting less.
- Reasoning: `Claude Optimisation/docs/setup-versions/artifacts/2026-08-05-model5-migration/`.
