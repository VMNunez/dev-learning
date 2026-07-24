# Transactions — @Transactional

> 📖 [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring)
> 📖 [Baeldung — Transaction Propagation and Isolation in Spring @Transactional](https://www.baeldung.com/spring-transactional-propagation-isolation)
> 📖 [Spring Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction.html) (secondary — the reference manual, not a tutorial)

[07-validation.md](./07-validation.md) sealed the door on the way in. A request reaching `TimeEntryService.create()` cannot carry a blank description or a null `projectId`, because `@Valid` rejected it at the controller and `GlobalExceptionHandler` already answered the client with a `400` naming the field. Every value that gets past that door is clean.

And that is exactly when a new kind of invalid data appears — one no `@NotBlank` in the world can stop, because **your own code produces it**. Validation guarantees each incoming *value* is sane. It guarantees nothing about what the database looks like when a method that performs *three* writes throws on the second one. The first write is already in. The third never happened. The row that survives is one that no valid request could ever have produced, and no annotation on a DTO can prevent it — the input was perfect.

That is the gap this file closes: **once input is clean, what happens when a single request must change more than one row?** The answer is not a Java feature. It is a database guarantee that Spring lets you ask for with one annotation.

---

## What is a transaction — the all-or-nothing unit

Purpose: understand the guarantee `@Transactional` is buying before you use the annotation, because the annotation is trivial and the guarantee is not.
File: no project file — this section is the concept; the TimeTrack code starts in the next section.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → read: "Configuring Transactions" and the intro — it explains the boundary before showing any annotation

Think about a bank transfer. Moving 100€ from your account to mine is two operations: subtract 100 from one row, add 100 to another. There is no state of the world in which "the money left my account" is an acceptable stopping point. Either both happen or neither does — a transfer that stops halfway is not a slow transfer, it is **destroyed money**. The bank does not solve this by writing careful Java. It solves it by telling the database: treat these two writes as one indivisible unit.

That unit is a **transaction**: a group of database operations that either all take effect or none do. The database itself enforces it — it holds your changes in a pending state, and only when you say `COMMIT` do they become real and visible to anyone else. Say `ROLLBACK` instead (or crash, or lose the connection) and the database throws away everything you did as if the whole conversation never happened.

Here is the failure without one, in TimeTrack terms:

```
approve() without a transaction — two writes, no unit

1. entry.setStatus(APPROVED) → save()   ✓ COMMITTED — the row is now APPROVED, forever
2. auditRepository.save(auditRow)       ✗ throws — the audit row is never written
→ An entry was approved and NOTHING recorded who approved it or when.
  Step 1 cannot be taken back: it was committed the moment it ran.
```

The damage is not that step 2 failed. Failures are normal — the network drops, a constraint rejects a row. The damage is that **step 1 survived alone**, and now your database holds a state your business rules say is impossible: an approved entry with no audit trail. Nobody will ever see an error about it. The exception went to the client as a `500`, the manager clicked again, and the wrong row sits there quietly.

`@Transactional` on the method wraps both writes in one unit. Now step 2's exception rolls step 1 back — automatically, by the database — and the row goes back to `SUBMITTED` as if `approve()` had never been called.

Here is the whole lifecycle, both endings, in one picture. This is the shape every later section on this page is a variation of — the traps are all about *the arrow that does not fire*:

```
                        ┌──────────────────────────────────────┐
   request arrives      │  BEGIN            (autoCommit=false) │
        │               │  the DB opens a private workspace    │
        ↓               └──────────────────┬───────────────────┘
   proxy intercepts ────────────────────►  │
                                           ↓
                              ┌─ write 1: UPDATE time_entry ─┐   pending —
                              │  write 2: INSERT audit       │   visible ONLY
                              └──────────────┬───────────────┘   to this tx
                                             │
                       ┌─────────────────────┴─────────────────────┐
        method returns │                                           │ method throws
         normally      ↓                                           ↓  (unchecked)
                   ┌────────┐                                 ┌──────────┐
                   │ COMMIT │                                 │ ROLLBACK │
                   └───┬────┘                                 └────┬─────┘
                       ↓                                           ↓
        both writes become real and visible          both writes discarded — the DB
        to every other connection, at once           never made them permanent, so
                                                     there is nothing to "undo"
```

How to read it: the two endings are not symmetric in cost. `COMMIT` publishes work the database already wrote to disk; `ROLLBACK` throws away work nobody else could see. Notice also that **your code never appears in this diagram** — you write neither `BEGIN` nor `COMMIT`. The proxy issues both, and the only thing your method controls is which of the two arrows it takes: return normally, or throw.

> **Why can't you just do this yourself in Java — check for the failure and undo it?** Because "undo it" is another write, and that write can fail too. You would need to catch the exception, issue a compensating `setStatus(SUBMITTED)`, save it — and if *that* save throws, or the JVM is killed by the OS between the two, you are in the same corrupt state, now with more code. The transaction works because the undo does not live in your process at all: the database never made the change permanent in the first place, so "undoing" is just *discarding a pending change*, which cannot half-fail. That is the whole reason this is a database guarantee and not a Java one — no amount of `try/catch` can give you atomicity, because your `catch` block is itself fallible.

> **What does "pending" actually mean — where do the changes live before the commit?** They are real, but private. The moment your transaction issues an `UPDATE`, the database writes it to disk (in Postgres, as a new row version tagged with your transaction's id) and takes a lock on that row — but every *other* connection reading that row still sees the old version, because your transaction id is not committed yet. `COMMIT` does not copy data anywhere; it flips one flag saying "transaction 4711 is committed", and at that instant every other connection starts seeing your version. `ROLLBACK` flips the flag the other way and the row version you wrote becomes garbage nobody will ever read. This is why a commit is fast and why a rollback is not "reversing your work" — there was nothing to reverse.

---

## Where to put @Transactional

Purpose: put the annotation on the layer that owns the business operation, so the transaction boundary matches the unit of work a user actually asked for.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — **note: no method in this file is annotated today**; the code below is proposed.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → read: "@Transactional" and "Potential Pitfalls" — it argues the service-layer placement directly

It goes on **service methods**. Not on controllers — they do not touch the database, they translate HTTP to method calls. Not on repository methods — Spring Data JPA already wraps every repository call in its own tiny transaction, so annotating them buys nothing and hides the real boundary.

The reason the service is right is that it is the only layer that knows what "one operation" means. The repository knows `save()`. The controller knows `POST /api/entries/1/approve`. Only `TimeEntryService.approve()` knows that approving an entry *means* changing a status **and** recording who did it — and the transaction must wrap exactly that, no more and no less.

> **Be honest about your own code: `@Transactional` appears nowhere in the TimeTrack backend.** Grep it — `create()`, `submit()`, `approve()`, `reject()`, `update()` and `delete()` in `TimeEntryService` are all bare `public` methods. Today they get away with it for one specific reason: **each performs exactly one write.** `submit()` reads an entry, checks it, and calls `save()` once, and Spring Data wraps that single `save()` in its own transaction — so the one write either lands or it doesn't. There is no second write to be left stranded. That is not good design, it is a coincidence of the current feature set, and it expires the first time a method writes twice. [11-business-logic-domain-modeling.md](./11-business-logic-domain-modeling.md) makes the same point from the rules side. The right interview answer is not "I used transactions" — it is *"single-write methods are implicitly transactional through Spring Data, so nothing is broken today; the moment I add the audit row, the annotation is mandatory, and here is exactly why"*.

This is `approve()` as it exists now, next to the version that adds the second write:

```java
// ❌ TODAY — real code in TimeEntryService. One write, so it survives without the annotation.
public TimeEntryResponse approve(Long id) {
    TimeEntry timeEntry = timeEntryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

    if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
        throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
    }

    timeEntry.setStatus(EntryStatus.APPROVED);
    TimeEntry saved = timeEntryRepository.save(timeEntry);
    return toResponse(saved);
}

// ✅ PROPOSED — the day approve() also records who approved it, two writes need one unit
@Transactional
public TimeEntryResponse approve(Long id) {
    TimeEntry timeEntry = timeEntryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

    if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
        throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
    }

    timeEntry.setStatus(EntryStatus.APPROVED);          // write 1
    auditRepository.save(new AuditEntry(id, currentManager(), Instant.now()));  // write 2

    // If write 2 throws, write 1 is rolled back — no approved entry without its audit row
    return toResponse(timeEntry);
}
```

- **`@Transactional`** — Spring opens a transaction before the method body runs and commits it when the method returns normally. Throw an unchecked exception instead, and it rolls back (which exceptions exactly is the last section of this file — the answer is narrower than you think).
- **`timeEntryRepository.save(timeEntry)` disappears in the proposed version.** Not an oversight. Inside a transaction, `findById()` returns a **managed** entity: Hibernate keeps it in its persistence context along with a snapshot of its original field values. At commit time it compares the entity to that snapshot — **dirty checking** — sees `status` changed, and emits the `UPDATE` itself. Calling `save()` on an entity Hibernate already manages is a no-op that many developers write out of habit. Keep it if it reads clearer; just know it is not what causes the write.

> **Where does the transaction actually begin, if not in your method?** Not in the method body — by the time your first line runs, the transaction is already open. Spring wraps your bean in a **proxy** (the next section is entirely about this), and the proxy's version of `approve()` does the real work: it asks the `PlatformTransactionManager` for a transaction, which pulls a JDBC `Connection` from the pool, calls `setAutoCommit(false)` on it, and binds that connection to the **current thread** — literally storing it in a `ThreadLocal` inside `TransactionSynchronizationManager`. Only then does it call your code. Every repository call you make afterwards looks up that same thread-bound connection instead of taking a fresh one, which is *why* two different repositories in the same method end up in one transaction without you passing anything between them. When your method returns, the proxy commits and unbinds. The thread is the invisible wire connecting it all — and that is worth remembering, because the moment work hops to another thread (`@Async`, a new `Thread`), it lands on a thread with nothing bound to it, and the transaction does not follow.

---

## Read-only transactions — @Transactional(readOnly = true)

Purpose: mark query methods so Hibernate skips dirty-checking work it cannot possibly need — and know the silent damage of marking the wrong method.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — `findByFilter()` is the read method that would carry it; it is **not** annotated today.
Docs: [Baeldung — Using Transactions for Read-Only Operations](https://www.baeldung.com/spring-transactions-read-only) → read: "Read-Only Transactions" and "Are Read-Only Transactions Useful?" — it is the article dedicated to this flag, and it is explicit that the effect is vendor-dependent

A method that only reads has nothing to commit. Telling Spring that unlocks a real optimisation:

```java
// proposed — findByFilter() in TimeEntryService carries no annotation today
@Transactional(readOnly = true)
public List<TimeEntryResponse> findByFilter(Long userId, Long projectId, EntryStatus status, YearMonth month) {
    // …
    return timeEntryRepository.findByFilters(userId, projectId, status, start, end)
            .stream()
            .map(this::toResponse)
            .toList();
}
```

The win is **dirty checking**, the mechanism from the previous section. Normally Hibernate keeps a snapshot of every entity it loads and, at commit, walks all of them field by field comparing against the snapshot to work out what changed. Load 500 entries in a report and that is 500 snapshots held in memory plus 500 comparisons at the end — pure waste, since a read method changes nothing. `readOnly = true` removes both halves of that waste, and it is worth knowing they are **two separate switches**, because they fail differently:

| Switch Spring flips | What it does | What you save |
|---|---|---|
| `session.setHibernateFlushMode(FlushMode.MANUAL)` | No automatic flush at commit, so the dirty-check comparison never *runs* | CPU — the 500 comparisons |
| `session.setDefaultReadOnly(true)` | Entities load without their snapshot ("hydrated state") being retained at all | Memory — the 500 snapshots |

How to read that table: the second column is the mechanism, and the two rows are not the same thing said twice — `MANUAL` alone would still hold every snapshot in memory, it just never looks at them. Spring only started flipping the second switch in **5.1**; before that, `readOnly = true` was flush-mode-only and the memory saving did not exist. You are on Spring 6 (Boot 3.x), so you get both — but this is why older blog posts disagree about what the flag actually buys.

> **Both switches are the *transaction manager's* doing, not the annotation's — which is why the effect is vendor-dependent.** `@Transactional(readOnly = true)` does nothing by itself; it sets a boolean on the `TransactionDefinition`, and each `PlatformTransactionManager` decides what to make of it. `JpaTransactionManager` with Hibernate underneath flips the two switches above. A different provider might flip neither and ignore the flag entirely. Baeldung says this outright, and it matters for the trap below: **you cannot reason about `readOnly = true` from the annotation alone** — the behaviour lives in the transaction manager and the JDBC driver, one and two layers down.

Good practice is to annotate every service method: writes get `@Transactional`, reads get `@Transactional(readOnly = true)`.

> **Mark a WRITING method `readOnly = true` and the write silently vanishes — no exception, no log line.** This is the most dangerous mistake on this page, and it follows directly from the table above. Write `entry.setStatus(APPROVED)` inside a `readOnly = true` method and *both* switches conspire against you: there is no snapshot to compare against, and no flush that would run the comparison anyway. So Hibernate never notices the change and **never generates an `UPDATE` at all**. Your method returns a `TimeEntryResponse` with `status: "APPROVED"` in it, the client sees a `200 OK`, everything looks perfect — and the database row is still `SUBMITTED`. The lie is only discovered on the next page refresh. Read the flag as its real name: not "this method must not write" but **"do not bother checking whether anything changed"** — and if something did change, that check was the only thing that would have saved it.

> **So why do you also see `ERROR: cannot execute UPDATE in a read-only transaction`? Because there are two different layers saying "read-only", and they catch different things.** These two facts look like a contradiction — if Postgres rejects the update, the loss is not silent — and resolving it is the whole point of this section. On top of the Hibernate switches, Spring also calls `Connection.setReadOnly(true)`, which the Postgres driver turns into `SET TRANSACTION READ ONLY` on the real database session. Postgres then rejects any write statement it receives:
>
> ```
> ERROR: cannot execute UPDATE in a read-only transaction
> ```
>
> The words to hold onto are **"any write statement it receives"**. That is the resolution: the two claims never apply to the same statement, because they sit on opposite sides of the flush.
>
> ```
>   entry.setStatus(APPROVED)          @Modifying @Query("UPDATE …")
>   (managed entity, dirty check)      (bulk JPQL / native query)
>            │                                    │
>   Hibernate flush ──✗ MANUAL                    │ executeUpdate() — runs now,
>   no snapshot, no comparison                    │ flush mode is irrelevant
>            │                                    │
>            ↓                                    ↓
>   no statement ever generated            statement reaches conn
>            │                                    │
>            ↓                                    ↓
>   ✗ SILENT — Postgres never              ✗ LOUD — Postgres rejects it
>     sees anything to reject                ERROR 25006
> ```
>
> Hibernate is the first gate and Postgres is the second, so **a statement Hibernate never generates can never be rejected by Postgres** — silence is not Postgres failing to catch it, it is Postgres never being told. The loud path only exists for writes that bypass the flush and go straight to the connection: `@Modifying` bulk JPQL, native queries, an explicit `flush()`, or an `IDENTITY`-generated insert (which Hibernate must execute immediately to obtain the key).
>
> Note what is *not* on the loud list, because the intuitive guess is wrong: **`deleteById()` on a `readOnly = true` method disappears in silence too**, and so does `save()` of a new `TimeEntry`. `remove()` and `persist()` only queue work for the flush that never comes — and `TimeEntry` declares a bare `@GeneratedValue`, which on Postgres resolves to a *sequence*, not `IDENTITY`, so not even the insert is forced out early. Loud failure is the lucky case, and you do not get to choose which case you get. Never reach for `readOnly = true` as decoration on a method you have not actually read to the end.

---

## @Transactional does not work on private methods

Purpose: recognise the two ways a correctly-written `@Transactional` silently does nothing, and know why the fix is structural rather than a keyword.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — all methods here are `public`, so the visibility trap is not currently live; `toResponse()` is the one `private` method and it performs no writes.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → read: "Potential Pitfalls" — the self-invocation and visibility traps are covered there with the proxy explanation

`@Transactional` is not a keyword the compiler understands. It works through a **proxy** — an object Spring wraps around your bean that intercepts each call, opens the transaction, calls your real method, and commits. No interception, no transaction. And a private method cannot be intercepted, so the annotation is silently ignored — no error, no warning, no transaction:

```java
// ❌ MAL — @Transactional on a private method has no effect whatsoever
@Transactional
private void approveAndAudit(TimeEntry t) { ... }

// ✅ BIEN — public, so the proxy can intercept it
@Transactional
public void approveAndAudit(TimeEntry t) { ... }
```

> **The proxy is a receptionist, and this is the whole mental model.** Picture your `TimeEntryService` as an office. Spring does not hand callers the office directly — it puts a **reception desk** in front of it. Every visitor arriving from outside stops at reception, and the receptionist opens a file (starts the transaction), sends them in, and closes the file when they come out (commits). That is the proxy. Now the two failures on this page are the same sentence: **a private method is a back door with no reception desk in front of it**, and a self-call is **walking between two rooms inside the office** — you were already past reception, so nobody stamps anything on the way. The receptionist is not *inside* the building; she is at the front door, and she only ever sees people crossing it.

> **Same root cause, sneakier form — calling it from inside the same class.** Even a `public @Transactional` method loses its transaction if you call it *from another method in the same class* instead of going through Spring:
>
> ```java
> @Service
> public class TimeEntryService {
>
>     public void approveAll(List<Long> ids) {
>         ids.forEach(this::approve);   // ← self-call: bypasses the proxy, @Transactional on approve() never runs
>     }
>
>     @Transactional
>     public TimeEntryResponse approve(Long id) { ... }
> }
> ```
>
> Here's why: when Spring creates the `TimeEntryService` bean, what other classes actually get injected is not your raw class — it's a **proxy**, a generated subclass (or JDK dynamic proxy) that wraps your class and adds the transaction logic around each method call. Calls that arrive *from outside* the bean (e.g. `TimeEntryController` calling `timeEntryService.approve(...)`) go through this proxy first, so the transaction logic runs. But `this::approve` above is called as `this.approve(id)` from *inside* the same object — `this` is the raw instance, not the proxy that wraps it, so Java resolves the call directly against the real class and the proxy is never in the path. No proxy means no transaction, exactly like the private-method case, just harder to spot because the method itself is `public` and looks correctly annotated. There is no way to fix this from inside the same class — the standard fix is to move `approve()` into a different `@Service` and inject that bean, so the call is forced out of the object and back through a proxy.

> **Why doesn't Spring just warn you?** Because at the moment it builds the proxy it has no idea which calls will be self-calls — that is decided at runtime, by your code, inside a method body Spring never reads. All it can see is the annotation, and the annotation is legal. This is the price of the whole proxy model: it is completely transparent when it works, and completely invisible when it doesn't. It is also why the failure mode is never an exception — from the JVM's point of view nothing went wrong at all, your method just ran without a transaction around it.

---

## LazyInitializationException — the most common JPA mistake

Purpose: connect the transaction boundary to the Hibernate session boundary, because they are the same line and this exception is what happens when you cross it.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — `toResponse()` reads `timeEntry.getUser().getName()` and `getProject().getName()`, which is exactly the access this section is about.
Docs: [Baeldung — Hibernate could not initialize proxy – no Session](https://www.baeldung.com/hibernate-initialize-proxy-exception) → read: "The Problem" and "Solutions" — the JOIN FETCH solution is the one that matters here

The transaction boundary is also the **Hibernate session** boundary: the session opens with the transaction and closes with it. And a `FetchType.LAZY` relationship is not loaded data — it is a **proxy** (the same trick as the last section, one layer down): a generated subclass of `User` holding only an id and a reference to the open session, which fires its `SELECT` the first time you call a getter on it. Which means the getter only works while the session is alive. Touch it afterwards and the proxy is still sitting there, but the session it was going to ask is gone:

```
org.hibernate.LazyInitializationException: could not initialize proxy
    [com.victor.timetrack.model.User#3] - no Session
```

The bracketed `[com.victor.timetrack.model.User#3]` is the part that saves you: Hibernate names the exact entity and id it was still holding a placeholder for, so it tells you *which* field you touched too late — here, `User` with id 3. ([04-spring-data-jpa.md](./04-spring-data-jpa.md) covers the LAZY/EAGER mechanism itself; this file is where the boundary is drawn.)

```java
// ❌ MAL — the service returns the entity, so the access happens after the session closed
@Transactional(readOnly = true)
public TimeEntry getById(Long id) {
    return timeEntryRepository.findById(id).orElseThrow(...);
}   // ← session closes HERE, on the way out

// Controller — outside the transaction now
TimeEntry t = service.getById(1L);
t.getUser().getName();   // LazyInitializationException — the proxy has nobody to ask
```

> **TimeTrack does not throw this today — and the reason is a bug, not a fix.** `TimeEntry` declares `@ManyToOne` with **no** `fetch` attribute on both `user` and `project`, and the `@ManyToOne` default is **EAGER**. So Hibernate loads the `User` and the `Project` up front, every time, and there is never a proxy left to break. `toResponse()` reading `timeEntry.getUser().getName()` is safe by accident. Do not read that as "TimeTrack got it right": it means every `findByFilter()` returning 40 entries silently drags 40 users and 40 projects along whether the caller wanted them or not. The honest framing is that TimeTrack traded a `LazyInitializationException` for a performance problem — and the day you switch those to `FetchType.LAZY` (which you should), this exception becomes live and the fixes below become mandatory.

**Fix 1 — convert to DTO inside the transaction** (the correct approach, and what TimeTrack already does):

```java
// ✅ BIEN — every getter is called while the session is still open
@Transactional(readOnly = true)
public TimeEntryResponse getById(Long id) {
    TimeEntry t = timeEntryRepository.findById(id).orElseThrow(...);
    return toResponse(t);   // reads getUser().getName() HERE — session still open
}
```

This is why returning DTOs is not just layering hygiene. `toResponse()` runs *inside* the method, therefore inside the transaction, therefore inside the session — so every lazy getter it calls still has somebody to ask. The controller then receives a `TimeEntryResponse` made of plain `String`s and `BigDecimal`s: there are no proxies left in it, so there is nothing that *can* fail later. The DTO pattern accidentally makes this whole class of bug unreachable (see [02-rest-controllers.md](./02-rest-controllers.md)).

**Fix 2 — use JOIN FETCH** when you want the relationship loaded by the query itself:

```java
@Query("SELECT t FROM TimeEntry t JOIN FETCH t.user WHERE t.id = :id")
Optional<TimeEntry> findByIdWithUser(@Param("id") Long id);
```

`JOIN FETCH` tells Hibernate to load the entry and its user in **one** `SELECT`, so no proxy is ever created for `user` and there is nothing to initialise later. Reach for it when you need the association eagerly *for this one query only* — which is the point: it is a per-query decision, unlike the EAGER default which is a per-field decision you cannot escape.

> **Why not just make everything EAGER and delete the problem?** Because you are not deleting the problem, you are relocating it into a place with no exception to warn you — which is precisely the trade TimeTrack made above. EAGER means *every* query for a `TimeEntry` also queries its `User` and its `Project`, forever, including the report that only wanted `hours`. The exception is annoying; loading three tables to render one number is a production incident that never throws. LAZY + `JOIN FETCH` where needed gives you the choice per query. EAGER takes the choice away and hides the cost.

---

## Transaction propagation — REQUIRED, REQUIRES_NEW, NESTED, SUPPORTS

Purpose: decide what happens when a `@Transactional` method calls another one — join the caller's unit, or open a genuinely independent one.
File: no project file — TimeTrack has no `@Transactional` at all, so it has no propagation configured anywhere; everything below is proposed.
Docs: [Baeldung — Transaction Propagation and Isolation in Spring @Transactional](https://www.baeldung.com/spring-transactional-propagation-isolation) → read: "Transaction Propagations" — it walks `REQUIRED`, `REQUIRES_NEW` and `NESTED` with the suspend/resume mechanics

Propagation answers one question: when a `@Transactional` method calls another `@Transactional` method, is that one transaction or two?

| Propagation | Behaviour |
|-----------|----------|
| `REQUIRED` (default) | Join the caller's transaction if there is one; create a new one if not |
| `REQUIRES_NEW` | Always start a new transaction; suspend the caller's until it finishes |
| `NESTED` | Join the caller's transaction, but mark a savepoint first |
| `SUPPORTS` | Join if there is one; run with no transaction at all if not |

How to read that table: the word doing all the work is **"join"**, and it is stronger than it sounds. Joining does **not** mean "run alongside" — it means the inner method's writes become part of the caller's single commit unit and stop being independently committable. Three consequences follow, and they are the whole reason `REQUIRED` is the sane default. The inner method's `@Transactional` opens nothing — it just finds the caller's connection already bound to the thread and uses it. The inner method returning normally commits **nothing** — the commit happens once, when the *outermost* method returns. And an exception anywhere in the chain rolls back **everything**, including work the inner method finished successfully ten lines earlier. One unit, one fate. `REQUIRES_NEW` is the only row that breaks that: it is the only propagation whose writes can survive the caller's rollback.

In practice you never set propagation. `REQUIRED` is correct for essentially every business method, and it is correct precisely *because* of that joining behaviour — "approve the entry and write the audit row" must be one fate, and `REQUIRED` gives you that without a single line of configuration, no matter how many services the call passes through.

The one real use case for `REQUIRES_NEW` is the audit log inverted: you want the record to survive **even when the business operation fails**. If the audit write joined the main transaction, the rollback that undoes the failed approval would also erase the evidence that anyone ever tried — deleting exactly the row you most wanted.

> **Why is a suspended-then-resumed transaction a genuinely separate commit unit?** Because "suspend" is not a pause — it is a **swap of physical database connections**, and that is the entire mechanism. Recall that Spring binds the transaction's JDBC `Connection` to the current thread in a `ThreadLocal`. When the proxy sees `REQUIRES_NEW`, it *unbinds* the outer connection and stashes the whole object aside, then takes a **second, completely different `Connection` from the pool**, calls `setAutoCommit(false)` on it, and binds *that* to the thread. Your inner method now runs against a connection the database sees as an unrelated client session — as far as Postgres is concerned, two different users are connected. The inner method returns, and the proxy sends a real `COMMIT` **on that second connection**. At that instant the write is durable and visible to everyone: the database has finished with it and has no memory of who asked. Only then does the proxy return the second connection to the pool and rebind the outer one to the thread.
>
> So when the outer transaction later rolls back, it issues `ROLLBACK` on **its own** connection — and a rollback can only discard *that* connection's own pending changes. The inner write is not pending on it. It is not pending anywhere; it was committed by a different session and is already permanent. There is no link between the two connections for the database to follow, which is exactly why `REQUIRES_NEW` works: independence is not a policy Spring enforces, it is a physical consequence of the write having happened somewhere else and already being done.
>
> One consequence to keep in mind, because it bites: under JPA the swap is not only a connection, it is a **second `EntityManager`** with its own empty persistence context. So an entity you loaded in the outer method is *not* managed inside the `REQUIRES_NEW` method — it is a foreign object there, and changes you make to it will not be dirty-checked by the inner transaction. Pass ids across that boundary, never entities.
>
> ```
> thread-bound connection over time:
>
>   [outer tx]  conn-A  BEGIN ──── writes ─────────────────── ROLLBACK   ← undoes conn-A's work only
>                         │                              ▲
>              suspend ───┘                              └─── resume
>                         ↓                              ↑
>   [inner tx]          conn-B  BEGIN ── write ── COMMIT ┘   ← already permanent, on another session
> ```

> **`REQUIRES_NEW` vs `NESTED` — the pair everyone confuses.** They read like synonyms and behave like opposites. `REQUIRES_NEW` is **two connections, two transactions**: the inner commits for real and the outer's rollback cannot touch it. `NESTED` is **one connection, one transaction** with a `SAVEPOINT` marked before the inner work: the inner "rollback" rewinds to that savepoint, but the inner work is still uncommitted and belongs to the outer transaction — so if the outer rolls back, the inner work dies with it. Use `REQUIRES_NEW` when the inner work must survive the outer's failure (the audit log). Use `NESTED` when you want to abandon one optional step and keep going, while still committing everything as one unit at the end. If you want the audit row to survive, `NESTED` is exactly the wrong answer.

> **And in TimeTrack, `NESTED` would not even start — it throws on the spot.** Worth knowing before you ever reach for it, because the failure is at startup of the call, not a subtle data bug. Spring Data JPA gives you a `JpaTransactionManager`, whose `nestedTransactionAllowed` flag defaults to **`false`**, so `@Transactional(propagation = NESTED)` fails immediately:
>
> ```
> org.springframework.transaction.NestedTransactionNotSupportedException:
> Transaction manager does not allow nested transactions by default -
> specify 'nestedTransactionAllowed' property with value 'true'
> ```
>
> The reason is honest rather than arbitrary: a savepoint is a **JDBC** concept, so rolling back to one rewinds the *database*, while Hibernate's persistence context — the in-memory entities and their snapshots — knows nothing about it and keeps whatever it had. You would be left with a session whose cached objects claim things the database has just un-said. Spring refuses by default rather than hand you that. So `NESTED` is a real interview answer and a real JDBC feature, but in a Spring Data JPA app it is effectively off — which makes `REQUIRED` and `REQUIRES_NEW` the only two propagations you will actually choose between.

> **The `REQUIRES_NEW` deadlock, in one sentence — because two connections means two lock holders.** If the outer transaction has already written a row (holding a lock on it) and the inner `REQUIRES_NEW` transaction tries to write **the same row**, the inner waits for a lock the outer will only release at commit — and the outer cannot reach its commit because it is blocked waiting for the inner to return. Neither side can move. This is not a rare edge case; it is the ordinary result of pointing `REQUIRES_NEW` at the same table the caller is already touching, and it is the main reason "just add `REQUIRES_NEW`" is bad advice. It also costs a second connection from the pool for the duration — enough concurrent `REQUIRES_NEW` calls and the pool is exhausted by requests waiting on themselves.

---

## Isolation levels — what other transactions can see while yours runs

Purpose: answer the interview follow-up that always comes after propagation, and know why you have never had to set this.
File: no project file — TimeTrack sets no isolation anywhere, so every transaction runs at the PostgreSQL default. Everything below is background, not proposed code.
Docs: [Baeldung — Transaction Propagation and Isolation in Spring @Transactional](https://www.baeldung.com/spring-transactional-propagation-isolation) → read: "Transaction Isolations" — it defines each anomaly with a concrete two-transaction example

Propagation was about *your* transactions colliding with each other. Isolation is about **other people's**. Two managers hit `approve()` on the same entry at the same instant; a report runs `findByFilter()` for three seconds while entries are being submitted underneath it. What is each one allowed to see of the other's unfinished work? That is isolation, and the levels are named after the anomalies they forbid:

| Level | Forbids | The anomaly, concretely |
|---|---|---|
| `READ_UNCOMMITTED` | nothing | **Dirty read** — you see another transaction's write *before* it commits, and it may still roll back. You read data that never existed. |
| `READ_COMMITTED` | dirty reads | **Non-repeatable read** — read the same row twice in your transaction, get two different answers, because someone committed in between. |
| `REPEATABLE_READ` | + non-repeatable reads | **Phantom read** — re-run the same *query* and get an extra row that someone else inserted and committed. |
| `SERIALIZABLE` | + phantom reads | Nothing — the result is as if transactions ran one after another. |

How to read it: the levels are **cumulative** — each row forbids everything above it plus one more anomaly — so reading down the table is reading a slider from "fast and loose" to "slow and safe". The "Forbids" column is what you buy; the price is always the same currency, **concurrency**: stricter levels hold more locks for longer, so more transactions wait, and at `SERIALIZABLE` some are simply aborted and must be retried.

You have never set this, and that is correct. `@Transactional` defaults to `Isolation.DEFAULT`, which means *"whatever the database's own default is"* — Spring passes nothing and the driver leaves it alone. For PostgreSQL that default is **`READ_COMMITTED`**, and it is the right answer for essentially every CRUD app, TimeTrack included: it guarantees you never read data that was never committed, and the two anomalies it allows only matter when one transaction reads the same thing twice and *acts* on the difference — which `approve()` does not do.

> **Two Postgres-specific facts that make the standard table lie, and are worth knowing when you quote it.** First, PostgreSQL does not implement `READ_UNCOMMITTED` at all — ask for it and you silently get `READ_COMMITTED`. Dirty reads are simply not possible in Postgres, on any setting. Second, Postgres's `REPEATABLE_READ` also prevents **phantom reads**, which the table above says only `SERIALIZABLE` does — because it is implemented as snapshot isolation, so your whole transaction sees one frozen picture of the database. The table is the SQL *standard*, which defines the minimum each level must forbid, not the maximum; a database is free to be stricter. So the honest interview answer is "these are the four standard levels and the anomalies they forbid — though Postgres, which I used, only really has two of them and its `REPEATABLE_READ` is stronger than the standard requires."

---

## Common mistake — catching the exception inside the method

Purpose: understand which exceptions actually trigger a rollback, so you do not write a `catch` that quietly turns atomicity off.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — the service catches nothing and lets `BusinessRuleViolationException` propagate, which is the correct shape; keep it that way.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → read: "Rollbacks" — it covers the unchecked-only default and `rollbackFor`

By default `@Transactional` rolls back on **unchecked** exceptions only — anything extending `RuntimeException` or `Error`. It does **not** roll back on checked exceptions. And it can only react to exceptions it actually sees, which are the ones that escape your method. Catch one and stay silent, and the proxy sees a method that returned perfectly normally — so it commits:

```java
// ❌ MAL — the catch swallows the exception, the proxy sees success, everything commits
@Transactional
public void approve(Long id) {
    TimeEntry t = timeEntryRepository.findById(id).orElseThrow(...);
    t.setStatus(EntryStatus.APPROVED);
    try {
        auditRepository.save(new AuditEntry(id, currentManager(), Instant.now()));
    } catch (Exception e) {
        log.error("Audit write failed", e);   // swallowed — no rollback, entry stays APPROVED
    }
}

// ✅ BIEN — let it propagate so the proxy can roll back
@Transactional
public void approve(Long id) {
    TimeEntry t = timeEntryRepository.findById(id).orElseThrow(...);
    t.setStatus(EntryStatus.APPROVED);
    auditRepository.save(new AuditEntry(id, currentManager(), Instant.now()));
    // exception propagates → proxy rolls back → @RestControllerAdvice maps it → clean error response
}
```

The `MAL` version is worse than having no transaction at all, because it *looks* protected. `@Transactional` is right there at the top of the method, and it does nothing — you disabled it four lines lower with a `catch` that felt responsible. Logging an error is not handling it.

> **Why unchecked only — where does that rule come from?** It is Spring copying the old EJB convention, and the reasoning holds up: a checked exception is one the API author *forced* you to think about (`throws IOException`), so it is treated as a foreseen, business-as-usual outcome you are expected to handle and continue from. An unchecked exception is by definition unforeseen — nobody declared it, so nobody planned for it, so the safest assumption is that the operation is broken and its work should not stand. The convention is arguable but the default is not: if you need a checked exception to roll back, say so explicitly with `@Transactional(rollbackFor = IOException.class)`. This default is also why your own `BusinessRuleViolationException` works correctly without any configuration — it extends `RuntimeException` ([05-exception-handling.md](./05-exception-handling.md)), so it is unchecked, so it rolls back.

> **You can catch it and still roll back — but you must say so.** If you genuinely need to log or clean up and still abort, either rethrow after the `catch`, or mark the transaction rollback-only from inside:
>
> ```java
> } catch (Exception e) {
>     log.error("Audit write failed", e);
>     TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();   // commit is now impossible
> }
> ```
>
> `setRollbackOnly()` flips a flag on the current transaction; the proxy checks it before committing and rolls back instead, even though nothing was thrown. Rethrowing is clearer and should be your default — reach for this only when you must swallow the exception for a reason you can defend out loud.

---

## Where this leaves you — and what comes next

The picture from the last three files is now closed. Security says **who** ([06](./06-security-jwt.md)), validation says **what** ([07](./07-validation.md)), and the transaction says **all of it or none of it** — so a broken business rule thrown from deep inside `approve()` leaves the database exactly as it was before the request arrived. [11-business-logic-domain-modeling.md](./11-business-logic-domain-modeling.md) completes the trio from the rules side: the entity *detects*, the transaction *undoes*, the `@RestControllerAdvice` *reports*.

And now look back at what you have actually been promised in this file, and by whom. That the rollback happened. That `readOnly = true` did not eat your update. That the annotation on that method is on the proxy's path and not bypassed by a self-call. **Every single failure on this page is invisible** — no exception, no log line, no red text. A swallowed exception commits silently. A self-call runs without a transaction silently. A read-only write vanishes silently. You cannot read this correctness off the code, because the code looks identical in both the working and the broken case: the annotation is right there either way.

Which leaves exactly one way to know: make it fail on purpose and watch the row. Write a test that throws inside the method and then asserts the entry is *still* `SUBMITTED` — that assertion is the only thing standing between you and a `@Transactional` that has quietly done nothing since the day you added it. [09-testing.md](./09-testing.md) is where you learn to write it: JUnit 5 and Mockito for the service logic, `@DataJpaTest` for the layer where transactions actually live, and the small twist that trips everyone up first — `@Transactional` on a *test* method means something different, because Spring rolls your test's writes back on purpose to keep the database clean between tests.
