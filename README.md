# Portfolio Website — gauravg-portfolio.vercel.app

> A zero-dependency SPA built with plain HTML, CSS, and vanilla JavaScript. No framework, no npm, no build step.

**Stage:** Shipped · Live &nbsp;|&nbsp; **Stack:** HTML · CSS · Vanilla JS · Supabase

---

## The Problem

Most portfolio sites are built with React or Next.js — which means a build pipeline, node_modules, and framework overhead for what is fundamentally a read-mostly document. The goal was to ship a polished, production-quality portfolio with zero dependencies and nothing that couldn't be opened by double-clicking `index.html`.

## What I Built

An 8-panel SPA where the entire site lives in a single `index.html`. Navigation switches panels with a CSS class toggle — no routing library, no state management. A Blueprint-to-Bits design system (cream/navy/terracotta, Cormorant Garamond + DM Sans) gives it a distinct visual identity.

Key design decisions:
- **Panel-based SPA** — `body: overflow: hidden`; panels are full-viewport divs switched by `data-panel` attribute + vanilla JS
- **Email gate** — first-time visitors submit email before viewing; captured to Supabase; `?r=1` bypass for recruiters
- **Canvas animations** — two hand-coded canvas sketches (12-node systems map on hero, 4-node contact bookend) drawn with vanilla Canvas API
- **0 npm dependencies** — Supabase JS loaded via CDN; everything else is hand-written

## Structure

```
index.html        — All 8 panels + modal + mobile nav overlay
styles.css        — Full design system (~2,100 lines)
app.js            — Panel nav, canvas, modals, project data
gate.js           — Email gate + Supabase integration
case-study.css    — Shared styles for case study pages
case-study-*.html — 5 case study pages
```

## Features

| Feature | Implementation |
|---------|---------------|
| Panel navigation | Vanilla JS + CSS class toggle |
| Email gate | Supabase anon insert + localStorage |
| Mobile nav | Full-screen overlay with hamburger toggle |
| Work modals | 9 project entries with 3-part narrative |
| Projects panel | 5 case studies + 4 personal projects, stage filter |
| Canvas | 12-node hero map + 4-node contact bookend |
| Hash routing | `#experience` → activates `panel-experience` on load |

## Links

- **Live site:** https://gauravg-portfolio.vercel.app
- **Recruiter view:** https://gauravg-portfolio.vercel.app/?r=1
- **Portfolio:** https://gauravg-portfolio.vercel.app

---

> Built by [Gaurav Gupta](https://linkedin.com/in/ar-gaurav) — Senior PM & AI Strategist
