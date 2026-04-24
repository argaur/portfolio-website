# Portfolio Website — Current State Summary
*Last updated: 2026-04-24*

This document reflects the portfolio as it stands after the 2026-04-24 session. Use this as the reference for future Claude/Gemini sessions.

---

## 1. What Exists Now

### Pages
| File | Purpose |
|------|---------|
| `index.html` | Main portfolio — 7 panels, panel-based SPA, single modal overlay |
| `case-study-founder-crm.html` | CS01 — Founder's CRM |
| `case-study-blinkit.html` | CS02 — Blinkit Dark Store |
| `case-study-youtube.html` | CS03 — YouTube 2.0 |
| `case-study-group-travel.html` | CS04 — Group Travel Platform |
| `case-study-vitae.html` | CS05 — Vitae Health Records |

### JS / CSS
| File | Purpose |
|------|---------|
| `styles.css` | Blueprint to Bits design system (~1,250 lines). Panel layout, all section styles. |
| `case-study.css` | Blueprint to Bits styles for all 5 case study pages |
| `tabs.js` | Empty stub — replaced by panel nav in app.js |
| `gate.js` | Email gate — Supabase insert + localStorage bypass. Do not edit. |
| `app.js` | Panel switching, experience accordion, project modal, CS modal |

---

## 2. Design System — Blueprint to Bits

### Palette
```
--navy:     #0b1628   (hero, skills, credentials-edu, contact bg)
--navy-mid: #112240   (contact panel bg)
--cream:    #f7f3ee   (experience, case-studies section bgs; credentials-certs)
--white:    #ffffff   (work section bg, cards)
--text:     #1c1917
--muted:    #6b6560
--border:   #e2dbd3
--terra:    #bf5c3a   (primary accent — section labels, tags, career arc)
--blue:     #2d5da1   (metric chips, stat numbers, skill highlights)
--forest:   #3d5c3a   (architecture career arc segment)
```

### Typography
- **Display / Headings**: Cormorant Garamond (serif) — hero name, section titles, card titles
- **Body / UI**: DM Sans (sans-serif) — all other text, labels, nav links

### Key Rules
- **No `border-radius` anywhere** (architectural principle)
- Blueprint grid background on hero, skills, contact: 4-layer `linear-gradient` at 80px/20px intervals
- Single theme (no dark/light toggle)
- No profile photo in body

---

## 3. Navigation / Panel Structure — index.html

The site is a **panel-based SPA**. Body has `overflow: hidden; height: 100vh`. A `<main class="panels-wrap">` is `position: fixed; top: 64px; left/right/bottom: 0`. Each panel is `display: none; height: 100%; overflow-y: auto`. Active panel gets `is-active` → `display: block`.

Nav links use `data-panel="panel-X"` attributes. `app.js` intercepts all `[data-panel]` click events and calls `activatePanel(panelId)`. Hash routing fires on page load.

### Panels (in order)
| Panel ID | Nav Label | Background | Section Label |
|---|---|---|---|
| `panel-home` | — (logo) | Navy + blueprint grid | — |
| `panel-experience` | Experience | Cream `#f7f3ee` | 01 — WORK EXPERIENCE |
| `panel-work` | Work | White `#ffffff` | 02 — FEATURED PROJECTS |
| `panel-case-studies` | Case Studies | Cream `#f7f3ee` | 03 — CASE STUDIES |
| `panel-skills` | Skills | Navy + blueprint grid | 04 — SKILLS |
| `panel-credentials` | Credentials | White `#ffffff` | 05 — EDUCATION & CREDENTIALS |
| `panel-contact` | Contact | Navy-mid + blueprint grid | 06 — CONTACT |

Hash routing map: `#home`, `#experience`, `#work`, `#case-studies`, `#skills`, `#credentials`, `#contact`

---

## 4. Panel Detail

### Home (`panel-home`)
- Blueprint grid hero, navy bg, `min-height: 100%`
- Coordinate labels top-left/right (24px from panel top)
- Overline: terracotta line + "SENIOR PRODUCT MANAGER · AI STRATEGIST"
- H1: "Gaurav" / "Gupta." (faded)
- Two-column statement: italic quote (left) + bio (right)
- CTAs: "View Work" (→ panel-work) + "Get in touch →" (mailto)
- Stats bar: 10 years / 6 products / 5K+ users + LinkedIn + Email links

### Experience (`panel-experience`)
- Career arc bar: 3 color segments (forest/terra/blue) with labels
- 4 accordion rows, newest-first: JindalX → OneValley → Taccomacco → RSP Design
- Row layout: `grid-template-columns: 220px 24px 1fr`
- **Entire row is clickable** — click toggles `is-open`; `+` icon rotates 45° when open
- Body expands via CSS `max-height` transition (0 → 240px)
- Key classes: `.exp-row`, `.exp-left`, `.exp-gutter`, `.exp-dot`, `.exp-connector`, `.exp-right`, `.exp-header`, `.exp-toggle-icon`, `.exp-body`

### Work (`panel-work`)
- Header: "Built at JindalX"
- 3-col CSS grid (`gap: 2px`, `background: #e2dbd3` as border trick)
- 6 project cards: tag, title, description, metric chips, "View details →" (fades in on hover)
- Click any card → `#modal-overlay` opens with `openProjectModal(idx)`
- Project data in `app.js` `projects[]` array (6 objects)

### Case Studies (`panel-case-studies`)
- Header: "Deep Dives"
- Table: 5 rows, `grid-template-columns: 48px 1fr auto`, hover inverts to navy
- **Rows are buttons** (`role="button"`, `data-cs="0-4"`) — click opens CS modal, not navigation
- CS modal shows: category tag, title, problem, "The Insight" label + insight text, stat chips, action buttons
- CS02 (Blinkit) and CS05 (Vitae) get "View Prototype →" (navy bg) button + "Read Full Case Study →"
- All others get only "Read Full Case Study →"
- CS data in `app.js` `caseStudies[]` array (5 objects with `protoUrl` nullable)

### Skills (`panel-skills`)
- Navy + blueprint grid background
- 3-col grid, 6 skill groups: Product Management, AI & Automation, Analytics & Data, No-Code/Low-Code, Product Tools, Dev & Integration
- Category header in terracotta, items in `rgba(255,255,255,0.52)`

### Credentials (`panel-credentials`)
- Split panel: `grid-template-columns: 1fr 1fr`, `gap: 2px`, `background: #e2dbd3`
- Left (`creds-edu`): navy bg — B.Arch, NIT Jaipur, italic quote
- Right (`creds-certs`): cream bg — 7 cert rows with name, issuer, year

### Contact (`panel-contact`)
- Navy-mid bg + blueprint grid
- Section label "06 — CONTACT"
- H2: "Have a product challenge to solve?"
- Sub: "Whether it's an AI idea, a product strategy question, or you're looking for a senior PM — I'm listening."
- Email: `ar.gaurav20@gmail.com` (white, terracotta underline)
- LinkedIn: `linkedin.com/in/ar-gaurav →` (muted)
- Footer bar: GG logo left / "Gaurav Gupta · Jaipur · 2025" right

---

## 5. Modal System

Single `#modal-overlay` shared by projects and case studies. `#modal-body` innerHTML is rebuilt on each open.

### Project Modal
```
modal-tag → modal-title → modal-detail → modal-metrics (chips)
```

### CS Modal
```
modal-tag → modal-title → modal-detail (problem) →
modal-section-label ("The Insight") → modal-insight →
modal-stats (chips) → modal-actions (buttons)
```
Action buttons: `.modal-btn--primary` (navy, "View Prototype") + `.modal-btn--secondary` (outline, "Read Full Case Study")

Close: × button, overlay click, ESC key.

---

## 6. Case Studies — Content Summary

### CS01 — Founder's CRM
- Problem: 60–70% of founders abandon CRM within 4 weeks (manual logging friction)
- Insight: Founders already manage in WhatsApp — Telegram bot meets them there
- Stats: 39-page PRD, 16 tools analysed, 10 founder interviews
- Prototype: none | Page: `case-study-founder-crm.html`

### CS02 — Blinkit Dark Store Command Hub
- Problem: Dark store managers discover picker issues 3–7 min late during 6–10 PM peak
- Insight: Real-time command hub surfaces breaches before they happen
- Stats: Working prototype, 3 research methods, unit economics modelled
- Prototype: https://blinkit-command-hub.vercel.app/ | Page: `case-study-blinkit.html`

### CS03 — YouTube 2.0
- Problem: 47% manually search every session; 29% Gen Z sessions end with no watch
- Insight: 4 interventions targeting the discovery gap
- Stats: 171 survey responses, 4 product solutions, 27+ sources
- Prototype: none | Page: `case-study-youtube.html`

### CS04 — Group Travel Planning Platform
- Problem: 1–2 people absorb 80%+ planning load; conflicts surface mid-trip
- Insight: AI coordination layer distributes tasks, surfaces conflicts early
- Stats: 6 user interviews, $168.7B market, Full PRD
- Prototype: none | Page: `case-study-group-travel.html`

### CS05 — Vitae (Health Records)
- Problem: India's health record crisis — WhatsApp photos, ₹6,000cr+ in repeat tests
- Insight: PWA turns prescription photos into structured health timelines; shipped in 10 days
- Stats: Live product, 6-person team, 10 days shipped
- Prototype: https://vitae-health.vercel.app/ | Page: `case-study-vitae.html`

---

## 7. Known Issues / Debt

| Item | Severity | Notes |
|------|---------|-------|
| Supabase anon key hardcoded in gate.js | Low | Anon key is safe for client-side insert-only |
| Product links for CS01, CS03, CS04 are `#` | Medium | Update once products are deployed |
| Vitae on personal Vercel account | Low | Team discussing migration to shared account |
| Mobile: nav links hidden at 768px | Low | No hamburger menu — contact CTA still visible |

---

## 8. Session History

### 2026-04-24 (Session A — earlier)
- Redesigned Experience tab: horizontal dot timeline → vertical accordion timeline
- Spine + pip layout, newest-first, inline expand via CSS max-height transition
- Added duration labels, updated achievements from resume PDF
- Added "View prototype →" in Work modals for CS02 and CS05

### 2026-04-24 (Session B — this session)
- Full redesign: "Obsidian Editorial" (dark purple, tab SPA) → "Blueprint to Bits" (cream/navy/terracotta, panel SPA)
- index.html, styles.css, app.js fully rewritten
- Panel-based navigation: no page scroll, 7 fixed panels
- Entire experience row clickable (not just + icon)
- Case study rows open modal instead of navigating directly
- CS modal: problem + insight + stat chips + prototype/read links
- case-study.css redesigned to Blueprint to Bits
- All 5 case study HTML files: Cormorant + DM Sans fonts, back links → #case-studies
- Contact panel added (06): email, LinkedIn, footer bar

---

## 9. Git History (recent)
```
9a4fd76  Add Contact panel (06) with email, LinkedIn, and footer bar
3bb0d4b  Implement panel-based nav, CS modal, clickable exp rows, restyle case study pages
18dbc34  Redesign: implement Blueprint to Bits visual identity
8cabced  Update CLAUDE.md and gemini_summary.md to reflect 2026-04-24 session
81a7f10  Redesign Experience tab: horizontal dot timeline → vertical accordion timeline
```
