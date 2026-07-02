# PRD: [Feature Name] (in [Existing Product Name])

**Version**: 1.0 | **Status**: Draft / Submitted
**PM**: [Name] | **Date**: YYYY-MM-DD

---

> **Confidence Tags**
> 🟢 Confirmed by primary research (direct user interviews)
> 🟡 Confirmed by secondary research (usage data, support tickets, reviews)
> 🔵 A direction I believe in but have not yet proven. Treat it as a hypothesis.

---

## 1. Context in Product

[One paragraph: what the existing product does today, and where in the user's journey this feature sits. Assumes the reader already knows the product — do not re-derive market/persona from scratch.]

**Existing user segment this affects**: [Which slice of the current user base, and roughly how many.]

---

## 2. Evidence From Usage / Feedback

| Evidence | Magnitude | Source | Confidence |
|----------|-----------|--------|-----------|
| [Support ticket theme] | [X tickets/month] | [Helpdesk/CS] | 🟡 |
| [Usage data gap] | [X% drop-off at step Y] | [Analytics] | 🟢 |
| [Direct user ask] | [X/Y users mentioned it] | [Interviews] | 🟢 |

> **Key Insight**
>
> [The sharpest version of why this feature, now, for this segment.]

---

## 3. Narrowed Problem Statement

[One paragraph: the specific breakdown in the existing product, who it affects, and why the current design doesn't solve it.]

**In scope**: [2-3 specific failure modes this feature addresses]
**Out of scope**: [What's explicitly not covered, and why]

---

## Polarizing Claim

> **The claim this feature makes that not everyone will agree with.**

[One sentence — the bet this feature depends on. Run the Steelman Gate before building: sharpest counter-argument in two sentences, then your defense in two sentences.]

---

## 4. Options Considered

| Option | What It Does | Cost/Complexity | Why Chosen / Rejected |
|--------|-------------|-----------------|----------------------|
| A | [Description] | [Low/Med/High] | [Reason] |
| B | [Description] | [Low/Med/High] | [Reason] |
| C (chosen) | [Description] | [Low/Med/High] | [Reason] |

---

## 5. Scope + Regression Risk

**What we're building**: [The minimum coherent version of this feature.]

**What existing behavior this touches**: [Every existing flow/screen/API this feature changes or could break.]

**Regression risk table:**

| Existing capability affected | Risk | Mitigation |
|---|---|---|
| [Capability 1] | [What could break] | [Test/flag/rollback plan] |
| [Capability 2] | [What could break] | [Test/flag/rollback plan] |

---

## 6. User Stories

| # | Story | Acceptance Criteria |
|---|-------|-------------------|
| U1 | As a [user], I want to [action] so I [outcome]. | [Testable criteria] |
| U2 | | |

---

## 7. Metric Delta

The specific, measurable change this feature should produce in an existing metric — not a new metric invented for this feature alone.

| Metric (existing) | Baseline | Target After Ship | Kill Signal |
|---|---|---|---|
| [Metric] | [Current value] | [Target] | [Below which value = pause and diagnose] |

---

## 8. Rollout

| Stage | Audience | Duration | Success Gate to Expand |
|---|---|---|---|
| Internal/dogfood | [Team] | [Time] | [Gate] |
| Beta | [X% of segment] | [Time] | [Gate] |
| Full rollout | 100% | — | — |

**Rollback plan**: [Feature flag / config toggle / migration reversal — the specific mechanism, not "we'll figure it out."]

---

## 9. What We Left Out and Why

| Idea | Why Excluded | Revisit When |
|------|-------------|-------------|
| [Idea] | [Reason] | [Trigger condition] |

---

*Interview notes and research sources: `Documentation/research/PRIMARY_RESEARCH.md`, `Documentation/research/SECONDARY_RESEARCH.md`*
