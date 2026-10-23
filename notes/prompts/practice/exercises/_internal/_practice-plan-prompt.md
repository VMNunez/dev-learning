# Short practice exercises — persistent planner

Internal component executed by `practice-session`, never a public slash command. Receives exactly one
`{TOPIC}` and one `{LEVEL}` — never `all` or a list, and never several routes in one run, in sequence or
in parallel (Victor, 2026-10-06, `REC-279`); handed more than one, it plans none and returns that each
route needs its own run. Creates or reconciles that route under `_practice-standard.md` §B.
It writes plans and navigation only; statements, skeletons, answers and grades belong to other routes.

1. Read the standard to EOF, the selected-level topic coverage and notes plan to EOF, the existing
   exercise plan if any, INDEX and ATTEMPTS, and `ROADMAP.md` and
   `notes/prompts/_internal/_shared-context.md` to EOF for the goal the essential route is weighed
   against (§B, "Goal fit"). Read prior-level coverage only to classify a dependency,
   never to add it to the selected-level denominator. Count lines and report EOF reads. Require a
   supported topic **and level** in §H, current source mapping and recomputed coverage digest.
   Missing or stale source: report the exact source and `/notes-plan {topic} {level}`, write no plan
   claiming current, and return. SQL hands off to its existing system.
2. Compare every full coverage bullet with the notes plan's assignments. Stop on missing, duplicated
   or differently worded assignments; the notes-plan owner repairs those. Preserve the source block
   order and prerequisites. Assign every head a stable concept ID, or preserve its existing ID.
   Include all selected-level concepts, explicitly recording environmental exclusions and reasons.
3. Save the existing route as a baseline in scratch, then author a candidate at a separate scratch
   path; never overwrite the published route before review. Author the concrete inventory to §B: first applications, distinct transfer exercises, and short
   integrations. Each row reserves its task, criteria, basename, concepts and prerequisites. Avoid
   exercises whose answer is only a definition; diagnostic/API-reading tasks lead to code or an
   annotated repair. Keep all execution feasible in §H; do not require a framework/build environment
   that does not exist. A pending/unrefined note does not prevent planning or practice.
   Author or preserve the `## Essential route` (§B, "Essential route") — every plan carries one
   (`REC-375`): a ladder of stages from simple to combined, each closed by an integration,
   whose listed rows carry their own prerequisites; add the cross-block integrations its last stages
   need as new inventory rows rather than repurposing published ones. Two duties go past what the
   checker can see (`REC-385`). Read each listed row's `Task` and `Pass condition` for what it asks him
   to write: a route concept it needs is one of its concepts or listed earlier, or is a call its own
   text names, or, used only for the task's setting, is supplied — each named in the section's opening
   prose with the task IDs, or the stage, that use it (§B). Then weigh the minimum against the goal (§B, "Goal fit"), list what that work needs, and write
   in `## Reconciliation` what the minimum covers and what it leaves out on purpose and why. The minimum
   is a set of target stages closed under their prerequisites (`REC-398`): pick the targets the goal
   needs, list every stage a target needs — never cutting one to shorten the minimum, which shrinks by
   tasks and never by concepts — size each stage at about one batch, and name in `## Reconciliation`
   which stages are targets and, for every other stage, the target that needs it.
4. On reconciliation, keep all published IDs and unchanged task rows. A listed essential ID that is
   retired is replaced in place by its replacement. Retire changed/removed tasks,
   append replacements and adjust dependencies of replacement rows without rewriting historical rows.
   A retained active task may refer to a historical block after a remap; its concepts resolve through
   the current concept dictionary. Retain removed concepts as retired. Report every delta. Do not
   migrate or rewrite attempts and never edit previous batches. Set a candidate's fingerprints from
   the actual sources only after its content has been reconciled.
5. Run `python notes/prompts/practice/exercises/_internal/validate-practice-plan.py {TOPIC} {LEVEL} --plan {CANDIDATE}`
   from the repository root, adding `--baseline {PUBLISHED}` on a reconciliation so a deleted,
   renumbered or rewritten published row fails the run. It uses only the Python 3 standard library. If Python is unavailable,
   report that limitation and perform the same scope, fingerprint, ID and dependency checks explicitly;
   never report a script PASS without running it. On a source mismatch stop; on a candidate defect
   repair the candidate before review.
6. Dispatch one **cold reviewer**, `deep`, under `_agent-runtime-standard.md`, with only the proposed
   route, its sources, `ROADMAP.md` and `_shared-context.md`, the standard, the prior route (if any),
   and a writable scratch report path.
   Ask it to read each to EOF and judge scope completeness, exercise variety and feasibility,
   progression, pass conditions, history preservation and all validation results — and whether the
   essential route's stages climb from simple to combined without a gap. Two checks it makes on the
   essential route walk **every listed row**, never a sample, and the report names each row it
   fails (`REC-385`): whether every route concept the row's `Task` and `Pass condition` ask him to write is one of its
   concepts or listed earlier, or a named call or a supplied piece under §B — declared in the
   section's prose, never what the row practises, and, for a supplied piece, never what its pass
   condition asks him to get right; and whether the minimum covers what the goal needs, with
   `## Reconciliation` recording what it leaves out and why — its target stages named, every other
   listed stage needed by one, no stage a target needs left out, and each stage about one batch
   (`REC-398`). It must persist
   findings and `approve`, `approve-with-tightening` or `reject`, with EOF evidence. Never self-approve.
   Apply approved tightenings. A rejection permits one repair/review round; if still rejected, retain
   the existing route and park the candidate at the scratch path. When no published route exists,
   leave it absent. Report the blocker; generate no planned batch from the rejected candidate.
7. After approval, validate again, publish the plan and refresh only its INDEX projection: exercise
   plan path, source fingerprints, block table, the in-route totals as §B defines them (included
   concepts only, naming any excluded inside an in-route block), active task total and the
   essential route's counts. Keep
   existing route tables and the `## Practice state` section, which is not the planner's (§F). Invoke the cold grader in `recount` mode when existing attempts need a new
   projection, or when this run published a route or changed its `## Essential route`, so
   `## Practice state`, which every recount rewrites, sees it; it alone owns PROGRESS cells. Do not grade or alter history in this route.
8. Return the plan path, totals, exclusions, reconciliation delta, validation result, cold-review
   token and any blocked condition. The calling skill commits the system-written plan and INDEX
   under the session contract. A plan-only request ends here; a practice request continues to its
   batch only after the route is accepted and current.

Planning may run as part of a session or explicitly when Victor asks to build/update a practice plan.
Within a recommendation-resolution change, the required cold implementation review may also judge
the initial route against the same sources and checklist; name both scopes in its report instead of
dispatching a second reviewer over identical content.
