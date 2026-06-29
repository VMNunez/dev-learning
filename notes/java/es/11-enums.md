# Enums

> 📖 [Baeldung — A Guide to Java Enums](https://www.baeldung.com/a-guide-to-java-enums)
> 📖 [Oracle Docs — Enum types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)

Un enum es un tipo con un conjunto fijo de constantes con nombre. Previene los strings mágicos y los typos, y hace que el código se documente a sí mismo.

```java
// Sin enum — cualquier string puede pasarse, los typos son bugs silenciosos
public void setRole(String role) { ... }
setRole("ADNIM");  // typo — sin error de compilación

// Con enum — solo se permiten valores válidos
public void setRole(Role role) { ... }
setRole(Role.ADMIN);  // error de compilación si escribes Role.ADNIM
```

---

## Enum básico

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
