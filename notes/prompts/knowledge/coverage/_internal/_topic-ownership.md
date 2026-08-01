# Coverage topic ownership registry

**Internal component. Not runnable.** This registry makes topic boundaries explicit so a new topic
cannot silently duplicate an existing curriculum. Coverage files remain the scope sources of truth;
this file owns only the boundary between them.

## Contract

- Every coverage topic must have exactly one row before `coverage-prompt` may author it.
- `Owns` states the durable concept family, not a list of current bullets.
- `Excludes / delegates` names the nearest tempting overlap and its owner.
- `Adjacent topics` is the mandatory comparison set for full recalibration and cold ownership review.
- `Mirror position` gives one stable predecessor; global rebuilds derive their order from these links.
- Adding a row requires explicit user authorization and a first-run boundary migration. That migration
  reads all three level files of every adjacent topic, classifies overlaps, and moves concepts to their
  single owner; it never copies them.
- A boundary change is a recalibration trigger for the changed topic and every adjacent topic. Until
  those runs complete, record the affected topic/levels as pending in `_cross-topic-inbox.md`.
- Do not create a new topic merely because a technology has a distinct name. It must represent a
  durable professional competency whose ownership can be separated cleanly from existing topics.

## Registered topics

| Topic | Owns | Excludes / delegates | Adjacent topics | Mirror position |
|---|---|---|---|---|
| Angular | Angular framework behaviour, templates, dependency injection, routing, forms, HTTP integration, RxJS integration, and Angular testing APIs | Language semantics to TypeScript/JavaScript; styling mechanics to CSS; Material/CDK APIs to Angular Material; framework-neutral design to Architecture; threats and defences to Security | Angular Material, CSS, JavaScript, TypeScript, Architecture, Security, General | first |
| Angular Material | Angular Material and CDK components, overlays, tokens, theming APIs, and accessibility behaviour supplied by the library | Angular framework behaviour to Angular; browser styling mechanics to CSS | Angular, CSS | after Angular |
| Spring Boot | Spring ecosystem mechanisms as used to build and diagnose Spring Boot applications, plus Boot-specific configuration, auto-configuration, starters, runtime, data, web, and testing integration | Java semantics to Java; database behaviour to SQL; framework-neutral design to Architecture; threats and defences to Security | Java, SQL, Architecture, Security, General | after Angular Material |
| Java | Java language, standard library, JVM-facing semantics, build fundamentals, and language-level testing mechanisms | Spring framework behaviour to Spring Boot; framework-neutral design boundaries to Architecture | Spring Boot, Architecture, General | after Spring Boot |
| Architecture | Framework-neutral boundaries, dependency direction, API/application structure, design trade-offs, and system decomposition | Framework implementation details to Angular or Spring Boot; language semantics to Java/TypeScript/JavaScript | Spring Boot, Angular, Java, SQL, Security, General | after Java |
| Security | Threats, attack models, authentication/authorization concepts, credential handling, and defensive controls | Concrete client/server integration mechanics to Angular or Spring Boot; Git history mechanics to Git | Angular, Spring Boot, Git, Architecture, General | after Architecture |
| TypeScript | TypeScript's type system, compiler behaviour, modules, and JavaScript interoperation | JavaScript runtime semantics to JavaScript; Angular framework behaviour to Angular | JavaScript, Angular | after Security |
| JavaScript | JavaScript runtime and language semantics, including Promise behaviour and the event loop | Static typing to TypeScript; Observable/RxJS integration to Angular | TypeScript, Angular, General | after TypeScript |
| CSS | Cascade, specificity, selectors, layout, responsive styling, visual rendering, and browser CSS behaviour | Component-framework APIs to Angular/Angular Material; TypeScript or JavaScript behaviour to their language topics | Angular, Angular Material, General | after JavaScript |
| SQL | Relational query language, schema constraints, transactions, indexes, query planning, and database behaviour | JPA and Spring persistence integration to Spring Boot; neutral data-transfer vocabulary to General | Spring Boot, Architecture, General | after CSS |
| Git | Distributed version-control concepts, repository state, history, branching, remotes, integration, recovery, and hosted-review workflow recognition | CI/CD system construction to General; credential incident response to Security | General, Security | after SQL |
| General | Framework-neutral HTTP, JSON, testing vocabulary, configuration, containers, delivery-tool awareness, and cross-stack development fundamentals | Concrete framework implementations to Angular/Spring Boot; threats and defences to Security; design ownership to Architecture | Angular, Spring Boot, Architecture, Git, Security, SQL, JavaScript, Java, CSS | after Git |

## Admitting a new topic

Before its first coverage run, record a short admission decision under this heading:

```text
### {TOPIC} — admitted YYYY-MM-DD

- Professional competency: {why this is independently useful in the target market}
- Owns: {durable concept family}
- Excludes / delegates: {nearest overlaps and their owners}
- Adjacent topics: {complete mandatory comparison set}
- Mirror position: {first, or after one registered topic}
- Migration trigger: first coverage run must use full recalibration and migrate boundary overlaps
```

After adding the decision, add the topic's registry row. Do not create its coverage files or global
mirror heading here; the first `coverage-prompt` run owns those artifacts and the migration.

*(No new topics admitted yet.)*
