# General — Interview Questions

## TypeScript

**What is TypeScript and why do you use it?**
A superset of JavaScript that adds static types. It catches errors at compile time instead of at runtime, makes refactoring safer, and gives you better IDE autocompletion. Angular uses TypeScript by default — in large codebases it becomes essential.

**What is the difference between `interface` and `type` in TypeScript?**
Both define the shape of an object. `interface` can be extended and merged — good for models. `type` is more flexible and can define union types like `type Status = 'active' | 'inactive'`. I use `interface` for data models and `type` for unions and combinations.

**What is `Omit<T, 'field'>` and when do you use it?**
A utility type that creates a new type from an existing one, removing specific fields. I use it in the HR portal to type the "create employee" payload — `Omit<Employee, 'id'>` gives me all fields except the ID, which the server generates.

**What is optional chaining (`?.`) and when is it useful?**
It lets you safely access a property that might be `null` or `undefined` without throwing an error — `user?.address?.city` returns `undefined` if any part is null. I use it when working with API data that may have missing fields.

**What is the nullish coalescing operator (`??`)?**
Returns the right side only if the left side is `null` or `undefined`. Different from `||`, which also triggers on `0` or `''`. I use it in the HR portal auth service: `JSON.parse(localStorage.getItem('user') ?? 'null')` — if nothing is saved, parse the string `'null'` to get `null`.

**What is a union type?**
A type that can be one of several values: `type Status = 'pending' | 'active' | 'inactive'`. In Angular I use them everywhere for status fields, filter states, and role types — they make it impossible to assign an invalid value.

**What is a type assertion and when is it safe to use?**
`value as Type` tells TypeScript to treat a value as a specific type, overriding its inference. It is safe when you know more than the compiler does — for example, casting `event.target as HTMLInputElement` after a click event. Avoid it to silence errors you do not understand — it bypasses type safety completely.

**What is a generic and why is it useful?**
A generic is a type parameter that lets you write reusable code that works with different types while still being type-safe. `function getFirst<T>(items: T[]): T` works with any array and always returns the correct type — no need to write a separate version for strings, numbers, and objects. In Angular, `HttpClient.get<Employee[]>()` is a generic — the type parameter tells TypeScript what the response shape will be.

**What is the difference between `any`, `unknown`, and `never`?**
`any` disables type checking completely — the value can be used as any type with no errors. `unknown` is the safe alternative — you must narrow the type before using it. `never` represents a value that can never exist — a function that always throws has return type `never`. I avoid `any` in real code because it removes all the benefits of TypeScript. I use `unknown` for external data like `JSON.parse` results and narrow it before using.

**What is an enum and when do you use it instead of a union type?**
An enum is a set of named constants — `enum Role { Admin = 'admin', Employee = 'employee' }`. I use it when the values are shared across many files and need to be iterated — `Object.values(Role)` gives all options for a `<mat-select>`. For simple local cases I use a union type — `type Status = 'active' | 'inactive'` — it is shorter and does not generate extra JavaScript. The rule: union type for local simple cases, enum for shared reused constants.

**What is type narrowing and why does TypeScript need it?**
When a variable has a union type, TypeScript does not know at runtime which specific type it is. Narrowing is using a check to reduce the type — `if (typeof value === 'string')` tells TypeScript that inside that block, `value` is definitely a string. I use `typeof` for primitives, `instanceof` for class instances, and `in` to distinguish between object shapes. The discriminated union pattern — a shared `status` field with literal values — is the cleanest approach for loading/success/error states in Angular.

**What is the non-null assertion operator (`!`) and when should you avoid it?**
`value!` tells TypeScript the value is definitely not `null` or `undefined`. I use it with `@ViewChild` — `@ViewChild(MatSort) sort!: MatSort` — because Angular sets it before I use it but TypeScript cannot verify that. I avoid it everywhere else and prefer optional chaining `?.` or a proper null check — if the assumption is wrong, `!` gives a runtime error with no warning from TypeScript.

**What is the constructor shorthand in TypeScript and how does it relate to Angular?**
Declaring a parameter with an access modifier (`private`, `public`, `readonly`) in the constructor automatically creates and assigns a class property. `constructor(private http: HttpClient)` is equivalent to declaring `private http: HttpClient` and writing `this.http = http` in the body. In Angular this is the standard pattern for dependency injection. Modern Angular also supports `inject()` as an alternative, which removes the constructor entirely.

---

## JavaScript fundamentals

**What is the difference between `let`, `const`, and `var`?**
`const` is for values that do not change — use it by default. `let` is for values that need to change. `var` is the old way — it is function-scoped and hoisted, which causes bugs. I only use `const` and `let`.

**What is `Array.map()` and when do you use it?**
Transforms every element in an array and returns a new array. I use it to convert API response objects to the format the component needs, without mutating the original data.

**What is `Array.filter()` and when do you use it?**
Returns a new array with only the elements that match a condition. In the HR portal I chain it with `computed()` — `employees().filter(e => e.status === filterStatus())` gives a live filtered list.

**What is `Array.some()` and when do you use it?**
Returns `true` if at least one element matches the condition. I use it for duplicate checks in the HR portal — `employees.some(e => e.email === newEmail)` tells me if the email already exists.

**What is the spread operator (`...`) and what is it used for?**
Copies the elements of an array or object into another. I use it to create new objects without mutating the original — `{ ...employee, status: 'inactive' }` gives a new object with only `status` changed.

**What is `async/await` and how does it differ from `.then()`?**
Both handle Promises, but `async/await` reads like synchronous code — easier to follow, especially with multiple async operations in sequence. `.then()` chains are fine for simple cases. In Angular I mostly use Observables with `subscribe()`, but `async/await` is useful in services that call `fetch` or other Promise-based APIs.

**What is `JSON.stringify()` and `JSON.parse()`?**
`stringify()` converts a JavaScript object to a JSON string for storage or sending to an API. `parse()` does the reverse. I use both in every project that persists data in `localStorage`.

---

## General programming

**What is the difference between `==` and `===` in JavaScript?**
`===` is strict equality — it checks value AND type. `==` does type coercion, which leads to unexpected results (`0 == false` is `true`). Always use `===`.

**What is immutability and why does it matter in Angular?**
Immutability means not modifying existing objects — instead, you create new ones with the changes. Angular's change detection works better with immutable data because it can detect changes by reference. HTTP requests are also immutable in Angular — that is why you use `req.clone()` in interceptors.

**What is the DRY principle?**
"Don't Repeat Yourself" — if the same logic appears in more than one place, extract it into a function, service, or component. In the HR portal, the confirm dialog pattern is reusable across three different pages — that is DRY in practice.

**What is separation of concerns?**
Each part of the code should do one thing and be responsible for one area. In Angular: components handle the template, services handle data and logic, guards handle route access. Mixing them together makes the code harder to test and maintain.

**What is the difference between synchronous and asynchronous code?**
Synchronous code runs line by line and blocks execution until each line finishes. Asynchronous code (HTTP calls, timers, user events) starts an operation and continues without waiting for it to finish. In Angular, almost everything that touches a server is asynchronous — that is why we use Observables and signals.

**What does "single source of truth" mean?**
One place in the app holds the authoritative version of a piece of data. In the HR portal, `EmployeeService` is the single source of truth for the employee list — any component that needs it reads from there, so they all stay in sync automatically.

---

## Agile and teamwork

**Have you worked in an agile environment?**
Not professionally, but I follow agile practices in my own projects — atomic commits, feature branches, PR descriptions, and short focused changes. I understand the ceremony: daily standup to share blockers, sprint to timebox work, retrospective to improve the process. The part I would adapt to fastest in a consultancy is the PR review cycle — I already practice it in my personal workflow.

**What is the difference between a sprint and a backlog?**
The backlog is the full list of features and tasks for the project, ordered by priority. A sprint is a fixed time period — usually two weeks — where the team picks a subset of backlog items and commits to finishing them. At the end of the sprint you have working software, not half-finished features.

**What is a daily standup and what do you say in it?**
A short daily meeting — usually 15 minutes — where each person answers three questions: what did I do yesterday, what will I do today, and is anything blocking me. The goal is to surface blockers early, not to report progress to a manager.

**What would you change about your solo workflow when joining a team?**
What they really want to know: Are you ready for professional collaboration, or will you be disruptive on a team?
A: The biggest change is discipline around git — never merging your own PRs, keeping commits atomic so teammates can follow the history, and writing PR descriptions that explain the why, not just the what. I already do this in my personal projects. The harder part is agreeing on architecture upfront — that is exactly why patterns like Core/Feature/Shared exist, so five developers can work independently without breaking each other's code.
Red flag answer: "I would communicate more." — Too vague. The interviewer wants specific practices, not intentions.
