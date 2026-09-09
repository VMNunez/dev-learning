# Interview Questions — 01-todo-list

Questions specific to the implementation decisions made in this project.
Use these alongside the topic-based files in `interview-prep/{LEVEL}/en/` and `es/`.

## Architecture & Patterns

**Your app has three components and one service. Walk me through who owns the task list and who is allowed to change it.**

`TaskService` owns the only writable copy — a `signal<Task[]>` — and it is the only writer: `addTask`, `toggleTask` and `deleteTask` all live there. I chose one-way data flow so the list has a single source of truth: `TaskList` reads the signal and derives from it, `TaskForm` only calls `addTask`, and `TaskItem` never touches state at all. Any component that needs the list injects the service instead of receiving a copy it could diverge from.

**Why did you put the state in a service instead of in `TodoPage`, the page component?**

I decided the state should outlive the component tree that displays it: a signal in `TodoPage` dies with the page, while the service is `providedIn: 'root'` and survives navigation. With three components either would work today, but keeping it in the page is the habit that breaks the moment a second page needs the same list — I would then have to lift it anyway.

**`TaskForm` and `TaskList` inject `TaskService` directly instead of receiving data from `TodoPage`. Isn't that against "data down, events up"?**

Not at the level it applies. If `TodoPage` passed the list down, the shell would have to declare an input and re-emit three events for data it has no interest in, and change every time the `Task` shape changes. I chose to inject at the point of use so `TodoPage` stays a pure layout concern and both feature components can be dropped on any future page unchanged; the data-down/events-up contract is kept where it earns something — between `TaskList` and its repeated leaf.

**Then why is `TaskItem` the one component that does *not* inject the service?**

Because it is the repeated leaf, rendered once per task, so it has to be told which task it is — `input.required<Task>()`. Making it presentational means it can be reasoned about and tested purely from its inputs, with no knowledge of where the data came from, and `TaskList`, which already owns the read, is the natural place for the writes to land.

**`TaskItem` emits `output<number>()` — the id — rather than the whole `Task` or a mutated task. Why the id?**

I chose the id because it is the only thing the parent actually needs to locate the task in the service's array, and it keeps the child from implying it produced a new state. Emitting a mutated `Task` would put update logic in a component I deliberately kept logic-free, and the service's `toggleTask(id)` / `deleteTask(id)` already take an id.

**`TaskList` has `toggleTask(id)` and `deleteTask(id)` methods that do nothing but call the service. Why not bind the service method straight from the template?**

They exist so the template binds to the component's own API rather than reaching through `taskService.` in markup, which keeps the template readable and gives me one place to add logic — a confirm dialog before delete, say — without touching either the child or the service. It is thin delegation on purpose, not an accidental layer.

**Describe your folder structure and why the service and the model live under `pages/todo-page/` instead of a global `core/`.**

The structure is feature-first: `pages/todo-page/` holds the page, plus its own `models/`, `services/` and `components/`. I decided to colocate because `Task` and `TaskService` are used by exactly one feature, so promoting them to a shared `core/` would advertise a reuse that does not exist. The moment a second page consumed the list, moving the service up is a one-import change.

**You have exactly one route, `'' → TodoPage`. Why bootstrap through the router at all instead of rendering the page directly?**

I chose to boot through the router from day one so the app already has the shape every later project needs: `App` renders only `<router-outlet />` and holds no state. Bootstrapping `TodoPage` directly would work now, but adding navigation later would mean retrofitting the root component and the config rather than just adding route objects.

**Walk me through what happens between `main.ts` and the first task appearing on screen.**

`main.ts` calls `bootstrapApplication(App, appConfig)` — standalone bootstrap, no `NgModule`. `appConfig` registers `provideRouter(routes)`, the router matches `''` and renders `TodoPage` into `App`'s `<router-outlet />`, `TodoPage` composes `<app-task-form />` and `<app-task-list />`, and `TaskList` injects `TaskService` — created lazily as a root singleton on that first injection — so its template can read `filteredTasks()`, which reads the `tasks` signal.

**Every component here is standalone with an `imports` array. What did that replace, and what does the array actually control?**

Standalone components replaced `NgModule` declarations: each component declares its own template dependencies instead of inheriting them from a module. In `TaskList` the array holds `TaskItem` because the template uses `<app-task-item>`; `TaskForm` and `TaskItem` have empty arrays because their templates use only built-in control flow and bindings, which need no import.

**Your service is `providedIn: 'root'`. What would change if you provided it in `TodoPage` instead?**

It would become a per-instance provider: every `TodoPage` created would get its own `TaskService` and its own list, destroyed with the page. I chose root because the whole point of moving state out of the component was surviving the component — and because `TaskForm` and `TaskList` inject it themselves, they must resolve to the same instance.

**Why `inject()` instead of constructor injection?**

I chose the function-based API because it is what Angular now prefers and it composes better — it works in field initialisers, so `private taskService = inject(TaskService)` reads as one line without a constructor at all. It is the same injector and the same token resolution; the difference is ergonomics, not semantics.

**How does `TaskList` know to re-render when `TaskForm` adds a task? There is no parent-child link between them.**

They share the service instance, and `tasks` is a signal. `addTask` calls `tasks.update(...)`, which produces a new array reference, so the signal notifies its consumers — `filteredTasks`, `pendingCount` and `totalCount` are `computed()` on top of it, and the template reads those. Nothing subscribes and nothing has to be unsubscribed; the dependency exists because the template read the signal.

**Why signals here rather than an RxJS `BehaviorSubject` and the `async` pipe?**

I decided on signals because this project's budget belonged to components, not stream lifecycle: no subscription to manage, no `takeUntilDestroyed`, no `async` pipe, and derived values are one `computed()` instead of a `map` chain. `BehaviorSubject` would give the same "current value plus updates" semantics, but with cleanup I could not justify in a first project.

**`pendingCount`, `totalCount` and `filteredTasks` are `computed()` rather than methods called from the template. Why does that matter?**

A method is re-executed on every change detection pass, whereas a `computed()` caches its value and only recalculates when a signal it read actually changes. I chose `computed` for all three because they are pure derivations of `tasks()` and `currentFilter()` — declaring the derivation instead of recomputing it by hand is the point of the reactive model.

**The view filter is a `signal<Filter>` inside `TaskList`, not in the service. Why the split?**

Because it is UI state, not task data. Which tab is selected concerns one component and should reset when that component goes away; the task list must not. I chose the boundary deliberately: the service holds what the app is, the component holds how it is currently being looked at.

**Your service methods never push or splice. What would break if `addTask` did `tasks().push(newTask)`?**

The data would change and the UI would not. A signal notifies its readers when it receives a new reference, so mutating the existing array in place leaves the signal holding the same reference and no consumer is invalidated. That is why `addTask` spreads into a new array, `toggleTask` uses `map` with a copied task object, and `deleteTask` uses `filter` — all three replace rather than mutate.

**In `@for (task of filteredTasks(); track task.id)`, why `track task.id` and not the index?**

`track` tells Angular which DOM node corresponds to which item. Tracking by id means deleting a task in the middle removes exactly that `app-task-item` and leaves the rest untouched; tracking by index would make every item after it look changed and force Angular to re-bind them. The id is stable and unique because the service generates it from a private counter.

**Why the built-in `@if` / `@for` / `@empty` blocks instead of `*ngIf` and `*ngFor`?**

They are the current control-flow syntax and need no imports — `CommonModule` appears in none of my `imports` arrays. `@empty` is the concrete win here: the "No tasks yet" message is a first-class branch of the loop instead of a separate `*ngIf` on `tasks.length === 0` that I would have to keep in sync with the loop's own condition.

**`Task` is an `interface`, not a `class`. Defend that.**

The task is data, not behaviour. An interface is erased at compile time, so there is no runtime cost and no place to hang logic that belongs in the service — the mutation rules stay in one file. A class would only earn its keep if the model had methods or needed `instanceof` checks, and neither applies.

**`completed` is a boolean, but the filter is a union type. Why model the two differently?**

I chose a boolean for `completed` because the task has exactly two states and no transition rules between them, so `'active' | 'completed'` would add a type without adding a guarantee. The union earns its place in `type Filter = 'all' | 'active' | 'completed'`, where there are three values with no boolean equivalent and an invalid string really would be a bug — there the union turns it into a compile error.

**`TaskForm` reads the input through a template reference variable passed into `submit(input)` rather than `ngModel` or a reactive form. Why, and where does that stop working?**

For a single uncontrolled text field I chose the template reference because it needs no `FormsModule`, no form state and no extra signal — `submit()` trims the value, ignores whitespace-only input, calls `addTask` and clears the box. It stops working the moment I need validation messages, a disabled submit button or multiple fields, which is where a reactive form takes over — the pattern project 03 introduces.

**Why is `id` generated by a private `nextId++` counter in the service rather than `Date.now()`?**

Because `Date.now()` is not unique: two tasks created in the same millisecond would share a value, and both `track task.id` and `toggleTask(id)` depend on uniqueness. The counter is private so no component can fabricate an id — id generation is the service's business, and it is exactly the field a real backend would own with a database sequence.

**The presentational component still decides its own appearance with `[class.completed]="task().completed"`. Why bind a class instead of toggling it in code?**

Because the strikethrough is a pure function of state, and binding declares that relationship once. I chose `[class.x]` over adding and removing a class imperatively so there is no second place that can drift out of sync with `completed` — the CSS owns the look, the signal owns the truth, and the template is the only join between them.


**`TaskList` does `tasks = this.taskService.tasks`. What is the risk in that line?**

It re-exposes the service's `WritableSignal` under a public field, so anything holding a `TaskList` — including its own template — could call `tasks.set([])` and bypass `addTask` / `toggleTask` / `deleteTask` entirely, which would break the "service is the only writer" rule the whole architecture rests on. I chose the plain alias for readability in a first project, but the correct boundary is exposing `tasks.asReadonly()` from the service and keeping the writable handle private — that is the change I would make first if this code were reviewed.

**Your template calls `currentFilter.set('all')` directly on the button, yet toggle and delete go through `toggleTask()` / `deleteTask()` methods on the component. Why the inconsistency?**

The two are different kinds of write: the filter is the component's own local signal, so setting it inline keeps a three-button group from needing three one-line methods, while toggle and delete cross into the service and I wanted that crossing named in the component's API rather than reached through in markup. I would defend the split, but not strongly — the consistent alternative is a single `setFilter(f: Filter)` method, and if a fourth filter or any logic on selection appeared I would write it.

**Why `input.required<Task>()` and `output<number>()` instead of the `@Input()` / `@Output() EventEmitter` decorators?**

I chose the signal-based API because `input()` gives me a signal I read as `task()` — it participates in the same reactive graph as everything else in the app, so the template and any future `computed` track it automatically instead of relying on change detection. `input.required` also makes a missing `[task]` a compile-time error rather than an `undefined` at runtime, and `output()` drops the `EventEmitter` import and its RxJS baggage for a plain emitter.

**Your route is `{ path: '', component: TodoPage }`. When would you switch it to `loadComponent`?**

I chose the eager `component` form because there is exactly one route: lazy-loading the only page would add a second chunk that is fetched immediately anyway, so it would cost a request and buy nothing. `loadComponent` starts paying off as soon as there are routes a given user may never visit — an admin area, a rarely used detail page — which is why later projects in the roadmap use it and this one does not.

**What is `provideBrowserGlobalErrorListeners()` doing in `appConfig`, and what does the providers array represent?**

`appConfig` is the standalone replacement for the root `NgModule`: instead of `imports`/`providers` on `AppModule`, the application injector is configured with an array of provider functions passed to `bootstrapApplication`. I kept `provideBrowserGlobalErrorListeners()` — it hooks the browser's global `error` and `unhandledrejection` events into Angular's `ErrorHandler`, so a failure outside a component's own code path is still reported through Angular rather than only reaching the console.

**The service ships with three hardcoded tasks and `nextId = 4`. What is wrong with that pair, and where would the data really come from?**

They are coupled by hand: the seed ends at id 3, so the counter has to start at 4, and if I edited the seed without editing the counter the next `addTask` would produce a duplicate id and break `track task.id`. I chose seed data so the page is not empty on first load in a demo project, but the honest fix is deriving the counter from the seed (`max(id) + 1`) — and in any real version the list would arrive from an HTTP call and the ids from the database, which is exactly what project 04 replaces this with.

**`filteredTasks` is a `switch` over the filter union with no `default` branch. Why does that compile, and what does it buy you?**

Because `Filter` is a closed union of three literals and every one has a `case` that returns, TypeScript's exhaustiveness analysis sees no path that falls through, so the inferred return type stays `Task[]` and not `Task[] | undefined`. I chose to leave the `default` off deliberately: if I later add a fourth filter value to the union, the missing branch turns into a compile error right here instead of silently returning `undefined` at runtime.

**Every component uses `templateUrl` and `styleUrl` rather than inline `template`. What does that mean for the CSS?**

I chose separate files because even at this size the templates and stylesheets are long enough that inlining them would bury the class in string literals. The CSS matters more than the split: Angular's default view encapsulation rewrites each component's styles with a generated attribute selector, so `.task-item` in `task-item.css` cannot leak into another component — that is what let me name classes plainly, and why the shared look lives in CSS custom properties rather than in a global stylesheet each component would depend on.

## Business Rules

**Where does the "a task must have a non-empty title" rule actually live, and is that the right place?**

It lives in `TaskForm.submit()`: it trims the input value and returns early if the result is empty, so the service is never called. I chose to validate at the entry point because it is the only writer's only caller today, but the honest weakness is that `addTask(title: string)` itself accepts anything — a second form, or a future HTTP-seeded call, could push an empty task in. If this grew, the guard would move into the service so the rule holds regardless of who calls it.

**Your validation is `input.value.trim()`. What inputs does that let through that you might not want?**

It rejects only whitespace-only titles. `"   buy   milk   "` becomes `"buy   milk"` — the inner whitespace survives — and there is no maximum length, no character restriction, and no duplicate check. I decided those were not rules this app has: it is a personal list where the user typed the string on purpose, so normalising further would be inventing a constraint the product does not need.

**Can two tasks have the same title? Was that a decision or an oversight?**

It was a decision: `addTask` does no lookup before appending, so duplicates are allowed. Identity here is the id, not the title — a user can genuinely have "call the bank" twice on the same day, and every operation (`toggleTask`, `deleteTask`, `track task.id`) keys on the id, so duplicates never confuse the app. A uniqueness rule would only make sense if the title meant something to the system.

**`toggleTask` flips `!task.completed` rather than taking the target value. What is the tradeoff?**

Flipping means the caller does not need to know the current state — `TaskItem` emits only an id — but it also makes the operation non-idempotent: calling it twice returns to the original state, so a double-click or a retried request undoes itself. I chose the flip because there is no network here and the click *is* the intent to invert. With a backend I would send the desired value, since a retry over the wire must not toggle twice.

**What happens if `toggleTask(99)` or `deleteTask(99)` is called with an id that does not exist?**

Nothing — silently. `map` finds no match and returns an equivalent list, `filter` removes nothing. I chose that because in this app the id can only come from a task the template just rendered, so a miss is impossible by construction. In a service talking to a backend that same silence would be a bug: a 404 has to be distinguishable from a successful delete, which is why the API version of this method returns a result instead of `void`.

**Delete removes the task immediately — no confirmation, no undo, no soft delete. Defend that.**

The cost of the mistake is one line of text the user can retype in two seconds, so I decided a confirm dialog would be friction charged on every delete to protect against a cheap error. Soft delete earns its place when the record has history, audit or references pointing at it — a to-do item in memory has none. `TaskList.deleteTask()` is the seam I would add a confirm to if the rule changed, which is exactly why that thin method exists.

**The counter reads "3 pending of 5 total" while the Active filter is on. Should it not count only what is shown?**

No, and it is deliberate. `pendingCount` and `totalCount` are `computed()` over `tasks()`, not over `filteredTasks()`, because they answer "how much work do I have left", which must not change just because I narrowed the view. The filter is a lens on the data; the counter is a fact about the data. Deriving them from different sources is the visible consequence of that split.

**The counter is wrapped in `@if (totalCount() > 0)` while the empty message comes from `@empty` on the loop. Those are two different emptiness tests — why?**

Because they are about different things: the counter is meaningless when there are no tasks at all, so it tests the real list; the empty message is a branch of the loop, so it fires when the *rendered* list is empty. I chose that on purpose for the counter, but it does expose the gap in the next answer.

**With two completed tasks and the Active filter selected, the list shows "No tasks yet". Is that correct?**

The behaviour is correct, the wording is not. `@empty` fires whenever `filteredTasks()` is empty, and under a filter that means "nothing matches", not "nothing exists" — telling the user they have no tasks when they have two is misleading. The fix is a message derived from the same two facts the counter already uses: "No tasks yet" only when `totalCount()` is 0, otherwise "No tasks match this filter". It is the one real business-rule defect in this project.

**Marking a task complete keeps it in the list. Why is "completed" not just "deleted"?**

Because they mean different things and the app supports both: completing records that the work is done, deleting says it should never have been there. Keeping completed tasks is what makes the Completed filter and the "pending of total" counter meaningful — if completion removed the row, both would be empty concepts. `toggleTask` is therefore reversible and `deleteTask` is not, which is the whole difference between them.

**New tasks always land at the end of the list, with no sort and no creation date. What rule is that?**

Insertion order is the ordering rule: `addTask` spreads the existing array and appends, so the list reads oldest-first and never reorders under the user. I chose that because there is nothing to sort by — the model has no `createdAt` and no priority, and the id is only a monotonic counter, not a domain value. Any real sorting (due date, priority) would need a field on `Task` first.

**`addTask` hardcodes `completed: false`. Could a task ever be created already complete?**

No, and that is the intended rule: creation always means "new work to do", so the flag is set by the service rather than accepted as an argument. It also keeps the form's contract to a single `string` — the component cannot express a state the domain does not allow. Anything that needs to exist as already-complete goes through `addTask` then `toggleTask`, which is one code path instead of two.

**If I delete task 3 and then add a task, does the new one get id 3?**

No — `nextId` only ever increments, so ids are never reused. That matters because `track task.id` maps DOM nodes to ids: recycling an id would let Angular associate a brand-new task with the node of the deleted one. It mirrors how a database sequence behaves, and it is why `nextId` is a private field on the service rather than derived from `tasks().length`, which *would* collide after a delete.

**A task's title can never be changed once it is created. Was renaming left out or ruled out?**

Ruled out for this project: `Task` is only ever written by the three service methods, and none of them touches `title` — `toggleTask` copies the task and replaces `completed` alone. I decided the update surface should be the smallest thing that makes the app usable, and correcting a typo is "delete and retype" at this size. Adding rename would mean an `updateTask(id, title)` on the service plus an edit mode in `TaskItem`, which is state the presentational leaf deliberately does not have.

**Classic to-do apps have "mark all complete" and "clear completed". Yours has neither. Why?**

Because every operation in `TaskService` is single-task by design: `toggleTask` and `deleteTask` both take one id, and there is no bulk entry point. I chose that because bulk actions are destructive at scale — "clear completed" removes several rows at once with no undo, which is a very different risk from deleting one line — and neither is needed to demonstrate the pattern this project is about. Both would be small additions over the same signal (`update` with a `map` or a `filter`), which is the point: the write model already supports them, the product does not ask for them.

**Submitting an empty box does nothing at all — no message, and the whitespace you typed stays there. Is that the behaviour you wanted?**

Half of it. `submit()` returns early before `addTask`, and because the early return happens before `input.value = ''`, three spaces stay in the box looking like unsubmitted input. I chose silence over an error message — refusing to create an empty task is self-evident, and a validation message for a field the user has not really filled in is noise — but not clearing the field is an oversight rather than a rule; the honest fix is to clear the input on the reject path too.

**If the Completed filter is selected and I add a task, where does it go?**

Into the list, and off the screen: `addTask` appends to `tasks`, `filteredTasks` recomputes and the new task fails the `completed` predicate, so the user sees nothing happen. The rule is that adding is independent of the view — the filter is a lens, not a mode — but the interaction is genuinely confusing, and the fix I would make is having `TaskForm` reset the filter to `'all'` on a successful add so the user always sees what they just created.

**A user types `<script>alert(1)</script>` as a title. What does your app do with it?**

It renders it as literal text, because `TaskItem` prints the title through `{{ task().title }}` and Angular escapes interpolated values by default — the markup never becomes DOM. I decided that meant no sanitising layer of my own was needed in `addTask`: the only way to reintroduce the hole would be binding the title through `[innerHTML]`, which nothing here does. That is also why the title needs no character restriction beyond the non-empty check.

## Technical Decisions

**Your `tsconfig.json` has `strict: true` plus `strictTemplates`. What does the Angular half add that the TypeScript half does not?**

`strict` type-checks the `.ts` files, but templates are compiled separately — without `strictTemplates` an expression like `[task]="task"` is only loosely checked and a type mismatch in markup reaches the browser. I kept the CLI defaults on purpose because this project's contracts live in the templates: `input.required<Task>()` and the `$event` types on `(taskToggled)` are only enforced end to end because the template compiler is strict too.

**`noImplicitReturns` and `noFallthroughCasesInSwitch` are on. Which decision in this code did that actually change?**

They are what turn `filteredTasks`' `switch` into a checked construct instead of a convention: every branch must return, and no case may fall into the next. I chose to leave the compiler flags at their strict defaults rather than relaxing them when the switch complained, because the alternative — a `default` branch returning `tasks()` — would have silently swallowed a future fourth filter value instead of failing the build.

**Your workspace has three tsconfig files. Walk me through the split.**

`tsconfig.json` holds the shared compiler options and references the other two; `tsconfig.app.json` compiles `src/**/*.ts` minus specs, and `tsconfig.spec.json` compiles only the specs and adds `types: ["vitest/globals"]`. I kept the split because merging them would leak test-only globals like `describe` into application code, where they would type-check and then fail at runtime. I also set `rootDir: "./src"` explicitly in the spec config so the two output trees stay parallel rather than depending on inference from whichever files happen to be included.

**`package.json` declares `vitest` and `jsdom`, `angular.json` has a `test` target, and your five `.spec.ts` files assert almost nothing. Isn't that dead configuration?**

The harness is real and green — `npm test` runs five specs — but they are CLI scaffold: each one instantiates its subject and asserts it is truthy, with no behaviour covered. I chose to keep and repair them rather than delete them: `task-item.spec.ts` was failing because `input.required<Task>()` has no default, so I fed it through `fixture.componentRef.setInput('task', task)`, and I deleted the one scaffold spec that asserted an `<h1>` the template no longer renders. Real behavioural testing is a project 07 step in my roadmap, and I would rather ship a compiling smoke suite and say plainly what it does not cover than delete the wiring and re-add it later.

**Beyond `strict`, your `tsconfig.json` turns on `isolatedModules`, `noPropertyAccessFromIndexSignature`, `importHelpers` and `skipLibCheck`. Which of those do you actually feel?**

`isolatedModules` is the one that shapes the code: it forces every type-only import to be marked, which is why the service imports the model as `import type { Task }` — the file must be compilable on its own by esbuild, which never sees the whole program. `importHelpers` is why `tslib` is a runtime dependency: the downlevelling helpers are imported from one shared package instead of being re-emitted into every file. `skipLibCheck` and `noPropertyAccessFromIndexSignature` are build-speed and safety defaults I left alone because nothing in this app has an index signature to trip over.

**Your `angular.json` has `root: ""`, one project, and `newProjectRoot: "projects"`. What shape of workspace is that, and why does the `prefix` matter?**

It is a single-application workspace: the app sits at the workspace root rather than under `projects/`, which is what `ng new` produces when you are not building a monorepo of libraries. `prefix: "app"` is what makes the schematics generate `selector: 'app-task-item'`, and the reason a prefix exists at all is collision: an unprefixed `<task-item>` can clash with a custom element or a library component, and the prefix is the convention that keeps my components identifiable in the DOM.

**Your production build sets budgets of 500 kB warning / 1 MB error on the initial bundle. Do you know what this app actually ships, and what would move that needle?**

This app is far under it — an Angular 21 standalone app with no UI library, no HTTP client and no state library is essentially the framework plus a few kilobytes of my own code. I kept the default budgets because their value is the alarm, not the number: the thing that would move the needle is a dependency, so the budget is what tells me the day I add Material or a chart library that I have doubled the download for one screen.

**There is also an `anyComponentStyle` budget of 4 kB. Why does a per-component style budget exist at all?**

Because component styles are emitted per component rather than shared, so a large stylesheet duplicated across components inflates the build in a way an initial-bundle budget alone would not attribute to anything. My largest component stylesheet is well under a kilobyte, which is the intended shape: the theme lives in global custom properties and each component ships only its own layout.

**Your `defaultConfiguration` is `production` for build and `development` for serve. What is different about the development configuration?**

Development turns `optimization` off, `extractLicenses` off and `sourceMap` on, so `ng serve` rebuilds fast and the debugger shows my TypeScript rather than minified output. Production instead adds `outputHashing: "all"`, which fingerprints every emitted file so a deploy can be cached aggressively and still never serve a stale bundle. I chose to leave both defaults because they encode exactly the tradeoff each mode wants: build speed while I work, cache safety when I ship.

**The builder is `@angular/build:application`. What did that replace, and what does the "application" part mean?**

It is the esbuild/Vite-based builder that replaced the old webpack `browser` builder, which is where the fast dev server and rebuild times come from. `application` rather than `browser` means the builder is also capable of emitting a server bundle — SSR, prerendering — and I declared only the `browser` entry point, so this stays a purely client-rendered SPA. That was the right call for a static to-do list with no SEO surface and no data to fetch on the server.

**Your `package.json` has no `zone.js` dependency. What does that tell an interviewer about how change detection works here?**

That the app runs zoneless: Angular 21 no longer ships zone.js by default, so nothing monkey-patches `setTimeout` or `addEventListener` to trigger a global check. Change detection is driven by the signals themselves — `tasks`, `currentFilter` and the three `computed()` values mark exactly the views that read them as dirty. It is also why holding the list in a signal was not a stylistic choice here: with no zone, a mutated array would simply never repaint.

**`rxjs` and `@angular/forms` are in your dependencies, but neither appears in your application code. Defend that.**

`rxjs` is a peer requirement of the framework packages, so it stays whether I import from it or not. `@angular/forms` is genuinely unused — I read the input through a template reference variable rather than `ngModel`, so nothing imports `FormsModule` — and it is a leftover from `ng new`. It costs nothing in the bundle because tree-shaking follows imports rather than `package.json`, but I would remove it in a real repository so the dependency list does not overstate what the app uses.

**Angular is pinned with `^21.2.0` and TypeScript with `~5.9.2`. Why the different range operators?**

`^` accepts minor and patch updates, `~` only patches. Angular's compiler supports a specific TypeScript range, so a minor TypeScript bump can break the build — the CLI pins it with `~` for exactly that reason and I left it. It is the same reasoning behind `packageManager: "npm@10.8.2"`: the toolchain is a build input, and a build that only works on my laptop is not a build.

**Your global `styles.css` holds the entire palette as custom properties on `:root`, while every component has its own stylesheet. Why put the theme in the one place encapsulation does not reach?**

Because custom properties inherit through the DOM, they cross the emulated encapsulation boundary that ordinary selectors cannot, so `var(--accent)` resolves inside every component without any of them importing anything. I chose that split deliberately: the theme is the one thing that must be shared, so it is global and named; layout is the one thing that must not leak, so it stays in the component file where the generated attribute selector scopes it.

**You picked plain CSS with custom properties over Sass, Tailwind, or Angular Material. What did you give up?**

I gave up nesting, mixins and a component library I would otherwise have had for free. The tradeoff was deliberate for a first project: the point was to learn flexbox and the box model by hand, and a framework would have hidden both behind class names I could not explain in an interview. Custom properties also cover the one thing Sass variables are usually wanted for — a themeable palette — and unlike Sass variables they are live at runtime, so a theme switch would be an attribute change rather than a rebuild.

**Your global stylesheet starts with `* { margin: 0; padding: 0; box-sizing: border-box; }`. Is a universal-selector reset a good idea?**

It is a blunt instrument and I would defend it only at this size. `box-sizing: border-box` on everything is the part that genuinely earns its keep — it makes the padding on the task rows and the input predictable. Zeroing every margin means I re-add spacing by hand instead of getting sensible defaults for headings and paragraphs, which is why the modern alternative is a scoped reset that sets `box-sizing` inheritably and leaves typography alone.

**Your `body` rule sets `min-height: 100vh` and a `'Segoe UI'` system font stack with no webfont. Defend both.**

The font stack is a deliberate non-decision: no webfont means no extra request, no layout shift while it loads and no third-party host in the critical path, and the type in a to-do list carries no brand. `min-height: 100vh` is there so the dark background paints the whole viewport even when three tasks do not fill it — without it `body` is only as tall as its content and the page ends in a white band. I would revisit the unit rather than the rule: `100vh` overshoots on mobile browsers whose toolbars collapse, and `100dvh` is the fix.

**The palette is a dark theme written as hex literals with no light-mode alternative. Was that a design choice or a limitation?**

A choice, and an incomplete one. Naming the six colours as `--bg-primary`, `--accent`, `--text-muted` and so on means a light theme is a second block redefining those tokens — under `prefers-color-scheme: light` or a `[data-theme]` attribute — with no component stylesheet changing at all. I stopped at one theme because the styling step was about flexbox rather than theming, but the token layer is exactly what makes adding the second one cheap.

**In `task-list.css` the filter buttons use `background-color: var(--text-muted)`. What is wrong with that line?**

The token is named for a role it is not filling: `--text-muted` means "de-emphasised text", and I used it as a surface colour because the grey happened to look right. The consequence is that adjusting muted text later silently repaints the filter buttons. The fix is a token named for the role — `--surface-muted` — even if it holds the same hex today, because the point of a named palette is that the name, not the value, is the contract.

**`task-form.css` sets `outline: none` on the input and restyles `:focus` as a one-pixel accent border. Is that an even trade?**

No, and it is the line I would change first in that file. The default outline is the browser's keyboard-focus affordance, and replacing it with a border colour swap gives a one-pixel indicator against a dark field — visible if you are looking for it, not if you are tabbing. I chose it because the default outline broke the rounded corners, but the right fix keeps the affordance and restyles it: `outline: 2px solid var(--accent); outline-offset: 2px` on `:focus-visible`, which also stops the ring appearing on mouse clicks.

**Your delete button and submit button use `color: white`, while everything else in the app reads from a custom property. Why the exception?**

There is no reason, and that is the finding: `white` is the one colour in the app with no token behind it, so a theme change would repaint every surface and leave those two labels hardcoded. The palette already has `--text-primary` at `#eaeaea`, which is what those labels should read; if pure white is genuinely wanted on accent backgrounds it earns its own token — `--text-on-accent` — rather than a literal. It is the same failure as reusing `--text-muted` as a surface colour: the token layer only works if nothing bypasses it.

**The same button rules — padding, radius, `cursor: pointer`, `:hover { opacity: 0.85 }` — are copied into three component stylesheets. Why not extract them?**

Because encapsulation is per component, a shared button look has to live either in the global stylesheet or in a small shared component, and at three buttons I judged the duplication cheaper than either. That is the honest answer, and it is also the point at which I would change my mind: the moment a fourth button appears or the hover changes, I am editing three files to keep one look consistent, which is exactly the drift a global `.btn` class or an `<app-button>` would prevent.

**In `todo-page.css` you style the bare `h1` element rather than a class. Is that safe?**

It is safe only because of view encapsulation: Angular rewrites the selector with the component's generated attribute, so it matches this component's `h1` and nothing else in the app. I would keep it here — there is exactly one heading and a class would add a name with no information — but the same rule in the global stylesheet would be a real leak, and that distinction is what I would want a reviewer to see me making rather than a blanket "never style elements".

**Your task title is a `<span>` with a click handler while the delete control is a real `<button>`. What does that cost?**

It costs the toggle its keyboard and screen-reader affordance: a `span` is not focusable, does not respond to Enter or Space, and announces as plain text with no state. The correct markup is a checkbox input with a label — which gives keyboard access and the checked state for free — or at minimum a `button` with `aria-pressed`. I chose the span for the styling, which is the wrong reason, and it is the accessibility gap I would fix first in this file.

**The layout is a fixed `max-width: 600px` container with no media queries. Is it responsive?**

It is fluid rather than responsive, and for this content that is enough: `max-width` with `margin: 0 auto` means the container shrinks to the viewport below 600 px and centres above it, and the rows are flex containers that reflow on their own. I decided against breakpoints because nothing in the layout needs to change arrangement at any width — a single column stays a single column. A breakpoint would be earned by something like the filter bar needing to wrap, not by the page merely being narrow.

**Your `Task.id` is a `number` from an in-memory counter. Would you still choose `number` if this talked to a backend?**

Yes, with a different generator. A numeric primary key from a database sequence is the normal shape in the Spring Data + PostgreSQL stack I am targeting, so `number` maps cleanly onto a `Long` id and leaves `track task.id` and the service lookups unchanged. A UUID string earns its place when the client must create the id before the server sees it — offline-first or optimistic creation — which is a problem this app does not have.

**Assets come from a `public/` glob and `index.html` sets `<base href="/">`. What breaks if the app is deployed under a sub-path?**

Router-generated URLs and every root-relative asset path resolve against the base href, so serving the app from `/todo/` with `<base href="/">` gives 404s on the bundles and broken links on navigation. The fix is `ng build --base-href /todo/`, which rewrites the tag at build time rather than hardcoding the deployment path in source. I left `/` because the app is served from a domain root, but the distinction that matters is that this is a build flag, not a source edit.

**Persisting the list to `localStorage` is about fifteen lines. Why did you choose not to write them?**

Because it would have bought a feature at the cost of the concept the project exists to teach. Persistence means the signal is no longer the single source of truth — every write has to mirror to storage, the initial value has to be read and parsed with a fallback for corrupt JSON, and `Task[]` stops being a type I can trust because `JSON.parse` returns `any`. I decided to keep the service a pure in-memory writer here and let project 04 introduce persistence as its own subject, so that when the reads and writes get complicated the reactivity underneath them is already something I understand.

**You have Prettier and an `.editorconfig` but no ESLint. Why one and not the other?**

Prettier and EditorConfig settle formatting — 100-column width, single quotes, and the Angular HTML parser so templates with control-flow blocks are not mangled — which is mechanical and worth automating from day one. ESLint enforces rules, and at this size the only rules that would fire are ones the strict compiler already catches. I would add `angular-eslint` the moment the project has a second contributor or a CI step, since its real value is arbitrating disagreements I cannot have with myself.

