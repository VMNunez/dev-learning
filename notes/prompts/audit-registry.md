# Audit Registry

This file is updated automatically at the end of each audit session by `auto-audit-prompt.md`.
Do not edit it manually unless you are correcting a mistake.

**How to use:**
Scan the table below. Find the next row that is `❌ Not done` or was audited more than 45 days ago.
Copy the TOPIC, NOTES_PATH, and FILE values into the `auto-audit-prompt.md` configuration block.

---

## Topics — recommended audit order

| #   | TOPIC            | NOTES_PATH              | FILE         | Last Audited | Iterations | Status      | Notes                                                                                                                                                                                        |
| --- | ---------------- | ----------------------- | ------------ | ------------ | ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Angular          | notes/angular/          | angular      | 2026-05-23   | 1          | 🔧 Fixed    | Fixed format throughout (blank lines, bilingual Junior tips); added 7 new questions: provideRouter, routerLinkActive, resolver, ngOnDestroy, ErrorStateMatcher, component test, track gotcha |
| 2   | Angular Material | notes/angular-material/ | angular      | —            | 0          | ❌ Not done | No separate FILE; questions go into angular.md                                                                                                                                               |
| 3   | Architecture     | notes/architecture/     | architecture | —            | 0          | ❌ Not done | Covers REST, JWT, layers, SOLID                                                                                                                                                              |
| 4   | TypeScript       | notes/typescript/       | typescript   | —            | 0          | ❌ Not done |                                                                                                                                                                                              |
| 5   | General          | notes/general/          | general      | —            | 0          | ❌ Not done | notes/general/ — HTTP, JSON, env vars, testing concepts, SOLID                                                                                                                               |
| 6   | JavaScript       | notes/javascript/       | javascript   | —            | 0          | ❌ Not done |                                                                                                                                                                                              |
| 7   | CSS              | notes/css/              | css          | —            | 0          | ❌ Not done |                                                                                                                                                                                              |
| 8   | Git              | notes/git/              | git          | —            | 0          | ❌ Not done |                                                                                                                                                                                              |
| 9   | SQL              | notes/sql/              | sql          | —            | 0          | ❌ Not done | PostgreSQL — flag engine-specific behaviour                                                                                                                                                  |
| 10  | Java             | notes/java/             | java         | —            | 0          | ❌ Not done | Language concepts needed for Spring Boot only                                                                                                                                                |
| 11  | Spring Boot      | notes/spring-boot/      | spring-boot  | —            | 0          | ❌ Not done | Also read notes/java/ (set both as NOTES_PATH)                                                                                                                                               |
| 12  | Security         | notes/security/         | security     | —            | 0          | ❌ Not done | AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection                                                                                                                            |

---

## Status legend

| Icon              | Meaning                                    |
| ----------------- | ------------------------------------------ |
| ❌ Not done       | Never audited                              |
| ✅ Complete       | Audited — no gaps found                    |
| 🔧 Fixed          | Audited — gaps fixed in that session       |
| ➕ Added          | Audited — new content created from scratch |
| ⚠️ Needs re-audit | More than 45 days since last audit         |
