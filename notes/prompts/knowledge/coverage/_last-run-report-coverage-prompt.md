# Coverage prompt — last run self-report

**Date:** 2026-07-12 · **Target:** TOPIC = Spring Boot, NOTES_PATH = notes/spring-boot/ (update of an existing, mature coverage.md)

1. **Plan vs reality** — Two cold subagents (market analyst on Sonnet, adversarial interviewer on Opus) split cleanly; both returned usable output on first dispatch. Coverage was already mature, so the market analyst found no net-new floor items — the whole file was confirmed market-aligned. The adversary was the only source of new items (3 added, 1 left out). Sizing right.
2. **Report discipline** — Both subagents returned tight, on-format tagged lists; nothing had to be trimmed or discarded. No code dumps or narrative padding.
3. **Failures & retries** — None. Both ran synchronously and completed on first try (market analyst noted thin/expired posting URLs, worked from search extracts + evidence file as designed).
4. **Rule friction** — Minor: placement of the `ddl-auto` item was a judgement call (entity-mapping vs repositories/performance vs Project setup); the prompt correctly leaves section choice to the generator, so no fix needed. Step 4b sync was frictionless since topic-file bullets are copied verbatim (only headings shift, none here).
5. **Verdict** — pipeline clean.
