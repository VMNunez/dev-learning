# Enums

> 📖 [Baeldung — A Guide to Java Enums](https://www.baeldung.com/a-guide-to-java-enums)
> 📖 [Oracle Docs — Enum types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)

Los generics (el archivo anterior) te permiten escribir código type-safe que funciona con *cualquier* tipo que le enchufes — el tipo se queda abierto. Pero hasta ahora nada permite que un tipo se restrinja *a sí mismo* a un conjunto pequeño y fijo de valores. Ese es justo el hueco que rellena un enum.

Imagina que tienes un rol de usuario que solo puede ser `ADMIN`, `EMPLOYEE` o `MANAGER`. Si lo almacenas como un `String`, se acepta cualquier valor — un typo como `"ADNIM"` compila sin problemas y se convierte en un bug silencioso que solo aparece en runtime. Un enum soluciona esto haciendo que los valores válidos formen parte del tipo en sí. Solo las constantes declaradas son válidas, y un typo es un error de compilación en lugar de un bug en runtime.

```java
// Sin enum — cualquier string puede pasarse, los typos son bugs silenciosos
public void setRole(String role) { ... }
setRole("ADNIM");  // typo — sin error de compilación, el bug se oculta hasta runtime

// Con enum — solo se permiten valores válidos
public void setRole(Role role) { ... }
setRole(Role.ADMIN);  // error de compilación si escribes Role.ADNIM — se detecta de inmediato
```

---

## Enum básico

> Docs: https://www.baeldung.com/a-guide-to-java-enums → lee: la sección inicial sobre cómo declarar un enum y usarlo en un `switch`.

Un enum se declara con `enum` en lugar de `class`. Cada constante se escribe en UPPER_SNAKE_CASE por convención. Para usar una constante, antepones el nombre del enum: `Role.ADMIN`. Los enums se comparan con `==` (explicado en la sección "Comparar enums" más abajo).

```java
public enum Role {
    ADMIN,
    EMPLOYEE,
    MANAGER
}

// Uso
Role role = Role.ADMIN;

if (role == Role.ADMIN) {
    System.out.println("Admin access");
}

// Switch con enum
switch (role) {
    case ADMIN    -> System.out.println("Full access");
    case MANAGER  -> System.out.println("Team access");
    case EMPLOYEE -> System.out.println("Read access");
}
```

> **Por qué las etiquetas `case` son `ADMIN` a secas, y no `Role.ADMIN`.** Dentro de un `switch` sobre un enum, el compilador ya sabe que el tipo del valor sobre el que se hace el switch es `Role`, así que busca cada etiqueta en ese enum automáticamente — escribir ahí `Role.ADMIN` es de hecho un error de compilación (`an enum switch case label must be the unqualified name of an enumeration constant`). En cualquier *otro* sitio — asignaciones, comparaciones con `if` — sí necesitas el `Role.ADMIN` completo, porque nada le indica al compilador a qué enum te refieres.

---

## Enum con campos y métodos

> Docs: https://www.baeldung.com/a-guide-to-java-enums → lee: la sección sobre campos, métodos y el constructor de un enum.

Los enums de Java pueden tener campos, constructores y métodos — un enum de TypeScript no puede; sus constantes son simples números o strings sin comportamiento asociado, así que no puedes preguntarle a una constante de un enum de TS "¿cuál es tu etiqueta?" como sí puedes aquí:

```java
public enum Status {
    PENDING("Pending review"),
    ACTIVE("Active"),
    INACTIVE("Inactive");

    private final String label;

    // Constructor — se ejecuta una vez para cada constante
    Status(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

Status.ACTIVE.getLabel();    // "Active"
Status.PENDING.getLabel();   // "Pending review"
```

Para leer esto necesitas saber qué ocurre realmente cuando la clase se carga, porque explica tres cosas que, si no, parecen magia: cómo se llama al constructor si nunca escribiste `new`, por qué hay un punto y coma después de la última constante, y por qué el constructor no es `public`.

Cada constante — `PENDING`, `ACTIVE`, `INACTIVE` — no es una etiqueta ni un índice. *Es* un objeto `Status` completamente construido. Cuando la JVM carga por primera vez la clase `Status`, ejecuta el constructor una vez por cada constante, en orden de declaración, pasando el argumento que va entre paréntesis. Así que `PENDING("Pending review")` significa "construye un objeto `Status` llamando a `Status("Pending review")`". Tras la carga de la clase existen en memoria exactamente tres objetos `Status`, para siempre — uno por constante. Eso es lo que hace que una constante de enum sea un *singleton*: nunca existe más que una instancia de `Status.ACTIVE`, y toda referencia a ella apunta a ese mismo objeto.

```
La carga de la clase ejecuta el constructor 3 veces, construyendo 3 objetos fijos:

   Status.PENDING  ─────▶ ┌───────────────────────────┐
                          │ Objeto Status              │
                          │ label = "Pending review"   │
                          └───────────────────────────┘

   Status.ACTIVE   ─────▶ ┌───────────────────────────┐
                          │ Objeto Status              │
                          │ label = "Active"           │
                          └───────────────────────────┘

   Status.INACTIVE ─────▶ ┌───────────────────────────┐
                          │ Objeto Status              │
                          │ label = "Inactive"         │
                          └───────────────────────────┘

   Cada `Status.ACTIVE` de todo tu programa apunta a la MISMA caja.
```

> **Por qué nunca escribes `new Status(...)`.** El constructor del enum es *implícitamente privado* — no puedes hacerlo `public` aunque lo intentes, y `new Status("x")` es un error de compilación. Java lo llama por ti, una vez por constante, en el momento de la carga de la clase, y nunca más. Este es el mecanismo que garantiza el conjunto fijo: ningún otro código puede fabricar jamás un cuarto `Status`.

> **Por qué el punto y coma después de la última constante.** En un enum simple (`ADMIN, EMPLOYEE, MANAGER`) no hace falta. En cuanto añades campos, un constructor o métodos, Java necesita saber dónde termina la *lista de constantes* y dónde empiezan las *declaraciones de miembros* — el `;` después de `INACTIVE("Inactive")` es ese separador. Olvídalo y el código no compila.

---

## Métodos built-in de enum

> Docs: https://www.baeldung.com/a-guide-to-java-enums → lee: las secciones que cubren `values()`, `valueOf()` y `ordinal()`.

Todo enum en Java hereda automáticamente un conjunto de métodos útiles. No necesitas escribirlos — vienen gratis. Los más importantes son `name()` (devuelve el nombre de la constante como string), `values()` (devuelve todas las constantes como un array) y `valueOf()` (convierte un string de vuelta a la constante del enum).

```java
Role role = Role.ADMIN;

role.name()      // "ADMIN" — el nombre de la constante como String
role.ordinal()   // 0 — posición en la declaración (base 0)

Role.valueOf("ADMIN")   // Role.ADMIN — String → constante de enum
Role.valueOf("ADNIM")   // lanza una excepción — ver abajo
Role.values()           // Role[] — todas las constantes: [ADMIN, EMPLOYEE, MANAGER]
```

`valueOf()` hace una comparación exacta y sensible a mayúsculas contra los nombres de las constantes. Si el string no coincide con ninguno no devuelve `null` — lanza una excepción:

```
java.lang.IllegalArgumentException: No enum constant Role.ADNIM
```

> **Cuidado en las fronteras de tu app.** `valueOf()` es donde un string incorrecto que viene de *fuera* de tu sistema de tipos (un query param, un body JSON, una columna de la base de datos) se convierte en una excepción. Si expones un enum en un DTO de request, un valor inválido como `?role=ADNIM` se convierte en una `IllegalArgumentException` — conviene capturarla y transformarla en una respuesta 400 limpia en lugar de un 500.

### Iterar todos los valores

```java
for (Role r : Role.values()) {
    System.out.println(r.name());
}
```

Útil para poblar un dropdown o lista de selección — el mismo patrón que usabas en Angular con `Object.values()`.

---

## Enum en switch expression

> Docs: https://www.baeldung.com/java-switch → lee: "Switch Expressions" para la sintaxis de flecha y la exhaustividad.

Los enums son el compañero ideal de las switch expressions. El compilador conoce el conjunto completo y fijo de valores que puede tomar un enum — algo que nunca puede saber para un `String` normal — y lo usa para imponer la *exhaustividad*.

```java
String message = switch (status) {
    case PENDING  -> "Waiting for approval";
    case ACTIVE   -> "Currently active";
    case INACTIVE -> "Disabled";
};
```

> **Un caso que falta es un *error* de compilación, no un warning.** Esto es una switch *expression*: tiene que producir un valor para `message` sin importar qué constante contenga `status`. Si dejas fuera `case INACTIVE`, hay un valor que el switch podría recibir y para el que no tendría respuesta — así que el compilador se niega a compilarlo ("the switch expression does not cover all possible input values") a menos que manejes cada constante o añadas un `default`. Compáralo con una switch *statement* (una que solo ejecuta código y no devuelve nada), donde un caso que falta es legal y silenciosamente no hace nada. La ventaja práctica: añade una cuarta constante al enum más adelante, y toda switch expression exhaustiva que la consumía deja de compilar hasta que manejes el nuevo caso — el compilador te entrega la lista de sitios que actualizar.

---

## Comparar enums

> Docs: https://www.baeldung.com/a-guide-to-java-enums → lee: la sección que compara valores de enum con el operador `==`.

Usa `==`. Esto funciona por el mecanismo de la sección de campos de arriba: cada constante es un único objeto construido una sola vez en la carga de la clase, así que nunca existe más que una instancia de `Role.ADMIN` en todo el programa. `==` compara la identidad del objeto ("¿son exactamente el mismo objeto?"), y como existe exactamente un objeto `Role.ADMIN`, `role == Role.ADMIN` es verdadero precisamente cuando `role` *es* ese objeto.

```java
if (role == Role.ADMIN) { ... }      // correcto
if (role.equals(Role.ADMIN)) { ... } // también funciona pero es innecesario
```

> **`==` es null-safe aquí; `equals` no.** Si `role` es `null`, `role == Role.ADMIN` simplemente se evalúa como `false` — sin crash. Pero `role.equals(Role.ADMIN)` llama a un método *sobre* `role`, y llamar a un método sobre `null` lanza una `NullPointerException`. Con tipos de referencia normalmente recurres a `.equals()` para evitar comparar identidades por accidente, pero los enums son el único caso donde `==` es a la vez correcto *y* más seguro — otra razón por la que es el idiom.

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa `@Entity`, `@Enumerated` y conceptos de Spring Security que aún no has estudiado. Léela para ver dónde aparecen los enums en una aplicación real — lo implementarás en las notas de Spring Boot.

> Docs: https://www.baeldung.com/jpa-persisting-enums-in-databases → lee: "Using @Enumerated" para `EnumType.STRING` vs `EnumType.ORDINAL`.

Los enums aparecen constantemente en aplicaciones Spring Boot:

### En una entidad

```java
@Entity
public class Employee {
    @Enumerated(EnumType.STRING)  // almacena "ADMIN" en la base de datos, no 0
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status;
}
```

`EnumType.STRING` almacena el nombre como texto (`"ADMIN"`). `EnumType.ORDINAL` almacena en su lugar el número de posición de `ordinal()` (`0`, `1`, `2`).

> **Usa siempre `EnumType.STRING`, nunca `ORDINAL`.** El ordinal es solo la posición de la constante en la declaración, y las posiciones cambian. Inserta una nueva constante en medio, o reordénalas, y cada fila existente en la base de datos apunta silenciosamente a la constante equivocada — `0` antes significaba `ADMIN`, ahora significa lo que sea que pusiste primero. `EnumType.STRING` almacena `"ADMIN"` literalmente, así que el mapeo sobrevive a cualquier reordenación. Este es el bug de enums más común en apps Spring en producción, y corrompe datos de forma silenciosa.

### En un guard de Spring Security

```java
// Comprobando el rol en un guard
if (user.getRole() == Role.ADMIN) {
    return true;
}
```

### En un filtro

```java
// Filtrar por estado — el enum hace la comparación exacta y a prueba de typos
List<Employee> active = employees.stream()
    .filter(e -> e.getStatus() == Status.ACTIVE)
    .collect(Collectors.toList());
```

---

## Enum vs strings constantes vs enum de TypeScript

Lee esta tabla fila por fila: cada fila es una capacidad, y las tres columnas muestran si el `enum` de Java, el viejo patrón `public static final String` y un union type de TypeScript te la dan (✅) o no (❌). La fila de abajo es el veredicto, no una capacidad.

| | Java enum | `public static final String` | TypeScript union type |
|---|-----------|------------------------------|----------------------|
| Seguridad de tipos | ✅ error de compilación para valor incorrecto | ❌ acepta cualquier string | ✅ error de compilación |
| Métodos/campos | ✅ sí | ❌ no | ❌ no |
| Iterable | ✅ `values()` | ❌ manual | ❌ manual |
| Mapeo a BD | ✅ `@Enumerated` | manual | — |
| Uso | Siempre en Java | Código legacy | Casos simples en TypeScript |

En Java, usa siempre enums para conjuntos fijos de valores. `public static final String ROLE_ADMIN = "ADMIN"` es el patrón antiguo que puedes ver en código legacy — evítalo en código nuevo.

---

Los enums cierran un tipo para que solo pueda contener un puñado de valores que decides de antemano. El siguiente archivo, `14-fechas.md`, trata el tipo de valor opuesto — fechas y horas, que provienen de un rango efectivamente infinito y tienen su propia aritmética (duraciones, zonas horarias, "dentro de tres días"). Las clases de fechas más antiguas de Java eran mutables y propensas a errores; la API moderna `java.time` lo soluciona, y es lo que todo proyecto usa en cuanto necesita un timestamp en una entidad.
