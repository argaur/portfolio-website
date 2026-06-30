# Design — "The Build Record": Skills panel reframe + Projects→Skills bridge

**Date:** 2026-06-30
**Status:** Approved (brainstorm)
**Scope:** Single implementation plan. Content + light-markup rework of two existing panels in `index.html`. No new pages, no framework, no build step.

---

## 1. Goal

Turn the Projects page's dead-weight **Skills / "Capabilities Matrix"** panel into a **breadth-of-build credibility signal** that recruiters actually read, and route organic traffic to it from the Projects panel.

The panel currently reads as an abstract competency list (a placeholder almost no one reaches). The reframe makes it a record of **capabilities with receipts** — each capability tied to a shipped project — plus an **industries dimension** that closes the recruiter's "has he worked in my space?" question, including domains currently in build.

**Success:** A visitor finishing the project list is invited into the Skills panel by a narrative band; on arrival they see (a) the spread of industries shipped + now building, and (b) recurring technical capabilities, each proven by named projects. The page reads as "builder-PM with range," not "slideware PM."

## 2. Non-goals

- No change to the Skills panel's **visual design language**: keep the 6-cell grid, oversized number-bg, icons, top-item-highlight pattern, design tokens, and the no-`border-radius` rule.
- No interactive capability filter (rejected earlier — purpose is static/scannable).
- No clickable per-row capability tags on the Projects list (rejected — adds unrequested interactivity).
- No new section on the Projects page beyond the single CTA band.
- No edits to other panels, case-study pages, or `gate.js`.

## 3. Decisions (locked during brainstorm)

1. **Primary job:** breadth-of-build credibility signal — static, scannable.
2. **Placement:** fold the idea into the existing `#panel-skills`; keep its design, rework its content. (Avoids a duplicate section.)
3. **Reframe depth:** full reframe to "built with," with the soft PM competencies **clubbed** into one consolidated block so they don't dilute the experiments narrative.
4. **Industries:** a full-width **banner strip at the top of the panel**, above the capability grid — `SHIPPED ACROSS` chips + a `NOW BUILDING` cluster (hollow "○" marker) for in-progress domains.
5. **Bridge:** an **end-of-list narrative CTA band** in `#panel-projects` that switches to the Skills panel via the existing `data-panel` mechanism.
6. **Header:** rename `Capabilities Matrix` → **"The Build Record."**

## 4. Detailed design

### 4.1 Panel header (`#panel-skills` header)
- `h1`: **The Build Record**
- Subhead (replaces "Systemic proficiency across product, AI, and delivery domains"): *"Capabilities, with the projects that prove them — across industries I've shipped in and domains I'm building in now."*
- Keep the existing left-border header treatment.

### 4.2 Industries banner (new, full-width, above the grid)
A bordered band using the existing chip styling (same look as project-row tags / case-study `cs-meta-tag`: bordered, uppercase, no radius). Two labeled rows:

- **SHIPPED ACROSS** — `Health Tech` · `Quick Commerce` · `EdTech / Careers` · `B2B SaaS` · `Consumer Media` · `Travel` · `Enterprise / BPO` · `Econ Research` · `Architecture / AEC`
- **NOW BUILDING** *(each chip prefixed with a hollow `○` and visually de-emphasized — outline-variant, lower opacity)* — `Personal Finance` · `Assessment / Exam Prep` · `L&D / Learning`

**Constraint:** "Now building" chips show **domain only — no project names** (per user instruction). Wording is derived from the real in-progress projects but anonymized:
- Personal Finance ← household financial-planning PWA
- Assessment / Exam Prep ← AI-generated MCQ practice + scoring platform
- L&D / Learning ← curated learning-path platform

### 4.3 The six capability blocks
Keep the existing grid spans (block 01 wide `lg:col-span-2`; 02–05 single; 06 full `lg:col-span-3`), number-bg, and icon slots. Reuse the existing `.skill-block` markup; only content changes. Each block follows the established pattern: **highlighted top items** (built capabilities, with a project link) over **muted supporting items** (supporting tech), and a new `PROVEN IN:` footer line listing the project(s).

Project references in the `PROVEN IN:` footer link to the existing detail pages (e.g. `project-pm-pathfinder.html`, `case-study-vitae.html`) where one exists; otherwise plain text.

| # | Title | Span | Highlighted (built) → proof | Supporting (muted) | PROVEN IN |
|---|-------|------|------------------------------|--------------------|-----------|
| 01 | **AI & Retrieval** | wide | Self-deployed pgvector DB — IVFFlat, hand-written `match_chunks()`; Manual SSE streaming; 3072-dim embeddings + archetype scoring | RAG pipeline design · prompt engineering · Claude / Gemini APIs | PM Pathfinder |
| 02 | **Applied AI Pipelines** | 1 | OCR→structured-record pipeline (Gemma multimodal → Claude); Confidence-scored field extraction; Conversation-first AI CRM | multimodal extraction · plain-language generation · 429 fallback pools | Vitae · Founder's CRM |
| 03 | **Agentic Automation & Tooling** | 1 | Telegram keyword-router + Claude freetext (28+ cmds, 10 integrations); Gmail/Calendar CLI | n8n workflows · webhook routing · daily cron automations | Telegram Bot · GWS CLI · Homelab |
| 04 | **Data & Simulation** | 1 | Cited-coefficient simulation engine; Confidence-floor propagation; Python pure-function core + contract-tested TS port | SQL & analytics · funnel/cohort · real-time ops decision support | AI vs Human Capital · Blinkit |
| 05 | **Infra & Product Engineering** | 1 | IaC homelab (Docker / Vault / Ansible / Prometheus); Supabase Auth + RLS; PWA service workers; zero-dependency panel SPA | reverse proxy / DNS · CI-less static deploys · observability | Homelab · Vitae · this site |
| 06 | **Product Craft** *(clubbed)* | full | Discovery & roadmapping; GTM; OKRs & prioritization; Agile/Scrum (CSM / CSPO) | stakeholder mapping · cross-functional delivery · B.Arch systems-thinking · UX research | carries stats: 8+ yrs · 30+ initiatives · 7 products · 5,000+ users |

Block 06 keeps the stat-row treatment currently on block 01 (the `8+ / 30+ / 7` numbers), extended with `5,000+ users`.

Icons: reuse the existing inline SVG icons; re-map them sensibly to the new titles (e.g. the target icon → AI & Retrieval, the grid icon → Pipelines). Inline-SVG-only (per project decision); no icon fonts.

### 4.4 Projects → Skills CTA band (`#panel-projects`, after row 11)
A full-width band after the last project row:
- Copy: *"Eleven builds, four years, nine industries. Look across them and the same capabilities keep recurring — retrieval systems, self-deployed infra, simulation engines, agentic automation."*
- Button: **See the capability map →**
- Mechanism: the button carries `class="nav-link"` + `data-panel="panel-skills"` so it is handled by the **existing** panel-switch listener (same path the nav uses). No new JS routing logic. Verify during implementation that the listener binds by `.nav-link` class (not only nav-container descendants); if it binds by container, call the existing panel-activation function directly instead.
- Style with existing tokens; left-border accent consistent with other panel headers; respects the panel's `overflow` model (the band lives inside the projects panel's scroll container).

## 5. Extensibility (capture future products)

The structure must make adding a newly-shipped product a set of localized one-line edits — documented in the spec so it's repeatable:

1. **Project row** — add a `.project-row` in `#panel-projects` (next index number) + a `V3_PROJECTS` modal entry (`cs-N`/`pp-N`).
2. **Industry** — if the product is in a new domain, add one chip to `SHIPPED ACROSS`; if it was a "Now building" domain, **move** that chip from `NOW BUILDING` to `SHIPPED ACROSS`.
3. **Capability proof** — add the project to the `PROVEN IN:` footer of the relevant block (and, if it introduces a genuinely new capability, one highlighted item).
4. **Bridge counts** — update the "Eleven builds … nine industries" numbers in the CTA band.

No structural/layout change is required for any of these — only content edits. This pattern is the mechanism by which the three current "Now building" domains (Personal Finance, Assessment, L&D) graduate to "Shipped across" as they go live.

## 6. Constraints & honesty bar

- Every capability claim must map to something genuinely shipped/built in the referenced project. No aspirational claims in `SHIPPED ACROSS` or in the capability blocks. In-progress work lives only under `NOW BUILDING`.
- Plain HTML/CSS/vanilla-JS only; no new dependencies, no build step (project hard constraint).
- No `border-radius` anywhere; reuse design tokens and existing utility classes; mobile-first (chips wrap; grid collapses as it already does at the existing breakpoints).
- Touch targets on the CTA button ≥ 44px.

## 7. Implementation surface

- `index.html` only:
  - `#panel-skills`: header copy, new industries banner markup, six reworked block bodies.
  - `#panel-projects`: new CTA band after the project list.
- `styles.css`: only if the industries banner / CTA band need a small amount of new styling not covered by existing utilities (prefer existing classes; add minimal scoped rules if needed).
- No changes to `gate.js`, case-study pages, or `case-study.css`.

## 8. Acceptance criteria

1. `#panel-skills` header reads "The Build Record" with the new subhead.
2. Industries banner renders above the grid: 9 `SHIPPED ACROSS` chips + 3 de-emphasized `NOW BUILDING` chips (`○` marker), **no project names** in the Now-building chips.
3. Six capability blocks render with the new content, each with a `PROVEN IN:` footer; block 06 carries the four stats; layout/spans visually identical to the current grid.
4. Projects panel shows the CTA band after row 11; clicking **See the capability map →** activates `#panel-skills` (and updates the hash to `#skills` if the existing mechanism does so).
5. No `border-radius` introduced; no new dependency/build step; mobile layout intact (chips wrap, grid collapses) at ≤768px and ≤480px.
6. No console errors; existing panel nav, modals, and canvases still work.

## 9. Risks / open items

- **Panel-switch listener binding** — confirm the CTA button is picked up by the existing handler via `.nav-link`/`data-panel`; fallback is a direct call to the panel-activation function. (Verify in implementation.)
- **Block 06 stat move** — block 01 currently owns the stat-row; moving it to block 06 must not leave block 01 visually empty/unbalanced (block 01 gains the strongest built capabilities, which fills it).
- **Chip volume on mobile** — 9 + 3 chips must wrap cleanly on 360px; verify no overflow.
