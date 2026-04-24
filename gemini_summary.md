# Portfolio Website — Current State Summary
*Last updated: 2026-04-24*

This document reflects the portfolio as it stands after the 2026-04-24 session. Use this as the reference for future Claude/Gemini sessions.

---

## 1. What Exists Now

### Pages
| File | Purpose |
|------|---------|
| `index.html` | Main portfolio (all 4 tabs + modal overlay) |
| `case-study-founder-crm.html` | CS01 — Founder's CRM |
| `case-study-blinkit.html` | CS02 — Blinkit Dark Store |
| `case-study-youtube.html` | CS03 — YouTube 2.0 |
| `case-study-group-travel.html` | CS04 — Group Travel Platform |
| `case-study-vitae.html` | CS05 — Vitae Health Records |

### JS / CSS
| File | Purpose |
|------|---------|
| `styles.css` | All styles (~2,100 lines). Dark + light theme. |
| `case-study.css` | Shared styles for all case study pages |
| `tabs.js` | Tab switching, URL hash routing, transitions (DO NOT EDIT) |
| `gate.js` | Email gate — Supabase insert + localStorage bypass |
| `app.js` | Theme toggle, vertical accordion timeline, carousels, modal |

---

## 2. Design System — Current Tokens

### Dark Theme (default)
```
--bg:              #06060B   (near-black, indigo-tinted)
--bg-subtle:       #0C0C17
--surface:         #0F0F1C
--surface-hover:   #161628
--text-primary:    #EDEAF8
--text-secondary:  #8986A8
--text-muted:      #504E6A
--accent:          #7C6CF7   (purple — unchanged)
--accent-soft:     #A89FFF
--accent-glow:     rgba(124,108,247,0.28)
--accent-faint:    rgba(124,108,247,0.08)
--accent-border:   rgba(124,108,247,0.22)
--border:          rgba(255,255,255,0.055)
--border-strong:   rgba(255,255,255,0.10)
--radius-card:     20px
--radius-sm:       12px
```

### Light Theme (`[data-theme="light"]` on `<html>`)
```
--bg:              #F8F8FC
--surface:         #FFFFFF
--text-primary:    #141219
--text-secondary:  #4A4860
```

### Visual Effects (dark theme)
- Body: fixed ambient radial purple glow via `background-image` (two radial-gradients)
- `body::after`: grain texture overlay (SVG feTurbulence, opacity 0.032, mix-blend-mode overlay, z-index 9999, pointer-events none)
- All card surfaces: diagonal gradient (surface → bg-subtle)
- Cards: 2px accent gradient top-border on hover/active
- Nav bottom border: accent-tinted (rgba 124,108,247,0.14)
- Active nav tab: glowing underline indicator
- Fonts: Plus Jakarta Sans (body) + JetBrains Mono (labels/tags/meta)

---

## 3. Tab Structure — index.html

### Home
- Hero card: photo ring (gradient border) + name/tagline/intro
- Contact card: email + LinkedIn links

### Experience
- **Vertical accordion timeline** — 4 roles, newest-first (JindalX → OneValley → Taccomacco → RSP Design)
- Left spine: 1px gradient line via `.vtl-wrap::before`; pip per role via `.vtl-pip` inside `.vtl-gutter`
- Layout: CSS grid `36px 1fr` per `.vtl-item`; right column holds header + collapsible `.vtl-body`
- Click a row → `is-active` class toggled; CSS `max-height` + `opacity` transition expands body inline
- Content (summary + achievements) pre-rendered by JS on page load from `JOBS` array; no DOM injection on click
- `#experience.is-active { display: block }` — no min-height, no flex (changed from full-height flex layout)
- Duration labels on each role (e.g. "· 3y", "· 1y 10m")
- Mobile: narrower gutter (30px), period stacks below company name

### Work
- **Featured Projects carousel** (6 cards, JindalX professional work)
  - 2 cards visible on desktop, 1 on mobile
  - Prev/Next arrows + dot indicators
  - Click card → modal overlay with full project details
- **Case Studies carousel** (5 cards, Rethink cohort projects)
  - Same carousel pattern
  - Modal shows: problem, approach, outcomes + "Read full case study →" CTA link
  - CS02 (Blinkit) and CS05 (Vitae) also show "View prototype →" button (`.modal-cta--proto`)
- Modal: `position: fixed`, backdrop blur, ESC/overlay-click/X to close

### Credentials
- Skills: 6 icon cards in CSS grid (auto-fill, minmax 280px)
- Education: B.Arch, NIT Jaipur
- Certifications: 8 badge-style cards in grid (CSM, CSPO, etc.)

---

## 4. Case Studies — Content Summary

### CS01 — Founder's CRM
- Problem: 60–70% of founders abandon CRM within 4 weeks (manual logging)
- Solution: Telegram bot — WhatsApp forwards/voice notes/screenshots → structured CRM data
- Research: 10 founder interviews, 85+ sources, 16-tool analysis
- Output: 39-page PRD
- Product link: placeholder `#`

### CS02 — Blinkit Dark Store Command Hub
- Problem: Dark store managers discover picker issues 3–7 min late during 6–10 PM peak
- Solution: Mobile-first command hub — live order cards, risk triage, nudge system, shift handoff
- Research: Field observations, ops interviews, Instamart competitor analysis
- Output: Working Figma prototype + unit economics model
- Product link: https://blinkit-command-hub.vercel.app/

### CS03 — YouTube 2.0
- Problem: 47% of users manually search every session; 29% Gen Z sessions end with no watch
- Solution: 4 features — Deep Dive Tab, Shorts-to-Long Bridge, Viewing Streak, Creator Success Suite
- Research: 171 survey responses, 27+ sources, competitor graveyard analysis
- Product link: placeholder `#`

### CS04 — Group Travel Planning Platform
- Problem: $168.7B market, 1–2 people absorb 80%+ planning load, silent conflicts surface mid-trip
- Solution: AI-native coordination — anonymous preference polling, task distribution, shared dashboard
- Research: 6 user interviews, 12+ sources, 8-tool competitive analysis
- Output: Full PRD, 5-phase implementation plan, MVP scoped to P0 only
- Product link: placeholder `#`

### CS05 — Vitae (Rethink Health Buildathon)
- Problem: India's health records crisis — WhatsApp prescription photos, ₹6,000cr+ in repeat tests
- Solution: PWA with Gemma 4 26B OCR + Claude plain-language explanations, family hub, no-signup trial
- Team: Gaurav Gupta + Shardul Ayare, Preeti Singh, Varun Malani, Aashik Villa, Palak Punjabi
- Shipped in 10 days (April 2026 buildathon)
- Product link: https://vitae-health.vercel.app/

---

## 5. Known Issues / Debt

| Item | Severity | Notes |
|------|---------|-------|
| Supabase anon key hardcoded in gate.js | Low (anon key is safe for client-side insert-only) | Acceptable for portfolio use |
| CSS variables duplicated in case-study.css | Low | Works fine; maintenance risk only |
| Product links for CS01, CS03, CS04 are `#` | Medium | Update once products are deployed |
| Vitae on personal Vercel account | Low | Team discussing migration to shared account |

---

## 6. What Was Done in the 2026-04-23 Session

1. Added CS04 (group-travel) and CS05 (vitae) case study pages from Rethink cohort PRDs
2. Added "View Product →" link to all case study page headers
3. Full redesign of index.html:
   - Theme toggle button in nav (light/dark)
   - Experience: horizontal timeline with detail panel
   - Work: two carousels with modal system
   - Credentials: icon skill cards + badge cert cards
4. Created app.js with all new interactivity
5. Dark theme redesigned: deeper bg, ambient glow, grain texture, gradient surfaces
6. Fixed: `#experience { display: flex }` was overriding `display: none` on inactive panels
7. Fixed: timeline node cards set to fixed 108px height

---

## 7. What Was Done in the 2026-04-24 Session

1. Redesigned Experience tab: horizontal dot timeline → vertical accordion timeline
   - Spine + pip layout; `grid-template-columns: 36px 1fr` per item
   - Newest-first order; inline expand/collapse via CSS `max-height` transition
   - Content pre-rendered from JOBS array on load; activate() only toggles `is-active`
   - Eliminated the layout-shift bug (was caused by `vtl-active-label` white-space: nowrap influencing flex distribution)
2. Added duration labels to each role (3y, 1y 10m, 3y 2m, 2y 9m)
3. Updated OneValley and Taccomacco achievements from resume PDF
4. Added "View prototype →" button in Work modals for CS02 and CS05
5. `#experience.is-active` simplified to `display: block` (removed min-height: 100vh and flex layout)

---

## 8. Git History (recent)
```
81a7f10  Redesign Experience tab: horizontal dot timeline → vertical accordion timeline
b17adbd  Fix: equalize timeline dot widths to eliminate layout shift on role click
7d584a1  Fix: prevent layout shift caused by scrollbar appearing/disappearing between roles
50fec4a  Fix timeline width, add durations, update experience content from resume
7ca18ac  Fix experience width consistency, modal prototype buttons
a1447e5  Redesign Experience tab: horizontal dot timeline (no cards)
37cca2e  Update CLAUDE.md and gemini_summary.md to reflect 2026-04-23 redesign
64ed34f  Fix: experience panel always-visible bug + fixed timeline node card sizes
```
