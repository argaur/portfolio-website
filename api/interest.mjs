// POST /api/interest: stores one "Show interest" submission in Neon.
// Called by /interest.js on the home and services pages. DATABASE_URL comes from
// the Vercel Neon integration. Table: see the SQL in CLAUDE.md, "Show interest".
import { neon } from '@neondatabase/serverless';
import { validate, originAllowed } from './_validate.mjs';

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function POST(request) {
  if (!originAllowed(request.headers.get('origin'))) return json(403, { error: 'Forbidden.' });

  const length = Number(request.headers.get('content-length') || 0);
  if (length > 4096) return json(413, { error: 'Too large.' });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  const result = validate(body);
  if (!result.ok) return json(400, { error: result.error });
  if (result.bot) return json(200, { ok: true });

  if (!process.env.DATABASE_URL) {
    console.error('[interest] DATABASE_URL is not set');
    return json(500, { error: 'Not configured.' });
  }

  const { email, name, interest, note, source } = result.row;
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`insert into interest (email, name, interest, note, source) values (${email}, ${name}, ${interest}, ${note}, ${source})`;
  } catch (err) {
    console.error('[interest] insert failed:', err);
    return json(500, { error: 'Could not save.' });
  }
  return json(201, { ok: true });
}
