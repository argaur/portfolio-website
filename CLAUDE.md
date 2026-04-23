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
- "Obsidian Editorial" dark theme -- bg #06060B (near-black, indigo-tinted), surface #0F0F1C, accent #7C6CF7
- Ambient radial purple glow on body background (fixed attachment)
- Grain texture overlay via SVG feTurbulence (subtle depth, z-index 9999, pointer-events none)
- Light theme toggle in nav (localStorage persistent, `[data-theme="light"]` on `<html>`)
- Fonts: Plus Jakarta Sans (body) + JetBrains Mono (labels, tags, metadata)
- Tab-based navigation with 4 tabs: Home, Experience, Work, Credentials
- Fixed top nav bar with frosted glass backdrop blur + accent-tinted bottom border + active tab glow
- Fade transitions between tab panels (panelFadeIn keyframe)
- Mobile-first responsive -- 44px touch targets, no horizontal scroll
- All cards: gradient surfaces (dark→deeper) + accent top-border on hover/active
- All interactive elements: glow effects on accent color

## Navigation structure
- **Home** -- Hero (photo, name, tagline, intro) + Contact links
- **Experience** -- Horizontal scrollable timeline (4 role nodes, click to expand detail panel below). Panel fills full viewport height. Nodes are equal fixed-width, cards are fixed 108px height.
- **Work** -- Two carousels with arrows + dots: Featured Projects (6 cards, JindalX work) + Case Studies (5 cards, Rethink projects). Click any card → modal overlay with full details.
- **Credentials** -- Skills grid (6 icon cards) + Education block + Certifications grid (badge-style cards)
- URL hash routing (#home, #experience, #work, #credentials) with browser back/forward support

## Tech constraints
- Plain HTML + CSS + vanilla JavaScript ONLY
- No frameworks, no libraries (except Supabase JS client via CDN)
- No npm, no build steps, no bundlers
- The site must work by simply opening index.html in a browser

## File structure
- index.html -- the main page (all 4 tab panels + modal overlay)
- styles.css -- all styles (dark + light theme, 2000+ lines)
- tabs.js -- tab switching, URL hash routing, panel transitions (DO NOT EDIT)
- gate.js -- email gate logic (Supabase integration, localStorage bypass)
- app.js -- theme toggle, horizontal timeline, carousels, modal (added 2026-04-23)
- case-study.css -- shared styles for all case study pages
- photo.jpg or photo.png -- profile photo

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
- **Last session:** 2026-04-23 — major redesign complete
- **What was done:**
  - Added case-study-group-travel.html (CS04) and case-study-vitae.html (CS05)
  - Added "View Product →" link to all case study pages
  - Full portfolio redesign: theme toggle, horizontal experience timeline, work carousels + modals, credentials card grid
  - Dark theme overhauled to "Obsidian Editorial" — deeper bg, ambient glow, grain texture
  - Fixed bug: #experience panel was always visible due to ID specificity overriding display:none
  - Fixed bug: timeline node cards now fixed 108px height (equal sizes)
- **Next candidates:**
  - Add real product links to CS01 (Founder CRM), CS03 (YouTube), CS04 (Group Travel) once products are live
  - Vitae project: migrate to shared service account email (team decision pending)
  - RAG chatbot (separate project, not in this repo)
- **Blocker:** none
- **Last updated:** 2026-04-23
