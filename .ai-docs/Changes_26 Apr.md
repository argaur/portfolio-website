# Portfolio Changes — 26 April 2026
> Track progress with checkboxes. Check off each sub-task as it's completed.
> Status legend: [ ] pending · [x] done · [~] partial/in-progress

---

## Design Reference
- Hero Circuit Variant: Shared via claude.ai/design (authenticated link)
- Screenshot 1 (Hero panel): `C:\Users\Gaurav Gupta\OneDrive\Pictures\Screenshots\Screenshot 2026-04-26 082959.png`
- Screenshot 2 (Experience grid): `C:\Users\Gaurav Gupta\OneDrive\Pictures\Screenshots\Screenshot 2026-04-26 083021.png`
- Resume PDF 1: `Reference Files/Gaurav Gupta - SPM_10YE_Jan26.pdf`
- Resume PDF 2: `Reference Files/WB Format_GauravGupta.pdf`

---

## Design Vision (from screenshots)

**Image 1 — New Hero background:**
Actual architectural floor plan drawings (left half) and user flow wireframe diagrams (right half) layered as semi-transparent SVG elements over the dark navy base. Replaces the current CSS-only blueprint grid lines with real technical drawing aesthetics.
- Left: Floor plan with rooms (STUDY, LIVING ROOM, BATH, CORRIDOR) — label "FLOOR PLAN — LEVEL 01"
- Right: User flow wireframe (SIGN IN → ONBOARD → DASHBOARD, ANALYTICS, FEED, PROFILE) — label "USER FLOW — FRAGMENT"
- Stroke: semi-transparent blue (`rgba(65,120,220,0.18)`) on `#0b1628` navy

**Image 2 — Grid on light panels:**
Cream background panels (Experience, Work, Case Studies, Credentials) now carry a large-square graph-paper grid (~120px squares, very subtle). Extends the blueprint aesthetic site-wide to all panels.

---

## Key Files
| File | Role |
|------|------|
| `index.html` | Main SPA — 7 panels + modal |
| `styles.css` | Full design system (~1,250 lines) |
| `app.js` | Panel switching, modals, projects[] array |
| `case-study-*.html` | 5 case study long-form pages |
| `case-study.css` | Styles for case study pages |
| `favicon.svg` | New file — GG logo as favicon |

---

## Execution Order & Task Tracking

---

### C9 — Remove "View Work" button from homepage
**Effort:** 15 min · **File:** `index.html`

**What:** Remove the white "VIEW WORK" primary CTA. Keep "Get in touch →" but reroute it from `mailto:` to the Contact panel.

**Implementation:**
- [ ] Delete `<a href="#work" class="hero-btn-primary" data-panel="panel-work">View Work</a>` from `#panel-home`
- [ ] Change `hero-btn-secondary` link: `href="#contact"`, add `data-panel="panel-contact"`, remove `mailto:` href
- [ ] Update button text if needed: "Get in touch →" stays as-is
- [ ] In `styles.css`: adjust `.hero-ctas` if it has `gap` set for two buttons (single button doesn't need flex gap)

**Verify:** Home panel shows only one CTA; clicking it navigates to Contact panel.

---

### C7 — Nav bar: add blueprint grid texture
**Effort:** 20 min · **File:** `styles.css`

**What:** The nav currently sits as a dark navy bar that looks disconnected from the cream/white panels below. Adding the blueprint-bg grid lines to the nav itself ties it visually to the hero and makes it feel like a continuous design element.

**Current CSS:**
```css
.nav--scrolled {
  background: rgba(11,22,40,0.96);
  backdrop-filter: blur(16px);
  border-bottom-color: rgba(255,255,255,0.06);
}
```

**Implementation:**
- [ ] Add `background-image` to `.nav--scrolled` — same 4-layer linear-gradient as `.blueprint-bg` but at lower opacity (use `rgba(65,120,220,0.05)` lines so they're subtle on the nav)
- [ ] Keep `background-color: rgba(11,22,40,0.96)` as base — the grid sits on top via `background-image`
- [ ] Verify nav links remain readable (white text on dark navy — no contrast issue)

**Verify:** Nav bar shows faint grid lines matching the hero background texture.

---

### C2 — Graph-paper grid on all cream/light panels
**Effort:** 30 min · **File:** `styles.css`, `index.html`

**What:** Image 2 shows that cream panels (Experience, Work, Case Studies, Credentials) should have a large-square grid overlay — like graph paper. Currently they have a plain cream/white background.

**Implementation:**
- [ ] Add new CSS class `.grid-bg` to `styles.css`:
  ```css
  .grid-bg {
    background-image:
      linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px);
    background-size: 120px 120px;
  }
  ```
- [ ] Add `.grid-bg` class to the `<section>` inside: `panel-experience`, `panel-work`, `panel-case-studies`, `panel-credentials`
- [ ] Do NOT add to navy panels — they already use `.blueprint-bg`
- [ ] Also add `.grid-bg` to case study pages body/main in `case-study.css` (for the cream cs pages)

**Verify:** Experience panel shows subtle large-square grid on cream background matching Image 2.

---

### C3 — Full-screen backgrounds on all pages
**Effort:** 30 min · **Files:** `styles.css`, `case-study.css`, all 5 `case-study-*.html`

**What:** Some panels or case study pages have backgrounds that don't cover the full viewport — leaving blank white areas. Every page must be fully covered.

**Known issues to check:**
- Panels: `.section` inside `.panel` may not stretch to full panel height if content is short
- Case study pages: `body`, `.cs-main` may not have `min-height: 100vh`

**Implementation:**
- [ ] In `styles.css`: ensure `.section` has `min-height: 100%` (not just padding-based height)
- [ ] In `case-study.css`:
  - Add `min-height: 100vh` to `body`
  - Add `min-height: calc(100vh - 64px)` to `.cs-main` (accounting for nav height)
  - Ensure `background-color` is set on `body` (cream `#f7f3ee`) not just on sections
- [ ] In each `case-study-*.html`: confirm `<body>` has the correct background class or inline style
- [ ] Check panel-credentials (split panel) — right side cream may not stretch to full height

**Verify:** Open each panel with minimal content and check no white bleed below the section.

---

### C5 — Color & contrast audit
**Effort:** 45 min · **Files:** `styles.css`, `case-study.css`

**Known issues (identified during exploration):**

1. **Nav links on light panels** — `.nav-link` color is `rgba(255,255,255,0.55)`. The nav always stays dark navy (`rgba(11,22,40,0.96)`) so white links ARE readable on the nav itself — this is actually fine. The nav doesn't change color per panel. Confirm this is not causing visibility issues.

2. **`.hero-btn-secondary`** — `color: rgba(255,255,255,0.55)` on dark hero background. Borderline contrast (~3.5:1). Improve to `rgba(255,255,255,0.75)` minimum.

3. **`.modal-btn--secondary`** — `color: #0b1628` with `border: 1px solid #e2dbd3` on white modal background. Fine. But check on navy modal overlay if it ever appears there.

4. **Work card "View details →"** — check it's visible (likely `.muted` color on white card).

5. **Experience tag labels** (PRODUCT & TECH, FOUNDER/PIVOT, ARCHITECTURE) — check these `rgba` text on cream bg.

6. **Case study links and buttons** — check `.cs-link-btn` color in `case-study.css`.

**Implementation:**
- [ ] Audit `.hero-btn-secondary` — bump opacity to 0.8+
- [ ] Audit `.exp-tag` colors on cream background
- [ ] Audit `.proj-view` ("View details →") color on white card
- [ ] Audit `case-study.css` button/link colors
- [ ] Audit `.contact-email`, `.contact-linkedin` on new navy background (C10 changes bg)
- [ ] Fix any failures to WCAG AA (4.5:1 normal text, 3:1 large text)

**Verify:** Open each panel and visually confirm all text/buttons are clearly readable.

---

### C8 — GG Logo: geometric monogram SVG
**Effort:** 60 min · **Files:** `index.html`, `styles.css`, new `favicon.svg`

**What:** Replace the plain text "GG" in the nav logo with a unique geometric/architectural SVG monogram. Also create `favicon.svg` for browser tab.

**Design concept:** Two "G" letterforms constructed from straight lines and right angles — architectural, grid-aligned. The second G slightly offset or interlocked with the first. Terracotta `#bf5c3a` as an accent stroke or corner detail. Clean, no serifs, no ornamental curves.

**Implementation:**
- [ ] Design inline SVG monogram (36×36 viewBox):
  - Both Gs built from `<rect>` and `<line>` or `<path>` with straight segments
  - Primary color: `#ffffff` (white on dark nav)
  - Accent: `#bf5c3a` (terracotta) on one element (e.g., a corner bracket or crossbar)
- [ ] Replace `<a href="#home" class="nav-logo" data-panel="panel-home">GG</a>` with SVG version
- [ ] Keep the anchor tag — just put SVG inside it
- [ ] In `styles.css`: update `.nav-logo` sizing — remove font styles, set `width: 36px; height: 36px; display: flex; align-items: center;`
- [ ] Create `favicon.svg` — same SVG adapted for 32×32, with navy `#0b1628` background square + white/terracotta GG on top
- [ ] Add to `index.html` `<head>`: `<link rel="icon" type="image/svg+xml" href="favicon.svg">`
- [ ] Add same favicon link to all 5 `case-study-*.html` `<head>` sections

**Verify:** Nav shows GG monogram; browser tab shows favicon; logo click navigates home.

---

### C1 — Hero: architectural drawing SVG background
**Effort:** 90 min · **Files:** `index.html`, `styles.css`

**What:** The hero currently uses only CSS grid lines (`.blueprint-bg`). The new design overlays actual architectural drawings: floor plan on the left half, user flow wireframe on the right half. These are decorative SVG layers, `pointer-events: none`, positioned absolutely.

**Implementation:**
- [ ] Inside `.hero` section in `index.html`, add two `<div>` wrappers (or direct SVGs):
  - `.hero-drawing--left`: floor plan SVG, `position: absolute; left: 0; top: 0; width: 35%; height: 100%; pointer-events: none; opacity: 0.55;`
  - `.hero-drawing--right`: user flow SVG, `position: absolute; right: 0; top: 0; width: 40%; height: 100%; pointer-events: none; opacity: 0.55;`
- [ ] Floor plan SVG content: rectangular rooms with internal walls — STUDY, LIVING ROOM, BATH, CORRIDOR labels, dimension tick marks
- [ ] User flow SVG content: boxes connected by arrows — SIGN IN → ONBOARD → DASHBOARD (center) → ANALYTICS / FEED / PROFILE (branches)
- [ ] Stroke color on both: `rgba(65,120,220,0.7)` (appears as `rgba(65,120,220,0.18)` after opacity)
- [ ] Add text labels: "FLOOR PLAN — LEVEL 01" top-left of left SVG; "USER FLOW — FRAGMENT" top-right of right SVG
- [ ] Ensure `.hero-content` has `position: relative; z-index: 1` so it sits above the drawings
- [ ] Keep existing `.blueprint-bg` grid lines — drawings layer on top

**Verify:** Hero shows floor plan left, user flow right; hero text is clearly above the drawings; drawings are visible but not overwhelming.

---

### C10 — Contact panel: match homepage background
**Effort:** 30 min · **Files:** `index.html`, `styles.css`

**What:** Contact panel currently uses `--navy-mid (#112240)` + CSS grid only. Change to `--navy (#0b1628)` + the same architectural SVG drawings as the hero. Creates a visual bookend — site opens and closes with the same identity.

**Implementation:**
- [ ] In `index.html` `#panel-contact`: change section class from `section--navy-mid` → `section--navy`
- [ ] Copy the `.hero-drawing--left` and `.hero-drawing--right` SVG blocks from the hero (done in C1) into the contact section
- [ ] Contact section needs `position: relative; overflow: hidden` to contain absolute SVGs
- [ ] Adjust SVG opacity if needed — contact has less content so drawings can be slightly more visible
- [ ] Update `.contact-email`, `.contact-linkedin`, `.footer-copy` colors — verify they're readable on `#0b1628` (they should be, already on dark bg)
- [ ] Remove `section--navy-mid` style if it becomes unused

**Verify:** Contact panel is same dark navy as hero; architectural drawings visible in background; all text readable.

---

### C6 — Work panel: projects from all roles
**Effort:** 90 min · **Files:** `app.js`, `index.html`, `styles.css`

**What:** Work panel currently shows 6 JindalX projects only. Expand to show all 4 career stages. Group by company.

**New projects data (from resume PDFs):**

```
OneValley (Sep 2020 – Jul 2022):
  tag: 'Platform · EdTech'
  title: 'Passport & PassportOS'
  detail: 'B2C and B2B platforms powering global entrepreneurship programs including Entrepreneurship World Cup. Served universities, banks, accelerators, and corporate incubators across India and international markets. Led user research, KPI frameworks, mentorship systems, and SaaS ecosystem integration.'
  metrics: ['B2B + B2C', 'Global reach', 'Multi-client SaaS']

Taccomacco (Jul 2017 – Sep 2020):
  tag: 'Content · Platform'
  title: 'Digital Content & Publishing Platform'
  detail: 'Built the content pipeline and publishing infrastructure for a digital-first edutainment company. Managed version control, creator workflows, and distribution. Ran a structured incubation program for 6+ content creators.'
  metrics: ['500+ titles launched', '6 creators incubated', 'Content pipeline']

RSP Design Consultants (Sep 2014 – Jun 2017):
  tag: 'Architecture · PM'
  title: 'Architectural Projects Portfolio'
  detail: 'Managed 40+ architectural and design projects across IT campuses, healthcare facilities, and institutional buildings. Introduced project management processes that reduced delivery time by 25% and maintained a 95% client retention rate.'
  metrics: ['40+ projects', '95% retention', '25% faster delivery']
```

**Implementation:**
- [ ] In `app.js`: add `company` field to all project objects; add 3 new project objects (OneValley, Taccomacco, RSP)
- [ ] Sort/group: JindalX (6) → OneValley (1) → Taccomacco (1) → RSP (1) = 9 total
- [ ] In `index.html`: update work panel header `<h2>` from "Built at JindalX" → "Products & Projects" and sub from "Enterprise products shipped from zero to production." → "10 years of product, platform, and design work across four roles."
- [ ] Add company group separator rows in the grid HTML — a full-width label row before each company's cards:
  ```html
  <div class="work-company-label">
    <span class="work-company-name">JindalX</span>
    <span class="work-company-period">Jun 2022 – May 2025</span>
  </div>
  ```
- [ ] In `styles.css`: add `.work-company-label` styles — full-width, cream bg, terracotta label text, small caps, border-top
- [ ] Ensure `openProjectModal(idx)` in `app.js` still works with expanded projects array (index-based, will work automatically)

**Verify:** Work panel shows 4 company groups with 9 total project cards; clicking any card opens correct modal.

---

### C4 — Case study pages: paginated
**Effort:** 120 min · **Files:** all 5 `case-study-*.html`, `case-study.css`

**What:** Replace the long single-page scroll with page-by-page navigation. Each "page" is a group of 3-4 existing `cs-section` elements. Users click large arrow buttons at the bottom to advance.

**Pagination logic (per case study):**
- Identify all `<section class="cs-section">` elements in each file
- Group them into pages (roughly equal, ~3-4 sections per page; max 6 pages)
- Wrap each group in `<div class="cs-page" data-page="1">` etc.
- Only the active page is visible; others are `display: none`
- Arrow buttons: `← PREV` (disabled/faded on page 1) and `NEXT →` (disabled on last page)
- Page counter: "Page 2 of 6" between the arrows

**New CSS (add to `case-study.css`):**
```css
.cs-page { display: none; }
.cs-page.is-active { display: block; animation: cs-fade 0.3s ease; }
@keyframes cs-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.cs-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 48px 0 80px;
  position: sticky;
  bottom: 0;
  background: #f7f3ee;
}
.cs-page-btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0b1628;
  background: none;
  border: 1.5px solid #0b1628;
  padding: 12px 28px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.cs-page-btn:hover { background: #0b1628; color: #fff; }
.cs-page-btn:disabled { opacity: 0.25; cursor: default; }
.cs-page-btn:disabled:hover { background: none; color: #0b1628; }
.cs-page-counter {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #6b6560;
}
```

**New JS (inline `<script>` at bottom of each case study HTML):**
```js
(function() {
  var pages = document.querySelectorAll('.cs-page');
  var counter = document.getElementById('cs-counter');
  var prevBtn = document.getElementById('cs-prev');
  var nextBtn = document.getElementById('cs-next');
  var current = 0;

  function show(n) {
    pages[current].classList.remove('is-active');
    current = Math.max(0, Math.min(n, pages.length - 1));
    pages[current].classList.add('is-active');
    counter.textContent = 'Page ' + (current + 1) + ' of ' + pages.length;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === pages.length - 1;
    window.scrollTo(0, 0);
  }

  prevBtn.addEventListener('click', function() { show(current - 1); });
  nextBtn.addEventListener('click', function() { show(current + 1); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  show(0);
})();
```

**Pagination HTML to add (before closing `</main>`):**
```html
<div class="cs-pagination">
  <button class="cs-page-btn" id="cs-prev">← Prev</button>
  <span class="cs-page-counter" id="cs-counter">Page 1 of N</span>
  <button class="cs-page-btn" id="cs-next">Next →</button>
</div>
```

**Per-file grouping (approximate, adjust to content):**
- `case-study-blinkit.html` (20 sections) — 5 pages of 4 sections each
- `case-study-founder-crm.html` — group similarly once section count confirmed
- `case-study-youtube.html` — group similarly
- `case-study-group-travel.html` — group similarly
- `case-study-vitae.html` — group similarly

**Implementation tasks:**
- [ ] Add `.cs-page` CSS + animation + `.cs-pagination` styles to `case-study.css`
- [ ] `case-study-blinkit.html`: wrap sections into pages, add pagination HTML + JS
- [ ] `case-study-founder-crm.html`: wrap sections into pages, add pagination HTML + JS
- [ ] `case-study-youtube.html`: wrap sections into pages, add pagination HTML + JS
- [ ] `case-study-group-travel.html`: wrap sections into pages, add pagination HTML + JS
- [ ] `case-study-vitae.html`: wrap sections into pages, add pagination HTML + JS
- [ ] Remove `.cs-toc` table of contents from each file (pagination replaces it)
- [ ] Test keyboard nav (← → arrows) on each file

**Verify:** Each case study page shows 1 page of content with ← PREV / NEXT → buttons; arrows advance/retreat correctly; keyboard works; scroll resets to top on page change.

---

## Session Log

| Date | Session | Changes completed |
|------|---------|------------------|
| 2026-04-26 | Session 1 | Planning, `Changes_26 Apr.md` created |
| 2026-04-26 | Session 1 | C9, C7, C2, C3, C5, C8, C1, C10, C6, C4 — all 10 changes implemented |

---

## Quick Status Summary

| ID | Change | Status |
|----|--------|--------|
| C9 | Remove "View Work" button | [x] |
| C7 | Nav bar blueprint grid | [x] |
| C2 | Graph-paper grid on cream panels | [x] |
| C3 | Full-screen backgrounds | [x] |
| C5 | Color & contrast audit | [x] |
| C8 | GG Logo SVG + favicon | [x] |
| C1 | Hero architectural drawing SVGs | [x] |
| C10 | Contact panel = homepage bg | [x] |
| C6 | Work panel — all roles | [x] |
| C4 | Case study pagination | [x] |
