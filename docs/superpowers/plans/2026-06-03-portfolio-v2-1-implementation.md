# Portfolio v2.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the v2.1 design spec — replace Bodoni Moda with Space Mono at display scale, purge all v1 legacy color tokens, redesign the hero section with an Architecture Stack + Build Log diagram, and fix minor nav issues.

**Architecture:** All changes are plain HTML/CSS/vanilla JS — no build step. The hero canvas (`initSystemsCanvas`) is replaced by a static HTML/CSS structure with a one-shot JS animation. Typography change is a single CSS variable swap that propagates to all 20+ usages automatically.

**Tech Stack:** HTML5, CSS3 custom properties, vanilla ES5-compatible JS (IIFE pattern, no modules), Google Fonts CDN.

**Spec:** `docs/superpowers/specs/2026-06-03-portfolio-v2-1-design.md`

**Verify after each task:** `node --check app.js` (must print nothing = no syntax errors)

---

## File Map

| File | Changes |
|---|---|
| `index.html` | Font link (remove Bodoni), hero section markup (replace canvas → stack diagram), hero headline/sub/CTAs, stats strip, theme toggle SVG |
| `styles.css` | `--font-display` token, `.display-xl/l/m` weights, legacy color replacement (52+ lines), surface border rules, stack diagram styles, hero layout adjustments |
| `app.js` | Replace `initSystemsCanvas()` with `initStackDiagram()` |

---

## Task 1: Swap Display Font Token + Remove Bodoni from Google Fonts

**Files:**
- Modify: `styles.css:41`
- Modify: `index.html:22`

- [ ] **Step 1.1: Change `--font-display` in styles.css**

Find line 41 in `styles.css`:
```css
--font-display: 'Bodoni Moda', Georgia, serif;
```
Replace with:
```css
--font-display: 'Space Mono', 'Courier New', monospace;
```

- [ ] **Step 1.2: Remove Bodoni Moda from Google Fonts link in index.html**

Find line 22 in `index.html`:
```html
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```
Replace with (Bodoni Moda removed, DM Sans and Space Mono retained):
```html
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] **Step 1.3: Update display class weights and letter-spacing for Space Mono**

Find lines 95–97 in `styles.css`:
```css
.display-xl { font-family: var(--font-display); font-size: clamp(48px, 6vw, 80px);  font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; }
.display-l  { font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px);  font-weight: 400; letter-spacing: -0.01em; line-height: 1.1;  }
.display-m  { font-family: var(--font-display); font-size: clamp(24px, 3vw, 32px);  font-weight: 400; line-height: 1.2;  }
```
Replace with (Space Mono uses 700 weight; negative letter-spacing wrong for mono — reset to 0 or slight negative):
```css
.display-xl { font-family: var(--font-display); font-size: clamp(36px, 5vw, 64px);  font-weight: 700; letter-spacing: -0.03em; line-height: 1.1;  }
.display-l  { font-family: var(--font-display); font-size: clamp(28px, 3.5vw, 44px); font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
.display-m  { font-family: var(--font-display); font-size: clamp(22px, 2.5vw, 30px); font-weight: 700; letter-spacing: -0.01em; line-height: 1.25; }
```

Note: Space Mono at large scale needs slightly smaller max sizes than Bodoni Moda (mono is wider per character) and tighter negative letter-spacing to keep it compact.

- [ ] **Step 1.4: Verify no syntax errors**

```
node --check app.js
```
Expected: no output (clean).

Open `index.html` in browser. Panel titles and hero headline should now render in Space Mono. Confirm font loaded correctly (inspect element, computed styles).

- [ ] **Step 1.5: Commit**

```
git add styles.css index.html
git commit -m "design: swap display font to Space Mono, remove Bodoni Moda"
```

---

## Task 2: Purge Legacy v1 Color Tokens from styles.css

Replace all hardcoded v1 color values with the v2 design system tokens. Rule: no hardcoded hex values for colors that have a token equivalent.

**Files:**
- Modify: `styles.css` (52+ replacements)

**Token mapping:**

| Old (v1) | New (v2 token) | Context |
|---|---|---|
| `#0b1628` (navy) | `var(--c-bg)` or `var(--c-raised)` | Background contexts → `--c-bg`; nav/card contexts → `--c-raised` |
| `#f7f3ee` (cream) | `var(--c-text)` | Text on dark; `var(--c-bg)` for bg in light contexts |
| `#bf5c3a` (terra) | `var(--c-accent)` | Primary accent → `--c-accent`; hover/link → `--c-accent` |
| `#2d5da1` (blue) | `var(--c-accent)` | Was used for "tech" category badges — map to accent |
| `#3d5c3a` (forest) | `var(--c-text-2)` | Was used for "arch" category — map to secondary text |

- [ ] **Step 2.1: Replace all `#0b1628` references**

There are ~10 occurrences. Each must be checked in context:
- `.section--navy { background: #0b1628; }` → `background: var(--c-raised);`
- `#gate { background-color: #0b1628; }` → `background-color: var(--c-bg);`
- `.hero { background-color: #0b1628; }` → `background-color: var(--c-bg);`
- `.modal-btn--primary { background: #0b1628; ... }` → use `var(--c-bg)` for background, `var(--c-text)` for text
- `.cs-row:hover { background: #0b1628; }` → `background: var(--c-subtle);`
- Any `color: #0b1628` (text in light context) → `var(--c-text)` or `var(--c-raised)`

Run this Grep to find all occurrences before editing:
```
grep -n "0b1628" styles.css
```

For each occurrence, replace with the contextually correct v2 token from the mapping above.

- [ ] **Step 2.2: Replace all `#bf5c3a` (terra) references**

There are ~20 occurrences. All map to `var(--c-accent)`:
- `color: #bf5c3a` → `color: var(--c-accent)`
- `background: #bf5c3a` → `background: var(--c-accent)`
- `border-color: #bf5c3a` → `border-color: var(--c-accent)`
- `box-shadow: 0 0 0 1.5px #bf5c3a` → `box-shadow: 0 0 0 1.5px var(--c-accent)`
- `rgba(191,92,58,0.09)` → `rgba(201,168,76,0.09)` (accent at 9% opacity — no token for rgba, use literal with amber values)
- `rgba(191,92,58,0.28)` → `rgba(201,168,76,0.18)` (glow — reduce opacity slightly, amber is lighter)

Run: `grep -n "bf5c3a\|191,92,58" styles.css`

- [ ] **Step 2.3: Replace `#f7f3ee` (cream) references**

~5 occurrences:
- `background-color: #f7f3ee` (`.section--cream`) → `var(--c-subtle)`
- `border: 2px solid #f7f3ee` → `border: 1px solid var(--c-border)`
- `color: #f7f3ee` → `var(--c-text)`
- `#gate-btn:hover:not(:disabled) { background: #f7f3ee; }` → `background: var(--c-text); color: var(--c-bg);`

Run: `grep -n "f7f3ee" styles.css`

- [ ] **Step 2.4: Replace `#2d5da1` (blue) and `#3d5c3a` (forest)**

- `color: #2d5da1` → `color: var(--c-accent)`
- `.career-arc-seg--tech { background: #2d5da1; }` → `background: var(--c-accent);`
- `.exp-badge--tech { color: #2d5da1; background: rgba(45,93,161,0.09); }` → `color: var(--c-accent); background: rgba(201,168,76,0.09);`
- `.exp-dot--tech { background: #2d5da1; box-shadow: 0 0 0 1.5px #2d5da1; }` → use `var(--c-accent)`
- `color: #3d5c3a` → `color: var(--c-text-2)`
- `.career-arc-seg--arch { background: #3d5c3a; }` → `background: var(--c-text-2);`

Run: `grep -n "2d5da1\|3d5c3a" styles.css`

- [ ] **Step 2.5: Verify no legacy colors remain**

```
grep -c "0b1628\|bf5c3a\|f7f3ee\|2d5da1\|3d5c3a" styles.css
```
Expected output: `0`

If non-zero, find remaining occurrences: `grep -n "0b1628\|bf5c3a\|f7f3ee\|2d5da1\|3d5c3a" styles.css` and fix.

- [ ] **Step 2.6: Verify no syntax errors, commit**

```
node --check app.js
```

Open browser, cycle through all panels. Verify visual consistency — nothing should look dramatically broken, colors should be cohesive (all amber/dark).

```
git add styles.css
git commit -m "design: purge all v1 legacy color tokens, replace with v2 design system"
```

---

## Task 3: Surface Contrast Fix + Border System

**Files:**
- Modify: `styles.css`

- [ ] **Step 3.1: Add explicit nav border**

Find the `.nav` ruleset (around line 332). Add a bottom border:
```css
.nav {
  /* existing rules ... */
  border-bottom: 1px solid var(--c-border);
}
```

- [ ] **Step 3.2: Add explicit card/raised-surface borders**

Find or create rules for `.panel > section`, `.modal`, and any `.card` elements. Add:
```css
/* Surface elevation via border, not shadow */
.work-row,
.cs-row,
.proj-row,
.cred-row {
  border-bottom: 1px solid var(--c-border);
}
```

- [ ] **Step 3.3: Commit**

```
git add styles.css
git commit -m "design: add border system for surface contrast — nav, rows, cards"
```

---

## Task 4: Theme Toggle — Replace ● Glyph with SVG Icon

**Files:**
- Modify: `index.html:72`
- Modify: `styles.css` (theme-toggle styles)

- [ ] **Step 4.1: Replace the toggle button content in index.html**

Find line 72:
```html
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle light/dark">&#9679;</button>
```
Replace with inline SVGs for sun and moon (moon shown in dark mode, sun in light mode):
```html
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle light/dark">
      <svg class="theme-icon theme-icon--moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <svg class="theme-icon theme-icon--sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
```

- [ ] **Step 4.2: Add CSS to show correct icon per theme**

Find the `.theme-toggle` ruleset in `styles.css`. Add icon visibility rules:
```css
/* Dark mode (default): show moon */
.theme-icon--sun  { display: none; }
.theme-icon--moon { display: block; }

/* Light mode: show sun */
body.theme-light .theme-icon--sun  { display: block; }
body.theme-light .theme-icon--moon { display: none; }
```

- [ ] **Step 4.3: Verify, commit**

Open browser, verify moon icon visible in dark mode. Click toggle — sun icon appears in light mode. Click again — back to moon.

```
git add index.html styles.css
git commit -m "design: replace theme toggle glyph with sun/moon SVG icons"
```

---

## Task 5: Hero Section — Replace Canvas with Stack Diagram HTML

**Files:**
- Modify: `index.html` (lines 80–102)

- [ ] **Step 5.1: Replace hero left side content**

Find the current hero left side (lines 83–96):
```html
          <div class="home-hero__left">
            <p class="home-eyebrow label">Senior PM + AI Strategist &mdash; Jaipur, India</p>
            <h1 class="home-headline display-xl">
              Architecture is how I think.<br>
              Products are what I build.
            </h1>
            <p class="home-sub body-l">
              Building at the intersection of systems thinking, product design, and AI.
            </p>
            <div class="home-ctas">
              <a class="cta-primary" data-panel="panel-projects">Projects &rarr;</a>
              <a class="cta-secondary" data-panel="panel-work">Work &nearr;</a>
            </div>
          </div>
```
Replace with:
```html
          <div class="home-hero__left">
            <p class="home-eyebrow label">Senior PM &amp; AI Strategist &mdash; Jaipur, India</p>
            <h1 class="home-headline display-xl">
              I design systems that make enterprises operate differently.
            </h1>
            <p class="home-sub body-l">
              Former structural engineer. 10 years shipping products at the intersection of enterprise scale and AI.
            </p>
            <div class="home-ctas">
              <a class="cta-primary" data-panel="panel-work">View Work &rarr;</a>
              <a class="cta-secondary" href="GauravGupta_Resume_2026.pdf" target="_blank" rel="noopener">Download Resume</a>
            </div>
            <div class="home-stats">
              <span class="home-stat label">10Y Experience</span>
              <span class="home-stat-sep">&middot;</span>
              <span class="home-stat label">16 Enterprise Clients</span>
              <span class="home-stat-sep">&middot;</span>
              <span class="home-stat label">7 Products Shipped</span>
            </div>
          </div>
```

- [ ] **Step 5.2: Replace hero right side canvas with stack diagram**

Find lines 97–99:
```html
          <div class="home-hero__right">
            <canvas id="hero-canvas" class="hero-canvas"></canvas>
          </div>
```
Replace with:
```html
          <div class="home-hero__right">
            <div class="stack-diagram" id="stack-diagram">
              <div class="stack-frame">
                <div class="stack-layer">
                  <div class="stack-layer-header">
                    <span class="stack-layer-title">AI Product Strategy</span>
                    <span class="stack-layer-date label">2024 &rarr; present</span>
                  </div>
                  <div class="stack-layer-logs">
                    <div class="stack-log-entry"></div>
                    <div class="stack-log-entry"></div>
                  </div>
                </div>
                <div class="stack-layer">
                  <div class="stack-layer-header">
                    <span class="stack-layer-title">Product Systems</span>
                    <span class="stack-layer-date label">2022 &rarr; 2025</span>
                  </div>
                  <div class="stack-layer-logs">
                    <div class="stack-log-entry"></div>
                    <div class="stack-log-entry"></div>
                  </div>
                </div>
                <div class="stack-layer">
                  <div class="stack-layer-header">
                    <span class="stack-layer-title">Enterprise Operations</span>
                    <span class="stack-layer-date label">2015 &rarr; 2022</span>
                  </div>
                  <div class="stack-layer-logs">
                    <div class="stack-log-entry"></div>
                    <div class="stack-log-entry"></div>
                  </div>
                </div>
                <div class="stack-layer">
                  <div class="stack-layer-header">
                    <span class="stack-layer-title">Structural Engineering</span>
                    <span class="stack-layer-date label">2009 &rarr; 2014</span>
                  </div>
                  <div class="stack-layer-logs">
                    <div class="stack-log-entry"></div>
                    <div class="stack-log-entry"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
```

- [ ] **Step 5.3: Commit HTML structure**

```
git add index.html
git commit -m "feat: replace hero canvas with Architecture Stack + Build Log structure"
```

---

## Task 6: Stack Diagram CSS

**Files:**
- Modify: `styles.css`

Add these rules at the end of the hero section styles (after the `.home-hero` block):

- [ ] **Step 6.1: Add stack diagram styles to styles.css**

Find the end of the hero-related CSS block and append:
```css
/* ---- Architecture Stack Diagram ---- */
.stack-diagram {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
}

.stack-frame {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0;
  transition: border-color 0.5s ease;
}

.stack-diagram.stack-solidified .stack-frame {
  border-color: var(--c-border);
}

.stack-layer {
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid transparent;
  transition: border-color 0.5s ease 0.1s;
}

.stack-layer:first-child {
  border-top: none;
}

.stack-diagram.stack-solidified .stack-layer + .stack-layer {
  border-top-color: var(--c-border);
}

.stack-layer-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-1);
}

.stack-layer-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: transparent;
  transition: color 0.4s ease 0.4s;
}

.stack-diagram.stack-solidified .stack-layer-title {
  color: var(--c-accent);
}

.stack-layer-date {
  font-size: 10px;
  color: var(--c-text-3);
}

.stack-log-entry {
  font-size: 12px;
  color: var(--c-text-2);
  line-height: 1.8;
  min-height: 1.4em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Stats strip below hero CTAs */
.home-stats {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  flex-wrap: wrap;
}

.home-stat {
  color: var(--c-text-2);
}

.home-stat-sep {
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: 12px;
}

/* Mobile: stack diagram collapses on small screens */
@media (max-width: 768px) {
  .stack-log-entry { font-size: 11px; }
  .stack-layer { padding: var(--space-1) var(--space-2); }
}
```

- [ ] **Step 6.2: Verify hero renders with correct structure**

Open browser, navigate to Home panel. Should see:
- Left: new headline in Space Mono, subheadline in DM Sans, View Work + Download Resume CTAs, stats strip
- Right: four layers of the stack diagram (unstyled/transparent borders until animation runs)

- [ ] **Step 6.3: Commit CSS**

```
git add styles.css
git commit -m "design: add Architecture Stack diagram CSS with animation states"
```

---

## Task 7: Stack Animation JS — Replace initSystemsCanvas

**Files:**
- Modify: `app.js` (lines 707–857, the entire `initSystemsCanvas` function)

The log content (one array, all 8 entries in order matching the 8 `.stack-log-entry` elements):

- [ ] **Step 7.1: Replace `initSystemsCanvas` function in app.js**

Find lines 707–857 (the block from `/* SYSTEMS CANVAS */` to the closing `}` of `initSystemsCanvas`). Replace the entire block with:

```javascript
  /* ============================================================
     ARCHITECTURE STACK — Hero Right Pane
     ============================================================ */
  function initStackDiagram() {
    var diagram = document.getElementById('stack-diagram');
    if (!diagram) return;

    var LOG_LINES = [
      '[2024] SCALE  ai.products → 7 deployed',
      '[2025] CONSULT  16 enterprise clients',
      '[2022] MIGRATE  → enterprise.pm @ JindalX',
      '[2023] INTEGRATE  airtable.platform × 16',
      '[2015] DEPLOY  ops.systems × RSP Group',
      '[2019] OPTIMIZE  process.efficiency → JindalX',
      '[2009] INIT  civil.engineering @ MNIT',
      '[2014] BUILD  load.bearing.thinking'
    ];

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var entries = diagram.querySelectorAll('.stack-log-entry');
    var hasAnimated = false;

    function showInstant() {
      entries.forEach(function (el, i) {
        el.textContent = LOG_LINES[i] || '';
      });
      diagram.classList.add('stack-solidified');
    }

    function animateStack() {
      if (hasAnimated) return;
      hasAnimated = true;

      if (prefersReduced) { showInstant(); return; }

      var MS_PER_CHAR = 16;
      var LINE_GAP    = 100;
      var totalDelay  = 0;

      entries.forEach(function (el, i) {
        var text = LOG_LINES[i] || '';
        var startAt = totalDelay;
        totalDelay += text.length * MS_PER_CHAR + LINE_GAP;

        setTimeout(function () {
          var pos = 0;
          var tick = setInterval(function () {
            pos += 1;
            el.textContent = text.slice(0, pos);
            if (pos >= text.length) {
              clearInterval(tick);
              if (i === entries.length - 1) {
                setTimeout(function () {
                  diagram.classList.add('stack-solidified');
                }, 200);
              }
            }
          }, MS_PER_CHAR);
        }, startAt);
      });
    }

    document.addEventListener('panel:activate', function (e) {
      if (e.detail.panelId === 'panel-home') {
        animateStack();
      }
    });

    // Also run if panel-home is already active on page load
    if (document.getElementById('panel-home') &&
        document.getElementById('panel-home').classList.contains('is-active')) {
      animateStack();
    }
  }
```

- [ ] **Step 7.2: Update the init call at the bottom of app.js**

Find near line 1089:
```javascript
  initSystemsCanvas();
```
Replace with:
```javascript
  initStackDiagram();
```

- [ ] **Step 7.3: Verify no syntax errors**

```
node --check app.js
```
Expected: no output.

- [ ] **Step 7.4: Test animation in browser**

Open `index.html`, navigate to Home panel. Expected sequence:
1. Right side shows four stack layers with empty log lines
2. Log entries type in one by one (left to right, character by character) over ~3 seconds
3. Stack borders (outer frame + layer dividers) fade in after last line completes
4. Amber layer titles fade in last
5. Nothing moves after that — static forever

Navigate away to Experience, then back to Home. Animation does NOT replay (hasAnimated flag).

If `prefers-reduced-motion` is enabled in OS settings, all text appears instantly with no animation.

- [ ] **Step 7.5: Commit**

```
git add app.js
git commit -m "feat: Architecture Stack + Build Log animation replaces hero canvas"
```

---

## Task 8: Final QA Pass + Merge Prep

- [ ] **Step 8.1: Node syntax check**

```
node --check app.js
node --check gate.js
```
Both: no output.

- [ ] **Step 8.2: Browser QA checklist**

Open `index.html` in Chrome and Firefox. For each panel, verify:

| Check | Expected |
|---|---|
| Home headline | "I design systems that make enterprises operate differently." in Space Mono Bold |
| Home right side | Stack diagram with typewriter animation on first visit |
| Panel titles (Experience, Work, etc.) | Space Mono SemiBold, no Bodoni |
| Accent color | Amber `#c9a84c` — no terra `#bf5c3a` red-orange visible anywhere |
| Nav | Bottom border visible, no blur |
| Theme toggle | Moon icon in dark mode; click → sun icon in light mode; full site recolors |
| Download Resume | Opens `GauravGupta_Resume_2026.pdf` in new tab |
| Mobile (< 768px) | Stack diagram readable, headline wraps cleanly |

- [ ] **Step 8.3: Check for any remaining legacy colors in browser**

Open DevTools → Elements → search for `#0b1628` or `#bf5c3a` in computed styles on any panel. Should find nothing.

- [ ] **Step 8.4: Final commit**

```
git add -A
git status
```

Review untracked/modified files. Do NOT commit: `.claude/`, `.vscode/`, `AGENTS.md`, `GEMINI.md`, `Analysis/`, `Documentation/`, `docs/superpowers/` (already committed). Only commit `index.html`, `styles.css`, `app.js` if any last fixes.

- [ ] **Step 8.5: Push dev branch**

```
git push origin dev
```

Verify Vercel preview deploy URL is generated. QA the preview deploy in browser — confirms production build matches local.

---

## Self-Review Against Spec

| Spec requirement | Task |
|---|---|
| Space Mono display — hero headline 64px Bold | Task 1, Task 5 |
| Space Mono panel titles 40–48px SemiBold | Task 1 (via `--font-display` token propagation) |
| DM Sans body/UI unchanged | Task 1 (not touched) |
| Bodoni Moda removed entirely | Task 1 |
| All v2 color tokens unchanged | Task 2 (preserved, only hardcoded replacements) |
| Legacy v1 tokens purged | Task 2 |
| Surface contrast fix (nav border) | Task 3 |
| Theme toggle SVG icon | Task 4 |
| Hero headline: "I design systems..." | Task 5 |
| Hero subheadline: "Former structural engineer..." | Task 5 |
| CTAs: View Work + Download Resume | Task 5 |
| Stats strip: 10Y / 16 clients / 7 products | Task 5 |
| Hero right: Stack diagram HTML | Task 5 |
| Stack diagram CSS + animation states | Task 6 |
| Build log typewriter + border solidification | Task 7 |
| Animation plays once, never repeats | Task 7 (`hasAnimated` flag) |
| prefers-reduced-motion respected | Task 7 (`showInstant` path) |

**Not in this plan (Plan B — separate session):**
- Work panel modal wiring
- Skills panel restoration  
- Contact canvas (4-node bookend)
- Philosophy panel (7 principles, 4-col grid)
- Stats accuracy audit against resume PDF
