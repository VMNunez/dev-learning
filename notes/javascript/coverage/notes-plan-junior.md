# JavaScript Junior Notes Plan

Plan status: stale
Coverage: notes/javascript/coverage/junior.md
Coverage SHA-256: 41e619395ad4a9873da4950eac567eae1db2709eb2c74e7ad7620b0e7b6448da
Generated: 2026-07-29

## 00 — Introduction to JavaScript

Status: pending
Action: create
English: notes/javascript/junior/en/00-introduction-javascript.md
Spanish: notes/javascript/junior/es/00-introduccion-javascript.md
Depends on: none
Pending additions: none

Narrative role: Build introduction to javascript after victor's existing frontend experience so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned introduction to javascript concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: none

Must answer:

- What practical browser and server work does JavaScript perform?
- Which runtime characteristics—dynamic unchecked values, prototype-linked objects, first-class functions, and event-loop scheduling—shape the language?
- What does TypeScript add before execution, and what do Angular and React still rely on JavaScript to do at runtime?
- Where does JavaScript fit in the Angular + Spring Boot target stack?
- What one-paragraph map previews every stage 01–21, explains the order, and orients without teaching later mechanisms?

Coverage concepts:

*(none — required junior topic introduction)*

Rationale: The contract names all five introduction invariants and requires previews without premature teaching.

Handoff: The unresolved need for runtime values, types, and conversion makes entry 01 the next step.

## 01 — Runtime values, types, and conversion

Status: pending
Action: audit
English: notes/javascript/junior/en/01-types-coercion.md
Spanish: notes/javascript/junior/es/01-tipos-coercion.md
Depends on: 00
Pending additions: none

Narrative role: Build runtime values, types, and conversion after introduction to javascript so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned runtime values, types, and conversion concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 00

Must answer:

- Which TypeScript guarantees disappear at runtime?
- How do primitives and reference-bearing objects differ?
- When do `typeof`, `Array.isArray`, and recognition-only `instanceof` differ, with mechanisms deferred to 09?
- Which operand do logical operators return or skip?
- Where does optional chaining stop?
- What triggers each logical assignment operator?

Coverage concepts:

- JavaScript vs TypeScript runtime guarantees — TypeScript checks and erases types before execution, so JavaScript still receives unchecked runtime values
- Primitive values vs objects — primitives behave as immutable values, while objects, arrays, and functions are reference-bearing mutable objects
- `typeof` and its edge cases — inspect broad runtime categories while recognising `typeof null === "object"` and that arrays require a separate check
- `Array.isArray` vs `typeof` — identify arrays explicitly because `typeof` reports them as objects
- `typeof` vs `instanceof` — choose primitive-category inspection or prototype-chain membership according to the question being asked
- `null` vs `undefined` — distinguish intentional absence from missing or uninitialised values without assuming every API uses them consistently
- Truthy and falsy values — predict conditional behaviour for zero, empty strings, `NaN`, `null`, and `undefined`, while recognising that empty arrays and objects are truthy
- Explicit conversion with `Boolean`, `Number`, and `String` — convert at input boundaries deliberately instead of relying on surprising operator coercion
- `+` operator: numeric addition vs string concatenation — predict coercion and left-to-right evaluation when either operand becomes a string instead of assuming arithmetic
- `==` vs `===` — use strict equality by default and read loose-equality coercion safely in maintained legacy code
- `||` vs `??` — preserve valid `0`, `false`, and empty-string values by using nullish fallback when only absence should trigger a default
- Optional chaining forms — use `obj?.prop`, `obj?.[key]`, and `fn?.()` to stop property access or calls only for `null` or `undefined`
- Logical short-circuiting — use `&&`, `||`, and `??` with awareness that skipped operands do not execute
- Logical operators return operand values — predict that `&&`, `||`, and `??` yield one of their operands rather than a coerced boolean while still short-circuiting evaluation
- Logical assignment operators — read `||=`, `&&=`, and `??=` as conditional assignment without confusing their different trigger conditions

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for bindings, lexical scope, and branching makes entry 02 the next step.

## 02 — Bindings, lexical scope, and branching

Status: pending
Action: audit
English: notes/javascript/junior/en/02-variables-scope.md
Spanish: notes/javascript/junior/es/02-variables-alcance.md
Depends on: 01
Pending additions: none

Narrative role: Build bindings, lexical scope, and branching after runtime values, types, and conversion so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned bindings, lexical scope, and branching concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 01

Must answer:

- Why can a const object mutate without rebinding?
- How does nearest lexical scope resolve shadowing?
- How do hoisting, usability, and the TDZ mechanism differ?
- When do early return and switch fall-through help or harm?

Coverage concepts:

- `var` vs `let` vs `const` — prefer block-scoped declarations, default to `const`, and recognise function-scoped `var` in maintained code
- Rebinding vs mutation — understand that `const` prevents assigning a different binding but does not freeze an object
- Lexical scope and shadowing — resolve a name from its nearest enclosing scope and avoid hiding an outer binding accidentally
- Hoisting — predict the different pre-declaration behaviour of function declarations, `var`, and lexical declarations
- Temporal Dead Zone — recognise why reading a `let` or `const` binding before its declaration throws
- Conditionals and early returns — express branching clearly and reduce nesting when an early exit makes control flow easier to follow
- `switch` semantics — use explicit cases and breaks while recognising fall-through when reading existing code

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for function values, parameters, callbacks, and closures makes entry 03 the next step.

## 03 — Function values, parameters, callbacks, and closures

Status: pending
Action: audit
English: notes/javascript/junior/en/03-functions.md
Spanish: notes/javascript/junior/es/03-funciones.md
Depends on: 02
Pending additions: none

Narrative role: Build function values, parameters, callbacks, and closures after bindings, lexical scope, and branching so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned function values, parameters, callbacks, and closures concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 02

Must answer:

- How do declarations and expressions differ before their source line?
- What happens with missing, extra, default, rest, and arrow `arguments`?
- How does callback control flow differ from direct calls?
- How does captured mutable state evolve?
- What separates transformation from side effect?

Coverage concepts:

- Function declarations vs function expressions — choose and read them with awareness of their different hoisting behaviour
- Function parameters and return values — handle missing and extra arguments deliberately and recognise that a function without `return` yields `undefined`
- Default parameters — apply a fallback only when the supplied argument is `undefined`
- Rest parameters — collect remaining arguments into a real array without relying on the legacy `arguments` object
- First-class and higher-order functions — pass, store, return, and compose functions as ordinary values
- Callbacks — follow control flow when another function decides when and with which arguments a callback runs
- Closures — explain how a function retains access to its lexical environment and how captured mutable state changes over time
- Pure transformations vs side effects — separate deterministic data work from I/O, DOM mutation, timers, and shared-state changes when practical

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for numbers and numeric boundaries makes entry 04 the next step.

## 04 — Numbers and numeric boundaries

Status: pending
Action: audit
English: notes/javascript/junior/en/04-numbers-math.md
Spanish: notes/javascript/junior/es/04-numeros-matematicas.md
Depends on: 03
Pending additions: none

Narrative role: Build numbers and numeric boundaries after function values, parameters, callbacks, and closures so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned numbers and numeric boundaries concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 03

Must answer:

- When use Number, parseInt, or parseFloat?
- Why does global isNaN coerce?
- Why can decimals and unsafe integers fail?
- When is a result non-finite?
- Why is toFixed text?

Coverage concepts:

- `NaN` and `Number.isNaN` — detect failed numeric results without the coercion performed by the global `isNaN`
- Numeric parsing vs conversion — choose `parseInt` or `parseFloat` for an accepted numeric prefix and `Number` for a wholly numeric input
- Floating-point precision — avoid exact decimal assumptions and represent money with an appropriate integer or decimal strategy
- Safe integers and `Infinity` — recognise when ordinary `number` arithmetic no longer represents integer results reliably or becomes non-finite
- `toFixed` return type — format decimal places while remembering that the result is a string, not a number

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for strings and unicode-aware text makes entry 05 the next step.

## 05 — Strings and Unicode-aware text

Status: pending
Action: audit
English: notes/javascript/junior/en/05-strings.md
Spanish: notes/javascript/junior/es/05-cadenas.md
Depends on: 04
Pending additions: none

Narrative role: Build strings and unicode-aware text after numbers and numeric boundaries so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned strings and unicode-aware text concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 04

Must answer:

- Why are strings immutable?
- When use boolean search or a position?
- How do slice and substring differ?
- How are one/all replacements selected?
- How can code units split visible characters?

Coverage concepts:

- String immutability — treat every string transformation as producing a new value
- Template literals — interpolate expressions and multiline text without fragile concatenation
- String search — choose `includes`, `startsWith`, `endsWith`, or `indexOf` according to whether a boolean or position is needed
- `slice` vs `substring` — extract a range while accounting for negative indexes and reversed arguments
- String splitting and trimming — turn delimited text into parts and remove surrounding whitespace without mutating the source
- String case conversion and replacement — normalise case or replace one or all matches according to the operation's semantics
- Unicode code-unit recognition — know that string length and indexing can split some visible characters and avoid character-count assumptions

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for basic regular expressions makes entry 06 the next step.

## 06 — Basic regular expressions

Status: pending
Action: audit
English: notes/javascript/junior/en/06-regex.md
Spanish: notes/javascript/junior/es/06-expresiones-regulares.md
Depends on: 05
Pending additions: none

Narrative role: Build basic regular expressions after strings and unicode-aware text so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned basic regular expressions concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 05

Must answer:

- How are tokens, classes, quantifiers, anchors, groups, and escaping read?
- What do common flags change?
- Which API tests, extracts, or replaces?
- When is a string method clearer?

Coverage concepts:

- Basic regular expressions — read and write simple search or validation patterns with common flags and choose among `test`, `match`, and `replace`

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for object properties, destructuring, and enumeration makes entry 07 the next step.

## 07 — Object properties, destructuring, and enumeration

Status: pending
Action: audit
English: notes/javascript/junior/en/07-objects-destructuring.md
Spanish: notes/javascript/junior/es/07-objetos-desestructuracion.md
Depends on: 06
Pending additions: none

Narrative role: Build object properties, destructuring, and enumeration after basic regular expressions so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned object properties, destructuring, and enumeration concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 06

Must answer:

- When fit shorthand, computed keys, dot, and bracket access?
- Why do destructuring defaults apply only to undefined?
- How do own checks, `in`, and reads differ, with prototypes deferred to 09?
- What shapes do keys, values, entries, and fromEntries use?

Coverage concepts:

- Object literals and property access — use shorthand, computed keys, and dot or bracket notation according to whether a key is static or dynamic
- Object destructuring — bind, rename, and default selected properties while remembering defaults apply only to `undefined`
- Property existence vs an `undefined` value — distinguish `Object.hasOwn`, legacy `hasOwnProperty`, the `in` operator, and a property read when inherited or explicitly undefined properties matter
- Own vs inherited properties — avoid treating prototype-chain members as an object's own input data
- `Object.keys`, `Object.values`, and `Object.entries` — enumerate own enumerable string-keyed properties in the form the operation needs
- `Object.fromEntries` — rebuild an object from transformed key-value pairs

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for object identity, copying, freezing, and json makes entry 08 the next step.

## 08 — Object identity, copying, freezing, and JSON

Status: pending
Action: create
English: notes/javascript/junior/en/08-object-copying-json.md
Spanish: notes/javascript/junior/es/08-copias-objetos-json.md
Depends on: 07
Pending additions: none

Narrative role: Build object identity, copying, freezing, and json after object properties, destructuring, and enumeration so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned object identity, copying, freezing, and json concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 07

Must answer:

- How do aliases share mutation?
- Which nested references survive shallow copies?
- When does Object.assign mutate its target?
- What can structuredClone reject?
- Why is freeze shallow?
- What does JSON omit, change, or reject?

Coverage concepts:

- Object spread vs `Object.assign` — create a shallow merged object or mutate an explicit target deliberately
- Reference identity and aliasing — predict how two variables can observe mutations to the same object
- Shallow vs deep copying — recognise that spread and `Object.assign` retain nested references and use `structuredClone` only for supported data
- `Object.freeze` depth — prevent top-level writes without assuming nested objects become immutable
- JSON text vs JavaScript values — distinguish a serialized interchange string from the runtime object produced by parsing it
- `JSON.stringify` and `JSON.parse` boundaries — account for unsupported values during serialization and invalid text throwing during parsing

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for prototypes, classes, construction, and `this` makes entry 09 the next step.

## 09 — Prototypes, classes, construction, and `this`

Status: pending
Action: audit
English: notes/javascript/junior/en/09-classes.md
Spanish: notes/javascript/junior/es/09-clases.md
Depends on: 08
Pending additions: none

Narrative role: Build prototypes, classes, construction, and `this` after object identity, copying, freezing, and json so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned prototypes, classes, construction, and `this` concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 08

Must answer:

- How does inherited lookup work?
- What does new do, including explicit object return?
- How do extends and super work?
- Where do static and instance members live?
- How do call sites and arrows determine this?
- Why does extraction lose a receiver?
- How do bind, call, and apply differ?

Coverage concepts:

- Arrow functions vs regular functions — choose concise lexical capture or a function with its own dynamic `this` and `arguments`
- Regular-function `this` — determine `this` from the call site rather than the function's definition location
- Arrow-function `this` — recognise lexical capture and avoid using arrows where a method needs a dynamic receiver
- Lost method context — diagnose a method extracted or passed as a callback whose original receiver is no longer present
- `bind` vs `call` vs `apply` — recognise creating a bound function versus invoking immediately with an explicit receiver
- Prototype delegation — understand that property lookup can continue through an object's prototype chain
- Class construction and instance methods — read `constructor` and instance behaviour as class syntax built on prototype delegation
- Class inheritance — use `extends` and `super` while recognising that JavaScript still delegates through prototypes
- Static vs instance members — access class-level behaviour through the constructor and per-instance behaviour through its prototype
- `new` and constructor-function mechanics — recognise how `new` creates an object, links its prototype, binds `this`, and handles an explicit object return when reading class or legacy constructor code

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for array structure, destructuring, and mutation makes entry 10 the next step.

## 10 — Array structure, destructuring, and mutation

Status: pending
Action: audit
English: notes/javascript/junior/en/10-array-methods.md
Spanish: notes/javascript/junior/es/10-metodos-arrays.md
Depends on: 09
Pending additions: none

Narrative role: Build array structure, destructuring, and mutation after prototypes, classes, construction, and `this` so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned array structure, destructuring, and mutation concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 09

Must answer:

- How do skipped positions, defaults, and rest work?
- Why is spread shallow?
- Which methods mutate?
- How do slice and splice differ?
- Why does numeric sort need a comparator and mutate?

Coverage concepts:

- Array destructuring — bind positions, skip entries, use defaults, and collect remaining elements
- Array spread — create a shallow array copy or combine iterables without implying a deep clone
- Mutating vs non-mutating array methods — recognise when an operation changes the original collection and when it returns a new one
- `slice` vs `splice` on arrays — choose non-mutating range extraction or in-place removal, replacement, and insertion without confusing their return values or mutation effects
- Array sorting — provide an appropriate comparator and account for `sort` mutating the array

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for array transformations, searches, and pipelines makes entry 11 the next step.

## 11 — Array transformations, searches, and pipelines

Status: pending
Action: create
English: notes/javascript/junior/en/11-array-transformations.md
Spanish: notes/javascript/junior/es/11-transformaciones-arrays.md
Depends on: 10
Pending additions: none

Narrative role: Build array transformations, searches, and pipelines after array structure, destructuring, and mutation so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned array transformations, searches, and pipelines concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 10

Must answer:

- What result shapes do map and filter guarantee?
- How do find, filter, findIndex, includes, some, and every differ on no match?
- Why is forEach for effects?
- Why give reduce an initial value?
- How is each chain stage traced?

Coverage concepts:

- `map` — transform each present element into a result array without using it merely for side effects
- `filter` — retain all matching elements and always return an array
- `find` vs `filter` — choose one matching value or every matching value
- `some` vs `every` — express existential or universal checks with short-circuiting
- `includes`, `findIndex`, and indexed access — choose membership, matching-position, or known-position lookup
- `forEach` vs `map` — choose side-effect iteration or value transformation without expecting `forEach` to return results
- `reduce` — accumulate a collection with an explicit initial value when it improves clarity rather than hiding a simpler operation
- Method chaining — trace the intermediate type and value produced at every stage of a transformation pipeline

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for explicit loops and iteration choices makes entry 12 the next step.

## 12 — Explicit loops and iteration choices

Status: pending
Action: audit
English: notes/javascript/junior/en/12-loops.md
Spanish: notes/javascript/junior/es/12-bucles.md
Depends on: 11
Pending additions: none

Narrative role: Build explicit loops and iteration choices after array transformations, searches, and pipelines so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned explicit loops and iteration choices concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 11

Must answer:

- When fit classic for, while, or do-while?
- How do break and continue alter flow?
- Why do for-of and for-in expose different things?
- When is a loop clearer than an array method?
- What sequential-await case is deferred to 16?

Coverage concepts:

- Classic `for` loop — use explicit initialisation, condition, and update when index or irregular stepping control is required
- `while` vs `do...while` — choose whether the condition must be checked before the first iteration or after one guaranteed execution
- `break` vs `continue` — exit a loop or skip only its current iteration without obscuring the control flow
- `for...of` vs `for...in` — iterate iterable values or enumerable property keys without using object-key iteration accidentally on arrays
- Array methods vs explicit loops — prefer declarative transformations, but use a loop when early exit, irregular stepping, or awaited sequential work is clearer

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for sets and maps makes entry 13 the next step.

## 13 — Sets and maps

Status: pending
Action: audit
English: notes/javascript/junior/en/13-sets-maps.md
Spanish: notes/javascript/junior/es/13-conjuntos-mapas.md
Depends on: 12
Pending additions: none

Narrative role: Build sets and maps after explicit loops and iteration choices so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned sets and maps concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 12

Must answer:

- When does uniqueness justify Set?
- When do arbitrary keys justify Map?
- How are Set and Map iterated and converted?

Coverage concepts:

- `Set` vs `Array` — choose uniqueness and membership lookup or ordered indexed collection behaviour
- `Map` vs plain object — choose arbitrary key types and collection APIs or string-keyed record-like data

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for synchronous errors and recovery boundaries makes entry 14 the next step.

## 14 — Synchronous errors and recovery boundaries

Status: pending
Action: audit
English: notes/javascript/junior/en/14-error-handling.md
Spanish: notes/javascript/junior/es/14-manejo-errores.md
Depends on: 13
Pending additions: none

Narrative role: Build synchronous errors and recovery boundaries after sets and maps so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned synchronous errors and recovery boundaries concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 13

Must answer:

- What do message, cause, name, and stack preserve?
- Why use custom error classes?
- How does throw alter flow?
- When can catch recover honestly or rethrow?
- Why use finally for cleanup?

Coverage concepts:

- `Error` objects — preserve useful message, cause, name, and stack context when creating or wrapping a failure
- Custom error classes — extend `Error` to express domain-specific failure categories that callers can distinguish without inspecting message text
- `throw` control flow — stop normal execution with a meaningful error value that the correct boundary can handle
- `try`, `catch`, and `finally` — handle only what the current boundary can resolve, clean up reliably, and never swallow an error silently

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for event loop and promise mechanics makes entry 15 the next step.

## 15 — Event loop and promise mechanics

Status: pending
Action: audit
English: notes/javascript/junior/en/15-async.md
Spanish: notes/javascript/junior/es/15-javascript-asincrono.md
Depends on: 14
Pending additions: none

Narrative role: Build event loop and promise mechanics after synchronous errors and recovery boundaries so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned event loop and promise mechanics concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 14

Must answer:

- What are promise states and single settlement?
- What starts work versus observes it?
- Why is the executor synchronous but reactions microtasks?
- How do handler returns form chains?
- What task/microtask order follows run-to-completion?
- Why does blocking delay rendering and queues?

Coverage concepts:

- Promise states and settlement — distinguish pending, fulfilled, and rejected outcomes and understand that a promise settles only once
- Promise creation vs observation — know that `then` and combinators observe work represented by promises rather than making JavaScript parallel
- Promise executor timing — predict that the executor passed to `new Promise` runs synchronously while settlement reactions registered with `then`, `catch`, or `finally` run as microtasks
- Promise chaining and returned values — return values or promises from handlers so the next link receives the intended result
- Call stack, tasks, and microtasks — predict run-to-completion and why promise reactions run before later timer tasks
- Long synchronous work and responsiveness — understand that blocking the call stack delays rendering, events, timers, and promise reactions

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for async functions, coordination, and cancellation makes entry 16 the next step.

## 16 — Async functions, coordination, and cancellation

Status: pending
Action: create
English: notes/javascript/junior/en/16-async-coordination.md
Spanish: notes/javascript/junior/es/16-coordinacion-asincrona.md
Depends on: 15
Pending additions: none

Narrative role: Build async functions, coordination, and cancellation after event loop and promise mechanics so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned async functions, coordination, and cancellation concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 15

Must answer:

- Why does every async function return a promise?
- When are awaits sequential or concurrent?
- How do all, allSettled, race, and any differ?
- How do missing await or return float work?
- Why does forEach not await callbacks?
- How does AbortController depend on observers?

Coverage concepts:

- Promise rejection propagation — understand when `catch` recovers, when rethrowing preserves failure, and why a missing returned chain becomes floating work
- `finally` semantics — perform cleanup without replacing the original outcome unless the callback itself throws or rejects
- `async` function return values — recognise that every `async` function returns a promise even when its source returns a plain value
- `await` and error propagation — suspend only the current async function and catch rejected awaited promises at the correct boundary
- Sequential vs concurrent awaits — serialize dependent operations and start independent operations before awaiting them together
- `Promise.all` failure behaviour — await all required independent results while accepting fail-fast rejection
- `Promise.allSettled` vs `Promise.all` — retain every outcome when independent failures should not discard successful results
- `Promise.race` vs `Promise.any` — choose the first settled outcome or the first fulfilled outcome and recognise aggregate rejection when every input rejects
- Missing `await` or `return` defects — diagnose callers that continue before work finishes or cannot observe a rejected promise
- Async callbacks in `forEach` — recognise that `forEach` does not await callback promises and choose an explicit sequential or concurrent pattern
- `AbortController` recognition — signal abort to supported operations that observe its signal and distinguish intentional aborts from ordinary failures

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for asynchronous failures and untrusted runtime data makes entry 17 the next step.

## 17 — Asynchronous failures and untrusted runtime data

Status: pending
Action: create
English: notes/javascript/junior/en/17-async-errors-runtime-data.md
Spanish: notes/javascript/junior/es/17-errores-asincronos-datos-runtime.md
Depends on: 16
Pending additions: none

Narrative role: Build asynchronous failures and untrusted runtime data after async functions, coordination, and cancellation so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned asynchronous failures and untrusted runtime data concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 16

Must answer:

- When does catch recover or rethrow?
- How do throws and rejections travel differently?
- Why can fetch fulfil for HTTP failure?
- Where is status converted into an error?
- Why validate parsed data despite TypeScript?

Coverage concepts:

- Synchronous throws vs promise rejections — trace failures through the correct call-stack or asynchronous observation path
- Fetch settlement mechanics — recognise that the promise rejects for request failures but fulfils with a response for HTTP status outcomes
- Runtime data enforcement — check untrusted parsed data before relying on its shape because compile-time annotations do not exist at runtime

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for modules and maintained code makes entry 18 the next step.

## 18 — Modules and maintained code

Status: pending
Action: audit
English: notes/javascript/junior/en/18-modules.md
Spanish: notes/javascript/junior/es/18-modulos.md
Depends on: 17
Pending additions: none

Narrative role: Build modules and maintained code after asynchronous failures and untrusted runtime data so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned modules and maintained code concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 17

Must answer:

- How do named and default exports differ?
- Why are static imports analyzable?
- When fit aliases, namespaces, and dynamic imports?
- Which legacy forms must juniors read?

Coverage concepts:

- Named vs default exports — choose stable explicit names or a single conventional module value and import each form correctly
- Static imports and module scope — avoid accidental globals and rely on statically analysable dependencies
- Import aliases and namespace imports — resolve naming collisions and consume a module as a namespace when appropriate
- Dynamic imports — load a module on demand while handling the returned promise and keeping framework-specific lazy loading elsewhere
- Legacy JavaScript recognition — read `var`, callback-heavy code, constructor functions, prototype methods, and handler patterns without making obsolete libraries a study target

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for dom events and delegation makes entry 19 the next step.

## 19 — DOM events and delegation

Status: pending
Action: audit
English: notes/javascript/junior/en/19-events.md
Spanish: notes/javascript/junior/es/19-eventos.md
Depends on: 18
Pending additions: none

Narrative role: Build dom events and delegation after modules and maintained code so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned dom events and delegation concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 18

Must answer:

- When should ordinary DOM selection/update be used outside Angular rendering?
- How do target and currentTarget differ?
- How do capture and bubbling route events?
- Why are propagation and default action independent?
- When does delegation fit?

Coverage concepts:

- DOM selection and update recognition — inspect and modify ordinary elements while preferring framework rendering in Angular-owned code
- Event listeners and the event object — read event type, target/current target, and handler registration without confusing browser events with Angular APIs
- Event bubbling and capture — predict the propagation path and choose delegation or a direct listener deliberately
- `stopPropagation` vs `preventDefault` — control event travel or the browser's default action as independent decisions
- Event delegation — handle repeated or dynamic descendants through a stable ancestor when the propagation model makes it suitable

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for timers, cleanup, and date boundaries makes entry 20 the next step.

## 20 — Timers, cleanup, and date boundaries

Status: pending
Action: create
English: notes/javascript/junior/en/20-browser-resources-dates.md
Spanish: notes/javascript/junior/es/20-recursos-navegador-fechas.md
Depends on: 19
Pending additions: none

Narrative role: Build timers, cleanup, and date boundaries after dom events and delegation so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned timers, cleanup, and date boundaries concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 19

Must answer:

- Who owns listener and timer cleanup?
- Why are delays only minimum thresholds?
- When must intervals be cancelled?
- How can parsing and local/UTC conversion change an instant?

Coverage concepts:

- Listener, timer, and resource cleanup — remove registrations and cancel scheduled work when their owner no longer needs them
- `setTimeout` and `setInterval` — treat delays as minimum scheduling thresholds and cancel repeated or obsolete callbacks
- Date parsing and time-zone hazards — avoid assuming ambiguous date strings or local/UTC conversions mean the same instant

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: The unresolved need for debugging, responsiveness, and code review makes entry 21 the next step.

## 21 — Debugging, responsiveness, and code review

Status: pending
Action: create
English: notes/javascript/junior/en/21-debugging-performance.md
Spanish: notes/javascript/junior/es/21-depuracion-rendimiento.md
Depends on: 20
Pending additions: none

Narrative role: Build debugging, responsiveness, and code review after timers, cleanup, and date boundaries so the route adds one coherent mental model at a time.

Learning outcome: Explain and apply the assigned debugging, responsiveness, and code review concepts, including their mechanism, boundaries, and observable behaviour.

Prerequisites: 20

Must answer:

- What diagnostic sequence uses breakpoints, stepping, watches, console, stacks, Network, and async traces?
- How do debounce and throttle differ?
- Why measure before optimizing?
- Which runtime, mutation, async, cleanup, and error checks gate generated code?

Coverage concepts:

- Breakpoints and stepping — pause execution and follow the actual control path instead of guessing from source alone
- Watches, console inspection, and stack traces — inspect changing values and reconstruct the call path that produced a failure
- Network and async inspection — correlate requests and scheduled work with the code that initiated them
- Debounce vs throttle — choose quiet-period execution or a maximum execution rate for bursty events without treating RxJS operators as JavaScript
- Basic performance diagnosis — measure before changing code and avoid repeated expensive work in hot loops or handlers without entering engine-level tuning
- AI-generated JavaScript review — check runtime inputs, coercion, mutation, async completion, cleanup, error propagation, and observable behaviour before accepting generated code

Rationale: The exact concepts support one teachable mental model at this route position.

Handoff: Closes the junior journey by applying every earlier mechanism to observable evidence.

## Unassigned existing notes

*(none)*
