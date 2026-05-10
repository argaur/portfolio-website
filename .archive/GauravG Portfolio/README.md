# Design Handoff: GauravG Portfolio Redesign
### "Blueprint to Bits"

---

## Overview

This is a full redesign of [gauravg-portfolio.vercel.app](https://gauravg-portfolio.vercel.app) — a personal portfolio for Gaurav Gupta, Senior Product Manager and AI Strategist. The previous design was generic; this redesign builds around a single narrative: **an architect who became a product manager**. Every visual decision reinforces that arc.

The design is called **"Blueprint to Bits"** — architectural drawing conventions (grid lines, coordinate markers, precise geometry, orthographic layouts) fused with editorial typographic weight.

---

## About the Design Files

The files in this bundle (`GauravG Portfolio.html`, `portfolio-app.jsx`, `tweaks-panel.jsx`) are **HTML/React design prototypes** — they show the intended look, feel, and interactions. **Do not ship these files directly.**

Your task is to **recreate these designs in the existing Next.js/React codebase** on Vercel, using the codebase's existing patterns, routing, and component architecture. All visual values (colors, spacing, typography, animations) are documented precisely below so you can implement them with fidelity.

---

## Fidelity

**High-fidelity.** These are pixel-precise mockups with final colors, typography, spacing, and all interactive states. Recreate them as closely as possible using the existing codebase's component patterns.

---

## Design Tokens

### Colors

```js
// palette.js or tokens.css
const colors = {
  navy:    '#0b1628',   // Hero bg, Skills bg, Footer bg
  navyMid: '#112240',   // Footer bg variant
  cream:   '#f7f3ee',   // Section bg (alternating)
  white:   '#ffffff',   // Section bg (alternating)
  text:    '#1c1917',   // Primary body text
  muted:   '#6b6560',   // Secondary / caption text
  border:  '#e2dbd3',   // Dividers, card borders
  terra:   '#bf5c3a',   // PRIMARY ACCENT — section labels, tags, CTA underlines
  blue:    '#2d5da1',   // Metric tags, hover accents, timeline dots (tech)
  forest:  '#3d5c3a',   // Timeline dot (architecture phase)
};
```

### Typography

```css
/* Google Fonts — load both */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* Scale */
--font-display: 'Cormorant Garamond', serif;  /* All headings, large numbers, quotes */
--font-body:    'DM Sans', sans-serif;         /* All body text, labels, nav, tags */

/* Sizes used */
--text-hero:    clamp(72px, 9vw, 120px);  /* H1 in hero */
--text-section: clamp(40px, 5.5vw, 72px); /* Contact / footer headline */
--text-h2:      44px;                     /* Section titles (Projects, Case Studies) */
--text-h3:      18px;                     /* Experience company names */
--text-card:    21–22px;                  /* Project card titles, case study titles */
--text-body:    14–15px;                  /* Paragraph body */
--text-small:   13px;                     /* Secondary body, bullets, descriptions */
--text-label:   11px;                     /* Section labels, tags — uppercase tracked */
--text-micro:   10px;                     /* Coordinate labels, footer copyright */
```

### Spacing

```
Section padding:  120px top/bottom, 48px left/right
Max content width: 960px (text-heavy) / 1140px (grids)
Grid gap (projects): 2px (border effect via background on parent)
Timeline column widths: 220px | 24px | 1fr
```

### Border Radius
None. All elements use **sharp right angles** — this is intentional and part of the architectural visual language. No `border-radius` anywhere.

### Shadows
Used only on hover states for project cards:
```css
box-shadow: 0 16px 48px rgba(45, 93, 161, 0.10);
```

---

## Section-by-Section Specs

---

### 1. Navigation

**Layout:** Fixed top bar, full width, height 64px, horizontal padding 48px. Flex row, space-between.

**Behavior:**
- Transparent + no border when `scrollY < 60px`
- On scroll past 60px: `background: rgba(11,22,40,0.96)`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid rgba(255,255,255,0.06)`. Transition: `0.35s ease`.

**Left:** Logo "GG" — Cormorant Garamond 24px 700 weight, white, links to `#home`.

**Right links:** DM Sans 12px, `rgba(255,255,255,0.55)`. On hover: white. `letter-spacing: 0.05em`. Links: Experience, Work, Case Studies, Skills, Credentials.

**CTA button:** "Contact" — DM Sans 11px 700, uppercase, `letter-spacing: 0.1em`. White text on white background (`color: #0b1628`). Padding `8px 20px`. No border-radius. `href="mailto:ar.gaurav20@gmail.com"`.

---

### 2. Hero Section

**ID:** `#home`

**Background:**
```css
background-color: #0b1628;
background-image:
  linear-gradient(rgba(65,120,220,0.07) 1px, transparent 1px),
  linear-gradient(90deg, rgba(65,120,220,0.07) 1px, transparent 1px),
  linear-gradient(rgba(65,120,220,0.025) 1px, transparent 1px),
  linear-gradient(90deg, rgba(65,120,220,0.025) 1px, transparent 1px);
background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
```
This produces a blueprint graph-paper grid (major + minor grid lines).

**Layout:** `min-height: 100vh`, flex column, justify-content center, padding `120px 48px 100px`.

**Absolute elements:**
- Top-left: `"26.9124° N · 75.7873° E · JAIPUR"` — DM Sans 10px, `rgba(255,255,255,0.18)`, `letter-spacing: 0.14em`. Position: `top: 88px, left: 48px`.
- Top-right: `"PORTFOLIO · 2025"` — same style, `text-align: right`, `top: 88px, right: 48px`.

**Content (max-width 960px):**

Overline row (flex, align-items center, gap 16px, margin-bottom 44px):
- 32px wide, 1px tall terracotta line `#bf5c3a`
- Text: `"SENIOR PRODUCT MANAGER · AI STRATEGIST"` — DM Sans 11px 600, `letter-spacing: 0.18em`, color `#bf5c3a`, uppercase

H1: Cormorant Garamond, `clamp(72px, 9vw, 120px)`, weight 600, white, `line-height: 0.92`, `letter-spacing: -0.01em`, margin-bottom 48px.
```
Gaurav
Gupta.     ← "Gupta." in rgba(255,255,255,0.32)
```

Two-column statement (CSS grid 1fr 1fr, gap 48px, max-width 860px, margin-bottom 64px):
- Left: Cormorant Garamond 20px italic, `rgba(255,255,255,0.65)`, line-height 1.55.
  > "Trained as an architect — five years learning how space, systems, and people work together. Now applying the same thinking to digital products."
- Right: DM Sans 14px, `rgba(255,255,255,0.38)`, line-height 1.8.
  > "B.Arch from NIT Jaipur. 10 years building — first in steel and concrete, now in data and interfaces. Currently shipping AI-powered enterprise tools that real people use every day."

CTA row (flex, gap 24px, align-items center):
- Primary: "View Work" button — DM Sans 12px 700, uppercase, `letter-spacing: 0.1em`, `color: #0b1628`, `background: #ffffff`, `padding: 14px 36px`, no border-radius, `href="#work"`.
- Secondary: "Get in touch →" — DM Sans 13px, `rgba(255,255,255,0.55)`, no text-decoration, `border-bottom: 1px solid rgba(255,255,255,0.2)`, `padding-bottom: 2px`.

**Bottom stats bar** (absolute, `bottom: 40px`, `left/right: 48px`):
- `border-top: 1px solid rgba(255,255,255,0.06)`, `padding-top: 24px`
- Left side — flex, gap 48px: Three stat items:
  - "10" / "Years Experience"
  - "6" / "Products Shipped"
  - "5K+" / "Users Served"
  - Number: Cormorant Garamond 28px 600, `rgba(255,255,255,0.7)`, line-height 1
  - Label: DM Sans 10px, `rgba(255,255,255,0.25)`, `letter-spacing: 0.1em`, uppercase, margin-top 4px
- Right side — flex, gap 24px: "LINKEDIN" and "EMAIL" text links — DM Sans 10px, `rgba(255,255,255,0.25)`, uppercase, `letter-spacing: 0.12em`. Hover: `rgba(255,255,255,0.6)`.

---

### 3. Experience Section

**ID:** `#experience`  
**Background:** `#f7f3ee` (cream)  
**Padding:** `120px 48px`  
**Max content width:** `960px` centered

**Section Label** (reusable component, used on all light sections):
```
[40px terracotta line] [01 — WORK EXPERIENCE] [flex-1 border line]
```
- Flex row, align-items center, gap 16px, margin-bottom 64px
- Line: 40px × 1px, `#bf5c3a`
- Text: DM Sans 11px 600, `#bf5c3a`, uppercase, `letter-spacing: 0.16em`
- Right rule: flex 1, 1px, `#e2dbd3`

**Career Arc Bar** (margin-bottom 72px):
A segmented progress bar showing career phases.
```
[Architecture 2.75fr | forest #3d5c3a] [Pivot 3.2fr | terra #bf5c3a] [Product 4.8fr | blue #2d5da1]
```
- Height: 6px, border-radius 3px, overflow hidden
- Below: flex space-between, DM Sans 10px 700, uppercase, `letter-spacing: 0.1em` in each phase color
- Labels: "Architecture · 2014", "Founding · 2017", "Product & AI · 2025"

**Experience Rows** (4 total, expandable):

Grid per row: `220px 24px 1fr`, gap `0 28px`, padding-bottom 48px (except last).

Left column (text-align right, padding-top 2px):
- Period: DM Sans 12px, `#6b6560`, `letter-spacing: 0.04em`, margin-bottom 10px
- Type badge: DM Sans 10px 700, uppercase, `letter-spacing: 0.1em`, border-radius 2px. Color + bg by type:
  - `tech`: color `#2d5da1`, bg `rgba(45,93,161,0.09)`
  - `pivot`: color `#bf5c3a`, bg `rgba(191,92,58,0.09)`
  - `arch`: color `#3d5c3a`, bg `rgba(61,92,58,0.09)`

Middle column (timeline spine):
- Dot: 10px circle, color per type, `border: 2px solid #f7f3ee`, `box-shadow: 0 0 0 1.5px [type-color]`, z-index 1, margin-top 2px
- Connector line (except last): flex 1, width 1px, gradient from `[current-color]40` to `[next-color]30`, margin-top 6px

Right column:
- Company name: Cormorant Garamond 18px 600, `#1c1917`, margin-bottom 16px, line-height 1.3
- Role + duration: DM Sans 13px, `#6b6560`, `letter-spacing: 0.02em`
- "+" / "×" toggle button (right-aligned in flex): DM Sans 18px, `#6b6560`. Rotates 45° when open via `transform: rotate(45deg)`, `transition: 0.25s`

**Expanded bullets** (accordion):
- `max-height: 0` → `200px`, transition `0.35s ease`
- `margin-top: 20px` when open
- `<ul>`: `padding-left: 16px`, flex column, gap 10px
- `<li>`: DM Sans 13px, `#1c1917`, line-height 1.65, opacity 0.78

**Experience Data:**
```
JindalX | Sr. PM – Digital Transformation | Jun 2022 – May 2025 | 3 yrs | type: tech
  - Built 6 enterprise products 0→1 for 5,000+ users across HR, EdTech, and BI
  - Led AI integration into ATS, performance management, and knowledge platforms
  - Managed cross-functional squads across product, engineering, design, and data

OneValley | Product Manager | Sep 2020 – Jul 2022 | 1y 10m | type: tech
  - Product strategy and roadmap for a global startup ecosystem platform
  - Drove feature development aligned with investor and founder personas

Taccomacco | Co-Founder & COO | Jul 2017 – Sep 2020 | 3y 2m | type: pivot
  - Co-founded a design-meets-technology venture — the bridge between worlds
  - Managed full operations, client relationships, and product direction
  - Translated physical design thinking into digital product strategy

RSP Design Consultants | Design Manager (Architecture) | Sep 2014 – Jun 2017 | 2y 9m | type: arch
  - Led design and delivery of large-scale architectural projects
  - Managed multi-disciplinary teams and contractor coordination
  - Built the foundation: systems thinking, spatial logic, UX at scale
```

---

### 4. Projects Section

**ID:** `#work`  
**Background:** `#ffffff`  
**Padding:** `120px 48px`  
**Max content width:** `1140px` centered

Section Label: `02 — FEATURED PROJECTS`

Header row (flex, space-between, align-items flex-end, margin-bottom 48px):
- Left: H2 "Built at JindalX" — Cormorant Garamond 44px 600, `#1c1917`, margin-bottom 8px. Sub: DM Sans 14px, `#6b6560`
- Right: "Click any card for details" — DM Sans 12px, `#6b6560`

**Project Grid:**
CSS Grid `repeat(3, 1fr)`, gap `2px`, background `#e2dbd3` (border-as-gap trick).

**Project Card:**
Background `#ffffff`, `border: 1px solid #e2dbd3`. On hover: `border-color: rgba(45,93,161,0.27)`, `transform: translateY(-4px)`, `box-shadow: 0 16px 48px rgba(45,93,161,0.10)`. Transition `0.25s ease`. Cursor pointer.

Card anatomy (padding 32px):
1. Category tag: DM Sans 10px 700, `#bf5c3a`, uppercase, `letter-spacing: 0.15em`, margin-bottom 14px
2. Title: Cormorant Garamond 21px 600, `#1c1917`, line-height 1.25, margin-bottom 14px
3. Description: DM Sans 13px, `#6b6560`, line-height 1.65, margin-bottom 24px
4. Metric tags (flex wrap, gap 6px): DM Sans 11px 700, `#2d5da1`, bg `rgba(45,93,161,0.07)`, padding `4px 10px`, `letter-spacing: 0.02em`
5. "View details →": DM Sans 12px, `#2d5da1`, `letter-spacing: 0.04em`. **opacity 0 normally, opacity 1 on card hover**. Transition `0.2s`.

**Project Detail Modal:**
Opens on card click.

Overlay: `position: fixed, inset: 0`, z-index 200, `background: rgba(11,22,40,0.75)`, `backdrop-filter: blur(6px)`. Click overlay → close.

Modal panel (centered, `max-width: 620px`, width 90%, background `#ffffff`, padding 56px, no border-radius):
- Close button `×`: absolute top-right (20px, 24px), `background: none`, `border: none`, DM Sans 22px, `#6b6560`
- Category tag → Title (32px Cormorant) → Detail paragraph (DM Sans 14px, line-height 1.75, opacity 0.8)
- Bottom metrics: `border-top: 1px solid #e2dbd3`, padding-top 24px, flex wrap gap 10px, same tag style as card

**Project Data:**
```
1. AI-Powered Talent Management Suite | AI · HR Tech
   Metrics: 50% faster hiring | 200+ hiring managers | 40% internal mobility↑
   Desc: Comprehensive ATS built from scratch with embedded AI workflows — automated screening and GenAI-driven job matching.
   Detail: Designed and shipped a full ATS with AI-powered screening, job description generation, and candidate-role matching. Integrated with existing HRMS for seamless data flow across the talent lifecycle. Deployed for 200+ hiring managers across 16 enterprise clients.

2. Performance Management Platform | AI · Performance
   Metrics: 60% less manual review | 15 FTEs saved | 25% engagement↑
   Desc: Evaluation system for 5,000+ employees across 16 clients. AI-driven recommendation engine for personalized development plans.
   Detail: Replaced annual review cycles with continuous feedback loops. AI recommendation engine surfaces personalized development actions based on role, tenure, and past performance data. Single multi-tenant architecture deployed across 16 enterprise clients.

3. Knowledge & Learning Platform (Insight) | EdTech · AI
   Metrics: 45% performance↑ | 35% training time↓ | 60% faster resolution
   Desc: AI-powered EdTech system for BPO agents with integrated chatbot for instant query resolution and intelligent learning paths.
   Detail: Intelligent learning pathways adapt to agent performance data in real-time. Integrated chatbot handles 60% of queries without human escalation. Reduced onboarding time and improved frontline performance across 10,000+ seat operations.

4. B2B CRM & Auction Platform (AuctionIT) | B2B · CRM
   Metrics: 30% transactions↑ | Auto-invoicing | CRM integration
   Desc: End-to-end B2B CRM with integrated auction management, automated bidding workflows, and invoice generation.
   Detail: Full auction lifecycle management from listing through settlement. Automated invoicing eliminated manual reconciliation entirely. The UX redesign drove the 30% transaction volume increase.

5. HR Management System (Touchpoint HRMS) | HRMS · Automation
   Metrics: 5,000+ agents | 25% satisfaction↑ | Full ERP integration
   Desc: Purpose-built HRMS for floating BPO agents — payroll, leave management, and compliance with full ERP integration.
   Detail: Handles shift workers, floating assignments, and multi-state compliance challenges unique to BPO operations. Full RESTful API integration with ERP backbone.

6. Business Intelligence Platform (Jx Data Cloud) | Analytics · BI
   Metrics: 40% accuracy↑ | 35% processing↓ | Multi-source ETL
   Desc: Centralized data warehouse consolidating 7 operational sources. Real-time Power BI and Looker Studio dashboards with automated ETL.
   Detail: Replaced 7 siloed spreadsheet-based reports with a single real-time warehouse. Automated ETL pipelines reduced data engineering toil by 35%.
```

---

### 5. Case Studies Section

**ID:** `#case-studies`  
**Background:** `#f7f3ee`  
**Padding:** `120px 48px`  
**Max content width:** `1140px` centered

Section Label: `03 — CASE STUDIES`

Header: H2 "Deep Dives" (Cormorant Garamond 44px), sub text "End-to-end product thinking — problem discovery through execution."

**Case Study Table** (`border: 1px solid #e2dbd3`):

Each row: CSS grid `48px 1fr auto`, gap `32px`, align-items center, padding `36px 48px`, `border-bottom: 1px solid #e2dbd3`. Default bg `#ffffff`. On hover: bg `#0b1628`. Transition `background 0.3s ease`. Cursor pointer.

Row anatomy:
1. **Index number** (col 1): Cormorant Garamond 36px weight 300. Default: `#e2dbd3`. Hover: `rgba(255,255,255,0.15)`. Transition `color 0.3s`.
2. **Content** (col 2):
   - Category: DM Sans 10px 700, `#bf5c3a`, uppercase, `letter-spacing: 0.15em`, margin-bottom 8px (same on hover — terra stays)
   - Title: Cormorant Garamond 22px 600, line-height 1.2, margin-bottom 8px. Default: `#1c1917`. Hover: `#ffffff`. Transition `color 0.3s`.
   - Description: DM Sans 13px, line-height 1.55. Default: `#6b6560`. Hover: `rgba(255,255,255,0.45)`. Transition `color 0.3s`.
3. **Stats + arrow** (col 3, min-width 160px, flex column, gap 6px, align-items flex-end):
   - Stat strings: DM Sans 11px 700, `letter-spacing: 0.02em`. Default: `#2d5da1`. Hover: `rgba(255,255,255,0.6)`. Transition `color 0.3s`.
   - Arrow `→`: DM Sans 18px. Default: `#e2dbd3`. Hover: `#ffffff`. On hover: `transform: translateX(6px)`. Transition `all 0.25s`.

**Case Study Data:**
```
1. Founder's CRM — Conversation-First Sales Tool | B2B SaaS · AI · Telegram Bot
   Problem: 60–70% of founders abandon CRM within 4 weeks.
   Insight: WhatsApp forwards, voice notes, and screenshots become structured deal data — no manual logging.
   Stats: 39-page PRD | 16 tools analysed | 10 founder interviews

2. Peak-Hour Decision Support for Blinkit Dark Stores | Quick Commerce · Operations
   Problem: Managers discover picker issues 3–7 minutes too late during the 6–10 PM peak window.
   Insight: After SLA has already been breached. Real-time decision support changes the intervention window entirely.
   Stats: Working prototype | 3 research methods | Unit economics modelled

3. YouTube 2.0 — Fixing Long-Form Discovery | Consumer Platform · Algorithm
   Problem: 47% of users manually search every session. 29% of Gen Z sessions end without watching anything.
   Insight: The home feed buries long-form, not users. Redesigning for intent-based discovery.
   Stats: 171 survey responses | 4 product solutions | 27+ sources

4. Group Travel Planning Platform | Consumer App · AI
   Problem: 1–2 people absorb 80%+ of planning load in a $168.7B market.
   Insight: Budget and dietary misalignments surface mid-trip as conflict. They should surface pre-trip as input.
   Stats: 6 user interviews | $168.7B market | Full PRD

5. Vitae — Health Records, Finally Understood | Health Tech · AI · PWA
   Problem: Indian families manage health via blurry WhatsApp prescription photos. ₹6,000+ crore lost to repeat tests.
   Insight: Gemma 4 26B OCR + Claude turns photos into plain-language health records. Live product shipped in 10 days.
   Stats: Live product | 6-person team | 10 days shipped
```

---

### 6. Skills Section

**ID:** `#skills`  
**Background:** `#0b1628` with same blueprint CSS grid as hero (opacity 0.05 lines)  
**Padding:** `120px 48px`  
**Max content width:** `1140px` centered

Section Label (dark variant — right rule is `rgba(255,255,255,0.08)` instead of cream border).

**Skills Grid:** CSS grid `repeat(3, 1fr)`, gap `56px 80px`.

Each skill group:
- Header: DM Sans 10px 700, `#bf5c3a`, uppercase, `letter-spacing: 0.16em`, margin-bottom 20px, `padding-bottom: 14px`, `border-bottom: 1px solid rgba(255,255,255,0.07)`
- Items: DM Sans 13px, `rgba(255,255,255,0.52)`, line-height 1.4, flex column, gap 9px

**Skills Data:**
```
Product Management: Product Lifecycle Mgmt, Go-to-Market Strategy, Roadmap Development, Feature Prioritization, Product-Market Fit, UX Design, Agile / Scrum / Kanban, Stakeholder Management

AI & Automation: AI Strategy & Implementation, Generative AI Integration, Autonomous Automation, MLOps, AI Agent Development, Workflow Optimization

Analytics & Data: SQL, Power BI, Looker Studio, Tableau, Google Analytics, Python, Excel (Advanced)

No-Code / Low-Code: Airtable (Advanced), Zapier, Power Automate, Make.com, n8n, Automation Anywhere

Product Tools: Jira, Figma, Confluence, Miro, Balsamiq, Lucidchart

Dev & Integration: API Integration, RESTful Services, Microservices, HTML / CSS / JS, JSON / XML
```

---

### 7. Credentials Section

**ID:** `#credentials`  
**Background:** `#ffffff`  
**Padding:** `120px 48px`  
**Max content width:** `960px` centered

Section Label: `05 — EDUCATION & CREDENTIALS`

**Split Panel** (CSS grid `1fr 1fr`, gap `2px`, background `#e2dbd3`):

**Left panel** (background `#0b1628`, padding 56px):
- Overline: "Foundation" — DM Sans 10px 700, `#bf5c3a`, uppercase, `letter-spacing: 0.15em`, margin-bottom 24px
- Degree: Cormorant Garamond 30px 600, `#ffffff`, line-height 1.15, margin-bottom 8px → "Bachelor of Architecture"
- Institution line: DM Sans 13px, `rgba(255,255,255,0.4)`, margin-bottom 28px → "National Institute of Technology (NIT), Jaipur · 2009–2014"
- Quote: Cormorant Garamond 17px italic, `rgba(255,255,255,0.38)`, line-height 1.65 → "Five years learning how to think about space, systems, and the people who inhabit them — the same mental model, now applied to products."

**Right panel** (background `#f7f3ee`, padding 56px):
- Overline: "Certifications" — same style
- List of certs, each row:
  - `padding: 14px 0`, `border-bottom: 1px solid #e2dbd3`
  - Flex row, space-between, align-items baseline
  - Name: DM Sans 13px 600, `#1c1917`, margin-bottom 2px
  - Issuer: DM Sans 11px, `#6b6560`
  - Year (if present): DM Sans 11px, `#6b6560`, flex-shrink 0, margin-left 16px

**Certifications data:**
```
Certified Scrum Master (CSM) | Scrum Alliance | 2025
Certified Scrum Product Owner (CSPO) | Scrum Alliance | 2025
Product Management Professional Certificate | LinkedIn Learning | —
Essentials Automation | Automation Anywhere | 2024
SQL for Data Analytics | Udemy | —
Applied Data Science with Python | IBM | —
Google Analytics Certified | Google | —
```

---

### 8. Footer / Contact

**Background:** `#112240` with blueprint CSS grid (same as hero, opacity 0.05)  
**Padding:** `120px 48px 64px`

Section Label (dark): `06 — CONTACT`

Headline: Cormorant Garamond `clamp(40px, 5.5vw, 72px)` 600, white, line-height 1.05:
```
Have a product
challenge to solve?
```

Sub paragraph: DM Sans 15px, `rgba(255,255,255,0.38)`, max-width 440px, line-height 1.75, margin-bottom 56px.
> "Whether it's an AI idea, a product strategy question, or you're looking for a senior PM — I'm listening."

Links row (flex, gap 40px, flex-wrap wrap):
- Email: DM Sans 16px 600, white, no underline text-decoration, `border-bottom: 1px solid #bf5c3a`, `padding-bottom: 4px`
- LinkedIn: DM Sans 14px, `rgba(255,255,255,0.38)`, no decoration, `letter-spacing: 0.04em`

**Footer bar** (margin-top 112px, padding-top 32px, `border-top: 1px solid rgba(255,255,255,0.06)`):
- Left: "GG" — Cormorant Garamond 22px 600, `rgba(255,255,255,0.25)`
- Right: "GAURAV GUPTA · JAIPUR · 2025" — DM Sans 10px, `rgba(255,255,255,0.18)`, uppercase, `letter-spacing: 0.12em`

---

## Reusable Component: SectionLabel

Used at the top of every section. Accepts `dark` prop.

```jsx
function SectionLabel({ number, title, dark = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
      <div style={{ width: '40px', height: '1px', background: '#bf5c3a', flexShrink: 0 }} />
      <span style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
        letterSpacing: '0.16em', color: '#bf5c3a', fontWeight: 600,
        textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        {String(number).padStart(2, '0')} — {title}
      </span>
      <div style={{ flex: 1, height: '1px', background: dark ? 'rgba(255,255,255,0.08)' : '#e2dbd3' }} />
    </div>
  );
}
```

---

## Interactions & Animations

| Element | Trigger | Effect |
|---|---|---|
| Nav bar | scroll > 60px | bg fades in, blur activates. `transition: 0.35s ease` |
| Project card | hover | `translateY(-4px)` + shadow + border color. `transition: 0.25s ease` |
| Project card "View details" | hover on card | `opacity: 0 → 1`. `transition: 0.2s` |
| Experience row | click | accordion expand/collapse. `max-height: 0 → 200px`. `transition: 0.35s ease` |
| Experience row "+" icon | click | `transform: rotate(45deg)`. `transition: 0.25s` |
| Case study row | hover | bg `#fff → #0b1628`, all text colors shift. `transition: background 0.3s ease`, text `0.3s` |
| Case study arrow | hover | `translateX(6px)`. `transition: 0.25s` |
| Project modal | open | overlay with `backdrop-filter: blur(6px)`. Dismiss on overlay click. |
| Nav links | hover | color `rgba(255,255,255,0.55) → #fff`. `transition: 0.2s` |
| Footer links | hover | opacity to 0.85 |

---

## Page Structure (Route)

This is a **single-page layout** — all sections scroll vertically on the homepage (`/`). The existing multi-page structure can be collapsed into one scrolling page, or each section can be its own route with the same design system applied.

**Scroll anchors used:**
- `#home` — Hero
- `#experience` — Work Experience
- `#work` — Projects
- `#case-studies` — Case Studies
- `#skills` — Skills
- `#credentials` — Education

---

## Assets

- **Photo:** `/photo.jpg` — already in the Vercel project. Used as social/OG meta image only; not displayed in the body of this redesign.
- **Fonts:** Google Fonts CDN — Cormorant Garamond + DM Sans. Add to `_document.js` or `layout.tsx`.
- **Icons:** None — the design intentionally avoids icons. No icon library needed.
- **Images:** None — all sections use type, color, and geometry only.

---

## Key Design Principles to Preserve

1. **No border-radius anywhere** — sharp corners are the architectural language.
2. **No emoji** — the design is deliberately icon/emoji-free.
3. **No gradient backgrounds** — the only gradient is the subtle blueprint grid (CSS lines only).
4. **Section alternation:** cream `#f7f3ee` → white `#fff` → cream → dark navy → white → dark navy. This creates rhythm.
5. **The 2px gap trick:** in grids, set `gap: 2px` and `background: #e2dbd3` on the parent to create hairline separators between cards without individual borders.
6. **Terracotta is the only accent** — it appears on: section labels, career arc tags, category overlines, the email underline in footer. Blue `#2d5da1` appears only for metric tags and hover accents. Keep these roles distinct.

---

## Files in This Bundle

| File | Purpose |
|---|---|
| `GauravG Portfolio.html` | Full design prototype — open in browser to see all sections |
| `portfolio-app.jsx` | React source — all components with full inline styles |
| `tweaks-panel.jsx` | Dev toggle panel (ignore for production) |

---

*This handoff was prepared from a high-fidelity HTML prototype. All values are exact — no estimation. The prototype is the source of truth; refer to `portfolio-app.jsx` for the full component implementations.*
