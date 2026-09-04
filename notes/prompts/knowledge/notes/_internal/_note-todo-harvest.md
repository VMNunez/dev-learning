# Note-TODO harvest

**Victor's TODO corrections are the only measurement of his prose bar that exists, and the system used to
destroy them at the moment it resolved them.** Both rule families `_note-quality-standard.md` rests on
were derived once, by hand, from a single pass — the mechanism family (its "Anticipate-the-TODO pass")
and the seven sentence-level register rules (its "Sentence-level register") — and neither's evidence
survived: the TODO lines are gone from the files, and `git log -S TODO --follow` over the pair that
produced the seven returns one added line, written by the pipeline. This file is the countable index of
that evidence. The source contract is `_recommendation-ledger.md` → `REC-171`; this file is only its
event sink and must not restate or widen it.

## Why this is not `git log -p`, and not the other three sinks

The draft→refined diff does survive, because the pipeline commits its own draft. It carries the
**answer** without the **question**, and the question is what produced those seven rules
("MAL EXPRESADO", "¿QUÉ ME IMPIDE HACER?"). `_recommendation-resolution-doctrine.md` settles the rest:
*evidence whose value is recurrence needs a store that can be counted, not merely one it can be recovered
from*. The harvest's question is recurrence **across pairs**, and `git log -p` answers it only by
archaeology over N diffs with no normalised field for which rule was at fault.

The three machinery sinks record what a **ritual** did — a failed step (`FRIC`), a run not worth its
cost (`RITF`), a text that made a run improvise (`SBRC`). This one records what **Victor's prose bar**
is, measured on the notes themselves. Different object, different consumer, and none of the four reads
another.

## The raw archive stays in git

The sink holds the countable index; the prose that provoked each complaint is not in it and never will
be. The TODO pass is committed before it is resolved, so the provoking text is recoverable as
`git diff <todo-pass-commit>..<refined-commit>` on that pair. Countable index here, full context there.

## What a row must contain

`ID` uses the next zero-padded `NTH-NNNN`. `ID`, `Date`, `Pair`, `Lang`, `Category`, `Quote`, `Verdict`
and `Rule` never change after insertion. **Two** fields move, and this is the only sink with a second
one: `Disposition`, and `Count`. Escape a literal table pipe as `\|`.

**One row per pair and category, never per TODO.** One file yields twenty markers, and a per-row cost
that size inside a daily block is what `REC-054` watches. **At most one `open` row may exist for a given
`Pair` + `Category`**: a writer meeting that key again increments `Count` instead of appending a row.
That invariant is the load-bearing one — a duplicated row corrupts the cross-pair count the threshold
below is computed from, while an imprecise `Count` corrupts nothing.

**`Count` is a lower bound, not a tally.** The two writers see overlapping sets of markers on one pair
(see "Who writes it"), and neither can tell which of the other's it has already counted. No rule in this
file rests on its exact value: the threshold is **cross-pair**, and the within-pair number is only there
to separate a note's quirk from an invariant. Never reconcile it, and never read a low count as evidence
of anything.

**`Quote` is the payload, not decoration.** One or two of Victor's own words, **verbatim**, in the
language he wrote them. The seven register rules exist because his literal wording survived; a
paraphrase would not have produced one of them. Never summarise the complaint, and never translate it.

**`Category` is a kebab-case slug, and recurrence is counted by exact match.** When a complaint recurs,
**copy the existing row's slug** rather than composing a new one — the `_skill-breach-log.md` lesson
about `Breached step`, for the same reason: two rows count as the same defect only when the string
matches. A new slug is for a complaint no existing slug covers, which is the discovery this file exists
for; the set is deliberately open, because a closed enum could only ever re-find the rules the standard
already has. The slugs are Spanish because his TODOs are, and because the counter line below is.

The seeds, derived from the two families the standard already carries — not a closed list:

| Slug | The complaint |
|---|---|
| `mecanismo` | describes behaviour without tracing the mechanism — the "¿por qué funciona así?" family |
| `lead-in-metafora` | a bold lead-in written as a metaphor or a riddle instead of a plain statement |
| `clausula-sin-explicar` | a supporting clause assumes what the section's own concept may not |
| `termino-sin-presentar` | a command, tool or file type named before saying what it is |
| `referencia-adelantada` | a forward reference written as a trailing clause ending in a link |
| `frase-sobrecargada` | more than one idea per sentence, or more than one em-dash aside |
| `consecuencia-abstracta` | an abstract consequence stated and never spent on what it prevents |
| `claim-sobredimensionado` | a claim about a project scoped wider than what is actually true |

**`missing` and `unapplied` are opposite repairs, and the column exists to keep them apart.** `missing`
— the standard lacked the rule. `unapplied` — the standard carried the rule and the writer did not
apply it, and then `Rule` cites it as `` `_note-quality-standard.md` → `{heading}` ``. Without the split,
a repeated breach is harvested as a *new* rule and the standard ends up stating the same thing twice.
`_recommendation-resolution-doctrine.md` already rules the other half: past a count, the verdict on a
repeated `unapplied` flips from the executor's fault to the rule being mis-worded or mis-placed.

`Rule` is `—` on a `missing` row.

`Disposition` is `open` until a harvest rules on that category, then `harvested YYYY-MM-DD` — **written
to every open row carrying that slug at once, not only to the two that matured it.** Its writer is the
`REC-NNN` that performs the harvest, and nothing else moves it. Leaving a third row of a harvested
category `open` would silently drop the standing threshold from two new pairs to one, which is the
count the whole file is built to protect.

## Who writes it

Two writers, and their sets overlap on purpose — see `Count` above.

- **`study-content-writer`, at the moment it resolves the TODO**, while the reason is still known. This
  is the primary writer, and the only one that sees both admissible inputs: a marker Victor wrote in the
  pair, **and a correction he states directly in chat**, which leaves no artefact in the file and today
  is lost entirely. `notes-plan-prompt.md`'s refined-freeze route already obliges the resolving run to
  quote an in-chat correction; this is where that quote is kept.
- **`notes-audit`**, for the markers it reports and may not resolve. Secondary: it never resolves a
  TODO, so it rows what it sees and hands the resolution on.

Neither writer blocks, asks a question, or argues with a row. A TODO whose category is unclear is rowed
under the closest existing slug or a new one, never left unrowed pending a decision.

**What this sink deliberately does not see, named so its absence is not read as coverage.**
`notes-audit` in its **standard** mode resolves Victor's TODOs itself and clears the marker
(`_notes-write-prompt.md` → "Step 1 — Resolve TODOs"), and that path writes **no** row. `REC-171` (f)
scopes this file's second writer to "the markers it may not touch", so the exclusion is deliberate and
not an oversight — but it is a real hole in the measurement, and a category that only ever occurs on a
`pending` note will never mature here. Widening it is a `REC-NNN` of its own, never a run's improvisation.

## Who counts it, and when a category is due

The counter is the close-out that already writes `Status: refined` — `study-content-writer`'s
freeze-sync route. It prints `cosecha: ninguna` or `cosecha: {categoría} madura` on **every** run, clean
ones included. That is the `desvíos:` visible-line discipline and it exists for the same reason: the run
that should have noticed is exactly the run that does not, and a passive "check the threshold" is obeyed
only when it was not needed.

**The first harvest is due at four refined pairs** — `_recommendation-ledger.md` → `REC-170`'s own count
over the same evidence set, and it is sequenced behind that row. **Standing after that, a category is
due when it recurs in two different pairs since the last harvest.** Cross-pair is the whole qualifier:
five occurrences inside one pair are that note's quirk; two pairs is an invariant.

**A harvest writes at most one rule into `_note-quality-standard.md` and is licensed to cut one** the
harvested pairs never needed. The standard is otherwise a file that only grows.

**A due category opens its own `REC-NNN`** and is resolved under the ledger's four steps with the
mandatory cold reviewer — **never by a skill, never by a run**. The standard is hand-written only
(`_session-rules.md` → "Who writes a standard or a shared contract"). The threshold is what keeps this
sink out of the refill loop the ledger's preamble forbids: evidence is promoted by the count, never by
arrival.

| ID | Date | Pair | Lang | Category | Count | Quote | Verdict | Rule | Disposition |
|---|---|---|---|---|---|---|---|---|---|
| NTH-0001 | 2026-09-02 | java/junior/01 | es | ejemplo-innecesario | 2 | NO ME GUSTA MUCHO ESTE EJEMPLO EN ESTE MOMENTO DEL PARRAFO / QUITA EL EJEMPLO … PORQUE YA SE HA NOMBRADO ARRIBA | missing | — | open |
| NTH-0002 | 2026-09-04 | java/junior/01 | es | frase-sobrecargada | 30 | ES MALISIMA, MUY MAL EXPRESADA / PODRIA ESTAR UN POCO MAS CLARA / NO ME GUSTA LA FRASE "y cada uno pertenece al capítulo que tiene el vocabulario para explicarlo" / MUY MAL EXPRESADO LO DE QUE ES UN OBJETO SIQUIERA / MUY MALA FRASE EN ESPAÑOL ("En código de aplicación") / NI LA ESCALA QUE USAR, NO LO NECESITAN / DONDE ELEGIMOS LA ESCALA Y REDONDEO EN CASO DE QUERER IMPLEMENTARLO EN ALGUNO DE LOS OTROS TRES METODOS / MUY MAL EXPRESADO. ENTIENDO QUE A PARTIR DE .5 SE REDONDEA AL SUPERIOR Y POR DEBAJO DE .5 AL INFERIOR / AL NUMERO PAR MAS CERCANO / Y ESO PUEDE RESULTAR EN UNA APROXIMACION POR EXCESO O POR DEFECTO / ALMACENA VALORES EN EL MAPA … O GUARDA PARES CLAVE-VALOR EN EL MAPA / RECUPERA PARES CLAVE->VALOR BUSCANDO POR SU CLAVE / TAMBIEN AFECTA EN EL COMPORTAMIENTO DEL PUT / QUE POR EL MISMO MOTIVO / EN COMPARETO NO IMPORTA LA ESCALA / EL SEGUNDO PUT SOBRE UNA CLAVE QUE YA EXISTE LO QUE HACE ES SUSTITUIR LA QUE YA EXISTIA POR EL NUEVO PUT / LA FRASE NO ME GUSTA "Todo camino posible del código tiene que asignar la variable antes de que nada la lea" / COMENZARIAN VALIENDO LOS VALORES QUE TUVIERA ALMACENADO EL OBJETO ANTERIOR / VIVE MIENTRAS EL OBJETO VIVA / QUE RELLENA QUIEN LLAMA AL METODO / MEJORA LA REDACCION DE ESTE PARRAFO / NO ME GUSTA "y cómo entra en ellos el valor de quien llama" / NO ENTIENDO "y una revisión de código en una consultora te va a señalar los nombres cortos" / COGE DOS NUMEROS Y EL RESTULTADO ES OTRO NUMERO | unapplied | `_note-quality-standard.md` → `Sentence-level register` | open |
| NTH-0003 | 2026-09-04 | java/junior/01 | es | floritura-literaria | 18 | ES UNA MALA EXPRESION / TAMPOCO HACE FALTA QUE NOMBRES QUE ES LO QUE TE ENSEÑAN EN EL COLEGIO / LOS MAPAS SE VEN EN... / NO ME GUSTA LO DE LOS GOBIERNAN / NO ME GUSTA "deshacer aquí un atajo fácil" / "se lleva" ELIMINA / NO ME GUSTA "no es una optimización que puede o no darse: es una garantía escrita en el lenguaje" / NO ME GUSTA "El patrón que vas a escribir cien veces es una comprobación de null haciendo guardia" / NO ME GUSTA "y la guarda no vale nada" / EL ORDEN DE LOS OPERANDOS ALTERA EL RESULTADO / NO ME GUSTA "un revisor va a leer un `&` suelto … como una errata" / NO ME GUSTA "Entre dos enteros los mismos dos símbolos significan algo completamente distinto" / SE USA TAN POCO QUE LA REGLA GENERAL ES ESCRIBIR... | unapplied | `_note-quality-standard.md` → `Sentence-level register` (cut the literary flourish) | open |
| NTH-0004 | 2026-09-02 | java/junior/01 | es | metafora-en-vez-de-termino | 5 | CON ESO DE LAS CAJAS … SE ENTIENDE MAL / EMPIEZAS HABLANDO DE LAS CAJAS Y ESO NO ME GUSTA / EL ESPACION EN LA MEMORIA, NO ME GUSTA LAS ANALOGIAS CON CAJAS | missing | — | open |
| NTH-0005 | 2026-09-04 | java/junior/01 | es | termino-sin-presentar | 22 | UN FLAG??? / NO ENTIENDO LA FRASE "la cláusula de guarda a la entrada de un método" / NO USES "EL CALLOUT" / IMAGINO QUE QUEDA MEJOR "LA SECCION ANTERIOR" / NO SE LO QUE ES SOBRECARGA DE OPERADORES / ES LANZAR UNA EXCEPCION, LANZAR O MANEJAR YN ERROR / NO HEMOS VISTO EN NINGUN LADO LO QUE ES UN HASHMAP / DEBES HACER UNA BREVISIMA INTRODUCCION A LO QUE ES UN HASHMAP Y TREEMAP / IMAGIN QUE ESTOS DOS MAPAS SON MUY USADOS EN JAVA / UN SLOT ERA UN LUGAR EN LA MEMORIA / EXPLICA BREVEMENTE LO QUE ES EL RECOLECTOR DE BASURA / STACK FRAME DEL METODO? / TRUTHY Y FALSY / ESO SE LLAMA ASIGNACION COMPUESTA? / NO ENTIENDO "es el desliz clásico de la familia C" / NO ENTIENDO "IntelliJ lo marca como una inspección" / COMO SE LLAMA ESE OPERADOR (&&) / COMO SE LLAMA ESE OPERADOR (||) / NO ENTIENDO ESO DE OPERAR BIT A BIT | unapplied | `_note-quality-standard.md` → `Sentence-level register` | open |
| NTH-0006 | 2026-09-02 | java/junior/01 | es | ejemplo-sin-senalar | 3 | ESTO ES OTRO EJEMPLO, PERO DEBES INDICARLO | missing | — | open |
| NTH-0007 | 2026-09-04 | java/junior/01 | es | referencia-ambigua | 30 | UNO DE ELLOS? UN OBJETO? UN BIT? / CUENTA LOS CHAR QUE TIENE UN STRING / PORQUE YO ENTIENDO QUE AQUI SE REFIERE EN REALIDAD A LOS METODOS QU SE USAN REALMENTE PARA COMAPARAR STRING / EN LOS EJEMPLOS DE ABAJO? TE REFIERES A LOS EJEMPLOS MAS ABAJO DE ESTE ARCHIVO? / ESA DIRECCION ESTA PERMITIDA / EN LUGAR DEL NUMERO REDONDEADO / DE CREAR VALORES QUE ALMACENAN DINERO / QUE SECCION DEL DINERO / COMPARA DOS BIGDECIMAL / POR ESO ESTOS METODOS / QUE EL DINERO LO GUARDE EN BIGDECIMAL Y LO COMPARE CON COMPARETO / ANTES DE GUARDARLA EN EL MAPA / SU ORDEN IMAGINO QUE SU COMPARETO / PIERDO LA ENTRADA EN EL TREEMAP / UN CAMPO DE UN OBJETO / LAS VARIABLES QUE SE DECLARAN DENTRO DE LA CLASE / DONDE VIVE CADA UNO? CADA QUE? / SE EXPLICITO. NO DIGAS CADA UNO / DENTRO DEL BLOQUE DE MEMORIA / POR EJEMPLO LA DEL STRING PARA EL NAME / ANTES DE ENTREGARME MI OBJETO NUEVO … QUE ES EL OBJETO USER / EL VIEJO VAR DE JAVASCRIPT / NO ME GUSTA "y Spring en sí mismo depende de la tercera" / PORQUE UN INT HASTA QUE VALOR LLEGABA / PONMELO TAMBIEN EN NOTACION CIENTIFICA | missing | — | open |
| NTH-0008 | 2026-09-04 | java/junior/01 | es | mecanismo | 33 | MUY MUY MAL EXPLICADO / NO ENTIENDO NADA DE "Para los siete tipos numéricos, ambas cosas coinciden…" / NO ENTIENDO: porque la multiplicación se ejecuta en `int` antes de que se considere siquiera la asignación / NO ENTIENDO "así que una clase nunca puede enseñarle a `<` a funcionar sobre ella" / COMO REDONDEAR Y LA ESCALA QUE USAR EN EL RESULTADO. MULTIPLY ADD SUBTRACT TIENE UN ARGUMENTOS MIENTRAS QUE DIVIDE RECIBE SIEMPRE 3 ARGUMENTOS / EL HALF_EVEN NO HE ENTENDIDO LA EXPLICACION / NO ME QUEDA MUY CLARO … NO SE LO QUE PASA SI NO ES MEDIO EXACTO Y ES 0.1253 Y SELECCIONA SCALE 2 / NO ENTIENDO NADA DE "nunca pregunta qué comparación preferirías: llama a `equals` y a `hashCode` sobre la propia clave, y ambos incluyen la escala" / ES DECIR, TE REFIERES A GUARDAR PARES CLAVES-VALOR Y USAR UN BIGDECIMAL COMO CLAVE … REALMENTE ESO ME AFECTA EL EL GET PORQUE INTERNAMENTE USA ESOS METODOS / AFECTA EN EL COMPORTAMIENTO QUE ESPERARIAMOS AL USAR EL GET / PORQUE INTERNAMENTE USA EQUALS Y HASCODE PARA REALIZAR OLA BUSQUEDA DE LA CLAVE, Y AL USAR ESTOS METODOS SE TIENE EN CUENTA LA ESCALA / PORQUE PARA EQUALS SON DOS... / AQUI IMAGINO QUE TE REFIERES A QUE ESOS DOS METODOS SI USAN COMPARETO … PARA ESTOS METODOS ESOS DOS NUMEROS SON LOS MIMSOS / NO LO ENTIENDO PORQUE SE SUPONE QUE ESOS DOS METODOS SIRVEN PARA ORDENAR / PARA UN JUNIOR SE PUEDE EXPLICAR MAS CLARO … Y LUEGO ME REPORTA ESTE ERROR EL SORTEDMAP Y SORTEDSET / NO ENTIENDO "su orden natural y su `equals` no opinan lo mismo" / ENTIENDO QUE EL COMPARETO Y EL EQUALS SE APLICA EN MOMENTOS DISTINTO. O COMA SABEN QUE SON DISTINOT / ME CONFUNDE PORQUE UN CAMPO QUE SEA PRIMITIVO NO VIVIA SU OBJETO EN EL HEAP / NO ENTIENDO LO DE QUE LO PONE A CERO / LOS CAMPOS SON BYTES DENTRO DE ESE OBJETO / NO ENTIENDO " Y ese bloque llega reciclado" / EXPLICA "la JVM no estrena memoria cada vez" / ES DECIR EL RECOLECTOS DE BASURA DEJA LIBRE ESOS BYTES Y PARA ELLO PONE A CERO TODOS LOS BITS? / POR QUE ES NARROWING SI SON MISMOS BITS | unapplied | `_note-quality-standard.md` → `Anticipate-the-TODO pass` (mechanism before behaviour) | open |
| NTH-0009 | 2026-09-04 | java/junior/01 | es | tabla-sin-uso-real | 6 | ME GUSTARIA UNA COLUMNA QUE PUSIERA EL USO HABITUAL / CREO QUE SI A ES FALSE A && B ES FALSE SIN IMPORTAR LO QUE SEA B … (tabla de verdad) / SI A ES FALSE Y B ES FALSE A || B … / PREFIERO DOS TABLAS SEPARADAS / ESO ES EL CORTOCIERTUITO. CUANDO SE VA A USAR ESTO? (x2) | missing | — | open |
| NTH-0010 | 2026-09-02 | java/junior/01 | es | termino-traducido-no-usado | 5 | EN VEZ DE USAR PILA … ME GUSTA USAR LA PALABRA STACK / PREFIERO QUE PONGAS HEAP / INDICA ENTRE PARENTESIS COMO SE LLAMA EN INGLES ESA CLAUSULA DE GUARDA | missing | — | open |
| NTH-0011 | 2026-09-02 | java/junior/01 | es | metafora-en-vez-de-termino | 1 | LO DE UNO DENTRO DE OTRO NO LO ENTIENDO | unapplied | `_note-quality-standard.md` → `Anticipate-the-TODO pass` (mechanism before behaviour) | open |
| NTH-0012 | 2026-09-04 | java/junior/01 | es | codigo-no-a-la-vista | 12 | ME GUSTARIA VER EL CODIGO JUSTO ENCIMA DEL PARRAFO PARA TENERLO A LA VISTA / PARA VER BIEN LO DE THIS Y OTHER … PONER THIS.COMPARETO(NEW BIGDECIMAL()) COMO EJEMPLO / TAMPOCO ME HAS PUESTO NADA EN EL CODIGO PARA YO PODER VERLO / EXPLICA CON CODIGO BREVEMENTE POR QUE PERDERIA UNA ENTRADA / ME GUSTARIA QUE AÑADIERAS TAMBIEN EEL EJEMPLO CON HASHMAP Y ASI VEO LA DIFERENCIA DE LAS DOS / PODRIAS AÑADIR LA FORMA CORRECTA DE HACER EL CAST Y ASI LO VEO / PREFIERO QUE PONGAS EL ERROR REAL CON NULLPOINTEREXCEPTION / PODRIAS INDICAR LOS BITS DE CADA TIPO PARA VERLO MEJOR / INDICA SIEMPRE LOS BITS DE CADA TIPO PARA VERLO BIEN (x2) | missing | — | open |
| NTH-0013 | 2026-09-02 | java/junior/01 | es | ejemplo-no-coincide-con-la-frase | 2 | IMAGINO QUE TE REFIERES A CUANDO TENGAMOS ESTO / NO LE VEO SENTIDO CUANDO EN EL CODIGO ME HAS PUESTO … CON ESCALA 4, CUANDO LOS DOS OPERANDOS TIENEN ESCALA 2 | missing | — | open |
| NTH-0014 | 2026-09-04 | java/junior/01 | es | repeticion-de-lo-ya-dicho | 3 | ESTA FRASE YA APARECIA … QUE LO TENEMOS MAS ARRIBA, NO HACE FALTA REPETIRLO EN ESTE PARRAFO / NO ME PONGAS ESAS DOS LINEAS DE "- `A && B` … `A || B`" | missing | — | open |
| NTH-0015 | 2026-09-02 | java/junior/01 | es | seccion-sin-entradilla | 4 | AQUI PUEDES INDICAR EN UNA BREVE FRASE QUE MAS ARRIBA YA VIMOS LOS TIPOS (EN UNA TABLA) Y QUE AHORA VAS A EXPLICAR … LOS TIPOS QUE NOS VAMOS A ENCONTRAR … EN EL DIA A DIA / AQUI SE PUEDE DECIR QUE LA SIGUIENTE OPCION ES ... / TODAS LAS CONSTANTES QUE OFRECE ROUNDING MODE ESTAN EN LA SIGUIENTE TABLA | missing | — | open |
| NTH-0016 | 2026-09-04 | java/junior/01 | es | afirmacion-absoluta-imprecisa | 4 | SIEMPRE NO CREO … te refieres a los literales numericos enteros / NO ES UN COCIENTE CON INFINITOS DIGITOS, SINO QUE EL RESULTADO PUEDE TENER INFINITOS DIGITOS / TODA CLASE DE UN SERVICIO DE SPRING? | missing | — | open |
| NTH-0017 | 2026-09-02 | java/junior/01 | es | lead-in-contradice-contenido | 1 | SI ES DE JAVA PURA NO ME DIGAS EN EL TITULO DEL PARRAFO "DINERO EN SPRING BOOT" PORQUE ME LIAS | missing | — | open |
| NTH-0018 | 2026-09-02 | java/junior/01 | es | ejemplo-poco-concreto | 2 | LOS EJEMPLOS … NO ME HAN GUSTADO / Y 0.124 SE QUEDA 0.12 | missing | — | open |
| NTH-0019 | 2026-09-04 | java/junior/01 | es | salida-sin-leer | 2 | AQUI NOMBRA QUE LA PRIMERA LINEA NOS DICE EL TIPO DE ERROR / ANTES ACABABA EN 7 Y AHORA EN 6 | missing | — | open |
| NTH-0020 | 2026-09-04 | java/junior/01 | es | enumeracion-incompleta | 3 | NOMBRAS HALF-UP Y HALF-EVEN PERO NO SE SI HAY UN HALF-DOWN O ALGO ASI … O SI NO SE USA / Y LOS OBJETOS AL HEAP / PERO FLOAT A INT Y DOUBLE A LONG NO HAY PERDIDA | missing | — | open |
| NTH-0021 | 2026-09-04 | java/junior/01 | es | lead-in-metafora | 5 | NO ENTIENDO ESTE TITULO, ES REALMENTE MALO / LA COMPARACION LA HACE INTERNAMENTE EL HASMAP USANDO INTERNAMENTE LOS METODOS EQUALS Y HASHCODE / NO ME GUSTA "`+=` esconde un cast, y eso es la definición del lenguaje, no una rareza" / NO ME GUSTA "pueden no mirar jamás su operando derecho" / NO ME GUSTA "y luego combinan las dos respuestas" | unapplied | `_note-quality-standard.md` → `Sentence-level register` | open |
| NTH-0022 | 2026-09-04 | java/junior/01 | es | consecuencia-abstracta | 10 | PORQUE SI HAGO GET(1.0) Y GET(1.00) SON DOS CLAVES DISTINTA / LO SUSTITUYE PORQUE TREEMAP USA COMPARETO / AÑADE PORQUE USA EQUAL / PORQUE CONTENDRIA LOS VALORES DEL OBJETO ANTERIOR / NO ENTIENDO "no lo hace quien libera, sino quien reserva" / POR LO QUE FALLARIA EN TIEMPO COMPILACION / PORQUE COMO ACTIVE ESTA ASIGNADO SIEMPRE A TRUE SEIMPRE SE EJECUTA / NO ENTIENDO "la forma corta no tiene ningún `=` que perder" / Y POR LO TANTO CREAR EL BUG … EVITAR EL OPERADOR IGUALDAD EN CONDICIONALES CON VARIABLES BOOLEANAS / NO ENTIENDO "poner trabajo con efectos secundarios dentro del operando derecho es una fuente fiable de bugs" | unapplied | `_note-quality-standard.md` → `Anticipate-the-TODO pass` | open |
| NTH-0023 | 2026-09-04 | java/junior/01 | es | explicacion-recargada | 6 | LO HAS VUELVO A PONER COMPLICADO / PODRIAS EXPLICAR ESTE PARRAFO DE FORMA MUY SENCILLA / EL RESUMEN DE ESTE PARRAFO ES QUE HAHMPA Y TREEMAP SON DOS ESTRUCUTRAS QUE ALMACENAN PARES CLAVE-VALOR / NECESITO MAS CLARIDAD EN "Lo que `final` _no_ hace — congelar el objeto al que apunta una referencia — es una afirmación sobre objetos y no sobre valores" / EXPLICA MEJOR EL "la especificación define `a += b` como `a = (T) (a + b)`" / PODRIAMOS DECIR SIMPLEMENTE QUE HACER ESO ES UN ERROR CLASICO | unapplied | `_note-quality-standard.md` → `Sentence-level register` | open |
| NTH-0024 | 2026-09-04 | java/junior/01 | es | referencia-adelantada | 1 | NO ME GUSTA "por qué `equals` y `hashCode` deciden lo que un mapa encuentra se explica en" | unapplied | `_note-quality-standard.md` → `Sentence-level register` | open |
| NTH-0025 | 2026-09-04 | java/junior/01 | es | redaccion-propia-a-validar | 1 | HE MODIFICADO EL TITULO A MANO Y CREO QUE ME GUSTA, PERO NO SE SI ES CORRECTO LO QUE HE ESCRITO | missing | — | open |
| NTH-0026 | 2026-09-04 | java/junior/01 | es | traduccion-forzada | 1 | VERBOSO ES QUE HAY QUE ESCRIBIR MUCHO, PERO NO CREO QUE SEA UNA BUENA TRADUCCION | missing | — | open |
