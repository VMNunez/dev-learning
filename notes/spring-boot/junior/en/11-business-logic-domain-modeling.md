# Business Logic and Domain Modelling

Docs: [Baeldung — The Anemic Domain Model](https://www.baeldung.com/java-anemic-vs-rich-domain-objects) → read: "Anemic Domain Model" and "Rich Domain Model"

[08-transactions.md](08-transactions.md) gave you the boundary: a business operation runs inside one `@Transactional` method, so either every change lands in the database or none of them does. [05-exception-handling.md](05-exception-handling.md) gave you the exit door: when a rule is broken you `throw` a custom exception (`BusinessRuleViolationException`) and `@RestControllerAdvice` turns it into a clean 409/400 JSON body.

What neither file answered is the question in the middle: **the rules themselves — where do they live?** A transaction boundary protects rules it never reads. An exception handler reports a rule it never checks. The rules are still floating somewhere in your code, and *where you put them* is what this file is about.

This is not academic. It is the single question an interviewer will use to separate a junior who copied a tutorial from one who thought about the design, and in TimeTrack it has a name: the `DRAFT → SUBMITTED → APPROVED/REJECTED` workflow you are writing right now in `TimeEntryService`.

---

## The rule that has no home — the TimeTrack workflow

Purpose: understand the concrete business problem before looking at any pattern — the workflow is the running example for the whole file.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/EntryStatus.java`
Docs: [Baeldung — Java Enums](https://www.baeldung.com/a-guide-to-java-enums) → read: "Fields, Methods and Constructors in Enums" (an enum is a real class — it can hold behaviour, not just names)

A `TimeEntry` in TimeTrack is not a static row. It has a **life**: an employee creates it, edits it while it is still private, sends it to a manager, and the manager either signs it off or bounces it back. That life is expressed as four values in one enum:

```java
public enum EntryStatus {
    DRAFT, SUBMITTED, APPROVED, REJECTED;
}
```

Those four names are the easy part. The hard part is the invisible rules *between* them:

```
        submit()               approve()
DRAFT ───────────► SUBMITTED ───────────► APPROVED
                       │
                       │  reject()
                       └─────────────────► REJECTED

Legal:   DRAFT→SUBMITTED, SUBMITTED→APPROVED, SUBMITTED→REJECTED
Illegal: DRAFT→APPROVED   (nobody approved it — you skipped the manager)
         APPROVED→DRAFT   (payroll already paid for those hours)
         REJECTED→APPROVED(a manager said no; nobody may quietly flip it)
         APPROVED→APPROVED(a double-approve, usually a bug or a double-click)
```

Read the diagram as a **state machine**: the boxes are the states an entry can be in, the arrows are the only moves the business allows, and every arrow is triggered by one action. Anything not drawn as an arrow is illegal — and "illegal" here does not mean "ugly", it means **an entry could get paid without a manager ever seeing it**.

> **Why is this called a "state machine" and not just "some if checks"?** Because the set of legal moves depends only on the state you are in right now, never on how you got there. An entry that is `SUBMITTED` can be approved or rejected — full stop. It does not matter whether it was submitted a second ago or edited fifteen times before that. That property is what lets you write the rules down as a small table instead of a growing pile of conditions, and it is exactly the property scattered `if` statements destroy.

The states themselves are enforced by the type system — `status` is an `EntryStatus`, so no one can set it to `"BANANA"`. The **transitions** are enforced by nobody. `TimeEntry` is annotated with Lombok's `@Data`, which generates a public `setStatus(EntryStatus)`. That means this line compiles, runs, and silently pays an employee:

```java
entry.setStatus(EntryStatus.APPROVED);   // from any class, from any state, no check
```

That single line is the whole problem. Everything below is an answer to it.

---

## Anemic vs rich domain model

Purpose: name the two ways a Spring codebase can distribute business logic, so you can defend the one you chose in an interview.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`
Docs: [Baeldung — Anemic vs Rich Domain Objects](https://www.baeldung.com/java-anemic-vs-rich-domain-objects) → read: "Anemic Domain Model" — it uses the same shape of example (an entity with only getters/setters and a service holding the rules)

Your `TimeEntry` today is a textbook **anemic** entity — data and nothing else:

```java
@Data
@Entity
@Table(name = "time_entries")
public class TimeEntry {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false) private LocalDate date;
    @Column(nullable = false) private BigDecimal hours;
    @Column(nullable = false) private String description;

    @Enumerated(EnumType.STRING)
    private EntryStatus status = EntryStatus.DRAFT;

    private String rejectionNote;
    // + timestamps
}
```

"Anemic" (a word Martin Fowler picked deliberately — *anaemic*, bloodless, drained of life) means the object carries state but has **no behaviour of its own**. It cannot *do* anything; things are done *to* it. All the knowledge about what a `TimeEntry` is allowed to do sits one layer up, in `TimeEntryService`, in the form of `if` checks.

The opposite is a **rich domain model**: the entity owns the rules that protect its own data. In a rich version, nobody sets the status from outside — you ask the entry to submit itself, and it decides:

```java
// rich version — the rule lives INSIDE the entity
public void submit() {
    if (this.status != EntryStatus.DRAFT) {
        throw new BusinessRuleViolationException("Employee can only submit DRAFT entries");
    }
    this.status = EntryStatus.SUBMITTED;
}
```

The difference is not stylistic. It is about **what is reachable**. In the anemic version the rule is a check the caller *chooses* to run; in the rich version it is a wall the caller *cannot go around*, because there is no other way in.

| | Anemic entity + fat service | Rich domain model |
|---|---|---|
| Where the rule lives | `TimeEntryService.submit()` | `TimeEntry.submit()` |
| How status changes | `entry.setStatus(SUBMITTED)` | `entry.submit()` |
| Can the rule be bypassed? | Yes — any class can call the setter | No — the setter is private/absent |
| Needs Spring beans (repos)? | Yes, freely | No — the entity has no dependencies |
| Unit test needs | Mockito mocks for the repos | `new TimeEntry()` and one assertion |
| What Spring teams actually ship | This, ~90% of the time | Rare outside DDD shops |

How to read that table: the row that decides the argument is **"Can the rule be bypassed?"** — every other row is a trade-off you can live with either way, but that one is a correctness property. And the row that explains why the anemic style still dominates is **"Needs Spring beans"**: an entity is created by Hibernate, not by the Spring container, so it cannot have a repository injected into it. The moment a rule needs to *ask the database something* ("does this user already have 8 hours logged that day?"), it physically cannot live inside the entity. That rule belongs to the service, full stop.

> **This is why the honest answer is "both", not "rich is better".** Split the rules by what they need. A rule that only reads the entity's own fields (`status`, `hours`, `date`) is an **invariant** — something that must be true of *this object* at all times — and it belongs on the entity. A rule that needs other rows, the logged-in user, or a repository is a **use-case rule** and belongs in the service. Under that split, `submit()`'s status check goes on the entity (it reads only `this.status`), while "you can only submit your own entries" stays in the service (it needs the authenticated `User`).

> **Why doesn't Spring push you toward rich models?** Because the whole framework is built around stateless singleton beans: `@Service`, `@Repository` and `@Controller` are objects Spring creates once and shares, and the natural place to put logic in that architecture is a bean — an entity is just what JPA loads and saves. Add `@Data` on top (Lombok hands you a public setter for every field, no questions asked) and the anemic style is the path of least resistance. Knowing *why* it is the norm — and that it is a default, not a law — is the difference between "I did what the tutorial did" and "I chose this".

**The interview question, verbatim:** *"What stops someone calling `setStatus(APPROVED)` from anywhere in your codebase?"* In your current code, the honest answer is: **nothing**. That is fine — as long as you follow it with what you would do about it, which is the next section.

---

## Guarding the state machine in ONE place — `canTransitionTo()`

Purpose: replace the status checks scattered across `submit()`, `approve()`, `reject()`, `update()` and `delete()` with a single reviewable definition of which transitions are legal.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java`
Docs: [Baeldung — Java Enums](https://www.baeldung.com/a-guide-to-java-enums) → read: "Fields, Methods and Constructors in Enums" — the mechanism behind putting `canTransitionTo()` on `EntryStatus` itself

### The pain first — where the rules live right now

The workflow rules in `TimeEntryService` are real and correct, but they are **spread across five methods**, each holding one fragment of the diagram:

```java
// submit()
if (timeEntry.getStatus() != EntryStatus.DRAFT) {
    throw new BusinessRuleViolationException("Employee can only submit DRAFT entries");
}
timeEntry.setStatus(EntryStatus.SUBMITTED);

// approve()
if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
    throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
}
timeEntry.setStatus(EntryStatus.APPROVED);

// reject()
if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
    throw new BusinessRuleViolationException("Manager can only reject SUBMITTED entries");
}
timeEntry.setStatus(EntryStatus.REJECTED);

// update()  → if (!status.equals(DRAFT)) throw …
// delete()  → if (!status.equals(DRAFT)) throw …
```

Nothing here is *wrong*. The problem is that the state machine — the diagram at the top of this file — **exists nowhere in the code**. It only exists in your head, projected onto five separate `if` statements sitting in five separate methods. Three consequences follow, and every one of them is a real bug waiting:

1. **Nobody can review it.** To answer "which transitions are legal?" a reviewer must read every method of the service and reassemble the diagram mentally. If one branch is missing, there is nothing to compare it against.
2. **It drifts the moment a sixth method appears.** Add `reopen()` next sprint and the check is copy-pasted a sixth time — or, far more likely, the author writes `entry.setStatus(DRAFT)` and forgets the guard entirely. Nothing in the code stops them: the compiler is perfectly happy, the tests for the other five methods still pass, and an `APPROVED` entry silently walks back to `DRAFT`.
3. **The condition drifts too.** Notice you already wrote the same check two ways — `!=` in `submit()`, `.equals()` in `approve()`. Both work on enums (see the callout below), but it is the fingerprint of copy-paste, and copy-paste is how a `!` gets dropped.

> **`!=` or `.equals()` for enums — which one?** Both are correct and `==`/`!=` is the idiomatic choice. An enum constant is a **singleton**: the JVM creates exactly one `EntryStatus.DRAFT` object for the whole application and every reference points to that same object, so reference comparison (`==`) and value comparison (`.equals()`) can never disagree. `==` is also **null-safe** — `status == DRAFT` on a null status is simply `false`, while `status.equals(DRAFT)` throws `NullPointerException`. Pick `==`/`!=` and use it everywhere; the value of consistency here is that a reader stops having to check whether the difference *meant* something.

### The fix — write the diagram down, once

The rule you are looking for is one Victor-sized sentence: **the state machine must exist as one artefact in the code, not as a pattern spread over the methods that use it.** The cleanest place for it is on `EntryStatus` itself, because a Java enum is a real class — it can hold fields and methods, not just constant names.

```java
public enum EntryStatus {
    DRAFT, SUBMITTED, APPROVED, REJECTED;

    public boolean canTransitionTo(EntryStatus target) {
        return switch (this) {
            case DRAFT     -> target == SUBMITTED;
            case SUBMITTED -> target == APPROVED || target == REJECTED;
            case APPROVED, REJECTED -> false;   // terminal states — no way out
        };
    }
}
```

That method **is** the diagram. Read it top to bottom and you get exactly the arrows drawn at the start of this file: `DRAFT` goes only to `SUBMITTED`; `SUBMITTED` forks to `APPROVED` or `REJECTED`; `APPROVED` and `REJECTED` are **terminal** — no arrow leaves them, so every target returns `false`. A reviewer answers "which transitions are legal?" by reading four lines, and a new state (`REOPENED`) cannot be added without the compiler forcing you to say what it can transition to — an exhaustive `switch` over an enum fails to compile when a constant is unhandled:

```
error: the switch expression does not cover all possible input values
```

> **Why the enum and not the entity or the service?** Three tests. Does the rule need the database? No — it reads nothing but the current status and the target, so it does not belong in the service. Does it need any other field of the entry (`hours`, `user`)? No — so it does not even need `TimeEntry`. Does it belong to the *concept of status*? Yes, entirely. The rule lives on the smallest thing that fully knows it, and here that is `EntryStatus`. As a bonus you get the cheapest possible test — no Spring, no Mockito, no database: `assertFalse(EntryStatus.APPROVED.canTransitionTo(EntryStatus.DRAFT))`.

> **What about a transition *map* instead of a `switch`?** Same idea, different shape: `Map<EntryStatus, Set<EntryStatus>>` holding the legal targets per state. It is the version you reach for when the transitions become data (loaded from config, different per client) or when you need to *ask* the machine what is possible — e.g. to tell Angular which buttons to enable. For four hard-coded states, the `switch` is exhaustive-checked by the compiler and a map is not, so the `switch` wins. Name the map in the interview anyway; knowing when each shape pays off is the actual signal.

### Wiring it into the entity, so it cannot be skipped

`canTransitionTo()` only *answers* a question. Somebody still has to *ask* it — and if the asking is left to the service, you are back to five call sites that a sixth method can forget. So you make the entity ask, by giving `TimeEntry` the one method that is allowed to touch the status:

```java
// in TimeEntry — the single door every status change must walk through
public void transitionTo(EntryStatus target) {
    if (!this.status.canTransitionTo(target)) {
        throw new BusinessRuleViolationException(
            "Cannot transition from " + this.status + " to " + target);
    }
    this.status = target;
}
```

And the service methods lose their `if` blocks entirely:

```java
// ❌ BEFORE — the rule is here, and in four other methods
if (timeEntry.getStatus() != EntryStatus.DRAFT) {
    throw new BusinessRuleViolationException("Employee can only submit DRAFT entries");
}
timeEntry.setStatus(EntryStatus.SUBMITTED);

// ✅ AFTER — the service says WHAT should happen; the entity decides IF it may
timeEntry.transitionTo(EntryStatus.SUBMITTED);
```

Notice what the service kept and what it gave away. It gave away the *transition* rule (pure state, no dependencies). It kept the *authorisation* rule, because that one needs the logged-in user — a thing an entity has no access to:

```java
// stays in the service — needs SecurityContextHolder and the User row
if (!timeEntry.getUser().getId().equals(user.getId())) {
    throw new UnauthorizedException("You can only submit your own time entries");
}
timeEntry.transitionTo(EntryStatus.SUBMITTED);   // the entity guards the rest
```

That is the split from the previous section made concrete: **invariants on the entity, use-case rules in the service.**

> **The setter is still open — close it.** `@Data` on `TimeEntry` generates a public `setStatus()`, so `transitionTo()` is currently a *polite* door next to an open window. The fix is one annotation: `@Setter(AccessLevel.NONE)` on the `status` field, which tells Lombok to generate no setter for it. Hibernate does not care — it writes the field by reflection when it loads a row, not through your setter — so persistence keeps working while application code loses the bypass. Now `entry.setStatus(APPROVED)` does not compile, and "what stops someone calling `setStatus(APPROVED)`?" has an answer: **the compiler does.**

```java
@Enumerated(EnumType.STRING)
@Setter(AccessLevel.NONE)          // no public setter — transitionTo() is the only way in
private EntryStatus status = EntryStatus.DRAFT;
```

> **Why does the exception come from inside the entity — isn't throwing a "Spring" thing?** `BusinessRuleViolationException` is your own unchecked exception ([05-exception-handling.md](05-exception-handling.md)) — a plain Java class extending `RuntimeException`, with no Spring dependency. It travels up the call stack out of the entity, out of the service, out of the controller, and `@RestControllerAdvice` maps it to the HTTP status you configured. The entity *detects*, the advice *reports* — and the missing third piece is the one that *undoes*.

> **Open gap in your current code: `TimeEntryService` has no `@Transactional` on any method.** Go and look — `create()`, `submit()`, `approve()`, `reject()`, `update()` and `delete()` are all bare `public` methods. Today each one happens to survive that because it performs a single `save()`, and Spring Data wraps every repository call in its own little transaction, so the one write either lands or it doesn't. The day a method does *two* writes (approve the entry **and** append a row to an audit table), the first can commit and the second blow up, and you are left with exactly the half-written state [08-transactions.md](08-transactions.md) exists to prevent — the transaction is what makes the whole operation all-or-nothing. Annotate the write methods with `@Transactional` (and the read ones with `@Transactional(readOnly = true)`), and then an illegal transition thrown from inside the entity rolls the whole operation back, leaving **no** trace in the database. That is when the three files finally click together: the entity *detects*, the transaction *undoes*, the advice *reports*.

---

## Where a derived value is computed — hours worked

Purpose: decide where a value that is *calculated from other data* (a monthly total, a per-project sum) is produced, and understand what goes stale in each option.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java`
Docs: [Baeldung — Spring Data JPA @Query](https://www.baeldung.com/spring-data-jpa-query) → read: "JPQL" and the aggregation examples

TimeTrack stores `hours` per entry as a `BigDecimal`. But the screen a manager actually wants shows **"Ana — 148.5h this month"**. That number is not stored anywhere: it is *derived* from many rows. The moment a value is derived, you have to answer where it gets computed — and every answer trades **freshness** against **query cost**.

There are three places, and they are the same three in every project you will ever join:

| Where | How it looks | Always correct? | Can SQL filter/sort by it? |
|---|---|---|---|
| A persisted column | `@Column private BigDecimal monthlyTotal;` | No — stale the moment an entry is edited | Yes |
| A `@Transient` getter | `@Transient public BigDecimal getTotal()` | Yes — recomputed on every read | No |
| A `SUM` in the query | `@Query("SELECT SUM(e.hours) …")` | Yes — the database computes it now | Yes |

How to read that table: the two columns are the whole trade-off. **"Always correct?"** asks whether the value can ever disagree with the rows it came from; **"Can SQL filter/sort by it?"** asks whether the value exists in the database, because a value your Java code computes after loading is invisible to `WHERE` and `ORDER BY` — you cannot ask Postgres for "employees over 160h" if the 160h only exists in the JVM.

**The persisted column** is the tempting one and the classic junior trap. You add a `monthlyTotal` column, update it in `create()`, and it is instantly wrong: `update()` changes an entry's `hours` and, unless you remember to recompute *there too*, and in `delete()`, and in every future method that touches `hours`, the stored total drifts away from the truth. This is exactly the bug the previous section was about, in a new costume — **a rule (the total must equal the sum) that is enforced in some places and forgotten in others.** A stored derived value is a state machine with a hundred transitions and no `canTransitionTo()`. Only accept it when the read volume genuinely demands it, and then keep the recalculation in *one* place.

**The `@Transient` getter** puts the calculation on the object, computed on demand from the data already loaded:

```java
@Transient   // computed, never a column — Hibernate must not try to persist it
public BigDecimal getDurationInMinutes() {
    return hours.multiply(new BigDecimal("60"));
}
```

`@Transient` is the annotation that tells JPA "ignore this — it is not a column". Without it, Hibernate sees a getter named `getDurationInMinutes()`, infers a property, and fails on startup because no such column exists in `time_entries`. It is the right tool for a value derived from **the entity's own fields** and it can never go stale — it is recomputed on every call. What it cannot do is aggregate across rows: computing a monthly total this way means loading every entry of the month into memory and summing them in Java, which is fine for 30 rows and a disaster for 30,000.

**The `SUM` in the query** is the correct home for anything derived across rows. The database is built for exactly this, it reads the rows without shipping them to your JVM, and the number is by definition current:

Your `TimeEntryRepository` today holds exactly one derived query — `List<TimeEntry> findByUser(User user)` — and no totals at all. The reporting method below is the one you would add:

```java
// TimeEntryRepository — proposed, not written yet
@Query("SELECT SUM(e.hours) FROM TimeEntry e " +
       "WHERE e.user = :user AND e.date BETWEEN :from AND :to " +
       "AND e.status = com.victor.timetrack.model.EntryStatus.APPROVED")
BigDecimal totalApprovedHours(@Param("user") User user,
                              @Param("from") LocalDate from,
                              @Param("to") LocalDate to);
```

> **`SUM` over zero rows returns `null`, not `BigDecimal.ZERO`.** SQL is being literal: the sum of nothing is undefined, not zero. So a brand-new employee's total comes back as `null` and the first arithmetic you do on it throws `NullPointerException` — a 500 for a user who has done nothing wrong. Return `Optional<BigDecimal>`, or wrap it (`COALESCE(SUM(e.hours), 0)`), and never assume a total is non-null. This is the single most common bug in a first reporting endpoint.

> **Notice the query filters on `APPROVED`.** "Hours worked" is a business question, not an arithmetic one — a `DRAFT` entry the employee has not even submitted is not worked time anyone will pay for. Which statuses count toward a total is a business rule exactly like a transition rule, and the same principle applies: write it down in **one** place (this query, this method name) so a second reporting endpoint cannot quietly choose a different definition and produce a different number on a different screen.

> **Why `BigDecimal` and not `double` for hours?** `double` is binary floating point and cannot represent `0.1` exactly — it stores the nearest binary approximation, so summing many decimal hours accumulates a visible error (the classic `0.1 + 0.2 == 0.30000000000000004`). Hours become money on a timesheet, and money must not drift. `BigDecimal` stores the decimal digits and the scale exactly. The price you pay is that `new BigDecimal("0.5")` is an object, not a primitive — which is why the validation in your `create()` reads `request.getHours().compareTo(min) < 0` instead of `<`. `compareTo` returns a negative number, zero, or a positive number, so `< 0` means "less than". And never compare a `BigDecimal` with `.equals()`: it compares the *scale* too, so `2.0` and `2.00` are not equal — `compareTo(…) == 0` is.

---

## What this looks like in an interview

Purpose: turn the three decisions above into the answers a Spanish consultancy actually screens for.
Docs: [Baeldung — Anemic vs Rich Domain Objects](https://www.baeldung.com/java-anemic-vs-rich-domain-objects) → read the conclusion, then re-read the trade-off table in this file

You will not be asked "define an anemic domain model". You will be shown code — often your own — and asked one of these:

- **"What stops someone calling `setStatus(APPROVED)` from anywhere in your codebase?"** The highest-signal question in this whole workflow. A weak answer says "nothing, but we don't do that". A strong answer names the bypass, then closes it: no public setter (`@Setter(AccessLevel.NONE)`), a single `transitionTo()` door, and the legal moves defined once in `EntryStatus.canTransitionTo()`.
- **"Which transitions are illegal, and where in your code is that written down?"** If the answer is "spread across five service methods", you have just described the drift. If it is "one exhaustive `switch` on the enum, and adding a state breaks the build until I handle it", you have described a design.
- **"Where does the monthly total come from, and what happens when an entry changes?"** They are probing for the stale-column trap. Say `SUM` in the query, say why (it cannot go stale, the database does the work, and `WHERE`/`ORDER BY` can use it), and mention the `null`-on-zero-rows landmine — that last detail is what says you have actually run it.
- **"Rich or anemic — which did you choose?"** Never answer with an ideology. Answer with the split: invariants that read only the object's own state go on the entity; rules that need repositories, other rows, or the authenticated user stay in the service, because an entity is built by Hibernate and cannot have beans injected into it.

---

## Where this goes next

You now have the three layers of a business operation lined up: the **rule** lives on the smallest object that fully knows it, the **transaction** ([08-transactions.md](08-transactions.md)) makes the whole operation all-or-nothing, and the **exception** ([05-exception-handling.md](05-exception-handling.md)) carries a broken rule out to the client as a clean HTTP response.

And then you deploy it — and one Monday morning a manager tells you an entry is `APPROVED` that nobody ever submitted. No exception was thrown, no test failed, the row is simply in a state your diagram says is unreachable. A bad state transition is the archetypal production bug: it leaves no stack trace, only a wrong row, and finding it means reasoning backwards from data to the code path that could have produced it. That hunt — logs, correlation ids, actuator, and how to read a system you cannot attach a debugger to — is `12-production-debugging.md`.

> **Forward reference:** `12-production-debugging.md` is not written yet. When it is, this is the thread it picks up: a corrupt state is *how* the design flaw in this file becomes visible, weeks later, in production.
