# Last run — sql-exercises

2026-07-22 · `MODE = practice` · `TOPIC = basics` · `FILE = practice/sql/01-basics.sql`
Status: open

1. **Resolution vs reality** — `{COUNT} = 10` and `{FOCUS}` were derived from PLANNING.md §6 Step 0 and matched exactly what the step still needed (the five concept groups listed as "still missing"). `{FILE}` was set explicitly and agrees with the Step 4 path table. All four coverage sections for `basics` exist verbatim. The legacy-format check and the schema-mismatch check both fired correctly on `01-basics.sql`; Victor chose **(B)**, so a `SETUP v2` banner with the canonical schema was appended before the new exercises. Nothing stale found in the plan.

2. **Rule friction and rule breaches** — one breach, one friction:
   - **Breach: the two confirmation gates were merged into a single question.** Step 1 asks for the legacy-format confirmation, *then* the schema A/B question, each waiting for an answer. Both were presented in one turn. Cost: none here (Victor answered both, and the second question is the only one whose answer changes output), but the prompt's sequencing was not followed as written.
   - **Friction: the first two answers were too long and Victor said so** ("debes ser muchisisimo mas breve"). The prompt has no length rule for the questions it asks, so a full diff table + two paragraphs of trade-offs read as noise. The schema question in particular only needs the two options and a recommendation.

3. **Verdict** — cambio a considerar: añadir a Step 1 una cláusula de brevedad para las preguntas de confirmación (formato y esquema) — dos opciones y una recomendación, sin tabla de diff completa; el diff detallado solo si Victor lo pide. Pendiente de revisor frío.
