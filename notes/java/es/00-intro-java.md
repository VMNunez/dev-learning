# Introducción a Java

Docs: [Baeldung — Introduction to Java](https://www.baeldung.com/java-tutorial) → leer las secciones "What is Java?" y "How Java Works"

---

## Cómo funciona Java — del código fuente al programa en ejecución

La mayoría de lenguajes son **compilados** (traducidos a código máquina antes de ejecutarse) o **interpretados** (leídos y ejecutados línea a línea en tiempo real). Java combina las dos fases: primero tu código se compila a bytecode (de ahí lo de compilado), y después la JVM lee e interpreta ese bytecode para ejecutarlo (de ahí lo de interpretado). Lo que hace especial a esta combinación es que el bytecode no está ligado a ningún sistema operativo — el mismo fichero `.class` funciona en Windows, Linux y Mac sin recompilarlo.

Cuando escribes código Java, ocurren dos pasos:

1. **Compile time** (tiempo de compilación) — el compilador de Java (`javac`) lee tus ficheros `.java` y los traduce a **bytecode** (ficheros `.class`). El bytecode no es código máquina — es un conjunto de instrucciones neutras que ningún procesador entiende directamente. Este paso ocurre antes de que el programa arranque. Aquí es donde el compilador detecta errores de sintaxis y de tipos.

2. **Runtime** (tiempo de ejecución) — la **JVM** (Java Virtual Machine) lee el bytecode y lo ejecuta. La JVM es lo que realmente corre tu programa. Como existe una JVM para cada sistema operativo (Windows, Linux, Mac), el mismo bytecode funciona en todos sin recompilarlo. De aquí viene el lema histórico de Java: _"Write once, run anywhere."_

```
TuCodigo.java  →  [compilador javac]  →  TuCodigo.class  →  [JVM]  →  programa en ejecución
 código fuente       compile time           bytecode          runtime
```

> **¿Por qué importa esto en Spring Boot?** Cuando ejecutas `mvn spring-boot:run` o pulsas el botón verde de IntelliJ, Maven compila tu código y la JVM arranca tu aplicación. Cuando ves una `NullPointerException` en los logs, es un **error en runtime** — el compilador no lo detectó porque solo ocurre con datos concretos cuando el programa ya está corriendo.

---

## Tipado estático — los tipos se fijan en compile time

Java tiene **tipado estático**: cada variable tiene un tipo fijo que declaras cuando la creas, y ese tipo no puede cambiar nunca. El compilador comprueba cada asignación de tipos antes de que el programa arranque.

```java
String name = "Victor";  // el tipo es String — siempre, para siempre
name = 42;               // error de compilación — no puedes asignar un int a un String
```

Este es el primer contraste grande con JavaScript, donde las variables pueden cambiar de tipo en cualquier momento:

```javascript
let name = 'Victor'; // string
name = 42; // válido en JS — el tipo cambió a number en runtime
```

El tipado estático parece más estricto, pero elimina toda una categoría de errores antes de que el programa llegue a ejecutarse. En un proyecto Spring Boot con cientos de clases, el compilador es tu primera línea de defensa.

> **`var` no rompe el tipado estático.** Con `var name = "Victor"`, Java sigue fijando el tipo como `String` en compile time — simplemente lo deduce del lado derecho para que no tengas que escribirlo. El tipo no puede cambiar después. Consulta [01-variables-tipos.md](01-variables-tipos.md).

---

## Todo es una clase — la unidad mínima de Java

En JavaScript puedes escribir funciones y variables sueltas en cualquier sitio. En Java, **cada trozo de código debe vivir dentro de una clase**. No existen funciones flotantes.

```java
// Esto es ilegal en Java — no hay funciones independientes
public void greet() {
    System.out.println("Hello");
}

// La forma correcta — el método vive dentro de una clase
public class Greeter {
    public void greet() {
        System.out.println("Hello");
    }
}
```

Esto no es una rareza — es una consecuencia deliberada de que Java sea un lenguaje orientado a objetos (ver sección OOP más abajo). Cada componente de Spring Boot (`@Service`, `@Controller`, `@Repository`) es una clase. Cuando Spring arranca tu aplicación, crea objetos a partir de esas clases y los gestiona por ti.

---

## El punto de entrada — `public static void main(String[] args)`

Todo programa Java arranca desde un método concreto. La JVM busca exactamente esta firma al iniciarse:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}
```

Cada palabra tiene su razón de ser:

| Palabra clave   | Por qué está ahí                                                      |
| --------------- | --------------------------------------------------------------------- |
| `public`        | La JVM debe poder llamarlo desde fuera de la clase                    |
| `static`        | La JVM lo llama sin crear ningún objeto primero — solo carga la clase |
| `void`          | El punto de entrada no devuelve nada a la JVM                         |
| `main`          | El nombre que la JVM busca por convención                             |
| `String[] args` | Argumentos de línea de comandos al arrancar el programa               |

> **En Spring Boot nunca escribes `main` tú mismo.** Spring Initializr genera un `Application.java` con un `main` que llama a `SpringApplication.run()`. Esa única línea arranca todo el framework: inicializa el contexto de la aplicación, descubre todos tus beans y lanza el **servidor embebido** — Tomcat, por defecto, que Spring Boot lleva integrado dentro del propio JAR. No necesitas instalar Tomcat por separado; viene incluido. Después de eso, no vuelves a tocar `main`.

---

## Programación orientada a objetos — por qué Java está construido así

Java es un lenguaje **orientado a objetos** (OOP, del inglés _Object-Oriented Programming_). No es solo una etiqueta — determina cómo se estructura cada línea de código. Entender OOP no es opcional en Java; es el modelo mental sobre el que está construido todo el lenguaje.

### La idea central — los objetos tienen estado y comportamiento

Un objeto combina dos cosas: **datos** (llamados campos o estado) y **acciones** (llamados métodos o comportamiento). En el mundo real, un coche tiene estado (color, velocidad, nivel de combustible) y comportamiento (acelerar, frenar, repostar). En Java:

```java
public class Car {
    // estado — datos que este objeto guarda
    private String colour;
    private int speed;

    // comportamiento — acciones que este objeto puede realizar
    public void accelerate(int amount) {
        this.speed += amount;
    }

    public int getSpeed() {
        return this.speed;
    }
}
```

La clase es el molde. Un objeto es una instancia concreta creada a partir de ese molde:

```java
Car myCar = new Car();    // crea un objeto a partir del molde Car
Car yourCar = new Car();  // crea otro objeto distinto — mismo molde, datos diferentes
```

### Los cuatro pilares

La OOP de Java se asienta sobre cuatro principios. No necesitas dominarlos ahora — con saber qué significa cada palabra cuando la encuentres es suficiente.

**Encapsulación** (_encapsulation_) — ocultar los detalles internos; exponer solo lo que el exterior necesita. Los campos casi siempre son `private`, sin excepciones. Los métodos, en cambio, pueden ser `public` (si los llama alguien de fuera) o `private` (si son helpers internos que nadie fuera de la clase necesita conocer). En Spring Boot verás esta combinación constantemente: campos `private`, métodos de servicio `public`, métodos auxiliares `private`. Se accede a los campos siempre a través de métodos (`getSpeed()`, no `car.speed` directamente).

**Herencia** (_inheritance_) — una clase puede extender otra y reutilizar su código. La clase hija obtiene todo lo que tiene el padre, más sus propias adiciones:

```java
public class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void breathe() { System.out.println(name + " respira"); }
}

public class Dog extends Animal {
    public Dog(String name) { super(name); }
    public void bark() { System.out.println(name + " ladra"); }
}

Dog dog = new Dog("Rex");
dog.breathe();  // "Rex respira"  — heredado de Animal
dog.bark();     // "Rex ladra"    — propio de Dog
```

En Spring Boot lo ves en las excepciones personalizadas (`extends RuntimeException`) y en Spring Security.

**Polimorfismo** (_polymorphism_) — el mismo código puede trabajar con distintos tipos de objetos. Si tienes una variable de tipo `Animal`, puedes guardar ahí un `Dog`, un `Cat` o cualquier otro animal. Cuando llamas a un método, la JVM decide en runtime qué versión ejecutar según el objeto real que hay ahí dentro:

```java
Animal a = new Dog("Rex");   // Dog hereda de Animal — cabe perfectamente en la variable
a.breathe();                 // la JVM ejecuta el breathe() que corresponda al objeto real
```

Las interfaces (explicadas en [05-interfaces-abstract.md](05-interfaces-abstract.md)) llevan este concepto más lejos. Es el mecanismo detrás de la inyección de dependencias de Spring: declaras el tipo como una interfaz, y el framework inyecta la implementación concreta en runtime.

**Abstracción** (_abstraction_) — exponer lo que algo hace, ocultar cómo lo hace. La distinción con encapsulación es sutil: la encapsulación protege el estado interno de un objeto; la abstracción oculta el comportamiento interno para simplificar lo que el exterior necesita saber. Tienes razón: es el controlador el que practica la abstracción, porque llama a `projectService.findAll()` sin saber nada de cómo ese método va a buscar los datos:

```java
// El controlador solo sabe que findAll() devuelve proyectos — no cómo lo hace
List<Project> projects = projectService.findAll();

// save() guarda en base de datos — no sabes qué SQL genera ni cómo conecta
repository.save(entity);
```

> **En TimeTrack:** la llamada `projectService.findAll()` desde el controlador es abstracción en acción — el controlador no sabe nada del repositorio ni de la consulta SQL que hay debajo. Los campos `private` de `ProjectService` son encapsulación. Cada capa de Spring Boot abstrae la que tiene por debajo.

Docs: [Baeldung — OOP Concepts in Java](https://www.baeldung.com/java-oop) → leer: "What is OOP", "Encapsulation", "Inheritance", "Polymorphism"

---

## Java vs JavaScript — el cambio de modelo mental

Dado que vienes de JavaScript, estos son los puntos que más te van a desconcertar al principio:

| Concepto              | JavaScript                                      | Java                                       |
| --------------------- | ----------------------------------------------- | ------------------------------------------ |
| Tipos                 | Dinámico — las variables pueden cambiar de tipo | Estático — el tipo se fija en compile time |
| Estructura del código | Las funciones pueden existir en cualquier sitio | Todo el código vive dentro de una clase    |
| Clases                | Patrón opcional                                 | Obligatorio — la unidad básica             |
| Errores de null       | `undefined is not a function` en runtime        | `NullPointerException` en runtime          |
| Punto de entrada      | Node ejecuta el fichero de arriba a abajo       | La JVM llama a `main()`                    |
| Compilación           | No hace falta (interpretado)                    | Obligatoria antes de ejecutar              |

El mayor cambio mental: **en JavaScript, las funciones son ciudadanos de primera clase**. En Java, **las clases son los ciudadanos de primera clase**. Todo lo demás sale de esa diferencia.
