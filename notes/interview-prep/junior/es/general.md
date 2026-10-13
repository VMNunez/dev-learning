# General — Preguntas de entrevista

<a id="study-index"></a>

## Índice de estudio

Empieza por la primera vuelta. Dentro de cada vuelta, sigue los temas de arriba abajo y trabaja un grupo pequeño de preguntas cada vez. Si una pregunta requiere un concepto de otra vuelta, consulta esa pregunta y vuelve al punto donde estabas.

| Vuelta | Prioridad | Preguntas |
|---|---|---:|
| [1. Imprescindibles](#study-pass-1) | ⭐⭐⭐ | 6 |
| [2. Profundización](#study-pass-2) | ⭐⭐ | 17 |
| [3. Detalles](#study-pass-3) | ⭐ | 0 |

Lee la pregunta, intenta responder sin mirar, contrasta tu respuesta con la escrita y vuelve a explicarla con tus palabras. En el siguiente bloque, recupera alguna pregunta anterior sin consultar la respuesta.

Los enlaces llevan a las preguntas originales. Los números son sus identificadores, no el orden de estudio. Este índice sirve para estudiar por tu cuenta. Registra aquí tu progreso: ✅ y la fecha al final de la línea de cada pregunta que hayas trabajado, y después · PASS y la fecha cuando la superes en un examen de repaso.

<a id="study-pass-1"></a>

### Primera vuelta — Imprescindibles — ⭐⭐⭐

**Programación general**

- [001 — El principio DRY](#GEN-J-001)
- [002 — Código síncrono frente a asíncrono](#GEN-J-002)

**Agile y trabajo en equipo**

- [008 — Trabajar en un entorno ágil](#GEN-J-008)
- [012 — Scrum frente a Kanban](#GEN-J-012)
- [013 — Los roles en Scrum](#GEN-J-013)

**HTTP fundamentals**

- [018 — PUT frente a PATCH e idempotencia](#GEN-J-018)

<a id="study-pass-2"></a>

### Segunda vuelta — Profundización — ⭐⭐

**Programación general**

- [003 — Inmutabilidad en Angular](#GEN-J-003)
- [004 — Separación de responsabilidades](#GEN-J-004)
- [005 — Single source of truth](#GEN-J-005)
- [006 — El principio KISS](#GEN-J-006)
- [007 — Qué es YAGNI](#GEN-J-007)

**Agile y trabajo en equipo**

- [009 — Sprint frente a backlog](#GEN-J-009)
- [010 — El daily standup](#GEN-J-010)
- [011 — Del trabajo en solitario al equipo](#GEN-J-011)
- [014 — Las ceremonias de Scrum](#GEN-J-014)
- [015 — Qué es una user story](#GEN-J-015)
- [016 — Story points en vez de horas](#GEN-J-016)
- [017 — Definition of Done](#GEN-J-017)

**HTTP fundamentals**

- [019 — Contraseñas por HTTP plano](#GEN-J-019)

**Testing concepts**

- [020 — Mock frente a stub](#GEN-J-020)

**Tooling and operations**

- [021 — Base64 no es cifrado](#GEN-J-021)
- [022 — Secretos commiteados a git](#GEN-J-022)
- [023 — Depurar con print y niveles de log](#GEN-J-023)

<a id="study-pass-3"></a>

### Tercera vuelta — Detalles — ⭐

---

## Programación general

<a id="GEN-J-001"></a>

**[GEN-J-001] ¿Qué es el principio DRY?** ⭐⭐⭐
"Don't Repeat Yourself" — si la misma lógica aparece en más de un sitio, extráela a una función, servicio o componente. En el HR portal, el patrón del confirm dialog es reutilizable en tres páginas diferentes — eso es DRY en la práctica.

<a id="GEN-J-002"></a>

**[GEN-J-002] ¿Cuál es la diferencia entre código síncrono y asíncrono?** ⭐⭐⭐
El código síncrono se ejecuta línea a línea y bloquea la ejecución hasta que cada línea termina. El código asíncrono (llamadas HTTP, timers, eventos de usuario) inicia una operación y continúa sin esperar a que termine. En Angular, casi todo lo que toca un servidor es asíncrono — por eso usamos Observables y signals.

<a id="GEN-J-003"></a>

**[GEN-J-003] ¿Qué es la inmutabilidad y por qué importa en Angular?** ⭐⭐
La inmutabilidad significa no modificar objetos existentes — en su lugar, creas nuevos con los cambios. La detección de cambios de Angular funciona mejor con datos inmutables porque puede detectar cambios por referencia. Las peticiones HTTP también son inmutables en Angular — por eso usas `req.clone()` en los interceptores.

<a id="GEN-J-004"></a>

**[GEN-J-004] ¿Qué es la separación de responsabilidades?** ⭐⭐
Cada parte del código debe hacer una cosa y ser responsable de un área. En Angular: los componentes gestionan el template, los servicios gestionan datos y lógica, los guards gestionan el acceso a las rutas. Mezclarlos hace el código más difícil de probar y mantener.

<a id="GEN-J-005"></a>

**[GEN-J-005] ¿Qué significa "single source of truth"?** ⭐⭐
Un único lugar en la app contiene la versión autorizada de un dato. En el HR portal, `EmployeeService` es la fuente única de verdad para la lista de empleados — cualquier componente que la necesite lee desde allí, así todos se mantienen sincronizados automáticamente.

<a id="GEN-J-006"></a>

**[GEN-J-006] ¿Qué es el principio KISS?** ⭐⭐
KISS — "Keep It Simple, Stupid". La solución más simple que resuelve el problema es la correcta; la complejidad es un coste que solo pagas cuando está justificado. En la práctica significa no recurrir a un patrón de diseño, una abstracción o un one-liner ingenioso cuando una función simple bastaría. Importa más que nunca en 2026 porque las herramientas de IA generan boilerplate sobre-diseñado — reconocer cuándo el código es innecesariamente complejo y simplificarlo es una habilidad real de revisión.

> **Junior tip:** Tie it to AI: "AI often gives me a more complex solution than the problem needs — KISS is knowing when to delete half of it."
> **Consejo de entrevista:** Conéctalo con la IA: "la IA a menudo me da una solución más compleja de lo que el problema necesita — KISS es saber cuándo borrar la mitad."

<a id="GEN-J-007"></a>

**[GEN-J-007] ¿Qué es YAGNI?** ⭐⭐
YAGNI — "You Aren't Gonna Need It". No construyas funcionalidades ni flexibilidad para requisitos futuros hipotéticos; construye solo lo que se necesita ahora. Violaciones clásicas: añadir paginación antes de que ninguna lista sea larga, o construir un sistema de plugins configurable para una funcionalidad que tiene exactamente una implementación. El requisito futuro a menudo nunca llega, y el código especulativo se convierte en peso muerto que aún hay que mantener y testear.

> **Junior tip:** Pair it with KISS — "KISS keeps the solution simple, YAGNI keeps me from solving problems I don't have yet."
> **Consejo de entrevista:** Combínalo con KISS — "KISS mantiene la solución simple, YAGNI me impide resolver problemas que aún no tengo." Menciona que el código generado por IA suele violar YAGNI con abstracciones especulativas.

---

## Agile y trabajo en equipo

<a id="GEN-J-008"></a>

**[GEN-J-008] ¿Has trabajado en un entorno ágil?** ⭐⭐⭐
No de forma profesional, pero sigo prácticas ágiles en mis propios proyectos — commits atómicos, ramas de feature, descripciones de PR y cambios cortos y enfocados. Entiendo la ceremonia: daily standup para compartir bloqueos, sprint para acotar el trabajo en el tiempo, retrospectiva para mejorar el proceso. Lo que más rápido adoptaría en una consultora es el ciclo de revisión de PR — ya lo practico en mi flujo de trabajo personal.

<a id="GEN-J-009"></a>

**[GEN-J-009] ¿Cuál es la diferencia entre un sprint y un backlog?** ⭐⭐
El backlog es la lista completa de funcionalidades y tareas del proyecto, ordenadas por prioridad. Un sprint es un período de tiempo fijo — normalmente dos semanas — en el que el equipo elige un subconjunto del backlog y se compromete a terminarlo. Al final del sprint tienes software funcionando, no features a medias.

<a id="GEN-J-010"></a>

**[GEN-J-010] ¿Qué es un daily standup y qué dices en él?** ⭐⭐
Una reunión diaria corta — normalmente 15 minutos — en la que cada persona responde tres preguntas: qué hice ayer, qué haré hoy y hay algo que me bloquea. El objetivo es sacar los bloqueos a la superficie pronto, no reportar el progreso a un manager.

<a id="GEN-J-011"></a>

**[GEN-J-011] ¿Qué cambiarías de tu forma de trabajar en solitario al unirte a un equipo?** ⭐⭐
Lo que realmente quieren saber: ¿Estás listo para la colaboración profesional, o serás disruptivo en un equipo?
R: El mayor cambio sería la disciplina con git — nunca mergear tus propios PRs, mantener los commits atómicos para que los compañeros puedan seguir el historial, y escribir descripciones de PR que expliquen el por qué, no solo el qué. Ya hago esto en mis proyectos personales. Lo más difícil es acordar la arquitectura de antemano — por eso existen patrones como Core/Feature/Shared, para que cinco desarrolladores puedan trabajar de forma independiente sin romper el código del otro.
Respuesta mala: "Comunicaría más." — Demasiado vago. El entrevistador quiere prácticas concretas, no intenciones.

<a id="GEN-J-012"></a>

**[GEN-J-012] ¿Cuál es la diferencia entre Scrum y Kanban?** ⭐⭐⭐
Scrum trabaja en sprints fijos — normalmente dos semanas — con roles y ceremonias definidas, y el equipo se compromete a un conjunto de items en cada sprint. Kanban es un flujo continuo: las tareas se mueven por un tablero y el equipo coge la siguiente cuando tiene capacidad, con un límite de cuántas pueden estar en curso a la vez. Scrum encaja con trabajo de features planificado; Kanban con un flujo constante de tareas impredecibles como soporte o corrección de bugs. Las consultoras usan sobre todo Scrum, a veces Kanban para equipos de mantenimiento.

<a id="GEN-J-013"></a>

**[GEN-J-013] ¿Cuáles son los roles en Scrum?** ⭐⭐⭐
Tres: el Product Owner es dueño del backlog y decide la prioridad — representa al cliente. El Scrum Master elimina bloqueos y protege el proceso; no es un manager y no asigna tareas. El Development Team construye el incremento. Lo que importa como junior: yo no decido qué se construye a continuación — eso es del PO — y si estoy bloqueado, lo planteo al Scrum Master, normalmente en el daily standup.

<a id="GEN-J-014"></a>

**[GEN-J-014] ¿Cuáles son las ceremonias de Scrum?** ⭐⭐
Cuatro. El sprint planning al principio — el equipo decide qué mete en el sprint. El daily standup — la sincronización de 15 minutos sobre progreso y bloqueos. El sprint review al final — haces una demo del incremento funcionando a los stakeholders. Y la retrospectiva — el equipo mira su propio proceso y acuerda una cosa que mejorar. Planning y standup son sobre el trabajo; review y retro son sobre el resultado y el proceso.

<a id="GEN-J-015"></a>

**[GEN-J-015] ¿Qué es una user story?** ⭐⭐
Un requisito escrito desde el punto de vista del usuario, con el formato "Como [rol], quiero [objetivo] para [beneficio]". Por ejemplo, en TimeTrack: "Como manager, quiero aprobar las entradas de tiempo enviadas para que la nómina solo cuente horas validadas." Mantiene el foco en el valor para el usuario, no solo en una tarea técnica, y la parte del "para" es lo que te dice cuándo la story está realmente terminada.

<a id="GEN-J-016"></a>

**[GEN-J-016] ¿Por qué los equipos estiman en story points en vez de en horas?** ⭐⭐
Porque a la gente se le da mal adivinar horas pero razonablemente bien comparar tamaños. Los story points son una medida relativa — esta story es aproximadamente el doble de esfuerzo que aquella — normalmente en una escala tipo Fibonacci. También separa el esfuerzo de la persona: dos horas para mí y para un senior son distintas, pero el tamaño relativo del trabajo es el mismo. Como junior esperaría estimar en equipo, no solo.

<a id="GEN-J-017"></a>

**[GEN-J-017] ¿Qué significa "Definition of Done"?** ⭐⭐
Es la checklist compartida que un item tiene que cumplir antes de que el equipo lo dé por terminado — normalmente: código escrito, revisado en un PR, testeado, mergeado, y que cumple los criterios de aceptación de la story. La clave es que "done" es un acuerdo del equipo, no una opinión personal. En mis propios proyectos mi definición de done es: el código funciona, tiene al menos un test con sentido, corre en local, y está commiteado de forma atómica — la misma idea aplicada en solitario.

---

## HTTP fundamentals

<a id="GEN-J-018"></a>

**[GEN-J-018] ¿Cuál es la diferencia entre PUT y PATCH, y qué significa la idempotencia?** ⭐⭐⭐
PUT reemplaza el recurso completo — el cliente envía todos los campos, y cualquier campo omitido se vacía. PATCH actualiza solo los campos que envías y deja el resto intacto. Ambos son *idempotentes*: llamar al mismo PUT o DELETE varias veces deja el sistema en el mismo estado final que llamarlo una vez. POST *no* es idempotente — cada llamada puede crear un recurso nuevo. La idempotencia importa para la fiabilidad: si un fallo de red hace que un cliente reintente, una petición idempotente es segura de repetir, mientras que un POST podría crear un duplicado.

> **Junior tip:** "PUT and DELETE are idempotent, POST is not — so a retried POST can duplicate data."
> **Consejo de entrevista:** El ángulo de la idempotencia separa al junior que conoce CRUD del que conoce REST. Di: "PUT y DELETE son idempotentes, POST no — así que un POST reintentado puede duplicar datos."

<a id="GEN-J-019"></a>

**[GEN-J-019] ¿Por qué nunca debes enviar una contraseña por HTTP plano?** ⭐⭐
Porque el tráfico HTTP viaja en texto plano — cualquiera entre el cliente y el servidor (en la misma Wi-Fi, un ISP, un router comprometido) puede leer la petición, incluida la contraseña o el JWT en la cabecera `Authorization`. HTTPS envuelve la conexión en TLS, que cifra todo en tránsito para que no se pueda leer ni manipular. Cualquier API que maneje credenciales o tokens debe ser solo-HTTPS; en producción además rediriges HTTP a HTTPS para que una petición nunca se envíe sin cifrar por accidente.

> **Junior tip:** "HTTP is plain text, HTTPS is encrypted in transit — credentials and JWTs must only ever go over HTTPS."
> **Consejo de entrevista:** La frase clave: "HTTP es texto plano, HTTPS está cifrado en tránsito — las credenciales y los JWT solo deben ir por HTTPS." Demuestra que entiendes la amenaza, no solo el acrónimo.

---

## Testing concepts

<a id="GEN-J-020"></a>

**[GEN-J-020] ¿Cuál es la diferencia entre un mock y un stub?** ⭐⭐
Ambos reemplazan una dependencia real en un test, pero su propósito difiere. Un *stub* solo devuelve un valor fijo y preparado para que el código bajo prueba tenga algo con lo que trabajar — no compruebas cómo se usó. Un *mock* es un falso configurable que además puedes *verificar* después — afirmas que fue llamado, cuántas veces y con qué argumentos. En la práctica la palabra "mock" se usa de forma laxa para ambos, y Mockito cubre los dos: `when(...).thenReturn(...)` es el comportamiento de stub, `verify(...)` es el de mock.

> **Junior tip:** "a stub gives an answer; a mock also lets me verify the interaction."
> **Consejo de entrevista:** La distinción que buscan: "un stub da una respuesta; un mock además me deja verificar la interacción." Menciona que Mockito hace ambos, así que la línea se difumina en el día a día.

---

## Tooling and operations

<a id="GEN-J-021"></a>

**[GEN-J-021] ¿Es Base64 una forma de cifrado?** ⭐⭐
No — Base64 es *codificación*, no cifrado. Es una forma reversible de representar datos binarios usando 64 caracteres imprimibles, y cualquiera puede decodificarlo en un paso sin ninguna clave. Por eso justamente un JWT no es "seguro" solo por estar en Base64: puedes pegar cualquier token en jwt.io y leer el header y el payload al instante. La seguridad de un JWT viene de su firma, no de la codificación. Los entrevistadores preguntan esto específicamente para pillar a candidatos que confunden codificación con seguridad.

> **Junior tip:** "Base64 is encoding, not encryption — no key, instantly reversible."
> **Consejo de entrevista:** Dilo sin rodeos: "Base64 es codificación, no cifrado — sin clave, reversible al instante." Luego conéctalo con el JWT: el payload es legible, solo la firma lo protege.

<a id="GEN-J-022"></a>

**[GEN-J-022] ¿Por qué los secretos nunca deben commitearse a git, aunque los borres después?** ⭐⭐
Porque el historial de git es permanente — un secreto commiteado una vez queda visible en cada clon y en el historial para siempre, incluso después de borrarlo en un commit posterior. Así que en el momento en que una clave se pushea debe tratarse como comprometida y rotarse de inmediato; quitarla de la última versión no deshace la exposición. La configuración correcta es mantener los secretos en variables de entorno (referenciadas como `${VAR}` en la config), commitear solo un `.env.example` que documente qué variables hacen falta, y nunca los valores reales.

Respuesta mala: "Lo borré en el siguiente commit, así que no pasa nada." — El secreto sigue en el historial de cada clon. Borrarlo después no lo elimina; la única respuesta segura es rotar la clave.

<a id="GEN-J-023"></a>

**[GEN-J-023] ¿Por qué `console.log` / `System.out.println` no basta para depurar código en producción, y qué son los niveles de log?** ⭐⭐
Las sentencias de print no se pueden desactivar sin editar código, no llevan marca de tiempo y desaparecen cuando se cierra la terminal — inútiles una vez que una app está desplegada sin un depurador conectado. Un framework de logging te da niveles que puedes filtrar: `DEBUG` (detallado, solo dev), `INFO` (eventos normales como "usuario inició sesión"), `WARN` (algo inesperado pero recuperado) y `ERROR` (algo falló de verdad). Pones el nivel de producción en `INFO` o `WARN` para que el ruido desaparezca pero los problemas se sigan registrando con marca de tiempo y contexto.

> **Junior tip:** a caught exception the app recovered from is `WARN`, not `ERROR`.
> **Consejo de entrevista:** Elige el nivel a propósito: una excepción capturada de la que la app se recuperó es `WARN`, no `ERROR`. Conocer esa distinción demuestra que has pensado en logs de producción reales.
