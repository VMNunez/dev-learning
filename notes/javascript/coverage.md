# Minimum Coverage — JavaScript

Core JavaScript concepts needed to write and review TypeScript and Angular code confidently.
Every item must be explainable with a real example from one of the projects.

## Variables and scope
- `var` vs `let` vs `const` — `var` is function-scoped and hoisted; `let` and `const` are block-scoped; use `const` by default; `var` is avoided in modern code
- Hoisting — `var` declarations are moved to the top of the function at runtime; `let` and `const` are hoisted but not initialised (temporal dead zone)
- Closures — a function that remembers variables from its outer scope; appears in Angular callbacks, event handlers, and service methods

## Functions
- Function declarations vs arrow functions — arrow functions inherit `this` from the surrounding context; function declarations have their own `this`; interviewers ask the difference when debugging class methods
- Default parameters, rest parameters, spread operator — reducing overloads and handling variable-length argument lists
- Higher-order functions — functions that take or return other functions; the basis of `map`, `filter`, and RxJS operators

## Arrays
- `map` — transforms every element and returns a new array; used constantly to convert API responses to view models
- `filter` — keeps only elements that pass a condition; used to filter lists by status, role, or search term
- `reduce` — accumulates a value from an array; used for totals and grouping
- `find`, `findIndex`, `some`, `every`, `includes` — searching arrays without a loop; interviewers ask which one to use for each use case
- Spread in arrays: `[...arr1, ...arr2]` — merging arrays without mutating the original

## Objects
- Object literals, property shorthand, computed properties — `{ name }` instead of `{ name: name }`; computed keys `{ [key]: value }`
- Destructuring: objects and arrays — `const { name, email } = user`; used constantly in Angular components and services
- Spread in objects: `{ ...obj, key: value }` — creating a new object with updated fields without mutating the original
- `Object.keys`, `Object.values`, `Object.entries` — iterating over an object's properties; used when the structure is dynamic

## Async
- Callbacks — the original async pattern; deeply nested callbacks are hard to read and maintain (callback hell)
- Promises: `then`, `catch`, `finally`, `Promise.all` — the cleaner async pattern; `Promise.all` runs multiple async operations in parallel
- `async` / `await` — syntactic sugar over Promises; reads like synchronous code; used in Angular services that call APIs
- The event loop — why JavaScript is non-blocking: it processes one task at a time but queues async callbacks; explains why you cannot block the main thread

## Modern syntax
- Template literals: `` `Hello ${name}` `` — string interpolation; cleaner than concatenation
- Optional chaining `?.` — safely access a nested property that might be null; `user?.address?.city`
- Nullish coalescing `??` — use the right side only when the left is `null` or `undefined`; safer than `||` which also triggers on `0` and `""`
- Logical assignment: `||=`, `&&=`, `??=` — shorthand for "assign only if the condition is met"

## Modules
- `import` / `export` — named exports (multiple per file) vs default export (one per file); how Angular files are linked together
- How module resolution works — the bundler (esbuild) follows import paths at build time and combines them into bundles for the browser

## Error handling
- `try` / `catch` / `finally` — catching exceptions at the right boundary; `finally` always runs regardless of whether there was an error
- `Error` object: `message`, `name`, `stack` — what information a thrown error carries; `stack` shows where it happened
- Throwing custom errors — `throw new Error('message')` or a class that extends `Error`

## `this` keyword
- What `this` refers to in different contexts — in a class method it is the instance; in a regular callback it can be `undefined` in strict mode
- Why arrow functions do not have their own `this` — they inherit from the surrounding scope; this is why Angular uses arrow functions in class properties
- `bind`, `call`, `apply` — explicitly setting `this`; you will see these in older Angular or JavaScript code
