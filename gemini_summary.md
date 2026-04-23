# Portfolio Website — Current State Summary
*Last updated: 2026-04-23*

This document reflects the portfolio as it stands after the 2026-04-23 redesign session. Use this as the reference for future Claude/Gemini sessions.

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
| `app.js` | Theme toggle, horizontal timeline, carousels, modal |

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
- Horizontal scrollable timeline — 4 role nodes across full width
- Nodes: `flex: 1`, fixed `height: 108px` cards (equal sizes regardless of text length)
- Click node → detail panel below updates with full role info (via JS data array in app.js)
- Detail panel: `flex: 1`, fills remaining viewport height (`#experience.is-active` is full-height flex)
- Mobile: reverts to vertical stacked cards

### Work
- **Featured Projects carousel** (6 cards, JindalX professional work)
  - 2 cards visible on desktop, 1 on mobile
  - Prev/Next arrows + dot indicators
  - Click card → modal overlay with full project details
- **Case Studies carousel** (5 cards, Rethink cohort projects)
  - Same carousel pattern
  - Modal shows: problem, approach, outcomes + "Read full case study →" CTA link
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

## 7. Git History (recent)
```
64ed34f  Fix: experience panel always-visible bug + fixed timeline node card sizes
a351d7c  Design enhancement: obsidian dark theme + full-height experience timeline
02ad519  Major portfolio redesign: theme toggle, horizontal timeline, carousels, modals
1f7d8cb  Add case studies CS04 (group travel) and CS05 (vitae), product links to all pages
e773b81  Add prototype and flow diagram links to YouTube case study
3ae5def  Add YouTube 2.0 case study (Case Study 03)
b580782  Add case study pages for Founder CRM and Blinkit Dark Store PRDs
```
