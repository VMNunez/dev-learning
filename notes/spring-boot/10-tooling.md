# Spring Boot — Tooling: Docker and Flyway

> 📖 [Spring Boot — Container Images](https://docs.spring.io/spring-boot/reference/packaging/container-images/index.html) · [Flyway](https://documentation.red-gate.com/flyway)

These are deployment-time tools, not application code, but Spanish consultancies ask about them in any production-focused screening: "how do you containerise your app?" and "how do you manage database changes?". TimeTrack (project 07) is built to be run with Docker, so this is the reference for that.

---

## Why containerise

"It works on my machine" is the problem Docker solves. A container packages your app **and** its runtime (the exact Java version, the OS libraries) into one image that runs identically on your laptop, a teammate's machine, and the production server. No "install Java 25 first, then set these variables" — the image already has everything.

For a Spring Boot app there are two pieces: the **Dockerfile** (how to build the image of your app) and **docker-compose** (how to run your app together with PostgreSQL in one command).

---

## Dockerfile — building an image of the app

Docs: https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html → read: "Dockerfiles"

A `Dockerfile` at the project root describes, step by step, how to turn your built `.jar` into a runnable image.

```dockerfile
FROM eclipse-temurin:25-jre        # base image: a slim Linux with Java 25 runtime only
WORKDIR /app                       # working directory inside the container
COPY target/timetrack-0.0.1-SNAPSHOT.jar app.jar   # copy the built jar in
EXPOSE 8080                        # document the port the app listens on
ENTRYPOINT ["java", "-jar", "app.jar"]   # the command that runs when the container starts
```

- `FROM eclipse-temurin:25-jre` — the starting point. `eclipse-temurin` is the standard free OpenJDK distribution; `-jre` (runtime only, no compiler) keeps the image smaller than `-jdk`.
- `COPY target/*.jar app.jar` — Maven produces the jar in `target/`; you copy it in and rename it to `app.jar`. **Run `mvn clean package` first** — the jar must exist before you build the image.
- `ENTRYPOINT ["java", "-jar", "app.jar"]` — the same command you run locally, now baked into the image.

Build and run it:

```bash
mvn clean package          # produce target/*.jar
docker build -t timetrack .   # build the image, tag it "timetrack"
docker run -p 8080:8080 timetrack   # map host port 8080 → container port 8080
```

> **Multi-stage builds (worth recognising):** real Dockerfiles often have two `FROM` stages — one with the full JDK + Maven that *builds* the jar inside the image, then a second `-jre` stage that copies only the jar out. That way you do not need Maven on the build machine and the final image stays small. At junior level, knowing the simple single-stage version above is enough; recognise multi-stage when you see it.

---

## docker-compose — app + database together

Docs: https://docs.docker.com/compose/ → read: "How Compose works"

Your app needs PostgreSQL. Without Compose, a teammate has to install PostgreSQL, create the database, and set the password before they can run anything. `docker-compose.yml` describes both services so the whole stack starts with **one command** — and nobody installs PostgreSQL by hand.

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
      - pgdata:/var/lib/postgresql/data   # keep data when the container restarts

  app:
    build: .                              # build from the Dockerfile in this folder
    ports:
      - "8080:8080"
    environment:
      DB_PASSWORD: ${DB_PASSWORD}
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/timetrack
    depends_on:
      - db                                # start the database before the app

volumes:
  pgdata:
```

```bash
docker compose up        # builds and starts both services
docker compose down      # stops and removes them
```

- The app reaches the database at host `db` (the service name), **not** `localhost` — inside the Compose network each service is reachable by its name. That is why `SPRING_DATASOURCE_URL` uses `jdbc:postgresql://db:5432/...`.
- `depends_on` controls start order, not readiness — the DB *container* starts first, but it may still be initialising. Spring Boot retries the connection on startup, so this is usually fine; for strict cases you add a health check.
- `volumes` persists the data: without `pgdata`, every `docker compose down` would wipe the database.

---

## Flyway — versioned database migrations

Docs: https://docs.spring.io/spring-boot/how-to/data-initialization.html#howto.data-initialization.migration-tool.flyway → read: "Use a Higher-level Database Migration Tool"

`spring.jpa.hibernate.ddl-auto=update` (from [01-basics.md](./01-basics.md)) is fine while learning, but you never use it in production. It lets Hibernate alter the schema automatically by comparing entities to the database — and that is exactly the danger: it can silently change a production table, and it is not reviewable. There is no record of *what* changed or *when*.

Flyway replaces that with **versioned SQL scripts**. Each schema change is a numbered file in `src/main/resources/db/migration`:

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

- Naming is strict: `V<version>__<description>.sql` (two underscores). Flyway runs them in version order, once each.
- On startup Flyway checks its `flyway_schema_history` table to see which scripts have already run, and applies only the new ones. Running the app twice does not re-run `V1`.
- You switch off Hibernate's auto-DDL (`spring.jpa.hibernate.ddl-auto=validate`) so Hibernate only *checks* that entities match the schema Flyway built, never changes it.

> **Why teams use it (the interview answer):** the scripts are committed to git, so every schema change is reviewed in a pull request, tracked in history, and applied identically in every environment. `ddl-auto=update` gives you none of that and can corrupt production. "What is your migration strategy?" → versioned scripts with Flyway, never `ddl-auto` in production.
