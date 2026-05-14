# Git — Preguntas de entrevista

## Conceptos básicos

**¿Qué es Git y por qué lo usan los desarrolladores?**
Git es un sistema de control de versiones — registra cada cambio en el código, te permite volver a cualquier estado anterior y permite que varias personas trabajen en el mismo proyecto sin sobrescribir el trabajo de los demás. Sin él, la colaboración en un equipo real es casi imposible.

**¿Cuál es la diferencia entre Git y GitHub?**
Git es la herramienta que se ejecuta en tu máquina y rastrea los cambios. GitHub es una plataforma en la nube que aloja repositorios Git para que puedas compartirlos y colaborar. Puedes usar Git sin GitHub, pero GitHub necesita Git.

**¿Qué es un commit?**
Una instantánea de tus cambios en un momento concreto, con un mensaje que explica qué ha cambiado. Cada commit tiene un ID único. Sigo el formato Conventional Commits — `feat: add employee form`, `fix: duplicate email check` — para que el historial se lea como un changelog.

**¿Qué es `git status` y cuándo lo usas?**
Muestra el estado actual de tus archivos — qué está en staging, qué está modificado y qué no está rastreado. Lo ejecuto constantemente para asegurarme de que estoy haciendo commit exactamente de lo que quiero, nada más.

**¿Cuál es la diferencia entre `git pull` y `git fetch`?**
`git fetch` descarga los cambios del repositorio remoto pero no los aplica a tu rama local — puedes inspeccionarlos primero. `git pull` hace el fetch y luego hace el merge automáticamente. Uso `git pull` al inicio del día para actualizar mi rama.

**¿Qué es `.gitignore` y qué pones en él?**
Un archivo que le dice a Git qué archivos y carpetas ignorar — nunca se incluyen en los commits. Siempre ignoro `node_modules/`, archivos de entorno con claves de API (`.env`) y archivos de configuración del editor. Sin él subirías miles de archivos de dependencias a GitHub en cada commit.

**¿Qué es el área de staging y por qué Git la tiene?**
El área de staging se sitúa entre el directorio de trabajo y el historial de commits. Cuando editas un archivo va al directorio de trabajo. Cuando ejecutas `git add` pasa al área de staging. Cuando ejecutas `git commit` se convierte en una instantánea permanente. El área de staging te permite seleccionar exactamente qué cambios van en un commit — si has editado tres archivos pero solo dos están listos, haces staging de esos dos y commiteas. El tercero espera al siguiente commit.

**¿Qué es HEAD?**
HEAD es un puntero al commit en el que estás actualmente — normalmente la punta de la rama actual. Cuando cambias de rama, HEAD se mueve. Cuando haces un nuevo commit, HEAD avanza. Lo ves en `git log` y en los mensajes de error — siempre significa "dónde estás ahora mismo". `HEAD~1` significa el commit anterior al actual.

**¿Cuál es la diferencia entre `git init` y `git clone`?**
`git init` crea un repositorio nuevo y vacío en tu máquina desde cero — lo usas cuando empiezas un proyecto nuevo en local. `git clone` descarga un repositorio existente de GitHub a tu máquina, incluyendo el historial completo de commits y el remote ya configurado. En la práctica: `git init` cuando empiezo de cero, `git clone` cuando el proyecto ya existe en GitHub.

---

## Ramas

**¿Qué es una rama y por qué las usas?**
Una rama es una línea de desarrollo independiente — los cambios en una rama no afectan a las demás. Las uso para poder trabajar en una nueva funcionalidad sin romper la versión estable. Cuando la funcionalidad está lista, la fusiono a través de un Pull Request.

**¿Qué estructura de ramas sigues?**
`main` es la rama principal — solo llega aquí código terminado y revisado. Cada proyecto tiene su propia rama desde `main` — `angular/06-hr-portal`. Cada funcionalidad dentro de un proyecto tiene su propia rama desde la rama del proyecto — `feat/auth`, `feat/employee-crud`. Cuando la funcionalidad está lista, abro un PR hacia la rama del proyecto. Cuando el proyecto está completo, abro un PR hacia `main`.

**¿Por qué usas ramas de funcionalidad en lugar de commitear directamente en main?**
Porque `main` debe estar siempre en un estado funcional. Si commiteo una funcionalidad a medias directamente en `main` y algo falla, todo el proyecto queda roto. Las ramas de funcionalidad aíslan el cambio — si algo va mal, solo afecta a esa rama. También hacen posible la revisión de código: el PR da una vista clara de exactamente qué cambió antes de que llegue a `main`.

**¿Qué hace `git push -u origin rama` y por qué usas `-u`?**
Sube la rama local a GitHub y establece el seguimiento upstream — Git ahora sabe que tu rama local corresponde a esa rama remota. Después de este primer push, puedes escribir simplemente `git push` y `git pull` sin especificar el nombre de la rama cada vez. El `-u` solo es necesario una vez, en el primer push de una rama nueva.

**¿Cuál es la diferencia entre `git merge` y `git rebase`?**
`merge` combina dos ramas y crea un commit de merge — el historial muestra exactamente cuándo se unieron las ramas. `rebase` reproduce tus commits encima de otra rama, haciendo el historial lineal. Uso merge para los PRs de proyecto — el commit de merge documenta cuándo se integró una funcionalidad. Rebase es útil para limpiar commits locales antes de hacer push, pero lo evito en ramas compartidas.

**¿Qué es un fast-forward merge?**
Ocurre cuando la rama de destino no tiene commits nuevos desde que se creó la rama de la funcionalidad — Git simplemente mueve el puntero hacia adelante sin crear un commit de merge. El historial queda completamente lineal. Un merge de tres vías ocurre cuando ambas ramas han divergido y Git necesita crear un nuevo commit para unirlas.

**¿Qué es un conflicto de merge y cómo lo resuelves?**
Ocurre cuando dos ramas modifican la misma línea en el mismo archivo y Git no puede decidir qué versión conservar. Git marca el conflicto en el archivo con `<<<<<<<`, `=======` y `>>>>>>>`. Abres el archivo, decides cuál es la versión correcta, eliminas los marcadores, haces staging del archivo y commiteas. Lo importante es no entrar en pánico — leer ambas versiones con calma antes de elegir.

---

## Pull Requests

**¿Qué es un Pull Request?**
Una solicitud para fusionar una rama en otra, con una descripción de qué ha cambiado y por qué. En un equipo, otros desarrolladores revisan el código antes de que se fusione. En mis proyectos personales escribo descripciones de PR para cada funcionalidad — es una buena práctica y hace el historial del portfolio legible.

**¿Qué incluyes en la descripción de un Pull Request?**
Un título, una lista de cambios bajo `## Changes` y una sección `## Why` que explica la decisión principal detrás del cambio. La descripción debe tener sentido para alguien que no ha visto el código — es documentación que queda permanentemente con el historial de commits.

---

## Conventional Commits

**¿Qué es Conventional Commits y por qué lo sigues en lugar de escribir lo que quieras?**
Porque el historial de commits es documentación. Seis meses después, cuando necesitas entender por qué cambió una línea, lees el historial — y `feat: add duplicate email check` te dice exactamente qué y por qué, mientras que `arreglo cosas` no te dice nada. También facilita agrupar cambios por tipo al revisar un PR. Las consultoras españolas lo usan como estándar en sus equipos.

**¿Cuáles son los prefijos principales y cuándo usas cada uno?**
`feat` para nuevas funcionalidades, `fix` para corrección de bugs, `style` para cambios visuales y de CSS, `refactor` para mejoras de código sin nueva funcionalidad, `docs` para documentación, `chore` para tareas de mantenimiento como instalar dependencias, `test` para añadir tests. Cada commit debe hacer solo una cosa — si necesitas dos prefijos, deben ser dos commits.

**¿Qué significa hacer commits atómicos?**
Un cambio lógico por commit, aunque sea pequeño. Nunca agrupas cambios no relacionados. Si corriges un bug y añades una funcionalidad en el mismo commit, el historial se vuelve difícil de leer y de revertir de forma segura. Un revisor debe poder leer el historial de commits y entender qué cambió y por qué, sin leer el código.

---

## Deshacer cambios

**¿Cuál es la diferencia entre `git revert` y `git reset`?**
`git reset` mueve HEAD hacia atrás y reescribe el historial — solo es seguro en commits que no se han hecho push todavía. `git revert` crea un nuevo commit que deshace uno anterior, sin tocar el historial — es seguro en commits que ya están en GitHub. Regla: si el commit ya está pusheado, usa siempre `git revert`.

**¿Qué hace `git restore`?**
Descarta cambios en el directorio de trabajo o elimina archivos del staging. `git restore filename` descarta tus ediciones y devuelve el archivo al último commit. `git restore --staged filename` mueve el archivo del área de staging de vuelta al directorio de trabajo sin perder los cambios. No toca el historial de commits.

**¿Cómo deshaces un commit ya pusheado sin perder el historial?**
Con `git revert <commit-id>`. Crea un nuevo commit que revierte los cambios del commit especificado — el commit original permanece en el historial y se puede ver que el cambio se hizo y luego se deshizo. Nunca uses `git reset --hard` en un commit pusheado — reescribe el historial y rompe el trabajo de cualquier otra persona que tenga esos commits.

---

## Comandos útiles

**¿Qué hace `git stash` y cuándo es útil?**
Guarda temporalmente los cambios sin commitear y restaura el directorio de trabajo al último commit. Es útil cuando necesitas cambiar de rama rápidamente pero no estás listo para commitear — `git stash pop` recupera los cambios. Lo uso cuando estoy en medio de algo y necesito revisar otra rama sin commitear trabajo a medias.

**¿Qué muestra `git log --oneline`?**
Una vista compacta del historial de commits — una línea por commit con el ID corto y el mensaje. Lo uso para comprobar que mis commits están en orden y tienen mensajes claros antes de hacer push.

**¿Qué muestra `git diff` y cuál es la diferencia con `git diff --staged`?**
`git diff` muestra los cambios en el directorio de trabajo que aún no están en staging — lo que has editado pero todavía no has hecho `git add`. `git diff --staged` muestra los cambios que están en staging y listos para commitear — lo que va a entrar en el próximo `git commit`. Uso `git diff --staged` justo antes de commitear para hacer una revisión final de exactamente qué voy a guardar.

**¿Qué es `git blame` y cuándo es útil?**
Muestra quién modificó por última vez cada línea de un archivo y en qué commit. Cuando encuentro una línea que no entiendo, ejecuto `git blame filename` para saber cuándo se añadió — luego leo ese mensaje de commit para entender por qué. En un equipo también es útil para saber a quién preguntar sobre una parte concreta del código.

**¿Qué es `git cherry-pick` y cuándo lo usarías?**
Aplica los cambios de un commit concreto sobre la rama actual, sin fusionar toda la rama — `git cherry-pick a3f8c1d`. El caso típico: se corrige un bug en una rama de funcionalidad pero necesitas ese arreglo en `main` ahora mismo, antes de que toda la funcionalidad esté lista. Haces cherry-pick solo de ese commit de corrección. Lo uso con moderación — duplica commits y puede hacer el historial confuso si se abusa de él.

---

## Preguntas de presión

**Hiciste push de un commit que contiene una clave de API. ¿Qué haces?**
Primero, eliminar la clave del código y hacer push de un nuevo commit — pero eso no es suficiente, porque la clave sigue en el historial. Los pasos correctos: invalidar la clave de inmediato en el proveedor (para que deje de funcionar), rotarla para obtener una nueva, y luego reescribir el historial con `git filter-branch` o una herramienta como `git-filter-repo` para eliminar la clave de todos los commits. En un equipo, avisaría al resto del equipo y seguiría el proceso de incidencias de la empresa. La lección es usar siempre variables de entorno para las claves y nunca commitearlas.

**Ejecutaste `git reset --hard` y perdiste cambios que necesitabas. ¿Qué haces?**
`git reflog` — registra cada posición en la que ha estado HEAD, incluso después de un reset --hard. Puedo encontrar el commit en el que estaba antes del reset y recuperarlo con `git checkout` o `git reset --hard <commit-id>`. El reflog te salva en la mayoría de situaciones en las que crees que has perdido trabajo. Por eso `git reset --hard` en commits pusheados es peligroso — no hay reflog en la máquina de otra persona.
