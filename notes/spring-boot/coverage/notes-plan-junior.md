# Spring Boot Junior Notes Plan

Plan status: current
Coverage: notes/spring-boot/coverage/junior.md
Coverage SHA-256: b7cb1dbcde90bef75bb05fb7fe680d9ec762b6d627b0c4340eed48e174e4285c
Generated: 2026-10-09

## 00 — What Spring Boot is and how this topic is organised

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/00-intro-spring-boot.md
Spanish: notes/spring-boot/junior/es/00-introduccion-spring-boot.md

Depends on: none

Pending additions: none

Narrative role: the entry point of the whole topic. Victor arrives knowing JavaScript, TypeScript and
Angular, with rusty Node, but never having run a Java backend, so this chapter has to establish what
Spring Boot is, what problem it was built for, the one mental model — an opinionated layer on top of a
container that builds and wires your objects, configured through annotations the framework reads at
startup — that every later chapter reuses, and the route the rest of the files take. Before 01 it must
name, concretely, every baseline this topic stands on, each settled with a link and a one-sentence
reminder rather than a lesson: the Java language layer in `notes/java/junior/en/` — classes,
interfaces, generics, records, exceptions, and annotations as metadata that the compiler, an
annotation processor or a framework reads (the `java` topic's `Annotation metadata`) — plus Lombok,
the annotation processor that writes members into the class at compile time, load-bearing from 01 and
dangerous in 03; Maven — POM, coordinates, dependency resolution, the lifecycle and the wrapper — the
`java` topic's `Maven fundamentals`, assumed from 01, where the parent POM and the Boot plugin are
distinguished from Maven's generic lifecycle; a relational database and the SQL that defines and fills
it — tables, rows, primary and foreign keys, a schema — owned by the `sql` topic and assumed from 01's
datasource, `ddl-auto` and `schema.sql`/`data.sql` material; HTTP and JSON — verbs, status codes,
headers, `Content-Type` — owned by the `general` topic and assumed from 02; the security concepts
chapter 06 implements — what a JWT carries, the same-origin policy, CORS and CSRF — owned by the
`security` topic; and the Spring container itself (beans, injection, scopes, proxies, the transaction
abstraction), owned by the `spring` topic and linked to `notes/spring/junior/en/`. Naming that last
boundary is load-bearing: the container is assumed by chapters 02 onwards and is no longer taught
inside this topic. Six later chapters lean on a `spring` mechanism — injection (02), `@Validated` and
constraint groups (07), the transactional proxy and boundary placement (08), bean-creation failure
(11), `@Profile` registration (13) and class proxying (14) — so the introduction tells the reader
which of them he must have studied in the `spring` topic before which chapter: the proxy pair (08 and
14) changes what those chapters' own advice means, while the other four are deferrable because this
topic teaches the observable behaviour. That warning is phrased about what the reader has studied,
never as a claim that a linked note is not written yet (`HR-11`).

Learning outcome: Victor can explain in his own words what Spring Boot adds on top of the Spring
Framework, what work it takes off a backend developer, how a request travels through the layers of a
Spring Boot application, where it sits in the Angular + Java stack he is being hired for, which
prerequisite topics this one stands on, and why the files that follow are ordered the way they are.

Prerequisites: none.

Must answer:

- What is actually running when someone says "the Spring Boot application is up"?
- Boot is described as "opinionated" — opinionated about what, exactly, and what is the unopinionated
  thing underneath it?
- Who creates the objects in a Spring Boot application if the code never calls `new` on them, and
  which topic teaches that mechanism in full?
- Half the class is missing from the source file and the code still calls its getters — what is
  Lombok doing, when does it do it, and which topic's notes own that mechanism?
- Before opening 01, which pieces of other topics does this one stand on — Java annotations, Maven's
  POM and dependencies, a relational schema, HTTP and JSON, the Spring container — and what is the one
  sentence about each without which 01 and 02 cannot be read?
- What are the layers of this kind of application, what does each one own, and why does the boundary
  between them turn out to be where transactions and DTOs live?
- Where does an incoming HTTP request go, layer by layer, before a response comes back?
- Which parts of this map onto what Victor already knows — Angular's dependency injection, and a Node
  server that created its own HTTP listener — and where does each comparison stop being true?
- Where does Spring Boot sit in the stack Victor is targeting — what is on the other side of the API
  he will build, and what does a Spanish consultancy expect a junior to own here?
- What order do the following files come in, why is that the order that works, and which files in the
  folder are not part of this route?
- Before any of that: which sections does this chapter itself contain, in what order, and why does the
  orientation have to come before the mental model and the route map rather than after them?

Coverage concepts:

- [ ] Spring Framework vs Spring Boot — distinguish the core container and framework modules from Boot's opinionated auto-configuration, starters, executable packaging, and operational defaults

Audit note: the existing `## The IoC container — the one idea everything else depends on` section, the
`### How @ComponentScan actually finds your classes` subsection and the `18-dependency-injection.md`
column of the stereotype table teach the `spring` topic's container concepts: the audit reduces them
to the orientation-level picture (a container builds and wires the application's objects at startup)
plus a link to `notes/spring/junior/en/`, never the full explanation. `## Annotations replace
configuration — the repeating pattern` stays as the topic-wide characteristic — an annotation is
metadata the framework reads at startup in place of configuration code — with its
stereotype-by-stereotype detail cut to that same link.

Rationale: the introduction owns the single distinction that names the topic — framework versus
Boot — and hangs the orientation, the mental model, the stack context, the two external prerequisite
topics and the route map off it.

Handoff: once the reader knows there is a container underneath, a set of layers and an opinionated
startup, the next question is entirely practical — how a real project is created, configured and
started. That is chapter 01.

## 01 — Creating, configuring and starting a Spring Boot application

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/01-basics.md
Spanish: notes/spring-boot/junior/es/01-basicos.md

Depends on: 00

Pending additions: none

Narrative role: chapter 00 described what Boot does; this chapter is where Victor actually has one
running. It covers the mechanisms behind the project he generated — the starters and the
auto-configuration that make a dependency "just work", the annotation on the main class, the build
that produces a runnable artifact, the properties that connect the application to a real database
without hardcoding anything. `@Value` and `@ConfigurationProperties` arrive here rather than in a bean
chapter, because at this level they are how a *setting* reaches the code; the injection mechanism
behind them belongs to the `spring` topic and must be linked, not re-derived.

Learning outcome: Victor can create a Spring Boot project, explain what each starter and the Maven
parent contribute, describe how auto-configuration decides what to configure, package and run the
application, externalise its environment-specific settings including database connection and startup
SQL, and bind each setting to the name and type the code expects.

Prerequisites: 00.

Must answer:

- Why does adding one dependency give a working web server with no configuration file?
- What is a starter actually made of, and why is it not code generation?
- What three things does `@SpringBootApplication` switch on, and what breaks if the class sits in the
  wrong package?
- If the same property is set in a properties file, an environment variable and the command line,
  which one wins, and why is that ordering useful?
- The parent POM and the Boot Maven plugin are both "Spring Boot build things" — which one decides
  dependency versions and which one produces the runnable artifact?
- What does each `ddl-auto` value do to a database that already has tables and rows in it?
- When does Boot run `schema.sql` and `data.sql`, and why can a seeding script silently do nothing?
- A single timeout value and a group of five related JWT settings both live in properties — which
  binding mechanism suits each, and why?
- A property holds two comma-separated values and the field receiving them is declared `String` — how
  many values does the application end up with, and what decides that?
- The hosted deployment sets an environment variable called `APP_CORS_ALLOWEDORIGINS` and the code
  reads `app.cors.allowed-origins` — how does one name turn into the other, and why does a `@Value`
  placeholder written in camel case never see the variable at all?
- A project declares its own bean of a type Boot would otherwise configure, and Boot's version
  disappears — which condition did auto-configuration check, and where can that decision be read?

Coverage concepts:

- [ ] `@SpringBootApplication` — combines configuration, auto-configuration, and component scanning; place it in a root package so the default scan reaches application components
- [ ] Auto-configuration and starters — Boot configures infrastructure conditionally from the classpath, properties, and existing beans, while starters provide a compatible dependency set rather than generating application code
- [ ] Embedded server and executable JAR — a servlet web starter supplies an embedded server so the packaged application can run without deploying a WAR to an external container
- [ ] `spring-boot-starter-parent` and dependency management — inherit compatible dependency and plugin versions while distinguishing that Boot-specific build behaviour from Maven's generic lifecycle
- [ ] Spring Boot Maven plugin — package an executable archive and run the application through Boot-specific goals without confusing the plugin with dependency management
- [ ] Externalized configuration and property precedence — keep environment-specific values outside code and recognise that command-line arguments, environment variables, profile files, and base configuration can override one another
- [ ] Datasource and persistence properties — connect the application to a real database through its URL, credentials, and driver settings, and recognise what each `ddl-auto` value does to an existing schema
- [ ] `@Value` vs `@ConfigurationProperties` — inject an isolated value directly or bind and validate a cohesive typed configuration group when several related settings belong together
- [ ] SQL initialization — understand when Boot runs `schema.sql` and `data.sql` and how initialization differs for embedded and external databases
- [ ] Typed property binding — a property value is converted to the type of the target it is injected into, so a comma-separated value binds to a `List<String>` while a `String` target keeps the separators inside one value
- [ ] Relaxed binding from environment variables — an environment variable overrides a property through its canonical name uppercased, dots turned into underscores and dashes removed (`app.cors.allowed-origins` → `APP_CORS_ALLOWEDORIGINS`), and `@Value` must reference the canonical lower-case kebab-case name for that mapping to apply, so a camel-case placeholder silently ignores the variable

Audit note: two sections of the existing file teach concepts a later entry owns. `## Spring profiles —
per-environment configuration` moves to entry 13, which owns both profile bullets, and
`## @Slf4j — structured logging` moves to entry 12, which owns `Application logging`; each leaves at
most a one-sentence forward reference here. The relaxed-binding bullet lands in or beside
`### Environment variables in application.properties`, which already shows the `${...}` placeholder it
extends.

Rationale: these concepts are the single act of getting one application built, started and pointed at
its environment — the dependency set, the entry point, the packaging, the settings the running process
reads.

Handoff: the application now starts, reads its configuration and talks to a database, but it answers
no HTTP request yet. The next chapter opens the door that clients actually knock on.

## 02 — REST controllers: the HTTP boundary

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/02-rest-controllers.md
Spanish: notes/spring-boot/junior/es/02-controladores-rest.md

Depends on: 00, 01

Pending additions: none

Narrative role: the first chapter where the application does something a client can see. It follows
one request from the servlet dispatcher to a controller method and back out as JSON, draws the line —
the DTO boundary — that every later chapter respects, and ends by publishing that boundary as a
contract other people can read. Three things arrive here before they are taught and must carry the
standard's forward-reference callout rather than being used bare: `@Valid` (taught in 07 — read it
for now as "reject this body if its constraints fail"), *entity* and *bidirectional relationship*
(taught in 03 — here they appear only as the shape that makes a response recurse), and the injected
service instance, whose mechanism belongs to the `spring` topic and must be linked there rather than
explained in passing.

Learning outcome: Victor can write a controller that maps each HTTP verb correctly, bind identity,
filters and bodies from a request, return a deliberate status and body through the status factories
rather than raw integers, shape what leaves the application through dedicated request and response
types rather than exposing persistence classes, and expose the resulting contract as browsable
generated documentation.

Prerequisites: 00, 01.

Must answer:

- What happens between the browser sending a request and the controller method running?
- Two annotations differ by four letters and only one of them writes JSON — what does the other one
  do with a returned string, and why does that difference exist at all?
- A class-level mapping and a method-level mapping use the same annotation, and the method one
  answers DELETE as happily as GET — why, and what narrows it?
- Why does the controller receive a ready-made service instance it never created, and which topic
  explains how?
- The id of the thing and the filter applied to a list both arrive as text in a URL — which one goes
  in the path and which in the query string, and why?
- When should the return type be `ResponseEntity` instead of the object itself?
- The status can be written as a number or chosen from a named factory method — what does the
  compiler do differently in each case?
- A POST created a row — what does a well-behaved API return besides 201, and where does that value
  come from?
- Why does a valid-looking request get rejected with 415 before any of the controller's code runs?
- Why does a perfectly valid JSON body sometimes arrive with every field null?
- Why does returning an entity that points back at its owner crash the response instead of just
  printing more JSON?
- The mapper class "does not exist" according to the IDE but the project compiles on a colleague's
  machine — what kind of problem is that?
- `@JsonIgnore` hides a field on the way out, but the field is still being set on the way in — why,
  and what changes that?
- Where does the generated API documentation get its operations and fields from, and what makes it
  go stale?
- A `LocalDateTime` reaches the Angular client as ISO text rather than as an array of numbers —
  what is doing that conversion, and what would turn it back into the array?
- Why does the API receive one type and return another instead of reusing the persistence class for
  both, and why do validation constraints go on the incoming type only?
- Submitting a time entry for approval changes its state — which verb and URL shape does that use, and
  why is neither a plain POST nor a full PUT honest?

Coverage concepts:

- [ ] Spring MVC request dispatch — follow a request through the servlet dispatcher, handler mapping, argument resolution, message conversion, controller, and exception handling when diagnosing a failed endpoint
- [ ] `@Controller` vs `@RestController` — use view-oriented controller semantics for rendered responses and response-body semantics for APIs whose return values are written through message converters
- [ ] `@RequestMapping` without a method attribute — a class-level mapping contributes the shared path prefix, but the same annotation on a method matches every HTTP verb unless the verb is narrowed
- [ ] HTTP method mappings — select a method-specific mapping that matches the operation's HTTP semantics, including partial updates or state transitions rather than treating every write as POST
- [ ] `@PathVariable` vs `@RequestParam` — bind resource identity from the route and optional filtering or control values from the query string, with names and required/default behaviour declared explicitly
- [ ] `@RequestBody` — bind the request body to a Java object through the configured message converters instead of parsing the payload manually
- [ ] Unsupported media type on a request body — body binding is selected by the request's declared content type, so a missing or non-JSON `Content-Type` is rejected before the controller runs rather than surfacing as a validation failure
- [ ] `ResponseEntity<T>` — use it when status or headers vary dynamically; fixed statuses can use `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status
- [ ] `ResponseEntity` status factories — `ok`, `created`, `noContent`, and `badRequest` state the response's meaning at the call site, so the status is a checked constant rather than an integer literal no compiler can validate
- [ ] Created responses and the resource location — build the new resource's URI from the current request when reporting a successful creation, rather than returning the entity with a default status
- [ ] HTTP message conversion and Jackson — content negotiation and configured message converters turn request and response bodies into Java values and JSON rather than the controller serialising text manually
- [ ] Jackson response shaping — rename, omit, or format individual fields through serialization annotations, and know that Boot registers Java date/time support so temporal fields serialise as ISO text rather than numeric objects
- [ ] Jackson deserialization requirements — an incoming body is populated through a record's canonical constructor, an annotated creator, or a no-argument constructor plus mutators, which is why an otherwise valid DTO can arrive with every field null
- [ ] Bidirectional relationship serialization — returning an entity whose association points back at its owner makes Jackson recurse until the response fails, so break the cycle at the boundary with a response DTO rather than patching it with reference annotations
- [ ] Request and response DTO implementation — implement incoming and outgoing contracts as separate records or classes and attach validation constraints to the untrusted input type only
- [ ] Entity-to-DTO mapping implementation — write the conversion by hand or generate it with an annotation-processor mapper whose implementation class exists only after a build, which is why a missing generated mapper is a build-configuration problem rather than absent source code
- [ ] `@JsonIgnore` and serialization access — an ignore annotation suppresses a field in both directions unless the access mode is narrowed, so it is a local serialization rule rather than a substitute for a dedicated response type
- [ ] OpenAPI generation — expose a browsable, generated HTTP contract for frontend and QA consumers from the existing controller and DTO declarations

Audit note: `### UserRepository` is reduced to a marked preview of chapter 04: the controller example
shows the service it calls, and the repository appears only as "the object that loads users, taught in
04".

Rationale: every one of these concepts is a step on the same journey of a single HTTP request —
matching it to a method, reading its parts, converting its body, and writing a deliberate response —
so they can only be taught as one continuous trace; generated documentation closes the chapter
because it is that same trace read back out of the controllers and DTOs the reader has just written,
not a separate tool. This is the second-largest chapter of the level and the note must therefore
declare an internal route rather than one flat list of annotations: (a) how a request reaches a
method — dispatch, mapping, verb selection, (b) reading its parts — path, query, body, and the
content type that decides whether the body is read at all, (c) writing a deliberate response —
status, factories, location header, (d) the DTO boundary and what must never cross it, (e) the
published contract.

Handoff: the controller has a shape to send back and nothing real to put in it. Chapter 03 turns the
domain classes into rows of the database chapter 01 connected.

## 03 — Spring Data JPA: entities and relationship mapping

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/03-spring-data-jpa.md
Spanish: notes/spring-boot/junior/es/03-spring-data-jpa.md

Depends on: 00, 01

Pending additions: none

Narrative role: the mapping half of persistence, and the chapter that has to explain the persistence
context, because almost every surprising behaviour in later chapters — stale reads, lazy loading
failures, deferred constraint errors — traces back to it. It turns one Java class into one table, then
connects classes to each other, and it is where the Lombok annotations Victor already puts on
everything become genuinely dangerous for the first time. Two things the persistence context depends
on arrive later and must carry the standard's forward-reference callout rather than being used bare:
loading and saving through a repository (taught in 04 — read `findById` for now as "load this row as a
managed object") and the transaction whose commit is the moment a managed change is flushed (its
boundary is chapter 08, its timing chapter 11). The preview must say the condition, not only the
behaviour: the change is written when the transaction that loaded the object commits, and chapter 08
shows that without a declared service boundary that transaction ends with the repository call itself,
so the same code can silently write nothing.

Learning outcome: Victor can map an entity and its relationships to a schema, choose identifier,
column, enum, timestamp, equality and fetch strategies deliberately, and explain what "managed" means
well enough to predict when a change reaches the database without a `save()` call.

Prerequisites: 00, 01.

Must answer:

- What does "managed" mean, and why does changing a loaded object update the row without calling
  `save()`?
- The class looks like a normal Java class and the application refuses to start — which three things
  does a mapped type owe the provider, and what happens when the annotation is simply absent?
- The table is called `user` and every query fails with a syntax error — what collided, and what are
  the three ways out?
- The primary key strategy that works on one database bootstraps and fails on another — what is
  actually different, and why is the failure reported before the first request?
- Which side of a relationship owns the foreign key, and what goes wrong when neither side declares
  it?
- Deleting a child from a parent's collection leaves the row in the table — which setting was
  missing, and how is that different from cascading a delete?
- The enum was reordered and last month's rows now mean something else — what was stored, and what
  should have been?
- Why can the generated `equals`, `hashCode` and `toString` on an entity be actively dangerous when
  the same annotations are harmless on a DTO?
- The field was `Boolean` and is now `boolean`, and suddenly nothing compiles — what did Lombok
  rename, and why is the compiler's complaint the good outcome here?
- Both sides of a relationship can be loaded now or later, and the defaults are not the same in both
  directions — what are they, and why were they chosen that way?
- A creation timestamp the provider populates once on insert is rewritten by a later update of the
  same entity — what does the generated UPDATE statement contain, and which mapping keeps that column
  out of it?
- A managed object was changed and nothing called `save()` — at which moment does the UPDATE reach the
  database, and under what condition does the same change never reach it at all?
- `nullable = false` and `unique = true` sit on a field — does anything check them in Java, or do they
  only shape the schema, and when does a violation surface?
- Both entities declare `@ManyToMany` to each other and the schema grows two join tables — what was
  missing?
- `@CreationTimestamp` and `@PrePersist` both fill a creation date — who calls each one, and what does
  choosing one tie the code to?

Coverage concepts:

- [ ] Persistence context and entity state — recognise managed, detached, and removed entities and understand why dirty checking can flush a managed change without another repository `save()`
- [ ] `@Entity` requirements — a mapped type needs an identifier, an accessible no-argument constructor, and a non-final class, and a class missing the annotation entirely is not mapped at all
- [ ] Entity table naming — use `@Table` when the mapped table differs from the default and avoid reserved-word conflicts through a deliberate physical name, quoting policy, or naming strategy
- [ ] Identifier mapping and generation — mark the primary key and choose between identity columns and sequences according to the target database, because a bootstrap failure over a missing or unsupported identifier is reported before the application serves a request
- [ ] JPA column nullability and uniqueness — express schema intent on the mapping so the generated or validated schema matches the domain rules
- [ ] Lombok generated equality on entities — identifier-based `equals` and `hashCode` behave inconsistently while an entity is still unsaved, so generated implementations must be chosen deliberately rather than accepted by default
- [ ] Lombok generated `toString` on entities — including associations in a generated string can trigger lazy loading or recurse across a bidirectional relationship, so relationship fields must be excluded
- [ ] Boxed vs primitive boolean fields and Lombok getter naming — a `Boolean` field defaults to `getX()`, while a primitive `boolean` field defaults to `isX()` (JavaBean convention); switching a field's type to close a nullable-unboxing bug renames every call site's getter, and the compiler catches the mismatch
- [ ] Many-to-one ownership — map the foreign-key side with `@ManyToOne` and name its column with `@JoinColumn`
- [ ] `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; a one-to-many with neither `mappedBy` nor `@JoinColumn` produces an unexpected join table
- [ ] Many-to-many ownership — map the join table on one owning side with `@JoinTable` and point the inverse side back with `mappedBy` rather than creating two independent associations
- [ ] Cascade vs orphan removal — propagate selected persistence operations to related entities or delete a managed child when it is removed from its parent's collection
- [ ] Enum string vs ordinal persistence — store stable names when enum reordering or insertion must not silently change the meaning of existing rows
- [ ] Hibernate timestamps vs JPA lifecycle callbacks — choose provider convenience or portable entity callbacks deliberately when populating audit timestamps
- [ ] `FetchType.LAZY` vs `FetchType.EAGER` — deferred versus mandatory relationship loading, with the defaults deliberately asymmetric: to-one associations load eagerly and to-many associations lazily, so fetching must be chosen per use case rather than fixed globally
- [ ] Immutable column mapping — `@Column(updatable = false)` excludes a column from the UPDATE statement the provider generates, so a write-once field such as a creation timestamp cannot be rewritten by a later change to the entity

Audit note: the audit is not additive. The repository and query half of the existing file moves to
entry 04: the sections `## JpaRepository — what you get for free`, `## Repositories group by entity,
not by feature — a different axis than controllers/services`, `## Derived query methods`,
`## Pagination — Pageable and Page<T>`, `## The N+1 problem`, `## save() — insert or update` and
`## Aggregation queries and interface projections` are removed here, and `## Where this leaves you —
and what comes next` is rewritten as the handoff to 04. Leaving them in place would duplicate the whole
of chapter 04.

Rationale: every concept here is a decision made on the mapping itself — what a table is called, what
the key is, what a column allows, what an association owns, and how much of it loads — and they are
only meaningful as one act, because the same annotations that describe the schema also decide what
happens in memory. Fetch type belongs with the relationship it annotates; the query-shaped consequence
of that choice is chapter 04's opening problem.

Handoff: the domain is now mapped, and nothing has read a single row back out of it. Chapter 04 is
where the data comes back.

## 04 — Repositories and queries

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/spring-boot/junior/en/04-repositories-and-queries.md
Spanish: notes/spring-boot/junior/es/04-repositorios-y-consultas.md

Depends on: 02, 03

Pending additions: none

Narrative role: the query half of persistence, split out of the old combined JPA file because mapping
a class to a table and getting data back out of it are two different mental models, and the combined
file had grown past nine hundred lines. Two of its bullets reach forward and must carry the standard's
forward-reference callout rather than being used bare: `@Modifying` requires an active transaction and
`save()` depends on the persistence-context lifecycle, and the boundary that opens both is only taught
in chapter 08 (with the flush timing in 11). It starts from the interface Victor declares and never
implements, works up through derived names, written queries, projections, sorting and pagination, and
ends on the failure the mapping decisions of chapter 03 quietly set up: the N+1. It also re-enters the
controller once, and deliberately: `Pageable` and `@PageableDefault` are a repository concern declared
at the HTTP boundary, so the page, size and sort a client sends are resolved by the argument
resolution taught in chapter 02 before the repository ever sees them. The N+1 section shows the
statements it counts, so it carries a marked preview of turning on Hibernate's SQL output, whose
mechanism chapter 11 owns.

Learning outcome: Victor can obtain data through inherited, derived and declared repository queries,
choose between an entity, a projection and a page as the return shape, and explain what SQL each
choice produces — including how many statements actually run.

Prerequisites: 02, 03.

Must answer:

- The interface has no implementation and no code — what is calling the database at runtime?
- Why does `save()` sometimes issue an UPDATE when the intent was to insert a new row?
- Both `findById` and `getReferenceById` return "the entity" — what is actually different, and when
  does the cheap one blow up?
- Why does Spring Data hand back an `Optional` instead of null, and what does that force at the
  service boundary?
- When is a derived method name the right tool and when does it need replacing with a written query?
- The list must come back ordered by two different keys in two different directions — where does that
  instruction go, and why is it not part of the query text?
- The endpoint needs three columns out of a fifteen-column entity — what is the lightest thing that
  can be returned, and what must match for it to work?
- A declared update query ran successfully and the object in memory still shows the old value — why?
- The same query can be written against the entity or against the table — what does dropping to the
  database's own SQL give up, and is what comes back still a managed entity?
- The client only wants to know whether there is another page — what does asking for the total count
  as well actually cost?
- Why does one innocent-looking loop over a list fire a hundred queries, and what makes the fix a
  query change rather than a mapping change?
- The endpoint declares a default sort with a unique tie-breaker, but a client sending `?sort=date` sees rows repeat across pages — what happened to the tie-breaker, and why can the incoming `Pageable` not simply be edited?
- A monthly summary of three numbers loads every entry of the month and folds it in Java — what does that cost that the numbers themselves do not, and how does the query state the answer instead?
- The service has already loaded the entry to check who owns it and whether it is still a draft —
  what does calling `deleteById(id)` next actually send to the database, and whose "not found" rule
  decides what happens when the row is gone?

Coverage concepts:

- [ ] `JpaRepository` CRUD contract — recognise the inherited persistence, lookup, existence, listing, and deletion operations before declaring redundant repository methods
- [ ] `Optional` single-result contract — Spring Data returns an absent value rather than null from a single-result finder, which is what makes the "not found" branch explicit at the service boundary
- [ ] `findById` vs `getReferenceById` — one loads the row immediately and reports absence, the other returns an uninitialised reference that is cheap for setting a foreign key but fails on first access outside an open persistence context
- [ ] `save()` insert vs update — recognise that Spring Data decides whether an entity is new before delegating to persistence, so `save()` is not a synonym for SQL INSERT
- [ ] Derived query methods — let Spring Data derive simple lookups and existence checks from repository method names, switching approach when the name stops expressing the query clearly
- [ ] `Sort` as a repository parameter — hand a `Sort` to `findAll` or add it as the last parameter of a derived query, and Spring Data applies the ordering on top of the query rather than parsing it as a criterion; `Sort.Order` gives each key its own direction when one blanket `.ascending()` would be wrong
- [ ] JPQL vs native SQL in `@Query` — prefer entity and attribute names for portable persistence queries and opt into database SQL only when the required behaviour justifies tighter coupling
- [ ] Interface-based projections — declare a getter-only interface matching the `AS` aliases of a `@Query` (or a derived query's implicit column names) and Spring Data populates it without a full entity or DTO class; read-only, and the getter names must match the aliases exactly
- [ ] `@Modifying` write queries — a declared update or delete query needs the modifying marker and an active transaction, and it bypasses the persistence context, so already-loaded entities can be left stale afterwards
- [ ] Spring Data pagination — accept a `Pageable` and return a bounded result, and know that page number, size, and sort arrive as request parameters bound automatically
- [ ] `Page<T>` vs `Slice<T>` — return total-count metadata only when the client needs it, because a slice can answer whether another chunk exists without an additional count query
- [ ] N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`
- [ ] `@PageableDefault` is a default, not a floor — a client-supplied `page`, `size` or `sort` replaces the annotation's value entirely rather than merging with it, so any invariant the default was carrying (such as the unique tie-breaker that makes an order total) has to be re-applied to the incoming `Pageable`; `Pageable` and `Sort` are immutable, so re-applying it means rebuilding them rather than mutating what arrived
- [ ] Aggregating in the database vs in memory — a read whose answer is a handful of scalars states them as `SUM`/`COUNT` in the query itself, because loading every matching row as a managed entity to fold it in Java pays for the persistence context and grows with the data while the result stays the same size
- [ ] `delete(entity)` vs `deleteById(id)` — `deleteById` is itself a `findById` followed by the delete, so a service that already loaded the entity to check ownership or state asks for it a second time, and it also absorbs the absent case silently under a different not-found policy than the guard that loaded it

Audit note: this entry's prose is not written from scratch. It absorbs, from
`notes/spring-boot/junior/en/03-spring-data-jpa.md` and its Spanish counterpart, the seven sections
entry 03's `Audit note` moves out: `## JpaRepository — what you get for free`, `## Repositories group
by entity, not by feature — a different axis than controllers/services`, `## Derived query methods`,
`## Pagination — Pageable and Page<T>`, `## The N+1 problem`, `## save() — insert or update` and
`## Aggregation queries and interface projections`. The extraction must carry over the validated
aggregation material — the `SUM` + `GROUP BY` JPQL query, its literals, the `YearMonth` range and the
interface projection it returns — which is real, already reviewed, and owned here by
`Interface-based projections`.

Rationale: these are all the same act — asking the repository a question and controlling the shape,
order, size and cost of the answer — and the N+1 closes the chapter because it is the point where a
mapping decision from chapter 03 and a query written here collide, which is exactly how it is met in
practice.

Handoff: the persistence layer now throws real failures — absent rows, constraint breaches, invalid
state. Chapter 05 decides what the client sees when that happens.

## 05 — Exception handling and the error contract

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/05-exception-handling.md
Spanish: notes/spring-boot/junior/es/05-manejo-excepciones.md

Depends on: 02, 04

Pending additions: none

Narrative role: the chapter that closes the failure half of the HTTP boundary opened in 02. Until now
every example assumed the happy path; here every way a request can fail gets a deliberate status and
a stable JSON body. Two of its concepts reach forward and must be written as marked previews rather
than assumed knowledge: `@Valid`, whose failure this chapter handles but which is only taught in 07,
and the servlet filter chain, which is only built in 06 — here it appears strictly as the answer to
why some failures never reach an advice at all.

Learning outcome: Victor can define domain exceptions, map each one to its intended status through
advice, produce one consistent error body across the API, and explain which failures never reach his
handlers at all.

Prerequisites: 02, 04.

Must answer:

- Two handlers could match the exception that was thrown — which one runs?
- Three different places can set the status of a failure; how do you tell which one is in play in
  code you did not write?
- Why does an unhandled exception come back as a body with a timestamp and a path but no message?
- What fields does every error response carry, and how does the Angular side tell a validation
  failure from a missing resource without parsing prose?
- Why does an authentication failure ignore the exception handler that works everywhere else?
- Filters, interceptors and advice all "run around the request" — where does each one sit, and which
  one is the right place for a concern that must also see requests no controller ever handles?
- Two different inputs of the same request fail with the same status and need the message rendered under different field names — why is that not two exception types?
- A handler class annotated `@ControllerAdvice` returns an error object and the client does not get
  JSON — what does `@RestControllerAdvice` add, and when does plain advice still write JSON?
- A request body fails `@Valid` — which exception does Spring throw, and what does the client receive
  if no handler claims it?

Coverage concepts:

- [ ] `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody`
- [ ] `@ExceptionHandler` resolution — the most specific declared exception type wins over a supertype handler, and an advice's scope decides which controllers it serves, so an unexpectedly generic response usually means the wrong handler matched
- [ ] `ResponseStatusException` and `@ResponseStatus` on an exception — a status can be attached at the throw site or to the exception type instead of through advice; recognise all three routes because maintained code mixes them and the advice never fires for a status already resolved
- [ ] Domain exceptions — represent meaningful application failures as dedicated types so a handler can map each one to its intended status
- [ ] `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- [ ] Error response contract — map failures to consistent status and body fields so API clients can handle validation, absence, conflict, and unexpected errors predictably
- [ ] Boot's default error handling — an exception no handler claims is forwarded to the built-in `/error` endpoint, which builds the status, timestamp, and path body and omits the exception message and binding details until the matching `server.error.include-*` properties are enabled
- [ ] Filter-chain exceptions vs controller advice — exceptions raised before controller dispatch do not automatically pass through `@RestControllerAdvice`, so authentication failures need handling at the security boundary
- [ ] Filter vs MVC interceptor vs controller advice — use servlet filters for request-chain concerns, interceptors around mapped handlers, and advice for controller exception/response behaviour
- [ ] A domain exception carries the field its message belongs to — the exception type decides the status while a field carried on the instance decides which input the message is rendered under, so one handler serves every field-scoped failure of that status instead of one exception type per field

Rationale: these concepts are one path — a failure is raised somewhere, something decides its status,
and a body is written — and the junior mistakes all come from not knowing which link in that path
handled it.

Handoff: the error contract now covers everything a controller can throw, and its one blind spot is
the request-chain stage before dispatch. That stage is exactly where security lives, which is chapter
06.

## 06 — Spring Security and JWT authentication

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/06-security-jwt.md
Spanish: notes/spring-boot/junior/es/06-seguridad-jwt.md

Depends on: 02, 03, 04, 05

Pending additions: none

Narrative role: the chapter that puts a guarded door in front of everything built so far. It is the
longest one at this level for a reason: an authenticated request is a single continuous mechanism
that runs from the filter chain through credential verification and token issuance to the authority
check on a method, and stopping halfway leaves an endpoint that is either open or unusable. It also
takes back one concept that looks like it belongs to chapter 05 — the difference between a hand-written
business exception and the framework's own `AccessDeniedException` — because that contrast cannot be
taught before the reader knows what the framework throws and where. This is the third chapter to use
`@Valid` on a request body before chapter 07 teaches it, so the forward-reference callout the standard
requires must appear here too, exactly as it does in 02 and 05.

Learning outcome: Victor can configure a stateless bearer-token security chain, implement login
against encoded passwords, issue and validate a signed token, place the authenticated principal where
services and controllers read it, enforce access at both the route and the method level, and give a
security-boundary failure the same error contract as the rest of the API.

Prerequisites: 02, 03, 04, 05.

Must answer:

- Where in the request's journey does security run, and what has already happened when the custom
  filter executes?
- Why does a token-based API switch sessions off, and what exactly is it giving up by doing so?
- Why is disabling CSRF correct here and wrong for the cookie-authenticated endpoint in the same
  application?
- The browser sends an `OPTIONS` request nobody wrote a handler for — what is it, and why does the
  security chain reject it before the real call is ever made?
- Two tokens of the same class appear in the login code, one with authorities and one without — what
  does each one mean, and what breaks if they are swapped?
- The request has no token at all, so why is the authentication object in the context not null?
- What does the application compare when it checks a password, given that the stored value cannot be
  reversed?
- The stored password begins with `{bcrypt}` — what reads that prefix, and what would break in a
  system whose stored hashes were written by two different algorithms?
- The token was rejected — how does the code tell an expired token from a malformed one from a
  forged signature, and why must each reach the client differently?
- What exactly is inside a JWT, and what stops a client editing its own role claim?
- Why does a correctly authenticated user get rejected by `hasRole` while `hasAuthority` lets them
  through?
- No token and a token without the right role are two different refusals — which component answers
  each one, and how do you tell from the response which one fired?
- The account was disabled an hour ago and the request is still being served — what was checked only
  once, and where must the check be repeated?
- The application's own "you may not touch this" exception and Spring Security's look identical in
  the response — why does one handler not catch both?
- Why does an endpoint annotated with `@PreAuthorize` sometimes let everyone in and log nothing?
- A `permitAll` rule names a path prefix and the endpoint added to that controller next month is public before anyone decides it should be — what does naming the method and the exact path change?
- An `Authorization: Bearer ` header with nothing after it returns the container error page instead of the API error body, even though the filter catches the parser's exceptions — which exception is not in that family, and why does the parser throw it?
- The caller's identity can be read from a static holder anywhere in the code or taken as a method
  argument in the controller — what resolves the argument, and why is the argument the one to reach
  for first?
- Nothing in the login code calls `loadUserByUsername` or the encoder — what does `authenticate()`
  run, in what order, and why must the configuration publish the manager as a bean before the login
  service can use it?
- A rule permitting the login path is written after the authenticated catch-all and login now demands
  a token — why does the order of the rules decide this?
- The JWT filter returns early without calling the rest of the chain — what does the client receive,
  and when is stopping the chain the right thing to do?
- The security starter was added and every endpoint, including ones nobody configured, now refuses
  anonymous calls — what switched that on, and why does `@PreAuthorize` need a separate switch?

Coverage concepts:

- [ ] Web security activation — Boot activates web security from the classpath without an explicit enabling annotation, while method security is a separate switch that must be turned on deliberately
- [ ] `SecurityFilterChain` — declare the chain as a bean and place a custom authentication filter at the correct position relative to the framework's own filters, because order decides what has already run when it executes
- [ ] Security route rules — declare specific public and role-protected matchers before the authenticated catch-all because matcher order controls which rule applies
- [ ] `@PreAuthorize("hasRole('MANAGER')")` — a method-level check evaluated after authentication, which is silently ignored unless method security is enabled
- [ ] URL rules vs method-level checks — the two enforcement points are independent, so a permitted route can still be refused by an annotation and a protected route is refused before the method is ever reached
- [ ] `hasRole` vs `hasAuthority` and the `ROLE_` prefix — role checks add the prefix for you while authority checks compare the stored string literally, so a mismatch between how authorities are persisted and how they are checked rejects a correctly authenticated user
- [ ] `AuthenticationEntryPoint` — produces the response when a request arrives unauthenticated, and is the only way to give that failure the same JSON error contract as the rest of the API, because it fires in the filter chain before any controller advice can see it
- [ ] `AccessDeniedHandler` — produces the response when an authenticated caller lacks the required authority, the security-boundary counterpart to handling `AccessDeniedException` in controller advice; where the refusal happens decides which one fires
- [ ] A custom exception vs Spring Security's `AccessDeniedException` — a hand-thrown business-rule exception has no inheritance relationship with the framework's own, even when both are mapped to 403; each needs its own `@ExceptionHandler`
- [ ] Re-checking account status per request, not just at login — a token issued before an account is disabled stays technically valid until it expires, so a stateless JWT filter must re-run an account-status check (`AccountStatusUserDetailsChecker`) on every request against the freshly loaded `UserDetails`, not rely on the check `loadUserByUsername` already ran once at login
- [ ] Stateless session configuration — a bearer-token API sets the session creation policy so no server session is established, which is what makes each request stand alone
- [ ] CSRF configuration for a bearer-token API — the decision to disable or retain CSRF follows from how credentials travel, so a cookie-authenticated endpoint in the same application still needs it
- [ ] CORS with Spring Security — a shared `CorsConfigurationSource` keeps policy central and lets the security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local controller policy
- [ ] Preflight through the security chain — permit or correctly process browser `OPTIONS` requests so authentication rules do not reject the preflight before the real cross-origin request is sent
- [ ] `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- [ ] `PasswordEncoder` contract — verify a submitted password by matching it against the stored encoded value through the encoder, never by comparing or reversing the stored string
- [ ] `DelegatingPasswordEncoder` and encoded-id prefixes — recognise stored values such as `{bcrypt}...` and understand that the prefix is what selects the encoder used to verify them
- [ ] `AuthenticationManager` delegation — authenticating a submitted credential runs the configured provider, which loads the user through `UserDetailsService` and verifies the password through the encoder
- [ ] Exposing the authentication manager — the manager is not injectable by default, so a login service that authenticates programmatically must publish it as a bean from the security configuration
- [ ] `OncePerRequestFilter` — process JWT authentication once in the normal request dispatch and always continue or terminate the filter chain deliberately
- [ ] `SecurityContextHolder` — thread-local storage where the authentication filter places the authenticated principal for the current request, and where a service reads it from
- [ ] `@AuthenticationPrincipal` — resolve the authenticated user as a controller method argument instead of reaching into the static context holder
- [ ] Anonymous authentication — an unauthenticated request may still have an anonymous `Authentication` object, so code must check authentication state rather than assuming the context value is null
- [ ] `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- [ ] JWT issuance — derive a signing key from configured secret material and sign the claims the application will later trust, keeping that material out of the source tree
- [ ] JWT validation failure modes — parsing under the same algorithm and key distinguishes an expired token, a malformed token, and a bad signature, and each should reach the client as a deliberate response rather than a server error
- [ ] JWT claim-to-authority mapping — load the user or map trusted role claims into Spring Security authorities before placing the authenticated token in `SecurityContextHolder`
- [ ] Matcher breadth on a public rule — a `permitAll` matcher scoped to a path prefix authorises endpoints that do not exist yet, so naming the HTTP method and the exact path keeps a handler added later to the same controller behind the authenticated catch-all
- [ ] A library's exception hierarchy is not the whole failure surface — a JWT parser signals an absent, empty, or blank token with `IllegalArgumentException`, which is unrelated to its own `JwtException` family, so a filter catching only that family lets the case escape past the security boundary and the caller receives the container's default error page instead of the API's error contract

Rationale: chain configuration and JWT authentication are inseparable at this level because the chain
is what runs the filter, the filter is what turns a token into a principal, and the authority checks
only work on the principal the filter stored — teaching either half alone produces an application
that authenticates but authorises nothing, or guards routes nobody can pass. Because this is the
longest note of the level, it must follow a declared internal route: (a) the filter chain and where
security sits in the request, (b) proving who the caller is — users, encoded passwords, the
authentication manager, (c) issuing and validating the token, (d) placing and reading the principal,
including the account-status re-check the stateless model forces on every request, (e) deciding what
that principal may do, at the route and at the method, and what answers each kind of refusal, (f) the
browser-policy layer — CORS, preflight, CSRF — which is a separate model and must be signposted as one.

Handoff: the login endpoint that chapter used accepts whatever JSON arrives and trusts it. Chapter 07
takes the `@Valid` annotation it used without explanation and makes input validation deliberate.

## 07 — Bean Validation at the input boundary

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/07-validation.md
Spanish: notes/spring-boot/junior/es/07-validacion.md

Depends on: 02, 03, 05, 06

Pending additions: none

Narrative role: chapters 02 and 06 both put `@Valid` on a request body without saying what it does.
This chapter makes the input contract explicit and explains why a rule enforced only by the database
produces the wrong HTTP status. The dependency with 05 runs both ways and both sides are written down
deliberately: 05 handles `MethodArgumentNotValidException` as a marked preview of this chapter, and
this chapter assumes the error contract 05 established rather than inventing a second one. The cycle
is unavoidable — a validation failure is an HTTP failure — and this order resolves it. The
`@Validated` variant and validation groups are deliberately not here: they belong to the `spring`
topic's validation integration, and this chapter links to it rather than half-teaching it. The
database half of that contrast is a marked preview: the column violation surfaces when the transaction
flushes, a timing chapter 11 traces.

Learning outcome: Victor can declare the right constraint for each field, trigger validation at the
controller boundary including nested objects and collections, and handle the two distinct validation
failure families deliberately.

Prerequisites: 02, 03, 05, 06.

Must answer:

- Which of `@NotNull`, `@NotEmpty` and `@NotBlank` does a text field actually need, and what does
  each one let through?
- The outer DTO is valid but the object inside it is nonsense — why did nothing reject it?
- The dependency is on the classpath and the annotations are on the fields, and nothing is being
  rejected — what else has to be present for a constraint to actually run?
- Why does the same broken rule return 400 when it is a constraint and 500 when it is a column
  definition?
- Why does validating a path variable throw a different exception than validating a body?
- A minimum-length rule on the field carrying the *current* password locks out an account created under an older policy — which of the two fields does a policy constraint belong to, and why?
- A blank description comes back as `must not be blank`, lower case and generic, beside the API's own
  `Date cannot be in the future` — where does that default text come from, and where is it reworded
  once so that every DTO's field errors speak in the same voice?

Coverage concepts:

- [ ] `@Valid` on `@RequestBody` — trigger cascaded validation of the deserialized request DTO at the controller boundary before business logic runs
- [ ] Nested and collection cascading — a nested object's own constraints run only when the field or the collection's type argument is marked `@Valid`, while container element constraints such as `List<@NotBlank String>` are checked without it, so a validated outer DTO can silently accept an invalid inner payload
- [ ] Validation starter and runtime integration — include Jakarta Validation plus its implementation and Spring integration so constraints are discovered and executed rather than merely present as metadata
- [ ] `@NotNull` vs `@NotEmpty` vs `@NotBlank` — choose whether null, emptiness, or whitespace-only text violates the input contract rather than applying one constraint to every field type
- [ ] Constraint selection — choose semantic constraints for sign, size, format, range, or pattern so the annotation matches the business rule rather than merely rejecting some bad examples
- [ ] Bean constraints vs database constraints — a validation annotation rejects bad input before business logic with a client error, while a column constraint fails at flush time as a server error, so the same rule expressed only in the schema produces the wrong response
- [ ] Controller method validation — apply constraints to controller parameters and handle their failures separately from request-body binding errors
- [ ] Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters use different exception families; handle both deliberately instead of assuming every violation is a `ConstraintViolationException`
- [ ] Policy constraints vs verification fields — a field the request submits for comparison against a stored value carries only the constraints that make the comparison possible, because a policy rule such as a minimum length runs before the comparison and rejects a legitimate value created under an earlier policy
- [ ] Constraint messages — a constraint with no `message` takes its provider's default template, which is lower-case and generic, so the templates the API uses are overridden once in `ValidationMessages.properties`, the resource bundle Bean Validation reads first, and every field error the client renders shares the API's own voice

Rationale: these concepts form one gate — activating constraints, choosing them, cascading them, and
handling the two ways they can fail — and the gate only makes sense placed against the alternative of
letting the database reject the data instead.

Handoff: input is now trustworthy by the time it reaches the service, which raises the next question:
what happens when a service does several repository calls and the third one fails. That is chapter 08.

## 08 — The service transaction boundary and the open session

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/08-transactions.md
Spanish: notes/spring-boot/junior/es/08-transacciones.md

Depends on: 01, 02, 03, 04, 05

Pending additions: none

Narrative role: the chapter that answers what a repository call is really wrapped in, and why a
relationship that loads perfectly inside a service explodes in the controller once Boot's open-session
default is switched off — and what that default costs while it is on, including a pooled connection
held for the whole request. It depends on 02 because that default is defined by what happens while the
response is being rendered. Transactional semantics themselves — rollback rules, propagation,
`readOnly`, the proxy that opens the boundary — are owned by the `spring` topic and must be linked,
not re-derived; what belongs here is the Spring Data consequence: a service that never declares a
boundary still has one per call, and the persistence context lives and dies with it. The same boundary
is also the moment a database connection is borrowed and handed back, so the datasource chapter 01
configured by URL and credentials is finally seen as what it is at runtime — a pool lending a fixed
set of open connections to one unit of work at a time. That is placed here and not in 01 because "unit
of work" means nothing before this chapter defines it.

Learning outcome: Victor can explain what atomicity an unannotated service actually has, predict where
the persistence context closes, including what Boot's open-session default changes about that,
diagnose and fix a `LazyInitializationException` by choosing between mapping the data inside the
boundary and loading the relationship in the query, and explain which connection a unit of work runs
on, where it comes from and why a pooler placed in front of the application's own pool can break it.

Prerequisites: 01, 02, 03, 04, 05.

Must answer:

- The service called three repository methods and the third failed — what is in the database now?
- Nobody wrote `@Transactional` anywhere and the application still commits — who opened the
  transaction, and how wide was it?
- Why does `getUser().getProjects()` work inside the service and throw in the controller?
- The same lazy access works in one endpoint and fails in another in the same application — what is
  different about the two?
- Two fixes are offered for the same exception — mapping to a DTO earlier, or fetching the
  relationship in the query — and what decides which one is right?
- Opening a fresh connection to PostgreSQL for every request would be slow — what does Boot put
  between the application and the database instead, which settings control how many connections it
  keeps, and what does a request do when all of them are lent out?
- The application works against a local database and fails against a hosted one reached through the
  provider's transaction-mode pooler — what does the application's pool assume about a connection that
  such a pooler does not guarantee?
- Boot keeps lazy loading working while the response is being written unless it is told not to — what
  keeps the session open, why does that hide the queries being run, and why does it hold a database
  connection until the response is sent?
- The fix for both the half-written use case and the lazy-loading failure is the same annotation on
  the service method — what does it change about where the transaction and the persistence context
  begin and end, and which topic teaches its rules in full?
- This chapter says "session" for the Hibernate session and for the database connection's session, and
  chapter 06 switched off a third kind — which is which, and which one does each failure here involve?

Coverage concepts:

- [ ] Spring Data repository default transactionality — repository CRUD methods carry their own transaction boundary, so an unannotated service commits every call independently with no atomicity across the whole use case
- [ ] `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed; fix by converting to a DTO inside the service transaction or loading the relationship deliberately in the query
- [ ] Datasource connection pool — Boot backs the `DataSource` with HikariCP, which keeps a set of open connections and lends one to each unit of work instead of opening a connection per request; recognise its `spring.datasource.hikari.*` settings and why an external transaction-mode pooler in front of it breaks the session state the pool relies on
- [ ] Open EntityManager in View — recognise that Boot's web default can keep lazy loading available during response rendering, why this can hide query behaviour, and why DTO mapping should happen inside an explicit service transaction

Audit note: `## What is a transaction — the all-or-nothing unit` stays as the working definition this
chapter needs, and `## Where to put @Transactional` is reduced to the one placement this chapter's
fixes use — the externally called service method — with a link to the `spring` topic for the placement
rules. `## Read-only transactions — @Transactional(readOnly = true)`, `## @Transactional does not work
on private methods`, `## Transaction propagation — REQUIRED, REQUIRES_NEW, NESTED, SUPPORTS`, `##
Isolation levels — what other transactions can see while yours runs` and `## Common mistake — catching
the exception inside the method` teach `spring`-topic semantics: each is reduced to a one-sentence
pointer to `notes/spring/junior/en/`, and the removed prose is reported for the `spring` junior plan
to claim. `## LazyInitializationException — the most common JPA mistake` stays and absorbs the Open
EntityManager in View material.

Rationale: all four concepts are the same boundary seen from four sides — how far a unit of work
extends, how long the objects it loaded stay usable, whether the web layer silently extends that, and
which physical connection it runs on — and separating them would leave the most common junior
persistence exception, and the most common hosted- database failure, without the mechanism that
explains them.

Handoff: the application is now correct by construction in Victor's head. Chapter 09 makes that claim
testable by a machine.

## 09 — Testing a Spring Boot application

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/09-testing.md
Spanish: notes/spring-boot/junior/es/09-testing.md

Depends on: 02, 03, 04, 05, 06, 07, 08

Pending additions: none

Narrative role: the chapter that turns everything built so far into something a team can change
safely. It works outward from a plain unit test to a full context, choosing the smallest tool that can
actually catch the risk in question. One concept arrives before its chapter and must carry the
standard's forward-reference callout, with its why answered in place (`HC-3`): a test profile — a
`test`-only properties file activated for the test run — whose file and activation mechanism chapter
13 teaches in full; here it is read as "settings that load only while the tests run, so production
configuration is never edited to make a test pass".

Learning outcome: Victor can write and justify a unit test, an MVC slice test and a persistence slice
test, decide when the full context is warranted, and recognise a test that passes no matter what the
production code does.

Prerequisites: 02, 03, 04, 05, 06, 07, 08.

Must answer:

- Which failures does a Mockito unit test catch, and which ones can it never catch?
- Why does a controller slice test return 401 for an endpoint that works in Postman?
- `@Mock`, `@MockitoBean`, `@MockBean` — which one belongs where, and why do maintained projects
  import the third?
- Why does a repository test leave the database exactly as it found it without any cleanup code?
- Why assert on individual JSON fields instead of comparing the whole response to an expected string?
- Where do a test's database URL and credentials come from, given that production settings must not
  be weakened to make the test pass?
- Why can a repository test that passes against H2 still break in production?
- How do you spot a test that would still be green with the method body deleted?
- Starting the full context is often read as "now the test hits the real database" — what does
  `@SpringBootTest` actually make real, and what still depends on what the test configuration chooses?

Coverage concepts:

- [ ] Plain service unit tests — use JUnit and Mockito without a Spring context when the risk is business logic and collaborator interaction rather than framework wiring
- [ ] Mockito mock vs context bean override — `@Mock` creates a standalone test double, while replacing a bean in a Spring test context uses `@MockitoBean`; `@MockBean` is the legacy Boot annotation from a different package and is still what maintained projects import
- [ ] `@WebMvcTest` — loads a focused MVC slice; collaborators must be supplied through explicit mock bean overrides or imports rather than being replaced automatically
- [ ] Security in an MVC slice test — the slice applies the security filter chain, so requests are rejected before reaching the controller unless the test supplies an authenticated principal or the chain is deliberately excluded
- [ ] `MockMvc` — exercise mapped controller requests through the real dispatcher, converters, and advice without starting a server
- [ ] JSON-path MVC assertions — verify specific response fields and structures through `MockMvc` instead of comparing an entire JSON string
- [ ] `@SpringBootTest` — loads the full Spring application context, but external infrastructure is real only when the test config chooses it; use it for wiring and end-to-end application integration rather than every service rule
- [ ] `@DataJpaTest` — load a focused persistence slice with a transactional, rolled-back test so repository queries run against a real mapping
- [ ] Test database fidelity — an in-memory replacement is fast but can hide PostgreSQL-specific behaviour, so database-sensitive integration tests need deliberately configured real infrastructure
- [ ] Test configuration and profiles — override external dependencies and settings for tests without weakening production configuration or relying on a developer's local environment
- [ ] Tests that cannot fail — recognise the mocked-collaborator test that asserts only on its own stubbing, the interaction check with no state assertion, and the slice test whose subject is itself replaced by a mock, because such a test reports green regardless of the production code
- [ ] Unit vs slice vs full-context tests — choose an isolated class test, a focused Spring layer, or the complete application context according to the mechanism and configuration risk under test

Rationale: the testing tools only mean something as a ladder — each rung buys more realism at the
cost of speed — so they belong in one chapter that ends with the judgement of which rung a given risk
deserves and how to tell a real test from a decorative one.

Handoff: a tested application still has to leave the developer's machine. Chapter 10 packages it and
gives its schema a version history.

## 10 — Reproducible builds: the artifact and the schema are versioned outputs

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/10-tooling.md
Spanish: notes/spring-boot/junior/es/10-herramientas.md

Depends on: 01, 03

Pending additions: none

Narrative role: everything so far has been true on Victor's laptop, where the code is whatever the IDE
compiled and the schema is whatever Hibernate last decided to do to it. This chapter replaces both of
those runtime side-effects with reviewed, versioned outputs: an image built once from a Dockerfile,
and a schema built by an ordered list of migration files. That single idea — the thing that runs is
produced deliberately, not improvised at startup — is what makes both halves one lesson. Image,
container and Dockerfile are the `general` topic's baseline and are linked with a one-sentence
reminder; this chapter teaches what is Spring Boot-specific — the executable JAR inside the image and
configuration supplied from outside through the relaxed binding of chapter 01.

Learning outcome: Victor can explain why the running artifact and the running schema must both be
build outputs rather than startup side-effects, package the application as an image configured
entirely from outside, and evolve a schema through ordered migrations instead of letting the ORM
alter it.

Prerequisites: 01, 03.

Must answer:

- What actually goes inside the image, given that the machine running it has no JDK, no Maven and no
  source code?
- The image was built once — how does the same image point at a different database in another
  environment, and what would go wrong if the settings were baked in?
- Why is `ddl-auto=update` acceptable on a laptop and unacceptable on a durable database, when it
  appears to do the right thing in both places?
- What does a migration tool record so it knows which changes already ran, and why must an
  already-applied migration file never be edited afterwards?

Coverage concepts:

- [ ] Flyway vs `ddl-auto=update` — evolve schemas through ordered, reviewable migrations rather than allowing runtime ORM metadata to mutate a durable production database implicitly
- [ ] Spring Boot container packaging — build and run the executable application artifact in a container while supplying configuration externally and leaving generic container orchestration to the General topic

Audit note: the existing ``### `EXPOSE` documents the port — it does not publish it``, `##
docker-compose — app + database together`, ``### Why `db` works as a hostname — the embedded DNS`` and
``### `depends_on` waits for the container, not for Postgres`` teach `general`-topic container bullets
(exposed versus published port, compose, service discovery, readiness); each is reduced to a link with
a one-sentence reminder.

Rationale: both halves teach the same mechanism seen twice — a reviewed artifact produced by a build
step and identified by a version, versus something improvised by the process at startup — which is
why the image and the migration history belong in one chapter rather than in a tooling list.

Handoff: once the application runs on a machine Victor cannot attach a debugger to, the only evidence
left is what it prints. Chapter 11 reads that evidence.

## 11 — Diagnosing a running application

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/11-production-debugging.md
Spanish: notes/spring-boot/junior/es/11-depuracion-en-produccion.md

Depends on: 01, 03, 04, 08

Pending additions: none

Narrative role: the chapter that converts every mechanism already learned into a diagnostic skill. It
is placed after packaging because that is when the application stops being something Victor can step
through, and it works from a failure symptom back to the stage that produced it. It switches
diagnostics on by raising a package's log level, which chapter 12 then formalises — say so where the
property first appears, so the reader knows the trick is a preview and not a one-off incantation. It
reads startup failures that include bean-creation errors — a container concept this topic no longer
teaches, so that half must link to the `spring` notes rather than explain the lifecycle again.

Learning outcome: Victor can read a Boot startup failure and name which stage failed, make the
statements the persistence layer really issues visible, and explain why a failure is reported at a
line other than the one that caused it.

Prerequisites: 01, 03, 04, 08.

Must answer:

- The application refuses to start — how do you tell a configuration problem from a bean problem from
  a database problem without changing any code?
- The Java code looks like one call; how many SQL statements actually ran?
- Why does the constraint violation appear at the end of the method instead of on the line that saved
  the row?

Coverage concepts:

- [ ] Startup diagnostics — read Boot's condition and failure-analysis output to distinguish configuration, bean creation, port, and datasource failures before changing code
- [ ] Generated-statement logging — enable Hibernate's SQL and binding output to see the statements the repository layer actually issues, because query count and shape are invisible from Java code alone
- [ ] Write timing and deferred failure — a persistence call stages work that reaches the database at flush or commit, so a constraint violation is reported at the transaction boundary rather than on the line that appeared to cause it

Rationale: all three concepts are about the gap between what the code appears to do and what the
running process actually did — at startup, at query time, and at flush time — which is exactly the
skill an incident demands.

Handoff: diagnosis depends on the application having said something useful in the first place.
Chapter 12 is about producing that evidence deliberately.

## 12 — Application logging

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/12-logging-observability.md
Spanish: notes/spring-boot/junior/es/12-logging-observabilidad.md

Depends on: 01

Pending additions: none

Narrative role: the counterpart to chapter 11. Diagnosis read evidence the framework produced; this
chapter is about the evidence Victor's own code leaves behind, and the habits that get a pull request
rejected when it does not. It also formalises the level-raising property that 11 used ad hoc to see
Hibernate's SQL: there it was a trick, here it is the mechanism.

Learning outcome: Victor can obtain a logger correctly, choose a level and a message that will still
be useful during an incident, log an exception so its stack trace survives, and change what a running
application records without redeploying it.

Prerequisites: 01.

Must answer:

- Why is `System.out.println` unacceptable in a Spring Boot service when it clearly prints?
- Which level does a given event belong to, and who reads that level in practice?
- What is lost by logging `e.getMessage()` instead of passing the exception itself?
- A bug only reproduces in one environment — how do you get more detail out of it without a new
  build?
- Which values must never appear in a log line, no matter how convenient?

Coverage concepts:

- [ ] Application logging — obtain a logger through the SLF4J facade rather than printing to standard output, and raise or lower a package's level from configuration so a running application can be investigated without editing code

Rationale: this chapter is the whole of the logging concept — the facade, the levels, the message
format, exception logging and runtime level control are one skill, and the coverage bullet defines
its required scope rather than the depth needed to make it a habit.

Handoff: logging levels are the first thing that must differ between a laptop and a real environment,
which raises the general question of how one build behaves differently per environment. Chapter 13
answers it.

## 13 — Profiles and environment-specific startup

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/spring-boot/junior/en/13-spring-profiles.md
Spanish: notes/spring-boot/junior/es/13-perfiles-spring.md

Depends on: 01, 03, 04, 06

Pending additions: none

Narrative role: chapter 01 externalised configuration values and 12 changed one of them per
environment by hand; this chapter makes whole configuration files and whole environments switchable,
which is what lets development conveniences exist without ever reaching a real deployment. `@Value`
was taught in 01 and must be linked back to rather than re-explained; conditional bean registration
with `@Profile` is the `spring` topic's bullet, so this chapter shows the effect and links there for
the container mechanism. It also owns the first moment the application's own code runs after startup:
a `CommandLineRunner` that seeds the development administrator only under the `dev` profile. That seed
needs the entity and repository of 03–04 and the password encoder of 06, which is why the callback is
taught here rather than in 01.

Learning outcome: Victor can activate a profile, split configuration between a shared file and
profile-specific ones, read both file layouts he will meet in real projects, and explain what a
profile must never be used to store, and run idempotent one-off startup work that exists only in the
environment that needs it.

Prerequisites: 01, 03, 04, 06.

Must answer:

- What does activating a profile actually change about which files are read?
- Which values belong in the shared file and which in the profile-specific one?
- Two ways exist to write profile configuration in one project — how do you read both?
- Why is a profile the wrong place to keep a password even though it looks like the natural home?
- Seeding an admin user from a constructor runs too early and fails — what is not ready yet, and where
  does that work belong instead?
- The seeding code runs again on every restart — why is that not a bug to be fixed with a flag, and
  what does it force the code to look like?

Coverage concepts:

- [ ] Profile-specific configuration files — profile values live either in an `application-{profile}` file or in one multi-document file whose sections are separated by `---` in YAML or `#---` in properties and selected with `spring.config.activate.on-profile`
- [ ] Profiles — activate environment-specific beans and configuration deliberately without treating a profile as a secrets store
- [ ] `CommandLineRunner` startup callback — run one-off work once after the context is fully built and every bean is available, instead of a constructor or static initialiser that fires before the application is ready; it runs on every boot, so the work must be idempotent

Audit note: the existing ``## `CommandLineRunner` — running code once, right after startup`` and `##
Putting it together — the idempotent seed` sections are this entry's own and stay. ``## `@Value` —
pulling a single property into a field`` teaches what entry 01 owns through `@Value` vs
`@ConfigurationProperties` and is reduced to a one-sentence link back to 01.

Rationale: the file mechanism, the activation mechanism and the profile-gated startup callback are one
feature seen from three sides — one environment label deciding what configuration loads and, through
it, what the application does when it starts.

Handoff: profiles are the last mechanism this level adds, and they are also the first one Victor will
find already in place in somebody else's project — usually written in an older style, next to an
older security configuration and an older set of imports. Chapter 14 teaches him to read that.

## 14 — Reading maintained Spring Boot code

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/spring-boot/junior/en/14-maintained-code-recognition.md
Spanish: notes/spring-boot/junior/es/14-reconocer-codigo-heredado.md

Depends on: 02, 03, 04, 06, 07, 09

Pending additions: none

Narrative role: the chapter written for the first week in a consultancy. Every earlier chapter taught
the current idiom; this one teaches the previous generation of the same idioms, so that unfamiliar
code reads as an older convention rather than as evidence that Victor learned it wrong. The
container-level equivalents — field injection, XML bean definitions, `@Resource` — belong to the
`spring` topic's own recognition chapter and are linked, not duplicated. The same applies inside this
chapter's own bullets: the claim that Boot proxies classes by default, which is what makes the
`Impl` interface a convention rather than a requirement, is a `spring` concept used here and must be
marked as a link rather than re-derived.

Learning outcome: Victor can open an unfamiliar Spring Boot codebase, recognise the older namespace,
security configuration and repository interface styles it uses, and explain what each older choice
gives up compared with the current one.

Prerequisites: 02, 03, 04, 06, 07, 09.

Must answer:

- A copied snippet does not compile and the only difference is one word in the import — what happened,
  and why can the same mistake compile and be silently ignored instead?
- The security configuration extends a base class instead of declaring a bean; is that code wrong or
  just old?
- The repository extends `CrudRepository` and the pagination method is missing — what does that
  interface not provide?
- Every service has an interface and an `Impl` class — is that required by Spring or a convention?

Coverage concepts:

- [ ] `jakarta.*` vs `javax.*` imports — recognise that current Boot versions moved the persistence, validation, and servlet namespaces, so a maintained codebase or a copied snippet on the wrong namespace fails to compile or is silently ignored
- [ ] `SecurityFilterChain` bean vs `WebSecurityConfigurerAdapter` — current configuration declares a chain bean with the lambda DSL, while the removed adapter base class survives in maintained codebases and in most copied examples, so recognise both and know why one no longer compiles
- [ ] Repository interface hierarchy — `CrudRepository`, `PagingAndSortingRepository`, and `JpaRepository` extend one another with progressively more operations, so recognise which one a maintained codebase declared and what that choice does and does not provide
- [ ] Service interface plus `Impl` implementation — recognise the pervasive split where the injected type is an interface and the behaviour lives in a separate implementation class, and know that Boot proxies classes by default, so the interface is a maintained-code convention and a test-substitution seam rather than a technical requirement for proxying

Rationale: these four recognitions share one purpose and one method — each pairs an older form with
the current form Victor already knows and names what changed between them — so they teach a single
reading skill rather than four unrelated facts.

Handoff: Victor can now read and write the service. The final chapter turns it outward: calling the
services it depends on.

## 15 — Calling another service over HTTP

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/spring-boot/junior/en/15-http-clients.md
Spanish: notes/spring-boot/junior/es/15-clientes-http.md

Depends on: 02, 04, 05

Pending additions: none

Narrative role: every chapter so far has treated the application as the thing being called. This one
turns it around: the same request-and-response mechanics from 02, seen from the caller's side, which
is the position Victor's service is in whenever it depends on somebody else's API. It closes the
junior journey by making the boundary symmetrical.

Learning outcome: Victor can call an external HTTP API from a Spring Boot service using the
framework's own synchronous client, read the older client style he will find in existing projects,
and explain what a caller owes a service it does not control.

Prerequisites: 02, 04, 05.

Must answer:

- Which client does current Spring Boot code use for an outbound call, and which one will be found in
  projects written a few years ago?
- Where does the client belong — can a controller call the remote API directly, and why is the answer
  the same as it was for repositories?
- The remote service returns 500, or does not answer at all — what does that turn into for the client
  of *this* API?
- Why is a call to another service the one line in the code where "it worked locally" says almost
  nothing?

Coverage concepts:

- [ ] Outbound HTTP calls — a Spring Boot service that consumes another API uses the framework's synchronous HTTP client; recognise the current fluent client and the older template still present in maintained codebases

Rationale: this is one mental model — the application as HTTP client rather than HTTP server — and it
is deliberately the whole chapter rather than being bundled with contract publication, which belongs
in 02 where the controllers and DTOs it documents are written.

Handoff: this closes the junior Spring Boot journey. Victor can build, secure, test, ship, diagnose
and document a conventional REST service, read the older code he will inherit, and integrate with the
services around it — the point at which the middle-level coverage takes over with production
ownership, distributed systems and testing depth.

## Unassigned existing notes

- notes/spring-boot/junior/en/16-business-logic-domain-modeling.md — teaches where business rules live: anemic versus rich domain models, the `DRAFT → SUBMITTED → APPROVED/REJECTED` state machine guarded in one place, and invariants versus use-case rules. That material is owned by the `architecture` topic (its junior `State machine pattern` bullet), not by any Spring Boot bullet at any level; its one Spring Data section, `## Where a derived value is computed — hours worked`, duplicates what entry 04 owns through `Aggregating in the database vs in memory`. Recommended disposition: keep the pair intact until the `architecture` plan routes it; this planner relocates across levels, never across topics. Renumbered 11 → 16 because the route needs prefix 11, in both languages — `en/11-business-logic-domain-modeling.md` → `en/16-business-logic-domain-modeling.md` and `es/11-logica-de-negocio-modelado-dominio.md` → `es/16-logica-de-negocio-modelado-dominio.md`.
- notes/spring-boot/junior/en/18-dependency-injection.md — teaches the IoC container, bean stereotypes, scopes, constructor injection, `@Bean`, startup wiring and `@Qualifier`/`@Primary`, all owned by the `spring` topic (`notes/spring/coverage/junior.md`); its last two sections, `## @Value — reading configuration into beans` and `## @ConfigurationProperties — binding grouped config to a class`, duplicate what entry 01 owns through `@Value` vs `@ConfigurationProperties` and `Relaxed binding from environment variables`. Recommended disposition: keep the pair intact and let the `spring` junior plan claim it; that plan currently declares all-new files, so it must be re-run to route this prose instead of re-authoring it.
