# Last run — sql-exercises

2026-10-02 · `MODE = practice` · `LEVEL = junior` · `TOPIC = basics` · `COUNT = 10` (typed, equals the plan) · `FILE = practice/sql/junior/02-execution-order-set-ops.sql` (derived from route §1, matches the path table) · `{REVIEW} = no`
Status: clean

1. **Config vs reality** — every derived value was right: Step 0 is the only step claiming `basics`, its §1 row and the path table agree on the file, the typed `COUNT` matched the §2 config, the file did not exist so a canonical SETUP block was written, and all four `**Coverage:**` sections exist verbatim. The route fingerprint is stale (`39aa0cfc…` stored vs `bded1b85…` today) — reported, not blocking, `/sql-plan junior` owed. One plan defect, not this prompt's: `practice/sql/junior/PLANNING-junior.md` §2 Step 0's "Still missing" list (and the `BASICS` seed block) still name **keyset pagination**, which no Step 0 coverage bullet claims (it lives in Step 13's `Pagination-review failures`); the `**Focus:**` line and the coverage-wins rule kept it out of the batch, so the result was unaffected.

2. **Rule friction and rule breaches** — close-out verified against disk: this mode's declared output `practice/sql/junior/02-execution-order-set-ops.sql` was written (untracked, Victor commits it), and branch Step 5's `PROGRESS.md` `Corrected` cells moved (`02-…` row `—` → `0/10`; Junior roll-up `40/40` → `40/50 (80%)`); `MISTAKES.md` and the route writes are review-mode only and correctly untouched. No breach, no deviation. Friction: Step 5 forbids touching any other cell, so the file's `PROGRESS.md` Status still reads "file deleted 2026-08-04, to regenerate" beside a live `0/10` until the first grading rewrites it — cost only (condition 3), no row. The previous run's legacy `open` finding (brevity of confirmation questions) was surfaced at start; the shell now carries the "Brief blocking questions" header note, and this run asked nothing.

3. **Verdict** — prompt limpio (427 lines).
