# Minimum Coverage — JavaScript

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects, not a textbook definition.

## Types, equality, and coercion
- Primitive types (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) vs reference types (objects, arrays, functions) — primitives are compared by value; objects are compared by reference; interviewers test this with `{} === {}` (false) or ask why two arrays with the same content are not equal
- `typeof` — returns the type as a string; the classic gotcha: `typeof null === 'object'` is a historical bug that was never fixed; every interviewer knows this and some will ask about it explicitly to test depth of knowledge
- `typeof` vs `instanceof` — `typeof` checks the primitive type; `instanceof` checks if a value was created by a specific class or constructor; use `instanceof` in `catch` blocks to distinguish error types; `typeof null` is wrong for null-checking — use `value === null`
- `==` vs `===` — loose equality performs type coercion before comparing; strict equality checks value AND type; always use `===`; the one valid exception is `value == null`, which catches both `null` and `undefined` in one check without coercing other values
- Truthy vs falsy — the 6 falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`; everything else is truthy; interviewers test edge cases: `[]` and `{}` are truthy; `'0'` is truthy; `0` is falsy
- `null` vs `undefined` — `null` is intentional absence of a value, set by the developer; `undefined` means a variable was declared but never assigned, set automatically by JavaScript; asked in almost every first JavaScript interview
- Implicit type coercion — `'5' + 3` is `'53'` (string concatenation) but `'5' - 3` is `2` (numeric subtraction); the `+` operator triggers concatenation when either operand is a string; interviewers show arithmetic expressions with mixed types to test whether the candidate can predict the result

## Numbers
- `NaN === NaN` is `false` — `NaN` is the only value in JavaScript that is not equal to itself; interviewers ask this directly to test whether you actually understand `NaN` or just know the name
- `Number.isNaN()` vs global `isNaN()` — `isNaN()` coerces its argument to a number first, so `isNaN('hello')` is `true`; `Number.isNaN()` does not coerce, so `Number.isNaN('hello')` is `false`; the safe choice is always `Number.isNaN()`; a confusable pair tested in junior screenings
- The floating point problem — `0.1 + 0.2 !== 0.3` because binary floating point cannot represent most decimals exactly; interviewers ask "why would this fail in a money calculation?" and expect `toFixed()` for display or integer cents for calculation as the answer
- `parseInt()` vs `Number()` — `parseInt('42px')` returns `42` (stops at the first non-numeric character); `Number('42px')` returns `NaN` (rejects anything that is not a clean number); interviewers ask which to use when parsing a value like `'100px'` from a CSS string
- `toFixed(n)` — rounds to `n` decimal places and returns a **string**, not a number; forgetting the return type causes a bug when the result is used in further arithmetic without converting back; used to format prices in TimeTrack-style apps

## Variables and scope
- `var` vs `let` vs `const` — `var` is function-scoped and hoisted as `undefined`; `let` and `const` are block-scoped; use `const` by default; use `let` only when reassignment is needed; `var` is avoided in all modern code; tested in every screening
- Hoisting — `var` declarations are moved to the top of their scope and initialised as `undefined`; function declarations are fully hoisted and can be called before their line; function expressions (including arrow functions assigned to variables) are not fully hoisted; interviewers ask "what does this code output?" with code that calls a function before it is defined
- Temporal Dead Zone (TDZ) — `let` and `const` are hoisted but not initialised; accessing them before the declaration line throws a `ReferenceError`; interviewers ask this to distinguish candidates who understand `let` deeply from those who just know to avoid `var`
- Closures — a function that retains access to variables from its outer scope even after the outer function has returned; appears in Angular `computed()`, event handlers, and services with private state; interviewers ask "what is a closure and give me a real example?"

## Functions and `this`
- Function declarations vs expressions vs arrow functions — declarations are hoisted; arrow functions are expressions and are not hoisted; the key choice in practice is declaration vs arrow, not declaration vs expression
- `this` in regular functions — refers to the caller at runtime; in a standalone function call it is `undefined` (strict mode) or `window` (non-strict); the most common source of `this` bugs when a class method is passed as a callback without binding
- Arrow functions and `this` — arrow functions inherit `this` from the surrounding scope at definition time; they have no own `this`; this is why Angular uses arrow functions in class properties and callbacks — the component's `this` is always available
- `bind`, `call`, `apply` — explicitly set `this` on a function; `bind` returns a new function; `call` and `apply` invoke it immediately (the difference is how arguments are passed); interviewers show older Angular or JavaScript code with these and ask what they do
- Default parameters and rest parameters — `function f(role = 'employee')` reduces overloads; `...args` collects remaining arguments into an array; interviewers ask how a default parameter differs from `|| 'default'` inside the function body (the `||` version incorrectly treats `0` and `''` as missing)
- Higher-order functions — functions that take or return other functions; the foundation of `map`, `filter`, and every RxJS operator; interviewers ask "what is a higher-order function?" and expect a real example from array methods or Angular pipes

## Classes
- Class syntax — `constructor`, methods, and `this` as the instance; every Angular component, service, pipe, and guard is a class; interviewers ask how JavaScript classes relate to prototypes — classes are syntactic sugar, the underlying mechanism is still the prototype chain
- Private fields `#` — `#salary` is enforced at runtime by the JavaScript engine; TypeScript's `private` keyword is compile-time only and is erased in the compiled output; interviewers ask the difference when discussing Angular services with internal state that should not be accessible from outside
- Getters and setters — `get salary()` / `set salary(value)` control how a property is read and written without changing the call syntax; used to add validation logic or computed formatting; Angular signals use a similar getter-like access pattern
- Static methods and properties — belong to the class itself, not to instances; called as `ClassName.method()` without `new`; used in Angular for utility methods and configuration objects that should not depend on instance state
- `extends` and `super` — `extends` inherits from a parent class; `super()` must be called before using `this` in the child constructor; `super.method()` calls the parent method; interviewers ask what happens if you forget `super()` (it throws a `ReferenceError`)

## Arrays
- `map` — transforms every element and returns a new array of the same length; does not mutate the original; most common use: converting API response objects to view models; interviewers expect this as the default tool for transformation
- `filter` — returns a new array containing only elements that pass the test; always returns an array (never `undefined`); used for filtering lists by status, role, or search term
- `reduce` — accumulates all elements into one value: a number, an object, a string, or another array; signature: `reduce(callback, initialValue)`; used for totals and grouping by category; interviewers ask the signature and expect a working example
- `find` vs `filter` — `find` returns the first matching element or `undefined`; `filter` always returns an array; interviewers show both and ask which to use when looking up a user by id (answer: `find`)
- `findIndex`, `some`, `every`, `includes` — searching without a loop; interviewers ask "which method would you use to check if any task is overdue?" (answer: `some`); "check if a role exists in an array?" (answer: `includes`)
- `forEach` vs `map` — `forEach` returns `undefined` and is only for side effects; `map` returns a new array and is for transformation; using `forEach` and pushing results into a new array instead of using `map` is a classic junior mistake
- `sort` mutation — `sort` modifies the original array in place; the default sort is lexicographic, which breaks numbers (`[10, 9, 2].sort()` gives `[10, 2, 9]`); to sort numbers correctly: `.sort((a, b) => a - b)`; to sort without mutating: `[...arr].sort(...)`
- Method chaining — `filter().map().sort()` — each method receives the output of the previous one; the pattern behind Angular `computed(() => tasks().filter(...).map(...))` signals; interviewers show a chained pipeline and ask what each step produces

## Objects and JSON
- Object literals, shorthand properties, computed keys — `{ name }` instead of `{ name: name }`; `{ [key]: value }` for dynamic keys; interviewers expect shorthand as natural everyday syntax, not something that needs explaining
- Object destructuring — `const { name, role } = user`; rename with `{ name: userName }`; default value with `{ city = 'Madrid' }`; destructuring in function parameters `function display({ name, role })`; used constantly in Angular to unpack API responses and component inputs
- Array destructuring — `const [first, second] = items`; skip elements with `[, , third]`; swap variables with `[a, b] = [b, a]`; used when consuming tuple-like return values
- Spread in objects — `{ ...obj, key: newValue }` creates a shallow copy with overrides; the shallow copy is the most important detail — nested objects are still references, not new copies; used for immutable state updates in Angular signals (`employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))`)
- `Object.keys`, `Object.values`, `Object.entries` — iterate over an object's properties as arrays; `Object.entries` is most useful because it gives key-value pairs; `Object.fromEntries` converts them back; interviewers ask which to use when you need both key and value in the loop body
- `Object.assign` vs spread — both merge objects; `Object.assign` mutates the target object; spread creates a new object; prefer spread in modern code; both produce a shallow copy
- `Object.freeze` — makes an object's top-level properties immutable; useful for configuration constants; shallow — nested objects inside a frozen object are still mutable
- `JSON.stringify` / `JSON.parse` — convert between JavaScript objects and JSON strings; `JSON.stringify` silently drops `undefined` values and functions; `JSON.parse` throws `SyntaxError` on invalid input and must be wrapped in `try/catch`; used in the Angular localStorage pattern for persisting signal state

## Strings and regular expressions
- String immutability — strings cannot be changed in place; every method returns a new string; `str[0] = 'x'` does nothing silently; a common source of confusion when coming from a mutable mindset
- Template literals — backtick strings with `${}` interpolation; support multiline without `\n`; any expression can go inside `${}`; interviewers expect template literals as the default over string concatenation
- Search methods: `includes`, `startsWith`, `endsWith`, `indexOf` — boolean checks for presence and position; `indexOf` returns -1 if not found; used in search filtering (check if a name includes the search term) and URL parsing
- Transformation methods: `slice`, `split`, `trim`, `replace`, `toLowerCase`, `toUpperCase` — `split` converts a string into an array; `trim` removes leading/trailing whitespace; `replace` replaces the first match by default; interviewers may ask how to split a CSV string into an array
- Regex pattern syntax — `/pattern/flags`; common flags: `i` (case insensitive), `g` (global — find all matches, not just the first); interviewers expect you to know what the `g` flag does and what happens without it
- `.test(str)` — returns a boolean; used in `Validators.pattern()` for Angular form validation and in conditional logic ("is this a valid email format?")
- `.match(regex)` and `str.replace(regex, replacement)` — `match` returns the matching parts as an array; `replace` with the `g` flag replaces all occurrences; without `g` only the first match is replaced — a common source of bugs

## Sets and Maps
- `Set` — collection of unique values; duplicates are automatically ignored; order is preserved; `has()` is O(1) while `Array.includes()` is O(n) — the performance difference is the reason to choose Set over Array for large collections
- Deduplication pattern: `[...new Set(array)]` — the most common Set use case; interviewers ask "how would you remove duplicates from an array?" — this is the expected modern answer
- `Map` — key-value collection where keys can be any type, not just strings; insertion order is guaranteed; `.size` built in; used when the key is a non-string value such as an object, a number, or an enum
- `Map` vs plain object — plain objects accept only string and Symbol keys; Maps accept any type as key; Maps are better for frequent add and delete operations; plain objects are better for fixed data shapes like DTOs and configuration
- `Set` vs `Array` — use Set when uniqueness matters or when you need fast `has()` lookups; use Array when index access or method chaining (map/filter) is needed; use `[...new Set(arr)]` to convert back to an array

## Async JavaScript
- Callbacks — the original async pattern; callback hell is deeply nested callbacks that handle sequential operations; Promises and `async`/`await` were introduced specifically to solve this readability and error-handling problem
- Promises: `then`, `catch`, `finally` — `then` runs on resolve; `catch` runs on reject; `finally` always runs regardless of outcome; interviewers ask when to use `finally` vs putting cleanup code after the `try/catch`
- `Promise.all` — runs multiple promises in parallel; resolves when ALL finish; rejects immediately if ANY fails; use when all data is required before rendering; the RxJS equivalent in Angular is `forkJoin`
- `Promise.allSettled` vs `Promise.all` — `allSettled` never rejects; it waits for all promises and returns each result with `{ status: 'fulfilled' | 'rejected', value | reason }`; use when some requests can fail independently without aborting the rest
- `async` / `await` — syntactic sugar over Promises; makes async code read like synchronous code; `await` can only be used inside an `async` function; an `async` function always returns a Promise even if it returns a plain value
- Sequential vs parallel `await` — `const a = await f(); const b = await g()` is sequential (waits one at a time); `const [a, b] = await Promise.all([f(), g()])` is parallel; interviewers ask about the performance difference when both requests are independent
- Event loop — JavaScript is single-threaded; microtasks (Promise callbacks) run before macrotasks (setTimeout); `Promise.then()` runs before `setTimeout` even at 0ms delay; explains why long synchronous code blocks the UI even if it calls no async functions
- Promise vs Observable in Angular — Promises emit one value and start immediately; Observables are lazy (start on subscribe), can emit multiple values, and can be cancelled with `takeUntilDestroyed()`; `firstValueFrom()` converts an Observable to a Promise; interviewers ask why Angular's `HttpClient` returns Observables instead of Promises

## Modules
- Named exports vs default export — Angular uses only named exports; named exports are safer to refactor because editors auto-rename them; default exports let the importer choose any name, which makes automated refactoring unreliable
- `import { name as alias }` and `import * as namespace` — renaming to avoid naming conflicts; namespace import bundles all exports into one object; used when consuming libraries that export many things at once
- Barrel pattern — an `index.ts` file that re-exports everything from a folder so imports stay clean; `import { X, Y } from './feature'` instead of long relative paths; common in large Angular feature modules
- Dynamic imports and lazy loading — `import('./module').then(m => m.Class)` loads code only when needed; Angular uses this in `loadComponent:` routing to reduce the initial bundle size; interviewers ask how lazy loading works and why it matters for app startup performance
- Tree-shaking — the bundler (esbuild) removes exported code that is never imported anywhere; only works reliably with named exports; one of the reasons Angular convention forbids default exports

## Error handling
- `try` / `catch` / `finally` — `try` is the code that might throw; `catch` receives the error object; `finally` always runs for cleanup (hide a spinner, close a connection); interviewers ask when to use `finally` vs putting code after the `try/catch` block (answer: `finally` guarantees execution even if `catch` also throws)
- `Error` object: `message`, `name`, `stack` — `stack` shows the full call chain that led to the error; essential for debugging production bugs; `name` distinguishes error types before `instanceof` is possible
- Custom error classes — extending `Error` to create `ValidationError`, `HttpError`, etc.; lets you use `instanceof` in `catch` to handle different error types differently; interviewers ask how to distinguish a network error from a validation error without checking arbitrary properties
- Silently swallowing errors — catching an error and doing nothing is the most common junior mistake; the caller has no idea the operation failed; always either handle fully (show a message) or re-throw with `throw error`
- Error handling with `async`/`await` — `try/catch` catches both synchronous errors and rejected Promises inside an `async` function; the correct pattern for Angular services that call `firstValueFrom()` or `fetch()`

## Loops and iteration
- Classic `for` loop — `for (let i = 0; i < arr.length; i++)`; still the right tool when you need the index itself or must skip/step irregularly; interviewers ask why most modern code prefers `for...of` or array methods over this form (less error-prone — no off-by-one risk on the condition or increment)
- `for...of` vs `for...in` — `for...of` iterates the values of any iterable (arrays, strings, Sets, Maps); `for...in` iterates the string keys of an object; using `for...in` on an array is a classic bug — it gives `'0'`, `'1'`, `'2'` as strings, not the array values
- When to use a loop vs array methods — `map`, `filter`, `reduce` are preferred for data transformation; `for...of` is the right choice when you need early exit with `break` or when the loop body contains `await`; `forEach` cannot `break` and returns `undefined`
- `break` and `continue` — `break` exits the loop immediately; `continue` skips the rest of the current iteration; the main reason to choose `for...of` over `forEach` when early exit is needed
- `while` loop — repeats while a condition is true; use when the number of iterations is not known in advance (polling for a result, retrying an operation, reading paginated data)
- `while` vs `do...while` — `while` checks the condition before the first run and may execute zero times; `do...while` runs the body once before checking, guaranteeing at least one execution; interviewers ask for a real case where `do...while` is the right choice (e.g. show a menu at least once, then repeat while the user wants to continue)

## DOM events
- Event bubbling — a click on a child element also triggers click handlers on every ancestor element up to the document root; interviewers show a card with a button inside, both with click handlers, and ask why both fire
- `stopPropagation()` — prevents the event from travelling further up the DOM tree; used when a button inside a card should not also trigger the card's own click handler; requires passing `$event` in the Angular template with `(click)="handler($event)"`
- `preventDefault()` — cancels the browser's default behaviour for that element: form submission and page reload, link navigation, checkbox toggle; used in Angular form submits and custom `<a>` link overrides
- `stopPropagation` vs `preventDefault` — independent methods; `stopPropagation` controls where the event travels in the DOM; `preventDefault` controls what the browser does after the event; interviewers show a form submit and ask which one prevents the page reload

## Modern syntax (ES6+)
- Optional chaining `?.` — safely accesses a nested property that might be `null` or `undefined` without throwing; `user?.address?.city` returns `undefined` instead of a `TypeError`; used in Angular templates and services when API data may be partially missing
- Nullish coalescing `??` vs `||` — `??` falls back only when the left side is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`; interviewers test this with a count or price field where `0` is a valid value that should not be replaced by a default
- Logical assignment: `||=`, `&&=`, `??=` — shorthand for conditional assignment; `a ??= 'default'` assigns only if `a` is `null` or `undefined`; interviewers may show these to test whether the candidate can read modern JavaScript they did not write
- Debouncing concept — delaying a function call until after a rapid burst of events stops; used in Angular with RxJS `debounceTime()` on search inputs to avoid sending a request on every keystroke; interviewers ask "why are you using `debounceTime`?" — the expected answer is "to wait until the user stops typing before sending the API request"
