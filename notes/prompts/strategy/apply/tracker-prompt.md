# Tracker Prompt

Use in a **separate conversation** (ideally inside Claude Code, so it can read/write the local files).
Fill in the configuration block before pasting.

Run this to keep your **job-application tracker** current: register a new application, record the
outcome of one already sent, or analyse the whole tracker for patterns. The tracker is the memory of
your job search — it turns scattered applications into data you can learn from.

Three modes:
- **`log`** — register a **new** application you just sent (appends a row, status `aplicado`)
- **`update`** — record what happened to an application already on file (status change + feedback)
- **`analyze`** — read the whole tracker and surface patterns worth acting on

> **▶ Run first:** nothing. This is a starting point. Optionally, after `analyze`, the patterns it finds
> feed `evidence-intake-prompt` (real postings → `_job-market-evidence.md` → coverage).

---

## Where the tracker lives — outside the repo

The tracker holds personal data (company names, contacts, feedback), so like your CV it lives **outside
the repo and is never committed**. Only this prompt (which contains no personal data) lives in the repo.

```
C:\Users\Victor\Documents\main\personal\job-search\
  tracker.csv                          ← one row per application (the source of truth)
  applications\
    empresa-puesto\
      outcome.md                       ← full history of one application (feedback, stages)
      job_posting.md                   ← the offer text, saved before it expires
```

You sync this folder to Google Drive manually whenever you want a backup — the prompt only writes the
local files.

### tracker.csv columns

```
fecha,empresa,sector,puesto,canal,estado,contacto,nota_feedback,cv_usado,fuente_url
```

- **fecha** — date applied, `YYYY-MM-DD`
- **empresa** — company name
- **sector** — e.g. `consultora`, `producto`, `banca`, `startup`
- **puesto** — role title as written in the offer
- **canal** — where you applied: `InfoJobs`, `LinkedIn`, `Tecnoempleo`, `web empresa`, `recomendación`
- **estado** — `aplicado` → `entrevista` → `oferta` → `contratado` / `rechazado` / `sin respuesta` / `retirada`
- **contacto** — recruiter or contact name if you have one, else blank
- **nota_feedback** — short dated note; the full version lives in `outcome.md`
- **cv_usado** — filename of the tailored CV sent (from `personal/job-search/applications/`), else blank
- **fuente_url** — the offer URL

---

```
## Configuration — edit only this block

MODE     = [log | update | analyze]

## log mode — fill these (the ones you know; leave blank what you don't):
EMPRESA  = [company name]
PUESTO   = [role title from the offer]
CANAL    = [InfoJobs | LinkedIn | Tecnoempleo | web empresa | recomendación]
FUENTE   = [offer URL, if any]
CONTACTO = [recruiter name, if any]
CV_USADO = [filename of the CV you sent, if any]

## update mode — fill these:
EMPRESA  = [company name to find the row — role too if the company appears twice]
PUESTO   = [role, only if needed to disambiguate]

## analyze mode — no config needed.
```

---

## Before starting

Read `notes/prompts/strategy/apply/_internal/_application-standard.md` for the **target-market context** (Spanish
junior Angular + Spring Boot at consultancies) and the **keyword pool** — you use it in `analyze` mode to
judge which skills the offers keep asking for. You do **not** need to write any CV bullets here.

---

## MODE = log — register a new application

1. Read `personal/job-search/tracker.csv`. If it does not exist, create it with the header row above.
2. Build the new row from the config block. Fill `fecha` with today's date and `estado` with `aplicado`.
   For `sector`, infer it from the company/offer if obvious (e.g. NTT Data → `consultora`); if unsure,
   ask one short question rather than guessing.
3. **Append** the row — never reorder or touch existing rows.
4. Create `personal/job-search/applications/<empresa>-<puesto>/` (lowercase, hyphens for spaces) and,
   inside it, `job_posting.md` with the offer text if you have the URL or pasted text (WebFetch the URL;
   if it fails, ask the user to paste it — **never reconstruct a posting from memory**). Start an
   `outcome.md` with status `aplicado` and the date.
5. Confirm: show the appended row and the folder created.

---

## MODE = update — record what happened

1. Read `tracker.csv`. Match the row on `empresa` (and `puesto` if the company appears twice). No match →
   the application was made outside the tracker; collect the basics and add a row first (as in `log`).
2. Ask the user what happened, then classify the new `estado`:
   - `entrevista` — got a screen or interview (note which stage)
   - `oferta` — received an offer
   - `contratado` / `rechazado` / `sin respuesta` / `retirada` — final outcomes
3. Collect, without interrogating — one or two open questions is enough:
   - The **feedback received, verbatim** where the user remembers it (this is the gold — it feeds both
     interview prep and `analyze`).
   - What they'd do differently, and any signal about what the company valued.
4. **Update the tracker row:** change `estado`, append a short dated note to `nota_feedback`. Never
   restructure the CSV or touch other rows.
5. **Update `applications/<empresa>-<puesto>/outcome.md`:** append a dated entry — never overwrite
   history. Format:

   ```markdown
   # Outcome: <Empresa> — <Puesto>

   **Estado:** aplicado | entrevista | oferta | contratado | rechazado | sin respuesta | retirada

   ## Etapas alcanzadas
   - [x] Aplicado (YYYY-MM-DD)
   - [ ] Screen telefónico
   - [ ] Entrevista técnica
   - [ ] Oferta

   ## Notas
   <feedback verbatim, qué mejorar, señales de lo que valoraron — una entrada por fecha>
   ```

6. Confirm what changed (row status + what was appended to `outcome.md`).

---

## MODE = analyze — learn from the tracker

1. Read the whole `tracker.csv` and every `outcome.md` under `applications/`.
2. Produce a short, honest read — no filler. Look for:
   - **Response rate by channel** — which `canal` actually gets replies vs silence.
   - **Rejection patterns** — do rejections cluster around a missing skill, a sector, or a role type?
     Cross-check against the **keyword pool** in `_application-standard.md`: if two+ offers that went
     nowhere all asked for something you don't have (e.g. `Docker`, `testing`), name it.
   - **Recurring feedback** — the same critique twice is a signal, not noise.
   - **Funnel** — how many `aplicado` → `entrevista` → `oferta`, and where the drop is.
   - **Aging queue (follow-up)** — every row still `aplicado`/`entrevista` whose `fecha` is more than
     14 days old with no note since: list them and suggest a follow-up (use `cover-letter-prompt`
     `message` mode).
3. Give **2–4 concrete actions**, ranked. Each must be something you can act on, e.g.:
   - "Two consultancies rejected after asking for Docker — run `evidence-intake` on those offers so it
     reaches `coverage.md`, then prioritise the Docker topic."
   - "LinkedIn gets replies, InfoJobs is silent — shift volume to LinkedIn."
4. If a skill gap shows up in the offers, **suggest running `evidence-intake-prompt`** on those postings
   so the signal reaches `coverage.md` — do not edit coverage yourself. Analysis here, market-nourishing
   there.

---

## Important rules

1. **Write data, don't interpret it into other files.** This prompt owns the tracker and the archive.
   Coverage/learning decisions belong to `evidence-intake` → `coverage`. Never edit `coverage.md` or
   `ROADMAP.md` from here.
2. **The archived posting is what was actually sent.** Never overwrite an existing `job_posting.md` or
   rewrite `outcome.md` history — append.
3. **Never fabricate.** A dead offer URL gets a user-pasted copy or an explicit "no disponible" stub, not
   a reconstruction. Feedback is recorded as the user reports it.
4. **Idempotent.** Re-running on the same application appends new notes and stages; it never duplicates
   folders or rows.
5. **Everything stays outside the repo.** The tracker and archive live in `personal/job-search/`; only
   this prompt is committed.
