# General Junior Notes Plan

Plan status: stale
Coverage: notes/general/coverage/junior.md
Coverage SHA-256: dc1c74e23846d01e93ffdc9f6544eac1ce5ff089144e6985ad821342a0467c6d
Generated: 2026-08-02

## 00 — General engineering map

Status: pending
Action: create
English: notes/general/junior/en/00-general-engineering-map.md
Spanish: notes/general/junior/es/00-mapa-de-ingenieria-general.md
Depends on: none
Pending additions: none

Narrative role: Introduce general engineering as the framework-neutral layer that connects every Angular + Spring Boot change: information crosses a network boundary, becomes a data contract, can fail and be diagnosed, is verified by tests, runs from explicit configuration in a reproducible environment, and moves through a team delivery system.

Learning outcome: Explain the recurring request → representation → failure → verification → runtime → delivery mental model, contrast it with the narrower framework and language concepts Victor already knows from JavaScript, TypeScript, and React, and describe why the junior route follows that order.

Prerequisites: none

Must answer:

- What belongs to general engineering rather than to a framework-specific topic?
- How do protocol, data, diagnostics, tests, runtime, delivery, and teamwork connect in one software change?
- Where does each chapter fit Victor's Angular + Spring Boot target stack?
- Which parts resemble Victor's earlier frontend work, and which responsibilities only become visible when the browser, backend, runtime, and delivery system are followed together?
- How does the complete 01 → 20 route progress from reaching a resource, through contracts and failures, into verification, configuration, containers, CI/CD, teamwork, and deployment location—and why must each layer come after the previous one?

Coverage concepts:

*(orientation unit; no coverage bullet assigned)*

Rationale: This chapter is one teachable unit: general engineering map.

Handoff: Establishes the map; chapter 01 starts at the first boundary every full-stack feature crosses: the web request.

## 01 — The web request from address to resource

Status: pending
Action: audit
English: notes/general/junior/en/01-web-and-apis/01-http-fundamentals.md
Spanish: notes/general/junior/es/01-web-and-apis/01-fundamentos-http.md
Depends on: 00
Pending additions: none

Narrative role: Build the address-and-resource mental model needed before choosing request operations.

Learning outcome: Trace how a client reaches a resource and diagnose each part of a URL and basic connection path.

Prerequisites: 00

Must answer:

- What happens between entering a URL and exchanging HTTP messages?
- How do URI, URL, collection URI, and item URI differ?
- Why is HTTP the protocol rather than Angular or Spring Boot?

Coverage concepts:

- [ ] Client–server request/response model — trace how a client sends a request and receives a response without treating either framework as the protocol itself ✅ 02-weather-app
- [ ] URL anatomy — distinguish scheme, host, port, path, query, and fragment so an incorrect endpoint can be diagnosed precisely ✅ 02-weather-app
- [ ] URI vs URL — distinguish a resource identifier from the subset that also describes where and how to access it
- [ ] REST resource and representation model — model domain resources behind representations instead of treating endpoint paths as remote procedure names ✅ 07-timetrack
- [ ] Collection vs item URI — use stable noun-based paths to distinguish a resource collection from one identified member ✅ 07-timetrack
- [ ] Basic web request path — recognise DNS resolution, connection to a host and port, TLS negotiation for HTTPS, and the later HTTP exchange as distinct failure points

Rationale: This chapter is one teachable unit: the web request from address to resource.

Handoff: Once the target resource is clear, chapter 02 can choose how a request acts on it and carries data.

## 02 — HTTP operations, metadata, and state

Status: pending
Action: create
English: notes/general/junior/en/01-web-and-apis/02-http-operations-and-state.md
Spanish: notes/general/junior/es/01-web-and-apis/02-operaciones-http-y-estado.md
Depends on: 01
Pending additions: none

Narrative role: Turn a resource address into a precise request contract: method, parameters, headers, state, and transport protection.

Learning outcome: Design and explain a request whose operation, data placement, media metadata, state mechanism, and transport match its intent.

Prerequisites: 01

Must answer:

- How do safety and idempotency differ, and why does the distinction affect retries?
- When does data belong in the path, query, body, or headers?
- How can HTTP be stateless while an application uses cookies or server-side sessions?
- What does HTTPS protect that HTTP does not?
- What is a media type, and why do `Content-Type` and `Accept` describe different directions of the exchange?
- Why are retries only previewed here until chapter 04 teaches their failure conditions and controls?

Coverage concepts:

- [ ] HTTP methods — choose `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` from the intended resource operation rather than from habit ✅ 07-timetrack
- [ ] Safe vs idempotent methods — safe methods do not request a state change, while repeating an idempotent request has the same intended effect as sending it once ✅ 07-timetrack
- [ ] `PUT` vs `PATCH` — use PUT to replace the target resource state with the submitted representation and PATCH for a partial modification, following the API contract's omitted-field rules ✅ 07-timetrack
- [ ] Path parameters vs query parameters vs request body — use the path for resource identity, the query for optional selection or representation controls, and the body for a submitted representation ✅ 07-timetrack
- [ ] HTTP headers and body — keep request metadata in headers and the submitted representation in the body ✅ 07-timetrack
- [ ] `Content-Type` vs `Accept` — declare the media type being sent separately from the response media types the client can process
- [ ] Stateless HTTP — understand that HTTP defines no conversational session while an application may carry state in each request or look it up through an identifier such as a session cookie ✅ 07-timetrack
- [ ] Cookie and session mechanics — recognise `Set-Cookie` as the response instruction that stores browser state and `Cookie` as the later request header that returns it, while security attributes remain a Security concern
- [ ] HTTPS vs HTTP — recognise that HTTPS applies TLS protection to HTTP traffic in transit while HTTP alone provides no transport encryption

Rationale: This chapter is one teachable unit: http operations, metadata, and state.

Handoff: A well-formed request still needs a semantically correct response; chapter 03 maps outcomes to status and caching behaviour.

## 03 — HTTP response semantics and caching

Status: pending
Action: create
English: notes/general/junior/en/01-web-and-apis/03-http-responses-and-caching.md
Spanish: notes/general/junior/es/01-web-and-apis/03-respuestas-http-y-cache.md
Depends on: 02
Pending additions: none

Narrative role: Teach one response-decision model: first classify the outcome, then choose its precise status and metadata, and finally decide whether the client may reuse or redirect that response.

Learning outcome: Follow that response-decision model to choose and interpret success, error, redirect, and cache-validation semantics without treating status codes as an unrelated catalogue.

Prerequisites: 02

Must answer:

- How do status families narrow a diagnosis before reading the body?
- When are 201 and Location more correct than 200, and when is 204 appropriate?
- How do the common 4xx and 5xx confusable pairs differ?
- What do freshness and validators change in a later request?

Coverage concepts:

- [ ] HTTP status-code families — use 1xx, 2xx, 3xx, 4xx, and 5xx as protocol-level categories before inspecting the application error body ✅ 07-timetrack
- [ ] `200 OK`, `201 Created`, and `204 No Content` — select the success status from whether the operation returns a representation, creates a resource, or intentionally returns no body ✅ 07-timetrack
- [ ] `Location` on a `201` — when supplied, the header identifies a primary resource created by the request so the client need not assemble its URI from a copied route scheme ✅ 07-timetrack
- [ ] `400 Bad Request` vs `422 Unprocessable Content` — recognise 400 as a broad perceived client-request error and 422 as understood media type and syntax whose instructions cannot be processed, while following the API's documented convention
- [ ] `401 Unauthorized` vs `403 Forbidden` — distinguish missing or invalid authentication from an authenticated identity lacking permission ✅ 07-timetrack
- [ ] `404 Not Found` vs `409 Conflict` — distinguish an absent resource from a request that conflicts with current resource state ✅ 07-timetrack
- [ ] `500 Internal Server Error` vs `503 Service Unavailable` — distinguish an unexpected server failure from temporary inability to serve the request
- [ ] Redirect semantics — recognise that 3xx responses point the client elsewhere and that method-preserving redirects differ from redirects commonly followed as GET
- [ ] HTTP caching basics — recognise freshness directives, validators such as ETags, and conditional requests without treating caching as an automatic performance fix

Rationale: This chapter is one teachable unit: http response semantics and caching.

Handoff: Status semantics identify what kind of outcome occurred; chapter 04 turns failures into a repeatable diagnostic workflow.

## 04 — HTTP failure diagnosis

Status: pending
Action: create
English: notes/general/junior/en/01-web-and-apis/04-http-failure-diagnosis.md
Spanish: notes/general/junior/es/01-web-and-apis/04-diagnostico-de-fallos-http.md
Depends on: 03
Pending additions: none

Narrative role: Connect HTTP semantics to safe retry decisions, browser boundary failures, and a systematic exchange-debugging workflow.

Learning outcome: Separate transport, protocol, browser-policy, and application failures and diagnose the exchange in a repeatable order.

Prerequisites: 03

Must answer:

- When is retrying safe, and when does it risk repeating a state change?
- How can the same call fail before HTTP, with an HTTP error, or inside a successful response?
- How do you distinguish a CORS failure from an application response?

Coverage concepts:

- [ ] Timeouts and retries — bound waiting and retry only when the operation and failure mode make repetition safe, adding idempotency controls when required
- [ ] Transport vs protocol vs application failure — separate inability to connect, an HTTP error status, and a successful HTTP response whose domain result is unsuccessful
- [ ] API-call debugging workflow — inspect URL, method, status, headers, and body before blaming client or server framework code
- [ ] Same-origin and CORS recognition — identify an origin from scheme, host, and port and distinguish a browser-enforced CORS or preflight failure from an HTTP response produced by application logic ✅ 07-timetrack

Rationale: Every concept separates or investigates one failure boundary in the same HTTP exchange.

Handoff: With the exchange understood, chapter 05 examines the representation most APIs carry: JSON.

## 05 — Data families and boundary representations

Status: pending
Action: audit
English: notes/general/junior/en/01-web-and-apis/05-json.md
Spanish: notes/general/junior/es/01-web-and-apis/05-json.md
Depends on: 04
Pending additions: none

Narrative role: Separate the model used to store data from the representation used to exchange it, then introduce JSON as a deliberately limited wire format rather than a JavaScript object copied across the network.

Learning outcome: Distinguish relational, document, and key-value storage choices from a JSON transport representation, then read and design JSON values while explaining absence, null, unsupported native values, and serialization direction.

Prerequisites: 04

Must answer:

- How does a JSON object differ from an array?
- Why does choosing a relational or NoSQL storage family not determine the HTTP representation sent to a client?
- Why are a missing field and an explicit null not automatically equivalent?
- How must dates, undefined, and binary data be represented?
- Which direction is serialization and which is deserialization?

Coverage concepts:

- [ ] Relational vs NoSQL database families — recognise document and key-value models while choosing a relational database when joins, constraints, and transactions fit the data
- [ ] JSON value model — recognise objects, arrays, strings, numbers, booleans, and `null`, with double-quoted object keys and no trailing commas
- [ ] JSON object vs array — distinguish a named property collection from an ordered value collection when reading or designing a payload
- [ ] Missing field vs explicit `null` — treat absence and an explicit null value as separate contract states unless the API defines them as equivalent ✅ 07-timetrack
- [ ] JSON limitations — recognise that JSON has no native date, `undefined`, binary, or distinct integer type, so an API must define representations for them
- [ ] Serialization vs deserialization — distinguish converting an in-memory value to a transport representation from reconstructing a value from that representation ✅ 07-timetrack

Rationale: The chapter teaches one boundary decision: storage families describe how data is persisted, while JSON describes how a representation crosses an API boundary.

Handoff: Knowing the wire format exposes the next risk: two programs can interpret the same-looking payload differently, which chapter 06 addresses.

## 06 — API contracts, OpenAPI, and client tools

Status: pending
Action: create
English: notes/general/junior/en/01-web-and-apis/06-api-contracts-and-tools.md
Spanish: notes/general/junior/es/01-web-and-apis/06-contratos-api-y-herramientas.md
Depends on: 05
Pending additions: none

Narrative role: Make API compatibility explicit through naming, types, time semantics, machine-readable contracts, and reproducible manual inspection.

Learning outcome: Diagnose a boundary mismatch, define a predictable collection-query schema, read an OpenAPI operation, and reproduce the exact exchange with an API client tool.

Prerequisites: 05

Must answer:

- Which naming, nesting, type, and nullability mismatches break a boundary?
- Why must a date string also define time-zone meaning?
- How does an OpenAPI specification differ from Swagger UI?
- What does a successful Postman request prove—and what does it not prove?
- How do filtering, sorting, pagination, stable ordering, and response metadata form one collection-query schema?

Coverage concepts:

- [ ] Contract naming and type mismatches — diagnose failures caused by different property names, nesting, nullability, or expected value types across a boundary
- [ ] Date and time representation — agree an explicit interoperable string format and time-zone meaning instead of relying on environment-specific parsing ✅ 07-timetrack
- [ ] OpenAPI recognition — read operations, parameters, schemas, responses, and examples in a machine-readable HTTP API contract
- [ ] OpenAPI specification vs interactive documentation — distinguish the contract document from tools such as Swagger UI that render and exercise it
- [ ] API client tools — use Postman or `curl` to inspect and reproduce an HTTP exchange without treating a successful manual request as complete automated verification ✅ 07-timetrack
- [ ] Collection query contract — define filtering, sorting, pagination inputs, stable ordering, and response metadata so clients can navigate a changing collection predictably ✅ 07-timetrack

Rationale: This chapter is one teachable unit: api contracts, openapi, and client tools.

Handoff: Contracts describe expected outcomes; chapter 07 explains how failures travel and where recovery belongs when reality diverges.

## 07 — Error propagation and diagnostic context

Status: pending
Action: audit
English: notes/general/junior/en/02-errors-and-debugging/07-error-handling.md
Spanish: notes/general/junior/es/02-errors-and-debugging/07-gestion-de-errores.md
Depends on: 06
Pending additions: none

Narrative role: Separate control-flow failure, honest recovery, consumer-safe messages, and operational records before using debugging tools.

Learning outcome: Choose whether to propagate, recover, add context, or log a failure without fabricating success or leaking diagnostics.

Prerequisites: 06

Must answer:

- At which boundary can a failure be handled meaningfully?
- When is a fallback honest, and when does it turn failure into fake success?
- Why are exceptions and logs complementary rather than interchangeable?
- What makes a log structured and its level operationally meaningful?

Coverage concepts:

- [ ] Error propagation — let a failure travel to a boundary that can add context or choose a response instead of swallowing it or catching and rethrowing without value ✅ 07-timetrack
- [ ] Local error recovery — substitute a fallback only when it is semantically honest; converting every failure into empty data fabricates success
- [ ] Error message vs diagnostic detail — give consumers a stable safe message while preserving technical context for diagnosis ✅ 07-timetrack
- [ ] Exception vs log — understand that an exception changes control flow while a log records an event without handling it ✅ 07-timetrack
- [ ] Structured logging — record searchable fields and context rather than relying on unstructured print statements
- [ ] Log levels — choose `DEBUG`, `INFO`, `WARN`, or `ERROR` from operational meaning rather than using one level for every event ✅ 07-timetrack

Rationale: This chapter is one teachable unit: error propagation and diagnostic context.

Handoff: Once failures preserve useful context, chapter 08 shows how to reproduce and inspect them systematically.

## 08 — Systematic debugging and observability signals

Status: pending
Action: audit
English: notes/general/junior/en/02-errors-and-debugging/08-debugging.md
Spanish: notes/general/junior/es/02-errors-and-debugging/08-depuracion.md
Depends on: 07
Pending additions: none

Narrative role: Turn diagnostic context into a disciplined path from reproduction through isolation, inspection, and regression verification.

Learning outcome: Reproduce a defect, isolate its boundary, inspect stack and live state, verify the fix, and distinguish logs, metrics, and traces.

Prerequisites: 07

Must answer:

- Why must the original failure be reproducible before code changes begin?
- How do stack frames and nested causes lead to the relevant application code?
- What can a breakpoint reveal that a log cannot, and vice versa?
- What evidence shows a fix is real rather than a one-off disappearance?

Coverage concepts:

- [ ] Reproducible debugging — establish reliable steps and the smallest failing input before changing code so the effect of a fix can be verified
- [ ] Boundary isolation — reduce a failure to the client, network, API, persistence, or external dependency before investigating implementation detail
- [ ] Stack trace and cause chain — read the failure type, message, frames, and nested causes from the first relevant application frame outward
- [ ] Breakpoints and variable inspection — pause execution at a suspected path and compare actual state and control flow with the expected behaviour
- [ ] Fix verification — rerun the original reproduction and a relevant regression check instead of treating disappearance during one manual attempt as proof
- [ ] Logs vs metrics vs traces — distinguish event records, measurements over time, and the path of one request across components without requiring junior ownership of an observability platform

Rationale: This chapter is one teachable unit: systematic debugging and observability signals.

Handoff: Debugging verifies one suspected failure; chapter 09 introduces the cost and scope models used to choose broader verification.

## 09 — Complexity recognition and test scope

Status: pending
Action: create
English: notes/general/junior/en/03-testing/09-complexity-and-test-scope.md
Spanish: notes/general/junior/es/03-testing/09-complejidad-y-alcance-de-tests.md
Depends on: 08
Pending additions: none

Narrative role: Introduce two dimensions of verification cost before test mechanics: how work grows with input and how realism grows from a focused unit to a complete user journey.

Learning outcome: Recognise constant versus linear growth and choose unit, integration, or end-to-end scope from the risk and cost being proved.

Prerequisites: 08

Must answer:

- What does constant versus linear growth predict without pretending constants and real input sizes do not matter?
- What behaviour boundary distinguishes unit, integration, and end-to-end tests?
- Why is the testing pyramid a trade-off heuristic rather than a required ratio?
- How does the risk being proved determine the cheapest credible test level?
- What is a test collaborator—the dependency used by the behaviour under test—and why might a focused unit test isolate it before chapter 11 teaches the available doubles?

Coverage concepts:

- [ ] Big O recognition — compare constant and linear growth in ordinary collection operations while remembering that real input sizes and constants still matter
- [ ] Unit test — verify a small behaviour boundary quickly and isolate collaborators only when that keeps the test focused
- [ ] Integration test — verify selected real components working together across a meaningful boundary
- [ ] End-to-end test — verify a critical user journey through a complete running application surface with the highest realism and cost
- [ ] Test-level selection — choose unit, integration, or end-to-end scope from the risk being proved rather than using one level for every defect
- [ ] Testing pyramid — use many focused tests and fewer broad expensive tests as a trade-off heuristic, not a mandatory numeric ratio

Rationale: Complexity growth and test level are taught together as two cost models Victor must recognise before designing a scenario.

Handoff: Chapter 09 chooses the scope; chapter 10 turns that scope into an isolated, deterministic scenario with meaningful evidence.

## 10 — Executable test scenarios

Status: pending
Action: audit
English: notes/general/junior/en/03-testing/10-testing-concepts.md
Spanish: notes/general/junior/es/03-testing/10-conceptos-de-testing.md
Depends on: 09
Pending additions: none

Narrative role: Turn the selected test scope into a readable scenario whose setup, action, assertion, independence, and controlled inputs make its result repeatable.

Learning outcome: Structure a test with observable evidence and keep its state and nondeterministic inputs controlled across individual and full-suite runs.

Prerequisites: 09

Must answer:

- How do Arrange–Act–Assert and Given–When–Then express the same scenario in different language?
- What observable result would fail if the behaviour regressed?
- How do setup, teardown, isolation, and order independence protect the scenario?
- Which sources of time, randomness, network, or mutable data must be controlled?
- How do happy-path, boundary, invalid-input, and error-path cases expose different risks?

Coverage concepts:

- [ ] Arrange–Act–Assert vs Given–When–Then — recognise equivalent structural and domain-oriented ways to separate setup, behaviour, and verification
- [ ] Meaningful assertion — verify an observable result or interaction that would fail if the behaviour regressed, not merely that code executed
- [ ] Test setup and teardown — create the required starting state and clean shared resources without hiding the scenario behind excessive fixtures
- [ ] Test isolation and order independence — make each test establish its own state so running it alone or in another order produces the same result
- [ ] Deterministic tests — control time, randomness, network, and mutable external data when they would make the same test alternate between pass and fail
- [ ] Happy-path, boundary, invalid-input, and error-path tests — select representative cases that expose different failure modes rather than multiplying similar examples

Rationale: These concepts form one executable-scenario mental model from setup through trustworthy evidence.

Handoff: A stable scenario is not automatically meaningful; chapter 11 examines assertions, doubles, regressions, and misleading green results.

## 11 — Test doubles, false confidence, and AI-assisted verification

Status: pending
Action: create
English: notes/general/junior/en/03-testing/11-test-evidence-and-doubles.md
Spanish: notes/general/junior/es/03-testing/11-evidencia-de-tests-y-dobles.md
Depends on: 10
Pending additions: none

Narrative role: Challenge apparently green evidence by examining collaborators, verification style, regressions, flakes, vacuous assertions, and generated proposals.

Learning outcome: Choose a test double and verification style, preserve regressions, diagnose misleading results, and review AI-generated code or tests as untrusted proposals.

Prerequisites: 10

Must answer:

- When is a stub enough, and when is interaction verification part of the contract?
- Why is state-based verification usually less coupled?
- How do flaky tests, false positives, and false negatives differ?
- Why can high coverage coexist with weak assertions?
- What are a collaborator, test double, observable state, and interaction contract in one concrete test?
- Which APIs, assumptions, edge cases, and meaningful checks must be verified before an AI-generated change is accepted?

Coverage concepts:

- [ ] Regression test — preserve a previously failing scenario so the same defect cannot return unnoticed
- [ ] Mock vs stub — use a stub to supply controlled responses and a mock when interaction verification is part of the behaviour contract
- [ ] State-based vs interaction-based verification — prefer observable state or output unless the collaborator call itself is the required outcome
- [ ] Flaky test — identify a test whose result changes without a relevant code change and fix the nondeterministic cause instead of normalising retries
- [ ] False positive vs false negative — distinguish a test that passes despite a defect from one that fails despite correct behaviour
- [ ] Coverage percentage vs test quality — use coverage to find unexecuted code, never as proof that assertions are meaningful or risks are covered
- [ ] Vacuous-test review — detect missing assertions, assertions unrelated to the action, and mocks that only confirm their own setup
- [ ] AI-generated change verification — treat generated code, tests, and configuration as untrusted proposals whose APIs, assumptions, edge cases, and meaningful checks must be validated before acceptance

Rationale: Every concept tests whether evidence is credible rather than merely present, including evidence proposed by AI.

Handoff: Tests need repeatable environments; chapter 12 moves the same explicitness into application configuration.

## 12 — Configuration across environments

Status: pending
Action: audit
English: notes/general/junior/en/04-configuration-and-docker/12-environment-variables.md
Spanish: notes/general/junior/es/04-configuration-and-docker/12-variables-de-entorno.md
Depends on: 11
Pending additions: none

Narrative role: Separate the deployable artifact from values that vary by environment and make the effective value diagnosable.

Learning outcome: Design a safe configuration chain across development, test, staging, and production and explain which source wins at runtime.

Prerequisites: 11

Must answer:

- Which values belong in configuration rather than code?
- When is a default safe, and why should a required value fail fast?
- How do build-time and runtime configuration differ?
- How can you prove which source supplied the effective value?

Coverage concepts:

- [ ] Configuration vs code — keep environment-dependent values outside program logic so the same artifact can run in different contexts ✅ 07-timetrack
- [ ] Configuration sources — recognise environment variables, configuration files, and command-line inputs and determine which value wins when sources overlap ✅ 07-timetrack
- [ ] Required configuration and fail-fast startup — reject a missing mandatory value early with a clear diagnostic rather than failing later in unrelated code ✅ 07-timetrack
- [ ] Default configuration — provide a default only when it is safe and semantically valid for every context where it may be used
- [ ] Development, test, staging, and production — use each environment for a distinct confidence level without assuming staging is an exact copy of production
- [ ] Build-time vs runtime configuration — distinguish values embedded while producing an artifact from values supplied when that artifact starts ✅ 02-weather-app
- [ ] Configuration parity — keep environment differences explicit and minimal so deployment failures are not caused by hidden local assumptions
- [ ] Example environment file — document required variable names with safe placeholder values without committing real credentials
- [ ] Effective-configuration debugging — compare the value actually used in each environment rather than assuming the intended source won

Rationale: This chapter is one teachable unit: configuration across environments.

Handoff: External configuration makes one artifact portable; chapter 13 packages that artifact into a reproducible container runtime.

## 13 — Container images, processes, and lifecycle

Status: pending
Action: audit
English: notes/general/junior/en/04-configuration-and-docker/13-docker.md
Spanish: notes/general/junior/es/04-configuration-and-docker/13-docker.md
Depends on: 12
Pending additions: none

Narrative role: Establish the image-to-running-process model before introducing networking, storage, and multi-service orchestration.

Learning outcome: Explain container isolation, distinguish images from containers, and choose rebuild, recreate, restart, or start from what changed.

Prerequisites: 12

Must answer:

- What does a container share with the host that a virtual machine does not?
- How do image, container, build, and run relate before orchestration is introduced?
- Which kinds of change require rebuilding an image versus recreating or restarting a container?

Coverage concepts:

- [ ] Container vs virtual machine — distinguish an isolated process sharing the host kernel from a virtualised machine with its own guest operating system
- [ ] Image vs container — distinguish an immutable packaged blueprint from a running instance with a writable runtime layer
- [ ] Build vs run — separate producing an image from starting a container from that image
- [ ] Container lifecycle — choose stop/start or restart for the same container, recreate it for changed runtime configuration, and rebuild its image for changed packaged content

Rationale: This chapter is one teachable unit: container images, processes, and lifecycle.

Handoff: A running container is isolated; chapter 14 explains how it reaches ports, peers, configuration, and persistent data.

## 14 — Container networking, configuration, and storage

Status: pending
Action: create
English: notes/general/junior/en/04-configuration-and-docker/14-container-networking-config-and-storage.md
Spanish: notes/general/junior/es/04-configuration-and-docker/14-redes-configuracion-y-almacenamiento-en-contenedores.md
Depends on: 13
Pending additions: none

Narrative role: Introduce Compose as the coordinator of multiple container definitions, then connect those containers to users, peer services, runtime configuration, durable data, and their observable output.

Learning outcome: Configure port access, service discovery, mounts or volumes, runtime variables, and logs for a multi-container local stack.

Prerequisites: 13

Must answer:

- Why does localhost inside a container not name another Compose service?
- How does an exposed port differ from a published port?
- When should data use a bind mount, named volume, or remain ephemeral?
- Why must reusable images receive environment-specific values only at runtime?
- What does Compose coordinate, and how does that differ from the Dockerfile that builds one image?

Coverage concepts:

- [ ] `Dockerfile` vs Compose file — use a Dockerfile to build one image and Compose to define how multiple containers run together
- [ ] Exposed vs published container port — distinguish image metadata documenting an intended container port from the runtime mapping that makes a container port reachable through a host port
- [ ] Container service discovery — use the Compose service name between containers and recognise that `localhost` always means the current container
- [ ] Bind mount vs named volume — choose direct host-file access or Docker-managed persistent storage from the development and data-lifecycle need
- [ ] Ephemeral vs persistent container data — recognise what disappears with a container and what must live in a volume or external service
- [ ] Container environment variables — inject runtime configuration instead of baking environment-specific values into a reusable image
- [ ] Container logs — inspect process output through the container runtime when no interactive terminal or debugger is attached

Rationale: This chapter is one teachable unit: container networking, configuration, and storage.

Handoff: Connectivity does not prove readiness; chapter 15 closes the container route with health and systematic stack diagnosis.

## 15 — Container readiness and reproducible stacks

Status: pending
Action: create
English: notes/general/junior/en/04-configuration-and-docker/15-container-readiness-and-debugging.md
Spanish: notes/general/junior/es/04-configuration-and-docker/15-disponibilidad-y-depuracion-de-contenedores.md
Depends on: 14
Pending additions: none

Narrative role: Prevent start order and running-process signals from being mistaken for a usable multi-service system.

Learning outcome: Define a meaningful health signal, diagnose a containerised stack methodically, and document a reproducible startup path.

Prerequisites: 14

Must answer:

- Why does dependency start order not prove readiness?
- What should a health check prove beyond process existence?
- Which evidence should be inspected before rebuilding blindly?
- What must another developer know to reproduce the local stack?

Coverage concepts:

- [ ] Compose dependency and readiness — recognise that start order does not prove a dependency is ready to accept traffic
- [ ] Health-check awareness — use a health signal to report whether a service can perform its required work rather than merely whether its process exists
- [ ] Containerised-stack debugging — inspect container status, logs, ports, service names, configuration, networks, and volumes before rebuilding blindly
- [ ] Reproducible local stack — document enough build, configuration, and data-startup information for another developer to run the same services

Rationale: This chapter is one teachable unit: container readiness and reproducible stacks.

Handoff: A reproducible runtime becomes an artifact moving through delivery; chapter 16 traces that broader lifecycle.

## 16 — Delivery lifecycle, integration, and release

Status: pending
Action: create
English: notes/general/junior/en/05-delivery-and-teamwork/16-delivery-lifecycle-and-release.md
Spanish: notes/general/junior/es/05-delivery-and-teamwork/16-ciclo-de-entrega-y-release.md
Depends on: 15
Pending additions: none

Narrative role: Define a software change and its path from requested outcome through maintenance, place CI/CD inside that path, and separate integration, delivery, deployment, and release before any team framework is assumed.

Learning outcome: Trace a change through the delivery lifecycle and explain what each continuous practice and release decision actually changes.

Prerequisites: 15

Must answer:

- Which parts of software delivery exist outside a CI/CD pipeline?
- How do continuous integration, delivery, and deployment differ?
- How can code be deployed but not released to users?
- What is a requested software change, and which lifecycle activities still exist when a team does not use Scrum or Kanban?

Coverage concepts:

- [ ] Software delivery lifecycle vs CI/CD pipeline — trace a change from requirement through maintenance while recognising that CI/CD automates only part of that broader lifecycle
- [ ] Continuous integration — integrate small changes frequently into a shared codebase and verify them automatically before or after merge to expose integration failures early
- [ ] Continuous delivery vs continuous deployment — distinguish keeping every pipeline-accepted change releasable from automatically releasing changes that pass the automated delivery path
- [ ] Deployment vs release — distinguish placing an artifact in an environment from making its functionality available to users

Rationale: This chapter is one teachable unit: delivery lifecycle, integration, and release.

Handoff: The distinctions define the goals; chapter 17 examines the jobs, artifacts, and limits of the pipeline that automates them.

## 17 — Pipeline execution, artifacts, and limits

Status: pending
Action: create
English: notes/general/junior/en/05-delivery-and-teamwork/17-pipeline-execution-and-artifacts.md
Spanish: notes/general/junior/es/05-delivery-and-teamwork/17-ejecucion-de-pipelines-y-artefactos.md
Depends on: 16
Pending additions: none

Narrative role: Make a pipeline diagnosable as staged work running in an isolated environment rather than as a green or red badge.

Learning outcome: Trace a trigger through pipeline stages, identify its artifact and execution environment, and state exactly what a green result proves.

Prerequisites: 16

Must answer:

- Which event started the pipeline and what state exists in its runner?
- Which stage produced the failure and which artifact should continue forward?
- How are Jenkins, GitLab CI, and GitHub Actions related without confusing vendor syntax with CI/CD?
- Why does a green pipeline never prove the product defect-free?

Coverage concepts:

- [ ] Pipeline triggers and execution environments — recognise push, pull-request, merge, schedule, and manual triggers and diagnose jobs inside their isolated configured environment rather than assuming local-machine state
- [ ] Pipeline stages — trace checkout, build, test, package, image, and deploy stages and identify which stage produced a failure
- [ ] CI platform recognition — recognise Jenkins, GitLab CI, and GitHub Actions as tools that execute repository-defined pipelines without treating one vendor's syntax as the CI/CD concept itself
- [ ] Build artifact — treat an identifiable, traceable build output as the input promoted through later checks and environments
- [ ] Pipeline result limits — recognise that a green pipeline proves only the checks it actually ran, not that the product is defect-free

Rationale: This chapter is one teachable unit: pipeline execution, artifacts, and limits.

Handoff: Delivery automation carries work created by people; chapter 18 introduces the iterative team model that selects and reviews that work.

## 18 — Agile delivery and Scrum boundaries

Status: pending
Action: create
English: notes/general/junior/en/05-delivery-and-teamwork/18-agile-and-scrum.md
Spanish: notes/general/junior/es/05-delivery-and-teamwork/18-agile-y-scrum.md
Depends on: 17
Pending additions: none

Narrative role: Connect iterative product feedback, Scrum accountabilities, work selection, and shared completion criteria without turning them into ceremony vocabulary.

Learning outcome: Explain how a Scrum team turns ordered product work into a usable increment with testable acceptance and a shared Definition of Done.

Prerequisites: 17

Must answer:

- How do iterative and incremental delivery differ?
- What decision does each Scrum role and event support?
- How do product backlog, sprint backlog, sprint, and increment relate?
- Why are acceptance criteria and Definition of Done not interchangeable?

Coverage concepts:

- [ ] Agile iterative and incremental delivery — distinguish repeating a feedback cycle from delivering the product in usable slices
- [ ] Scrum roles — recognise the accountabilities of Product Owner, Scrum Master, and Developers without turning role recognition into certification detail
- [ ] Scrum events — distinguish planning, daily Scrum, review, and retrospective by the decision or feedback each event supports
- [ ] Sprint vs increment — distinguish the fixed iteration from the usable product result created during it
- [ ] Product backlog vs sprint backlog — distinguish the ordered product work from the selected work and plan for the current sprint
- [ ] User story vs acceptance criteria — separate a statement of user value from the testable conditions that define acceptable behaviour
- [ ] Acceptance criteria vs Definition of Done — distinguish item-specific behaviour from the shared quality gate applied to completed work

Rationale: This chapter is one teachable unit: agile delivery and scrum boundaries.

Handoff: Scrum controls work through cadence; chapter 19 contrasts it with flow-based control and limits on simultaneous work.

## 19 — Kanban flow and work-in-progress limits

Status: pending
Action: create
English: notes/general/junior/en/05-delivery-and-teamwork/19-kanban-flow-and-wip.md
Spanish: notes/general/junior/es/05-delivery-and-teamwork/19-flujo-kanban-y-limites-wip.md
Depends on: 18
Pending additions: none

Narrative role: Add the alternative flow mental model needed to understand why starting more work can reduce delivery.

Learning outcome: Contrast Kanban flow with Scrum cadence and explain how a work-in-progress limit exposes bottlenecks and improves finishing.

Prerequisites: 18

Must answer:

- What changes when work is pulled continuously instead of planned in fixed sprints?
- How can a WIP limit increase throughput while reducing simultaneous starts?

Coverage concepts:

- [ ] Kanban flow vs Scrum cadence — recognise continuous flow with work-in-progress limits as a different control model from time-boxed sprints
- [ ] Work-in-progress limit awareness — limit simultaneous work to expose bottlenecks and finish items instead of maximising task starts

Rationale: This chapter is one teachable unit: kanban flow and work-in-progress limits.

Handoff: Team delivery still runs somewhere; chapter 20 closes the junior route with the infrastructure models that host it.

## 20 — Cloud and on-premises awareness

Status: pending
Action: create
English: notes/general/junior/en/05-delivery-and-teamwork/20-cloud-and-on-premises-awareness.md
Spanish: notes/general/junior/es/05-delivery-and-teamwork/20-cloud-y-on-premises.md
Depends on: 19
Pending additions: none

Narrative role: Give the deployment vocabulary needed to locate compute, storage, networking, and databases without importing infrastructure-design ownership.

Learning outcome: Distinguish cloud-hosted from on-premises systems and recognise core managed resources, locations, and retained customer responsibilities.

Prerequisites: 19

Must answer:

- Who operates the infrastructure in cloud-hosted and on-premises models?
- What do compute, storage, networking, databases, regions, and availability zones identify?
- Which responsibilities remain with the customer when a service is managed?

Coverage concepts:

- [ ] Cloud-hosted vs on-premises infrastructure — distinguish provider-operated infrastructure from systems run in an organisation's own facilities without assuming either model removes operational responsibility
- [ ] Cloud resource and location awareness — recognise managed compute, storage, networking, databases, regions, and availability zones together with the customer responsibilities that a managed service does not remove

Rationale: This chapter is one teachable unit: cloud and on-premises awareness.

Handoff: Closes the junior general-engineering journey by locating the tested, configured, containerised, delivered application in its operating environment.

## Unassigned existing notes

- notes/general/junior/en/99-legacy/90-base64.md — renumbered from `04`; Base64 is no longer owned by any General junior coverage bullet.
- notes/general/junior/en/99-legacy/91-solid.md — renumbered from `06`; SOLID design ownership is outside the current General junior coverage.
- notes/general/junior/en/99-legacy/92-browser-storage.md — renumbered from `07`; storage APIs and security attributes are not assigned as a General junior learning unit, while neutral cookie/session mechanics remain in chapter 02.
- notes/general/junior/en/99-legacy/93-code-principles.md — renumbered from `09`; DRY, KISS, and YAGNI are not owned by the current General junior coverage.
- notes/general/junior/en/99-legacy/94-logging.md — renumbered from `11`; its covered concepts are consolidated into chapter 07, while the legacy file itself is not a separate coverage-owned unit.
