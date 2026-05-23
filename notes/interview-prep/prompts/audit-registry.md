# Audit Registry

This file is updated automatically at the end of each audit session by `auto-audit-prompt.md`.
Do not edit it manually unless you are correcting a mistake.

**How to use:**
Scan the table below. Find the next row that is `❌ Not done` or was audited more than 45 days ago.
Copy the TOPIC, NOTES_PATH, and FILE values into the `auto-audit-prompt.md` configuration block.

---

## Topics — recommended audit order

| # | TOPIC | NOTES_PATH | FILE | Last Audited | Status | Notes |
|---|-------|------------|------|-------------|--------|-------|
| 1 | Angular | notes/angular/ | angular | — | ❌ Not done | Most important — audit first |
| 2 | Angular Material | notes/angular-material/ | angular | — | ❌ Not done | No separate FILE; questions go into angular.md |
| 3 | Architecture | notes/architecture/ | architecture | — | ❌ Not done | Covers REST, JWT, layers, SOLID |
| 4 | TypeScript | notes/typescript/ | typescript | — | ❌ Not done | |
| 5 | General | — | general | — | ❌ Not done | No NOTES_PATH; skip Part 1 and run Part 2 only |
| 6 | JavaScript | notes/javascript/ | javascript | — | ❌ Not done | |
| 7 | CSS | notes/css/ | css | — | ❌ Not done | |
| 8 | Git | notes/git/ | git | — | ❌ Not done | |
| 9 | SQL | notes/sql/ | sql | — | ❌ Not done | PostgreSQL — flag engine-specific behaviour |
| 10 | Java | notes/java/ | java | — | ❌ Not done | Language concepts needed for Spring Boot only |
| 11 | Spring Boot | notes/spring-boot/ | spring-boot | — | ❌ Not done | Also read notes/java/ (set both as NOTES_PATH) |

---

## Status legend

| Icon | Meaning |
|------|---------|
| ❌ Not done | Never audited |
| ✅ Complete | Audited — no gaps found |
| 🔧 Fixed | Audited — gaps fixed in that session |
| ➕ Added | Audited — new content created from scratch |
| ⚠️ Needs re-audit | More than 45 days since last audit |
