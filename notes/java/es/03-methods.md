# Métodos

> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html)

## Declaración de un método

Un método es un bloque de código con nombre que realiza una tarea concreta. Lo defines una vez y lo llamas desde cualquier parte del programa. Tiene cuatro partes: un modificador de acceso (quién puede usarlo), el tipo de lo que devuelve, su nombre y sus parámetros de entrada.

```java
modificadorDeAcceso tipoRetorno nombreMetodo(parámetros) {
    // cuerpo
    return valor;
}
```

Aquí tienes el esquema con ejemplos concretos:

| Parte          | Ejemplo               | Significado                      |
| -------------- | --------------------- | -------------------------------- |
| `public`       | modificador de acceso | quién puede llamar a este método |
| `int`          | tipo de retorno       | qué tipo devuelve el método      |
| `add`          | nombre del método     | cómo lo llamas                   |
| `int a, int b` | parámetros            | valores de entrada con sus tipos |

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

---

## Modificadores de acceso

Un modificador de acceso controla desde dónde se puede llamar a un método (o acceder a un campo). Es la forma en que Java protege el código interno de una clase y decide qué partes son visibles desde fuera.

| Modificador | Quién puede acceder                     |
| ----------- | --------------------------------------- |
| `public`    | Todos                                   |
| `private`   | Solo dentro de la misma clase           |
| `protected` | Misma clase + subclases + mismo paquete |
| (ninguno)   | Solo el mismo paquete                   |

En Spring Boot usarás principalmente `public` para endpoints REST y métodos de servicio, y `private` para métodos auxiliares internos.

---

## Tipos de retorno

El tipo de retorno indica qué tipo de valor devuelve el método cuando termina. Si el método no devuelve nada, su tipo de retorno es `void`.

```java
public String getName() { return this.name; }    // devuelve un String
public int getAge() { return this.age; }          // devuelve un int
public boolean isActive() { return this.active; } // devuelve boolean — por convención empieza con "is"
public void save(Employee e) { ... }              // no devuelve nada
public Employee findById(int id) { ... }          // devuelve un objeto
public List<Employee> findAll() { ... }           // devuelve una colección
```

---

## void vs Void

`void` (minúsculas) es una **palabra clave** de Java — significa que un método no devuelve nada:

```java
public void delete(Long id) { ... }  // no devuelve nada
```

`Void` (mayúsculas) es una **clase**. ¿Por qué existe? Porque en algunos sitios de Java tienes que poner un tipo entre `<>` — por ejemplo, `ResponseEntity<T>` o `Callable<T>`. El problema es que Java no acepta la palabra clave `void` dentro de `<>`, solo acepta clases. `Void` es la clase que significa "nada" y que sí cabe dentro de `<>`:

```java
ResponseEntity<Void>   // ✓ — Void es una clase, cabe dentro de < >
ResponseEntity<void>   // ✗ — void es una palabra clave, no válida dentro de < >
```

> **Resumen claro:** usa `void` (minúsculas) como tipo de retorno de un método. Usa `Void` (mayúsculas) solo cuando algo genérico te obliga a poner un tipo entre `<>` y no hay nada real que devolver. No es "void si no hay nada, Void si podría ser null" — ambas significan "sin valor", solo que viven en lugares distintos del lenguaje.

> **Vista previa — Spring Boot:** El ejemplo a continuación usa `ResponseEntity`, una clase de Spring Boot que aún no has estudiado. Léelo para ver dónde importa la diferencia entre `void` y `Void` en la práctica — lo implementarás tú mismo en las notas de Spring Boot.

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

Para entender `static`, primero necesitas entender la diferencia entre una **clase** y un **objeto** (también llamado instancia). La clase es el molde — la definición de cómo son los objetos. Los objetos son las copias concretas creadas a partir de ese molde.

Un método normal (de instancia) pertenece a cada objeto individual. Cada `Employee` que crees tiene su propio `getName()`, porque devuelve el nombre de *ese* empleado en concreto — necesita el objeto para funcionar.

Un método `static` pertenece a la **clase en sí**, no a ningún objeto individual. No necesitas crear un objeto para llamarlo — lo llamas directamente sobre el nombre de la clase:

```java
public class MathUtils {
    public static int square(int n) {
        return n * n;
    }
}

// No necesitas crear un MathUtils para usarlo
int result = MathUtils.square(5);   // 25
```

¿Cuándo tiene sentido usar `static`? Cuando el método realiza una operación que no depende de ningún dato concreto de un objeto — solo de los parámetros que le pasas. `MathUtils.square(5)` no necesita saber nada de ningún `Employee` ni de ninguna otra clase.

Ya has usado métodos estáticos sin saberlo: `Integer.parseInt("42")` y `String.valueOf(42)` son estáticos — los llamas sobre la clase `Integer` o `String`, no sobre un objeto concreto.

> **En Spring Boot:** los métodos de tus services y repositories son métodos de instancia — los llamas sobre objetos que Spring inyecta (`employeeService.findAll()`, `employeeRepository.save(emp)`). Necesitan el objeto porque trabajan con datos internos (la conexión a base de datos, la configuración, etc.). Los métodos `static` aparecen en clases de utilidad pura, como `JwtUtils.generateToken(username)` — operaciones sin estado que solo dependen de los argumentos que les pasas.

---

## Sobrecarga de métodos (overloading)

Se llama **sobrecarga** cuando una clase tiene varios métodos con el mismo nombre pero con parámetros distintos. Java los distingue por el número o los tipos de parámetros que reciben, y elige el correcto automáticamente según lo que le pases:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
public int add(int a, int b, int c) { return a + b + c; }

add(1, 2);         // llama a la primera versión — devuelve 3
add(1.5, 2.5);     // llama a la segunda versión — devuelve 4.0
add(1, 2, 3);      // llama a la tercera versión — devuelve 6
```

Nota: cambiar solo el tipo de retorno no es suficiente para sobrecargar un método. Los parámetros deben ser distintos — ahí es donde Java mira para decidir qué versión llamar.

---

## Varargs — número variable de argumentos

Normalmente, cuando defines un método con dos parámetros, tienes que pasarle exactamente dos argumentos. Con varargs (`...`) puedes pasarle cualquier cantidad — cero, uno, cinco o los que quieras. Java los recoge en un array internamente.

La sintaxis es `Tipo... nombre`. Debe ser el último parámetro del método, porque si hubiera más parámetros después Java no sabría dónde termina la lista variable y empieza el siguiente argumento fijo.

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

Antes de ver cómo se llama a un método, veamos un ejemplo completo — primero la clase con sus métodos y luego cómo los usamos desde fuera:

```java
public class Calculator {
    private String name;

    public Calculator(String name) {
        this.name = name;
    }

    // Método de instancia — necesita el objeto para funcionar
    public int add(int a, int b) {
        return a + b;
    }

    // Método estático — no necesita ningún objeto
    public static double square(double n) {
        return n * n;
    }

    public String getName() {
        return this.name;
    }
}
```

```java
// Método de instancia — necesitas crear un objeto primero
Calculator calc = new Calculator("MyCalc");
int result = calc.add(3, 4);           // 7
String name = calc.getName();          // "MyCalc"

// Método estático — se llama directamente sobre la clase, sin objeto
double squared = Calculator.square(5); // 25.0

// Method chaining — cada método devuelve un string nuevo y puedes encadenar las llamadas
String result2 = "  hello  "
    .trim()
    .toUpperCase()
    .replace("HELLO", "HI");           // "HI"
```

---

## Convenciones de nombres

- Nombres de métodos: `camelCase`, empiezan con un verbo — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Getters booleanos: empiezan con `is` o `has` — `isActive()`, `hasRole()`, `isEmpty()`
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`
