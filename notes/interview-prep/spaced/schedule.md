# Repaso espaciado — preguntas de entrevista

Plan y estado del bloque de interview-prep. Este archivo guarda, pregunta a pregunta, cuándo la
aprendiste, cómo te fue en cada repaso y cuándo toca el siguiente, y en qué orden vienen las que aún no
has estudiado. Lo escribe `spaced.py`; a mano solo se tocan `## Reglas` y `## Ajustes`. Justo debajo,
`spaced.py` recalcula en cada escritura **por dónde vas** (`## Estado`), **los próximos días**
(`## Próximos días`) y **la evolución semana a semana** (`## Evolución`); el resumen va también a
`PROGRESS.md` → `## Study progress`.

<!-- spaced.py: inicio de lo generado, no editar a mano -->

## Estado

_Calculado por `spaced.py` el 23/10/2026._

**Nivel actual: junior.** Después vendrán middle y senior. Un nivel no empieza hasta que todas las preguntas del anterior estén consolidadas.

| Fase | Preguntas | Aprendidas | Verificadas | Consolidadas | Situación |
|---|---|---|---|---|---|
| 1 · junior · ⭐⭐⭐ Núcleo para el primer empleo | 194 | 0 (0%) | 0 | 0 | abierta · última nueva prevista 22/12/2026 · verificada entera hacia el 29/12/2026 |
| 2 · junior · ⭐⭐⭐ Resto de bancos y proyectos | 103 | 0 (0%) | 0 | 0 | se abre cuando estén verificadas todas las de la fase anterior (previsto: empieza hacia el 30/12/2026) |
| 3 · junior · ⭐⭐ Profundización (por planificar) | 0 | 0 (—) | 0 | 0 | por planificar contigo cuando termine la fase anterior |

Repasos atrasados: 0 · Difíciles (2 fallos o más): ninguna

### Por tema

| Tema | Fase | Prioridad | Preguntas | Aprendidas | Verificadas | Consolidadas |
|---|---|---|---|---|---|---|
| Proyecto 7 | 1 | máxima | 31 | 0 | 0 | 0 |
| Spring Boot | 1 | alta | 28 | 0 | 0 | 0 |
| Angular | 1 | alta | 37 | 0 | 0 | 0 |
| Java | 1 | alta | 18 | 0 | 0 | 0 |
| SQL | 1 | media | 14 | 0 | 0 | 0 |
| Seguridad | 1 | media | 9 | 0 | 0 | 0 |
| Arquitectura | 1 | media | 11 | 0 | 0 | 0 |
| TypeScript | 1 | media | 3 | 0 | 0 | 0 |
| General | 1 | media | 6 | 0 | 0 | 0 |
| JavaScript | 1 | baja | 10 | 0 | 0 | 0 |
| Git | 1 | baja | 9 | 0 | 0 | 0 |
| Proyecto 6 | 1 | baja | 18 | 0 | 0 | 0 |
| Proyecto 5 | 2 | alta | 15 | 0 | 0 | 0 |
| Proyecto 3 | 2 | media | 24 | 0 | 0 | 0 |
| CSS | 2 | media | 12 | 0 | 0 | 0 |
| Proyecto 4 | 2 | baja | 22 | 0 | 0 | 0 |
| Proyecto 2 | 2 | baja | 13 | 0 | 0 | 0 |
| Proyecto 1 | 2 | baja | 17 | 0 | 0 | 0 |

## Próximos días

Previsión suponiendo que todos los repasos salen bien; se recalcula con cada resultado.

| Día | Repasos | Nuevas | Preguntas nuevas |
|---|---|---|---|
| lunes 26/10/2026 | 0 | 4 | 07-timetrack-001 · ANG-J-001 · SB-J-001 · 07-timetrack-005 |
| martes 27/10/2026 | 4 | 4 | JAVA-J-001 · ANG-J-003 · 07-timetrack-007 · SB-J-002 |
| miércoles 28/10/2026 | 4 | 4 | 07-timetrack-009 · ANG-J-005 · 07-timetrack-059 · JAVA-J-002 |
| jueves 29/10/2026 | 4 | 4 | SB-J-003 · ANG-J-007 · 07-timetrack-061 · 07-timetrack-062 |
| viernes 30/10/2026 | 4 | 4 | ANG-J-011 · SB-J-004 · 07-timetrack-105 · JAVA-J-007 |
| sábado 31/10/2026 | 4 | 4 | ANG-J-013 · 07-timetrack-019 · SB-J-006 · 07-timetrack-020 |

## Evolución

Una fila por semana de estudio, sacada del historial de cada pregunta.

Aún sin actividad.

<!-- spaced.py: fin de lo generado -->

## Cómo se usa

1. Al empezar el bloque, pregúntale a Claude «¿qué toca hoy?» (o
   `python notes/interview-prep/spaced/spaced.py hoy`). Primero salen los repasos y después las
   preguntas nuevas.
2. Tras cada pregunta se registra el resultado:
   `spaced.py registrar ID aprendida|pass|borderline|fail`.
3. ¿Te sobra tiempo? `spaced.py mas` da las siguientes nuevas en el orden de estudio. ¿Hoy no llegas?
   No pasa nada: lo que no hagas sigue pendiente mañana, y el plan se recalcula con lo que hayas hecho.
4. `calendario` enseña más días por delante y `estado` el progreso por fase y por tema.
5. Al cerrar el bloque, `spaced.py progreso --escribir` actualiza el resumen de `PROGRESS.md` y las
   secciones de arriba.

## Reglas

**Qué se estudia y en qué orden**

- **Por niveles.** Ahora estudias el nivel **junior**: sus bancos (`notes/interview-prep/junior/`) y
  los de tus proyectos. Más adelante vendrán **middle** y **senior**, con sus propios bancos y sus
  propias fases. **Un nivel no empieza hasta que todas las preguntas del anterior estén consolidadas**
  (tres `pass` seguidos); mientras tanto, el nivel siguiente no da preguntas nuevas, aunque sus fases ya
  estén escritas en `## Ajustes`.
- **Por fases, dentro del nivel.** Fase 1: las ⭐⭐⭐ de lo que más pesa para el primer empleo Angular + Spring Boot en
  consultora. Fase 2: las ⭐⭐⭐ del resto de bancos y proyectos. Fase 3: las ⭐⭐, que se planifican
  contigo cuando termine la fase 2. Las fuentes de cada fase y su prioridad están en `## Ajustes`.
- **Una fase se abre cuando todas las de la anterior están verificadas** (si es del mismo nivel) o
  consolidadas (si es la primera de un nivel nuevo), y ya no se cierra. Si un banco
  de una fase anterior gana preguntas después, esas van primero.
- **Orden dentro de la fase:** cada banco reparte sus preguntas, en el orden en que están en el banco
  (de lo básico a lo avanzado), a lo largo de un tramo de la fase según su prioridad: las de prioridad
  `máxima` empiezan el primer día y se terminan al 40 % de la fase (el proyecto 7, decidido el
  23/10/2026: es lo primero que preguntan y da los ejemplos al resto); las `alta` empiezan el primer día
  y se terminan al 70 %; las `media` entran al 10 % y acaban al
  85 %; las `baja` entran al 20 % y llegan hasta el final. Así lo que más pesa llega antes y, en cuanto
  entran los demás bancos, cada día mezcla temas.
- **Cuando un banco cambia** (se rehace, gana o pierde ⭐⭐⭐), `spaced.py` lo detecta solo en cada `hoy`,
  `mas`, `calendario`, `estado`, `sincronizar` y `progreso`, y también al final de las auditorías que
  escriben los bancos: añade las nuevas en su sitio, quita las pendientes que ya no están, retira (con
  su historial) las aprendidas que ya no están y recalcula el orden de todo lo pendiente.

**Cómo se estudia**

- **Pregunta nueva:** intentas responder sin mirar, lees la respuesta del banco (`es/`), la explicas con
  tus palabras y con un ejemplo. Se registra como `aprendida`.
- **Repaso:** sin mirar la respuesta ni recibir pistas, y con una repregunta sobre el mismo concepto. Es
  `pass` si la respuesta es correcta, das un ejemplo válido (del proyecto cuando corresponda) y aguantas
  la repregunta; `borderline` si la idea central está bien pero falta algo importante; `fail` si hay un
  error de concepto o no te acuerdas. Solo cuenta el primer intento del día.

**Cuándo vuelve cada pregunta**

- Cada pregunta lleva su **intervalo** (días hasta el próximo repaso) y su **facilidad** (cuánto crece
  el intervalo con cada acierto; empieza en 2,5).
- `aprendida` → repaso al día siguiente.
- `pass` → el primero tras aprenderla, a los 6 días; los siguientes, el intervalo × la facilidad (unos
  +1, +7, +22 y +60 días desde que la aprendes), con un máximo de 60 días: ese es el mantenimiento.
- `borderline` → la facilidad baja 0,15 y el repaso vuelve antes: a la mitad del intervalo, como mucho
  a los 7 días. La racha se conserva.
- `fail` → la facilidad baja 0,20, la racha vuelve a 0 y se repasa al día siguiente; el primer `pass`
  después vuelve a los 3 días. Como la facilidad ha bajado, **a partir de ahí todos sus intervalos son
  más cortos**: lo que se te olvida vuelve más a menudo.
- **Un repaso hecho tarde que sale `pass`** cuenta la mitad del retraso a tu favor (aguantó más de lo
  previsto). Un repaso atrasado sigue apareciendo hasta que se hace; primero salen los que más riesgo
  tienen (más días de retraso para su intervalo).
- **Domingo libre:** lo que cae en domingo pasa al lunes.

**Cuántas nuevas al día**

- No se cronometra nada. Un día normal da para unos **20 puntos**: cada repaso vale 1 y cada pregunta
  nueva 2. Primero van todos los repasos y las nuevas rellenan lo que quede, hasta 4. Con muchos
  repasos pendientes salen menos nuevas, o ninguna hasta ponerte al día.
- Un día con más tiempo, `mas` te da las siguientes. Un día con menos, haces lo que puedas: el resto
  sigue pendiente y el plan se adapta.

**Estados**

- `pendiente` (aún no la has estudiado) · `en repaso` · `verificada` (dos `pass` seguidos) ·
  `consolidada` (tres o más) · `retirada` (aprendida, pero su banco ya no la tiene en ninguna fase; se
  conserva el historial y vuelve si la recupera). **Difícil:** dos fallos o más; sale en `## Estado`.

## Ajustes

- Inicio: 2026-10-26
- Domingo libre: sí
- Nuevas por día: 4
- Carga del día: 20
- Puntos por repaso: 1
- Puntos por pregunta nueva: 2
- Primer intervalo: 6
- Intervalo tras un fallo: 3
- Intervalo máximo: 60
- Facilidad inicial: 2,5
- Facilidad mínima: 1,3
- Penalización borderline: 0,15
- Penalización fail: 0,2
- Repaso máximo tras borderline: 7
- Reparto por prioridad: máxima 0–0,4 · alta 0–0,7 · media 0,1–0,85 · baja 0,2–1

- Niveles: junior, middle, senior

Fases (nivel | estrellas que entran | nombre; las de middle y senior se añadirán cuando tengan bancos):

- Fase 1: junior | ⭐⭐⭐ | Núcleo para el primer empleo
- Fase 2: junior | ⭐⭐⭐ | Resto de bancos y proyectos
- Fase 3: junior | ⭐⭐ | Profundización (por planificar)

Fuentes (banco | tema | fase | prioridad; con la misma prioridad, el orden de la lista desempata):

- Fuente: projects/es/07-timetrack.md | Proyecto 7 | 1 | máxima
- Fuente: junior/es/spring-boot.md | Spring Boot | 1 | alta
- Fuente: junior/es/angular.md | Angular | 1 | alta
- Fuente: junior/es/java.md | Java | 1 | alta
- Fuente: junior/es/sql.md | SQL | 1 | media
- Fuente: junior/es/security.md | Seguridad | 1 | media
- Fuente: junior/es/architecture.md | Arquitectura | 1 | media
- Fuente: junior/es/typescript.md | TypeScript | 1 | media
- Fuente: junior/es/general.md | General | 1 | media
- Fuente: junior/es/javascript.md | JavaScript | 1 | baja
- Fuente: junior/es/git.md | Git | 1 | baja
- Fuente: projects/es/06-hr-portal.md | Proyecto 6 | 1 | baja
- Fuente: projects/es/05-task-manager.md | Proyecto 5 | 2 | alta
- Fuente: projects/es/03-expense-tracker.md | Proyecto 3 | 2 | media
- Fuente: junior/es/css.md | CSS | 2 | media
- Fuente: projects/es/04-meal-finder.md | Proyecto 4 | 2 | baja
- Fuente: projects/es/02-weather-app.md | Proyecto 2 | 2 | baja
- Fuente: projects/es/01-todo-list.md | Proyecto 1 | 2 | baja

## Preguntas

| # | ID | Tema | Fase | Título | Aprendida | Racha | Fallos | Intervalo | Próximo repaso | Estado | Historial |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 07-timetrack-001 | Proyecto 7 | 1 | API JSON y separación de Angular |  |  |  |  |  | pendiente |  |
| 2 | ANG-J-001 | Angular | 1 | Qué es Angular |  |  |  |  |  | pendiente |  |
| 3 | SB-J-001 | Spring Boot | 1 | Qué es Spring Boot y por qué se usa |  |  |  |  |  | pendiente |  |
| 4 | 07-timetrack-005 | Proyecto 7 | 1 | Filtrar entradas según el usuario |  |  |  |  |  | pendiente |  |
| 5 | JAVA-J-001 | Java | 1 | Primitivos frente a objetos |  |  |  |  |  | pendiente |  |
| 6 | ANG-J-003 | Angular | 1 | Qué es un componente |  |  |  |  |  | pendiente |  |
| 7 | 07-timetrack-007 | Proyecto 7 | 1 | DTOs en lugar de entidades JPA |  |  |  |  |  | pendiente |  |
| 8 | SB-J-002 | Spring Boot | 1 | Qué es la auto-configuración |  |  |  |  |  | pendiente |  |
| 9 | 07-timetrack-009 | Proyecto 7 | 1 | Operaciones explícitas para cambiar de estado |  |  |  |  |  | pendiente |  |
| 10 | ANG-J-005 | Angular | 1 | Inyección de dependencias en Angular |  |  |  |  |  | pendiente |  |
| 11 | 07-timetrack-059 | Proyecto 7 | 1 | Shell, rutas hijas y carga diferida |  |  |  |  |  | pendiente |  |
| 12 | JAVA-J-002 | Java | 1 | BigDecimal frente a double para dinero |  |  |  |  |  | pendiente |  |
| 13 | SB-J-003 | Spring Boot | 1 | Inyección por constructor frente a @Autowired en campo |  |  |  |  |  | pendiente |  |
| 14 | ANG-J-007 | Angular | 1 | Componentes standalone y el array imports |  |  |  |  |  | pendiente |  |
| 15 | 07-timetrack-061 | Proyecto 7 | 1 | Página coordinadora y lista presentacional |  |  |  |  |  | pendiente |  |
| 16 | 07-timetrack-062 | Proyecto 7 | 1 | Estado compartido de aprobaciones pendientes |  |  |  |  |  | pendiente |  |
| 17 | ANG-J-011 | Angular | 1 | Tipos de data binding |  |  |  |  |  | pendiente |  |
| 18 | SB-J-004 | Spring Boot | 1 | @Transactional y dónde se pone |  |  |  |  |  | pendiente |  |
| 19 | 07-timetrack-105 | Proyecto 7 | 1 | Contrato JSON y tipos de TypeScript |  |  |  |  |  | pendiente |  |
| 20 | JAVA-J-007 | Java | 1 | Por qué == falla con Strings |  |  |  |  |  | pendiente |  |
| 21 | ANG-J-013 | Angular | 1 | Qué es un signal |  |  |  |  |  | pendiente |  |
| 22 | 07-timetrack-019 | Proyecto 7 | 1 | JWT stateless y CSRF |  |  |  |  |  | pendiente |  |
| 23 | SB-J-006 | Spring Boot | 1 | Qué hace @SpringBootApplication |  |  |  |  |  | pendiente |  |
| 24 | 07-timetrack-020 | Proyecto 7 | 1 | ID inmutable como identidad del JWT |  |  |  |  |  | pendiente |  |
| 25 | ANG-J-015 | Angular | 1 | signal() frente a computed() |  |  |  |  |  | pendiente |  |
| 26 | SQL-J-001 | SQL | 1 | PRIMARY KEY combinada con SERIAL |  |  |  |  |  | pendiente |  |
| 27 | ARC-J-001 | Arquitectura | 1 | REST en aplicaciones Angular |  |  |  |  |  | pendiente |  |
| 28 | 07-timetrack-021 | Proyecto 7 | 1 | Del filtro JWT a la autorización |  |  |  |  |  | pendiente |  |
| 29 | JAVA-J-012 | Java | 1 | == frente a .equals() |  |  |  |  |  | pendiente |  |
| 30 | SB-J-014 | Spring Boot | 1 | @Controller frente a @RestController |  |  |  |  |  | pendiente |  |
| 31 | SEC-J-001 | Seguridad | 1 | Autenticación y autorización |  |  |  |  |  | pendiente |  |
| 32 | ANG-J-016 | Angular | 1 | effect() y cuándo usarlo |  |  |  |  |  | pendiente |  |
| 33 | 07-timetrack-022 | Proyecto 7 | 1 | Consultar la cuenta en cada petición |  |  |  |  |  | pendiente |  |
| 34 | ANG-J-020 | Angular | 1 | signal.set() frente a signal.update() |  |  |  |  |  | pendiente |  |
| 35 | 07-timetrack-023 | Proyecto 7 | 1 | Filter chain y seguridad por método |  |  |  |  |  | pendiente |  |
| 36 | SB-J-015 | Spring Boot | 1 | @PathVariable frente a @RequestParam |  |  |  |  |  | pendiente |  |
| 37 | GEN-J-001 | General | 1 | El principio DRY |  |  |  |  |  | pendiente |  |
| 38 | 07-timetrack-025 | Proyecto 7 | 1 | Contraseñas con BCrypt |  |  |  |  |  | pendiente |  |
| 39 | JAVA-J-018 | Java | 1 | Los cuatro modificadores de acceso |  |  |  |  |  | pendiente |  |
| 40 | ANG-J-022 | Angular | 1 | El bloque @if |  |  |  |  |  | pendiente |  |
| 41 | SQL-J-002 | SQL | 1 | Definir una clave foránea |  |  |  |  |  | pendiente |  |
| 42 | 07-timetrack-029 | Proyecto 7 | 1 | Secreto JWT fuera del repositorio |  |  |  |  |  | pendiente |  |
| 43 | SB-J-016 | Spring Boot | 1 | Arquitectura en capas de Spring Boot |  |  |  |  |  | pendiente |  |
| 44 | ANG-J-023 | Angular | 1 | @for y track |  |  |  |  |  | pendiente |  |
| 45 | 07-timetrack-075 | Proyecto 7 | 1 | Sesión en localStorage y seguridad |  |  |  |  |  | pendiente |  |
| 46 | ARC-J-002 | Arquitectura | 1 | Métodos de petición HTTP |  |  |  |  |  | pendiente |  |
| 47 | SB-J-017 | Spring Boot | 1 | DTOs frente a devolver entidades JPA |  |  |  |  |  | pendiente |  |
| 48 | 07-timetrack-078 | Proyecto 7 | 1 | Interceptor y bearer token |  |  |  |  |  | pendiente |  |
| 49 | JAVA-J-020 | Java | 1 | Qué es la encapsulación |  |  |  |  |  | pendiente |  |
| 50 | ANG-J-038 | Angular | 1 | Qué es HttpClient |  |  |  |  |  | pendiente |  |
| 51 | 06-hr-portal-001 | Proyecto 6 | 1 | Tu HR portal divide `src/app` en `core/`, `pages/`, `shared/` y una carpeta `mod… |  |  |  |  |  | pendiente |  |
| 52 | SEC-J-002 | Seguridad | 1 | Respuestas 401 y 403 |  |  |  |  |  | pendiente |  |
| 53 | TS-J-001 | TypeScript | 1 | Qué aporta TypeScript |  |  |  |  |  | pendiente |  |
| 54 | 07-timetrack-079 | Proyecto 7 | 1 | Caducar la sesión ante un 401 |  |  |  |  |  | pendiente |  |
| 55 | SQL-J-010 | SQL | 1 | NUMERIC frente a FLOAT para dinero |  |  |  |  |  | pendiente |  |
| 56 | ANG-J-039 | Angular | 1 | Observable frente a Promise |  |  |  |  |  | pendiente |  |
| 57 | SB-J-018 | Spring Boot | 1 | CORS y el error CORS desde Angular |  |  |  |  |  | pendiente |  |
| 58 | 07-timetrack-106 | Proyecto 7 | 1 | Recorrido completo del login y la sesión |  |  |  |  |  | pendiente |  |
| 59 | JS-J-001 | JavaScript | 1 | Var, let y const |  |  |  |  |  | pendiente |  |
| 60 | GIT-J-001 | Git | 1 | Qué es Git y por qué usarlo |  |  |  |  |  | pendiente |  |
| 61 | 07-timetrack-031 | Proyecto 7 | 1 | Ocultar entradas ajenas con 404 |  |  |  |  |  | pendiente |  |
| 62 | JAVA-J-025 | Java | 1 | Interfaz frente a clase abstracta |  |  |  |  |  | pendiente |  |
| 63 | ANG-J-040 | Angular | 1 | subscribe() y cuándo desuscribirse |  |  |  |  |  | pendiente |  |
| 64 | SB-J-019 | Spring Boot | 1 | Por qué devolver ResponseEntity |  |  |  |  |  | pendiente |  |
| 65 | 07-timetrack-032 | Proyecto 7 | 1 | Proyectos inactivos: 404 frente a 400 |  |  |  |  |  | pendiente |  |
| 66 | 06-hr-portal-005 | Proyecto 6 | 1 | Todas las rutas de tu app usan `loadComponent` con un import dinámico. ¿Qué desc… |  |  |  |  |  | pendiente |  |
| 67 | ARC-J-003 | Arquitectura | 1 | Códigos de estado HTTP |  |  |  |  |  | pendiente |  |
| 68 | ANG-J-048 | Angular | 1 | Subject frente a BehaviorSubject |  |  |  |  |  | pendiente |  |
| 69 | 07-timetrack-034 | Proyecto 7 | 1 | Evitar el autobloqueo del manager |  |  |  |  |  | pendiente |  |
| 70 | SB-J-024 | Spring Boot | 1 | Anotaciones de Bean Validation y @Valid |  |  |  |  |  | pendiente |  |
| 71 | SQL-J-015 | SQL | 1 | Qué es una clave foránea |  |  |  |  |  | pendiente |  |
| 72 | GEN-J-002 | General | 1 | Código síncrono frente a asíncrono |  |  |  |  |  | pendiente |  |
| 73 | 07-timetrack-038 | Proyecto 7 | 1 | Generación y reset de contraseñas |  |  |  |  |  | pendiente |  |
| 74 | JAVA-J-029 | Java | 1 | Qué es el polimorfismo |  |  |  |  |  | pendiente |  |
| 75 | ANG-J-050 | Angular | 1 | Cómo funciona el routing en Angular |  |  |  |  |  | pendiente |  |
| 76 | 07-timetrack-041 | Proyecto 7 | 1 | Condiciones para aprobar o rechazar |  |  |  |  |  | pendiente |  |
| 77 | SEC-J-003 | Seguridad | 1 | Control de acceso por roles |  |  |  |  |  | pendiente |  |
| 78 | 06-hr-portal-008 | Proyecto 6 | 1 | Los departamentos se crean y se editan con un formulario enrutado, pero los empl… |  |  |  |  |  | pendiente |  |
| 79 | ANG-J-051 | Angular | 1 | Qué es un route guard |  |  |  |  |  | pendiente |  |
| 80 | SB-J-027 | Spring Boot | 1 | JPA frente a Hibernate |  |  |  |  |  | pendiente |  |
| 81 | 07-timetrack-084 | Proyecto 7 | 1 | Acciones de Entries según rol y estado |  |  |  |  |  | pendiente |  |
| 82 | JS-J-002 | JavaScript | 1 | Qué es un closure |  |  |  |  |  | pendiente |  |
| 83 | 07-timetrack-085 | Proyecto 7 | 1 | Prohibir la revisión de entradas propias |  |  |  |  |  | pendiente |  |
| 84 | JAVA-J-033 | Java | 1 | List, Set y Map |  |  |  |  |  | pendiente |  |
| 85 | ANG-J-056 | Angular | 1 | Route params frente a query params |  |  |  |  |  | pendiente |  |
| 86 | GIT-J-002 | Git | 1 | Git frente a GitHub |  |  |  |  |  | pendiente |  |
| 87 | SB-J-028 | Spring Boot | 1 | Qué te da JpaRepository |  |  |  |  |  | pendiente |  |
| 88 | ARC-J-008 | Arquitectura | 1 | Los principios SOLID |  |  |  |  |  | pendiente |  |
| 89 | SQL-J-016 | SQL | 1 | Los tres tipos de relaciones entre tablas |  |  |  |  |  | pendiente |  |
| 90 | 07-timetrack-091 | Proyecto 7 | 1 | Autogestión del manager en Team |  |  |  |  |  | pendiente |  |
| 91 | ANG-J-061 | Angular | 1 | Qué es el lazy loading |  |  |  |  |  | pendiente |  |
| 92 | 07-timetrack-128 | Proyecto 7 | 1 | Acceso ajeno: controles de Angular y Spring |  |  |  |  |  | pendiente |  |
| 93 | 06-hr-portal-011 | Proyecto 6 | 1 | ¿Cómo decide la barra lateral qué enlaces mostrar? Y ocultar un enlace, ¿protege… |  |  |  |  |  | pendiente |  |
| 94 | SB-J-032 | Spring Boot | 1 | Qué es un derived query method |  |  |  |  |  | pendiente |  |
| 95 | 07-timetrack-129 | Proyecto 7 | 1 | Reabrir una entrada rechazada |  |  |  |  |  | pendiente |  |
| 96 | ANG-J-065 | Angular | 1 | Qué es un HTTP interceptor |  |  |  |  |  | pendiente |  |
| 97 | JAVA-J-034 | Java | 1 | Sobreescribir equals() y hashCode() juntos |  |  |  |  |  | pendiente |  |
| 98 | 07-timetrack-110 | Proyecto 7 | 1 | Stack local con Docker Compose |  |  |  |  |  | pendiente |  |
| 99 | SB-J-035 | Spring Boot | 1 | @OneToMany frente a @ManyToOne |  |  |  |  |  | pendiente |  |
| 100 | ANG-J-070 | Angular | 1 | Formularios reactivos frente a template-driven |  |  |  |  |  | pendiente |  |
| 101 | SEC-J-005 | Seguridad | 1 | Partes y claims del JWT |  |  |  |  |  | pendiente |  |
| 102 | 07-timetrack-112 | Proyecto 7 | 1 | Despliegue público antes de terminar los tests |  |  |  |  |  | pendiente |  |
| 103 | SQL-J-028 | SQL | 1 | Por qué falla WHERE price = NULL |  |  |  |  |  | pendiente |  |
| 104 | JS-J-005 | JavaScript | 1 | Igualdad débil frente a estricta |  |  |  |  |  | pendiente |  |
| 105 | 06-hr-portal-015 | Proyecto 6 | 1 | Tus páginas de empleados y de solicitudes de ausencia siguen un patrón coordinat… |  |  |  |  |  | pendiente |  |
| 106 | ANG-J-080 | Angular | 1 | ngOnInit y cuándo usarlo |  |  |  |  |  | pendiente |  |
| 107 | ARC-J-014 | Arquitectura | 1 | MVC en Spring Boot |  |  |  |  |  | pendiente |  |
| 108 | JAVA-J-041 | Java | 1 | Excepciones checked frente a unchecked |  |  |  |  |  | pendiente |  |
| 109 | SB-J-029 | Spring Boot | 1 | FetchType.LAZY frente a FetchType.EAGER |  |  |  |  |  | pendiente |  |
| 110 | GEN-J-008 | General | 1 | Trabajar en un entorno ágil |  |  |  |  |  | pendiente |  |
| 111 | GIT-J-003 | Git | 1 | Pull frente a fetch |  |  |  |  |  | pendiente |  |
| 112 | ANG-J-081 | Angular | 1 | Llamadas a la API en ngOnInit frente al constructor |  |  |  |  |  | pendiente |  |
| 113 | SB-J-030 | Spring Boot | 1 | El problema N+1 |  |  |  |  |  | pendiente |  |
| 114 | 06-hr-portal-023 | Proyecto 6 | 1 | Admins y empleados comparten la única ruta `/leave-requests` y el único `LeaveRe… |  |  |  |  |  | pendiente |  |
| 115 | ANG-J-086 | Angular | 1 | Qué es un pipe |  |  |  |  |  | pendiente |  |
| 116 | JAVA-J-047 | Java | 1 | Qué es una lambda |  |  |  |  |  | pendiente |  |
| 117 | SQL-J-037 | SQL | 1 | Qué es un JOIN |  |  |  |  |  | pendiente |  |
| 118 | SB-J-042 | Spring Boot | 1 | Cómo funciona la autenticación JWT |  |  |  |  |  | pendiente |  |
| 119 | ANG-J-089 | Angular | 1 | El pipe async |  |  |  |  |  | pendiente |  |
| 120 | SEC-J-006 | Seguridad | 1 | Cifrado del JWT y datos sensibles |  |  |  |  |  | pendiente |  |
| 121 | ARC-J-018 | Arquitectura | 1 | Componentes smart y dumb |  |  |  |  |  | pendiente |  |
| 122 | TS-J-002 | TypeScript | 1 | Interface frente a type |  |  |  |  |  | pendiente |  |
| 123 | JS-J-006 | JavaScript | 1 | Coerción de tipos implícita |  |  |  |  |  | pendiente |  |
| 124 | ANG-J-092 | Angular | 1 | Qué es Angular Material |  |  |  |  |  | pendiente |  |
| 125 | JAVA-J-048 | Java | 1 | Qué es el Stream API |  |  |  |  |  | pendiente |  |
| 126 | SB-J-043 | Spring Boot | 1 | SecurityFilterChain y qué se configura en él |  |  |  |  |  | pendiente |  |
| 127 | 06-hr-portal-029 | Proyecto 6 | 1 | Tus diálogos nunca guardan nada por sí mismos. ¿Quién escribe en el servicio cua… |  |  |  |  |  | pendiente |  |
| 128 | ANG-J-097 | Angular | 1 | MatTableDataSource frente a un array |  |  |  |  |  | pendiente |  |
| 129 | SQL-J-038 | SQL | 1 | INNER JOIN frente a LEFT JOIN |  |  |  |  |  | pendiente |  |
| 130 | GIT-J-011 | Git | 1 | Qué es una rama |  |  |  |  |  | pendiente |  |
| 131 | SB-J-044 | Spring Boot | 1 | Autenticación frente a autorización |  |  |  |  |  | pendiente |  |
| 132 | ANG-J-110 | Angular | 1 | Qué es la encapsulación de vistas |  |  |  |  |  | pendiente |  |
| 133 | JAVA-J-057 | Java | 1 | Qué son los genéricos |  |  |  |  |  | pendiente |  |
| 134 | 06-hr-portal-056 | Proyecto 6 | 1 | Tus guards son funciones normales tipadas como `CanActivateFn`, no clases que im… |  |  |  |  |  | pendiente |  |
| 135 | SB-J-045 | Spring Boot | 1 | BCryptPasswordEncoder y las contraseñas en texto plano |  |  |  |  |  | pendiente |  |
| 136 | GEN-J-012 | General | 1 | Scrum frente a Kanban |  |  |  |  |  | pendiente |  |
| 137 | ANG-J-115 | Angular | 1 | Tu experiencia con tests unitarios en Angular |  |  |  |  |  | pendiente |  |
| 138 | ARC-J-021 | Arquitectura | 1 | Ventajas de la arquitectura en capas |  |  |  |  |  | pendiente |  |
| 139 | SQL-J-043 | SQL | 1 | Qué hace GROUP BY |  |  |  |  |  | pendiente |  |
| 140 | ANG-J-116 | Angular | 1 | Qué es TestBed |  |  |  |  |  | pendiente |  |
| 141 | SEC-J-009 | Seguridad | 1 | Hashing y cifrado |  |  |  |  |  | pendiente |  |
| 142 | JS-J-012 | JavaScript | 1 | Funciones normales frente a arrow functions |  |  |  |  |  | pendiente |  |
| 143 | SB-J-046 | Spring Boot | 1 | JWT frente a sesiones del lado del servidor |  |  |  |  |  | pendiente |  |
| 144 | JAVA-J-058 | Java | 1 | Optional frente a devolver null |  |  |  |  |  | pendiente |  |
| 145 | ANG-J-123 | Angular | 1 | Qué es la detección de cambios |  |  |  |  |  | pendiente |  |
| 146 | 06-hr-portal-057 | Proyecto 6 | 1 | Las rutas de admin llevan `canActivate: [authGuard, adminGuard]`. Explícame qué … |  |  |  |  |  | pendiente |  |
| 147 | SB-J-056 | Spring Boot | 1 | @ControllerAdvice y cuándo usarlo |  |  |  |  |  | pendiente |  |
| 148 | ANG-J-124 | Angular | 1 | Default frente a OnPush |  |  |  |  |  | pendiente |  |
| 149 | GIT-J-012 | Git | 1 | Merge frente a rebase |  |  |  |  |  | pendiente |  |
| 150 | JAVA-J-061 | Java | 1 | Enum frente a constante String |  |  |  |  |  | pendiente |  |
| 151 | SQL-J-044 | SQL | 1 | WHERE frente a HAVING |  |  |  |  |  | pendiente |  |
| 152 | ARC-J-022 | Arquitectura | 1 | DTOs frente a entidades en APIs |  |  |  |  |  | pendiente |  |
| 153 | SB-J-063 | Spring Boot | 1 | @SpringBootTest y cuándo usarlo |  |  |  |  |  | pendiente |  |
| 154 | ANG-J-128 | Angular | 1 | Arquitectura Core/Feature/Shared |  |  |  |  |  | pendiente |  |
| 155 | 06-hr-portal-068 | Proyecto 6 | 1 | Un empleado abre las DevTools, edita la sesión guardada y pone el rol a `admin`.… |  |  |  |  |  | pendiente |  |
| 156 | ANG-J-129 | Angular | 1 | El patrón coordinator |  |  |  |  |  | pendiente |  |
| 157 | SB-J-064 | Spring Boot | 1 | Mockito y @MockBean |  |  |  |  |  | pendiente |  |
| 158 | JS-J-013 | JavaScript | 1 | La palabra clave this |  |  |  |  |  | pendiente |  |
| 159 | JAVA-J-068 | Java | 1 | Qué es una anotación |  |  |  |  |  | pendiente |  |
| 160 | SEC-J-011 | Seguridad | 1 | CORS y los orígenes |  |  |  |  |  | pendiente |  |
| 161 | ANG-J-131 | Angular | 1 | Estado en un servicio frente al componente |  |  |  |  |  | pendiente |  |
| 162 | SB-J-093 | Spring Boot | 1 | Test unitario de un servicio con Mockito |  |  |  |  |  | pendiente |  |
| 163 | SQL-J-045 | SQL | 1 | Contar solo las entradas aprobadas por proyecto |  |  |  |  |  | pendiente |  |
| 164 | GEN-J-013 | General | 1 | Los roles en Scrum |  |  |  |  |  | pendiente |  |
| 165 | 06-hr-portal-072 | Proyecto 6 | 1 | Un admin ha escrito algo en el formulario de departamento y hace clic en un enla… |  |  |  |  |  | pendiente |  |
| 166 | ANG-J-136 | Angular | 1 | Recorrido por el HR portal |  |  |  |  |  | pendiente |  |
| 167 | ARC-J-023 | Arquitectura | 1 | El patrón repository |  |  |  |  |  | pendiente |  |
| 168 | JAVA-J-071 | Java | 1 | Qué es Maven |  |  |  |  |  | pendiente |  |
| 169 | SB-J-069 | Spring Boot | 1 | Containerizar una aplicación Spring Boot |  |  |  |  |  | pendiente |  |
| 170 | GIT-J-013 | Git | 1 | Resolver un conflicto de merge |  |  |  |  |  | pendiente |  |
| 171 | ANG-J-144 | Angular | 1 | JWT en una app Angular + Spring Boot |  |  |  |  |  | pendiente |  |
| 172 | 06-hr-portal-076 | Proyecto 6 | 1 | ¿Por qué añadir el token en un interceptor en vez de añadir la cabecera en la ll… |  |  |  |  |  | pendiente |  |
| 173 | SQL-J-058 | SQL | 1 | Qué es un índice |  |  |  |  |  | pendiente |  |
| 174 | JS-J-017 | JavaScript | 1 | For...of frente a for...in |  |  |  |  |  | pendiente |  |
| 175 | SEC-J-014 | Seguridad | 1 | Inyección SQL y JPA |  |  |  |  |  | pendiente |  |
| 176 | TS-J-024 | TypeScript | 1 | Utilidad de los genéricos |  |  |  |  |  | pendiente |  |
| 177 | ARC-J-027 | Arquitectura | 1 | Flujo de autenticación con JWT |  |  |  |  |  | pendiente |  |
| 178 | 06-hr-portal-079 | Proyecto 6 | 1 | Tu interceptor envía `Authorization: Bearer <the user's email>`. ¿Qué tiene de m… |  |  |  |  |  | pendiente |  |
| 179 | SQL-J-061 | SQL | 1 | Qué es una transacción |  |  |  |  |  | pendiente |  |
| 180 | GIT-J-025 | Git | 1 | Qué es un Pull Request |  |  |  |  |  | pendiente |  |
| 181 | GEN-J-018 | General | 1 | PUT frente a PATCH e idempotencia |  |  |  |  |  | pendiente |  |
| 182 | JS-J-019 | JavaScript | 1 | Map, filter y reduce |  |  |  |  |  | pendiente |  |
| 183 | 06-hr-portal-086 | Proyecto 6 | 1 | Tus solicitudes de ausencia pasan de `pending` a `approved` o `rejected` y nunca… |  |  |  |  |  | pendiente |  |
| 184 | SEC-J-015 | Seguridad | 1 | XSS y protección de Angular |  |  |  |  |  | pendiente |  |
| 185 | ARC-J-028 | Arquitectura | 1 | Autenticación frente a autorización |  |  |  |  |  | pendiente |  |
| 186 | SQL-J-062 | SQL | 1 | Las propiedades ACID |  |  |  |  |  | pendiente |  |
| 187 | 06-hr-portal-088 | Proyecto 6 | 1 | ¿Cómo impide tu diálogo de solicitud de ausencia una fecha de fin anterior a la … |  |  |  |  |  | pendiente |  |
| 188 | GIT-J-030 | Git | 1 | Qué es Conventional Commits y por qué |  |  |  |  |  | pendiente |  |
| 189 | JS-J-029 | JavaScript | 1 | El event loop |  |  |  |  |  | pendiente |  |
| 190 | 06-hr-portal-093 | Proyecto 6 | 1 | El diálogo de empleados comprueba si el email está duplicado en `onNext` y otra … |  |  |  |  |  | pendiente |  |
| 191 | 06-hr-portal-111 | Proyecto 6 | 1 | Tu estado compartido son unos cuantos signals en servicios raíz. ¿Por qué no NgR… |  |  |  |  |  | pendiente |  |
| 192 | GIT-J-035 | Git | 1 | Revert frente a reset |  |  |  |  |  | pendiente |  |
| 193 | JS-J-030 | JavaScript | 1 | Promises frente a async/await |  |  |  |  |  | pendiente |  |
| 194 | 06-hr-portal-131 | Proyecto 6 | 1 | Tu HR portal tiene 27 archivos `.spec.ts`. ¿Qué testean realmente? |  |  |  |  |  | pendiente |  |
| 195 | 05-task-manager-001 | Proyecto 5 | 2 | Task Manager está construido alrededor de un patrón coordinator. ¿De qué se enca… |  |  |  |  |  | pendiente |  |
| 196 | 05-task-manager-002 | Proyecto 5 | 2 | ¿Me cuentas qué pasa, desde el click hasta que la fila se vuelve a renderizar, c… |  |  |  |  |  | pendiente |  |
| 197 | 03-expense-tracker-008 | Proyecto 3 | 2 | Añadir una transacción es una ruta entera y una página entera. ¿Por qué no un mo… |  |  |  |  |  | pendiente |  |
| 198 | 05-task-manager-003 | Proyecto 5 | 2 | ¿Por qué `TaskDialog` devuelve la tarea a través de `dialogRef.close()` en lugar… |  |  |  |  |  | pendiente |  |
| 199 | CSS-J-001 | CSS | 2 | Box-sizing: border-box en el reset |  |  |  |  |  | pendiente |  |
| 200 | 03-expense-tracker-009 | Proyecto 3 | 2 | Navegas de tres formas distintas en dos páginas: `routerLink="/add"`, `routerLin… |  |  |  |  |  | pendiente |  |
| 201 | 05-task-manager-004 | Proyecto 5 | 2 | Usas un único `TaskDialog` tanto para añadir como para editar. ¿Cómo sabe en qué… |  |  |  |  |  | pendiente |  |
| 202 | 03-expense-tracker-012 | Proyecto 3 | 2 | Explícame tu estructura de carpetas. ¿Por qué `summary-card`, `filter-bar` y `tr… |  |  |  |  |  | pendiente |  |
| 203 | CSS-J-005 | CSS | 2 | Custom properties de CSS |  |  |  |  |  | pendiente |  |
| 204 | 03-expense-tracker-015 | Proyecto 3 | 2 | Explícame el reparto smart/dumb del dashboard. ¿Qué componente es smart y qué ha… |  |  |  |  |  | pendiente |  |
| 205 | 05-task-manager-005 | Proyecto 5 | 2 | `ConfirmDialog` se usa para dos cosas distintas en este proyecto. ¿Cómo lo hicis… |  |  |  |  |  | pendiente |  |
| 206 | 04-meal-finder-001 | Proyecto 4 | 2 | Todas las rutas de `app.routes.ts` usan `loadComponent()`, incluida la ruta vací… |  |  |  |  |  | pendiente |  |
| 207 | 01-todo-list-012 | Proyecto 1 | 2 | Tu app tiene tres componentes y un servicio. Explícame quién es dueño de la list… |  |  |  |  |  | pendiente |  |
| 208 | 02-weather-app-007 | Proyecto 2 | 2 | Explícame el reparto de componentes de esta pantalla: ¿cuál es smart y qué hace … |  |  |  |  |  | pendiente |  |
| 209 | 03-expense-tracker-016 | Proyecto 3 | 2 | `TransactionList` renderiza el botón de borrar, así que sabe exactamente qué tra… |  |  |  |  |  | pendiente |  |
| 210 | 04-meal-finder-003 | Proyecto 4 | 2 | La página de detalle lee un id de la URL y llama a `lookup.php`, aunque la card … |  |  |  |  |  | pendiente |  |
| 211 | CSS-J-009 | CSS | 2 | Justify-content frente a align-items |  |  |  |  |  | pendiente |  |
| 212 | 05-task-manager-006 | Proyecto 5 | 2 | Tu tabla es un componente presentacional, pero usa `MatTableDataSource` y un `ef… |  |  |  |  |  | pendiente |  |
| 213 | 01-todo-list-013 | Proyecto 1 | 2 | ¿Por qué pusiste el estado en un servicio en vez de en `TodoPage`, el componente… |  |  |  |  |  | pendiente |  |
| 214 | 03-expense-tracker-019 | Proyecto 3 | 2 | Llamas dumb a `TransactionForm`, y sin embargo construye un `FormGroup` entero c… |  |  |  |  |  | pendiente |  |
| 215 | 04-meal-finder-004 | Proyecto 4 | 2 | Lees el id con `toSignal(this.activatedRoute.paramMap...)` en vez de `this.activ… |  |  |  |  |  | pendiente |  |
| 216 | 02-weather-app-008 | Proyecto 2 | 2 | En el proyecto 01 el estado vive en un servicio `providedIn: 'root'`; aquí vive … |  |  |  |  |  | pendiente |  |
| 217 | 03-expense-tracker-025 | Proyecto 3 | 2 | `totalIncome`, `totalExpense` y `balance` son `computed()` en `DashboardPage`. ¿… |  |  |  |  |  | pendiente |  |
| 218 | 05-task-manager-007 | Proyecto 5 | 2 | PLANNING.md dice que `MatTableDataSource` se encarga del filtrado, pero tú filtr… |  |  |  |  |  | pendiente |  |
| 219 | 01-todo-list-021 | Proyecto 1 | 2 | Todos los componentes aquí son standalone con un array `imports`. ¿Qué reemplazó… |  |  |  |  |  | pendiente |  |
| 220 | CSS-J-010 | CSS | 2 | Elegir flexbox en lugar de grid |  |  |  |  |  | pendiente |  |
| 221 | 04-meal-finder-005 | Proyecto 4 | 2 | `onSearchMeals()` en la página de búsqueda no llama a `MealService` en absoluto … |  |  |  |  |  | pendiente |  |
| 222 | 03-expense-tracker-041 | Proyecto 3 | 2 | La persistencia es un único `effect()` en el constructor de `TransactionService`… |  |  |  |  |  | pendiente |  |
| 223 | 05-task-manager-040 | Proyecto 5 | 2 | Tus botones Delete son rojos, pero nunca sobrescribes el CSS de Material. ¿Cómo … |  |  |  |  |  | pendiente |  |
| 224 | 02-weather-app-012 | Proyecto 2 | 2 | `forkJoin` se llama en `WeatherPage`, no dentro de `WeatherService`. ¿Por qué la… |  |  |  |  |  | pendiente |  |
| 225 | 04-meal-finder-008 | Proyecto 4 | 2 | Tus effects reciben `onCleanup` y hacen unsubscribe ahí dentro. ¿Qué se rompe en… |  |  |  |  |  | pendiente |  |
| 226 | 01-todo-list-024 | Proyecto 1 | 2 | ¿Cómo sabe `TaskList` que debe volver a renderizarse cuando `TaskForm` añade una… |  |  |  |  |  | pendiente |  |
| 227 | 03-expense-tracker-042 | Proyecto 3 | 2 | `rxjs` está en `package.json`, pero no hay ni un solo `Observable`, `subscribe` … |  |  |  |  |  | pendiente |  |
| 228 | CSS-J-016 | CSS | 2 | Repeat con auto-fill y minmax |  |  |  |  |  | pendiente |  |
| 229 | 05-task-manager-106 | Proyecto 5 | 2 | Si mañana las tareas tuvieran que venir de una API REST, ¿qué archivos de Task M… |  |  |  |  |  | pendiente |  |
| 230 | 03-expense-tracker-043 | Proyecto 3 | 2 | No hay `zone.js` en `package.json`, ni entrada `polyfills` en `angular.json`, ni… |  |  |  |  |  | pendiente |  |
| 231 | 04-meal-finder-010 | Proyecto 4 | 2 | `FavouriteService` mantiene `_favourites` privado y expone `favourites = this._f… |  |  |  |  |  | pendiente |  |
| 232 | 01-todo-list-025 | Proyecto 1 | 2 | ¿Por qué signals aquí en vez de un `BehaviorSubject` de RxJS y el pipe `async`? |  |  |  |  |  | pendiente |  |
| 233 | 02-weather-app-013 | Proyecto 2 | 2 | Te suscribes a mano y empujas los datos a signals. ¿Por qué no el pipe `async`, … |  |  |  |  |  | pendiente |  |
| 234 | 03-expense-tracker-049 | Proyecto 3 | 2 | Tu formulario tiene cuatro controles, cuatro `Validators.required` y exactamente… |  |  |  |  |  | pendiente |  |
| 235 | 04-meal-finder-020 | Proyecto 4 | 2 | `MealCard` y `CategoryFilter` no inyectan nada en absoluto. ¿Qué te compra esa s… |  |  |  |  |  | pendiente |  |
| 236 | 05-task-manager-042 | Proyecto 5 | 2 | ¿Qué campos exige tu formulario de tarea, y por qué Description es el único opci… |  |  |  |  |  | pendiente |  |
| 237 | CSS-J-023 | CSS | 2 | Posicionamiento relative frente a absolute |  |  |  |  |  | pendiente |  |
| 238 | 01-todo-list-026 | Proyecto 1 | 2 | `pendingCount`, `totalCount` y `filteredTasks` son `computed()` en vez de método… |  |  |  |  |  | pendiente |  |
| 239 | 03-expense-tracker-052 | Proyecto 3 | 2 | ¿Por qué `Validators.min(0.01)` en el importe, y no `Validators.min(0)`? |  |  |  |  |  | pendiente |  |
| 240 | 04-meal-finder-039 | Proyecto 4 | 2 | `searchMeals` construye `new HttpParams().set('s', name)` en vez de interpolar e… |  |  |  |  |  | pendiente |  |
| 241 | 02-weather-app-016 | Proyecto 2 | 2 | `dailyForecast` es un `computed()` en la página que filtra la lista cruda para q… |  |  |  |  |  | pendiente |  |
| 242 | 05-task-manager-043 | Proyecto 5 | 2 | ¿Por qué escribiste un `SubmitOnlyErrorStateMatcher` en lugar de usar el comport… |  |  |  |  |  | pendiente |  |
| 243 | 03-expense-tracker-057 | Proyecto 3 | 2 | Tu `today()` construye la cadena a mano con `getFullYear()`, `getMonth() + 1` y … |  |  |  |  |  | pendiente |  |
| 244 | 01-todo-list-028 | Proyecto 1 | 2 | Los métodos de tu servicio nunca usan push ni splice. ¿Qué se rompería si `addTa… |  |  |  |  |  | pendiente |  |
| 245 | CSS-J-029 | CSS | 2 | El enfoque mobile-first |  |  |  |  |  | pendiente |  |
| 246 | 04-meal-finder-046 | Proyecto 4 | 2 | Una búsqueda vacía está prohibida dos veces — `[disabled]="!searchTerm().trim()"… |  |  |  |  |  | pendiente |  |
| 247 | 03-expense-tracker-060 | Proyecto 3 | 2 | La primera línea de `onSubmit()` es `this.transactionForm.markAllAsTouched()`, a… |  |  |  |  |  | pendiente |  |
| 248 | 05-task-manager-080 | Proyecto 5 | 2 | ¿Por qué construiste esto con Angular Material en lugar de con componentes propi… |  |  |  |  |  | pendiente |  |
| 249 | 02-weather-app-074 | Proyecto 2 | 2 | El estado de la pantalla son cuatro signals independientes — `weatherResponse`, … |  |  |  |  |  | pendiente |  |
| 250 | 04-meal-finder-054 | Proyecto 4 | 2 | Abre `/detail/abc`. Nada valida ese id, y el comodín ` |  |  |  |  |  | pendiente |  |
| 251 | 01-todo-list-036 | Proyecto 1 | 2 | `TaskList` hace `tasks = this.taskService.tasks`. ¿Qué riesgo tiene esa línea? |  |  |  |  |  | pendiente |  |
| 252 | 03-expense-tracker-063 | Proyecto 3 | 2 | Tu botón de enviar no se deshabilita nunca — no hay `[disabled]="transactionForm… |  |  |  |  |  | pendiente |  |
| 253 | CSS-J-036 | CSS | 2 | Rem frente a px |  |  |  |  |  | pendiente |  |
| 254 | 04-meal-finder-057 | Proyecto 4 | 2 | `addFavourite` es `[...meals, meal]` sin ninguna comprobación de duplicados. ¿Qu… |  |  |  |  |  | pendiente |  |
| 255 | 05-task-manager-081 | Proyecto 5 | 2 | ¿Por qué tu store de tareas es un `signal<Task[]>` en un servicio y no un `Behav… |  |  |  |  |  | pendiente |  |
| 256 | 03-expense-tracker-068 | Proyecto 3 | 2 | Todos los importes en almacenamiento son números positivos y el signo viene del … |  |  |  |  |  | pendiente |  |
| 257 | 02-weather-app-030 | Proyecto 2 | 2 | `forkJoin` significa que la pantalla no muestra nada salvo que *ambas* peticione… |  |  |  |  |  | pendiente |  |
| 258 | 01-todo-list-038 | Proyecto 1 | 2 | ¿Por qué `input.required<Task>()` y `output<number>()` en vez de los decoradores… |  |  |  |  |  | pendiente |  |
| 259 | 03-expense-tracker-070 | Proyecto 3 | 2 | `TransactionService.addTransaction` recibe un `NewTransaction` y lo guarda sin n… |  |  |  |  |  | pendiente |  |
| 260 | 04-meal-finder-058 | Proyecto 4 | 2 | Un favorito guarda el objeto `Meal` entero en localStorage, no su id. ¿Qué queda… |  |  |  |  |  | pendiente |  |
| 261 | 05-task-manager-086 | Proyecto 5 | 2 | ¿Qué comprueban realmente los tests de Task Manager, y por qué pusiste las aserc… |  |  |  |  |  | pendiente |  |
| 262 | CSS-J-048 | CSS | 2 | Qué regla gana sobre el mismo elemento |  |  |  |  |  | pendiente |  |
| 263 | 03-expense-tracker-073 | Proyecto 3 | 2 | Borrar una transacción es un clic — sin confirmación, sin deshacer — y el `effec… |  |  |  |  |  | pendiente |  |
| 264 | 01-todo-list-061 | Proyecto 1 | 2 | ¿Dónde vive realmente la regla de "una tarea debe tener un título no vacío", y e… |  |  |  |  |  | pendiente |  |
| 265 | 04-meal-finder-063 | Proyecto 4 | 2 | El término de búsqueda vive en la URL; el filtro de categoría de favoritos vive … |  |  |  |  |  | pendiente |  |
| 266 | 02-weather-app-031 | Proyecto 2 | 2 | Tu callback `error` ignora por completo el objeto de error y siempre pone `'City… |  |  |  |  |  | pendiente |  |
| 267 | 05-task-manager-087 | Proyecto 5 | 2 | Tus specs de `TaskTable` y `TaskPage` no necesitan providers, pero los dos specs… |  |  |  |  |  | pendiente |  |
| 268 | 03-expense-tracker-075 | Proyecto 3 | 2 | `loadTransactions` comprueba `Array.isArray(parsed)` y luego devuelve `parsed` c… |  |  |  |  |  | pendiente |  |
| 269 | 04-meal-finder-077 | Proyecto 4 | 2 | Esta app guarda cada pieza de estado en `signal()`s repartidos entre tres servic… |  |  |  |  |  | pendiente |  |
| 270 | CSS-J-061 | CSS | 2 | Inline, block e inline-block |  |  |  |  |  | pendiente |  |
| 271 | 01-todo-list-067 | Proyecto 1 | 2 | El contador dice "3 pendientes de 5 en total" mientras el filtro Active está act… |  |  |  |  |  | pendiente |  |
| 272 | 03-expense-tracker-076 | Proyecto 3 | 2 | Cuando `JSON.parse` lanza, haces `console.error` y devuelves `[]` — y entonces e… |  |  |  |  |  | pendiente |  |
| 273 | 02-weather-app-047 | Proyecto 2 | 2 | La key acaba en `environment.apiKey`, importada por `WeatherService`, compilada … |  |  |  |  |  | pendiente |  |
| 274 | 04-meal-finder-078 | Proyecto 4 | 2 | `SearchPage` guarda `meals`, `hasSearched`, `isLoading` y `hasError` como cuatro… |  |  |  |  |  | pendiente |  |
| 275 | 03-expense-tracker-096 | Proyecto 3 | 2 | Cuatro campos, un envío. ¿Por qué reactive forms y no template-driven con `[(ngM… |  |  |  |  |  | pendiente |  |
| 276 | 01-todo-list-069 | Proyecto 1 | 2 | Selecciona el filtro Active con dos tareas completadas y la pantalla dice "No ha… |  |  |  |  |  | pendiente |  |
| 277 | CSS-J-062 | CSS | 2 | Centrar vertical y horizontalmente |  |  |  |  |  | pendiente |  |
| 278 | 04-meal-finder-082 | Proyecto 4 | 2 | `index.html` lleva `<base href="/">` y `provideRouter(routes)` no toma `withHash… |  |  |  |  |  | pendiente |  |
| 279 | 03-expense-tracker-098 | Proyecto 3 | 2 | Cada transacción vive en `localStorage` bajo una única clave, y no hay servidor … |  |  |  |  |  | pendiente |  |
| 280 | 02-weather-app-055 | Proyecto 2 | 2 | `this.http.get<WeatherResponse>(...)` — ¿qué garantiza en realidad ese genérico … |  |  |  |  |  | pendiente |  |
| 281 | 01-todo-list-101 | Proyecto 1 | 2 | Tu `package.json` no tiene dependencia de `zone.js`. ¿Qué le dice eso a un entre… |  |  |  |  |  | pendiente |  |
| 282 | 04-meal-finder-086 | Proyecto 4 | 2 | `package.json` no tiene `zone.js` y `angular.json` no declara polyfills, así que… |  |  |  |  |  | pendiente |  |
| 283 | 03-expense-tracker-099 | Proyecto 3 | 2 | `addTransaction` construye `[...transactions, transaction]` y `deleteTransaction… |  |  |  |  |  | pendiente |  |
| 284 | CSS-J-071 | CSS | 2 | Encapsulación de estilos de componentes Angular |  |  |  |  |  | pendiente |  |
| 285 | 03-expense-tracker-101 | Proyecto 3 | 2 | `index.html` lleva `<base href="/">` y `provideRouter(routes)` toma la estrategi… |  |  |  |  |  | pendiente |  |
| 286 | 01-todo-list-105 | Proyecto 1 | 2 | Elegiste CSS plano con custom properties en vez de Sass, Tailwind o Angular Mate… |  |  |  |  |  | pendiente |  |
| 287 | 04-meal-finder-100 | Proyecto 4 | 2 | La sección de Testing de PLANNING.md dice que los tests con autoría empiezan en … |  |  |  |  |  | pendiente |  |
| 288 | 02-weather-app-058 | Proyecto 2 | 2 | `WeatherResponse` tiene tres campos. El payload real de OpenWeatherMap tiene alr… |  |  |  |  |  | pendiente |  |
| 289 | 04-meal-finder-101 | Proyecto 4 | 2 | Cinco de esos ocho specs no afirman nada más que `expect(component).toBeTruthy()… |  |  |  |  |  | pendiente |  |
| 290 | 01-todo-list-118 | Proyecto 1 | 2 | Persistir la lista en `localStorage` son unas quince líneas. ¿Por qué elegiste n… |  |  |  |  |  | pendiente |  |
| 291 | 02-weather-app-061 | Proyecto 2 | 2 | Tus interfaces llevan `feels_like` y `dt_txt` — el snake_case de la API — direct… |  |  |  |  |  | pendiente |  |
| 292 | 04-meal-finder-102 | Proyecto 4 | 2 | En 2026 la mayoría de las grandes consultoras tratan "sin tests" como un filtro … |  |  |  |  |  | pendiente |  |
| 293 | 01-todo-list-081 | Proyecto 1 | 2 | Ni un solo componente de esta app fija `ChangeDetectionStrategy.OnPush`. Sin `zo… |  |  |  |  |  | pendiente |  |
| 294 | 04-meal-finder-103 | Proyecto 4 | 2 | Tres specs llevan una aserción escrita a mano — el label de favorito en `meal-ca… |  |  |  |  |  | pendiente |  |
| 295 | 02-weather-app-063 | Proyecto 2 | 2 | Todos los componentes de esta aplicación están dirigidos por signals y ninguno p… |  |  |  |  |  | pendiente |  |
| 296 | 01-todo-list-082 | Proyecto 1 | 2 | Las consultoras a las que apuntas usan NgRx en sus proyectos Angular. ¿Por qué n… |  |  |  |  |  | pendiente |  |
| 297 | 04-meal-finder-113 | Proyecto 4 | 2 | La lógica interesante de esta app vive en los servicios — un `computed()` que ha… |  |  |  |  |  | pendiente |  |
