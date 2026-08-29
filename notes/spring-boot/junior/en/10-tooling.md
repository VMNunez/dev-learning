# Spring Boot — Tooling: Docker and Flyway

Docs: [Baeldung — Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application) · [Baeldung — Database Migrations with Flyway](https://www.baeldung.com/database-migrations-with-flyway)

[09-testing.md](./09-testing.md) closed on the one thing every green test still had in common: it ran **on your machine, against your PostgreSQL, with your `DB_PASSWORD` in the IntelliJ run configuration**. Green there means "it works where I built it" — which is exactly the claim "it works on my machine" has always made. This file is where that claim stops being enough. Two tools take "here" out of the sentence: **Docker** packages the app together with its Java 25 runtime so the same image runs on a reviewer's laptop and on a server, and **Flyway** does the same for the schema, replacing `ddl-auto=update` with versioned SQL scripts that are reviewable in git.

These are deployment-time tools, not application code, but Spanish consultancies ask about them in any production-focused screening: "how do you containerise your app?" and "how do you manage database changes?".

> **Everything in this file is a *proposed* setup for TimeTrack — none of it is in the repo yet.** Verified today: the backend has **no `Dockerfile`, no `docker-compose.yml`, and no Flyway dependency in `pom.xml`**. So read every `File:` line and every code block below as *the target state* — what you will add when you containerise the project — not as code you can go and open right now. Each block is labelled accordingly. (`11-business-logic-domain-modeling.md` uses the same honesty convention for code it teaches before it is written.)

---

## Why containerise

Purpose: understand the problem Docker solves before touching a Dockerfile — why "package the runtime with the app" is worth the extra tooling.
File: no project file — this is the concept behind the two proposed files below.
Docs: [Baeldung — Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application) → read: the introduction and "Dockerizing" — why an image bundles the app with its runtime.

"It works on my machine" is the problem Docker solves. A container packages your app **and** its runtime (the exact Java version, the OS libraries) into one image that runs identically on your laptop, a teammate's machine, and the production server. No "install Java 25 first, then set these variables" — the image already has everything.

> **Analogy — shipping a meal, not a recipe.** Handing someone your `.jar` is handing them a recipe: it only works if their kitchen already has the right oven (Java 25), the right ingredients (OS libraries), set up the right way. A container ships the finished meal *in its own kitchen* — the oven, the ingredients and the app, sealed in one box. They do not reproduce your setup; they run your setup. That is why "works on my machine" evaporates: your machine travels with the code.

For a Spring Boot app there are two pieces: the **Dockerfile** (how to build the image of your app) and **docker-compose** (how to run your app together with PostgreSQL in one command). Flyway then handles the third moving part — the database schema — so it too is reproducible instead of hand-built.

---

## Dockerfile — building an image of the app

Purpose: turn the built `.jar` into a self-contained image that carries its own Java 25 runtime, so `docker run` starts the app anywhere with no local Java install.
File: `projects/07-timetrack/backend/timetrack/Dockerfile` — **proposed: this file does not exist in TimeTrack yet.**
Docs: [Baeldung — Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application) → read: "Dockerfile" and "Understanding the EXPOSE Instruction".

A `Dockerfile` at the project root describes, step by step, how to turn your built `.jar` into a runnable image. Read each line as an instruction Docker executes top to bottom to assemble the image:

```dockerfile
# proposed Dockerfile for TimeTrack — not in the repo yet
FROM eclipse-temurin:25-jre        # base image: slim Linux + Java 25 runtime only
WORKDIR /app                       # working directory inside the container
COPY target/timetrack-0.0.1-SNAPSHOT.jar app.jar   # copy the built jar in
EXPOSE 8080                        # DOCUMENTS the port — does not open it (see below)
ENTRYPOINT ["java", "-jar", "app.jar"]   # command run when the container starts
```

- `FROM eclipse-temurin:25-jre` — the starting point. TimeTrack is Spring Boot 4.0.6 on **Java 25**, so the base image must carry a Java 25 runtime — an older tag like `:17-jre` would fail to run the jar. `eclipse-temurin` is the standard free OpenJDK distribution; `-jre` (runtime only, no compiler) keeps the image smaller than `-jdk`.
- `COPY target/timetrack-0.0.1-SNAPSHOT.jar app.jar` — Maven produces the jar in `target/` (the name comes from `<artifactId>` + `<version>` in `pom.xml`); you copy it in and rename it to `app.jar`. **Run `mvn clean package` first** — the jar must exist on disk before you build the image, because `COPY` reads from your machine, not from Maven.
- `ENTRYPOINT ["java", "-jar", "app.jar"]` — the same command you run locally, now baked into the image.

### `EXPOSE` documents the port — it does not publish it

This is the number-one Docker surprise for beginners: **`EXPOSE 8080` opens nothing.** It is metadata — a note in the image that says "this app listens on 8080" — so a human or a tool reading the image knows which port matters. The port is actually published to your host only when you pass `-p` (or `ports:` in Compose) at *run* time. The author of a Dockerfile cannot open a host port, because they have no idea what network the container will eventually run on; only the person running it does.

```bash
# MAL — EXPOSE is in the Dockerfile, but nothing maps it to the host
docker run timetrack
#   the app is up INSIDE the container on 8080, but http://localhost:8080 on your
#   machine is dead — nothing was published. Feels broken; it is doing exactly what you asked.

# BIEN — -p actually publishes host:container
docker run -p 8080:8080 timetrack
#   now localhost:8080 → container's 8080. -p is what opens the door; EXPOSE only labelled it.
```

> **`EXPOSE` is a sign on the door, `-p` is unlocking it.** You can screw a "Room 8080" sign onto a door all day (`EXPOSE`) and nobody can walk through until someone unlocks it (`-p 8080:8080`). Leaving `EXPOSE` out does not stop `-p` from working either — it is purely documentation. Interviewers love this one precisely because so many people believe `EXPOSE` opens the port.

Build and run it:

```bash
mvn clean package             # produce target/timetrack-0.0.1-SNAPSHOT.jar
docker build -t timetrack .   # build the image, tag it "timetrack"
docker run -p 8080:8080 timetrack   # map host port 8080 → container port 8080
```

> **The error you will actually see if 8080 is taken.** Run the app locally in IntelliJ *and* `docker run -p 8080:8080` at the same time and Docker refuses to start:
> ```
> docker: Error response from daemon: driver failed programming external connectivity on
> endpoint timetrack: Bind for 0.0.0.0:8080 failed: port is already allocated.
> ```
> Two processes cannot own the same host port. The fix is to free 8080 (stop the local run) or publish on another host port: `-p 8081:8080` — the left number is the host, the right is the container, and only the left one has to be free.

> **Multi-stage builds (worth recognising).** Real Dockerfiles often have two `FROM` stages — one with the full JDK + Maven that *builds* the jar inside the image, then a second `-jre` stage that copies only the jar out. That way you do not need Maven on the build machine and the final image stays small. At junior level, knowing the simple single-stage version above is enough; recognise multi-stage when you see it.

---

## docker-compose — app + database together

Purpose: start the app and its PostgreSQL together with one command, on a shared network where the app finds the database by name — no manual DB install for anyone who clones the repo.
File: `projects/07-timetrack/backend/timetrack/docker-compose.yml` — **proposed: TimeTrack has no Compose file yet.**
Docs: [Baeldung — Running Spring Boot with PostgreSQL in Docker Compose](https://www.baeldung.com/spring-boot-postgresql-docker) → read: "Docker Compose" and the service-networking section.

Your app needs PostgreSQL. Without Compose, a teammate has to install PostgreSQL, create the database, and set the password before they can run anything. `docker-compose.yml` describes both services so the whole stack starts with **one command** — and nobody installs PostgreSQL by hand.

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

### Why `db` works as a hostname — the embedded DNS

The app reaches the database at host `db` (the service name), **not** `localhost` — that is why `SPRING_DATASOURCE_URL` is `jdbc:postgresql://db:5432/...`. But *why* does the word `db` resolve to anything? Because Compose does something concrete on `up`: it creates a **user-defined bridge network** and puts every service in the file on it. That network ships with an **embedded DNS resolver**, and the resolver holds one entry per service — mapping each service *name* to that container's current IP. So when Spring's JDBC driver asks the OS to resolve `db`, the lookup hits Compose's DNS, which answers with the `db` container's IP. The name is the stable handle; the IP behind it can change on every restart and you never care.

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

> **Why not `localhost`?** Inside the `app` container, `localhost` means *the app container itself* — its own loopback. Postgres is not there; it is in a different container. `localhost:5432` from `app` would hit nothing and give "connection refused". Each container has its own network identity, so you address the other one by its service name, which the Compose DNS knows.

### `depends_on` waits for the container, not for Postgres

`depends_on` controls **start order**, not **readiness**. It guarantees the `db` *container* is started before `app` starts — but "container started" is not "Postgres is accepting connections". Postgres still needs a second or two to initialise inside that container, and during that gap the app can already be trying to connect.

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

> **"Container up" is not "service ready" — the classic race.** Spring Boot retries the datasource connection a few times on startup, so the plain `depends_on` version often survives by luck. But relying on luck is what makes a stack "works on my fast laptop, fails in CI". The `service_healthy` condition removes the race: the app is not started until `pg_isready` reports Postgres is actually accepting connections.

- `ports: "5432:5432"` on `db` publishes Postgres to your host too, so you can still connect from pgAdmin while it runs in Compose. The app itself does **not** use this mapping — it talks to `db:5432` over the internal network, not through the host.
- `volumes` persists the data: without `pgdata`, every `docker compose down` would wipe the database, because a container's own filesystem is thrown away when the container is removed. The named volume lives outside the container and survives.

---

## Flyway — versioned database migrations

Purpose: replace Hibernate's auto-DDL with numbered SQL scripts, committed to git, so every schema change is reviewed, ordered, and applied identically in every environment.
File: `projects/07-timetrack/backend/timetrack/src/main/resources/db/migration/` — **proposed: TimeTrack has no Flyway dependency and no `db/migration` folder yet.**
Docs: [Baeldung — Database Migrations with Flyway](https://www.baeldung.com/database-migrations-with-flyway) → read: "How Does Flyway Work?" and "Naming Convention".

`spring.jpa.hibernate.ddl-auto=update` (from [01-basics.md](./01-basics.md)) is fine while learning, but you never use it in production. It lets Hibernate alter the schema automatically by comparing entities to the database — and that is exactly the danger: it can silently change a production table, and it is not reviewable. There is no record of *what* changed or *when*.

> **Analogy — a manuscript with no version history vs. tracked commits.** `ddl-auto=update` is like editing a shared document with no history: the schema simply *becomes* whatever the entities imply, and nobody can see the diff or veto it. Flyway is git for the schema — each change is a separate, named, ordered file you can read in a pull request before it ever touches a real database.

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

- Naming is strict: `V<version>__<description>.sql` — a capital `V`, the version, then **two** underscores before the description. Get the separator wrong (one underscore) and Flyway does not recognise the file as a migration.
- On startup Flyway checks its own `flyway_schema_history` table to see which scripts have already run, and applies only the new ones, **in version order**. Running the app twice does not re-run `V1` — the history table already lists it as applied.
- You switch off Hibernate's auto-DDL (`spring.jpa.hibernate.ddl-auto=validate`) so Hibernate only *checks* that entities match the schema Flyway built, never changes it.

### The checksum-mismatch trap — never edit an applied migration

When Flyway applies `V1`, it stores a **checksum** of that file's contents in `flyway_schema_history`. On the next startup it re-hashes the file on disk and compares. If you *edited an already-applied migration* — even fixing a typo — the two no longer match and Flyway refuses to start:

```
Migration checksum mismatch for migration version 1
-> Applied to database : 1234567890
-> Resolved locally    : -987654321
```

The rule this enforces: **an applied migration is immutable.** Once `V1` has run anywhere, you never touch it again — you fix or extend the schema with a *new* file (`V4__...`). This is the whole point of versioning: the history of what ran must stay truthful. (Editing is only ever acceptable on a migration that has not run in any shared environment, i.e. still local-only.)

> **Why teams use it (the interview answer).** The scripts are committed to git, so every schema change is reviewed in a pull request, tracked in history, and applied identically in every environment. `ddl-auto=update` gives you none of that and can corrupt production. "What is your migration strategy?" → versioned scripts with Flyway, `ddl-auto=validate` so Hibernate only checks, never `ddl-auto=update` in production.

---

## Where this leaves you — and what comes next

The app and its Java 25 runtime now travel as one image, the database starts beside it on a named network with one command, and the schema is a reviewable chain of versioned scripts instead of whatever Hibernate felt like doing. "It works on my machine" is finally a claim you can *transfer*: the machine ships with the code.

What none of this decided is **where the business rules live** — the logic that says a `TimeEntry` may go `DRAFT → SUBMITTED` but never `DRAFT → APPROVED`. Docker and Flyway make your app run *anywhere*; they say nothing about whether the code inside it is well-designed. That is the question [11-business-logic-domain-modeling.md](./11-business-logic-domain-modeling.md) takes up: given a real workflow, where does each rule belong — on the entity, or in the service — and how do you stop anyone bypassing it. (For what comes *after* the basics here — Kubernetes, CI/CD pipelines, cloud deploys — see [future-learning.md](../../coverage/senior.md); those are post-first-job topics.)
