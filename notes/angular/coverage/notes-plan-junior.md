# Angular Junior Notes Plan

Plan status: current
Coverage: notes/angular/coverage/junior.md
Coverage SHA-256: 090fc3628c0017acfa06c306c24fbf39e9bcffca252e8a2187fd0cba5f0d84d5
Generated: 2026-10-03

## 00 — Angular in the browser

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/00-angular-introduction.md
Spanish: notes/angular/junior/es/00-introduccion-angular.md

Depends on: none

Pending additions: none

Narrative role: Establish Angular as a declarative browser framework for single-page applications, place it in Victor's Angular + Spring Boot stack, contrast its framework-owned conventions with React's library model, and map the complete junior route before syntax.

Learning outcome: Victor can explain what work Angular does in a single-page application, how it turns application state and events into UI, where it stops and the Spring Boot API begins, and why chapters 01 through 27 follow their declared order.

Prerequisites: none

Must answer:

- Which sections does this introduction itself walk through, in what order, and why does each one have to come before the next?
- What is a single-page application, what work does Angular do in one that would otherwise be written by hand against the DOM, and what kind of product is it used to build?
- What does Angular own between main.ts, application state, browser events, and the DOM?
- Where does the Angular application stop and the Spring Boot API begin — what does each own, and what travels between them?
- Which JavaScript, TypeScript, and React knowledge transfers directly, and where does Angular impose a different framework-level mental model?
- Why does the route from 01 through 27 start with bootstrap, one component and the state its template reacts to, grow into a component tree with directives, styles, dependencies and a lifetime, put the display formatters before the remote data and streams whose pages need them, then take forms, then navigation with its guards and interceptors, and only afterwards turn to rendering cost, delivery, tests, debugging, and legacy code?
- What must already be settled before chapter 01 is readable at all — what a TypeScript decorator is, what the CLI put in `src/` and which of those files chapter 01 opens, what the words "standalone" and "provider" name before they are taught, and how the dev server is started and stopped?

Coverage concepts: none

Rationale: This chapter carries no coverage bullet by design. It is the orientation that makes the rest of the route readable, and every concept it names is taught in the chapter that owns it. Its first and last questions are the two the rest of the route cannot supply: the map of the introduction's own sections, and the handful of assumptions chapter 01 makes silently and would be unreadable without.

Handoff: The map starts at the real entry point: chapter 01 follows main.ts into bootstrapApplication(), the root component, and application-wide providers.

## 01 — Application bootstrap

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/01-application-bootstrap.md
Spanish: notes/angular/junior/es/01-arranque-aplicacion.md

Depends on: 00

Pending additions: none

Narrative role: Start the executable journey at the application boundary that creates the root component and installs capabilities shared by the whole app.

Learning outcome: Victor can trace the browser's path from index.html through main.ts and bootstrapApplication() to the root standalone component, and explain why application-wide providers are registered there.

Prerequisites: 00

Must answer:

- How does the browser get from `index.html` to `main.ts` to the root component's element on the page?
- What runs first in a standalone Angular application?
- How does bootstrapApplication() connect the root component and application providers?
- What does it mean for a capability to be registered *at bootstrap*, and which parts of the running application can reach something registered there?

Existing-content migration: Move standalone component imports and flags to 02, NgModule material to 27, and component-provider scope to 08; retain this file for the real bootstrap boundary.

Coverage concepts:

- [ ] `bootstrapApplication()` — identify the standalone root component and the application-level providers that start a modern Angular application
- [ ] Application provider boundary — register application-wide capabilities at bootstrap rather than scattering their providers through component scopes

Rationale: The two concepts are one learning unit — the single call that starts the application and the configuration object handed to it. Component-level providers are named only as the alternative the provider-boundary bullet argues against; chapter 08 teaches them and returns to this boundary.

Handoff: Once the root exists, chapter 02 opens that component and explains how its class and its template exchange data.

## 02 — Components and template bindings

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/02-components-templates.md
Spanish: notes/angular/junior/es/02-componentes-plantillas.md

Depends on: 01

Pending additions: none

Narrative role: Build the first complete UI unit — one class, one template — and teach the bindings that carry values and events between the two, before any second component exists.

Learning outcome: Victor can write a standalone component, say what its `imports` array is for, move a value from class to template and an event from template to class with the right binding for each target, and decide which class members the template is allowed to read.

Prerequisites: 01

Must answer:

- How do the component class, its template, its styles, and its `imports` become one UI unit, and what does the build report when the template uses something `imports` does not list?
- What is the difference between rendering a value as text with `{{ }}` and assigning it to a property with `[]`, and how do you tell which one a given target needs?
- Why does `[attr.x]` exist at all, and what happens when a plain `[x]` binding targets an ARIA attribute that has no DOM property behind it?
- Why does the template only name a handler inside `()` and leave the behaviour to the class, what is `$event` when the handler does need the event, and how does `(keyup.enter)` say which keystroke it handles without the class inspecting that object?
- When is a template reference variable enough for an interaction, and what marks the point where the value should become state in the class instead?
- Which members does the template read and which only the class itself, what does the build do with a `private` member the template uses, and why does a component's `public` surface matter to code outside it — code that chapter 09 shows reaching the instance through a view query?

Existing-content migration: Move the `@if`/`@for`/`@switch`/`@let` sections to 04, inputs, outputs, and content projection to 05, class binding to 07, and lifecycle hooks and `@ViewChild` to 09; keep the component structure, the data-binding sections, and template reference variables here, and absorb the input-event sections (`(input)` vs `(change)` vs `(keyup)`, `$event.target.value`) from 15.

Coverage concepts:

- [ ] Standalone `@Component` — explain how Angular turns a class, template, and styles into a self-contained UI unit with directly declared dependencies
- [ ] Component `imports` — identify where a standalone template gets its directives, pipes, and child components; a missing import is a common practical-test failure
- [ ] Interpolation vs property binding — distinguish string rendering with `{{ }}` from assigning a DOM or component property with `[]`
- [ ] Attribute binding — reach for `[attr.x]` when the target is an HTML attribute with no DOM property behind it, such as an ARIA attribute or an SVG attribute, because a plain `[x]` binding on those silently sets nothing
- [ ] Event binding — handle a template event with `()` and explain why the template delegates behaviour to the component class
- [ ] Key event modifiers — filter a keyboard event in the binding itself with `(keyup.enter)` rather than inspecting the event object in the component, so the template states which keystroke it handles
- [ ] Template reference variables — capture a template element, directive, or component instance for a local interaction without turning it into application state
- [ ] Component member visibility — a component's public members are an API other code reaches through dependency injection and queries, so members only its template reads are `protected` and members only the class itself uses are `private`; the template compiler can read `protected` but rejects `private` at build time

Rationale: These eight concepts are everything that happens inside one component: what it is made of, how values and events cross between class and template, and which members the template may see. Control flow (04) and parent/child communication (05) were split out of this entry on 2026-10-03: each is a separate mental model with its own outcome, and with all three in one file the learning outcome had become a list. `imports` is shown here with one built-in pipe used as an unexplained example, because nothing a template can import has been taught yet; chapters 05, 06 and 11 each return to `imports` when they introduce a child component, a directive and a pipe. The member-visibility bullet sits here because its build-time rule is about the class/template boundary; the reason a public member is an API — other code reaching the instance — is borrowed in one sentence and taught in 09.

Handoff: One component can now show values and react to events, but every value so far was fixed when the class was written. Chapter 03 gives the class a value that changes and a template that follows it.

## 03 — Signals: state the template reacts to

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/03-signals.md
Spanish: notes/angular/junior/es/03-senales.md

Depends on: 02

Pending additions: none

Narrative role: Give the component a value that changes: a signal holds it, the template reads it by calling it, and Angular re-renders what read it — the model every later chapter's inputs, queries and remote state are written in.

Learning outcome: Victor can hold component state in a signal, change it with `set()` or `update()` without mutating the old value, derive a read-only value with `computed()`, and say which values are source state and which are derivations.

Prerequisites: 02

Must answer:

- Where does a component keep a value that changes, what must the template write to read it, and what dependency does Angular record at that read?
- How does `update()` differ from `set()`, and why must the next value be a new array or object rather than the old one changed in place?
- What does `computed()` store, when is it recalculated, and why can nothing write to it?
- Which values are source state that belongs in a `signal()`, and which are derivations that belong in a `computed()` — and what goes wrong when a derivation is kept in a second signal and synchronised by hand?

Existing-content migration: Move the `effect()` sections and the localStorage-initialisation pattern to 10; retain `signal()`, reading and updating, `computed()` and its patterns, and the signals-vs-regular-variables comparison here.

Coverage concepts:

- [ ] `signal()` — hold reactive local or service state and read it by calling the signal rather than treating it as a plain value
- [ ] `set()` vs `update()` — replace state directly or derive the next immutable value from the previous one
- [ ] `computed()` — derive read-only state from signals so the value stays consistent without manual synchronisation
- [ ] `signal()` vs `computed()` — keep writable source state in a signal and expose read-only derivations through a computed signal
- [ ] Immutable updates with signals — replace object or array references so state changes remain predictable across signals and `OnPush` views

Rationale: These five concepts are the minimum reactive model, and they come third because the chapters that follow are written in it: the control-flow blocks of 04 branch on changing state, the `input()` of 05 is itself a signal read by calling it, and the lifecycle chapter asks how a signal input changes. Effects, read-only exposure and the memoised lookup wait for chapter 10, after the injection context and the owner's lifetime they depend on. The immutable-updates bullet names `OnPush` views only as a second beneficiary of the same reference rule; chapter 22 teaches `OnPush` and reads this rule back.

Handoff: The component now holds state that changes; chapter 04 lets its template decide what to render when that state is a condition, a set of variants, a list, or not there yet.

## 04 — Template control flow

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/04-template-control-flow.md
Spanish: notes/angular/junior/es/04-control-flujo-plantillas.md

Depends on: 02, 03

Pending additions: none

Narrative role: Give the template its own decisions: which block exists in the DOM for a condition, a known variant, a collection, an empty collection, or a value that has not arrived.

Learning outcome: Victor can choose `@if`, `@switch`, `@for` with `track`, and `@empty` from the shape of the data in front of him, explain what Angular creates, reuses, and destroys in the DOM for each, and render a possibly-missing value without asserting it into existence.

Prerequisites: 02, 03

Must answer:

- What does `@if` do to the DOM that hiding an element with CSS does not, and why does that make mutually exclusive states easier to read?
- When several conditions test the same value, what does `@switch` state that a chain of `@if` blocks leaves the reader to work out?
- What does Angular do to the existing DOM nodes when the array behind `@for` changes, and how does the `track` expression decide which nodes are reused and which are recreated?
- What exactly does `@empty` report, and why can a filtered list not explain its own emptiness from the loop alone?
- How does a template render data that may still be `null` or `undefined`, and what does a non-null assertion hide that safe navigation or an explicit branch keeps visible?

Existing-content migration: Absorb the `@if`, `@for`, and `@switch` sections from 02. The `@let` section of that file carries no coverage bullet at this level; keep it only where an example here needs a local template name.

Coverage concepts:

- [ ] `@if` — branch on a condition so mutually exclusive UI states stay readable instead of being hidden with CSS
- [ ] `@switch` — express a value's known variants as fixed cases instead of chaining conditions that repeat the same subject
- [ ] `@for` and `track` — render collections with stable identity so Angular can reuse DOM nodes instead of recreating them
- [ ] `@empty` — attach a collection's empty case to the loop instead of a sibling condition, and recognise that it reports only that the loop's own expression rendered nothing, so a filtered list must consult its unfiltered source to say why it is empty
- [ ] Safe navigation and nullish template values — render data that may not exist yet without hiding an invalid domain assumption behind broad non-null assertions

Rationale: The five concepts answer one question — what exists in the DOM for the data the component holds right now — and share one mechanism: Angular creates and destroys blocks of the template rather than hiding them. Nullish values belong here rather than with the bindings of 02 because the honest way to handle a value that is not there yet is a branch, and the branch is what this chapter teaches.

Handoff: A single component can now render any shape of its own data; chapter 05 splits the screen into a parent and its children and makes that data cross between them.

## 05 — Component communication: inputs, outputs, and projection

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/05-component-communication.md
Spanish: notes/angular/junior/es/05-comunicacion-componentes.md

Depends on: 02, 03, 04

Pending additions: none

Narrative role: Introduce the second component: data flows down through inputs, events flow up through outputs, markup flows in through projection, and the types declared at that boundary decide what the parent's own guarantees are worth.

Learning outcome: Victor can place a child component in a parent's template and design its public contract — optional and required inputs, typed outputs, a projection slot — explain `[()]` as the input/output pair it abbreviates, and keep a narrow domain type intact across the boundary.

Prerequisites: 02, 03, 04

Must answer:

- How does a parent's template place a child — what are the child's `selector` and its entry in the parent's `imports` for, and what does the build report when that entry is missing?
- How does a parent hand data to a child, how does the child read it, and why is an optional `input()` whose value is absent handled explicitly instead of given a default that reads as real data?
- What does `input.required()` change about *when* a missing value fails, and where does that failure appear?
- How does a child tell its parent that something happened without knowing what the parent will do about it, and what does the parent's handler receive?
- Why does the type a child declares on its `input()` and `output()` decide what the parent's own narrowing is worth?
- Which two bindings does `[()]` abbreviate, what naming must the pair follow for it to work, and when is writing the two halves separately clearer?
- When should a reusable wrapper receive markup through `ng-content` instead of growing another configuration input, and which component's class do the bindings inside the projected markup read from?

Existing-content migration: Absorb the inputs-and-outputs and content-projection sections from 02.

Coverage concepts:

- [ ] `input()` — receive optional parent-to-child data and handle its absence explicitly instead of hiding it behind a default that reads as real data
- [ ] `input.required()` — declare mandatory parent-to-child data so a missing value fails at the template boundary rather than as an undefined read later
- [ ] `output()` — send typed child events to a parent without making the child depend on the parent's implementation
- [ ] A child's `input()` and `output()` types are part of the domain boundary — declaring them as `string` when the parent's state is a narrow union re-widens the value at the boundary, so the narrowing a runtime check bought survives only inside the parent and the compiler stops rejecting a filter value nothing can match
- [ ] Two-way binding — recognise `[()]` as property plus event binding and decide when explicit one-way data flow is clearer
- [ ] Content projection with `ng-content` — recognise when a reusable wrapper should receive markup rather than a growing list of configuration inputs

Rationale: All six are the same boundary seen from different directions: what a child accepts, what it reports, and what it lets the parent place inside it. An input is read as the signal chapter 03 taught, which is why that chapter comes first. Two-way binding is taught here and not with the bindings of 02 because it can only be explained as an input plus an output, neither of which exists before this chapter. The child-boundary typing bullet belongs here rather than with the language topics because the value it re-widens crosses an Angular `input()`/`output()` declaration.

Handoff: A component tree can now pass data, events, and markup. Chapter 06 turns to behaviour that attaches to an element without owning a view of its own.

## 06 — Attribute directives and the host element

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/06-directives-styles.md
Spanish: notes/angular/junior/es/06-directivas-estilos.md

Depends on: 02, 03, 05

Pending additions: none

Narrative role: Separate the component, which owns a view, from the attribute directive, which adds behaviour to an element someone else wrote — and name that element, the host, which the style chapter after this one keeps returning to.

Learning outcome: Victor can decide whether a behaviour needs a component or an attribute directive, write a directive that reads and changes its host through host bindings and listeners, and recognise the built-in attribute directives he has already been using.

Prerequisites: 02, 03, 05

Must answer:

- When does behaviour need its own template, and when should it augment an element that already exists?
- What is a directive's host element, and how does a directive set a property or a class on it and listen to its events — in the `host` metadata, and in the `@HostBinding`/`@HostListener` decorators older directives use — without taking ownership of its view?
- How is a directive applied in a template and given a value, and what must the using component list in `imports`?

Existing-content migration: Move the `NgClass` and `NgStyle` sections to 07, `ngModel` to 27, and `@ViewChild`/`ngAfterViewInit` to 09; retain "What is a directive?" and the custom attribute directive here.

Coverage concepts:

- [ ] Components vs attribute directives — use a component when behaviour owns a view and a directive when behaviour augments an existing host element
- [ ] Custom attribute directives and host interaction — implement reusable host-element behaviour and connect host properties or events through directive host bindings and listeners without taking ownership of the element's view

Rationale: Two bullets, one idea: behaviour attached to a host element rather than to a view. It was separated from the style material on 2026-10-03 because the old entry held two mental models — host behaviour and style scope — under one label. The directive here works through `host` metadata only; reaching the host by injecting `ElementRef` waits for chapter 08, where injection is taught.

Handoff: The host element now has a name. Chapter 07 uses it for presentation: which classes and styles land on an element, and how far a component's own stylesheet reaches from its host.

## 07 — Component styles and the style boundary

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/07-component-styles.md
Spanish: notes/angular/junior/es/07-estilos-componentes.md

Depends on: 02, 05, 06

Pending additions: none

Narrative role: Establish where presentation belongs: bindings that switch a class or a style on one element, the stylesheet that belongs to one component, the boundary that keeps it from reaching into another, and the global sheet for what must cross that boundary.

Learning outcome: Victor can apply conditional classes and styles, locate a component's CSS, explain why a component rule does not style a child component's internal elements, style the host itself, and decide which rules belong in the global stylesheet.

Prerequisites: 02, 05, 06

Must answer:

- When does one `[class.x]` or `[style.x]` binding do the job, and what do `ngClass`/`ngStyle` add when a maintained template applies several at once?
- Where does a component's CSS live — `styleUrl`, the older `styleUrls`, or inline `styles` — and why is none of the three the global stylesheet?
- How does view encapsulation keep a component's rules from reaching a child component's internal elements, and what does Angular add to the DOM to do it?
- How does a component style its own host element, and why does that need `:host` rather than a rule written against its own selector?
- Which rules still belong in the global stylesheet, and why is `::ng-deep` something to read in maintained code but not to write in new code?

Existing-content migration: This file was the unassigned `_legacy/10-component-styles.md`; it already holds view encapsulation, `:host`, global vs component styles, and `::ng-deep`. Absorb class binding from 02 and the `NgClass`/`NgStyle` sections from 06, and add `styleUrl`/`styleUrls` vs inline `styles`.

Coverage concepts:

- [ ] Conditional class and style binding — use focused class and style bindings for dynamic presentation and recognise `ngClass` or `ngStyle` when maintained templates apply several values together
- [ ] `styleUrl`/`styleUrls` vs inline `styles` — locate a component's styles and choose external files or small inline rules without confusing either form with global CSS
- [ ] View encapsulation — explain how Angular scopes emulated component styles with generated attributes and why a component rule does not normally style a child component's internal elements
- [ ] `:host` selector — target the component host from its own stylesheet when the custom element itself needs layout or state styling
- [ ] Global vs component styles — keep application-wide rules and library overrides at the global boundary while leaving component-specific presentation with its component
- [ ] `::ng-deep` recognition — recognise the deprecated encapsulation escape hatch in maintained code and prefer supported library APIs, global rules, or explicit styling boundaries for new work

Rationale: The six concepts answer one question — which CSS reaches which element — from the single binding outwards to the global sheet. `ngClass` and `ngStyle` are read here as the built-in attribute directives chapter 06 explained, and `:host` as a rule about the host element that chapter named. The existing legacy note on component styles is this entry's English file because it already teaches four of the six bullets, which the directives file never did.

Handoff: Components and directives can now present themselves; what they still lack is collaborators. Chapter 08 explains how Angular creates and scopes the services they depend on.

## 08 — Dependency injection and provider scope

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/08-dependency-injection.md
Spanish: notes/angular/junior/es/08-inyeccion-dependencias.md

Depends on: 01, 02, 05

Pending additions: none

Narrative role: Explain the injector graph before lifecycle work, so services, configuration tokens, aliases, factories, instance-sharing decisions, and the window in which injection is possible at all share one construction model.

Learning outcome: Victor can resolve class and non-class dependencies, compare injection styles, configure each provider recipe, predict from the component tree whether consumers share an instance, and say when an injection context exists and what a failure inside one costs the application.

Prerequisites: 01, 02, 05

Must answer:

- How does an injector turn a requested token into an instance or configured value?
- How is a value that has no class — a configuration object, a string — requested from the injector, and what does `InjectionToken<T>` supply that a class type supplies for free?
- When a component asks for a dependency, where does Angular look first and in what order — its own `providers`, its ancestors', then root — and which components see a provider declared on one component?
- How do root and component provider locations change lifetime and shared mutable state, and what belongs in the bootstrap `providers` of chapter 01 rather than in a component's?
- When do useValue, useClass, useFactory, and useExisting create, compute, or alias a dependency?
- When should maintained code use constructor injection, and why does current code normally prefer `inject()`?
- Why does `inject()` work in a field initializer and throw in a method, and how is the dependency carried into the method instead?
- Who catches an exception thrown while the injector is building a root singleton, and what does the user see when nobody does?

Existing-content migration: Absorb the component-provider material currently in 01 and retain service, injector, token, recipe, and scope material here.

Coverage concepts:

- [ ] Angular dependency injection — explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves
- [ ] `@Injectable({ providedIn: 'root' })` — recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton
- [ ] `inject()` — obtain a dependency in an injection context without a constructor parameter, the style current Angular code prefers
- [ ] Injection context — recognise that `inject()` and the APIs built on it, such as `takeUntilDestroyed()`, resolve their dependency only while a class is being constructed, so calling one from a method needs the reference captured as a field and passed explicitly
- [ ] Constructor injection — read and write the parameter-based style still common in maintained code, without confusing construction with lifecycle work
- [ ] A root singleton's field initializer has no error boundary above it — the injector builds that service
  while the application is starting, so anything thrown there fails the whole bootstrap to a blank page
  instead of degrading one feature, and when the throw comes from persisted state the failure repeats on
  every reload; work that reads anything the app does not control belongs behind a call that can return
  a safe value
- [ ] Provider scope — distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- [ ] `InjectionToken` — inject typed configuration or other non-class dependencies through a token rather than a class type
- [ ] Configured provider recipes — recognise `useValue`, `useClass`, `useFactory`, and `useExisting`, including that `useExisting` aliases an existing provider rather than creating another class instance

Rationale: The assigned concepts form the single learning unit "Dependency injection and provider scope": one construction model, read from the token requested to the instance returned. Provider scope needs the component tree of chapter 05, because "which consumers share an instance" is a question about ancestors. The injection-context bullet names `takeUntilDestroyed()` only as an example of an API built on `inject()`; this chapter borrows that one fact and chapter 14 teaches the operator itself.

Handoff: After Angular constructs an instance, chapter 09 explains when its inputs, view, and destruction boundary become available.

## 09 — Component lifecycle, view queries, and cleanup

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/09-component-lifecycle.md
Spanish: notes/angular/junior/es/09-ciclo-vida-componentes.md

Depends on: 02, 03, 05, 08

Pending additions: none

Narrative role: Teach Angular-controlled timing separately from object construction, so input-dependent work, view queries, work that needs the rendered DOM, and cleanup each run only after what they depend on exists.

Learning outcome: Victor can place work in the constructor, ngOnChanges, ngOnInit, ngAfterViewInit, `afterNextRender`, or a destruction callback, explain the exact state Angular has established at each point, and make a view query return the value he needs rather than the one its locator defaults to.

Prerequisites: 02, 03, 05, 08

Must answer:

- Why are constructor and ngOnInit not interchangeable?
- When a parent passes a new value to an input after the first render, which hook runs, what does `SimpleChanges` hold for each input that changed, and why does `ngOnInit` not run again — for the signal inputs of chapter 05 and for the legacy decorator inputs previewed here before chapter 27 revisits their syntax?
- When are view queries safe, and how do query type and static timing affect that answer?
- When a template reference sits on a component's host element, what does the query return by default, and how does `read` ask for the DOM node — or for `TemplateRef` or `ViewContainerRef`, each named and defined in one clause and neither taught at this level — from that same element instead?
- Which work needs the rendered DOM, such as measuring an element or placing initial focus, and what does `afterNextRender` guarantee that a lifecycle hook does not, given that hooks also run when a component is rendered on a server, where there is no DOM to read?
- How do DestroyRef and ngOnDestroy prevent timers, listeners, and other resources from outliving a view, and why is subscription cleanup deferred until Observables are taught in chapter 14?

Existing-content migration: Absorb the lifecycle-hook and `@ViewChild` sections from 02, the `@ViewChild`/`ngAfterViewInit` sections from 06, and the "What is DestroyRef?" section from 12.

Coverage concepts:

- [ ] `constructor` vs `ngOnInit` — reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs
- [ ] `ngOnChanges` — react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- [ ] View queries and `ngAfterViewInit` — treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences
- [ ] Query `read` option — a query's locator decides both which element matches and which value comes back, so a template reference on a component host returns the component instance; `read: ElementRef` retrieves that element's DOM node instead, and `read: TemplateRef` or `read: ViewContainerRef` other values from the same element
- [ ] `afterNextRender` — schedule work that needs the painted DOM, such as measuring an element or placing initial focus, so it runs after the next render and only in a browser, where a lifecycle hook would also run during server-side rendering with no DOM to read
- [ ] Destruction cleanup — tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view

Rationale: The assigned concepts are one timeline — construction, inputs, view, render, destruction — and each names what is safe to do at one point on it. The two bullets added on 2026-10-03 extend it where the view is concerned: `read` decides what a query hands back, and `afterNextRender` is the point at which the view not only exists but has been rendered in a browser. Three things are named without being taught, because they carry no bullet at this level: server-side rendering, as the reason `afterNextRender` is browser-only, and `TemplateRef` and `ViewContainerRef`, as the other values `read` can return.

Handoff: With ownership and lifetime clear, chapter 10 returns to signals for the parts that needed both: side effects that must be cleaned up, and state a service owns.

## 10 — Effects and signal ownership

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/10-effects-signal-ownership.md
Spanish: notes/angular/junior/es/10-efectos-propiedad-senales.md

Depends on: 03, 08, 09

Pending additions: none

Narrative role: Finish the signal model now that services and lifetimes exist: an effect synchronises signal state with something outside the graph and cleans up after itself, a service keeps the writes to its own state, and a derivation is shaped so the graph can cache it.

Learning outcome: Victor can say which work is an effect and which is a derivation, register an effect's cleanup, keep a live signal reference instead of a stale snapshot, expose service state read-only, and turn a per-key question into one memoised lookup.

Prerequisites: 03, 08, 09

Must answer:

- What is an effect for — which work counts as an external side effect, when does it run the first time and when again, and in which context must it be created?
- Why is an effect that copies one signal into another the wrong tool, and what does a `computed()` do in its place?
- How is the work the previous run started — a timer, a listener — cancelled before the next run, and again when the effect's owner is destroyed?
- Why is a value read once from a signal and stored in a field no longer reactive, and what must be kept instead?
- How does a service stay the only writer of its own state while consumers still read it reactively?
- Why does `computed()` take no arguments, and what shape must a per-key question take to be derived once instead of rescanned per caller?

Existing-content migration: Absorb the `effect()` sections and the localStorage-initialisation pattern from 03.

Coverage concepts:

- [ ] `effect()` — perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state
- [ ] `computed()` vs `effect()` — choose a returned derived value for UI state and an effect only for synchronisation with an external system
- [ ] `effect()` cleanup function — register cleanup inside an effect so work started by the previous run is cancelled before it re-executes or the injection context is destroyed
- [ ] Signal reference vs snapshot — preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot
- [ ] `asReadonly()` — expose a service's writable signal as a read-only handle so consumers stay reactive while the service's own methods remain the only writers
- [ ] Deriving the lookup rather than the predicate — answer a per-key question by deriving the whole lookup structure once, because `computed()` takes no arguments by design and a parameterised method cannot be memoised

Rationale: Each of the six needs something chapter 03 did not have: an effect is created in the injection context of 08 and destroyed with the owner of 09, and `asReadonly()` and the snapshot bullet are about state that lives in an injected service. The `effect()` cleanup bullet stays with `effect()` rather than with subscriptions because it is the effect's own contract, and the note demonstrates it with a timer or listener rather than a stream. The coverage section's remaining bullet — derived state outliving a reload — is assigned to 12, because it cannot be shown before a loading state exists.

Handoff: State is now owned, derived, and synchronised. The pages built from here on print dates and numbers, so chapter 11 teaches the template's formatter before chapter 12 fetches anything to format.

## 11 — Template pipes

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/11-pipes.md
Spanish: notes/angular/junior/es/11-pipes.md

Depends on: 01, 02, 08

Pending additions: none

Narrative role: Teach the template's display-transformation primitive, including the two things a formatting pipe reads that the template does not show — the time zone and the application locale — before RxJS introduces the async pipe, and while deferring the pure-versus-impure execution mechanism until change detection.

Learning outcome: Victor can apply, parameterise, and chain built-in pipes, predict what `DatePipe` prints for a date-only value and under a given locale, and write a custom pipe that keeps business logic out of template transformation.

Prerequisites: 01, 02, 08

Must answer:

- What problem does a pipe solve without changing source state?
- How is a built-in pipe applied, given an argument and chained with another, and what must the component import for it?
- Why does a `YYYY-MM-DD` value print as the neighbouring day when a time zone such as `'UTC'` is passed to `DatePipe`, and which users see it?
- Where do `DatePipe` and the other formatting pipes get the order of day and month and the month names from, what has to be registered and provided before another locale works, and what does an explicit format pattern fix whatever the locale is?
- How is a custom pipe written and used — the `@Pipe` name, `transform()` and its arguments, and its entry in `imports`?
- Which transformations belong in a pipe, and which belong in component or domain logic?

Existing-content migration: Move the existing AsyncPipe section to 14, where Observable subscription semantics are established.

Coverage concepts:

- [ ] Built-in pipes — apply Angular's standard display transformations such as `DecimalPipe`, `DatePipe`, and `SlicePipe` in the template instead of duplicating formatting logic in the component class
- [ ] `DatePipe` and a date-only value — a `YYYY-MM-DD` string is read as local midnight, so passing a different time zone such as `'UTC'` moves the instant across midnight and the pipe prints the neighbouring day for every user on the far side of UTC; a calendar date is formatted in the zone it was read in
- [ ] Application locale — `DatePipe` and the other formatting pipes read `LOCALE_ID`, which defaults to `en-US`; another locale needs its data registered with `registerLocaleData` and `LOCALE_ID` provided at bootstrap, while an explicit format pattern fixes its own order whatever the locale would choose
- [ ] Custom pipes — extract a reusable pure display transformation behind a pipe without hiding business logic or expensive impure work in it

Rationale: The assigned concepts form the single learning unit "Template pipes": the built-in formatters, the two hidden inputs that decide what a date formatter prints, and the custom pipe. The locale bullet leans on chapter 08 for `LOCALE_ID` being a provider and on chapter 01 for where it is provided. The custom-pipes bullet names "impure work" only as something to keep out; chapter 22 teaches what pure and impure mean for execution.

Handoff: Pipes can now transform synchronous template values; chapter 12 brings in values that arrive later, over HTTP, and chapter 14 returns to the `async` pipe once subscription semantics are established.

## 12 — HTTP requests and remote UI states

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/12-http.md
Spanish: notes/angular/junior/es/12-http.md

Depends on: 01, 03, 08

Pending additions: none

Narrative role: Connect state to the backend through one-request HTTP streams while keeping runtime data trust, request immutability, duplicate execution, failure, and every state a remote page can be in — including the second time it loads — visible.

Learning outcome: Victor can issue a typed HttpClient request, construct immutable parameters, explain cold execution, handle success and failure in `subscribe()`, read an `HttpErrorResponse`, and model loading, empty, error, success, and refetch states without one of them hiding another.

Prerequisites: 01, 03, 08

Must answer:

- What is an Observable, what does calling `subscribe()` on one actually start, and what does "cold" mean for the request?
- How is HttpClient registered, injected, and called from a service boundary — for a read, and for a write that sends a body — and what do the `with...()` features passed to `provideHttpClient()` switch on?
- Why can two subscriptions send two requests, and why does HttpClient<T> not validate runtime JSON?
- Why must HttpParams be reassigned or chained?
- What does each `subscribe()` callback receive, and what must the error callback do so the page is not left showing a spinner or the previous data after a failed request?
- How does `HttpErrorResponse` tell an error the backend answered with from a request that never got an answer, and where is the backend's own error body?
- Which transitions distinguish loading, empty, error, and success?
- When a page that already shows rows loads again, why should those rows stay on screen and be dimmed rather than be replaced by the first-load spinner?
- Once the previous result is kept during a reload, what does a derived test such as "the result is empty" describe while the new request is in flight, and what must it also read to stop hiding the loading state?

Existing-content migration: Move the RxJS operator sections (`map`, `tap`, `switchMap`, `debounceTime`, `forkJoin`, `combineLatest`) and Observable-vs-Promise to 13, `catchError` and `takeUntilDestroyed` to 14, "What is DestroyRef?" to 09, HTTP interceptors to 21, and environment configuration to 23; retain HttpClient, request construction, `subscribe` callbacks, and the loading/error/data pattern here.

Coverage concepts:

- [ ] `provideHttpClient()` and its feature functions — enable `HttpClient` application-wide at bootstrap and opt into behaviour such as the Fetch backend or interceptors through explicit `with...()` features instead of separate providers
- [ ] Typed `HttpClient` requests — call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON
- [ ] `HttpParams` immutability — build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged
- [ ] Cold HTTP Observables — recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls
- [ ] `subscribe()` callbacks — handle next and error outcomes deliberately and keep presentation state consistent after a failed request
- [ ] `HttpErrorResponse` — inspect status and error payload while distinguishing a backend error response from a client-side or network failure
- [ ] Remote UI states — represent loading, empty, error, and success explicitly so a page does not treat a successful response as its only possible state
- [ ] A refetch is not a first load — a page that already holds rows keeps them on screen and dims them while the replacements arrive, because removing them says the content is gone rather than that it is being replaced; only a first load, which has nothing to keep, may render the spinner in the content's place
- [ ] Derived state outlives the data it describes — once a value survives a reload instead of being cleared, every predicate over it keeps answering about the **previous** load while the next one runs, so a test such as "the result is empty" has to say which load it describes or it will suppress the very state announcing that one is in flight

Rationale: The assigned concepts are one request followed from the call to the state the page renders for it. Three placements differ from the coverage sections. `subscribe()` callbacks comes from the RxJS section because a page cannot represent an error state without the error callback. The derived-state bullet comes from the Signals section because it needs a loading state, which does not exist before this chapter. And the interceptor bullets left for 21 on 2026-10-03: an interceptor's shared response handling is an RxJS pipeline (14) and its session-expiry rule needs the router and the one-time notice (17, 18), none of which the reader has here. `provideHttpClient()` names interceptors only as one of its `with...()` features.

Handoff: One request, one subscription, one set of states. Chapter 13 generalises the Observable into pipelines that transform, combine, and replace requests.

## 13 — RxJS operators: transforming, combining, and flattening streams

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/13-rxjs-pipelines.md
Spanish: notes/angular/junior/es/13-flujos-rxjs.md

Depends on: 03, 12

Pending additions: none

Narrative role: Generalise from one finite HTTP stream to composition: what a stream is beside a Promise and a Subject, how operators transform and combine emissions, and how a flattening operator decides what happens to the previous inner request when a new trigger arrives.

Learning outcome: Victor can read and build a pipeline with `pipe()`, choose between `map()` and `tap()` and between `forkJoin()` and `combineLatest()`, and pick `switchMap()`, `mergeMap()`, `concatMap()`, or `exhaustMap()` from what should happen to work already in flight.

Prerequisites: 03, 12

Must answer:

- How do Observable, Promise, and Subject differ in when the work starts, how many values arrive, whether it can be cancelled, who is allowed to push a value in, and whether each subscriber starts its own work (cold) or shares one source (hot)?
- What is an operator, what does `pipe()` do with a chain of them, and when does any of it run?
- Why are the streams in this chapter named with a trailing `$`, and what does that suffix change at run time?
- When does a Subject earn its place as a trigger, and why is it the wrong default container for state that chapter 03 already gave to signals?
- When do map and tap transform or merely observe a value, and what goes wrong when a side effect is written inside `map()`?
- Why does forkJoin wait for completion while combineLatest continues emitting latest combinations, and what does each do when one source never completes or never emits?
- Why do nested subscriptions hide cancellation, errors, and cleanup, and what does a flattening operator put in their place?
- What does `switchMap()` do to the inner request still in flight when a new value arrives, and why is that right for a search term and wrong for a save?
- When should mergeMap, concatMap, or exhaustMap control inner work instead, and what does each do with a trigger that arrives while the current work is still active?
- How do `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` each remove a different wasted request from a search box?

Existing-content migration: Move this file's `toSignal()`/`fromSignal()` sections to 14 and absorb the operator and Observable-vs-Promise sections from 12; this chapter keeps composition and flattening only.

Coverage concepts:

- [ ] `Observable` vs `Promise` — compare stream composition and cancellation with a single eventual Promise while recognising that Observables may be cold or hot and may emit once or many times
- [ ] `Observable` vs `Subject` — distinguish a declarative subscribable stream from a subject that can be imperatively fed and multicast, rather than using a subject as the default state container
- [ ] `Observable` naming and `$` convention — read established code that marks streams with a trailing `$` without assuming the convention changes runtime behaviour
- [ ] `map()` vs `tap()` — transform emitted data with `map()` and reserve `tap()` for observation or side effects
- [ ] `forkJoin()` vs `combineLatest()` — coordinate one-time completion or continuing latest-value streams according to source behaviour
- [ ] Nested subscriptions vs flattening operators — compose dependent asynchronous work in one pipeline so cancellation, errors, and cleanup remain visible
- [ ] `switchMap()` — cancel a stale inner request when a newer search term or route value arrives
- [ ] `switchMap()` vs `mergeMap()` — cancel replaceable work with `switchMap()` and preserve deliberate concurrent inner work with `mergeMap()` instead of choosing by habit
- [ ] `concatMap()` vs `exhaustMap()` — queue ordered inner work with `concatMap()` and ignore new triggers with `exhaustMap()` while current work is active, especially for writes and form submissions
- [ ] Search pipeline operators — combine `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` to avoid premature, duplicate, and stale requests

Rationale: One mental model: values over time passing through operators, and the four policies for inner work that overlaps. How a stream ends — error, completion, unsubscribe — and who subscribes to it are a second model and were given chapter 14 on 2026-10-03, when the RxJS material reached eighteen bullets. The `$` naming bullet comes from the legacy coverage section because this is the first chapter whose variables carry the suffix, and a convention used for fourteen chapters before it is explained is a term used before it is taught. "Wrong for a save" borrows one fact, that cancelling does not un-send a write, which chapter 14 traces in full; the "route value" half of the `switchMap()` bullet is exercised in chapter 18, where a route parameter is the stream.

Handoff: The reader can now build a pipeline; chapter 14 covers how one ends — with an error, a completion, or an unsubscribe — and who is responsible for subscribing in the first place.

## 14 — RxJS errors, cleanup, and consumption

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/14-rxjs-errors-consumption.md
Spanish: notes/angular/junior/es/14-rxjs-errores-consumo.md

Depends on: 03, 08, 09, 11, 12, 13

Pending additions: none

Narrative role: Follow a stream to its end: where an error is caught and what the stream does afterwards, what runs on every ending, what unsubscribing does to a request already sent, and which of the template, a signal, or the component class should own the subscription.

Learning outcome: Victor can place `catchError()` so the right stream survives, choose between `EMPTY`, a fallback value, and a rethrow by what the subscriber must still do, clear state in `finalize()`, tie a subscription to its owner's lifetime, and decide between the `async` pipe, `toSignal()`, and a manual `subscribe()`.

Prerequisites: 03, 08, 09, 11, 12, 13

Must answer:

- What may `catchError()` return, and what makes "return an empty list" a silent conversion of a failure into a success?
- Why does a `catchError()` placed after a flattening operator end the whole interaction stream, and where must it sit for the next trigger to still work?
- After `catchError()` returns `EMPTY`, which of the subscriber's callbacks run, and what is skipped that a fallback value would have reached?
- What does `finalize()` guarantee that the same line duplicated in the success and error callbacks does not?
- Which streams need explicit cleanup and which complete on their own, and how do the `async` pipe and `takeUntilDestroyed()` tie a subscription to the lifetime chapter 09 described?
- What does unsubscribing do to an HTTP request that has already left the browser, and why can cancelling a write — by destroying the component or through `switchMap()` — never tell the user whether it was saved?
- When should the template own a subscription through the `async` pipe, and when does a side effect justify an imperative `subscribe()`?
- What does `toSignal()` give a template that a manual subscription writing into a signal does not, and when is the manual form still the right one?

Existing-content migration: Absorb the `async` pipe section from 11, the `catchError` and `takeUntilDestroyed` sections from 12, and the `toSignal()` sections from 13.

Coverage concepts:

- [ ] `catchError()` — recover, translate, or rethrow an error without silently converting every failure into successful empty data
- [ ] `catchError()` placement around flattening operators — recover inside an inner request when the outer interaction stream must remain alive and catch outside only when terminating the whole pipeline is intended
- [ ] Recovering with `EMPTY` vs a fallback value — a `catchError()` that returns `EMPTY` completes the stream without emitting, so the subscriber's `next` never runs and anything it would have restored is skipped on the failure path; emitting a fallback keeps one code path for both outcomes, and state that must hold either way belongs in `finalize()` or in both branches explicitly
- [ ] `finalize()` — clear loading or other lifecycle state when a stream completes or errors without duplicating cleanup across success and failure callbacks
- [ ] Subscription cleanup — use the `async` pipe or `takeUntilDestroyed()` for long-lived streams; do not overstate the leak risk of finite `HttpClient` Observables that complete
- [ ] Cancelling an in-flight `HttpClient` request — unsubscribing aborts the browser request but never undoes a write the server already received, so a teardown or `switchMap()` that cancels a mutation leaves its outcome unknown to the client rather than reversed
- [ ] `async` pipe vs manual subscription — prefer template-managed subscription for displayed streams and subscribe imperatively only when a side effect requires it
- [ ] `toSignal()` vs manual subscription — expose a displayed Observable as signal state while keeping imperative subscription for deliberate multi-step side effects

Rationale: Every concept here is about a stream's ending or its owner. The in-flight cancellation bullet comes from the HTTP coverage section but is taught here because both things that cancel a request — an operator from 13 and the teardown this chapter teaches — are known only at this point. This is the chapter that pays three earlier debts: the `takeUntilDestroyed()` mention of 08, the subscription cleanup deferred by 09, and the `async` pipe deferred by 11.

Handoff: Every page so far has read data. Writing it starts with a form, so chapter 15 builds one — and chapter 16 will read that form's changes as exactly the kind of stream this chapter just closed.

## 15 — Reactive forms: the control model and validation

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/15-reactive-forms.md
Spanish: notes/angular/junior/es/15-formularios-reactivos.md

Depends on: 02, 04, 06, 08

Pending additions: none

Narrative role: Start the write side of the application: model user input as a typed tree of controls that lives in TypeScript, connect it to the template, attach the rules that decide whether it is valid, and show the result to the user only when it helps.

Learning outcome: Victor can build a typed form from controls, groups, and arrays, bind it to the template, validate a single control and a pair of related controls, say exactly what a built-in validator accepts, and display errors after interaction or a submit attempt.

Prerequisites: 02, 04, 06, 08

Must answer:

- How do FormControl, FormGroup, FormArray, and FormBuilder describe the form's shape, and what does FormBuilder change other than the amount of typing?
- How is the control tree bound to the template — `ReactiveFormsModule` in `imports`, `[formGroup]`, `formControlName` — and what does each directive link to what?
- What does a typed form know about each control's value and nullability, and what invalid state does a cast hide?
- When is a dynamic list of controls a FormArray rather than a FormGroup with invented keys?
- Which rules do the built-in validators express, and what does a failed one leave on the control for the template to read?
- Why does a control holding only spaces pass `Validators.required`, and what happens when the server trims the same value before checking it?
- What does a custom validator function receive and return, and why must it be pure?
- Why can a validator declared on one control not compare it with another, where does a cross-field rule have to be attached, and where does its error then appear?
- Why are errors shown only once a control is `touched` or a submit was attempted, and what does `markAllAsTouched()` change — and not change — about the form?

Existing-content migration: Move the `reset()`, `patchValue()`, `dirty`, `setErrors()`, `onSubmit`, and duplicate-check sections to 16 and the input-event sections (`(input)` vs `(change)` vs `(keyup)`, `$event.target.value`) to 02; retain the control model, template binding, validators, error display, and `FormArray` here.

Coverage concepts:

- [ ] `FormControl` and `FormGroup` — model individual controls and grouped control sets explicitly so the form's shape, validators, and value types live in TypeScript rather than in the template
- [ ] `FormBuilder` — construct the same control model with less ceremony, recognising it as concise syntax over `FormControl` and `FormGroup` rather than a different forms model
- [ ] Typed reactive forms — keep control nullability and value types aligned with the API model so casts do not hide invalid form states
- [ ] `FormArray` vs `FormGroup` — model a dynamic indexed collection separately from a fixed set of named controls
- [ ] Built-in validators — combine rules such as `required`, `email`, `min`, and `maxLength` at the control boundary
- [ ] What `required` actually tests — it reports an error only when the value is null or its length is zero, so a
  control holding whitespace alone satisfies it, and a server rule that trims before measuring refuses the same
  value the form accepted
- [ ] Custom validators — return `null` or a keyed error object from a pure validation function so templates can identify the failed rule
- [ ] Cross-field validators — attach the rule to the `FormGroup` rather than to a control, because a validator only ever receives the control it is declared on, and recognise that the resulting error lands in the group's own `errors` rather than on either of the compared fields
- [ ] Validation display state — combine invalid state with `touched` or submit state so errors are helpful without appearing before interaction
- [ ] `markAllAsTouched()` — surface all invalid controls after a submit attempt without changing whether the form is valid

Rationale: The form's shape and the rules over that shape are one unit: a validator is declared on a node of the tree and its error lands on that node, which is exactly why a cross-field rule has to move up to the group. Running the form — values, submission, server errors, change streams — was split into 16 on 2026-10-03, when the forms material reached nineteen bullets. `touched` is taught here because validation display is the first thing that reads it; `dirty` waits for 16, where the form's saved baseline is taught. The form directives are read as the attribute directives of 06, and `FormBuilder` is obtained through the injection of 08.

Handoff: The form now has a shape and knows whether it is valid; chapter 16 runs it — prefills it, submits it, takes the server's verdict back, and reacts while the user types.

## 16 — Reactive forms: values, submission, and change streams

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/16-form-values-submission.md
Spanish: notes/angular/junior/es/16-valores-envio-formularios.md

Depends on: 12, 13, 14, 15

Pending additions: none

Narrative role: Put the form to work across its life: fill it from existing data, submit what it actually holds, tell an edited form from a clean one, bring the server's errors back onto the right controls, and observe its changes as streams without reacting to the form's own housekeeping.

Learning outcome: Victor can prefill, submit, and reset a form deliberately, explain why a disabled control is missing from `form.value`, place an error no validator can compute and predict when it disappears, map backend field errors to controls, and subscribe to value and interaction events without firing on his own programmatic changes.

Prerequisites: 12, 13, 14, 15

Must answer:

- What does `setValue()` demand that `patchValue()` does not, and which of the two tells you that an edit form and its model have drifted apart?
- What does the submit handler do, in order — `(ngSubmit)`, the check on `invalid`, the value it reads — and why is disabling the button not the validation?
- Why are disabled controls absent from form.value, and when is getRawValue() correct?
- What does `dirty` record, what clears it, and why is it the right question to ask before discarding a form?
- When must an error be attached with `setErrors()` because no validator function can compute it, and when does the next validator run overwrite it?
- How should backend validation errors return to the relevant controls, and why does the client's own validation not make the server's redundant?
- What does `reset()` restore, and how can it wipe a server error the user has not read yet?
- What does `valueChanges` emit and when, and how does a dependent field or a filter become one pipeline instead of a handler on each input?
- Why does a `setValue()`, `reset()`, or `disable()` made by the code reach a `valueChanges` subscriber exactly like typing does, and when is `emitEvent: false` the fix?
- Which changes does `valueChanges` never report, and what does subscribing to a control's `events` make observable — `touched`, for instance — that was not observable before?

Existing-content migration: Absorb the `patchValue()`, `reset()`, `dirty`, `setErrors()`, `onSubmit`, and duplicate-check sections from 15.

Coverage concepts:

- [ ] `setValue()` vs `patchValue()` — choose strict full-shape assignment or deliberate partial updates when prefilling edit forms
- [ ] Disabled controls and `getRawValue()` — recognise that a disabled control is excluded from `form.value` and opt into its value only when the submission contract requires it
- [ ] `dirty` — distinguish a form the user has actually edited from an untouched one, for example to guard discarding unsaved changes
- [ ] `setErrors()` for rules a validator cannot express — attach a keyed error to a control from code when the check needs data a validator function cannot reach, such as a uniqueness lookup, recognising that the next validator run clears it again
- [ ] Client vs server validation — use form validation for immediate feedback while treating backend validation as authoritative and mapping field errors back to the relevant controls
- [ ] `reset()` and server errors — reset the saved baseline and avoid losing backend errors through an immediate validator rerun
- [ ] Form `valueChanges` — compose dependent-field and filtering behaviour as an Observable without nesting manual event handlers
- [ ] `emitEvent: false` — a programmatic change through `setValue`, `patchValue`, `reset`, `enable` or `disable` emits on `valueChanges` and `statusChanges` exactly like a user edit, so a subscriber written to react to typing also fires on the form's own housekeeping unless those calls suppress the event
- [ ] The control event stream — `AbstractControl.events` emits one typed stream of `ValueChangeEvent`, `StatusChangeEvent`, `PristineChangeEvent` and `TouchedChangeEvent`, which is what makes an interaction state like `touched` observable at all: `valueChanges` never reports it, so a side effect that marks a field touched can only be answered by subscribing to the control's events, and `markAsUntouched({ emitEvent: false })` is what keeps that answer from re-entering

Rationale: These nine concepts are the form in motion rather than at rest, and they share one thread: every one of them is about a value or a state that changes after the form was built, and about who is told. The server-validation bullets need the `HttpErrorResponse` of 12; the three change-stream bullets need the Observable model of 13 and the cleanup of 14.

Handoff: Forms now provide a value, a dirty state, and submit semantics. Chapters 17 and 18 put those pages behind URLs, and chapter 20 uses `dirty` to guard the way out.

## 17 — Routing: routes, outlets, and navigation

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/17-routing.md
Spanish: notes/angular/junior/es/17-enrutamiento.md

Depends on: 01, 02, 06, 08, 13, 14

Pending additions: none

Narrative role: Give the application more than one screen: a route table maps URLs to components, outlets say where each one is rendered, and links and code move between them — with the consequence that the router, not the component, now decides what is alive.

Learning outcome: Victor can register the router, define routes and nested routes, decide what sits outside the outlet and therefore survives navigation, navigate from a template and from code, title every page, mark the active link for the eye and for assistive technology, and say what the router reports when the user picks the page already shown.

Prerequisites: 01, 02, 06, 08, 13, 14

Must answer:

- How is the router switched on with `provideRouter()`, what does one route definition contain, and how does a URL change become a different component without the page reloading?
- Where does a routed component get rendered, and what exactly does the router destroy on each navigation?
- Which parts of the UI must sit outside the outlet to survive that, and why does a badge in a routed page reset while the same badge in the shell does not?
- When a feature has its own layout with several pages inside it, where does the second outlet go, and which of the two components is destroyed when the user moves between those pages?
- Why does `routerLink` behave differently on an `<a>` than on a `<div>`, and what does the user lose in the second case?
- When does navigation belong in the template as `routerLink`, and when must the component work out the destination and call `Router.navigate()`?
- Who sets the browser tab's title after a navigation, why does a route table that titles only some routes keep showing the previous page's title, and where is a brand suffix added once for every page?
- How does the router mark the active link with a class and with `aria-current`, and why does a link to `/` stay marked everywhere until `{ exact: true }`?
- What does the router emit when the user navigates to the URL already shown, why does code that closes a drawer on `NavigationEnd` miss that case, how is the event stream narrowed to the two event types that matter (`filter()`), and how is its subscription ended with the shell?

Existing-content migration: Move route parameters, query params, and `Location.back()` to 18, the default route, wildcard, and lazy loading to 19, and both guard sections to 20; retain route definitions, `RouterOutlet`, `routerLink`, and the `Router` service here.

Coverage concepts:

- [ ] Router bootstrap and outlet — register routing with `provideRouter` and give routed components a rendering location with `RouterOutlet`
- [ ] Route definitions and `routerLink` — map paths to components and move between them declaratively so the application becomes navigable
- [ ] `routerLink` on a host that is not an anchor — the directive writes an `href` only on an `<a>`, so on any other element the click still navigates while the tab stop, the `link` role and the browser's context menu are silently absent
- [ ] Application shell outside the outlet — place chrome that must survive navigation in the root component around `RouterOutlet`, because the router destroys and recreates the routed component on every navigation
- [ ] Child routes and nested outlets — model a feature's route hierarchy so its shared layout remains mounted while child content changes
- [ ] Declarative vs programmatic navigation — use `routerLink` in templates and `Router.navigate()` when component logic determines the destination
- [ ] Route titles — declare `title` on every routed page so the router sets the document title after each navigation; the default `TitleStrategy` writes only when the deepest primary route resolves a title, so a route table titled in part keeps the previous page's title, and a `TitleStrategy` subclass provided in its place formats every title, such as a brand suffix, in one place
- [ ] `routerLinkActive` — let the router add a class to the link whose route is currently active instead of comparing the URL by hand in the component, and set the accompanying `aria-current` through the directive's own `ariaCurrentWhenActive` input rather than a second hand-written attribute binding
- [ ] `routerLinkActiveOptions` exact matching — recognise that an active link matches by URL *prefix* by default, so a link to the root path stays active on every route until `{ exact: true }` narrows it to the whole URL
- [ ] Same-URL navigation is skipped, not completed — navigating to the URL already shown emits `NavigationSkipped` instead of `NavigationEnd` under the default `onSameUrlNavigation: 'ignore'`, so code that reacts to the user choosing a destination, such as closing a navigation drawer, listens for both

Rationale: These concepts are the router's structural half: what is rendered where, what is destroyed, and how the user moves. They were separated from URL-carried state (18) on 2026-10-03, when the routing coverage grew from twenty-six to thirty-six bullets and the old single chapter would have held twenty-two. The `routerLinkActive` bullet was reworded in coverage since the last plan — its accessibility clause now presents `ariaCurrentWhenActive` as replacing a second hand-written attribute binding — and its question follows the new wording. `routerLink` and `routerLinkActive` are read as the attribute directives of 06. Router events appear here for the first time, through the same-URL bullet; they are read as the Observable of 13, narrowed with `filter()`, which no bullet owns and this chapter introduces in one clause, and cleaned up as 14 taught. The outcome of `Router.navigate()` is left to 20, because both of its failure cases — a guard and a lazy chunk — are taught after this chapter.

Handoff: The reader can put a page at a URL and move between pages, and knows the routed component dies on the way. Chapter 18 answers what that costs — the page's state — and where that state has to live instead.

## 18 — The URL as view state

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/18-url-view-state.md
Spanish: notes/angular/junior/es/18-estado-vista-url.md

Depends on: 03, 08, 14, 17

Pending additions: none

Narrative role: Make the URL the source of truth for a routed page: identity in the path, optional view state in the query string, both read as the untrusted text they are — and mark the two edges of that idea, the event that must not be stored in a URL and the direct link that arrives with no history and asks the server for a file that does not exist.

Learning outcome: Victor can declare and read route and query parameters safely, decide which state belongs in the URL and which must be handed over once, return the user somewhere real with or without in-app history, and explain why a deep link that works on the dev server fails on a static host.

Prerequisites: 03, 08, 14, 17

Must answer:

- How does a routed component learn which resource it is showing, and how is the `:id` segment declared in the route and filled in by a link?
- What type does `paramMap.get()` return whatever the model declares, and how does a conversion that no longer matches the identifier fail without an error?
- When is a snapshot enough, and when must the same component instance react to a later parameter change — in which navigation does the router keep that instance, against the general rule of chapter 17 that a navigation destroys the routed component?
- What separates a query parameter from a route parameter, and how does a link set one declaratively so the destination page can be reproduced from its URL?
- Why is a query parameter untrusted, and what does the page render when an unrecognised value is asserted into the filter union instead of rejected?
- Which state has to go in the URL because the routed component and its signals are destroyed on navigation, and how is the view rebuilt from it on return?
- Why is "your session expired" an event to hand over once through a service rather than a flag in the query string, and what goes wrong on a reload or from a bookmark when it is put in the URL?
- Why go back through `Location` instead of linking to one fixed page, when does `Location.back()` leave the application entirely, and how does a back control know it has somewhere in-app to return to?
- When the browser asks the server for `/login` directly, which file is it asking for, what must the host answer and with which status, why did the dev server never show the problem, and what does `HashLocationStrategy` trade to avoid it?

Existing-content migration: Absorb the route-parameter, query-param, and `Location.back()` sections from 17.

Coverage concepts:

- [ ] `ActivatedRoute` route params — read route identity from `paramMap` so a routed component knows which resource it is showing
- [ ] A route parameter is always text — `paramMap.get()` yields `string | null` whatever the model declares, so converting it is a decision that has to agree with the identifier's real type; a conversion that no longer matches fails silently, because the lookup simply finds nothing and the view renders as if the record did not exist
- [ ] `ActivatedRoute.snapshot` vs observable params — use a snapshot for a one-time value and subscribe when the same component instance can receive later parameter changes
- [ ] `ActivatedRoute` query params — read optional Angular view filters from `queryParamMap` without making them part of the resource path
- [ ] A query param is untrusted text — `queryParamMap.get()` yields `string | null` however narrow a union the view's filter declares, and any value can be typed into the address bar or survive in a shared link, so an unrecognised one is rejected at the read and the default restored; asserting it into the union instead selects a filter no record can match, and the view answers with its ordinary empty state, which is indistinguishable from a genuinely empty result
- [ ] `[queryParams]` on `routerLink` — set optional view state on the destination URL while navigating declaratively so the resulting page stays linkable and reproducible
- [ ] Routed view state in the URL — keep state the user must find again, such as a search term, in the URL and re-derive the view from it on load, because the router destroys the routed component and its signals on every navigation, so anything held only in fields is gone on return
- [ ] One-time notices across a navigation — the reason a user arrives somewhere, such as a session that expired, is an event handed over through a root service and cleared on read, not state placed in the URL, where a reload or a bookmark would replay it
- [ ] Browser history navigation — return to the previous entry through `Location` when a page is reachable from several routes, instead of hardcoding one destination that is wrong for every other caller
- [ ] A deep-linked page has no in-app history — `Location.back()` replays the *browser's* history, which on a URL opened directly (a shared link, a refresh, a new tab) holds the page the user came from outside the site, so a back control has to know whether this application performed an earlier navigation and fall back to a real in-app destination when it did not
- [ ] Deep links need a server fallback — the default `PathLocationStrategy` keeps routes in real URL paths, so a reload or a shared link asks the server for a file that does not exist; the host must rewrite every unknown path to `index.html` with a 200, a rewrite rather than a redirect so the router still reads the original path, which the development server does silently and a static host does not, while `HashLocationStrategy` avoids the fallback at the cost of `#` URLs

Rationale: Every concept answers the question chapter 17 left open — the routed component is destroyed, so where does its state live — and they share one answer with two limits. The answer is the URL: path for identity, query string for view state, both parsed as untrusted text. The limits are the one-time notice, which is an event and not state, and the deep link, which has to work with no in-app history and on a host that has only one real file. The server-fallback bullet is taught here rather than with production delivery in 23 because its mechanism is the router's location strategy.

Handoff: The reader can now rebuild a page from its URL; chapter 19 turns to the route table itself — how the router picks one route out of it and fetches the code that route needs.

## 19 — Route matching and lazy loading

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/19-route-matching-lazy-loading.md
Spanish: notes/angular/junior/es/19-coincidencia-rutas-carga-diferida.md

Depends on: 01, 08, 17

Pending additions: none

Narrative role: Open the first two stages of a navigation — pick the route that matches the URL, then fetch the code that route needs — and show how one stray static import silently undoes the second.

Learning outcome: Victor can order routes and redirects so the intended one matches, choose the lazy boundary for a page or for a whole feature, and find out why a route declared lazy is still inside the initial bundle.

Prerequisites: 01, 08, 17

Must answer:

- Why does a `**` route placed early swallow the whole application, and what does first-match-wins mean for redirects?
- When does an empty-path redirect need `pathMatch: 'full'`, and what does prefix matching catch without it?
- What are the initial bundle and a chunk, who decides which file a class is built into, and where can you see the result?
- What does `loadComponent` defer, what does the browser download and when, and when is a whole child route tree the right lazy boundary instead?
- If the route file also has an ordinary `import` of the lazily-loaded component at the top, which chunk does that component end up in, and what is the only symptom?
- Why does importing a single injection token from a library into the bootstrap configuration pull that library's whole entry point into the initial bundle, and where should the configuration go when only one lazy page renders the component it configures?

Existing-content migration: Absorb the default-route, wildcard, and lazy-loading sections from 17.

Coverage concepts:

- [ ] Wildcard routes and redirect order — place a `**` fallback last because Angular uses first-match-wins route evaluation
- [ ] Redirect `pathMatch` — use `pathMatch: 'full'` for an empty-path redirect when prefix matching would otherwise catch every URL
- [ ] Lazy route loading — use `loadComponent` or `loadChildren` to keep feature code out of the initial bundle until navigation requires it
- [ ] `loadComponent` vs `loadChildren` — lazy-load one routed component or an entire child route tree according to the feature boundary
- [ ] A static import of a lazily-loaded component cancels the split — the bundler follows the eager `import` at the top of the route file and keeps the component in the initial chunk, so the `loadComponent` arrow still runs with nothing left to fetch; nothing errors, the editor's auto-import is the usual cause, and the only symptom is a bundle that grew
- [ ] A provider's import is a static import too — importing only an injection token from a library entry point into the bootstrap configuration still loads that entry point, and every module it imports, with the initial bundle, so configuration for a component that only one lazy page renders belongs in that page's `providers`, where the element injector still reaches the component

Rationale: Matching decides which route, lazy loading decides which code arrives for it; both are properties of the route definition, and the two static-import bullets are the same lesson about the second — the bundler follows `import` statements, not intentions. Guards were given chapter 20 on 2026-10-03, when this material and theirs together reached fifteen bullets. The provider-import bullet leans on the injector lookup order of chapter 08 for why a page's own `providers` still reaches the component.

Handoff: The router has now chosen a route and loaded its code; chapter 20 adds the last stage — the guards that decide whether the navigation may complete, and what the caller is told when it does not.

## 20 — Route guards

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/20-route-guards.md
Spanish: notes/angular/junior/es/20-guards-rutas.md

Depends on: 08, 10, 16, 17, 18, 19

Pending additions: none

Narrative role: Finish the navigation pipeline: after a route matches and its code loads, guards decide whether the user gets in, which variant of a route is considered at all, and whether the user may leave — and the chapter closes on what a guard cannot enforce, what a refusal does to the browser history, and which surfaces a guard never reaches.

Learning outcome: Victor can write guards that admit or redirect declaratively, protect a whole branch from one parent, serve one URL with a route per role, protect unsaved work on the way out, handle a navigation that was refused or failed, and explain why none of this is authorisation.

Prerequisites: 08, 10, 16, 17, 18, 19

Must answer:

- What is a functional guard — when does the router call it, what does it receive, how is it attached to a route, and how does it reach a service?
- What does a guard read to decide — where does the application keep who is signed in?
- Why should a guard return a `UrlTree` rather than calling `Router.navigate()` itself?
- If several guards sit on one route, which of them has to agree, and why is that worth keeping authentication and authorisation apart?
- How does one guard on a pathless parent protect every page beneath it, and does it matter whether that parent renders a layout or nothing at all?
- What does a `false` from `CanMatchFn` make the router do that a `false` from `CanActivateFn` does not, how does that let two routes share one path, and what does it spare the browser from downloading?
- Why can a guard never be the enforcement of data access, no matter how correct it is?
- How does `CanDeactivateFn` use the `dirty` state from chapter 16, and what can still bypass it?
- When the user presses Back and a guard refuses, what has the browser already done to its history, and how do the router's default repair and `canceledNavigationResolution: 'computed'` differ once the user presses Back a second time?
- What does the promise returned by `Router.navigate()` resolve to when a guard cancels, what happens to it when a lazy chunk fails to load, and what does a component that disabled its button before navigating owe each case?
- What happens to guards, route parameters, and resolvers — the route-level hook that fetches a route's data before the component is created — when the same form is opened in an overlay the router never activated, instead of at a URL of its own?

Existing-content migration: Absorb the route-guard and `CanDeactivate` sections from 17.

Coverage concepts:

- [ ] `CanActivateFn` guards — return a boolean or `UrlTree` from a guard and avoid triggering a second navigation with an imperative redirect
- [ ] Stacked route guards — compose several guards on one route and recognise that every one must allow activation, which keeps authentication and authorisation as separate reusable checks
- [ ] Parent routes as the unit of protection — hang a branch of routes under a pathless parent that carries the shared `canActivate`, so every child inherits the check and a new page is protected by being added to `children` rather than by repeating the guard on each entry; the parent may be componentless or load a layout component, and the guard behaves the same either way
- [ ] `CanMatchFn` guards — decide whether a route definition is considered at all, so a `false` makes the router try the next route with the same path instead of cancelling the navigation, which lets one URL serve a variant per role and keeps a rejected lazy route's code from being downloaded
- [ ] Route guards vs backend authorisation — treat guards as client-side navigation control, never as enforcement of data access
- [ ] `CanDeactivateFn` guards — protect unsaved form state while recognising that browser or process termination may bypass application navigation
- [ ] A guard-cancelled Back and the session history — by the time a browser Back reaches a guard the browser has already moved its history, so a refusal has to put it back: the router's default `canceledNavigationResolution: 'replace'` restores the URL by rewriting the entry the user landed on, which spends one entry per refused Back until a further Back leaves the application, while `'computed'` answers with the opposite history move and returns to the same position
- [ ] `Router.navigate()` outcome — the returned `Promise<boolean>` resolves `false` when a guard cancels the navigation and rejects when a lazy route's code fails to load, so a component that locked its UI before navigating must handle both outcomes instead of firing and forgetting the promise
- [ ] Route-scoped features reach only routed surfaces — a guard, a resolver or a route parameter serves
  what the router activates, so a form opened in a dialog forfeits all three and its equivalent
  protection has to be rebuilt inside the dialog; choosing the surface is choosing the toolbox

Rationale: Everything here is the third stage of a navigation and what follows from it: who a guard admits, how guards compose, what a refusal costs, and where guards stop. The `Router.navigate()` outcome bullet closes the pipeline rather than opening chapter 17, because its two non-success cases are a guard's refusal and a failed lazy load, and both exist only after 19 and this chapter. The signed-in state a guard reads is a root service holding a signal — chapters 08 and 10 — and it is named here as the running example because chapter 21 expires that same state. The chapter borrows two things it does not own: the form `dirty` state taught in chapter 16, which `CanDeactivateFn` reads, and the word "resolver", which carries no coverage bullet at this level and is defined in the question that uses it rather than taught.

Handoff: Guards control navigation on the client and can only assume what the server will answer. Chapter 21 goes to the one place where the server's answer arrives for every request — the HTTP interceptor.

## 21 — HTTP interceptors and session expiry

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/21-http-interceptors.md
Spanish: notes/angular/junior/es/21-interceptores-http.md

Depends on: 12, 14, 17, 18, 20

Pending additions: none

Narrative role: Add the one place every HTTP request and response passes through, now that the three things an interceptor is built from are known — the request of chapter 12, the error pipeline of chapter 14, and the navigation and one-time notice of chapters 17 and 18.

Learning outcome: Victor can write a functional interceptor that attaches a token to a cloned request, decide which response handling is cross-cutting and which must stay with the feature, and recognise an expired session without mistaking a failed login for one.

Prerequisites: 12, 14, 17, 18, 20

Must answer:

- What does a functional interceptor receive and return, how is it registered, and in what order do several of them see a request and its response?
- Why must an interceptor clone a request before adding a header, and what happens when it tries to change the original?
- Which failures belong to a cross-cutting interceptor and which must remain visible to the feature that made the call, and how does an interceptor that sends its own request avoid intercepting itself without end?
- Why is a `401` an expired session only on a request that carried a token, and what does the user see on the login page when the interceptor treats the login call's own `401` the same way?
- How does an interceptor differ from the guards of chapter 20 in what it sees and in when it runs?

Existing-content migration: Absorb the "HTTP Interceptors" section currently in 12.

Coverage concepts:

- [ ] Functional HTTP interceptors — centralise auth headers and shared response handling without swallowing feature-specific errors or creating an interceptor loop
- [ ] Immutable interceptor requests — clone an `HttpRequest` before changing headers or other request properties because interceptor inputs are immutable
- [ ] Session expiry in an auth interceptor — treat a `401` as an expired session only on a request that carried a token, because the same status on the login call means wrong credentials, which the calling page must render rather than a global handler redirecting

Rationale: Three bullets, one mechanism. They were taught inside the HTTP chapter until 2026-10-03 and moved here because an interceptor's shared response handling is a `catchError()` inside its own pipeline, and expiring a session means clearing the signed-in state of chapter 20, sending the user to the login page, and leaving a one-time notice for it — none of which existed where the old plan placed interceptors. The `HttpErrorResponse` it inspects stays in chapter 12, where the feature's own error callback first needs it.

Handoff: The runtime feature flow is now complete, from URL to guarded page to authenticated request; chapter 22 explains when Angular checks and redraws it.

## 22 — Change detection and pipe execution

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/22-change-detection.md
Spanish: notes/angular/junior/es/22-deteccion-cambios.md

Depends on: 03, 05, 11, 12, 14

Pending additions: none

Narrative role: Explain how Angular schedules and narrows rendering checks, and use that mechanism to price the expressions a template runs — a method call, a pure pipe, an impure pipe.

Learning outcome: Victor can predict Default and OnPush checks, with and without Zone.js, explain signal notifications and immutable inputs, and say what a template expression costs on every check depending on whether anything caches it.

Prerequisites: 03, 05, 11, 12, 14

Must answer:

- Why can a click, a timer, or an HTTP response in one component make Angular check components that had nothing to do with it, and what part does Zone.js play in established applications?
- In an application without Zone.js, what tells Angular to check a view, and which update that used to appear on screen no longer does?
- Which concrete notifications mark an OnPush view for checking, and why does mutating an input object in place leave that view stale?
- How does a signal read in a template notify that view?
- Why does a method called from a template re-run on every check while a computed signal returns a stored value, and what does that cost inside a loop?
- Why can Angular skip a pure pipe for an unchanged value or reference while an impure pipe runs on every check?

Coverage concepts:

- [ ] Default change detection and Zone.js awareness — explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- [ ] `OnPush` change detection — recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- [ ] Signals with `OnPush` — explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- [ ] Template method calls vs `computed()` — recognise that a function called from a template re-runs on every change detection because it caches nothing, while a computed signal returns its stored value until a source signal changes, so a per-item call inside a loop repeats the whole scan on every check
- [ ] Pure vs impure pipes — prefer a pure pipe whose transform is skipped while primitive values or object references stay unchanged, and recognise that an impure pipe runs on every change-detection cycle

Rationale: The checking mechanism and the cost of a template expression are the same subject read from two ends: once the reader knows when a view is checked, the method-call and impure-pipe costs stop being rules to memorise and become consequences. The chapter reads back three things taught earlier and re-prices them here rather than reteaching them: `computed()` and the immutable-update rule from chapter 03, the pipe from chapter 11, and the `async` pipe of chapter 14 as one of the notifications. The Zone.js bullet is about established applications; the zoneless question is added because angular.dev states that new applications are zoneless by default from Angular v21, so the application Victor creates today behaves differently from the one he will be asked to maintain.

Handoff: Runtime rendering is now predictable on the developer's machine. Chapter 23 turns to what changes when the application is built and shipped to a browser the developer does not control.

## 23 — Production build, configuration, and template trust

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/23-production-delivery.md
Spanish: notes/angular/junior/es/23-entrega-produccion.md

Depends on: 02, 12, 19

Pending additions: none

Narrative role: Separate runtime rendering from delivery: inspect real workspace targets, verify the production build, expose only public browser configuration, and preserve Angular's template trust boundary.

Learning outcome: Victor can locate configured build targets, run the real production verification, configure a value that differs between environments while knowing it is public, and treat sanitisation bypasses as explicit trust decisions.

Prerequisites: 02, 12, 19

Must answer:

- How do package scripts and angular.json targets reveal the real build command?
- What can production compilation, optimisation, and budgets catch that a dev server does not?
- How does a value such as the API base URL differ between the dev server and the production build — where is it written and what swaps it?
- Why can no value shipped to the browser be secret?
- What does interpolation do to a string that contains markup, what does `[innerHTML]` do to the same string, which contexts are sanitised differently, and what are you asserting when you call `bypassSecurityTrust…`?

Existing-content migration: Absorb environment configuration from 12. Teach template sanitisation here as the final browser-delivery trust boundary, explicitly separated from build configuration inside the chapter.

Coverage concepts:

- [ ] Angular CLI workspace configuration — read configured targets and package scripts in a maintained workspace instead of assuming every project uses the CLI defaults
- [ ] Production-build verification — run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server
- [ ] Build-time configuration vs frontend secrets — configure public environment-dependent values at build or deployment time while recognising that anything shipped to the browser can be read by a user
- [ ] Angular template sanitisation — distinguish escaped interpolation from context-sensitive sanitisation and treat `bypassSecurityTrust...` as an explicit trust-boundary decision

Rationale: The chapter holds two units and says so: how the application is really built — the workspace targets, the production build and what it catches — and what the browser may read and trust once it is shipped — public configuration and template sanitisation. They share a chapter because both are about the boundary between the developer's machine and the user's browser and neither is large enough alone, and the note keeps them in separate sections. The bundle budget this chapter verifies is the one chapter 19 showed a stray import overrunning.

Handoff: Every chapter so far has stated a contract — an input that is required, a service that returns a stream, a request with a URL and a body. Chapter 24 starts turning those contracts into tests.

## 24 — Test setup, doubles, and service tests

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/24-testing.md
Spanish: notes/angular/junior/es/24-testing.md

Depends on: 03, 08, 13, 20

Pending additions: none

Narrative role: Open testing at the harness: what a spec is and how it runs in a current Vitest project, what TestBed stands in for, what a unit mounted alone has to be given, and how a collaborator is replaced and observed.

Learning outcome: Victor can read a Vitest or a Jasmine/Karma suite, choose direct or TestBed setup, satisfy a unit's declared contract — its type arguments and its runtime-supplied tokens — replace a collaborator with a spy, and test a service's logic in isolation.

Prerequisites: 03, 08, 13, 20

Must answer:

- What does a spec file consist of, how is it run, and what looks different when the suite is Jasmine/Karma instead of Vitest?
- What does `TestBed` stand in for, and when does a unit need it rather than plain `new`?
- Why does a scaffolded spec's placeholder type argument fail the whole suite before a single assertion runs?
- Which dependencies does no module provide, and why must a spec that mounts such a unit alone supply the framework-minted values — an overlay's own reference and the data handed to it — as doubles?
- What does a service test assert — returned values, state transitions, calls to collaborators — and what keeps it a test of the service rather than of its dependencies?
- How do Vitest and Jasmine express equivalent spy intent?

Existing-content migration: Move the "Testing a service with HTTP" section to 25; retain the framework basics, `TestBed`, the service test without HTTP, and spies here, rewritten for Vitest with Jasmine as the recognition form.

Coverage concepts:

- [ ] Vitest vs Jasmine/Karma recognition — use the current CLI's Vitest default while reading Jasmine/Karma suites that remain common in maintained consultancy projects
- [ ] A scaffolded spec's type arguments are part of the unit's contract — the CLI fills a generic harness
  with a placeholder because it cannot know which type the unit was declared against, and a placeholder
  that never gets narrowed fails the whole suite at compile time, before any assertion runs, taking
  every unrelated spec with it
- [ ] `TestBed` — configure Angular's injection and rendering environment only when the unit needs Angular-managed dependencies
- [ ] Runtime-supplied injection tokens in tests — recognise that a value the framework mints when it creates the unit, such as a dialog's reference and its data token, is provided by no module, so a spec that mounts the unit alone must supply it as a double rather than importing more of the library
- [ ] Service unit tests — isolate business or state logic and verify observable outputs, state transitions, and collaborator calls
- [ ] Spies and test doubles — control a collaborator with `vi.spyOn()` in Vitest or `spyOn()` in Jasmine and assert the interaction without reproducing its implementation

Rationale: These six are the harness and the simplest thing tested in it. Two of them are one idea in two places — the harness inherits the contract the application used to satisfy — so they sit with the setup material rather than back in the chapters that declared those contracts. The scaffolded-spec bullet needs the functional guard of chapter 20, because a guard spec's generic harness is where the placeholder appears. HTTP and rendered-component tests were split into 25 on 2026-10-03: the single testing entry held twelve bullets and three mechanisms under one label.

Handoff: A service can now be tested alone with its collaborators replaced; chapter 25 tests the two things that cannot be replaced so simply — a real HTTP exchange and a rendered component.

## 25 — Testing HTTP and rendered components

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular/junior/en/25-testing-http-components.md
Spanish: notes/angular/junior/es/25-testing-http-componentes.md

Depends on: 05, 12, 14, 22, 24

Pending additions: none

Narrative role: Take the harness of chapter 24 to the two boundaries a double does not cover: the request a service really sends, intercepted and answered by the test, and the DOM a component really renders, driven and read by the test.

Learning outcome: Victor can verify a complete HTTP interaction and its failure path with `HttpTestingController`, recognise the legacy testing module, and assert rendered user behaviour through `ComponentFixture`, supplying the inputs a parent would have.

Prerequisites: 05, 12, 14, 22, 24

Must answer:

- How does HttpTestingController verify request and response contracts and prove no request remains?
- Why must HTTP tests cover errors and call verify(), and when is the legacy testing module only recognition knowledge?
- How does a test render a component, change something, wait for the view to settle and read the DOM, and why is asserting that the component exists not a test of behaviour?
- How does a test satisfy a required input that a parent normally supplies, and why must that happen before the first change detection?

Existing-content migration: Absorb the "Testing a service with HTTP" section from 24.

Coverage concepts:

- [ ] HTTP tests with `provideHttpClientTesting()` — intercept a request with `HttpTestingController`, assert method, URL, and body, then flush the intended response
- [ ] `provideHttpClientTesting()` vs `HttpClientTestingModule` — use the standalone provider in current code and recognise the deprecated module-based setup in older suites
- [ ] `HttpTestingController.verify()` — fail a test when expected requests remain outstanding or unexpected requests were left unresolved
- [ ] HTTP error tests — flush an error response and assert the service's observable or state follows the documented failure path
- [ ] `ComponentFixture` — trigger change detection, query rendered DOM, simulate an interaction, and assert visible component behaviour rather than mere construction
- [ ] `componentRef.setInput()` — supply a required input from a test before the first change detection, because a component contract that a parent normally satisfies is the test harness's responsibility once the component is mounted alone

Rationale: Both halves test a real exchange instead of a double: the four HTTP bullets are one controller used through a request's whole life, and the two component bullets are one fixture. The chapter reads back the contracts earlier chapters wrote — the required input of 05, the HTTP calls of 12, the failure path of 14 — and the change-detection timing of 22 that decides when a fixture's DOM is current; it tests them and does not reteach them.

Handoff: Tests reveal failures; chapter 26 teaches how to locate their boundary in an unfamiliar maintained feature before editing.

## 26 — Debugging and maintained-code navigation

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/26-debugging-maintained-code.md
Spanish: notes/angular/junior/es/26-depuracion-codigo-mantenido.md

Depends on: 03, 08, 12, 17, 23, 25

Pending additions: none

Narrative role: Provide the consultancy maintenance workflow: read the evidence a failure leaves, and trace one feature across every boundary before changing unfamiliar code.

Learning outcome: Victor can triage compiler, runtime, DI, router, and network evidence to the boundary that failed, and trace route, page, service, HTTP, state, template states, and tests end to end.

Prerequisites: 03, 08, 12, 17, 23, 25

Must answer:

- Before touching a maintained feature, which of the commands chapter 23 found do you run first, and what does each one's output tell you?
- Which evidence locates a compiler, injection, router, network, state, or rendering failure?
- How do you trace one maintained feature before deciding where to edit?
- How do you infer route, state, service, HTTP, template, and test ownership when a maintained workspace uses different folder names?

Existing-content migration: Reuse the current Core/Feature/Shared discussion only as a non-normative example while rebuilding the chapter around evidence-first triage and end-to-end feature-flow tracing.

Coverage concepts:

- [ ] Angular error triage — use compiler output, runtime error context, dependency-injection traces, router events, and the browser Network panel to locate the failing boundary before changing code
- [ ] Feature-flow tracing — follow a route through its page component, injected service, HTTP call, reactive state, template states, and test before modifying an unfamiliar maintained feature

Rationale: The two concepts are one workflow — find the failing boundary from evidence, then walk the feature across every boundary the earlier chapters taught. Its first question reads back the workspace targets of chapter 23 rather than reteaching them.

Handoff: Modern code is now traceable; chapter 27 maps the older enterprise vocabulary onto the same mental models.

## 27 — Legacy enterprise Angular

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular/junior/en/27-legacy-angular.md
Spanish: notes/angular/junior/es/27-angular-legacy.md

Depends on: 02, 03, 04, 05, 08, 13, 15

Pending additions: none

Narrative role: Translate the modern models already learned into the NgModule, decorator, structural-directive, template-form, and Subject conventions common in maintained enterprise applications.

Learning outcome: Victor can read and safely modify legacy Angular without treating its syntax as the default for new features.

Prerequisites: 02, 03, 04, 05, 08, 13, 15

Must answer:

- How do NgModule declarations, imports, exports, and providers map to standalone responsibilities?
- How do `@Input()`/`@Output()` with `EventEmitter` differ from `input()`/`output()` in how a value is read and how a change is noticed?
- What must `*ngIf` and `*ngFor` have imported that `@if` and `@for` do not, and how is the `else` branch written?
- What does `trackBy` take that `track` does not, and what happens to the DOM when it is missing?
- What does `[(ngModel)]` need, where does a template-driven form keep its model, and what makes a reactive form the one to choose when it must be tested?
- How do Subject and BehaviorSubject differ in what a new subscriber receives, and what did a `BehaviorSubject` in a service do that a signal does today?

Existing-content migration: Absorb NgModule and standalone-era recognition from 01, plus `ngModel` from 06, alongside the existing Subject, BehaviorSubject, and EventEmitter material.

Coverage concepts:

- [ ] `NgModule` — read `declarations`, `imports`, `exports`, and `providers` in pre-standalone applications without treating modules as required in new features
- [ ] Signal inputs/outputs vs `@Input()`/`@Output()` — use current function APIs in new code and recognise decorator plus `EventEmitter` communication in maintained applications
- [ ] `*ngIf` vs `@if` — read both syntaxes and understand that the modern block syntax does not require importing `NgIf`
- [ ] `*ngFor` `trackBy` vs `@for` `track` — preserve stable identity in both template generations
- [ ] Template-driven vs reactive forms — recognise `ngModel` for simple template-owned fields and choose reactive forms for explicit, testable form models
- [ ] `Subject` vs `BehaviorSubject` — distinguish event broadcasting from state that immediately exposes its latest value to new subscribers

Rationale: Every concept is a legacy spelling of a model an earlier chapter already taught, so the chapter is a translation table with reasons: modules for 02's `imports`, decorators for 05's inputs and outputs, structural directives for 04's blocks, template-driven forms for 15's control model, `BehaviorSubject` for 03's signals. The `$` naming bullet of this coverage section is taught in 13, where the suffix is first used.

Handoff: This closes the junior route: Victor can navigate both modern Angular and the legacy code common in Spanish consultancy maintenance work.

## Unassigned existing notes

- notes/angular/junior/en/_legacy/09-coordinator-pattern.md — smart/dumb component organisation is a design convention no Angular coverage bullet owns at any level, and the `input()`/`output()` mechanics it shows are entry 05's; its `MatDialog` material belongs to the Angular Material topic.
- notes/angular/junior/en/_legacy/14-role-aware-ui.md — role-driven UI visibility is not an Angular bullet at any level; the `computed()` derivation it teaches is entry 03's and the authorisation framing belongs to the Security topic.
- notes/angular/junior/en/_legacy/15-dialog-backdrop-close.md — `MatDialogConfig.disableClose` and `MatDialogRef.backdropClick()` are Angular Material APIs, delegated away from this topic by the ownership registry.
