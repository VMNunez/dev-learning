# Cover Letter Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste the offer at the end.

Run this when an offer asks for a cover letter, or when you want to write directly to a recruiter. The
output is ready-to-send Spanish text — no rewriting, just copy it.

Two modes:
- **`letter`** — a formal one-page cover letter (for offers that ask for a *carta de presentación*)
- **`message`** — a short 5–6 line message to send a recruiter on LinkedIn or by email

> **▶ Run first:** `progress-update` (so `PROGRESS.md` is current). Optional: `cv-prompt` `tailor` first,
> so the letter/message and the CV tell the same story for that offer.

---

**How to use:**

1. Fill in the configuration block below
2. Paste the entire prompt into a new chat
3. Paste the **full job offer** (or, for `message` mode, the recruiter's post/role) at the very end

---

```
## Configuration — edit only this block

MODE     = [letter | message]
EMPRESA  = [company name]
PUESTO   = [role title as written in the offer]
CONTACTO = [recruiter name if you have one — used to open the message | blank]
```

---

## Before starting

First read `notes/prompts/strategy/apply/_application-standard.md` — the shared standard both application
prompts follow. It defines the **sources to read** (`CLAUDE.md`, `notes/prompts/_shared-context.md`,
`PROGRESS.md`, `ROADMAP.md`, the optional `notes/cv/cv-bullets.md`, and your existing CV in
`personal/job-search`), the **universal bullet format**, the **keyword pool**, the **Spanish / no-buzzword
voice**, the **defensibility rule**, and the **project-selection heuristic**. This prompt does not repeat
those rules — it adds only the cover-letter flow on top.

Then read the pasted offer to know what **that specific company** asks for — you connect their needs to
real evidence from your profile, never generic enthusiasm.

---

## Shared rules for both modes

- **Write in Spanish**, no buzzwords (no "apasionado", no "orientado a resultados"), no em-dashes, no
  clichés. Same voice as the CV.
- **Every claim is defensible** — only mention a skill you can back up in an interview (defensibility
  rule). Name the internship (SaaS with Next.js + TypeScript + MySQL) and the full-stack project
  (`07-timetrack`, Angular + Spring Boot + PostgreSQL) as the concrete evidence.
- **Connect their needs to your evidence** — read what the offer asks and match it to a specific thing
  you built, not to an adjective. "Construí una API REST con Spring Boot y JWT" beats "tengo pasión por
  el backend".
- **Forward-looking framing** — you are junior; lead with what you have built and are quickly learning,
  not with years of experience you don't have.

---

## MODE = letter — formal cover letter

Structure (one page, four short paragraphs):

1. **Opening** — who you are in one line and which role you apply for at which company. No "Me dirijo a
   ustedes para..."; open with substance.
2. **Why them** — one concrete reason tied to *this* company/offer (their stack, their sector, a project
   type). Shows you read the offer, not a mail-merge.
3. **Why you** — the strongest 2–3 pieces of evidence matched to what the offer asks: the internship, the
   full-stack project, the exact technologies from the offer that you have used. This is the core.
4. **Close** — a short, confident sign-off with a clear next step (availability for an interview). No
   begging, no over-thanking.

Keep it under ~250 words. A junior cover letter that a recruiter reads in 20 seconds beats a full page
they skim.

---

## MODE = message — short recruiter message

For a LinkedIn message, InMail, or a short email to a recruiter. Rules:

- **5–6 lines maximum.** A recruiter reads it on a phone between other messages.
- Open with the contact's name if `CONTACTO` is set; else a neutral "Hola,".
- One line on who you are + your stack (junior Angular + Spring Boot).
- One line connecting to the role or their company.
- One concrete proof point (the full-stack project or the internship).
- A clear, low-friction ask: a quick chat, or whether they're still hiring for it.
- No links dump, no CV pasted in the body — offer to send it.

Draft **two versions**: the recommended one first, and a slightly warmer/more direct alternative. Mark
the recommended one.

---

## After generating

- Remind the user to log the application with `tracker-prompt` (`log` mode) if this is a new outreach, so
  the message/letter and its outcome are on record.
- The letter/message is **output only** — it is not stored in the repo. If the user wants to keep a
  formal letter, suggest saving it next to the tailored CV in `personal/job-search/applications/`.
