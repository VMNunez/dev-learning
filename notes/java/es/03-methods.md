# Métodos

> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html)

## Declaración de un método

```java
modificadorDeAcceso tipoRetorno nombreMetodo(parámetros) {
    // cuerpo
    return valor;
}
```

```java
public int add(int a, int b) {
    return a + b;
}

public void printName(String name) {
    System.out.println(name);
    // sin return — los métodos void no devuelven nada
}

public static double calculateTax(double price, double rate) {
    return price * rate;
}
```

| Parte | Ejemplo | Significado |
|-------|---------|-------------|
| `public` | modificador de acceso | quién puede llamar a este método |
| `int` | tipo de retorno | qué tipo devuelve el método |
| `add` | nombre del método | cómo lo llamas |
| `int a, int b` | parámetros | valores de entrada con sus tipos |

---

## Modificadores de acceso

| Modificador | Quién puede acceder |
|-------------|---------------------|
| `public` | Todos |
| `private` | Solo dentro de la misma clase |
| `protected` | Misma clase + subclases + mismo paquete |
| (ninguno) | Solo el mismo paquete |

En Spring Boot usarás principalmente `public` para endpoints REST y métodos de servicio, y `private` para métodos auxiliares internos.

---

## Tipos de retorno

```java
public String getName() { return this.name; }   // devuelve un String
public int getAge() { return this.age; }         // devuelve un int
public boolean isActive() { return this.active; }// devuelve boolean — por convención empieza con "is"
public void save(Employee e) { ... }             // no devuelve nada
public Employee findById(int id) { ... }         // devuelve un objeto
public List<Employee> findAll() { ... }          // devuelve una colección
```

---

## void vs Void

`void` (minúsculas) es una **palabra clave** de Java — significa que un método no devuelve nada:

```java
public void delete(Long id) { ... }  // no devuelve nada
```

`Void` (mayúsculas) es una **clase**. La usas como argumento de tipo genérico cuando algo genérico necesita *un tipo* en sus `<>` pero no hay ningún valor real que devolver. Java solo acepta una clase dentro de `<>`, nunca la palabra clave `void`:

```java
ResponseEntity<Void>   // ✓ — Void es una clase
ResponseEntity<void>   // ✗ — void es una palabra clave, no válida dentro de < >
```

> **Aclarando la confusión:** *no* es "`void` si no hay nada, `Void` si podría ser null". Ambas significan "sin valor" — simplemente viven en lugares distintos. Usa la palabra clave `void` para el tipo de retorno de un método; usa la clase `Void` solo cuando un genérico (`ResponseEntity<T>`, `Callable<T>`) te obliga a poner un tipo en `<>` y no hay nada que devolver.

Este es exactamente el patrón de Spring Boot para `delete` — el servicio devuelve `void`, pero el controlador devuelve `ResponseEntity<Void>` para poder enviar un estado 204 sin cuerpo (ver [spring-boot/02-rest-controllers.md](../spring-boot/02-rest-controllers.md)):

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    projectService.delete(id);                  // void — no devuelve nada
    return ResponseEntity.noContent().build();  // 204, sin cuerpo
}
```

---

## Métodos estáticos

Un método `static` pertenece a la clase, no a una instancia. Lo llamas sobre el nombre de la clase, no sobre un objeto:

```java
public class MathUtils {
    public static int square(int n) {
        return n * n;
    }
}

// Llamada sin crear un objeto
int result = MathUtils.square(5);   // 25
```

Ya has usado métodos estáticos — `Integer.parseInt("42")` y `String.valueOf(42)` son estáticos.

En Spring Boot, los métodos de servicio y repositorio son métodos de instancia (llamados sobre objetos inyectados). Los métodos de utilidad que no necesitan estado son buenos candidatos para `static`.

---

## Sobrecarga de métodos (overloading)

Mismo nombre de método, parámetros distintos. Java elige la versión correcta según los argumentos que le pases:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
public int add(int a, int b, int c) { return a + b + c; }

add(1, 2);         // llama a la primera versión — devuelve 3
add(1.5, 2.5);     // llama a la segunda versión — devuelve 4.0
add(1, 2, 3);      // llama a la tercera versión — devuelve 6
```

El tipo de retorno por sí solo no es suficiente para sobrecargar — los parámetros deben ser distintos.

---

## Varargs — número variable de argumentos

Acepta cualquier número de argumentos del mismo tipo. Debe ser el último parámetro:

```java
public int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) total += n;
    return total;
}

sum(1, 2);           // 3
sum(1, 2, 3, 4, 5);  // 15
sum();               // 0
```

Dentro del método, `numbers` se comporta como un array.

---

## Llamar a métodos

```java
// Método de instancia — se llama sobre un objeto
Employee emp = new Employee();
emp.save();
String name = emp.getName();

// Método estático — se llama sobre la clase
int parsed = Integer.parseInt("42");

// Method chaining — cada método devuelve el objeto (o uno nuevo)
String result = "  hello  "
    .trim()
    .toUpperCase()
    .replace("HELLO", "HI");   // "HI"
```

---

## Convenciones de nombres

- Nombres de métodos: `camelCase`, empiezan con un verbo — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Getters booleanos: empiezan con `is` o `has` — `isActive()`, `hasRole()`, `isEmpty()`
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`
