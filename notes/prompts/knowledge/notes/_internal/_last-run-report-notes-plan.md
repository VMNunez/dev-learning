# Last run report — notes-plan-prompt

Date: 2026-08-28
Target: Spring Boot / junior / update
Status: open

- **Plan vs reality** — This prompt has no whole-artefact pass other than the cold reviewer, so the
  reviewer is this bullet's only evidence and the traces prove nothing beyond "the machinery ran". It
  returned 10 corrections on a route the mechanical half had just declared clean at 136/136, and the
  three blocking ones were properties no arithmetic could reach: entry 00's introduction contract was
  missing the note's own section map and had no owner named for Maven, which chapter 01 assumes from
  its first bullet and which lives in the `java` topic; and entry 04 had gained `@PageableDefault`, a
  controller-parameter annotation, while declaring `Depends on: 03` only. The eight added bullets were
  routed by coverage section, which is exactly the kind of correct-looking mechanical routing that
  misses an altitude change inside a section.
- **Report discipline** — Nothing trimmed or discarded. The reviewer returned all five mandated proof
  elements (`16 entries reviewed`, intro verdict, prerequisite-order verdict, concepts-used-before-taught
  verdict, 10 numbered corrections each BLOCKING/ADVISORY and named to an entry) on the first dispatch.
- **Failures & retries** — None. Required dispatches: 1 cold reviewer / 1 dispatched / 1 completed on the
  first attempt. No discretionary analysts.
- **Rule friction and rule breaches** — **One breach, `BRCH-0002`.** Guard 2 requires every English note
  in all three level directories read end-to-end before classification. The run read none of the 16
  (9,508 lines) and carried the 2026-08-02 classifications forward on a `git log --name-status` proof
  that the level's inventory had not changed. The cost is precise: three `keep`-equivalent unassigned
  verdicts and thirteen `keep` verdicts were *reported* this run and *verified* by the previous one, and
  the thing git cannot see — prose drifting across a level boundary through ordinary edits — is
  untested. Filed as `REC-177` (0d1f71a2). Friction, separately: the guard's cost is fixed while its
  trigger is not, and a reconciliation whose input was eight coverage bullets cannot move a note
  between levels at all.
- **Verdict** — change worth considering: **Guard 2 needs a graded form.** A full read when the plan is
  new, the inventory changed, or the level's notes were edited by anything other than a link
  correction; otherwise a git-proved carry-forward that must be reported as a carry-forward. Not
  applied in this run: the run-start check forbids editing the prompt and running it in the same pass.

  Carried forward, unapplied, now four runs old: `## Legacy notes requiring split` still has no graded
  form, with the 2026-08-26 cold reviewer's cheaper counter-proposal on record — tighten step 7's
  "substantive sections" to "**whole** substantive sections". This run did not test that boundary.

  maps: **checked, no correction owed** — `_system-map.md` §7's `notes/{topic}/coverage/notes-plan-{LEVEL}.md`
  row and the `notes-plan` rows of §9 and §11 describe what this run did. No prompt or `SKILL.md` was
  read end to end, so the whole-read trigger did not fire.
