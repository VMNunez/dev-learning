# Review tests prompt — the dedicated test reviewer

**Internal component (projects with tests — 07 onward).** This is the fourth cold reviewer in the
review pipeline: a focused audit of the **tests themselves**, because "there is a test file" is not the
same as "the behaviour is actually tested". `review-audit.md` dispatches it as a subagent; it returns a
**findings table** for the orchestrator to merge into the backlog. It does **not** edit any file and
does **not** commit — Victor fixes the tests himself to learn.

The other three reviewers judge the production code (clean? attackable? correct?). This one judges the
**safety net**: does the test suite actually catch a regression, and does it match the plan's §16 test
plan? A junior candidate is often filtered on exactly this — a suite full of `verify(...)` calls that
assert nothing reads as someone who writes tests to hit a number, not to catch bugs.

---

## Configuration — edit only this block

PROJECT_PATH = [projects/07-timetrack | ... — a project that has tests (07 onward)]

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}.

---

You audit the tests of a built project against its own plan and the test-quality bar. Before starting,
read:
- `notes/prompts/projects/review/_review-standard.md` — the scope limit and the "Test-quality scope —
  the test review" section. This is your bar.
- `{PROJECT_PATH}/PLANNING.md` — the **§16 Testing plan** (what was promised: which services, which
  slice tests, which edge cases) and **§8 business rules** (each should have a test proving enforcement).

**Apply the scope limit** from the standard: only review tests for code belonging to completed steps.

## Step 1 — Read the tests and what they cover

- **Backend:** `backend/src/test/java` — every test class — plus the service/controller/repository
  classes they cover, so you can judge whether the assertions match the real behaviour.
- **Frontend:** every `**/*.spec.ts` — services and (from 08) components — plus the source they cover.

Read the test *and* the code under test together — you cannot judge an assertion without knowing what
the method actually does.

## Step 2 — Audit against the test-quality bar

Run every point in the standard's "Test-quality scope":
- **Coverage vs the plan** — every §16 service has ≥1 unit test; every §8 business rule has a test that
  proves it is enforced; the promised slice tests (`@WebMvcTest` / `@DataJpaTest`) exist.
- **Edge cases** — each class covers the plan's edge cases (not found, business-rule violation,
  role/ownership, empty/boundary input), not only the happy path.
- **Assertion quality** — each test asserts real behaviour (returned value or saved-object state), not
  just `verify(repo).save(any())`; no trivial "it exists" / "not null" tests that pass on broken code.
- **Mockito hygiene** — mocks stub only what is needed; the right thing is mocked (the repository, not
  the class under test); no over-mocking that tests the mock.
- **Structure & readability** — clear arrange/act/assert; test names say what they check
  (`create_throwsWhenProjectInactive`, not `test1`); no logic in tests.
- **Angular** — services use `HttpClientTestingModule` and assert the request + mapped response;
  component tests assert rendered state and emitted events, not just that the component was created.

Judge against what the tests and code actually do. Do not invent findings; if the suite is genuinely
solid, say so.

## Output — findings table only (no edits, no commit)

Return ONLY a findings table, most severe first:

`| Priority (High/Medium/Low) | Test file (or "MISSING") | Finding | Fix | Why it matters |`

Priorities per the standard: a **missing planned test or an untested §8 business rule is High** (from
project 07 on, no tests = not finished); a weak assertion or a missing edge case is Medium; naming /
structure polish is Low. If an area is clean, say "clean" for it in one line under the table. **Do not
edit any file** — Victor fixes every test himself to learn.
