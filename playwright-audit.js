const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PORTFOLIO_PATH = path.resolve(__dirname, 'index.html');
const FILE_URL = `file:///${PORTFOLIO_PATH.replace(/\\/g, '/')}`;
const OUT_DIR = path.join(__dirname, 'docs', 'qa-screenshots');

const PANELS = [
  'home',
  'experience',
  'projects',
  'skills',
  'philosophy',
  'credentials',
  'contact',
];

async function navigateToPanel(page, panelId) {
  // Use JS click on the top-nav button (hidden md:flex — visible at 1440px)
  await page.evaluate((id) => {
    const btn = document.querySelector(`nav button[data-panel="panel-${id}"]`);
    if (btn) btn.click();
    else {
      // fallback: any button with matching data-panel
      const any = document.querySelector(`[data-panel="panel-${id}"]`);
      if (any) any.click();
    }
  }, panelId);
  await page.waitForTimeout(600);
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  // ── DESKTOP 1440 ──────────────────────────────────────────────────────────
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => localStorage.setItem('portfolio_gate_passed', 'true'));

  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(`PAGE ERROR: ${err.message}`));

  await page.goto(FILE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  for (const panelId of PANELS) {
    await navigateToPanel(page, panelId);
    await page.screenshot({ path: path.join(OUT_DIR, `${panelId}-desktop.png`), fullPage: false });
    // full-page scroll to catch overflow content
    await page.screenshot({ path: path.join(OUT_DIR, `${panelId}-fullpage.png`), fullPage: true });
    console.log(`✓ desktop: ${panelId}`);
  }
  await ctx.close();

  // ── MOBILE 390 ────────────────────────────────────────────────────────────
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await mobileCtx.addInitScript(() => localStorage.setItem('portfolio_gate_passed', 'true'));

  const mobilePage = await mobileCtx.newPage();
  mobilePage.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(`[mobile] ${msg.text()}`); });

  await mobilePage.goto(FILE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);

  for (const panelId of PANELS) {
    await navigateToPanel(mobilePage, panelId);
    await mobilePage.screenshot({ path: path.join(OUT_DIR, `${panelId}-mobile.png`), fullPage: true });
    console.log(`✓ mobile: ${panelId}`);
  }
  await mobileCtx.close();

  await browser.close();

  // Write errors log
  const errPath = path.join(OUT_DIR, 'console-errors.txt');
  if (consoleErrors.length > 0) {
    fs.writeFileSync(errPath, consoleErrors.join('\n'));
    console.log(`\n⚠ ${consoleErrors.length} console error(s) → ${errPath}`);
  } else {
    fs.writeFileSync(errPath, 'No console errors.');
    console.log('\n✓ No console errors');
  }

  console.log(`\nDone. All screenshots → ${OUT_DIR}`);
})();
