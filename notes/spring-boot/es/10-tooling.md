# Spring Boot — Herramientas: Docker y Flyway

> 📖 [Spring Boot — Container Images](https://docs.spring.io/spring-boot/reference/packaging/container-images/index.html) · [Flyway](https://documentation.red-gate.com/flyway)

Estas son herramientas de despliegue, no código de aplicación, pero las consultoras españolas preguntan sobre ellas en cualquier entrevista orientada a producción: "¿cómo contenedorizas tu app?" y "¿cómo gestionas los cambios en la base de datos?". TimeTrack (proyecto 07) está construido para ejecutarse con Docker, así que esta es la referencia para eso.

---

## Por qué contenedorizar

"Funciona en mi máquina" es el problema que Docker resuelve. Un contenedor empaqueta tu app **y** su runtime (la versión exacta de Java, las librerías del SO) en una imagen que se ejecuta de forma idéntica en tu portátil, en la máquina de un compañero y en el servidor de producción. Sin "instala primero Java 25, luego establece estas variables" — la imagen ya lo tiene todo.

Para una app Spring Boot hay dos piezas: el **Dockerfile** (cómo construir la imagen de tu app) y **docker-compose** (cómo ejecutar tu app junto con PostgreSQL en un solo comando).

---

## Dockerfile — construir una imagen de la app

Docs: https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html → leer: "Dockerfiles"

Un `Dockerfile` en la raíz del proyecto describe, paso a paso, cómo convertir tu `.jar` construido en una imagen ejecutable.

```dockerfile
FROM eclipse-temurin:25-jre        # imagen base: un Linux slim con solo el runtime de Java 25
WORKDIR /app                       # directorio de trabajo dentro del contenedor
COPY target/timetrack-0.0.1-SNAPSHOT.jar app.jar   # copiar el jar construido
EXPOSE 8080                        # documentar el puerto en que escucha la app
ENTRYPOINT ["java", "-jar", "app.jar"]   # el comando que se ejecuta cuando arranca el contenedor
```

- `FROM eclipse-temurin:25-jre` — el punto de partida. `eclipse-temurin` es la distribución OpenJDK gratuita estándar; `-jre` (solo runtime, sin compilador) mantiene la imagen más pequeña que `-jdk`.
- `COPY target/*.jar app.jar` — Maven produce el jar en `target/`; lo copias y renombras a `app.jar`. **Ejecuta `mvn clean package` primero** — el jar debe existir antes de construir la imagen.
- `ENTRYPOINT ["java", "-jar", "app.jar"]` — el mismo comando que ejecutas localmente, ahora integrado en la imagen.

Construir y ejecutar:

```bash
mvn clean package          # producir target/*.jar
docker build -t timetrack .   # construir la imagen, etiquetarla "timetrack"
docker run -p 8080:8080 timetrack   # mapear puerto del host 8080 → puerto del contenedor 8080
```

> **Multi-stage builds (vale la pena reconocerlos):** los Dockerfiles reales suelen tener dos etapas `FROM` — una con el JDK completo + Maven que *construye* el jar dentro de la imagen, luego una segunda etapa `-jre` que solo copia el jar. Así no necesitas Maven en la máquina de build y la imagen final es pequeña. A nivel junior, conocer la versión simple de un solo stage de arriba es suficiente; reconoce el multi-stage cuando lo veas.

---

## docker-compose — app + base de datos juntas

Docs: https://docs.docker.com/compose/ → leer: "How Compose works"

Tu app necesita PostgreSQL. Sin Compose, un compañero tiene que instalar PostgreSQL, crear la base de datos y establecer la contraseña antes de poder ejecutar nada. `docker-compose.yml` describe ambos servicios para que todo el stack arranque con **un solo comando** — y nadie instala PostgreSQL a mano.

```yaml
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
      - pgdata:/var/lib/postgresql/data   # conservar los datos cuando el contenedor se reinicia

  app:
    build: .                              # construir desde el Dockerfile en esta carpeta
    ports:
      - "8080:8080"
    environment:
      DB_PASSWORD: ${DB_PASSWORD}
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/timetrack
    depends_on:
      - db                                # arrancar la base de datos antes que la app

volumes:
  pgdata:
```

```bash
docker compose up        # construye y arranca ambos servicios
docker compose down      # los para y elimina
```

- La app llega a la base de datos en el host `db` (el nombre del servicio), **no** en `localhost` — dentro de la red de Compose cada servicio es accesible por su nombre. Por eso `SPRING_DATASOURCE_URL` usa `jdbc:postgresql://db:5432/...`.
- `depends_on` controla el orden de arranque, no la disponibilidad — el *contenedor* de BD arranca primero, pero puede seguir inicializándose. Spring Boot reintenta la conexión al arrancar, así que normalmente va bien; para casos estrictos añades un health check.
- `volumes` persiste los datos: sin `pgdata`, cada `docker compose down` borraría la base de datos.

---

## Flyway — migraciones de base de datos versionadas

Docs: https://docs.spring.io/spring-boot/how-to/data-initialization.html#howto.data-initialization.migration-tool.flyway → leer: "Use a Higher-level Database Migration Tool"

`spring.jpa.hibernate.ddl-auto=update` (de [01-basics.md](./01-basics.md)) está bien mientras aprendes, pero nunca lo usas en producción. Deja que Hibernate altere el esquema automáticamente comparando entidades con la base de datos — y ese es exactamente el peligro: puede cambiar silenciosamente una tabla de producción, y no es revisable. No hay registro de *qué* cambió ni *cuándo*.

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

- El nombrado es estricto: `V<versión>__<descripción>.sql` (dos guiones bajos). Flyway los ejecuta en orden de versión, uno cada vez.
- Al arrancar, Flyway comprueba su tabla `flyway_schema_history` para ver qué scripts ya se han ejecutado, y solo aplica los nuevos. Ejecutar la app dos veces no re-ejecuta `V1`.
- Desactivas el auto-DDL de Hibernate (`spring.jpa.hibernate.ddl-auto=validate`) para que Hibernate solo *compruebe* que las entidades coinciden con el esquema que Flyway construyó, sin cambiarlo nunca.

> **Por qué los equipos lo usan (la respuesta de entrevista):** los scripts están commiteados en git, así que cada cambio de esquema se revisa en un pull request, se rastrea en el historial y se aplica de forma idéntica en todos los entornos. `ddl-auto=update` no da nada de eso y puede corromper producción. "¿Cuál es tu estrategia de migración?" → scripts versionados con Flyway, nunca `ddl-auto` en producción.
