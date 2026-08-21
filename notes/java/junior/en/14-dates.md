# Date and Time

> 📖 [Baeldung — Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)
> 📖 [Oracle Docs — Date and Time API](https://docs.oracle.com/javase/tutorial/datetime/index.html)

An enum (the previous file) let you restrict a type to a small, fixed set of values. The next everyday modelling need is time itself — an employee's hire date, a task deadline, the exact moment a row was created. Before Java 8, this was a trap.

Working with dates was painful. The `Date` class stored milliseconds since 1970 and its month was 0-indexed (January = 0). `Calendar` was the "fix" but was verbose and mutable — you could accidentally change a date you passed to another method and create subtle bugs. Java 8 introduced the `java.time` package, which is immutable (every operation returns a new object), self-documenting, and does not have the indexing quirks. You will use it in every project from day one.

---

## The three main types

You have three classes depending on what you need to represent. The most important thing to understand: **none of these store a timezone**. They represent civil time — the date and time as you would write it on a calendar or a clock, without any timezone attached. Use them for business logic like employee hire dates, task deadlines, and timestamps.

| Class | What it represents | Example |
|-------|-------------------|---------|
| `LocalDate` | A date with no time | `2026-05-11` |
| `LocalTime` | A time with no date | `14:30:00` |
| `LocalDateTime` | A date and time together | `2026-05-11T14:30:00` |

Read each row as: "if I need to represent *(middle column)*, reach for *(left column)*, and a value looks like *(right column)*." Pick the smallest type that carries what you actually need — a birthday is a `LocalDate`, not a `LocalDateTime` with a meaningless `00:00:00` tacked on.

A quick way to see how the four `java.time` types relate: `LocalDateTime` is just a `LocalDate` and a `LocalTime` glued together, and `Instant` is the one that pins itself to UTC.

```
                    a date          a time
                 ┌───────────┐  ┌───────────┐
   LocalDate ───▶│ 2026-05-11│  │ 14:30:00  │◀─── LocalTime
                 └───────────┘  └───────────┘
                        └──────┬──────┘
                               ▼
                       LocalDateTime          ← no timezone (wall clock)
                    2026-05-11T14:30:00

                       Instant                ← a point in UTC (absolute)
                 2026-05-11T12:30:00.123456Z
```

---

## Instant — an exact point in time, with no timezone ambiguity

The three classes above have a limit that doesn't show up until your app runs in more than one place: they are "wall-clock time". `LocalDateTime.now()` gives you the date and time as shown by the clock **of the server where the code runs**, without saying which timezone that clock is in. If your server is in Madrid, `LocalDateTime.now()` at 14:30 on May 11 gives you `2026-05-11T14:30:00` — but if you deploy that same code to a server configured for UTC, without changing a single line, that same physical instant returns a different value (`2026-05-11T12:30:00`), because `LocalDateTime` has no idea there is a timezone difference to account for.

> Think of it this way: `LocalDateTime` is like saying "it's 14:30" without saying which city — it depends on where you're standing to know what absolute time that means. `Instant` is like saying "it's 12:30 UTC" — a single point in time, the same for anyone reading it, no matter where they live.

`Instant` represents exactly that: a point in time measured in UTC (universal time), independent of whichever timezone the generating server happens to be in. That is why it's the class used for **technical timestamps** — the exact moment a system event happened (an error, a log entry, a row being created) — while `LocalDate`/`LocalDateTime` remain correct for **business dates** (a time-entry's date, an employee's birthday), where what matters is the date as a person would write it, not the universal instant.

```java
Instant now = Instant.now();   // 2026-05-11T12:30:00.123456Z
```

The trailing `Z` means "Zulu time", the military/aviation name for UTC — it's how `Instant` makes explicit, right in the text itself, that there's no need to ask "what timezone is this in?".

| Class | What it represents | Stores a timezone? | When to use it |
|-------|--------------------|---------------------|-----------------|
| `LocalDateTime` | "Wall-clock" date and time | No — depends on where it runs | Business dates: birthdays, an entry's date, a deadline |
| `Instant` | An exact point in UTC | Yes, implicitly (always UTC) | Technical timestamps: when an error happened, when a log was created |

The "Stores a timezone?" column is what decides which one to reach for: if two servers in different timezones need to agree on "when this happened" with zero ambiguity, you need `Instant`; if you want the date as a human would see it filling out a form, `LocalDateTime`/`LocalDate` is the right call.

> **Preview — Spring Boot:** you'll see `Instant` in the `ErrorResponse` DTO that centralizes API errors (`notes/spring-boot/junior/en/05-exception-handling.md`) — an error's timestamp is exactly the "technical, not business" case the table above describes.

---

## Creating values

All three classes follow the same creation pattern: `.now()` for the current moment, `.of(...)` for a specific date or time, and `.parse()` for a date coming in as a string (common when the client sends a date in the request body). Note that months in `java.time` are 1-indexed — January is 1, not 0.

```java
// Current date and time
LocalDate today = LocalDate.now();               // 2026-05-11
LocalTime now   = LocalTime.now();               // 14:30:00
LocalDateTime dt = LocalDateTime.now();          // 2026-05-11T14:30:00

// Specific value
LocalDate birthday  = LocalDate.of(1994, 3, 15);
LocalTime meeting   = LocalTime.of(10, 30);
LocalDateTime event = LocalDateTime.of(2026, 6, 1, 9, 0);

// From a string
LocalDate parsed = LocalDate.parse("2026-05-11");          // ISO format by default
LocalDate parsedCustom = LocalDate.parse("11/05/2026",
    DateTimeFormatter.ofPattern("dd/MM/yyyy"));
```

---

## Reading values

Once you have a `LocalDate` or `LocalDateTime`, you extract individual parts with getter methods. These are useful when you need to display a date in pieces — for example, showing the year in a header or the day of the week in a calendar.

```java
LocalDate date = LocalDate.of(2026, 5, 11);

date.getYear();        // 2026
date.getMonthValue();  // 5
date.getDayOfMonth();  // 11
date.getDayOfWeek();   // MONDAY
```

> **`getMonthValue()` vs `getMonth()`:** these two look interchangeable but return different types. `getMonthValue()` gives you the number (`5`), which is what you want for calculations or building another date. `getMonth()` gives you a `Month` enum constant (`MAY`) — useful when you want the name rather than the number. Reach for `getMonthValue()` by default; pick `getMonth()` only when you actually need the enum.

---

## Formatting

Turning a date into a string is the reverse of parsing. By default `toString()` already gives you the ISO format (`2026-05-11`), which is what you always want for APIs and databases — it is unambiguous and every system understands it. When you need a different layout for a human to read (a Spanish `dd/MM/yyyy`, or a spelled-out month), you build a `DateTimeFormatter` with a pattern and pass it to `.format()`. This is **display only** — never store or send a custom-formatted date; format at the last moment, for the screen.

```java
LocalDate date = LocalDate.of(2026, 5, 11);

// Standard ISO format — always use for APIs and databases
date.toString();  // "2026-05-11"

// Custom format — for display only
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
date.format(formatter);  // "11/05/2026"

DateTimeFormatter longFormat = DateTimeFormatter.ofPattern("d MMMM yyyy");
date.format(longFormat);  // "11 May 2026"
```

---

## Adding and subtracting

All `java.time` classes are immutable — `plusDays` and `minusDays` do not change the original, they return a new object. Always assign the result:

> **This is the number-one date bug.** `date.plusDays(7);` on its own does nothing you can see — the new date is computed and immediately thrown away, because `date` still points to the old value. The call *looks* like it mutated `date`, but immutability means the only way to keep the result is to capture it: `date = date.plusDays(7);` or `LocalDate next = date.plusDays(7);`. This is exactly why the old mutable `Calendar` was dangerous and why `java.time` chose immutability instead.

```java
LocalDate date = LocalDate.of(2026, 5, 11);

date.plusDays(7);    // 2026-05-18
date.plusMonths(1);  // 2026-06-11
date.plusYears(1);   // 2027-05-11

date.minusDays(3);   // 2026-05-08
date.minusMonths(2); // 2026-03-11
```

---

## Comparing dates

Never use `==` to compare `LocalDate` or `LocalDateTime` objects — `==` compares references, not values, just like with `String`. Use the purpose-built methods: `isBefore()`, `isAfter()`, and `isEqual()`. For sorting, `compareTo()` works the same way as `String.compareTo()` — negative if the first date comes before, zero if equal, positive if after.

```java
LocalDate a = LocalDate.of(2026, 1, 1);
LocalDate b = LocalDate.of(2026, 6, 1);

a.isBefore(b);  // true
a.isAfter(b);   // false
a.isEqual(b);   // false

a.compareTo(b); // negative number — a is before b (same as String.compareTo)
```

> **`isEqual()` vs `equals()`:** for `LocalDate` both return the same answer, so you can use either. The difference matters on the timezone-aware types (like `ChronoLocalDate` implementations or `ZonedDateTime`): `isEqual()` compares the point on the timeline, while `equals()` also requires the objects to be the same *class/chronology*. For plain `LocalDate` comparisons, prefer `isEqual()` for readability — it reads as "is this the same date?".

---

## Period and Duration

When you need to know *how much time has passed* between two dates or times, use `Period` (for calendar-based differences in days/months/years) or `Duration` (for precise differences in hours, minutes, seconds):

```java
// Period — difference in years, months, days (for dates)
LocalDate start = LocalDate.of(2024, 1, 1);
LocalDate end   = LocalDate.of(2026, 5, 11);

Period p = Period.between(start, end);
p.getYears();   // 2
p.getMonths();  // 4
p.getDays();    // 10

// Duration — difference in hours, minutes, seconds (for times)
LocalDateTime a = LocalDateTime.of(2026, 5, 11, 9, 0);
LocalDateTime b = LocalDateTime.of(2026, 5, 11, 17, 30);

Duration d = Duration.between(a, b);
d.toHours();    // 8
d.toMinutes();  // 510
```

---

## Spring Boot connection

> **Preview — Spring Boot:** This section uses `@Entity`, `@Column`, and `@PrePersist` — JPA annotations you haven't studied yet. Read it to see how Java dates appear in a real database entity — you'll implement this in the Spring Boot notes.

### In a JPA entity

```java
@Entity
public class Employee {

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

Spring Data JPA maps `LocalDate` to a SQL `DATE` column and `LocalDateTime` to a `TIMESTAMP` column automatically — no extra annotation needed.

### In a DTO

```java
public record EmployeeDTO(
    String name,
    LocalDate hireDate,
    LocalDateTime createdAt
) {}
```

Jackson (the JSON library Spring Boot uses) serializes `LocalDate` as `"2026-05-11"` and `LocalDateTime` as `"2026-05-11T14:30:00"` automatically.

### Common pattern — set createdAt on save

```java
@Entity
public class Employee {

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
```

`@PrePersist` runs just before the entity is saved for the first time. `updatable = false` prevents JPA from changing the column on updates.

---

## Quick reference

```java
LocalDate.now()                        // today
LocalDate.of(year, month, day)         // specific date
LocalDate.parse("2026-05-11")          // from ISO string
date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))  // to custom string
date.plusDays(n) / date.minusDays(n)   // add or subtract
date.isBefore(other) / date.isAfter(other)  // compare
Period.between(start, end)             // difference in days/months/years
```

---

You noticed that the Spring Boot examples above lean on small labels like `@Entity`, `@Column`, and `@PrePersist` to make plain Java classes behave in special ways. That mechanism — attaching metadata to code that a framework reads and acts on — is **annotations**, and it is the engine behind every Spring class you are about to write. That is the next file: `notes/java/junior/en/15-annotations.md`.
