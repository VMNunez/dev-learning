# Spring Boot — Herramientas: Docker y Flyway

Docs: [Baeldung — Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application) · [Baeldung — Database Migrations with Flyway](https://www.baeldung.com/database-migrations-with-flyway)

[09-testing.md](./09-testing.md) terminaba señalando lo único que todo test en verde seguía teniendo en común: se ejecutaba **en tu máquina, contra tu PostgreSQL, con tu `DB_PASSWORD` en la configuración de ejecución de IntelliJ**. Verde ahí significa "funciona donde yo lo construí" — que es exactamente la afirmación que "funciona en mi máquina" siempre ha hecho. Este archivo es donde esa afirmación deja de ser suficiente. Dos herramientas eliminan el "aquí" de la frase: **Docker** empaqueta la app junto con su runtime de Java 25 para que la misma imagen se ejecute en el portátil de un revisor y en un servidor, y **Flyway** hace lo mismo con el esquema, sustituyendo `ddl-auto=update` por scripts SQL versionados que se pueden revisar en git.

Son herramientas de despliegue, no código de aplicación, pero las consultoras españolas preguntan sobre ellas en cualquier entrevista orientada a producción: "¿cómo contenedorizas tu app?" y "¿cómo gestionas los cambios en la base de datos?".

> **Todo lo de este archivo es una configuración *propuesta* para TimeTrack — nada de esto está aún en el repo.** Verificado hoy: el backend **no tiene `Dockerfile`, ni `docker-compose.yml`, ni la dependencia de Flyway en `pom.xml`**. Así que lee cada línea `Archivo:` y cada bloque de código de abajo como *el estado objetivo* — lo que añadirás cuando contenedorices el proyecto — no como código que puedas abrir ahora mismo. Cada bloque está etiquetado en consecuencia. (`11-logica-de-negocio-modelado-dominio.md` usa la misma convención de honestidad para código que enseña antes de que exista.)

---

## Por qué contenedorizar

Propósito: entender el problema que resuelve Docker antes de tocar un Dockerfile — por qué "empaquetar el runtime con la app" merece el esfuerzo adicional de esta herramienta.
Archivo: ningún archivo del proyecto — este es el concepto detrás de los dos archivos propuestos de abajo.
Docs: [Baeldung — Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application) → leer: la introducción y "Dockerizing" — por qué una imagen empaqueta la app junto con su runtime.

"Funciona en mi máquina" es el problema que Docker resuelve. Un contenedor empaqueta tu app **y** su runtime (la versión exacta de Java, las librerías del SO) en una única imagen que se ejecuta de forma idéntica en tu portátil, en la máquina de un compañero y en el servidor de producción. Nada de "instala primero Java 25, luego establece estas variables" — la imagen ya lo tiene todo.

> **Analogía — enviar una comida, no una receta.** Darle a alguien tu `.jar` es darle una receta: solo funciona si su cocina ya tiene el horno correcto (Java 25), los ingredientes correctos (librerías del SO), montados de la forma correcta. Un contenedor envía la comida ya hecha *dentro de su propia cocina* — el horno, los ingredientes y la app, sellados en una sola caja. No reproducen tu configuración; ejecutan tu configuración. Por eso "funciona en mi máquina" se disuelve: tu máquina viaja con el código.

Para una app Spring Boot hay dos piezas: el **Dockerfile** (cómo construir la imagen de tu app) y **docker-compose** (cómo ejecutar tu app junto con PostgreSQL en un solo comando). Flyway se encarga entonces de la tercera pieza móvil — el esquema de la base de datos — para que también sea reproducible en lugar de construido a mano.

---

## Dockerfile — construir una imagen de la app

Propósito: convertir el `.jar` construido en una imagen autocontenida que lleva su propio runtime de Java 25, de modo que `docker run` arranque la app en cualquier sitio sin instalación local de Java.
Archivo: `projects/07-timetrack/backend/timetrack/Dockerfile` — **propuesto: este archivo aún no existe en TimeTrack.**
Docs: [Baeldung — Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application) → leer: "Dockerfile" y "Understanding the EXPOSE Instruction".

Un `Dockerfile` en la raíz del proyecto describe, paso a paso, cómo convertir tu `.jar` construido en una imagen ejecutable. Lee cada línea como una instrucción que Docker ejecuta de arriba abajo para montar la imagen:

```dockerfile
# proposed Dockerfile for TimeTrack — not in the repo yet
FROM eclipse-temurin:25-jre        # base image: slim Linux + Java 25 runtime only
WORKDIR /app                       # working directory inside the container
COPY target/timetrack-0.0.1-SNAPSHOT.jar app.jar   # copy the built jar in
EXPOSE 8080                        # DOCUMENTS the port — does not open it (see below)
ENTRYPOINT ["java", "-jar", "app.jar"]   # command run when the container starts
```

- `FROM eclipse-temurin:25-jre` — el punto de partida. TimeTrack es Spring Boot 4.0.6 sobre **Java 25**, así que la imagen base debe llevar un runtime de Java 25 — un tag más antiguo como `:17-jre` fallaría al ejecutar el jar. `eclipse-temurin` es la distribución OpenJDK gratuita estándar; `-jre` (solo runtime, sin compilador) mantiene la imagen más pequeña que `-jdk`.
- `COPY target/timetrack-0.0.1-SNAPSHOT.jar app.jar` — Maven produce el jar en `target/` (el nombre viene de `<artifactId>` + `<version>` en `pom.xml`); lo copias y lo renombras a `app.jar`. **Ejecuta `mvn clean package` primero** — el jar debe existir en disco antes de construir la imagen, porque `COPY` lee de tu máquina, no de Maven.
- `ENTRYPOINT ["java", "-jar", "app.jar"]` — el mismo comando que ejecutas localmente, ahora integrado en la imagen.

### `EXPOSE` documenta el puerto — no lo publica

Esta es la sorpresa número uno de Docker para principiantes: **`EXPOSE 8080` no abre nada.** Es metadato — una nota en la imagen que dice "esta app escucha en el 8080" — para que una persona o una herramienta que lea la imagen sepa qué puerto importa. El puerto solo se publica de verdad hacia tu host cuando pasas `-p` (o `ports:` en Compose) en el momento de *ejecutar*. Quien escribe un Dockerfile no puede abrir un puerto del host, porque no tiene ni idea de en qué red acabará ejecutándose el contenedor; solo quien lo ejecuta lo sabe.

```bash
# MAL — EXPOSE is in the Dockerfile, but nothing maps it to the host
docker run timetrack
#   the app is up INSIDE the container on 8080, but http://localhost:8080 on your
#   machine is dead — nothing was published. Feels broken; it is doing exactly what you asked.

# BIEN — -p actually publishes host:container
docker run -p 8080:8080 timetrack
#   now localhost:8080 → container's 8080. -p is what opens the door; EXPOSE only labelled it.
```

> **`EXPOSE` es un cartel en la puerta, `-p` es abrirla.** Puedes atornillar un cartel de "Habitación 8080" en una puerta todo el día (`EXPOSE`) y nadie podrá pasar hasta que alguien la abra (`-p 8080:8080`). Que `EXPOSE` no esté no impide que `-p` funcione — es pura documentación. A los entrevistadores les encanta esta pregunta precisamente porque mucha gente cree que `EXPOSE` abre el puerto.

Construir y ejecutar:

```bash
mvn clean package             # produce target/timetrack-0.0.1-SNAPSHOT.jar
docker build -t timetrack .   # build the image, tag it "timetrack"
docker run -p 8080:8080 timetrack   # map host port 8080 → container port 8080
```

> **El error que verás de verdad si el 8080 está ocupado.** Ejecuta la app localmente en IntelliJ *y* `docker run -p 8080:8080` a la vez, y Docker se niega a arrancar:
> ```
> docker: Error response from daemon: driver failed programming external connectivity on
> endpoint timetrack: Bind for 0.0.0.0:8080 failed: port is already allocated.
> ```
> Dos procesos no pueden ser dueños del mismo puerto del host. La solución es liberar el 8080 (parar la ejecución local) o publicar en otro puerto del host: `-p 8081:8080` — el número de la izquierda es el host, el de la derecha el contenedor, y solo el de la izquierda tiene que estar libre.

> **Builds multi-stage (merece la pena reconocerlos).** Los Dockerfiles reales suelen tener dos etapas `FROM` — una con el JDK completo + Maven que *construye* el jar dentro de la imagen, y luego una segunda etapa `-jre` que solo copia el jar. Así no necesitas Maven en la máquina de build y la imagen final se mantiene pequeña. A nivel junior, conocer la versión simple de una sola etapa de arriba es suficiente; reconoce el multi-stage cuando lo veas.

---

## docker-compose — app y base de datos juntas

Propósito: arrancar la app y su PostgreSQL juntas con un solo comando, en una red compartida donde la app encuentra la base de datos por su nombre — sin instalación manual de BD para quien clone el repo.
Archivo: `projects/07-timetrack/backend/timetrack/docker-compose.yml` — **propuesto: TimeTrack aún no tiene archivo de Compose.**
Docs: [Baeldung — Running Spring Boot with PostgreSQL in Docker Compose](https://www.baeldung.com/spring-boot-postgresql-docker) → leer: "Docker Compose" y la sección de networking entre servicios.

Tu app necesita PostgreSQL. Sin Compose, un compañero tiene que instalar PostgreSQL, crear la base de datos y establecer la contraseña antes de poder ejecutar nada. `docker-compose.yml` describe ambos servicios para que todo el stack arranque con **un solo comando** — y nadie instala PostgreSQL a mano.

```yaml
# proposed docker-compose.yml for TimeTrack — not in the repo yet
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: timetrack
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data   # keep data when the container restarts

  app:
    build: .                              # build from the Dockerfile in this folder
    ports:
      - "8080:8080"
    environment:
      DB_PASSWORD: ${DB_PASSWORD}
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/timetrack
    depends_on:
      - db                                # start the database container before the app

volumes:
  pgdata:
```

```bash
docker compose up        # builds and starts both services
docker compose down      # stops and removes them
```

### Por qué `db` funciona como hostname — el DNS embebido

La app llega a la base de datos por el host `db` (el nombre del servicio), **no** por `localhost` — por eso `SPRING_DATASOURCE_URL` es `jdbc:postgresql://db:5432/...`. Pero ¿*por qué* la palabra `db` resuelve a algo? Porque Compose hace algo concreto al ejecutar `up`: crea una **red bridge definida por el usuario** y coloca en ella a todos los servicios del archivo. Esa red viene con un **resolver DNS embebido**, y el resolver guarda una entrada por servicio — mapeando el *nombre* de cada servicio a la IP actual de ese contenedor. Así que cuando el driver JDBC de Spring le pide al sistema operativo que resuelva `db`, la búsqueda llega al DNS de Compose, que responde con la IP del contenedor `db`. El nombre es el asa estable; la IP que hay detrás puede cambiar en cada reinicio y a ti nunca te importa.

```
┌──────────── Compose network: timetrack_default (user-defined bridge) ────────────┐
│                                                                                   │
│   ┌───────────────┐        DNS: "db" → 172.20.0.2         ┌────────────────┐      │
│   │ app           │ ──────────────────────────────────►   │ db (postgres)  │      │
│   │ 172.20.0.3    │  jdbc:postgresql://db:5432/timetrack   │ 172.20.0.2     │      │
│   └───────────────┘                                        └────────────────┘      │
│        embedded DNS resolver maps each service NAME → its container IP             │
└──────────┬────────────────────────────────────────────────────────────────────────┘
           │ published to the host: ports "8080:8080"
       your laptop ──► http://localhost:8080
```

> **¿Por qué no `localhost`?** Dentro del contenedor `app`, `localhost` significa *el propio contenedor `app`* — su propio loopback. Postgres no está ahí; está en otro contenedor. `localhost:5432` desde `app` no encontraría nada y daría "connection refused". Cada contenedor tiene su propia identidad de red, así que te diriges al otro por su nombre de servicio, que el DNS de Compose conoce.

### `depends_on` espera al contenedor, no a Postgres

`depends_on` controla el **orden de arranque**, no la **disponibilidad**. Garantiza que el *contenedor* `db` arranca antes que `app` — pero "contenedor arrancado" no es "Postgres acepta conexiones". Postgres todavía necesita uno o dos segundos para inicializarse dentro de ese contenedor, y durante ese hueco la app ya puede estar intentando conectarse.

```yaml
# MAL — assumes depends_on means "db is ready"
app:
  depends_on:
    - db
# app may fire its first JDBC connection while Postgres is still booting → "connection refused"

# BIEN — wait for an actual health signal, not just "container up"
db:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 5s
    retries: 5
app:
  depends_on:
    db:
      condition: service_healthy   # start app only once the healthcheck passes
```

> **"Contenedor arrancado" no es "servicio listo" — la carrera clásica.** Spring Boot reintenta la conexión al datasource varias veces al arrancar, así que la versión simple con `depends_on` a menudo sobrevive por suerte. Pero confiar en la suerte es lo que hace que un stack "funcione en mi portátil rápido, falle en CI". La condición `service_healthy` elimina la carrera: la app no arranca hasta que `pg_isready` informa de que Postgres ya acepta conexiones de verdad.

- `ports: "5432:5432"` en `db` también publica Postgres hacia tu host, así que puedes seguir conectándote desde pgAdmin mientras se ejecuta en Compose. La propia app **no** usa este mapeo — habla con `db:5432` a través de la red interna, no a través del host.
- `volumes` persiste los datos: sin `pgdata`, cada `docker compose down` borraría la base de datos, porque el propio sistema de archivos de un contenedor se descarta cuando el contenedor se elimina. El volumen con nombre vive fuera del contenedor y sobrevive.

---

## Flyway — migraciones de base de datos versionadas

Propósito: sustituir el auto-DDL de Hibernate por scripts SQL numerados, commiteados en git, para que cada cambio de esquema se revise, quede ordenado y se aplique de forma idéntica en cada entorno.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/resources/db/migration/` — **propuesto: TimeTrack no tiene aún la dependencia de Flyway ni la carpeta `db/migration`.**
Docs: [Baeldung — Database Migrations with Flyway](https://www.baeldung.com/database-migrations-with-flyway) → leer: "How Does Flyway Work?" y "Naming Convention".

`spring.jpa.hibernate.ddl-auto=update` (de [01-basicos.md](./01-basicos.md)) está bien mientras aprendes, pero nunca lo usas en producción. Deja que Hibernate altere el esquema automáticamente comparando las entidades con la base de datos — y ese es exactamente el peligro: puede cambiar en silencio una tabla de producción, y no es revisable. No queda registro de *qué* cambió ni *cuándo*.

> **Analogía — un manuscrito sin historial de versiones frente a commits rastreados.** `ddl-auto=update` es como editar un documento compartido sin historial: el esquema simplemente *se convierte* en lo que las entidades implican, y nadie puede ver el diff ni vetarlo. Flyway es git para el esquema — cada cambio es un archivo separado, con nombre y ordenado, que puedes leer en un pull request antes de que toque nunca una base de datos real.

Flyway lo reemplaza con **scripts SQL versionados**. Cada cambio de esquema es un archivo numerado en `src/main/resources/db/migration`:

```
db/migration/
├── V1__create_users_table.sql
├── V2__create_projects_table.sql
└── V3__add_status_to_time_entries.sql
```

```sql
-- V1__create_users_table.sql
CREATE TABLE users (
    id       BIGSERIAL PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

- El nombrado es estricto: `V<versión>__<descripción>.sql` — una `V` mayúscula, la versión, y luego **dos** guiones bajos antes de la descripción. Si te equivocas en el separador (un solo guion bajo), Flyway no reconoce el archivo como migración.
- Al arrancar, Flyway comprueba su propia tabla `flyway_schema_history` para ver qué scripts ya se han ejecutado, y aplica solo los nuevos, **en orden de versión**. Ejecutar la app dos veces no vuelve a ejecutar `V1` — la tabla de historial ya lo lista como aplicado.
- Desactivas el auto-DDL de Hibernate (`spring.jpa.hibernate.ddl-auto=validate`) para que Hibernate solo *compruebe* que las entidades coinciden con el esquema que Flyway construyó, sin cambiarlo nunca.

### La trampa del checksum-mismatch — nunca edites una migración ya aplicada

Cuando Flyway aplica `V1`, guarda un **checksum** del contenido de ese archivo en `flyway_schema_history`. En el siguiente arranque vuelve a calcular el hash del archivo en disco y lo compara. Si *editaste una migración ya aplicada* — aunque sea corrigiendo una errata — los dos ya no coinciden y Flyway se niega a arrancar:

```
Migration checksum mismatch for migration version 1
-> Applied to database : 1234567890
-> Resolved locally    : -987654321
```

La regla que esto impone: **una migración aplicada es inmutable.** Una vez que `V1` se ha ejecutado en cualquier sitio, nunca la vuelves a tocar — arreglas o extiendes el esquema con un archivo *nuevo* (`V4__...`). Este es todo el sentido del versionado: el historial de lo que se ejecutó tiene que seguir siendo fiel a la realidad. (Editar solo es aceptable en una migración que no se ha ejecutado en ningún entorno compartido, es decir, que sigue siendo solo local.)

> **Por qué los equipos lo usan (la respuesta de entrevista).** Los scripts están commiteados en git, así que cada cambio de esquema se revisa en un pull request, se rastrea en el historial y se aplica de forma idéntica en cada entorno. `ddl-auto=update` no da nada de eso y puede corromper producción. "¿Cuál es tu estrategia de migración?" → scripts versionados con Flyway, `ddl-auto=validate` para que Hibernate solo compruebe, nunca `ddl-auto=update` en producción.

---

## Dónde te deja esto — y qué viene después

La app y su runtime de Java 25 ahora viajan como una sola imagen, la base de datos arranca a su lado en una red con nombre con un solo comando, y el esquema es una cadena revisable de scripts versionados en lugar de lo que a Hibernate le pareciera oportuno. "Funciona en mi máquina" por fin es una afirmación que puedes *transferir*: la máquina viaja con el código.

Lo que nada de esto ha decidido es **dónde viven las reglas de negocio** — la lógica que dice que un `TimeEntry` puede pasar de `DRAFT` a `SUBMITTED` pero nunca de `DRAFT` a `APPROVED`. Docker y Flyway hacen que tu app se ejecute *en cualquier sitio*; no dicen nada sobre si el código de dentro está bien diseñado. Esa es la pregunta que aborda [11-logica-de-negocio-modelado-dominio.md](./11-logica-de-negocio-modelado-dominio.md): dado un flujo de trabajo real, dónde va cada regla — en la entidad o en el servicio — y cómo evitas que alguien la salte. (Para lo que viene *después* de lo básico de aquí — Kubernetes, pipelines de CI/CD, despliegues en la nube — ver [future-learning.md](../future-learning.md); son temas para después del primer trabajo.)
