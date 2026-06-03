# Portfolio Design Spec — v2.1 (Purpose-Derived)

**Date:** 2026-06-03  
**Status:** Approved  
**Replaces:** v2 brand guide (2026-05-18) — typography section only. Color tokens unchanged.

---

## Purpose Statement

> "This portfolio is the inevitable artifact of a career built with precision and intent. Before reading a word, the viewer should feel: this person has done a great deal, and done it well — and this is simply what that looks like. Nothing here is trying to impress. It just is."

**Testable form:** In 5 seconds, a hiring manager at Notion or Linear must feel — *this person operates the way we do: systems thinking, restraint, no wasted motion.*

**References:** Apple ecosystem (systems felt through coherence, not illustration) + Anthropic/Claude tools (warm accent on dark, intelligence expressed through restraint).

---

## Inevitability Test Results

| Element | Result | Reason |
|---|---|---|
| Dark base `#0e0e12` | PASS | Apple Dark Mode, Anthropic Console. Confident. |
| Amber accent `#c9a84c` | PASS | Anthropic's warm palette validates single warm accent on dark. |
| DM Sans body | PASS | Clean, neutral, Apple-adjacent. No drama. |
| Space Mono labels | PASS | Technical, architectural. Matches career background. |
| Bodoni Moda display | **FAIL** | Editorial/luxury. Works equally on whiskey brand — not inevitable for this person. |
| Space Mono at display scale | PASS | Architectural, technical, specific. Doubles down on systems identity. |
| Blueprint grid | PASS | Architectural drafting reference. Earned by background. |

---

## Design Language

### Typography

| Role | Font | Size / Weight |
|---|---|---|
| Hero headline | Space Mono | Bold, 64–72px |
| Panel titles | Space Mono | SemiBold, 40–48px |
| Body / UI / nav / buttons | DM Sans | Regular/Medium, 16–18px |
| Meta / labels / dates / stats / tags | Space Mono | Regular, 11–13px |

**Bodoni Moda: removed entirely.** Two fonts total: DM Sans + Space Mono.

### Color Tokens (unchanged from v2)

| Token | Value | Rule |
|---|---|---|
| `--bg-base` | `#0e0e12` | Base canvas |
| `--bg-raised` | `#1a1a22` | Nav, cards, modals |
| `--bg-subtle` | `#242432` | Hover, dividers |
| `--text-primary` | `#ece8e2` | All primary text |
| `--text-secondary` | `#9896a0` | Meta, labels |
| `--text-muted` | `#56546e` | Disabled, placeholder |
| `--accent` | `#c9a84c` | Max 8% of any screen |
| `--accent-dim` | `#8a6f2e` | Accent in secondary context |
| `--border` | `#2a2a38` | Dividers — prefer spacing over borders |
| `--radius` | `4px` | Everywhere. No exceptions. |
| `--radius-pill` | `2px` | Tags, pills |

**Surface contrast fix (new):** Add explicit 1px `--border` between nav/card surfaces and `--bg-base`. Current lightness delta (~12) is too small — surfaces blur together.

### Shape
- `--radius: 4px` everywhere. No softening.
- No drop shadows. Use border or `--bg-subtle` shift for elevation.

### Motion
- Panel transitions: ≤150ms ease
- Hero animation: build log types in (~3s), stack borders solidify (~0.5s). Plays once on load, never repeats.
- Contact canvas: near-static (slow drift, subtle cursor attraction). Never attention-seeking.
- No other animations.

### Legacy Removal
All 52+ v1 color references (`#0b1628`, `#bf5c3a`, `#f7f3ee`) must be purged from `styles.css`. Two design systems cannot coexist. This is a hard requirement for v2.1.

---

## Hero Section — panel-home

### Left Side
- **Headline:** "I design systems that make enterprises operate differently." — Space Mono Bold, 64px
- **Subheadline:** "Senior PM & AI Strategist. Former structural engineer. 10 years shipping products at the intersection of enterprise scale and AI." — DM Sans 18px, `--text-secondary`
- **CTAs:** "View Work" (primary, `--accent` bg) + "Download Resume" (secondary, transparent + border)
- **Stats strip:** `10Y EXPERIENCE` · `16 ENTERPRISE CLIENTS` · `7 PRODUCTS SHIPPED` — Space Mono 12px, `--text-secondary`. Values from resume PDF.

### Right Side — Architecture Stack + Build Log

A blueprint-style cross-section diagram. Space Mono throughout. Blueprint grid behind. Amber on layer titles. Dimension annotation lines on left/right edges.

```
┌─────────────────────────────────────────────────┐
│  AI PRODUCT STRATEGY          2024 → present    │
│  [2024] SCALE  ai.products → 7 deployed         │
│  [2025] CONSULT  16 enterprise clients          │
├─────────────────────────────────────────────────┤
│  PRODUCT SYSTEMS              2022 → 2025       │
│  [2022] MIGRATE  → enterprise.pm @ JindalX      │
│  [2023] INTEGRATE  airtable.platform × 16       │
├─────────────────────────────────────────────────┤
│  ENTERPRISE OPERATIONS        2015 → 2022       │
│  [2015] DEPLOY  ops.systems × RSP Group         │
│  [2019] OPTIMIZE  process.efficiency → JindalX  │
├─────────────────────────────────────────────────┤
│  STRUCTURAL ENGINEERING       2009 → 2014       │
│  [2009] INIT  civil.engineering @ MNIT          │
│  [2014] BUILD  load.bearing.thinking            │
└─────────────────────────────────────────────────┘
```

### Load Animation (plays once)
1. Log entries type in line by line, top to bottom. Space Mono cursor blinks between entries. ~3s total.
2. After all lines visible: outer frame + horizontal dividers draw in. ~0.5s ease.
3. Amber color fades into layer titles last.
4. Static forever after.

---

## All Other Panels

Carry the same tokens, type system, and shape rules. No panel-specific design changes in this spec. See implementation plan for panel-level fixes (Work modal wiring, Skills panel restoration, Contact canvas, stats correction, theme toggle icon).

---

## What This Spec Does NOT Change
- Color tokens (v2 values preserved)
- Panel structure / navigation
- Canvas behavior beyond hero (addressed in implementation plan)
- Per-panel content (source of truth: `GauravGupta_Resume_2026.pdf`)
- Tech stack (separate session)
- Framework docs (separate session in progress)
