# General — Interview Questions

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
