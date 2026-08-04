# Concept extraction standard — *internal, not runnable*

The shared contract every **project-audit subagent** follows when `progress-update-prompt.md`
(the orchestrator) fans out. One subagent runs this for **one** project and reports back. You never
launch this file directly.

**Your job:** read ONE project's `PLANNING.md`, work out which learning steps are complete, and
return the concepts those completed steps teach — each tagged with the PROGRESS.md section it belongs
to — plus the project's confirmed step status.

**What you must NOT do:**
- Do **not** read anything beyond this standard and the project's `PLANNING.md` — not the project's
  code, README, or any other file. Everything you need is in the PLANNING.md and the `PROGRESS_HINT`.
- Do **not** read or write `PROGRESS.md`. You cannot see it. Deduplication against what is already
  recorded is the orchestrator's job, not yours — so extract the full concept list for completed
  steps even if some concepts might already exist. The orchestrator drops the duplicates.
- Do **not** commit anything. Report; the orchestrator merges and commits.

**What the orchestrator gives you** (in your launch instruction):
- `PROJECT_PATH` — the project to audit (e.g. `projects/07-timetrack`).
- `PROGRESS_HINT` — a few lines lifted from PROGRESS.md for this project only: its `### Project NN`
  summary heading and any `### Project NN` sub-heading inside a technology section. Used **only** for
  the Format B step-status fallback below. Treat it as a hint, never as the concept source.

---

## Step 0 — Read the whole file, verifiably

The Read tool loads **2000 lines by default and truncates longer files silently** — no error, no
warning. A truncated PLANNING.md makes you report an incomplete step status and miss the last steps'
concepts with full confidence. So, before anything else: check the file's line count (`wc -l`). If it
is near or over 2000, read it in passes with `offset` until you reach the real end. Either way,
**state in your report the total line count and that you read to EOF** — that line is the
orchestrator's proof your extraction saw the whole plan.

## Step 1 — Identify the PLANNING.md format

`PLANNING.md` files use three formats depending on when the project was created. Read the file and
decide which one applies before extracting anything:

- **Format A** — has a **"Key patterns introduced"** table (`| Pattern | Where used |`), no numbered
  Section 3. Angular projects 01–06.
- **Format B** — has a **"Progressive learning plan"** where each step carries a `**New concepts:**`
  line, no numbered Section 3. Project 07 and any project without a Section 3.
- **Format C** — has a numbered **Section 3 ("New concepts")** table
  (`| Concept | Topic | Why this project teaches it |`) plus a **Section 15** learning plan whose
  steps list which Section 3 concepts they introduce. Projects 08+.

---

## Step 2 — Determine which steps are complete

**Format A** — every project handed to you in Format A is already Done ✓. All patterns count.

**Format C** — read Section 15. Steps marked ✅ are complete. If the project is Done ✓ (all steps ✅),
every Section 3 row counts.

**Format B** — decide the completed steps like this:
1. Look for step headings marked ✅ (e.g. `### Step 3 — Spring Security + JWT ✅`).
   - **At least one ✅ present:** those ✅ steps are the primary truth; steps without ✅ are not
     complete. But if `PROGRESS_HINT` shows MORE steps done than the ✅ markers (e.g. ✅ on Steps 1–2
     but the hint says Steps 1–3 done), prefer the higher count — an in-session update may have
     advanced PROGRESS.md without adding the ✅.
   - **No ✅ anywhere:** fall back to `PROGRESS_HINT`. Read the highest step count it shows across
     (a) the `### Project NN` summary heading and (b) any `### Project NN` technology sub-heading.
     Prefer the highest step count found.
2. The step marked "in progress" is **not** complete — do not extract its concepts. No exceptions
   for you: early-learned concepts already in PROGRESS.md are the orchestrator's job, not yours.

Record the confirmed step status as a short string — e.g. `Steps 1–3 done, Step 4 in progress` or
`all steps complete` — and return it, **stating how you derived it**: `(from ✅ markers)`,
`(from PROGRESS_HINT — no ✅ markers in PLANNING.md)`, or `(hint overrode ✅ markers)`. The
orchestrator uses the status to fix the projects table and headings, and the derivation note to flag
low-confidence statuses in its report.

---

## Step 3 — Extract the concepts from completed steps

- **Format A:** every row of "Key patterns introduced" is one concept. Also scan "Key features" and
  "State management" — they sometimes name patterns (e.g. `localStorage + effect()`,
  `computed()` for derived values) not listed in the patterns table.
- **Format B:** for each completed step, take the concepts from its **`**New concepts:**` line — that
  is the field every step carries, and it is the primary source.** Two neighbouring fields exist and
  are not interchangeable with it:
  - `**Concept learned:**` — a *retrospective addendum*, written after the step was built, on the
    minority of steps where what the code taught diverged from what was planned (project 07 has it on
    2 steps of 11). When a step has one, extract it **in addition to** `New concepts:` — it is the
    richer source, and it names things the plan did not anticipate. Never treat its absence as the
    step having no concepts.
  - `**Review concepts:**` — concepts *re-applied* from an earlier step, not introduced here. Never
    extract these: the concept already entered the record when the step that introduced it closed.
- **Format C:** for each completed step in Section 15, take its "New concepts introduced" list, which
  references Section 3 rows.

---

## Step 4 — Tag each concept with its PROGRESS.md section

Route every extracted concept to exactly one section using this mapping:

| Concept looks like… | Section |
|---------------------|---------|
| Angular API (`@Component`, `signal()`, `HttpClient`, `MatTable`, guards, pipes, RxJS…) | Angular |
| Frontend testing (Jasmine, TestBed, `HttpClientTestingModule`, spies…) | Angular |
| CSS property, layout technique, animation | CSS |
| TypeScript utility type (`Omit`, `??`, `?.`…) | TypeScript |
| Core Spring container / bean / proxy / transaction mechanism (`ApplicationContext`, `@Component`, `@Bean`, scopes, `@Transactional`…) | Spring |
| Spring Boot runtime or concrete integration (`@Value`, `@ConfigurationProperties`, auto-configuration, starters, Actuator, Spring Data JPA, `@PreAuthorize`…) | Spring Boot |
| Backend testing (JUnit 5, Mockito, `@ExtendWith`, `@Mock`, `@InjectMocks`…) | Spring Boot |
| **Pure** Java language construct (`Optional<T>`, `long` vs `Long`, wrapper classes, `try/catch`, access modifiers, default field values like `private Boolean active = true`) | Java |
| Docker, containerisation, `docker-compose` | General |
| Cloud hosting, build config, env vars, CI/CD (Netlify…) | Deployment |

> **"Pure Java" vs "Spring" vs "Spring Boot" — the line that trips people up.** A concept is *pure Java* if
> it exists in Java regardless of Spring. A Spring annotation that merely appears inside a `.java`
> file is **not** pure Java. Core container/proxy/bean behaviour goes to Spring; Boot startup,
> auto-configuration, externalized configuration and concrete Boot-stack integration go to Spring Boot.
> `Optional<T>` is Java; `@Transactional` proxy semantics are Spring; conditional auto-configuration is Spring Boot.

> **Format C shortcut:** the Section 3 "Topic" column already names the section — trust it over the
> heuristics above when they disagree, **but only if the value is a valid section name** (Angular ·
> CSS · TypeScript · Java · Spring · Spring Boot · Architecture · Security · Deployment · General · SQL —
> the controlled vocabulary `_planning-standard.md` §3 requires). If a Topic value is anything else
> ("Backend", "Java/Spring", blank), fall back to the heuristics for that row and flag the invalid
> value in your report so the orchestrator can surface it.

---

## Step 5 — Report back to the orchestrator

Return, and nothing else:

1. **Read verification:** the PLANNING.md's total line count and confirmation you read to EOF (Step 0).
2. **Format detected:** A / B / C.
3. **Confirmed step status:** the short string from Step 2.
4. **Concept list** — one row per concept from completed steps:

   | Concept (key syntax/API in backticks) | Section | From step |
   |---------------------------------------|---------|-----------|
   | `@PreAuthorize("hasRole('X')")` | Spring Boot | Step 4 |

Keep each concept to one line, key syntax in backticks — the same format PROGRESS.md uses. Do not add
explanations longer than a short dash-clause. Do not decide whether a concept is "already present" —
that is the orchestrator's merge step. Return no PLANNING.md excerpts and no reasoning trace — the
four items above are the entire report.
