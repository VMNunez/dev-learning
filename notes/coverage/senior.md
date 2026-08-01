# Global Senior Coverage — All Topics

Combined senior-level coverage for every topic in the notes folder.
Source files: one `coverage/senior.md` per topic folder — this file is a read-only mirror for cross-topic analysis.
This level becomes active only after the middle level is complete and consolidated.
Order follows study priority: Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

---

## Angular

Senior, specialist, or product-dependent topics that remain outside the junior and middle progression.

- Server-side rendering and hydration — optimise public-page SEO and first render when the product is not an authenticated internal SPA
- Micro-frontends and module federation — split deployment ownership when several teams genuinely require independent release boundaries
- Angular Elements — package Angular components as custom elements for non-Angular hosts
- Custom webpack integration — extend the CLI build only for a concrete unsupported requirement
- Custom Angular schematics — encode stable organisation-specific generation conventions
- Zone.js internals and zoneless migration — study task patching and scheduling when leading a large change-detection migration

---

## Angular Material

Senior or specialist Material work beyond normal product-level component usage.

- Custom MDC-token component systems — work below Angular Material's public theming layer when a design-system team requires pixel-level control
- Organisation-wide accessibility auditing — validate screen readers, keyboard flows, contrast, and legal requirements across a complete product
- Bespoke component-library governance — version, document, test, and migrate a shared UI library consumed by several teams

---

## Spring

Scope pending the first `coverage-prompt` run after junior and middle boundary migration.

---

## Spring Boot

Senior, specialist, or infrastructure-dependent topics beyond the middle Spring Boot progression.

- Spring WebFlux and reactive persistence — adopt an end-to-end non-blocking stack only for workloads that justify its programming and debugging cost
- Spring Boot auto-configuration internals — inspect conditions, import selection, and custom starters when maintaining platform infrastructure
- Native-image optimisation — tune reflection metadata and startup behaviour for GraalVM deployments
- Large-scale Spring Cloud platforms — operate configuration, discovery, gateways, tracing, and resilience across many independently deployed services
- Framework extension development — build reusable starters and organisational conventions for multiple teams

---

## Java

Senior or specialist language/runtime depth beyond normal middle application development.

- JVM memory model and garbage-collector tuning — diagnose allocation, pauses, and visibility with production evidence
- Bytecode and JIT compilation — inspect runtime optimisation when profiling requires knowledge below source code
- Advanced lock-free concurrency — design atomic algorithms only where ordinary concurrency primitives cannot meet measured requirements
- Annotation processors and compiler plugins — generate or validate code at compilation time for framework or tooling development
- Java agents and instrumentation — observe or transform running applications for specialised diagnostics and platforms

---

## Architecture

Senior architecture concerns that require production scale, organisational context, or specialist experience.

- Distributed consensus and coordination — reason about leader election, quorums, and consistency when infrastructure requires it
- Multi-region architecture — balance latency, availability, data residency, and disaster recovery across regions
- Event sourcing — persist domain events as the source of truth only when audit and temporal reconstruction justify the operational cost
- Platform architecture — design shared paved roads, ownership boundaries, and migration strategies for many teams
- Large-scale evolutionary architecture — govern fitness functions and incremental replacement across long-lived systems

---

## Security

Senior, specialist, or offensive-security depth beyond middle application security.

- JWE and advanced token profiles — encrypt or constrain token formats for specialised interoperability requirements
- Threat modelling at system scale — analyse trust boundaries and abuse cases across multiple services and external actors
- Penetration testing — use specialist methodology and tools such as OWASP ZAP or Burp Suite within authorised scope
- Security incident response — investigate, contain, eradicate, and learn from active compromise
- Cryptographic protocol design — remain a specialist discipline; application developers should use reviewed standards and libraries

---

## TypeScript

Specialist type-system and library-authoring work beyond ordinary middle application development.

- Recursive and highly generic type programming — use only when a public API's safety justifies substantial compiler and readability cost
- Compiler API and custom transforms — analyse or rewrite TypeScript programs for specialised tooling
- Large-scale declaration-library maintenance — model complex JavaScript ecosystems and preserve compatibility across releases
- Type-checker performance engineering — diagnose slow inference and project graph behaviour in very large repositories

---

## JavaScript

Runtime and language-specialist depth beyond normal middle frontend development.

- JavaScript engine internals — study parsing, hidden classes, inline caches, and JIT optimisation when profiling requires it
- Shared-memory concurrency — use workers, `SharedArrayBuffer`, and atomics only for specialised browser workloads
- TC39 proposal tracking — evaluate emerging syntax without treating unstable proposals as application requirements
- Custom language tooling — build parsers, transforms, linters, or runtimes for specialist platform work

---

## CSS

Experimental or specialist rendering work beyond middle product styling.

- Scroll-driven animations — coordinate animation timelines with scroll position where progressive enhancement is acceptable
- CSS Houdini — extend painting or layout through low-level browser APIs for specialist visual systems
- Browser rendering internals — diagnose style, layout, paint, and compositing bottlenecks in performance-critical interfaces
- Cross-product design-token governance — evolve tokens and migrations across several frameworks and product teams

---

## SQL

Database-specialist and large-scale operational topics beyond middle application SQL.

- Table partitioning — split very large relations according to measured access and maintenance needs
- Replication and failover — operate redundant database nodes with explicit consistency and recovery trade-offs
- Physical database tuning — tune storage, memory, vacuum, and planner settings from production evidence
- Sharding — distribute data ownership only when a single database can no longer meet proven constraints
- Database internals — study MVCC implementation, write-ahead logging, and storage structures at DBA depth

---

## Git

Repository-platform and specialist internals beyond middle team workflow ownership.

- Monorepo operation at scale — combine ownership, sparse checkouts, build graphs, and release tooling across many teams
- Git object and packfile internals — diagnose storage corruption or performance below ordinary porcelain commands
- Server-side Git administration — operate hooks, access controls, replication, and repository maintenance for a hosting platform
- Organisation-wide migration strategy — move repositories and workflows without losing history, permissions, or delivery continuity

---

## General

Senior or specialist cross-cutting topics beyond middle application ownership.

- Capacity planning — forecast resource growth and failure margins from production workload evidence
- Multi-region reliability — design recovery objectives, failover, and data consistency across geographic regions
- Organisation-wide platform engineering — create reusable delivery paths and governance for many development teams
- Advanced distributed-systems theory — study consensus, clocks, partitions, and formal consistency models when system scale requires it
- Technical strategy and migration leadership — sequence multi-team architectural change while controlling delivery risk

---
