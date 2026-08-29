# Fecha y Hora

> 📖 [Baeldung — Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)
> 📖 [Oracle Docs — Date and Time API](https://docs.oracle.com/javase/tutorial/datetime/index.html)

Un enum (el archivo anterior) te permitía restringir un tipo a un conjunto pequeño y fijo de valores. La siguiente necesidad de modelado cotidiana es el tiempo mismo — la fecha de contratación de un empleado, el deadline de una tarea, el momento exacto en que se creó una fila. Antes de Java 8, esto era una trampa.

Trabajar con fechas era un suplicio. La clase `Date` almacenaba milisegundos desde 1970 y sus meses empezaban por 0 (enero = 0). `Calendar` era el "arreglo", pero resultaba verboso y mutable — podías cambiar accidentalmente una fecha que habías pasado a otro método y generar bugs difíciles de rastrear. Java 8 introdujo el paquete `java.time`, que es inmutable (cada operación devuelve un objeto nuevo), legible por sí solo y no tiene esas peculiaridades de indexación. Lo usarás en todos los proyectos desde el primer día.

---

## Los tres tipos principales

Tienes tres clases según lo que necesites representar. Lo más importante que hay que entender: **ninguna almacena zona horaria**. Representan tiempo civil — la fecha y hora tal como las escribirías en un calendario o un reloj, sin zona horaria asociada. Úsalos para lógica de negocio como fechas de contratación, deadlines de tareas y timestamps.

| Clase | Qué representa | Ejemplo |
|-------|----------------|---------|
| `LocalDate` | Una fecha sin hora | `2026-05-11` |
| `LocalTime` | Una hora sin fecha | `14:30:00` |
| `LocalDateTime` | Una fecha y hora juntas | `2026-05-11T14:30:00` |

Lee cada fila así: "si necesito representar *(columna central)*, echo mano de *(columna izquierda)*, y un valor tiene esta pinta *(columna derecha)*." Elige el tipo más pequeño que cargue con lo que realmente necesitas — un cumpleaños es un `LocalDate`, no un `LocalDateTime` con un `00:00:00` sin sentido añadido detrás.

Una forma rápida de ver cómo se relacionan los cuatro tipos de `java.time`: `LocalDateTime` no es más que un `LocalDate` y un `LocalTime` pegados, e `Instant` es el que se ancla a UTC.

```
                    una fecha       una hora
                 ┌───────────┐  ┌───────────┐
   LocalDate ───▶│ 2026-05-11│  │ 14:30:00  │◀─── LocalTime
                 └───────────┘  └───────────┘
                        └──────┬──────┘
                               ▼
                       LocalDateTime          ← sin zona horaria (hora de pared)
                    2026-05-11T14:30:00

                       Instant                ← un punto en UTC (absoluto)
                 2026-05-11T12:30:00.123456Z
```

---

## Instant — un punto exacto en el tiempo, sin ambigüedad de zona horaria

Las tres clases de arriba tienen un límite que no se nota hasta que tu app corre en más de un sitio: son "hora de pared" (*wall-clock time*). `LocalDateTime.now()` te da la fecha y hora tal como las marca el reloj **del servidor donde se ejecuta el código**, sin decir en qué zona horaria está ese reloj. Si tu servidor está en Madrid, `LocalDateTime.now()` un 11 de mayo a las 14:30 te da `2026-05-11T14:30:00` — pero si despliegas ese mismo código en un servidor configurado en UTC, sin cambiar una sola línea, ese mismo instante físico te devuelve un valor distinto (`2026-05-11T12:30:00`), porque `LocalDateTime` no sabe que existe una diferencia horaria que compensar.

> Piénsalo así: `LocalDateTime` es como decir "son las 14:30" sin decir en qué ciudad — depende de dónde estés parado para saber a qué hora absoluta te refieres. `Instant` es como decir "son las 12:30 UTC" — un único punto en el tiempo, el mismo para cualquiera que lo lea, viva donde viva.

`Instant` representa exactamente eso: un punto en el tiempo medido en UTC (tiempo universal), independiente de en qué zona horaria esté el servidor que lo generó. Por eso es la clase que se usa para **timestamps técnicos** — el momento exacto en que ocurrió un evento del sistema (un error, un log, una fila creada) — mientras que `LocalDate`/`LocalDateTime` siguen siendo las correctas para **fechas de negocio** (la fecha de una entry de horas trabajadas, el cumpleaños de un empleado), donde lo que importa es la fecha tal como la escribiría una persona, no el instante universal.

```java
Instant now = Instant.now();   // 2026-05-11T12:30:00.123456Z
```

La `Z` al final significa "Zulu time", el nombre militar/aeronáutico para UTC — es la forma en que `Instant` deja explícito, en el propio texto, que no hace falta preguntar "¿en qué zona horaria está esto?".

| Clase | Qué representa | ¿Guarda zona horaria? | Cuándo usarla |
|-------|----------------|------------------------|----------------|
| `LocalDateTime` | Fecha y hora "de pared" | No — depende de dónde se ejecute | Fechas de negocio: cumpleaños, fecha de una entry, deadline |
| `Instant` | Un punto exacto en UTC | Sí, implícitamente (siempre UTC) | Timestamps técnicos: cuándo ocurrió un error, cuándo se creó un log |

La columna "¿Guarda zona horaria?" es la que decide cuál usar: si dos servidores en zonas distintas deben coincidir en "cuándo pasó esto" sin ambigüedad, necesitas `Instant`; si lo que quieres es la fecha tal como la vería un humano rellenando un formulario, `LocalDateTime`/`LocalDate` es lo correcto.

> **Vista previa — Spring Boot:** verás `Instant` en el DTO `ErrorResponse` que centraliza los errores de la API (`notes/spring-boot/junior/es/05-manejo-excepciones.md`) — el timestamp de un error es exactamente el caso "técnico, no de negocio" que describe la tabla de arriba.

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
LocalDate parsedCustom = LocalDate.parse("11/05/2026",
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

> **`getMonthValue()` vs `getMonth()`:** estos dos parecen intercambiables pero devuelven tipos distintos. `getMonthValue()` te da el número (`5`), que es lo que quieres para cálculos o para construir otra fecha. `getMonth()` te da una constante del enum `Month` (`MAY`) — útil cuando quieres el nombre en lugar del número. Echa mano de `getMonthValue()` por defecto; usa `getMonth()` solo cuando de verdad necesites el enum.

---

## Formatear

Convertir una fecha en string es el proceso inverso del parseo. Por defecto `toString()` ya te da el formato ISO (`2026-05-11`), que es el que siempre quieres para APIs y bases de datos — es inequívoco y todos los sistemas lo entienden. Cuando necesitas otro formato para que lo lea una persona (un `dd/MM/yyyy` español, o un mes escrito con letras), construyes un `DateTimeFormatter` con un patrón y se lo pasas a `.format()`. Esto es **solo para mostrar** — nunca almacenes ni envíes una fecha con formato personalizado; formatéala en el último momento, para la pantalla.

```java
LocalDate date = LocalDate.of(2026, 5, 11);

// Formato ISO estándar — úsalo siempre para APIs y bases de datos
date.toString();  // "2026-05-11"

// Formato personalizado — solo para mostrar al usuario
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
date.format(formatter);  // "11/05/2026"

DateTimeFormatter longFormat = DateTimeFormatter.ofPattern("d MMMM yyyy");
date.format(longFormat);  // "11 May 2026"
```

---

## Sumar y restar

Todas las clases de `java.time` son inmutables — `plusDays` y `minusDays` no cambian el original, devuelven un objeto nuevo. Asigna siempre el resultado:

> **Este es el bug de fechas número uno.** `date.plusDays(7);` por sí solo no hace nada que puedas ver — la fecha nueva se calcula y se descarta de inmediato, porque `date` sigue apuntando al valor antiguo. La llamada *parece* que mutó `date`, pero la inmutabilidad significa que la única forma de conservar el resultado es capturarlo: `date = date.plusDays(7);` o `LocalDate next = date.plusDays(7);`. Esta es exactamente la razón por la que el viejo `Calendar` mutable era peligroso y por la que `java.time` eligió la inmutabilidad en su lugar.

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

> **`isEqual()` vs `equals()`:** para `LocalDate` ambos devuelven la misma respuesta, así que puedes usar cualquiera. La diferencia importa en los tipos con zona horaria (como las implementaciones de `ChronoLocalDate` o `ZonedDateTime`): `isEqual()` compara el punto en la línea temporal, mientras que `equals()` además exige que los objetos sean de la misma *clase/cronología*. Para comparaciones de `LocalDate` a secas, prefiere `isEqual()` por legibilidad — se lee como "¿es la misma fecha?".

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

---

Te habrás fijado en que los ejemplos de Spring Boot de arriba se apoyan en pequeñas etiquetas como `@Entity`, `@Column` y `@PrePersist` para hacer que clases Java normales se comporten de formas especiales. Ese mecanismo — adjuntar metadatos al código que un framework lee y sobre los que actúa — son las **anotaciones**, y son el motor detrás de cada clase de Spring que estás a punto de escribir. Ese es el siguiente archivo: `notes/java/junior/es/16-anotaciones.md`.
