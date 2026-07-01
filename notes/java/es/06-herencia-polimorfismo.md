# Herencia y Polimorfismo

> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

Usas la herencia cuando dos o más clases son del mismo *tipo* de cosa y comparten la mayor parte de su comportamiento, pero difieren en algunos métodos concretos. Sin ella, escribirías los mismos métodos `eat()`, `breathe()` y `sleep()` en cada clase animal — y al cambiar uno, tendrías que actualizarlo en todas las copias. La herencia te permite escribir el comportamiento compartido una sola vez en una **clase padre**, y cada **subclase** lo hereda automáticamente.

## Herencia — `extends`

Una subclase hereda todos los campos y métodos `public` y `protected` de la clase padre y también puede añadir los suyos propios:

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

| | Overriding | Overloading |
|---|-----------|-------------|
| Dónde | Subclase | Misma clase |
| Firma | Debe coincidir exactamente | Parámetros distintos |
| Herencia | Sí | No |
| Runtime | Se decide en tiempo de ejecución | Se decide en tiempo de compilación |

---

## Polimorfismo

La verdadera ventaja de la herencia aparece cuando tienes código que trabaja con el tipo padre y quieres que funcione con cualquier subclase automáticamente, sin tener que modificarlo cada vez que añades una nueva. Eso es el polimorfismo: una variable de tipo padre puede almacenar un objeto de subclase, y el método que se ejecuta es siempre la versión de la subclase:

```java
Animal a1 = new Dog("Rex", "Labrador");
Animal a2 = new Cat("Whiskers");

a1.speak();   // "Woof!" — la versión de Dog
a2.speak();   // "Meow!" — la versión de Cat

// Almacenar distintos tipos en una lista
List<Animal> animals = new ArrayList<>();
animals.add(new Dog("Rex", "Labrador"));
animals.add(new Cat("Whiskers"));

for (Animal a : animals) {
    System.out.println(a.speak());  // llama a la versión correcta para cada uno
}
```

Esto es muy potente en Spring Boot — un método de servicio que acepta `Animal` funciona con `Dog`, `Cat`, o cualquier subclase futura.

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
