# Needs you: portfolio session 2026-10-11

The site work is pushed and live (`385104c`). This file is committed (2026-11-24) but listed in `.vercelignore`, so it is never served on the site. What is left:

## 0. ~~Review backlog (start here next session)~~ Answered 2026-11-10, via Steward
- **What:** 71 findings from the 2026-10-11 design-audit, content and link review, and Stacksmith run. Nothing is fixed yet.
- **Full list:** project memory `project-review-backlog-2026-10-11.md`.
- **Do first:** batches D and C, the pre-built Tailwind file and the Rulecard name are done on branch `review/2026-10-31-batches-d-c` (2026-10-31), not pushed, not deployed. Most of the backlog was already fixed. Review the branch, then say "merge". First paint measured 3.05s on a harsh profile, still over the 2s bar. Left for you: content items 1, 2, 3 (claims), 10, 19, 20, 34, 35, 36, 39 and DNS item 23.
- **Also uncommitted:** the re-recorded GST trailer (`assets/trailers/gst-notice.mp4` and `.jpg`).
- **Answer (Steward, 2026-11-10):** Merge the branch
- [DONE 2026-11-24] Already done, no new work. `review/2026-10-31-batches-d-c` was merged into main as `6dfc2a2` (2026-11-02) and is on origin/main, so it is live. The GST trailer files were committed in `fc7f5f2`; nothing is uncommitted. Content items and DNS item 23 stay open under item 5 below.

## 2. ~~Test accounts for landing-only trailers~~ Answered 2026-11-26, via Steward
- **What:** the Siteline, Trivo and Vitae trailers are unwired until there is in-app footage.
- **Do:** share a test login for each, or a sample prescription for Vitae. Siteline uses Telegram sign-in.
- **Answer (Steward, 2026-11-26):** Share all three test accounts
- [WAITING 2026-11-26] Not started: no test account is in gopass or the capture profile yet. Asked Gaurav for the hand-over (sign-ins in the capture profile, Vitae sample file). Filming starts once they land.

## 3. ~~Blinkit check-in bug (other repo)~~ Answered 2026-11-10, via Steward
- **What:** on blinkit-command-hub.vercel.app, the picker check-in list never ticks, so "Ready to Pick" stays disabled and the flow dead-ends. The 800ms tick timer looks like it resets on every re-render.
- **Do:** decide whether to fix it in the Blinkit repo. It is not part of this site.
- **Answer (Steward, 2026-11-10):** Hold it
- [DONE 2026-11-24] Recorded, no work.

## 4. GST AI text: FIXED 2026-10-11
- Fixed and live in gst-itc-mismatch-explained `4046300`. The client read `data.explanations`, but the server sends `data.sentences`. A contract test now covers it. The trailer was re-recorded but is not committed yet (see item 0).

## 5. RuleCard live page shows placeholders: FIXED 2026-10-30
- **What:** rulecard.gauravg.dev shows a "PLACEHOLDER builder name" link to placeholder.invalid and a "PLACEHOLDER-owner-email@example.invalid" mailto. The trailer keeps both out of frame.
- **Do:** fill in the real name and contact in the agent-proving-ground repo.

## 6. ~~life-os trailer needs a demo mode~~ Answered 2026-11-10, via Steward
- **What:** there is no fixture or demo mode, so the app cannot run without your Google login and private vault. Nothing was recorded, and `project-life-os.html` keeps its slide reel.
- **Do:** approve a demo mode in the life-os repo, for example an env flag that skips auth and serves fixture JSON from `lib/bff.ts`. Or keep the slide reel.
- **Answer (Steward, 2026-11-10):** Approve demo mode
- [DONE 2026-11-24] Built in life-os on branch `feat/demo-mode` (`3d99ddd`, D-072), not merged. Run `LIFE_OS_DEMO=1 npm run dev` in `life-os/apps/web`: no login, invented data, Today plus capture and correction work. Off in production builds. Next: merge the branch, then record the trailer.

## 5. ~~Portfolio and resume: next session~~ Answered 2026-11-10, via Steward
- **What:** brainstorm what to add or remove on both, then fix the flagged claims. The voice rewrite is live (`1ab790a`).
- **Full list:** project memory `project-claims-backlog-2026-11-02.md`.
- **Answer (Steward, 2026-11-10):** Schedule it for later
- [DONE 2026-11-24] Recorded, no work.
