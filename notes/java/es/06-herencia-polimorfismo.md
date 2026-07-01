# Herencia y Polimorfismo

> 📖 [Baeldung — Guide to Java inheritance](https://www.baeldung.com/java-inheritance) → leer: "Types of Inheritance" y "Polymorphism"
> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

Usas la herencia cuando dos o más clases son del mismo _tipo_ de cosa y comparten la mayor parte de su comportamiento, pero difieren en algunos métodos concretos. Sin ella, escribirías los mismos métodos `eat()`, `breathe()` y `sleep()` en cada clase animal — y al cambiar uno, tendrías que actualizarlo en todas las copias. La herencia te permite escribir el comportamiento compartido una sola vez en una **clase padre**, y cada **subclase** lo hereda automáticamente.

## Herencia — `extends`

Una subclase hereda todos los campos y métodos `public` y `protected` de la clase padre y también puede añadir los suyos propios. Los campos `private` del padre técnicamente forman parte del objeto — ocupan espacio en memoria — pero la subclase no puede acceder a ellos directamente: solo a través de los getters y setters que el padre exponga. `protected` es el modificador que eliges cuando quieres que las subclases lean el campo directamente sin necesidad de un getter — por eso en los ejemplos de herencia verás campos `protected` en la clase padre. La clase padre no tiene que ser abstracta necesariamente: si tiene sentido crear instancias directas de ella (`new Animal()`), déjala como clase normal. La declaras abstracta solo cuando no tiene sentido instanciarla directamente — cuando `Animal` es un concepto demasiado genérico y ningún objeto concreto debería ser "solo un Animal" sin ser un tipo más específico. Por ejemplo, en TimeTrack tiene sentido crear `new User()` directamente — un usuario es un objeto concreto con datos reales. En cambio, si tuvieras una clase `BaseEntity` con solo `id`, `createdAt` y `updatedAt`, debería ser abstracta: nunca crearías `new BaseEntity()` porque no existe ningún objeto del sistema que sea «solo una entidad base» — siempre es un `User`, un `Project` o similar:

```java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }
}

public class Dog extends Animal {
    private String breed;

    public Dog(String name, String breed) {
        super(name);    // llama al constructor del padre — DEBE ser la primera línea
        this.breed = breed;
    }

    public void fetch() {
        System.out.println(name + " is fetching");  // name heredado de Animal
    }
}

Dog dog = new Dog("Rex", "Labrador");
dog.eat();     // heredado de Animal
dog.fetch();   // definido en Dog
```

Java solo permite **herencia simple** — una clase solo puede extender una clase. Esto es diferente de TypeScript, donde puedes componer tipos con intersecciones.

---

## `super`

Cuando una subclase tiene su propio constructor, normalmente necesita que el padre inicialice primero sus propios campos. `super()` activa esa inicialización — y debe ser siempre la primera línea:

```java
// super() — llama al constructor del padre
public Dog(String name, String breed) {
    super(name);   // debe ser la primera línea del constructor
    this.breed = breed;
}
```

También se puede usar super en los métodos. En la práctica, `super.method()` aparece cuando quieres ampliar el comportamiento del padre, no sustituirlo completamente. El caso más habitual en Spring Boot es cuando extiendes una clase de configuración: llamas a `super.configure(...)` para que el padre aplique su configuración base y luego añades tus propias reglas encima. También lo verás en la sección final de este archivo: `super("Employee not found: " + id)` en el constructor de `EmployeeNotFoundException` llama al constructor de `RuntimeException` para que este inicialice el mensaje de error estándar — tú solo añades el mensaje personalizado. Cuando quieres sustituir el comportamiento por completo, sobreescribes el método sin llamar a `super` — eso es lo más habitual en la lógica de negocio.

```java
// super.method() — llama al método del padre
@Override
public void eat() {
    super.eat();                          // ejecuta primero la versión del padre
    System.out.println("...and more!");   // luego añade comportamiento extra
}
```

---

## Sobreescritura de métodos — `@Override`

El comportamiento que una subclase hereda del padre no siempre es el adecuado para ese tipo concreto. La sobreescritura te permite reemplazar un método del padre por una versión adaptada a la subclase, manteniendo el mismo nombre — de modo que cualquier código que trabaje con el tipo padre sigue funcionando sin cambios. La firma del método debe coincidir exactamente:

```java
public class Animal {
    public String speak() {
        return "...";
    }
}

public class Dog extends Animal {
    @Override
    public String speak() {
        return "Woof!";
    }
}

public class Cat extends Animal {
    @Override
    public String speak() {
        return "Meow!";
    }
}
```

`@Override` es opcional pero siempre recomendable — le dice al compilador que verifique que realmente estás sobreescribiendo un método del padre, no creando accidentalmente uno nuevo.

### Overriding vs Overloading

**Overriding** (sobreescritura) es lo que acabas de ver: una subclase reemplaza un método del padre con el mismo nombre y la misma firma exacta. Lo que Java decide en runtime no es el tipo de la variable, sino el tipo real del objeto que hay en memoria: si guardas un `Dog` en una variable `Animal`, Java ejecuta la versión de `Dog`, no la de `Animal`.

**Overloading** (sobrecarga) ya lo viste en [03-methods.md](03-methods.md): varios métodos con el mismo nombre dentro de la misma clase, cada uno con parámetros distintos en número o tipo. Java los distingue en tiempo de compilación — elige el método correcto mirando los argumentos que le pasas. Son dos conceptos distintos que solo comparten que ambos reutilizan el mismo nombre de método.

La fila «Herencia» de la tabla indica si el concepto requiere una jerarquía de clases: la sobreescritura sí la necesita — sin una subclase que extienda a otra, no hay nada que sobreescribir; la sobrecarga no requiere herencia — puedes definir `calcular(int x)` y `calcular(double x)` en la misma clase sin extender ninguna otra.

|          | Overriding                       | Overloading                           |
| -------- | -------------------------------- | ------------------------------------- |
| Dónde    | Subclase                         | Misma clase                           |
| Firma    | Debe coincidir exactamente       | Parámetros distintos en tipo o número |
| Herencia | Sí (requiere subclase)           | No                                    |
| Runtime  | Se decide en tiempo de ejecución | Se decide en tiempo de compilación    |

---

## Polimorfismo

El problema que resuelve el polimorfismo: tienes una lista con objetos de tipos distintos pero relacionados — `Dog`, `Cat` y `Bird`, todos subclases de `Animal` — y necesitas llamar al mismo método en todos ellos. Sin polimorfismo tendrías que escribir un `if` para cada tipo — y cada vez que añades un tipo nuevo, modificas ese `if`. Con polimorfismo, declaras todos como `Animal` y llamas a `speak()` una sola vez: Java se encarga de ejecutar la versión correcta de cada objeto.

La clave es entender que el tipo de la **variable** y el tipo del **objeto** pueden ser distintos:

```java
Animal a = new Dog("Rex", "Labrador");  // variable: Animal  /  objeto real: Dog
```

Cuando llamas a `a.speak()`, Java no mira el tipo de la variable (`Animal`) — mira el tipo del objeto real en memoria (`Dog`) y ejecuta la versión de `speak()` definida en `Dog`. A esto se le llama **dispatch dinámico**: la decisión de qué método ejecutar ocurre en runtime, no en tiempo de compilación.

```java
Animal a1 = new Dog("Rex", "Labrador");
Animal a2 = new Cat("Whiskers");

a1.speak();   // "Woof!" — versión de Dog
a2.speak();   // "Meow!" — versión de Cat
```

Debes declarar la variable con el tipo padre (`Animal a = new Dog(...)`) cuando quieres tratar objetos de distintos tipos de forma uniforme — eso es aprovechar el polimorfismo. Pero si en ese momento necesitas comportamiento específico de `Dog`, declara directamente `Dog dog = new Dog(...)`. La regla práctica es usar el tipo más general que todavía te dé lo que necesitas.

El caso que más aclara la idea es una lista de tipos mixtos. Sin polimorfismo necesitas comprobar el tipo de cada objeto a mano — y el código se rompe cada vez que añades un tipo nuevo:

```java
// Sin polimorfismo — frágil: cada tipo nuevo exige modificar este bucle
for (Animal a : animals) {
    if (a instanceof Dog) System.out.println("Woof!");
    else if (a instanceof Cat) System.out.println("Meow!");
    // ¿añades Bird? tienes que venir aquí y añadir otro else if
}

// Con polimorfismo — extensible: añades Bird y no tocas este bucle
List<Animal> animals = new ArrayList<>();
animals.add(new Dog("Rex", "Labrador"));
animals.add(new Cat("Whiskers"));

for (Animal a : animals) {
    System.out.println(a.speak());  // Dog → "Woof!", Cat → "Meow!" — sin if ninguno
}
```

**En Spring Boot** este patrón es fundamental. Imagina que tienes varios tipos de notificación — `EmailNotification`, `SmsNotification`, `PushNotification` — todos implementando una interfaz `Notification` con un método `send()`. El servicio que los usa no necesita saber de qué tipo es cada uno:

```java
public void notifyAll(List<Notification> notifications) {
    for (Notification n : notifications) {
        n.send();  // Email, SMS o Push — Java elige la versión correcta en runtime
    }
}
```

Si mañana añades `WhatsAppNotification`, el servicio no cambia ni una línea.

---

## `instanceof` y pattern matching

Cuando trabajas con polimorfismo, puede que en algún punto necesites acceder a un método que existe solo en una subclase concreta — no en el padre. Por ejemplo, tienes una variable `Animal` que en realidad contiene un `Dog`, y necesitas llamar a `fetch()`, que solo `Dog` tiene.

Si intentas llamar a `animal.fetch()` directamente, el compilador te lo rechaza — `Animal` no tiene ese método. Para poder llamarlo, necesitas hacer un **cast** — decirle al compilador «trata esta variable como `Dog`». Pero si el objeto no es realmente un `Dog`, el cast lanzaría una `ClassCastException` en runtime. `instanceof` existe precisamente para evitar ese error: comprueba el tipo real antes de hacer el cast.

```java
Animal animal = new Dog("Rex", "Labrador");  // tipo de la variable: Animal — objeto real en memoria: Dog

// Forma clásica (hasta Java 15)
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;  // cast explícito — ya sabemos que es seguro
    dog.fetch();
}

// Pattern matching (Java 16+) — más limpio, hace el cast automáticamente
if (animal instanceof Dog dog) {
    dog.fetch();   // dog ya está disponible como Dog, sin necesidad de cast manual
}
```

> Dicho esto, si te encuentras usando `instanceof` frecuentemente en tu código, es una señal de que el diseño puede mejorar — el polimorfismo está pensado precisamente para evitar esas comprobaciones manuales de tipo.

---

## Clases, métodos y campos `final`

`final` puede aplicarse a tres cosas distintas, cada una con un significado diferente:

- `final class` — la clase no puede ser extendida: ninguna subclase puede heredar de ella
- `final method` — el método no puede ser sobreescrito por ninguna subclase
- `final field` — el campo solo puede asignarse una vez; normalmente se inicializa en el constructor o en la propia declaración. A partir de ese momento su valor no puede cambiar

```java
public final class String { ... }  // ninguna clase puede heredar de String

public class Animal {
    public final void breathe() { ... }  // ninguna subclase puede sobreescribir este método
}

public class Circle {
    private final double radius;  // solo puede asignarse una vez

    public Circle(double radius) {
        this.radius = radius;  // única asignación permitida
    }
}
```

En Spring Boot verás `final` frecuentemente en los campos de las clases de servicio cuando se inyectan dependencias por constructor — es la forma recomendada de escribir los beans.

---

## La clase Object

En Java existe una clase que está en lo más alto de toda jerarquía de herencia: `Object`. Todas las clases la extienden automáticamente, aunque no lo declares. Esto significa que cualquier objeto que crees lleva consigo un conjunto de métodos heredados de `Object` — los hayas definido tú o no.

Los tres que más aparecen en proyectos reales son:

- **`toString()`** — se llama automáticamente cuando imprimes un objeto con `System.out.println(obj)` o lo concatenas en un `String`. Sin sobreescribirlo obtienes algo como `com.victor.timetrack.model.User@1a2b3c` — el nombre de la clase y una dirección de memoria, que no dice nada útil. Lo sobreescribes para devolver algo legible como `"User{name='Victor'}"`.
- **`equals()`** — compara si dos objetos son «iguales». Sin sobreescribirlo, Java compara referencias de memoria: dos objetos distintos con los mismos datos no son iguales aunque representen la misma entidad. Lo sobreescribes cuando quieres que la comparación se base en los valores de los campos.
- **`hashCode()`** — usado internamente por `HashMap` y `HashSet` para organizar objetos en memoria. La regla es: si sobreescribes `equals()`, siempre debes sobreescribir `hashCode()` también — si no, tus objetos se comportarán de forma inesperada dentro de colecciones.

Sobreescribir los tres es muy habitual en proyectos reales: `toString()` casi siempre, porque facilita el debugging al imprimir objetos; `equals()` y `hashCode()` juntos cuando los objetos se comparan por valor o se usan como claves en un `HashMap`. En Spring Boot, Lombok puede generarlos automáticamente con `@Data` o `@EqualsAndHashCode`, así que rara vez los escribes a mano.

```java
Object obj = new User("Victor");  // válido — User extiende Object implícitamente

// Sin sobreescribir toString() — Java usa la implementación de Object, que devuelve el nombre
// de la clase y una dirección de memoria que no te dice nada útil:
// System.out.println(user)  →  "com.victor.timetrack.model.User@6d06d69c"

// Sobreescribiendo toString() — tú decides qué información se muestra:
// System.out.println(user)  →  "User{name='Victor', email='victor@example.com'}"
```

IntelliJ puede generar `equals()`, `hashCode()` y `toString()` automáticamente sin que los escribas a mano: pulsa `Alt+Insert` dentro de la clase para abrir el menú *Generate*, elige *equals() and hashCode()* o *toString()*, y el IDE escribe el código por ti.

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa `JpaRepository` y `RuntimeException` en un contexto de Spring Boot. `JpaRepository` se explica en las notas de Spring Boot. `RuntimeException` es una clase Java que se cubre en `08-exceptions.md` — si aún no has leído ese archivo, vuelve aquí después.

La herencia aparece constantemente en Spring Boot:

```java
// Tu repositorio extiende JpaRepository — heredas findById, findAll, save, delete, etc.
public interface EmployeeRepository extends JpaRepository<Employee, Long> {}

// RuntimeException es una superclase — la extiendes para crear excepciones personalizadas
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found: " + id);
    }
}
```
