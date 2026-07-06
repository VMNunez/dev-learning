# General — Preguntas de entrevista

## Programación general

**¿Qué es el principio DRY?** ⭐⭐⭐
"Don't Repeat Yourself" — si la misma lógica aparece en más de un sitio, extráela a una función, servicio o componente. En el HR portal, el patrón del confirm dialog es reutilizable en tres páginas diferentes — eso es DRY en la práctica.

**¿Cuál es la diferencia entre código síncrono y asíncrono?** ⭐⭐⭐
El código síncrono se ejecuta línea a línea y bloquea la ejecución hasta que cada línea termina. El código asíncrono (llamadas HTTP, timers, eventos de usuario) inicia una operación y continúa sin esperar a que termine. En Angular, casi todo lo que toca un servidor es asíncrono — por eso usamos Observables y signals.

**¿Qué es la inmutabilidad y por qué importa en Angular?** ⭐⭐
La inmutabilidad significa no modificar objetos existentes — en su lugar, creas nuevos con los cambios. La detección de cambios de Angular funciona mejor con datos inmutables porque puede detectar cambios por referencia. Las peticiones HTTP también son inmutables en Angular — por eso usas `req.clone()` en los interceptores.

**¿Qué es la separación de responsabilidades?** ⭐⭐
Cada parte del código debe hacer una cosa y ser responsable de un área. En Angular: los componentes gestionan el template, los servicios gestionan datos y lógica, los guards gestionan el acceso a las rutas. Mezclarlos hace el código más difícil de probar y mantener.

**¿Qué significa "single source of truth"?** ⭐⭐
Un único lugar en la app contiene la versión autorizada de un dato. En el HR portal, `EmployeeService` es la fuente única de verdad para la lista de empleados — cualquier componente que la necesite lee desde allí, así todos se mantienen sincronizados automáticamente.

**¿Qué es el principio KISS?** ⭐⭐
KISS — "Keep It Simple, Stupid". La solución más simple que resuelve el problema es la correcta; la complejidad es un coste que solo pagas cuando está justificado. En la práctica significa no recurrir a un patrón de diseño, una abstracción o un one-liner ingenioso cuando una función simple bastaría. Importa más que nunca en 2026 porque las herramientas de IA generan boilerplate sobre-diseñado — reconocer cuándo el código es innecesariamente complejo y simplificarlo es una habilidad real de revisión.

> **Junior tip:** Tie it to AI: "AI often gives me a more complex solution than the problem needs — KISS is knowing when to delete half of it."
> **Consejo de entrevista:** Conéctalo con la IA: "la IA a menudo me da una solución más compleja de lo que el problema necesita — KISS es saber cuándo borrar la mitad."

**¿Qué es YAGNI?** ⭐⭐
YAGNI — "You Aren't Gonna Need It". No construyas funcionalidades ni flexibilidad para requisitos futuros hipotéticos; construye solo lo que se necesita ahora. Violaciones clásicas: añadir paginación antes de que ninguna lista sea larga, o construir un sistema de plugins configurable para una funcionalidad que tiene exactamente una implementación. El requisito futuro a menudo nunca llega, y el código especulativo se convierte en peso muerto que aún hay que mantener y testear.

> **Junior tip:** Pair it with KISS — "KISS keeps the solution simple, YAGNI keeps me from solving problems I don't have yet."
> **Consejo de entrevista:** Combínalo con KISS — "KISS mantiene la solución simple, YAGNI me impide resolver problemas que aún no tengo." Menciona que el código generado por IA suele violar YAGNI con abstracciones especulativas.

---

## Agile y trabajo en equipo

**¿Has trabajado en un entorno ágil?** ⭐⭐⭐
No de forma profesional, pero sigo prácticas ágiles en mis propios proyectos — commits atómicos, ramas de feature, descripciones de PR y cambios cortos y enfocados. Entiendo la ceremonia: daily standup para compartir bloqueos, sprint para acotar el trabajo en el tiempo, retrospectiva para mejorar el proceso. Lo que más rápido adoptaría en una consultora es el ciclo de revisión de PR — ya lo practico en mi flujo de trabajo personal.

**¿Cuál es la diferencia entre un sprint y un backlog?** ⭐⭐
El backlog es la lista completa de funcionalidades y tareas del proyecto, ordenadas por prioridad. Un sprint es un período de tiempo fijo — normalmente dos semanas — en el que el equipo elige un subconjunto del backlog y se compromete a terminarlo. Al final del sprint tienes software funcionando, no features a medias.

**¿Qué es un daily standup y qué dices en él?** ⭐⭐
Una reunión diaria corta — normalmente 15 minutos — en la que cada persona responde tres preguntas: qué hice ayer, qué haré hoy y hay algo que me bloquea. El objetivo es sacar los bloqueos a la superficie pronto, no reportar el progreso a un manager.

**¿Qué cambiarías de tu forma de trabajar en solitario al unirte a un equipo?** ⭐⭐
Lo que realmente quieren saber: ¿Estás listo para la colaboración profesional, o serás disruptivo en un equipo?
R: El mayor cambio sería la disciplina con git — nunca mergear tus propios PRs, mantener los commits atómicos para que los compañeros puedan seguir el historial, y escribir descripciones de PR que expliquen el por qué, no solo el qué. Ya hago esto en mis proyectos personales. Lo más difícil es acordar la arquitectura de antemano — por eso existen patrones como Core/Feature/Shared, para que cinco desarrolladores puedan trabajar de forma independiente sin romper el código del otro.
Respuesta mala: "Comunicaría más." — Demasiado vago. El entrevistador quiere prácticas concretas, no intenciones.

---

## HTTP fundamentals

**¿Cuál es la diferencia entre PUT y PATCH, y qué significa la idempotencia?** ⭐⭐⭐
PUT reemplaza el recurso completo — el cliente envía todos los campos, y cualquier campo omitido se vacía. PATCH actualiza solo los campos que envías y deja el resto intacto. Ambos son *idempotentes*: llamar al mismo PUT o DELETE varias veces deja el sistema en el mismo estado final que llamarlo una vez. POST *no* es idempotente — cada llamada puede crear un recurso nuevo. La idempotencia importa para la fiabilidad: si un fallo de red hace que un cliente reintente, una petición idempotente es segura de repetir, mientras que un POST podría crear un duplicado.

> **Junior tip:** "PUT and DELETE are idempotent, POST is not — so a retried POST can duplicate data."
> **Consejo de entrevista:** El ángulo de la idempotencia separa al junior que conoce CRUD del que conoce REST. Di: "PUT y DELETE son idempotentes, POST no — así que un POST reintentado puede duplicar datos."

**¿Por qué nunca debes enviar una contraseña por HTTP plano?** ⭐⭐
Porque el tráfico HTTP viaja en texto plano — cualquiera entre el cliente y el servidor (en la misma Wi-Fi, un ISP, un router comprometido) puede leer la petición, incluida la contraseña o el JWT en la cabecera `Authorization`. HTTPS envuelve la conexión en TLS, que cifra todo en tránsito para que no se pueda leer ni manipular. Cualquier API que maneje credenciales o tokens debe ser solo-HTTPS; en producción además rediriges HTTP a HTTPS para que una petición nunca se envíe sin cifrar por accidente.

> **Junior tip:** "HTTP is plain text, HTTPS is encrypted in transit — credentials and JWTs must only ever go over HTTPS."
> **Consejo de entrevista:** La frase clave: "HTTP es texto plano, HTTPS está cifrado en tránsito — las credenciales y los JWT solo deben ir por HTTPS." Demuestra que entiendes la amenaza, no solo el acrónimo.

---

## Testing concepts

**¿Cuál es la diferencia entre un mock y un stub?** ⭐⭐
Ambos reemplazan una dependencia real en un test, pero su propósito difiere. Un *stub* solo devuelve un valor fijo y preparado para que el código bajo prueba tenga algo con lo que trabajar — no compruebas cómo se usó. Un *mock* es un falso configurable que además puedes *verificar* después — afirmas que fue llamado, cuántas veces y con qué argumentos. En la práctica la palabra "mock" se usa de forma laxa para ambos, y Mockito cubre los dos: `when(...).thenReturn(...)` es el comportamiento de stub, `verify(...)` es el de mock.

> **Junior tip:** "a stub gives an answer; a mock also lets me verify the interaction."
> **Consejo de entrevista:** La distinción que buscan: "un stub da una respuesta; un mock además me deja verificar la interacción." Menciona que Mockito hace ambos, así que la línea se difumina en el día a día.

---

## Tooling and operations

**¿Es Base64 una forma de cifrado?** ⭐⭐
No — Base64 es *codificación*, no cifrado. Es una forma reversible de representar datos binarios usando 64 caracteres imprimibles, y cualquiera puede decodificarlo en un paso sin ninguna clave. Por eso justamente un JWT no es "seguro" solo por estar en Base64: puedes pegar cualquier token en jwt.io y leer el header y el payload al instante. La seguridad de un JWT viene de su firma, no de la codificación. Los entrevistadores preguntan esto específicamente para pillar a candidatos que confunden codificación con seguridad.

> **Junior tip:** "Base64 is encoding, not encryption — no key, instantly reversible."
> **Consejo de entrevista:** Dilo sin rodeos: "Base64 es codificación, no cifrado — sin clave, reversible al instante." Luego conéctalo con el JWT: el payload es legible, solo la firma lo protege.

**¿Por qué los secretos nunca deben commitearse a git, aunque los borres después?** ⭐⭐
Porque el historial de git es permanente — un secreto commiteado una vez queda visible en cada clon y en el historial para siempre, incluso después de borrarlo en un commit posterior. Así que en el momento en que una clave se pushea debe tratarse como comprometida y rotarse de inmediato; quitarla de la última versión no deshace la exposición. La configuración correcta es mantener los secretos en variables de entorno (referenciadas como `${VAR}` en la config), commitear solo un `.env.example` que documente qué variables hacen falta, y nunca los valores reales.

Respuesta mala: "Lo borré en el siguiente commit, así que no pasa nada." — El secreto sigue en el historial de cada clon. Borrarlo después no lo elimina; la única respuesta segura es rotar la clave.

**¿Por qué `console.log` / `System.out.println` no basta para depurar código en producción, y qué son los niveles de log?** ⭐⭐
Las sentencias de print no se pueden desactivar sin editar código, no llevan marca de tiempo y desaparecen cuando se cierra la terminal — inútiles una vez que una app está desplegada sin un depurador conectado. Un framework de logging te da niveles que puedes filtrar: `DEBUG` (detallado, solo dev), `INFO` (eventos normales como "usuario inició sesión"), `WARN` (algo inesperado pero recuperado) y `ERROR` (algo falló de verdad). Pones el nivel de producción en `INFO` o `WARN` para que el ruido desaparezca pero los problemas se sigan registrando con marca de tiempo y contexto.

> **Junior tip:** a caught exception the app recovered from is `WARN`, not `ERROR`.
> **Consejo de entrevista:** Elige el nivel a propósito: una excepción capturada de la que la app se recuperó es `WARN`, no `ERROR`. Conocer esa distinción demuestra que has pensado en logs de producción reales.
