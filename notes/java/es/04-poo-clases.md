# OOP — Clases

> 📖 [Baeldung — A guide to Java classes and objects](https://www.baeldung.com/java-classes-objects) → leer: "Creating a Class" y "Constructors"
> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## ¿Qué es la programación orientada a objetos?

La **programación orientada a objetos** (OOP) es una forma de organizar el código agrupando datos y comportamiento en unidades llamadas **objetos**. En lugar de tener funciones sueltas que manipulan variables sueltas, defines **clases** que encapsulan ambas cosas juntas.

Por ejemplo: un `Employee` no es solo un nombre y un email flotando por ahí — es un objeto que tiene esos datos _y_ los métodos para trabajar con ellos (`getName()`, `setEmail()`, `isActive()`).

Java es un lenguaje orientado a objetos casi al 100%: casi todo lo que escribes vive dentro de una clase.

## Qué es una clase

Una clase es el molde (blueprint) para crear objetos. El objeto es la copia concreta creada a partir de ese molde.

```java
// Blueprint
public class Employee {
    // Campos — los datos que almacena el objeto (siempre private)
    private String name;
    private String email;
    private int age;

    // Constructor — se ejecuta cuando creas un nuevo objeto con new
    public Employee(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // Getters — leen los campos privados
    public String getName() { return name; }  // this.name también funciona; cuando no hay ambigüedad, Java entiende name como this.name
    public String getEmail() { return email; }
    public int getAge() { return age; }

    // Setters — modifican los campos privados
    public void setEmail(String email) { this.email = email; }
}

// Crear un objeto a partir del blueprint
Employee emp = new Employee("Victor", "victor@example.com", 31);
System.out.println(emp.getName());   // "Victor"
```

---

## `this`

`this` hace referencia al objeto actual. Se usa para distinguir entre campos y parámetros con el mismo nombre:

```java
public Employee(String name) {
    this.name = name;   // this.name = campo, name = parámetro
}
```

También se usa para llamar a otro constructor desde dentro de un constructor. Los dos constructores pertenecen a la misma clase — es una forma de reutilizar lógica entre distintos constructores cuando uno de ellos es un caso especial del otro:

```java
public class Employee {
    private String name;
    private String email;

    // Constructor de un parámetro — delega en el de dos para no duplicar código
    public Employee(String name) {
        this(name, "unknown@email.com");   // llama al constructor de dos parámetros de esta misma clase
    }

    // Constructor de dos parámetros — aquí está la lógica real de inicialización
    public Employee(String name, String email) {
        this.name = name;
        this.email = email;
    }
}

new Employee("Victor");                        // name="Victor", email="unknown@email.com"
new Employee("Victor", "victor@example.com"); // name="Victor", email="victor@example.com"
```

Siempre que ves `this(...)` dentro de un constructor, significa "llama a otro constructor de esta misma clase con estos argumentos." La llamada a `this()` debe ser siempre la primera línea del constructor.

---

## Constructores

Un constructor es el método especial que se ejecuta cuando creas un objeto con `new`. Dos reglas fijas: (1) debe llamarse exactamente igual que la clase, y (2) no tiene tipo de retorno — ni `void`, nada. Por eso el compilador lo distingue de un método normal.

```java
public class Employee {
    private String name;
    private int age;

    // Constructor — mismo nombre que la clase, sin tipo de retorno
    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// Se invoca con new — Java ejecuta el constructor automáticamente
Employee emp = new Employee("Victor", 31);
```

Los constructores son casi siempre `public` — necesitas poder crear objetos desde fuera de la clase. Si no defines ningún constructor, Java crea uno vacío automáticamente (sin parámetros, no hace nada). En cuanto defines uno con parámetros, ese constructor automático desaparece.

---

## Encapsulación

Los campos son siempre `private` — solo se puede acceder a ellos a través de los propios métodos de la clase (getters/setters). Esto protege los datos de ser cambiados directamente desde fuera:

```java
public class Employee {
    private String name;   // private — nadie de fuera puede tocarlo directamente
    private int age;       // private — se accede solo a través de getters/setters

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return this.name; }    // getter — lectura controlada
    public int getAge() { return this.age; }          // getter — lectura controlada
    public void setAge(int age) {                     // setter con validación
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        this.age = age;
    }
}
```

Sin encapsulación cualquiera podría hacer esto:

```java
// Sin encapsulación — campo público, cualquiera puede asignar cualquier valor
emp.age = -500;  // nada lo impide — esto no debería compilar en un diseño correcto

// Con encapsulación — campo private, setter valida antes de asignar
emp.setAge(-500);  // lanza IllegalArgumentException — el objeto se protege a sí mismo
```

---

## Campos y métodos estáticos

"Miembros" es el término general para campos y métodos de una clase. Los miembros `static` pertenecen a la clase en sí, no a ningún objeto individual. `static` tiene sentido en dos situaciones: (1) cuando el método solo trabaja con sus argumentos y no necesita datos de la instancia — como `Integer.parseInt("42")`; (2) cuando quieres un campo compartido entre todas las instancias — como un contador de cuántos objetos se han creado.

```java
public class Employee {
    private static int count = 0;   // compartido por TODAS las instancias
    private String name;

    public Employee(String name) {
        this.name = name;
        count++;   // cada nuevo Employee incrementa el contador compartido
    }

    public static int getCount() {
        return count;
    }
}

Employee.getCount();   // se llama sobre la clase, no sobre una instancia
```

---

## Sobrecarga de constructores

La sobrecarga de constructores es el mismo concepto que la sobrecarga de métodos: puedes definir varios constructores en la misma clase, cada uno con parámetros distintos. Java elige el correcto según los argumentos que le pases con `new`. Es útil cuando quieres permitir distintas formas de crear un objeto — con todos los datos, con solo los obligatorios, con valores por defecto para los opcionales:

```java
public class Employee {
    private String name;
    private String role;

    public Employee(String name) {
        this(name, "employee");   // rol por defecto
    }

    public Employee(String name, String role) {
        this.name = name;
        this.role = role;
    }
}

new Employee("Victor");            // name="Victor", role="employee"
new Employee("Victor", "admin");   // name="Victor", role="admin"
```

---

## `toString()`

Cuando haces `System.out.println(emp)`, Java necesita convertir el objeto a texto para imprimirlo. Busca un método llamado exactamente `toString()` en tu clase — si no lo encuentras, usa el de la clase base `Object`, que imprime algo ilegible como `Employee@1b6d3586` (nombre de la clase + dirección en memoria, inútil para depurar).

El nombre `toString()` no lo eliges tú — es el nombre que Java espera por convenio. Siempre devuelve `String` y no recibe parámetros.

`@Override` le dice al compilador "estoy reemplazando este método que existe en una clase padre." Si escribes mal el nombre (por ejemplo `tostring()` con minúsculas), sin `@Override` Java lo trataría como un método nuevo sin relación y tu `println` seguiría mostrando la dirección de memoria. Con `@Override`, el compilador detecta el error de tipografía inmediatamente. Aprenderás las anotaciones en detalle en `13-annotations.md` — por ahora recuerda que `@Override` va encima de cualquier método que estés reemplazando intencionalmente.

```java
@Override
public String toString() {
    return "Employee{name='" + name + "', email='" + email + "'}";
}

System.out.println(emp);   // Employee{name='Victor', email='victor@example.com'}
```

---

## `equals()` y `hashCode()`

Ya sabes que para Strings usas `.equals()` en lugar de `==` porque `==` compara referencias (direcciones de memoria), no contenido. El mismo problema existe con cualquier objeto que tú definas.

Por defecto, si haces `emp1.equals(emp2)`, Java compara si son el mismo objeto en memoria — no si tienen los mismos datos. Si quieres que dos empleados sean "iguales" cuando tienen el mismo email, tienes que sobreescribir `equals()` en tu clase para definir tú mismo qué significa "igual":

```java
// En la clase Employee:
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;                        // mismo objeto — trivialmente igual
    if (!(obj instanceof Employee other)) return false;  // tipos distintos — no pueden ser iguales
    return Objects.equals(this.email, other.email);      // tu criterio de igualdad: mismo email
}
```

`hashCode()` va siempre junto a `equals()` — las colecciones como `HashMap` y `HashSet` usan ambos para organizar los objetos. La regla es simple: si dos objetos son iguales según `equals()`, deben tener el mismo `hashCode()`. Si sobreescribes uno sin el otro, esas colecciones dejan de funcionar correctamente:

```java
@Override
public int hashCode() {
    return Objects.hash(email);  // mismo campo que usaste en equals()
}
```

En la práctica, IntelliJ genera ambos automáticamente: `Code → Generate → equals() and hashCode()`.

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Employee other)) return false;
    return Objects.equals(this.email, other.email);
}

@Override
public int hashCode() {
    return Objects.hash(email);
}
```

Siempre sobreescribe los dos juntos — colecciones como `HashMap` y `HashSet` usan ambos.

---

## Records (Java 16+) — clases de datos inmutables

Cuando tienes una clase que solo transporta datos — sin lógica de negocio, solo campos y sus getters — acabas escribiendo mucho código repetitivo: constructor, `toString`, `equals`, `hashCode`, y un getter por cada campo. Java 16 introdujo los records para eliminar todo ese boilerplate.

Antes (clase normal):

```java
public class EmployeeDTO {
    private final String name;
    private final String email;

    public EmployeeDTO(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }

    @Override public boolean equals(Object o) { ... }
    @Override public int hashCode() { ... }
    @Override public String toString() { ... }
}
```

Ahora (record):

```java
public record EmployeeDTO(String name, String email) {}

// Crea automáticamente todo lo de arriba:
// - constructor: new EmployeeDTO("Victor", "v@e.com")
// - getters: name(), email()   ← sin prefijo "get" en records
// - equals(), hashCode(), toString()
```

Los records son inmutables — sin setters. Son perfectos para transportar datos entre capas de una aplicación web (este patrón se llama DTO — Data Transfer Object).

```java
public record Employee(String name, String email, int age) {}

// Crea:
// - constructor: new Employee("Victor", "v@e.com", 31)
// - getters: name(), email(), age()   ← sin prefijo "get" en records
// - equals(), hashCode(), toString()
```

Los records son inmutables — sin setters. Son perfectos para transportar datos entre capas de una aplicación web (este patrón se llama DTO — Data Transfer Object).

> **Vista previa — Spring Boot:** El ejemplo a continuación usa un `repository` y un `controlador`, que son conceptos de Spring Boot que aún no has estudiado. Léelo para ver cómo encajan los records en un proyecto real — lo construirás en las notas de Spring Boot.

```java
// Patrón DTO clásico en Spring Boot
public record EmployeeDTO(String name, String email) {}

// En un controlador:
public EmployeeDTO getEmployee(int id) {
    Employee emp = repository.findById(id);
    return new EmployeeDTO(emp.getName(), emp.getEmail());
}
```
