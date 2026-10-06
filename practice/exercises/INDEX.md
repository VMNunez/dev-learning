# Practice index — every route, each block linked to its note

Navigation for the short-exercise track. `practice-session` writes this projection after a
reviewed plan under `notes/prompts/practice/exercises/_internal/_practice-standard.md` §B.
Coverage defines scope, the notes plan groups it, and each topic-level exercise plan owns its tasks.
The tables link blocks to notes; they never substitute for the exercise inventories. Note status
is read live. Future routes use the same topic/level layout when their environment is enabled.

## java — junior

Exercise plan: [Java junior](java/junior/PLANNING-junior.md)
Active planned exercises: 269
Notes structure SHA-256: 7ce0128dc0f8cf59aca6b22f2663bef9f9dd785e4acef79d79b74d259424f5e2
Notes plan: notes/java/coverage/notes-plan-junior.md
Coverage SHA-256: bad12930637587f5cce0f4c3bad990572d29c6e9c4ea340a6e4a2627a188508a
Derived: 2026-10-06

| Block | Title | Note | Depends on | Bullets | In route |
|---|---|---|---|---|---|
| 00 | Java execution foundations | `notes/java/junior/es/00-intro-java.md` | none | 2 | yes |
| 01 | Values, types, conversion, and arithmetic | `notes/java/junior/es/01-variables-tipos.md` | 00 | 12 | yes |
| 02 | Strings and text | `notes/java/junior/es/02-cadenas-de-texto.md` | 01 | 7 | yes |
| 03 | Control flow | `notes/java/junior/es/03-flujo-de-control.md` | 01, 02 | 6 | yes |
| 04 | Methods | `notes/java/junior/es/04-metodos.md` | 03 | 5 | yes |
| 05 | References, the call stack, and memory | `notes/java/junior/es/05-modelo-de-memoria.md` | 04 | 3 | yes |
| 06 | Classes, encapsulation, records, and equality | `notes/java/junior/es/06-poo-clases.md` | 05 | 15 | yes |
| 07 | Interfaces and abstract classes | `notes/java/junior/es/07-interfaces-abstractas.md` | 06 | 6 | yes |
| 08 | Inheritance and polymorphism | `notes/java/junior/es/08-herencia-polimorfismo.md` | 07 | 5 | yes |
| 09 | Generics and reading nested types | `notes/java/junior/es/09-genericos.md` | 08 | 6 | yes |
| 10 | Collections, hashing, and ordering | `notes/java/junior/es/10-colecciones.md` | 06, 09 | 17 | yes |
| 11 | Exceptions and diagnostics | `notes/java/junior/es/11-excepciones.md` | 05, 10 | 9 | yes |
| 12 | Lambdas, method references, and Optional pipelines | `notes/java/junior/es/12-streams-lambdas.md` | 09, 11 | 10 | yes |
| 13 | Streams, collectors, and ordering | `notes/java/junior/es/13-streams-colectores.md` | 10, 12 | 12 | yes |
| 14 | Enums | `notes/java/junior/es/14-enums.md` | 03, 06 | 3 | yes |
| 15 | Date, time, and API literacy | `notes/java/junior/es/15-fechas.md` | 01, 04, 06, 09, 11 | 5 | yes |
| 16 | Annotations | `notes/java/junior/es/16-anotaciones.md` | 04, 07, 14 | 2 | yes |
| 17 | Maven fundamentals | `notes/java/junior/es/17-maven.md` | 00, 04 | 7 | no — needs a Maven project, not a standalone file (standard §H) |

**In route: 17 blocks, 125 concepts.** Block 17 is excluded and its 7 bullets enter no denominator.
