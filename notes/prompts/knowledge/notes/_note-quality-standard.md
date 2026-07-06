# Note quality standard — what a finished note looks like

This is the **shared writing standard** for study notes. It is not a runnable prompt — it holds
no configuration block and does nothing on its own. Two prompts read it:

- `notes-plan-prompt.md` reads it to **judge** whether existing notes meet the bar and to decide
  what is missing (it does not write rich prose).
- `notes-write-prompt.md` reads it to **write** — it applies every rule here in full to the one
  file it is working on.

Keeping the standard in one file is deliberate: the writing bar is long and detailed, and it must
stay identical across both prompts. Edit it here once; both prompts pick up the change.

This bar is the same for **every topic** — it is NOT Java-specific. Notes in other folders
(e.g. Angular) that currently sit below it are a backlog to raise, never a lower target to match.

---

## Folder placement — which concept goes where

| Concept type | Correct folder |
|---|---|
| Security concepts (CORS, XSS, JWT design, AuthN/AuthZ) | notes/security/en/ |
| Cross-cutting concepts (HTTP, JSON, env vars, testing, SOLID) | notes/general/en/ |
| Spring Boot implementation (annotations, filters, config, JPA) | notes/spring-boot/en/ |
| Pure Java language concepts | notes/java/en/ |
| Angular patterns and framework concepts | notes/angular/en/ |
| Angular Material components | notes/angular-material/en/ |
| Architecture patterns (REST, layered, MVC) | notes/architecture/en/ |

---

## Format modes

- `notes/java/en/` and `notes/spring-boot/en/` — **structured mode**: the file opens with a
  `# [Topic Name]` title followed by a general `Docs:` link to the main reference page
  for the whole topic; each section has three fields:
  `Purpose:` (one sentence — who calls it, when, and why), `File:` (real path to the project
  file where this code was applied — check PROGRESS.md to find which project covers this
  concept, then confirm in that project's PLANNING.md; if no project covers it yet, use a
  representative generic path or omit entirely), and `Docs:` (link to the exact sub-section
  to study with a note on what to read, e.g. `https://... → read: "Declaring Transactions"`);
  per-call explanations as bold items (`**.methodName()**`); use `##` to introduce each
  concept section.
- All other folders — **conversational mode**: the file opens with a `# [Topic Name]` title
  followed by a general `Docs:` link to the main reference page for the whole topic; each section
  has a `Docs:` link that points to the exact sub-section to study and states what to read (e.g.
  `Docs: https://... → read: "Template syntax — Built-in control flow"`); no `Purpose:` or `File:`
  lines; prose explanations with code blocks — explanation comes before the code, not in dedicated
  metadata fields; use `##` for top-level topic sections and `###` for sub-concepts within them —
  when adding a section to an existing file, match the heading level already in use.

> **Spring Boot notes lean on Java concepts.** When writing a `notes/spring-boot/en/` note, the code
> almost always uses pure-Java language features (generics, exceptions, interfaces). Read the
> existing `notes/java/en/` files so you anchor those consistently — and when a Spring note leans on
> a Java concept covered there, link to it rather than re-explaining it (see the cross-file link rule
> in rule 3).

**Docs link priority by topic** — the linked page must show real code examples and explain where
things come from, not just define terms:
- Spring Boot and Java concepts → **Baeldung (baeldung.com)** as primary (full working code,
  step-by-step context). Official Spring docs as a secondary link only. Never link the official
  Spring docs as the sole reference for a concept that Baeldung explains better with examples.
- JWT → the **jjwt GitHub README** (github.com/jwtk/jjwt) — direct examples.
- Angular → the official **Angular docs (angular.dev)** — clear and learner-friendly, use as primary.
- CSS and JavaScript → **MDN (developer.mozilla.org)** as primary.

Only add a link if you are certain of the correct URL and sub-section — if not, write
`Docs: TODO — add link` instead of guessing. A wrong URL is worse than no link.

---

## Bilingual notes — English and Spanish

Each topic folder has `en/` and `es/` subfolders. `coverage.md`, `future-learning.md`, and
`layer-reference.md` live in the topic root — never inside `en/` or `es/`.

**File naming convention — mandatory:**
- Files in `en/` use English names: `03-methods.md`, `07-collections.md`, `08-exceptions.md`.
- Files in `es/` use Spanish names: `03-metodos.md`, `07-colecciones.md`, `08-excepciones.md`.
- The number prefix is always the same across both languages — it is the only shared part of the name.
- Technical proper names with no Spanish equivalent keep the same name in both folders: `maven`,
  `enums`, `streams`, `lambdas`.
- The `es/` counterpart of `en/XX-some-name.md` is `es/XX-nombre-en-español.md` — never a copy of
  the English filename. The counterpart is identified by its **number prefix**, not its full name.

**Never modify an `en/` file without mirroring the change to its `es/` counterpart:**
- **New file in `en/`** → also create the full Spanish version in `es/` with a Spanish filename
  (translated, same number prefix). Same structure, same code blocks — only the prose is in Spanish.
  Code comments may also be translated. **The Spanish prose must read as natural Spanish, not as a
  literal word-for-word translation of the English.** The content and message must be identical
  across both languages, but each version should read as if it were written natively in that
  language — same idea, same emphasis, different words where the language demands it. Awkward or
  robotic translations that follow the English sentence structure too closely are not acceptable.
  Structural labels (`Purpose:`, `File:`) must be translated to `Propósito:`, `Archivo:`. `Docs:`
  stays as-is.
- **New section added to an existing `en/` file** → add the translated section to the `es/`
  counterpart too.
- **TODO resolved in an `en/` file** → apply the equivalent fix in the `es/` counterpart too.

**Victor studies from the `es/` files.** They are primary — apply changes there first, then mirror
to `en/`.

---

## Living document rules

Notes are not written once and forgotten. After each concept is learned and the code is written in
a project, check the relevant notes file:
- If the concept is not documented, add it with a real code example from the current project.
- If a section already exists with a code example, add a new sub-section within that file if the
  project introduces something meaningfully new — do not replace or edit the existing example, and
  do not add a duplicate for the same concept.
- Never duplicate examples across files in the same folder.

---

## Rule 3 — the writing standard for new files and new sections

The goal is notes that work as a personal study book — clear enough to learn from scratch and
return to as a reference. Every concept needs enough explanation to understand it, not just
recognise the syntax.

**Target reader:** write for someone who has never seen this concept before. A complete file is one
that takes that person from zero to "I understand what this is and why it exists" without needing to
look anything else up. These notes are Victor's **only** source for the topic — there is no course or
book behind them — so nothing may be assumed to come "from elsewhere".

### Narrative thread — the topic reads as one continuous story from 00 to N

The notes are not a pile of well-written but disconnected pages. Read in order, files 00 → N must feel
like **one guided journey**: each concept arrives because the previous one made it necessary, and the
reader always knows where they are in the story. This is Victor's explicit bar — he studies by
following a thread from start to finish, not by looking up isolated entries.

Concretely, every file (beyond `00-intro`) must:
- **Open by picking up the thread.** The first lines connect back to where the previous file left off
  and say *why this topic comes now* — e.g. "You can now create objects (file 02). But every object
  so far has been an island — nothing shares behaviour. That is the problem inheritance solves."
  Never open a file cold with a bare definition, as if the reader arrived from nowhere.
- **Close by handing off.** The last lines point forward: what this unlocked, and what the next file
  builds on top of it — e.g. "Now that exceptions can travel up the stack, the next question is *where*
  you should catch them. That is what file 09 is about."
- **Keep a running domain where it helps.** When natural, carry a familiar example domain across
  several files of the topic (the same `User`/`Order` model, the same `Animal` hierarchy) so the
  reader recognises the world instead of re-learning a new toy example every file. This extends the
  per-section "one worked example" rule up to the topic level.
- **Reference, don't re-teach.** When a file leans on a concept already covered, link back with the
  one-sentence reminder (see the cross-file link rule below) instead of re-explaining or ignoring it —
  that is what keeps the thread continuous without breaking the current file's flow.

The `00-intro` file is the map of this journey: it must lay out, in one paragraph, the route the rest
of the files take and why they are ordered that way. When auditing, check the **seams between files**,
not just each file in isolation — a topic can be made of strong pages and still read as disconnected.

### Zero-assumption rule — the most important rule in this section

Never assume the reader knows anything about the topic being covered. Every term, every concept,
every annotation, every method introduced in a section must be explained in that same section —
what it is, why it exists, and what problem it solves. If you introduce a word and the next sentence
does not clarify what it means and why it matters, that is a gap. The test: could a developer who
knows JavaScript but has never touched this technology read this section and understand every word
without Googling anything? If not, something is missing.

This rule overrides "calibrate depth to complexity" — there is no such thing as a concept too simple
to explain. What feels obvious to an experienced developer is often exactly what a beginner gets
stuck on. When in doubt, explain more, not less.

### Second-order completeness — the four rules that separate a draft from a finished note

The zero-assumption rule above ("define every term") is first order — it is satisfiable by a note
that still leaves every doubt below open. These four rules are where auto-generated drafts
consistently fall short and where Victor ends up adding TODOs by hand. Apply all four when writing
any new section, and check them when auditing an existing one:

- **Explain the mechanism, not just the usage.** When a concept has a counter-intuitive behaviour
  or depends on how it works under the hood — memory layout, references, an internal counter, binary
  representation — explain *why* it behaves that way, not only how to call it. Defining what it is
  and showing the syntax is not enough if the behaviour is surprising. (e.g. explain the `modCount` +
  iterator interaction behind `ConcurrentModificationException`, the contiguous memory slots of
  `ArrayList` vs the node chain of `LinkedList`, why `double` cannot represent 0.1 exactly.)
- **Contrast confusable pairs explicitly.** When a section introduces two elements with a similar
  name or role — `void`/`Void`, `Collection`/`Collections`, `==`/`equals`, overriding/overloading,
  `Comparable`/`Comparator`, `compareTo`/`compare`/`comparing` — add a short sub-section or a
  `> blockquote` that contrasts them directly: which is which, how they differ, and when to use each.
  Do not leave the reader to infer the distinction.
- **State the exact scope of every rule.** When a rule or method only applies to part of what the
  file covers, say so explicitly ("`sort()` only exists on `List`"; "`Collections.sort()` is List
  only — `Set` and `Map` have no positional order"). Never leave a generic statement the reader has
  to narrow down on their own.
- **Anchor against JavaScript/TypeScript — but only when equivalent is truly functional.** Anchor
  only when the equivalence is direct and transparent — where using them is functionally the same in
  both languages (e.g. `final` = `const`, for-each = `for...of`, try/catch syntax is identical,
  `.formatted()` = template literals). Do NOT anchor when a concept exists in JS/TS but serves a
  fundamentally different purpose or requires different mental context — for example, exception types
  in Java (checked/unchecked, compile-time enforcement, type hierarchy) are not comparable to JS
  error objects (runtime-only, informal, no type distinctions). When the JS version is only
  superficially similar, acknowledge the difference explicitly instead of suggesting they are
  equivalent. When in doubt, it is better to acknowledge that JS/TS has no equivalent than to force
  a misleading comparison. **Do not add filler "JS has no equivalent" paragraphs that teach nothing
  — only anchor when the comparison genuinely clarifies.**

### Signature elements — the texture of a finished note (Victor's actual bar)

The rules above make a note *correct*. These make it match the standard Victor has actually
validated — the level of the early Java notes (`01-variables-tipos.md`, `06-herencia-polimorfismo.md`,
`07-colecciones.md`) and above all **the first section of `08-excepciones.md`, which is the single
best reference for what a finished note looks like**. Not every element fits every section, but a
finished note visibly uses most of them:

- **One worked example carried through the whole section.** Pick a single concrete example and
  follow it from start to finish, rather than scattering unrelated fragments. `Animal/Dog/Cat` runs
  through all of the inheritance section; `main() → methodA() → methodB()` runs through the entire
  call-stack explanation in `08`. The reader should trace one story, not re-orient at every code block.
- **ASCII diagrams for anything with spatial or structural shape.** When the concept has a shape — a
  stack, a tree, a memory layout, a request flow — draw it. The call-stack diagram in `08`
  (`[top] methodB() / methodA() / main() [bottom]`) is the model. A diagram is often worth more than
  a paragraph for structure.
- **Real-world analogies for abstract mechanisms.** Anchor an abstract idea to a physical one: the
  call stack as "a stack of plates", integer overflow as "an odometer rolling over", `StringBuilder`
  as "a whiteboard you write on piece by piece". One good analogy per hard concept.
- **Abundant `> blockquote` callouts — roughly one per non-obvious sub-concept.** Victor's validated
  notes are dense with these (five in the first `01` file alone). Every "why does it work this way?",
  "what does this word mean?", or "why not the obvious alternative?" becomes a callout. Do not ration
  them — under-using callouts is the most common way a draft falls below his bar. Resolve the doubt as
  a statement of fact (see the question-TODO rule in `notes-write-prompt.md`) — never phrase the
  heading as a literal question.
- **Every comparison table gets a sentence on how to read it.** After any table, add a line that
  explains what a non-obvious column or row actually means and how to use it — e.g. "The `Parent
  class` column is what determines whether the compiler treats it as checked or unchecked." A table
  Victor has to decode on his own is below standard.
- **Show the exact error message.** When a mistake produces a specific compiler or runtime error,
  quote it verbatim (`unreported exception IOException; must be caught or declared to be thrown`,
  `Type argument int is not within bounds of type-variable E`). The real string is what he'll
  recognize later in IntelliJ, and it makes the note concrete instead of abstract.
- **Label wrong-vs-right examples.** When there is a tempting wrong way, show both and label them —
  `// MAL` / `// BIEN` (or ✅ / ❌ inline). Seeing the broken version next to the correct one is what
  makes the lesson stick.

### Anticipate-the-TODO pass — the single highest-impact step (run before finalizing every section)

This is the step that actually reduces how many TODOs Victor has to add. Half of his TODOs are the
same kind of doubt: **mechanism questions** — he asks *why* something works the way it does, not what
it does. The root cause is always the same: the draft describes *behaviour* ("the exception travels
up the stack") without tracing the *mechanism* ("what the stack is, how each method is stacked, in
what order it leaves, why 'up' means 'toward the caller'"). When the step-by-step mechanism is
missing, he asks — every time.

**Do this actively, not passively.** For each section, actually *write out* 3–5 TODOs that Victor
would add (phrased in his voice: "¿por qué…?", "¿esto significa…?", "¿en qué orden…?"), then resolve
each one in the prose, then delete the list before delivering. Writing the questions down forces the
gap to surface; merely "keeping them in mind" does not. The checks below are what to look for when
generating that list:
- **Mechanism before behaviour.** For every statement of *what* something does, ask: "have I
  explained *why* it behaves that way, under the hood?" If the text states the behaviour but not the
  mechanism that causes it, that is a guaranteed TODO — trace it now, step by step.
- **Simulate his chained "why?" questions.** For each section, generate the chain of "why does this
  work?" and "does this mean that?" questions a rigorous reader would ask, and verify the prose
  already answers each one. If any is unanswered, answer it in the text (as a statement of fact —
  never leave the question visible).
- **Never mention an action in the abstract without its code.** If the text says "you can rethrow
  it", "you can wrap it", "you configure it" — the concrete code snippet must be right there. An
  abstract mention with no example is a guaranteed "quiero ver un ejemplo" TODO.
- **Re-read for contradictions.** Check every claim against the other paragraphs and against any
  diagram in the same section. The "propagates up" vs a diagram drawn top-down is exactly the kind of
  contradiction he catches — resolve it before he does.

**Worked exemplar — what the transformation looks like (the calibration target).**
Study the *shape* of the move from draft to finished, not just the topic.

*Poor draft (describes behaviour, no mechanism):*
> "When something fails, the method throws an exception. The object travels up the call stack until
> something catches it. If nothing catches it, the app stops and the error is printed."

*TODOs Victor added to that draft (all mechanism questions — these are the real ones):*
> - ¿el objeto va pasando de un método a otro? ¿si nadie lo captura me sale el error?
> - ¿qué significa "cada método encima del anterior"? ¿los nuevos arriba y los viejos abajo?
> - ¿"termina y devuelve"? ¿en qué orden se quita de la pila?
> - ¿por qué dices que sube si en el diagrama va hacia abajo? ¿es una contradicción?

*Finished version (traces the mechanism step by step, pre-empting every one of those):*
> Defines the call stack as a live LIFO structure with an ASCII diagram
> (`[top] methodB() / methodA() / main() [bottom]`); walks through how each method is stacked on call
> and removed on return; states the error is always born at the top because only the method executing
> right now can fail right now; explains that the exception exits toward the caller following the
> same path a `return` takes; and adds a `> blockquote` clarifying that "up" is the standard wording
> but means "toward the caller", drawn downward in the diagram — killing the contradiction before it
> is raised.

The lesson: the draft was not *wrong*, it was *behaviour-only*. Every TODO disappeared once the
mechanism was traced with a diagram, a worked example, and a callout for the misleading word. The
full finished text is the first section of `notes/java/es/08-excepciones.md` — read it before writing
a new file to calibrate.

### The rest of the writing rules

- **Personal, conversational voice.** Write for Victor. "You use this when..." not "This is used
  when...". "This is why it matters:" not "This is relevant because:".
- **Explain before the code.** Give 1–3 sentences of context before any code block — what the concept
  is, why it exists, when you reach for it. Do not open a section with a code block and no explanation.
- **Call out gotchas and "why not X" moments.** When there is a common mistake or a tempting shortcut
  that is wrong, name it explicitly. Use a **Why not X?** subheading or a `> blockquote`. Example:
  "Why not just return the object directly? Because you always get 200, even when you created
  something (which should be 201)."
- **Write in learning order — start with the problem, not the concept.** The concept exists because
  something was painful without it. Lead with that pain. "Before Spring Boot, you had to configure
  Tomcat separately and write XML to wire beans. Spring Boot removes all of that." Not: "Spring Boot
  is a framework that provides auto-configuration."
- **Inline tips for non-obvious things.** Use `> blockquote` callouts for things that are easy to get
  wrong or that only make sense after you've hit them in practice. These are the notes a senior would
  whisper to a junior during a code review.
- **Reference real projects.** If a concept was practiced in one of Victor's projects, reference it
  with a real code fragment — not a fabricated example. To find it: check PROGRESS.md to identify
  which project covers this concept, then read that project's PLANNING.md to confirm, then search the
  project source code for the relevant fragment. (e.g. "This is the same pattern as MatDialog.open()
  in project 05 — same idea, different layer.")
- **Do not write documentation.** If the note could be copy-pasted onto the official docs site
  unchanged, it is wrong. Notes capture what Victor learned and why it clicked — not a neutral
  description of what the framework does.

  > **Bad note:** "`HttpClient` is a service that performs HTTP requests. It provides methods for all
  > HTTP verbs including GET, POST, PUT, and DELETE."
  > **Good note:** "`HttpClient` is Angular's way of calling external APIs. You inject it into a
  > service (never a component) and it returns an Observable you subscribe to. Without it you'd use
  > the browser's `fetch` directly — Angular just wraps it and makes it injectable. Used in project
  > 02 to call the weather API."
  > The bad note reads like the official docs. The good note explains WHY you use it, WHERE it lives,
  > and references a real project.
- **Calibrate depth to Victor's bar, not to the concept's difficulty.** The floor is never "how hard
  is this concept" — it is "how much does it take to *truly understand* it", the standard set by the
  validated files (esp. `08-excepciones.md` section 1). A genuinely trivial one-liner can stay short,
  but the default assumption is that a concept deserves the full treatment: mechanism, a worked
  example, a callout for the non-obvious part. Do not write a thin two-paragraph section just because
  the concept isn't "complex" — if the surrounding sections in the same file have diagrams, tables,
  worked examples and callouts, this section matches that texture too. Under-explaining is the failure
  mode here, not padding.
- **Mark forward references within the same topic.** If an example in file N uses a concept that is
  not explained until file M (M > N), add a one-line note inline: "The `X::Y` syntax is a method
  reference — covered in full in `09-streams-lambdas.md`. For now, read it as 'the `Y` method of
  `X`.'" Never leave syntax the reader hasn't seen yet unexplained and unmarked.
- **Add a preview callout for every cross-topic reference.** When a section uses classes, annotations,
  or patterns from a different topic folder — for example, Java language notes mentioning `@Entity`,
  `JpaRepository`, `ResponseEntity`, or `@Service` — open that section with a blockquote callout:
  `> **Preview — Spring Boot:** The examples below use Spring Boot classes you haven't studied yet.
  Read this to see where this Java concept appears in practice — you'll implement it in the Spring
  Boot notes.` Adapt the topic name and description to the actual cross-topic reference. A reader
  studying files in sequence must never encounter an unexplained class or annotation without a clear
  signal that it belongs to a different topic they haven't reached yet.
- **Link to other note files when a concept depends on something already covered elsewhere.** Use a
  markdown link to the relevant file (e.g. `see [08-generics.md](08-generics.md)`). After the link,
  add one sentence of reminder — short enough that the reader can continue without opening the other
  file if they roughly remember the concept. The link is for deep review; the sentence is so the flow
  of the current file is never broken.
- **Code concept sections (methods, classes, annotations)** *(structured mode — notes/java/en/ and
  notes/spring-boot/en/ only)*: each section starts with three metadata lines: `Purpose:` — one
  sentence: who calls it, when, and why; `File:` — real path to the file where this code was applied;
  check PROGRESS.md to find which project covers this concept, then confirm in that project's
  PLANNING.md, then locate the actual file; if no project covers it yet, use a representative generic
  path or omit entirely; `Docs:` — link to the exact sub-section to study with a note on what to read.
  Then explain each important call or line with a bold item — what it does and why it matters, in
  plain language. Never include an Imports section — IntelliJ handles imports automatically.

---

## Coverage status legend

When reporting on a file, give it one of these:
- ✅ **Complete** — solid coverage for a junior screening at a Spanish consultancy
- 🔧 **Fixed** — gaps found and resolved in this session
- ➕ **Added** — new content created from scratch
