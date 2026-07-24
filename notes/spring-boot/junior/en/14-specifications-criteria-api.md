# Specifications & the Criteria API

Docs: https://www.baeldung.com/rest-api-search-language-spring-data-specifications → read: "Specifications" and "Multiple Specifications"

You already know `@Query` with named parameters (file [04-spring-data-jpa.md](04-spring-data-jpa.md)) — you write the JPQL as a fixed string, Spring fills in `:paramName` at execution time. That works great when the query never changes shape. But `GET /api/entries` in project 07 has four *optional* filters — `userId`, `projectId`, `status`, `month` — and any subset of them can arrive on a given request: sometimes just `status`, sometimes all four, sometimes none. The query's `WHERE` clause needs a different shape depending on what showed up. That is the problem this file solves.

## The tempting fix, and why it breaks

The first instinct is to keep one fixed JPQL string and fake "optional" with a boolean trick:

```java
// MAL
@Query("""
        SELECT te FROM TimeEntry te
        WHERE (:status IS NULL OR te.status = :status)
        AND (:start IS NULL OR :end IS NULL OR te.date BETWEEN :start AND :end)
        """)
List<TimeEntry> findByFilters(@Param("status") EntryStatus status, @Param("start") LocalDate start, @Param("end") LocalDate end);
```

The idea: if `:status` is `null`, `:status IS NULL` is true, so the `OR` makes the whole parenthesis true regardless of the second half — effectively "don't filter by status". It reads correctly in your head, and it even works in some databases. But run this against PostgreSQL and you can hit:

```
ERROR: 42P18: could not determine data type of parameter $1
```

> **Why this actually happens.** Before PostgreSQL runs a query, it has to decide the *data type* of every placeholder (`$1`, `$2`, …) so it knows how to compare it. Normally it infers the type from context — `te.status = :status` tells it `:status` must be an `EntryStatus`-mapped type, because that is what the `=` is comparing against. The problem is `:status IS NULL`: `IS NULL` is a generic check that works on *any* type, so on its own it gives Postgres no clue what type `:status` should be. Postgres's planner reads the expression left to right and, depending on how the `OR` is grouped and optimized, can reach the `IS NULL` branch without ever having pinned down a type from the `=` branch. When that happens, it has a placeholder with no inferable type — and refuses to guess, because guessing wrong could silently compare the wrong types. JPQL's job is only to translate your `WHERE` to SQL text; it cannot fix a type-inference limitation in Postgres's own planner.

The database-agnostic fix is to stop writing one query with conditional text inside it, and instead build the query as **Java objects**, adding a piece to the `WHERE` only when that filter actually has a value. That is exactly what `Specification` gives you.

## The core idea: build the query, don't write it

With `@Query`, the SQL/JPQL exists as a string the moment you compile the class — fixed, unconditional. With the **Criteria API**, you build the query as a tree of Java objects at runtime, using regular `if` logic. If a filter is absent, you simply never create the object that would have represented it — there is no placeholder for Postgres to choke on, because that condition was never added to the query in the first place.

```
Fixed JPQL string                    Criteria API (built in Java)
──────────────────                   ─────────────────────────────
"WHERE (:x IS NULL OR ...)"          if (x != null) { add condition }
   ↑ same text always sent           ↑ the WHERE clause differs per call,
     to Postgres, trick relies         built from real if/else, no trick
     on Postgres's type inference       needed
```

## The three building blocks

To translate a `WHERE` condition into Java objects, JPA gives you three cooperating types. Picture the SQL sentence `te.status = 'DRAFT'` and see how each word maps to one of them:

| SQL piece | Java object | What it represents |
|---|---|---|
| `time_entries te` (the table you're querying, aliased `te`) | `Root<TimeEntry> root` | The starting point — "I'm querying the `TimeEntry` entity." You navigate from it to reach columns and relations: `root.get("status")` is the Java equivalent of writing `te.status` |
| the whole `WHERE` condition, once fully built | `Predicate` | A finished, ready-to-use boolean condition object. You never write `Predicate` by hand — you get one back from a `CriteriaBuilder` method |
| the "factory" of comparison operators | `CriteriaBuilder cb` | An object with one method per SQL operator: `cb.equal(...)`, `cb.between(...)`, `cb.greaterThan(...)`, `cb.and(...)`, `cb.or(...)`. You never type an operator as a string — you always call a method |
| the query being assembled as a whole (joins, `SELECT`, `ORDER BY`) | `CriteriaQuery<?> query` | Rarely needed for simple filters — you'll mostly ignore this parameter |

> **How to read the table above.** Each row is a direct translation: the SQL fragment on the left has no textual form in your Java code — it only exists as the object on the right, built by calling methods. `root.get("user").get("id")` is not a string that gets parsed later; it is a real method call, right now, that produces a `Path` object JPA later turns into `te.user_id` in the generated SQL.

## `Specification<T>` — packaging a `WHERE` fragment as a reusable object

`Specification<T>` is a **functional interface** — an interface with exactly one abstract method:

```java
public interface Specification<T> {
    Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb);
}
```

Because it has only one method, Java lets you implement it with a **lambda** instead of a full anonymous class. The lambda's parameter list — `(root, query, cb)` — is that exact method signature; Java infers the parameter types from the `Specification<TimeEntry>` the lambda is assigned to.

> **The part that trips people up first: nothing runs yet.** Writing `Specification<TimeEntry> spec = (root, query, cb) -> cb.equal(root.get("status"), status);` does not query anything. It builds and stores *a recipe* — "when someone eventually needs a `Predicate` from me, here is how to make it." Spring Data JPA only calls `toPredicate(...)` later, when you pass the `Specification` into `repository.findAll(spec)` and it is time to actually assemble the SQL.

This is `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntrySpecifications.java` in project 07 — one static factory method per filter:

Purpose: Build one reusable `WHERE` fragment per optional filter of `GET /api/entries`, so the service can combine only the fragments whose value is actually present.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntrySpecifications.java`
Docs: https://www.baeldung.com/rest-api-search-language-spring-data-specifications → read: "Specifications"

```java
public class TimeEntrySpecifications {

    public static Specification<TimeEntry> hasUserId(Long userId) {
        return ((root, query, criteriaBuilder) ->
                userId == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("user").get("id"), userId));
    }

    public static Specification<TimeEntry> hasProjectId(Long projectId) {
        return ((root, query, criteriaBuilder) ->
                projectId == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("project").get("id"), projectId));
    }

    public static Specification<TimeEntry> hasStatus(EntryStatus status) {
        return ((root, query, criteriaBuilder) ->
                status == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("status"), status));
    }

    public static Specification<TimeEntry> dateBetween(LocalDate start, LocalDate end) {
        return ((root, query, criteriaBuilder) ->
                (start == null || end == null) ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.between(root.get("date"), start, end));
    }
}
```

**`hasUserId(userId)`** — a static factory: given a possibly-`null` `Long`, it returns a `Specification<TimeEntry>` that knows how to filter by it later, once JPA asks.

**`root.get("user").get("id")`** — walks the entity graph exactly like the JPQL path `te.user.id` did, but as method calls on the `Root` instead of a string. `TimeEntry` has a `user` field (`@ManyToOne User user`), and `User` has an `id` field — `.get("user")` steps into the relation, `.get("id")` steps into that relation's column.

**`criteriaBuilder.equal(A, B)`** — builds the `Predicate` for `A = B`. Here it produces the SQL equivalent of `te.user.id = ?`, with `?` bound to `userId`.

**`criteriaBuilder.conjunction()`** — the "always true" `Predicate`. When you `AND` several predicates together and one of them is `conjunction()`, it contributes nothing to the filter — the row set is unaffected. This is how "this filter was not provided" is expressed: not by omitting the predicate from a list (which you could also do), but by supplying a neutral one that disappears once combined.

> **Why `conjunction()` and not just skip adding a predicate?** Both approaches work; `conjunction()` is used here because it lets every factory method have the exact same return type and lets you `.and()` them together unconditionally, without an `if` in the caller for every filter. Its logical opposite is `cb.disjunction()` — the "always false" predicate, useful when you want a filter that excludes everything if its condition is absent (rare; not used here).

**`criteriaBuilder.between(A, start, end)`** — builds `A BETWEEN start AND end`, the direct object equivalent of the JPQL `te.date BETWEEN :start AND :end` you had before.

## `JpaSpecificationExecutor<T>` — where `findAll(Specification)` comes from

A `Specification` is useless without something that knows how to execute it. `JpaRepository<T, ID>` alone does not have a `findAll(Specification<T>)` overload — you get it by having your repository interface *also* extend `JpaSpecificationExecutor<T>`:

Purpose: Give `TimeEntryRepository` the `findAll(Specification<TimeEntry>)` overload used to run a dynamically-built filter.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java`
Docs: https://www.baeldung.com/rest-api-search-language-spring-data-specifications → read: "The Repository"

```java
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long>, JpaSpecificationExecutor<TimeEntry> {
    // findByFilters(...) and its @Query are gone — replaced by findAll(Specification<TimeEntry>)
}
```

> This is multiple interface inheritance, which Java allows freely (unlike multiple *class* inheritance) — `TimeEntryRepository` now has every method `JpaRepository` provides (`save`, `findById`, `deleteById`, …) plus every method `JpaSpecificationExecutor` provides (`findAll(Specification)`, `count(Specification)`, …).

## Combining specifications: `.and(...)`

`Specification<T>` has default methods `and(...)`, `or(...)`, and `not(...)` — this is the second reason it is an interface and not a plain functional type: it can carry extra behaviour beyond the single abstract method. You chain them to build one combined `Specification` out of several:

```java
Specification<TimeEntry> spec = Specification
        .where(TimeEntrySpecifications.hasUserId(userId))
        .and(TimeEntrySpecifications.hasProjectId(projectId))
        .and(TimeEntrySpecifications.hasStatus(status))
        .and(TimeEntrySpecifications.dateBetween(start, end));

List<TimeEntry> entries = timeEntryRepository.findAll(spec);
```

`Specification.where(...)` is a null-safe starting point (it copes even if you pass `null` as the first argument), and each `.and(...)` produces a *new* combined `Specification` whose `toPredicate` calls `cb.and(...)` on the underlying predicates of both sides — including the neutral `conjunction()` ones, which vanish harmlessly.

> **Trace it for a request with only `?status=SUBMITTED`.** `userId`, `projectId`, `start`, `end` are all `null`. `hasUserId`, `hasProjectId`, and `dateBetween` each evaluate their ternary to `cb.conjunction()`; `hasStatus` evaluates to the real `cb.equal(root.get("status"), SUBMITTED)`. Once `.and()` chains all four, the effective SQL `WHERE` is just `te.status = 'SUBMITTED'` — the three "always true" predicates disappear from the generated SQL's practical effect, even though they were technically ANDed in.

## Contrast: `@Query` vs `Specification` — when to use which

| | `@Query` (JPQL/native) | `Specification` |
|---|---|---|
| Query shape | Fixed at compile time | Built at runtime, conditionally |
| Good for | A query whose `WHERE`/`SELECT` never changes shape (e.g. the report aggregations in `04-spring-data-jpa.md`) | A query whose `WHERE` needs a different subset of conditions per call |
| Readability | Reads like SQL — easy to eyeball | Reads like Java — more boilerplate, but composable |
| The `IS NULL OR` optional-filter trick | Fragile — can hit Postgres type-inference errors like `42P18` | Not needed — absent filters just never contribute a predicate |

The row that matters most for this file: **use `@Query` when the shape is fixed, `Specification` when the shape depends on which optional filters showed up.** `GET /api/entries` is the second case — that is precisely why it moved from JPQL to `Specification` in project 07.

## Putting it together — the four steps, in order

This is the practical checklist for the next time a resource needs dynamic optional filters. Each step points at the exact file it landed in for `GET /api/entries`:

1. **Decide it's needed:** the endpoint has 2+ optional filters that can arrive in any combination, and either a `@Query` with `IS NULL OR` tricks would be needed, or already exists and is fragile.
2. **Create `Xxx­Specifications.java`** in `repository/` — one `static Specification<Entity>` factory method per filter, each returning `cb.conjunction()` when its argument is `null`. → `TimeEntrySpecifications.java`
3. **Make the repository extend `JpaSpecificationExecutor<Entity>`** alongside `JpaRepository<Entity, Id>` — this is what gives you `findAll(Specification<Entity>)`. Delete the old `@Query` method it replaces. → `TimeEntryRepository.java`
4. **In the service, build the combined `Specification` and call `findAll(spec)`:** start with `Specification.where(...)`, chain `.and(...)` once per filter, pass the result to `repository.findAll(spec)`. → `TimeEntryService.findByFilter(...)`

> The business logic that decides *what value* each filter should have (e.g. overwriting `userId` with the authenticated user's own id when the caller isn't a manager) never moves — it stays exactly where it already was, in the service, before the `Specification` is built. Only *how the query executes* changes; *what gets filtered* is decided the same way as before.
