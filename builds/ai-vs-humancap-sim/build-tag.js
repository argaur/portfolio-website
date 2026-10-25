// Tells this build apart inside the portfolio's PostHog traffic (builds/CLAUDE.md).
// Runs after /analytics.js (both deferred, so in order). No-op if analytics did not load.
if (window.posthog) window.posthog.register({ build: 'ai-vs-humancap-sim' });
