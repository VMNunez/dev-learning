# OOP — Clases

> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## ¿Qué es la programación orientada a objetos?

La **programación orientada a objetos** (OOP) es una forma de organizar el código agrupando datos y comportamiento en unidades llamadas **objetos**. En lugar de tener funciones sueltas que manipulan variables sueltas, defines **clases** que encapsulan ambas cosas juntas.

Por ejemplo: un `Employee` no es solo un nombre y un email flotando por ahí — es un objeto que tiene esos datos *y* los métodos para trabajar con ellos (`getName()`, `setEmail()`, `isActive()`).

Java es un lenguaje orientado a objetos casi al 100%: casi todo lo que escribes vive dentro de una clase.

## Qué es una clase

Una clase es el molde (blueprint) para crear objetos. El objeto es la copia concreta creada a partir de ese molde.

```java
// Blueprint
public class Employee {
    // Campos — los datos que almacena el objeto
    private String name;
    private String email;
    private int age;

    // Constructor — se ejecuta cuando creas un nuevo objeto
    public Employee(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // Getters — leen los campos privados
    public String getName() { return name; }
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

También se usa para llamar a otro constructor desde dentro de un constructor:

```java
public Employee(String name) {
    this(name, "unknown@email.com");   // llama al constructor de dos parámetros
}

public Employee(String name, String email) {
    this.name = name;
    this.email = email;
}
```

---

## Encapsulación

Los campos son `private` — solo se puede acceder a ellos a través de los propios métodos de la clase (getters/setters). Esto protege los datos de ser cambiados directamente desde fuera:

```java
// Malo — el campo es público, cualquiera puede asignar cualquier valor
emp.age = -500;  // nada lo impide

// Bueno — el campo es privado, el setter puede validar
public void setAge(int age) {
    if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    this.age = age;
}
```

---

## Campos y métodos estáticos

Los miembros `static` pertenecen a la clase, no a ningún objeto individual:

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

Múltiples constructores con parámetros distintos. Java elige el correcto:

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

Sobreescribe `toString()` para obtener una representación legible del objeto. Java lo llama automáticamente cuando imprimes un objeto:

```java
@Override
public String toString() {
    return "Employee{name='" + name + "', email='" + email + "'}";
}

System.out.println(emp);   // Employee{name='Victor', email='victor@example.com'}
```

---

## `equals()` y `hashCode()`

Por defecto, `==` compara referencias de objetos (direcciones de memoria). Sobreescribe `equals()` para comparar por contenido:

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

Una forma más corta de escribir una clase que solo almacena datos. Java genera el constructor, getters, `equals`, `hashCode` y `toString` automáticamente:

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
