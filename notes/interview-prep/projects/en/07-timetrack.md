# Interview Questions — 07-timetrack

**Last banked — backend:** 2026-09-26
**Last banked — frontend:** 2026-09-26
**Last banked — cross-tier:** 2026-09-26

Questions specific to the implementation decisions made in this project.
Use these alongside the topic-based files in `interview-prep/{LEVEL}/en/` and `es/`.

## Architecture & Patterns

### Backend

**[07-timetrack-001] Why did you make Spring Boot a JSON API instead of using it to render the View as a server-side MVC application?** ⭐⭐⭐

I chose a backend that serves JSON and has no View layer, rather than a Spring application that renders HTML. This keeps HTTP handling and business logic in the backend layers while leaving page rendering outside the server.

**[07-timetrack-002] In the project-creation path, why does `ProjectController` build the `Location` response while `ProjectService.create` owns normalization, duplicate checks and persistence?** ⭐⭐

I chose to keep HTTP response construction in `ProjectController`: it calls the service, then builds the resource URI and returns `201 Created`. I decided that trimming, case-insensitive duplicate detection and saving belong in `ProjectService`, so a business decision does not depend on an HTTP controller.

**[07-timetrack-003] Why do the write methods in `TimeEntryService` own `@Transactional`, while reads such as `findByFilter` use `readOnly = true`?** ⭐⭐

I chose the service operation as the transaction boundary because a workflow change and its response mapping belong to one unit of work. I marked reads such as `findByFilter` and `ProjectService.getAll` read-only, while writes can update entities and persist their changes.

**[07-timetrack-004] Why do the create controllers return `201 Created` with a `Location` header, while the delete controllers return `204 No Content`?** ⭐⭐

I chose `201` for creates because `ProjectController`, `UserController` and `TimeEntryController` construct the new resource URI from the created response ID. Deletes return `204` after the service completes because those endpoints have no response body to send.

**[07-timetrack-005] How does `TimeEntryService.findByFilter` stop an employee from querying another user's entries while still allowing a manager to filter across users?** ⭐⭐⭐

I decided that the service must check the caller's role and replace the supplied `userId` with the authenticated user's ID for non-managers. Managers keep the requested filter, and the service passes the resulting criteria to `TimeEntrySpecifications` before mapping the page to responses.

**[07-timetrack-006] Why do services obtain the caller through `AuthenticatedUserProvider` instead of accepting a user ID from each controller request?** ⭐⭐

I chose `AuthenticatedUserProvider` to read the authenticated email from Spring Security's `SecurityContext` and load the `User` from `UserRepository`. Services such as `TimeEntryService` therefore derive identity from the established authentication rather than trusting a caller-supplied identity parameter.

**[07-timetrack-007] Why do the services return response DTOs instead of exposing JPA entities from the controllers?** ⭐⭐⭐

I chose explicit response types such as `TimeEntryResponse` in `TimeEntryService.toResponse` and `ProjectResponse` in `ProjectService.toResponse`. That lets the API choose its fields and avoids making persistence entities the JSON contract.

**[07-timetrack-008] In `TimeEntryController`, why is a requested sort key translated through `SORT_KEYS` and given an `id` tie-breaker before the service receives the `Pageable`?** ⭐

I chose named sort keys such as `employee` and `project`, then map them to known entity paths; an unknown key raises `BusinessRuleViolationException` instead of becoming an arbitrary property path. I add descending `id` when the request has no ID sort so equal sort values have deterministic page order.

**[07-timetrack-009] Why are entry workflow changes separate service operations and controller routes for `submit`, `reopen`, `approve` and `reject`, instead of accepting an arbitrary status in a generic update?** ⭐⭐⭐

I chose explicit methods in `TimeEntryService`, where each action checks the current status before changing it; for example, `submit` accepts only `DRAFT` and `approve` only `SUBMITTED`. The controller also exposes distinct `PATCH` routes with role annotations, so callers cannot request an unrestricted status assignment through the ordinary edit endpoint.

**[07-timetrack-010] Why does `ProjectService.getAll` return active projects to employees but every project to managers?** ⭐⭐

I chose to put that role-dependent selection in the service: managers use `findAll`, while other authenticated users use `findByActiveTrue`. The controller stays focused on the HTTP endpoint and returns the service's `ProjectResponse` list.

**[07-timetrack-012] When does `TimeEntryService` map lazy user and project relationships into `TimeEntryResponse`, and why is that mapping kept there?** ⭐⭐

I chose to build the response in `toResponse`, reading the user and project IDs and names while the service operation's transaction is active. The same mapper is used after writes and for the filtered page, so the API returns a stable DTO without making controllers depend on JPA relationships.

**[07-timetrack-013] Why are `CreateProjectRequest` and `UpdateProjectRequest` separate DTOs, and what does the nullable `active` field let `ProjectService.update` represent?** ⭐⭐

I chose separate request types for creation and update, such as `CreateProjectRequest` and `UpdateProjectRequest`, because they represent different API intents. In this implementation `ProjectService.update` changes `active` only when the DTO field is non-null, so omission means “leave the current value alone.” The create request stays independent of that update-only field.

**[07-timetrack-014] In `TimeEntryService.delete`, why does the service pass the already-loaded entry to `delete` instead of calling `deleteById`?** ⭐

I chose to load the entry through `findOwnedEntry`, which applies the ownership check and produces the not-found response, then pass that same entity to `timeEntryRepository.delete`. Calling `deleteById` would look the row up again and could introduce a second, different missing-row behavior.

**[07-timetrack-015] Why do the backend controllers and services receive collaborators through constructors and keep them in `final` fields?** ⭐⭐

I chose constructor injection throughout the backend, for example `ProjectService` receives its repositories and `TimeEntryController` receives its service as constructor parameters. The required collaborators are assigned once to `final` fields, so a bean cannot be created with an unset dependency.

**[07-timetrack-016] Why do `ProjectService` and `UserService` use `saveAndFlush` and translate a database uniqueness failure into `DuplicateResourceException` after checking for duplicates first?** ⭐⭐

I kept the pre-check for a clear case-insensitive or normalized duplicate message, but the unique database constraint remains the atomic guarantee if two requests race. I chose `saveAndFlush` inside the `try` block so a `DataIntegrityViolationException` is raised while the service can translate it into the same domain exception.

**[07-timetrack-017] Why do the services report failures with application exceptions such as `ResourceNotFoundException` and `InvalidStateTransitionException` instead of throwing Spring persistence exceptions for business refusals?** ⭐⭐

I chose project-owned exceptions for service decisions: `findOwnedEntry` raises `ResourceNotFoundException`, and an invalid entry transition raises `InvalidStateTransitionException`. A database failure is translated at the persistence boundary where needed, rather than mislabeling a business refusal as a Spring data-access failure.

**[07-timetrack-018] Why does `ReportController` accept a `YearMonth` while `ReportService` converts it into inclusive `LocalDate` bounds?** ⭐

I chose to keep the HTTP parameter readable as a month and do the query-range calculation in `ReportService.MonthRange.of`. The service passes the month's first and last dates to the repository, keeping date-range logic out of the controller.
### Frontend

**[07-timetrack-059] Why does the authenticated shell own the child routes, and why are the pages loaded with `loadComponent`?** ⭐⭐⭐

I chose the shell as the parent route so its navigation and layout wrap the authenticated pages once, with the child `RouterOutlet` switching the page content. Each page uses `loadComponent`, so route-specific UI is loaded when that route is visited rather than being pulled into the initial application bundle.

**[07-timetrack-060] Why are app-wide infrastructure, page coordinators and reusable UI kept in separate `core`, `pages` and `shared` areas?** ⭐⭐

I chose `core` for app-wide services, state and route infrastructure, `pages` for screen-level coordinators, and `shared` for reusable UI and models. That keeps screen-specific behavior out of shared components while giving the shell and pages a common place for cross-screen infrastructure.

**[07-timetrack-061] Why does `Entries` own the entry list's server state while `EntryList` receives inputs and emits user actions?** ⭐⭐⭐

I chose `Entries` as the coordinator for loading, filtering, paging, dialogs and writes, while `EntryList` receives the current entries and display options through inputs and sends actions through outputs. The table can then be reused by another screen without owning an API call or duplicating the page's state transitions.

**[07-timetrack-062] Why does the pending-approval count live in `core/state/PendingApprovals` instead of in the HTTP service or shell?** ⭐⭐⭐

I chose a separate root-provided state service because both the shell badge and manager screens need the same live count, while `EntryService` should remain responsible for HTTP requests. The state service exposes a read-only signal and owns refresh and clear operations, so those consumers share one value without the shell becoming its owner.

**[07-timetrack-063] Why does the shell refresh the manager's pending count after navigation and clear it when the shell is destroyed?** ⭐⭐

I chose `NavigationEnd` as a refresh point so actions completed on one screen are reflected when the manager moves to another screen, and I skip that request for employees. Clearing on shell destruction removes the previous session's badge value when leaving the authenticated area.

**[07-timetrack-064] Why do page reload streams use `switchMap` when filters, sorting or writes trigger another fetch?** ⭐⭐

I chose a `Subject` as the reload trigger and `switchMap` to run the latest page request. If a new filter or reload arrives before the previous response, the earlier subscription is cancelled so an older result cannot overwrite the state for the current selection.

**[07-timetrack-065] Why do pages use `forkJoin` to load related data such as projects and entries before updating the view?** ⭐⭐

I chose `forkJoin` for these finite HTTP requests because the page needs the related results together before it can present a complete view. For example, `Entries` waits for its project options and entry page, then updates both signals from the combined result instead of briefly showing mismatched data.

**[07-timetrack-066] Why do entry dialogs own their form and write operation while `Entries` decides what to reload after the dialog closes?** ⭐⭐

I chose the dialog to own the entry form, validation and create or update request, and to return a result such as `saved` or `submitted`. The page remains responsible for its list and reloads it after the dialog closes, keeping the form flow separate from the coordinator's filters and paging state.

**[07-timetrack-067] Why is unsaved-change confirmation shared through `ConfirmDialog` and `confirmDiscard` instead of being repeated in each form dialog?** ⭐⭐

I chose a data-driven `ConfirmDialog` and a `confirmDiscard` helper so entry, reject and password dialogs can use the same discard flow. The helper also restores untouched controls if the confirmation interaction marks them touched, preserving the form's prior validation state when the user keeps editing.

**[07-timetrack-068] Why do `Entries` and `Approvals` clamp the page index after an action leaves the current page empty?** ⭐

I chose to use the returned total to request the last page that can still contain rows after a delete or review action. The index only moves backward and stops at page zero, which prevents a stale total and page slice from causing an endless retry of the same empty page.

**[07-timetrack-069] Why does the app use `AppTitleStrategy` to combine each route's title with `TimeTrack`?** ⭐

I chose Angular's `TitleStrategy` so the route title is the source for the current page name and one shared strategy adds the application name. That keeps browser-tab titles consistent without repeating title-update code in each page component.

**[07-timetrack-070] Why does `appConfig` set a default dialog width centrally while individual dialogs can still choose their own width?** ⭐

I chose `MAT_DIALOG_DEFAULT_OPTIONS` to give dialogs a consistent `30rem` default, while a dialog that needs a different size can override it in its own open configuration. This keeps ordinary dialogs consistent without making the global setting a hard constraint.

**[07-timetrack-071] Why do the `core/services` classes stop at HTTP calls and model mapping, leaving page state and UI effects to their consumers?** ⭐⭐

I chose to keep `EntryService` focused on typed requests and responses; `Entries` owns its filters, loading state, dialogs and notifications. That lets another page call the same service without inheriting navigation or presentation behavior, while `AuthService` is the planned exception because the session outlives a route.

**[07-timetrack-072] Why does each page fetch a shared endpoint for itself instead of using a cross-page cache?** ⭐⭐

I chose independent reads because pages often ask for different slices of the same resource: the employee dashboard requests counts and recent entries, while `Entries` requests the current filters and page. Each page can then refetch its own view after a write without trying to keep a shared cache synchronized across routes.

**[07-timetrack-073] Why are application-wide providers and defaults registered in `appConfig` rather than configured by each page?** ⭐

I chose `appConfig` as the single place for router setup, `HttpClient` with the auth interceptor, the title strategy and shared Material defaults. This gives every route the same infrastructure, while a dialog can still override the shared width when its content needs it.

### Cross-tier
**[07-timetrack-105] How does a `ProjectService.createProject` request cross the JSON boundary from Angular’s `CreateProjectRequest` to Spring’s DTO, and what does `http.post<Project>(...)` actually guarantee about the response?** ⭐⭐⭐

I chose to keep the matching request and response shapes in Angular interfaces and Spring DTOs: `ProjectService.createProject` sends `CreateProjectRequest` to `POST /api/projects`, and `ProjectController.create` binds the JSON body, applies `@Valid`, then delegates to `ProjectService` and returns `ProjectResponse`. The two applications compile separately, so their declarations do not prove that the JSON shapes stay aligned; I decided to keep the backend DTO as the runtime request check and treat `http.post<Project>(...)` only as a TypeScript compile-time assertion. In this path, `ProjectResponse.createdAt` is serialized for the Angular `Project.createdAt: string`, while `description` remains nullable on both sides.

## Security & Auth

### Backend

**[07-timetrack-019] Why did you make the API stateless with bearer JWTs and disable CSRF instead of using server-side sessions?** ⭐⭐⭐

I chose stateless authentication because the Angular client sends the JWT explicitly in the `Authorization` header and the API keeps no server-side session. With no cookie-based credential attached automatically by the browser, the plan treats CSRF protection as unnecessary; the trade-off is that logout cannot revoke a token already issued, so it remains valid until its 60-minute expiry.

**[07-timetrack-020] Why does a JWT identify its user with the database ID rather than the editable email address?** ⭐⭐⭐

I chose the stable user ID as the `sub` claim because managers can change an email while an access token is still valid. `JwtFilter` parses that claim as a `Long` and reloads the account by ID, so changing an email does not transfer an existing token to a different account; tokens with the former email-shaped subject are rejected.

**[07-timetrack-021] What happens between `JwtFilter` reading a bearer token and Spring Security authorizing a protected request?** ⭐⭐⭐

I chose to validate the signed token, extract its ID, load the current `UserDetails` from the database and put an authenticated token with that user's authorities in `SecurityContextHolder`. A missing or unusable bearer token does not establish authentication, so the filter chain's authenticated-request rule rejects a protected request through the authentication entry point with `401`.

**[07-timetrack-022] Why does `JwtFilter` reload the user and check account status on every request instead of trusting the claims until expiry?** ⭐⭐⭐

I chose to resolve the account from the token's ID on each request, then run `AccountStatusUserDetailsChecker` before setting the security context. Deactivating a user therefore revokes access on the next request even while their signed token is still within its 60-minute lifetime; `UserDetailsServiceImpl` also reads the current role from that row, so a role change takes effect on the next request instead of trusting a stale role claim in the token.

**[07-timetrack-023] Why is login the only URL permitted by the filter-chain rules while endpoint roles are enforced with method security?** ⭐⭐⭐

I chose a narrow perimeter in `SecurityConfig`: only `POST /api/auth/login` is public and every other request must already be authenticated. `@EnableMethodSecurity` lets each protected endpoint method declare its own `@PreAuthorize` rule, including `isAuthenticated()` where any signed-in user may act, so widening a URL matcher cannot silently open a method whose own authorization rule was not changed.

**[07-timetrack-024] Why does the login path normalize the email before authentication, and how does `UserDetailsServiceImpl` turn the loaded account into Spring Security authorities?** ⭐⭐

I chose to normalize the submitted email before passing it to `AuthenticationManager`, and the user-details service applies the same normalization when looking up a login name. It builds `UserDetails` with the stored password hash, the account's role as a `ROLE_` authority and the account's active state, giving authentication one consistent identity and role representation.

**[07-timetrack-025] Why does `SecurityConfig` expose a `BCryptPasswordEncoder` as the `PasswordEncoder` bean?** ⭐⭐⭐

I chose Spring Security's BCrypt encoder as the application password-encoding strategy, so authentication compares a submitted password against a one-way stored hash rather than needing plaintext. The same encoder can be injected wherever account passwords are created or checked.

**[07-timetrack-026] Why does login throttling count failures by both normalized email and the servlet peer address, and why is the cooldown temporary?** ⭐⭐

I chose separate counters for the normalized email and `HttpServletRequest.getRemoteAddr()`, checked before password authentication; five failures block either key until one minute after its last recorded failure, and a successful login clears both. The two keys cover password spraying across accounts and repeated guesses against one account, while a temporary cooldown avoids a permanent lockout an attacker could trigger to deny the real user access. `LoginAttemptService` keeps the counters in a concurrent in-process map, an accepted single-instance deployment trade-off.

**[07-timetrack-027] Why does the security filter chain return a project-shaped JSON `401` through `JwtAuthenticationEntryPoint`?** ⭐⭐

I chose a dedicated entry point that writes the common `ErrorResponse` shape with status `401` and the message `Authentication required`. That keeps an unauthenticated API refusal in the same JSON contract the Angular client handles, rather than returning a container-generated response.

**[07-timetrack-028] Why does `SecurityConfig` define explicit CORS origins, methods and headers, with credentials disabled?** ⭐

I chose to inject `app.cors.allowed-origins` as a `List<String>` and allow only the API methods and `Authorization` / `Content-Type` headers the client needs, with credentials disabled because the bearer token travels in an explicit header rather than a browser-managed cookie. `OPTIONS` is included for browser preflight requests, which the CORS filter answers before the authenticated-request rule.

**[07-timetrack-029] Why is the JWT signing secret supplied through `JWT_SECRET` instead of stored in the application configuration?** ⭐⭐⭐

I chose to resolve `app.jwt.secret` from the `JWT_SECRET` environment variable, keeping the signing key outside the committed application properties. `JwtUtil` Base64-decodes that value to build the HMAC signing key used both to issue and verify tokens, so deployment must provide a correctly encoded secret.

**[07-timetrack-030] When does `JwtUtil` detect a malformed or undersized `JWT_SECRET`, and why does that timing matter for deployment?** ⭐

I chose to keep the configured secret as a string in the constructor and build the HMAC key lazily in `getSigningKey()`, which is first called when a token is issued or parsed. A present but malformed or undersized value therefore passes bean construction and fails on the first login or bearer-token request; the backend backlog tracks moving that validation to startup so a bad deployment fails before serving traffic.

### Frontend

**[07-timetrack-074] Why does `AuthService` treat the login response and the saved browser session as `unknown` until `isAuthResponse` validates them?** ⭐⭐

I chose `http.post<unknown>` because an HTTP generic only asserts a TypeScript shape; it does not validate the JSON the server returned. The same runtime guard checks the response before saving it and checks parsed `localStorage` data on startup, removing an unreadable session instead of letting malformed data appear authenticated.

**[07-timetrack-075] Why does `AuthService` persist the session in `localStorage`, and what security trade-off does that create?** ⭐⭐⭐

I chose `localStorage` so a reload can restore the session without asking the user to log in again. Script running in the page can read the stored token, so this choice does not protect against XSS; the project bounds an issued token to 60 minutes and has no refresh-token flow.

**[07-timetrack-076] Why are `authGuard` and `noAuthGuard` separate, and what destination does each return for the wrong session state?** ⭐⭐

I chose `authGuard` for protected navigation: it returns a `/login` `UrlTree` when the validated session is absent. `noAuthGuard` is the inverse for `/login`, returning a `/dashboard` `UrlTree` when a session already exists, so both guards let the router handle the redirect rather than starting navigation as a side effect.

**[07-timetrack-077] Why does `managerGuard` check the role separately from the parent `authGuard`, and where is the actual API security boundary?** ⭐⭐

I chose `managerGuard` to keep an employee out of manager-only screens and send them back to `/dashboard`, while the parent `authGuard` handles a missing session. The checks have separate jobs, and neither protects the API: a caller can bypass the Angular UI, so backend endpoint authorization must refuse manager-only requests.

**[07-timetrack-078] Why does `authInterceptor` clone a request with the current session's bearer token, but pass it through unchanged when there is no token?** ⭐⭐⭐

I chose to add the `Authorization: Bearer` header in one interceptor rather than repeat header logic at each call site. It clones the request only when a session token exists and otherwise forwards the original request unchanged, which lets the public login request run without a credential.

**[07-timetrack-079] Why does the interceptor expire the session only when a `401` comes back for a request that carried a token?** ⭐⭐⭐

I chose to capture the token before sending the request and gate the `401` handling on that value: a token-bearing response clears the session and navigates to `/login`. A login `401` has no token, so it remains a bad-credentials response for the login flow instead of being mistaken for an expired session.

**[07-timetrack-080] Why does `AuthService` distinguish an explicit logout from an expired or unreadable session with a one-shot expiry flag?** ⭐⭐

I chose `logout()` to clear browser storage, session state and any previous expiry notice, while `expireSession()` clears the same state and then records that the session ended unexpectedly. `consumeSessionExpired()` reads and resets that flag so the login page can show its expiry notice once; startup also sets it when the saved session cannot be parsed or validated.

**[07-timetrack-081] Why does `/team` use `oneTimeSecretGuard` as a `CanDeactivate` guard, and why does it allow navigation when the session has ended?** ⭐⭐

I chose a component contract, `HoldsOneTimeSecret`, so the guard can refuse to leave while a generated password is in a dialog or its create/reset request is in flight, protecting the only response that carries that secret. It allows navigation after `AuthService.session()` becomes null so an expired-session redirect is never trapped by the secret-preservation rule.

**[07-timetrack-083] How does `roleMatch` choose the dashboard component for `/dashboard` based on the signed-in user's role?** ⭐⭐

I chose `CanMatchFn` guards on two routes with the same path so Angular loads the employee or manager dashboard without making role names part of the URL. When one route does not match `AuthService`'s role, the router tries the other; manager-only screens use `managerGuard` separately.

### Cross-tier

**[07-timetrack-106] From `POST /api/auth/login` to a later API request, why does the browser session carry a role while the JWT carries only the user ID, and how does token expiry end the session?** ⭐⭐⭐

I chose to return the token, ID, name and role in `AuthResponse`: Angular validates it, stores it in `localStorage`, uses the role for the shell and route guards, and the interceptor sends the token as a bearer header; `JwtUtil` signs the database ID as `sub` with a 60-minute expiry. The saved role guides the UI but does not grant API authority. On each bearer request, `JwtFilter` reloads the account, checks its current active status and builds Spring authorities from its current database role, so changing only the saved role cannot grant manager API access and account changes take effect on the next request. When the token expires, the API returns `401` and the interceptor clears the saved session and redirects to `/login`.

## Business Rules

### Backend

**[07-timetrack-031] Why does an employee get the same `404` for an entry they do not own as for an ID that does not exist?** ⭐⭐⭐

I chose to make `TimeEntryService.findOwnedEntry` load by ID and then filter by the authenticated user's ID before it can return an entry. Both a missing row and another employee's row therefore raise the same `ResourceNotFoundException`, so the status and message do not reveal which IDs exist.

**[07-timetrack-032] Why does `TimeEntryService.resolveProject` hide an inactive project on entry creation and most edits, but return `400` when an employee keeps the same project on their own entry?** ⭐⭐⭐

I chose to return the same `404` as an unknown ID when the caller is not already entitled to know the archived project exists. On an update, the service compares the requested project ID with the existing entry's project ID; that one known project instead gets `400` with “Project is not active,” which explains why the edit cannot proceed without exposing other archived IDs.

**[07-timetrack-033] Why does `UserService.update` refuse to promote someone who still has `DRAFT` or `REJECTED` entries, while allowing promotion with `SUBMITTED` entries?** ⭐⭐

I chose to block promotion only when `existsByUserIdAndStatusIn` finds `DRAFT` or `REJECTED` work, because the employee-only update, delete and reopen paths stop being available after promotion. A `SUBMITTED` entry remains reviewable by a different manager, so it does not become unreachable when the role changes.

**[07-timetrack-034] Why does `UserService` refuse a manager's own demotion, deactivation or deletion?** ⭐⭐⭐

I chose to compare the target account with `AuthenticatedUserProvider.currentUser()` before those changes and reject a self-lockout with `InvalidStateTransitionException`. Since the caller must already be an active manager, preventing that caller from removing their own manager access guarantees at least one active manager remains without a separate count check.

**[07-timetrack-035] Why does `TimeEntryService.reopen` clear the rejection note when it returns a rejected entry to `DRAFT`?** ⭐⭐

I chose to clear `rejectionNote` at the same time as changing `REJECTED` to `DRAFT`. The old manager's explanation belongs to the rejected submission; leaving it on a corrected draft or a later resubmission would present stale feedback as if it described the new review.

**[07-timetrack-036] How do the request constraints and `TimeEntryService.validateEntryData` divide responsibility for valid time entries?** ⭐⭐

I chose `@NotNull`, `@DecimalMin("0.5")`, `@DecimalMax("24")` and `@Digits` on the request fields to reject missing or out-of-range values at the API boundary, while the service rejects dates after `LocalDate.now()` and repeats the hours-range check in `validateEntryData`. The date rule depends on the current day, so it belongs in service logic; request constraints also require a project ID and a nonblank description of at most 255 characters.

**[07-timetrack-037] Why does `UserService.changePassword` verify the current password before checking that the new password differs from it?** ⭐⭐

I chose to verify the current password first, then compare the proposed new password against the stored hash and raise an `InvalidPasswordException` tied to the specific field. That prevents a caller who cannot prove the current credential from using the unchanged-password response to test guesses, while the two field names let the API report the failure against the relevant input.

**[07-timetrack-038] Why does the backend generate account and reset passwords, and why can a manager reset another account but not their own?** ⭐⭐⭐

I chose `SecureRandom` to generate a fresh 12-character password and store only its encoded value; the plaintext is returned only in the create or reset response. A manager reset is the recovery path for another member, while `UserService.resetPassword` refuses the manager's own ID because that account can use the current-password-verified change flow instead.

**[07-timetrack-039] How does the rejection request encode the rule that every rejected entry needs a usable explanation?** ⭐⭐

I chose `@NotBlank` and `@Size(max = 255)` on `RejectRequest.rejectionNote`, so whitespace-only explanations and notes that exceed the database field's limit fail request validation. `TimeEntryService.reject` stores the accepted note with the `REJECTED` transition, then `reopen` clears it before the corrected draft can be resubmitted.

**[07-timetrack-040] Why does `TimeEntryService` allow an entry to be edited or deleted only while it is `DRAFT`?** ⭐⭐

I chose to check the current status inside both `TimeEntryService.update` and `delete`, requiring `DRAFT` before changing fields or removing the row. Once an entry is submitted, the workflow preserves it for review and its later decision, so an edit or deletion in another status raises `InvalidStateTransitionException` instead of bypassing that history.

**[07-timetrack-041] Why must an entry be `SUBMITTED` before a manager can approve or reject it, and why are managers blocked from reviewing their own entries?** ⭐⭐⭐

I chose to enforce both rules in `TimeEntryService.approve` and `reject`: each refuses any status other than `SUBMITTED`, and each compares the entry owner with the authenticated manager before changing it. This keeps review limited to the review queue and prevents a manager from deciding the outcome of their own hours.

**[07-timetrack-042] Why does `TimeEntryService.submit` recheck that the draft's project is still active?** ⭐⭐

I chose to check project activity at submission as well as when an entry is created or edited, because a project can be archived while an employee's draft remains open. If it is inactive, the service refuses the transition with `BusinessRuleViolationException`, so an entry cannot enter the manager's review queue under a project that no longer accepts work.

**[07-timetrack-043] Why do all report totals count only `APPROVED` entries while `pendingHours` stays separate?** ⭐⭐

I chose to make `APPROVED` the common basis for `getSummary`, `getHoursByProject` and `getHoursByUser`, including `totalEntries`, so the summary and its breakdowns describe the same accepted work. `pendingHours` separately counts `SUBMITTED` work as a manager workload signal; `DRAFT` and `REJECTED` entries belong to neither measure.

**[07-timetrack-044] Why does `ReportService.getSummary` scope employee totals to the authenticated user while managers receive the whole team's summary?** ⭐⭐

I chose to set `userId` from `AuthenticatedUserProvider.currentUser()` whenever the caller is not a manager, instead of trusting a user ID from the request. Managers leave that filter null, while the controller reserves the project and user breakdown endpoints for managers, so each report exposes only the aggregate its caller is allowed to see.

**[07-timetrack-045] Why does `ChangePasswordRequest` require a new password of 8–72 characters and cap the current password at 72?** ⭐⭐

I chose an eight-character minimum for a new password and a 72-character maximum for both inputs, following the project's intended BCrypt input cap before `UserService.changePassword` verifies or encodes either value. `@Size` counts characters, while BCrypt's effective boundary is measured in encoded bytes, so the current check is not byte-exact for non-ASCII passwords; that is a limitation to understand rather than claim this validator eliminates.

### Frontend

**[07-timetrack-084] How does the Entries screen limit actions by role and workflow status, and what happens when a draft's project is inactive?** ⭐⭐⭐

I chose one `/entries` page that shows employee actions only for employees and adds the employee column for managers; the API supplies each role's allowed list. `EntryList` offers edit, delete and submit for `DRAFT`, offers re-open for `REJECTED`, and withholds submit when the project is inactive; managers review submissions on the separate Approvals screen.

**[07-timetrack-085] Why can a manager approve or reject a submitted entry only when they are not its owner?** ⭐⭐⭐

I chose `canReview` to require both `SUBMITTED` status and an owner ID different from the signed-in manager; an own submitted entry gets an “Awaiting another manager” message instead of action buttons. The UI makes that segregation rule visible, while `TimeEntryService` still enforces it at the API boundary.

**[07-timetrack-086] Which time-entry rules does `EntryDialog` check before sending a request, and how are API validation failures shown?** ⭐⭐

I chose client validators and input constraints for a required project and date, a date no later than today, hours from 0.5 to 24, and a nonblank description of at most 255 characters. `placeFieldErrors` puts recognized server errors under their controls, while a general API error appears in the form alert; the server remains authoritative for rules that depend on current data.

**[07-timetrack-087] Why does an edit dialog keep an existing inactive project visible but refuse it as the selected value?** ⭐⭐

I chose to append the entry's current project as an explicitly labelled inactive option so the edit form can represent the saved entry without silently replacing its project. The `activeProject` validator marks that value invalid, and the employee must choose an active project before saving or submitting the draft.

**[07-timetrack-088] How does `ProjectDialog` distinguish a required project name from an optional description?** ⭐⭐

I chose a nonblank name capped at 255 characters and an optional description with the same maximum. Before sending either create or update, the dialog trims both values and converts an empty description to `null`, matching the API's project-field rules.

**[07-timetrack-089] How does `UserDialog` validate account fields, and which values does it normalize before saving?** ⭐⭐

I chose required, nonblank names and valid required email addresses, each capped at 255 characters, plus a required role. The dialog trims the name and email before calling `UserService`, while server field errors are shown on the matching controls.

**[07-timetrack-090] Why must the rejection dialog validate and trim the manager's reason before it can reject an entry?** ⭐⭐

I chose a required, nonblank reason capped at 255 characters and trim it before calling `rejectEntry`. That prevents whitespace-only or overlong notes from being submitted, and leaves a useful explanation attached to the rejected entry for its owner.

**[07-timetrack-091] Which self-management actions does the Team screen block, and what can the manager still change on their own account?** ⭐⭐⭐

I chose to disable role editing in `UserDialog` and password reset or deactivation in the Team row for the signed-in user, because those actions could remove the caller's own manager access or bypass the self-service password-change flow. Name and email edits remain available, and the manager changes their own password through the account menu's self-service dialog.

**[07-timetrack-092] How does the change-password form stop an incomplete or mismatched password change before it reaches the API?** ⭐⭐

I chose required current and confirmation fields, a nonblank new password between 8 and 72 characters, and a group validator that requires the new and confirmation values to match. The dialog maps server errors for the current and new password to those inputs, since checks such as verifying the current credential and rejecting an unchanged password belong to the server.

**[07-timetrack-093] Why does the Team form allow a manager to attempt another user's promotion without checking that user's open entries first?** ⭐⭐

I chose not to load each user's entries into the Team page just to preflight a role update; the backend owns the rule that blocks promotion while `DRAFT` or `REJECTED` entries remain. If that state conflict is returned, `UserDialog` displays the API message in its form-level alert instead of presenting a client-side check that could become stale.

**[07-timetrack-094] How does the Projects and Team UI make destructive status changes clear while preserving the records that already exist?** ⭐⭐

I chose a confirmation before deactivating a project or member, with copy that explains logged hours or entries remain while new work or logins stop. Reactivation is direct, while deleting an entry uses a separate confirmation that explicitly says its draft will be permanently deleted.

**[07-timetrack-095] How does the frontend prevent a second mutation while a save or row action is still in flight?** ⭐

I chose to mark each dialog as saving and disable its form and actions until the request succeeds or fails. For table actions, `busyIds` disables only the row currently being changed and the handlers also return early for that ID, preventing a repeat click from sending a duplicate mutation.

**[07-timetrack-096] Why does the Entries project filter offer only active projects to employees, even when their entries refer to an inactive one?** ⭐⭐

I chose to use the projects endpoint's employee-visible list in the filter, so an archived project disappears there while its existing entries remain reachable by month and status. The entries list is paged, so the browser cannot derive every inactive project ID from the employee's own entries; adding those projects would need a separate caller-scoped query.

### Cross-tier

**[07-timetrack-107] Why does the shared Entries screen hide role-inappropriate actions while the API still enforces each operation's role?** ⭐⭐

I chose to render employee actions only for employees and manager review controls only for managers, using the signed-in role in the page. That is a usability rule, not authorization: `TimeEntryController` separately protects employee writes and manager review endpoints with `@PreAuthorize`, so a direct request from the wrong role still receives `403`.

## Technical Decisions

### Backend

**[07-timetrack-046] Why does `PUT /api/entries/{id}` require the complete editable entry in `UpdateTimeEntryRequest` instead of accepting a partial patch?** ⭐⭐

I chose `PUT` because an edit replaces the entry's editable fields: `projectId`, `date`, `hours` and `description` are all required, and the service reruns the same data rules as creation. The workflow uses separate `PATCH` routes for status transitions, where only the status changes.

**[07-timetrack-047] Why does `TimeEntryResponse` return both each related user's and project's ID and name?** ⭐⭐

I chose to include `userId` and `projectId` beside `userName` and `projectName` because the client needs the project ID to submit an edit, while the names make the entry readable. Entries have no `GET /{id}` endpoint, so the response is the representation the client holds and should not force it to recover an identifier by matching a label.

**[07-timetrack-048] Why do credential fields in request and response DTOs use Lombok's `@ToString.Exclude`?** ⭐⭐

I chose to exclude fields such as `LoginRequest.password`, `AuthResponse.token` and `PasswordResetResponse.generatedPassword` from generated `toString()` output. Lombok's `@Data` otherwise includes every field, so an object written to a log or exception could expose a plaintext password or bearer token even though JSON serialization is unaffected.

**[07-timetrack-049] Why do the report queries return interface projections such as `ProjectHoursReportResponse` instead of mapping rows into entity objects?** ⭐

I chose interface projections for the grouped report rows because Spring Data maps each selected alias directly to a matching getter, such as `projectName` to `getProjectName()`. The report returns only the aggregate fields it needs without loading entities or maintaining a separate manual row mapper.

**[07-timetrack-050] Why is password reset a `POST` that returns `200 OK` with a `PasswordResetResponse`, rather than an idempotent update or an empty response?** ⭐⭐

I chose `POST /api/users/{id}/password-reset` because every call generates a different password, so repeating the request has another effect rather than repeating the same update. The `200` response carries the only plaintext copy for the manager to pass on; the database stores its hash.

**[07-timetrack-051] How do the datasource placeholders in `application.properties` support local and hosted databases without committing credentials?** ⭐⭐

I chose environment-variable placeholders for `DB_URL`, `DB_USERNAME` and `DB_PASSWORD`: the URL and username have local defaults, while the password must be supplied. The same application configuration can therefore use a local PostgreSQL instance or an externally configured database, without embedding the password in the repository.

**[07-timetrack-052] Why does `application.properties` use Hibernate `ddl-auto=update` instead of versioned Flyway migrations?** ⭐⭐

I chose `update` while one developer is still evolving the schema and the deployed database holds demo data that does not need to survive schema changes. I accept losing a reviewable migration history and having to apply unsupported changes such as drops or renames manually; versioned migrations become necessary when teammates or durable data enter the project.

**[07-timetrack-053] Why does `application.properties` disable Open Session in View instead of letting JSON serialization load lazy relationships?** ⭐⭐

I chose `spring.jpa.open-in-view=false` so a response cannot issue persistence queries after its service operation has returned. `TimeEntryService.toResponse` maps the user and project fields while the service transaction is active, making database access explicit instead of hiding it during JSON serialization.

**[07-timetrack-054] Why does `GlobalExceptionHandler` use `409 Conflict` for duplicate resources and invalid state transitions, but `400 Bad Request` for invalid request data?** ⭐⭐

I chose `409` when a validly formed operation conflicts with existing data or the resource's current state, as in `DuplicateResourceException` and `InvalidStateTransitionException`. Validation failures and `BusinessRuleViolationException` map to `400`, which distinguishes malformed or unacceptable input from a request that conflicts with current state.

**[07-timetrack-055] Why does account creation return a `CreateUserResponse` with a generated password while ordinary `UserResponse` never contains credential fields?** ⭐⭐

I chose a separate `CreateUserResponse` so `UserService.create` can return the generated plaintext once to the manager who creates the account, while normal list and update responses use `UserResponse` without password material. The persisted password remains hashed, and `@ToString.Exclude` also keeps the one-time value out of generated object logs.

### Frontend

**[07-timetrack-097] Why was NgRx unnecessary for TimeTrack's page state even though the shell shares a pending-approval count?** ⭐⭐

I chose signals for route-specific state because each page reads and updates its own endpoint data, so a global store with actions, reducers and effects would add machinery for state that does not cross routes. The authenticated session and pending-approval count are the exceptions: `AuthService` and `PendingApprovals` each hold a root signal because multiple parts of the app need them.

**[07-timetrack-098] Why does every component use `ChangeDetectionStrategy.OnPush`, and how does the app update those views?** ⭐⭐

I chose `OnPush` as the component-wide change-detection policy. Components read signals for local and derived state, while reusable children receive values through `input()` and report actions through `output()`, giving Angular explicit state changes to render without relying on default checking for every component.

**[07-timetrack-099] Why does `appConfig` set `canceledNavigationResolution: 'computed'` for browser-history navigation?** ⭐

I chose the computed strategy because `oneTimeSecretGuard` can cancel a browser Back action while the generated password is still at risk. Angular restores the history position to the route that remains on screen, instead of leaving the URL and displayed page out of sync.

### Cross-tier

**[07-timetrack-108] How does TimeTrack keep one error contract across Spring's responses and Angular's forms without tying field messages to a particular status code?** ⭐⭐

I chose a shared `ErrorResponse` envelope in `GlobalExceptionHandler`, with `fieldErrors` added only when an error belongs to one or more inputs; each field maps to an array so multiple validation failures survive. Angular's `ApiError` helpers accept an `HttpErrorResponse` only when its body has a numeric `status` and string `message`, then place the first message only on controls the form explicitly allows, regardless of whether the response is `400` or `409`.

**[07-timetrack-109] Why do user and project deactivation preserve their database rows instead of hard-deleting them, and what does that let the rest of TimeTrack do?** ⭐⭐

I chose to set `active` to `false` in `UserService.delete` and `ProjectService.delete`, because time entries keep non-null foreign keys to both records and their history must remain available for audit. The Angular confirmation explains that prior entries stay while new work or logins stop, so the UI and API preserve the same historical record instead of cascading a destructive delete.

**[07-timetrack-110] Why did you choose Docker Compose for the local stack instead of requiring each reviewer to install PostgreSQL, a JDK and Maven?** ⭐⭐⭐

I chose a Compose stack with PostgreSQL and an API image built from `backend/timetrack`, so Docker is the reviewer's only local prerequisite and the image is the one the deployment step runs. A named `db-data` volume preserves the database across container restarts, while the read-only init script creates the least-privileged application role and its database on the volume's first start; daily development can still use IntelliJ against the local database for a faster edit-run loop.

**[07-timetrack-111] Why does `GET /api/entries` use `Pageable` while the other collection endpoints return all their rows, and how does Angular follow that contract?** ⭐⭐

I chose pagination for entries because that is the only collection that grows without a bound; filtering by month narrows the results but does not guarantee a fixed maximum. `TimeEntryController` returns a Spring `Page<TimeEntryResponse>` with a default size of 20, and Angular's `EntryService` sends page, size, filters and sorting while its `Page<TimeEntry>` model reads the response metadata.

**[07-timetrack-112] Why did you deploy a public URL before Steps 8 and 9 had finished, despite the free-tier cold starts and writable demo database?** ⭐⭐⭐

I chose to make the app directly reachable while the job search was under way, because a recruiter can try it before deciding to clone and run it. I accepted the slow wake-up and shared demo data as costs, but did not treat publication as completion: Steps 8 and 9 remain required before TimeTrack is finished.

**[07-timetrack-113] Why does the API wait for PostgreSQL's health check in Compose instead of starting as soon as the database container exists?** ⭐

I chose `depends_on: condition: service_healthy` and a `pg_isready` check because a running PostgreSQL container may still be initializing its database and role. Compose starts the API only once the database accepts connections, avoiding a startup race on a fresh or restarted local stack.

**[07-timetrack-114] Why does the Docker build run `mvnw package -DskipTests` instead of using the image build as the backend test run?** ⭐⭐

I chose to build the runnable JAR in the Dockerfile's JDK stage and keep verification in Step 8, where the backend tests are planned and run as their own check. That separation lets the deployment image exist while the project is still unfinished, but a successful image build alone does not prove the backend tests pass.

## Testing

### Backend

**[07-timetrack-056] Why does `ValidationMessagesTest` build a Bean Validation `Validator` directly instead of starting the Spring application context?** ⭐⭐

I chose to exercise the request constraints and their resolved messages with `Validation.buildDefaultValidatorFactory()`, so this focused test does not need Spring Boot, PostgreSQL or deployment secrets. The test still catches a missing or misconfigured validation message bundle by checking the messages produced for an invalid `CreateTimeEntryRequest`.

**[07-timetrack-057] Why does the `Size` message in `ValidationMessages.properties` distinguish a maximum-only limit from a range?** ⭐⭐

I chose conditional message interpolation so a constraint with `min = 0` says “Must be at most 255 characters” instead of presenting an irrelevant lower bound. `ValidationMessagesTest.sizeWithOnlyAMaximumNamesTheMaximum` asserts that exact wording for a 256-character description, while the other test checks the field-specific `NotNull`, `NotBlank`, `DecimalMax` and `Digits` messages.

### Frontend

**[07-timetrack-100] Why do the date tests serialize a late local time and parse the result back as a local calendar day?** ⭐⭐

I chose to treat an entry date as a calendar day, not a UTC instant: `toIsoDate` reads the local year, month and day, and `fromIsoDate` rebuilds local midnight. The spec uses 23:30 and checks the same day after parsing because converting through UTC can shift a late local date to the previous day.

**[07-timetrack-101] Why does `recentMonths` start with the current month and test a list that crosses into the previous year?** ⭐

I chose to build each month from its first local day and subtract a month offset, then format the month key separately from its human-readable label. The test checks newest-first order across January and December, so the month selector does not stop or mislabel its history at a year boundary.

**[07-timetrack-102] Why does `apiErrorMessage` use a server message only for a recognized `HttpErrorResponse` body and otherwise return the caller's fallback?** ⭐⭐

I chose to narrow unknown errors with `isApiError` before reading `message`, while network failures and bodies outside the API error shape use the fallback supplied by the screen. The tests cover both a typed authentication message and an offline browser error, so the UI can show a useful failure without assuming every thrown value has the backend contract.

**[07-timetrack-103] Why does the `placeFieldErrors` spec pass an explicit field list and check that an unlisted server field is ignored?** ⭐⭐

I chose to let each form name the controls that can receive server errors, rather than trusting arbitrary keys from an API response. The spec checks that a listed `hours` error is attached, while an unlisted `userId` error changes no control and the helper reports that nothing was placed.

**[07-timetrack-104] What does the `roleMatch` spec protect when it checks both a mismatched role and a missing session?** ⭐⭐

I chose to make the `CanMatchFn` compare the requested role with `AuthService.session()?.role`, which returns false when the session is absent as well as when its role differs. The spec exercises an EMPLOYEE session against both role variants, then clears the signal and confirms no role route matches.
