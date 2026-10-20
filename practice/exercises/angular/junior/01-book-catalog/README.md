# Angular junior — book catalogue (pilot)

Topic: angular
Level: junior
Block: 03 — Signals: state the template reacts to
Date: 2026-10-20
Objective: Build a small book catalogue that keeps its shelf in signals, derives a filtered view, explains why its list is empty and opens a book's detail from the URL, without opening the notes.
Time budget: 30 minutes
Note: notes/angular/junior/es/03-senales.md (Status: pending — not written yet)
Pilot: yes

| Ex | Plan ID | Kind | Block | Concept | File |
|---|---|---|---|---|---|
| 1 | — | extra | 03 | Immutable updates with signals | ex01-book-shelf |
| 2 | — | extra | 03 | `computed()` | ex02-book-filter |
| 3 | — | extra | 04 | `@empty` | ex03-empty-states |
| 4 | — | extra | 18 | A route parameter is always text | ex04-book-detail |

## Study notes

- 03 — Signals: state the template reacts to: [notes/angular/junior/es/03-senales.md](../../../../../notes/angular/junior/es/03-senales.md) (Status: pending — not written yet)
- 04 — Template control flow: [notes/angular/junior/es/04-control-flujo-plantillas.md](../../../../../notes/angular/junior/es/04-control-flujo-plantillas.md) (Status: pending — not written yet)
- 18 — The URL as view state: [notes/angular/junior/es/18-estado-vista-url.md](../../../../../notes/angular/junior/es/18-estado-vista-url.md) (Status: pending — not written yet)

## How to work this batch

This batch is the `lote-01` application of the workspace in `practice/exercises/angular/junior/`.
Run every command from that workspace folder, and always name the application:

- `ng serve lote-01` — the catalogue in the browser, for exercises 3 and 4.
- `ng test lote-01 --include app/ex01-book-shelf --watch=false` — the given spec of exercise 1
  (`app/ex02-book-filter` for exercise 2).

**The given specs start red, and that is where you start.** Before you answer, `ng test lote-01` builds
and the shell's own spec passes, while the specs of exercises 1 and 2 fail on their assertions: they
describe behaviour your code does not have yet. Never edit a given spec — an edited spec is not
evidence.

Each exercise is a folder under `src/app/`. Its statement is the opening comment of its main `.ts`
file, and its `Answer files:` line says which files you write in. Exercises 1 and 2 end with
`// My output:`, where you paste what `ng test` printed; exercises 3 and 4 list a manual check and end
with `<!-- Observed: … -->` in their template, where you write what the browser actually did.

The given book list lives in `src/app/books.ts`; every exercise reads its own copy of the data, so one
unfinished exercise never stops another from working.
