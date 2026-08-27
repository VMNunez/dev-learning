# Last run report — notes-plan-prompt

Date: 2026-08-27
Target: Architecture / junior / update
Status: open

- **Plan vs reality** — The trigger was a `stale` header and six added coverage bullets, but the run that
  matched the trigger would have been wrong: the reconciliation the orchestrator drafted (10 unassigned
  bullets filed into entries 02, 05 and 14, two middle-level bullets removed from 13 and 16) was
  arithmetically clean — 72/72, no duplicates — and pedagogically broken, and **nothing in the mechanical
  half of this prompt can see that**. The cold reviewer returned 16 corrections, 10 blocking, and the
  three that decided the run were properties of the route: entry 02 had become a REST style chapter plus
  a contract-drift defect taxonomy whose five bullets need persistence, DTOs and status codes it would
  not meet for another four chapters; entry 05 had become 11 bullets across two altitudes (the shape of a
  payload, and the promise of one field); and entry 08's only assigned bullet used *coupling*, taught in
  09. Splitting 02 and 05, moving the drift taxonomy behind data access as the new 09, swapping 08/09 and
  relocating the frontend chapter next to MVC took an 18-entry route to 20 and renumbered two existing
  English notes. There is no whole-artefact pass in this prompt other than the reviewer, so it is the
  only evidence this bullet has — and this run is the strongest case on file that one cold reviewer is
  worth more than any number of per-file analysts.
- **Report discipline** — Nothing discarded. The reviewer returned all five mandated proof elements
  (`18 entries reviewed`, intro verdict, prerequisite-order verdict, concepts-used-before-taught list,
  numbered corrections) with each correction marked BLOCKING or ADVISORY and named to an entry.
- **Failures & retries** — None. Required dispatches: 1 cold reviewer / 1 dispatched / 1 completed on the
  first attempt. No discretionary analysts: five existing English notes were read whole by the
  orchestrator, none exceeded 182 lines, and all five classified `keep`.
- **Rule friction and rule breaches** — No breach; no row added to a breach log (none exists for this
  prompt). One correction was **rejected on the format rule**: the reviewer asked every entry to declare
  cross-topic prerequisites (HTTP → General, JPA/transactions → Spring Boot, components → Angular), but
  "Required plan format" states `Prerequisites` contains `none` or earlier entry numbers only, and
  `Depends on` is the mechanical gate. The substance was accepted in the only field that can carry it —
  must-answer questions defining the JPA entity (06), atomicity (08) and the persistence port (03), plus
  entry 00's question naming which topics own framework mechanics. Worth noting for the reviewer's
  dispatch: it quotes the plan and the standard but not the format rules, and this is the second run in
  a row where a correct-sounding finding failed on a rule the reviewer could not see.
- **Verdict** — change worth considering: **the cold reviewer's dispatch is under-specified in exactly
  the places it produces false positives.** The prompt says to give it "only the selected coverage,
  `_note-quality-standard.md`, existing note headings, and the proposed plan". Two consecutive runs have
  now spent a round trip rejecting a confident finding the reviewer had no way to check — 2026-08-26 the
  `Coverage SHA-256` rule, today the `Prerequisites` field rule — both of them in "Required plan format"
  or "Coverage fingerprint", both cheap to include. The draft is a clause adding this prompt's own
  "Required plan format" section and the fingerprint rule to the reviewer's inputs. Prompt is 466 lines,
  inside the ~500-line budget. Not applied in this run: the run-start check forbids editing the prompt
  and running it in the same pass.

  Also carried forward, still unapplied and now three runs old: `## Legacy notes requiring split` has no
  graded form, with the 2026-08-26 cold reviewer's cheaper counter-proposal on record — tighten step 7's
  "substantive sections" to "**whole** substantive sections" rather than add a sixth vocabulary value.
  Today's run hit the same boundary a sixth time and resolved it the same way (`03-layered-architecture.md`
  carries DTO and state-machine sections owned by entries 06 and 16; both routed into that entry's
  must-answer list as relocation instructions, not a split).

  maps: **checked, no correction owed** — `_system-map.md` §7's `notes/{topic}/{level}/en|es/*.md` row and
  `README.md`'s catalogue `Generates` cell were corrected in 0a92412f to state that this prompt renames
  note pairs and repairs their inbound links, which is exactly what this run did (2 renames, 0 inbound
  links found repository-wide). No row read as false. No whole-file read of a prompt or `SKILL.md`
  occurred in this run, so the absence half of the map test did not fire.
