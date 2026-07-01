# Herencia y Polimorfismo

> 📖 [Baeldung — Guide to Java inheritance](https://www.baeldung.com/java-inheritance) → leer: "Types of Inheritance" y "Polymorphism"
> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

Usas la herencia cuando dos o más clases son del mismo _tipo_ de cosa y comparten la mayor parte de su comportamiento, pero difieren en algunos métodos concretos. Sin ella, escribirías los mismos métodos `eat()`, `breathe()` y `sleep()` en cada clase animal — y al cambiar uno, tendrías que actualizarlo en todas las copias. La herencia te permite escribir el comportamiento compartido una sola vez en una **clase padre**, y cada **subclase** lo hereda automáticamente.

## Herencia — `extends`

Una subclase hereda todos los campos y métodos `public` y `protected` de la clase padre y también puede añadir los suyos propios. Los campos `private` del padre técnicamente forman parte del objeto — ocupan espacio en memoria — pero la subclase no puede acceder a ellos directamente: solo a través de los getters y setters que el padre exponga. `protected` es el modificador que eliges cuando quieres que las subclases lean el campo directamente sin necesidad de un getter — por eso en los ejemplos de herencia verás campos `protected` en la clase padre. La clase padre no tiene que ser abstracta necesariamente: si tiene sentido crear instancias directas de ella (`new Animal()`), déjala como clase normal. La declaras abstracta solo cuando no tiene sentido instanciarla directamente — cuando `Animal` es un concepto demasiado genérico y ningún objeto concreto debería ser "solo un Animal" sin ser un tipo más específico:

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

En la práctica, `super.method()` aparece cuando quieres ampliar el comportamiento del padre, no sustituirlo completamente. El caso más habitual en Spring Boot es cuando extiendes una clase de configuración: llamas a `super.configure(...)` para que el padre aplique su configuración base y luego añades tus propias reglas encima. También lo verás en la sección final de este archivo: `super("Employee not found: " + id)` en el constructor de `EmployeeNotFoundException` llama al constructor de `RuntimeException` para que este inicialice el mensaje de error estándar — tú solo añades el mensaje personalizado. Cuando quieres sustituir el comportamiento por completo, sobreescribes el método sin llamar a `super` — eso es lo más habitual en la lógica de negocio.

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

**Overriding** (sobreescritura) es lo que acabas de ver: una subclase reemplaza un método del padre con el mismo nombre y la misma firma exacta. La decisión de qué versión ejecutar ocurre en runtime — Java mira el tipo real del objeto, no el tipo de la variable. **Overloading** (sobrecarga) ya lo viste en [03-methods.md](03-methods.md): varios métodos con el mismo nombre dentro de la misma clase, cada uno con parámetros distintos en número o tipo. Java los distingue en tiempo de compilación — elige el método correcto mirando los argumentos que le pasas. Son dos conceptos distintos que solo comparten que ambos reutilizan el mismo nombre de método.

|          | Overriding                       | Overloading                        |
| -------- | -------------------------------- | ---------------------------------- |
| Dónde    | Subclase                         | Misma clase                        |
| Firma    | Debe coincidir exactamente       | Parámetros distintos               |
| Herencia | Sí                               | No                                 |
| Runtime  | Se decide en tiempo de ejecución | Se decide en tiempo de compilación |

---

## Polimorfismo

El problema que resuelve el polimorfismo: tienes una lista con objetos de tipos distintos pero relacionados (`Dog`, `Cat`, `Bird`) y necesitas llamar al mismo método en todos ellos. Sin polimorfismo tendrías que escribir un `if` para cada tipo — y cada vez que añades un tipo nuevo, modificas ese `if`. Con polimorfismo, declaras todos como `Animal` y llamas a `speak()` una sola vez: Java se encarga de ejecutar la versión correcta de cada objeto.

La clave es entender que el tipo de la **variable** y el tipo del **objeto** pueden ser distintos:

```java
Animal a = new Dog("Rex", "Labrador");  // variable: Animal  /  objeto real: Dog
```

Cuando llamas a `a.speak()`, Java no mira el tipo de la variable (`Animal`) — mira el tipo del objeto real en memoria (`Dog`) y ejecuta la versión de `Dog`. A esto se le llama **dispatch dinámico**: la decisión de qué método ejecutar ocurre en runtime, no en tiempo de compilación.

```java
Animal a1 = new Dog("Rex", "Labrador");
Animal a2 = new Cat("Whiskers");

a1.speak();   // "Woof!" — versión de Dog
a2.speak();   // "Meow!" — versión de Cat
```

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

A veces tienes una variable tipada como `Animal` pero necesitas llamar a un método que solo tiene `Dog`. `instanceof` te permite comprobar el tipo real en tiempo de ejecución antes de intentar el cast:

```java
// Clásico
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;  // cast para acceder a métodos específicos de Dog
    dog.fetch();
}

// Pattern matching (Java 16+) — más limpio
if (animal instanceof Dog dog) {
    dog.fetch();   // dog ya está casteado y listo para usar
}
```

---

## Clases y métodos `final`

Usa `final` cuando necesites proteger una clase o un método para que ninguna subclase los pueda modificar — por ejemplo, para blindar lógica crítica que debe comportarse siempre igual independientemente del subtipo:

- `final class` — no puede ser extendida
- `final method` — no puede ser sobreescrita por una subclase

```java
public final class String { ... }  // String no puede subclasificarse

public class Animal {
    public final void breathe() { ... }  // ninguna subclase puede sobreescribir esto
}
```

---

## La clase Object

Cada clase Java extiende implícitamente `Object`. Por eso todas las clases tienen `toString()`, `equals()` y `hashCode()` — están definidos en `Object`. Cuando los sobreescribes, reemplazas la implementación por defecto de `Object`.

```java
Object obj = new Employee("Victor");  // válido — todo es un Object
```

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
