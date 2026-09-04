# Last run report — notes-plan-prompt

Date: 2026-09-04
Target: Security / junior / update
Status: clean

- **Plan vs reality** — The reviewer returned `BLOCKED` with 19 findings on a plan whose mechanical half
  was clean (107/107 exact, zero duplicates, zero paraphrases, entry-number-equals-file-number across
  13 entries), and 13 of the 19 were the same defect: an assigned coverage concept with no `Must answer`
  question forcing the note to teach it. That defect is invisible to every check this prompt performs —
  exact assignment proves a bullet is *owned*, never that the entry's contract *commissions* it — and it
  was present in 9 of 13 entries, including the topic's own title concept in entry 02 and `CORS is not
  authorisation` in entry 04. This is the second consecutive run in which the reviewer's findings landed
  overwhelmingly outside the bullet delta (12 new bullets triggered the run; the findings were about the
  other 95). The generalisable fact is now confirmed rather than suspected: **`Planning algorithm` step 12
  requires the pedagogical contract to exist, and nothing anywhere requires it to *cover the assigned
  concept set*.** A cheap mechanical gate would catch most of it — for each entry, does any `Must answer`
  question name the subject of each assigned bullet — and it would run before the reviewer instead of
  spending the deep tier on bookkeeping. That is a candidate prompt edit, parked for a second occurrence
  under bar condition 1; two runs is the threshold, and this is run two, so the next `notes-plan` run that
  reproduces it should file the `REC` rather than re-observe it.
- **Report discipline** — One cold reviewer, one round, foreground, `deep`. Complete acceptance proof on
  the first dispatch, including the four labelled verdict lines and a split ruling with both resulting
  learning outcomes written out. Nothing trimmed.
- **Failures & retries** — None. Required dispatches: 1; actual: 1; re-dispatches: 0.
- **Rule friction and rule breaches** — No breach. Guard 2 was met at zero cost and is **not** evidence of
  the kind `BRCH-0002`/`BRCH-0003` are waiting on: the unowned population was empty (all five existing
  pairs are commissioned by prior plan entries, `## Unassigned existing notes` was `*(none)*`), so no file
  was owed an end-to-end read and none was read. Their dispositions are unchanged at `confirmed 1/3`.
  One friction point worth recording because it contradicts last run's: the entry-03 split forced a
  three-pair renumber, and the prompt's instruction to correct **every** inbound link repository-wide hit
  a case the rule does not address — the two inbound links carried the note's number in their *display
  text* as well as their target (`[security/05-security-vulnerabilities.md](…)`). Correcting only the
  target, which is what `Planning algorithm` step 6 literally authorises ("Only the link target changes in
  those files"), would have published a link whose visible text names a file that no longer exists. Both
  were corrected. Low cost here (2 links), but the rule as written permits the wrong answer.
  One rejection: reviewer finding 10 proposed a new `Audit note:` field on entries 01, 02, 06 and 07 to
  record where a legacy file's orphaned sections migrate. Rejected as written — `Required plan format`
  enumerates the fields and this is not one of them, so the validator would not know it. The substance was
  real and was applied instead as explicit migration clauses in those entries' `Rationale`, the same
  disposition last run used for its rejected finding.
- **Verdict** — pipeline clean. The `Must answer` coverage gate is a live candidate at 2/2 occurrences but
  was not drafted this run, so no cold reviewer was dispatched for a prompt edit.
