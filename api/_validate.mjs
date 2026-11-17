// Input rules for /api/interest. Files starting with "_" are not deployed as functions.
// Limits match the CHECK constraints on the Neon table `interest`.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INTERESTS = new Set(['freelance', 'role', 'following']);
const LIMITS = { name: 100, note: 1000, source: 200 };

const ORIGINS = new Set(['https://gauravg.dev', 'https://www.gauravg.dev', 'https://gauravg-portfolio.vercel.app']);
const PREVIEW_RE = /^https:\/\/portfolio-website-[a-z0-9-]+-argaurs-projects\.vercel\.app$/;
const LOCAL_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function originAllowed(origin) {
  if (typeof origin !== 'string') return false;
  return ORIGINS.has(origin) || PREVIEW_RE.test(origin) || LOCAL_RE.test(origin);
}

function optional(value, max) {
  if (value === undefined || value === null) return { ok: true, value: null };
  if (typeof value !== 'string') return { ok: false };
  const v = value.trim();
  if (v.length > max) return { ok: false };
  return { ok: true, value: v || null };
}

export function validate(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
  if (typeof body.email !== 'string') return { ok: false, error: 'Enter a valid email address.' };
  const email = body.email.trim();
  if (email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' };

  const interest = body.interest ?? null;
  if (interest !== null && !INTERESTS.has(interest)) return { ok: false, error: 'Invalid interest.' };

  const row = { email, name: null, interest, note: null, source: null };
  for (const key of Object.keys(LIMITS)) {
    const r = optional(body[key], LIMITS[key]);
    if (!r.ok) return { ok: false, error: `Invalid ${key}.` };
    row[key] = r.value;
  }

  // Hidden field only bots fill. Caller answers 200 and stores nothing.
  const bot = typeof body.website === 'string' && body.website.trim() !== '';
  return { ok: true, bot, row };
}
