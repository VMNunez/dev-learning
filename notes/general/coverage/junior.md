# Minimum Coverage — General

Framework-neutral concepts a junior or junior-mid developer must understand across Angular and Spring Boot work. Framework implementations stay in their owning topics.

## HTTP requests and resource semantics

- Client–server request/response model — trace how a client sends a request and receives a response without treating either framework as the protocol itself
- URL anatomy — distinguish scheme, host, port, path, query, and fragment so an incorrect endpoint can be diagnosed precisely
- URI vs URL — distinguish a resource identifier from the subset that also describes where and how to access it
- REST resource and representation model — model domain resources behind representations instead of treating endpoint paths as remote procedure names
- Collection vs item URI — use stable noun-based paths to distinguish a resource collection from one identified member
- HTTP methods — choose `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` from the intended resource operation rather than from habit
- Safe vs idempotent methods — safe methods do not request a state change, while repeating an idempotent request has the same intended effect as sending it once
- `PUT` vs `PATCH` — use complete replacement semantics for PUT and partial modification semantics for PATCH when the API contract supports them
- Path parameters vs query parameters vs request body — use the path for resource identity, the query for optional selection or representation controls, and the body for a submitted representation
- HTTP headers and body — keep request metadata in headers and the submitted representation in the body
- `Content-Type` vs `Accept` — declare the media type being sent separately from the response media types the client can process
- Stateless HTTP — understand that HTTP defines no conversational session while an application may carry state in each request or look it up through an identifier such as a session cookie
- HTTPS vs HTTP — recognise that HTTPS applies TLS protection to HTTP traffic in transit while HTTP alone provides no transport encryption
- Basic web request path — recognise DNS resolution, connection to a host and port, TLS negotiation for HTTPS, and the later HTTP exchange as distinct failure points

## HTTP responses, failures, and caching

- HTTP status-code families — use 1xx, 2xx, 3xx, 4xx, and 5xx as protocol-level categories before inspecting the application error body
- `200 OK`, `201 Created`, and `204 No Content` — select the success status from whether the operation returns a representation, creates a resource, or intentionally returns no body
- `400 Bad Request` vs `422 Unprocessable Content` — recognise 400 as a broad perceived client-request error and 422 as understood media type and syntax whose instructions cannot be processed, while following the API's documented convention
- `401 Unauthorized` vs `403 Forbidden` — distinguish missing or invalid authentication from an authenticated identity lacking permission
- `404 Not Found` vs `409 Conflict` — distinguish an absent resource from a request that conflicts with current resource state
- `500 Internal Server Error` vs `503 Service Unavailable` — distinguish an unexpected server failure from temporary inability to serve the request
- Redirect semantics — recognise that 3xx responses point the client elsewhere and that method-preserving redirects differ from redirects commonly followed as GET
- `301`/`302`/`303` vs `307`/`308` redirects — recognise when common clients may follow with GET and when the original method and body must be preserved
- HTTP caching basics — recognise freshness directives, validators such as ETags, and conditional requests without treating caching as an automatic performance fix
- Timeouts and retries — bound waiting and retry only when the operation and failure mode make repetition safe, adding idempotency controls when required
- Transport vs protocol vs application failure — separate inability to connect, an HTTP error status, and a successful HTTP response whose domain result is unsuccessful
- API-call debugging workflow — inspect URL, method, status, headers, and body before blaming client or server framework code
- Same-origin and CORS recognition — identify an origin from scheme, host, and port and distinguish a browser-enforced CORS or preflight failure from an HTTP response produced by application logic
- Collection query contract — define filtering, sorting, pagination inputs, stable ordering, and response metadata so clients can navigate a changing collection predictably

## JSON and API contracts

- JSON value model — recognise objects, arrays, strings, numbers, booleans, and `null`, with double-quoted object keys and no trailing commas
- JSON object vs array — distinguish a named property collection from an ordered value collection when reading or designing a payload
- Missing field vs explicit `null` — treat absence and an explicit null value as separate contract states unless the API defines them as equivalent
- JSON limitations — recognise that JSON has no native date, `undefined`, binary, or distinct integer type, so an API must define representations for them
- Serialization vs deserialization — distinguish converting an in-memory value to a transport representation from reconstructing a value from that representation
- Contract naming and type mismatches — diagnose failures caused by different property names, nesting, nullability, or expected value types across a boundary
- Date and time representation — agree an explicit interoperable string format and time-zone meaning instead of relying on environment-specific parsing
- OpenAPI recognition — read operations, parameters, schemas, responses, and examples in a machine-readable HTTP API contract
- OpenAPI specification vs interactive documentation — distinguish the contract document from tools such as Swagger UI that render and exercise it
- API client tools — use Postman or `curl` to inspect and reproduce an HTTP exchange without treating a successful manual request as complete automated verification

## Error handling and diagnostics

- Error propagation — let a failure travel to a boundary that can add context or choose a response instead of swallowing it or catching and rethrowing without value
- Local error recovery — substitute a fallback only when it is semantically honest; converting every failure into empty data fabricates success
- Error message vs diagnostic detail — give consumers a stable safe message while preserving technical context for diagnosis
- Exception vs log — understand that an exception changes control flow while a log records an event without handling it
- Structured logging — record searchable fields and context rather than relying on unstructured print statements
- Log levels — choose `DEBUG`, `INFO`, `WARN`, or `ERROR` from operational meaning rather than using one level for every event
- Reproducible debugging — establish reliable steps and the smallest failing input before changing code so the effect of a fix can be verified
- Boundary isolation — reduce a failure to the client, network, API, persistence, or external dependency before investigating implementation detail
- Stack trace and cause chain — read the failure type, message, frames, and nested causes from the first relevant application frame outward
- Breakpoints and variable inspection — pause execution at a suspected path and compare actual state and control flow with the expected behaviour
- Fix verification — rerun the original reproduction and a relevant regression check instead of treating disappearance during one manual attempt as proof

## Software testing

- Unit test — verify a small behaviour boundary quickly and isolate collaborators only when that keeps the test focused
- Integration test — verify selected real components working together across a meaningful boundary
- End-to-end test — verify a critical user journey through a complete running application surface with the highest realism and cost
- Test-level selection — choose unit, integration, or end-to-end scope from the risk being proved rather than using one level for every defect
- Testing pyramid — use many focused tests and fewer broad expensive tests as a trade-off heuristic, not a mandatory numeric ratio
- Arrange–Act–Assert vs Given–When–Then — recognise equivalent structural and domain-oriented ways to separate setup, behaviour, and verification
- Verification vs validation in testing — distinguish checking conformance to a specification from checking that the delivered behaviour solves the intended user need
- Meaningful assertion — verify an observable result or interaction that would fail if the behaviour regressed, not merely that code executed
- Test setup and teardown — create the required starting state and clean shared resources without hiding the scenario behind excessive fixtures
- Test isolation and order independence — make each test establish its own state so running it alone or in another order produces the same result
- Deterministic tests — control time, randomness, network, and mutable external data when they would make the same test alternate between pass and fail
- Happy-path, boundary, invalid-input, and error-path tests — select representative cases that expose different failure modes rather than multiplying similar examples
- Regression test — preserve a previously failing scenario so the same defect cannot return unnoticed
- Mock vs stub — use a stub to supply controlled responses and a mock when interaction verification is part of the behaviour contract
- State-based vs interaction-based verification — prefer observable state or output unless the collaborator call itself is the required outcome
- Flaky test — identify a test whose result changes without a relevant code change and fix the nondeterministic cause instead of normalising retries
- False positive vs false negative — distinguish a test that passes despite a defect from one that fails despite correct behaviour
- Coverage percentage vs test quality — use coverage to find unexecuted code, never as proof that assertions are meaningful or risks are covered
- Vacuous-test review — detect missing assertions, assertions unrelated to the action, and mocks that only confirm their own setup

## Configuration and environments

- Configuration vs code — keep environment-dependent values outside program logic so the same artifact can run in different contexts
- Configuration sources — recognise environment variables, configuration files, and command-line inputs and determine which value wins when sources overlap
- Required configuration and fail-fast startup — reject a missing mandatory value early with a clear diagnostic rather than failing later in unrelated code
- Default configuration — provide a default only when it is safe and semantically valid for every context where it may be used
- Development, test, staging, and production — use each environment for a distinct confidence level without assuming staging is an exact copy of production
- Build-time vs runtime configuration — distinguish values embedded while producing an artifact from values supplied when that artifact starts
- Configuration parity — keep environment differences explicit and minimal so deployment failures are not caused by hidden local assumptions
- Example environment file — document required variable names with safe placeholder values without committing real credentials
- Effective-configuration debugging — compare the value actually used in each environment rather than assuming the intended source won

## Containers and local runtime

- Container vs virtual machine — distinguish an isolated process sharing the host kernel from a virtualised machine with its own guest operating system
- Image vs container — distinguish an immutable packaged blueprint from a running instance with a writable runtime layer
- Image tag vs digest — recognise that a tag can be moved to different image content while a digest identifies exact immutable content
- `Dockerfile` vs Compose file — use a Dockerfile to build one image and Compose to define how multiple containers run together
- Build vs run — separate producing an image from starting a container from that image
- Container lifecycle — choose stop/start for the same container, restart for its process, recreate for changed runtime configuration, and rebuild for changed image content
- Exposed vs published container port — distinguish image metadata about a listening port from the runtime mapping that makes a container port reachable through a host port
- Container service discovery — use the Compose service name between containers and recognise that `localhost` always means the current container
- Bind mount vs named volume — choose direct host-file access or Docker-managed persistent storage from the development and data-lifecycle need
- Ephemeral vs persistent container data — recognise what disappears with a container and what must live in a volume or external service
- Container environment variables — inject runtime configuration instead of baking environment-specific values into a reusable image
- Container logs — inspect process output through the container runtime when no interactive terminal or debugger is attached
- Compose dependency and readiness — recognise that start order does not prove a dependency is ready to accept traffic
- Health-check awareness — use a health signal to report whether a service can perform its required work rather than merely whether its process exists
- Containerised-stack debugging — inspect container status, logs, ports, service names, configuration, networks, and volumes before rebuilding blindly
- Reproducible local stack — document enough build, configuration, and data-startup information for another developer to run the same services

## CI/CD pipelines

- Continuous integration — integrate small changes frequently into a shared codebase and verify them automatically before or after merge to expose integration failures early
- Continuous delivery vs continuous deployment — distinguish keeping every pipeline-accepted change releasable from automatically releasing changes that pass the automated delivery path
- Pipeline stages — trace checkout, build, test, package, image, and deploy stages and identify which stage produced a failure
- Build artifact — treat an identifiable, traceable build output as the input promoted through later checks and environments
- Pipeline result limits — recognise that a green pipeline proves only the checks it actually ran, not that the product is defect-free

## Agile and team delivery

- Agile iterative and incremental delivery — distinguish repeating a feedback cycle from delivering the product in usable slices
- Scrum roles — recognise the accountabilities of Product Owner, Scrum Master, and Developers without turning role recognition into certification detail
- Scrum events — distinguish planning, daily Scrum, review, and retrospective by the decision or feedback each event supports
- Sprint vs increment — distinguish the fixed iteration from the usable product result created during it
- Product backlog vs sprint backlog — distinguish the ordered product work from the selected work and plan for the current sprint
- User story vs acceptance criteria — separate a statement of user value from the testable conditions that define acceptable behaviour
- Acceptance criteria vs Definition of Done — distinguish item-specific behaviour from the shared quality gate applied to completed work
- Kanban flow vs Scrum cadence — recognise continuous flow with work-in-progress limits as a different control model from time-boxed sprints
- Work-in-progress limit awareness — limit simultaneous work to expose bottlenecks and finish items instead of maximising task starts

## Cloud awareness

- Cloud resource awareness — recognise managed compute, storage, networking, and database resources without requiring junior ownership of cloud architecture
