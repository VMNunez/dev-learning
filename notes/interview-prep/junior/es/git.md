# Git — Preguntas de entrevista

<a id="study-index"></a>

## Índice de estudio

Empieza por la primera vuelta. Dentro de cada vuelta, sigue los temas de arriba abajo y trabaja un grupo pequeño de preguntas cada vez. Si una pregunta requiere un concepto de otra vuelta, consulta esa pregunta y vuelve al punto donde estabas.

| Vuelta | Prioridad | Preguntas |
|---|---|---:|
| [1. Imprescindibles](#study-pass-1) | ⭐⭐⭐ | 9 |
| [2. Profundización](#study-pass-2) | ⭐⭐ | 32 |
| [3. Detalles](#study-pass-3) | ⭐ | 14 |

Lee la pregunta, intenta responder sin mirar, contrasta tu respuesta con la escrita y vuelve a explicarla con tus palabras. En el siguiente bloque, recupera alguna pregunta anterior sin consultar la respuesta.

Los enlaces llevan a las preguntas originales. Los números son sus identificadores, no el orden de estudio. Este índice sirve para estudiar por tu cuenta. Registra aquí tu progreso: ✅ y la fecha al final de la línea de cada pregunta que hayas trabajado, y después · PASS y la fecha cuando la superes en un examen de repaso.

<a id="study-pass-1"></a>

### Primera vuelta — Imprescindibles — ⭐⭐⭐

**Conceptos básicos**

- [001 — Qué es Git y por qué usarlo](#GIT-J-001)
- [002 — Git frente a GitHub](#GIT-J-002)
- [003 — Pull frente a fetch](#GIT-J-003)

**Ramas**

- [011 — Qué es una rama](#GIT-J-011)
- [012 — Merge frente a rebase](#GIT-J-012)
- [013 — Resolver un conflicto de merge](#GIT-J-013)

**Pull Requests**

- [025 — Qué es un Pull Request](#GIT-J-025)

**Conventional Commits**

- [030 — Qué es Conventional Commits y por qué](#GIT-J-030)

**Deshacer cambios**

- [035 — Revert frente a reset](#GIT-J-035)

<a id="study-pass-2"></a>

### Segunda vuelta — Profundización — ⭐⭐

**Conceptos básicos**

- [004 — Qué es un commit](#GIT-J-004)
- [005 — Qué muestra git status](#GIT-J-005)
- [006 — Para qué sirve .gitignore](#GIT-J-006)
- [007 — El área de staging y su propósito](#GIT-J-007)
- [008 — Qué es HEAD](#GIT-J-008)
- [009 — Init frente a clone](#GIT-J-009)
- [010 — Qué es origin](#GIT-J-010)

**Ramas**

- [014 — Tu estructura de ramas](#GIT-J-014)
- [015 — Ramas de funcionalidad frente a commitear en main](#GIT-J-015)
- [016 — Qué hace push -u](#GIT-J-016)
- [017 — Qué es un fast-forward merge](#GIT-J-017)
- [018 — Rebase interactivo y cuándo usarlo](#GIT-J-018)
- [019 — Borrar ramas con -d frente a -D](#GIT-J-019)

**Pull Requests**

- [026 — Qué incluir en la descripción de un PR](#GIT-J-026)
- [027 — Las tres opciones de merge de GitHub](#GIT-J-027)
- [028 — Qué buscar al revisar un PR](#GIT-J-028)

**Conventional Commits**

- [031 — Los prefijos principales de commit](#GIT-J-031)
- [032 — Qué son los commits atómicos](#GIT-J-032)

**Deshacer cambios**

- [036 — Qué hace git restore](#GIT-J-036)
- [037 — Deshacer un commit pusheado sin perder historial](#GIT-J-037)
- [038 — Reset --soft, --mixed y --hard](#GIT-J-038)
- [039 — Para qué sirve git reflog](#GIT-J-039)
- [040 — Un commit pusheado con mensaje incorrecto](#GIT-J-040)

**Comandos útiles**

- [042 — Qué hace git stash](#GIT-J-042)
- [043 — Diff frente a diff --staged](#GIT-J-043)
- [044 — Para qué sirve cherry-pick](#GIT-J-044)
- [045 — Un .env commiteado por error](#GIT-J-045)

**Preguntas de presión**

- [051 — Un commit pusheado con una clave de API](#GIT-J-051)
- [052 — Recuperar cambios tras un reset --hard](#GIT-J-052)
- [053 — Un PR fusionado que causa una regresión](#GIT-J-053)
- [054 — Un bug crítico a mitad de una funcionalidad](#GIT-J-054)
- [055 — Tu flujo en un equipo de 20](#GIT-J-055)

<a id="study-pass-3"></a>

### Tercera vuelta — Detalles — ⭐

**Ramas**

- [020 — Detached HEAD y cómo solucionarlo](#GIT-J-020)
- [021 — Merge commits frente a squash-and-merge](#GIT-J-021)
- [022 — Por qué ramas de tres niveles](#GIT-J-022)
- [023 — Cuándo una rama está lista para un PR](#GIT-J-023)
- [024 — Conflictos durante un rebase](#GIT-J-024)

**Pull Requests**

- [029 — Una sección Why en los PRs](#GIT-J-029)

**Conventional Commits**

- [033 — Conventional Commits desde el primer proyecto en solitario](#GIT-J-033)
- [034 — Decidir cuándo hacer un commit](#GIT-J-034)

**Deshacer cambios**

- [041 — Elegir reset --soft frente a --mixed](#GIT-J-041)

**Comandos útiles**

- [046 — Qué muestra git log --oneline](#GIT-J-046)
- [047 — Para qué sirve git blame](#GIT-J-047)
- [048 — Los tags de Git y su uso en empresas](#GIT-J-048)
- [049 — Stash frente a un commit WIP](#GIT-J-049)
- [050 — Stash pop frente a stash apply](#GIT-J-050)

---

## Conceptos básicos

<a id="GIT-J-001"></a>

**[GIT-J-001] ¿Qué es Git y por qué lo usan los desarrolladores?** ⭐⭐⭐
Git es un sistema de control de versiones — registra cada cambio en el código, te permite volver a cualquier estado anterior y permite que varias personas trabajen en el mismo proyecto sin sobrescribir el trabajo de los demás. Sin él, la colaboración en un equipo real es casi imposible.

<a id="GIT-J-002"></a>

**[GIT-J-002] ¿Cuál es la diferencia entre Git y GitHub?** ⭐⭐⭐
Git es la herramienta que se ejecuta en tu máquina y rastrea los cambios. GitHub es una plataforma en la nube que aloja repositorios Git para que puedas compartirlos y colaborar. Puedes usar Git sin GitHub, pero GitHub necesita Git.

<a id="GIT-J-003"></a>

**[GIT-J-003] ¿Cuál es la diferencia entre `git pull` y `git fetch`?** ⭐⭐⭐
`git fetch` descarga los cambios del repositorio remoto pero no los aplica a tu rama local — puedes inspeccionarlos primero. `git pull` hace el fetch y luego hace el merge automáticamente. Uso `git pull` al inicio del día para actualizar mi rama.

<a id="GIT-J-004"></a>

**[GIT-J-004] ¿Qué es un commit?** ⭐⭐
Una instantánea de tus cambios en un momento concreto, con un mensaje que explica qué ha cambiado. Cada commit tiene un ID único. Sigo el formato Conventional Commits — `feat: add employee form`, `fix: duplicate email check` — para que el historial se lea como un changelog.

<a id="GIT-J-005"></a>

**[GIT-J-005] ¿Qué es `git status` y cuándo lo usas?** ⭐⭐
Muestra el estado actual de tus archivos — qué está en staging, qué está modificado y qué no está rastreado. Lo ejecuto constantemente para asegurarme de que estoy haciendo commit exactamente de lo que quiero, nada más.

<a id="GIT-J-006"></a>

**[GIT-J-006] ¿Qué es `.gitignore` y qué pones en él?** ⭐⭐
Un archivo que le dice a Git qué archivos y carpetas ignorar — nunca se incluyen en los commits. Siempre ignoro `node_modules/`, archivos de entorno con claves de API (`.env`) y archivos de configuración del editor. Sin él subirías miles de archivos de dependencias a GitHub en cada commit.

<a id="GIT-J-007"></a>

**[GIT-J-007] ¿Qué es el área de staging y por qué Git la tiene?** ⭐⭐
El área de staging se sitúa entre el directorio de trabajo y el historial de commits. Cuando editas un archivo va al directorio de trabajo. Cuando ejecutas `git add` pasa al área de staging. Cuando ejecutas `git commit` se convierte en una instantánea permanente. El área de staging te permite seleccionar exactamente qué cambios van en un commit — si has editado tres archivos pero solo dos están listos, haces staging de esos dos y commiteas. El tercero espera al siguiente commit.

<a id="GIT-J-008"></a>

**[GIT-J-008] ¿Qué es HEAD?** ⭐⭐
HEAD es un puntero al commit en el que estás actualmente — normalmente la punta de la rama actual. Cuando cambias de rama, HEAD se mueve. Cuando haces un nuevo commit, HEAD avanza. Lo ves en `git log` y en los mensajes de error — siempre significa "dónde estás ahora mismo". `HEAD~1` significa el commit anterior al actual.

<a id="GIT-J-009"></a>

**[GIT-J-009] ¿Cuál es la diferencia entre `git init` y `git clone`?** ⭐⭐
`git init` crea un repositorio nuevo y vacío en tu máquina desde cero — lo usas cuando empiezas un proyecto nuevo en local. `git clone` descarga un repositorio existente de GitHub a tu máquina, incluyendo el historial completo de commits y el remote ya configurado. En la práctica: `git init` cuando empiezo de cero, `git clone` cuando el proyecto ya existe en GitHub.

<a id="GIT-J-010"></a>

**[GIT-J-010] ¿Qué es `origin` en Git?** ⭐⭐
`origin` es el nombre (alias) por defecto que Git da al repositorio remoto desde el que clonaste o al que te conectaste — apunta a la URL del remoto, como `https://github.com/user/repo.git`. No es una rama ni nada especial: es solo una abreviatura para que escribas `git push origin main` en lugar de la URL completa cada vez. Un repo puede tener varios remotos con nombres distintos (por ejemplo `origin` y `upstream` al trabajar con forks), pero la mayoría de proyectos solo tienen `origin`.

> **Junior tip:** The trap is thinking `origin` is a branch — "`origin` is the remote, `main` is the branch."
> **Consejo de entrevista:** La trampa es pensar que `origin` es una rama. Di con claridad: "`origin` es el remoto, `main` es la rama — `git push origin main` significa enviar la rama main al remoto origin."

---

## Ramas

<a id="GIT-J-011"></a>

**[GIT-J-011] ¿Qué es una rama y por qué las usas?** ⭐⭐⭐
Una rama es una línea de desarrollo independiente — los cambios en una rama no afectan a las demás. Las uso para poder trabajar en una nueva funcionalidad sin romper la versión estable. Cuando la funcionalidad está lista, la fusiono a través de un Pull Request.

<a id="GIT-J-012"></a>

**[GIT-J-012] ¿Cuál es la diferencia entre `git merge` y `git rebase`?** ⭐⭐⭐
`merge` combina dos ramas y crea un commit de merge — el historial muestra exactamente cuándo se unieron las ramas. `rebase` reproduce tus commits encima de otra rama, haciendo el historial lineal. Uso merge para los PRs de proyecto — el commit de merge documenta cuándo se integró una funcionalidad. Rebase es útil para limpiar commits locales antes de hacer push, pero lo evito en ramas compartidas.

<a id="GIT-J-013"></a>

**[GIT-J-013] ¿Qué es un conflicto de merge y cómo lo resuelves?** ⭐⭐⭐
Ocurre cuando dos ramas modifican la misma línea en el mismo archivo y Git no puede decidir qué versión conservar. Git marca el conflicto en el archivo con `<<<<<<<`, `=======` y `>>>>>>>`. Abres el archivo, decides cuál es la versión correcta, eliminas los marcadores, haces staging del archivo y commiteas. Lo importante es no entrar en pánico — leer ambas versiones con calma antes de elegir.

<a id="GIT-J-014"></a>

**[GIT-J-014] ¿Qué estructura de ramas sigues?** ⭐⭐
`main` es la rama principal — solo llega aquí código terminado y revisado. Cada proyecto tiene su propia rama desde `main` — `angular/06-hr-portal`. Cada funcionalidad dentro de un proyecto tiene su propia rama desde la rama del proyecto — `feat/auth`, `feat/employee-crud`. Cuando la funcionalidad está lista, abro un PR hacia la rama del proyecto. Cuando el proyecto está completo, abro un PR hacia `main`.

<a id="GIT-J-015"></a>

**[GIT-J-015] ¿Por qué usas ramas de funcionalidad en lugar de commitear directamente en main?** ⭐⭐
Porque `main` debe estar siempre en un estado funcional. Si commiteo una funcionalidad a medias directamente en `main` y algo falla, todo el proyecto queda roto. Las ramas de funcionalidad aíslan el cambio — si algo va mal, solo afecta a esa rama. También hacen posible la revisión de código: el PR da una vista clara de exactamente qué cambió antes de que llegue a `main`.

<a id="GIT-J-016"></a>

**[GIT-J-016] ¿Qué hace `git push -u origin rama` y por qué usas `-u`?** ⭐⭐
Sube la rama local a GitHub y establece el seguimiento upstream — Git ahora sabe que tu rama local corresponde a esa rama remota. Después de este primer push, puedes escribir simplemente `git push` y `git pull` sin especificar el nombre de la rama cada vez. El `-u` solo es necesario una vez, en el primer push de una rama nueva.

<a id="GIT-J-017"></a>

**[GIT-J-017] ¿Qué es un fast-forward merge?** ⭐⭐
Ocurre cuando la rama de destino no tiene commits nuevos desde que se creó la rama de la funcionalidad — Git simplemente mueve el puntero hacia adelante sin crear un commit de merge. El historial queda completamente lineal. Un merge de tres vías ocurre cuando ambas ramas han divergido y Git necesita crear un nuevo commit para unirlas.

<a id="GIT-J-018"></a>

**[GIT-J-018] ¿Qué es el rebase interactivo y cuándo lo usas?** ⭐⭐
El rebase interactivo (`git rebase -i`) te permite editar, combinar, reordenar o eliminar commits antes de hacer push. El uso más habitual es el squash — si hice tres commits pequeños de "fix typo" mientras desarrollaba una funcionalidad, los combino en un único commit limpio antes de abrir el PR. La regla clave: úsalo solo en commits que aún no se han pusheado. Reescribir commits pusheados rompe el historial de todos los que los han descargado.

> **Junior tip:** mention squash as the most common use case, and always say you only use it on local commits. That shows you understand the risk.
> **Consejo de entrevista:** menciona squash como el caso de uso más habitual y di siempre que solo lo usas en commits locales. Eso demuestra que entiendes el riesgo.

Respuesta señal de alerta: "Nunca uso rebase" — muestra que no piensas en cómo se ve tu historial para los revisores.

<a id="GIT-J-019"></a>

**[GIT-J-019] ¿Cuál es la diferencia entre `git branch -d` y `git branch -D`?** ⭐⭐
`-d` es un borrado seguro — se niega a borrar una rama que tiene commits aún no mergeados en ningún sitio, así no pierdes trabajo por accidente. `-D` es un borrado forzado — elimina la rama sin importar nada. Uso `-d` por defecto para borrar ramas de feature ya mergeadas cuando su PR aterriza; solo recurro a `-D` cuando quiero descartar a propósito una rama experimental que nunca mergeé.

> **Junior tip:** "lowercase d is safe, uppercase D forces it."
> **Consejo de entrevista:** "la d minúscula es segura, la D mayúscula la fuerza." Menciona que el fallo de `-d` es Git protegiéndote de perder commits sin mergear.

<a id="GIT-J-020"></a>

**[GIT-J-020] ¿Qué es el estado detached HEAD y cómo lo solucionas?** ⭐
Detached HEAD significa que HEAD apunta a un commit concreto en lugar de al nombre de una rama. Ocurre cuando ejecutas `git checkout <hash-del-commit>` directamente. Los commits que hagas en este estado no están asociados a ninguna rama — si cambias de rama, los pierdes. La solución: `git checkout -b nuevo-nombre-de-rama` crea una rama en ese commit y HEAD vuelve a estar en una rama. Tus commits están a salvo.

> **Junior tip:** tell the interviewer the fix before they ask — it shows you know the recovery pattern, not just the problem.
> **Consejo de entrevista:** di la solución al entrevistador antes de que la pida — demuestra que conoces el patrón de recuperación, no solo el problema.

Respuesta señal de alerta: "Simplemente cambio a otra rama para solucionarlo" — cambiar de rama sin crear una nueva rama hace que pierdas los commits que hiciste mientras estabas en detached HEAD.

<a id="GIT-J-021"></a>

**[GIT-J-021] ¿Por qué prefieres merge commits en lugar de squash-and-merge para los PRs de funcionalidades?** ⭐
Porque el merge commit actúa como una frontera clara en el historial — todos los commits entre dos merge commits pertenecen a una misma funcionalidad. Si aparece un bug después de un merge, puedo rastrear exactamente qué funcionalidad lo introdujo. Squash-and-merge da una línea más limpia con un único commit, pero pierde los pasos detallados y la conexión con la rama de la funcionalidad. En mis proyectos, un historial honesto y trazable vale más que uno que parezca mínimo.

Respuesta señal de alerta: "Uso el botón que aparece por defecto" — muestra que nunca has pensado en cómo la estrategia de merge afecta al historial del proyecto.

<a id="GIT-J-022"></a>

**[GIT-J-022] ¿Por qué sigues la estructura de ramas de tres niveles en lugar de trabajar directamente en main?** ⭐
Porque `main` siempre debe representar código terminado y revisado. Sin una rama de proyecto como `angular/06-hr-portal`, todos los PRs de funcionalidades irían directamente a `main` — un PR con fallos haría que `main` quedara inestable. La rama de proyecto actúa como un buffer: las funcionalidades llegan ahí a través de PRs, se prueban juntas, y solo el proyecto completo se mueve a `main`. En un equipo este patrón es aún más importante porque varias funcionalidades se desarrollan en paralelo.

Respuesta señal de alerta: "Hago commit directamente en main" — descalificante de inmediato en una consultora; muestra que no conoces el flujo de trabajo en equipo.

<a id="GIT-J-023"></a>

**[GIT-J-023] ¿Cuándo decides que una rama de funcionalidad está lista para abrir un PR?** ⭐
Cuando la funcionalidad hace exactamente lo que debía, los commits son limpios y atómicos, y no hay bugs obvios. Primero hago una autorevisión — leo mi propio diff como si fuera un revisor que lo ve por primera vez. Si hay commits de "fix typo" del desarrollo, los combino con rebase interactivo antes de abrir el PR. La descripción del PR es la última comprobación — si no puedo explicar el "Por qué" con claridad, la funcionalidad no está lista.

Respuesta señal de alerta: "Cuando compila" — que compile es el mínimo exigible, no un control de calidad.

<a id="GIT-J-024"></a>

**[GIT-J-024] Ocurre un conflicto de merge durante un rebase. ¿En qué se diferencia resolverlo de un conflicto de merge normal?** ⭐
Un rebase reaplica tus commits de uno en uno sobre la rama destino, así que el conflicto puede pausarse en cada commit conflictivo, no solo una vez. Arreglas el archivo, le haces `git add`, y luego ejecutas `git rebase --continue` para pasar al siguiente commit — puedes resolver varios seguidos. Si se complica demasiado, `git rebase --abort` cancela todo el rebase y te devuelve exactamente a donde empezaste. Un merge normal, en cambio, saca todos los conflictos a la vez y los resuelves en un único commit.

> **Junior tip:** "merge conflicts happen once; rebase conflicts can happen per commit — use `--continue` after each and `--abort` to bail out."
> **Consejo de entrevista:** El contraste clave: "los conflictos de merge ocurren una vez; los de rebase pueden ocurrir por commit, así que uso `--continue` tras cada uno y `--abort` para salir con seguridad."

---

## Pull Requests

<a id="GIT-J-025"></a>

**[GIT-J-025] ¿Qué es un Pull Request?** ⭐⭐⭐
Una solicitud para fusionar una rama en otra, con una descripción de qué ha cambiado y por qué. En un equipo, otros desarrolladores revisan el código antes de que se fusione. En mis proyectos personales escribo descripciones de PR para cada funcionalidad — es una buena práctica y hace el historial del portfolio legible.

<a id="GIT-J-026"></a>

**[GIT-J-026] ¿Qué incluyes en la descripción de un Pull Request?** ⭐⭐
Un título, una lista de cambios bajo `## Changes` y una sección `## Why` que explica la decisión principal detrás del cambio. La descripción debe tener sentido para alguien que no ha visto el código — es documentación que queda permanentemente con el historial de commits.

<a id="GIT-J-027"></a>

**[GIT-J-027] ¿Cuál es la diferencia entre merge commit, squash and merge y rebase and merge en GitHub?** ⭐⭐
Las tres opciones fusionan el PR pero afectan al historial de forma diferente. **Merge commit** crea un commit de merge — el historial muestra exactamente cuándo se integró la funcionalidad. **Squash and merge** combina todos los commits del PR en uno — historial más limpio pero se pierden los pasos individuales. **Rebase and merge** reproduce cada commit encima de la rama base — perfectamente lineal, sin commit de merge. Uso merge commit para los PRs de funcionalidades porque actúa como una frontera clara: todo entre dos merge commits pertenece a una funcionalidad.

> **Junior tip:** the interviewer wants to know if you have thought about this choice, not just whether you know the three options. Always say which one you use and why.
> **Consejo de entrevista:** el entrevistador quiere saber si has reflexionado sobre esta elección. Di siempre cuál usas y por qué.

Respuesta señal de alerta: "Simplemente hago clic en el botón verde" — muestra que nunca has pensado en lo que significa la estrategia de merge para el historial del proyecto.

<a id="GIT-J-028"></a>

**[GIT-J-028] ¿Qué buscas cuando revisas un PR?** ⭐⭐
Compruebo: ¿el código hace lo que dice la descripción del PR?; ¿hay bugs obvios o casos extremos sin gestionar?; ¿los nombres son claros y legibles?; ¿hay problemas de seguridad como entradas no validadas o secretos hardcodeados?; ¿hay tests para la nueva lógica? Siempre empiezo por la descripción del PR para entender la intención antes de leer el código. En mis proyectos hago siempre una autorevisión antes de fusionar — leer el diff detecta errores pequeños que pasé por alto al escribir.

> **Junior tip:** start by understanding the intent of the PR, not by reading code line by line. Interviewers want to see you think about the big picture first.
> **Consejo de entrevista:** empieza por entender la intención del PR, no leyendo línea por línea. Los entrevistadores quieren ver que piensas primero en el panorama general.

Respuesta señal de alerta: "Compruebo que pasan los tests" — los tests pueden pasar con una arquitectura rota; un revisor debe leer el código.

<a id="GIT-J-029"></a>

**[GIT-J-029] ¿Por qué incluyes una sección "Why" en las descripciones de tus PRs en lugar de solo listar los cambios?** ⭐
Porque el QUÉ ya es visible en el diff — cualquiera puede ver qué líneas cambiaron. El POR QUÉ es lo que el código no puede decirte: por qué se eligió este patrón, qué problema resuelve, qué alternativas se descartaron. En mi HR portal expliqué por qué usé el patrón de diálogo dual para el formulario de empleados — sin esa nota, un revisor sabe qué se construyó pero no por qué era el enfoque correcto. La sección "Why" es lo que hace que un PR sea útil como documentación seis meses después.

Respuesta señal de alerta: "Escribo un resumen rápido de lo que cambié" — muestra que los PRs se ven como un trámite, no como documentación.

---

## Conventional Commits

<a id="GIT-J-030"></a>

**[GIT-J-030] ¿Qué es Conventional Commits y por qué lo sigues en lugar de escribir lo que quieras?** ⭐⭐⭐
Porque el historial de commits es documentación. Seis meses después, cuando necesitas entender por qué cambió una línea, lees el historial — y `feat: add duplicate email check` te dice exactamente qué y por qué, mientras que `arreglo cosas` no te dice nada. También facilita agrupar cambios por tipo al revisar un PR. Las consultoras españolas lo usan como estándar en sus equipos.

<a id="GIT-J-031"></a>

**[GIT-J-031] ¿Cuáles son los prefijos principales y cuándo usas cada uno?** ⭐⭐
`feat` para nuevas funcionalidades, `fix` para corrección de bugs, `style` para cambios visuales y de CSS, `refactor` para mejoras de código sin nueva funcionalidad, `docs` para documentación, `chore` para tareas de mantenimiento como instalar dependencias, `test` para añadir tests. Cada commit debe hacer solo una cosa — si necesitas dos prefijos, deben ser dos commits.

<a id="GIT-J-032"></a>

**[GIT-J-032] ¿Qué significa hacer commits atómicos?** ⭐⭐
Un cambio lógico por commit, aunque sea pequeño. Nunca agrupas cambios no relacionados. Si corriges un bug y añades una funcionalidad en el mismo commit, el historial se vuelve difícil de leer y de revertir de forma segura. Un revisor debe poder leer el historial de commits y entender qué cambió y por qué, sin leer el código.

<a id="GIT-J-033"></a>

**[GIT-J-033] ¿Por qué empezaste a seguir Conventional Commits desde tu primer proyecto en solitario, sin tener un equipo?** ⭐
Porque quería que el hábito fuera automático antes de unirme a un equipo donde se espera desde el primer día. Escribir `arreglo cosas` en proyectos en solitario genera malos hábitos difíciles de cambiar. Además, leer el historial de un proyecto meses después — `feat: add duplicate email check` cuenta una historia que puedo rastrear hasta una decisión. Las consultoras españolas usan Conventional Commits como estándar; llegar con el hábito ya incorporado significa una cosa menos que aprender.

Respuesta señal de alerta: "Lo sigo porque está en las convenciones del proyecto" — seguir reglas sin entenderlas no es lo mismo que tomar una decisión.

<a id="GIT-J-034"></a>

**[GIT-J-034] ¿Cómo decides cuándo parar y hacer un commit? ¿Qué hace que un cambio sea "atómico"?** ⭐
Hago commit cuando una idea lógica y con nombre está completa — no cuando un archivo está listo, no cuando compila. Por ejemplo, en el HR portal hice commit del authGuard por separado del adminGuard, aunque están relacionados — cada uno resuelve un problema diferente y uno puede funcionar sin el otro. La prueba práctica: si necesito la palabra "y" en mi mensaje de commit, esa es la señal de que debo dividirlo en dos commits.

Respuesta señal de alerta: "Hago commit cuando termino la funcionalidad" — es un único commit grande e imposible de revertir de forma segura sin afectar otros cambios.

---

## Deshacer cambios

<a id="GIT-J-035"></a>

**[GIT-J-035] ¿Cuál es la diferencia entre `git revert` y `git reset`?** ⭐⭐⭐
`git reset` mueve HEAD hacia atrás y reescribe el historial — solo es seguro en commits que no se han hecho push todavía. `git revert` crea un nuevo commit que deshace uno anterior, sin tocar el historial — es seguro en commits que ya están en GitHub. Regla: si el commit ya está pusheado, usa siempre `git revert`.

<a id="GIT-J-036"></a>

**[GIT-J-036] ¿Qué hace `git restore`?** ⭐⭐
Descarta cambios en el directorio de trabajo o elimina archivos del staging. `git restore filename` descarta tus ediciones y devuelve el archivo al último commit. `git restore --staged filename` mueve el archivo del área de staging de vuelta al directorio de trabajo sin perder los cambios. No toca el historial de commits.

<a id="GIT-J-037"></a>

**[GIT-J-037] ¿Cómo deshaces un commit ya pusheado sin perder el historial?** ⭐⭐
Con `git revert <commit-id>`. Crea un nuevo commit que revierte los cambios del commit especificado — el commit original permanece en el historial y se puede ver que el cambio se hizo y luego se deshizo. Nunca uses `git reset --hard` en un commit pusheado — reescribe el historial y rompe el trabajo de cualquier otra persona que tenga esos commits.

<a id="GIT-J-038"></a>

**[GIT-J-038] ¿Cuál es la diferencia entre `git reset --soft`, `git reset --mixed` y `git reset --hard`?** ⭐⭐
Los tres mueven HEAD hacia atrás a un commit anterior, pero difieren en lo que dejan intacto. `--soft` mantiene todos los cambios en staging — útil cuando quieres rehacer el mensaje del commit o añadir un archivo más. `--mixed` (el comportamiento por defecto sin flag) saca los cambios del staging pero conserva los archivos — útil cuando quieres reorganizar los cambios en commits diferentes. `--hard` descarta todo — úsalo solo en commits locales que estás seguro de que ya no necesitas.

> **Junior tip:** interviewers ask this to check if you understand git reset beyond "it goes back". Name all three flags and what each one leaves behind — staged, unstaged, or discarded.
> **Consejo de entrevista:** los entrevistadores hacen esta pregunta para comprobar si entiendes git reset en profundidad. Nombra los tres flags y qué deja intacto cada uno: staged, sin stage, o eliminado.

Respuesta señal de alerta: "git reset --hard elimina el último commit" — técnicamente correcto pero muestra que no entiendes los tres modos.

<a id="GIT-J-039"></a>

**[GIT-J-039] ¿Qué es `git reflog` y cuándo lo usarías?** ⭐⭐
`git reflog` registra cada posición en la que ha estado HEAD, incluso después de un `git reset --hard`. Es tu red de seguridad cuando crees que has perdido trabajo. Si hiciste reset demasiado lejos o borraste accidentalmente una rama, `git reflog` muestra el hash del commit anterior y puedes recuperarlo con `git reset --hard <hash>`. Git guarda este registro durante 90 días en tu máquina local — no existe en GitHub, solo en local.

> **Junior tip:** mention that reflog is local only — it exists on your machine, not on the remote. This shows you understand its limits. Also mention the 90-day window.
> **Consejo de entrevista:** menciona que el reflog es local — está en tu máquina, no en el remoto. Eso demuestra que entiendes sus límites. Menciona también la ventana de 90 días.

Respuesta señal de alerta: "No sé qué es el reflog" — aparece en todas las entrevistas serias de Git y muestra una brecha en el conocimiento de recuperación.

<a id="GIT-J-040"></a>

**[GIT-J-040] Hiciste push de un commit con un mensaje incorrecto. ¿Qué haces?** ⭐⭐
Depende de dónde esté el commit. En una rama de funcionalidad local que nadie más ha descargado, uso `git commit --amend` para corregir el mensaje y luego `git push --force-with-lease` — el flag `--force-with-lease` falla si alguien más ha hecho push a la rama, lo que lo hace más seguro que el `--force` simple. Si el commit está en una rama compartida como `main`, lo dejo como está — reescribir el historial en una rama compartida rompe el trabajo de cualquiera que haya descargado esos commits.

Respuesta señal de alerta: "Simplemente hago git push --force" — usar --force sin --lease puede sobrescribir silenciosamente el trabajo de otra persona.

<a id="GIT-J-041"></a>

**[GIT-J-041] ¿Cuándo usarías `git reset --soft` en lugar de `git reset --mixed`?** ⭐
Uso `--soft` cuando quiero deshacer el último commit pero mantener los cambios listos para commitear de nuevo inmediatamente — por ejemplo, me di cuenta de que el mensaje del commit era incorrecto, o quiero añadir un archivo más al mismo cambio lógico. Los archivos permanecen en staging, así que solo ejecuto `git commit` de nuevo con el mensaje corregido. Uso `--mixed` cuando quiero sacar los cambios del staging y reorganizarlos en commits separados — por ejemplo, agrupé accidentalmente dos cambios no relacionados en un mismo commit.

Respuesta señal de alerta: "Siempre uso --hard para estar seguro" — --hard es la opción más destructiva; usarla siempre por defecto significa perder trabajo tarde o temprano.

---

## Comandos útiles

<a id="GIT-J-042"></a>

**[GIT-J-042] ¿Qué hace `git stash` y cuándo es útil?** ⭐⭐
Guarda temporalmente los cambios sin commitear y restaura el directorio de trabajo al último commit. Es útil cuando necesitas cambiar de rama rápidamente pero no estás listo para commitear — `git stash pop` recupera los cambios. Lo uso cuando estoy en medio de algo y necesito revisar otra rama sin commitear trabajo a medias.

<a id="GIT-J-043"></a>

**[GIT-J-043] ¿Qué muestra `git diff` y cuál es la diferencia con `git diff --staged`?** ⭐⭐
`git diff` muestra los cambios en el directorio de trabajo que aún no están en staging — lo que has editado pero todavía no has hecho `git add`. `git diff --staged` muestra los cambios que están en staging y listos para commitear — lo que va a entrar en el próximo `git commit`. Uso `git diff --staged` justo antes de commitear para hacer una revisión final de exactamente qué voy a guardar.

<a id="GIT-J-044"></a>

**[GIT-J-044] ¿Qué es `git cherry-pick` y cuándo lo usarías?** ⭐⭐
Aplica los cambios de un commit concreto sobre la rama actual, sin fusionar toda la rama — `git cherry-pick a3f8c1d`. El caso típico: se corrige un bug en una rama de funcionalidad pero necesitas ese arreglo en `main` ahora mismo, antes de que toda la funcionalidad esté lista. Haces cherry-pick solo de ese commit de corrección. Lo uso con moderación — duplica commits y puede hacer el historial confuso si se abusa de él.

<a id="GIT-J-045"></a>

**[GIT-J-045] Has commiteado un archivo `.env` por error antes de añadirlo a `.gitignore`. ¿Cómo lo arreglas?** ⭐⭐
Añadirlo ahora a `.gitignore` no basta — Git sigue rastreando un archivo que ya rastrea. Ejecutas `git rm --cached .env` para dejar de rastrearlo (el flag mantiene el archivo en el disco, solo lo quita del índice de Git), añades `.env` a `.gitignore`, y luego commiteas. A partir de ahí Git lo ignora. El matiz importante: el secreto sigue en el historial del commit anterior, así que si el repo se pusheó también roto la clave — quitarlo del último commit no lo borra del historial.

> **Junior tip:** "`git rm --cached` stops tracking without deleting the file" AND "the secret is still in history, so rotate the key."
> **Consejo de entrevista:** Dos partes ganan esto: "`git rm --cached` deja de rastrear sin borrar el archivo" Y "el secreto sigue en el historial, así que rota la clave." La segunda mitad demuestra conciencia de seguridad real.

<a id="GIT-J-046"></a>

**[GIT-J-046] ¿Qué muestra `git log --oneline`?** ⭐
Una vista compacta del historial de commits — una línea por commit con el ID corto y el mensaje. Lo uso para comprobar que mis commits están en orden y tienen mensajes claros antes de hacer push.

<a id="GIT-J-047"></a>

**[GIT-J-047] ¿Qué es `git blame` y cuándo es útil?** ⭐
Muestra quién modificó por última vez cada línea de un archivo y en qué commit. Cuando encuentro una línea que no entiendo, ejecuto `git blame filename` para saber cuándo se añadió — luego leo ese mensaje de commit para entender por qué. En un equipo también es útil para saber a quién preguntar sobre una parte concreta del código.

<a id="GIT-J-048"></a>

**[GIT-J-048] ¿Qué es `git tag` y cuándo lo usan las empresas?** ⭐
Un tag marca un commit concreto como importante — normalmente un punto de release. Las empresas crean un tag en `main` cada vez que despliegan a producción — `v1.0.0`, `v1.2.3`. La versión sigue el versionado semántico: MAJOR para cambios que rompen compatibilidad, MINOR para nuevas funcionalidades compatibles hacia atrás, PATCH solo para correcciones de bugs. Los tags anotados (`-a`) también guardan el autor, la fecha y un mensaje — preferidos para releases formales. Si algo falla en producción, el equipo hace rollback haciendo checkout del tag anterior.

> **Junior tip:** you may not have used tags in your own projects, but explain what they are and why companies use them. It shows you understand the deployment lifecycle, not just the development workflow.
> **Consejo de entrevista:** puede que no hayas usado tags en tus proyectos, pero explica qué son y por qué las usan las empresas. Demuestra que entiendes el ciclo de despliegue, no solo el de desarrollo.

Respuesta señal de alerta: "Nunca he usado tags" sin explicar qué son — muestra una brecha en el conocimiento sobre producción.

<a id="GIT-J-049"></a>

**[GIT-J-049] ¿Cuándo usarías `git stash` en lugar de hacer un commit WIP?** ⭐
Uso `git stash` cuando necesito cambiar de contexto inmediatamente y sé que volvere al mismo trabajo pronto. Un commit WIP contaminaría el historial con un mensaje como "wip: formulario sin terminar" — es mejor hacer stash y nunca commitear código inacabado. La regla: si voy a volver en minutos u horas a la misma rama, stash. Si la interrupción va a durar más de un día, una rama WIP separada es más segura que depender del stash.

Respuesta señal de alerta: "Hago commit de todo con un mensaje wip y lo reescribo después" — historial desordenado, riesgo de hacer amend a commits pusheados, y muestra que no se entiende el stash.

<a id="GIT-J-050"></a>

**[GIT-J-050] ¿Cuál es la diferencia entre `git stash pop` y `git stash apply`?** ⭐
Ambos restauran los cambios que guardaste con `git stash`, pero `pop` además elimina ese stash de la lista de stashes, mientras que `apply` lo deja en la lista. Uso `pop` para el caso normal — restaurar mi trabajo y limpiar el stash. Uso `apply` cuando quiero restaurar los mismos cambios guardados en más de una rama, así el stash sigue disponible hasta que lo elimino manualmente con `git stash drop`.

> **Junior tip:** "pop restores and deletes; apply restores and keeps." Mention `git stash list`.
> **Consejo de entrevista:** "pop restaura y borra; apply restaura y conserva." Menciona `git stash list` para inspeccionar varios stashes — demuestra que has usado stash más allá del caso puntual.

---

## Preguntas de presión

<a id="GIT-J-051"></a>

**[GIT-J-051] Hiciste push de un commit que contiene una clave de API. ¿Qué haces?** ⭐⭐
Primero, eliminar la clave del código y hacer push de un nuevo commit — pero eso no es suficiente, porque la clave sigue en el historial. Los pasos correctos: invalidar la clave de inmediato en el proveedor (para que deje de funcionar), rotarla para obtener una nueva, y luego reescribir el historial con `git filter-branch` o una herramienta como `git-filter-repo` para eliminar la clave de todos los commits. En un equipo, avisaría al resto del equipo y seguiría el proceso de incidencias de la empresa. La lección es usar siempre variables de entorno para las claves y nunca commitearlas.

<a id="GIT-J-052"></a>

**[GIT-J-052] Ejecutaste `git reset --hard` y perdiste cambios que necesitabas. ¿Qué haces?** ⭐⭐
`git reflog` — registra cada posición en la que ha estado HEAD, incluso después de un reset --hard. Puedo encontrar el commit en el que estaba antes del reset y recuperarlo con `git checkout` o `git reset --hard <commit-id>`. El reflog te salva en la mayoría de situaciones en las que crees que has perdido trabajo. Por eso `git reset --hard` en commits pusheados es peligroso — no hay reflog en la máquina de otra persona.

<a id="GIT-J-053"></a>

**[GIT-J-053] Tu PR fue fusionado y desplegado a producción, y causó una regresión. ¿Qué haces?** ⭐⭐
Primero, comunico al equipo de inmediato — no intento arreglarlo en silencio. Luego evalúo la solución más rápida y segura: si el problema es claro y un revert es seguro, ejecuto `git revert` sobre el merge commit y abro un PR de emergencia — esto mantiene el historial limpio y es rápido de revisar. Si revertir es complejo, el equipo puede hacer rollback del despliegue usando el tag de release anterior mientras yo trabajo en una rama de corrección. La lección: siempre tagear los releases para tener siempre un estado conocido y funcional al que volver.

Respuesta señal de alerta: "Pusheo un hotfix directamente a main" — saltarse la revisión bajo presión empeora las cosas en un equipo real.

<a id="GIT-J-054"></a>

**[GIT-J-054] Estás en medio de una funcionalidad y tu responsable te pide que corrijas un bug crítico en main de inmediato. ¿Cómo lo gestionas sin perder tu trabajo?** ⭐⭐
Ejecuto `git stash` para guardar mis cambios actuales, cambio a `main`, hago pull de lo último, creo una rama `fix/critical-bug`, corrijo el bug, hago push y abro un PR de emergencia. Una vez fusionado, vuelvo a mi rama de funcionalidad y ejecuto `git stash pop` para recuperar mi trabajo exactamente donde lo dejé. Ningún código sin terminar toca `main`, y no perdí ni una línea de mi funcionalidad. Esta es exactamente la situación para la que está diseñado `git stash`.

Respuesta señal de alerta: "Hago commit de la funcionalidad sin terminar en main para poder cambiar de rama" — nunca hagas commit de trabajo inacabado en una rama compartida.

<a id="GIT-J-055"></a>

**[GIT-J-055] ¿Qué cambiarías en tu flujo de trabajo con Git si te incorporaras a un equipo de 20 desarrolladores?** ⭐⭐
Varias cosas. Primero, seguiría la estrategia de ramas del equipo — los equipos grandes suelen usar trunk-based development con ramas de corta duración en lugar de ramas de proyecto largas. Segundo, las ramas de funcionalidad serían mucho más cortas — fusionar con más frecuencia para evitar grandes divergencias y conflictos dolorosos. Tercero, el rebase interactivo sería más importante — limpiar los commits locales antes del PR mantiene las revisiones rápidas. Cuarto, usaría `git fetch` e inspeccionaría antes de fusionar, en lugar de hacer `git pull` directamente. También seguiría el proceso de revisión de código del equipo, no solo abrir PRs y fusionar inmediatamente.

Respuesta señal de alerta: "Haría lo mismo" — muestra que no eres consciente de cómo el tamaño del equipo y el proceso de la empresa cambian la práctica de Git.
