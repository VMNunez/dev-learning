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
  to show where the bar is heading, and it feeds the `future-learning.md` files — never coverage, never
  the Synthesis frequencies. A skill that appears *only* there is by definition one Victor does not need
  yet. Read the Raw postings + Synthesis; skip `Techo`.

**Evidence quality note.** Most postings below were captured from **web-search extracts (July 2026)**,
not full job descriptions — individual postings on Tecnoempleo/Indra/NTT expire fast (410 Gone) and
several career sites are login-walled. That text is real and quoted, but partial: an extract can drop a
requirement rather than prove its absence, which is why a skill's low frequency here is never evidence
it is not asked. **One posting is a full pasted offer** (NTT DATA Castellón, marked `full posting`) and
carries more weight than the extracts around it. To strengthen this file, paste 2–3 more *full*
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

### Sector banca — Programador Junior Full Stack · Jooble / Indeed España
Captured: 2026-07 · web-search extract
Requisitos: **1 a 2 años** de experiencia laboral. **Java**, **JavaScript**, **Node JS**, **React** y
**Angular**, para proyectos del **sector bancario**.

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

### Full Stack Junior (Madrid, proyecto estable) · Indeed España
Captured: 2026-07 · web-search extract
Requisitos: al menos **1 año** de experiencia como desarrollador Full Stack. **Java** y **JavaScript**;
**Spring Boot** y **Spring Security con control de acceso basado en roles**; **React (Hooks)** y
**Angular** en frontend; bases de datos **MySQL, PostgreSQL y MongoDB**; **nivel alto de inglés
(obligatorio)**. Responsabilidades: desarrollo Full Stack con Java, Spring Boot y JavaScript, frontend
con React y Angular, y trabajo con bases de datos relacionales y NoSQL.

---

## Techo — ofertas mid/senior (NO cuentan para las frecuencias junior)

> **Regla dura, léela antes de usar esta sección.** Estas ofertas exigen explícitamente 3+ años y están
> **fuera del perfil objetivo**. Existen aquí por una única razón: mostrar **hacia dónde va el listón**,
> para alimentar los `future-learning.md` de cada topic. **Nunca** entran en el denominador de la
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

**Qué señala este techo (lectura para `future-learning.md`, no para coverage):**
- **Testing con taxonomía completa** — en junior el testing casi no se exige por escrito; a partir de
  mid se pide desglosado (unitario / integración / E2E). Es la misma curva en las dos ofertas.
- **SOLID + patrones de diseño** — nombrados como *hard skill* con entidad propia, no como adorno.
  Es lo más cercano al nivel actual de Victor de todo el techo → candidato natural a `java/future-learning.md`.
- **CI/CD nombrado como "cultura DevOps"** — en las tres ofertas del techo, y con herramienta concreta
  (GitLab CI, Jenkins). **Kubernetes** aparece en dos de tres: Docker ya está en el suelo junior (~3/13),
  Kubernetes es el escalón inmediatamente siguiente y claramente fuera de junior.
- **Mensajería asíncrona (Kafka / RabbitMQ)** — en las tres, y en Second Window explícitamente como
  *deseable*, no exigida ni siquiera a 3 años. Confirma que `Kafka` siga como *signal to watch* y no
  como objetivo: es un "suma puntos" de mid, no una puerta.
- **Referencia salarial** — Second Window paga **30–33k** por 3 años de Java + Angular fullstack en
  Madrid. Útil como ancla para negociar más adelante; el suelo junior queda por debajo de esa banda.
- **Arquitectura Hexagonal / DDD táctico** — el salto arquitectónico de mid → `architecture/future-learning.md`.
- **Angular avanzado: NgRx, Signals, Nx** — la oferta de Zemsania es la única del fichero donde Angular
  es el eje y el backend el complemento. → `angular/future-learning.md`.
- **APIs REST con adjetivos** (rendimiento, escalabilidad, seguridad) — a los 3 años ya no se pide
  "saber hacer REST", se pide hacerlas bien. Ese es el salto real junior → mid.

---

## Synthesis — recurring requirements by stack

Distilled from the ~13 postings above (July 2026). Frequencies are approximate — evidence is partial.

**Backend — Java / Spring Boot** (the core of the target roles)
- **Java (8 / 17)** — ~12/13 postings (baseline, non-negotiable)
- **Spring Boot / Spring Framework** — ~11/13
- **Relational DB (MySQL / PostgreSQL / SQL)** — ~8/13
- **REST APIs / servicios web** — ~7/13
- **Spring Data / JPA / Hibernate** — ~5/13 (named directly, implied by "Suite de Spring", or as Hibernate)
- **Microservices** — ~5/13 (present but leans mid-level; junior-facing as "aware of")
- **Testing: JUnit + Mockito** — ~4/13 (explicit; a hard differentiator at junior level)
- **Maven** — ~3/13
- **Docker / containers** — ~3/13 (rising; baseline in microservices roles)

**Frontend — Angular**
- **Angular (v12+ / v18)** — ~11/13 (asked in nearly every full-stack posting)
- **TypeScript** — ~5/13 (baseline for any Angular role)
- **HTML / CSS / SASS** — ~5/13
- **RxJS** — ~3/13 (strong in frontend-focused postings)
- **Angular Material** — ~2/13
- **Testing: Jasmine / Karma / Jest** — ~2/13

**Cross-cutting**
- **English (B2)** — ~9/13 required + ~1 conditional (near-universal at global consultancies; one posting
  marks it *obligatorio*, NTT Castellón makes it the key to international projects rather than a filter)
- **Git** — ~7/13 (assumed everywhere)
- **Agile / Scrum-Kanban** — ~7/13 (named in almost every posting)
- **Cloud (public — Azure/AWS awareness)** — ~3/13

**Signals to watch (appear in postings but NOT a junior floor — do not force into junior coverage)**
- Spring Cloud, Spring Batch — mid-level / specific projects
- Kafka / messaging — mid-level microservices
- Jenkins / CI-CD pipelines — nice-to-have but **rising**: now named in 2 postings (UST, Santander),
  the Santander one bundling it as "DevOps: Jira, Jenkins, Git, GitHub" for a *junior* role
- **React** — ~4/13, always as an *alternative* to Angular in full-stack postings, never instead
  of it. Off Victor's roadmap by design; noted only as market context, not a gap to close
- **jQuery / frontend legacy** — named once (NTT Castellón, full posting). Real signal of consultancy
  maintenance work, but not something to study ahead of the roadmap
- **Spring Security / role-based access control** — named explicitly in one junior full-stack posting;
  low frequency but directly relevant to project 07's JWT work
- **MongoDB / NoSQL** — appears alongside the relational DBs in one junior full-stack posting
- NgRx / state management — appears in higher junior/mid Angular roles

---

_Last updated: 2026-07 (12 web-search extracts + 1 full posting)  ·  postings on file: 13_
