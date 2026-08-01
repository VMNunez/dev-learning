# Containerisation — Docker

Docs: https://docs.docker.com/get-started/docker-overview/ → read: "What is a container?"

The **implementation** (the actual `Dockerfile` and `docker-compose.yml` for a Spring Boot + PostgreSQL app) lives in [spring-boot/10-tooling.md](../../../../spring-boot/junior/en/10-tooling.md). This file is the **conceptual** side — what containers are, and the confusable pairs interviewers test.

---

## What problem does Docker solve?

"It works on my machine." Your app needs an exact runtime — a specific Java version, certain OS libraries, a database. On a teammate's laptop or the production server, any of those can differ, and the app breaks. A **container** packages the app together with its exact runtime and dependencies into one unit that runs identically everywhere.

That is the answer interviewers want to "what problem does Docker solve?" — reproducible environments, not a recital of virtualisation theory.

---

## Container vs virtual machine

Both isolate an app, but at very different cost:

| | Container | Virtual machine |
|---|---|---|
| What it ships | The app + its dependencies | A whole guest operating system |
| OS kernel | Shares the host's | Has its own |
| Start time | Milliseconds | Seconds to minutes |
| Size | MBs | GBs |

A container shares the host OS kernel, so it is light and starts instantly. A VM ships an entire guest OS, so it is heavy. This is why containers — not VMs — became the standard way to ship services.

---

## Image vs container

The most common Docker confusable pair, and it works exactly like **class vs object**:

- An **image** is the immutable blueprint, built from a `Dockerfile`. It does nothing on its own.
- A **container** is a running instance of an image. You can start many containers from one image.

`docker build` produces an image; `docker run` starts a container from it.

---

## Dockerfile and docker-compose — the concepts

- A **`Dockerfile`** is the step-by-step recipe to build an image: pick a base image, copy the build artifact in, set the command to run. Each instruction becomes a cached layer, so a rebuild is fast when only the last steps changed.
- **`docker-compose`** runs several containers together with one command. `docker compose up` starts your whole stack — Spring Boot + PostgreSQL on one network — so a new developer runs the project without installing PostgreSQL by hand. That is the expected answer to "how does someone run your project locally?".

> **Environment variables in Compose:** config and secrets (DB URL, JWT secret) are passed to the container through the `environment` block or an `.env` file — never baked into the image. An image may be pushed to a shared registry; a secret baked into it would leak to anyone who pulls it.

---

## Why it matters in a consultancy

Identical environments across dev, CI, and production remove a whole class of "but it ran locally" deployment bugs. In 2026, large Spanish consultancies treat basic Docker fluency as a baseline — being unable to explain `docker compose up` reads as behind.
