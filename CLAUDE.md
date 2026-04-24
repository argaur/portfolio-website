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
- Nav always shows frosted glass (`.nav--scrolled` applied in HTML, no scroll listener needed)
- 7 panels in order:
  - **Home** (`panel-home`) — hero, blueprint grid, name, statement, stats bar
  - **Experience** (`panel-experience`) — career arc bar + 4 accordion rows (entire row clickable)
  - **Work** (`panel-work`) — 3-col project grid, click → project detail modal
  - **Case Studies** (`panel-case-studies`) — table rows, click → CS modal (problem + insight + stats + links)
  - **Skills** (`panel-skills`) — navy + blueprint grid, 3-col skill groups
  - **Credentials** (`panel-credentials`) — split panel (navy edu left / cream certs right)
  - **Contact** (`panel-contact`) — navy-mid + blueprint grid, headline, email + LinkedIn links, footer bar
- URL hash routing: `#home`, `#experience`, `#work`, `#case-studies`, `#skills`, `#credentials`, `#contact`

## Tech constraints
- Plain HTML + CSS + vanilla JavaScript ONLY
- No frameworks, no libraries (except Supabase JS client via CDN)
- No npm, no build steps, no bundlers
- The site must work by simply opening index.html in a browser

## File structure
- `index.html` — 7 panels + modal overlay. No tabs, no scroll nav.
- `styles.css` — Blueprint to Bits design system (~1,250 lines). Panel layout, all section styles.
- `tabs.js` — empty stub (replaced by panel nav in app.js)
- `gate.js` — email gate logic (Supabase insert + localStorage bypass). Do not edit.
- `app.js` — panel switching, experience accordion, project modal, CS modal
- `case-study.css` — Blueprint to Bits styles for all 5 case study pages

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
- **Last session:** 2026-04-24
- **What was done:**
  - Full visual redesign: "Obsidian Editorial" (dark purple, tab SPA) → "Blueprint to Bits" (cream/navy/terracotta, panel SPA)
  - index.html rewritten: 7 fixed panels, no page scroll, nav switches panels via `data-panel`
  - styles.css rewritten: Blueprint to Bits design system, panel layout, no border-radius
  - app.js rewritten: `activatePanel()`, whole-row experience accordion, project modal, CS modal with 5 data objects
  - case-study.css rewritten: Blueprint to Bits theme (cream bg, navy nav, Cormorant headings, DM Sans body)
  - All 5 case study HTML files: updated fonts (Cormorant + DM Sans), back links → `index.html#case-studies`
  - Case study rows now open a modal (problem + insight + stat chips + prototype/read links) instead of navigating directly
  - CS02 (Blinkit) and CS05 (Vitae) show "View Prototype" button in CS modal
  - Contact panel added (06) — navy-mid + blueprint grid, email + LinkedIn links, footer bar
- **Next candidates:**
  - Add real product links to CS01 (Founder CRM), CS03 (YouTube), CS04 (Group Travel) once products are live
  - Vitae project: migrate to shared service account email (team decision pending)
  - RAG chatbot (separate project, not in this repo)
- **Blocker:** none
- **Last updated:** 2026-04-24
