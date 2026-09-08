# Coverage-verify self-report

Date: 2026-09-08
Target: HTML / junior / update
Status: applied in 9de99b71
cold reviewer: approve-with-tightening

Ledger reconciliation: `_skill-friction.md` holds no `FRIC` rows, so nothing was adjudicated. This run
produced one prompt-change candidate (the unstated `MODE` default); the cold reviewer approved it with
tightening and it landed in `9de99b71`, so it never became a ledger row.

1. **Plan vs reality** — Guards, mirror-parity comparison, the digest, the required 1/1 cold completeness
   reviewer, orchestrator verification, the findings write, the inbox routing, and the two separate
   commits all ran as planned. Evidence: the reviewer's own acceptance proof plus the orchestrator's
   independent grep of all three topic files, which is what actually settled presence for each of the
   three gaps and both referrals. There is no whole-artifact pass beyond the mandated reviewer, so its
   trace establishes that the machinery ran, not that every content judgment is sound; the orchestrator's
   own adversarial pass added nothing, which is a weaker signal than a second reader would be.
2. **Report discipline** — The reviewer returned the required 111-line EOF proof for `junior.md` plus both
   siblings (27 and 11), named which lenses apply to a topic of this shape and why the two inapplicable
   ones do not, assigned all three gaps to `junior`, and listed its two ownership referrals apart from the
   gaps with the count stated. Nothing had to be trimmed or discarded. One proposed bullet named the
   `dataset` API; it was kept because the mechanism is the attribute's read-back path, not JavaScript
   language semantics, but the boundary call was the orchestrator's, not the reviewer's.
3. **Failures & retries** — No subagent failed and none was re-dispatched. The single mandated dispatch
   ran once and returned a complete acceptance proof.
4. **Rule friction and rule breaches** — No mandatory guard, dispatch, verification, findings write,
   inbox routing, commit, report, or tracker step was skipped, and coverage stayed read-only throughout.
   One genuine ambiguity: the `Configuration` block lists `MODE = [update | dry-run]` and names no
   default, while the launcher's `argument-hint` marks `MODE` optional. The invocation omitted it, so the
   orchestrator had to resolve the mode itself and announce the choice; resolving it the other way would
   have produced no findings file, no inbox routing and no commits, which is a different artifact on
   disk rather than a different cost. That is the candidate drafted below. First occurrence, so no
   breach-log row is owed — this is a prompt gap, not a rule the run broke.
5. **Verdict** — change worth considering: state in `Configuration` that an omitted `MODE` resolves to
   `update`. Applied in `9de99b71` as a tightening of the `MODE` line plus one clause, not the three-line
   paragraph first drafted: the cold reviewer rejected the draft's claim that a dry run "writes nothing"
   (Step 4 has it write and commit its self-report and a `dry-run` tracker outcome) and pointed at
   `simulation-plan-prompt.md` for the `-> default: update` shape the repo already uses. Prompt health:
   276 lines, well under budget, largest section Step 1 at 57 lines; maps unaffected; map: verified — the
   `/coverage-verify` launcher row, its detail row, and the four `_system-map.md` rows (artifact owner,
   inbox writer/never-consumer, `_topic-ownership.md` reader, `gaps` next-command) all match the file as
   read.
