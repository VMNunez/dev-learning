# Date and Time

Java has a modern date/time API since Java 8 (`java.time` package). The old `Date` and `Calendar` classes still exist but are avoided in new code — they are mutable and confusing.

---

## The three main types

| Class | What it represents | Example |
|-------|-------------------|---------|
| `LocalDate` | A date with no time | `2026-05-11` |
| `LocalTime` | A time with no date | `14:30:00` |
| `LocalDateTime` | A date and time together | `2026-05-11T14:30:00` |

No timezone. Use these for most business logic — employee birthday, contract start date, task deadline.

---

## Creating values

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

```java
LocalDate date = LocalDate.of(2026, 5, 11);

date.plusDays(7);    // 2026-05-18
date.plusMonths(1);  // 2026-06-11
date.plusYears(1);   // 2027-05-11

date.minusDays(3);   // 2026-05-08
date.minusMonths(2); // 2026-03-11
```

`LocalDate` is immutable — these methods return a new object, they do not change the original.

---

## Comparing dates

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
