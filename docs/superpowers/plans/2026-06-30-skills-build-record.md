# The Build Record — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the `#panel-skills` panel in `index.html` into "The Build Record" (a top industries banner + 6 capability blocks with `PROVEN IN:` footers) and add an end-of-list Projects→Skills CTA band.

**Architecture:** Content + light-markup change to two existing panels in the single-file `index.html`. Reuses the site's existing Tailwind-CDN utility classes and custom color tokens (no new CSS file, no build step). The CTA band reuses the existing global `activatePanel()` via a `data-panel="panel-skills"` attribute (delegated listener already binds every `[data-panel]` element at load), mirroring the existing precedent button at `index.html:503`.

**Tech Stack:** Plain HTML + Tailwind CSS (CDN runtime, configured inline at `index.html:15`) + vanilla JS. Verification via Playwright (already available in this environment) against `python -m http.server`.

**Spec:** `docs/superpowers/specs/2026-06-30-skills-build-record-redesign-design.md`

> **Note on "no Tailwind":** the project CLAUDE.md predates the v3 redesign; the live `index.html` loads Tailwind via CDN at line 12 (runtime JIT, no build step) and the entire panel is built from Tailwind utilities. New markup follows that existing pattern for consistency. The "no build step" constraint still holds.

---

## File Structure

- **Modify only:** `index.html`
  - `#panel-skills` header (~lines 775–778): rename + new subhead
  - `#panel-skills`: insert industries banner between header and the grid (~line 779)
  - `#panel-skills`: replace inner content of the 6 `.skill-block` cells (~lines 780–786), keeping wrapper classes/spans
  - `#panel-projects`: insert CTA band after the last project row (~line 767)
- **No other files change.** No `styles.css`, `gate.js`, or case-study changes.

## Verification harness (used by every task)

Start once at the beginning of execution:

```bash
cd "c:/Users/Gaurav Gupta/Documents/Projects/portfolio-website"
python -m http.server 8731 >/tmp/br_srv.log 2>&1 &
```

Playwright pages must bypass the email gate by seeding localStorage before loading `index.html`:

```js
await page.addInitScript(() => { try { localStorage.setItem('portfolio_gate_passed','1'); } catch(e){} });
```

---

### Task 1: Header rename + Industries banner

**Files:**
- Modify: `index.html` `#panel-skills` header + insert banner before the grid

- [ ] **Step 1: Replace the panel header**

Find (current, ~lines 775–778):

```html
      <header class="mb-16 border-l-2 border-primary-container pl-6">
        <h1 class="font-display text-display text-on-surface mb-2">Capabilities Matrix</h1>
        <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Systemic proficiency across product, AI, and delivery domains</p>
      </header>
```

Replace with:

```html
      <header class="mb-10 border-l-2 border-primary-container pl-6">
        <h1 class="font-display text-display text-on-surface mb-2">The Build Record</h1>
        <p class="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">Capabilities, with the projects that prove them &mdash; across industries I&rsquo;ve shipped in and domains I&rsquo;m building in now.</p>
      </header>
```

- [ ] **Step 2: Insert the industries banner immediately after the `</header>`**

Insert this block directly after the header closing tag and before the existing `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ...">`:

```html
      <!-- Industries band -->
      <div class="mb-10 border border-outline-variant bg-surface-container-low p-6">
        <div class="mb-5">
          <p class="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-widest mb-3">Shipped Across</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">Health Tech</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">Quick Commerce</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">EdTech / Careers</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">B2B SaaS</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">Consumer Media</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">Travel</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">Enterprise / BPO</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">Econ Research</span>
            <span class="px-3 py-1 border border-outline font-label-sm text-label-sm text-on-surface uppercase">Architecture / AEC</span>
          </div>
        </div>
        <div>
          <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-3">Now Building</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 border border-dashed border-outline-variant font-label-sm text-label-sm text-on-surface-variant uppercase">&#9675; Personal Finance</span>
            <span class="px-3 py-1 border border-dashed border-outline-variant font-label-sm text-label-sm text-on-surface-variant uppercase">&#9675; Assessment / Exam Prep</span>
            <span class="px-3 py-1 border border-dashed border-outline-variant font-label-sm text-label-sm text-on-surface-variant uppercase">&#9675; L&amp;D / Learning</span>
          </div>
        </div>
      </div>
```

- [ ] **Step 3: Verify in browser**

Run this Playwright check:

```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.addInitScript(() => localStorage.setItem('portfolio_gate_passed','1'));
  await p.goto('http://localhost:8731/index.html#skills', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const h1 = await p.$eval('#panel-skills h1', e => e.textContent.trim());
  const shipped = await p.$$eval('#panel-skills .flex.flex-wrap span', els => els.map(e=>e.textContent.trim()));
  const nowBuilding = shipped.filter(t => t.includes('○'));
  console.log('h1:', h1, '| chips:', shipped.length, '| now-building:', nowBuilding);
  await p.screenshot({ path: '/tmp/br-task1.png' });
  await b.close();
})();
```

Expected: `h1: The Build Record`; chips total 12; now-building = `['○ Personal Finance','○ Assessment / Exam Prep','○ L&D / Learning']`; no project names in the now-building chips.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(skills): rename to The Build Record + add industries banner"
```

---

### Task 2: Capability blocks 01–03

**Files:**
- Modify: `index.html` `#panel-skills` grid cells 01, 02, 03 (keep each `<div class="skill-block ...">` wrapper classes exactly; replace inner `<div class="relative z-10">…</div>`)

- [ ] **Step 1: Replace block 01 (AI & Retrieval, wide)**

Replace the entire block-01 cell (`skill-block delay-1 … lg:col-span-2`) with:

```html
        <div class="skill-block delay-1 relative overflow-hidden p-8 border-r border-b border-outline-variant bg-surface-container-low min-h-[320px] lg:col-span-2"><div class="number-bg absolute -bottom-8 -right-4 font-display text-[140px] text-surface-bright/30 font-bold">01</div><div class="relative z-10"><h2 class="font-headline-md text-headline-md text-primary-fixed-dim mb-6 uppercase flex items-center gap-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>AI &amp; Retrieval</h2><ul class="space-y-3"><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Self-deployed pgvector DB &mdash; IVFFlat index, hand-written match_chunks()</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Manual SSE streaming over raw REST</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">3072-dim embeddings &middot; archetype-filtered retrieval</li><li class="font-body-md text-body-md text-on-surface-variant py-1">RAG pipeline design</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Prompt engineering</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Claude / Gemini APIs</li></ul><div class="mt-6 pt-4 border-t border-outline-variant/30"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Proven in: </span><a href="project-pm-pathfinder.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">PM Pathfinder</a></div></div></div>
```

- [ ] **Step 2: Replace block 02 (Applied AI Pipelines)**

Replace the block-02 cell (`skill-block delay-2 … min-h-[320px]`) with:

```html
        <div class="skill-block delay-2 relative overflow-hidden p-8 border-r border-b border-outline-variant bg-surface-container-low min-h-[320px]"><div class="number-bg absolute -bottom-8 -right-4 font-display text-[140px] text-surface-bright/30 font-bold">02</div><div class="relative z-10"><h2 class="font-headline-md text-headline-md text-primary-fixed-dim mb-6 uppercase flex items-center gap-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>Applied AI Pipelines</h2><ul class="space-y-3"><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">OCR &rarr; structured-record pipeline (Gemma multimodal &rarr; Claude)</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Confidence-scored field extraction</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Conversation-first AI CRM</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Plain-language generation</li><li class="font-body-md text-body-md text-on-surface-variant py-1">429 fallback model pools</li></ul><div class="mt-6 pt-4 border-t border-outline-variant/30"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Proven in: </span><a href="case-study-vitae.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">Vitae</a> <span class="text-on-surface-variant">&middot;</span> <a href="case-study-founder-crm.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">Founder&rsquo;s CRM</a></div></div></div>
```

- [ ] **Step 3: Replace block 03 (Agentic Automation & Tooling)**

Replace the block-03 cell (`skill-block delay-3 … min-h-[320px]`) with:

```html
        <div class="skill-block delay-3 relative overflow-hidden p-8 border-r border-b border-outline-variant bg-surface-container-low min-h-[320px]"><div class="number-bg absolute -bottom-8 -right-4 font-display text-[140px] text-surface-bright/30 font-bold">03</div><div class="relative z-10"><h2 class="font-headline-md text-headline-md text-primary-fixed-dim mb-6 uppercase flex items-center gap-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>Agentic Automation</h2><ul class="space-y-3"><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Telegram keyword-router + Claude freetext (28+ commands)</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">10 system integrations &middot; 5 daily automations</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Gmail / Calendar CLI tooling</li><li class="font-body-md text-body-md text-on-surface-variant py-1">n8n workflows</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Webhook routing &middot; cron jobs</li></ul><div class="mt-6 pt-4 border-t border-outline-variant/30"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Proven in: </span><a href="project-telegram-bot.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">Telegram Bot</a> <span class="text-on-surface-variant">&middot;</span> <a href="project-gws-cli.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">GWS CLI</a> <span class="text-on-surface-variant">&middot;</span> <a href="project-homelab.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">Homelab</a></div></div></div>
```

- [ ] **Step 4: Verify in browser**

```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.addInitScript(() => localStorage.setItem('portfolio_gate_passed','1'));
  await p.goto('http://localhost:8731/index.html#skills', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const titles = await p.$$eval('#panel-skills .skill-block h2', els => els.map(e=>e.textContent.trim()));
  const provenCount = await p.$$eval('#panel-skills .skill-block', els => els.filter(e=>/Proven in:/.test(e.textContent)).length);
  console.log('block titles:', titles.slice(0,3), '| blocks with Proven-in:', provenCount);
  await p.screenshot({ path: '/tmp/br-task2.png', fullPage: true });
  await b.close();
})();
```

Expected: first three titles are `AI & Retrieval`, `Applied AI Pipelines`, `Agentic Automation`; at least 3 blocks contain "Proven in:".

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(skills): rework blocks 01-03 to capabilities-with-receipts"
```

---

### Task 3: Capability blocks 04–06 (+ stats move to 06)

**Files:**
- Modify: `index.html` `#panel-skills` grid cells 04, 05, 06 (keep wrapper classes/spans; block 06 keeps its `lg:col-span-3 md:col-span-2` span and gains the stat row).

- [ ] **Step 1: Replace block 04 (Data & Simulation)**

```html
        <div class="skill-block delay-4 relative overflow-hidden p-8 border-r border-b border-outline-variant bg-surface-container-low min-h-[320px]"><div class="number-bg absolute -bottom-8 -right-4 font-display text-[140px] text-surface-bright/30 font-bold">04</div><div class="relative z-10"><h2 class="font-headline-md text-headline-md text-primary-fixed-dim mb-6 uppercase flex items-center gap-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>Data &amp; Simulation</h2><ul class="space-y-3"><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Cited-coefficient simulation engine</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Confidence-floor propagation through effect chains</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Python pure-function core + contract-tested TS port</li><li class="font-body-md text-body-md text-on-surface-variant py-1">SQL &amp; analytics &middot; funnel / cohort</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Real-time ops decision support</li></ul><div class="mt-6 pt-4 border-t border-outline-variant/30"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Proven in: </span><a href="project-ai-humancap-sim.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">AI vs Human Capital</a> <span class="text-on-surface-variant">&middot;</span> <a href="case-study-blinkit.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">Blinkit</a></div></div></div>
```

- [ ] **Step 2: Replace block 05 (Infra & Product Engineering)**

```html
        <div class="skill-block delay-5 relative overflow-hidden p-8 border-r border-b border-outline-variant bg-surface-container-low min-h-[320px]"><div class="number-bg absolute -bottom-8 -right-4 font-display text-[140px] text-surface-bright/30 font-bold">05</div><div class="relative z-10"><h2 class="font-headline-md text-headline-md text-primary-fixed-dim mb-6 uppercase flex items-center gap-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>Infra &amp; Product Eng</h2><ul class="space-y-3"><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">IaC homelab &mdash; Docker / Vault / Ansible / Prometheus</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Supabase Auth + Row-Level Security</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">PWA service workers &middot; zero-dependency panel SPA</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Reverse proxy / DNS</li><li class="font-body-md text-body-md text-on-surface-variant py-1">CI-less static deploys &middot; observability</li></ul><div class="mt-6 pt-4 border-t border-outline-variant/30"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Proven in: </span><a href="project-homelab.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">Homelab</a> <span class="text-on-surface-variant">&middot;</span> <a href="case-study-vitae.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">Vitae</a> <span class="text-on-surface-variant">&middot;</span> <a href="project-portfolio.html" class="font-label-sm text-label-sm text-primary-fixed-dim hover:underline">This site</a></div></div></div>
```

- [ ] **Step 3: Replace block 06 (Product Craft, full-wide, with stats)**

```html
        <div class="skill-block delay-6 relative overflow-hidden p-8 border-r border-b border-outline-variant bg-surface-container-low min-h-[280px] lg:col-span-3 md:col-span-2"><div class="number-bg absolute -bottom-8 -right-4 font-display text-[140px] text-surface-bright/30 font-bold">06</div><div class="relative z-10"><h2 class="font-headline-md text-headline-md text-primary-fixed-dim mb-6 uppercase flex items-center gap-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Product Craft</h2><ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3"><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Discovery &amp; roadmapping</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Go-to-market</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">OKRs &amp; prioritization</li><li class="font-body-md text-body-md font-medium text-on-surface border-b border-outline-variant/30 pb-2">Agile / Scrum (CSM &amp; CSPO)</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Stakeholder mapping</li><li class="font-body-md text-body-md text-on-surface-variant py-1">Cross-functional delivery</li><li class="font-body-md text-body-md text-on-surface-variant py-1">B.Arch systems-thinking</li><li class="font-body-md text-body-md text-on-surface-variant py-1">UX research</li></ul><div class="mt-6 pt-4 border-t border-outline-variant/30 flex flex-wrap gap-8"><div><span class="font-display text-[28px] text-primary-fixed-dim leading-none">8+</span><span class="font-label-sm text-label-sm text-on-surface-variant block mt-1 uppercase tracking-wider">Years</span></div><div><span class="font-display text-[28px] text-primary-fixed-dim leading-none">30+</span><span class="font-label-sm text-label-sm text-on-surface-variant block mt-1 uppercase tracking-wider">Initiatives</span></div><div><span class="font-display text-[28px] text-primary-fixed-dim leading-none">7</span><span class="font-label-sm text-label-sm text-on-surface-variant block mt-1 uppercase tracking-wider">Products</span></div><div><span class="font-display text-[28px] text-primary-fixed-dim leading-none">5,000+</span><span class="font-label-sm text-label-sm text-on-surface-variant block mt-1 uppercase tracking-wider">Users</span></div></div></div></div>
```

- [ ] **Step 4: Verify in browser**

```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.addInitScript(() => localStorage.setItem('portfolio_gate_passed','1'));
  await p.goto('http://localhost:8731/index.html#skills', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const titles = await p.$$eval('#panel-skills .skill-block h2', els => els.map(e=>e.textContent.trim()));
  const stats = await p.$$eval('#panel-skills .skill-block:last-child .font-display', els => els.map(e=>e.textContent.trim()));
  const provenCount = await p.$$eval('#panel-skills .skill-block', els => els.filter(e=>/Proven in:/.test(e.textContent)).length);
  console.log('all titles:', titles);
  console.log('block06 stats:', stats, '| blocks with Proven-in (expect 5):', provenCount);
  await p.screenshot({ path: '/tmp/br-task3.png', fullPage: true });
  await b.close();
})();
```

Expected: 6 titles ending with `Product Craft`; block06 stats include `8+`, `30+`, `7`, `5,000+`; 5 blocks contain "Proven in:" (block 06 has stats instead).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(skills): rework blocks 04-06 + move build stats to Product Craft"
```

---

### Task 4: Projects → Skills CTA band

**Files:**
- Modify: `index.html` `#panel-projects` — insert after the last project row (row 11, the `pp-5` AI vs Human Capital row) and before the closing `</div>` of the rows container (~line 767).

- [ ] **Step 1: Insert the CTA band**

Find the end of the projects rows container — the `</div>` that closes the `<div>` wrapping all `.project-row` elements (immediately after the row-11 block, before `</div></div></section>` of `#panel-projects`). Insert this band as the last child of that rows `<div>`:

```html
        <!-- Projects → Skills bridge -->
        <div class="mt-12 pt-10 border-t border-outline-variant">
          <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mb-6">Eleven builds, nine domains. Look across them and the same capabilities keep recurring &mdash; retrieval systems, self-deployed infra, simulation engines, agentic automation.</p>
          <button type="button" class="nav-link font-label-md text-label-md text-primary-fixed-dim border border-primary-fixed-dim/40 px-6 py-3 hover:bg-primary-fixed-dim/10 transition-colors uppercase tracking-widest" data-panel="panel-skills">See the capability map &rarr;</button>
        </div>
```

- [ ] **Step 2: Verify the band renders and switches panels**

```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.addInitScript(() => localStorage.setItem('portfolio_gate_passed','1'));
  await p.goto('http://localhost:8731/index.html#projects', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const btn = await p.$('#panel-projects button[data-panel="panel-skills"]');
  console.log('CTA present:', !!btn);
  await btn.click();
  await p.waitForTimeout(600);
  const skillsActive = await p.$eval('#panel-skills', e => e.classList.contains('is-active'));
  const hash = await p.evaluate(() => location.hash);
  console.log('skills active after click:', skillsActive, '| hash:', hash);
  await b.close();
})();
```

Expected: `CTA present: true`; `skills active after click: true`; `hash: #skills`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(projects): add Projects->Skills capability-map CTA band"
```

---

### Task 5: Full verification pass (desktop + mobile) & regression check

**Files:** none (verification only; fix inline + amend the relevant prior commit if an issue is found).

- [ ] **Step 1: Run the consolidated check**

```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const vp of [{w:1280,h:900,name:'desktop'},{w:390,h:844,name:'mobile'}]) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    await p.addInitScript(() => localStorage.setItem('portfolio_gate_passed','1'));
    await p.goto('http://localhost:8731/index.html#skills', { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const rows = await p.$$eval('#panel-projects .project-row', els => els.length);
    const titles = await p.$$eval('#panel-skills .skill-block h2', els => els.map(e=>e.textContent.trim()));
    // overflow check: any chip wider than its container?
    const overflow = await p.evaluate(() => document.querySelector('#panel-skills').scrollWidth > document.querySelector('#panel-skills').clientWidth + 2);
    await p.screenshot({ path: `/tmp/br-final-${vp.name}.png`, fullPage: true });
    console.log(`[${vp.name}] rows:`, rows, '| skill titles:', titles.length, '| h-overflow:', overflow, '| errors:', errs.length?errs:'none');
    await ctx.close();
  }
  await b.close();
})();
```

Expected for both viewports: `rows: 11`; `skill titles: 6`; `h-overflow: false`; `errors: none`.

- [ ] **Step 2: Visually review the four screenshots**

Open `/tmp/br-final-desktop.png` and `/tmp/br-final-mobile.png`. Confirm: header reads "The Build Record"; industries banner sits above the grid with chips wrapping cleanly (no clipping at 390px); 6 blocks intact with `PROVEN IN:` footers; block 06 shows the 4 stats; the CTA band shows under the project list. Fix any layout issue inline and re-run Step 1.

- [ ] **Step 3: Regression — confirm existing nav, a project modal, and a canvas still work**

```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => localStorage.setItem('portfolio_gate_passed','1'));
  await p.goto('http://localhost:8731/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.evaluate(() => activatePanel('panel-projects', true));
  await p.waitForTimeout(300);
  const modal = await p.evaluate(() => { openV3Modal('pp-5'); return document.getElementById('v3-modal').classList.contains('is-open'); });
  console.log('modal opens:', modal, '| errors:', errs.length?errs:'none');
  await b.close();
})();
```

Expected: `modal opens: true`; `errors: none`.

- [ ] **Step 4: Stop the server**

```bash
pkill -f "http.server 8731"
```

- [ ] **Step 5: Final commit (only if Step 2/3 required fixes; otherwise skip)**

```bash
git add index.html
git commit -m "fix(skills): responsive/regression polish for The Build Record"
```

---

## Self-Review

**Spec coverage:**
- Header rename → Task 1 ✓
- Industries banner (shipped + now-building, no project names) → Task 1 ✓
- 6 capability blocks with PROVEN IN footers, clubbed Product Craft, stats moved to 06 → Tasks 2–3 ✓
- Projects→Skills CTA band via existing `data-panel` → Task 4 ✓
- Design-system constraints (tokens, no border-radius, reuse classes) → enforced in markup (no `rounded-*` used) ✓
- Mobile/responsive + no console errors → Task 5 ✓
- Extensibility pattern → documented in spec §5 (no code task needed; it's a maintenance note) ✓

**Placeholder scan:** none — all markup and verification code is concrete.

**Type/name consistency:** `data-panel="panel-skills"` matches `activatePanel`'s `panelId` lookup and `HASH_MAP`; class names match existing utilities; project page hrefs match real files (`project-pm-pathfinder.html`, `case-study-vitae.html`, `case-study-founder-crm.html`, `project-telegram-bot.html`, `project-gws-cli.html`, `project-homelab.html`, `project-ai-humancap-sim.html`, `case-study-blinkit.html`, `project-portfolio.html`).

**Known author-confirmable copy:** CTA band uses "Eleven builds, nine domains" (drops the earlier "four years" per the brainstorm discussion; "domains" not "industries" since Architecture/AEC is a prior career). Adjustable in Task 4 markup without structural change.
