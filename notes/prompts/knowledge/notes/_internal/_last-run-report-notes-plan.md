# Last run report — notes-plan-prompt

Date: 2026-07-26
Target: Java / junior / update
Status: open

- **Plan vs reality** — No planning work ran. Guard 5 stopped the run at step 0: `verify-junior.md` holds `Verdict: superseded` and a stored `Coverage SHA-256` that matches neither `complete` nor the current coverage digest, so the completeness gate has not passed this coverage.
- **Report discipline** — No subagents were dispatched; the run halted before the legacy-classification and cold-review stages.
- **Failures & retries** — None. The stop is a correct guard trip, not a subagent failure. The 15-entry plan on disk from the 2026-07-24 run is untouched.
- **Rule friction and rule breaches** — No rule bypassed. The guard behaved as written: coverage changed after its last verify (floating-point gap consumed in `21e297c`), so the gate is stale and planning is correctly blocked until `coverage-verify` re-runs.
- **Verdict** — pipeline clean; blocked at Guard 5 (stale verify gate), routed to `coverage-verify`.
