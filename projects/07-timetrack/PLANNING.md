# Project 07 — TimeTrack

A timesheet app where employees log hours worked on projects.
Managers review the entries and approve or reject them.

---

## 0. Session quick reference

Read this table at the start of every session — it is the authoritative pointer to the live step. It is
written by the closing rituals (`step-complete` repoints every cell, `backlog-task-close` refreshes what
a close made false), and rewritten wholesale only by a `plan-audit` G2 pass. Do not hand-edit it here.

| | |
|---|---|
| **Current step** | **Step 8 — Backend tests**, next — its precondition is met: `feat/angular-manager-pages` merged on 2026-09-22 (§22). Step 7d closed ✅ on 2026-09-22 (the Team and Reports pages), and with it the parent Step 7: the Angular frontend is built, every sub-step's done condition verified clause by clause in the browser. `PROJECT-BACKLOG.md` holds **5 Low frontend tasks, all raised by the G4 `review-audit` run of 2026-09-23 (`d22a69e4`), and no High or Medium at any tier** — the ninth, `approvals.ts` re-implementing a focus fallback inline, closed on 2026-09-23 (`1e8fc369`, `2efaed32`), and the eighth, `entry-dialog`'s supposedly unreachable create-and-submit branch, closed the same day as a false positive — all six of that run's Mediums closed on 2026-09-23: a reload failing outside Retry never moving focus to the page `<h1>` (`a61fb96c`), `/reports` blanking its two tables to a bare spinner on every reload (`e7401662`), `/approvals` and `/entries` showing a false empty state after a write emptied the page they were on (`6e062870`), the employee dashboard's recent list printing a date with no year against a query that bounds no month (`b3e77c42`), the two `/reports` hours tables unreachable by keyboard (`b8f33794`), and five controls accepting a whitespace-only value their server field refuses as `@NotBlank` (`d64536a3`) — the Lows block no gate at all. Before that run it held no open task at any priority: the last, `/approvals` unable to sort by Employee, raised on 2026-09-22 by Victor in the browser after the backlog had been cleared, closed that day with `employee` and `project` sort keys mapped on the server (`e68ebf05`, `9a8a2fce`). The README screenshots Low closed on 2026-09-22 with the manager dashboard, Entries, Team and Reports captured at 1280×800 on a realistic demo dataset in `screenshots/`, placed in the README by `readme-audit` at G5. The three Lows the cold design review of that day's second round of closes raised all closed the same day — the employee dashboard's Date rung, the dialogs' error-line ring, and §14 claiming every Material component rings focus when form fields keep their own outline. The nine tasks the cold design review of that day's backlog closes raised all closed the same day — its four Mediums, Hours hidden under the pinned actions of the review tables at 375px, a Back pressed during an in-flight password reset or member create losing the new password, the icon buttons' 1.25:1 focus indicator, and the employee dashboard's table clipped and unreachable by keyboard at 375px, and its five Lows, the unnamed optical value and "The four" listing three with one §14 Spacing edit, the hand-written 4px radius, now read from the theme's shape token, the failed-save focus headline, now true of Save as well as of a field, and the login brand's weight, kept as a named typography exception. Every task the cold design review of Step 7d raised on 2026-09-22 closed the same day — its Medium (the browser's Back button discarding a new member's generated password) and its seven Lows — and so did both backend Lows: the recovery decision, closed with a manager's password reset, and a new account's password missing `@ToString.Exclude` on `CreateUserResponse` |
| **Current branch** | `fix/frontend-backlog` — cut from `projects/07-timetrack` on 2026-09-23 to work the Mediums G4 raised (§22). **Its closing condition was met the same day** — every Medium is closed — so the PR back into the project branch is due and is Victor's to open; the 5 Lows still open may follow on this branch or be left open, since they gate nothing. Before it, `projects/07-timetrack` — `feat/angular-manager-pages` (Steps 7c–7d) merged on 2026-09-22 through PR #92, which was opened against `main` instead of the project branch; `projects/07-timetrack` was fast-forwarded to that same commit (`e883a365`) on 2026-09-23, so `main` carries only the merge commit above it and nothing was lost (§22). G4's `review-audit` runs from the project branch, so the backlog commit it writes lands there; the next branch, `feat/backend-tests`, is cut from it once that run has landed |
| **Done condition** | Step 8's, verbatim from §15 — this is what gate G1 checks before the step can be marked ✅: `Terminal: mvn test passes — TimeEntryServiceTest, UserServiceTest, ProjectServiceTest, AuthServiceTest and ReportServiceTest all green; approve_throwsWhenNotSubmitted and getSummary_approvedHoursEqualsByProjectSum asserted` |
| **Next gate** | G5 — READMEs (`readme-audit · PROJECT_PATH = projects/07-timetrack`), **signable now**: its trigger is every High from G3/G4 fixed and committed, and G4 found none. G4 signed off on 2026-09-23 — `review-audit REVIEW_SCOPE = frontend` ran over Steps 7a–7d across eleven slices plus the consistency pass (`d22a69e4`), superseding the 2026-09-19 run that reached 7a–7b only; the backlog's `**Last Reviewed — frontend:**` now reads 2026-09-23. **G7 no longer blocks on the backlog**: all six Mediums that run raised closed on 2026-09-23, so nothing open is above `[Low]`; it still waits on G5 and G6, which precede it in §23's chain. G3 signed off on 2026-08-29 with the PR #70 merge (`a67866c4`) |
| **Phase** | Frontend (Phase 5) — opened on 2026-08-29 by the G3 sign-off; Phase 4 (backend) is closed, its backlog empty at every priority |
| **Last updated** | 2026-09-23 |

---

## 1. Project title and one-line description

**TimeTrack** — a timesheet app where employees log the hours they work on company projects and
managers review each entry, approving or rejecting it with a note.

Used by two roles: **employees**, who create, edit and submit their own time entries, and
**managers**, who own the projects and the team, approve or reject submitted hours, and read the
monthly hours reports.

---

## 2. Why this project

- The workflow pattern (DRAFT → SUBMITTED → APPROVED / REJECTED) appears in almost every enterprise app
- Role-based authorization in Spring Security is a skill used in every Spring Boot project
- Spanish consultancies use timesheet tools every day — this domain is immediately relatable to interviewers
- It is rare in junior portfolios — most people build finance trackers or todo apps
- It adds what project 06 could not show: 06 was Angular-only against a mock service, so this is the first
  project with a backend Victor wrote — a real REST API, a database schema, server-side authorization and a
  JSON contract two independent apps agree on

---

## 3. New concepts

Concepts this project teaches for the first time. (Steps 1–3 are now done and already recorded in PROGRESS.md; they are kept here so the table reflects the whole project scope.)

| Concept | Topic | Why this project teaches it |
|---|---|---|
| Layered architecture (Controller → Service → Repository) | Architecture | First backend; the layer split is the backbone of every Spring app |
| REST API + SPA separation (backend with no View layer) | Architecture | First split into two independent apps sharing only a JSON contract — the reason this is not classic MVC |
| `@Entity` / JPA mapping to PostgreSQL | Spring Boot | First time mapping Java classes to tables |
| `JpaRepository` + derived query methods | Spring Boot | CRUD without SQL; `findByEmail` style finders |
| DTO request/response boundary | Spring Boot | Entities never leave the service layer |
| `Optional<T>` for "may not exist" returns | Java | Repository finders return it; the service turns an empty one into a 404 instead of a `NullPointerException` |
| Custom unchecked exceptions (`ResourceNotFoundException`, business-rule violations) | Java | How a service signals "not found" / "illegal transition" without returning error codes |
| Spring Security + JWT stateless auth | Security | Standard auth in every Spring Boot job |
| `SecurityContextHolder` to read the authenticated user | Security | Ownership is resolved from the JWT, never from a client-supplied `userId` |
| `@PreAuthorize("hasRole(...)")` role checks | Security | Method-level authorization after the JWT filter |
| `@ManyToOne` / `@OneToMany` relationships | Spring Boot | TimeEntry → User and → Project foreign keys |
| State machine workflow (DRAFT→SUBMITTED→APPROVED/REJECTED) | Architecture | Most valuable pattern in a junior portfolio |
| PATCH for state transitions | Spring Boot | Signals that only `status` changes, not the whole resource |
| Query filters with `@RequestParam` | Spring Boot | `?month=`, `?status=`, `?projectId=` on GET /api/entries |
| `Specification<T>` + `JpaSpecificationExecutor` (Criteria API) | Spring Boot | Dynamic optional filters on GET /api/entries — the JPQL `IS NULL OR` pattern hit a real PostgreSQL bug (`42P18`, can't infer parameter type) when a parameter appears *only* in the null test, so Specifications build predicates only for filters actually present; the reports summary uses `IS NULL OR` safely because the same parameter is also compared to `te.user.id`, which gives the driver its type |
| Bean Validation (`@Valid` + `@NotNull` / `@NotBlank`) on request DTOs | Spring Boot | Field-level 400s at the controller boundary, before any service logic runs |
| JPQL aggregation queries | Spring Boot | Reports — hours grouped by project and by employee |
| Interface projections for query results | Spring Boot | Report rows mapped straight from `SELECT ... AS alias` — no class, no manual mapping |
| `@RestControllerAdvice` GlobalExceptionHandler | Spring Boot | Consistent JSON error bodies |
| Profile-gated startup seeding (`CommandLineRunner` + `@Profile`) | Spring Boot | First manager account with no register endpoint — seeded in Java so the credential comes from an env var at runtime instead of a hash committed in `data.sql` |
| JUnit 5 + Mockito unit tests | Java | First backend tests — JUnit and Mockito are plain Java libraries, usable with no Spring context at all, so the concept files under Java even though the class under test is a Spring service |
| Angular consuming a real REST API end to end | Angular | First time the frontend talks to a backend you built |
| Docker + docker-compose | Deployment | One command runs app + database locally |

---

## 4. Review concepts

Concepts from earlier projects this project reinforces.

| Concept | Originally learned in | How this project uses it again |
|---|---|---|
| JWT auth flow | Project 06 (frontend side) | Now built on the backend — full round trip |
| Route guards (`authGuard`, role guard) | Project 06 | `authGuard` + `managerGuard` on protected routes |
| HTTP interceptor | Project 06 | Attaches the JWT to every request |
| Role-aware UI | Project 06 | Same route, different data per role (Entries page) |
| Coordinator (smart/dumb) pattern | Projects 03 / 05 | Each page owns state; children display and emit |
| Reactive forms + validation | Project 03 | Entry form, user form |
| MatTable + MatDialog | Project 05 | Entries, Projects, Approvals tables and dialogs |
| `forkJoin` parallel requests | Project 02 | Manager dashboard stat cards |
| Signals + `computed()` | Project 01 onwards | Derived stat counts across pages |
| Auth persistence with a signal + `localStorage` | Project 06 | Token + current user kept in localStorage, written imperatively by `AuthService` on login and logout — the only two moments the session changes |
| Soft delete | Project 07 (Step 2) | Reused for users and projects |
| `MatSidenav` app shell | Project 06 | Same fixed toolbar + scrollable content layout |

Every row above comes from an earlier project except **soft delete**, which is the one *intra-project*
reuse: it is introduced here in Step 2 (projects) and then applied again to users in Step 4, so it is
recorded in this table rather than in §3's new-concepts list, where Step 2's single major concept is the
DTO boundary.

---

## 5. Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | Java + Spring Boot | First Spring Boot project; layered architecture |
| Auth | Spring Security + JWT | Stateless; secret from `${JWT_SECRET}` env var |
| Database | PostgreSQL | Local instance via pgAdmin; same DB used in Docker |
| ORM | Spring Data JPA + Hibernate | `JpaRepository` + derived queries; JPQL for reports |
| Frontend | Angular + Angular Material | Teal M3 theme, compact density (§14); Core/Feature/Shared structure |
| Local setup | Docker + docker-compose | App + Postgres in one command (Step 11) |
| Tests | JUnit 5 + Mockito (backend), Vitest + TestBed (frontend) | Services only — component tests start at project 08 |

---

## 6. Architecture

This project uses **layered architecture** on the backend — not classic MVC.

Classic MVC is used when the backend renders HTML (e.g. Thymeleaf templates).
In this project the backend only sends JSON. Angular is the View — a completely separate app running in the browser.

```
Browser                               Server
┌──────────────────┐                 ┌──────────────────────────────┐
│   Angular App    │   HTTP + JSON   │   Spring Boot API            │
│                  │ ─────────────→  │                              │
│   Components     │                 │   Controller  ← HTTP layer   │
│   Services       │ ←─────────────  │       ↓                      │
│   Models         │   JSON          │   Service     ← business logic│
└──────────────────┘                 │       ↓                      │
                                     │   Repository  ← DB access    │
                                     └──────────────┬───────────────┘
                                                    │
                                          ┌─────────▼──────────┐
                                          │    PostgreSQL       │
                                          └────────────────────┘
```

**Backend layer rules:**
- Controller only handles HTTP — reads the request, calls the service, returns the response. No logic.
- Service contains all business rules — validation, state transitions, role checks.
- Repository only reads and writes data. No logic.
- Controllers never call the repository directly.
- A service that already holds the entity deletes it with `delete(entity)`, never `deleteById(id)`. `deleteById` is a `findById` followed by the delete, so it asks the repository for the same row a second time and absorbs an absent id silently — a second not-found policy competing with the guard that loaded the entity and answers `404`.
- Entities are never returned directly from the API — always map to a DTO first.
- Every resource keeps a separate `Create*Request`/`Update*Request` DTO pair, even when their fields
  are identical today — the two operations are distinct intents, so an update-only field never forces
  a change to the creation contract.
- A DTO field is nullable only where absence carries meaning. An `Update*Request` field is a wrapper type
  because a partial update reads `null` as "leave this one alone" and the service applies it only when
  present; the matching `*Response` field is a primitive whenever the entity's is, so the API cannot
  serialise a state the schema forbids and no client unboxes a `null` into a 500.
- A DTO field that holds a credential — a password, a bearer token — carries `@ToString.Exclude`. Lombok's
  `@Data` puts every field in the generated `toString()`, so any future log line or exception message that
  interpolates the object publishes the credential in plaintext; the annotation is the boundary, and it does
  not affect the JSON, which Jackson builds from the getters.
- A validation constraint on a field the request submits **for comparison against a stored value** carries
  only what makes the comparison possible — `@NotBlank`, and a bound the algorithm itself imposes. A policy
  rule such as a minimum length belongs to the field the system is about to *accept*: `@Valid` runs in the
  argument resolver, before the service method exists, so a policy floor on `currentPassword` refuses the
  request before `passwordEncoder.matches` is reached and permanently locks out any account whose stored
  credential predates the policy. The `@Size(max = 72)` both password fields keep is BCrypt's input bound,
  counted in bytes, not a policy.
- A business rule is refused with one of the project's **own** exception types, never by hand-throwing a
  framework exception from a lower layer. Spring's `DataAccessException` family (`DataIntegrityViolationException`
  and friends) belongs to `@Repository` translation and means the database rejected the write — a service
  throwing one claims a persistence failure that never happened, and forces its handler to hide the message,
  because when it *is* genuine the text is Hibernate's and names the constraint and the statement.
- The same refusal reached by a different layer produces the same response. A uniqueness rule the service
  pre-checks is still decided atomically by the unique index, so the write is wrapped and the
  `DataIntegrityViolationException` translated into the same `DuplicateResourceException` the check throws:
  one contract, `fieldErrors` included, whichever of the two paths refused it. The pre-check is kept because
  it carries the case-insensitive comparison and the legible message; the constraint is the guarantee. A
  translation of this kind requires `saveAndFlush`, since `save` defers the statement to the commit flush,
  where no service-level `catch` can still see it.
- A user-supplied identifier is canonicalised in the service before it is compared or persisted —
  emails trimmed and lower-cased, project names trimmed and compared case-insensitively — and the
  same canonical value is used for the duplicate check and for the write. Two spellings of one
  identifier must never become two rows.
- An existence question is asked with a derived `existsByX` query, never by loading the row and testing
  the `Optional` — `findByX(...).isPresent()` selects and materialises an entity whose fields are then
  thrown away. `findByX` stays for the paths that need the entity itself.
- Every endpoint declares its own authorization rule with `@PreAuthorize`, including the ones open to any
  authenticated caller (`isAuthenticated()`). The filter chain's `anyRequest().authenticated()` is the
  perimeter, not the endpoint's contract: a matcher widened in `SecurityConfig` must not be able to open a
  method whose own file never changed, and an unannotated handler must never be ambiguous between
  "needs no rule" and "the rule was forgotten".
- A rule that makes a route public names the HTTP method and the exact path, never a path prefix. A
  prefix matcher authorises endpoints that do not exist yet, so a handler later added to the same
  controller is born public with nothing in its diff to prompt a security review; the only public
  surface is `POST /api/auth/login`, and anything else falls through to `anyRequest().authenticated()`.
- The CORS policy names only what the deployed client uses — the allowed origins, the methods the API
  exposes and the request headers it sends (`Authorization`, `Content-Type`); no `*` wildcard for headers,
  and `allowCredentials(false)` while the token travels in a header. A configuration value that may hold
  several entries is injected into the typed collection it represents (`List<String>`), never as a `String`
  wrapped at the call site: the wrapper turns a comma-separated property into one malformed entry that
  matches nothing, and it fails silently.
- A response that serialises a database-generated value flushes before it is built. With a sequence-backed
  `@GeneratedValue`, `save()` only stages the `INSERT`, so `@CreationTimestamp` and any column default are
  still null on the entity until the flush; a create response mapped before it serialises `null` for a
  column the row has. Use `saveAndFlush` (or map after the flush) whenever the response DTO carries such a
  field.
- Every constraint §7 declares is on the mapping: a not-null column carries `@Column(nullable = false)`, a
  column with a default carries `@ColumnDefault`, and a write-once column carries `updatable = false` so no
  later update to the entity can rewrite it. The mapping is the declaration and not the guarantee —
  `ddl-auto=update` adds tables and columns but never alters one that already exists, so any of these added
  after its column was created reaches the schema only through a manual `ALTER TABLE`, and a not-null added
  to a populated column needs its historical rows backfilled before the constraint will take.
- Every bean takes its collaborators as constructor parameters and holds them in `final` fields; there is
  no `@Autowired` or `@Value` field in the codebase. A bean whose required configuration a value is —
  read by a lifecycle method, a `@Bean` method or any other method on the class — takes it the same way,
  as a `@Value` constructor parameter, so the bean is never constructible in a state where one of its
  methods would read a null (`DataInitializer` seeding a user with a null email; `JwtUtil` signing with a
  null key).

**Angular rules:**
Same bar as the backend block: each line is violable — a reviewer can open a file and point at the break.
- **State ownership** — the page component under `pages/` owns all state for its route (signals declared
  in the page class). Child components receive data through `input()` and report through `output()`, and
  never inject a `core/services/` service. Two values are app-wide instead: `AuthService`'s `session`
  signal, read directly by the shell and the guards, and — ruled 2026-09-22 — the pending-approvals count
  in `core/state/pending-approvals.ts`, which the shell draws and the review pages change: a private
  signal exposed through `asReadonly()`, re-read by the shell on every `NavigationEnd`, refreshed by
  `/approvals` and the manager dashboard after each approve or reject, and cleared when the shell is
  destroyed at the end of a session. A value earns that only when a page and the chrome around it must
  agree live; everything else stays in its page.
- **Form dialogs own their write** — a `MatDialog` is not a child component: `MatDialog.open()` creates it
  in the overlay container, so it has no `input()`/`output()` to speak through. A dialog that submits a form the API
  can refuse field by field (all five: `change-password-dialog`, `entry-dialog`, `project-dialog`,
  `reject-dialog`, `user-dialog`) receives what it displays through
  `MAT_DIALOG_DATA`, issues its own write through the `core/services/` service, and closes with
  `dialogRef.close(result)` only on success; the opening page then refetches. It owns the write because it
  owns the write's in-flight state — the spinner, the `disableClose` lock of Subscription lifetime below,
  and the `400` `fieldErrors` under its own inputs, which a page saving after `close()` would receive with
  the form already gone. It never *reads* a list its page already loaded — that arrives as dialog data
  (§13's shared-state table) — and a dialog that submits nothing (`confirm-dialog`) returns its
  answer through `close()` and calls no service.
- **A method is named by what it does, not by the event that reaches it** — a dialog's write handler is
  `save()` in all five, whatever the domain verb of the write, and the private "run a busy row action and
  report through the snackbar" helper is `run()` on all three pages that have one. The naming is the
  project's, not the framework's: the Angular docs state no convention for handler names (checked against
  the v21 documentation on 2026-09-23). What settles it is that `entry-dialog`'s handler is reached from
  `(ngSubmit)` **and** from a `(click)` on a `type="button"` control, so a name like `onSubmit` would
  describe one of its two triggers; and that a reader who greps the majority name finds most of the set
  and nothing tells them it is incomplete. **The rule is about a dialog's write handler.** `Login` is a
  routed page whose form authenticates and navigates rather than persisting an entity, so it keeps
  `onSubmit()` and is not drift (ruled 2026-09-23).
- **Form errors** — a form that submits to the API shows a refusal in exactly two places. Each
  `fieldErrors` entry for a field the form declares goes under that control through `placeFieldErrors()`
  (whatever the status — a `400` validation and a `409` duplicate both carry them); any failure no
  declared field claimed goes to one form-level `<p role="alert">` above the fields, worded by
  `apiErrorMessage()`. That line is always in the DOM, empty until it has a message: an alert inserted
  together with its text may never be announced.
- **A client rule measures what the server measures** — client-side validation exists to spare a round
  trip, never to hold authority, so a rule restating an API constraint applies the *same* test.
  `Validators.required` only reports a value that is null or of length zero, so every control whose server
  field is `@NotBlank` carries `notBlank` (`shared/validators.ts`) beside it; that validator reports the
  existing `required` key, so no template grows a second message for one error. A field submitted **for
  comparison against a stored value** — the login password, `currentPassword` — is excluded, by the
  reasoning the backend block above already states: a client rule refusing whitespace there could lock out an
  account whose stored credential the server would still accept.
- **Paged lists revalidate their index** — a page number is a claim about a collection the server can
  shrink between one request and the next, and an index past the end comes back as a valid, empty page
  rather than an error, so a reload that returns no rows against a non-zero total re-asks for the last
  page that exists. The correction steps down by at least one page: the count and the slice are read in
  separate statements, so a concurrent write can leave a total that still claims the empty page, and
  re-deriving the index from it alone would ask for the same page for ever. Resetting to page 1 on every
  write is the rejected alternative — it is right for a sort or a filter change, which replace the whole
  collection, and wrong for a row action, which removes one element and leaves the reviewer's place valid.
- **Shared endpoints** — when two pages read the same endpoint, each page fetches it independently on
  its own load; no cross-page cache. `GET /api/entries?month=` is read by both the dashboard and the
  entries page, and each calls it for itself.
- **Service boundary** — a `core/services/` service does exactly two things: issue the HTTP call and map
  the response to a `shared/models/` interface. It never navigates, never opens a dialog or snackbar, and never
  holds page state. `AuthService` is the single exception: it also holds the `session` signal (token, name,
  role), because auth state outlives every page. Any other app-wide value lives in `core/state/`, never in a
  `core/services/` service, so this boundary stays true of every HTTP service.
- **Navigation boundary** — `Router` is injected in four places only: pages, guards, the auth interceptor
  (a token-bearing `401` is answered once in `core/`, never per page — §10) and the layout shell (logout
  lives in its user menu). A `core/services/` service never injects it, so no HTTP call can move the user.
- **Component conventions** — every component is standalone by default and never writes
  `standalone: true` (the v20+ default, which the app's generated `.claude/CLAUDE.md` forbids setting),
  declares `changeDetection: ChangeDetectionStrategy.OnPush`, and gets its dependencies through `inject()`,
  never through a constructor parameter list.
- **Typing** — every `shared/models/` interface mirrors one backend response DTO field for field. No
  `any` at an API boundary: `http.get<TimeEntry[]>(...)` is typed, and a response shape that has no model
  gets one before the call is written. A response the app keeps beyond the call — the login session,
  persisted to `localStorage` — also passes a runtime type guard before it is stored, the same guard that
  re-reads it on every reload: the type argument of `http.post<T>()` asserts a shape to the compiler and
  checks nothing (ruled 2026-09-21).
- **A handler covers the type it is given** — a case the declared input type admits is handled even when
  the current configuration cannot produce it, and the branch is removed only when the type itself stops
  admitting the case, never because a setting elsewhere excludes it. `MatSort` emits
  `SortDirection = 'asc' | 'desc' | ''`, so `/entries` and `/approvals` both fall back to their
  `DEFAULT_SORT` on the empty direction — unreachable today, because all four sortable tables set
  `matSortDisableClear`. On `/entries` that attribute lives in `entry-list`'s template, a presentational
  child the page does not control, so dropping the fallback would make the page depend on an invariant
  declared in another component's markup; and a client that composes `sort=date,` leaves the server's
  parsing rule to decide what the user sees. Narrowing the child's output to the two directions it can
  emit is the clean removal, and is a change to that component's interface rather than a deletion
  (ruled 2026-09-23).
- **Subscription lifetime** — a template consumes an observable through the `async` pipe; a subscription
  in a class is wrapped in `takeUntilDestroyed()`. A bare `.subscribe()` with no teardown is a defect,
  including in a dialog. Tearing down a write aborts only the browser's wait, never a change the server
  already received, so a form dialog opens with `disableClose` (a backdrop click never closes it) and
  re-admits Escape through `dialogRef.keydownEvents()` only while no write is in flight — refused exactly
  as its disabled Cancel button is. Browser Back still closes it (`closeOnNavigation` ignores `disableClose`); that exit losing the confirmation is accepted — **except on a dialog showing a value the app can never fetch again**: the generated-password dialog opens with `closeOnNavigation: false`, since the overlay disposes itself on the history change before any guard runs, and `/team` carries a `CanDeactivate` guard (`oneTimeSecretGuard`) that refuses to leave while it is open and always lets an ended session leave. The value is at stake from the moment its request is sent, not from the moment it is shown — the server has already written it, and a page that leaves discards the only response carrying it — so the guard also holds while a password reset is in flight and while `user-dialog` is saving a create, and `user-dialog` opens with `closeOnNavigation: false` too (added 2026-09-22); a Back the guard lets through still closes it through `Team`'s `closeAll()` on destroy, so the interceptor's `401` still reaches `/login`; the router runs with `canceledNavigationResolution: 'computed'`, so a refused Back restores the history position rather than rewriting the previous entry. A dialog lives in the overlay container, not in its opener's view, and `closeOnNavigation` ignores `router.navigate()`, so the component that opens dialogs closes them when it is destroyed (`DestroyRef.onDestroy` + `MatDialog.closeAll()`) — the auth interceptor in `core/` never touches Material.
- **Calendar dates** — an entry's `date` is a day, never an instant: it is written with `toIsoDate()` (never
  `toISOString()`), read back with `fromIsoDate()`, and displayed through `DatePipe` with no time-zone argument.
  The pipe reads a `YYYY-MM-DD` string as local midnight, so `'UTC'` would print the previous day east of UTC.
- **Error messages** — a failed HTTP call becomes user-facing text only through `apiErrorMessage(err, fallback)`
  in `shared/models/api-error.ts`: the server's `ErrorResponse.message` when one was parsed, the caller's
  fallback otherwise. No component narrows `err.error` itself, so the rule has one home.
- **Async states** — every page that loads data renders three states explicitly: a `MatProgressSpinner`
  while `loading()` is true, a `mat-error` message plus a retry button when the call fails, and the empty
  message from §14 when the call succeeds with zero rows. A page that renders only the success table is
  incomplete. **A refetch does not clear what it is about to replace**: a page that already holds rows keeps
  them and dims them under `.table-overlay`, and only a first load, which has nothing to keep, renders the
  spinner in their place. Its summary cards are the exception and go back to skeletons on every load, since a
  stale total beside a fresh one cannot be told from a real `0`. A value kept across a reload also makes every
  predicate over it describe the *previous* load, so an emptiness test reads `loading()` beside the rows or it
  suppresses the very state announcing that one is in flight.

**What this is NOT:**
This is not classic MVC. In classic MVC (e.g. Spring Boot + Thymeleaf), the Controller renders HTML and returns it to the browser — the View lives inside the same application.

**What this IS:**
Two completely separate applications that communicate via HTTP:
- Spring Boot is a **REST API** — it only returns JSON, never HTML. It has no View layer.
- Angular is a **SPA (Single Page Application)** — it reads the JSON and builds the UI in the browser.

The Spring Boot backend follows Layered Architecture internally (Controller → Service → Repository). The Angular frontend follows Component Architecture. Neither application knows how the other is built — they only share a JSON contract.

**New architectural patterns vs the previous project (06 — Angular-only):**
Project 06 was frontend-only (Component + Core/Feature/Shared architecture), so everything below is new here — this is the first project with a backend.
- **Layered architecture (Controller → Service → Repository)** — the backbone of every Spring app; each layer has one responsibility so business rules never leak into HTTP handling or DB access.
- **REST API + SPA separation** — backend and frontend are two independent apps sharing only a JSON contract, instead of one app rendering its own View. This is why it is not classic MVC.
- **DTO boundary (Controller ↔ Service)** — a translation layer between persistence and HTTP so the API controls exactly what it exposes and entities never leak across the wire.
- **State machine workflow (DRAFT → SUBMITTED → APPROVED / REJECTED)** — lives in the Service layer; transitions are enforced business rules, not free-form field edits.

On the frontend the architecture is deliberately unchanged from project 06 — same Core/Feature/Shared
layout, same page-owns-state coordinator split, same guard + interceptor pair. Nothing new is invented
there so the novelty budget of this project goes to the backend; what is new for Angular is only the
data source (a real API you built, instead of a mock service).

See [notes/architecture/03-layered-architecture.md](../../notes/architecture/03-layered-architecture.md) for the full layered architecture explanation.

---

## 7. Entities

### User
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, sequence-generated | `@GeneratedValue` (bare `AUTO`) resolves to a Hibernate-managed sequence on PostgreSQL, not native column auto-increment |
| name | String | VARCHAR | not null | Full name shown in the UI |
| email | String | VARCHAR | not null, unique | Used as the login username |
| password | String | VARCHAR | not null | BCrypt hash, never plain text |
| role | Role (enum) | VARCHAR | not null | `EMPLOYEE` or `MANAGER` — stored as string via `@Enumerated(STRING)` |
| active | boolean | BOOLEAN | not null, default true | Soft delete — inactive users cannot log in. Primitive `boolean` initialised to `true`, not `Boolean`: a nullable wrapper unboxes to a `NullPointerException` (500) if a row is ever written outside JPA |
| createdAt | LocalDateTime | TIMESTAMP | not null, immutable | Set by `@CreationTimestamp`; `updatable = false` keeps it out of every generated `UPDATE` |

### Project
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, sequence-generated | Same `AUTO` → Hibernate-sequence behaviour as `User.id` |
| name | String | VARCHAR | not null, unique | Project name shown in selectors |
| description | String | VARCHAR | nullable | Optional context |
| active | boolean | BOOLEAN | not null, default true | Inactive projects cannot receive new entries. Primitive `boolean` for the same unboxing reason as `User.active` |
| createdAt | LocalDateTime | TIMESTAMP | not null, immutable | Set by `@CreationTimestamp`; `updatable = false` keeps it out of every generated `UPDATE` |

### TimeEntry
| Field | Java type | SQL type | Constraints | Notes |
|---|---|---|---|---|
| id | Long | BIGINT | PK, sequence-generated | Same `AUTO` → Hibernate-sequence behaviour as `User.id` |
| user | User | BIGINT (FK) | not null | `@ManyToOne` → User; who logged the entry |
| project | Project | BIGINT (FK) | not null | `@ManyToOne` → Project; which project the hours belong to |
| date | LocalDate | DATE | not null | The day the work was done; cannot be in the future |
| hours | BigDecimal | DECIMAL(4,2) | not null | Between 0.5 and 24 |
| description | String | VARCHAR | not null | What was done |
| status | EntryStatus (enum) | VARCHAR | not null, default DRAFT | `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED` via `@Enumerated(STRING)` |
| rejectionNote | String | VARCHAR | nullable | Set by the manager when rejecting |
| createdAt | LocalDateTime | TIMESTAMP | not null, immutable | Set by `@CreationTimestamp`; `updatable = false` keeps it out of every generated `UPDATE` |
| updatedAt | LocalDateTime | TIMESTAMP | not null | Set by `@UpdateTimestamp` on every change |

### Relationships
- **User → TimeEntry:** one-to-many. The FK lives on `TimeEntry.user` (`@ManyToOne`); `User` may expose `@OneToMany(mappedBy = "user")` only if a user needs to read their own entries through the entity graph — otherwise skip it and query through the repository.
- **Project → TimeEntry:** one-to-many. The FK lives on `TimeEntry.project` (`@ManyToOne`).
- **Fetch type:** both `@ManyToOne` are explicitly `FetchType.LAZY`. The JPA default is `EAGER`, which fired 1 + 2N queries on `GET /api/entries` (the classic N+1). The fix is not LAZY alone — with `open-in-view=false` a lazy proxy read outside a transaction throws `LazyInitializationException` — but LAZY **plus** a `LEFT JOIN FETCH` on both relations, added by `TimeEntrySpecifications.fetchUserAndProject()` and guarded by `query.getResultType()` so it is skipped on `COUNT` queries. Every TimeEntry response does need its user and project, so they are always fetched — the point is fetching them in **one** query, not N.
- **Cascade:** **none** on either `@ManyToOne`. Timesheet history is owned by the company, not by the user or the project that happens to reference it, so a delete on the parent must never propagate. With no cascade and a not-null FK, a hard `DELETE` on a referenced user or project is simply rejected by the FK constraint — which is why both parents use soft delete (`active = false`) instead: the row stays, the entries keep pointing at it, and history is preserved.

---

## 8. Business rules

**Workflow state machine**

```
Employee creates entry
        ↓
     DRAFT  ←──────────────────┐
        ↓                      │
  Employee submits             │
        ↓                      │
   SUBMITTED                   │
        ↓                      │
   Manager reviews             │
      ↙       ↘                │
APPROVED     REJECTED ─────────┘
                (employee can edit and resubmit)
```

**Rules**
- Employee can only see their own entries
- Employee can only edit or delete their **own** DRAFT entries (ownership resolved from the JWT via `SecurityContextHolder`, never from a client-supplied `userId`)
- Employee can only submit their **own** DRAFT entries
- Only the owner (EMPLOYEE, ownership resolved from the JWT) can re-open one of their **REJECTED** entries — this is the only transition into DRAFT after creation, and it exists so the entry can be corrected and resubmitted (the resubmit loop in the diagram above). Re-opening an entry in any other status is rejected (409). *(Deferred out of Step 5, built on `fix/backend-backlog` and Postman-verified on 2026-07-22.)*
- Manager can see all entries from all users
- Manager can only approve or reject SUBMITTED entries; a manager never edits, submits or re-opens an entry
- A manager cannot approve or reject **their own** entries (segregation of duties) — the caller's id is resolved from the JWT and compared to the entry's owner; a match is refused (403). A manager never logs hours in this system (`POST /api/entries` is EMPLOYEE-only, and the UI hides every logging control from managers), so the only way a manager can own an entry is by having been promoted from EMPLOYEE while holding entries — those are reviewed by a different manager. Modelling a manager who bills hours would require an approver hierarchy (each user's entries routed to *their* line manager), which is deliberately out of scope
- **A user cannot be promoted to MANAGER while they still hold entries in a non-terminal state** (`DRAFT` or `REJECTED`) — refused **409**. The four owner-only transitions are EMPLOYEE-only and resolve ownership from the JWT, so a promoted user can no longer `submit`, `update`, `delete` or `reopen` their own rows, and no manager can act on them either: those entries would be unreachable by every actor, absent from reports (`APPROVED` only) and from the approvals queue (`SUBMITTED` only), yet still listed to their owner. `SUBMITTED` entries do **not** block — the rule above routes them to a different manager, so they are not orphaned. The refusal makes the sequence explicit: the user resolves their own open work, then the promotion succeeds. The check is scoped to the role actually changing to MANAGER, so reactivating a deactivated account through the same endpoint is unaffected
- **A manager cannot demote or deactivate their own account** — refused **409** (`InvalidStateTransitionException`) on both doors: `PUT /api/users/{id}` with `role: EMPLOYEE` or `active: false`, and `DELETE /api/users/{id}`. Both endpoints are MANAGER-only, so the only route back needs the very privilege the call removes, and the rule above (`AccountStatusUserDetailsChecker`) revokes the still-valid token on the next request — the installation would be left with no reachable admin capability. The §17 Team wireframe renders `✏ 🗑` on every row including the caller's, so it is one misclick. Editing your own name or email is unaffected; the guard reads the transition, not the target. **The system therefore always keeps at least one active MANAGER, with no code of its own to enforce it**: the caller of these endpoints is always an active MANAGER (`@PreAuthorize` plus the status checker) and can never be their own target, so at least they survive every successful call. If any of those three conditions changes, the invariant stops being guaranteed and needs an explicit check
- A rejection note is mandatory when rejecting — a reject with a blank note is refused (400) and the entry stays SUBMITTED
- Cannot log entries for a future date
- Hours must be between 0.5 and 24
- Cannot submit entries for an inactive project — refused **400** (`BusinessRuleViolationException`, the same input-data tier as a future date or an out-of-range hours value; it is a property of the data being submitted, not of the entry's workflow state). The same 400 applies to `POST` and `PUT` **only when the caller is already entitled to know the project exists** — see the project-existence ruling below; otherwise those two answer 404. **`409` (`InvalidStateTransitionException`) is reserved for state conflicts only** — an entry that is not in the status the transition requires (submit/edit/delete on a non-`DRAFT` entry, reopen on a non-`REJECTED` one, approve/reject on a non-`SUBMITTED` one)
- **Shared routes stay role-aware.** `/dashboard` and `/entries` are reachable by both roles (`authGuard` only, §13), so the manager-only data they show — `GET /api/users`, the `?status=SUBMITTED` review list — is requested **only** in the manager variant of the page, chosen from `AuthService`'s role signal. The API is the real boundary: an EMPLOYEE that reached those calls would get `403`, so the role-aware rendering is a UX decision, never the protection
- Inactive users cannot log in — their entries remain in the database unchanged
- A user deactivated *after* their token was issued loses access on their next request, not when the token expires — `JwtFilter` runs the loaded `UserDetails` through an `AccountStatusUserDetailsChecker`, so the login-time `active` check cannot be bypassed by an already-issued token

> **Status ruling — an entry the caller does not own is `404`, not `403`** *(decided 2026-07-30)*. The four
> owner-only operations (`submit`, `update`, `delete`, `reopen`) answer "this entry is not yours" with the
> **same** `404` and the same message as "this id does not exist". Distinguishing them made the status code
> an enumeration oracle: an EMPLOYEE could walk the id space and learn which entries exist across the whole
> table — how many there are, in what ranges, how much the rest of the team logs — without reading a single
> row. `TimeEntryService.findOwnedEntry(id, user)` enforces this by construction, folding the ownership test
> into the lookup chain so both failure modes leave through one throw.
>
> **Project-existence ruling — an inactive project is `404` on every endpoint that accepts its id** *(decided 2026-08-24)*.
> `GET /api/projects/{id}` already conceals an inactive project from an EMPLOYEE, but `POST` and `PUT /api/entries`
> answered 400 "Project is not active" for an archived id and 404 for an unknown one, so an employee could walk the
> id space through the entries endpoints and recover exactly the catalogue the projects API hides — the same class
> as the entry-id oracle above, through a different door. Both now resolve the project through
> `TimeEntryService.resolveProject(projectId, callerKnowsItExists)`, which throws the **same** `ResourceNotFoundException`
> message an unknown id gets. **The one exception is the caller who is already entitled to know the project exists**:
> on `PUT /api/entries/{id}`, when the requested `projectId` is the one the caller's own entry already carries, the
> refusal stays **400** `"Project is not active"` — that employee has been reading that project on their own entry
> for as long as it existed, so concealing it would deny a fact they hold while hiding why their edit failed. The
> flag reads the *entry*, never the caller's role: any other archived id, owned entry or not, is a 404.
>
> **This narrows the `403` convention rather than contradicting it.** `403` still means *the caller's role or
> permission does not allow this action*, but **ownership is no longer one of its triggers**: for a
> single-owner resource, "not yours" and "does not exist" must be indistinguishable, so the refusal is a
> `404`. `403` survives wherever the caller may legitimately know the resource exists — a role refusal
> (`@PreAuthorize` on a MANAGER-only endpoint), and the segregation-of-duties refusal on `approve`/`reject`,
> where the manager already reads every entry in the listing and the status therefore discloses nothing.
> The `/api/users/me/password` ruling above is unaffected: it turns on the caller owning `/me` by
> definition, and its `400` was chosen against `403`-as-permission, not `403`-as-ownership.

**Password rules** *(decided 2026-07-28)*
- A new account's password is **generated by the backend**, never supplied by the manager and never a fixed literal: a random value from `SecureRandom` (not `Random`, which is predictable and not cryptographically secure)
- The generated plaintext is returned **once**, in the `POST /api/users` response only — a `CreateUserResponse` distinct from `UserResponse`, so no other endpoint can ever echo it. It is shown once in the §17 snackbar and never retrievable again; only the BCrypt hash is stored
- Any authenticated user can change **their own** password via `PATCH /api/users/me/password`, supplying the current one (verified with `passwordEncoder.matches`) and a new one of 8–72 characters. A wrong current password is refused **`400`**, carrying `fieldErrors.currentPassword` so the form shows the message under that input (see the ruling below). A `newPassword` that matches the stored hash is refused the same way with `fieldErrors.newPassword`: re-encoding the value already in use writes a different hash and would confirm a rotation that never happened. That comparison runs only after the current password has been verified, so it cannot tell an unauthenticated caller whether a guessed value is the account's password. Nobody can change another user's password — a manager who needs to reset an account deactivates and recreates it
- A MANAGER can reset **another** account's password via `POST /api/users/{id}/password-reset`: the backend generates a fresh `SecureRandom` password, stores only its hash and returns the plaintext once, in a `PasswordResetResponse` whose field carries `@ToString.Exclude`. It is the recovery path for a member who lost or forgot theirs — a self-service reset needs an email channel, which is out of scope — and it refuses the caller's own id with **`409`**, because that account already has the path above, which proves the current password. A reset does not revoke a token the member already holds; it expires within the 60-minute lifetime (§10)
- 72 is BCrypt's truncation boundary: input beyond it is silently ignored, so accepting more only lets an unauthenticated caller burn CPU

> **Why this shape.** The rule previously read *"default password `Timetrack2024!`, shown once; employee
> must change it on first login (requires `mustChangePassword` — skip for MVP)"*. With that field cut **and
> no change-password endpoint anywhere**, a fixed literal stops being an *initial* password and becomes the
> **permanent, identical, git-committed** password of every account — the same flaw that removed `data.sql`'s
> hash in §9. The decisive question was not which literal to pick but *"how does a user change their
> password?"*: the manager-supplies and fixed-default options both fail it identically. Adding the endpoint
> is what makes the area coherent; once it exists, generating the initial value costs almost nothing and
> removes the last shared secret.
>
> **Status ruling — a wrong current password is `400`, not `403` or `401`** *(decided 2026-07-28)*. The
> earlier `403` broke this plan's own convention, where `403` means *the caller's role or ownership does not
> permit this action*. On `/api/users/me/password` neither can fail: the caller is authenticated and owns
> `/me` by definition, so nothing about authorization is being refused. `401` is worse than
> wrong: the Angular interceptor treats a `401` on any token-bearing request as an expired session and redirects to `/login`, so a
> single typo in the current-password field would log the user out mid-change. `400` also lets the response
> reuse the `fieldErrors` contract (§10), putting the message under the offending input instead of on a
> generic error banner.
>
> **Implemented as a dedicated `InvalidPasswordException`, not `BusinessRuleViolationException`**
> *(decided 2026-07-29; widened 2026-08-26 when the unchanged-password rule landed)*. Both map to the same
> `400`, so the status ruling above is unaffected — the question was only which exception type carries the
> check. A dedicated type keeps `GlobalExceptionHandler` free of branching inside
> `handleBusinessRuleViolation` to decide whether *this particular* business-rule violation happens to have
> a field to report. The type fixes the status; the field the exception **carries** fixes which input the
> message renders under, the same idiom `DuplicateResourceException` already uses on its 409, so one
> handler serves both password failures instead of one exception type per field. Same precedent as
> `InvalidStateTransitionException` existing alongside `BusinessRuleViolationException` (§12) — a distinct
> exception type when the response shape, not just the status code, differs.
>
> **Re-opening a rejected entry must be reachable from the UI.** The owner (EMPLOYEE) sees a **Re-open**
> action on every one of their `REJECTED` rows in the Entries page — it calls
> `PATCH /api/entries/{id}/reopen`, returns the entry to `DRAFT`, and the row's edit / delete / submit
> icons then appear under the existing DRAFT-only rule. Without this affordance `REJECTED` would be a
> terminal state in practice while the diagram, the business rule and the endpoint all say it is not, and
> the resubmit loop that justifies the whole state machine would be dead code.
>
> **Changing your own password must be reachable from the UI.** The same argument as the Re-open action
> above, applied to the endpoint this rule introduces: every authenticated user reaches a
> **Change password** item in the app shell's user menu, which opens a `change-password-dialog` (current
> password + new password + confirm) calling `PATCH /api/users/me/password`; a `400` carrying
> `fieldErrors.currentPassword` renders under the current-password input and one carrying
> `fieldErrors.newPassword` under the new-password input, and success closes the dialog
> with a snackbar. It is a dialog, not a route, because it is an action on the logged-in user rather than
> a place in the app — no new guard, no new route. Without it, "password change is self-service" would be
> a claim no user can act on, and the generated initial password would in practice be permanent — exactly
> the flaw this whole ruling was written to remove.
>
> **Deliberately out of scope:** `mustChangePassword` — *forcing* the change at first login needs the
> frontend to intercept every route until it happens, which is Step 7a work for little MVP value. Record it
> in `backend/README.md` as a known limitation, not as an oversight.

**Reporting rules** *(decided 2026-07-28)*
- **Every hours figure in a report counts `APPROVED` entries only.** All three endpoints — `summary`, `by-project`, `by-user` — apply the identical filter, so the summary card always equals the sum of the table beneath it
- `pendingHours` (SUBMITTED) is the one exception and stays a **separate, explicitly-named field**. It is a workload signal for the manager — "this much is waiting for you" — and is never folded into a total
- `totalEntries` counts `APPROVED` entries, for the same reason
- DRAFT and REJECTED never appear in any report

> **Why.** The whole DRAFT → SUBMITTED → APPROVED state machine exists so the manager's numbers can be
> trusted — these are the hours a company bills and pays against. Mixing unapproved hours into a total
> silently defeats it. This rule was never written in §8, and the code diverged as a direct result:
> `getHoursByProject`/`getHoursByUser` filtered to APPROVED (the deliberate 2026-07-22 fix) while
> `getSummary` counted APPROVED + SUBMITTED, so the same month produced two different totals.
>
> **Consequence for the code:** `totalHours` (= approved + pending) is the field that *caused* the
> mismatch and is removed from `ReportSummaryResponse`. The DTO becomes `approvedHours`, `pendingHours`,
> `totalEntries` — nothing is lost, and no field can disagree with another.

---

## 9. Seed data

**Initial data — first manager account**

There is no public register endpoint, so the first manager account must exist before anyone can log in.

**Solution: `config/DataInitializer.java`** — a `CommandLineRunner` annotated `@Profile("dev")`, so the
bean is not even instantiated outside the `dev` profile and the seed can never reach a deployed
environment. It reads the admin's email, name and password from `application-dev.properties`
(`app.admin.*`), with the password itself taken from the `ADMIN_PASSWORD` environment variable, and hashes
it at runtime through the existing `PasswordEncoder` bean. The runner is idempotent — a
`findByEmail(...).isPresent()` guard makes a second boot a no-op.

> **Replaced `data.sql` on 2026-07-23 — and the reason is the point.** The original plan seeded the account
> from `src/main/resources/data.sql` with a pre-generated BCrypt hash and `ON CONFLICT DO NOTHING`, running
> on every boot via `spring.sql.init.mode=always`. That put a real credential hash in git — public,
> offline-crackable, and shipped to every future environment including Docker (Step 11). Generating the hash
> in Java at runtime from an env var fixes all three at once. This is the version worth defending in an
> interview; the `data.sql` approach is the one to describe as *what it replaced and why*.

> **The published values were rotated on 2026-08-23, and the history was deliberately left alone.**
> Removing a secret from the working tree does not un-publish it: the datasource password of `f17c01e`
> and the seed hash of `21f5221` stayed reachable on `origin/main` long after both were replaced by
> `${DB_PASSWORD}` and the runtime seeding above. Both credentials were rotated, which is what ends the
> exposure; a `filter-repo` rewrite was rejected because it changes every commit hash from May onward —
> breaking the references the `## Closed` ledger, this plan and the notes all cite — while revoking
> nothing already cloned. Both published values are treated as burned.

**The datasource role.** The application connects as `timetrack_app`, a role with `LOGIN` and nothing
else — no `SUPERUSER`, no `CREATEDB`, no `CREATEROLE` — owning the `timetrack` database and no other
object on the server. `postgres` stays an administration identity, used from pgAdmin and never by a
running process. The bound this sets is precise, and the imprecise version of it is worth refusing: it
does **not** protect this database's own tables, where the application holds full DML by definition. It
removes what a superuser adds on top — every other role's password hash in `pg_shadow`, shell execution
through `COPY … PROGRAM`, and DDL against objects this project does not own.

The role owns the database rather than holding `SELECT`/`INSERT`/`UPDATE`/`DELETE` alone because
`ddl-auto=update` issues DDL against its own tables at startup — creating them and adding columns, never
altering one that already exists. That is the coupling to record: the schema strategy
decides the floor on the privilege. Behind Flyway migrations — the deployment-shaped alternative — the
runtime role could drop DDL entirely and the migration step would carry it instead.

Its coordinates are placeholders **with** a local default (`DB_URL`, `DB_USERNAME`), unlike the three
secrets, which have none. A hostname is not a secret, so the reason to externalise it is different: the
same build has to run against another host, which is what Step 11's compose service needs.

---

## 10. REST API

### Auth — public endpoints
```
POST /api/auth/login       → returns JWT
```

**Token lifetime:** 60 min (`app.jwt.expiration=3600000` in `application.properties`). Cut from the
original 24h on 2026-07-28: a token stolen from `localStorage` was valid for a full day, and with no
refresh-token flow in scope, 60 min is the balance between a usable work session and a bounded blast
radius. When a token expires mid-session the API returns 401 — the Angular interceptor (Step 7a) catches
it, clears the stored session, and redirects to `/login`, which tells the user the session expired. Expiry
is handled once in the interceptor, never per page, and **only for a request that carried a token**: the
`401` of `POST /api/auth/login` means wrong credentials and belongs to the Login page. The access/refresh trade-off is documented in `backend/README.md`.

**Login throttling:** five consecutive failed logins on the same email — or from the same client IP —
answer `429` for one minute. `LoginAttemptService` holds the counters in memory and `AuthService` reads
them *before* the password is verified, so a refused attempt costs no BCrypt work. Both keys are bounded,
because a per-account limit alone never sees one common password sprayed across many accounts, and a
per-IP limit alone puts a whole NAT'd office on a single budget. The window is measured from the **last**
failure and expires on its own; there is deliberately **no permanent lockout**, since a lockout an
attacker can trigger by naming an account is a denial-of-service tool against the account it claims to
protect. A successful login clears both counters. The counters are per-process — they reset on restart
and do not span instances — which is accepted for a single-instance deployment and recorded as a
tradeoff in `backend/README.md`.

### Success responses — status and `Location`

Every controller states its status through a `ResponseEntity` factory (`ok`, `created`, `noContent`),
never a bare `status(200)`: the status is a checked constant, not an `int`.

**Every `201` carries a `Location` header** holding the created resource's URI, built from the current
request rather than a hardcoded path. `POST /api/projects` returns `Location: /api/projects/{id}`, and
the same applies to `/api/entries` and `/api/users`. The client follows what the server sent instead of
assembling that URL from its own copy of the route scheme. Note that `entries` and `users` have no
`GET /{id}` yet: the URI is still the resource's real address — `PUT` and `DELETE` act on it — so the
header stays correct, and the missing read endpoint is a gap in the API, not a reason to omit it.

**A response carries the identifier of every relation it names, not only its label.** `TimeEntryResponse`
returns `projectId` and `userId` beside `projectName` and `userName`, because the response is the only
representation a client holds — `entries` has no `GET /{id}` — and `PUT /api/entries/{id}` takes a
`projectId`. A response carrying the label alone would make §14's pre-filled edit dialog re-derive the key
by matching the name against the projects list, which is only correct while that name stays unique.
Minimising field disclosure governs sensitive fields, not the keys the caller must send back.

**Refusal precedence — the resource is judged before the body.** A service method evaluates its guards
on the loaded entity first (it exists, it belongs to the caller, it is in the state the transition
requires), and only then the checks that read the request body (referenced entities, value ranges). A
resource guard returns the same verdict whatever the body contains; a body check does not, so ordered
the other way the status a refusal produces depends on what the client happened to send, and this
section's per-endpoint refusals become true only sometimes. `TimeEntryService.update` is the case that
established the rule: its DRAFT guard sits immediately after `findOwnedEntry` and before
`resolveProject`, matching `submit`, `reopen` and `delete`. The refused call also stops paying for a
lookup it will discard, but that is the smaller half — determinism is the rule's point.

### Error contract — what every non-2xx response looks like

All errors return the same `ErrorResponse` body from `GlobalExceptionHandler`:
```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed" }
```
Validation errors (400 from `@Valid`, via `MethodArgumentNotValidException`) additionally carry a
field-level map the reactive forms consume to show a message under each input (Step 7b):
```json
{ "status": 400, "message": "Validation failed", "fieldErrors": { "hours": ["Must be at most 24"] } }
```
Each value is an **array**, because one field can fail several constraints at once (`email` can be both
too long and malformed) and Bean Validation reports every one. A form renders the first message or all
of them, but the contract never decides that by discarding violations on the way out.

**Every message is a capitalised sentence, whoever writes it.** A constraint annotation carries no
`message`; its text comes from `src/main/resources/ValidationMessages.properties`, which rewords each
constraint the request DTOs use (`Must not be blank`, `Must be at most 255 characters`) in the voice a
service uses for the messages it throws (`Date cannot be in the future`). Without that bundle Hibernate
Validator's lower-case defaults reach the client, and one `fieldErrors` slot reads in two styles. A new
constraint type joins the bundle before it ships.

**`fieldErrors` is not exclusive to `@Valid` 400s.** It is the channel for *any* failure attributable to
one input, whatever its status: a wrong current password carries `fieldErrors.currentPassword` on a 400,
and a duplicate email or project name carries `fieldErrors.email` / `fieldErrors.name` on a **409**. The
status answers what kind of failure it is; the map answers which control it belongs under. A form binds
`fieldErrors` when present and falls back to `message` when absent, with no branching on the status — so
an exception that concerns one field carries that field's name (`DuplicateResourceException`), rather
than the handler hardcoding it.

### Auth — request/response detail

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `POST /api/auth/login` | public | Authenticate and issue a JWT | `LoginRequest` — `email`, `password` | `200` + `AuthResponse` — `token`, `id`, `name`, `role` · `401` on bad credentials or inactive user · `429` while the email or the caller's IP is inside the failed-login cooldown |

> **Contract ruling — `AuthResponse` carries the caller's `id`** *(decided 2026-09-20)*. It discloses
> nothing: the same value is the `sub` claim of the token in the same body, which the browser already
> holds and the API already trusts. What it buys is the only way the client can recognise its own
> rows, and §8 needs that twice — the entries a manager may **not** review (segregation of duties) and
> the account they may **not** demote or deactivate, whose §14 wireframe draws its actions on every row
> including the caller's. The alternative, matching on `name`, is not an identity: two people share
> one, which is why `by-user` appends `id` to its own sort. **The API stays the boundary** — both rules
> are enforced server-side and answer `403` / `409` whatever the UI draws (§8 *"Shared routes stay
> role-aware"*); the `id` only stops the app offering an action that cannot succeed. The frontend's
> stored-session type guard requires it, so a session saved before this change fails validation and
> starts logged out — chosen over a migration, since one login restores it.

### Users (`UserController` — MANAGER only, except `PATCH /me/password`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/users` | MANAGER | List all users — both roles, **and both active and deactivated accounts** (see the ruling below), active first then alphabetical | — | `200` + `List<UserResponse>`, each carrying `active` |
| `POST /api/users` | MANAGER | Create a user account; the backend generates the password | `CreateUserRequest` — `name`, `email`, `role` | `201` + **`CreateUserResponse`** — `UserResponse` fields **+ `generatedPassword`** (returned this once only) · `400` validation · `409` email already exists |
| `PUT /api/users/{id}` | MANAGER | Update name, email, role, or reactivate/deactivate | `UpdateUserRequest` — `name`, `email`, `role`, `active` (optional — applied only when non-null) | `200` + `UserResponse` · `404` user not found · `409` email already in use, **or a promotion to MANAGER while the user holds `DRAFT`/`REJECTED` entries**, **or a self-demotion / self-deactivation by the caller** (§8) |
| `PATCH /api/users/me/password` | any authenticated | Change **your own** password | `ChangePasswordRequest` — `currentPassword`, `newPassword` (8–72) | `204` no body · `400` validation, **a wrong current password** — `fieldErrors.currentPassword` — **and a `newPassword` equal to the current one** — `fieldErrors.newPassword` (see the §8 status ruling) |
| `POST /api/users/{id}/password-reset` | MANAGER | Reset **another** account's password — the backend generates it (§8) | — | `200` + `PasswordResetResponse` — `generatedPassword` (returned this once only) · `404` user not found · `409` the caller is the target (use `PATCH /api/users/me/password`) |
| `DELETE /api/users/{id}` | MANAGER | Deactivate account (soft delete — sets `active = false`) | — | `204` no body · `404` user not found · `409` the caller is the target (§8 self-lockout) |

> **Two decisions recorded here (2026-07-28):**
> - **The manager never supplies or sees a stored password.** `password` is gone from `CreateUserRequest`;
>   the backend generates it and returns it once via `CreateUserResponse` — the only endpoint that ever
>   carries plaintext. `PATCH /api/users/me/password` is `/me`, not `/{id}`, on purpose: password change is
>   a self-service action, so not even a MANAGER can set another user's password. Full rationale in §8.
> - **`email` stays editable.** The plan previously contradicted itself — this row said `name, role` while
>   §13 and §17 both described editing the email — with no justification recorded for excluding it. The
>   built behaviour is correct and guarded (duplicate check → 409, and only checked when the value actually
>   changed), so the code stands and §13/§17 now agree with it. Email **is** the login identity, so this is
>   a deliberately MANAGER-only operation, not an incidental field.

> **Contract ruling — the token's subject is the `user.id`, not the email** *(decided 2026-08-24)*.
> The decision above stands unchanged: `email` stays editable and stays the **login** identity — the value
> submitted to `POST /api/auth/login` and the key `UserDetailsService` resolves for the
> `AuthenticationManager`. What it is not is the identity the **issued token** carries. `JwtUtil` writes
> `user.id` into the `sub` claim and `JwtFilter` resolves the principal by id, because a subject this very
> endpoint can release and reassign hands a still-valid 60-minute token to whichever account holds that
> email next — a vertical escalation when the new holder is a MANAGER, with no forged signature and no
> stolen credential. Two consequences worth stating: editing an email no longer silently ends its owner's
> session, and tokens issued in the previous format are refused rather than migrated, since an
> email-shaped subject fails to parse as a `Long` and `JwtFilter` already answers `401` for that failure
> class.

> **Contract ruling — `GET /api/users` returns every account, unpaginated** *(decided 2026-08-01)*.
> Two halves, both deliberate:
> - **Deactivated accounts are included.** Soft delete is the only delete this API has, so an excluded
>   account would be unreachable: `PUT /api/users/{id}` with `active = true` is the sole path back, and
>   the manager can only invoke it on a row the list gave them. `UserResponse.active` is what lets the
>   client tell the two apart, rendered as the §17 "Inactive" status.
> - **No `Pageable`.** A company's headcount is tens of rows, and the endpoint's three consumers
>   (§17 Team page, the manager dashboard "Team members" count, the Approvals employee filter) each need
>   the *whole* list to be correct — a paginated response would silently reduce the Approvals filter to
>   whoever landed on page one, and make the dashboard count a page size. This is a stronger reason than
>   the general §20 return-all tradeoff: here pagination would break two features, not merely be
>   unnecessary. It becomes a real question only if a single tenant's user table reaches thousands.

### Projects (`ProjectController`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/projects` | both | Employee: active projects only · Manager: all projects. Alphabetical by name | — | `200` + `List<ProjectResponse>` |
| `GET /api/projects/{id}` | both | Employee: active projects only · Manager: any project. Target of the `Location` header returned by `POST` | — | `200` + `ProjectResponse` · `404` project not found **or inactive and the caller is an EMPLOYEE** |
| `POST /api/projects` | MANAGER | Create a project | `CreateProjectRequest` — `name`, `description` | `201` + `ProjectResponse` · `400` validation · `409` duplicate name |
| `PUT /api/projects/{id}` | MANAGER | Update name, description, or reactivate/deactivate | `UpdateProjectRequest` — `name`, `description`, `active` (optional — applied only when non-null) | `200` + `ProjectResponse` · `404` project not found · `409` duplicate name — **renaming a project to its own current name is not a conflict**: the check exempts the target itself, case-insensitively |
| `DELETE /api/projects/{id}` | MANAGER | Deactivate project (soft delete — sets `active = false`) | — | `204` no body · `404` project not found |

### Time entries (`TimeEntryController`)

| Method · Path | Role | Description | Request body | Response |
|---|---|---|---|---|
| `GET /api/entries` | both | Employee: own entries only (ownership from the JWT) · Manager: all entries | — (see query filters below) | `200` + paged `TimeEntryResponse` — `content` plus a `page` object carrying `size`, `number`, `totalElements`, `totalPages` |
| `POST /api/entries` | EMPLOYEE | Create an entry in `DRAFT` for the authenticated user | `CreateTimeEntryRequest` — `projectId`, `date`, `hours`, `description` | `201` + `TimeEntryResponse` · `400` validation — future date, hours outside 0.5–24 (`BusinessRuleViolationException`, the input-data tier of §12's taxonomy; `409` is reserved for state conflicts) · `404` project not found **or inactive** (§8 project-existence ruling — a create can never be entitled to an archived project) |
| `PUT /api/entries/{id}` | EMPLOYEE | Edit own `DRAFT` entry | `UpdateTimeEntryRequest` | `200` + `TimeEntryResponse` · `400` validation — PUT replaces the whole resource, so it re-runs create's rules (future date, hours range), **and the requested project is inactive but is the one the entry already carries** (§8 project-existence ruling) · `404` entry not found **or not owned by the caller** (§8 status ruling), **or the requested project is unknown or inactive and is not the entry's own** · `409` entry not in `DRAFT` — **this refusal precedes every body-derived one**, so a non-`DRAFT` entry answers `409` whatever `projectId` the body carries |
| `DELETE /api/entries/{id}` | EMPLOYEE | Delete own `DRAFT` entry (hard delete — a draft has no history value) | — | `204` no body · `404` entry not found **or not owned by the caller** (§8 status ruling) · `409` entry not in `DRAFT` |
| `PATCH /api/entries/{id}/submit` | EMPLOYEE | Own entry `DRAFT → SUBMITTED` | — | `200` + `TimeEntryResponse` · `400` the entry's project is inactive (§8: "cannot submit entries for an inactive project") · `404` entry not found **or not owned by the caller** (§8 status ruling) · `409` entry not in `DRAFT` |
| `PATCH /api/entries/{id}/reopen` | EMPLOYEE | Own entry `REJECTED → DRAFT` so it can be corrected and resubmitted | — | `200` + `TimeEntryResponse` · `404` entry not found **or not owned by the caller** (§8 status ruling) · `409` entry not in `REJECTED` |
| `PATCH /api/entries/{id}/approve` | MANAGER | `SUBMITTED → APPROVED` | — | `200` + `TimeEntryResponse` · `403` caller is the entry's owner · `404` entry not found · `409` entry not in `SUBMITTED` |
| `PATCH /api/entries/{id}/reject` | MANAGER | `SUBMITTED → REJECTED` | `RejectRequest` — `rejectionNote` | `200` + `TimeEntryResponse` · `400` note missing · `403` caller is the entry's owner · `404` entry not found · `409` entry not in `SUBMITTED` |

**Query params on `GET /api/entries`** — all optional, combinable:

| Param | Type | Filters |
|---|---|---|
| `month` | String `YYYY-MM` | Entries whose `date` falls in that year and month |
| `projectId` | Long | Entries of one project |
| `status` | `EntryStatus` | Entries in one workflow state |
| `userId` | Long — **MANAGER only** | Entries of one employee (ignored for an EMPLOYEE caller, who is always scoped to their own) |
| `page` | int, default `0` | Zero-based page index |
| `size` | int, default `20`, capped at `100` | Rows per page; a larger request is silently clamped to the cap |
| `sort` | `field,dir` — repeatable | Overrides the default `date` desc, `id` desc. Only `date`, `hours`, `status`, `id`, `employee` and `project` are accepted; any other property is `400` |

### Reports (`ReportController` — MANAGER only, except `GET /summary`)

| Method · Path | Role | Description | Query params | Response |
|---|---|---|---|---|
| `GET /api/reports/summary` | Any authenticated user | Month totals: approved hours, pending hours, approved entry count — **scoped to the caller**: an EMPLOYEE gets their own, a MANAGER the whole company | `month` — String `YYYY-MM`, required | `200` + `ReportSummaryResponse` — `approvedHours`, `pendingHours` (always scale 2, `0.00` on an empty month), `totalEntries` · `400` month missing or malformed |
| `GET /api/reports/by-project` | MANAGER | Hours grouped by project | `month` — required | `200` + `List<ProjectHoursReportResponse>` — `projectId`, `projectName`, `totalHours` (always scale 2), `active` |
| `GET /api/reports/by-user` | MANAGER | Hours grouped by user | `month` — required | `200` + `List<UserHoursReportResponse>` — `userId`, `userName`, `totalHours` (always scale 2), `active` |

> **`by-project` and `by-user` are ordered by hours descending, ties broken by name ascending.** The row
> order is part of the contract, not an accident: a `GROUP BY` guarantees none, so the query states it
> rather than leaving the sort to Angular. What closes the order differs by endpoint: `Project.name` is
> unique by the §8 duplicate-name rule, so hours + name is already total; `User.name` is not, so
> `by-user` appends `id` ascending — otherwise two users sharing a display name and a monthly total
> could swap between two identical calls, which is what makes the endpoint testable.
>
> **Every hours figure the reports serve carries scale 2, and the rule has one owner: the query.** All
> three aggregates are rounded where they are computed — `round(SUM(te.hours), 2)`, and
> `round(COALESCE(SUM(...), 0), 2)` in `summary`, because a fallback literal carries its own scale and an
> empty month would otherwise answer `0`. A shape restated per endpoint drifts: the same figure served as
> `40.00` by one endpoint and `40.0` by another reads as two numbers, and no client can tell a formatting
> difference from a disagreement about the data.
>
> **Role as scope, not as a gate (decided 2026-08-01).** `summary` is the one report both roles call, so
> its `@PreAuthorize` only asserts `isAuthenticated()` and the ownership rule is applied in the service —
> the same rule `GET /api/entries` uses (employee → own, manager → all), expressed as a `:userId IS NULL
> OR te.user.id = :userId` predicate inside the one aggregate query rather than by branching the query.
> An annotation cannot express it, because the role decides *which rows the answer is built from*, not
> whether the call is allowed. The scope applies to the whole entry set, never field by field: the three
> numbers are aggregated over one predicate, so a mixed-scope response — own hours beside company-wide
> pending hours — is not representable.
> `by-project` and `by-user` stay MANAGER-only; they aggregate across people by definition.
>
> **All three count `APPROVED` entries only** — the §8 reporting rule. `pendingHours` is the single
> deliberate exception and is never folded into a total, which is why `totalHours` was removed from
> `ReportSummaryResponse`: it was the field that let the summary disagree with the tables.
>
> **Endpoint and field naming (decided 2026-07-29):** `GET /api/reports/by-employee` is renamed to
> `/by-user`, and `EmployeeHoursReportResponse`/`getEmployeeName()` to `UserHoursReportResponse`/
> `getUserName()`, with the JPQL `AS` alias renamed to match. The reason is not stylistic: the query
> groups `TimeEntry.user` with no role filter, so a user promoted from EMPLOYEE to MANAGER still shows
> up with their historical hours — correctly, since those hours are still billable. `by-employee`
> implied a role guarantee the code never enforced; `by-user` names what the query actually returns.
> Adding the missing filter was rejected — it would hide real billable hours. Done while Step 7a has
> not started, so the endpoint had zero consumers to migrate.
>
> **Soft-deleted rows stay in the report, flagged (decided 2026-07-29):** neither `by-project` nor
> `by-user` filters on `Project.active`/`User.active` — a project or user deactivated mid-month still
> appears with its full hours, because the hours were genuinely worked. What changed is that both
> queries now select and group by the entity's `active` column too, so `ProjectHoursReportResponse`/
> `UserHoursReportResponse` expose it and the client can render an "archived" state instead of a row
> that looks identical to an active one.
>
> Both aggregates group by **id and name** (not name alone), so two users with the same display name
> stay separate rows and a rename does not split history; the id is also the frontend's row key.

> **A collection endpoint is paginated when its volume grows without a bound; otherwise it returns the
> full list.** `GET /api/entries` is the one collection that grows with every imputation, every user and
> every month, so it is paged. Users, projects and the report aggregates are bounded by headcount, by
> the project catalogue and by the month filter, and their consumers need the whole set to be correct
> (see the `GET /api/users` contract ruling above) — pagination there would break features rather than
> protect anything.
>
> **Every collection endpoint owes a total order, paged or not.** A result set is unordered, so an
> endpoint that states no order inherits whatever order the rows happen to be read in — and a single
> unrelated `UPDATE` is enough to move a row, because PostgreSQL writes a new version of it. The order
> is therefore declared: in the JPQL for the report aggregates, and through a `Sort` handed to the
> repository for the rest. The keys must make the ordering **total** — a non-unique sort column needs a
> unique tie-breaker after it, or two equal rows can swap between two identical calls.
>
> | Endpoint | Order |
> |---|---|
> | `GET /api/projects` | `name` asc — unique by the §8 duplicate-name rule, so no tie-breaker is needed. Both role branches share it, so the employee's filtered list is a sub-sequence of the manager's |
> | `GET /api/users` | `active` desc, `name` asc, `id` asc — inactive accounts sort last so the §17 Team table reads without filtering; `name` is not unique, so `id` closes the order |
> | `GET /api/entries` | `date` desc, `id` desc by default; when the caller supplies `?sort=`, `id` desc is appended to it unless already named (see the paging rule below) |
> | `GET /api/reports/by-project` | hours desc, name asc — `name` unique by the §8 duplicate-name rule, so no tie-breaker is needed (see the reports rule above) |
> | `GET /api/reports/by-user` | hours desc, name asc, `id` asc — `name` is not unique, so `id` closes the order, as on `GET /api/users` (see the reports rule above) |
>
> **For a paged endpoint the total order is what makes paging correct**, not merely testable: without a
> unique key after a non-unique column, a row is served on two pages or on none. The page cap
> (`size` ≤ 100) is part of the same contract — an endpoint that honours any requested size is not
> bounded at all.
>
> **The sort key is an allow-list, because `?sort=` reaches the query as a column name.** Only `date`,
> `hours`, `status`, `id`, `employee` and `project` may be named; anything else is refused with `400` before the request leaves
> the controller. A key is a public name, not a path: `employee` and `project` are translated on the server to
> `user.name` and `project.name`, so a review queue can be ordered by person while `user.name` itself stays refused. Two failures follow from binding it unchecked: an unknown property is a framework
> `PropertyReferenceException`, which the error contract has no handler for and which therefore surfaces
> as `500` for what is a client typo; and a nested path resolves through the entity graph, so
> `?sort=user.password,asc` orders the page by a column §10 never returns — an order derived from a
> secret is an observation of it. A client-chosen sort replaces the default entirely, so the tie-breaker is
> **re-applied rather than assumed**: the controller appends `id` as the last `Sort.Order` to whatever
> `Sort` arrives, unless the caller already named it. `@PageableDefault` is a default, not a floor — the
> totality of the order is the API's guarantee, not the caller's choice.
>
> One thing the order does **not** control: how text itself compares. `ORDER BY name` resolves through
> the database's collation, so a locale-aware collation sorts `"nuevo"` before `"Project"` where `C`
> would not. The endpoint guarantees a stable order, not a particular alphabet.
>
> **The paged payload is a DTO, not a framework type.** The response is `content` plus a four-field
> `page` object, never Spring Data's `PageImpl` serialised by reflection: that class is a dependency's
> internal detail, so letting it define the payload puts the API's shape outside this project's control.

---

## 11. Postman setup

Test every endpoint in Postman as soon as it is created. Do not wait until the whole layer is finished.

**Setup — one collection for the project:**
- Create a collection called `07 - TimeTrack` (project convention: `## - ProjectName`)
- Create folders inside it, one per controller: `Auth`, `Users`, `Projects`, `Entries`, `Reports`
- Add each endpoint to its folder as you build it

**For each endpoint, check:**
- Correct HTTP status code — including the three this project's taxonomy turns on: **403** for a role
  refusal, **404** for a resource the caller does not own (§8 status ruling — indistinguishable from a
  non-existent id), and **409** for a state conflict, never 400 for any of them (§8, §12)
- Correct JSON response body — the uniform `ErrorResponse` shape from §10 on every non-2xx, with
  `fieldErrors` present on a `@Valid` 400 **and on any other single-field failure** — the 409 on a
  duplicate email or project name, the 400 on a wrong current password (§10)
- Error cases (missing fields, wrong id, wrong role, wrong source status)

**GET requests** — also testable in the browser (`http://localhost:8080/api/...`)
**POST / PUT / DELETE** — Postman only

**Base URL:** `http://localhost:8080`

---

## 12. Spring Boot folder structure

```
src/main/resources/
├── application.properties      (DB connection, JPA config, JWT secret + expiry)
└── application-dev.properties  (dev-only: show-sql, app.admin.* seed values)

src/main/java/com/victor/timetrack/
├── config/
│   └── DataInitializer.java         (@Profile("dev") CommandLineRunner — seeds the first manager)
├── controller/
│   ├── AuthController.java          (POST /api/auth/login — public)
│   ├── UserController.java          (/api/users — MANAGER only, except PATCH /me/password: any authenticated user)
│   ├── ProjectController.java       (/api/projects)
│   ├── TimeEntryController.java     (/api/entries + the workflow PATCH endpoints)
│   └── ReportController.java        (/api/reports — MANAGER only, except GET /summary: any authenticated user, scoped)
├── service/
│   ├── AuthService.java             (checks the login throttle, authenticates credentials and issues the JWT)
│   ├── UserService.java             (user CRUD + soft delete + SecureRandom password generation and self-service change)
│   ├── UserDetailsServiceImpl.java  (Spring Security — loads a user by email for authentication)
│   ├── ProjectService.java          (project CRUD + soft delete)
│   ├── TimeEntryService.java        (entry CRUD, ownership checks, status transitions)
│   └── ReportService.java           (monthly aggregations for the three report endpoints)
├── repository/
│   ├── UserRepository.java          (findByEmail, existsByEmail)
│   ├── ProjectRepository.java       (findByActiveTrue, existsByNameIgnoreCase)
│   ├── TimeEntryRepository.java     (JpaSpecificationExecutor + the report aggregation queries)
│   └── TimeEntrySpecifications.java (static Specification factories — one per optional filter + the fetch-join)
├── model/
│   ├── User.java           (@Entity — account, role, active flag)
│   ├── Project.java        (@Entity — project, active flag)
│   ├── TimeEntry.java      (@Entity — the logged hours, owns both FKs)
│   ├── Role.java          (enum: EMPLOYEE, MANAGER)
│   └── EntryStatus.java   (enum: DRAFT, SUBMITTED, APPROVED, REJECTED)
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java                 (email + password)
│   │   ├── CreateProjectRequest.java         (name + description)
│   │   ├── UpdateProjectRequest.java         (name + description + active — optional, applied only when non-null)
│   │   ├── CreateTimeEntryRequest.java       (projectId, date, hours, description — also used by PUT)
│   │   ├── RejectRequest.java              (rejectionNote body for PATCH /reject)
│   │   ├── CreateUserRequest.java          (name, email, role — no password: the backend generates it)
│   │   ├── UpdateUserRequest.java          (name, email, role, active)
│   │   └── ChangePasswordRequest.java      (currentPassword + newPassword — self-service only)
│   └── response/
│       ├── AuthResponse.java                    (token + name + role)
│       ├── UserResponse.java                    (id, name, email, role, active — never the hash)
│       ├── CreateUserResponse.java              (UserResponse fields + the generated plaintext, returned once)
│       ├── ProjectResponse.java                 (id, name, description, active)
│       ├── TimeEntryResponse.java               (flattened user/project ids + names + status, no entities)
│       ├── ReportSummaryResponse.java         (approvedHours, pendingHours, totalEntries)
│       ├── ReportSummaryProjection.java      (interface projection — the month's three scalars)
│       ├── ProjectHoursReportResponse.java    (interface projection — hours grouped by project)
│       ├── UserHoursReportResponse.java       (interface projection — hours grouped by user)
│       └── ErrorResponse.java                 (uniform JSON error body from GlobalExceptionHandler)
├── exception/
│   ├── GlobalExceptionHandler.java        (@RestControllerAdvice — returns clean JSON errors)
│   ├── ResourceNotFoundException.java     (→ 404)
│   ├── BusinessRuleViolationException.java (input-data rule broken: hours range, future date, inactive project → 400)
│   ├── InvalidStateTransitionException.java (illegal workflow transition → 409)
│   ├── InvalidPasswordException.java      (wrong currentPassword, or a newPassword equal to it → 400, fieldErrors on the field it carries)
│   ├── DuplicateResourceException.java    (duplicate email or project name → 409, caller-facing message)
│   ├── ForbiddenOperationException.java   (segregation of duties on approve/reject → 403)
│   └── TooManyAttemptsException.java      (email or IP inside the failed-login cooldown → 429)
└── security/
    ├── JwtUtil.java                  (generates and validates the token, reads its claims)
    ├── JwtFilter.java                (OncePerRequestFilter — puts the user in the SecurityContext)
    ├── JwtAuthenticationEntryPoint.java (unauthenticated request → 401 JSON instead of an empty 403)
    ├── SecurityConfig.java           (filter chain, public routes, CORS, BCryptPasswordEncoder)
    └── LoginAttemptService.java       (in-memory failed-login counter, keyed by email and by client IP)
```

---

## 13. Angular folder structure

```
src/app/
├── layout/
│   └── shell/                     ← MatSidenav + toolbar around a nested <router-outlet />; the component of the guarded parent route, so /login never renders inside it
├── core/
│   ├── guards/
│   │   ├── auth-guard.ts         ← blocks any route without a stored token
│   │   ├── role-match.ts         ← `roleMatch(role)` CanMatchFn: picks the role's variant of a route declared twice (`/dashboard`)
│   │   ├── no-auth-guard.ts      ← the mirror: keeps an authenticated user off /login, sending them to /dashboard
│   │   ├── one-time-secret-guard.ts ← CanDeactivateFn: keeps /team from a create or reset request until its generated password is closed; an ended session always leaves
│   │   └── manager-guard.ts      ← blocks manager-only routes for an EMPLOYEE
│   ├── interceptors/
│   │   └── auth-interceptor.ts   ← attaches the Bearer token; on a token-bearing 401 expires the session → /login
│   ├── state/
│   │   └── pending-approvals.ts  ← the root holder of the sidebar badge's count: `count` read-only, `refresh()`, `clear()`
│   ├── strategies/
│   │   └── app-title-strategy.ts ← TitleStrategy: suffixes each route's title with the brand, or writes the brand alone
│   └── services/
│       ├── auth-service.ts       ← login, logout, current user + role
│       ├── entry-service.ts      ← /api/entries CRUD + the workflow PATCH calls
│       ├── project-service.ts    ← /api/projects
│       ├── user-service.ts       ← /api/users (Team page, manager dashboard card, Approvals employee filter) + changePassword() → PATCH /api/users/me/password + resetPassword(id) → POST /api/users/{id}/password-reset
│       └── report-service.ts     ← /api/reports (the three monthly reports)
├── pages/
│   ├── login/                    ← email + password form, both roles
│   ├── dashboard/
│   │   ├── employee-dashboard/   ← stat cards + recent entries, EMPLOYEE variant of /dashboard
│   │   └── manager-dashboard/    ← MANAGER variant of /dashboard (Step 7c)
│   ├── entries/                  ← the page: filter bar, paging, the three states, row actions
│   │   ├── entry-list/           ← presentational table: sortable columns, per-status actions
│   │   └── entry-dialog/         ← create / edit an entry (reactive form)
│   ├── projects/                 ← project CRUD table, manager only
│   │   └── project-dialog/       ← create / edit a project (name + description, reactive form)
│   ├── approvals/                ← SUBMITTED entries queue, approve / reject
│   ├── team/                     ← user list, manager only
│   │   └── user-dialog/          ← add and edit user (name, email, role — never a password field)
│   └── reports/                  ← monthly report views (summary, by project, by employee)
└── shared/
    ├── components/
    │   ├── change-password-dialog/ ← current + new password form, opened from the shell user menu (not routed) → PATCH /api/users/me/password
    │   ├── confirm-dialog/     ← generic yes/no confirmation, used before every delete
    │   ├── logo/               ← the clock mark, sized by each host's class (Login, shell toolbar)
    │   ├── reject-dialog/     ← rejection note input, used in Approvals
    │   ├── stat-card/         ← outlined number + label with a pulsing skeleton, used by both dashboards and Reports
    │   └── status-badge/      ← coloured badge, used in Entries, Approvals, Dashboard
    ├── models/                    ← interfaces mirroring the backend response DTOs
    │   ├── auth.ts                ← LoginRequest, AuthResponse + isAuthResponse, Role + isRole
    │   ├── api-error.ts           ← ApiError, its runtime type guard, `apiErrorMessage()` and `placeFieldErrors()`
    │   ├── user.ts                ← ChangePasswordRequest (Step 7a); User joins it in Step 7d
    │   ├── page.ts                ← generic Page<T> + PageRequest for the paged GET /api/entries
    │   ├── project.ts             ← Project, CreateProjectRequest, UpdateProjectRequest
    │   ├── time-entry.ts          ← TimeEntry + EntryStatus
    │   └── report.ts              ← ReportSummary (Step 7b); the two hours reports join it in Step 7d
    └── dates.ts                   ← local `YYYY-MM-DD` / `YYYY-MM` helpers and the month options of the filter bars
```

**File naming — the 2025 Angular style guide, applied to every file in `src/app/`** (ruled 2026-09-11).
A file is named after the primary identifier it holds, in kebab-case, with **no type suffix**: `AuthService`
→ `auth-service.ts`, `authGuard` → `auth-guard.ts`, a `Login` component → `login.ts`. A file holding several
identifiers takes the name of their common theme (`auth.ts` for the auth DTOs), never a generic `utils.ts`.
A spec is its file's name plus `.spec.ts`. The `.service.ts` / `.model.ts` suffixes are the 2016 guide the
CLI stopped generating in v20; the class keeps its descriptive name (`AuthService`, not the CLI's bare `Auth`).

**`entry-list/` is the interactive entries table, not every table of entries** (ruled 2026-09-18). It owns the
sortable headers that drive the API's `sort` param and the per-status row actions of `/entries`. A dashboard's
list — the employee's recent entries, and in Step 7c the manager's review list — is a glance with its own
columns, no sort and its own actions, so it stays inline in its dashboard component: reused there, `EntryList`
would draw sort arrows that respond to nothing. A table is extracted into `shared/` or a presentational child
only when a second page needs the same columns **and** the same interactions.

### Angular routes
```
/login
/dashboard          → authGuard
/entries            → authGuard (both roles — employee sees own, manager sees all)
/projects           → authGuard + managerGuard
/approvals          → authGuard + managerGuard
/team               → authGuard + managerGuard · canDeactivate: oneTimeSecretGuard
/reports            → authGuard + managerGuard
```

The two `authGuard`-only routes above (`/dashboard`, `/entries`) are shared by both roles and their
manager variants call MANAGER-only endpoints — see the §8 rule **"Shared routes stay role-aware"** for
which calls are gated and why the API, not the rendering, is the boundary.

The route list above is complete: **`change-password-dialog` adds no route**. It is opened from the app
shell's user menu via `MatDialog` (§8 ruling, §14 wireframe) — an action on the logged-in user, not a
place in the app — so it needs no guard and no entry here.

### Shared state — who owns each multi-page endpoint

The §6 rule decides this once for the whole app: **the page component under `pages/` owns the state for
its route, each page fetches for itself on its own load, and there is no cross-page cache.** `AuthService`
and the pending-approvals count are the two app-wide exceptions. One line per endpoint read by more than one page, so no two pages solve
it differently mid-build:

| Endpoint | Pages that read it | Owner |
|---|---|---|
| `GET /api/entries?month=` | Employee dashboard (stat cards + recent list) · Entries page (table) | **Each page fetches independently** into its own `entries` signal. The dashboard asks for status counts (`size=1`) and page 0 as its recent list; the entries page asks for whatever the filter bar holds — the same URL with different params, so a shared cache would be wrong more often than right. Refetch after every mutation on the page that made it |
| `GET /api/entries?status=SUBMITTED` | Manager dashboard ("Pending approval" card + review list) · Approvals page (queue) | **Each page fetches independently.** Approving from the dashboard refetches only the dashboard; the Approvals page is re-read when the user navigates to it |
| `GET /api/projects` | Projects page · Entries filter bar · entry-dialog project selector · Manager dashboard ("Active projects" card) | **Each page fetches independently** on load. The entry-dialog receives the already-loaded list from its parent page through `MatDialog` data — it does not call `ProjectService` itself |
| `GET /api/users` | Team page · Manager dashboard ("Team members" card) · Approvals employee filter | **Each page fetches independently** |
| `GET /api/reports/summary?month=` | Reports page ("Approved this month" card) · Manager dashboard ("Approved this month" card) · Employee dashboard ("Approved this month" card, scoped by the token) | **Each page fetches independently**, for its own selected month |
| — current user + token (no endpoint after login) | App shell (name, role-filtered sidebar) · both guards · every role-aware page | **`AuthService`** — the one piece of app-wide state, the `session` signal, written to `localStorage` by `login()` and `logout()` themselves. Auth outlives every route, so a page cannot own it |
| Pending-approvals count (`MatBadge` in the shell) | App shell (draws it) · Approvals page and manager dashboard (change it) | **`PendingApprovals`** in `core/state/`, a root holder: the shell renders `count()` and calls `refresh()` on every `NavigationEnd`, `/approvals` and the manager dashboard call `refresh()` after each approve or reject, and the shell calls `clear()` when it is destroyed, so the next session never shows the last one's number. **Live-synced since 2026-09-22**, reversing the first ruling, which left the badge disagreeing with the queue beside it until the next navigation. One signal behind `asReadonly()` and a `switchMap` over refresh and clear requests — not the store §20 rejects |

---

## 14. UI design

### Visual identity — what makes this look like a different product

TimeTrack is an internal payroll-adjacent tool: the feeling to hit is **calm operational instrument**, not
the friendly consumer app 05 was or the generic corporate portal 06 was. A timesheet is read many times a
day by people who want the numbers, so the app is quiet, dense and flat. It differs from **every published
project** on four axes, each one a single theming decision:

- **Palette** — a cool **teal** primary (`#00695C` intent) on a light-neutral grey surface, with the four
  status colours as the only saturated ink on screen. Project 05 shipped Material's **blue** palette and
  project 06 its **azure/blue** default; nothing in the portfolio is teal, and the coolness is the
  point — money and hours should not look playful.
- **Density and rhythm** — **compact** Material density on an **8px** grid. Projects 05 and 06 both ran
  Material's default (comfortable) density with generous card padding; here ten table rows must fit on a
  laptop screen, because the table is the app.
- **Shape** — **flat**: cards at elevation 0 with a 1px outline, and a small **4px** corner radius. 05 and
  06 both used the default rounded, elevated Material card. Flat surfaces plus one accent colour is what
  makes a data screen readable.
- **Data presentation** — the dominant surface is the **dense data table with an inline status badge**, and
  stat cards are a thin summary strip above it. 05 led with a card/board grid and 06 with form-centred
  pages; leading with the table is a different Material layout to build and to defend.

Layout skeleton stays a `MatSidenav` shell (as in 06) on purpose — a role-filtered sidebar is the correct
shell for seven routes, and the identity is carried by the four axes above, not by moving navigation for
the sake of it.

### App shell

`MatSidenav` with a fixed toolbar and a scrollable content area — the same skeleton as project 06, wearing
the teal / compact / flat identity above.

```
┌─────────────────────────────────────────────────┐
│  toolbar: logo + app name + user menu ▼         │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│   sidebar    │        page content              │
│   EMPLOYEE   │                                  │
│  Dashboard   │                                  │
│  My Entries  │                                  │
│              │                                  │
│   MANAGER    │                                  │
│  Dashboard   │                                  │
│  Entries     │                                  │
│  Projects    │                                  │
│  Approvals ● │                                  │
│  Team        │                                  │
│  Reports     │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

- The routed page renders inside a `<main class="page-content">` capped at `max-inline-size: 80rem`,
  left-aligned beside the sidebar (added 2026-09-18). On a wide monitor the uncapped page stretched four
  stat cards to ~400px each and opened a wide gap between table columns; capping the whole page rather
  than each block keeps cards and tables on one right edge. Below ~1366px it changes nothing
- Sidebar links filtered by role — only one section is shown depending on who is logged in
- `MatBadge` on Approvals link showing the count of pending SUBMITTED entries
- Toolbar shows the logged-in user's name as a `MatMenu` trigger; the menu holds **Change password** and
  **Log out**, in that order. "Change password" opens the shared `change-password-dialog` (wireframe below)
  — per the §8 ruling it is a dialog, not a route, so it needs no new guard and no entry in §13's route list

---

### Colour palette

| Role | Colour | Usage |
|---|---|---|
| Primary | Teal (`#00695C`) | Toolbar, buttons, active links |
| DRAFT | Grey (`#616161`) | Status badge |
| SUBMITTED | Blue (`#1565C0`) | Status badge |
| APPROVED | Green (`#2E7D32`) | Status badge |
| REJECTED | Red (`#C62828`) | Status badge |
| Project Active | Green (`#2E7D32`) | The Projects (and Team) Status pill — `--project-active`, its own token sharing APPROVED's value and measured contrast, never its meaning |
| Project Inactive | Neutral (`outline-variant` / `surface-container` / `on-surface-variant`) | The same pill for a soft-deleted row |
| Pending count | Primary (`--mat-sys-primary` / `on-primary`) | The shell's Approvals badge, through `mat.badge-overrides` — not Material's default error red (decided 2026-09-22): the count is work waiting, and red already means REJECTED |
| Surface | White / light grey | Cards, sidebar background |

The three saturated status colours are Material's 800 tones, not the 700s first planned: measured on
2026-09-18 against the badge's own fill — the colour at 8% over white — `#1976D2`, `#388E3C` and
`#D32F2F` fell under 4.5:1 at badge size, and the 800s clear it (5.1, 4.6 and 5.0; grey 5.5).

---

### Design system — decided once, obeyed by all eight pages

> **"Eight pages" throughout §14 and §20 means eight *views*, not eight routes.** §13 lists seven routes;
> `/dashboard` renders two genuinely different pages (employee and manager variants), which is why the
> visual QA checklist has eight screens to walk.

This project is a portfolio piece: a recruiter opens it for about two minutes, on an unknown screen, and
judges it before reading a line of code. What makes it look professional is not decoration — it is
**consistency**. Eight pages built on different days drift unless the values below are fixed up front, so
these are decisions, not suggestions, and each one is violable in the §6 sense: a reviewer can open a
stylesheet and point at the break.

| Decision | The rule |
|---|---|
| **Theming** | One `styles/material-theme.scss` holding a scoped `mat.theme()` (Angular Material v19 uses the M3 API). Component stylesheets **never** override Material internals with CSS — that is the pattern that breaks on every Material upgrade |
| **Primary colour** | A teal-based M3 palette, declared once in `material-theme.scss`. `#00695C` above is the **intent**; under M3 the theme generates its own tonal ramp from it, so the rendered hex will differ and that is correct — do not force the seed hex back with CSS |
| **Status colours** | Four CSS custom properties (`--status-draft`, `--status-submitted`, `--status-approved`, `--status-rejected`) declared once in the global stylesheet and consumed **only** by `status-badge`. They are not theme colours; no other component may reference them |
| **Typography** | Material's type scale only. Page title `headline-small`, section heading `title-medium`, table and body text `body-medium`, stat-card number `display-small`, card label `body-small` muted. **No `font-size` in a component stylesheet**. One named exception, ruled 2026-09-22: Login's "TimeTrack" (`.login-brand-name`, `display-medium` on the branding panel, `title-large` in the phone lockup) is set at `font-weight: 700`, because there it is the logotype beside the clock mark rather than interface text; the toolbar's brand, which sits among controls, keeps the scale's weight |
| **Spacing** | An 8px grid: 8 · 16 · 24 · 32, **written in `rem`** (0.5 · 1 · 1.5 · 2rem at the default 16px root) so spacing and fixed widths grow with the user's browser font size. Page padding 24 desktop / 16 below 600px, gap between cards 16, vertical gap between sections 32. No arbitrary values; `px` only for hairline borders, media-query breakpoints and the theme's shape tokens. **The grid governs spacing between elements, not optical alignment inside one** — ruled 2026-09-22: a value measured against a component's own content is allowed and named here, and a value not named here is still a finding. The four: the status pills' `0.125rem` vertical padding (`.status-pill` and `status-badge`'s `.badge`, one mould — at `0.25rem` the pill grows from 22 to 26px and reads as a chip), the Approvals badge's `container-offset` (centres `MatBadge`'s 18px box on its link's text; a grid step moves it 2px off), the page title's and the dialogs' error line's `0.25rem` focus-ring offset, and the dashboards' "View all", pulled out by `-1 × --mat-button-text-horizontal-padding` so its label, not its button box, meets the table's right edge — it reads Material's token rather than a number, so the alignment follows the button's padding if the theme changes it |
| **Elevation & shape** | Flat, per the identity: cards are `<mat-card appearance="outlined">` at elevation 0 with a 1px outline; only overlays lift — dialogs at elevation 3, menus/snackbars at Material's default. Never a hand-written `box-shadow`. One 4px corner radius, set as the theme's shape token and never overridden per component |
| **Shared styles** | A rule several components share is declared once in a `styles/` partial and consumed by class — `_page.scss` for the routed views' blocks (header, filter bar, stat-card strip, the three states), `_table.scss` for every table's wrapper, loading overlay and column rules, `_dialog.scss` for the dialogs' form, error line and destructive confirm — never copied into each component stylesheet. A global rule carries no encapsulation attribute, so it reaches a dialog the overlay renders outside its opener's DOM; a class with a single user stays in its own component. Added 2026-09-20, after the pair `.dialog-form` / `.dialog-error` had been copied into four stylesheets. A global rule that must beat a Material component's own stylesheet — injected after the global one — carries one more class than Material's selector: the column rules sit under `.table-wrapper` because `.mdc-data-table__cell` sets `text-align: start` with one class. `_table.scss` added 2026-09-21, when the page and table blocks had been copied into five stylesheets |
| **Density** | Material's **compact** density, set once in `mat.theme()` and inherited by every `MatTable` and form field — so ten rows fit on a laptop screen without scrolling. Never set per table |
| **Paginator** | Ten rows per page, **no page-size select**: `MAT_PAGINATOR_DEFAULT_OPTIONS` sets `hidePageSize` in the `providers` of each page that renders a paginator (`Entries` today) — never in `app.config.ts`, where even the token's import put the paginator, select, form field and tooltip in the initial bundle — because the select is a full outlined form field that turns the footer into a form. The paginator reads as the table's footer — `mat.paginator-overrides` tints it `surface-container-low` with `on-surface-variant` text. Decided 2026-09-18 |
| **Dates** | English UI, **day-first dates**: the app runs under the `en-GB` locale — `LOCALE_ID` for `DatePipe` and `MAT_DATE_LOCALE` for the datepicker — because its users are Spanish teams, and `9/19/2026` reads backwards to them while `3/4/2026` is ambiguous outright. A text month keeps a table date unambiguous; the datepicker's input is numeric (`19/09/2026`) and is parsed by the date-fns adapter (`provideDateFnsAdapter`), because `NativeDateAdapter.parse` is `Date.parse`, which cannot read a day-first string. Each table shows the year only when the range its query can return needs one, and that range is the query's, not the screen's: every entry table can be asked for any month — `/entries` and `/approvals` through their filters, both dashboards' lists because they send no month at all — so all of them print `19 Sept 2026`. A view bounded to one month by construction could drop the year; none is |
| **Dark mode** | **Out of scope, deliberately.** One theme finished properly beats two half-done, and the demo is judged in light mode. Revisit in project 08 |

---

### Motion

Animation here is feedback, not decoration — the bar is "the app feels responsive", not "the app moves".

- **Skeleton cards pulse.** A static skeleton reads as a broken page; a slow opacity keyframe reads as
  loading. This is the one animation that is not optional, because §14 mandates skeletons everywhere
- **Sidenav** uses Material's built-in slide in `over` mode — do not customise it
- **Dialogs and snackbars** keep Material's default enter/leave. No custom transitions
- **The account menu arrow** turns 180° over 150ms while its menu is open, driven by the trigger's
  `menuOpened` / `menuClosed` outputs, because `MatMenuTrigger` updates `aria-expanded` but never its own
  content; the turn is instant under `prefers-reduced-motion`
- **Approve / reject** gives its feedback through the snackbar and the row disappearing on refetch; no
  bespoke row animation
- **Budget:** any transition is ≤ 200ms and fires on a state change only. Nothing animates on page load,
  nothing loops, nothing moves purely to look busy
- **`prefers-reduced-motion`** disables the skeleton pulse — a media query in the global stylesheet

---

### Accessibility floor

Small list, non-negotiable, and cheap if done as each page is built rather than at the end:

- **Every icon-only button carries an `aria-label`.** ✏ 🗑 ✓ ✕ ➤ are the entire interaction on Entries,
  Projects, Team and Approvals — without labels those four pages are unusable with a screen reader
- **Status is never conveyed by colour alone.** The badge always shows its text; the colour reinforces it
- **Check the four status colours at badge size** against the 4.5:1 AA contrast ratio on white, and darken
  the green and the blue if they fall short. Verify, do not assume — small text on a coloured chip is the
  usual place this fails
- **Focus stays visible** — never `outline: none` without a replacement. `MatDialog` already traps focus:
  do not break it. **Every Material button, icon button, list item, menu item, option and sort header draws a 3px ring on
  keyboard focus** — added 2026-09-22:
  `material-theme.scss` includes `mat.strong-focus-indicators` once, in `primary`, because without it
  Material leaves its ring hidden and an icon button shows focus only through its state layer, 1.25:1
  against a table row; a button's ring sits outside the button, on the surface around it, so the primary
  toolbar takes its own `on-primary` ring, the way it takes its own icon colour. Form fields carry no such ring
  and need none: an outlined `mat-form-field` shows focus by thickening its own outline in `primary`. **A heading focused by script shows its ring through `:focus-visible` alone, sized to
  its text**, 3px wide like Material's — ruled 2026-09-22: a page's `<h1>` is the focus target of last resort when a write or a
  reload removes the control that held it, and `:focus` rang it after every mouse action and after a
  click on the title itself, while the browser's own heuristic matches a script-moved focus only when the
  last input was the keyboard; `inline-size: fit-content` stops a flex column stretching the ring across
  the page. The dialogs' error line, the other script-moved focus target, rings the same way (added
  2026-09-22)
- **Closing a dialog returns focus to what opened it.** `MatDialog` restores focus to the element that
  held it when the dialog opened, so a dialog opened from a `mat-menu-item` must pass the menu's trigger
  as `restoreFocus`: the item is destroyed with its menu, and the default restore leaves focus on
  `<body>` (WCAG 2.4.3)
- **All visible content sits in a landmark** — added 2026-09-22: the shell's toolbar is wrapped in a top-level
  `<header>`, which takes the `banner` role, beside the sidenav's navigation list and `<main class="page-content">`;
  each page's own `<header>` sits inside `<main>` and is not a banner, so there is exactly one. A bare
  `mat-toolbar` has no role, and axe's `region` rule flagged the brand on every page
- **Every page owns exactly one `<h1>`, and it names the view** — never the brand, which is plain text
  wherever it appears. Material's title directives add typography, not heading semantics, so they go on a
  real heading as an attribute (`<h1 mat-card-title>`, `<h2 mat-dialog-title>`), never as the bare
  element, which leaves the view with no entry in the heading outline (WCAG 1.3.1)
- **Every routed page declares its own `title`** — the name of the page only (`'Dashboard'`), never the
  brand: `core/strategies/app-title-strategy.ts`, provided for `TitleStrategy` in `app.config.ts`, appends
  `| TimeTrack` and writes the brand alone when no route resolves one. A route added without a `title`
  would otherwise keep the previous page's name in the tab, because the default strategy writes nothing
  then; `index.html`'s `<title>` is only the pre-bootstrap fallback (WCAG 2.4.2)
- **Every password input has a visibility toggle** — a `type="button"` `matIconButton` `matSuffix` with a
  fixed `aria-label` ("Show password") whose on/off state is `[attr.aria-pressed]`, never a name that flips
  between Show and Hide. Its `mousedown` default is prevented, so pressing it keeps focus in the field
  instead of blurring it and marking an empty control touched mid-typing
- **A control that shows and hides a panel states both its state and its target.** `aria-expanded` bound to
  the panel's open state, and `aria-controls` naming the panel's DOM `id` — a template reference variable
  such as `#drawer` never reaches the DOM, so it links the two for Angular only. The shell's navigation
  toggle points at `id="app-sidenav"`
- **Every table action is reachable by keyboard**, in the order the row reads. **A table box that holds no
  control is itself a keyboard stop** — added 2026-09-22: the arrow keys scroll a box only while focus is
  inside it, so the employee dashboard's recent list, which has no row actions and no sort headers, takes
  `tabindex="0"` with `role="group"` and `aria-labelledby` its heading — a group, not a region, because the
  `<section>` around it is already the "Recent entries" region. **Widened 2026-09-23** to the two Reports
  tables, the only other boxes with neither a sort header nor a row action; on those the ring is drawn by the
  `.table-area` around the wrapper rather than by the wrapper itself, since an `outline` is painted outside the
  border box and that box's `overflow: hidden` clips its child's away entirely
- **A destructive confirmation opens with the focus on its safe button — recorded 2026-09-20.** Material
  focuses the first tabbable element and `confirm-dialog` puts Cancel first in the DOM, so a reflex Enter
  cancels and reaching Discard / Delete / Deactivate costs a deliberate Tab. That friction is the point:
  do not "fix" it by autofocusing the confirm button
- **A mutation must not destroy the control that holds focus — added 2026-09-20.** The dialog rule above
  covers the opener that is destroyed with its menu; a row action has the same failure one step later,
  because the refetch that follows a successful write re-renders the row. Either keep the control across
  the write (one button whose label and icon change, as on Projects) or hand the confirmation a
  `restoreFocus` target the write cannot remove (the page's own primary action, as on Entries, whose
  delete takes the whole row away). `trackBy` is what makes the first option work: without it the row
  itself is a new node. **It keeps the node, not the focus, once the table can reorder** — added
  2026-09-21: a sort that moves a row detaches and reinserts its node, which drops focus to the body, so a
  page whose rows can move hands focus back to the control the write started from once the refetch has
  rendered (Projects' `restoreFocus()`). **And when the refetch removes that control instead of moving it**
  — added 2026-09-21: the first item created from a first-use empty state takes the empty state's button
  away with it, so the hand-back falls back to the page's header action, the one target no refetch
  removes; one helper, `refocusAfterRender()` in `shared/focus.ts`, holds the rule for Projects and
  Entries. **A move made when the request resolves is conditional on where focus is by
  then** — added 2026-09-20: the user may have tabbed away, or opened a dialog whose focus trap an
  unconditional move would break by sending them to `aria-hidden` content behind it, with no Escape out
  of a `disableClose` dialog. Move only while focus is still on the control that started the write, or
  has already fallen to the document body. **That test is `refocusAfterWrite()`, and it is a second
  helper rather than an argument to the first — widened 2026-09-23**: the two rules read as one
  predicate and differ only in the moment they measure it. `refocusAfterWrite()` runs when the
  write resolves, while the pressed control is still on screen; `refocusAfterRender()` runs from
  `afterNextRender`, once a refetch has removed it. Routing the
  first through the second makes it a no-op, because at render time nothing has been removed yet and the
  guard returns early. The three review-and-row actions (`/approvals`, the manager dashboard and
  `/entries`) call it, including the rejection path, which met the rule only by accident while its dialog
  opened with `restoreFocus: false`. **A failed save hands focus to what the user has to fix** —
  added 2026-09-22: the first field in error, else the dialog's error line (the dialog note under the
  three-states table)
- **A control that shows text is named by that text.** No `aria-label` on top of visible text: it replaces the
  text as the accessible name, and speech input then cannot reach the control by what the user reads
  (WCAG 2.5.3) — the toolbar's account trigger is named by the user's name alone
- **Icons on a coloured container take its `on-*` colour through the icon button's own token.** A
  `matIconButton` reads `icon-color`, not the container's text colour, so on the `primary` toolbar it stays
  `on-surface-variant` grey, under the 3:1 non-text minimum (WCAG 1.4.11). Set `on-primary` with
  `mat.icon-button-overrides` nested under `.mat-toolbar`: at `html` it would whiten every icon button on a
  light surface, and a `mat.icon-overrides` would stop the icon inheriting the button's disabled colour

---

### Visual QA — the finish bar

The gap between "it works" and "it looks finished" is where portfolio projects usually die, so it gets a
checklist rather than good intentions. Run it **at the end of Step 7d, before gate G4**, over all eight
pages in one sitting — that is the only way inconsistency becomes visible:

- [x] Every page uses the type scale and the 8px grid — no stray `font-size`, no arbitrary margin
- [x] The three states (loading · error · empty) are reachable on every page: throttle the network for
      loading, stop the backend for error, filter to a month with no data for empty
- [x] All four status colours pass contrast at badge size, and no status reads by colour alone
- [x] Every icon-only button has an `aria-label`; every table action is reachable by tab
- [x] At 1024, 768 and 375px wide: no horizontal page scroll, sidenav behaves per the responsive rules,
      tables scroll inside their wrapper, dialogs stay a card with every action reachable below 600
- [x] Skeletons pulse; nothing else animates on load; `prefers-reduced-motion` stops the pulse
- [x] Two screenshots worth putting in the README exist — the manager dashboard and the entries page

Run 2026-09-22 on the demo dataset, all nine views (Login, both dashboards, Entries as each role, Approvals,
Projects, Team, Reports): a stylesheet scan found no `font-size` but the empty-state glyph's `4rem` and no
off-grid value outside the named optical exceptions; headless at 1024, 768 and 375 found no sideways page
scroll, the sidenav `side` and open only at 1024, every table inside its `overflow-x: auto` wrapper, no
unnamed button, every table action tabbable and every status pill carrying its word; axe (WCAG 2 A/AA) found
no violation, colour contrast included, with all four statuses on screen; each page reached its loading,
error and empty states with the API held, failed and emptied; the entry, project, member and reject dialogs
stayed 343px cards at 375 with every action reachable; and on load only the skeletons pulse beside the
spinners each page's state row names, their pulse `none` under `prefers-reduced-motion`.

---

### Material components used

| Component | Where |
|---|---|
| `MatSidenav` | App shell |
| `MatToolbar` | Top bar |
| `MatCard` | Stat cards on dashboard and reports |
| `MatTable` + `MatSort` + `MatPaginator` | Entries and Approvals. **Projects takes `MatTable` + `MatSort`, sorted in the browser, and no paginator** (ruled 2026-09-21, reversing the 2026-09-20 ruling that gave it `MatTable` alone): `GET /api/projects` returns an unpaged `Project[]`, so a paginator has no backend behind it, while a client-side sort orders the whole set — the case `/entries` cannot have, which is why it sends `sort` to the API. Name and Status are sortable; a name sort reuses the API's own order, reversed for descending, to keep the database's collation, and a status sort is stable, so each group stays in name order. The 2026-09-20 argument held for name only — the one order the API supplies — and said nothing about status. Team, when it is built, decides the same way |
| `MatDialog` | Entry form (add and edit), project form (add and edit), reject dialog, confirm dialog, change-password dialog |
| `MatDatepicker` | Date field in entry form |
| `MatSelect` | Project selector in entry form, month filter |
| `MatChip` (or styled `<span>`) | Status badges |
| `MatSnackBar` | Feedback after every action |
| `MatBadge` | Pending count on Approvals sidebar link |
| `MatProgressSpinner` | Loading state on every async page |
| `MatTooltip` | Every icon-only row action: approve/reject on Approvals, edit/delete/submit on Entries, edit and the deactivate-reactivate toggle on Projects |
| `MatMenu` | User menu in toolbar (change password, logout) |
| `MatButton` (filled, with icon) | "Log hours" in the entries page header — not a `MatFab` (changed 2026-09-18): a FAB floats over content, and one fixed in a desktop header is only an elevated button in `primary-container` that breaks the flat identity and outshouts the teal primary |

---

### The three states of every page

§6's **Async states** rule applies to every page below, so it is specified once here instead of being
repeated in each wireframe. A page that renders only its success table is incomplete.

- **Loading** — a centred `MatProgressSpinner` replaces the content area while the page's `loading()`
  signal is true. Stat cards render as skeleton cards (the card outline with a grey bar instead of the
  number), never as `0` — a real zero and "not loaded yet" must not look the same
- **Error** — the call failed: an error line with the backend `message` from the §10 `ErrorResponse`
  plus a **Retry** button that re-issues the same call, and hands focus to the page's `<h1>` once the reload
  has rendered — ruled 2026-09-22: the button lives in the error block its own reload replaces, so
  otherwise focus falls to `<body>` whether the reload succeeds or fails again, which is why every page's
  title is a `tabindex="-1"` script target. **The `<h1>` is the target of any reload that fails, not only
  one Retry started — widened 2026-09-23**: the error block replaces the table, so a refetch behind a row
  action takes away the control the user was on exactly as Retry's own does, and a recovery that returns
  `EMPTY` emits nothing, so the subscriber that restores focus after a successful refetch never runs.
  Every page's `catchError` therefore names the heading itself; the move stays conditional on focus having
  reached `<body>`, so a failure with the filter bar still focused changes nothing. It is a `<p class="page-error" role="alert">`
  from `_page.scss`, **not a `mat-error`** — ruled 2026-09-20, the same reasoning Login's form-level
  error already carried: `mat-error`'s colour comes from the form-field component's stylesheet, which
  only enters the document once a `mat-form-field` is instantiated, so on a page whose error state
  renders no form the message inherits the body colour and stops looking like an error. Found in the
  browser on `/projects`, which is the first page with no filter bar to keep a form field on screen. No table, no cards, no empty message. A `401` is
  not a page error — the interceptor has already redirected to `/login`
- **Empty** — the call succeeded with zero rows: the per-page message named in its wireframe below, plus
  the primary action where one exists ("Log your first entry", "Add your first member"). Two kinds, and
  only one is illustrated: a **first-use** empty state (the user has nothing yet — the new employee's
  dashboard) adds a decorative `aria-hidden` icon above the message through the shared
  `.empty-illustration` class, while a **no-results** one (a filter that matches nothing, inside a page
  whose header and filters still work) stays message + action. **First-use is decided by the data, never by
  the role — ruled 2026-09-20:** a manager looking at a team that has logged nothing, or at a project list
  that is empty, is in a first-use state exactly as a new employee is, and gets the same illustration

| Page | Loading | Error | Empty |
|---|---|---|---|
| Login | Spinner inside the "Log in" button; **the inputs stay enabled and the button uses `disabledInteractive`** — reversed 2026-09-10, see the note under this table | A `role="alert"` line above the fields: "Invalid email or password" (`401`) — no retry button, the form *is* the retry; a `429` renders that response's own message ("Too many failed login attempts. Try again later.") in the same line, and the form stays enabled so the user can retry once the minute is up; arriving after an expired session — or after a stored session the app can no longer read, which is removed — the same line reads "Your session has expired. Please log in again." until the user types; a `200` whose body is not an `AuthResponse` is refused before anything is stored and reads "The server sent a response this app cannot read. Refresh the page and try again." | n/a — no data load |
| Dashboard (employee) | Skeleton cards + spinner **in place of** the recent list — corrected 2026-09-23: the overlay form of this rule needs a reload that carries rows, and this page has none (its only two `reload()` callers are its constructor and `retry()`, and `retry()` is reachable only from the error block a failed load renders), so every load it can perform is a first load | `.page-error` + Retry, replacing both cards and list | "You have not logged any hours yet" + "Log your first entry" |
| Dashboard (manager) | Skeleton cards + spinner over the review list | `.page-error` + Retry — one failed `forkJoin` call fails the whole load, since a dashboard with three of four cards is misleading | "No pending approvals. Your team is up to date." |
| Entries | Spinner over the table, filter bar stays enabled; the header's "Log hours" stays disabled until the project list has loaded, because the entry dialog reads its projects once, at open | `.page-error` + Retry above the table, **worded by role** like the empty state below it — a manager is not looking at entries of their own | With a filter set: "No entries match these filters" + "Log hours" (button hidden for managers), plus "Show all months" while a month is selected. With none set — the user has no entries at all — the first-use state: the illustration, "You have not logged any hours yet" + "Log your first entry" (a manager reads "Your team has not logged any hours yet") |
| Projects | Skeleton cards + spinner over the table **on the first load only**: once rows are on screen a refetch keeps the numbers and dims them (`aria-busy`), because every mutation reloads and blanking the strip three times in a create-edit-deactivate walk reads as breakage rather than as loading | `.page-error` + Retry | "No projects yet. Create your first project." |
| Approvals | Spinner over the table, filter bar stays enabled | `.page-error` + Retry | "No pending approvals. Your team is up to date." |
| Team | Skeleton cards + spinner over the table | `.page-error` + Retry | "No team members yet. Add your first member." |
| Reports | Skeleton cards + spinner over both tables | `.page-error` + Retry for the whole `forkJoin` | "No approved hours for this month yet." in place of the cards and both tables |
| Entry dialog / user dialog / reject dialog | Spinner inside the Save button, fields disabled while saving | Backend `fieldErrors` under the offending input — a `@Valid` 400, or the 409 on a duplicate email / project name (§10); anything else in a `role="alert"` line above the fields — the dialog stays open so the typed values are not lost | n/a — a form dialog always opens with its fields |
| Change-password dialog | Spinner inside the "Change password" button, all three fields disabled while saving | `fieldErrors.currentPassword` under the **current password** input and `fieldErrors.newPassword` under the new one (both `400`, per the §8 status ruling — a wrong current password is *not* a 401 and must not log the user out); anything else in a `role="alert"` line above the fields, dialog stays open | n/a — a form dialog always opens with its fields |

> **Reversal, 2026-09-10 — `disabled` is a visual and interaction state, not a business rule.** The Login
> row originally said *form disabled while saving*. Removing `form.disable()/enable()` was decided while
> building Step 7a, on this argument: the invariant being protected is "one login in flight at a time",
> and that invariant already lived in TypeScript — `onSubmit()` opens with
> `if (this.form.invalid || this.loading()) return;`, which is the real defence against a double submit.
> The `disable()` protected nothing and cost two things that were measured: it repainted both
> `mat-form-field` outlines grey for ~50 ms against a localhost backend, and it **dropped focus to
> `document.body`**, because a disabled control cannot hold focus and nothing restored it on re-enable —
> so a keyboard user lost their place after every failed login (WCAG 2.4.3). The `{ emitEvent: false }`
> flags went with it: they existed only so that `disable()` would not fire the `valueChanges` that clears
> the error message, a hidden coupling that no longer needs explaining. The same reasoning put
> `disabledInteractive` on the button — a native `<button disabled>` cannot hold focus either, so Material
> marks it `aria-disabled` and keeps it focusable instead. The accepted trade is that the button still
> receives clicks, which Material's own input documentation warns about; the TypeScript guard is what
> makes that safe, so **that line must not be removed**. A third option — delaying the disable ~150 ms so
> fast responses never paint it — was rejected: it buys a flicker that only exists at localhost latency in
> exchange for a second signal, a manual timer and an uncovered teardown path.
>
> **The dialog rows above still say "fields disabled while saving" and have not been reversed** — they are
> unbuilt, and the case differs: a dialog's fields can be edited while its request is in flight and the
> user then sees stale values against a saved record. Decide it per dialog when Step 7b builds the first
> one, with this note as the precedent, rather than copying either answer by reflex.
>
> **Decided for `entry-dialog`, 2026-09-18: its fields disable while saving.** The dialog case the
> paragraph above describes is real there — a value typed during the request would sit on screen
> against a record that saved the old one — and the dialog's Save is a filled button whose spinner
> already tells the user to wait. The cost is the one measured on Login: focus leaves the field for
> the length of the save. **`project-dialog` decided the same way on 2026-09-20**, on the same argument
> with two fields to repaint instead of four. **`user-dialog`, `reject-dialog` and `change-password-dialog`
> disable theirs too**, so all five form dialogs share the choice — and, since 2026-09-22, its repair: a
> save that fails re-enables the fields and `refocusAfterFailedSave()` (`shared/focus.ts`) sends focus to
> the first control Material marks `aria-invalid`, else to the `tabindex="-1"` error line, while it
> is still where the save left it — on `<body>` after Enter in a field, on the Save button after a click,
> since nothing else in the dialog can hold focus during the request (Save and Enter both measured
> 2026-09-22 across the five dialogs, a field error and a `500` each). The focus lost *during* a save stays the accepted cost; the focus lost *after* a
> failed one does not.

---

### Responsive intent

Desktop-first, but the demo must survive a recruiter opening the link on a phone:

- **Sidenav** — `mode="side"` and permanently open at ≥ 1024px; below that it becomes `mode="over"`,
  closed by default and opened by a hamburger button in the toolbar, and it closes itself after every
  completed or skipped navigation — a tap on the current page's link completes none, so both count
- **Tables** — every `MatTable` sits in an `overflow-x: auto` wrapper so a narrow viewport scrolls the
  table instead of the page. Below 600px the Entries, Approvals and Projects tables hide the Description
  column (the least load-bearing) rather than shrinking every column. **Approvals hides it below a `56rem`
  page instead** — ruled 2026-09-22: its seven columns need about `51rem` with ordinary data, which the
  1024px and 768px windows (46 and 45rem of page) do not have, and past the wrapper the pinned actions sat
  over Status; the container query reads the page's `:host`, since the rail changes the page's width
  without changing the window's. **Team drops two columns the same way** — ruled 2026-09-22, once its
  pinned actions grew to three buttons: Email below a `40rem` page, where the whole row (about 617px) stops
  fitting, and Role below `28rem`, where name, role, status and actions (about 425px) stop fitting; the
  cards count the roles and the edit dialog shows both values. A viewport query at 600px left the
  600–670px windows with every column back and Status under the buttons. **The employee dashboard's
  recent list drops Date below a `25rem` page** — ruled 2026-09-22 at `23.5rem` and re-measured on
  2026-09-23, when the column gained the year: project, date, hours and status need a 396px page
  (measured in the browser, against 373px without the year), and the rung keeps 4px for rounding; the
  list is ordered newest first, so its order says what is recent, while Hours is the number the employee
  logs. Dropping the column was kept over letting the wrapper scroll the 23px it is short, so one rule
  holds at every narrow width; the cost is the 408–431px windows, which showed the date under the old
  rung and no longer do. **The two review tables put Hours second, beside the
  employee** — ruled 2026-09-22, reading the Approvals and manager-dashboard wireframes below with that
  correction: on a phone every column after the first two scrolls under the pinned ✓ ✕, and the hours are
  what an approval decides on; dropping Project and Date instead was measured and still left Hours partly
  under the buttons at 375px. `/entries` keeps its Description at tablet widths, with about `1.5rem` of
  slack at 768px, so a project name at the `12rem` cap falls back to scrolling under its buttons there —
  accepted the same day rather than hiding the column across every tablet. A note standing in for row
  actions ("Awaiting another manager") is a fixed `6.5rem` block on two lines, because a fixed width is
  what the table measures for the pinned column; at `10rem` it widened that column past its buttons'
  need. A cell that stacks a note under its value — the rejection note, an action note under buttons —
  takes `0.5rem` of vertical padding, the only cells that do: Material's cells carry none and its row
  height is only a minimum, so the stack sat flush against both borders, while padding every cell would
  lift each row with icon buttons or a two-line name past the compact 44px. **A long value with no spaces in it
  wraps rather than widening its column past `12rem`** — added 2026-09-20 after a 375px check found one
  space-less project name setting the Name column's min-content width and pushing the status and the row
  actions off screen, which are the two things the page is for. **A column is as narrow as its longest
  word, never narrower** — ruled 2026-09-21, reversing that day's `overflow-wrap: anywhere` on every text
  column: `anywhere` counts each letter as a break when the table measures a column, so a crowded table
  cut "Employee" mid-word from desktop width down. Name, employee and project take `break-word` under a
  `12rem` `max-width`, and so does Team's Email, whose cell offers one `<wbr>` after the `@` — added
  2026-09-22, since an address has no space and `break-word` otherwise split it after a dot
  ("company." / "com"); the description, prose, keeps `anywhere` behind a `9rem` floor. A fixed floor on
  every column was measured and rejected: it reserved width short names never use and pushed
  `/approvals` into a sideways scroll at 1024px. **The row actions never scroll out of view** — added
  2026-09-21: the actions column is pinned with `stickyEnd`, so a table that does not fit scrolls its
  reading columns under the buttons, and a scroll-state container query draws the divider only while
  there is table beneath them.
  **The rejection note follows the column** — added 2026-09-21: it is rendered under the description and
  again under the status badge, and whichever copy is idle is `display: none`, so hiding Description, on
  a phone or on `/approvals` below its `56rem` rung, never hides why an entry was rejected, and the note
  is read once
- **Filter selects** — a filter bar's `mat-select` panels take `[panelWidth]="null"` and the global
  `filter-select-panel` class, so a panel grows to its longest option between `12rem` and `24rem` instead
  of copying its `12rem` field: "September 2026" stays on one line, and only an unbounded label — a long
  project name — wraps
- **Filter bars** — every field is `12rem` above the phone layout, since a narrower one truncates a
  selected "September 2026" in its trigger, so a bar too narrow for one line changes shape instead of
  shrinking its fields, and never leaves one orphaned: a four-field bar (`filter-bar-4`) is capped at two
  fields' width below a `51rem` page and splits 2 + 2 — which covers the 1024px and 768px windows — and a
  three-field one (`filter-bar-3`) stacks below `38rem`. Measured on the page's own `inline-size`
  container, like the stat cards; below 600px every field is full width. Added 2026-09-21
- **Stat cards** — a CSS grid sized by **container queries on the page's own width**, not by the viewport:
  one column, two from `36rem`, four from `52rem`, so four cards split 1, 2 + 2 or 4 and never leave one
  orphaned (`auto-fit` did, as 3 + 1). **A three-card strip has a rung of its own** — one column, three
  from `42rem`, with no stop at `36rem` (added 2026-09-20 for Projects; the rung moved down from `52rem` on
  2026-09-22): 2 + 1 is the orphan the ladder exists to avoid, and three at `36rem` would make a card
  visibly narrower than a dashboard card at the identical window width, but at `52rem` the 1024px and 768px
  windows (a 45–46rem page) stacked the three into a 338px column above the table, which is a hero, not
  the thin strip the identity asks for; from `42rem` each card keeps about `13rem`. The page's `:host` is the `inline-size` container because the 15rem
  sidenav rail narrows it from 1024px up, independently of the window. Each `stat-card` fills its grid cell,
  so a label that wraps to two lines never makes one card taller than its row
- **Login** — the two-column split collapses to the form card alone below 768px; the branding panel is
  hidden, not stacked, and a one-line lockup (logo + app name) sits above the greeting in its place. The
  form sits at a fixed top offset rather than centred, because the virtual keyboard shrinks `100dvh` and a
  centred form jumps as typing starts; below 600px the card drops its outline and container colour through
  `mat.card-overrides`, so the form reads as the page instead of a box inside it
- **Toolbar** — the logo shows only while the sidenav is a fixed rail, so below 1024px the hamburger takes its
  place rather than sitting beside a second glyph; the account menu trigger truncates the user's name with an
  ellipsis below 600px instead of hiding it, so its accessible name never needs a phone-only `aria-label`
- **Dialogs** — below 600px every `MatDialog` keeps Material's compact-window card (`calc(100vw - 32px)`
  wide, as tall as its content), never full-screen: a Material 3 full-screen dialog is a different layout,
  a top bar with close and confirm actions, not the standard dialog stretched to the viewport, and a
  stretched one was tried and rejected on 2026-09-16; and no standard dialog carries a ✕ in its title bar (removed from the
  wireframes below on 2026-09-18) — in Material 3 the close icon belongs to the full-screen layout, and a
  standard dialog is dismissed by its Cancel action, by Escape while no write is in flight, and never by a
  backdrop click on a form dialog (§6 Subscription lifetime). A form dialog whose form is dirty asks
  "Discard changes?" (the shared `confirmDiscard`, a destructive `confirm-dialog`) before Cancel or Escape
  closes it; a pristine one closes at once. A form that stays open after one of its writes has landed —
  an edit whose `PUT` saved before a chained submit failed — is marked pristine at that point, so the
  question covers only what was typed afterwards

---

### View by view

#### Login

Split layout — two columns:
- Left: a dark teal panel, app logo, tagline ("Track your time. Get recognised."). Take the colour from a
  **theme token** (the M3 primary container / a dark tone of the generated ramp), never a hand-picked hex —
  the design-system table forbids forcing the seed colour back with CSS, and this panel is the one place
  tempting enough to break it
- Right: white background, form card centred vertically

```
┌──────────────────┬─────────────────────┐
│                  │                     │
│   [logo]         │   Welcome back      │
│                  │                     │
│   TimeTrack      │   Email ________    │
│                  │   Password _____    │
│   Track your     │                     │
│   time.          │   [Log in]          │
│   Get            │                     │
│   recognised.    │                     │
└──────────────────┴─────────────────────┘
```

No register link — accounts are created by the manager from the Team page.

---

#### Change password — dialog (`shared/components/change-password-dialog`)

Not a page and not a route: opened from the **Change password** item in the app shell's user menu, for
either role. It is the only UI for the §8 self-service rule — without it the backend-generated initial
password would be permanent in practice.

```
┌──────────────────────────────────────┐
│  Change password                     │
│                                      │
│  Current password  [password input]  │
│  ⚠ Current password is incorrect     │
│                                      │
│  New password      [password input]  │
│  Confirm new       [password input]  │
│                                      │
│         [Cancel]  [Change password]  │
└──────────────────────────────────────┘
```

- Calls `PATCH /api/users/me/password` with `currentPassword` + `newPassword`; `204` closes the dialog and
  a snackbar confirms "Password changed". No re-login and no token refresh — the JWT stays valid
- **Loading** — the Change password button shows its spinner and all three fields disable while the call is
  in flight, exactly as the other form dialogs; a backdrop click never closes it, and Escape does not close it
  until the call settles (§6 Subscription lifetime)
- **Error** — a `400` carrying `fieldErrors.currentPassword` renders **under the current-password input**
  (the ⚠ line in the wireframe), never as a dialog-level error: the user must see *which* field is wrong.
  `fieldErrors.newPassword` (the 8–72 length rule) renders under the new-password input. Any other failure
  is a `role="alert"` line above the fields. The dialog never closes on error, so nothing typed is lost
- **Empty** — n/a, a form dialog always opens with its three fields
- "Confirm new" is validated **on the frontend only** (a cross-field validator on the reactive form) — the
  backend has no `confirmPassword` field in `ChangePasswordRequest` (§10), so this error never comes from a
  `fieldErrors` map
- Every password input carries the visibility toggle the accessibility floor requires, Confirm included; below 600px the dialog keeps Material's compact card like every other dialog

---

#### Team page — Manager only

Stat cards + user table + "Add member" button.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 5            │  │ 4            │  │ 1            │  │ 1            │
│ Total        │  │ Employees    │  │ Managers     │  │ Inactive     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

                                                       [+ Add member]
┌──────────────────────────────────────────────────────────────┐
│ Name         │ Email              │ Role     │ Status   │    │
│─────────────────────────────────────────────────────────────│
│ Ana García   │ ana@company.com    │ Employee │ Active   │ ✏ 🗑 │
│ Luis Martín  │ luis@company.com   │ Employee │ Active   │ ✏ 🗑 │
│ Sara López   │ sara@company.com   │ Manager  │ Active   │ ✏ 🗑 │
│ Iván Ruiz    │ ivan@company.com   │ Employee │ Inactive │ ✏ 🗑 │
└──────────────────────────────────────────────────────────────┘
```

- The 🗑 icon deactivates the account (soft delete) — it does not delete data. A deactivated user keeps
  every entry they logged and simply cannot log in, so the row **stays in the table** with an "Inactive"
  status, exactly as an archived project does on the Projects page
- `GET /api/users` returns active and inactive accounts alike (§10), which is what makes reactivation
  reachable: the ✏ dialog on an "Inactive" row is the only path back to `active = true` via
  `PUT /api/users/{id}`. Hiding inactive users from the list would strand those accounts
- The four cards count over the **whole** list: `Total`, and the `Employees`/`Managers` split, include
  deactivated accounts; `Inactive` is the deactivated subset cutting across both roles. Four cards
  rather than the Projects page's three because users carry two independent axes — role and status
- Empty state: "No team members yet. Add your first member."

##### User form — dialog (`team/user-dialog`)

"Add member" (and the ✏ icon) opens a `MatDialog`: name + email + role selector (Employee / Manager).
**No password field** — the backend generates it (§8).

```
┌──────────────────────────────────┐
│  Add member                      │
│                                  │
│  Name     [text input]           │
│  Email    [text input]           │
│  Role     [select ▼]             │
│           Employee / Manager     │
│                                  │
│              [Cancel]  [Save]    │
└──────────────────────────────────┘
```

- Same dialog in edit mode, titled "Edit member" and pre-filled; `active` is not edited here — the 🗑 icon
  owns deactivation
- Field errors come from the backend `fieldErrors` map (e.g. a duplicate email → 409 shown on the field)
- Empty/blank state: none — the dialog always opens with the three fields

After creation, a snackbar shows the `generatedPassword` from the `CreateUserResponse` so the manager can
pass it on. It is shown **once and never again**: the plaintext exists only in that single response, so the
snackbar needs a copy-to-clipboard action and a long-enough duration (or a small dismissible dialog rather
than an auto-hiding snackbar) — a manager who misses it cannot recover that password — the row's 🔑 "Reset password" issues a new one,
shown once in the same dialog (§8). Deactivating and recreating the account is not a way back: the email
check counts deactivated accounts, so the recreate answers `409`.

---

#### Dashboard — Employee

Four stat cards + recent entries list.

```
Good morning, Victor

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 52h      │ │ 8h       │ │ 3        │ │ 2        │
│ Approved │ │ Awaiting │ │ Pending  │ │ Drafts   │
│ this mo. │ │ this mo. │ │ review   │ │ to submit│
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Recent entries
┌──────────────────────────────────────────────────┐
│ Project A  │ May 14  │ 4h  │ API integration  │ APPROVED  │
│ Project B  │ May 13  │ 8h  │ Frontend work    │ SUBMITTED │
│ Project A  │ May 12  │ 6h  │ Unit tests       │ DRAFT     │
└──────────────────────────────────────────────────┘
```

**How stat cards get their data:**
- **Totals come from an aggregation endpoint, never from summing the entries list.** `GET /api/entries`
  is paged, so a client-side sum would silently report the first page's hours as the month's. The rule
  outlives pagination anyway: a total is the database's job, not the browser's — summing it in Angular
  means fetching every row of the month to add one column
- The employee dashboard therefore reads `GET /api/reports/summary`, which is **scoped to the caller** by
  the same ownership rule `GET /api/entries` applies (employee → own, manager → all) — see the §10 reports
  ruling. The page sends no role and no user id: the token decides what the totals cover
- "Approved hours this month" and "Hours awaiting approval this month" are the summary's `approvedHours`
  and `pendingHours`; "Entries pending review" and "Drafts to submit" are counts, and a paged response
  carries them exactly: `page.totalElements` with `?status=SUBMITTED|DRAFT&size=1`
- **The grid mixes two scopes, so it names neither.** The two hour cards cover the current month and the
  two counts cover every month, so the `<section>` is named "Your hours and entries at a glance" and each
  month-scoped card says "this month" in its own label — a group name is read over every value inside it
- **No "This week" card** (changed 2026-09-18, Step 7b). The first wireframe had one, but the API
  aggregates by month only, and a weekly total summed in the browser is exactly what the first bullet
  forbids. The Drafts card took its place because it is the one number an employee acts on — it moves
  on every create and every submit
- The recent-entries table below the cards is the one genuine consumer of the list itself, and it reads
  page 0 directly

Empty state (new user): illustration + "You have not logged any hours yet" + "Log your first entry" button.

---

#### Dashboard — Manager

Four stat cards + pending approvals list with quick actions.

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 5        │ │ 5        │ │ 240h     │ │ 3        │
│ Pending  │ │ Team     │ │ Approved │ │ Active   │
│ approval │ │ members  │ │ this mo. │ │ projects │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Pending approvals
┌──────────────────────────────────────────────────────────────────┐
│ Ana García   │ Project A  │ May 14  │ 8h  │ [Approve] [Reject]  │
│ Luis Martín  │ Project B  │ May 13  │ 4h  │ [Approve] [Reject]  │
└──────────────────────────────────────────────────────────────────┘
                                              [View all →]
```

**How stat cards get their data:**
- "Pending approval" — `GET /api/entries?status=SUBMITTED`, count results
- "Team members" — `GET /api/users`, count results
- "Approved this mo." — `GET /api/reports/summary?month=2025-05`, read `approvedHours`. The card is labelled with what it counts (approved hours only, per §8), never "Total"
- "Active projects" — `GET /api/projects`, count active ones
- Four separate API calls on dashboard load — all run in parallel with `forkJoin`

Empty state: "No pending approvals. Your team is up to date."

---

#### Entries page — both roles

Filter bar + table + a filled "Log hours" button in the page header (employee only).

```
[Month ▼]  [Project ▼]  [Status ▼]              [+ Log hours]  ← hidden for managers

┌──────────────────────────────────────────────────────────┐
│ Date    │ Project   │ Hours │ Description  │ Status   │   │
│─────────────────────────────────────────────────────────│
│ May 14  │ Project A │ 4h    │ API work     │ APPROVED │   │
│ May 13  │ Project B │ 8h    │ Frontend     │ SUBMITTED│   │
│ May 12  │ Project A │ 6h    │ Tests        │ DRAFT    │ ✏ 🗑 ➤ │
│ May 11  │ Project B │ 2h    │ Bugfix       │ REJECTED │ [Re-open] │
└──────────────────────────────────────────────────────────┘
```

- Status is a coloured badge rendered by the shared `status-badge` component
- Edit, delete, and submit icons only appear on DRAFT rows — and only for employees. A DRAFT whose project was
  deactivated after it was logged shows edit and delete with a muted "Project inactive — edit to move it" in
  place of submit, which the API would refuse (§8): the page knows from the active-project list it already
  loaded, and the entry dialog flags that project under its field as it opens (added 2026-09-21)
- **REJECTED rows show a "Re-open" action instead** (owner only, `PATCH /api/entries/{id}/reopen`): it returns
  the entry to DRAFT, where the edit / delete / submit icons above take over — the correct-and-resubmit loop
  in the §8 state machine. A REJECTED row also surfaces the manager's `rejectionNote` once, as a `Manager's note:` line under the description — under the status badge below 600px, where Description is hidden — not as a badge tooltip, which a touch screen cannot open and which would only repeat the line
  so the employee knows what to fix. Managers never see this action
- "Submit" inline button: quick action — changes status to SUBMITTED without opening the dialog
- Manager sees an extra "Employee" column and all users' entries; employee sees only their own — same route, different data from the API
- The Project filter lists exactly what `GET /api/projects` returns, read once with the page's first load:
  every project for a manager, **active projects only for an employee** (§10). A project deactivated after an
  employee billed to it leaves their filter, so those entries are reached by month and status, not by
  project — accepted. The alternative, also listing the inactive projects the caller's own entries carry
  (which the §8 project-existence ruling would allow, since the caller is already entitled to them), cannot
  be built in the browser: the entries list is paged, so only a new caller-scoped backend query knows
  every project those entries name
- Empty state: two kinds, told apart by the filters the page already holds. With any filter set it is a
  no-results state — "No entries match these filters" + a "Log hours" button (hidden for managers); the page
  opens on the current month, so while a month is selected it also offers a text "Show all months" button
  that resets the Month filter, the way to last month's drafts on the first days of a month. With no filter
  set the user has no entries at all, so it is the first-use state: the illustration, "You have not logged
  any hours yet" + "Log your first entry" (a manager reads "Your team has not logged any hours yet")

---

#### Entry form — dialog

Opens as a `MatDialog` from the "Log hours" button or the edit icon.

```
┌──────────────────────────────────┐
│  Log hours                       │
│                                  │
│  Project  [select ▼]             │
│  Date     [date picker]          │
│  Hours    [number input]         │
│  Description                     │
│  [                             ] │
│                                  │
│              [Cancel]  [Save]    │
└──────────────────────────────────┘
```

Edit mode: same dialog, pre-filled, title changes to "Edit entry".
A "Submit for review" button appears when editing a DRAFT entry — this saves and submits in one step.
The inline Submit button in the table is a quick action (no dialog). Both paths lead to the same result.

---

#### Projects page — Manager

Stat cards + table with CRUD actions.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 8            │  │ 6            │  │ 2            │
│ Total        │  │ Active       │  │ Inactive     │
└──────────────┘  └──────────────┘  └──────────────┘

                                         [+ New project]   ← see the ruling below
┌──────────────────────────────────────────────────┐
│ Name        │ Description  │ Status  │         │
│─────────────────────────────────────────────────│
│ Project A   │ Main client  │ Active  │  ✏ 🗑  │
│ Project B   │ Internal     │ Active  │  ✏ 🗑  │
└──────────────────────────────────────────────────┘
```

- The 🗑 icon deactivates the project (soft delete) — an inactive project keeps its entries and simply
  stops accepting new ones, so the row stays in the table with an "Inactive" status
- **Both states wear a pill in the Status column, and the row's text is never dimmed — ruled
  2026-09-20**, after three passes in the browser. Dimming the row was tried first and rejected: a tone
  quiet enough to clear the 4.5:1 floor was too quiet to notice, and `on-surface-variant` is already the
  faintest that does. Pilling only "Inactive" was tried next and rejected too — one badge among bare
  words reads as an exception, not as a state. So the pill carries the whole signal, in the same mould
  as the entries' `status-badge` (hairline border at 30%, 8% tint, 4px radius, `label-small` in small
  caps), with **the project's own colours**: `--project-active` for Active and the neutral
  `outline-variant` / `surface-container` / `on-surface-variant` for Inactive. `--project-active` holds
  the same value as `--status-approved` on purpose — that green's contrast is already measured at badge
  size (4.6:1) — but it is its own token, because a project's state and an entry's status mean different
  things and must be free to move apart. The word is always present, so the state is never carried by
  appearance alone. **The Team page inherits this**: same column, same answer
- **That icon is one button that toggles, not two that swap — ruled 2026-09-20.** On an active row it is
  🗑 "Deactivate" and asks the §14 confirmation first; on an inactive row it is ↺ "Reactivate",
  `PUT`s `active: true` (§10) and asks nothing, because an action that restores something has nothing to
  warn about. Two `@if` branches would render two different DOM nodes: the refetch after the mutation
  would destroy the one holding focus and drop it to `<body>`, the WCAG 2.4.3 failure the accessibility
  floor writes out. The reactivate path also exists because there would otherwise be no way back from a
  mis-clicked soft delete short of Postman. **It replays the row as the browser last fetched it** —
  `PUT` needs a `name`, and the only one to hand is the one in the table — so a project renamed by
  another manager since the page loaded would be reverted by the reactivation. Accepted for a
  single-manager portfolio app; the honest answer in an interview is a refetch before the write
- **The "Entries" count column was dropped, 2026-09-20.** It was planned here with no backend field behind
  it: `ProjectResponse` (§10) carries `id · name · description · active · createdAt` and nothing else, so the
  only way to fill the column against the API as it stands is one `GET /api/entries?projectId=…&size=1`
  per row — N+1 calls for a number no action on this page reads. Adding `entryCount` to the DTO is a
  backend change after G3 signed the backend off, for a glance the Reports page already gives per project
- The ✏ dialog (`project-dialog`) is one form for create and edit — name + description, and **no `active`
  field**: the flag is owned by the 🗑 action and by `PUT`'s optional `active`, never by two controls at once
- **A page's primary action lives in the page header, beside the `<h1>` — ruled 2026-09-20, app-wide.**
  This wireframe and Team's draw it above the table instead, which is where it sat before /entries was
  built; /entries put "Log hours" in the header and the component table below already recorded that. One
  position for every page: header, right-aligned, filled button with a leading icon. Read the wireframes
  above with that correction — they were not redrawn, because the box art is not the contract
- Empty state: "No projects yet. Create your first project." + the "+ New project" button
- Loading and error states as declared in "The three states of every page"

---

#### Approvals page — Manager

Filter bar + table with approve/reject actions per row.
Defaults to SUBMITTED — but the status filter lets the manager see the full history.

```
[Month ▼]  [Employee ▼]  [Project ▼]  [Status ▼ → default: Pending]

┌──────────────────────────────────────────────────────────────────┐
│ Employee    │ Project   │ Date    │ Hours │ Description │        │
│────────────────────────────────────────────────────────────────│
│ Ana García  │ Project A │ May 14  │ 8h    │ API work    │ ✓  ✕  │
│ Luis Martín │ Project B │ May 13  │ 4h    │ Frontend    │ ✓  ✕  │
└──────────────────────────────────────────────────────────────────┘
```

- ✓ = approve (green icon button with tooltip), ✕ = reject (red icon button with tooltip)
- Reject opens the shared `reject-dialog` to enter the rejection note
- Approve/reject buttons only appear on SUBMITTED rows — hidden for APPROVED/REJECTED
- Empty state (SUBMITTED filter): "No pending approvals. Your team is up to date."

---

#### Reports page — Manager

Month selector + summary stat cards + two tables.

```
Report for  [May 2025 ▼]

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 240h         │  │ 5            │  │ 3            │
│ Approved     │  │ Employees    │  │ Projects     │
│ this month   │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

Hours by project                    Hours by employee
┌────────────────────────┐          ┌────────────────────────┐
│ Project A  │ 120h      │          │ Ana García  │ 80h      │
│ Project B  │  80h      │          │ Luis Martín │ 60h      │
│ Project C  │  40h      │          │ Sara López  │ 40h      │
└────────────────────────┘          └────────────────────────┘
```

**Where each card's number comes from** — only the first is served by `/api/reports/summary`:
- "Approved this month" — `GET /api/reports/summary?month=`, read `approvedHours`. The card is **not**
  labelled "Total hours": it counts APPROVED only (§8), and a label that says "total" over a filtered
  number is the exact mismatch the §8 reporting rule was written to remove — the same correction already
  applied to the manager dashboard's card
- "Employees" — the **length of the by-user array**, not a summary field
- "Projects" — the **length of the by-project array**, not a summary field

All three report calls run in parallel with `forkJoin` on month change. Because every aggregate counts
`APPROVED` only (§8), the "Approved this month" card equals the sum of either table exactly — that reconciliation
is the point of the rule, and it is worth asserting in a test.

Empty state (a month with no approved hours): "No approved hours for this month yet." replaces the cards
and both tables — the month selector stays enabled so another month can be picked without a reload.

`pendingHours` is **not** one of these three cards. Surface it separately — e.g. a "· 24h awaiting
approval" line under the card or a fourth card clearly labelled as pending — never added into the total.

---

### Inspiration

Real products in this domain — a recruiter recognises them. **One concrete element per row**, not "general
inspiration":

| App | URL | The one element to take |
|---|---|---|
| Clockify | [clockify.me](https://clockify.me) | The **row height and column order of the entry table** — date, project, hours, description, status — which is exactly the Entries table above |
| Harvest | [getharvest.com](https://www.getharvest.com) | The **thin summary strip of numbers above the report tables**, rather than large hero cards |
| Toggl Track | [toggl.com/track](https://toggl.com/track) | The **teal-on-neutral primary** used sparingly against a grey surface |
| Linear | [linear.app](https://linear.app) | The **flat, low-radius status badge**: small caps text on a tinted fill, no shadow |

**Traceability** — two identity decisions come straight from this table: the *palette* axis (cool teal on a
light-neutral surface) from the Toggl row, and the *shape* axis (flat, 4px radius, outlined surfaces) from
the Linear row. The `status-badge` component is built to that Linear description.

---

## 15. Progressive learning plan

This is the first Spring Boot project. Each step introduces one new concept.

### Step 1 — Spring Boot foundation ✅
- Create project with Spring Initializr (dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Lombok)
- Connect to PostgreSQL via `application.properties`; create the `timetrack` database in pgAdmin
- Create `User` entity, `UserRepository` (`JpaRepository`), `UserService.getAll()`, `UserController` with `GET /api/users`
- **New concepts:** layered architecture, REST API + SPA separation (the backend returns JSON and has no View layer — the same single decision as choosing layered architecture over MVC, not a second topic), `@Entity`/JPA basics, `JpaRepository` + derived query methods (`findByEmail` style finders)
- **Review concepts:** none (first backend step)
- **Done condition:** `Terminal: mvn spring-boot:run — started on port 8080` and `Browser: GET localhost:8080/api/users returns [] at /api/users`

### Step 2 — Full CRUD for Projects ✅
- Create `Project` entity, repository, service, controller
- GET all, GET by id, POST, PUT, DELETE (soft delete) with DTOs
- **New concepts:** DTO request/response boundary, REST conventions, soft delete , `Optional<T>` + custom unchecked exceptions in the service (one major concept: the DTO boundary — REST conventions, the soft-delete flag and the `Optional`/exception pair are one-line applications of it, not separate topics)
- **Review concepts:** layered architecture
- **Done condition:** `Postman: POST /api/projects returns 201 — body has id + name; GET /api/projects returns 200 with the created project`

### Step 3 — Spring Security + JWT ✅
- Add Spring Security; configure CORS for `localhost:4200`
- Login endpoint `POST /api/auth/login`; BCrypt password hashing; generate + validate JWT
- Protect all routes except `/api/auth/login`; add `GlobalExceptionHandler` (`@RestControllerAdvice`)
- **New concepts:** Spring Security + JWT (the one major concept), CORS, `@RestControllerAdvice` — the last two ride along deliberately: CORS is one config line the JWT filter chain forces you to touch anyway, and the exception handler is what turns the new auth failures into readable JSON
- **Review concepts:** DTO boundary (LoginRequest/AuthResponse)
- **Done condition:** `Postman: POST /api/auth/login returns 200 — body has token; GET /api/projects without token returns 401`

### Step 4 — Role-based authorization ✅
- Add `role` and `active` to `User` (EMPLOYEE / MANAGER)
- Seed the first manager account on startup
- `@PreAuthorize("hasRole('MANAGER')")` on project and user write endpoints
- `SecurityContextHolder` to read the current user inside a service
- **New concepts:** `@PreAuthorize` role checks, startup seeding, `SecurityContextHolder`
- **Built as `data.sql`, replaced 2026-07-23** by the profile-gated `DataInitializer` (§9) — the step is
  still ✅ on the concept it taught; the seeding *mechanism* changed for the security reason recorded in §9
- **Review concepts:** JWT flow (token now carries the role)
- **Done condition:** `Postman: POST /api/projects with EMPLOYEE token returns 403; with MANAGER token returns 201`

### Step 5 — TimeEntry CRUD + workflow ✅
- `TimeEntry` entity with `@ManyToOne` to User and Project
- `GET /api/entries` filters by current user (employee) or returns all (manager)
- Optional query filters on `GET /api/entries` (`?month=`, `?status=`, `?projectId=`) via `Specification<T>` + `JpaSpecificationExecutor`
- CRUD with business-rule validation (future date, inactive project, DRAFT-only edits)
- Status transitions: submit, approve, reject (PATCH)
- **New concepts:** `@ManyToOne` relationships, state machine workflow, PATCH for transitions, role-based data filtering, `Specification<T>` dynamic query filters, Bean Validation (`@Valid` + `@NotNull`/`@NotBlank`) on request DTOs
- **Concept density — called out deliberately:** this step carries more than one major concept (relationships · state machine · dynamic filters). Splitting was rejected because the workflow is what makes `TimeEntry` worth modelling at all, and the `Specification<T>` filters were forced mid-step by a real PostgreSQL bug (`42P18`) rather than planned. Kept as one step so the history matches what was actually built.
- **Review concepts:** soft delete, `SecurityContextHolder`
- **Done condition:** `Postman: POST /api/entries returns 201 — status DRAFT; PATCH /api/entries/{id}/approve as employee returns 403; as manager on a SUBMITTED entry returns 200 — status APPROVED`
- **Concept learned:** hard delete (a real row removal) is correct here — `TimeEntry` has no `active` field like `Project`/`User`, and only DRAFT entries can be removed, so nothing worth preserving is lost. Bean Validation (`@NotBlank`/`@NotNull` + `@Valid`) was added across all request DTOs (`CreateProjectRequest`, `UpdateProjectRequest`, `CreateTimeEntryRequest`, `RejectRequest`) as part of this step, plus a `PUT /api/entries/{id}` (edit DRAFT) and `DELETE /api/entries/{id}` (delete DRAFT) endpoint — both reusing the owner + DRAFT-only guards, and PUT re-running create's business rules (future date, inactive project, hours range) since it replaces the whole resource.
- **Deferred out of this step, built later:** `PATCH /api/entries/{id}/reopen` (EMPLOYEE, owner-only, REJECTED → DRAFT) — the §10 endpoint that closes the resubmit loop in the workflow diagram. Step 5 stays ✅ on the scope it actually shipped; the endpoint was built as a **backend-backlog task** on `fix/backend-backlog` and Postman-verified on 2026-07-22. Its unit test is listed in Section 16. Building it surfaced a related fix applied in the same pass: every state-machine guard was throwing `BusinessRuleViolationException` (400) for what is really a state conflict, so `InvalidStateTransitionException` (409) was split out, leaving 400 for input-data rules only.

### Step 6 — Reports ✅
- Aggregate queries with JPQL
- Summary by project and by user for a given month
- **New concepts:** JPQL aggregation queries, query filters with `@RequestParam`, interface projections for query results
- **Review concepts:** `@PreAuthorize` (`by-project` and `by-user` are MANAGER only; `summary` is scoped to the caller instead)
- **Done condition:** `Postman: GET /api/reports/by-project?month=2025-05 returns 200 — array of { projectName, totalHours }`
- **Concept learned:** interface projections (`ProjectHoursReportResponse`, `UserHoursReportResponse`) let Spring Data build a proxy per result row directly from `SELECT ... AS alias` — no class, no manual mapping — as long as each getter's name matches an alias exactly (Java Bean convention: strip `get`, lowercase first letter). `YearMonth` is received in the controller but converted to a `LocalDate` start/end range in the service (business logic), not the controller. Repositories are organized by **entity** (`TimeEntryRepository` owns both report queries, since their `FROM` is `TimeEntry`), a different axis than controllers/services, which are organized by **feature** (`ReportController`/`ReportService`). Found and fixed two real bugs surfaced by the Postman test pass: `MissingServletRequestParameterException` and `MethodArgumentTypeMismatchException` aren't `RuntimeException`s / weren't specifically handled, so a missing or malformed `?month=` fell through to `500` — worse, the missing-param case revealed a genuine Spring Security gotcha where Spring's internal forward to `/error` gets rejected as unauthenticated (`401`) because `JwtFilter` skips error dispatches by default and `/error` was never excluded from `.anyRequest().authenticated()`.

### Step 7 — Angular frontend (split into 7a / 7b / 7c / 7d) ✅

One step per coherent slice, days not weeks — same granularity the backend had. Each sub-step has its
own done condition covering its **full** scope, and each falls inside exactly one §22 branch — 7c and 7d
share `feat/angular-manager-pages`, since §22's rule is one branch per coherent feature, never one per step.

#### Step 7a — Shell + auth ✅

> **Backend prerequisite — satisfied 2026-07-29.** The toolbar dialog below calls
> `PATCH /api/users/me/password`. That endpoint did not exist when this step was planned: the
> account-password flow (`SecureRandom` generation · `CreateUserResponse` · the endpoint itself) was an
> open **Medium** in `PROJECT-BACKLOG.md`, not a §15 step, and it gated this step because 7a ships its
> consumer. It is **built and closed** — see the ledger line dated 2026-07-29 — and
> `fix/backend-backlog` merged into `projects/07-timetrack` on 2026-08-29 (PR #70), which signed G3 off.
> Nothing blocks this step.

- Angular project with Angular Material; `environment.ts` with the API base URL
- **The §14 design system is set up here, before any page exists** — `styles/material-theme.scss` with the
  scoped `mat.theme()` (teal-based M3 palette, compact density, 4px shape token), the four `--status-*` custom properties,
  and the spacing/type rules. Every later step inherits it; retrofitting a theme across eight built pages
  is the expensive way to do this
- Auth service + JWT in localStorage; auth guard + manager guard
- HTTP interceptor: attaches the token **and handles 401 mid-session** (clear session → redirect to `/login`) — see the token-lifetime note in the REST API section
- App shell: `MatSidenav` + toolbar, sidebar links filtered by role; Login page
- Toolbar user menu (`MatMenu`) with **Change password** + **Log out**, and the shared
  `change-password-dialog` it opens — a dialog, not a route (§13) — calling
  `UserService.changePassword()` → `PATCH /api/users/me/password`. It ships here rather than in a later
  page step because the menu that opens it is part of the shell, and every authenticated user needs it
  from the moment logins work with a generated password
- The dialog renders its declared §14 states: spinner in the "Change password" button with all three
  fields disabled while saving, and the `400` `fieldErrors.currentPassword` / `fieldErrors.newPassword`
  messages under their own inputs with the dialog staying open (a wrong current password must not log
  the user out)
- The Login page ships its declared §14 states from the start: spinner inside the "Log in" button while
  the call is in flight — the inputs are **not** disabled, per the 2026-09-10 reversal recorded under
  §14's async-states table — and a `role="alert"` line above the fields on `401` (§6's Async-states
  rule; Login has no empty state — it loads no data)
- **New concepts:** Angular consuming a real REST API end to end
- **Review concepts:** route guards, HTTP interceptor, auth persistence, `MatSidenav` shell
- **Done condition:** `Browser: login at localhost:4200 redirects to /dashboard inside the shell; a wrong password shows the error line above the fields while the button spins during the call; the toolbar user menu opens the change-password dialog and a wrong current password shows the error under that input with the dialog open and the session intact, while a correct one closes it and the new password logs in; /projects as EMPLOYEE redirects away; a request with an expired token returns the user to /login`
- **Verified 2026-09-16**, all five clauses in the browser, the expired-token clause with a 20-second
  token. The `401` message is a form-level `<p class="login-error" role="alert">` above the fields, not a
  `mat-error`: a `mat-error` renders only inside a `mat-form-field`, and this error belongs to no single field

#### Step 7b — Employee flow: dashboard + entries ✅
- Employee dashboard: stat cards whose hour totals come from `GET /api/reports/summary` and whose counts
  come from `page.totalElements` on `GET /api/entries?status=…&size=1` (§14 "How stat cards get their
  data" — never a client-side sum of a paged list) + recent entries from page 0 of `GET /api/entries`
- Entries page: filter bar, table, "Log hours" button; entry-dialog (create/edit); inline submit quick action
- **Re-open action on REJECTED rows** (owner only, §8/§14): calls `PATCH /api/entries/{id}/reopen`, the row returns to DRAFT and the edit / delete / submit icons take over; the row also surfaces the manager's `rejectionNote`
- Shared components: `status-badge`, `confirm-dialog`
- Reactive forms consume the `fieldErrors` map from the error contract — message under each input on 400
- Both pages render the three §14 states, not just the success table: `MatProgressSpinner` while
  `loading()` is true (skeleton cards on the dashboard), `mat-error` + **Retry** when the call fails, and
  the per-page empty message ("No entries found for this period" / "You have not logged any hours yet")
- **Review concepts:** coordinator pattern, reactive forms, MatTable/MatDialog, signals + `computed()`
- **Concept learned:** a string-literal union derived from an `as const` array · a generic `Page<T>`
  response model · `null` vs optional in a response model · immutable `HttpParams` that omit unset
  filters · PUT vs PATCH with a `204` typed `Observable<void>` · a `canMatch` guard choosing a route
  variant by role · a `Subject` + `switchMap` reload stream that cancels the stale request · `forkJoin`
  loading independent calls as one all-or-nothing result · server-side paging and sorting driven by
  `MatPaginator` / `MatSort` · backend `fieldErrors` placed under their controls with `setErrors` ·
  a local `YYYY-MM-DD` date instead of `toISOString()` · `trackBy` keeping table rows across a reload ·
  status colours checked against the 4.5:1 AA ratio at badge size
- **Done condition:** `Browser: at /entries an employee creates, edits and submits an entry and the table + dashboard cards update; the table shows "No entries found for this period" before the first entry exists and a mat-error with a working Retry when the API is down; Re-open on a REJECTED row returns it to DRAFT with the edit/delete/submit icons visible; an invalid form submit shows the backend field error under the input`
- **Verified 2026-09-18** in the browser as an EMPLOYEE, every clause: the empty message for a month
  with no entries, create → edit (`PUT`) → inline submit with the dashboard cards moving, a description of
  spaces answered by the backend's `fieldErrors.description` under the input, Re-open on an entry rejected
  through Postman, and Retry after stopping the backend. Changed against the plan: the employee dashboard's
  cards (§14), the badge colours (§14 Colour palette), and `/dashboard` split into two role variants
  chosen by a `canMatch` guard, the manager one still the `coming-soon` page until Step 7c (§13)

#### Step 7c — Manager review flow: dashboard, approvals, projects ✅
- Manager dashboard (`forkJoin` stat cards) + pending approvals list with inline approve / reject
- Approvals page (filter bar + queue) with the shared `reject-dialog`; `MatBadge` pending count in the shell
- Projects page (CRUD) reusing `confirm-dialog` for the soft-delete confirmation
- Three §14 states on each page: skeleton cards / spinner over the table, `.page-error` + Retry (one failed
  `forkJoin` call fails the whole dashboard load), and the per-page empty message
- **Review concepts:** `forkJoin`, role-aware UI, MatTable, `MatBadge`
- **Concept learned:** a client-side `MatSort` over an unpaged list that reuses the API's own order · one
  button that toggles its label and icon instead of two that swap, so a write keeps the focused node ·
  `disabledInteractive` with a TypeScript re-entry guard on a row action · focus handed back after a
  refetch that moves or removes the control a write started from (`afterNextRender`, one shared
  `refocusAfterRender()`) · a review action withheld on the caller's own rows from the `id` the login
  response carries · a page-level error that is no `mat-error` · shared `styles/` partials a global rule
  reaches a dialog through · table columns sized by their longest word under a cap, `overflow-wrap: anywhere`
  vs `break-word` · a row-actions column pinned with `stickyEnd`, its divider drawn by a scroll-state
  container query · a count and its list read from one paged query · numbers kept, dimmed and
  `aria-busy`, across a refetch · a `MatBadge` whose `aria-hidden` count is stated again in the link's
  own text · a shell-owned count re-read after `NavigationEnd`, its failure caught inside `switchMap`
- **Done condition:** `Browser: as MANAGER, approve one entry and reject another (with note) at /approvals and the dashboard "Pending approval" card drops; create and deactivate a project at /projects; with the queue emptied /approvals shows "No pending approvals. Your team is up to date."`
- **Verified 2026-09-21** in the browser as MANAGER, every clause: an approval and a rejection with a note at
  `/approvals` each dropped the dashboard's Pending approval card (3 → 2 → 1) and the sidebar badge on the
  next navigation; the project "Focus test" was created from `/projects`' empty state and deactivated; the
  last entry, approved from the dashboard, left `/approvals` showing the empty queue message. Changed
  against the plan: "Team members" counts active accounts only, the review list uses the ✓ ✕ icon buttons
  of `/approvals` rather than text buttons, "Pending approval" is read from the list's own paged query
  rather than a fifth call, and the badge is re-read after every navigation (§13); the `coming-soon`
  placeholder page, which served the manager's `/dashboard` until now, is removed

#### Step 7d — Manager admin: team + reports ✅
- Team page + `user-dialog` (name, email, role — no password field); the generated password is surfaced once
  in a copyable snackbar from the `CreateUserResponse` (§14)
- Reports page: month selector, summary cards and the two `forkJoin` hours tables
- Same three §14 states on both pages; the Reports empty state replaces the cards and both tables while the
  month selector stays enabled
- **The §14 Visual QA checklist runs here**, over all eight pages at once — this is the last frontend step,
  so it is the only point where inconsistency between pages built on different days is visible. Anything it
  finds is fixed now, not filed: G4 is the next gate and a portfolio verdict comes after it
- **Review concepts:** reactive forms, MatTable, `forkJoin`, role-aware UI
- **Concept learned:** a one-time secret shown in a dialog only its Done button closes, with the CDK's
  `cdkCopyToClipboard` reporting whether the browser accepted the copy · a discriminated-union dialog
  result (`created` carries the new account, `updated` nothing) · a control disabled for the caller's own
  account and read back with `getRawValue()` · a disabled button kept focusable through
  `disabledInteractive` so its tooltip can say why · a browser sort where only the order the API never
  serves compares strings, through a locale `Intl.Collator`, and the rest are stable sorts over the API's
  own order · three report calls in one `forkJoin`, cleared on every month change, with `switchMap`
  dropping a slower month's answer · a shared style moved to its partial the day a second page needs it
- **Done condition:** `Browser: as MANAGER, create a user at /team and the generated password appears once in the snackbar; /reports renders both hours tables for a selected month and shows "No approved hours for this month yet." for a month with none; the §14 Visual QA checklist passes on all eight pages at 1024, 768 and 375px`
- **Verified 2026-09-22** in the browser as MANAGER, every clause: "Test Member" created at `/team` showed
  its 12-character password once, copied, survived Escape and closed only on Done, and logged in with it;
  `/reports` rendered both tables for September 2026, 5h reconciling across the card and both tables, and
  "No approved hours for this month yet." for October 2025; the Visual QA ran headless over the eight views
  at 1024, 768 and 375 plus browser checks at 1024 and 768. Changed against the plan: the password surfaces
  in a dialog, not a snackbar (§14 had left both open), and the two README screenshots the checklist names
  moved to a backlog Low, to be taken on a realistic demo dataset before G5 rather than on the test
  fixtures; Team sorts by status by default (the API's own order), hides Email below 600px, and fixes the
  caller's role in the edit dialog; the Reports card reads "Approved hours" because the month is chosen

### Step 8 — Backend tests
- JUnit 5 + Mockito — one test per service method
- Cover edge cases, not just the happy path (see Section 16)
- **New concepts:** JUnit 5 + Mockito unit testing
- **Review concepts:** business rules and state machine (asserted through tests)
- **Done condition:** `Terminal: mvn test passes — TimeEntryServiceTest, UserServiceTest, ProjectServiceTest, AuthServiceTest and ReportServiceTest all green; approve_throwsWhenNotSubmitted and getSummary_approvedHoursEqualsByProjectSum asserted`

### Step 9 — Angular tests
- Vitest + TestBed with `provideHttpClient()` + `provideHttpClientTesting()` — one test per service method listed in Section 16
- Assert the request (URL, method, params, body) and the returned typed value; only `AuthService` asserts
  stored state, because §6's Service-boundary rule says the other services hold none
- Cover the edge cases in Section 16, not only the happy path — the unset-filter param, the un-swallowed
  `fieldErrors` on 400, the 401 that must not half-authenticate
- Component tests are NOT in scope — per CLAUDE.md they start at project 08; this project tests services only
- **New concepts:** Angular service unit testing with `provideHttpClientTesting()` and `HttpTestingController`
- **Review concepts:** auth, entry, user and report services
- **Done condition:** `Terminal: ng test passes — AuthService, EntryService, UserService and ReportService specs all green; getEntries issues a GET to /api/entries with no empty params when a filter is unset, changePassword surfaces the 400 fieldErrors without clearing the session, and a failed login leaves the token unstored`

### Step 10 — SQL complement
- In `sql/`, hand-write the SQL that Hibernate generates for the main report queries (the `GROUP BY` aggregations) and for `GET /api/entries` with filters
- Compare your SQL output in pgAdmin against the API response — they must match
- **New concepts:** reading Hibernate-generated SQL; connecting JPQL to raw SQL
- **Review concepts:** JPQL aggregations, daily SQL block (`GROUP BY`, `SUM`, `WHERE`)
- **Done condition:** `pgAdmin: the hand-written GROUP BY query in sql/ returns hours-per-project rows matching GET /api/reports/by-project`

### Step 11 — Docker
- `Dockerfile` for the Spring Boot app
- `docker-compose.yml` with Spring Boot + PostgreSQL services
- Config per environment: `JWT_SECRET` and DB credentials as env vars in the compose file (never in the image); a `docker` Spring profile (`application-docker.properties`) overrides the DB host to the compose service name instead of `localhost`
- `docker-compose up` runs everything locally
- **New concepts:** Docker + docker-compose, containerisation
- **Review concepts:** none
- **Done condition:** `Terminal: docker-compose up — app reachable at localhost:8080/api/users and the Postgres service is healthy`

---

## 16. Testing plan

### Backend — JUnit 5 + Mockito (Step 8)

Mock the repository; test the service in isolation. Cover the edge cases, not only the happy path.

| Service method | Happy path | Edge cases to cover |
|---|---|---|
| `TimeEntryService.create` | Saves a DRAFT entry | future date → throws; hours < 0.5 or > 24 → throws; an **inactive** project and an **unknown** project both → `ResourceNotFoundException` (404) with the *same* message, asserted on the message and not only the type — that equality is the §8 project-existence ruling and a divergence reopens the oracle |
| `TimeEntryService.update` / `.delete` | Edits / removes an own DRAFT entry | entry not DRAFT → throws; caller is not the owner → `ResourceNotFoundException` (404), indistinguishable from an unknown id; update re-runs create's rules (future date, hours range); an inactive project that is **the entry's own** → `BusinessRuleViolationException` (400), while **any other** inactive or unknown project → `ResourceNotFoundException` (404) — the two asserted separately, since one flag decides both (§8 project-existence ruling); **a non-`DRAFT` entry sent with an unknown `projectId` asserts `409`, not `404`** — the state guard runs before the project is resolved |
| `TimeEntryService.findByFilter` | EMPLOYEE gets only their own entries; MANAGER gets all | filters (`month`, `status`, `projectId`) narrow the result; an employee never receives another user's entry; a MANAGER-only `userId` supplied by an EMPLOYEE caller is overwritten with their own id |
| `TimeEntryService.submit` | DRAFT → SUBMITTED | entry not DRAFT → throws `InvalidStateTransitionException` (409); caller is not the owner → `ResourceNotFoundException` (404), indistinguishable from an unknown id; **the entry's project is inactive → throws `BusinessRuleViolationException` (400)** and the entry stays DRAFT (the §8 rule "cannot submit entries for an inactive project") |
| `TimeEntryService.reopen` | REJECTED → DRAFT for the owner | entry not REJECTED → throws; caller is not the owner → `ResourceNotFoundException` (404), indistinguishable from an unknown id; MANAGER caller → throws |
| `TimeEntryService.approve` | SUBMITTED → APPROVED | entry not SUBMITTED → throws; entry id not found → `ResourceNotFoundException`; caller is the entry's owner → `ForbiddenOperationException` (403) — the §8 promotion case, so the fixture is an EMPLOYEE holding a SUBMITTED entry whose role is then MANAGER, **not** a manager who logged hours (`POST /api/entries` is EMPLOYEE-only, so that state is unreachable) |
| `TimeEntryService.reject` | SUBMITTED → REJECTED + note saved | entry not SUBMITTED → throws; missing note → throws; caller is the entry's owner → `ForbiddenOperationException` (403), same promotion fixture as `approve` |
| `ProjectService.create` | Saves a project | duplicate name → throws (409) |
| `ProjectService.update` | Applies name, description and the optional `active` flag | renaming onto another project's name → throws `DuplicateResourceException` (409); **renaming to its own current name succeeds** — the duplicate check exempts the target case-insensitively; unknown id → `ResourceNotFoundException` (404) |
| `UserService.create` | Saves the user with a generated password, stored BCrypt-hashed | duplicate email → throws (409); the returned `generatedPassword` is **not** what is persisted (the stored value is a hash that `matches()` it); two consecutive creates produce different passwords |
| `UserService.update` | Applies name, email, role and the optional `active` flag | promoting a user who holds a `DRAFT` **or** a `REJECTED` entry → throws `InvalidStateTransitionException` (409), each status asserted on its own so neither passes on the other's evidence; a user holding only `SUBMITTED`/`APPROVED` entries promotes normally (§8 routes `SUBMITTED` to another manager); `MANAGER → EMPLOYEE` never blocks **for another user**, while a demotion or a deactivation whose target id is the caller's own throws `InvalidStateTransitionException` (409), each of the two transitions asserted separately; renaming your own account still succeeds, so the guard is shown to read the transition and not the target; and reactivating a deactivated user who holds a `DRAFT` succeeds, since the role did not change |
| `UserService.delete` | Sets `active = false` on the target | the caller deleting their own id → throws `InvalidStateTransitionException` (409); deleting an already-inactive user succeeds, so the soft delete stays idempotent |
| `UserService.changePassword` | Replaces the caller's hash when the current password matches | wrong current password → throws `InvalidPasswordException` carrying `currentPassword` (**400**, `fieldErrors.currentPassword` — the §8 status ruling); a `newPassword` equal to the current one → the same type carrying `newPassword`, and the stored hash is left untouched; the new hash differs from the old one and `matches()` the new password |
| `UserService.resetPassword` | Replaces another account's hash with a freshly generated password and returns its plaintext | the returned password is **not** what is persisted (the stored value is a hash that `matches()` it); the caller's own id → `InvalidStateTransitionException` (409) and the hash is left untouched; unknown id → `ResourceNotFoundException` (404) |
| `AuthService.login` | Returns a JWT carrying the role | wrong password → `BadCredentialsException` (401); inactive user → login refused even with the right password; a sixth consecutive failure on the same email or IP → `TooManyAttemptsException` (429) without reaching the `AuthenticationManager`, and a successful login resets both counters; an email differing from the stored one only in letter case draws on the **same** per-email budget, since the key is the normalized address |
| `ReportService.getHoursByProject` / `.getHoursByUser` | Groups hours per project / per user for the month | empty month → returns empty list, not null; only the statuses §8 declares reportable are summed |
| `ReportService.getSummary` | Returns the month's approved hours, pending hours and approved entry count | empty month → all zeros, no exception; `approvedHours` **equals the sum of `getHoursByProject`** for the same month (the §8 reconciliation rule, asserted); DRAFT and REJECTED entries change no field; an EMPLOYEE caller gets only their own entries in all three figures, a MANAGER the whole company |

**The one §8 rule with no unit test, stated deliberately:** "a user deactivated *after* their token was
issued loses access on their next request" lives in `JwtFilter` /
`AccountStatusUserDetailsChecker`, not in a service, so no Mockito test can reach it. It is verified
manually in Postman (deactivate a user, reuse their still-valid token → `401`) and becomes a
`@WebMvcTest` from project 08. The §8 rule **"shared routes stay role-aware"** is likewise not a service
test: its enforcement is the `@PreAuthorize` on the MANAGER-only endpoints (already asserted through the
role rows above), and the role-aware *rendering* is a component concern, which project 07 does not test.
Every other §8 rule maps to a row in the table above.

**Backend — slice tests:** none in project 07. This is the first project with tests, so it introduces
only the unit level (JUnit 5 + Mockito). The slice types (`@WebMvcTest` for controllers, `@DataJpaTest`
for custom repository queries) are introduced from project 08 — do not add them here.

**Assertion quality:** every test asserts real behaviour — the returned value or the saved object's
state (status transition, hashed password, computed total) — never only `verify(...)` that a mock method
was called. No trivial "it exists" tests.

### Angular — services (Vitest + TestBed, Step 9)

**The CLI-generated component specs stay green from Step 7a on**, even though component tests are out of
scope here: `ng test` runs every `*.spec.ts`, so one broken scaffold fails the suite Step 9's done condition
reads. A spec is updated in the change that alters its unit — an assertion about content the template no
longer renders is deleted rather than rewritten into one that cannot fail, and a unit that injects a token
the framework mints at runtime (`MatDialogRef` from `MatDialog.open()`) gets it as a `useValue` double.

Configure the test module with `provideHttpClient()` + `provideHttpClientTesting()` — **not** the
deprecated `HttpClientTestingModule` — and assert the request through `HttpTestingController`, without
a real backend.
Same bar as the backend table: name the method, the request it must issue, and the edge cases — not
"it works". **What a service test may assert is bounded by §6's Service-boundary rule:** a
`core/services/` service issues the call and maps the response, so the assertions are about the
*request* and the *returned typed value*. Only `AuthService` and the `core/state/` holder `PendingApprovals`
own state, so they are the only units whose tests assert a stored value or a signal.

| Service method | Happy path | Edge cases to cover |
|---|---|---|
| `AuthService.login` | POSTs `{email, password}` to `/api/auth/login`; on 200 stores the session in `localStorage` and sets the `session` signal with the role from the response | wrong password → 401 leaves the session unstored and `session` null (a failed login must not half-authenticate); the request body carries the password only in the POST body, never as a query param; a `200` whose body fails `isAuthResponse` errors with `UnreadableSessionError` and stores nothing; a stored session that fails the same guard at start-up is removed and raises the expiry notice rather than logging the user out silently |
| `AuthService.logout` | Clears the stored session and resets `session` to null | called with no session stored → does not throw |
| `EntryService.getEntries` | GETs `/api/entries` and returns the typed `TimeEntry[]` | `month`, `status` and `projectId` appear as query params **only when supplied** — an unset filter sends no empty param; a `[]` response returns an empty array, not null |
| `EntryService.approve` | PATCHes `/api/entries/{id}/approve` with no body and returns the updated `TimeEntry` | the id is interpolated into the path, not sent as a param; **the service stores nothing** — the returned value is the only channel (§6 Service boundary), so the caller page is what refetches |
| `EntryService.create` | POSTs the entry and returns the created `TimeEntry` | a 400 surfaces the `fieldErrors` map from the §10 error contract to the caller, un-swallowed, so the reactive form can bind a message per input |
| `UserService.changePassword` | PATCHes `/api/users/me/password` with `{currentPassword, newPassword}` and completes on `204` with no body to map | a `400` surfaces the `fieldErrors` map (`currentPassword` / `newPassword`) to the dialog un-swallowed; the current password travels in the body only, never in the URL; the service stores nothing and does **not** clear the session on that `400` |
| `PendingApprovals.refresh` | GETs `/api/entries?status=SUBMITTED&size=1` and sets `count` to the page's `totalElements` | a failed read keeps the last count and the stream stays alive for the next `refresh()`; `clear()` issued while a refresh is in flight cancels it, so `count` ends at 0, not at the late response's number |
| `ReportService.getSummary` | GETs `/api/reports/summary?month=` and returns the typed summary | both roles call it and the backend decides the scope, so the service takes no role argument and the component never asks who is logged in — the employee and manager dashboards share one call |

### Angular — components

Out of scope for this project. Per CLAUDE.md "Testing rules", component (TestBed) tests are introduced in **project 08**. Project 07 tests services only.

For each new testing concept (JUnit 5 + Mockito, `provideHttpClientTesting()`), add one interview
question to `notes/interview-prep/junior/en/` and `notes/interview-prep/junior/es/` (same question,
both files).

---

## 17. Key rule

A half-finished project with good architecture decisions and real tests
is better than a perfect project delivered in September. Ship early, apply in parallel.

---

## 18. README structure

This project uses three READMEs. See `CLAUDE.md → README format for full-stack projects` for the full rules.

| File | Audience | When to write |
|---|---|---|
| `README.md` | Recruiter | Update after each step |
| `backend/README.md` | Technical interviewer | Write when backend is complete |
| `frontend/README.md` | Technical interviewer | Write when frontend is complete |

---

### backend/README.md — planned sections

Write when the backend is complete (after Step 6).

**1. API endpoints table**
| Method | URL | Role | Description |
One row per endpoint — all routes visible at a glance.

**2. Database schema**
Entities, fields, relationships. One sentence per key decision (why ENUM for status, why soft delete, why no cascade delete).

**3. Auth flow — numbered steps**
1. Client sends `POST /api/auth/login` with email and password
2. Service loads user from DB, verifies password with BCrypt
3. Server generates JWT signed with the secret from environment variable
4. Client sends JWT in `Authorization: Bearer <token>` header on every request
5. `JwtFilter` intercepts, validates token, extracts user, sets `SecurityContext`
6. Spring Security allows or denies based on `SecurityFilterChain` rules

**4. Security considerations**
- Passwords hashed with BCrypt — never stored in plain text
- New accounts get a `SecureRandom`-generated password returned once at creation; no shared or committed default credential exists
- Password change is self-service only (`/api/users/me/password`) — not even a MANAGER can set another user's password
- JWT secret loaded from environment variable — never committed to git; the first manager account is seeded at runtime behind a `dev` profile, not from a hash in `data.sql`
- Datasource role is a non-superuser owning only the `timetrack` database — an injection or a bug is bounded by that database instead of reaching `pg_shadow`, `COPY … PROGRAM` or another application's data on the same server
- Role-based endpoint protection with `@PreAuthorize`
- Input validation at controller boundary with `@Valid` + `@ControllerAdvice`

**Known limitations to state explicitly** (a documented trade-off reads as judgement; a silent gap reads as an oversight)
- **No forced password change on first login** — `mustChangePassword` was cut from the MVP because forcing it requires the frontend to intercept every route until the change happens. A user may keep their generated password indefinitely
- **No self-service password reset** — a user who forgets theirs cannot recover it alone; a manager resets it from the Team page (`POST /api/users/{id}/password-reset`, shown once). A self-service reset needs an email channel, which is out of scope
- **No refresh tokens** — a 60-minute access token expires mid-session and the user logs in again

**5. Key patterns**
- Layered architecture — controller never calls repository
- DTO boundary — entity never leaves the service layer
- Soft delete — `active = false` instead of DELETE
- `GlobalExceptionHandler` — consistent JSON error responses

**6. Tradeoffs**
- JWT over session-based auth — stateless API scales without server memory
- Soft delete over hard delete — `TimeEntry.user`/`project` are not-null FKs with no cascade, so a real DELETE fails; timesheet history is audit data that must survive a person leaving
- RuntimeException over checked exceptions — Spring Boot convention, caught globally with @ControllerAdvice

**7. How to run alone**
IntelliJ + local PostgreSQL, without Docker. It states the complete runtime contract, not just the
steps: every property placeholder declared without a default (`DB_PASSWORD`, `JWT_SECRET`,
`ADMIN_PASSWORD`), the two declared **with** one (`DB_URL`, `DB_USERNAME`, externalised so the same build
runs against another host, not for secrecy), and the profile a working instance needs. It also states how
to create the database and its role — the app connects as a non-superuser owning the `timetrack` database
and nothing else on the server — so least privilege is part of the run contract, not an install detail a
reader is left to infer. A profile-gated bean is part of that
contract — without `SPRING_PROFILES_ACTIVE=dev` the context starts cleanly and no manager is seeded,
so the failure is silent where a missing placeholder is loud.

---

### frontend/README.md — planned sections

Write when the frontend is complete (after Step 7d).

**1. Folder structure** — one-line explanation per folder, why it exists.

**2. State management approach**
- Signals for page state — the page component under `pages/` owns every signal for its route (§6)
- **No cross-page cache.** Two pages reading the same endpoint each fetch it on their own load; a
  `core/services/` service issues the call and maps the response, and holds no state (§6, §13's table)
- `AuthService` is one of two app-wide exceptions — token + current user in the `session` signal,
  written to `localStorage` on login and logout, because auth outlives every route; the other is
  `PendingApprovals`, the badge count the shell draws and the review pages refresh (§6, §13)
- Coordinator pattern — page owns all state, child components receive and emit; a form dialog owns its
  own write and the page refetches when it closes (§6 Form dialogs own their write)

**3. Key patterns**
- `authGuard` + `managerGuard` — route protection per role
- HTTP interceptor — JWT attached automatically to every request
- Role-aware UI — same route, different content per role
- `forkJoin` on dashboard — parallel API calls for stat cards

**4. Shared components**
- `status-badge` — coloured badge used in entries, approvals and dashboard
- `confirm-dialog` — reusable confirmation before any destructive action
- `reject-dialog` — rejection note input, used in approvals
- `change-password-dialog` — self-service password change, opened from the shell user menu (not routed)

**5. Tradeoffs**
- Signals over NgRx — app complexity did not justify a state management library
- Angular Material over custom CSS — enterprise UI library standard in Spanish consultancies

**6. How to run alone** — `ng serve`

---

## 19. Architecture decisions to document in the global README

Format: `[what you did] to [why it matters]` — one line each, 6-8 maximum.

- Stateless JWT auth to keep the API independent of server state — and, because the credential travels in a header the browser never attaches on its own, to make CSRF protection unnecessary
- DTO boundary between persistence and HTTP layer to control what the API exposes
- PATCH for state transitions (submit, approve, reject) to signal that only status changes
- SecurityContextHolder for current user to prevent privilege escalation from client-supplied userId
- Soft delete for users and projects to preserve historical timesheet data
- Workflow states (DRAFT → SUBMITTED → APPROVED / REJECTED) to support the resubmit flow and audit trail
- Manager-only account creation to prevent self-assignment of the Manager role
- Profile-gated runtime seeding of the first manager account to avoid both a setup endpoint that must be removed after first use and a credential hash committed to git

---

## 20. Tradeoffs to document in the global README

Format: `[option chosen] over [option rejected] — [reason]`

- JWT over session-based auth — stateless API requires no server memory per user
- Soft delete over hard delete — `TimeEntry.user`/`project` are not-null FKs with no cascade, so a real DELETE either fails or forces deleting the entries with it; timesheet history is legal-audit data that must survive a person leaving
- docker-compose over separate manual setup — one command runs the full project locally
- `Pageable` pagination on GET /api/entries, return-all everywhere else — entries is the only collection here that grows without a bound, so it is the only one paged; the month filter narrows a result but does not cap it. Reversed the original return-all choice on 2026-08-01, while Step 7a was still unbuilt and the change cost a method signature rather than a rewritten table
- Signals in the page component over a state-management library (NgRx) — eight pages, each reading its own endpoint and sharing nothing but the logged-in user and the pending-approvals count, each held in one root signal; a store would add actions, reducers and effects for state that never leaves one route. NgRx becomes worth it when many values must stay in sync across distant pages, not for one count
- Local `docker-compose` over a deployed public URL — the portfolio value of this project is the backend it is the first of (layering, JWT, workflow), which a recruiter reads in the code and the READMEs; a free-tier API + database host that cold-starts and expires would add hosting work without adding a new concept. Deployment is a project 08 objective, where the app is the demo
- `ddl-auto=update` over Flyway migrations — single developer, schema still evolving with the plan; versioned migrations become necessary the moment a second environment or teammate exists

---

## 21. Future improvements to document in the global README

Domain-realistic only — max 3 bullets.

- Export approval reports to PDF or Excel
- Email notifications when entries are approved or rejected
- Bulk approval workflow for managers handling large teams

---

## 22. Git branch strategy

Written retroactively on 2026-07-06, after Step 4 closed — `feat/spring-foundation` had grown
to cover the entire backend foundation without a plan for where it would end. From here on,
one branch per coherent feature, never one per step.

| Branch | Covers (steps) | Opens | Closes |
|---|---|---|---|
| `feat/spring-foundation` | Steps 1–4 — Spring Boot setup, Project CRUD, JWT auth, role-based authorization | Step 1, right after `projects/07-timetrack` was created from `main` | Now — Step 4's done condition passed. PR into `projects/07-timetrack`. |
| `feat/timeentry-workflow` | Step 5 — TimeEntry CRUD + workflow | After `feat/spring-foundation` merges | When Step 5's done condition passes |
| `feat/reports` | Step 6 — Reports | After `feat/timeentry-workflow` merges | When Step 6's done condition passes |
| `feat/angular-shell-auth` | Step 7a — Shell + auth | After `feat/reports` merges | When Step 7a's done condition passes |
| `feat/angular-entries` | Step 7b — Employee flow: dashboard + entries | After `feat/angular-shell-auth` merges | When Step 7b's done condition passes |
| `feat/angular-manager-pages` | Steps 7c–7d — Manager review flow + manager admin pages | After `feat/angular-entries` merges | Closed 2026-09-22 — Step 7d's done condition passed and PR #92 merged it; the last frontend branch, so G4 is due. The PR was opened against `main` rather than `projects/07-timetrack`, and the project branch was fast-forwarded onto the same commit on 2026-09-23 (see below) |
| `feat/backend-tests` | Step 8 — Backend tests | After `feat/angular-manager-pages` merges | When Step 8's done condition passes |
| `feat/angular-tests` | Step 9 — Angular tests | After `feat/backend-tests` merges | When Step 9's done condition passes |
| — (no dedicated branch) | Step 10 — SQL complement | — | Commits go on whatever branch is active at the time, per CLAUDE.md's rule (2026-07-14) that study materials follow the active branch — `main` only receives merges via PR |
| `feat/docker` | Step 11 — Docker | After `feat/angular-tests` merges | When Step 11's done condition passes — the last feature branch before the project branch closes |

**Backlog-fix branches (outside the feature sequence).** The table above plans the `feat/…` branches
that build the §15 steps. Work that comes back from a **review gate** — the High/Medium tasks
`review-audit` writes to `PROJECT-BACKLOG.md` — is not a §15 step and never reopens a completed one, so
it gets a `fix/…` branch instead (CLAUDE.md branch naming) and is deliberately not a row in the step
coverage table.

| Branch | Covers | Opens | Closes |
|---|---|---|---|
| `fix/backend-backlog` | The **High** backend tasks from G3's `review-audit` run, plus the deferred `PATCH /api/entries/{id}/reopen` endpoint (see Step 5's "Deferred out of this step" line) **and the account-password-flow Medium**, which Step 7a depends on — no §15 step | After G3's `review-audit` wrote `PROJECT-BACKLOG.md` | When every High backend task in `PROJECT-BACKLOG.md` is `[x]`, `reopen` passes its Postman check (`PATCH /api/entries/{id}/reopen` on a REJECTED own entry returns 200 with status DRAFT) — this is what signs G3 off — **and `PATCH /api/users/me/password` returns 204 for a correct current password, 400 with `fieldErrors.currentPassword` for a wrong one and 400 with `fieldErrors.newPassword` for a new password equal to the current one**, so Step 7a has an endpoint to build against. PR into `projects/07-timetrack`. |
| `fix/frontend-backlog` | The **Medium** and **Low** frontend tasks from G4's `review-audit` run of 2026-09-23 — no §15 step, and none of them holds G4 or G5; the Mediums hold G7 alone | After G4's `review-audit` wrote `PROJECT-BACKLOG.md` | **Condition met 2026-09-23** — every Medium frontend task in `PROJECT-BACKLOG.md` is closed, so `portfolio-audit` can return ✅ Ready at G7; the Lows may follow on the same branch or be left open, since they hold no gate. PR into `projects/07-timetrack`, opened by Victor. |

The project branch, `projects/07-timetrack`, was created once from `main` at Step 1 and stays
open for the whole project. It only merges into `main` when Step 11 is done.

**Immediate action (updated 2026-08-28):** `feat/reports` has merged, so the backend feature branches are
all closed. `fix/backend-backlog` is the live branch and **its own closing condition is fully met** — every
High backend task is `[x]`, `reopen` passed its Postman check on 2026-07-22, and the account-password flow
(`PATCH /api/users/me/password`) closed on 2026-07-29.

**The branch went further than it had to, and that changes what is outstanding.** It cleared every High,
Medium and Low in batches through 2026-08-01; the 2026-08-06 `review-audit` then reopened the backend tier
with 3 Highs, all closed on 2026-08-23, plus a set of Lows worked through since. **`PROJECT-BACKLOG.md`
currently holds **5 Low frontend tasks, every one of them raised by the G4 `review-audit` run of 2026-09-23 (`d22a69e4`), and no High or Medium at any tier**; the Lows hold no gate, since G4 closes on Highs alone and found none and G7 refuses a ✅ Ready only on an open High or Medium. Until that run it held no open task at any priority — the last, `/approvals` unable to sort by Employee, raised on 2026-09-22 by Victor in the browser after every other task had closed, closed that day in `e68ebf05` and `9a8a2fce`; the README screenshots Low closed on 2026-09-22 with four captures on a realistic demo dataset in `screenshots/`; the three raised on 2026-09-22 by the cold design review of that day's second round of closes closed that day — the employee dashboard's Date rung, 5px too narrow, in `66f1e442`, the dialogs' error line left with the browser's default ring, in `9ce2b3f4`, and §14 overclaiming the strong focus ring on form fields, as a documentation fix; all nine raised on 2026-09-22 by the cold design review of that day's backlog closes closed that day — five Lows, the login brand's weight kept as a named typography exception in §14, the failed-save focus headline promising more than the code in `bbca778b`, the unnamed optical value and "The four" listing three by naming the fourth optical exception in §14 Spacing, and the hand-written 4px radius in `d94e4137`, and four Mediums — Hours hidden under the pinned actions of Approvals and the manager dashboard at 375px in `a927f81f`, a Back pressed during an in-flight password reset or member create losing the new password in `0c138eb7`, the icon buttons' 1.25:1 keyboard focus indicator in `5f2e12ff`, and the employee dashboard's table clipped and keyboard-unreachable at 375px in `fed3a5ec`. Before them, eight frontend ones (one Medium, the browser's Back button discarding a new member's generated password, and seven Lows, the three-card strip stacked at tablet widths, Team's Status under its pinned actions at 375px, its email split after a dot, the copied section-heading rule, the toolbar outside any landmark, the off-grid values and a failed save leaving focus on the body, all closed the same day) were raised on 2026-09-22 by the cold design review of Step 7d, and a ninth that day while closing it (the README screenshots, owed on a realistic demo dataset before G5, closed that day); the backend Low raised while building Step 7d's Team page, on how an account is recovered once its generated password is lost, closed on 2026-09-22 with a manager's password reset (`27d9dee1`, `b52af306`), and the backend Low raised while triaging it, `CreateUserResponse.generatedPassword` missing `@ToString.Exclude`, closed the same day in `dbe17695`, leaving the backend tier with no open task. All six frontend tasks raised on 2026-09-21 closed on 2026-09-22 — their Medium, `/approvals` scrolling sideways at 1024px, and the Lows on the page title's focus ring after a mouse approval, on Retry dropping focus, on the badge's red, on the dashboard list's title, and the decision that made the sidebar badge follow a write live; before them, the frontend High raised on 2026-09-21 by Victor's browser checks (a table's text columns breaking inside words, at desktop width and down to one character on a phone) closed that day in `c0241dcc`, `26428c9d` and `64fa43a4`, and the Medium raised with it by that day's cold design review (focus lost after the first create from an empty state) closed that day in `5c4dad81` and `ce32e773`. The eight Lows open that morning all closed on 2026-09-21 — seven fixed (Prettier's line-ending check, the login response validated before it is stored, the page and table layout blocks shared, the filter bar split without an orphan, the rejection note kept below 600px, the draft on an inactive project that no longer offers a submit, and the Projects sort by Status), one dropped as a decision with no code change (focus to the actions cell). Of the twelve tasks raised on 2026-09-20 — three Medium and nine Low, from three cold reviews and Victor's browser walks — ten closed the same day, the last of them the Medium for `/entries`' row actions dropping focus to `<body>`. Before them it held no open task at any priority** (the two Lows raised last in the 2026-09-19 pre-PR browser check — a REJECTED row stating the manager's note twice and the API's lower-case default validation messages — closed that day in `e8a44736` and `6c43386c`) — the frontend Low raised in that check for the switch to §14's day-first `en-GB` dates closed that day in `51bb8046`, as did the frontend Medium raised in that check (both entry tables showing each date a day early east of UTC) closed that day in `e6f2fb0b`, and the frontend Low raised in the same check (the first-use empty-state icon clipped by `MatIcon`'s own 24px box) closed that day in `160cf8fe`, and the three frontend Mediums of the 2026-09-19 `review-audit`, run ahead of G4, closed that day (`e3e66f7a`, `5a957659`, and one decision with no code change); before that review it held none — the two `/entries` empty-state Lows raised by Victor on 2026-09-18 closed that day in `256b95ed` and `eb867534`; the initial bundle over its `angular.json` budget, raised 2026-09-18, closed that day in `0353a6db` (665 kB → 448 kB); the two Lows Victor reported that day both closed with it open, the stat cards' unequal heights and 3 + 1 wrap in `58822815` and `1fd76f7c`, and the Month filter panel wrapping its labels in `2b154e91` (the stat cards' unequal heights and 3 + 1 wrap at a mid width, and the Month filter's option panel wrapping its labels); the Medium raised with them (the entries header's "Log hours" usable before the project list had loaded) closed the same day in `580994cc`, and the Low for the entry dialog asking to discard an edit already saved before a failed submit closed that day in `9603a9f8`, as did the Low for the stat grid's `aria-label` promising a month two of its cards do not keep, in `03c8dfe8`, and the Low for the dashboard's first-use empty state missing the illustration §14 specifies, in `844d3da0`; the Low asking whether the dashboard's recent list should reuse `EntryList` closed that day as a decision, no code change (§13: it stays inline). Before them, the frontend Low raised on 2026-09-16 while triaging the Step 7a hygiene bundle (no route declares a document `title`) closed the same day in `b91a19ae` and `82329089`. The Low raised the same day while closing the sidenav task (the navigation toggle named no `aria-controls` target) closed that day in `3b48f37a`. The pre-PR hygiene bundle itself (an `as ApiError` cast beside the existing `isApiError` guard, a public `Shell.dialog`, `px` in `shell.scss`, the `Timetrack` title) closed that day across `5c69a9e7`–`5241a4c7`. The pre-PR Low for PLANNING drifting from the built code closed that day as a decision, no code change: §6 now rules that a form dialog owns its write and where `Router` may be injected. The Medium raised with them (`Shell` kept its sidenav in `side` mode at every width) closed the same day in `40fc27e5`, and the Low for the toolbar trigger that showed no user name and no logo closed the same day in `3fd72933`, as did the Low Victor raised that day for the account trigger's arrow that never turned with the menu, in `e3a981fa`, and the pre-PR Low for the dialog's missing password visibility toggles closed that day in `91df6a48`, its toggle extended to the login's password field, and the pre-PR Low for the dialog's missing full-screen rule closed that day as a decision, no code change: dialogs keep Material's compact card on phones (§14 Responsive intent). The frontend Low raised on 2026-09-16 while reviewing the Step 7a error patterns before its PR (`authInterceptor` treated every `401`, including a failed login, as a silent session expiry) closed the same day in `13730029`. the two frontend spec Lows raised on 2026-09-16 (the scaffold `app.spec.ts` title assertion and the change-password dialog spec missing `MatDialogRef`) both closed that day in `72e15280` and `81d8a173`, leaving `ng test` green at 12/12. The login-`<h1>` Low itself, raised the same day while closing the phone login layout task, closed on 2026-09-16 in `d0fb4a01`. The two frontend Lows raised on 2026-09-15 while verifying Step 7a both closed on 2026-09-16: the Login page's mobile layout in `ee3855b6` and the toolbar account-menu icon colour in `382a4983`; and the Medium raised the same day (a dialog left open over `/login` after a mid-session `401`) closed on 2026-09-16 in `b32e11a6`. The frontend Low raised on 2026-09-14, during Step 7a (two
HTTP `.subscribe()` calls with no teardown, against §6), closed the same day in `c5e69b3a`, the frontend
Medium raised beside it (closing the change-password dialog dropped keyboard focus to `<body>`) closed on
2026-09-14 in `1d4bf603`, the three frontend Lows raised on 2026-09-10 (the stuck login spinner, the missing `OnPush`,
the unsquared `tonal` variant) all closed on 2026-09-11, and the backend High raised the same day closed on
2026-09-11 in `2fd8891e` — so no High or Medium was open until 2026-09-21, when **the frontend High and Medium above were raised** — both closed the same day; of the tasks raised after them, the one Medium — the browser's Back button discarding a generated password — closed on 2026-09-22 in `3ee8b787` and `f7b362c0`, and of the four Mediums the cold design review of that day's backlog closes raised, none remains open, so nothing held G7 until G4 ran. That run, on 2026-09-23, is what reopened the frontend tier: its 6 Mediums now hold G7, which blocks on High and Medium only, and its 9 Lows hold nothing. `fix/frontend-backlog` was cut from `projects/07-timetrack` on 2026-09-23 to work them; the first of them, the page title never taking focus on a reload that failed outside Retry, closed that day (`a61fb96c`), leaving **2 Medium and 9 Low** once `/reports`' blanked tables (`e7401662`), the out-of-range page index on `/approvals` and `/entries` (`6e062870`) and the employee dashboard's year-less date (`b3e77c42`) closed the same day — the paging fix scoped down to one page after the employee dashboard's half proved vacuous, and the date fix reversed in triage, since the manager dashboard it named was right and the employee's list was the outlier. The last two closed the same day, leaving **9 Low and nothing above it**: the two `/reports` hours tables made keyboard stops (`b8f33794`), whose real scope was three files rather than one once the ring proved to be clipped by `.table-area`'s `overflow: hidden`, and a whitespace-only value refused client-side (`d64536a3`), whose real scope was five controls in five files behind one shared validator rather than the one dialog the task named.
The first Low closed the same day, leaving **8 Low and nothing above it**: `approvals.ts` re-implementing
a focus fallback inline (`1e8fc369`, `2efaed32`), whose real scope was **6 files, not 1** — the helper the
task named holds only the `document.body` half and measures it after the next render, so the fix added a
second exported rule rather than routing the first through it, and the same lookup had been copied in five
spellings across the pages.
The second closed with no code change: `entry-dialog`'s create-and-submit branch was a **false positive**,
since `write()` returns on `if (!this.entry)` before `submitAfterSave` is ever read, and the `switchMap` the
task called dead sits after that return, in the update path, where the "Submit for review" button reaches it
on every DRAFT edit — the one-step save-and-submit §14 specifies. **7 Low remain, and nothing above them.**
The third closed with no code change either: the `onSort()` fallback under `matSortDisableClear` is **kept**,
and its real scope was **2 files, not 1** — `approvals.ts` carries the byte-identical ternary and the task named
only `entries.ts`. Dropping it was rejected: `MatSort` declares `SortDirection = 'asc' | 'desc' | ''`, so the
branch covers the type the handler is given rather than a hypothetical, and on `/entries` the attribute that makes
it unreachable sits in `entry-list`'s template, a child component the page does not control. §6 now rules it.
**6 Low remain, and nothing above them.**
The fourth closed with code: the dialog write handlers and the busy-action helper each have **one** name
(`e220c808`, `62d6638e`). Half the task's premise was false — it read `save()` in all five dialogs with
one outlier, when there were **three** spellings and `reject-dialog`'s `reject()` was never named;
`login.ts` was **excluded**, being a routed page that authenticates rather than a dialog that persists.
§6 gained the rule and had its three-dialog list corrected to the five that actually follow it.
**5 Low remain.**
This count is maintained by the backlog rituals on every close and every raise, in the same commit.

Remaining sequence: `fix/backend-backlog` merged into `projects/07-timetrack` on 2026-08-29 (PR #70,
`a67866c4`), signing G3 off → the four frontend branches built Steps 7a–7d and the last of them,
`feat/angular-manager-pages`, merged on 2026-09-22 (PR #92) → G4's `review-audit
REVIEW_SCOPE = frontend`, run from `projects/07-timetrack` so its backlog commit lands there → create
`feat/backend-tests` from `projects/07-timetrack` → Step 8.

**The 2026-09-22 merge went to the wrong base, and the correction is recorded here rather than in the
history.** PR #92 was opened against `main` instead of `projects/07-timetrack`. `main` held no commit of
its own, so the merge was linear and nothing was lost or conflicted; on 2026-09-23
`projects/07-timetrack` was fast-forwarded to the same commit (`e883a365`) and pushed, leaving `main`
one merge commit ahead of it. The alternatives — reverting the merge, or force-pushing `main` back —
were weighed and rejected: the revert would have to be reverted again before the real project-to-`main`
merge at Step 11, and rewriting the default branch buys a tidier graph at the price of published
history. The consequence to carry forward is that `main` already holds the frontend, so the project
branch's own merge at Step 11 will carry Steps 8–11 only; the rule this broke — *`main` receives a
project only when it is finished* — is unchanged.

---

## 23. Quality gates — which prompt to run when

Each gate ties a concrete point in the build (a §22 branch closing, a learning-plan phase finishing) to
the one prompt that runs there, so a quality check happens at the moment the file it reads has just
become accurate — not remembered at the very end. The project is not closed until every gate has run
(see the closure checklist below).

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G1 — Step ritual** | Every learning-plan step's done condition passes | *(no prompt — the `step-complete` skill fires in-session)* | Keeps PLANNING ✅ / PROGRESS.md / README true as you go, so the later gates read accurate files. |
| **G2 — Plan drift** | Only if the learning plan / branch strategy change mid-build (scope cut, steps reordered) | `plan-audit` · `MODE = review` · `PROJECT = projects/07-timetrack` | Every later gate checks the code against PLANNING.md. A stale plan silently invalidates all of them. Skip if the plan never moved. |
| **G3 — Backend review** | `feat/reports` merges — backend complete (Steps 1–6), **before Step 7 (Angular frontend) starts**. Signed off only when every **High** backend task in `PROJECT-BACKLOG.md` — including the deferred `PATCH /api/entries/{id}/reopen` endpoint — is fixed on `fix/backend-backlog` and merged | `review-audit` · `PROJECT_PATH = projects/07-timetrack` · `REVIEW_SCOPE = backend` | Correctness + security on the API **before** the frontend is built against it. Fix the High tasks it writes to `PROJECT-BACKLOG.md` before moving on. |
| **G4 — Frontend review** | `feat/angular-manager-pages` merges — Steps 7a–7d complete | `review-audit` · `PROJECT_PATH = projects/07-timetrack` · `REVIEW_SCOPE = frontend` | The backend is **not** re-reviewed (its tier is already dated in the backlog), so this costs a fraction of a `full` run. |
| **G5 — READMEs** | Every **High** task from G3/G4 is fixed and committed | `readme-audit` · `PROJECT_PATH = projects/07-timetrack` | Hard prerequisite of G7: `portfolio-audit` reads the READMEs, so running it first would judge a document that is about to change. |
| **G6 — PROGRESS accurate** | After G5, before the portfolio gate | `progress-update-prompt` · `MODE = active` | G7 and `cv-prompt` both read `PROGRESS.md`. If it is stale, the portfolio verdict and the CV bullet are built on a wrong picture of what you learned. **The gate closes on a clean drift report, not on the run happening**: since 2026-08-05 the prompt writes only `Professional level by topic` and *reports* every other section, so a run that names drift leaves G6 open until the owner it names (`step-complete`, `coverage-mark`, `sql-grade`, `simulation-review`) has repaired it. |
| **G7 — Portfolio go/no-go** | After G5 **and** G6 | `portfolio-audit` · `PROJECT_PATH = projects/07-timetrack` | The closing gate. Reads `PROJECT-BACKLOG.md` — an unfixed High/Medium from G3/G4 blocks the ✅ Ready verdict. Produces the CV bullet + the project question bank. |
| **G8 — Roadmap resync** | After G7 returns ✅ Ready | `roadmap-review-prompt` | The project sequence just changed. This is what keeps `ROADMAP.md` from drifting into a stale plan. |

**Prerequisite chain (hard — a gate run out of order gives a wrong answer, not just a late one):**
`G3/G4 → fix the Highs → G5 → G6 → G7 → G8`. G5 before G7 because the portfolio gate reads the READMEs;
G6 before G7 because it reads PROGRESS; G3/G4 before G7 because it reads the backlog.

### Closure checklist — the project's definition of done

The project is never declared finished early — it is closed only when every box is ticked.

```
- [ ] Every §15 step's done condition passes, each with its step-complete ritual (G1)
- [ ] PLANNING.md still matches what was built — re-run plan-audit MODE=review if §15/§22 moved (G2)
- [x] review-audit REVIEW_SCOPE=backend has run, and every High task it found is fixed (G3)
- [x] review-audit REVIEW_SCOPE=frontend has run, and every High task it found is fixed (G4) — ran 2026-09-23 over Steps 7a–7d, eleven slices plus the consistency pass (`d22a69e4`); it found no High at any priority, so the box closes on an empty set. Its 6 Mediums are G7's to clear, not G4's
- [ ] readme-audit has run — global + backend + frontend READMEs at standard (G5)
- [ ] progress-update MODE=active has run **and its drift report came back empty** — anything it named is repaired by the owner it named (G6)
- [ ] portfolio-audit returns ✅ Ready — no open High/Medium in PROJECT-BACKLOG.md (G7)
- [ ] roadmap-review has run — ROADMAP.md reflects the new project sequence (G8)
- [ ] The project branch has been merged into `main` via PR
```

**The project is closed only when every box is ticked.** A ❌ or ⚠️ verdict at G7 means going back and
fixing, not shipping — that is the whole point of having a gate there.
