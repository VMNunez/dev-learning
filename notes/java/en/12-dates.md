# Date and Time

> 📖 [Baeldung — Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)
> 📖 [Oracle Docs — Date and Time API](https://docs.oracle.com/javase/tutorial/datetime/index.html)

Before Java 8, working with dates was painful. The `Date` class stored milliseconds since 1970 and its month was 0-indexed (January = 0). `Calendar` was the "fix" but was verbose and mutable — you could accidentally change a date you passed to another method and create subtle bugs. Java 8 introduced the `java.time` package, which is immutable (every operation returns a new object), self-documenting, and does not have the indexing quirks. You will use it in every project from day one.

---

## The three main types

You have three classes depending on what you need to represent. The most important thing to understand: **none of these store a timezone**. They represent civil time — the date and time as you would write it on a calendar or a clock, without any timezone attached. Use them for business logic like employee hire dates, task deadlines, and timestamps.

| Class | What it represents | Example |
|-------|-------------------|---------|
| `LocalDate` | A date with no time | `2026-05-11` |
| `LocalTime` | A time with no date | `14:30:00` |
| `LocalDateTime` | A date and time together | `2026-05-11T14:30:00` |

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
LocalDate parsed = LocalDate.parse("11/05/2026",
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

---

## Formatting

```java
LocalDate date = LocalDate.of(2026, 5, 11);

// Standard ISO format — always use for APIs and databases
date.toString();  // "2026-05-11"

// Custom format — for display only
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
date.format(formatter);  // "11/05/2026"

DateTimeFormatter long = DateTimeFormatter.ofPattern("d MMMM yyyy");
date.format(long);  // "11 May 2026"
```

---

## Adding and subtracting

All `java.time` classes are immutable — `plusDays` and `minusDays` do not change the original, they return a new object. Always assign the result:

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
