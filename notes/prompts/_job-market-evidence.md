# Job market evidence — real postings that anchor coverage

**Purpose.** Coverage decisions should be anchored to what the target companies *actually ask for in
2026*, not only to what a model believes they ask. This file holds that ground truth: real junior job
postings from the target consultancies, plus a distilled synthesis of the requirements that recur
across them. `coverage-prompt.md` and `coverage-audit-prompt.md` read it as a **source** — an item
that shows up repeatedly here is a strong signal it belongs in coverage.

**How the coverage prompts use it:**
- If this file has evidence, treat the recurring requirements in the Synthesis as a required floor —
  every recurring skill must map to coverage items, and a gap here is a gap in coverage.
- If this file is empty or stale, coverage falls back to the model's knowledge of the Spanish market
  (the current behaviour) and may complement it with a live web search for postings. Real evidence
  here always outranks the model's guess.

**How to keep it useful (Victor):**
- Paste 3–8 real junior/junior-mid postings for **Angular + Java/Spring Boot** roles at NTT Data,
  Capgemini, Indra, Accenture, and similar. Copy the "Requisitos"/"Requirements" block verbatim.
- Add the date and source so freshness is visible — postings older than ~6 months are weak evidence.
- After pasting, update the Synthesis so the prompts read the distilled signal, not just raw text.
- This file is study infrastructure — commit it like the other prompt files.

> Keep it honest: paste what the postings really say, not what you wish they said. A requirement that
> is not in the market should not enter coverage just because it feels important.

---

## Raw postings

> Paste real postings below, newest first. One block per posting. Template:

```
### <Company> — <role title>   ·   <YYYY-MM>   ·   <source URL or platform>
Stack / requisitos (verbatim):
- ...
- ...
Nice to have:
- ...
```

_(empty — paste your first postings here)_

---

## Synthesis — recurring requirements by stack

> Distil the raw postings above into the skills that recur across several of them. This is what the
> coverage prompts read as the "market floor". Update it whenever you add postings. Mark how often each
> appears (e.g. "5/6 postings") so weak vs strong signals are visible.

**Backend — Java / Spring Boot**
- _(e.g. "Spring Boot REST APIs — 6/6 postings"; "JPA/Hibernate — 6/6"; "JWT / Spring Security — 4/6";
  "testing JUnit/Mockito — 5/6"; "Docker — 4/6"; "SQL — 6/6")_

**Frontend — Angular**
- _(e.g. "Angular 15+ — 6/6"; "RxJS — 5/6"; "TypeScript — 6/6"; "unit testing Jasmine/Karma — 3/6")_

**Cross-cutting**
- _(e.g. "Git — 6/6"; "metodologías ágiles/Scrum — 5/6"; "CI/CD basics — 3/6")_

**Signals to watch (appearing but not yet dominant)**
- _(things starting to show up that may soon be baseline — note them so coverage can pre-empt them)_

---

_Last updated: —  ·  postings on file: 0_
