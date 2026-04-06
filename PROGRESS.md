# My Learning Progress

**Goal:** Get a junior / junior-mid job as a developer (Angular + Java) → August 2026
**Location:** Spain — everything I learn must be focused on what Spanish companies ask for
**Previous knowledge:** React, Node, Express, TypeScript, Tailwind, CSS, HTML, JS (a bit rusty)

---

## Current status

- [x] Read the official Angular documentation (Learn Angular tutorial)
- [x] Angular CLI installed
- [x] First Angular project started (01-todo-list)
- [x] First Angular project finished

---

## Fundamentals — Must know (language and web agnostic)

> These are not tied to Angular or Java. They make you a better developer in any language.
> In the AI era, interviewers use these to check if you *understand* code or just copy it.

### JavaScript / TypeScript core
- [ ] Data types: primitive vs reference
- [ ] `==` vs `===` — why it matters
- [ ] Closures — what they are and when they appear
- [ ] The event loop — how async works in JavaScript
- [ ] Promises and `async/await`
- [ ] `map`, `filter`, `reduce` — how and when to use them
- [ ] Immutability — why you avoid mutating data directly

### Object-oriented programming (OOP)
- [ ] Classes and objects
- [ ] Encapsulation — private vs public
- [ ] Inheritance — extends
- [ ] Polymorphism — same method, different behaviour
- [ ] Interfaces — define a contract

### How the web works
- [ ] HTTP — request and response cycle
- [ ] HTTP methods: GET, POST, PUT, DELETE, PATCH
- [ ] HTTP status codes: 200, 201, 400, 401, 403, 404, 500
- [ ] What happens when you type a URL in the browser
- [ ] What is a REST API
- [ ] What is JSON and why we use it
- [ ] CORS — what it is and why it exists
- [ ] Cookies vs localStorage vs sessionStorage

### TypeScript fundamentals
- [ ] `type` vs `interface` — the difference and when to use each
- [ ] Generics — what they are (you already use them: `signal<string>`)
- [ ] Union types — `string | null`, `number | undefined`
- [ ] `any` vs `unknown` — why `any` is dangerous
- [ ] Optional chaining `?.` and nullish coalescing `??`
- [ ] Type narrowing — how TypeScript checks types inside `if` blocks

### Git fundamentals
- [ ] What a commit actually is (a snapshot, not a diff)
- [ ] What a branch is — a pointer to a commit
- [ ] Merge vs rebase — difference and when to use each
- [ ] How to resolve a merge conflict
- [ ] `git stash` — save work without committing
- [ ] `git log` and `git diff` — read your own history

### General programming
- [ ] What is a stack and a heap (memory)
- [ ] Recursion — what it is and when to use it
- [ ] Big O notation — basics only (O(n), O(1), O(n²))
- [ ] DRY principle — Don't Repeat Yourself
- [ ] SOLID principles — basics (especially Single Responsibility)
- [x] DRY principle applied — extracted shared utility function `getIconUrl`
- [x] Single Responsibility applied — one component, one job (page fetches, card displays)

---

## Angular — Concepts to learn

### Basics
- [x] Components: `@Component`, selector, template, styles
- [x] Routing: define routes in `app.routes.ts`
- [ ] Routing: navigate with `routerLink`
- [ ] Routing: display pages with `RouterOutlet`
- [x] Data binding: interpolation `{{ }}`
- [x] Data binding: property binding `[]`
- [x] Data binding: event binding `()`
- [x] Data binding: class binding `[class.x]`
- [ ] Two-way binding: `[(ngModel)]`
- [x] Directives: `@if` and `@empty`
- [x] Directives: `@for`
- [ ] Directives: `@switch`
- [x] Inputs: `input()` signal-based
- [ ] Inputs: `@Input()` decorator-based
- [x] Template reference variables: `#ref`
- [x] Outputs: `output()` signal-based
- [ ] Outputs: `@Output()` and `EventEmitter`
- [x] Services: `@Injectable`
- [x] Dependency injection: `inject()`

### Intermediate
- [x] Signals: `signal()`
- [x] Signals: `signal.update()`
- [x] Signals: `signal.set()`
- [x] Signals: `computed()`
- [ ] Signals: `effect()`
- [x] HTTP Client: `HttpClient`
- [x] RxJS: `subscribe`
- [x] RxJS: `forkJoin` — run multiple HTTP requests in parallel
- [ ] RxJS: `pipe`
- [ ] RxJS: `map`
- [ ] RxJS: `catchError`
- [ ] Reactive forms: `FormGroup`
- [ ] Reactive forms: `FormControl`
- [ ] Reactive forms: `Validators`
- [x] Lifecycle hooks: `ngOnInit`
- [ ] Lifecycle hooks: `ngOnDestroy`
- [ ] Lifecycle hooks: `ngOnChanges`
- [x] Pipes: `number` with format `'1.0-1'`
- [x] Pipes: `SlicePipe` — cut strings in templates
- [ ] Pipes: `date`
- [ ] Pipes: `currency`
- [ ] Pipes: `async`
- [ ] Pipes: custom pipe
- [ ] Route guards: `CanActivate`
- [ ] Lazy loading routes

### Advanced
- [ ] Standalone components
- [ ] State management with signals
- [ ] NgRx basics
- [ ] HTTP Interceptors
- [ ] Testing: Jasmine
- [ ] Testing: TestBed
- [ ] OnPush change detection

---

## CSS & Tailwind — Concepts to practise

> Practised inside Angular projects — not studied separately.

### CSS Basics
- [x] Box model: margin, padding, border
- [x] Display: block, inline, inline-block
- [x] Flexbox: `display: flex`, `justify-content`, `align-items`
- [x] Flexbox: `flex-direction`, `flex-wrap`, `gap`
- [ ] Grid: `display: grid`, `grid-template-columns`, `gap`
- [ ] Positioning: `relative`, `absolute`, `fixed`
- [x] Pseudo-classes: `:hover`, `:focus`, `:last-child`
- [x] CSS property: `text-decoration`
- [x] CSS property: `opacity`
- [ ] Responsive design: `@media` queries
- [x] CSS variables: `--color`, `var()`
- [x] CSS animations: `@keyframes` and `animation` property
- [x] CSS spinner: `border-top-color` + `rotate` + `border-radius: 50%`

### Tailwind
- [ ] Utility classes: spacing, colours, typography
- [ ] Flexbox and Grid with Tailwind
- [ ] Responsive prefixes: `sm:`, `md:`, `lg:`
- [ ] Hover and focus states: `hover:`, `focus:`
- [ ] Dark mode: `dark:`
- [ ] Custom configuration: `tailwind.config`

---


## SQL — Concepts to learn

### Basics
- [ ] SELECT and FROM
- [ ] WHERE — filter results
- [ ] ORDER BY — sort results
- [ ] LIMIT — limit results
- [ ] INSERT — add data
- [ ] UPDATE — modify data
- [ ] DELETE — remove data
- [ ] INNER JOIN
- [ ] LEFT JOIN
- [ ] GROUP BY
- [ ] Aggregate functions: COUNT, SUM, AVG
- [ ] Primary key
- [ ] Foreign key

### Intermediate
- [ ] Subqueries
- [ ] Indexes
- [ ] Transactions: COMMIT
- [ ] Transactions: ROLLBACK

> **Note:** In Spain, most junior jobs use MySQL or PostgreSQL. Practice with one of them.

---

## Angular Projects

| # | Project | Key concepts | Status |
|---|---------|--------------|--------|
| 01 | To-do list | Components, routing, binding, directives, services | Done ✓ |
| 02 | Weather app | HTTP Client, forkJoin, signals, computed, ngOnInit, pipes, CSS animations, Netlify deploy | Done ✓ |

---

## Java Projects

| # | Project | Key concepts | Status |
|---|---------|--------------|--------|
| — | — | — | — |

---

## Node.js / Express — Concepts to practise

> Start in Phase 2 (May 2026) — after Angular basics are solid.

### Basics (rusty — needs review)
- [ ] Node.js: modules, require, exports
- [ ] Express: create a server
- [ ] Express: routes — GET, POST, PUT, DELETE
- [ ] Express: middleware
- [ ] Express: handle JSON body
- [ ] Express: connect to a database

### Full stack with Angular
- [ ] CORS configuration
- [ ] REST API consumed by Angular with HttpClient
- [ ] Authentication: JWT basics

---

## Java / Spring Boot — Concepts to learn

> Start in Phase 3 (after June 19 2026).

### Java Basics
- [ ] Syntax: variables, types, operators
- [ ] Control flow: if, for, while, switch
- [ ] Classes and objects
- [ ] Inheritance
- [ ] Interfaces
- [ ] Polymorphism
- [ ] Encapsulation
- [ ] Collections: List
- [ ] Collections: Map
- [ ] Collections: Set
- [ ] Exceptions: try/catch
- [ ] Exceptions: checked vs unchecked
- [ ] Streams and lambdas (Java 8+)

### Spring Boot
- [ ] Create a REST API
- [ ] `@RestController`
- [ ] `@Service`
- [ ] `@Repository`
- [ ] JPA / Hibernate: connect to a database
- [ ] JPA / Hibernate: basic queries
- [ ] Maven: project structure and dependencies

---

## Complementary skills

> These skills are practised across all projects — not studied separately.

- [ ] Debugging — reading errors, using browser devtools, tracing bugs
- [ ] Reading and reviewing PRs — understand code you didn't write
- [ ] Security basics — API keys out of git, SQL injection awareness, XSS awareness
- [ ] Architecture basics — REST, frontend/backend separation, databases
- [ ] AI tools — using Copilot/Claude to work faster, reviewing AI-generated code

---

## Interview prep

> All notes are in the `interview-prep/` folder.
> Topics: Angular, Java, SQL, Git, and general programming questions.

*Questions and answers will be added as I progress.*

---

## Useful resources

- [Official Angular tutorial](https://angular.dev/tutorials/learn-angular)
- [Angular components guide](https://angular.dev/guide/components)
- [Tour of Heroes](https://angular.dev/tutorials/tour-of-heroes)
- [Oracle Java tutorials](https://docs.oracle.com/javase/tutorial/)
- [Spring Boot guides](https://spring.io/guides)
