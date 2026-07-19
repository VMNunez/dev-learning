# Minimum Coverage — JavaScript

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects, not a textbook definition.

## Types and equality
- Primitive types (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) vs reference types (objects, arrays, functions) — primitives are compared by value; objects are compared by reference; interviewers test this with `{} === {}` (false) or ask why two arrays with the same content are not equal
- `typeof` — returns the type as a string; the classic gotcha: `typeof null === 'object'` is a historical bug that was never fixed; every interviewer knows this and some will ask about it explicitly to test depth of knowledge
- `typeof` vs `instanceof` — `typeof` checks the primitive type; `instanceof` checks if a value was created by a specific class or constructor; use `instanceof` in `catch` blocks to distinguish error types; `typeof null` is wrong for null-checking — use `value === null`
- `==` vs `===` — loose equality performs type coercion before comparing; strict equality checks value AND type; always use `===`; the one valid exception is `value == null`, which catches both `null` and `undefined` in one check without coercing other values
- Truthy vs falsy — the 6 falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`; everything else is truthy; interviewers test edge cases: `[]` and `{}` are truthy; `'0'` is truthy; `0` is falsy
- `null` vs `undefined` — `null` is intentional absence of a value, set by the developer; `undefined` means a variable was declared but never assigned, set automatically by JavaScript; asked in almost every first JavaScript interview
- Boxing of primitives — `'abc'.length` works because the engine temporarily wraps the primitive in a `String` object and then discards it; this is also why assigning a property to a primitive silently does nothing (`let x = 'a'; x.foo = 1; x.foo` is `undefined`)

- `Array.isArray()` vs `typeof` — `typeof []` returns `'object'`, exactly like `typeof null`, so `typeof` cannot detect an array at all and `Array.isArray` is the only reliable check; interviewers ask "how do you know this is an array?" as the direct sibling of the `typeof null` gotcha
- Deep equality is not built in — `===` on two structurally identical objects is `false` because it compares references, and JavaScript ships no `deepEqual`; interviewers ask how you would compare two API payloads and expect the `JSON.stringify` shortcut *plus* its key-order caveat
- `Symbol` — a primitive guaranteed to be unique, invisible to `Object.keys` and `JSON.stringify`, and the mechanism behind well-known hooks like `Symbol.iterator`; interviewers ask what it is actually for once you have named it

---

## Coercion rules
- Implicit type coercion — `'5' + 3` is `'53'` (string concatenation) but `'5' - 3` is `2` (numeric subtraction); the `+` operator triggers concatenation when either operand is a string; interviewers show arithmetic expressions with mixed types to test whether the candidate can predict the result
- Left-to-right evaluation of `+` — `1 + 2 + '3'` is `'33'` but `'1' + 2 + 3` is `'123'`; the operator evaluates strictly left to right, so where the string appears in the chain changes the whole result; the single most reused output-prediction question
- Unary `+` vs binary `+` — `+'5'` converts a string to a number while `'5' + 5` concatenates; the same symbol runs two different algorithms depending on how many operands it has; interviewers mix both into one expression
- The abstract equality algorithm — the fixed coercion steps `==` applies: `null` and `undefined` equal only each other; a number vs a string coerces the string to a number; a boolean is coerced to a number *first*, which is why `[] == false` and `'0' == false` are both `true`; interviewers hand over a table of comparisons and ask which are true
- `ToPrimitive` — how an object becomes a primitive in `+` and `==`: `valueOf` is tried first in an arithmetic context, `toString` in a string context; the mechanism behind every "weird JavaScript" puzzle rather than a list of memorised results
- Array-to-string coercion — `[]` becomes `''` and `[1, 2]` becomes `'1,2'` via `join`, which is why `[] + []` is `''` and `[1] == 1` is `true`; usually the punchline of a coercion quickfire
- Which operations produce `NaN` — `'a' * 2`, `undefined + 1` and `0/0` give `NaN`, while `1/0` gives `Infinity`; a candidate who only memorised `NaN !== NaN` fails the prediction question

## Numbers
- `NaN === NaN` is `false` — `NaN` is the only value in JavaScript that is not equal to itself; interviewers ask this directly to test whether you actually understand `NaN` or just know the name
- `Number.isNaN()` vs global `isNaN()` — `isNaN()` coerces its argument to a number first, so `isNaN('hello')` is `true`; `Number.isNaN()` does not coerce, so `Number.isNaN('hello')` is `false`; the safe choice is always `Number.isNaN()`; a confusable pair tested in junior screenings
- The floating point problem — `0.1 + 0.2 !== 0.3` because binary floating point cannot represent most decimals exactly; interviewers ask "why would this fail in a money calculation?" and expect `toFixed()` for display or integer cents for calculation as the answer
- `parseInt()` vs `Number()` — `parseInt('42px')` returns `42` (stops at the first non-numeric character); `Number('42px')` returns `NaN` (rejects anything that is not a clean number); interviewers ask which to use when parsing a value like `'100px'` from a CSS string
- `toFixed(n)` — rounds to `n` decimal places and returns a **string**, not a number; forgetting the return type causes a bug when the result is used in further arithmetic without converting back; used to format prices in TimeTrack-style apps
- `toFixed` rounds the binary value, not the decimal one — `(1.005).toFixed(2)` gives `'1.00'` because `1.005` is really stored as slightly less than `1.005`; interviewers show a money total that lost a cent and ask where it went

- `Number.MAX_SAFE_INTEGER` and `BigInt` — JavaScript numbers are doubles, so an integer above 2^53 loses precision the instant `JSON.parse` reads it; a Java `Long` id from a Spring Boot API is exactly this case, and the fix is serialising it as a string; interviewers on a full-stack round ask why an id came back subtly wrong

---

## Variables and scope
- `var` vs `let` vs `const` — `var` is function-scoped and hoisted as `undefined`; `let` and `const` are block-scoped; use `const` by default; use `let` only when reassignment is needed; `var` is avoided in all modern code; tested in every screening
- Hoisting — `var` declarations are moved to the top of their scope and initialised as `undefined`; function declarations are fully hoisted and can be called before their line; function expressions (including arrow functions assigned to variables) are not fully hoisted; interviewers ask "what does this code output?" with code that calls a function before it is defined
- Function declarations are hoisted above `var` of the same name — the identifier holds the function until the assignment line runs and overwrites it; interviewers print the same name before and after that line to see whether hoisting is understood as an order, not a slogan
- Temporal Dead Zone (TDZ) — `let` and `const` are hoisted but not initialised; accessing them before the declaration line throws a `ReferenceError`; interviewers ask this to distinguish candidates who understand `let` deeply from those who just know to avoid `var`
- Shadowing — an inner declaration hides an outer one of the same name for the whole inner block; combined with the TDZ, reading the name before the inner `let` throws instead of falling back to the outer variable
- Closures — a function that retains access to variables from its outer scope even after the outer function has returned; appears in Angular `computed()`, event handlers, and services with private state; interviewers ask "what is a closure and give me a real example?"
- Closures over a loop variable — `var` in a `for` loop shares one binding, so every deferred callback sees the final value; `let` creates a fresh binding per iteration; the canonical `for (var i…) setTimeout(() => console.log(i))` printing `3 3 3` instead of `0 1 2`
- IIFE — an immediately invoked function expression creates a private scope on the spot; the pre-`let` fix for the loop-closure problem and still the thing to recognise when a screening shows legacy code

- Strict mode — ES modules and class bodies are strict automatically, which is why an undeclared assignment throws instead of quietly creating a global and why `this` is `undefined` rather than `window` in a detached method; interviewers ask what changed between an old `<script>` and a module
- What a closure costs — a listener, interval, or callback holds its entire enclosing scope alive, so an uncleaned handler keeps a whole component's data out of the garbage collector's reach; interviewers ask what a closure costs, not merely what it is, and this is the mechanism behind every "why must I unsubscribe?" answer

---

## Functions and parameters
- Function declarations vs expressions vs arrow functions — declarations are hoisted; arrow functions are expressions and are not hoisted; the key choice in practice is declaration vs arrow, not declaration vs expression
- Arrow implicit return vs block body — `x => ({ ...x })` returns the object, `x => { ...x }` returns `undefined` because a block body needs an explicit `return`; the top cause of a `map` that produces `[undefined, undefined, undefined]`
- Default parameters and rest parameters — `function f(role = 'employee')` reduces overloads; `...args` collects remaining arguments into an array; interviewers ask how a default parameter differs from `|| 'default'` inside the function body (the `||` version incorrectly treats `0` and `''` as missing)
- Higher-order functions — functions that take or return other functions; the foundation of `map`, `filter`, and every RxJS operator; interviewers ask "what is a higher-order function?" and expect a real example from array methods or Angular pipes
- Callbacks receive more arguments than you think — `['1','2','3'].map(parseInt)` returns `[1, NaN, NaN]` because `map` passes the index as `parseInt`'s radix; the canonical "what is wrong with this line?" snippet, and the reason to wrap in `x => parseInt(x, 10)`
- The `arguments` object — array-like but not an array, and absent inside arrow functions; interviewers show a legacy function using `arguments` and ask why it breaks when rewritten as an arrow
- Guard clauses vs nested `if` — returning early on the invalid cases keeps the happy path at one indent level; one of the most common live refactor requests in a code-review round
- Options object vs positional parameters — beyond two or three parameters, and for any boolean flag, named properties read better and let the signature grow without breaking call sites; `save(user, true)` is the classic "improve this signature" prompt

## `this` and function references
- `this` in regular functions — refers to the caller at runtime; in a standalone function call it is `undefined` (strict mode) or `window` (non-strict); the most common source of `this` bugs when a class method is passed as a callback without binding
- Arrow functions and `this` — arrow functions inherit `this` from the surrounding scope at definition time; they have no own `this`; this is why Angular uses arrow functions in class properties and callbacks — the component's `this` is always available
- `this` binding precedence — the fixed resolution order (`new` > explicit `bind`/`call`/`apply` > method call on an object > default); knowing the order answers every "what is `this` here?" puzzle instead of memorising individual cases
- Losing `this` on detachment — `const f = obj.method; f()` and `arr.map(this.format)` both lose the receiver because `this` is decided at the call site, not where the function was written; the fix is an arrow wrapper or `bind`; reviewers show the broken line verbatim
- `bind`, `call`, `apply` — explicitly set `this` on a function; `bind` returns a new function; `call` and `apply` invoke it immediately (the difference is how arguments are passed); interviewers show older Angular or JavaScript code with these and ask what they do
- Function identity — every arrow function literal creates a new reference, so `removeEventListener` with a fresh arrow never removes the original listener and two "identical" callbacks are never `===`; the mechanism behind listeners that will not detach

## Mutation, copying, and references
- `const` does not make an object immutable — it prevents rebinding the variable, not mutating its contents; `const user = {}` still allows `user.name = 'x'`; asked in almost every junior screening as a one-line trap
- Arguments are passed by value, but the value can be a reference — reassigning a parameter is invisible to the caller while mutating an object parameter changes the caller's object; interviewers show both side by side and ask what the caller sees after the call
- Shallow copy vs deep copy — spread and `Object.assign` copy only the first level, so a nested object stays shared and editing it through the "copy" corrupts the original; interviewers show an immutable-looking state update that is not one and ask why the source changed
- `structuredClone()` vs `JSON.parse(JSON.stringify(obj))` — the native deep-copy handles `Date`, `Map`, `Set` and cycles, while the JSON round-trip silently turns a `Date` into a string and drops `undefined` and functions; interviewers ask "how do you deep copy?" and expect the JSON trick's losses named
- Mutating vs non-mutating array methods — `push`, `pop`, `splice`, `sort`, `reverse`, `fill` mutate in place; `map`, `filter`, `slice`, `concat`, `toSorted`, `toReversed` return a new array; interviewers expect the mutating list from memory because those are what silently break Angular signal updates and shared state
- A non-mutating call whose result is discarded — `arr.map(...)` or `str.replace(...)` written as a bare statement does nothing at all; a construct that silently no-ops and a favourite plant in a review snippet
- Sharing one object reference across list items — pushing the same object N times means editing one row edits all of them; the cause of "why did every row change?"
- Pure functions and side effects — a function that only depends on its arguments and mutates nothing is trivially testable and safe to call twice; interviewers show two snippets and ask which is easier to unit test and why

## Arrays — searching and transforming
- `map` — transforms every element and returns a new array of the same length; does not mutate the original; most common use: converting API response objects to view models; interviewers expect this as the default tool for transformation
- `filter` — returns a new array containing only elements that pass the test; always returns an array (never `undefined`); used for filtering lists by status, role, or search term
- `reduce` — accumulates all elements into one value: a number, an object, a string, or another array; signature: `reduce(callback, initialValue)`; used for totals and grouping by category; interviewers ask the signature and expect a working example
- A `reduce` callback that does not return the accumulator — the accumulator becomes `undefined` on the second iteration and the whole reduction collapses; interviewers hide the missing `return` inside a grouping example
- `reduce` on an empty array with no initial value — throws `TypeError: Reduce of empty array with no initial value`; the concrete reason the initial value is not optional in real code
- `find` vs `filter` — `find` returns the first matching element or `undefined`; `filter` always returns an array; interviewers show both and ask which to use when looking up a user by id (answer: `find`)
- `findIndex`, `some`, `every`, `includes` — searching without a loop; interviewers ask "which method would you use to check if any task is overdue?" (answer: `some`); "check if a role exists in an array?" (answer: `includes`)
- `forEach` vs `map` — `forEach` returns `undefined` and is only for side effects; `map` returns a new array and is for transformation; using `forEach` and pushing results into a new array instead of using `map` is a classic junior mistake
- Method chaining — `filter().map().sort()` — each method receives the output of the previous one; the pattern behind Angular `computed(() => tasks().filter(...).map(...))` signals; interviewers show a chained pipeline and ask what each step produces
- The cost of chaining vs one loop — each `filter`/`map` walks the array again; interviewers ask whether that matters and the right answer at UI list sizes is no, favour readability and only fuse passes when profiling says so

- `flat` and `flatMap` — flatten a nested array one level (or `Infinity`) and map-then-flatten in a single pass; the expected answer to "give me one array of every task across all projects", where the naive version is a nested `map` producing an array of arrays
- `at(-1)` — reads from the end without `arr[arr.length - 1]`, and returns `undefined` rather than throwing on an empty array; a small but visible modern-syntax tell in a code review
- `Array.from` and spreading an iterable — the standard ways to turn a `NodeList`, a `Set`, or an array-like `{ length: n }` into a real array so the array methods become available; interviewers ask why `.map` is missing on a `querySelectorAll` result

---

## Arrays — ordering, mutation, and holes
- `sort` mutation — `sort` modifies the original array in place; the default sort is lexicographic, which breaks numbers (`[10, 9, 2].sort()` gives `[10, 2, 9]`); to sort numbers correctly: `.sort((a, b) => a - b)`; to sort without mutating: `[...arr].sort(...)`
- A comparator must return a number, not a boolean — `sort((a, b) => a > b)` is a real bug because the engine needs negative / zero / positive to order the pair; the result is engine-dependent and looks "almost sorted"
- Multi-key sorting with `||` — `sort((a, b) => a.status.localeCompare(b.status) || b.date - a.date)` falls through to the next key only when the previous comparison returns `0`; the standard tie-break idiom in a take-home
- `splice` vs `slice` — near-identical names and opposite behaviour: `splice` mutates and returns the removed elements, `slice` leaves the original alone and returns a copy; a confusable pair planted in review snippets
- Mutating an array while iterating it — removing items with `splice` inside a `forEach` or indexed `for` skips elements because the indices shift underneath the loop; the classic "one item always survives" bug, and the reason to build a new array with `filter`
- Sparse arrays and holes — `new Array(3)` and `[1, , 3]` contain holes that `map` and `forEach` skip entirely, while `for...of` and spread visit them as `undefined`; the answer to "why doesn't `new Array(3).map((_, i) => i)` work?" (use `Array.from({ length: 3 })`)
- `includes` vs `indexOf` for `NaN` — `[NaN].indexOf(NaN)` is `-1` because `indexOf` uses strict equality, while `includes` uses SameValueZero and finds it; interviewers plant a `NaN` lookup to see who knows why the search silently fails
- `length` is writable — `arr.length = 0` truncates the array in place and assigning past the end creates holes; a surprising piece of behaviour behind some legacy "clear the array" code

- `sort` is stable — equal elements keep their relative order, which is what makes "sort by date, then sort by project" a valid two-pass alternative to writing one multi-key comparator; interviewers ask whether the second sort can be trusted not to scramble the first

---

## Grouping and shaping API data
- Grouping with `reduce` into a lookup object — the canonical `reduce((acc, item) => { (acc[key] ??= []).push(item); return acc; }, {})` shape; the single most common live-coding task ("group these entries by project"), and interviewers watch for the returned accumulator and the supplied initial value
- `Object.groupBy` — the modern native replacement for the reduce-grouping idiom; interviewers ask whether you know it exists and what its browser and Node support implies before you reach for it in a real project
- Building a lookup map instead of a nested `find` — a `find()` inside a `map()` is accidentally O(n²); keying the second list into a `Map` by id first makes the join O(1) per item; interviewers show the nested version and ask what is wrong with it
- Joining two API responses client-side — merging `users` and `tasks` by `userId` into one view model; the step that follows the two parallel fetches in almost every take-home
- Spreading the accumulator vs mutating it in `reduce` — `{ ...acc, [k]: v }` rebuilds the whole object on every iteration and is O(n²), while `acc[k] = v; return acc` mutates an object nobody else owns and is the intended form; interviewers ask which one the code in front of them actually does
- Choosing an array or a keyed structure for the data shape — an array preserves order and maps directly onto a list render, a `Map`/object keyed by id gives O(1) lookup and update; interviewers ask how you would store a list you must both render in order and update by id

## Objects and JSON
- Object literals, shorthand properties, computed keys — `{ name }` instead of `{ name: name }`; `{ [key]: value }` for dynamic keys; interviewers expect shorthand as natural everyday syntax, not something that needs explaining
- Object destructuring — `const { name, role } = user`; rename with `{ name: userName }`; default value with `{ city = 'Madrid' }`; destructuring in function parameters `function display({ name, role })`; used constantly in Angular to unpack API responses and component inputs
- Array destructuring — `const [first, second] = items`; skip elements with `[, , third]`; swap variables with `[a, b] = [b, a]`; used when consuming tuple-like return values
- Spread in objects — `{ ...obj, key: newValue }` creates a shallow copy with overrides; used for immutable state updates in Angular signals (`employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))`)
- `Object.keys`, `Object.values`, `Object.entries` — iterate over an object's properties as arrays; `Object.entries` is most useful because it gives key-value pairs; `Object.fromEntries` converts them back; interviewers ask which to use when you need both key and value in the loop body
- Object keys are always strings — `obj[1]` and `obj['1']` are the same slot, and using an object as a key stores it under `'[object Object]'`; the concrete reason `Map` exists
- Property key ordering — integer-like keys come first in ascending numeric order, then string keys in insertion order; the reason `Object.keys({ b: 1, 2: 1, a: 1, 1: 1 })` puts the numbers first
- `Object.assign` vs spread — both merge objects; `Object.assign` mutates the target object; spread creates a new object; prefer spread in modern code; both produce a shallow copy
- `Object.freeze` — makes an object's top-level properties immutable; useful for configuration constants; shallow — nested objects inside a frozen object are still mutable
- `JSON.stringify` / `JSON.parse` — convert between JavaScript objects and JSON strings; `JSON.stringify` silently drops `undefined` values and functions; `JSON.parse` throws `SyntaxError` on invalid input and must be wrapped in `try/catch`; used in the Angular localStorage pattern for persisting signal state
- An absent property vs an explicit `null` in a payload — omitting a key and sending `null` are different on the wire and behave differently with default parameters and `??`; interviewers ask which one a `PATCH` should send to clear a field

- `Object.hasOwn(obj, key)` vs `obj.hasOwnProperty(key)` — the modern static form works on objects created with `Object.create(null)` and cannot be shadowed by a property literally named `hasOwnProperty`; it is the confusable pair behind the defensive `for...in` guard you will see in legacy code
- The second and third arguments of `JSON.stringify` — the replacer filters or transforms keys (stripping a password before logging) and the third argument pretty-prints with indentation; interviewers ask how you log a payload readably without dumping a secret into the console
- `toJSON` and why a `Date` round-trips as a string — `JSON.stringify` calls the object's `toJSON`, so a `Date` becomes an ISO string and `JSON.parse` has no way to know it should be a `Date` again; this is why a parsed object is never quite the object you serialised, and it is the same mechanism behind the Spring Boot `LocalDate` question
- `localStorage` and `sessionStorage` — synchronous, string-only key-value storage with a small quota, so every object passes through `JSON.stringify`/`parse` and every read blocks the main thread; `sessionStorage` dies with the tab; this is the vanilla mechanism under the Angular persisted-state pattern

---

## Prototypes and classes
- Class syntax — `constructor`, methods, and `this` as the instance; every Angular component, service, pipe, and guard is a class; interviewers ask how JavaScript classes relate to prototypes — classes are syntactic sugar, the underlying mechanism is still the prototype chain
- The prototype chain — property lookup walks up the `[[Prototype]]` links until it reaches `null`; the mechanism behind method sharing, `instanceof`, and why adding to `Array.prototype` changes every array in the program; interviewers ask what actually happens when you call a method you never defined on the object
- What `new` does — creates an empty object, links it to the constructor's prototype, binds `this` to it, and returns it unless the constructor explicitly returns another object; explains what a constructor gives back and why forgetting `new` used to leak properties onto the global object
- Private fields `#` — `#salary` is enforced at runtime by the JavaScript engine; TypeScript's `private` keyword is compile-time only and is erased in the compiled output; interviewers ask the difference when discussing Angular services with internal state that should not be accessible from outside
- Getters and setters — `get salary()` / `set salary(value)` control how a property is read and written without changing the call syntax; used to add validation logic or computed formatting; Angular signals use a similar getter-like access pattern
- Static methods and properties — belong to the class itself, not to instances; called as `ClassName.method()` without `new`; used in Angular for utility methods and configuration objects that should not depend on instance state
- `extends` and `super` — `extends` inherits from a parent class; `super()` must be called before using `this` in the child constructor; `super.method()` calls the parent method; interviewers ask what happens if you forget `super()` (it throws a `ReferenceError`)
- A closure vs a class for a stateful helper — a closure gives real privacy and a tiny surface, a class gives `instanceof`, inheritance, and multiple instances; interviewers ask which you would pick for a counter or a cache and why

## Strings and regular expressions
- String immutability — strings cannot be changed in place; every method returns a new string; `str[0] = 'x'` does nothing silently; a common source of confusion when coming from a mutable mindset
- Template literals — backtick strings with `${}` interpolation; support multiline without `\n`; any expression can go inside `${}`; interviewers expect template literals as the default over string concatenation
- `includes` vs `indexOf` for a substring check — `includes` returns a boolean and reads as intent, `indexOf` returns a position and the legacy `!== -1` idiom hides an off-by-one waiting to happen; interviewers show the `indexOf(x) > 0` bug (which misses a match at position 0) and ask what is wrong
- `startsWith` and `endsWith` — the readable replacements for slicing a string and comparing, used for a prefix filter or a file-extension check; interviewers ask how you test a prefix without a regex
- `split` — turns a string into an array on a separator, which is how a CSV line, a comma-separated tag field, or an ISO date becomes workable data; interviewers pair it with `join` and ask you to round-trip a list
- `trim` — removes leading and trailing whitespace, and the reason a login fails when the user pasted an email with a trailing space; interviewers ask where user input should be normalised
- `replace` vs `replaceAll` — `replace` with a string pattern changes only the *first* match, which is why a substitution silently misses the rest; you either pass a `/g` regex or use `replaceAll`; the single most common string gotcha in a review
- `toLowerCase` for case-insensitive comparison — the standard way to make a search filter or an email match behave, and the reason a filter appears broken when only one side is normalised; interviewers ask why "Ana" finds nothing when the data says "ana"
- String iteration and code units — `length` and index access count UTF-16 units while `for...of` yields whole code points, so an emoji has `length` 2 and a naive reverse corrupts it; asked whenever "reverse a string" comes up
- Regex pattern syntax — `/pattern/flags`; common flags: `i` (case insensitive), `g` (global — find all matches, not just the first); interviewers expect you to know what the `g` flag does and what happens without it
- `.test(str)` — returns a boolean; used in `Validators.pattern()` for Angular form validation and in conditional logic ("is this a valid email format?")
- `.match(regex)` and `str.replace(regex, replacement)` — `match` returns the matching parts as an array; `replace` with the `g` flag replaces all occurrences; without `g` only the first match is replaced — a common source of bugs

## Sets and Maps
- `Set` — collection of unique values; duplicates are automatically ignored; order is preserved; `has()` is O(1) while `Array.includes()` is O(n) — the performance difference is the reason to choose Set over Array for large collections
- Deduplication pattern: `[...new Set(array)]` — the most common Set use case; interviewers ask "how would you remove duplicates from an array?" — this is the expected modern answer
- `Map` — key-value collection where keys can be any type, not just strings; insertion order is guaranteed; `.size` built in; used when the key is a non-string value such as an object, a number, or an enum
- `Map` vs plain object — plain objects accept only string and Symbol keys; Maps accept any type as key; Maps are better for frequent add and delete operations; plain objects are better for fixed data shapes like DTOs and configuration
- `Set` vs `Array` — use Set when uniqueness matters or when you need fast `has()` lookups; use Array when index access or method chaining (map/filter) is needed; use `[...new Set(arr)]` to convert back to an array

- A `Set` deduplicates by reference, not by value — `new Set([{id:1}, {id:1}])` keeps both entries because the two objects are different references, so the trick that works beautifully on strings and numbers quietly does nothing on objects; interviewers hand you a list of DTOs and ask why the duplicates survived

---

## Promises and async/await
- Callbacks — the original async pattern; callback hell is deeply nested callbacks that handle sequential operations; Promises and `async`/`await` were introduced specifically to solve this readability and error-handling problem
- Promises: `then`, `catch`, `finally` — `then` runs on resolve; `catch` runs on reject; `finally` always runs regardless of outcome; interviewers ask when to use `finally` vs putting cleanup code after the `try/catch`
- The Promise executor runs synchronously — the function passed to `new Promise` executes immediately; only the `.then` callbacks are deferred; interviewers slip this into an ordering puzzle to catch candidates who assume the whole construct is asynchronous
- What a `.then` returns feeds the next one — returning a plain value wraps it, returning a Promise makes the chain wait for it, and returning nothing passes `undefined` down; interviewers build a three-link chain and ask what each link receives
- A `throw` inside a chain skips to the nearest `.catch` — the intermediate `.then` handlers are bypassed, and a `.then` placed *after* the `.catch` still runs because the chain has recovered
- `Promise.all` — runs multiple promises in parallel; resolves when ALL finish; rejects immediately if ANY fails; use when all data is required before rendering; the RxJS equivalent in Angular is `forkJoin`
- `Promise.allSettled` vs `Promise.all` — `allSettled` never rejects; it waits for all promises and returns each result with `{ status: 'fulfilled' | 'rejected', value | reason }`; use when some requests can fail independently without aborting the rest
- `Promise.race` vs `Promise.any` — `race` settles with the first promise to settle, *including* a rejection; `any` resolves with the first one that actually succeeds; interviewers ask which implements a timeout wrapper (answer: `race`)
- `async` / `await` — syntactic sugar over Promises; makes async code read like synchronous code; `await` can only be used inside an `async` function; an `async` function always returns a Promise even if it returns a plain value
- Sequential vs parallel `await` — `const a = await f(); const b = await g()` is sequential (waits one at a time); `const [a, b] = await Promise.all([f(), g()])` is parallel; sequential is only correct when the second call depends on the first or the API rate-limits
- Promise vs Observable in Angular — Promises emit one value and start immediately; Observables are lazy (start on subscribe), can emit multiple values, and can be cancelled with `takeUntilDestroyed()`; `firstValueFrom()` converts an Observable to a Promise; interviewers ask why Angular's `HttpClient` returns Observables instead of Promises

- Constructing a Promise by hand — `new Promise((resolve, reject) => ...)` is how you wrap a callback or timer API that predates promises, and writing `delay(ms)` is the classic live-coding warm-up; interviewers ask you to promisify a legacy callback function on the spot
- Retry with backoff — a loop of awaited attempts with a growing delay and a rethrow once the attempts run out; the standard "make this flaky call resilient" task, and the naive version that retries instantly is the failing answer
- `AggregateError` — what `Promise.any` rejects with when every input fails, carrying all the reasons in `.errors`; the natural follow-up once you have distinguished `race` from `any`
- Asynchronous is not parallel — the event loop interleaves *waiting*, it does not run your JavaScript on two threads, so `Promise.all` speeds up ten HTTP calls and does nothing for ten heavy computations; Web Workers are the only real parallelism in the browser; interviewers ask whether `Promise.all` makes the CPU work faster

---

## Execution order and the event loop
- The call stack — every function call pushes a frame and every return pops one; the stack must be empty before the event loop can run a queued callback, which is the real reason a long synchronous function freezes the page; interviewers ask what "single-threaded" actually costs you
- Event loop — JavaScript is single-threaded; microtasks (Promise callbacks) run before macrotasks (setTimeout); `Promise.then()` runs before `setTimeout` even at 0ms delay; explains why long synchronous code blocks the UI even if it calls no async functions
- The microtask queue is drained completely between macrotasks — every pending `.then` runs before the next `setTimeout` callback gets a turn; the mechanism behind the canonical log / `setTimeout(0)` / `Promise.resolve().then()` / log ordering puzzle asked verbatim in screenings
- An `async` function body runs synchronously up to its first `await` — everything after that `await` is scheduled as a microtask; explains why a `console.log` placed before the `await` prints before the caller's next line
- `setTimeout(fn, 0)` is not immediate — it is a macrotask with a minimum clamp, so it runs after all synchronous code and after every pending microtask; interviewers use it as the anchor of the ordering question

## Async failure modes
- Forgetting `await` — the call returns a pending Promise instead of the value, so `if (result)` is always truthy, the next line operates on a Promise object, and the surrounding `try/catch` catches nothing; the single most common async defect in a review
- Unhandled promise rejection — a rejected Promise with no `.catch` and no `await` fails silently, logging `Uncaught (in promise)` while the app carries on in a broken state; interviewers ask why nothing crashed but the screen stayed empty
- A `try/catch` around a call that is not awaited — the `try` block exits before the Promise settles, so the rejection escapes; the reason behind "I do have a try/catch and it still blew up"
- Errors thrown inside `setTimeout` or a plain callback escape the surrounding `try/catch` — the callback runs later on a fresh call stack that the `try` no longer wraps
- `await` inside `forEach` does not wait — `forEach` ignores the returned Promise, so the loop finishes before any of the work does; the fix is `for...of` with `await` for sequential work or `Promise.all(list.map(...))` for parallel
- Out-of-order responses — a fast second search request can resolve before a slow first one and get overwritten by stale data; the reason `switchMap`, a request id, or cancellation exists; interviewers describe a user typing quickly and ask what goes wrong
- `AbortController` and `signal` — cancels an in-flight `fetch` so a stale response never lands; the vanilla equivalent of Angular's `takeUntilDestroyed()`; asked as "how do you cancel a request the user no longer needs?"

## Error handling
- `try` / `catch` / `finally` — `try` is the code that might throw; `catch` receives the error object; `finally` always runs for cleanup (hide a spinner, close a connection); interviewers ask when to use `finally` vs putting code after the `try/catch` block (answer: `finally` guarantees execution even if `catch` also throws)
- A `return` inside `finally` overrides the `return` in `try` — the real value is silently discarded; a small trap that shows whether the candidate knows `finally` runs *after* the return value is computed
- `Error` object: `message`, `name`, `stack` — `stack` shows the full call chain that led to the error; essential for debugging production bugs; `name` distinguishes error types before `instanceof` is possible
- Custom error classes — extending `Error` to create `ValidationError`, `HttpError`, etc.; lets you use `instanceof` in `catch` to handle different error types differently; interviewers ask how to distinguish a network error from a validation error without checking arbitrary properties
- Silently swallowing errors — catching an error and doing nothing (or only `console.error`) is the most common junior mistake; the caller has no idea the operation failed; always either handle fully (show a message) or re-throw with `throw error`
- Error handling with `async`/`await` — `try/catch` catches both synchronous errors and rejected Promises inside an `async` function; the correct pattern for Angular services that call `firstValueFrom()` or `fetch()`
- Throwing vs returning a result value — throwing suits genuinely exceptional cases while returning `null` or a result object suits expected outcomes like "not found"; interviewers ask what your service does when a lookup finds nothing and why
- Where to catch — catch at the boundary that can actually react (the component or UI layer) rather than wrapping every function; interviewers ask why a `try/catch` in every method is a smell
- Normalising errors at the API boundary — converting HTTP status codes and network failures into one internal error shape before the UI sees them; interviewers ask how the component tells a 401 apart from a 500 or from "no connection"
- Failing fast vs substituting a fallback — deciding whether missing data should surface an error or silently default; interviewers ask why `?? 0` on a failed price fetch can be worse than showing the error

- `new Error(message, { cause })` — attaches the original error when you wrap and rethrow, so the low-level reason survives as the error crosses layers instead of being replaced by your friendlier message; interviewers ask how you rethrow without destroying the trail back to the real failure

---

## Runtime errors and debugging
- `TypeError: Cannot read properties of undefined (reading 'x')` — the most common runtime error in JavaScript and Angular; it means the *parent* was `undefined`, not the property; interviewers paste the exact message and ask which link of the chain was actually missing
- `TypeError: x is not a function` — the value exists but is not callable: a misspelled method, an object where a function was expected, or a class method that lost its receiver; interviewers ask what happened rather than how to silence it
- `ReferenceError` vs `TypeError` — `ReferenceError` means the binding does not exist at all (a typo, a missing import, the TDZ); `TypeError` means it exists and holds `undefined` or the wrong kind of value; a favourite "read this error and tell me the cause" pair
- `undefined` because the data has not arrived yet — the field is empty because the HTTP response is still in flight, not because the code is wrong; the classic Angular junior bug, and interviewers ask how you tell "not loaded yet" apart from "genuinely absent"
- Reading a stack trace — the top frame is where it threw and the frames below are the callers; interviewers show a pasted trace and ask which line you would open first and why
- Breakpoints vs `console.log` — a breakpoint pauses execution and exposes the whole scope and call stack, while a log only shows what you already guessed you would need; interviewers ask how you debug when you do not yet know which variable is wrong
- The call stack and scope panels — reading who called the failing function and what the local and closure variables held at that moment; the concrete content behind "walk me through how you would debug this"
- The console holds a live reference to logged objects — an object logged before a mutation is displayed already mutated, which is why "the log lies"; log a snapshot (a copy or a primitive) when the value changes later
- Source maps — the browser shows bundled, minified code unless a source map maps it back to the original file; explains why a production stack trace looks nothing like the code you wrote
- `console.error` vs `console.warn` vs `console.log` — different severity levels that DevTools filters separately, and only `console.error` captures a stack trace with the message; interviewers probe whether logging is a deliberate choice or a reflex
- `console.table` and `console.dir` — render an array of objects as a readable grid and expand a full object or DOM node, instead of scrolling a wall of collapsed logs; the fastest way to eyeball an API response
- `window.onerror` and the `unhandledrejection` event — the global hooks where uncaught errors and rejections finally surface; the vanilla concept behind centralised logging and Angular's `ErrorHandler`

## Dates and time
- Creating a `Date` — `new Date()`, `new Date(isoString)`, `new Date(year, monthIndex, day)`; the month argument is zero-indexed (`0` is January) while the day is not; the first off-by-one an interviewer looks for in a take-home
- ISO 8601 strings — `'2026-07-18T10:30:00Z'` is what a Spring Boot API returns for an `Instant` or `LocalDateTime`, and `new Date(iso)` parses it reliably, while `new Date('18/07/2026')` is implementation-dependent; interviewers ask how you get an API timestamp into a JavaScript date safely
- `toISOString()` — serialises back to UTC for sending to the backend; it always ends in `Z` and shifts the value to UTC, so a Spanish local date can come out as the previous day; the standard "why is my date one day off?" bug
- `Invalid Date` — an unparseable date does not throw; it produces a `Date` whose `getTime()` is `NaN`, detected with `Number.isNaN(d.getTime())` and never with a string comparison; a pressure question about why a silent failure reached production
- Timestamps and date arithmetic — `Date.now()` and `getTime()` return milliseconds since the Unix epoch, so subtracting two dates gives milliseconds that you divide down to hours worked; exactly the calculation a TimeTrack-style exercise asks for
- `getFullYear`, `getDate` and `getHours` — the accessors that read local-time components off a `Date`, with `getFullYear` being the one that replaced the two-digit `getYear`; interviewers ask which fields you read to build a calendar cell
- `getDay` returns the day of the week with `0` meaning Sunday — not Monday, and not the day of the month (that is `getDate`); it is the gotcha behind every Spanish calendar that renders shifted by one column, and interviewers on any scheduling domain ask for it
- `Date` objects are mutable — `setDate()` and friends modify the original in place, so copy with `new Date(d)` before adjusting; the reason a shared date drifts across a component
- Local time vs UTC accessors — `getHours()` reads the browser's timezone while `getUTCHours()` reads UTC; interviewers ask which one to use when grouping entries "by day" for a user in Madrid against UTC data from the server
- Why teams add a date library — `date-fns` and `Day.js` exist because native parsing, formatting, and arithmetic are verbose and locale-poor; interviewers ask whether you would add the dependency in a take-home and want a justified answer, not a reflex

## Formatting for a Spanish locale
- `Intl.NumberFormat('es-ES')` — formats numbers with the Spanish convention (`.` for thousands, `,` for decimals); hardcoded `toFixed(2)` output is the junior tell in a Spanish take-home
- Currency formatting — `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })` produces `1.234,56 €` with the symbol after the number; a reviewer checks whether euros were formatted or concatenated with `'€'`
- `toLocaleDateString('es-ES')` and `Intl.DateTimeFormat` — render `18/07/2026` instead of the US `7/18/2026`, with an options object (`day`, `month: 'long'`, `year`) controlling which parts appear; expected over manual string slicing
- `localeCompare` — the correct comparator for sorting names in Spanish, because `a > b` compares code units and pushes `á` and `ñ` after `z`; interviewers ask why a sorted list of Spanish surnames looks wrong
- `Intl.RelativeTimeFormat` — renders "hace 3 días" without hand-rolled pluralisation; worth recognising rather than memorising, but knowing it exists separates you from a candidate who writes an if-chain
- Format at the display edge only — store and compute with raw numbers and `Date` objects and format at render time; interviewers probe this by asking what happens when you sort a list of strings that are already formatted as `'1.234,56 €'`

## Fetch and HTTP from the browser
- `fetch()` — returns a Promise that resolves to a `Response`, and the body needs a second `await` (`await res.json()`); interviewers ask why two awaits are needed (the headers arrive before the body has finished streaming)
- `fetch` does not reject on 4xx or 5xx — only a network failure rejects, so you must check `res.ok` and throw yourself; the number one fetch gotcha and a guaranteed review comment on a take-home
- Sending JSON — `method`, `headers: { 'Content-Type': 'application/json' }`, and `body: JSON.stringify(payload)`; omitting the header or the `stringify` is why a Spring `@RequestBody` endpoint answers 415 or 400
- `URLSearchParams` — builds and percent-encodes a query string like `?status=OPEN&page=2` correctly instead of concatenating; matters as soon as a Spanish search field contains spaces or accents
- `fetch` vs Angular's `HttpClient` — `fetch` is a Promise-based browser API with no interceptors and no automatic JSON handling; `HttpClient` returns Observables and adds interceptors, typing, and testability; interviewers ask why an Angular app does not just use `fetch`

## Modules
- Named exports vs default export — Angular uses only named exports; named exports are safer to refactor because editors auto-rename them; default exports let the importer choose any name, which makes automated refactoring unreliable
- `import { name as alias }` and `import * as namespace` — renaming to avoid naming conflicts; namespace import bundles all exports into one object; used when consuming libraries that export many things at once
- ESM vs CommonJS — `import`/`export` against `require`/`module.exports`, switched by `"type": "module"` in `package.json`; the concrete explanation for `Cannot use import statement outside a module` when a script is run under Node
- Barrel pattern — an `index.ts` file that re-exports everything from a folder so imports stay clean; `import { X, Y } from './feature'` instead of long relative paths; common in large Angular feature modules
- Dynamic imports and lazy loading — `import('./module').then(m => m.Class)` loads code only when needed; Angular uses this in `loadComponent:` routing to reduce the initial bundle size; interviewers ask how lazy loading works and why it matters for app startup performance
- Tree-shaking — the bundler (esbuild) removes exported code that is never imported anywhere; only works reliably with named exports; one of the reasons Angular convention forbids default exports

- A module is evaluated once and cached — every file importing it shares the same instance, which is what makes a module-level object an accidental application-wide singleton, and a circular import resolves to a partially initialised module rather than an error; interviewers ask what happens when two files import each other

---

## npm and the build toolchain
- `package.json` — `dependencies` ship to production while `devDependencies` only build and test the app, and the `scripts` block is the first thing a reviewer opens in a submitted take-home; interviewers ask which section a testing library belongs in
- `npm install` vs `npm ci` — `install` resolves versions and may rewrite the lockfile; `ci` installs exactly what `package-lock.json` pins and is what a CI pipeline runs; interviewers ask why the lockfile is committed
- Semantic versioning ranges — `^1.2.3` accepts minor updates, `~1.2.3` only patches, and an exact pin accepts none; the concrete mechanism behind "it works on my machine" and why the lockfile settles it
- `node_modules` is never committed — it is regenerated from `package.json` plus the lockfile and belongs in `.gitignore`; a committed `node_modules` in a take-home is an immediate negative signal
- What a bundler does — resolves the module graph, transpiles, and emits browser-ready files; the reason code written with `import` needs a build step at all, and the answer to "what is `ng build` actually doing?"

## Loops and iteration
- Classic `for` loop — `for (let i = 0; i < arr.length; i++)`; still the right tool when you need the index itself or must skip/step irregularly; interviewers ask why most modern code prefers `for...of` or array methods over this form (less error-prone — no off-by-one risk on the condition or increment)
- `for...of` vs `for...in` — `for...of` iterates the values of any iterable (arrays, strings, Sets, Maps); `for...in` iterates the string keys of an object; using `for...in` on an array is a classic bug — it gives `'0'`, `'1'`, `'2'` as strings, not the array values
- `for...in` walks the prototype chain — it lists inherited enumerable keys too, which is why legacy code guards it with `hasOwnProperty` and why `Object.keys` is the modern answer
- The iterable protocol — `for...of`, spread, and destructuring all consume `Symbol.iterator`, which is why they work on arrays, strings, `Set` and `Map` but throw `TypeError: x is not iterable` on a plain object
- When to use a loop vs array methods — `map`, `filter`, `reduce` are preferred for data transformation; `for...of` is the right choice when you need early exit with `break` or when the loop body contains `await`; `forEach` cannot `break` and returns `undefined`
- `break` and `continue` — `break` exits the loop immediately; `continue` skips the rest of the current iteration; the main reason to choose `for...of` over `forEach` when early exit is needed
- `while` loop — repeats while a condition is true; use when the number of iterations is not known in advance (polling for a result, retrying an operation, reading paginated data)
- `while` vs `do...while` — `while` checks the condition before the first run and may execute zero times; `do...while` runs the body once before checking, guaranteeing at least one execution; interviewers ask for a real case where `do...while` is the right choice (e.g. show a menu at least once, then repeat while the user wants to continue)

## DOM events
- Event bubbling — a click on a child element also triggers click handlers on every ancestor element up to the document root; interviewers show a card with a button inside, both with click handlers, and ask why both fire
- `stopPropagation()` — prevents the event from travelling further up the DOM tree; used when a button inside a card should not also trigger the card's own click handler; requires passing `$event` in the Angular template with `(click)="handler($event)"`
- `preventDefault()` — cancels the browser's default behaviour for that element: form submission and page reload, link navigation, checkbox toggle; used in Angular form submits and custom `<a>` link overrides
- `stopPropagation` vs `preventDefault` — independent methods; `stopPropagation` controls where the event travels in the DOM; `preventDefault` controls what the browser does after the event; interviewers show a form submit and ask which one prevents the page reload
- `event.target` vs `event.currentTarget` — `target` is the element actually clicked, `currentTarget` is the element the handler is attached to; the confusable pair that explains most bubbling bugs
- Event delegation — one listener on a parent handles events from any number of children by inspecting `event.target`; the answer to "how do you handle clicks on a list whose rows change?"
- A listener registered twice — re-running the registration code (a repeated init, a subscription never cleaned up) adds a second identical handler and the effect happens twice; interviewers ask why the counter jumped by two
- `removeEventListener` needs the same function reference — an inline arrow cannot be removed because a new function object was created, so the listener accumulates; the mechanism behind "I removed it and it still fires"
- Listeners and subscriptions that are never cleaned up — the handler keeps a reference to state from a destroyed component, so it keeps running and holding memory; interviewers ask what happens if you never unsubscribe

- The three event phases — capture, target, bubble — and `addEventListener(fn, { capture: true })` to handle on the way *down*; interviewers ask which phase your handler runs in and why an outer listener could possibly fire before an inner one
- Listener options `once` and `passive` — `once: true` removes the handler after its first call (so you stop hand-writing the removal), and `passive: true` promises you will not call `preventDefault`, letting the browser scroll without waiting for your code; asked as "how would you fix a janky scroll listener?"
- Direct DOM manipulation — `querySelector`, `createElement`, `append`, `classList`, and `textContent` versus `innerHTML`; the vanilla-JS round still asks for a list rendered without a framework, and `textContent` is the safe default because `innerHTML` parses markup
- Throttling versus debouncing — debounce fires once after the burst has stopped, throttle fires at most once per interval during it; interviewers ask which a scroll or resize handler needs, and the point is that debounce feels broken there because nothing happens until the user stops

---

## Modern syntax (ES6+)
- Optional chaining `?.` — safely accesses a nested property that might be `null` or `undefined` without throwing; `user?.address?.city` returns `undefined` instead of a `TypeError`; used in Angular templates and services when API data may be partially missing
- `?.` short-circuits the whole chain, and only on the guarded link — `a?.b.c` does not protect `.c` when `b` is `undefined`, while `obj?.method()` skips the entire call (and never evaluates its arguments) when `obj` is nullish; interviewers show a partially guarded chain and ask whether it can still throw
- Optional chaining used to hide a real bug — `user?.name` on a value that should never be missing silently swallows a data error instead of failing fast; interviewers ask when `?.` is the wrong tool
- Nullish coalescing `??` vs `||` — `??` falls back only when the left side is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`; interviewers test this with a count or price field where `0` is a valid value that should not be replaced by a default
- Short-circuit evaluation returns an operand, not a boolean — `a || b` evaluates to one of the two values, which is why `value || 'default'` works at all and why `count && <Row/>` can render a literal `0`
- `??` cannot be mixed with `||` or `&&` unparenthesised — the combination is a `SyntaxError` by design, because the intended precedence would be ambiguous
- Logical assignment: `||=`, `&&=`, `??=` — shorthand for conditional assignment; `a ??= 'default'` assigns only if `a` is `null` or `undefined`; interviewers may show these to test whether the candidate can read modern JavaScript they did not write
- `setTimeout`, `setInterval`, and `clearInterval` — the timer APIs behind polling, a live elapsed-time counter, and debounce; the leak is forgetting to clear the interval when the component goes away
- Debouncing — delaying a function call until a rapid burst of events stops, implemented with a closure holding a `setTimeout` id that each new call clears; Angular does it with RxJS `debounceTime()` on search inputs, but a vanilla round asks you to write it, and it doubles as the standard closure exercise
- Generators (`function*` and `yield`) — produce values lazily, pausing at each `yield` until the caller asks for the next one, and they are the readable way to implement `Symbol.iterator`; recognition level is enough, but you must be able to say what pauses and who resumes it
- `for await...of` and async iterators — consume a paginated or streamed source one chunk at a time without loading everything first; interviewers ask how you would loop over pages until the API reports there are no more
- `WeakMap` and `WeakSet` — hold their keys weakly, so an entry vanishes once the key object is garbage-collected; the correct structure for metadata attached to DOM nodes or a cache that must not keep its own contents alive; interviewers ask why a normal `Map` would leak there
