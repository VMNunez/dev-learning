# Junior Coverage — JavaScript

JavaScript language knowledge required to read, write, debug, and review ordinary frontend and full-stack code without importing Angular-, TypeScript-, or platform-level ownership.

## Runtime values, types, and conversion

- JavaScript vs TypeScript runtime guarantees — TypeScript checks and erases types before execution, so JavaScript still receives unchecked runtime values
- Primitive values vs objects — primitives behave as immutable values, while objects, arrays, and functions are reference-bearing mutable objects
- `typeof` and its edge cases — inspect broad runtime categories while recognising `typeof null === "object"` and that arrays require a separate check
- `Array.isArray` vs `typeof` — identify arrays explicitly because `typeof` reports them as objects
- `typeof` vs `instanceof` — choose primitive-category inspection or prototype-chain membership according to the question being asked
- `null` vs `undefined` — distinguish intentional absence from missing or uninitialised values without assuming every API uses them consistently
- Truthy and falsy values — predict conditional behaviour for zero, empty strings, `NaN`, `null`, and `undefined`, while recognising that empty arrays and objects are truthy ✅ 01-todo-list
- Explicit conversion with `Boolean`, `Number`, and `String` — convert at input boundaries deliberately instead of relying on surprising operator coercion
- `+` operator: numeric addition vs string concatenation — predict coercion and left-to-right evaluation when either operand becomes a string instead of assuming arithmetic
- `==` vs `===` — use strict equality by default and read loose-equality coercion safely in maintained legacy code
- `||` vs `??` — preserve valid `0`, `false`, and empty-string values by using nullish fallback when only absence should trigger a default
- Optional chaining forms — use `obj?.prop`, `obj?.[key]`, and `fn?.()` to stop property access or calls only for `null` or `undefined`
- Logical short-circuiting — use `&&`, `||`, and `??` with awareness that skipped operands do not execute ✅ 01-todo-list
- Logical operators return operand values — predict that `&&`, `||`, and `??` yield one of their operands rather than a coerced boolean while still short-circuiting evaluation
- Logical assignment operators — read `||=`, `&&=`, and `??=` as conditional assignment without confusing their different trigger conditions

## Numbers and strings

- `NaN` and `Number.isNaN` — detect failed numeric results without the coercion performed by the global `isNaN`
- Numeric parsing vs conversion — choose `parseInt` or `parseFloat` for an accepted numeric prefix and `Number` for a wholly numeric input
- Floating-point precision — avoid exact decimal assumptions and represent money with an appropriate integer or decimal strategy
- Safe integers and `Infinity` — recognise when ordinary `number` arithmetic no longer represents integer results reliably or becomes non-finite
- `toFixed` return type — format decimal places while remembering that the result is a string, not a number
- String immutability — treat every string transformation as producing a new value
- Template literals — interpolate expressions and multiline text without fragile concatenation
- String search — choose `includes`, `startsWith`, `endsWith`, or `indexOf` according to whether a boolean or position is needed
- `slice` vs `substring` — extract a range while accounting for negative indexes and reversed arguments
- String splitting and trimming — turn delimited text into parts and remove surrounding whitespace without mutating the source ✅ 01-todo-list
- String case conversion and replacement — normalise case or replace one or all matches according to the operation's semantics
- Unicode code-unit recognition — know that string length and indexing can split some visible characters and avoid character-count assumptions
- Basic regular expressions — read and write simple search or validation patterns with common flags and choose among `test`, `match`, and `replace`

## Variables, scope, and control flow

- `var` vs `let` vs `const` — prefer block-scoped declarations, default to `const`, and recognise function-scoped `var` in maintained code ✅ 01-todo-list
- Rebinding vs mutation — understand that `const` prevents assigning a different binding but does not freeze an object
- Lexical scope and shadowing — resolve a name from its nearest enclosing scope and avoid hiding an outer binding accidentally
- Hoisting — predict the different pre-declaration behaviour of function declarations, `var`, and lexical declarations
- Temporal Dead Zone — recognise why reading a `let` or `const` binding before its declaration throws
- Conditionals and early returns — express branching clearly and reduce nesting when an early exit makes control flow easier to follow
- `switch` semantics — use explicit cases and breaks while recognising fall-through when reading existing code ✅ 01-todo-list
- Classic `for` loop — use explicit initialisation, condition, and update when index or irregular stepping control is required
- `while` vs `do...while` — choose whether the condition must be checked before the first iteration or after one guaranteed execution
- `break` vs `continue` — exit a loop or skip only its current iteration without obscuring the control flow

## Functions, closures, and `this`

- Function declarations vs function expressions — choose and read them with awareness of their different hoisting behaviour
- Arrow functions vs regular functions — choose concise lexical capture or a function with its own dynamic `this` and `arguments` ✅ 01-todo-list
- Function parameters and return values — handle missing and extra arguments deliberately and recognise that a function without `return` yields `undefined`
- Default parameters — apply a fallback only when the supplied argument is `undefined`
- Rest parameters — collect remaining arguments into a real array without relying on the legacy `arguments` object
- First-class and higher-order functions — pass, store, return, and compose functions as ordinary values ✅ 01-todo-list
- Callbacks — follow control flow when another function decides when and with which arguments a callback runs ✅ 01-todo-list
- Closures — explain how a function retains access to its lexical environment and how captured mutable state changes over time
- Regular-function `this` — determine `this` from the call site rather than the function's definition location
- Arrow-function `this` — recognise lexical capture and avoid using arrows where a method needs a dynamic receiver
- Lost method context — diagnose a method extracted or passed as a callback whose original receiver is no longer present
- `bind` vs `call` vs `apply` — recognise creating a bound function versus invoking immediately with an explicit receiver
- Pure transformations vs side effects — separate deterministic data work from I/O, DOM mutation, timers, and shared-state changes when practical

## Objects, prototypes, and copying

- Object literals and property access — use shorthand, computed keys, and dot or bracket notation according to whether a key is static or dynamic ✅ 01-todo-list
- Object destructuring — bind, rename, and default selected properties while remembering defaults apply only to `undefined`
- Property existence vs an `undefined` value — distinguish `Object.hasOwn`, legacy `hasOwnProperty`, the `in` operator, and a property read when inherited or explicitly undefined properties matter
- Own vs inherited properties — avoid treating prototype-chain members as an object's own input data
- `Object.keys`, `Object.values`, and `Object.entries` — enumerate own enumerable string-keyed properties in the form the operation needs
- `Object.fromEntries` — rebuild an object from transformed key-value pairs
- Object spread vs `Object.assign` — create a shallow merged object or mutate an explicit target deliberately ✅ 01-todo-list
- Reference identity and aliasing — predict how two variables can observe mutations to the same object ✅ 01-todo-list
- Shallow vs deep copying — recognise that spread and `Object.assign` retain nested references and use `structuredClone` only for supported data
- `Object.freeze` depth — prevent top-level writes without assuming nested objects become immutable
- Prototype delegation — understand that property lookup can continue through an object's prototype chain
- Class construction and instance methods — read `constructor` and instance behaviour as class syntax built on prototype delegation
- Class inheritance — use `extends` and `super` while recognising that JavaScript still delegates through prototypes
- Static vs instance members — access class-level behaviour through the constructor and per-instance behaviour through its prototype
- `new` and constructor-function mechanics — recognise how `new` creates an object, links its prototype, binds `this`, and handles an explicit object return when reading class or legacy constructor code
- JSON text vs JavaScript values — distinguish a serialized interchange string from the runtime object produced by parsing it
- `JSON.stringify` and `JSON.parse` boundaries — account for unsupported values during serialization and invalid text throwing during parsing

## Arrays and iteration

- Array destructuring — bind positions, skip entries, use defaults, and collect remaining elements
- Array spread — create a shallow array copy or combine iterables without implying a deep clone ✅ 01-todo-list
- Mutating vs non-mutating array methods — recognise when an operation changes the original collection and when it returns a new one ✅ 01-todo-list
- `slice` vs `splice` on arrays — choose non-mutating range extraction or in-place removal, replacement, and insertion without confusing their return values or mutation effects
- `map` — transform each present element into a result array without using it merely for side effects ✅ 01-todo-list
- `filter` — retain all matching elements and always return an array ✅ 01-todo-list
- `find` vs `filter` — choose one matching value or every matching value
- `some` vs `every` — express existential or universal checks with short-circuiting
- `includes`, `findIndex`, and indexed access — choose membership, matching-position, or known-position lookup
- `forEach` vs `map` — choose side-effect iteration or value transformation without expecting `forEach` to return results
- `reduce` — accumulate a collection with an explicit initial value when it improves clarity rather than hiding a simpler operation
- Array sorting — provide an appropriate comparator and account for `sort` mutating the array
- Method chaining — trace the intermediate type and value produced at every stage of a transformation pipeline
- `for...of` vs `for...in` — iterate iterable values or enumerable property keys without using object-key iteration accidentally on arrays
- Array methods vs explicit loops — prefer declarative transformations, but use a loop when early exit, irregular stepping, or awaited sequential work is clearer
- `Set` vs `Array` — choose uniqueness and membership lookup or ordered indexed collection behaviour
- `Map` vs plain object — choose arbitrary key types and collection APIs or string-keyed record-like data

## Asynchronous JavaScript

- Promise states and settlement — distinguish pending, fulfilled, and rejected outcomes and understand that a promise settles only once
- Promise creation vs observation — know that `then` and combinators observe work represented by promises rather than making JavaScript parallel
- Promise executor timing — predict that the executor passed to `new Promise` runs synchronously while settlement reactions registered with `then`, `catch`, or `finally` run as microtasks
- Promise chaining and returned values — return values or promises from handlers so the next link receives the intended result
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
- Call stack, tasks, and microtasks — predict run-to-completion and why promise reactions run before later timer tasks
- Long synchronous work and responsiveness — understand that blocking the call stack delays rendering, events, timers, and promise reactions
- `AbortController` recognition — signal abort to supported operations that observe its signal and distinguish intentional aborts from ordinary failures

## Modules and maintained code

- Named vs default exports — choose stable explicit names or a single conventional module value and import each form correctly
- Static imports and module scope — avoid accidental globals and rely on statically analysable dependencies
- Import aliases and namespace imports — resolve naming collisions and consume a module as a namespace when appropriate
- Dynamic imports — load a module on demand while handling the returned promise and keeping framework-specific lazy loading elsewhere
- Legacy JavaScript recognition — read `var`, callback-heavy code, constructor functions, prototype methods, and handler patterns without making obsolete libraries a study target

## Browser events and resources

- DOM selection and update recognition — inspect and modify ordinary elements while preferring framework rendering in Angular-owned code
- Event listeners and the event object — read event type, target/current target, and handler registration without confusing browser events with Angular APIs
- Event bubbling and capture — predict the propagation path and choose delegation or a direct listener deliberately
- `stopPropagation` vs `preventDefault` — control event travel or the browser's default action as independent decisions
- Event delegation — handle repeated or dynamic descendants through a stable ancestor when the propagation model makes it suitable
- Listener, timer, and resource cleanup — remove registrations and cancel scheduled work when their owner no longer needs them
- `setTimeout` and `setInterval` — treat delays as minimum scheduling thresholds and cancel repeated or obsolete callbacks
- Date parsing and time-zone hazards — avoid assuming ambiguous date strings or local/UTC conversions mean the same instant

## Errors and runtime boundaries

- `Error` objects — preserve useful message, cause, name, and stack context when creating or wrapping a failure
- Custom error classes — extend `Error` to express domain-specific failure categories that callers can distinguish without inspecting message text
- `throw` control flow — stop normal execution with a meaningful error value that the correct boundary can handle
- `try`, `catch`, and `finally` — handle only what the current boundary can resolve, clean up reliably, and never swallow an error silently
- Synchronous throws vs promise rejections — trace failures through the correct call-stack or asynchronous observation path
- Fetch settlement mechanics — recognise that the promise rejects for request failures but fulfils with a response for HTTP status outcomes
- Runtime data enforcement — check untrusted parsed data before relying on its shape because compile-time annotations do not exist at runtime

## Debugging and performance

- Breakpoints and stepping — pause execution and follow the actual control path instead of guessing from source alone
- Watches, console inspection, and stack traces — inspect changing values and reconstruct the call path that produced a failure
- Network and async inspection — correlate requests and scheduled work with the code that initiated them
- Debounce vs throttle — choose quiet-period execution or a maximum execution rate for bursty events without treating RxJS operators as JavaScript
- Basic performance diagnosis — measure before changing code and avoid repeated expensive work in hot loops or handlers without entering engine-level tuning
- AI-generated JavaScript review — check runtime inputs, coercion, mutation, async completion, cleanup, error propagation, and observable behaviour before accepting generated code
