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
- 8 panels in order:
  - **Home** (`panel-home`) — hero split (text left + animated systems-map canvas right), stats strip, blueprint grid. New headline: "Designing systems across architecture, enterprise software, and AI."
  - **Experience** (`panel-experience`) — career arc bar + 4 accordion rows (entire row clickable)
  - **Work** (`panel-work`) — 4 company groups, 9 total project cards; first card per company is `.proj-card--lead` (full-width, terra left border); click → project detail modal. JindalX cards 0–5 open wide modal (760px) with 7-part narrative.
  - **Projects** (`panel-projects`) — two sections: "Case Studies" (5 rows) + "Personal Projects" (4 rows, JS-rendered); click → modal (problem + insight + stats + links + optional GitHub button)
  - **Skills** (`panel-skills`) — navy + blueprint grid, 6 skill groups; top 3 per group highlighted (`.skill-top`); oversized group numbers (`.skill-group-num`)
  - **Philosophy** (`panel-philosophy`) — navy + blueprint grid, 7 product principles in 4-col grid; principle 07 has terracotta accent background
  - **Credentials** (`panel-credentials`) — split panel (navy edu left / cream certs right), 11 cert rows with `.cert-year-sep` dividers
  - **Contact** (`panel-contact`) — navy + blueprint grid, split layout (text left / 4-node canvas right), email + LinkedIn, footer bar
- URL hash routing: `#home`, `#experience`, `#work`, `#projects`, `#skills`, `#philosophy`, `#credentials`, `#contact`

## Tech constraints
- Plain HTML + CSS + vanilla JavaScript ONLY
- No frameworks, no libraries (except Supabase JS client via CDN)
- No npm, no build steps, no bundlers
- The site must work by simply opening index.html in a browser

## File structure
- `index.html` — 8 panels + modal overlay + mobile nav overlay. No tabs, no scroll nav.
- `styles.css` — Blueprint to Bits design system (~2,100 lines). Panel layout, hero split, philosophy grid, modal narrative, progressive reveal, canvas utilities, mobile responsive.
- `tabs.js` — empty stub (replaced by panel nav in app.js)
- `gate.js` — email gate logic (Supabase insert + localStorage bypass). Do not edit.
- `app.js` — panel switching + `panel:activate` CustomEvent, progressive reveal, mobile overlay nav, experience accordion, `initSystemsCanvas()` (12-node hero canvas), `initContactCanvas()` (4-node contact canvas), work project modal with 7-part narrative for JindalX projects, unified item modal (5 case studies + 4 personal projects); `personalProjects` array rendered into `#personal-projects-table`
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
- **State:** stable — no code changed; design framework session 01 complete
- **Last session:** 2026-05-18
- **What was done (this session):**
  - **Design Framework updated** — removed Blueprint to Bits tokens (design language always fresh); added Track A (design language questions) to Stage 2 Interview; generic token template replaces portfolio-specific table
  - **Stage 1 (Brainstorm) complete** — scope confirmed, v2 strategy loaded, three-identities problem documented; see `Documentation/design/session-01-brainstorm.md`
  - **Architecture portfolio analyzed** — 2014 B.Arch cover had custom 3D-modeled letterforms over self-rendered Mughal building; "medium is the message" principle extracted as design constraint for PM portfolio
  - **Design constraint:** portfolio's visual language must itself be a proof point — recruiter should feel "different level" before reading a word
- **Previous session (2026-05-17):**
  - 4 Excalidraw wireframes; Stitch project created; design framework extracted to Claude Optimisation project
- **Next session trigger:** Gaurav will say **"lets continue"**
- **Next session — Stage 2 Interview:**
  - Start Track A (design language): mood, aesthetic references, dark/light, type direction, what to avoid
  - Then Track B: 8 panels, one question at a time (Home first)
- **Still open:** photo.jpg headshot; Oracle VM HTTPS; Vitae GitHub repo rename; retrospective text for all 5 case studies; Netlify URL for bot-overview.html; 3 empty work modals (OneValley/Passport, Taccomacco, RSP)
- **Last updated:** 2026-05-18
