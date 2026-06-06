# Visual QA Audit — Portfolio v3
**Date:** 2026-06-06  
**Method:** Playwright screenshots (1440px desktop + 390px mobile, 7 panels × 3 views) + Opus agent analysis  
**Result:** 31 issues — 2× P0, 8× P1, 13× P2, 8× P3

---

## Root Architectural Finding (Read First)

Two competing JS systems are fighting each other:
1. **`app.js`** — the old v2 controller, wired to DOM elements that no longer exist (`#nav-overlay`, `#nav-hamburger`, `.panel`, `panel-how-i-think`, `#personal-projects-table`, etc.) — most of it is dead.
2. **The inline `<script>` in index.html** — the real v3 controller (`activatePanel`, `openV3Modal`, `toggleExpAccordion`, `initContactStack`).

Both bind `[data-panel]` click handlers. This is the root cause of the 14 console errors and several duplicate-content bugs.  
**Single highest-leverage fix: remove `app.js` from the page.** Eliminates Issues 1, 2, 8, 25, 28 in one move.

---

## JS Errors

### Issue 1: `Cannot read properties of null ('classList')` ×14 — P0
`app.js` line 41: `var overlay = document.getElementById('nav-overlay')` → **null** (HTML has `#mobile-nav`). On every `[data-panel]` click, `closeOverlay()` fires and throws on null. 7 panels × 2 events = 14 errors.  
**Fix:** Remove `<script src="app.js" defer></script>` from index.html.

---

## Panel: Home

### Issue 2: Duplicate work-project cards injected by app.js — P1
app.js renders a second set of project cards into `.exp-projects[data-company=...]` with different styling below the hand-authored v3 tonal cards.  
**Fix:** Remove app.js.

### Issue 3: Hero headline monospace at ~60px wraps to 5 lines — P2
Space Mono at display scale reads as a terminal dump. Long line wraps to 5 lines.  
**Fix:** Reduce to ~48px, tighten line-height.

### Issue 4: 4th stat ("30+ Initiatives") missing on mobile — P1
Stats use vertical dividers that drop to 2+1 on mobile — asymmetric, 4th stat disappears below fold.  
**Fix:** Use a 2×2 grid on mobile.

### Issue 5: Stack canvas resting state shows half-typed `> SCA` — P2
AI STRATEGY floor shows `> SCA` (truncated "SCALE ai.products") as the typewriter's resting state.  
**Fix:** Ensure `renderStatic()` is the final frame with full strings.

### Issue 6: Replay button overlaps log text — P3
"↻ REPLAY" (bottom-right absolute) sits on top of the ARCHITECTURE floor's log line.  
**Fix:** Move below or outside the canvas.

---

## Panel: Experience & Work

### Issue 7: Timeline dots don't align to accordion rows — P2
Left spine uses `gap-[220px]` fixed — dots drift away from company rows when accordions open/close.  
**Fix:** Make each dot a child of its row (position relative).

### Issue 8: JindalX shows two visually different card systems — P1
v3 tonal cards + app.js-injected `proj-card`s side by side, different bg, different chips.  
**Fix:** Remove app.js.

### Issue 9: Sub-card descriptions clipped at panel bottom — P3
Cards clip text at scroll boundary.  
**Fix:** Add bottom padding to accordion body.

### Issue 10: Mobile — dead left gutter + text overflows right — P2
`grid-cols-[auto_1fr]` keeps timeline column on mobile, wasting ~30% width.  
**Fix:** `grid-cols-1` on mobile, hide spine.

---

## Panel: Projects

### Issue 11: Mobile rows too tall + orphaned arrow icon — P1
Each row stacks: number → title → chips → "Live prototype →" → separate lone arrow. Rows eat ~half viewport.  
**Fix:** Drop standalone arrow column on mobile.

### Issue 12: Rows 07/08 hover-highlight but do nothing (dead affordance) — P2
Same hover state as clickable rows (amber arrow) but no modal/link.  
**Fix:** Remove hover state from non-interactive rows, or add GitHub links.

### Issue 13: Status column mixes categories — P3
"Live prototype →", "Deployed · Active", "PRD · Prototype", "Plain HTML/CSS/JS SPA", "Open source" — mixed axes.  
**Fix:** Normalize to "Live", "Deployed", "Concept", "Open source".

---

## Panel: Skills

### Issue 14: 6 identical-sized cells — AI slop grid — P2
All `min-h-[320px]`, identical layout, zero hierarchy. Violates CLAUDE.md: "everything same size → AI slop."  
**Fix:** Flagship 1–2 domains span 2 columns; vary cell heights.

### Issue 15: Bold-vs-muted list reads as a bug — P3
First 3 items white, last 2 gray — looks disabled, not intentional "top 3".  
**Fix:** Label distinction ("Core" / "Familiar") or use consistent styling.

### Issue 16: Mobile — monospace uppercase titles clipped — P1
2-column mobile: "PRODUCT STRATE", "DATA & ANALYTI" — titles visibly truncated.  
**Fix:** Single column on mobile.

---

## Panel: Philosophy

### Issue 17: Capstone barely differentiated from other cells — P2
Capstone (Principle 07) only differs by slightly lighter bg and italic body. CLAUDE.md spec: "principle 07 has terracotta/amber accent background."  
**Fix:** Amber accent background on capstone, larger type.

### Issue 18: Mobile — principle titles clipped — P1
Same 2-col mobile issue: "PURPOSE BEFORE AESTHETI", "BUILD FOR THE CONSTRAIN" — clipped.  
**Fix:** Single column on mobile.

### Issue 19: Header subtitle overlaps grid on mobile — P2
"THE MANIFESTO…" wraps 3 lines and 3rd line overlaps first grid cell.  
**Fix:** Add `mb` spacing below header before grid.

---

## Panel: Credentials

### Issue 20: Header shows `[ 13 ]` but actual rows ≠ 13 — P1
Actual count is 15. The number is wrong.  
**Fix:** Correct to actual count.

### Issue 21: Cert rows hover affordance but no click — P2
`group-hover:text-primary-fixed-dim` implies clickability; no `data-cert` attribute wired.  
**Fix:** Remove hover state from cert rows (static list).

### Issue 22: Education side ~60% empty — P2
Left 50% = 1 B.Arch entry + dead space. Right = 14 scrolling rows.  
**Fix:** Add B.Tech degree (2014–2018), rebalance to 35/65 split.

### Issue 23: Verified icon inconsistent — P3
Only 2 entries have amber filled icon; others have muted gray outline.  
**Fix:** Consistent icon treatment.

---

## Panel: Contact

### Issue 24: "Get in touch" CTA = amber text on amber bg → invisible — P0
When Contact is active panel, `.nav-link-active` applies `color:#c9a84c !important` to the CTA button which has `bg-primary-container (#c9a84c)`.  
**Fix:** Scope `nav-link-active` to `<nav>` links only.

### Issue 25: Two contact canvases — animated one hidden — P2
`#contact-stack-canvas` (visible) + `#contact-canvas` (hidden, app.js dead reference).  
**Fix:** Remove `#contact-canvas` + app.js.

### Issue 26: Corner ticks float outside box — P3
Amber corner ticks outside box border; log text crowds right edge.  
**Fix:** Inset ticks; add right padding.

### Issue 27: Mobile contact canvas illegible + CSS misfires — P2
Green log text sub-9px. Mobile CSS targets `#contact-canvas` (hidden), not the visible canvas.  
**Fix:** Hide canvas on mobile or scale up; fix CSS selector.

---

## Cross-Panel Issues

### Issue 28: Two different modal systems in DOM — P1
`#v3-modal` (v3) + `#modal-overlay`/`#modal-panel` (app.js). Both in DOM.  
**Fix:** Remove app.js → removes old modal system.

### Issue 29: 4 inconsistent panel header treatments — P2
Projects/Skills/Philosophy: amber left border. Experience: eyebrow + plain title. Credentials: "SECTION 01 /" prefix. Contact: dot + eyebrow. Four patterns.  
**Fix:** Standardize: eyebrow (`text-xs text-amber tracking-widest uppercase`) + display title.

### Issue 30: Build-log motif repeated 3× — P3

### Issue 31: Inconsistent title casing — P3

---

## Summary Table

| # | Issue | Panel | Priority |
|---|---|---|---|
| 1 | classList crash on every nav | Global | **P0** |
| 24 | "Get in touch" CTA invisible (amber-on-amber) | Header | **P0** |
| 2 | app.js duplicate cards in Experience | Experience | **P1** |
| 4 | 4th home stat missing on mobile | Home | **P1** |
| 8 | JindalX two card systems | Experience | **P1** |
| 11 | Mobile project rows too tall + orphaned arrow | Projects | **P1** |
| 16 | Skill titles clipped on mobile | Skills | **P1** |
| 18 | Philosophy titles clipped on mobile | Philosophy | **P1** |
| 20 | Cert count `[13]` wrong | Credentials | **P1** |
| 28 | Two modal systems in DOM | Global | **P1** |
| 3 | Hero headline 60px wraps 5 lines | Home | P2 |
| 5 | Stack canvas `> SCA` half-typed resting state | Home | P2 |
| 7 | Timeline dots don't align to accordion rows | Experience | P2 |
| 10 | Mobile Experience dead gutter + overflow | Experience | P2 |
| 12 | Projects 07/08 hover but do nothing | Projects | P2 |
| 14 | Skills: 6 identical cells, no hierarchy | Skills | P2 |
| 17 | Philosophy capstone barely differentiated | Philosophy | P2 |
| 19 | Philosophy header overlaps grid (mobile) | Philosophy | P2 |
| 21 | Cert hover affordance with no click | Credentials | P2 |
| 22 | Education side 60% empty | Credentials | P2 |
| 25 | Two contact canvases; animated one hidden | Contact | P2 |
| 27 | Mobile contact canvas illegible | Contact | P2 |
| 29 | 4 inconsistent panel header treatments | Cross-panel | P2 |
| 6 | Replay button overlaps log text | Home | P3 |
| 9 | Sub-card descriptions clipped | Experience | P3 |
| 13 | Status column mixes categories | Projects | P3 |
| 15 | Bold-vs-muted skill list reads as bug | Skills | P3 |
| 23 | Verified icon inconsistent | Credentials | P3 |
| 26 | Contact canvas corner ticks float | Contact | P3 |
| 30 | Build-log motif repeated 3× | Cross-panel | P3 |
| 31 | Inconsistent title casing | Cross-panel | P3 |

**Totals: 2× P0 · 8× P1 · 13× P2 · 8× P3 = 31 issues**
