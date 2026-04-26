# Portfolio Website — Current State Summary
*Last updated: 2026-04-26*

This document reflects the portfolio as it stands after the 2026-04-26 session. Use this as the reference for future Claude/Gemini sessions.

---

## 1. What Exists Now

### Pages
| File | Purpose |
|------|---------|
| `index.html` | Main portfolio — 7 panels, panel-based SPA, single modal overlay, mobile nav overlay |
| `case-study-founder-crm.html` | CS01 — Founder's CRM (6 pages) |
| `case-study-blinkit.html` | CS02 — Blinkit Dark Store (5 pages) |
| `case-study-youtube.html` | CS03 — YouTube 2.0 (4 pages) |
| `case-study-group-travel.html` | CS04 — Group Travel Platform (4 pages) |
| `case-study-vitae.html` | CS05 — Vitae Health Records (3 pages) |

### JS / CSS / Assets
| File | Purpose |
|------|---------|
| `styles.css` | Blueprint to Bits design system (~1,350 lines). Panel layout, section styles, mobile responsive. |
| `case-study.css` | Blueprint to Bits styles for all 5 case study pages; floating pagination pill |
| `tabs.js` | Empty stub — replaced by panel nav in app.js |
| `gate.js` | Email gate — Supabase insert + localStorage bypass. **Do not edit.** |
| `app.js` | Panel switching, mobile overlay nav, experience accordion, project modal (9 projects), CS modal (5 case studies) |
| `favicon.svg` | Geometric GG monogram — navy bg, white letterforms, terracotta crossbars |

---

## 2. Design System — Blueprint to Bits

### Palette
```
--navy:     #0b1628   (hero, skills, credentials-edu, contact bg — ALL navy panels use this)
--cream:    #f7f3ee   (experience, case-studies, credentials-certs panels)
--white:    #ffffff   (work panel, cards)
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
- Blueprint grid background on navy panels (`blueprint-bg`): 4-layer `linear-gradient`, blue lines, 80px/20px intervals
- Graph-paper grid on cream/white panels: baked into `.section--cream` and `.section--white` — 120px squares, `rgba(0,0,0,0.06)`
- Single theme (no dark/light toggle)
- No profile photo in body
- **No SVG drawings** — attempted floor plan + user flow SVGs, removed; CSS grid only

---

## 3. Navigation / Panel Structure — index.html

The site is a **panel-based SPA**. Body has `overflow: hidden; height: 100vh`. A `<main class="panels-wrap">` is `position: fixed; top: 64px; left/right/bottom: 0`. Each panel is `display: none; height: 100%; overflow-y: auto`. Active panel gets `is-active` → `display: block`.

Nav links use `data-panel="panel-X"` attributes. `app.js` intercepts all `[data-panel]` click events and calls `activatePanel(panelId)`. Hash routing fires on page load.

### Desktop Nav
Solid `#0b1628`, no backdrop-filter, no border. GG SVG logo (routes to panel-home). Links + `.nav-cta--desktop` (Contact button, hidden on mobile).

### Mobile Nav
Hamburger button (`.nav-hamburger`) visible at ≤768px. Clicking opens `#nav-overlay`: full-screen navy overlay, numbered Cormorant links left-aligned (`padding-left: 10vw`), numbered `<em>` prefix in terracotta. ESC or clicking any panel link closes overlay.
Key IDs: `nav-overlay`, `nav-hamburger`, `nav-overlay-close`.

### Panels (in order)
| Panel ID | Nav Label | Background | Section Label |
|---|---|---|---|
| `panel-home` | — (logo) | Navy `#0b1628` + blueprint grid | — |
| `panel-experience` | Experience | Cream + graph-paper grid | 01 — WORK EXPERIENCE |
| `panel-work` | Work | White + graph-paper grid | 02 — PRODUCTS & PROJECTS |
| `panel-case-studies` | Case Studies | Cream + graph-paper grid | 03 — CASE STUDIES |
| `panel-skills` | Skills | Navy + blueprint grid | 04 — SKILLS |
| `panel-credentials` | Credentials | White + graph-paper grid | 05 — EDUCATION & CREDENTIALS |
| `panel-contact` | Contact | Navy `#0b1628` + blueprint grid | 06 — CONTACT |

Hash routing map: `#home`, `#experience`, `#work`, `#case-studies`, `#skills`, `#credentials`, `#contact`

---

## 4. Panel Detail

### Home (`panel-home`)
- Navy `#0b1628` + blueprint grid, `min-height: 100%`
- Hero centered: `display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center`
- Coordinate labels top-left/right: "26.9124° N · 75.7873° E · JAIPUR" and "PORTFOLIO · 2026"
- Overline: terracotta line + "SENIOR PRODUCT MANAGER · AI STRATEGIST"
- H1: "Gaurav" / "Gupta." (faded)
- Two-column statement: italic quote (left) + bio (right)
- **Single CTA**: "Get in touch →" routes to `panel-contact` via `data-panel="panel-contact"`
- Stats bar (`.hero-stats`): 10 years / 6 products / 5K+ users + LinkedIn + Email links

### Experience (`panel-experience`)
- Career arc bar: 3 color segments (forest/terra/blue) with labels
- 4 accordion rows, newest-first: JindalX → OneValley → Taccomacco → RSP Design
- Row layout: `grid-template-columns: 220px 24px 1fr`
- **Entire row is clickable** — click toggles `is-open`; `+` icon rotates 45° when open
- Body expands via CSS `max-height` transition (0 → 240px)

### Work (`panel-work`)
- Header: "Products & Projects" (changed from "Built at JindalX")
- **4 company groups** with `.work-company-label` separator rows: JindalX (6 cards) · OneValley (1) · Taccomacco (1) · RSP Design (1)
- 9 total project cards (data-proj 0–8) in `app.js` `projects[]` array
- 3-col CSS grid (`gap: 2px`, `background: #e2dbd3` as border trick)
- Hover: navy invert with white title, faded desc, ghost metric chips (matches Case Studies hover)
- Click any card → `#modal-overlay` opens with `openProjectModal(idx)`

### Case Studies (`panel-case-studies`)
- Header: "Deep Dives"
- Table: 5 rows, `grid-template-columns: 48px 1fr auto`, hover inverts to navy
- **Rows are buttons** — click opens CS modal, not navigation
- CS modal: category tag → title → problem → "The Insight" → insight text → stat chips → action buttons
- CS02 (Blinkit) and CS05 (Vitae) get "View Prototype →" button
- CS data in `app.js` `caseStudies[]` array (5 objects, `protoUrl` nullable)

### Skills (`panel-skills`)
- Navy + blueprint grid background
- 3-col grid, 6 skill groups: Product Management, AI & Automation, Analytics & Data, No-Code/Low-Code, Product Tools, Dev & Integration

### Credentials (`panel-credentials`)
- Split panel: left (navy, B.Arch NIT Jaipur 2009–2014), right (cream, 11 cert rows)
- **11 certifications** (sorted newest first):
  1. CSM — Scrum Alliance — 2025
  2. CSPO — Scrum Alliance — 2025
  3. Essentials Automation Certification — Automation Anywhere — 2025
  4. Airtable Admin — Airtable — 2024
  5. Airtable Builder Certification — Airtable — 2024
  6. Learning Power BI Desktop — LinkedIn Learning — 2024
  7. Lean Certification — JindalX — 2023
  8. Product Management Professional Certificate — LinkedIn Learning
  9. SQL for Data Analytics & Business Intelligence — Udemy — 2020
  10. Applied Data Science with Python — Level 2 — IBM — 2020
  11. Google Analytics Certified — Google

### Contact (`panel-contact`)
- Navy `#0b1628` + blueprint grid (same as hero — bookend symmetry)
- Centered: `display: flex; flex-direction: column; justify-content: center; align-items: center`
- Section label "06 — CONTACT"
- H2: "Have a product challenge to solve?"
- Email: `ar.gaurav20@gmail.com` | LinkedIn: `linkedin.com/in/ar-gaurav →`
- Footer bar: GG logo left / "Gaurav Gupta · Jaipur · 2026" right

---

## 5. Modal System

Single `#modal-overlay` shared by projects and case studies. In `app.js`, the variable is named `modalOverlay` (NOT `overlay` — that name is taken by the mobile nav overlay).

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

Close: × button (`#modal-close`), overlay click, ESC key.

---

## 6. Case Study Pagination

All 5 case study pages use page-by-page navigation. Structure per page:

```html
<!-- Before <script> tag — MUST be before script or buttons won't be found -->
<div class="cs-pagination">
  <button class="cs-page-btn" id="cs-prev" disabled>← Prev</button>
  <span class="cs-page-counter" id="cs-counter">Page 1 of N</span>
  <button class="cs-page-btn" id="cs-next">Next →</button>
</div>

<script>
(function() {
  var pages = document.querySelectorAll('.cs-page');
  var counter = document.getElementById('cs-counter');
  var prevBtn = document.getElementById('cs-prev');
  var nextBtn = document.getElementById('cs-next');
  var current = 0;
  function show(n) { ... }
  prevBtn.addEventListener('click', function() { show(current - 1); });
  nextBtn.addEventListener('click', function() { show(current + 1); });
  document.addEventListener('keydown', function(e) { ... });
  show(0);
})();
</script>
```

**Critical**: pagination `<div>` must come BEFORE the `<script>` block. Bug was caused by reversed order — script ran before buttons existed in DOM.

CSS: `.cs-pagination` is `position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%)` with frosted glass background. Pages per file: Blinkit=5, Founder CRM=6, YouTube=4, Group Travel=4, Vitae=3.

---

## 7. Case Studies — Content Summary

| # | Title | Pages | Prototype |
|---|-------|-------|-----------|
| CS01 | Founder's CRM — Conversation-First Sales Tool | 6 | none |
| CS02 | Peak-Hour Decision Support for Blinkit Dark Stores | 5 | https://blinkit-command-hub.vercel.app/ |
| CS03 | YouTube 2.0 — Fixing Long-Form Discovery | 4 | none |
| CS04 | Group Travel Planning Platform | 4 | none |
| CS05 | Vitae — Health Records, Finally Understood | 3 | https://vitae-health.vercel.app/ |

---

## 8. Known Issues / Debt

| Item | Severity | Notes |
|------|---------|-------|
| Product links for CS01, CS03, CS04 are `#` | Medium | Update once products are deployed |
| Vitae on personal Vercel account | Low | Team discussing migration to shared account |
| "Google Analytics Certified — Google" not in LinkedIn export | Low | Verify it's still valid; remove if expired |
| "Product Management Professional Certificate — LinkedIn Learning" not in LinkedIn export | Low | Verify it's a real cert (not just course completion) |
| Minor mobile polish issues noted | Low | User said "looks decent, fix later" — no specific tickets yet |

---

## 9. Session History

### 2026-04-24 (Session A)
- Redesigned Experience tab: horizontal dot timeline → vertical accordion
- Added "View prototype →" in Work modals for CS02 and CS05

### 2026-04-24 (Session B)
- Full redesign: "Obsidian Editorial" → "Blueprint to Bits" (cream/navy/terracotta, panel SPA)
- index.html, styles.css, app.js fully rewritten
- Panel-based navigation, 7 fixed panels
- Case study rows open modal; Contact panel added

### 2026-04-26 (Session C — today)
- **Mobile nav**: hamburger + full-screen overlay, numbered Cormorant links, left-aligned
- **Work panel**: expanded to 4 company groups (JindalX, OneValley, Taccomacco, RSP), 9 project cards
- **Case study pagination**: page-by-page with floating pill; fixed script-before-DOM bug
- **Graph-paper grid**: baked into all cream/white panels
- **SVG drawings**: tried floor plan + user flow on hero/contact, removed after user found them too noisy
- **GG Logo**: geometric SVG monogram in nav + favicon.svg
- **Hero**: removed "View Work" CTA, single "Get in touch →" → panel-contact
- **Nav**: solid `#0b1628`, no backdrop-filter
- **Contact panel**: changed to `#0b1628` (matches hero)
- **Credentials**: added 4 missing certs from LinkedIn, fixed years/names, now 11 rows
- **app.js**: `modalOverlay` rename (was `overlay`, clashed with nav overlay); projects[] = 9 objects
- **CSS**: `box-sizing: border-box` on `.section` fixed phantom scroll

---

## 10. Git History (recent)
```
672574a  Add 4 missing certs from LinkedIn, fix names and years
726ea52  Fix pagination buttons not working on case study pages
30e0e8b  Remove architectural SVG drawings, keep blueprint grid only
46909a7  Mobile polish: zoomed SVGs, left-aligned nav overlay, contact vertical layout
7f88447  Push mobile responsive + pagination + work panel + logo + various fixes
44ffb00  Update CLAUDE.md and gemini_summary.md to reflect Blueprint to Bits redesign
9a4fd76  Add Contact panel (06) with email, LinkedIn, and footer bar
```
