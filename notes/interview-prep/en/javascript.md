# JavaScript — Interview Questions

## Variables and scope

**What is the difference between `var`, `let`, and `const`?**

`var` is function-scoped and hoisted — it can be accessed before its declaration (as `undefined`) and leaks out of blocks. `let` and `const` are block-scoped and stay in the Temporal Dead Zone until their declaration line. `const` cannot be reassigned. I always use `const` by default and `let` only when I need to reassign. I never use `var` — its scoping behaviour is unpredictable.

> **Junior tip:** Lead with the practical rule — "I always use `const`, `let` only when reassigning, never `var`." Then explain why `var` is a problem. Interviewers want to see you have a habit, not just that you know the definition.

**What is hoisting?**

JavaScript moves variable and function declarations to the top of their scope before executing the code. `var` declarations are hoisted and initialized as `undefined`. `let` and `const` are hoisted but not initialized — accessing them before their declaration throws a `ReferenceError` (Temporal Dead Zone). Function declarations are fully hoisted — you can call them before they appear in the code.

> **Junior tip:** The key distinction is between hoisting the *declaration* (always happens) and hoisting the *initialization* (only `var`). Mention the Temporal Dead Zone by name — it shows you understand the mechanism, not just the symptom.

**What is a closure?**

A closure is a function that retains access to variables from its outer scope, even after the outer function has finished executing. In the HR portal, every `computed()` signal is a closure — `computed(() => this.employees().filter(e => e.department === this.selectedDept()))` closes over both signals. When either signal changes, the computed re-runs with the correct values because it holds a reference to the outer scope, not a copy of the values at creation time.

Red flag answer: "It is when a function is inside another function." — Missing the key insight: the inner function *retains access* to the outer variables even after the outer function returns. The word "retain" is what makes it a closure.

**What is the difference between function scope and block scope?**

`var` creates function-scoped variables — they exist throughout the entire function even if declared inside an `if` block. `let` and `const` create block-scoped variables — they only exist inside the `{}` where they were declared. Block scope prevents accidental access to variables outside their intended area.

> **Junior tip:** Give the concrete example — "If I declare `var x = 10` inside an `if` block, `x` is still accessible after the block ends. With `let`, it throws a ReferenceError." Concrete examples beat abstract rules in interviews.

---

## Types

**What is the difference between `==` and `===`?**

`===` is strict equality — it compares value AND type, no conversion. `==` is loose equality — it converts types before comparing, which produces surprising results like `0 == '0'` being `true`. I always use `===` to avoid hidden bugs from type coercion.

> **Junior tip:** Give one surprising example — `null == undefined` is `true` with `==` but `false` with `===`. Then say your rule: always use `===`. Short and clear.

**What is the difference between `null` and `undefined`?**

`undefined` means a variable was declared but never assigned — JavaScript sets it automatically. `null` means a value was intentionally set to "no value" by the developer. In Angular I use `signal<Employee | null>(null)` to represent "nothing selected yet" — that is an intentional null.

> **Junior tip:** Emphasise the *intent*: `undefined` is JavaScript saying "you forgot to assign this", `null` is you saying "this intentionally has no value". That distinction is what interviewers want.

**What are truthy and falsy values?**

In a boolean context, every value is either truthy or falsy. The falsy values are exactly six: `false`, `0`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy — including empty arrays `[]` and empty objects `{}`. This matters when writing conditions — `if (employees.length)` is truthy only when there are items.

> **Junior tip:** The common trap is `[]` and `{}` — candidates assume they are falsy because they are "empty". They are truthy. Say that explicitly — "empty arrays and objects are truthy, which surprises people."

**What is the difference between `??` and `||`?**

`||` returns the right side when the left is any falsy value — including `0`, `false`, and `''`, which can cause bugs when those are valid values. `??` (nullish coalescing) only triggers on `null` or `undefined`. I use `??` in Angular when reading from localStorage: `JSON.parse(localStorage.getItem('user') ?? 'null')` — `??` correctly handles the case where the key does not exist.

Red flag answer: "They are basically the same." — They are only the same when the left side is always `null` or `undefined`. The difference matters when `0` or `''` are valid values.

**What is the difference between `typeof` and `instanceof`?**

`typeof` returns a string describing the type of a primitive — `typeof 'hello'` gives `'string'`, `typeof 42` gives `'number'`. `instanceof` checks if an object was created by a specific class — `error instanceof ValidationError` returns `true`. The important quirk: `typeof null` returns `'object'`, which is a known JavaScript bug from the original implementation. To check for null specifically, use `value === null`. I use `instanceof` in `catch` blocks to distinguish different error types.

> **Junior tip:** Mention the `typeof null === 'object'` quirk — it always comes up and shows you know the real language, not just the theory. Every JavaScript developer is expected to know this one.

---

## Functions

**What is the difference between a regular function and an arrow function?**

Arrow functions are shorter and do not have their own `this` — they inherit `this` from the surrounding scope. Regular functions have their own `this` that depends on how they are called. In Angular I use arrow functions for array callbacks (`employees.filter(e => e.active)`) and for signal callbacks (`computed(() => ...)`) where I need the component's `this`.

> **Junior tip:** The `this` difference is what matters most in practice. Say: "Arrow functions are what I use for callbacks and computed signals in Angular — because they inherit the component's `this`, so I can access the component's properties inside them."

**What is `this` and why is it tricky in JavaScript?**

`this` refers to the object that called the function — its value changes depending on how the function is called, not where it is defined. A method called directly has the object as `this`. A function called standalone has `undefined` (strict mode) or `window`. Arrow functions avoid this by not having their own `this` at all — they use the outer scope's `this`. In Angular this is why array callbacks and signal callbacks always use arrow functions — `computed(() => this.tasks().filter(...))` works correctly because the arrow function inherits the component's `this`. A regular `function` keyword there would lose the context.

Red flag answer: "this is the current object." — Too vague. The point is that `this` changes depending on *how* the function is called, not where it is defined. A regular function passed as a callback loses its `this`.

**When would you define a function with `function` instead of an arrow function?**

When I need a function that has its own `this` — for example, a method in a class or a generator function. Arrow functions cannot be used as constructors (`new arrowFn()` throws) and do not have an `arguments` object. In Angular, all component class methods use regular method syntax and TypeScript handles `this` correctly inside the class. Arrow functions are for callbacks and one-liners.

Red flag answer: "I always use arrow functions." — Shows no awareness of when regular functions are the right tool. Arrow functions cannot be used as constructors, and the `arguments` object is unavailable inside them.

---

## Loops

**What is the difference between `for...of` and `for...in`?**

`for...of` iterates over the **values** of an iterable — arrays, strings, Sets, Maps. `for...in` iterates over the **keys** (property names) of an object. Using `for...in` on an array gives you index strings (`'0'`, `'1'`, `'2'`), not values — that is almost never what you want. I use `for...of` when I need to loop with `break` or `continue` and array methods are not enough. For object keys I prefer `Object.keys()` over `for...in` because it is more explicit.

> **Junior tip:** "I use `for...of`, not `for...in`, on arrays." That one sentence shows you know the trap. Then explain: `for...in` gives you index strings, not the actual values, and it can pick up inherited properties.

Red flag answer: "I always use array methods like map and filter." — Good instinct, but shows no awareness of when `for...of` is the right tool — for example, when you need early exit with `break`.

**When would you use a traditional `for` loop instead of `map` or `filter`?**

When I need to `break` out of the loop early — `map` and `filter` always iterate the full array. A `for` or `for...of` loop lets me stop as soon as I find what I need. I would also use a `for` loop when generating a fixed number of items, like filling an array with placeholder rows. In Angular I almost always use array methods because they chain cleanly with `computed()` signals, but knowing when a loop is more efficient is important.

Red flag answer: "I never use `for` loops." — Shows no flexibility. Early exit with `break` is a real and legitimate reason to reach for a loop.

---

## Array methods

**What is the difference between `map`, `filter`, and `reduce`?**

`map` transforms every element and returns a new array of the same length. `filter` keeps only elements that pass a test and returns a shorter array. `reduce` accumulates all elements into a single value — a number, an object, or another array. I use all three constantly in Angular `computed()` signals to derive filtered and transformed lists from raw data.

> **Junior tip:** Give the one-word mental model: `map` = transform, `filter` = keep, `reduce` = combine. Then give one example each. Interviewers want to see you can apply them, not just name them.

**What is the difference between `find` and `filter`?**

`find` returns the first matching element or `undefined` — used when you need one specific item. `filter` always returns an array — used when you need all items that match. I use `find` to look up an employee by ID before editing, and `filter` to build filtered lists in the table.

> **Junior tip:** Mention the return types: `find` returns one element or `undefined`, `filter` always returns an array (even if empty). That is the practical difference that interviewers are checking.

**What does `some` do and when do you use it?**

`some` returns `true` if at least one element passes the test. Its pair is `every`, which returns `true` only if ALL elements pass. I use `some` for duplicate checks before saving — `employees.some(e => e.email === newEmail)` — and `every` to check if all tasks are complete — `tasks.every(t => t.done)`.

> **Junior tip:** Give a concrete use case right away: "I use `some` to check if an email already exists before adding a new employee." That is more convincing than the definition alone.

**What is the difference between `forEach` and `map`?**

`forEach` iterates the array and runs a function for each element — it always returns `undefined`. `map` does the same but collects the return value of each call into a new array. Use `map` when you need a transformed version of the array. Use `forEach` only for side effects where you do not need a new array — logging, updating the DOM, or calling an external function. In Angular I almost always use `map` because I need the result, not just the side effect.

> **Junior tip:** The key rule: if you need a new array, use `map`. If you are just doing something with each item and do not need the result, use `forEach`. In Angular you will almost always need `map`.

**What is `findIndex` and when would you use it instead of `find`?**

`findIndex` returns the index of the first matching element — or `-1` if nothing matches — instead of the element itself. I use it when I need the position to update or remove an item from the array. For example, to replace one employee in a list without rebuilding the whole array: `const index = list.findIndex(e => e.id === id); list[index] = updated`. With `find` I get the object but cannot locate it in the array.

> **Junior tip:** The clearest use case: you want to update one item in an array. `find` gives you the item but not its position. `findIndex` gives you the position so you can replace it.

**Why is it dangerous to call `.sort()` directly on an array you want to keep unchanged?**

`sort` mutates the original array — it sorts in place. If you call it directly on a signal's value in Angular, you modify the underlying state unexpectedly and cause hard-to-find bugs. The safe pattern is to spread first: `[...employees()].sort((a, b) => a.name.localeCompare(b.name))`. The second trap: the default sort converts elements to strings, so `[10, 9, 2].sort()` gives `[10, 2, 9]` because `'10' < '2'` alphabetically. Always pass a comparator when sorting numbers.

Red flag answer: "I use sort directly on the array." — `sort` mutates. In Angular with signals, calling `sort` on the signal value silently mutates the state — the signal never knows it changed.

---

## Objects and destructuring

**What is destructuring and when do you use it?**

Destructuring extracts values from arrays or properties from objects into named variables in a single line. `const { name, role } = employee` is cleaner than `const name = employee.name; const role = employee.role`. I use it constantly in Angular — destructuring function parameters, extracting signal values, and unpacking `Promise.all` results: `const [employees, departments] = await Promise.all([...])`.

> **Junior tip:** Mention both object AND array destructuring — candidates often only know one. The `const [a, b] = await Promise.all([...])` example is memorable and shows real-world usage.

**What does the spread operator do with objects?**

It creates a shallow copy of the object. `{ ...employee, role: 'manager' }` creates a new object with all of employee's properties, with `role` overridden. I use it to update a signal immutably: `employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))` — no mutation, just a new object with the updated values.

Red flag answer: "It copies the object." — True but incomplete. The interviewer wants to hear "shallow copy", and ideally that you know nested objects are still references. "Shallow" is the key word.

**What is optional chaining and why is it useful?**

`?.` safely accesses a nested property without throwing if an intermediate value is `null` or `undefined`. Instead of `user && user.address && user.address.city` you write `user?.address?.city`. In Angular I use it when data might not have loaded yet — `selectedEmployee()?.name` returns `undefined` instead of crashing if nothing is selected.

> **Junior tip:** The before/after comparison is your strongest tool: "Before, I had to write `user && user.address && user.address.city`. Now I write `user?.address?.city`." That shows you understand the problem it solves.

**What is `Object.freeze` and when would you use it?**

`Object.freeze` makes an object immutable — its properties cannot be added, removed, or changed after freezing. I use it for configuration constants that should never change — API URLs, role definitions, status lists. The key difference from `const`: `const` prevents reassigning the variable, but you can still mutate the object it points to. `Object.freeze` prevents mutations to the object itself.

Red flag answer: "Same as const." — No. `const` prevents reassignment of the binding. `Object.freeze` prevents mutation of the object's properties. `const config = {}; config.url = 'x'` is valid — `const` does not protect the properties.

---

## Async

**What is the event loop?**

JavaScript is single-threaded — it executes one thing at a time. The event loop manages async operations: synchronous code runs first, then all microtasks (Promise callbacks), then one task from the task queue (setTimeout, etc.). This is why a Promise resolves before a `setTimeout` with 0ms delay — Promises go to the microtask queue which has higher priority. In Angular this matters when you use `setTimeout(() => {}, 0)` to defer something until after the current render cycle — the event loop is why that trick works.

> **Junior tip:** The ordering question — "What prints first: `Promise.resolve().then(...)` or `setTimeout(..., 0)`?" — is a classic. The answer is the Promise callback, because microtasks run before tasks. Knowing this shows you understand the event loop, not just that it exists.

**What is the difference between a Promise and async/await?**

`async/await` is syntax sugar on top of Promises — it makes async code look synchronous. A function marked `async` always returns a Promise. `await` pauses execution inside the async function until the Promise resolves. The result is the same as `.then()` chains but much more readable, and errors are caught with regular `try/catch`. I use async/await in Angular when converting an Observable to a Promise with `firstValueFrom()`.

> **Junior tip:** Emphasise that they are not different things — `async/await` IS Promises, just cleaner syntax. The practical difference is readability and error handling with `try/catch` instead of `.catch()` chains.

**What is the difference between sequential and parallel async calls?**

Sequential: `const a = await fetchA(); const b = await fetchB()` — B waits for A to finish. Parallel: `const [a, b] = await Promise.all([fetchA(), fetchB()])` — both start at the same time and you wait for both. In Angular I use `forkJoin` for parallel HTTP calls — the RxJS equivalent of `Promise.all`. Always prefer parallel when calls are independent.

Red flag answer: "I always use await one by one." — Shows no awareness that sequential execution is slower when calls do not depend on each other. `Promise.all` is the correct tool for independent parallel calls.

**What is callback hell and how did Promises solve it?**

Callback hell is when async callbacks nest inside each other — three or four levels deep, the code looks like a pyramid and error handling becomes almost impossible because each callback has to manually forward errors. Promises solved it by letting you return the next Promise inside `.then()` instead of nesting — the chain stays flat. `async/await` made it even cleaner — it looks like synchronous code with a regular `try/catch`.

> **Junior tip:** If the interviewer asks this, they want to see that you understand WHY modern async patterns exist, not just how to use them. Name the problem (nested callbacks, no shared error handling), then the solution (Promise chains + async/await).

**What is the difference between `Promise.all` and `Promise.allSettled`?**

`Promise.all` rejects immediately if ANY of the promises fail — one error stops everything. `Promise.allSettled` waits for ALL promises to complete regardless of success or failure and gives you an array of results with a `status` field (`'fulfilled'` or `'rejected'`). I use `Promise.all` when all operations must succeed — if one fails, the whole thing should fail. I use `Promise.allSettled` when I need partial results — for example, loading multiple independent sections where one failing should not prevent the others from showing.

Red flag answer: "I always use Promise.all." — Shows no awareness that a single rejection aborts everything. `Promise.allSettled` is the right tool when partial success is acceptable.

---

## Strings, numbers, and built-in methods

**What string methods do you use most often and why?**

`includes()` for search checks, `split()` to convert a string to an array (and `join()` to go back), `trim()` to clean user input before saving, and template literals for building any string with embedded values. In Angular I also use `.slice()` to truncate long text for display and `.toUpperCase()` / `.toLowerCase()` to normalise before comparing.

> **Junior tip:** Do not just list them — say *why* you reach for each one. "I use `trim()` before saving any user input because leading/trailing spaces cause duplicate-check bugs." That shows you think about data quality, not just syntax.

**What is the difference between `parseInt` and `Number()`?**

`parseInt` stops at the first non-numeric character — `parseInt('42px')` gives `42`. `Number()` converts the whole string and returns `NaN` if anything is invalid — `Number('42px')` gives `NaN`. I use `Number()` when the input should be a clean number, and `parseInt` when parsing values like CSS sizes or API responses that mix numbers with units.

> **Junior tip:** The practical rule: reach for `Number()` by default because it is strict. Only use `parseInt` when you know the string has a valid number followed by non-numeric characters you want to ignore.

**Why does `0.1 + 0.2` not equal `0.3` in JavaScript?**

Because JavaScript uses 64-bit floating point (IEEE 754), and some decimals cannot be represented exactly in binary — the same limitation exists in Java, Python, and most languages. For display I use `.toFixed(2)` to round. For financial calculations I work in integers (cents instead of euros) to avoid the issue entirely.

> **Junior tip:** The key move is to say it is not a JavaScript bug — it affects Java, Python, and most languages. Then give the practical fix: `.toFixed(2)` for display, integer arithmetic for calculations. That shows you think about solutions, not just problems.

---

## Objects and modules

**What does `Object.entries()` do and when is it useful?**

It returns an array of `[key, value]` pairs from an object — essentially lets you use array methods on an object. I use it when I need to iterate an object and transform or filter its entries, for example converting a config object into a `Map` or building a query string from a params object.

> **Junior tip:** The practical pattern is `Object.entries(obj).map(([key, value]) => ...)`. You destructure each pair inside the `map`. This combination — entries + array methods + destructuring — is what interviewers want to see.

**What is the difference between named exports and default exports? Which does Angular use?**

Named exports allow multiple exports per file and the import name must match exactly — `export class EmployeeService` → `import { EmployeeService }`. Default exports allow only one per file and the import name is arbitrary. Angular always uses named exports — they are safer to refactor (editors auto-rename), enable tree-shaking, and are the convention across the whole ecosystem.

> **Junior tip:** Mention tree-shaking — named exports let the bundler remove unused code. Default exports make static analysis harder. That is one concrete reason Angular chose named exports as its convention.

**What is `JSON.stringify` and `JSON.parse` and where do you use them?**

`JSON.stringify` converts a JavaScript object to a JSON string — needed to save objects to localStorage or send them in an HTTP body. `JSON.parse` does the reverse — converts a JSON string back to an object. In the HR portal I use both for the localStorage persistence pattern: `effect(() => localStorage.setItem('user', JSON.stringify(this.user())))` to save, and `JSON.parse(localStorage.getItem('user') ?? 'null')` to restore. `JSON.parse` can throw if the string is invalid, so I always wrap it in `try/catch`.

> **Junior tip:** Mention the `try/catch` around `JSON.parse` — it shows you think about the error case. Also mention what JSON cannot serialize: `undefined`, functions, `Date` objects. Dates become strings, `undefined` is silently dropped.

**What does tree-shaking mean and why does Angular use named exports?**

Tree-shaking is when the bundler (esbuild in Angular) removes code that is exported but never imported anywhere. Named exports make this possible — the bundler can statically analyse which exports are used. Default exports are harder to analyse because the import name is arbitrary. Angular uses named exports for every component, service, pipe, and guard so that production builds only include code that is actually used.

> **Junior tip:** Relate it to bundle size — "tree-shaking keeps the production bundle small by removing dead code." Then say that Angular's named-export convention is what makes tree-shaking effective. This is a decision-based answer, not just a definition.

---

## Classes and error handling

**What does `extends` do and when do you use class inheritance?**

`extends` makes a class inherit all properties and methods from a parent class. `super()` calls the parent constructor. In Angular I use it when creating custom error classes that extend `Error`, and when a component extends a base class to share common logic. In Java, inheritance is central to the language — understanding it in JavaScript first makes the Java version easier to learn.

> **Junior tip:** Be ready to say *when not* to use inheritance — "I use it for error classes and base components, but I prefer composition over inheritance for most cases. Inheritance makes sense when there is a clear 'is-a' relationship."

**What is the difference between a class and a regular function in JavaScript?**

A class is a cleaner syntax for creating objects with shared behaviour — it has a `constructor`, methods, and supports `extends` for inheritance. Under the hood JavaScript classes still use prototypes, but the syntax is much closer to Java or C#. In Angular every component, service, pipe, and guard is a class with a decorator — the decorator adds the metadata Angular needs to use it.

> **Junior tip:** Mention that under the hood classes are still prototype-based — "classes are syntactic sugar over prototypes." Interviewers sometimes ask this as a follow-up to test whether you know the real mechanism.

**What is `try/catch/finally` and when do you use `finally`?**

`try` contains code that might fail, `catch` handles the error, and `finally` always runs regardless of success or failure. I use `finally` to reset loading state — in the HR portal the pattern is `try { this.isLoading.set(true); ... } catch { this.hasError.set(true); } finally { this.isLoading.set(false); }`. Without `finally`, the spinner would stay on screen forever if the request failed.

> **Junior tip:** The `finally` use case is the key part of the answer — "Without `finally`, I would need to reset `isLoading` in both `try` and `catch`, and I might forget one. `finally` runs regardless, so it is the safe place for cleanup."

**What is the difference between `throw new Error()` and just `throw 'message'`?**

`throw new Error()` creates an Error object with a `message`, `name`, and a stack trace — you can see exactly where it was thrown. `throw 'message'` throws a plain string — no stack trace, no type information, harder to catch and debug. Always throw Error objects.

> **Junior tip:** The stack trace is the key — "When I throw a string, I lose the stack trace and I cannot check `error instanceof SomethingError` in the catch block." Those two things together are why you always throw Error objects.

**When would you create a custom error class instead of just throwing `new Error()`?**

When the caller needs to distinguish between different types of errors. A `ValidationError` and an `HttpError` both extend `Error`, but in the `catch` block I can check `error instanceof ValidationError` and handle them differently — show a form validation message vs. a generic server error message. In Spring Boot (which I am also learning), the same pattern exists — you create custom exceptions that the controller advice maps to specific HTTP status codes.

Red flag answer: "I would just use `new Error()` with a descriptive message." — Shows no awareness that the `catch` block might need to distinguish error types. Custom error classes are the tool for that.

---

## Sets and Maps

**What is a Set and when do you use it?**

A collection that only stores unique values — duplicates are ignored automatically. The most common use is removing duplicates from an array: `[...new Set(departments)]` gives you a list of unique department names. It is also faster than `Array.includes()` for checking if a value exists — `set.has()` is O(1), `array.includes()` scans the whole array. In the HR portal I use this pattern to build unique filter options from the employee list.

> **Junior tip:** Name the two use cases: deduplication (`[...new Set(array)]`) and fast membership checks (`set.has()`). Then say which one you use more often and why.

**What is the difference between a Set and an Array?**

An Array allows duplicates and gives you index access (`arr[0]`). A Set only stores unique values and has no index — you iterate it or convert it to an array with `[...set]`. Use an Array for ordered lists and transformations. Use a Set when you need unique values or fast existence checks.

> **Junior tip:** The performance difference matters for large datasets: `set.has(value)` is O(1) regardless of size. `array.includes(value)` is O(n) — it checks every element. For small arrays the difference is negligible, but knowing this shows you think about efficiency.

**What is a Map and how is it different from a plain object?**

A Map is a key-value store where keys can be any type — not just strings. It also has a built-in `.size`, guaranteed insertion-order iteration, and `map.has()` for fast key lookups. In practice I use plain objects for data models. A Map makes sense when keys are not strings or when you need to frequently add and delete entries.

> **Junior tip:** The practical rule: "I use a plain object for data models like `{ name, role, salary }`. I would use a Map when the keys are dynamic or non-string — for example, mapping DOM nodes to data, or caching results by object reference."

**Why would you use a Set instead of filtering an array for unique values?**

`[...new Set(array)]` is cleaner and more direct than a filter with `indexOf`. More importantly, if I need to check membership repeatedly — like building filter options in the HR portal — `set.has()` runs in O(1) while `array.includes()` scans the whole array every time. For a large dataset that difference is real. For a one-off deduplication on a small array, either approach works.

Red flag answer: "I would use filter." — Not wrong for a small case, but shows no awareness of why Set exists or when its performance advantage matters.

---

## Regular expressions

**What is a regular expression and how do you use one in Angular?**

A regular expression is a pattern for matching, validating, or replacing text. In Angular I use them with `Validators.pattern()` — for example `Validators.pattern(/^\d{9}$/)` validates that a phone field contains exactly 9 digits. I use `.test()` when I only need a yes/no answer, and `.match()` when I need to extract the matching parts from a string.

> **Junior tip:** Know the two most common methods: `.test()` returns a boolean (use for validation), `.match()` returns an array of matches or null (use for extraction). And know `Validators.pattern()` for Angular forms.

---

## Events

**What is event bubbling and when do you need `stopPropagation()`?**

When an event fires on an element, it travels up through every parent element — that is bubbling. If a button is inside a card, clicking the button also triggers the card's click handler. `stopPropagation()` stops the event from going further up. I used this in the meal finder — clicking the favourite button on a meal card should add to favourites, not open the detail page. The solution was `event.stopPropagation()` in the button handler and passing `$event` in the template.

> **Junior tip:** The project example is your strongest asset here — "I ran into this in project 04." That shows you have seen this problem in real code, not just read about it.

**What is the difference between `stopPropagation` and `preventDefault`?**

`stopPropagation` stops the event from bubbling up to parent elements. `preventDefault` stops the browser's default action for that element — for example, preventing a form from reloading the page on submit, or preventing an `<a>` from navigating. They are independent — you can call one, both, or neither depending on what you need.

> **Junior tip:** Give an example of when you need both: clicking an anchor inside a card — you might want `preventDefault` (stop navigation) AND `stopPropagation` (stop the card click handler). That shows you know they are independent tools.

---

## Pressure questions

**The app crashes on load. The console says `Cannot read properties of undefined (reading 'map')`. What do you check first?**

The data that `.map()` is called on is `undefined` — meaning it arrived as `undefined` instead of an array. I check three things in order: first, whether the API response has the expected shape (maybe it returned an object instead of an array); second, whether the data is loaded asynchronously and the component tried to render before it arrived; third, whether a signal or variable was not initialized with a default value. The fix is usually initializing the signal as an empty array — `signal<Employee[]>([])` — so the template has something valid to render before the data loads.

**A PR comes in that uses `var` everywhere and `.then()` chains instead of `async/await`. It works correctly. Do you approve it?**

No — I would leave a review comment explaining why. `var` has unpredictable scoping that causes real bugs in loops and async callbacks — `let` and `const` are the standard since ES6. `.then()` chains are harder to read and harder to handle errors in than `async/await`. "It works" is not the same as "it is maintainable". I would ask the author to update it and offer to explain the reasoning — not as a blocker, but as a team standard conversation.

**You find a `console.log` with a sensitive user token in a production build. What do you do?**

Remove it immediately and deploy a fix — the token is exposed in browser DevTools to anyone who opens them. Then rotate the token on the backend so the old one stops working. In a company I would also check if anyone accessed the app during that window and report it following the incident process. The lesson is that `console.log` in production code is dangerous — it should be caught in code review and removed before merging.

**You need to sort a list of employees by salary, but the results look wrong — some employees appear in the wrong position. What is most likely happening?**

The most likely cause is calling `.sort()` without a comparator — the default sort converts values to strings and sorts lexicographically, so `30000` comes after `200000` because `'3' > '2'` as a string. The fix is passing a numeric comparator: `employees.sort((a, b) => a.salary - b.salary)`. A second possibility is calling `sort` directly on a signal's value and mutating state unexpectedly — the safe pattern is `[...employees()].sort(...)`.

Red flag answer: "I don't know, sort usually works." — Shows no awareness of the string comparison trap or the mutation issue with signals.
