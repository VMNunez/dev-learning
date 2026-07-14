# OOP — Clases

> 📖 [Baeldung — A guide to Java classes and objects](https://www.baeldung.com/java-classes-objects) → leer: "Creating a Class" y "Constructors"
> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## Qué es la programación orientada a objetos

Al final de [03-methods.md](03-metodos.md) convertiste la `Calculator` en algo con un campo y un constructor — un pequeño objeto que guarda estado *y* los métodos que trabajan sobre él. Eso no es un detalle de un ejemplo suelto; es la idea entera de la que trata este archivo.

La **programación orientada a objetos** (OOP) es una forma de organizar el código agrupando los datos y el comportamiento que actúa sobre ellos en unidades únicas llamadas **objetos**. En lugar de funciones sueltas flotando junto a variables sueltas, defines **clases** que juntan ambas cosas.

Tomemos un `Employee`. En un estilo no orientado a objetos podrías tener un string `name` por aquí, un string `email` por allá, y funciones separadas `getName(name)`, `setEmail(...)` en otro lado — nada que las ate entre sí. En OOP el `Employee` *es* una sola cosa que lleva sus propios datos (`name`, `email`, `age`) **y** los métodos que operan sobre esos datos (`getName()`, `setEmail()`, `isActive()`). Los datos y el comportamiento viven en la misma caja.

> **¿Por qué juntarlos siquiera?** Porque los métodos que cambian un dato deberían estar al lado de ese dato, protegiéndolo. Si `age` y `setAge()` viven juntos en un objeto, el objeto puede rechazar una edad inválida (ver *Encapsulación* más abajo). Sepáralos y nada impide que el mundo exterior ponga `age = -500` directamente. La OOP es lo que hace que un objeto pueda *protegerse a sí mismo* — el tema recurrente de todo este archivo.

Java es orientado a objetos casi al 100%: casi todo lo que escribes vive dentro de una clase. Ya lo has estado haciendo sin ponerle nombre — cada método `main` estaba dentro de una clase, y cada `String` o `Integer` que tocaste era un objeto. Este archivo por fin mira la clase misma de frente.

## Qué es una clase

Una clase es el molde (blueprint) para crear objetos. Un objeto es una instancia de esa clase.

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

La clase se escribe una vez; los objetos se estampan a partir de ella tantas veces como llames a `new`. Cada objeto obtiene su **propia** copia de los campos — cambia uno y los demás quedan intactos:

```
        class Employee            <- el molde (una definición, escrita una vez)
        ┌──────────────────┐
        │ name  : String   │
        │ email : String   │
        │ age   : int      │
        └──────────────────┘
                 │  new Employee(...)  new Employee(...)
                 ▼                 ▼
   emp1 ┌──────────────────┐   emp2 ┌──────────────────┐
        │ name  = "Victor" │        │ name  = "Ana"    │   <- objetos separados (instancias),
        │ email = "v@e.com"│        │ email = "a@e.com"│      cada uno con sus propios valores de campo
        │ age   = 31       │        │ age   = 28       │
        └──────────────────┘        └──────────────────┘
```

> **El blueprint es literal.** La clase no guarda datos propios — `name`/`email`/`age` son solo *huecos* que el molde promete que todo objeto tendrá. Los valores reales solo existen una vez que haces `new` de un objeto. Piensa en la clase como el plano de un arquitecto y en cada objeto como una casa construida a partir de él: el plano dice "aquí hay una puerta de entrada", cada casa tiene su propia puerta real.

---

## `this`

Mira el constructor de *Qué es una clase*: el parámetro se llama `name` y el campo también se llama `name`. Entonces, ¿qué significa un simple `name = name`? Java resuelve cualquier nombre hacia el *más cercano* que esté en el ámbito, y el parámetro está más cerca que el campo — así que `name` a secas siempre significa el parámetro, y `name = name` se limita a asignarse el parámetro a sí mismo, dejando el campo intacto. Necesitas una forma de decir "el campo, no el parámetro". Esa palabra es `this`.

`this` es una referencia al objeto actual — la instancia concreta cuyo constructor o método se está ejecutando en este momento. Anteponer `this.` a un campo pasa por encima del parámetro y apunta al hueco propio del objeto:

```java
public Employee(String name) {
    this.name = name;   // this.name = el campo de este objeto; name = el parámetro
}
```

> **¿Por qué mantener el mismo nombre siquiera — por qué no llamar al parámetro `n`?** Podrías, pero nombrar el parámetro igual que el campo que rellena es el convenio estándar en Java: documenta a qué campo va el valor, y `this.` elimina el único inconveniente (la ambigüedad). Leer `this.email = email` te dice de un vistazo "el email entrante pasa a ser el email de este objeto".

También se usa para llamar a otro constructor desde dentro de un constructor. Ambos constructores pertenecen a la misma clase — es una forma de reutilizar la lógica de inicialización cuando uno de los constructores es un caso especial del otro:

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

Siempre que ves `this(...)` dentro de un constructor, significa "llama a otro constructor de esta misma clase con estos argumentos." La llamada a `this()` debe ser siempre la **primera línea** del constructor.

> **¿Por qué `this()` debe ser la primera línea?** El único trabajo de un constructor es llevar al objeto desde memoria cruda y sin inicializar hasta un estado completamente válido. Si pudieras ejecutar sentencias *antes* de delegar, estarías tocando campos de un objeto a medio construir — y luego el constructor delegado se ejecutaría y sobrescribiría ese trabajo, tirando en silencio todo lo que hiciste. Java elimina el peligro entero por norma: la delegación ocurre primero, sobre el objeto todavía en blanco, y solo entonces se ejecutan las líneas propias del constructor actual sobre un objeto ya bien inicializado. Rompe la regla y el compilador te frena en seco: `call to this must be first statement in constructor`.

---

## Constructores

Un constructor es el método especial que se ejecuta cuando creas un objeto con `new`. Dos reglas fijas: (1) debe llamarse exactamente igual que la clase, y (2) no tiene tipo de retorno — ni siquiera `void`. Así es como el compilador lo distingue de un método normal.

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

    public String getName() { return this.name; }   // getter — lectura controlada
    public int getAge() { return this.age; }         // getter — lectura controlada
    public void setAge(int age) {                    // setter con validación
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        this.age = age;
    }
}
```

Sin encapsulación, cualquiera podría hacer esto:

```java
// Sin encapsulación — campo público, cualquiera puede asignar cualquier valor
emp.age = -500;  // nada lo impide

// Con encapsulación — campo private, setter valida antes de asignar
emp.setAge(-500);  // lanza IllegalArgumentException — el objeto se protege a sí mismo
```

---

## Campos y métodos estáticos

"Miembros" es el término general para los campos y métodos de una clase. Los miembros `static` pertenecen a la clase en sí, no a ningún objeto individual. `static` tiene sentido en dos situaciones: (1) cuando el método solo trabaja con sus argumentos y no necesita datos de la instancia — como `Integer.parseInt("42")`; (2) cuando quieres un campo compartido entre todas las instancias — como un contador de cuántos objetos se han creado.

"Pertenece a la clase, no a ningún objeto" no es solo un eslogan — es un hecho sobre *dónde vive físicamente el valor en memoria*. Un campo normal (no estático) obtiene **un hueco por objeto**: crea tres `Employee` y hay tres huecos `name` separados, uno dentro de cada objeto, como mostró el diagrama de *Qué es una clase*. Un campo `static` es distinto — Java reserva **exactamente un hueco**, ligado a la clase misma, y todos los objetos comparten ese mismo hueco:

```
   static int count  ──►  ┌─────────┐   un hueco compartido, propiedad de la clase
                          │   3     │   (todas las instancias leen/escriben la MISMA caja)
                          └─────────┘
                             ▲  ▲  ▲
                             │  │  │
        emp1 ────────────────┘  │  └──────────────── emp3
        (name="Victor")     emp2 (name="Ana")   (name="Leo")
        cada uno tiene su PROPIO hueco name, pero todos apuntan al ÚNICO count
```

Esto es exactamente por qué funciona el contador: como solo hay una caja `count` en todo el programa, cada constructor que hace `count++` está incrementando la *misma* caja. Si cada objeto tuviera su propio `count`, todos se quedarían en `1` y el total se perdería. Un método `static` funciona igual — hay una copia del método ligada a la clase, y como no está atada a ningún objeto no puede leer campos por objeto (no hay ningún "este objeto" dentro del que mirar).

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

La sobrecarga de constructores es el mismo concepto que la sobrecarga de métodos (visto en [03-methods.md](03-metodos.md) — varios métodos que comparten nombre, distinguidos por su lista de parámetros): puedes definir varios constructores en la misma clase, cada uno con parámetros distintos. Java elige el correcto según los argumentos que le pases con `new`. Es útil cuando quieres permitir distintas formas de crear un objeto — con todos los datos, con solo los campos obligatorios, o con valores por defecto para los opcionales:

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

Cuando haces `System.out.println(emp)`, Java necesita convertir el objeto a texto. Busca un método llamado exactamente `toString()` en tu clase — si no lo encuentra, recurre al de la clase base `Object`, que imprime algo ilegible como `Employee@1b6d3586` (nombre de la clase + dirección en memoria, inútil para depurar).

El nombre `toString()` no lo eliges tú — es el nombre que Java espera por convenio. Siempre devuelve `String` y no recibe parámetros.

`@Override` le dice al compilador "estoy reemplazando este método que existe en una clase padre." Si escribes mal el nombre (por ejemplo `tostring()` con minúsculas), sin `@Override` Java lo trataría como un método nuevo sin relación y tu `println` seguiría mostrando la dirección de memoria. Con `@Override`, el compilador detecta el error de tipografía inmediatamente. Aprenderás las anotaciones en detalle en `13-annotations.md` — por ahora, basta con saber que `@Override` va encima de cualquier método que estés reemplazando intencionalmente.

```java
@Override
public String toString() {
    return "Employee{name='" + name + "', email='" + email + "'}";
}

System.out.println(emp);   // Employee{name='Victor', email='victor@example.com'}
```

---

## `equals()` y `hashCode()`

Ya sabes que para los Strings usas `.equals()` en lugar de `==` porque `==` compara referencias (direcciones de memoria), no contenido. El mismo problema existe con cualquier objeto que tú definas.

Por defecto, si haces `emp1.equals(emp2)`, Java comprueba si son el mismo objeto en memoria — no si tienen los mismos datos. Si quieres que dos empleados sean "iguales" cuando tienen el mismo email, sobreescribes `equals()` en tu clase para definir qué significa "igual":

```java
// Dentro de la clase Employee:
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;                        // mismo objeto — trivialmente igual
    if (!(obj instanceof Employee other)) return false;  // tipos distintos — no pueden ser iguales
    return Objects.equals(this.email, other.email);      // tu criterio de igualdad: mismo email
}
```

> **¿Qué es `other`, y por qué aparece de la nada?** El parámetro llega tipado como `Object` (esa es la firma que Java impone a `equals`), así que no puedes leer `obj.email` — el tipo `Object` no tiene `email`. Necesitas verlo como un `Employee`. `obj instanceof Employee other` hace dos trabajos en una línea: comprueba si `obj` es realmente un `Employee`, y *si lo es* declara una variable nueva `other` ya casteada a `Employee`, para que la línea siguiente pueda leer `other.email` con seguridad. Esta forma de "declarar la variable casteada en línea" es el **pattern matching para `instanceof`**, añadido en Java 16. Antes, escribías la comprobación y el cast como dos pasos separados:
>
> ```java
> if (!(obj instanceof Employee)) return false;
> Employee other = (Employee) obj;   // la vieja forma en dos pasos — comprobar, luego castear a mano
> ```
>
> Ambas hacen lo mismo; la forma de Java 16 solo dobla el cast dentro de la comprobación para que nunca repitas el tipo.

> **¿Qué es `Objects`?** `Objects` (de `java.util`) es una pequeña clase de utilidad con helpers estáticos para exactamente este tipo de código. `Objects.equals(a, b)` compara dos valores pero sobrevive a `null` — si ambos son `null` devuelve `true`, y nunca lanza una `NullPointerException` como sí haría `a.equals(b)` cuando `a` es `null`. `Objects.hash(...)` toma cualquier número de campos y los combina en un solo `int` hash. Los usas para no tener que escribir a mano los null-checks y la aritmética de mezclado del hash.

`hashCode()` va siempre junto a `equals()` — las colecciones como `HashMap` y `HashSet` usan ambos para organizar los objetos. La regla es simple: si dos objetos son iguales según `equals()`, deben tener el mismo `hashCode()`. Si sobreescribes uno sin el otro, esas colecciones dejan de funcionar correctamente:

```java
@Override
public int hashCode() {
    return Objects.hash(email);  // el mismo campo que usaste en equals()
}
```

> **¿Por qué un `HashMap` necesita siquiera `hashCode()`?** Un `HashMap` no recorre cada clave una por una cuando buscas algo — eso sería lento. En su lugar mantiene un array de "buckets" (cubos), y usa el `hashCode()` de la clave como una dirección: aproximadamente `bucketIndex = hashCode % numberOfBuckets`. Para guardar o encontrar una clave salta directo a ese único bucket en vez de buscar por todo el mapa. Solo *dentro* de ese bucket recurre a `equals()` para distinguir claves que casualmente cayeron juntas. Ahora la regla cobra sentido mecánicamente: si dos objetos iguales devolvieran hash codes *distintos*, se enviarían a buckets *distintos* — guardarías una entrada bajo una dirección y luego la buscarías en otra, y el mapa juraría que la clave no está aunque una igual sí lo esté. Por eso los objetos iguales deben compartir `hashCode()`: es lo que garantiza que caigan en el mismo bucket donde `equals()` luego puede emparejarlos.

En la práctica, IntelliJ genera ambos automáticamente: `Code → Generate → equals() and hashCode()`.

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

> **Vista previa — Spring Boot:** El ejemplo a continuación usa un `repository` y un `controller`, que son conceptos de Spring Boot que aún no has estudiado. Léelo para ver cómo encajan los records en un proyecto real — lo construirás en las notas de Spring Boot.

```java
// Patrón DTO clásico en Spring Boot
public record EmployeeDTO(String name, String email) {}

// En un controller:
public EmployeeDTO getEmployee(int id) {
    Employee emp = repository.findById(id);
    return new EmployeeDTO(emp.getName(), emp.getEmail());
}
```

---

Ya puedes modelar una sola cosa como una clase: sus datos (campos), cómo se construye (constructores), qué puede hacer (métodos), y cómo se protege a sí misma (encapsulación). Pero cada clase hasta ahora ha estado sola. Los sistemas reales tienen *familias* de cosas relacionadas — un `Employee` y un `Manager` que comparten casi todo el comportamiento, o una docena de clases sin relación que deben prometer todas que saben hacer `print()`. Hacer que las clases compartan comportamiento, o que acuerden un contrato común, es el siguiente paso. De eso trata [05-interfaces-abstract.md](05-interfaces-abstractas.md): las interfaces (un contrato que una clase firma) y las clases abstractas (un padre a medio construir que otros completan).
