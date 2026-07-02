# Experiment Brief: [Name]

**Date**: YYYY-MM-DD | **Owner**: [Name] | **Time-box**: [X days/weeks]

---

> **Confidence Tags** — expect this document to be mostly 🔵/🟡. That's the correct shape for
> a fast validation spike, not a process failure.
> 🟢 Confirmed by primary research 🟡 Secondary research 🔵 Hypothesis 🔴 Disproven

---

## 1. Hypothesis

[One sentence: "We believe [specific user/segment] will [specific behavior] if [specific change], because [reason]."]

**Confidence**: 🔵/🟡 — [why]

---

## 2. Why This, Why Now

[2-3 sentences: what prompted this — an observation, a support pattern, a competitor move, a hunch worth 30 minutes of secondary research before committing more time.]

---

## 3. Smallest Test

**What we're actually building/doing**: [The minimum artifact needed to get a real signal — a landing page, a manual concierge version, a single flag-gated screen, a 5-person outreach. Not a product.]

**What we are explicitly NOT building**: [The things a "real feature" would need that this test skips.]

---

## 4. Kill Criterion

**This experiment fails if**: [Specific, measurable, decided *before* running it — e.g. "fewer than X% of Y click the CTA within Z days."]

**We will know this by**: [date]

---

## 5. What Graduates It

If the hypothesis holds, what does this become? Which template does it graduate to?

| If hypothesis... | Next step |
|---|---|
| Holds strongly | Promote to `feature-prd.md` (if inside existing product) or `lean-prd.md` (if net-new) |
| Holds weakly / mixed signal | Re-run with adjusted variable, or narrow the segment |
| Fails (kill criterion hit) | Log outcome in `DECISIONS_LOG.md`, do not build further |

---

## 6. Evidence Against (required — even for a fast spike)

At least one entry, or an explicit "searched X; found nothing" log. An experiment brief with zero disconfirming evidence considered is a sign the hypothesis wasn't actually tested against reality yet.

| Evidence Against | Source | Confidence |
|---|---|---|
| [Reason this might not work] | [Source] | 🟡/🔵 |

---

*Research: `Documentation/research/SECONDARY_RESEARCH.md` (secondary-only fast path — primary research not required for this template).*
