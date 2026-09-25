# Skill friction

Durable evidence for an **observable failed step** in one of the nineteen in-session skills. The source
contract is `_session-rules.md` → "When a skill cannot finish — durable friction"; this file is only its
event sink and must not restate or widen that trigger.

Rows are append-only evidence. `ID` uses the next zero-padded `FRIC-NNNN` value. `ID`, `Date`, `Skill`,
`Target`, `Failed step`, and `Evidence` never change after insertion. Only `Disposition` changes:

- `open` — not yet adjudicated.
- `REC-NNN` — reconciled into that recommendation-ledger item.
- `dismissed — condition N: reason` — failed the runnable close-out's four-condition bar.

The next runnable prompt close-out serially adjudicates every `open` row before its own recommendation
reconciliation. Escape a literal table pipe as `\|` and keep evidence falsifiable: name the missing,
contradictory, failed, or partially written artefact rather than describing frustration.

| ID | Date | Skill | Target | Failed step | Evidence | Disposition |
|---|---|---|---|---|---|---|
| FRIC-0001 | 2026-09-22 | `step-complete` | `projects/07-timetrack` Step 7d pieces — Team page and user dialog (`612497a9`, `a536a9c5`): discriminated union `UserDialogResult`, disabled control read with `getRawValue()`, locale `Intl.Collator` sort | `3 — verification: no record existed to verify` | The whole-step diff `ec50e268..HEAD -- projects/07-timetrack` demonstrates `typescript/junior` "Discriminated unions" and `angular/junior` "Disabled controls and `getRawValue()`" with no `✅ 07-timetrack` on either, and a locale-aware comparison with no bullet in `javascript/junior`; none of the three was recorded as its piece landed because the session deferred every closing ritual to its end on Victor's instruction, so the per-piece triggers of `coverage-bullet-add` / `coverage-mark` never fired. Authored and marked by the close in `bf726173` | dismissed — condition 3: the close authored and marked all three records in the same run (`bf726173`), so the unfired per-piece triggers changed the run cost and not the output; the deferral was Victor’s explicit session instruction, and `step-complete`’s verification step already contracts to author what it cannot verify |
| FRIC-0002 | 2026-09-24 | `step-complete` | `projects/07-timetrack` Step 11 compose piece — `docker-compose.yml` + `docker/db/init/01-create-app-role.sh` (`11483dff`, `505d2992`): Compose readiness gate, health check, service discovery, named volume vs bind mount, container environment variables, example environment file | `3 — verification: no record existed to verify` | The whole-step diff `4b484606..HEAD -- projects/07-timetrack` (branch point; the last `✅` close `fd13f668` predates it) demonstrates `general/junior` "Compose dependency and readiness", "Health-check awareness", "Container service discovery", "Bind mount vs named volume" and "Container environment variables" with no `✅ 07-timetrack` on any of them; the piece was verified by `docker compose up --build` and the done-condition Postman check in the same turns, and neither `coverage-bullet-add` nor `coverage-mark` was invoked before the close — the Dockerfile piece (`600870d9`) was | dismissed — condition 3: the close marked all five Compose bullets `✅ 07-timetrack` in both coverage files in the same run (`7bab7ab6`), so the output did not differ |
