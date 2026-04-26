# My Portfolio

## Why This Exists

Public portfolio for Gaurav Gupta — demonstrates PM + AI strategy work to recruiters and collaborators. Email gate captures leads before revealing content.

**Success metric:** Visitor lands, submits email (captured to Supabase), and can navigate all 4 tabs with no broken states.

## Out of Scope (do not build unless explicitly asked)

- Any framework, npm package, or build step — plain HTML only
- Blog or writing section
- Contact form (social links are sufficient)
- Analytics beyond Supabase email capture
- RAG chatbot (separate project, not part of this repo)

## What this is
A personal portfolio website. Built with plain HTML, CSS, and vanilla JavaScript only. No frameworks, no React, no Tailwind, no build tools.

## Design
- "Blueprint to Bits" theme — cream/navy/white palette, terracotta accent
- Design tokens: `--navy: #0b1628`, `--cream: #f7f3ee`, `--terra: #bf5c3a`, `--blue: #2d5da1`, `--forest: #3d5c3a`
- Fonts: Cormorant Garamond (headings/display) + DM Sans (body/UI)
- Blueprint grid background on hero, skills, contact panels (CSS linear-gradient trick)
- No `border-radius` anywhere (architectural principle)
- No photo in body — hero is text + stats only
- No light/dark toggle — single theme

## Navigation structure
- **Panel-based SPA** — body has `overflow: hidden`; each section is a fixed-height panel switched by nav clicks
- Nav links use `data-panel="panel-X"` attributes; `app.js` calls `activatePanel()` on click
- Hash routing on load: `#experience` → `panel-experience`, etc.
- Nav is solid `#0b1628` — no backdrop-filter, no border (matches hero exactly)
- **Mobile nav**: hamburger button (`.nav-hamburger`) → full-screen overlay (`#nav-overlay`) with numbered Cormorant links, left-aligned with `padding-left: 10vw`; ESC or panel link closes it
- 7 panels in order:
  - **Home** (`panel-home`) — hero, blueprint grid, name, statement, single CTA "Get in touch →" → panel-contact
  - **Experience** (`panel-experience`) — career arc bar + 4 accordion rows (entire row clickable)
  - **Work** (`panel-work`) — 4 company groups, 9 total project cards, click → project detail modal
  - **Case Studies** (`panel-case-studies`) — table rows, click → CS modal (problem + insight + stats + links)
  - **Skills** (`panel-skills`) — navy + blueprint grid, 3-col skill groups
  - **Credentials** (`panel-credentials`) — split panel (navy edu left / cream certs right), 11 cert rows
  - **Contact** (`panel-contact`) — navy `#0b1628` + blueprint grid, headline, email + LinkedIn links, footer bar
- URL hash routing: `#home`, `#experience`, `#work`, `#case-studies`, `#skills`, `#credentials`, `#contact`

## Tech constraints
- Plain HTML + CSS + vanilla JavaScript ONLY
- No frameworks, no libraries (except Supabase JS client via CDN)
- No npm, no build steps, no bundlers
- The site must work by simply opening index.html in a browser

## File structure
- `index.html` — 7 panels + modal overlay + mobile nav overlay. No tabs, no scroll nav.
- `styles.css` — Blueprint to Bits design system (~1,350 lines). Panel layout, all section styles, mobile responsive.
- `tabs.js` — empty stub (replaced by panel nav in app.js)
- `gate.js` — email gate logic (Supabase insert + localStorage bypass). Do not edit.
- `app.js` — panel switching, mobile overlay nav, experience accordion, project modal (9 projects), CS modal (5 case studies)
- `case-study.css` — Blueprint to Bits styles for all 5 case study pages; floating pagination pill
- `favicon.svg` — geometric GG monogram (navy bg, white letterforms, terracotta crossbars)

## Email gate
- Full-screen overlay shown to first-time visitors before the portfolio
- Collects email address, saves to Supabase, then reveals the portfolio
- Returning visitors (localStorage flag `portfolio_gate_passed`) skip the gate automatically
- Graceful degradation: if Supabase is unreachable or email is a duplicate, visitor still gets through

## Supabase integration
- Client loaded via CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- Project URL: `https://nvwjekhguijinfuylytl.supabase.co`
- Anon key is embedded in gate.js (public/read-insert only -- safe for client-side)
- Table: `subscribers` with column `email` (text)
- RLS should be configured in Supabase to allow anonymous inserts only

## Case studies
5 complete case studies — all have dedicated HTML pages and appear as carousel cards on the Work tab.

| # | Title | Page | Product Link |
|---|-------|------|-------------|
| 01 | Founder's CRM — Conversation-First Sales Tool | case-study-founder-crm.html | placeholder `#` |
| 02 | Peak-Hour Decision Support for Blinkit Dark Stores | case-study-blinkit.html | https://blinkit-command-hub.vercel.app/ |
| 03 | YouTube 2.0 — Fixing Long-Form Discovery | case-study-youtube.html | placeholder `#` |
| 04 | Group Travel Planning Platform | case-study-group-travel.html | placeholder `#` |
| 05 | Vitae — Health Records, Finally Understood | case-study-vitae.html | https://vitae-health.vercel.app/ |

Each page uses case-study.css. "View Product →" link appears in header of each page.

## About me
- Name: Gaurav Gupta
- Role: Senior Product Manager & AI Strategist, Jaipur, India
- Focus: Building at the intersection of product and AI

---

## AI Session Protocol — Read This First

> Instructions for Claude. Follow these steps at the start of every session.

### Step 1: Orient (before touching any code)
- Read this file fully
- Run `git log --oneline -10` to see recent history
- Check "Status" section below → tell Gaurav: current state, what was last done, what's next

### Step 2: Explore → Gemini (not Claude tokens)
- Reading all HTML/CSS/JS files, understanding layout structure → Gemini terminal tab
- Gemini has 1M context and is free — don't burn Claude tokens on reads

### Step 3: Plan → Claude Plan Mode
- Any task with 3+ steps → enter Plan Mode before writing code

### Step 4: Build → Split by task type

| Task | Tool |
|---|---|
| Repetitive HTML sections, CSS utilities | Codex background mode |
| Gate logic, Supabase integration, routing JS | Claude |
| Inline completions, simple copy edits | Copilot |

### Step 5: End of Session (do not skip)
1. Update "Status" section below
2. Run `/compact` in Claude
3. Update Obsidian project page

---

## Status
- **State:** active
- **Last session:** 2026-04-26
- **What was done:**
  - **Mobile responsive nav**: hamburger → full-screen overlay, numbered Cormorant links, left-aligned
  - **Work panel expanded**: 4 company groups (JindalX · OneValley · Taccomacco · RSP), 9 total cards, header → "Products & Projects"
  - **Case study pagination**: page-by-page view with floating frosted-glass pill (Prev/Next + counter), keyboard arrow support; bug fixed (script was above DOM, moved pagination HTML before script)
  - **Graph-paper grid**: cream/white panels all have 120px grid at `rgba(0,0,0,0.06)` baked into `.section--cream` / `.section--white`
  - **SVG architectural drawings removed**: hero and contact were tried with floor plan + user flow SVGs — user found them too noisy. Reverted to CSS grid only.
  - **GG Logo**: geometric SVG monogram created as `favicon.svg` and inline nav logo (`.nav-logo`)
  - **Hero cleanup**: removed "View Work" button; single CTA "Get in touch →" now routes to `panel-contact`
  - **Nav**: solid `#0b1628`, no backdrop-filter, no border — matches hero exactly
  - **Contact panel**: changed from `navy-mid #112240` → `navy #0b1628` (bookend symmetry with hero)
  - **Credentials**: added 4 certs from LinkedIn (Airtable Admin, Airtable Builder, Power BI Desktop, Lean); fixed years/names; now 11 rows total
  - **app.js**: renamed modal overlay var to `modalOverlay` (was `overlay`, clashed with nav overlay); projects[] extended to 9 objects
  - **CSS fix**: `box-sizing: border-box` on `.section` fixed phantom scroll on panels
- **Next candidates:**
  - Add real product links to CS01 (Founder CRM), CS03 (YouTube), CS04 (Group Travel) once products are live
  - Vitae project: migrate to shared service account email (team decision pending)
  - Minor mobile polish issues noted but deferred (user said "looks decent")
  - RAG chatbot (separate project, not in this repo)
- **Blocker:** none
- **Last updated:** 2026-04-26
