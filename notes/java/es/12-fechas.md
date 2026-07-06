# Fecha y Hora

> 📖 [Baeldung — Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)
> 📖 [Oracle Docs — Date and Time API](https://docs.oracle.com/javase/tutorial/datetime/index.html)

Antes de Java 8, trabajar con fechas era un suplicio. La clase `Date` almacenaba milisegundos desde 1970 y sus meses empezaban por 0 (enero = 0). `Calendar` era el "arreglo", pero resultaba verboso y mutable — podías cambiar accidentalmente una fecha que habías pasado a otro método y generar bugs difíciles de rastrear. Java 8 introdujo el paquete `java.time`, que es inmutable (cada operación devuelve un objeto nuevo), legible por sí solo y no tiene esas peculiaridades de indexación. Lo usarás en todos los proyectos desde el primer día.

---

## Los tres tipos principales

Tienes tres clases según lo que necesites representar. Lo más importante que hay que entender: **ninguna almacena zona horaria**. Representan tiempo civil — la fecha y hora tal como las escribirías en un calendario o un reloj, sin zona horaria asociada. Úsalos para lógica de negocio como fechas de contratación, deadlines de tareas y timestamps.

| Clase | Qué representa | Ejemplo |
|-------|----------------|---------|
| `LocalDate` | Una fecha sin hora | `2026-05-11` |
| `LocalTime` | Una hora sin fecha | `14:30:00` |
| `LocalDateTime` | Una fecha y hora juntas | `2026-05-11T14:30:00` |

---

## Crear valores

Las tres clases siguen el mismo patrón de creación: `.now()` para el momento actual, `.of(...)` para una fecha u hora concreta, y `.parse()` para una fecha que llega como string (habitual cuando el cliente envía una fecha en el cuerpo de la petición). Nota importante: en `java.time` los meses están indexados desde 1 — enero es 1, no 0.

```java
// Fecha y hora actuales
LocalDate today = LocalDate.now();               // 2026-05-11
LocalTime now   = LocalTime.now();               // 14:30:00
LocalDateTime dt = LocalDateTime.now();          // 2026-05-11T14:30:00

// Valor específico
LocalDate birthday  = LocalDate.of(1994, 3, 15);
LocalTime meeting   = LocalTime.of(10, 30);
LocalDateTime event = LocalDateTime.of(2026, 6, 1, 9, 0);

// Desde un string
LocalDate parsed = LocalDate.parse("2026-05-11");          // formato ISO por defecto
LocalDate parsed = LocalDate.parse("11/05/2026",
    DateTimeFormatter.ofPattern("dd/MM/yyyy"));
```

---

## Leer valores

Una vez que tienes un `LocalDate` o `LocalDateTime`, extraes partes individuales con métodos getter. Son útiles cuando necesitas mostrar una fecha por partes — por ejemplo, mostrar el año en una cabecera o el día de la semana en un calendario.

```java
LocalDate date = LocalDate.of(2026, 5, 11);

date.getYear();        // 2026
date.getMonthValue();  // 5
date.getDayOfMonth();  // 11
date.getDayOfWeek();   // MONDAY
```

---

## Formatear

```java
LocalDate date = LocalDate.of(2026, 5, 11);

// Formato ISO estándar — úsalo siempre para APIs y bases de datos
date.toString();  // "2026-05-11"

// Formato personalizado — solo para mostrar al usuario
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
date.format(formatter);  // "11/05/2026"

DateTimeFormatter long = DateTimeFormatter.ofPattern("d MMMM yyyy");
date.format(long);  // "11 May 2026"
```

---

## Sumar y restar

Todas las clases de `java.time` son inmutables — `plusDays` y `minusDays` no cambian el original, devuelven un objeto nuevo. Asigna siempre el resultado:

```java
LocalDate date = LocalDate.of(2026, 5, 11);

date.plusDays(7);    // 2026-05-18
date.plusMonths(1);  // 2026-06-11
date.plusYears(1);   // 2027-05-11

date.minusDays(3);   // 2026-05-08
date.minusMonths(2); // 2026-03-11
```

---

## Comparar fechas

Nunca uses `==` para comparar objetos `LocalDate` o `LocalDateTime` — `==` compara referencias, no valores, igual que con `String`. Usa los métodos específicos: `isBefore()`, `isAfter()` e `isEqual()`. Para ordenar, `compareTo()` funciona igual que `String.compareTo()` — negativo si la primera fecha va antes, cero si son iguales, positivo si va después.

```java
LocalDate a = LocalDate.of(2026, 1, 1);
LocalDate b = LocalDate.of(2026, 6, 1);

a.isBefore(b);  // true
a.isAfter(b);   // false
a.isEqual(b);   // false

a.compareTo(b); // número negativo — a es anterior a b (igual que String.compareTo)
```

---

## Period y Duration

Cuando necesitas saber *cuánto tiempo ha pasado* entre dos fechas u horas, usa `Period` (para diferencias en días/meses/años basadas en el calendario) o `Duration` (para diferencias precisas en horas, minutos, segundos):

```java
// Period — diferencia en años, meses, días (para fechas)
LocalDate start = LocalDate.of(2024, 1, 1);
LocalDate end   = LocalDate.of(2026, 5, 11);

Period p = Period.between(start, end);
p.getYears();   // 2
p.getMonths();  // 4
p.getDays();    // 10

// Duration — diferencia en horas, minutos, segundos (para horas)
LocalDateTime a = LocalDateTime.of(2026, 5, 11, 9, 0);
LocalDateTime b = LocalDateTime.of(2026, 5, 11, 17, 30);

Duration d = Duration.between(a, b);
d.toHours();    // 8
d.toMinutes();  // 510
```

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa `@Entity`, `@Column` y `@PrePersist` — anotaciones JPA que aún no has estudiado. Léela para ver cómo aparecen las fechas Java en una entidad de base de datos real — lo implementarás en las notas de Spring Boot.

### En una entidad JPA

```java
@Entity
public class Employee {

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

Spring Data JPA mapea `LocalDate` a una columna SQL `DATE` y `LocalDateTime` a una columna `TIMESTAMP` automáticamente — sin anotación extra.

### En un DTO

```java
public record EmployeeDTO(
    String name,
    LocalDate hireDate,
    LocalDateTime createdAt
) {}
```

Jackson (la librería JSON que usa Spring Boot) serializa `LocalDate` como `"2026-05-11"` y `LocalDateTime` como `"2026-05-11T14:30:00"` automáticamente.

### Patrón común — establecer createdAt al guardar

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

`@PrePersist` se ejecuta justo antes de que la entidad se guarde por primera vez. `updatable = false` evita que JPA cambie la columna en las actualizaciones.

---

## Referencia rápida

```java
LocalDate.now()                        // hoy
LocalDate.of(year, month, day)         // fecha específica
LocalDate.parse("2026-05-11")          // desde string ISO
date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))  // a string personalizado
date.plusDays(n) / date.minusDays(n)   // sumar o restar
date.isBefore(other) / date.isAfter(other)  // comparar
Period.between(start, end)             // diferencia en días/meses/años
```
