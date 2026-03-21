# My Portfolio

## What this is
A personal portfolio website. Built with plain HTML, CSS, and vanilla JavaScript only. No frameworks, no React, no Tailwind, no build tools.

## Design
- Dark theme (Linear/Vercel aesthetic) -- bg #0F0F13, surface #1A1A23, accent #7C6CF7
- Fonts: Plus Jakarta Sans (body) + JetBrains Mono (labels, tags, metadata)
- Tab-based navigation with 4 tabs: Home, Experience, Work, Credentials
- Fixed top nav bar with frosted glass backdrop blur
- Fade transitions between tab panels
- Mobile-first responsive -- 44px touch targets, no horizontal scroll

## Navigation structure
- **Home** -- Hero (photo, name, tagline, intro) + Contact links
- **Experience** -- Work timeline (4 roles)
- **Work** -- Featured Projects (6 cards, 2-col grid) + Case Studies (4 placeholder cards, full-width)
- **Credentials** -- Skills & Tools (6 groups) + Education & Certifications
- URL hash routing (#home, #experience, #work, #credentials) with browser back/forward support

## Tech constraints
- Plain HTML + CSS + vanilla JavaScript ONLY
- No frameworks, no libraries (except Supabase JS client via CDN)
- No npm, no build steps, no bundlers
- The site must work by simply opening index.html in a browser

## File structure
- index.html -- the main page (all 4 tab panels)
- styles.css -- all styles (dark theme)
- tabs.js -- tab switching, URL hash routing, panel transitions
- gate.js -- email gate logic (Supabase integration, localStorage bypass)
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
- 4 placeholder cards under the Work tab, below Featured Projects
- Each card: label (Case Study 01-04), title, tag, problem, approach, outcome metrics
- "Full case study coming soon" placeholder CTA
- Full-width layout with left accent border (purple gradient)
- Content to be filled in from PM cohort work and personal projects

## About me
- Name: Gaurav Gupta
- Role: Senior Product Manager & AI Strategist, Jaipur, India
- Focus: Building at the intersection of product and AI
