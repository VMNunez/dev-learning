# Last run report — notes-plan-prompt

Date: 2026-10-09
Target: Spring Boot / junior / update
Status: open

- **Plan vs reality** — A reconciliation that turned into a route repair. Coverage moved by four
  bullets (140 vs 136), but the 2026-08-28 plan also carried a numbering gap at 11 and 14 and two
  handoffs saying so, which `Required plan format` forbids; the run renumbered three pairs, moved one
  unassigned pair up to 16 and relocated a middle-owned pair it had left parked. Evidence is the cold
  reviewer's whole-plan read, which outranks the orchestrator's mechanical check (140/140 verbatim and
  assigned once, ordered, backward-only dependencies, entry number = file prefix, `audit` ⇔ file —
  green before and after): ACCEPT-WITH-CORRECTIONS, 20 corrections, 7 blocking. All seven predate
  this run and passed the 2026-08-28 deep review: two bullets taught before their prerequisites
  (`CommandLineRunner` in 01, Open EntityManager in View after the chapter that needs it), three
  undeclared previews, and an introduction missing four baselines. The corrected plan was not reviewed
  again; the prompt asks for one review.
- **Report discipline** — One reviewer, one round, complete acceptance proof (5 inputs read to EOF, 16
  entries, intro, prerequisite-order and used-before-taught verdicts), persisted to its scratch path.
  Nothing trimmed. Its heading-level claims (13's seed sections, 02's `UserRepository`, 10's Docker
  sections) were checked on disk before applying.
- **Failures & retries** — Required dispatches: 1. Actual: 1. Re-dispatches: 0.
- **Rule friction and rule breaches** — One deviation, `BRCH-0010`: the `Audit note` licence ("another
  entry") does not cover sections leaving for another topic or cut to one placement; four such notes
  were written at the reviewer's request. Routed to the open `REC-312`, whose source now cites it.
  `BRCH-0005` reached and clean: 40 link targets rewritten, no label touched (word-diff checked); it is
  `open`, not `fixed`, so nothing advances. Not reached: `BRCH-0007`/`0009` (no wrapped evidence clause
  in this coverage). Friction, not routed: `MODE` has no default (took `update`); bare-filename prose
  mentions of the renamed notes (00's diagram, two `**Forward reference:**` callouts) are not links,
  so the run left them for `notes-audit`.
- **Verdict** — change worth considering, already routed and not applied here: `REC-312` (the `Audit
  note` field's job is narrower than the instructions plans need to carry). No edit drafted, so no cold
  reviewer ran on the prompt. The prompt is 501 lines, at the smoke alarm; its largest section is
  `Required plan format` (125 lines, 275–399).
  maps unaffected.
  map: verified — `README.md` interface-index row and catalogue row for `/notes-plan`, `_system-map.md`
  §7 `notes-plan-{LEVEL}.md` row.
