# Last run report — notes-plan-prompt

Date: 2026-08-28
Target: SQL / junior / update
Status: clean

- **Plan vs reality** — No whole-artefact pass exists here other than the cold reviewer, so it is again
  the only evidence beyond "the machinery ran". It returned 13 corrections against a route the
  mechanical half had just certified at 151/151 exact bullets, zero duplicates, zero paraphrases,
  entry-number-equals-file-number clean. Six were blocking and none of them were reachable by
  arithmetic: entry 00 was missing introduction requirement 6 (the map of the `00`'s own sections);
  entry 01 taught the scale rule through `COALESCE(SUM(x), 0)`, two chapters of vocabulary early;
  entry 01 carried a second mental model (four DDL bullets) whose `DROP` bullet contrasted against
  `DELETE`/`TRUNCATE` seven chapters before entry 08 owns them; entries 08 and 10 declared
  prerequisites that omitted a chapter their own assigned bullets lean on; and entry 04 had no
  `Must answer` for `WHERE cannot use aliases`, the chapter's single most common junior error. The
  reviewer also caught three cross-file relocations the plan created and did not declare
  (`STRING_AGG` 14→07, `DISTINCT ON` 03→05, `::` 04→14) — the plan moves a concept between entries and
  nothing in the format makes it say so, which is how the audit would have produced the duplicate.
- **Report discipline** — Nothing trimmed or discarded. The reviewer returned all five mandated proof
  elements (`17 entries reviewed`, intro verdict, prerequisite-order verdict, concepts-used-before-taught
  verdict, 13 numbered corrections each BLOCKING/ADVISORY and named to an entry) on the first dispatch.
- **Failures & retries** — None. Required dispatches: 1 cold reviewer / 1 dispatched / 1 completed on
  the first attempt. No discretionary analysts.
- **Rule friction and rule breaches** — **No breach.** Guard 2 was met in full: 14 English notes,
  2,024 lines, all read end-to-end before classification; `es/` holds only `.gitkeep`, so every note is
  English-only and no relocation was possible in either direction. `_skill-friction.md` had no `open`
  rows to adjudicate. Friction, one item, and it is about the format rather than the guards: the plan
  can reassign a concept from the entry whose file currently teaches it, and `Required plan format`
  has no field for that — the relocation is invisible unless the run volunteers it inside
  `Narrative role`, which is where this run put all three. Breach-log ruling for this run: `BRCH-0001`
  (`shared`, `open`) — its step was reached and not breached, but an `open` row has no `confirmed N/3`
  ladder, so it is unchanged; `BRCH-0002` (`this prompt`, `open`, Guard 2) — reached and **not**
  breached this run, likewise unchanged for want of a `fixed in <hash>`.
- **Verdict** — pipeline clean. No prompt edit drafted, so no cold reviewer was dispatched for one.
  The relocation-field friction is recorded and stops at bar condition 3: the plan states all three
  relocations today, so the output file is not different or wrong without a new field — it is only
  less discoverable.

  Evidence filed against a carried-forward row rather than a new one: `REC-177` asks for a graded
  Guard 2 because the read is "unaffordable on a reconciliation". This run is a reconciliation on which
  the full read cost 2,024 lines and confirmed 14 `keep` verdicts against actual prose. The premise is a
  property of one level's size, not of reconciliation, and the counter-evidence is recorded in that row
  (`cc59bc05`), committed separately from this report as the contract requires.

  Carried forward, unapplied, now five runs old: `## Legacy notes requiring split` still has no graded
  form, with the 2026-08-26 cold reviewer's cheaper counter-proposal on record — tighten step 7's
  "substantive sections" to "**whole** substantive sections". This run did not test that boundary
  either; nothing here was mixed-level.

  maps: **checked, no correction owed** — `_system-map.md` §7's
  `notes/{topic}/coverage/notes-plan-{LEVEL}.md` row and the `notes-plan` rows of §9 and §11 describe
  what this run did. No prompt or `SKILL.md` was read end to end, so the whole-read trigger did not fire.
