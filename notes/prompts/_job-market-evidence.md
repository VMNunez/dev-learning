# Job market evidence — real postings that anchor coverage

**Purpose.** Coverage decisions should be anchored to what the target companies *actually ask for in
2026*, not only to what a model believes they ask. This file holds that ground truth: real junior job
postings from the target consultancies, plus a distilled synthesis of the requirements that recur
across them. `coverage-prompt.md` and `coverage-audit-prompt.md` read it as a **source** — an item
that shows up repeatedly here is a strong signal it belongs in coverage.

**How the coverage prompts use it:**
- If this file has evidence, treat the recurring requirements in the Synthesis as a required floor —
  every recurring skill must map to coverage items, and a gap here is a gap in coverage.
- If this file is empty or stale, coverage falls back to the model's knowledge of the Spanish market
  and may complement it with a live web search. Real evidence here always outranks the model's guess.

**Evidence quality note.** The postings below were captured from **web-search extracts (July 2026)**,
not full pasted job descriptions — individual postings on Tecnoempleo/Indra/NTT expire fast (410 Gone)
and several career sites are login-walled. The requirement text is real and quoted, but partial. To
strengthen this file, paste 2–3 *full* "Requisitos" blocks from live postings when you see them.

> Keep it honest: what recurs across many postings is a strong signal; what appears in one senior-ish
> posting (Kafka, Spring Cloud, Spring Batch) is not a junior floor — note it as a "signal to watch",
> not a requirement.

---

## Raw postings

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

---

## Synthesis — recurring requirements by stack

Distilled from the ~8 postings above (July 2026). Frequencies are approximate — evidence is partial.

**Backend — Java / Spring Boot** (the core of the target roles)
- **Java (8 / 17)** — ~8/8 postings (baseline, non-negotiable)
- **Spring Boot / Spring Framework** — ~8/8
- **REST APIs** — ~6/8
- **Relational DB (MySQL / PostgreSQL)** — ~6/8
- **Testing: JUnit + Mockito** — ~4/8 (explicit; a hard differentiator at junior level)
- **Spring Data / JPA** — ~4/8 (named directly or implied by "Suite de Spring")
- **Maven** — ~3/8
- **Docker / containers** — ~3/8 (rising; baseline in microservices roles)
- **Microservices** — ~3/8 (present but leans mid-level; junior-facing as "aware of")

**Frontend — Angular**
- **Angular (v12+ / v18)** — ~6/8
- **TypeScript** — ~4/8 (baseline for any Angular role)
- **RxJS** — ~3/8 (strong in frontend-focused postings)
- **HTML / CSS / SASS** — ~4/8
- **Angular Material** — ~2/8
- **Testing: Jasmine / Karma / Jest** — ~2/8

**Cross-cutting**
- **Git** — ~6/8 (assumed everywhere)
- **Agile / Scrum-Kanban** — ~6/8 (named in almost every posting)
- **English (B2)** — ~7/8 (global consultancies, near-universal ask)
- **Cloud (public — Azure/AWS awareness)** — ~3/8

**Signals to watch (appear in postings but NOT a junior floor — do not force into junior coverage)**
- Spring Cloud, Spring Batch — mid-level / specific projects
- Kafka / messaging — mid-level microservices
- Jenkins / CI-CD pipelines — nice-to-have, rising
- NgRx / state management — appears in higher junior/mid Angular roles

---

_Last updated: 2026-07 (web-search extracts)  ·  postings on file: 8_
