# Last run report — evidence-intake-prompt

Date: 2026-10-14 · Config: `MODE = search` (resolved — arrived blank, no posting text), `FOCUS = ` (blank —
full target profile) · Branch: `projects/07-timetrack`
Status: rejected

Run-start check: first run of this prompt (no earlier report). `_skill-friction.md`: no `open` rows
(FRIC-0001/0002 already dismissed), nothing reconciled. No prompt-change recommendation for the ledger.

Close-out check (Step 1): the README catalogue row declares `_job-market-evidence.md` — new Raw-posting
blocks and the re-tallied Synthesis. Verified in `e5a05b49` (`git log --name-only`): 8 junior blocks,
6 `## Techo` blocks, Synthesis re-tallied to a `/22` denominator, new "Qué señala este techo" bullets,
footer rewritten. The only edit outside those sections is the file's own "Evidence quality note",
corrected because it still claimed a single full posting — inside the declared output.

1. **Config vs reality** — `MODE` arrived blank with no offers pasted; `search` was the only executable
   mode and the config block gives `MODE` no default. Search sizing was right: Tecnoempleo's
   offer pages were readable through fetch (InfoJobs/Indeed/NTT careers were aggregator-only or
   unreadable), so the batch is Tecnoempleo-only — a source concentration, not a prompt defect.
2. **Rule friction and rule breaches** — no breach. Two deviations, logged as `BRCH-0001` and
   `BRCH-0002` in `_breach-log-evidence-intake.md`: (a) the blank `MODE` was resolved to `search`
   without asking, the configuration block being silent on a blank value; (b) Step 2 is silent on two
   cases the run met — an offer page read whole by a fetch tool in `search` mode (labelled
   `web-search extract` with a note, since `full posting` is defined as a pasted offer), and two
   vacancies with identical text under different role titles at one company (Merkle; SlashMobility),
   folded into one block counted once because the dedup rule only covers same company + role + source.
   Neither cost anything this run; both choices are stated in the file itself.
3. **Verdict** — rejected: both deviations fail **condition 3** — had the prompt spelled out the choice
   the run made, this run's output would be identical. Watch (b): a later run choosing differently
   would count a duplicated vacancy twice and shift the Synthesis; a second row naming that step makes
   it no longer dismissable. Prompt: 178 lines.
