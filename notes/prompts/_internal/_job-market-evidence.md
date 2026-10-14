# Job market evidence — real postings that anchor coverage

**Purpose.** Coverage decisions should be anchored to what the target companies *actually ask for in
2026*, not only to what a model believes they ask. This file holds that ground truth: real junior job
postings from the target consultancies, plus a distilled synthesis of the requirements that recur
across them. `coverage-prompt.md` and `coverage-audit-prompt.md` read it as a **source** — an item
that shows up repeatedly here is a strong signal it belongs in coverage.

**How the coverage prompts use it** (per `_coverage-standard.md`, "Two sources"): the backbone is always
the **deep market analysis** — a full, web-backed reasoning of what the target junior is asked. This file
is its **complement**, not its replacement:
- When it has evidence, the recurring requirements in the Synthesis are a **required floor** the analysis
  must satisfy — every recurring skill maps to coverage items, and a gap here is a gap in coverage. On a
  concrete point where a real posting conflicts with the analysis, the posting wins (real data beats a guess).
- It only ever **raises** that floor, never lowers it: this is a small, partial sample, so a skill's
  *absence* here is not proof a junior does not need it. When it is empty or stale, the deep analysis
  still stands on its own — coverage never shrinks just because the file is thin.
- **The `## Techo` section is off-limits to coverage.** It holds mid/senior postings (3+ años) kept only
  to show where the bar is heading, and it feeds the `coverage-senior.md` files — never coverage, never
  the Synthesis frequencies. A skill that appears *only* there is by definition one Victor does not need
  yet. Read the Raw postings + Synthesis; skip `Techo`.

**Evidence quality note.** Most postings below were captured from **web-search extracts (July 2026)**,
not full job descriptions — individual postings on Tecnoempleo/Indra/NTT expire fast (410 Gone) and
several career sites are login-walled. That text is real and quoted, but partial: an extract can drop a
requirement rather than prove its absence, which is why a skill's low frequency here is never evidence
it is not asked. **Postings marked `full posting` are full pasted offers** and carry more weight than
the extracts around them. The **2026-10** batch was read from each offer's own Tecnoempleo page in a
`search` run — fuller than a search snippet, but still a tool's reading of the page rather than a
pasted offer, so it stays labelled `web-search extract`. To strengthen this file, paste 2–3 more *full*
"Requisitos" blocks from live postings when you see them — the tool for that is
`notes/prompts/knowledge/coverage/evidence-intake-prompt.md` (`paste` or `search` mode).

> Keep it honest: what recurs across many postings is a strong signal; what appears in one senior-ish
> posting (Kafka, Spring Cloud, Spring Batch) is not a junior floor — note it as a "signal to watch",
> not a requirement.

---

## Raw postings

> **Dating for trend analysis.** Each posting carries a `Captured: yyyy-mm` line = when it entered this
> file. That lets a later reader compare how requirements shift over time (Docker rising, a new framework
> appearing, testing becoming baseline). Feed new postings with
> `notes/prompts/knowledge/coverage/evidence-intake-prompt.md` (`paste` or `search` mode). The postings
> below were all **captured 2026-07** (web-search extracts); newer ones carry their own `Captured:` date.

### Capgemini — Desarrollador/a Junior Java (híbrido) · 2026 · Tecnoempleo
Stack / requisitos (from extract): Java, Spring, HTML, CSS, Angular, Node.

### NTT DATA — Desarrollador Java + Angular Jr (Advance) · 2026 · careers.emeal.nttdata.com
Stack / requisitos (from extract): desarrollo y mantenimiento de **REST APIs con Java (Spring Boot)**,
interfaces de usuario con **Angular (v12+)**. NTT DATA also runs a "Junior – perfiles recién titulados"
scholarship track (CFGS programación / Ing. Informática) at centres like Salamanca.

### Talan — Junior Fullstack Java/Angular Developer (híbrido) · 2026 · Tecnoempleo
Requisitos (from extract): 1–2 años de experiencia (o prácticas) en desarrollo con **Java**;
conocimiento de **Spring/Spring Boot**; frontend básico con **Angular**; **Git**; **APIs REST**;
**bases de datos relacionales (MySQL, PostgreSQL)**; metodologías ágiles (**Scrum/Kanban**);
inglés fluido; español fluido. Responsabilidades incluyen "calidad de código mediante buenas
prácticas y **testing básico**".

### Indra Group — Desarrollador/a Junior Java (Madrid) · 2026 · careers.indragroup.com / indraempleo.com
Perfil: recién graduados CFGS DAM/DAW o Grado en Ing. Informática/Telecom.
Requisitos: conocimientos/experiencia en **Java**. Valorables: **Suite de Spring (Spring Framework,
Spring Boot, Spring Cloud, Spring Data)**; **JUnit / Mockito**; AsciiDoc; **bases de datos
relacionales**. También valorables: **Spring Boot, HTML, CSS, JavaScript, Angular**. Buen nivel de
**inglés**. Proyectos sobre **cloud pública**, todo el ciclo de vida (análisis → pruebas).

### Métrica / Krell Consulting — Desarrollador Frontend Angular · 2026 · Tecnoempleo
Requisitos (from extract): **TypeScript**, HTML, **SASS**, **RxJS** aplicado a Angular, **Angular
(v18)**, **Angular Material**; testing con **Jasmine / Jest / Karma**.

### Sector banca (recién titulados Java) · 2026 · Tecnoempleo / Jooble
Requisitos (from extract): Java (Java 8), **arquitectura de microservicios**, **Spring Boot**,
Spring Batch, Spring Cloud, **Maven**, metodologías **ágiles/Scrum**.

### UST / BCNC / empleo0 — Desarrollador Java microservicios · 2026 · Tecnoempleo
Requisitos (from extract): **Spring Boot**, **API REST**, microservicios, **Java 17 / Spring Boot 3**,
**contenedores (Docker)**, testing con **JUnit, Mockito** (y Wiremock), **Jenkins**, **Git**, Kafka.

### Primer empleo — Programador Junior Java Spring Boot (contrato formativo, Madrid) · 2026 · primerempleo.com
Beca/contrato formativo: **Java**, **Spring Boot**.

### Santander Digital Services — Junior Full Stack Software Engineer (Madrid) · santander.wd3.myworkdayjobs.com / Glassdoor
Captured: 2026-07 · web-search extract
Requisitos: al menos **2 años** de experiencia en ejecución de proyectos tecnológicos; **FP de grado
superior** en el ámbito tecnológico. Conocimientos **obligatorios de Java, Angular y SQL** —
"conocimiento del lenguaje de programación Angular y backend Java". Conocimiento de frameworks como
**Spring y Spring Boot**, y de herramientas **DevOps: Jira, Jenkins, Git, GitHub**. Experiencia con
monitorización de plataformas, automatización de procesos, **microservicios** y **metodologías ágiles**.
Soft skills: proactividad, comunicación, adaptación al cambio, trabajo en equipo con Negocio y Operaciones.

### Minsait (Indra) — Programa recién titulados / desarrollo frontend · careers Minsait vía Indeed
Captured: 2026-07 · web-search extract
Requisitos: **recién titulados** en **CFGS DAM/DAW**, Grado en Ing. Informática, Telecomunicaciones o
Telemática. Conocimientos de desarrollo **front-end: HTML, CSS, JavaScript, Angular, React,
TypeScript**; **inglés nivel B2**. Motivación por el ámbito tecnológico y trabajo en equipo.

### Métrica Consulting — Programador/a Junior Full Stack (sector bancario) · InfoJobs
Captured: 2026-07 · **full posting** (sustituye al extracto "Sector banca — Programador Junior Full
Stack · Jooble/Indeed" capturado en el mismo run — es la misma oferta, deduplicada)
Requisitos: experiencia laboral de al menos **1 o 2 años** como Programador/a **Junior** Full Stack,
"siendo el punto fuerte en **Java y Javascript**". Imprescindible experiencia previa en **Node JS**,
**React** y **Angular**. Experiencia en bases de datos **MySQL, PostgreSQL y MongoDB**. **Inglés Alto**.
Proyecto para el **sector bancario**.

### Ayesa Digital — Desarrollador/a Junior Java + Angular (administración pública) · InfoJobs
Captured: 2026-07 · **full posting** · **perfil junior explícito**
Empresa: "multinacional española tecnológica", +11.000 profesionales en 10 países. Proyecto: evolución y
mantenimiento de los módulos aplicativos de una plataforma de gestión del **ámbito de la administración
pública**.
Requisitos: "**Perfil junior** con motivación por desarrollarse en entornos Java y Angular".
Conocimientos en desarrollo **backend con Java**; **nociones** de desarrollo frontend con **Angular**;
conocimientos de bases de datos **Oracle**. Se valorará experiencia o formación en generación de
informes con **JasperReports**. "Ganas de aprender, trabajo en equipo y orientación a la calidad".
Conocimientos técnicos declarados: Backend **Java** · Frontend **Angular** · BBDD **Oracle** · Informes
**JasperReports**.
Día a día: programar backend en Java dando soporte a la lógica de negocio, construir y evolucionar
interfaces con Angular, trabajar con Oracle (consultas, mantenimiento y **optimización**), diseñar
informes con JasperReports, participar en el ciclo de desarrollo dentro de un **equipo ágil**.
**No menciona Spring Boot ni inglés** — de las pocas ofertas Java del fichero donde el framework no
aparece nombrado.

### NTT DATA Castellón — Java Developer (Java, Spring Boot, microservicios) · InfoJobs
Captured: 2026-07 · **full posting** (oferta completa pegada)
Seniority: **no declarada** — "Nivel: Empleado/a", sin años de experiencia exigidos. Convocatoria de
expansión del centro ("seguimos en proceso de expansión... necesitamos incorporar diferentes
profesionales"), teletrabajo desde el primer día, contratación indefinida. No es explícitamente junior,
pero tampoco excluye perfiles de entrada — léase con esa cautela.
Requisitos: dos perfiles en la misma oferta.
- **Analistas y Programadores JAVA**: "Experiencia en proyectos de desarrollo con **Spring Boot**,
  **Hibernate**, **Servicios web**, **Servicios REST** y **Angular**".
- **Desarrolladores/as FullStack**: "con experiencia en **Angular**, **React**, **JavaScript**,
  **jQuery**, etc."
**Inglés: condicional, no obligatorio** — "si además te desenvuelves bien en inglés, puedes optar por la
posibilidad de trabajar en proyectos internacionales". Es una palanca de acceso a mejores proyectos, no
un filtro de entrada.

### Grupo Digital — Full Stack junior/mid/senior (Madrid, sector pagos) · InfoJobs
Captured: 2026-07 · **full posting** · **desde 1 año** · **26.000–42.000 €** según experiencia
Sustituye al extracto "Full Stack Junior (Madrid, proyecto estable)" del mismo run: es esa oferta, ahora
completa. Entra en el suelo junior porque admite explícitamente perfiles **junior** ("perfiles de Full
Stack (junior/mid/senior)", "a partir de 1 año"), aunque la banda salarial cubra hasta senior.
Requisitos: **Java y JavaScript**; **Spring Boot y Spring Security con control de acceso por roles**;
**Node.js y Express**; **arquitectura por capas y principios SOLID**; **React (Hooks) y Angular**;
**HTML, CSS y Bootstrap**; **MySQL, PostgreSQL y MongoDB**; **JPA y relaciones one-to-many**; Mongoose;
**JUnit, Mockito, Jest y Postman**; **Docker, Jenkins, AWS y Kubernetes**; **CI/CD y documentación de
APIs con Swagger**; **inglés alto (imprescindible)**. Deseable: entornos internacionales, **Agile**.
Funciones: diseñar y desarrollar **APIs REST seguras y escalables**; desarrollo Full Stack con Java,
Spring Boot y JavaScript; frontend con React y Angular; **bases de datos relacionales y NoSQL**;
**pruebas unitarias e integración** para asegurar la calidad; **CI/CD y despliegues sobre contenedores
y cloud**; entorno **Agile** con equipos internacionales.

### Second Window — Programador Junior Java / Fullstack (teletrabajo) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 09/10/2026 · **1–2 años** · **20.000 € brutos/año**
URL: https://www.tecnoempleo.com/programador-junior-java-fullstack-teletrabajo-seco/spring/rf-2b631c75f2d5f3b0b041
Requisitos: "1-2 año de experiencia en programación con lenguaje **Java / Spring Boot**". Formación
mínima: **Grado Medio**. 100 % remoto, residencia en España imprescindible, contrato indefinido.
Deseable: "Experiencia con tecnologias de Front como **Angular, CSS, HTML, Javascript**...".
(Distinta del puesto Full-Stack de 3+ años de la misma empresa que está en `## Techo`.)

### Seltime — Programadores Java (Madrid híbrido + Ávila, Cuenca, Guadalajara, Segovia, Toledo) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 08/10/2026 · **1–2 años** (la ficha dice "2 años")
URL: https://www.tecnoempleo.com/programadores-java-seltime/angular-springboot/rf-eadc172e927ac3cf6143
Requisitos: "Experiencia de al menos 1-2 años desarrollando aplicaciones **Java con Springboot**";
"Experiencia en otras tecnologías de backend similares"; "Conocimiento de **Spring y Struts**".
Deseable: "**Muy valorable** experiencia/conocimientos de **Angular**." Formación mínima **FP2/Grado
Superior**; 10 puestos, contrato indefinido.

### sg tech — Programador/a Junior Java + Spring Boot (Madrid híbrido, servicios financieros) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 02/10/2026 · **1–2 años**
URL: https://www.tecnoempleo.com/programador-junior-java-spring-boot-sg-tech/spring-boot-oracle/rf-0ee21d3d22e9d3461048
Requisitos: "Entre uno y dos años de experiencia profesional en desarrollo backend"; "Experiencia en
desarrollo con **NOVA, Java y Spring Boot**"; "Experiencia con bases de datos **Oracle**"; dos días por
semana en oficina (Las Tablas). Deseables: "Conocimientos de **JDBC**", "Conocimientos de **JSP**".

### Merkle (dentsu) — Junior Java Developer / Junior Java Software Engineer Community (Barcelona híbrido) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicadas 09/10/2026 y 01/10/2026 · **1+/2+ años**
URLs: https://www.tecnoempleo.com/junior-java-developer/j2ee-restful/rf-aa221bb00214d32a9047 ·
https://www.tecnoempleo.com/junior-java-software-engineer-community/j2ee-restful/rf-82c61f0762b7a3f7984e
**Dos vacantes con texto idéntico — un solo bloque, cuenta como una oferta en la Synthesis.**
Requisitos: "Experience with **Java/J2EE** (1+/2+ years)"; "good level of **English**"; "Experience
working in an **Agile** environment (**Scrum** methodology)"; "Experience developing **RESTful Web
Services**"; "Experience with **Test-driven Development (TDD)**"; "**Behavior-driven Development
(BDD)**"; "Knowledge of **relational databases and SQL (Oracle)**"; titulación técnica (ingeniería
informática / telecomunicaciones). Valorables: "Knowledge of **Object-Oriented Design**"; "Any **Spring,
Hibernate**, iBatis, **Maven, GIT, Docker, or Jenkins**". Funciones: "Design and code Java backend
applications using a **test-driven development** approach"; "Focus on the quality of your codebase
(**refactoring, testing, clean code**)"; entregar valor "in every sprint".

### SlashMobility — Junior Java Developer + Java Junior (Barcelona híbrido) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicadas 02/10/2026 y 07/10/2026 · **1–2 años**
URLs: https://www.tecnoempleo.com/junior-java-developer/microservicios-reactjs/rf-eb1e18fa72cce3d68447 ·
https://www.tecnoempleo.com/java-junior/java/rf-cff81c6132a3d3952843
**Dos vacantes de la misma firma — un solo bloque, cuenta como una oferta.** "Junior Java Developer":
"1/2 años de experiencia con **JAVA y MICROSERVICIOS**"; competencias clave: **Java**,
**Microservicios**, "Desarrollo web con **Reactjs**", "Desarrollo híbrido con **ReactNative**",
"**Metodología Agile**". "Java Junior": solo "Experiencia 1-2 años con java". Se describe como "firma
boutique tecnológica... diferente a la consultoría tradicional". **Java con React y sin Angular.**

### Sopra Steria — Programador/a Java Junior con Francés (Barcelona; misma oferta en Valencia y Madrid) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 10/09/2026 (Valencia y Madrid: 05/08/2026) · **sin
experiencia**
URL: https://www.tecnoempleo.com/programador-java-junior-con-frances-sopra-steria/net-fullstack/rf-4e1a1399d26d133c0b4f
Requisitos: "No hace falta tener experiencia"; titulación "Ingeniería Informática, Telecomunicaciones,
Industrial, Matemáticas, Física u otras ingenierías", "finalizada, o a punto de finalizar"; "**B2
Francés**". El stack **no se exige, se enseña**: "Ofrecemos formación inicial en tecnología punteras
como **Java, .NET, Fullstack**, entre otras." Cuenta para Java (es el puesto) pero no para ningún otro
requisito técnico.

### Accenture — Backend Java Developer (ASO Framework) (Badajoz) · Tecnoempleo
Captured: 2026-10 · web-search extract · actualizada 14/10/2026 · **2 años** (techo del tramo junior;
sin puerta senior)
URL: https://www.tecnoempleo.com/backend-java-developer-aso-framework-accenture/spring-boot-apis-rest/rf-6d501a8ea28a33f9fd42
Requisitos: "Mínimo 2 años de experiencia trabajando con **ASO Framework**"; "construcción e
implementación de **APIs REST/RESTful**"; "diseño e implementación de **microservicios**";
"Conocimiento sólido en **Java y Spring Boot**"; "definiendo y documentando APIs mediante **RAML**";
"**JSON**"; "Conocimientos en **seguridad de APIs (autenticación, autorización** y protección de
servicios)"; "metodologías **Agile/Scrum**"; "**Git y Bitbucket**"; "Ciclo de Vida de Desarrollo de
Software (SDLC)".

### Alcorce Telecomunicaciones — Programador Spring Boot y Angular (remoto) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 17/04/2026, aún accesible · **2 años**
URL: https://www.tecnoempleo.com/programador-spring-boot-angular-remoto/spring-boot-angular/rf-922f1bd0529823bc344d
Requisitos: "Dos años de experiencia." "Desarrollo full stack con experiencia en **Spring Boot y
Angular**." Función: "Analista Programador Full-Stack de Spring Boot y Angular". Sin más detalle.

---

## Techo — ofertas mid/senior (NO cuentan para las frecuencias junior)

> **Regla dura, léela antes de usar esta sección.** Estas ofertas exigen explícitamente 3+ años y están
> **fuera del perfil objetivo**. Existen aquí por una única razón: mostrar **hacia dónde va el listón**,
> para alimentar los `coverage-senior.md` de cada topic. **Nunca** entran en el denominador de la
> Synthesis, **nunca** suben el suelo junior, y `coverage-prompt` / `coverage-audit` **no pueden usarlas
> para añadir items a coverage**. Un skill que solo aparece aquí es, por definición, algo que Victor
> todavía NO necesita. Confundir estas dos secciones rompe el propósito del fichero.

### Sopra Steria — Analista/Programador Java Spring Boot (Alicante, sector Retail) · InfoJobs
Captured: 2026-07 · **full posting** · **3+ años exigidos**
Hard skills: **Java Spring Boot**; **POO, principios SOLID y patrones de diseño**; **Arquitectura
Hexagonal y DDD táctico**; desarrollo de **APIs REST enfocadas al rendimiento, escalabilidad y
seguridad**; BBDD relacionales (**PostgreSQL**); NoSQL (**Redis**); broker de mensajería (**RabbitMQ**);
**test unitarios**; desarrollo en **sistemas dockerizados**; despliegues en **Kubernetes**; **CI/CD con
GitLab CI**; **Git**.

### Zemsania — Desarrollador FullStack Angular (Barcelona, sector seguros) · InfoJobs
Captured: 2026-07 · **full posting** · **5+ años exigidos**
Requisitos: experiencia "sólida y profunda" en **Angular v16+** y tecnologías asociadas: **NgRx,
Angular Material, Signals y Nx**. **Java y/o Kotlin** para back-end y creación de APIs. **REST APIs y
Web MVC**. **Inglés B2/C1**, fluidez escrita y oral "indispensable". **Git-based workflows**. Prácticas
**DevOps, CI/CD, containerización (Docker) y Kubernetes**. Cloud: **AWS o Azure**. Herramientas de
monitorización. **Estrategias de testing completas: unitarias, integración y E2E**. BBDD: **PostgreSQL
y MongoDB**. Metodologías **Agile**. **Código limpio y patrones de diseño**. Colaboración con equipos
de UI/UX.

### Second Window — Full-Stack Developer Java + Angular (Madrid, 66% teletrabajo) · InfoJobs
Captured: 2026-07 · **full posting** · **3+ años exigidos** · **30.000–33.000 € brutos/año**
Perfil requerido: al menos **3 años** en desarrollo Fullstack con **Java y Angular**. Desarrollo integral
de aplicaciones web, **diseño de microservicios** y desarrollo de **APIs**. "Dominio del ecosistema
Java": **Java y Spring Framework**. Frontend: "desarrollo moderno con **Angular**". Herramientas:
**GitHub, GitLab, VS Code e IntelliJ**. Cultura DevOps: **Jenkins** para CI/CD. Metodologías:
**Scrum/Kanban**. Ciclo de vida completo del desarrollo, equipo multidisciplinar.
Deseables (no exigidos): BBDD **Oracle**; **JPA** para persistencia; mensajería asíncrona
(**Kafka o RabbitMQ**).

### Consultora española (sin nombrar) — Senior Full Stack Java + Angular (Barcelona, sector seguros) · InfoJobs
Captured: 2026-07 · **full posting** · **5–7 años exigidos, "Senior" explícito**
Empresa no identificada en la oferta: "empresa española líder en servicios tecnológicos... desde 1995,
más de 600 empleados". Requisitos: 5–7 años como Senior Full Stack Developer; **Angular**; **inglés B2**;
**CFGS**. Stack tecnológico declarado al completo:
- **Lenguajes:** Java 21/25, TypeScript.
- **Frameworks & Runtimes:** Spring Boot 3.x/4.x, Angular 21.
- **Bases de datos:** PostgreSQL, Redis, SQLite.
- **IA / GenAI:** Spring AI (OpenAI, Vertex AI Gemini, HuggingFace, Ollama), Anthropic Claude (SDK),
  **MCP (Model Context Protocol)** y **RAG**.
- **Infraestructura & DevOps:** Docker, Jenkins (CI/CD), AWS, Kubernetes.
- **Monitorización & Observabilidad:** Dynatrace, Prometheus/Micrometer, OpenTelemetry.
- **Seguridad:** **Spring Security, OAuth2 y JWT**.
- **Testing:** **JUnit 5, Mockito**, WireMock, **Cucumber (BDD)**, **ArchUnit**, **Jasmine/Karma** (front).
- **Calidad de código:** **SonarQube** y **JaCoCo**.

### Capgemini — Software Engineer Java · Agile Delivery Center Spain (Murcia / Valencia) · careers Capgemini
Captured: 2026-07 · **full posting** · **+2 años exigidos** · **francés fluido imprescindible**
Por qué está en `Techo` y no en el suelo junior: exige "+2 years of relevant work experience" y entre las
tareas del rol figura "provide guidance and **mentorship to junior developers**" — el puesto se define
explícitamente *por encima* del junior. Además el **francés fluido** es un filtro de entrada duro
("fluent French to communicate with teams and customers"; el inglés solo "will be considered").
Centro: ADCenter Spain, hub en **Murcia y Valencia** con clientes internacionales europeos, modelo agile
distribuido, **Scrum y SAFe**, cloud-native y prácticas DevOps.
Perfil: **Java 8-17 (streams, interfaces...)**, **Spring frameworks**, **arquitectura de microservicios**.
Ciclo de vida del desarrollo y **Scrum**. BBDD **relacionales y no relacionales (SQL y NoSQL)**.
**Unit testing, integration testing y debugging con JUnit y Mockito**. Control de versiones: **Git,
GitLab, GitHub**. **Code reviews** para asegurar calidad, rendimiento y seguridad. Colaboración con
equipos remotos y cross-funcionales. Definición y refinamiento de **arquitectura software y patrones de
diseño**.
Nota de proceso: "**Even if you don't have 100% of the required knowledge, we would love to meet you!**"
— la propia oferta invita a aplicar sin cumplir el 100%.

### Talan — Senior Fullstack Java / Angular (100 % remoto) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 18/09/2026 · **5+ años exigidos** (la ficha dice 3)
URL: https://www.tecnoempleo.com/senior-fullstack-java-angular-talan/java/rf-ae7019f832c55361c247
Requisitos: "5+ years of experience working as a Full Stack Software Developer (backend-oriented
preferred)"; "Spanish and English level **C1**"; "Java; **Spring Boot; Hibernate / JPA**"; "Angular;
HTML; CSS or JavaScript / TypeScript"; "relational databases and SQL technologies such as **Oracle and
PostgreSQL**"; "designing and consuming **REST APIs**"; "**Git, GitHub**, and collaborative development
workflows"; "**Microservices Architecture**"; "**Jenkins and CI/CD pipelines**"; "Agile frameworks
(**SCRUM**)"; "containerization technologies such as **Docker and OpenShift**"; "Hands-on experience
using **AI-powered development tools** in real software engineering workflows". Deseables:
"event-driven architectures and messaging systems", "Experience with **Kubernetes**". Funciones
incluyen "**Mentor junior developers**".

### Seltime — Programadores Fullstack (100 % remoto) · Tecnoempleo
Captured: 2026-10 · web-search extract · actualizada 14/10/2026 · **4 años exigidos** (la ficha dice
3–5) · **27.000–30.000 € brutos/año**
URL: https://www.tecnoempleo.com/programadores-fullstack-seltime/java-spring-boot/rf-ab6a109ba229e38c334d
Requisitos: "Experiencia de al menos 4 años en desarrollo Fullstack"; "**Java y Spring Boot**";
"**Angular**"; "Servicios **API REST**"; "**Inglés alto**"; "**Metodología Agile**". FP2/Grado Superior,
4 puestos, 441 CVs inscritos.

### UST — Full Stack Developer (Java / Angular) (Madrid) · Tecnoempleo
Captured: 2026-10 · web-search extract · actualizada 14/10/2026 · **5+ años exigidos**
URL: https://www.tecnoempleo.com/full-stack-developer-java-angular-ust/nodejs-spring-boot/rf-c4821e7072aa4338d14b
Requisitos: "Minimum 5 years of experience in Full Stack Development"; "Advanced experience with
**Angular**", "with **Node.js**", "with **Java Spring Boot**", "with **OpenShift**"; "Strong knowledge
of **RESTful APIs** and web services"; "**Git**, version control workflows, **CI/CD pipelines**, and
DevOps practices"; "Solid understanding of **SDLC**"; "**Agile** environments". Valorables: "relational
and/or **NoSQL** databases, especially **Neo4j**"; "English level **B2/C1**".

### SlashMobility — Desarrollador (Angular 8+ Java) (remoto) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 14/10/2026 · **3 años exigidos**
URL: https://www.tecnoempleo.com/desarrollador-angular-8-java/angular-material-spring-boot/rf-2aa31f36f27083f37948
Requisitos: "Experiencia deseada: desarrollo front con **Angular 8, Angular Material**, y back del front
**Java Spring Boot 2**". Sin más detalle.

### Moffatt & Nichol (oferta ciega) — Medior Backend Software Engineer (Valencia) · Tecnoempleo
Captured: 2026-10 · web-search extract · actualizada 14/10/2026 · **3 años exigidos**
URL: https://www.tecnoempleo.com/medior-backend-software-engineer/java-spring-boot/rf-4a7918e5f2f7335f7e4c
Requisitos: "A minimum of 3 years of professional experience in software development (Java)"; "Good
knowledge of **Java and Spring Boot**"; "designing, developing, or consuming **RESTful APIs**";
"Understanding of **microservices architecture and asynchronous communication**"; "**clean code**
principles"; "**automated testing on both frontend and backend** applications"; "Fluency in
**English**". Valorados: "**Kafka** or other event-streaming technologies"; "**MongoDB, Redis**";
"**Docker** and cloud-based development environments"; "**CI/CD**"; "Basic knowledge of
**Kubernetes**"; "**Agile**". Etiquetas incluyen **Angular**.

### Grupo Digital — Full Stack Developer JAVA (AI Native) Inglés Alto (100 % remoto) · Tecnoempleo
Captured: 2026-10 · web-search extract · publicada 01/10/2026 · **3–5 años exigidos**
URL: https://www.tecnoempleo.com/full-stack-developer-java-ai-native-ingles-alto-gr/spring-boot-microservic/rf-d17f15467227637a4e49
Perfil: "tienes una base sólida en **Java/Spring Boot** y ya utilizas **IA de forma real** en tu día a
día como developer". Funciones: "soluciones basadas en **microservicios**"; "Diseñar e integrar **REST
APIs**"; "Crear y ejecutar **pruebas**"; "Trabajar con **Git, Jenkins y pipelines CI/CD**"; "código
limpio, mantenible, seguro y **observable**"; "Utilizar **herramientas de desarrollo asistidas por IA**
durante todo el SDLC"; "Aplicar IA para generación y refactorización de código, documentación,
testing, debugging y análisis de causa raíz"; "Trabajar con **LLMs**, entendiendo sus capacidades y
limitaciones"; "uso seguro de IA"; "mentorizar a perfiles más junior". (Distinta de la oferta Full
Stack junior/mid/senior de la misma empresa que está en `## Raw postings`.)

**Qué señala este techo (lectura para `coverage-senior.md`, no para coverage):**
- **Testing con taxonomía completa** — en junior el testing casi no se exige por escrito; a partir de
  mid se pide desglosado (unitario / integración / E2E). Misma curva en las cuatro ofertas, y en la
  senior de Barcelona con herramienta por nivel: **JUnit 5 + Mockito** (unit), **WireMock** (mocking de
  APIs), **Cucumber** (BDD), **ArchUnit** (tests de arquitectura), **Jasmine/Karma** (front). Nota
  importante: **JUnit 5 y Mockito son los mismos del suelo junior (~5/22)** — no cambian al subir de
  nivel, solo se les añaden capas alrededor. Lo que estudies ahora no se tira. Moffatt & Nichol (3 años,
  2026-10) lo formula como "**automated testing on both frontend and backend**": a partir de mid el
  testing de front deja de ser opcional → `angular/coverage/middle.md`.
- **Métricas de calidad de código: SonarQube y JaCoCo** — cobertura y análisis estático como requisito
  con nombre propio. Es el paso natural después de "escribir tests" → `java/coverage/middle.md`.
- **Seguridad nombrada como bloque propio: Spring Security + OAuth2 + JWT** — es exactamente la pila del
  Step 6 del proyecto 07, listada como stack senior. Refuerza que ese trabajo no es material de práctica:
  es la misma pieza que se usa arriba. OAuth2 es el escalón que aún no tocas → `security/coverage/middle.md`.
- **SOLID + patrones de diseño** — nombrados como *hard skill* con entidad propia, no como adorno.
  Es lo más cercano al nivel actual de Victor de todo el techo → candidato natural a `java/coverage/middle.md`.
- **CI/CD nombrado como "cultura DevOps"** — en las tres ofertas del techo, y con herramienta concreta
  (GitLab CI, Jenkins). **Kubernetes** aparece en dos de tres: Docker ya está en el suelo junior (~5/22),
  Kubernetes es el escalón inmediatamente siguiente y claramente fuera de junior. El lote 2026-10 lo
  confirma y añade **OpenShift** (Talan y UST, ambas 5+ años) como la variante empresarial del mismo
  escalón; Jenkins + CI/CD aparece en Talan, UST y Grupo Digital AI Native → `general/coverage/middle.md`.
- **IA en el ciclo de desarrollo como requisito con nombre** (lote 2026-10) — Talan pide "hands-on
  experience using **AI-powered development tools** in real software engineering workflows" y Grupo
  Digital titula la oferta "**AI Native**": IA para generar y refactorizar código, testing, debugging,
  análisis de causa raíz, "entendiendo [las] capacidades y limitaciones" de los LLMs y su "uso seguro".
  Dos ofertas de 3+ años en un mes. El suelo junior ya tiene la mitad defensiva (verificar lo que la IA
  propone, `general/coverage/junior.md`); lo que señala este techo es usarla **como práctica de
  ingeniería gobernada** → `general/coverage/middle.md`.
- **Mensajería asíncrona (Kafka / RabbitMQ)** — en las tres, y en Second Window explícitamente como
  *deseable*, no exigida ni siquiera a 3 años. Confirma que `Kafka` siga como *signal to watch* y no
  como objetivo: es un "suma puntos" de mid, no una puerta.
- **Observabilidad (Dynatrace, Prometheus, OpenTelemetry)** — categoría entera que no existe en ninguna
  oferta junior del fichero. Señal clara de escalón senior, no de hueco actual.
- **Code reviews y mentoring** — a partir de 2 años el rol deja de ser "escribir código" e incluye revisar
  el de otros y guiar a juniors (Capgemini ADCenter). Es la primera responsabilidad *no técnica* que
  aparece, y explica por qué las ofertas de ese tramo insisten en comunicación.
- **Un tercer idioma como palanca real** — Capgemini ADCenter (Murcia/Valencia) exige **francés fluido**
  para clientes franceses, con el inglés como secundario. El inglés sigue siendo el filtro general del
  mercado, pero en centros concretos el francés abre puertas que el inglés no. Dato a tener presente si
  el mercado se pone difícil, no un objetivo actual.
- **Java 8-17 con "streams, interfaces" nombrados aparte** — a 2 años ya no basta "saber Java": piden las
  piezas del lenguaje moderno. **Streams** es la que Victor aún no ha tocado → `java/coverage/middle.md`.
- **IA / GenAI dentro del stack Java** — Spring AI, SDK de Anthropic Claude, **MCP** y **RAG** listados
  como stack de proyecto, no como I+D. Es la primera vez que aparece en el fichero y encaja con lo que
  ya está anotado en `notes/ai-development/future-learning.md` (estudiar tras el primer empleo). El dato
  nuevo es que llega vía **Spring AI**, es decir, por el lado Java — no hace falta cambiar de ecosistema.
- **Versiones muy por delante** — Java 21/25, Spring Boot 3.x/4.x, **Angular 21**. El proyecto 07 va con
  Java 25, así que el backend está alineado con lo que pide una oferta senior de 2026. Útil para el CV.
  **Y el reverso, también en el techo:** SlashMobility (3 años, 2026-10) pide **Angular 8** y **Spring
  Boot 2** — mantenimiento de versiones antiguas. Ninguna acción de coverage: es el motivo por el que
  leer código de otra época (Jasmine/Karma, módulos) ya está en el suelo junior.
- **Referencia salarial** — Second Window paga **30–33k** por 3 años de Java + Angular fullstack en
  Madrid, y Seltime **27–30k** por 4 años en remoto (2026-10). Útil como ancla para negociar más
  adelante; el suelo junior queda por debajo de esa banda (Second Window junior, 1–2 años: **20k**).
- **Code reviews y mentoring, confirmado** — Talan ("Mentor junior developers") y Grupo Digital AI
  Native ("mentorizar a perfiles más junior") lo repiten en 2026-10: es responsabilidad del tramo
  3–5 años, no del junior. → ninguna acción de coverage; contexto para la entrevista.
- **Asincronía y eventos** — Moffatt & Nichol (3 años) exige "microservices architecture and
  **asynchronous communication**" y valora Kafka; Talan lo pone como deseable a 5+. Refuerza que la
  mensajería es de mid → `architecture/coverage/middle.md`.
- **Arquitectura Hexagonal / DDD táctico** — el salto arquitectónico de mid → `architecture/coverage/middle.md`.
- **Angular avanzado: NgRx, Signals, Nx** — la oferta de Zemsania es la única del fichero donde Angular
  es el eje y el backend el complemento. → `angular/coverage/middle.md`.
- **APIs REST con adjetivos** (rendimiento, escalabilidad, seguridad) — a los 3 años ya no se pide
  "saber hacer REST", se pide hacerlas bien. Ese es el salto real junior → mid.

---

## Synthesis — recurring requirements by stack

Distilled from the ~22 junior postings above (14 captured 2026-07, 8 captured 2026-10). Frequencies are
approximate — evidence is partial. Merkle and SlashMobility each count once although each block holds
two openings; Sopra Steria counts only for Java, because its stack is taught rather than required.

**Backend — Java / Spring Boot** (the core of the target roles)
- **Java (8 / 17)** — ~21/22 postings (baseline, non-negotiable)
- **Spring Boot / Spring Framework** — ~17/22 (exceptions: Ayesa — Java sin framework nombrado —,
  SlashMobility — Java + microservicios + React — y Sopra Steria, que lo enseña)
- **Relational DB (PostgreSQL / MySQL / SQL / Oracle)** — ~10/22 (**Oracle** crece: ver signals)
- **REST APIs / servicios web** — ~9/22
- **Spring Data / JPA / Hibernate** — ~6/22 (named directly, implied by "Suite de Spring", as Hibernate,
  o como "JPA y **relaciones one-to-many**")
- **Microservices** — ~6/22 (present but leans mid-level; junior-facing as "aware of". En 2026-10 ya lo
  piden dos juniors: SlashMobility y Accenture)
- **Testing: JUnit + Mockito** — ~5/22 (explicit; a hard differentiator at junior level. Grupo Digital
  lo pide desglosado — "pruebas unitarias **e integración**" — ya en una oferta que admite juniors;
  Merkle no nombra herramienta pero pide **TDD** como forma de trabajar)
- **Docker / containers** — ~5/22 (rising; baseline in microservices roles)
- **CI/CD (Jenkins / GitLab CI)** — ~4/22 y **subiendo**: ya no es solo del techo, aparece en ofertas que
  admiten juniors (Grupo Digital, Santander, UST, Merkle como valorable)
- **Maven** — ~4/22
- **Java EE legado (J2EE / Struts / JSP / JDBC)** — ~3/22, **nuevo en 2026-10** (Merkle J2EE, Seltime
  Struts, sg tech JSP + JDBC como deseables). Es mantenimiento de consultora: pide *reconocer y leer*
  ese código, no construir con él. Encaja con "leer código que no escribiste" del suelo junior
- **NoSQL (MongoDB / Redis)** — ~3/22 (siempre *junto a* la relacional, nunca en su lugar)

**Frontend — Angular**
- **Angular (v12+ / v18)** — ~15/22 (asked in nearly every full-stack posting; en el lote 2026-10, dos
  de las tres lo ponen como *deseable* sobre una oferta Java backend — Second Window, Seltime)
- **HTML / CSS / SASS** — ~6/22
- **TypeScript** — ~5/22 (baseline for any Angular role)
- **RxJS** — ~3/22 (strong in frontend-focused postings)
- **Testing: Jasmine / Karma / Jest** — ~3/22
- **Angular Material** — ~2/22

**Cross-cutting**
- **Agile / Scrum-Kanban** — ~11/22 (named in almost every posting)
- **English (B2)** — ~10/22 required + ~1 conditional (near-universal at global consultancies; one posting
  marks it *obligatorio*, NTT Castellón makes it the key to international projects rather than a filter.
  Ayesa, en sector público español, no lo menciona; Sopra Steria junior pide **francés B2** en su lugar)
- **Git** — ~9/22 (assumed everywhere)
- **Cloud (public — Azure/AWS awareness)** — ~4/22
- **Principios SOLID / diseño OO / clean code** — ~3/22 (Grupo Digital "SOLID y arquitectura por capas",
  Merkle "Object-Oriented Design" + "refactoring, testing, clean code"). Es diseño, no herramienta:
  barato de estudiar y caro de improvisar
- **Documentación de APIs (Swagger / OpenAPI / RAML)** — ~2/22 (Grupo Digital Swagger, Accenture RAML);
  anotado para vigilar

**Signals to watch (appear in postings but NOT a junior floor — do not force into junior coverage)**
- Spring Cloud, Spring Batch — mid-level / specific projects
- Kafka / messaging — mid-level microservices
- Jenkins / CI-CD pipelines — nice-to-have but **rising**: now named in 3 junior postings (UST,
  Santander, Merkle as valorable), the Santander one bundling it as "DevOps: Jira, Jenkins, Git, GitHub"
- **React** — ~5/22. Until 2026-07 always an *alternative* to Angular in full-stack postings; the
  2026-10 batch brings the first junior Java posting that pairs it with **React / React Native and no
  Angular** (SlashMobility). Off Victor's roadmap by design; market context, not a gap to close
- **jQuery / frontend legacy** — named once (NTT Castellón, full posting). Real signal of consultancy
  maintenance work, but not something to study ahead of the roadmap
- **JasperReports / generación de informes** — named once (Ayesa, sector público). Herramienta de nicho
  típica de administración pública y banca; se aprende en el puesto, no se estudia antes
- **Oracle** — ~4/22, mayoritariamente banca y administración pública (Ayesa, sg tech) pero también
  fuera (Merkle). No desplaza a PostgreSQL como BBDD de estudio, pero explica por qué el SQL estándar
  (no el dialecto) es lo que conviene dominar
- **Seguridad de APIs / Spring Security con roles** — ~2/22 (Grupo Digital "Spring Security con control
  de acceso por roles"; Accenture "seguridad de APIs (autenticación, autorización...)"). Baja frecuencia
  pero es exactamente el trabajo JWT del proyecto 07
- **Frameworks propietarios de cliente bancario (NOVA, ASO)** — ~2/22, nuevo en 2026-10 (sg tech, Accenture).
  Se aprenden en el puesto sobre Java + Spring Boot; lo que transfiere es la base, no el framework
- **TDD / BDD como método** — una empresa (Merkle, dos vacantes). Señal de que "testing" a veces se pide
  como forma de trabajar, no solo como herramienta
- **Francés como filtro de entrada** — Sopra Steria junior (Barcelona, Valencia, Madrid) y Capgemini
  ADCenter en el techo. Palanca en centros concretos, no objetivo
- **MongoDB / NoSQL** — appears alongside the relational DBs in one junior full-stack posting
- NgRx / state management — appears in higher junior/mid Angular roles

---

_Last updated: 2026-10 (10 web-search extracts 2026-07 + 4 full postings 2026-07 + 8 web-search extracts 2026-10)  ·  postings on file: 22 junior + 11 en `## Techo`_
