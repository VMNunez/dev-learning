# JavaScript — Interview Questions

## Variables and scope

**What is the difference between `var`, `let`, and `const`?**
`var` is function-scoped and hoisted — it can be accessed before its declaration (as `undefined`) and leaks out of blocks. `let` and `const` are block-scoped and stay in the Temporal Dead Zone until their declaration line. `const` cannot be reassigned. I always use `const` by default and `let` only when I need to reassign. I never use `var` — its scoping behaviour is unpredictable.

**What is hoisting?**
JavaScript moves variable and function declarations to the top of their scope before executing the code. `var` declarations are hoisted and initialized as `undefined`. `let` and `const` are hoisted but not initialized — accessing them before their declaration throws a `ReferenceError` (Temporal Dead Zone). Function declarations are fully hoisted — you can call them before they appear in the code.

**What is a closure?**
A closure is a function that retains access to variables from its outer scope, even after the outer function has finished executing. In the HR portal, every `computed()` signal is a closure — `computed(() => this.employees().filter(e => e.department === this.selectedDept()))` closes over both signals. When either signal changes, the computed re-runs with the correct values because it holds a reference to the outer scope, not a copy of the values at creation time.

**What is the difference between function scope and block scope?**
`var` creates function-scoped variables — they exist throughout the entire function even if declared inside an `if` block. `let` and `const` create block-scoped variables — they only exist inside the `{}` where they were declared. Block scope prevents accidental access to variables outside their intended area.

---

## Types

**What is the difference between `==` and `===`?**
`===` is strict equality — it compares value AND type, no conversion. `==` is loose equality — it converts types before comparing, which produces surprising results like `0 == '0'` being `true`. I always use `===` to avoid hidden bugs from type coercion.

**What is the difference between `null` and `undefined`?**
`undefined` means a variable was declared but never assigned — JavaScript sets it automatically. `null` means a value was intentionally set to "no value" by the developer. In Angular I use `signal<Employee | null>(null)` to represent "nothing selected yet" — that is an intentional null.

**What are truthy and falsy values?**
In a boolean context, every value is either truthy or falsy. The falsy values are exactly six: `false`, `0`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy — including empty arrays `[]` and empty objects `{}`. This matters when writing conditions — `if (employees.length)` is truthy only when there are items.

**What is the difference between `??` and `||`?**
`||` returns the right side when the left is any falsy value — including `0`, `false`, and `''`, which can cause bugs when those are valid values. `??` (nullish coalescing) only triggers on `null` or `undefined`. I use `??` in Angular when reading from localStorage: `JSON.parse(localStorage.getItem('user') ?? 'null')` — `??` correctly handles the case where the key does not exist.

---

## Functions

**What is the difference between a regular function and an arrow function?**
Arrow functions are shorter and do not have their own `this` — they inherit `this` from the surrounding scope. Regular functions have their own `this` that depends on how they are called. In Angular I use arrow functions for array callbacks (`employees.filter(e => e.active)`) and for signal callbacks (`computed(() => ...)`) where I need the component's `this`.

**What is `this` and why is it tricky in JavaScript?**
`this` refers to the object that called the function — its value changes depending on how the function is called, not where it is defined. A method called directly has the object as `this`. A function called standalone has `undefined` (strict mode) or `window`. Arrow functions avoid this by not having their own `this` at all — they use the outer scope's `this`. In Angular this is why array callbacks and signal callbacks always use arrow functions — `computed(() => this.tasks().filter(...))` works correctly because the arrow function inherits the component's `this`. A regular `function` keyword there would lose the context.

---

## Array methods

**What is the difference between `map`, `filter`, and `reduce`?**
`map` transforms every element and returns a new array of the same length. `filter` keeps only elements that pass a test and returns a shorter array. `reduce` accumulates all elements into a single value — a number, an object, or another array. I use all three constantly in Angular `computed()` signals to derive filtered and transformed lists from raw data.

**What is the difference between `find` and `filter`?**
`find` returns the first matching element or `undefined` — used when you need one specific item. `filter` always returns an array — used when you need all items that match. I use `find` to look up an employee by ID before editing, and `filter` to build filtered lists in the table.

**What does `some` do and when do you use it?**
`some` returns `true` if at least one element passes the test. Its pair is `every`, which returns `true` only if ALL elements pass. I use `some` for duplicate checks before saving — `employees.some(e => e.email === newEmail)` — and `every` to check if all tasks are complete — `tasks.every(t => t.done)`.

**What is the difference between `forEach` and `map`?**
`forEach` iterates the array and runs a function for each element — it always returns `undefined`. `map` does the same but collects the return value of each call into a new array. Use `map` when you need a transformed version of the array. Use `forEach` only for side effects where you do not need a new array — logging, updating the DOM, or calling an external function. In Angular I almost always use `map` because I need the result, not just the side effect.

---

## Objects and destructuring

**What is destructuring and when do you use it?**
Destructuring extracts values from arrays or properties from objects into named variables in a single line. `const { name, role } = employee` is cleaner than `const name = employee.name; const role = employee.role`. I use it constantly in Angular — destructuring function parameters, extracting signal values, and unpacking `Promise.all` results: `const [employees, departments] = await Promise.all([...])`.

**What does the spread operator do with objects?**
It creates a shallow copy of the object. `{ ...employee, role: 'manager' }` creates a new object with all of employee's properties, with `role` overridden. I use it to update a signal immutably: `employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))` — no mutation, just a new object with the updated values.

**What is optional chaining and why is it useful?**
`?.` safely accesses a nested property without throwing if an intermediate value is `null` or `undefined`. Instead of `user && user.address && user.address.city` you write `user?.address?.city`. In Angular I use it when data might not have loaded yet — `selectedEmployee()?.name` returns `undefined` instead of crashing if nothing is selected.

---

## Async

**What is the event loop?**
JavaScript is single-threaded — it executes one thing at a time. The event loop manages async operations: synchronous code runs first, then all microtasks (Promise callbacks), then one task from the task queue (setTimeout, etc.). This is why a Promise resolves before a `setTimeout` with 0ms delay — Promises go to the microtask queue which has higher priority. In Angular this matters when you use `setTimeout(() => {}, 0)` to defer something until after the current render cycle — the event loop is why that trick works.

**What is the difference between a Promise and async/await?**
`async/await` is syntax sugar on top of Promises — it makes async code look synchronous. A function marked `async` always returns a Promise. `await` pauses execution inside the async function until the Promise resolves. The result is the same as `.then()` chains but much more readable, and errors are caught with regular `try/catch`. I use async/await in Angular when converting an Observable to a Promise with `firstValueFrom()`.

**What is the difference between sequential and parallel async calls?**
Sequential: `const a = await fetchA(); const b = await fetchB()` — B waits for A to finish. Parallel: `const [a, b] = await Promise.all([fetchA(), fetchB()])` — both start at the same time and you wait for both. In Angular I use `forkJoin` for parallel HTTP calls — the RxJS equivalent of `Promise.all`. Always prefer parallel when calls are independent.

---

## Strings, numbers, and built-in methods

**What string methods do you use most often and why?**
`includes()` for search checks, `split()` to convert a string to an array (and `join()` to go back), `trim()` to clean user input before saving, and template literals for building any string with embedded values. In Angular I also use `.slice()` to truncate long text for display and `.toUpperCase()` / `.toLowerCase()` to normalise before comparing.

**What is the difference between `parseInt` and `Number()`?**
`parseInt` stops at the first non-numeric character — `parseInt('42px')` gives `42`. `Number()` converts the whole string and returns `NaN` if anything is invalid — `Number('42px')` gives `NaN`. I use `Number()` when the input should be a clean number, and `parseInt` when parsing values like CSS sizes or API responses that mix numbers with units.

**Why does `0.1 + 0.2` not equal `0.3` in JavaScript?**
Because JavaScript uses 64-bit floating point (IEEE 754), and some decimals cannot be represented exactly in binary — the same limitation exists in Java, Python, and most languages. For display I use `.toFixed(2)` to round. For financial calculations I work in integers (cents instead of euros) to avoid the issue entirely.

---

## Objects and modules

**What does `Object.entries()` do and when is it useful?**
It returns an array of `[key, value]` pairs from an object — essentially lets you use array methods on an object. I use it when I need to iterate an object and transform or filter its entries, for example converting a config object into a `Map` or building a query string from a params object.

**What is the difference between named exports and default exports? Which does Angular use?**
Named exports allow multiple exports per file and the import name must match exactly — `export class EmployeeService` → `import { EmployeeService }`. Default exports allow only one per file and the import name is arbitrary. Angular always uses named exports — they are safer to refactor (editors auto-rename), enable tree-shaking, and are the convention across the whole ecosystem.

**What is `JSON.stringify` and `JSON.parse` and where do you use them?**
`JSON.stringify` converts a JavaScript object to a JSON string — needed to save objects to localStorage or send them in an HTTP body. `JSON.parse` does the reverse — converts a JSON string back to an object. In the HR portal I use both for the localStorage persistence pattern: `effect(() => localStorage.setItem('user', JSON.stringify(this.user())))` to save, and `JSON.parse(localStorage.getItem('user') ?? 'null')` to restore. `JSON.parse` can throw if the string is invalid, so I always wrap it in `try/catch`.

---

## Classes and error handling

**What does `extends` do and when do you use class inheritance?**
`extends` makes a class inherit all properties and methods from a parent class. `super()` calls the parent constructor. In Angular I use it when creating custom error classes that extend `Error`, and when a component extends a base class to share common logic. In Java, inheritance is central to the language — understanding it in JavaScript first makes the Java version easier to learn.

**What is the difference between a class and a regular function in JavaScript?**
A class is a cleaner syntax for creating objects with shared behaviour — it has a `constructor`, methods, and supports `extends` for inheritance. Under the hood JavaScript classes still use prototypes, but the syntax is much closer to Java or C#. In Angular every component, service, pipe, and guard is a class with a decorator — the decorator adds the metadata Angular needs to use it.

**What is `try/catch/finally` and when do you use `finally`?**
`try` contains code that might fail, `catch` handles the error, and `finally` always runs regardless of success or failure. I use `finally` to reset loading state — in the HR portal the pattern is `try { this.isLoading.set(true); ... } catch { this.hasError.set(true); } finally { this.isLoading.set(false); }`. Without `finally`, the spinner would stay on screen forever if the request failed.

**What is the difference between `throw new Error()` and just `throw 'message'`?**
`throw new Error()` creates an Error object with a `message`, `name`, and a stack trace — you can see exactly where it was thrown. `throw 'message'` throws a plain string — no stack trace, no type information, harder to catch and debug. Always throw Error objects.

---

## Sets and Maps

**What is a Set and when do you use it?**
A collection that only stores unique values — duplicates are ignored automatically. The most common use is removing duplicates from an array: `[...new Set(departments)]` gives you a list of unique department names. It is also faster than `Array.includes()` for checking if a value exists — `set.has()` is O(1), `array.includes()` scans the whole array. In the HR portal I use this pattern to build unique filter options from the employee list.

**What is the difference between a Set and an Array?**
An Array allows duplicates and gives you index access (`arr[0]`). A Set only stores unique values and has no index — you iterate it or convert it to an array with `[...set]`. Use an Array for ordered lists and transformations. Use a Set when you need unique values or fast existence checks.

**What is a Map and how is it different from a plain object?**
A Map is a key-value store where keys can be any type — not just strings. It also has a built-in `.size`, guaranteed insertion-order iteration, and `map.has()` for fast key lookups. In practice I use plain objects for data models. A Map makes sense when keys are not strings or when you need to frequently add and delete entries.

---

**Why would you use a Set instead of filtering an array for unique values?**
What they really want to know: Do you choose the right data structure, or just reach for an array every time?
A: `[...new Set(array)]` is cleaner and more direct than a filter with `indexOf`. More importantly, if I need to check membership repeatedly — like building filter options in the HR portal — `set.has()` runs in O(1) while `array.includes()` scans the whole array every time. For a large dataset that difference is real. For a one-off deduplication on a small array, the array approach is fine.
Red flag answer: "I would use filter." — Not wrong for a small case, but shows no awareness of why Set exists or when it matters.

---

## Regular expressions

**What is a regular expression and how do you use one in Angular?**
A regular expression is a pattern for matching, validating, or replacing text. In Angular I use them with `Validators.pattern()` — for example `Validators.pattern(/^\d{9}$/)` validates that a phone field contains exactly 9 digits. I use `.test()` when I only need a yes/no answer, and `.match()` when I need to extract the matching parts from a string.

---

## Events

**What is event bubbling and when do you need `stopPropagation()`?**
When an event fires on an element, it travels up through every parent element — that is bubbling. If a button is inside a card, clicking the button also triggers the card's click handler. `stopPropagation()` stops the event from going further up. I used this in the meal finder — clicking the favourite button on a meal card should add to favourites, not open the detail page. The solution was `event.stopPropagation()` in the button handler and passing `$event` in the template.

**What is the difference between `stopPropagation` and `preventDefault`?**
`stopPropagation` stops the event from bubbling up to parent elements. `preventDefault` stops the browser's default action for that element — for example, preventing a form from reloading the page on submit, or preventing an `<a>` from navigating. They are independent — you can call one, both, or neither depending on what you need.

---

## Pressure questions

**The app crashes on load. The console says `Cannot read properties of undefined (reading 'map')`. What do you check first?**
The data that `.map()` is called on is `undefined` — meaning it arrived as `undefined` instead of an array. I check three things in order: first, whether the API response has the expected shape (maybe it returned an object instead of an array); second, whether the data is loaded asynchronously and the component tried to render before it arrived; third, whether a signal or variable was not initialized with a default value. The fix is usually initializing the signal as an empty array — `signal<Employee[]>([])` — so the template has something valid to render before the data loads.

**A PR comes in that uses `var` everywhere and `.then()` chains instead of `async/await`. It works correctly. Do you approve it?**
No — I would leave a review comment explaining why. `var` has unpredictable scoping that causes real bugs in loops and async callbacks — `let` and `const` are the standard since ES6. `.then()` chains are harder to read and harder to handle errors in than `async/await`. "It works" is not the same as "it is maintainable". I would ask the author to update it and offer to explain the reasoning — not as a blocker, but as a team standard conversation.

**You find a `console.log` with a sensitive user token in a production build. What do you do?**
Remove it immediately and deploy a fix — the token is exposed in browser DevTools to anyone who opens them. Then rotate the token on the backend so the old one stops working. In a company I would also check if anyone accessed the app during that window and report it following the incident process. The lesson is that `console.log` in production code is dangerous — it should be caught in code review and removed before merging.
