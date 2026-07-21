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
