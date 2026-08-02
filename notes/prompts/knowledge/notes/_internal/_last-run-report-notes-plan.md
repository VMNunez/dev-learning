# Last run report — notes-plan-prompt

Date: 2026-08-02
Target: Angular Material / junior / update
Status: applied in 7a90dfc

- **Plan vs reality** — The pre-existing plan was fingerprint-current, so the reconciliation's real value came from the two passes that read the finished artefact rather than the slices: a local format-conformance sweep caught four defects the previous run committed (a non-checkbox line under `Coverage concepts`, and `Depends on` / `Prerequisites` carrying prose and disagreeing with each other on entries 12 and 15), and the mandated cold reviewer then found substantive route defects on top — two undeclared external prerequisites, a concept used two chapters before its owning entry, and a label-grouped chapter. A plan committed hours earlier as clean failed both passes, which is the measure worth recording.
- **Report discipline** — The cold reviewer returned all mandated proof elements and 22 numbered corrections. Four had to be discarded as prompt violations rather than trimmed for style: three proposed writing migration contracts into `Pending additions` on `pending` entries, and one proposed splitting `Action` per language — both explicitly forbidden by the format rules. A reviewer given the standard still proposed edits the standard prohibits.
- **Failures & retries** — Two cold subagents required (one route reviewer, one refinement gate), two dispatched, two completed. No retry, no unusable return.
- **Rule friction and rule breaches** — Required dispatches: 2 / 2. One accepted finding could not be applied: rule 6 was silent on a renumber target occupied by an unassigned file pending retirement, so a justified chapter split was deferred rather than executed. That is the finding behind REC-019, now applied. No mandatory gate or declared output was skipped.
- **Verdict** — change worth considering, applied: rule 6 now states that unassigned notes do not reserve their numeric prefixes. Cold reviewer: approve-with-tightening. Prompt is 357 lines, inside the health budget.
