# Coverage prompt — last run self-report

**Date:** 2026-07-11 · **Target:** TOPIC = Java, NOTES_PATH = notes/java/ (update of an existing, mature coverage.md)

1. **Plan vs reality** — Two cold subagents (market analyst + adversarial interviewer) split cleanly; both returned usable output. Coverage was already mature from the prior run, so the market analyst found no net-new floor items — its whole list was already covered. The adversary was the only source of new items. Sizing was right.
2. **Report discipline** — Both subagents returned tight, on-format lists; nothing had to be trimmed or discarded. No code dumps.
3. **Failures & retries** — None. Both completed on first dispatch (market analyst noted Tecnoempleo URLs 410 fast, but worked from search extracts as designed).
4. **Rule friction** — One genuine ambiguity: the adversary proposed a whole Testing (JUnit/Mockito) section, but the config block assigns testing to Spring Boot coverage, not Java. The prompt does not state where Java-side testing gaps should land — resolved by leaving it out of Java. Worth a one-line clarification that Java coverage never carries testing items.
5. **Verdict** — pipeline clean; minor change worth considering: state explicitly that Java coverage excludes testing (it lives in Spring Boot coverage) so the adversary's testing gaps are routed, not re-litigated each run.
