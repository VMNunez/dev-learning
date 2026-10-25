# Practice index — every route, each block linked to its note

Navigation for the short-exercise track. `practice-session` writes this projection after a
reviewed plan under `notes/prompts/practice/exercises/_internal/_practice-standard.md` §B.
Coverage defines scope, the notes plan groups it, and each topic-level exercise plan owns its tasks.
The tables link blocks to notes; they never substitute for the exercise inventories. Note status
is read live. Future routes use the same topic/level layout when their environment is enabled.

## Practice state

Derived: 2026-10-24

| Topic | Essential route | Open batch | Last closed batch |
|---|---|---|---|
| java — junior | next stage 00 of 17 | — | 02-conversions-and-arithmetic, 2026-10-17 |
| angular — junior | next stage 01 of 17 | — | 01-book-catalog, 2026-10-21 (pilot) |
| spring-boot — junior | next stage 01 of 15 | — | — |

Rotation: java → spring-boot → angular; next: java
Simulations: no route — /simulation-plan LEVEL=junior

## java — junior

Exercise plan: [Java junior](java/junior/PLANNING-junior.md)
Active planned exercises: 285
Essential route: 17 stages, 204 tasks
Notes structure SHA-256: 7ce0128dc0f8cf59aca6b22f2663bef9f9dd785e4acef79d79b74d259424f5e2
Notes plan: notes/java/coverage/notes-plan-junior.md
Coverage SHA-256: bad12930637587f5cce0f4c3bad990572d29c6e9c4ea340a6e4a2627a188508a
Derived: 2026-10-24

| Block | Title | Note | Depends on | Bullets | In route |
|---|---|---|---|---|---|
| 00 | Java execution foundations | `notes/java/junior/es/00-intro-java.md` | none | 2 | yes |
| 01 | Values, types, conversion, and arithmetic | `notes/java/junior/es/01-variables-tipos.md` | 00 | 12 | yes |
| 02 | Strings and text | `notes/java/junior/es/02-cadenas-de-texto.md` | 01 | 7 | yes |
| 03 | Control flow | `notes/java/junior/es/03-flujo-de-control.md` | 01, 02 | 6 | yes |
| 04 | Methods | `notes/java/junior/es/04-metodos.md` | 03 | 5 | yes |
| 05 | References, the call stack, and memory | `notes/java/junior/es/05-modelo-de-memoria.md` | 04 | 3 | yes |
| 06 | Classes, encapsulation, records, and equality | `notes/java/junior/es/06-poo-clases.md` | 05 | 15 | yes |
| 07 | Interfaces and abstract classes | `notes/java/junior/es/07-interfaces-abstractas.md` | 06 | 6 | yes |
| 08 | Inheritance and polymorphism | `notes/java/junior/es/08-herencia-polimorfismo.md` | 07 | 5 | yes |
| 09 | Generics and reading nested types | `notes/java/junior/es/09-genericos.md` | 08 | 6 | yes |
| 10 | Collections, hashing, and ordering | `notes/java/junior/es/10-colecciones.md` | 06, 09 | 17 | yes |
| 11 | Exceptions and diagnostics | `notes/java/junior/es/11-excepciones.md` | 05, 10 | 9 | yes |
| 12 | Lambdas, method references, and Optional pipelines | `notes/java/junior/es/12-streams-lambdas.md` | 09, 11 | 10 | yes |
| 13 | Streams, collectors, and ordering | `notes/java/junior/es/13-streams-colectores.md` | 10, 12 | 12 | yes |
| 14 | Enums | `notes/java/junior/es/14-enums.md` | 03, 06 | 3 | yes |
| 15 | Date, time, and API literacy | `notes/java/junior/es/15-fechas.md` | 01, 04, 06, 09, 11 | 5 | yes |
| 16 | Annotations | `notes/java/junior/es/16-anotaciones.md` | 04, 07, 14 | 2 | yes |
| 17 | Maven fundamentals | `notes/java/junior/es/17-maven.md` | 00, 04 | 7 | no — needs a Maven project, not a standalone file (standard §H) |

**In route: 17 blocks, 125 concepts.** Block 17 is excluded and its 7 bullets enter no denominator.

## angular — junior

Exercise plan: [Angular junior](angular/junior/PLANNING-junior.md)
Active planned exercises: 384
Essential route: 17 stages, 182 tasks
Notes structure SHA-256: 23effbefa74f66293ff8dead8c9832b68e324039a1c37867d7094914bfb03709
Notes plan: notes/angular/coverage/notes-plan-junior.md
Coverage SHA-256: 090fc3628c0017acfa06c306c24fbf39e9bcffca252e8a2187fd0cba5f0d84d5
Derived: 2026-10-22

| Block | Title | Note | Depends on | Bullets | In route |
|---|---|---|---|---|---|
| 00 | Angular in the browser | `notes/angular/junior/es/00-introduccion-angular.md` | none | 0 | no — orientation chapter; it carries no coverage bullet, so there is nothing to practise |
| 01 | Application bootstrap | `notes/angular/junior/es/01-arranque-aplicacion.md` | 00 | 2 | yes |
| 02 | Components and template bindings | `notes/angular/junior/es/02-componentes-plantillas.md` | 01 | 8 | yes |
| 03 | Signals: state the template reacts to | `notes/angular/junior/es/03-senales.md` | 02 | 5 | yes |
| 04 | Template control flow | `notes/angular/junior/es/04-control-flujo-plantillas.md` | 02, 03 | 5 | yes |
| 05 | Component communication: inputs, outputs, and projection | `notes/angular/junior/es/05-comunicacion-componentes.md` | 02, 03, 04 | 6 | yes |
| 06 | Attribute directives and the host element | `notes/angular/junior/es/06-directivas-estilos.md` | 02, 03, 05 | 2 | yes |
| 07 | Component styles and the style boundary | `notes/angular/junior/es/07-estilos-componentes.md` | 02, 03, 05, 06 | 6 | yes |
| 08 | Dependency injection and provider scope | `notes/angular/junior/es/08-inyeccion-dependencias.md` | 01, 02, 05, 06 | 9 | yes |
| 09 | Component lifecycle, view queries, and cleanup | `notes/angular/junior/es/09-ciclo-vida-componentes.md` | 02, 03, 05, 08 | 6 | yes |
| 10 | Effects and signal ownership | `notes/angular/junior/es/10-efectos-propiedad-senales.md` | 03, 08, 09 | 6 | yes |
| 11 | Template pipes | `notes/angular/junior/es/11-pipes.md` | 01, 02, 08 | 4 | yes |
| 12 | HTTP requests and remote UI states | `notes/angular/junior/es/12-http.md` | 01, 03, 04, 08, 09 | 9 | yes |
| 13 | RxJS operators: transforming, combining, and flattening streams | `notes/angular/junior/es/13-flujos-rxjs.md` | 03, 12 | 10 | yes |
| 14 | RxJS errors, cleanup, and consumption | `notes/angular/junior/es/14-rxjs-errores-consumo.md` | 03, 08, 09, 11, 12, 13 | 8 | yes |
| 15 | Reactive forms: the control model and validation | `notes/angular/junior/es/15-formularios-reactivos.md` | 02, 04, 06, 08 | 10 | yes |
| 16 | Reactive forms: values, submission, and change streams | `notes/angular/junior/es/16-valores-envio-formularios.md` | 12, 13, 14, 15 | 9 | yes |
| 17 | Routing: routes, outlets, and navigation | `notes/angular/junior/es/17-enrutamiento.md` | 01, 02, 06, 08, 13, 14 | 10 | yes |
| 18 | The URL as view state | `notes/angular/junior/es/18-estado-vista-url.md` | 03, 08, 13, 14, 17 | 11 | yes |
| 19 | Route matching and lazy loading | `notes/angular/junior/es/19-coincidencia-rutas-carga-diferida.md` | 01, 08, 17 | 6 | yes |
| 20 | Route guards | `notes/angular/junior/es/20-guards-rutas.md` | 08, 10, 16, 17, 18, 19 | 9 | yes |
| 21 | HTTP interceptors and session expiry | `notes/angular/junior/es/21-interceptores-http.md` | 12, 14, 17, 18, 20 | 3 | yes |
| 22 | Change detection and pipe execution | `notes/angular/junior/es/22-deteccion-cambios.md` | 03, 05, 10, 11, 12, 14 | 5 | yes |
| 23 | Production build, configuration, and template trust | `notes/angular/junior/es/23-entrega-produccion.md` | 02, 12, 19 | 4 | yes |
| 24 | Test setup, doubles, and service tests | `notes/angular/junior/es/24-testing.md` | 03, 08, 13, 20 | 6 | yes |
| 25 | Testing HTTP and rendered components | `notes/angular/junior/es/25-testing-http-componentes.md` | 05, 12, 14, 22, 24 | 6 | yes |
| 26 | Debugging and maintained-code navigation | `notes/angular/junior/es/26-depuracion-codigo-mantenido.md` | 03, 08, 12, 17, 23, 25 | 2 | yes |
| 27 | Legacy enterprise Angular | `notes/angular/junior/es/27-angular-legacy.md` | 01, 02, 03, 04, 05, 08, 10, 13, 14, 15 | 6 | yes |

**In route: 27 blocks, 172 concepts.** Block 00 carries no bullet and enters no denominator. 1 concept excluded at concept level inside an in-route block — C132 (block 19) — stays in its block's `Bullets` and enters neither total.

## spring-boot — junior

Exercise plan: [Spring Boot junior](spring-boot/junior/PLANNING-junior.md)
Active planned exercises: 294
Essential route: 14 stages, 118 tasks
Notes structure SHA-256: 52268abf9d309c37c6ee57c4a8456aa7351877cf6ef97bf84376c38a1d93e8d4
Notes plan: notes/spring-boot/coverage/notes-plan-junior.md
Coverage SHA-256: b7cb1dbcde90bef75bb05fb7fe680d9ec762b6d627b0c4340eed48e174e4285c
Derived: 2026-10-25

| Block | Title | Note | Depends on | Bullets | In route |
|---|---|---|---|---|---|
| 00 | What Spring Boot is and how this topic is organised | `notes/spring-boot/junior/es/00-introduccion-spring-boot.md` | none | 1 | yes |
| 01 | Creating, configuring and starting a Spring Boot application | `notes/spring-boot/junior/es/01-basicos.md` | 00 | 11 | yes |
| 02 | REST controllers: the HTTP boundary | `notes/spring-boot/junior/es/02-controladores-rest.md` | 00, 01 | 18 | yes |
| 03 | Spring Data JPA: entities and relationship mapping | `notes/spring-boot/junior/es/03-spring-data-jpa.md` | 00, 01 | 16 | yes |
| 04 | Repositories and queries | `notes/spring-boot/junior/es/04-repositorios-y-consultas.md` | 02, 03 | 15 | yes |
| 05 | Exception handling and the error contract | `notes/spring-boot/junior/es/05-manejo-excepciones.md` | 02, 04 | 10 | yes |
| 06 | Spring Security and JWT authentication | `notes/spring-boot/junior/es/06-seguridad-jwt.md` | 02, 03, 04, 05 | 29 | yes |
| 07 | Bean Validation at the input boundary | `notes/spring-boot/junior/es/07-validacion.md` | 02, 03, 05, 06 | 10 | yes |
| 08 | The service transaction boundary and the open session | `notes/spring-boot/junior/es/08-transacciones.md` | 01, 02, 03, 04, 05 | 4 | yes |
| 09 | Testing a Spring Boot application | `notes/spring-boot/junior/es/09-testing.md` | 02, 03, 04, 05, 06, 07, 08 | 12 | yes |
| 10 | Reproducible builds: the artifact and the schema are versioned outputs | `notes/spring-boot/junior/es/10-herramientas.md` | 01, 03 | 2 | yes |
| 11 | Diagnosing a running application | `notes/spring-boot/junior/es/11-depuracion-en-produccion.md` | 01, 03, 04, 08 | 3 | yes |
| 12 | Application logging | `notes/spring-boot/junior/es/12-logging-observabilidad.md` | 01 | 1 | yes |
| 13 | Profiles and environment-specific startup | `notes/spring-boot/junior/es/13-perfiles-spring.md` | 01, 03, 04, 06 | 3 | yes |
| 14 | Reading maintained Spring Boot code | `notes/spring-boot/junior/es/14-reconocer-codigo-heredado.md` | 02, 03, 04, 06, 07, 09 | 4 | yes |
| 15 | Calling another service over HTTP | `notes/spring-boot/junior/es/15-clientes-http.md` | 02, 04, 05 | 1 | yes |

**In route: 16 blocks, 132 concepts.** 8 concepts excluded at concept level inside in-route blocks — C004 (block 01), C005 (block 01), C006 (block 01), C030 (block 02), C103 (block 07), C110 (block 07), C123 (block 09), C128 (block 10) — stay in their blocks' `Bullets` and enter neither total.
