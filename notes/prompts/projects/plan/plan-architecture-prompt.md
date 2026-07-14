# Plan architecture prompt — the ARCHITECTURE ADVISOR component

**Internal component (new mode only).** This is the architecture specialist in the project-plan
pipeline. `plan-audit.md` dispatches it as a cold subagent **between the author and the reviewer**: the
author picks the project and drafts all 23 sections; this advisor then strengthens the architecture
decisions specifically — the layers, the patterns, and the *one* new architectural concept the project
should introduce — against Victor's current level and learning goals. Then the general reviewer runs.

**Why a dedicated pass.** The author designs the whole plan and its attention is spread across 23
sections; the architecture (§6), the architectural concepts in §3, and the tradeoffs in §20 are exactly
where "looks reasonable" is not the same as "the right architecture for *this* project at *this* skill
level". A focused advisor with the whole attention budget on architecture catches over-engineering
(patterns Victor cannot yet defend), under-engineering (a CRUD blob where a service layer is the point),
and the wrong *new* concept for the step.

It edits the architecture-relevant sections directly and does **not** commit — the general reviewer
runs next and the orchestrator owns the commit.

---

## Configuration — edit only this block

PROJECT = [the chosen project folder path the author just wrote, e.g. projects/08-invoice-manager]

Use PROJECT wherever the prompt refers to {PROJECT}.

---

## Context

Victor is targeting junior / junior-mid roles at Spanish consultancies (NTT Data, Capgemini, Indra) for
August–September 2026. The architecture must be **recognisably professional but level-appropriate**: a
recruiter should see standard enterprise layering, and Victor must be able to **defend every layer and
pattern in an interview**. An architecture he cannot explain is worse than a simpler one he can.

Before starting, read:
- `notes/prompts/projects/plan/_planning-standard.md` — §6 (Architecture), §3 (New concepts), §20
  (Tradeoffs), and the "Design-correctness checks". This is the shape and the bar.
- `PROGRESS.md` — what architecture and patterns Victor has **already** built and can be assumed known
  (the previous project's layers, guards, coordinator pattern, layered backend, JWT filter, etc.).
- `notes/coverage.md` — the architecture section: which architectural concepts are still gaps.
- `{PROJECT}/PLANNING.md` — the draft the author just wrote. §6, §3, §7, §10, §20 are your focus.

---

## Step 1 — Judge the drafted architecture

Read the author's §6 and the entities/API it rests on. Answer, in order:

1. **Is the layering correct for the domain?** Controller → Service → Repository → DB, DTOs at the
   boundary, entities never returned. Is business logic in the service (not the controller, not the
   repository)? Is anything forced into a layer where it does not belong?
2. **Is it level-appropriate?** Flag **over-engineering** — a pattern Victor has not learned and does
   not need here (CQRS, event sourcing, hexagonal ports/adapters, a mapper framework where a hand
   constructor is clearer, microservices). Flag **under-engineering** — a design that skips the very
   pattern the project is supposed to teach, or collapses two layers that should stay separate.
3. **Is the ONE new architectural concept right?** A project should introduce **one** major
   architectural idea beyond the previous one (per §3 and §6). Name it. Is it a genuine gap from
   coverage.md, teachable through this domain, and defensible at junior level? If the author picked
   two, recommend keeping one and deferring the other; if none, recommend the strongest gap.
4. **Do the tradeoffs (§20) reflect real architectural choices?** Each `[X] over [Y] — [reason]` must be
   a decision Victor can defend, not a default. Fix hollow reasons.

---

## Step 2 — Strengthen the plan directly

Where the architecture is wrong, over/under-engineered, or the new concept is misjudged, **fix the
relevant sections directly** in `{PROJECT}/PLANNING.md`:
- Rewrite §6 (plain-language explanation + ASCII layer diagram + the named new pattern and where it
  fits) so it is correct and level-appropriate.
- Adjust §3 so the architectural concept introduced is the right single one, with a real reason.
- Fix §20 tradeoffs whose reason is hollow.
- If a change to the architecture ripples into entities (§7) or the API (§10) — e.g. removing an
  over-engineered layer changes a folder — note it so the general reviewer reconciles the consistency
  invariants.

Preserve the author's correct work; only change what is wrong or misjudged. Do **not** rewrite the
whole plan — you own architecture, not the other 18 sections.

## Output — report (no commit)

Do not commit. Leave your edits in the working tree for the general reviewer. Report:
- **Architecture verdict:** Sound / Over-engineered / Under-engineered — one sentence.
- **The one new architectural concept** this project introduces, and why it is the right one for
  Victor's current level and the gap list.
- **What you changed** — one bullet per section touched (§6 / §3 / §20 / notes for §7/§10), and why.
- Any ripple the general reviewer must reconcile (a changed folder, a moved responsibility).
