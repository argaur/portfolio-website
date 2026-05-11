# Portfolio Website — Master Improvement Plan
**Date:** 2026-05-10  
**Author:** Gaurav Gupta  
**Context:** Senior PM with 10+ years experience, Jaipur. Goal: land a high-quality role by making the portfolio blow recruiters away — not just look good but demonstrate PM rigor, builder credibility, and AI-native thinking.

---

## Current State Audit (findings from exploration)

| Issue | Impact |
|---|---|
| 7 broken `href="#"` links on live site | Kills credibility instantly |
| "Rethink AI MPM Cohort 7" credential missing from Credentials panel | Case studies reference it, panel doesn't — looks inconsistent |
| No resume/CV download CTA (PDF exists in repo) | Recruiters bounce if they can't grab the doc |
| LinkedIn URL inconsistency (hero vs contact) | Small but sloppy |
| Credentials rows not clickable — no cert verification links | Unverifiable = irrelevant to recruiters |
| Personal projects: all GitHub links are `#` | Makes personal work look imaginary |
| Work modals: 3 of 9 cards (OneValley, Taccomacco, RSP) have thin narratives | Career depth hidden |
| No PWA manifest or service worker | Contradiction: Vitae is marketed as PWA but portfolio itself isn't |
| No light/dark mode | Design feels incomplete vs modern portfolio standards |
| No profile photo, no biography content | Portfolio has no face — anonymous |
| Contact panel underutilized (just email + LinkedIn + canvas) | Wasted prime real estate |
| No timeline of career/work | Hard for recruiters to trace career arc and growth |
| No RAG chatbot | Biggest missed opportunity to stand out as AI-native builder |

---

## Architecture Decisions (confirmed)

- **Homepage redesign:** Keep hero panel as-is. Contact panel → merged Biography + Contact (photo, story, email, LinkedIn, canvas)
- **RAG Chatbot backend:** FastAPI on Oracle VM (`140.245.21.142`) — portfolio fetches via fetch() calls
- **Timeline view:** Standalone `timeline.html` page (not a new panel)
- **Constraint:** Plain HTML/CSS/JS for the portfolio shell. Chatbot is the only exception (needs Python backend)

---

## Phase 0 — Quick Wins (Day 1, ~4–6 hrs)
*Fix what's broken before adding anything new. These are credibility killers.*

### 0.1 Fix all broken placeholder links
- **Files:** `index.html`, `app.js` (personalProjects array), `case-study-*.html`
- **Tasks:**
  - [ ] Add real GitHub repo URLs for all 4 personal projects (once repos are confirmed public — or mark as "Private" with explanation)
  - [ ] `case-study-founder-crm.html` → fill or explicitly disable "View Product" button
  - [ ] `case-study-youtube.html` → update "View Product" header link (body already has Lovable prototype links)
  - [ ] `case-study-group-travel.html` → fill or explicitly disable "View Product" button
  - [ ] `case-study-vitae.html` → fill "View Wireframes" with real Figma/Excalidraw link or remove
- **Decision needed:** For products without a live URL, change button text to "In Development →" or add a note. Don't leave `href="#"`.

### 0.2 Add Rethink AI MPM Cohort 7 credential
- **File:** `index.html` (Credentials panel, `panel-credentials`)
- **Tasks:**
  - [ ] Add cert row: "Product Management (MPM) Cohort 7 — Rethink AI · 2026"
  - [ ] Add cert row: "Rethink Health Buildathon — April 2026" (if considered a credential)
  - [ ] Both rows should be styled with the new "clickable cert" design (see Phase 1.2)
- **Link:** Add verification/program link (get the actual Rethink URL)

### 0.3 Resume/CV download CTA
- **File:** `index.html` (nav or contact/bio panel), `styles.css`
- **Tasks:**
  - [ ] Move `Gaurav Gupta - SPM_10YE_Jan26.pdf` out of `Reference Files/` into root or `/assets/`
  - [ ] Update filename to something clean: `gaurav-gupta-resume-2026.pdf`
  - [ ] Add download CTA in nav (e.g., "Resume ↓" right-justified) OR in Contact/Bio panel
  - [ ] Style as terracotta pill button consistent with brand

### 0.4 Content consistency fixes
- **Files:** `index.html`, `app.js`
- **Tasks:**
  - [ ] Fix LinkedIn URL inconsistency — standardize to `linkedin.com/in/ar-gaurav-gupta/`
  - [ ] Fix stale copy: "7 panel SPA" → "8 panel SPA" in personalProjects array (`app.js:322`)
  - [ ] Update hero stats if needed: `6 products` → count accurately
  - [ ] Hardcoded `· 2026` in 2 footers — make dynamic or verify still correct

### 0.5 Repo cleanup (non-breaking)
- **Tasks:**
  - [ ] Move `AGENTS.md`, `GEMINI.md`, `Design Analysis.txt`, `Changes_26 Apr.md`, `gemini_summary.md` to `.ai-docs/` subfolder (keep them but don't scatter in root)
  - [ ] Move `GauravG Portfolio/` (old React stubs) to `.archive/`
  - [ ] Delete or optimize `photo.jpg` — either use it (compress to <200KB) or delete it
  - [ ] Delete `Day 1.png` if unreferenced
  - [ ] Ensure `tabs.js` stub is either removed or still needed (check `<script>` tags in `index.html`)

---

## Phase 1 — Content Depth (Days 2–5, ~2–3 days work)
*Priority: Show PM rigor. This is what separates you from other candidates.*

### 1.1 Projects page — Stage indicators for case studies
**Goal:** Make the projects table show delivery stage so recruiters instantly see what kind of work each is.

- **File:** `index.html` (projects panel), `app.js` (caseStudies array), `styles.css`
- **Stage taxonomy:**
  | Stage Label | What it means |
  |---|---|
  | `Discovery` | Research + problem definition only |
  | `PRD` | Full product requirements document written |
  | `PRD + Wireframes` | PRD + lo-fi wireframes |
  | `PRD + Prototype` | PRD + clickable prototype |
  | `PRD + Shipped` | Full cycle, live product |
  | `Buildathon / Shipped` | Time-boxed build, live |

- **Current mapping:**
  | Case Study | Stage |
  |---|---|
  | Founder's CRM | PRD + Prototype |
  | Blinkit Dark Stores | PRD + Prototype + Shipped (dashboard live) |
  | YouTube 2.0 | PRD + Wireframes + Prototype |
  | Group Travel Platform | PRD (Rethink cohort project) |
  | Vitae — Health Records | PRD + Shipped (Buildathon) |

- **Tasks:**
  - [ ] Add `stage` field to `caseStudies` array in `app.js`
  - [ ] Add `stage` field to `personalProjects` array in `app.js`
  - [ ] Create `.stage-badge` CSS component — small terracotta tag right-aligned in the project row
  - [ ] Update projects table renderer to show the badge
  - [ ] Add filter row at top of projects panel: "All | PRD | Shipped | Prototype" — JS filter on click

### 1.2 Credentials panel — Clickable certificate rows
**Goal:** Every cert row opens either a modal with the cert image or links to an issuer verification page.

- **Files:** `index.html`, `app.js`, `styles.css`
- **Tasks:**
  - [ ] Add `cursor: pointer`, hover highlight (`--terra` left border) to all `.cert-row` elements
  - [ ] Create `certData` array in `app.js` with entries: `{ name, issuer, year, verifyUrl, badgeImageUrl, credentialId }`
  - [ ] Implement cert modal (reuse existing modal container) — shows badge, name, issuer, year, credential ID, "Verify Certificate →" link
  - [ ] Render credentials panel from `certData` array (replace hardcoded HTML)
  - [ ] Gather real verification URLs for all certs (Scrum Alliance, Automation Anywhere, LinkedIn Learning, IBM, Google)
  - [ ] Add Rethink AI MPM cert to this array

### 1.3 Detailed PRDs for personal projects
**Goal:** Treat personal projects with the same PM rigor as case studies.

- **Files:** `project-*.html` (4 files), `case-study.css`
- **Sections per project:**
  1. The Problem
  2. Why I Built It
  3. User / Stakeholder
  4. Requirements
  5. Architecture / System Design
  6. Build Decisions
  7. Outcome / Usage
  8. What's Next

- **Tasks:**
  - [ ] `project-telegram-bot.html` — expand to full PRD format
  - [ ] `project-portfolio.html` — document PM decisions behind the portfolio itself
  - [ ] `project-homelab.html` — infrastructure thinking: why Oracle Cloud, what's hosted
  - [ ] `project-gws-cli.html` — UX decisions, API choices, pending Telegram trigger

### 1.4 Complete work modal narratives for remaining 3 cards
**Goal:** OneValley, Taccomacco, RSP cards currently open thin modals. Add 7-part narrative.

- **File:** `app.js` (workProjects array, cards 6–8)
- **Tasks:**
  - [ ] Write 7-part narrative for **OneValley (Passport/PassportOS)**
  - [ ] Write 7-part narrative for **Taccomacco (Digital Content Platform)**
  - [ ] Write 7-part narrative for **RSP Design Consultants (Architectural Projects Portfolio)**

### 1.5 Career History document for Obsidian (RAG source)
**Goal:** Exhaustive career document — chunks into the RAG chatbot, also valuable as master career record.

- **Output:** `G:\My Drive\Obsidian Vault\Career History\` with sub-notes
- **Structure:**
  ```
  Career History/
  ├── Career History.md          (master index)
  ├── RSP Design (2014–2017).md
  ├── Taccomacco (2017–2020).md
  ├── OneValley (2020–2022).md
  ├── JindalX (2022–2025).md
  ├── Education.md
  ├── Certifications.md
  ├── Personal Projects.md
  ├── Case Studies.md
  └── Skills & Tools.md
  ```
- **Each role file:** company background, your role, key products (problem → solution → tech → metrics → learnings), team size, methodologies, failures, recognitions

### 1.6 Content Parity Gap Fill
**Goal:** Bring all 9 pages to consistent asset depth. Current state (audited 2026-05-10): problem statements are strong on all pages, but GitHub links, prototype links, and wireframes are missing on most.

**Asset gap table:**

| Page | Problem | Wireframes | Flow | Architecture | Prototype | GitHub | Metrics |
|---|---|---|---|---|---|---|---|
| Blinkit | ✓ | ~ | ✓ | ✓ | ✓ | ✗ | ✓ |
| Founder CRM | ✓ | ✗ | ✗ | ✗ | ✗ dead link | ✗ | ✗ |
| Group Travel | ✓ | ✗ | ✗ | ✗ | ✗ dead link | ✗ | ~ |
| Vitae | ✓ | ~ | ✓ | ✓ | ✓ | ✗ | ✓ |
| YouTube 2.0 | ✓ | ~ | ✓ | ✓ | ✓ | ✗ | ✓ |
| GWS CLI | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ~ |
| Homelab | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ~ |
| Portfolio | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ~ |
| Telegram Bot | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ |

**Priority 1 — GitHub links (all 9 pages, highest recruiter impact)**
- [ ] Blinkit: add GitHub link (or "Private — ask me" note)
- [ ] Founder CRM: add GitHub link (or "Private — ask me" note)
- [ ] Group Travel: add GitHub link (or "Private — ask me" note)
- [ ] Vitae: link to `aashikvilla/health-assistant` (confirm repo rename to `vitae-health`)
- [ ] YouTube 2.0: add GitHub link (or "Private — ask me" note)
- [ ] GWS CLI: add GitHub link once repo confirmed (currently private)
- [ ] Homelab: add GitHub link to `homelab-v2` (public)
- [ ] Portfolio: add GitHub link to public portfolio repo
- [ ] Telegram Bot: note "Private repo" with explanation (multi-service bot, not public)

**Priority 2 — Dead product links (kills credibility)**
- [ ] Founder CRM: create Lovable/Excalidraw prototype OR change button to "In Development" with explanation
- [ ] Group Travel (Trivo): add Figma/Lovable prototype link OR change button to "PRD Stage — prototype pending"
- [ ] Vitae: fill `href="#"` on "View Wireframes" with real Figma or Excalidraw link

**Priority 3 — Missing wireframes/design artifacts**
- [ ] Founder CRM: add lo-fi wireframe (Excalidraw or Lovable) for core CRM screens
- [ ] Group Travel: add user-flow or lo-fi mockup for trip planning flow
- [ ] GWS CLI: add CLI UX mockup or workflow diagram (even a simple terminal recording link)
- [ ] Telegram Bot: add command-flow diagram (already has architecture; add user-interaction flow)

**Priority 4 — Outcome/metrics gaps**
- [ ] Founder CRM: add outcome section even if qualitative ("Validated with 3 founders in interview sessions")
- [ ] GWS CLI: add usage metrics or "saves X minutes per day" estimate
- [ ] Homelab: add quantified outcome ("10+ services running, ~$0/month cost vs. ~$50/month SaaS equivalent")
- [ ] Portfolio: add outcome metrics ("X visitors, Y emails captured, Z recruiter conversations")

---

## Phase 2 — Design Overhaul (Days 6–10, ~3–4 days work)
*Priority: First impression and personal brand.*

### 2.1 Profile photo integration with hover-to-color
- **Files:** `index.html`, `styles.css`
- **Approach:** `filter: grayscale(100%)` → `filter: grayscale(0%)` on hover, `transition: filter 0.4s ease`
- **Mobile:** Default to color (no hover on touch)
- **Tasks:**
  - [ ] Compress `photo.jpg` to <150KB → save as `assets/gaurav-photo.jpg`
  - [ ] Add to biography section with grayscale → color hover
  - [ ] Rectangular crop (no `border-radius` per design system)

### 2.2 Contact panel → Biography + Contact merger
**Goal:** Replace underutilized Contact panel with richer About panel.

- **New panel structure:**
  ```
  [LEFT — navy, blueprint grid]
    Photo (grayscale → color hover)
    Name + location
    "The Story" — 3–4 sentences: architecture → startups → PM → AI
    Current focus / what you're looking for

  [RIGHT — cream]
    Email CTA (terracotta button)
    LinkedIn (secondary button)
    Resume download (outline button)
    4-node contact canvas (#contact-canvas)
  ```
- **Nav label:** "Contact" → "About"
- **Tasks:**
  - [ ] Write 3–4 sentence biography
  - [ ] Redesign panel-contact HTML
  - [ ] Update nav label (desktop + mobile overlay)
  - [ ] Maintain `#contact` hash routing

### 2.3 Light / Dark mode toggle
- **Files:** `index.html`, `styles.css`, `app.js`
- **Approach:** CSS `[data-theme="light"]` overrides on `:root`, toggle button in nav, `localStorage` persistence, defaults to `prefers-color-scheme`
- **Light mode palette:** navy panels → light gray, cream → white, terra stays
- **Tasks:**
  - [ ] Add theme toggle SVG button to nav
  - [ ] Define light-mode CSS variable overrides
  - [ ] Implement toggle + localStorage in `app.js`
  - [ ] Handle blueprint grid and canvas colors per theme
  - [ ] Test all 8 panels in both modes + mobile nav overlay

### 2.4 Timeline standalone page (`timeline.html`)
**Goal:** Complete visual chronology — every role, product, credential, and milestone.

- **Layout:** Vertical timeline line + dots, content cards by year, filter bar (All | Work | Projects | Credentials | Education), each card links to its source (case study page, credential modal, work modal)
- **Timeline skeleton (2009–2026):**
  ```
  2009 — B.Arch started, NIT Jaipur
  2014 — Graduated B.Arch; joined RSP Design Consultants
  2017 — Co-Founded Taccomacco
  2020 — IBM Data Science L2; SQL cert; joined OneValley
  2022 — Joined JindalX as Sr. PM
  2023 — Lean Certification
  2024 — Airtable Admin/Builder; Power BI cert
  2025 — CSM + CSPO (Scrum Alliance); JindalX tenure end
  2026 — Rethink AI MPM Cohort 7; Vitae Buildathon shipped
  ```
- **Tasks:**
  - [ ] Design `timeline.html` layout
  - [ ] Implement filter bar with JS toggle
  - [ ] Link cards to destinations
  - [ ] Add "Back to Portfolio →" breadcrumb
  - [ ] Link to timeline from About panel + Projects panel
  - [ ] Mobile: full-width cards, collapsed timeline line

---

## Phase 3 — Technical Features (Days 11–20, ~5–7 days)
*The differentiators that make you stand out as an AI-native builder.*

### 3.1 PWA (Progressive Web App)
- **Files:** `manifest.json` (new), `sw.js` (new), `index.html`, `assets/` (icons)
- **Caching strategy:**
  - Cache-first: HTML, CSS, JS, fonts, photo, resume PDF
  - Network-first: Supabase calls
  - Stale-while-revalidate: case study pages, timeline.html
- **Tasks:**
  - [ ] Generate PWA icons (192px, 512px) from `favicon.svg`
  - [ ] Write `manifest.json` (name, icons, theme_color: `#0b1628`, display: standalone)
  - [ ] Write `sw.js` with caching strategy
  - [ ] Register service worker in `index.html`
  - [ ] Add iOS meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`)
  - [ ] Verify Lighthouse PWA score ≥ 90

### 3.2 RAG Chatbot — "Ask Gaurav" AI assistant
**Architecture:**
```
Portfolio (index.html)
  └── JS fetch() → Oracle VM FastAPI (port 8001)
         └── /chat endpoint
               ├── Anthropic Claude Haiku (speed + cost)
               ├── ChromaDB (local vector store)
               └── Career History docs (chunked + embedded)
```

**Backend (Oracle VM — new project at `~/rag-chatbot/`):**
```
rag-chatbot/
├── main.py           (FastAPI app, /chat + /health)
├── ingest.py         (chunk + embed Career History docs)
├── retrieval.py      (semantic search in ChromaDB)
├── prompts.py        (system prompt, context injection)
├── requirements.txt
├── .env              (ANTHROPIC_API_KEY)
├── data/             (Career History markdown files)
└── chroma_db/        (vector store, gitignored)
```

**RAG pipeline:**
1. Chunk Career History markdowns (300-token chunks, 50-token overlap)
2. Embed via `voyage-3-lite` (Anthropic) or `text-embedding-3-small` (OpenAI)
3. Store in ChromaDB (local file-based)
4. Query: embed user question → semantic search top-5 chunks → inject into Claude prompt
5. Respond: non-streaming first version

**API:**
```
POST /chat  →  { "message": string, "history": [{role, content}] }
               Returns: { "reply": string }
GET  /health → { "status": "ok" }
```

**Security:** CORS allowlist (portfolio domain only), rate limit 20 req/IP/hour, API key in `.env`

**Chat widget (portfolio side):**
- Floating "Ask Gaurav" button (bottom-right, terracotta, chat icon)
- Slide-up panel (400×500px, navy bg): chat history + input
- Loading: 3-dot animation
- Graceful fallback: if VM unreachable → "Currently offline — email me instead" + mailto link
- `sessionStorage` for conversation history

**Tasks:**
  - [ ] Complete Career History doc first (Phase 1.5) — this is the RAG data source
  - [ ] Set up `rag-chatbot/` project on Oracle VM
  - [ ] Write `ingest.py` — chunk, embed, store in ChromaDB
  - [ ] Write `retrieval.py` — semantic search
  - [ ] Write `main.py` — FastAPI, rate limiting, CORS
  - [ ] Write `prompts.py` — system prompt + context injection
  - [ ] Test backend: `curl /chat` with sample recruiter questions
  - [ ] Create systemd service + Nginx proxy
  - [ ] Verify HTTPS on Oracle VM (needed for calls from HTTPS portfolio)
  - [ ] Build chat widget in `index.html` + `app.js` + `styles.css`
  - [ ] Test full flow end-to-end
  - [ ] Test graceful degradation
  - [ ] Add "Powered by Claude" attribution

---

## Phase 4 — Showcase & Polish (Ongoing)

### 4.1 Live product CTAs on Work/Projects cards
- [ ] Add `LIVE` badge (green dot) to Blinkit + Vitae cards
- [ ] Make "View Product" button prominent for live products

### 4.2 Analytics (GA4)
- [ ] Add GA4 to `index.html`
- [ ] Track: panel views (on `panel:activate`), email gate submit, chatbot opened, chatbot message sent, resume downloaded

### 4.3 OG image / social cards
- [ ] Create 1200×630 OG image (Canva: navy bg, GG logo, name, title)
- [ ] Update `<meta property="og:image">` in `index.html`
- [ ] Add Twitter Card meta tags

### 4.4 Testimonials / social proof
- [ ] Collect 2–3 real LinkedIn recommendation quotes
- [ ] Add pull-quote component to About/Bio panel

### 4.5 Mobile-first audit
- [ ] Test all panels at 375px and 428px
- [ ] Verify modals scrollable + closeable on mobile
- [ ] Verify chat widget doesn't block content
- [ ] Test PWA install on actual Android device

---

## Prioritized Task List

### Do this week (immediate credibility impact)
1. Fix all 7 broken `href="#"` links
2. Add Rethink AI MPM credential to Credentials panel
3. Add resume download CTA
4. Fix LinkedIn URL inconsistency
5. Start Career History Obsidian document

### High impact, 1–2 week window
6. Clickable credentials with verification links
7. Stage indicators + filter bar on Projects panel
8. Biography + photo merger into Contact/About panel
9. Light/Dark mode toggle
10. Complete remaining 3 work modal narratives

### Signature features, 2–4 weeks
11. PRDs for personal projects
12. Timeline page (timeline.html)
13. PWA: manifest + service worker
14. RAG Chatbot "Ask Gaurav" — requires Career History doc done first

### Polish (ongoing)
15. Live product CTAs on cards
16. Analytics (GA4)
17. OG image / social cards
18. Testimonials / social proof
19. Mobile audit pass
20. Repo cleanup

---

## Effort Estimates

| Phase | Items | Est. Days |
|---|---|---|
| Phase 0 — Quick Wins | 5 task groups | 1 day |
| Phase 1 — Content Depth | 5 task groups | 3–4 days |
| Phase 2 — Design Overhaul | 4 task groups | 3–4 days |
| Phase 3 — Technical (PWA + RAG) | 2 major features | 5–7 days |
| Phase 4 — Polish | Ongoing | 1–2 days |
| **Total** | | **~13–18 days** |

---

## Open Questions (resolve before starting implementation)

- [ ] **Rethink AI credential:** Certificate document or badge? Verification URL?
- [ ] **GitHub repos:** Which of the 4 personal project repos are public and ready to link?
- [ ] **Profile photo:** Is `photo.jpg` in the repo the headshot you want to use?
- [ ] **Chatbot embedding model:** Voyage-3-lite (Anthropic, $0.06/1M) vs OpenAI text-embedding-3-small ($0.02/1M)?
- [ ] **Oracle VM HTTPS:** Is HTTPS configured on Nginx? (Required for chatbot API calls from HTTPS portfolio)
- [ ] **Testimonials:** Any LinkedIn recommendations you'd be comfortable featuring?
- [ ] **Portfolio domain:** GitHub Pages URL or custom domain? (Affects CORS config for chatbot)

---

## Project Content Depth Initiative (sub-project, separate track)

**Doc:** `Obsidian: Projects/Project Content Depth Initiative.md`  
**Goal:** Every project reaches recruiter-grade depth — GitHub README, 4 diagram types (wireframes, user flow, workflow, architecture), full PRD narrative on portfolio page, and a working demo mode for live products.

**9 projects in scope:** Rethink CRM · Blinkit Dark Store Command Hub · YouTube 2.0 · Trivo · Vitae · Telegram Bot · Portfolio Website · Homelab · GWS CLI

**4 phases:** A — GitHub Audit → B — Artifact Creation (Gemini + Excalidraw) → C — Portfolio Page Depth (Gemini audit → Claude edits) → D — Demo Mode per product

**Delegation:** Gemini reads large HTML files; Claude writes targeted edits; Codex stubs READMEs; Excalidraw MCP creates diagrams. Nothing goes live without Gaurav review.

---

## Success Criteria

A recruiter or hiring manager lands on this portfolio and:
1. Immediately understands who you are (photo, biography, headline) — **< 10 seconds**
2. Can download your resume in one click — **< 15 seconds**
3. Can trace your career arc without scrolling through walls of text (timeline) — **< 2 minutes**
4. Can see verified credentials with one click — **no doubt about authenticity**
5. Can ask a natural language question and get a specific, accurate answer (chatbot) — **"I've never seen this on a PM portfolio"**
6. Can install the portfolio as an app on their phone and browse offline — **shows you ship real products, not just specs**

**The metric that matters:** More recruiter callbacks and better-quality inbound conversations.
