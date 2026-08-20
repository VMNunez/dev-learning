# Ritual friction

**Friction without failure.** Durable evidence that a ritual — a skill, a prompt, a step of the daily
loop — **cost more than it gave**, in a run where nothing broke. The ritual completed. Victor still lost
the block, or wrote into a file nothing reads, or did by hand the thing the ritual was supposed to save
him.

The source contract is `_recommendation-ledger.md` → `REC-054` (a); this file is only its event sink and
must not restate or widen it.

## Why this is not `_skill-friction.md`

That file records an **observable failed declared step** (`FRIC-NNNN`), and its rows are adjudicated by
the next runnable prompt's close-out against the four-condition bar — which may turn one into a
`REC-NNN`. This file records the opposite kind of evidence: a run that *succeeded* and was not worth its
cost. Merging them would put two kinds of row under one consumer that counts rows, which is the exact
drift `_recommendation-ledger.md`'s preamble names in `REC-074` — and it would feed ritual friction
straight back into the queue that `REC-054` (b) exists to keep it out of.

A run can produce both, and they go to different files: the step that failed is a `FRIC`, the hour it
cost is a `RITF`.

## What writing a row must never do

These are the rule, not a style note. `REC-054` (b) exists because the ledger refilled itself at the
speed it drained, and every refill came through one of these four doors:

- **It never opens a `REC-NNN`.** Not after one row, not after ten. The only thing a row feeds is
  `REC-054` (c).
- **It never dispatches a cold reviewer.** A cold reviewer is paid to find things; that is how
  `REC-081`, `REC-086` and `REC-087` were born out of reviews of other rows.
- **It never blocks and never asks a question.** Victor says it in passing, the line gets written, the
  session continues. A capture point that interrupts is a capture point that stops being used — the
  zero-questions rule the skills are built on, applied here.
- **It is never argued with.** The row records what he observed, not whether the ritual is justified.
  Justification is (c)'s job, and it happens later, over several rows, not in the moment.

## What a row must contain

`ID` uses the next zero-padded `RITF-NNNN`. `ID`, `Date`, `Ritual`, `Block` and `Cost` never change after
insertion; only `Status` does.

**`Cost` must be falsifiable.** Name what it actually took or wasted — the minutes, the number of files
touched, the output nobody read, the step done by hand anyway — never "it is heavy" or "it is annoying".
A row that only records a feeling cannot be ruled on and will be kept forever for that reason. Escape a
literal table pipe as `\|`.

`Block` is one of `08:00`, `12:30`, `13:30`, or `machinery` for a ritual that runs outside the daily
loop.

`Status` is `open` until `REC-054` (c) rules on that ritual, then `ruled YYYY-MM-DD — kept` /
`— thinned: {what was cut}` / `— deleted: {commit}`, written to every row naming that ritual at once.

## Who consumes it

`REC-054` (c) only, and nothing else may read it as a work queue. **Three `open` rows naming the same
ritual make that ritual due for a ruling**; Victor may call one earlier with a single row, and a ruling
is per **ritual**, never per row. The ruling is the one act in this system licensed to *remove*
machinery.

| ID | Date | Ritual | Block | Cost | Status |
|---|---|---|---|---|---|
| RITF-0001 | 2026-08-20 | `/system-check` | machinery | The run produced 16 accepted manifests covering 171 files and 5,877 atomic facts (about 1.1 MB of scratch evidence), then had reached only the first 3 of 20 claim-reconciliation concerns; 16 reverse concerns and the cold final review still remained, so Victor stopped it rather than spend roughly a weekly token budget on one audit. | open |
