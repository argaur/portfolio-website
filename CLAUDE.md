# My Portfolio

## Why This Exists

Public portfolio for Gaurav Gupta — demonstrates PM + AI strategy work to recruiters and collaborators.

**Success metric:** Visitor lands, navigates all 8 panels + every case-study / project page with no broken states, and each build-record page reads as a polished, credible artifact.

> The email gate exists in code (`gate.js`) but is **disabled site-wide** (session 15) — it was blocking visitors. Do not re-enable without an explicit ask.

## Out of Scope (do not build unless explicitly asked)

- Any npm package, bundler, or build step — the site ships by opening files in a browser
- Blog or writing section
- Contact form (social links are sufficient)
- Analytics **beyond anonymous pageviews** — `analytics.js` (PostHog, pageviews only) is in scope as of session 18; custom events, `identify()`, autocapture, and session replay are not. Depth changes need an explicit ask.
- RAG chatbot (separate project, not part of this repo)

## What this is
A personal portfolio website — plain HTML + CSS + vanilla JavaScript, no build step. **Tailwind is loaded via CDN at runtime** (`cdn.tailwindcss.com`, config inline in `index.html`) — new markup may use Tailwind utilities alongside the custom tokens. "No build step / opens in a browser" still holds; "no framework runtime" does **not**.

## Design — "Kinetic Precision" (v3, current)
- Dark theme, single mode (no light/dark toggle on the main site)
- Design tokens: `--bg-base: #0e0e12`, tonal surfaces `#0c0d11 / #16161e / #1a1a22 / #242432`, `--border: #2a2a38`, text `#ece8e2` / `#9896a0` / `#56546e`, accent gold `--accent: #c9a84c` (`--accent-dim #8a6f2e`), `--green-signal: #4caf74` (verified/live dots only)
- Fonts: **Space Mono** (display / mono uppercase micro-labels) + **DM Sans** (body/UI). Google Fonts loads Space Mono + DM Sans.
- `--radius: 0px` — **no `border-radius` anywhere** (architectural principle)
- Strict 8px spacing grid; gold used sparingly as the single accent
- `body.theme-light` variant exists in `styles.css` (cream `#f2ede8`) but the toggle is not exposed on the main site
- (The retired **v2 "Blueprint to Bits"** system — Cormorant, navy/cream/terracotta `#0b1628 / #f7f3ee / #bf5c3a` — is fully gone from the live site. If you see it referenced anywhere, it's stale.)

## Navigation structure
- **Panel-based SPA** — `body` has `overflow: hidden`; each section is a fixed-height panel switched by nav clicks. Nav is solid `#0e0e12`.
- `activatePanel(panelId, updateHash)` is global; a delegated listener wires **every** `[data-panel="panel-X"]` element at `DOMContentLoaded`, so any in-page button with that attribute switches panels. `.nav-link` drives the active-underline state. Hash routing on load (`#work` → `panel-work`, etc.).
- **Mobile nav**: hamburger (`.nav-hamburger`) → full-screen overlay (`#nav-overlay`) with numbered links; ESC or a panel link closes it.
- 8 panels: **Home · Experience · Work · Projects · Skills · Philosophy · Credentials · Contact** (hashes `#home #experience #work #projects #skills #philosophy #credentials #contact`).
- ⚠ `#panel-skills` and `#panel-philosophy` share the `.skill-block delay-N` class pattern — always scope edits by `#panel-*`, never by class alone.

## Tech constraints
- Plain HTML + CSS + vanilla JavaScript. External runtime deps: **Tailwind CDN** + **Supabase JS client** (both via CDN). No npm, no bundler, no build.
- The site must work by opening `index.html` in a browser.

## File structure
- `index.html` — 8-panel SPA + modal overlay + mobile nav overlay. **All JS is inline** here (there is no `<script src="app.js">`). Contains: panel switching, progressive reveal, mobile overlay nav, experience accordion, `initSystemsCanvas()` (hero canvas), `initContactCanvas()`, work project modal (7-part narrative for JindalX), unified item modal, and the `V3_PROJECTS` object keyed `cs-N` / `pp-N`.
- `styles.css` — the "Kinetic Precision" design system (panel layout, hero, philosophy grid, modal narrative, progressive reveal, canvas utilities, responsive). Applies to `index.html` only.
- `app.js` — **dead file, not referenced** by `index.html` (JS went inline). Safe to ignore/remove.
- `tabs.js` — empty stub.
- `gate.js` — email-gate logic (Supabase insert + localStorage bypass). **Loaded but short-circuited (disabled).** Do not edit without an ask.
- `analytics.js` — PostHog loader, **pageviews only**. Loaded by all 14 public pages (`index` + 7 `case-study-*` + 5 `project-*` + `g-os`). Reports into the shared "Web Fleet" PostHog project with a registered super-property `project: 'portfolio-website'` — that slug, not `$host`, is how the fleet dashboard separates sites. Skips localhost/`file://`. `autocapture: false`, no `identify()`, so the data stays anonymous and needs no consent banner. The `phc_` token is a public-by-design client ingest key; it is meant to ship in the page.
- `favicon.svg` — geometric GG monogram.
- **`case-study.css` was deleted (session 17).** Every case-study and project page is now fully **self-contained** (own inline `<style>`, own font links). Nothing references it.

## Case-study & project pages — per-product design skins (v3.1, session 17)
Every case-study and project page follows the **`case-study-siteline.html` pattern**: one continuous scroll page with a fixed top nav whose `.nav-link` anchors jump to sections (scrollspy-highlighted), **not** the old paginated `.cs-page` model. Each page **drops the shared stylesheet and wears its own product's design language** (self-contained `:root` tokens + fonts).

Shared scaffold per page: fixed `nav` (`.nav-back` / `.nav-link` anchors / `.nav-index`) → `.hero-wrap>.hero` (two-tone `<h1>` with muted `<em>`) → `#documentation .sec` (`.docs-tabs` + inline SVG `.docs-panel[data-panel]` + external links) → Overview → N id'd `.sec` blocks → `footer`. Component classes: `.label`, `.sec`/`.sec-head`, `.prose`, `.callout`/`.callout-box`, `.stats`/`.stat`, `.cards`/`.card`, `.table-wrap`+`table`, `.two-col`, `.lnk`, `.meta-row`/`.meta-tag`, docs-tabs/panel. Enhancements over the raw reference: IntersectionObserver scrollspy (`.nav-link--active`), `scroll-margin-top`, and a mobile horizontal nav strip (`.nav-right` scrolls under 580px instead of hiding). Single-theme per page — no toggle. Verify with the pattern in `memory/project_session_state.md` (Playwright, `python -m http.server`, overflow at 320/390/768, `page.on('pageerror')`).

**7 case studies** (self-contained, numbered via `.nav-index`):

| # | Product | Page | Skin | Live / source |
|---|---------|------|------|---------------|
| 01 | Founder / Rethink CRM | case-study-founder-crm.html | dark amber · Cormorant + Outfit + DM Mono | argaur.github.io/founder-crm-landing · gh argaur/founder-crm-bot |
| 02 | Blinkit Command Hub | case-study-blinkit.html | dark ops-room · Mulish · yellow+green | blinkit-command-hub.vercel.app · picker-blinkit-app.lovable.app |
| 03 | YouTube 2.0 (concept) | case-study-youtube.html | dark · Roboto · red for CTA/active | 3 Lovable prototypes + Claude artifacts (in Solution sections) |
| 04 | Trivo (group travel) | case-study-group-travel.html | light cream · Fraunces · pink/coral/lilac · navy nav | frontend-argaurs-projects.vercel.app · gh argaur/group-travel-pwa |
| 05 | Vitae | case-study-vitae.html | light · Plus Jakarta · clinical blue-white (template) | vitae-health.vercel.app · gh aashikvilla/health-assistant |
| 06 | Personal AI Assistant | case-study-personal-ai-assistant.html | dark terminal · JetBrains Mono · green | gh argaur/personal-ai-assistant |
| 07 | Siteline CRM | case-study-siteline.html | light · Manrope · no-accent (the reference) | argaur.github.io/siteline-crm · gh argaur/siteline-crm |

**5 project pages** (same pattern): `project-pm-pathfinder.html` (dark indigo · Space Grotesk · soft-cornered), `project-ai-humancap-sim.html` (light warm · Source Serif · ochre/sage), `project-homelab.html` (dark · JetBrains Mono · terminal), `project-portfolio.html` (dark · Space Mono · sharp 0px · gold), `project-gws-cli.html` (dark terminal · Roboto Mono · Google 4-color).

`case-study-vitae.html` is the **golden template** — when rebuilding or adding a page, copy its scaffold + enhancement code and swap only the `:root` + fonts.

## Supabase integration
- Client loaded via CDN (`@supabase/supabase-js@2`); project `nvwjekhguijinfuylytl.supabase.co`; table `subscribers(email text)`; anon key embedded in `gate.js` (public read/insert only). RLS allows anonymous inserts only. (Gate flow is disabled — see above.)

## About me
- Gaurav Gupta — Senior Product Manager & AI Strategist, Jaipur, India. Building at the intersection of product and AI.

---

## AI Session Protocol
> Follow at the start of every session.
1. **Orient** — read this file, `git log --oneline -10`, and the Status block below. Deep reads of HTML/CSS/JS can go to a Gemini tab (1M context, free) to save Claude tokens.
2. **Plan** — any 3+-step task → Plan Mode before writing code.
3. **Build** — for a page rebuild/add, copy the Vitae template. Parallelizable page work fans out cleanly (each page is self-contained → no file conflicts).
4. **End of session** — update the Status block, sync memory (`/end-session`), update the Obsidian project page.

---

## Status

- **State:** live on Vercel. `main` carries the per-product-skin rebuild (merge `044bbd7` + polish). All 7 case studies + 5 project pages are self-contained single-scroll pages, each in its product's design language.
- **This session — 2026-07-23 (session 17):** rebuilt all 11 case-study/project pages onto the Siteline single-scroll + section-jump-nav pattern with per-product skins (built Vitae as the golden template by hand, fanned the other 10 out via a parallel workflow); added scrollspy + mobile nav strip; recolored every inline SVG to its palette (two dark→light flips). Deleted the now-dead `case-study.css`. Restored YouTube's 7 prototype/diagram links. Recolored Blinkit's SVG danger states red→Blinkit-yellow (`--red`→`--alert`). Refreshed this CLAUDE.md to v3 reality.
- **Previous:** 2026-07-18 (session 16) — restructured unlisted `g-os.html` (`9e0f4e4`). 2026-07-13 (session 15) — email gate disabled, Resume 404 fixed, internal docs moved out of repo.
- **Still open:** add `photo.jpg` headshot (profile canvas wired, needs the file); decide if `g-os.html` detail modals earn their keep; graduate "Now Building" chips (Personal Finance / RAS Prep / learning-hub) to shipped as they go live; Oracle VM HTTPS; Vitae GitHub rename (`aashikvilla/health-assistant`→`vitae-health`); Notion Companies DB; Google Analytics cert has no verify link.
- **Last updated:** 2026-07-23
