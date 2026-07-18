# Cross-topic inbox — coverage gaps routed between topics

**Internal component. Not runnable.** This file is the durable handoff between coverage runs.

A run on topic X regularly surfaces a genuine gap that belongs to topic Y (a JUnit concept found while
running Java, an Angular template-compiler concept found while running TypeScript). The run correctly
declines to write it into X's file — but before this file existed, the routing was recorded only in the
run's chat summary, which nobody reads later. The item then depended on Y's own future run
independently rediscovering it.

**That is not hypothetical.** The TypeScript run (2026-07-18) routed four Angular-owned concepts out;
Angular's own coverage run had already happened that same day and had *not* found them. Nothing in the
pipeline would have caught it: `coverage-audit`'s Analyst D reads `notes/coverage.md` for duplicates,
misplaced items and post-junior demotions, so a concept **absent from every section** is invisible to it.

## Contract

- **A run WRITES here** whenever Step 4a routes a gap out as "owned by another topic" — one bullet per
  concept, under that topic's heading, in the standard's item format, with the run that found it.
- **A run READS here** at Step 1: the pending entries under its own `## {TOPIC}` heading are treated as
  proposed items, judged against the standard exactly like any other proposed gap (they are not
  pre-approved — the owning run may still discard one as out of scope, and says so in its summary).
- **A run CLEARS what it consumed**: delete the entries it acted on, whether it added or discarded them,
  and say which in the summary. An entry left behind means it was not yet looked at.
- An empty heading (or no heading for a topic) means nothing is pending — that is the normal state.

Entries are proposals, not commitments. This file is never a second source of truth for scope: the job
is still the source, and `{NOTES_PATH}coverage.md` is still the topic's only coverage file.

---

## Angular

- Template type checking (`strictTemplates` / `fullTemplateTypeCheck` in `angularCompilerOptions`) — the compiler type-checks bindings inside the HTML, not just the `.ts`; interviewers ask how a wrong `[input]` type is caught at build time and why this is the flag that breaks migrations *(routed from the TypeScript run, 2026-07-18)*
- Ahead-of-Time (AOT) compilation vs JIT — templates are compiled at build time, which is why a template type error surfaces in `ng build` and not in the editor; interviewers ask why AOT is the default *(routed from the TypeScript run, 2026-07-18)*
- `ng build` type-checks through the CLI's own pipeline, not bare `tsc` — a green editor is not proof the build passes; interviewers ask why `ng build` reports errors the IDE never showed *(routed from the TypeScript run, 2026-07-18)*
- Typed reactive forms `FormGroup<T>` / `FormControl<T>` (Angular 14+) — `.value` is typed instead of `any`, so a renamed control fails at compile time; interviewers ask what problem untyped forms had, and this is directly exercised by the standard take-home (form + validation + service) *(routed from the TypeScript run, 2026-07-18)*
