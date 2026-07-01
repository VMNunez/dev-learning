# Enums

> 📖 [Baeldung — A Guide to Java Enums](https://www.baeldung.com/a-guide-to-java-enums)
> 📖 [Oracle Docs — Enum types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)

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

Un enum se declara con `enum` en lugar de `class`. Cada constante se escribe en UPPER_SNAKE_CASE por convención. Para usar una constante, la prefijes con el nombre del enum: `Role.ADMIN`. Los enums se comparan con `==` (explicado en la sección "Comparar enums" más abajo).

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

---

## Enum con campos y métodos

Los enums de Java pueden tener campos, constructores y métodos. Esto es más potente que los enums de TypeScript:

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

---

## Métodos built-in de enum

Todo enum en Java hereda automáticamente un conjunto de métodos útiles. No necesitas escribirlos — vienen gratis. Los más importantes son `name()` (devuelve el nombre de la constante como string), `values()` (devuelve todas las constantes como un array) y `valueOf()` (convierte un string de vuelta a la constante del enum).

```java
Role role = Role.ADMIN;

role.name()      // "ADMIN" — el nombre de la constante como String
role.ordinal()   // 0 — posición en la declaración (base 0)

Role.valueOf("ADMIN")   // Role.ADMIN — String → constante de enum (lanza si no se encuentra)
Role.values()           // Role[] — todas las constantes: [ADMIN, EMPLOYEE, MANAGER]
```

### Iterar todos los valores

```java
for (Role r : Role.values()) {
    System.out.println(r.name());
}
```

Útil para poblar un dropdown o lista de selección — el mismo patrón que usabas en Angular con `Object.values()`.

---

## Enum en switch expression

Los enums son el compañero ideal de las switch expressions. El compilador conoce todos los valores posibles del enum, así que puede avisarte si te olvidas un caso — algo que no puede hacer con un switch sobre un `String` normal.

```java
String message = switch (status) {
    case PENDING  -> "Waiting for approval";
    case ACTIVE   -> "Currently active";
    case INACTIVE -> "Disabled";
};
```

El compilador te avisa si te olvidas un caso — uno de los principales beneficios de los enums sobre los strings.

---

## Comparar enums

Usa `==` — los enums son singletons (solo existe una instancia por constante):

```java
if (role == Role.ADMIN) { ... }      // correcto
if (role.equals(Role.ADMIN)) { ... } // también funciona pero es innecesario
```

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa `@Entity`, `@Enumerated` y conceptos de Spring Security que aún no has estudiado. Léela para ver dónde aparecen los enums en una aplicación real — lo implementarás en las notas de Spring Boot.

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

`EnumType.STRING` almacena el nombre como texto. `EnumType.ORDINAL` almacena el número de posición — evítalo, porque añadir una nueva constante cambia los números de todas las existentes.

### En un guard de Spring Security

```java
// Comprobando el rol en un guard
if (user.getRole() == Role.ADMIN) {
    return true;
}
```

### En un filtro

```java
// Filtrar por estado — mismo patrón que Angular computed() con signals
List<Employee> active = employees.stream()
    .filter(e -> e.getStatus() == Status.ACTIVE)
    .collect(Collectors.toList());
```

---

## Enum vs strings constantes vs enum de TypeScript

| | Java enum | `public static final String` | TypeScript union type |
|---|-----------|------------------------------|----------------------|
| Seguridad de tipos | ✅ error de compilación para valor incorrecto | ❌ acepta cualquier string | ✅ error de compilación |
| Métodos/campos | ✅ sí | ❌ no | ❌ no |
| Iterable | ✅ `values()` | ❌ manual | ❌ manual |
| Mapeo a BD | ✅ `@Enumerated` | manual | — |
| Uso | Siempre en Java | Código legacy | Casos simples en TypeScript |

En Java, usa siempre enums para conjuntos fijos de valores. `public static final String ROLE_ADMIN = "ADMIN"` es el patrón antiguo que puedes ver en código legacy — evítalo en código nuevo.
