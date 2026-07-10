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

## Step 1 — Identify the PLANNING.md format

`PLANNING.md` files use three formats depending on when the project was created. Read the file and
decide which one applies before extracting anything:

- **Format A** — has a **"Key patterns introduced"** table (`| Pattern | Where used |`), no numbered
  Section 3. Angular projects 01–06.
- **Format B** — has a **"Progressive learning plan"** where each step ends with a
  `**Concept learned:**` line, no numbered Section 3. Project 07 and any project without a Section 3.
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
- **Format B:** for each completed step, take the concepts from its `**Concept learned:**` line.
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
| Spring annotation / bean / security / JPA (`@Value`, `@Component`, `@Configuration`, `@Bean`, `@PreAuthorize`…) | Spring Boot |
| Backend testing (JUnit 5, Mockito, `@ExtendWith`, `@Mock`, `@InjectMocks`…) | Spring Boot |
| **Pure** Java language construct (`Optional<T>`, `long` vs `Long`, wrapper classes, `try/catch`, access modifiers, default field values like `private Boolean active = true`) | Java |
| Docker, containerisation, `docker-compose` | General |
| Cloud hosting, build config, env vars, CI/CD (Netlify…) | Deployment |

> **"Pure Java" vs "Spring annotation" — the line that trips people up.** A concept is *pure Java* if
> it exists in Java regardless of Spring. A Spring annotation that merely appears inside a `.java`
> file is **not** pure Java — it goes to Spring Boot. `Optional<T>` is Java; `@Autowired` is Spring.

> **Format C shortcut:** the Section 3 "Topic" column already names the section — trust it over the
> heuristics above when they disagree.

---

## Step 5 — Report back to the orchestrator

Return, and nothing else:

1. **Format detected:** A / B / C.
2. **Confirmed step status:** the short string from Step 2.
3. **Concept list** — one row per concept from completed steps:

   | Concept (key syntax/API in backticks) | Section | From step |
   |---------------------------------------|---------|-----------|
   | `@PreAuthorize("hasRole('X')")` | Spring Boot | Step 4 |

Keep each concept to one line, key syntax in backticks — the same format PROGRESS.md uses. Do not add
explanations longer than a short dash-clause. Do not decide whether a concept is "already present" —
that is the orchestrator's merge step. Return no PLANNING.md excerpts and no reasoning trace — the
three items above are the entire report.
