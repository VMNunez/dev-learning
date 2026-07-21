# Introducción a Java

Docs: [Baeldung — Get Started with Java](https://www.baeldung.com/get-started-with-java-series) → lee los bloques "Java Language Basics" y "Java OOP" — los dos que encajan con este fichero

---

Ya sabes cómo hacer que un programa se ejecute: escribes JavaScript, le pasas el fichero a Node, y corre. Nada se comprueba antes. Eso funciona de maravilla hasta que el proyecto crece — una errata en el nombre de una propiedad, una función llamada con dos argumentos en vez de tres, un objeto que es `undefined` en una de cuarenta ramas posibles — y nada de eso sale a la luz hasta que un usuario pisa exactamente esa línea en producción. En una app pequeña eso se absorbe. En un backend bancario con trescientas clases y ocho desarrolladores tocándolo, no puedes permitírtelo.

Java es la respuesta en la que se puso de acuerdo toda una industria para ese problema: **hacer que una máquina lea el programa entero y se niegue a construirlo si algo no cuadra**, antes de que se ejecute ni una sola línea. Por eso domina el backend de empresa — y por eso las consultoras españolas a las que apuntas funcionan sobre Java. Todo lo que al principio se siente pesado en Java (declarar cada tipo, envolver cada método en una clase, compilar antes de ejecutar) te da a cambio lo mismo: errores atrapados en tiempo de compilación, por un compilador, en vez de a las tres de la madrugada por un cliente.

Este fichero es el mapa. Cubre las cuatro cosas que dan forma a cada línea de Java que vas a escribir — cómo va el código desde un fichero `.java` hasta un programa en ejecución, qué obliga realmente el tipado estático, por qué cada trozo de código vive dentro de una clase, y el modelo de OOP sobre el que está construido el lenguaje — y cierra con la ruta por el resto de las notas. Nada aquí se cubre en profundidad completa: cada idea se presenta lo justo para que el fichero que la posee pueda profundizar.

---

## Cómo funciona Java — del código fuente al programa en ejecución

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: "Java Compiler" (sección 4) y "Just in Time Compiler" (sección 5.4) — entre las dos explican por qué Java es las dos cosas a la vez.

La mayoría de lenguajes son **compilados** (traducidos a código máquina antes de ejecutarse) o **interpretados** (leídos y ejecutados línea a línea en tiempo de ejecución). Java combina las dos fases: primero tu código se compila a bytecode (de ahí lo de compilado), y después la JVM lee e interpreta ese bytecode para ejecutarlo (de ahí lo de interpretado — y deja de ser toda la verdad en cuanto entra el compilador JIT, dos subsecciones más abajo). Lo que hace especial a esta combinación es que el bytecode no está ligado a ningún sistema operativo — el mismo fichero `.class` funciona en Windows, Linux y Mac sin recompilarlo.

Cuando escribes código Java, ocurren dos cosas:

1. **Compile time** (tiempo de compilación) — el compilador de Java (`javac`) lee tus ficheros `.java` y los traduce a **bytecode** (ficheros `.class`). El bytecode no es código máquina — es un conjunto de instrucciones neutro respecto a la plataforma que ningún procesador entiende directamente. Este paso ocurre antes de que el programa llegue a ejecutarse. Aquí es donde el compilador detecta errores de sintaxis y de tipos.

2. **Runtime** (tiempo de ejecución) — la **JVM** (Java Virtual Machine) lee el bytecode y lo ejecuta. La JVM es lo que realmente corre tu programa. Como existe una JVM para cada sistema operativo (Windows, Linux, Mac), el mismo bytecode funciona en todos sin recompilarlo. De aquí viene el lema histórico de Java: *"Write once, run anywhere."*

```
TuCodigo.java  →  [compilador javac]  →  TuCodigo.class  →  [JVM]  →  programa en ejecución
 código fuente       compile time            bytecode           runtime
```

### JDK, JRE, JVM — tres nombres para tres cajas distintas

Docs: [Baeldung — Difference Between JVM, JRE, and JDK](https://www.baeldung.com/jvm-vs-jre-vs-jdk) → lee: "JRE" (sección 3) y "JDK" (sección 4) — las listas de herramientas de ahí muestran de forma concreta qué añade cada caja sobre la anterior.

Esas tres siglas se usan como si fueran intercambiables, y no lo son. Están **anidadas**: cada una contiene la anterior más algo extra.

- **JVM** (Java Virtual Machine) — el motor que *ejecuta* el bytecode. Es un programa, como cualquier otro, que lee ficheros `.class` y convierte sus instrucciones en cosas que hace tu procesador real. Es lo que hace cierto el "write once, run anywhere": el bytecode nunca cambia, solo cambia la JVM, y existe una build distinta de JVM para Windows, Linux y Mac.
- **JRE** (Java Runtime Environment) — la JVM **más la librería estándar**: `String`, `List`, `Optional`, `LocalDate` y los miles de clases más que tu código llama sin haberlas escrito tú nunca. El JRE es todo lo que hace falta para *ejecutar* un programa Java ya compilado, y nada más. No puede compilar.
- **JDK** (Java Development Kit) — el JRE **más las herramientas de desarrollo**: `javac` (el compilador), `jar` (el empaquetador), el depurador. Esto es lo que instalas como desarrollador. Cuando IntelliJ te pide un "Project SDK" y lo apuntas a Java 25, eso es un JDK.

```
┌─ JDK (lo que instalas para desarrollar) ────────┐
│  javac   jar   javadoc   jdb   ...              │
│  ┌─ JRE (lo que necesitas para solo ejecutar) ─┐ │
│  │  librería estándar (java.util, java.io…)   │ │
│  │  ┌─ JVM (el motor) ───────────────────┐   │ │
│  │  │  carga .class, ejecuta bytecode    │   │ │
│  │  └────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

> **¿Cuál tienes tú?** Instalaste un JDK — ejecutar `java -version` en tu máquina imprime `java version "25"` seguido de `Java(TM) SE Runtime Environment` y `Java HotSpot(TM) 64-Bit Server VM`, que es el JRE y la JVM presentándose desde dentro. Desde Java 11 el JRE ya no se distribuye como descarga aparte; lo tienes incluido dentro del JDK. La distinción sigue importando en entrevistas y en conversaciones de despliegue ("¿el servidor necesita un JDK o solo un runtime?"), que es justo donde te la preguntan.

### La JVM no solo interpreta — el compilador JIT es la mitad que falta

Decir "la JVM interpreta bytecode" describe los primeros segundos de tu programa y luego deja de ser cierto. Si la interpretación fuera toda la historia, Java sería permanentemente lento: interpretar significa decodificar la misma instrucción una y otra vez, cada vez que un bucle da una vuelta.

Lo que ocurre en realidad es un sistema de dos velocidades. La JVM empieza **interpretando** el bytecode instrucción a instrucción — barato para arrancar, sin esperas. Mientras lo hace, **cuenta**: cuántas veces se llama a cada método, cuántas veces se repite cada bucle. Cuando un método cruza un umbral (se vuelve "caliente"), el **compilador JIT** — Just-In-Time, parte de la JVM, HotSpot en el Java 25 estándar que tienes instalado — compila el bytecode de ese método a código máquina real para *tu* procesador, y cada llamada posterior salta directamente a esa versión nativa, saltándose la interpretación por completo.

```
arranca la ejecución  →  bytecode interpretado, instrucción a instrucción  (lento, arranque instantáneo)
un método se llama 10.000 veces  →  el JIT lo compila a código máquina nativo
a partir de ahí         →  el código nativo corre directo en la CPU        (rápido, sin interpretación)
```

Como el JIT observa el programa *mientras se ejecuta*, puede optimizar usando hechos que un compilador ahead-of-time nunca tiene — qué rama de un `if` se toma realmente en producción, a qué clase concreta acaba yendo una llamada polimórfica — y vuelve a optimizar si el patrón cambia. Así es como un lenguaje distribuido como bytecode portable acaba siendo competitivo con lenguajes compilados.

> **Por esto las primeras peticiones a tu API son las lentas.** Arranca una app Spring Boot, llama a un endpoint, y la primera llamada tarda notablemente más que la centésima — no falla nada. Tampoco hay ninguna caché mal calculada: la JVM todavía está interpretando ese camino de código y aún no lo ha compilado. Se llama **warm-up de la JVM**, y es la explicación estándar cuando alguien reporta "la primera petición tras un deploy va lenta".

> **¿Por qué importa esto en Spring Boot?** Cuando ejecutas `mvn spring-boot:run` o pulsas el botón verde de IntelliJ, Maven compila tu código y la JVM arranca tu aplicación. Cuando ves una `NullPointerException` en los logs, eso es un **error en runtime** — el compilador no lo detectó porque solo ocurre con datos concretos, en tiempo de ejecución.

---

## Tipado estático — los tipos se fijan en compile time

Docs: [Baeldung CS — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → lee: "Statically Typed Languages" — para cuándo ocurre la comprobación de tipos y qué te compra eso.

Java tiene **tipado estático**: cada variable tiene un tipo fijo que declaras cuando la creas, y ese tipo no cambia nunca. El compilador comprueba cada asignación de tipos antes de que el programa se ejecute.

```java
String name = "Victor";  // el tipo es String — siempre, para siempre
name = 42;               // error de compilación — no puedes asignar un int a un String
```

Merece la pena hacer concreto el "error de compilación", porque te vas a encontrar exactamente esa redacción en IntelliJ dentro de tu primera hora. Mete esas dos líneas dentro de una clase llamada `A` (tienen que vivir dentro de un método — eso es la siguiente sección) y compílala con `javac A.java`. Se niega, imprimiendo el fichero, el número de línea, la línea ofensora y un acento circunflejo señalando el valor que rechazó:

```
A.java:4: error: incompatible types: int cannot be converted to String
    name = 42;
           ^
1 error
```

Lee ese mensaje como una frase: *el tipo de la derecha no puede convertirse en el tipo de la izquierda*. `incompatible types: X cannot be converted to Y` es uno de los dos o tres mensajes que más vas a ver en tus primeros meses, y siempre significa lo mismo — le has pasado a algo un valor del tipo equivocado. Fíjate en lo que **no** pasó: no se generó ningún fichero `.class`. Un programa que no pasa la comprobación de tipos nunca llega a construirse, así que no hay ninguna versión rota de él que puedas ejecutar por accidente.

> **¿De dónde sale ese mensaje?** No de la JVM — la JVM nunca llegó a ver este código. Viene de `javac`, en compile time, antes de que existiera ningún bytecode. Ese es todo el sentido del planteamiento: esta clase de bug no puede llegar a runtime, así que no puede llegar a un usuario. Una `NullPointerException`, en cambio, *sí* es un error en runtime — el compilador no puede saber de antemano qué referencia va a estar vacía cuando fluyan datos reales.

Este es el primer contraste grande con JavaScript, donde las variables pueden cambiar de tipo en cualquier momento:

```javascript
let name = "Victor";  // string
name = 42;             // válido en JS — el tipo cambió a number en runtime
```

El tipado estático parece más estricto, pero elimina toda una categoría de errores antes de que el programa llegue a ejecutarse. En un proyecto Spring Boot con cientos de clases, el compilador es tu primera línea de defensa.

> **`var` no rompe el tipado estático.** Con `var name = "Victor"`, Java sigue fijando el tipo como `String` en compile time — simplemente lo deduce del lado derecho para que no tengas que escribirlo. El tipo no puede cambiar después. Consulta [01-variables-tipos.md](01-variables-tipos.md).

---

## Todo es una clase — la unidad mínima de Java

Docs: [Baeldung — Java Classes and Objects](https://www.baeldung.com/java-classes-objects) → lee: "Classes" — qué puede contener una clase (campos, constructores, métodos) y nada más.

En JavaScript puedes escribir funciones y variables sueltas en cualquier sitio. En Java, **cada trozo de código debe vivir dentro de una clase**. No existen funciones flotantes.

```java
// ❌ MAL — un método no puede flotar solo en un fichero, fuera de cualquier clase
public void greet() {
    System.out.println("Hello");
}

// ✅ BIEN — el método vive dentro de una clase
public class Greeter {
    public void greet() {
        System.out.println("Hello");
    }
}
```

La regla la impone el compilador, y el mensaje que te da nombra cada construcción que *sí* está permitida en el nivel superior de un fichero — que es la forma más rápida de aprenderte la lista. Pon una instrucción suelta fuera de cualquier clase y `javac` dice:

```
B.java:1: error: class, interface, annotation type, enum, record, method or field expected
System.out.println("hi");
^
1 error
```

Léelo como una lista de lo que el compilador estaba dispuesto a aceptar en esa posición: una clase, una interfaz, un annotation type, un enum, un record, un método o un campo — pero nunca una instrucción suelta. Las instrucciones solo existen *dentro* de un método, y un método solo existe dentro de un tipo.

> **"Method" está en esa lista — ¿entonces sí puedo escribir un método fuera de una clase después de todo?** En un **fichero fuente compacto** (preview en Java 21, estandarizado en Java 25 — la versión que tienes), sí: un fichero que solo contiene `void main() { ... }` compila y se ejecuta con `java Main.java`. Parece que la regla se rompe, pero no es así — el compilador *sintetiza* una clase sin nombre alrededor de tu método, así que el código sigue acabando dentro de una clase exactamente igual que antes. Existe para que el primer programa de un principiante o un script desechable no sean cuatro líneas de ceremonia. No lo vas a ver en un proyecto real: Spring Boot, Maven y cualquier codebase al que te unas usan clases declaradas explícitamente, porque una clase sintetizada no se puede importar, extender ni inyectar. Trátalo como una comodidad para scripting, no como una excepción al modelo.

Esto no es una rareza — es una consecuencia deliberada de que Java sea un lenguaje orientado a objetos (ver sección de OOP más abajo). Cada componente de Spring Boot (`@Service`, `@Controller`, `@Repository`) es una clase. Cuando Spring arranca tu aplicación, crea objetos a partir de esas clases y los gestiona por ti.

> **Adelanto — Spring Boot:** `@Service`, `@Controller` y `@Repository` son anotaciones de Spring Boot, no palabras clave del lenguaje Java, y todavía no las has estudiado. Se mencionan aquí solo para mostrar dónde aterriza esta regla en la práctica: cada una marca una clase que el propio Spring instancia y entrega a quien la necesite. El mecanismo `@` que hace funcionar las anotaciones es Java, y se cubre en [13-anotaciones.md](13-anotaciones.md); lo que hacen estas concretas pertenece a las notas de Spring Boot, a las que llegarás después de este tema.

---

## El punto de entrada — `public static void main(String[] args)`

Docs: [Baeldung — Java main() Method Explained](https://www.baeldung.com/java-main-method) → lee: "Common Signature" (sección 2) y "Different Ways to Write a main() Method" (sección 3) — cada palabra de la firma y qué variaciones sigue aceptando la JVM.

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
| --------------- | ----------------------------------------------------------------------- |
| `public`        | La JVM debe poder llamarlo desde fuera de la clase                     |
| `static`        | La JVM lo llama sin crear ningún objeto primero — solo carga la clase  |
| `void`          | El punto de entrada no devuelve nada a la JVM                          |
| `main`          | El nombre que la JVM busca por convención                              |
| `String[] args` | Argumentos de línea de comandos pasados al arrancar el programa        |

Lee cada fila así: *esta palabra clave está en la firma porque la JVM necesita que esté ahí* — la columna izquierda es la palabra, la derecha es el requisito que satisface. Quita cualquiera de ellas y la JVM deja de reconocer el método como punto de entrada.

### Ejecutarlo a mano — los dos comandos que IntelliJ te esconde

El botón verde de IntelliJ ejecuta los dos pasos de la tubería compilar-luego-ejecutar de la primera sección sin enseñarte ninguno de los dos. Hacerlo una vez a mano es lo que convierte ese diagrama en algo concreto:

```bash
javac Main.java   # compile time — lee el .java, escribe Main.class al lado
java Main         # runtime — la JVM carga Main.class y llama a su método main
```

Hay dos detalles que pillan a todo el mundo la primera vez. A `javac` le pasas un **nombre de fichero** (`Main.java`, con extensión incluida, porque estás leyendo un fichero), pero a `java` le pasas un **nombre de clase** (`Main`, sin `.class`, sin extensión — estás nombrando la clase que quieres que arranque la JVM, y es la propia JVM la que encuentra el fichero). Y `javac` escribe `Main.class` en la carpeta actual — eso es el bytecode del diagrama, ahí en disco, y es lo *único* que `java` necesita a partir de ese momento. Borra el `.java` y `java Main` sigue funcionando.

### `args` — lo que la JVM realmente te entrega

`String[] args` no es decoración. Todo lo que escribas después del nombre de la clase llega dentro de ese array, en orden:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, " + args[0]);
    }
}
```

```bash
$ java Main Victor
Hello, Victor
```

Es el mismo canal que usa Spring Boot cuando arrancas un JAR con `java -jar app.jar --server.port=8081` — la opción aterriza en `args`, `SpringApplication.run(Main.class, args)` pasa el array tal cual, y Spring lee el ajuste de ahí. Por eso el `main` que se genera reenvía `args` en vez de ignorarlo.

> **El array está vacío, nunca es null, cuando no pasas nada.** Ejecuta `java Main` sin argumentos y `args` es un `String[]` de longitud 0 — así que `args[0]` no te da una comprobación de null que se te pueda olvidar, te da directamente un crash: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0`. Protégete con `args.length > 0` antes de leer una posición. La distinción entre "vacío" y "null" vuelve constantemente con las colecciones en [07-colecciones.md](07-colecciones.md).

### Cuando la firma está mal

Que se te escape una palabra clave no produce un error de compilación — el fichero compila perfectamente, porque un método llamado `run` o un `main` con la forma equivocada siguen siendo métodos Java válidos. El fallo llega después, desde la JVM, al arrancar:

```
Error: Main method not found in class E, please define the main method as:
   public static void main(String[] args)
or a JavaFX application class must extend javafx.application.Application
```

El mensaje es inusualmente útil: imprime la firma que quería. Lo que te está diciendo por debajo es *dónde* ocurre la comprobación — el compilador no tiene ninguna opinión sobre puntos de entrada, así que este es un fallo en **runtime**, descubierto cuando la JVM carga la clase y busca un método que no encuentra. Cada vez que lo veas, compara tu firma palabra por palabra con la del error.

> **Las reglas se relajaron en Java 25.** Junto con los ficheros fuente compactos, la JVM ahora también acepta un `main` no `static`, y uno sin parámetro `String[]` — `void main()` es un punto de entrada legal en el Java 25 que tienes instalado. Existe para bajar la barrera de entrada de un primer programa; el clásico `public static void main(String[] args)` es lo que genera Spring Initializr y lo que va a contener cualquier codebase al que te unas, así que apréndete las razones detrás de cada palabra de la tabla de arriba en vez de tratar la relajación como la nueva normalidad.

> **En Spring Boot nunca escribes `main` tú mismo.** Spring Initializr genera un `Application.java` con un `main` que llama a `SpringApplication.run()`. Esa única línea arranca todo el framework — inicializa el contexto de la aplicación, descubre todos tus beans y lanza el **servidor embebido** — Tomcat por defecto, que Spring Boot lleva integrado dentro del propio JAR. No necesitas instalar Tomcat por separado; viene incluido. No vuelves a tocar `main` después de eso.

---

## Programación orientada a objetos — por qué Java está construido así

Docs: [Baeldung — Object-Oriented Programming Concepts in Java](https://www.baeldung.com/java-oop) → lee: "Abstraction", "Encapsulation", "Inheritance" y "Polymorphism" (secciones 4–7) — una sección corta por pilar, en el mismo orden que abajo.

Java es un lenguaje **orientado a objetos** (OOP). No es solo una etiqueta — determina cómo se estructura cada línea de código. Entender la OOP no es opcional en Java; es el modelo mental sobre el que está construido todo el lenguaje.

### La idea central — los objetos tienen estado y comportamiento

Un objeto combina dos cosas: **datos** (llamados campos o estado) y **acciones** (llamadas métodos o comportamiento). En el mundo real, un coche tiene estado (color, velocidad, nivel de combustible) y comportamiento (acelerar, frenar, repostar). En Java:

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

La OOP de Java se asienta sobre cuatro principios. No necesitas dominarlos ahora — con saber qué significa cada palabra cuando te la encuentres es suficiente.

> **Adelanto — Spring Boot:** los ejemplos de abajo recurren a ideas de Spring Boot que todavía no has estudiado — clases de servicio, repositorios, y la *inyección de dependencias* (que el framework cree tus objetos y se los pase a quien los necesite, en vez de que tú escribas `new`). Aparecen aquí porque cada pilar se reconoce mejor en el sitio donde realmente lo vas a encontrar. Léelos como un adelanto de dónde aterriza este concepto de Java; lo implementarás todo en las notas de Spring Boot.

**Encapsulación** — ocultar los detalles internos; exponer solo lo que el exterior necesita. Los campos son casi siempre `private`, sin excepciones. Los métodos, en cambio, pueden ser `public` (si los llama alguien de fuera) o `private` (helpers internos que nadie fuera de la clase necesita conocer). Vas a ver esta combinación constantemente en Spring Boot: campos `private`, métodos de servicio `public`, métodos auxiliares `private`. Siempre accedes a los campos a través de métodos (`getSpeed()`, no `car.speed` directamente).

> **¿Y para qué molestarse, si el getter simplemente devuelve el campo?** Porque el getter es una *puerta* y el campo es un *agujero en la pared*. Mientras todo el mundo pase por `getSpeed()`, conservas tres poderes que un campo público te quita. Puedes **validar** — `accelerate()` puede rechazar una cantidad negativa, mientras que `car.speed = -80` desde cualquier parte del codebase no se puede frenar. Puedes **cambiar el interior más adelante** — guardar la velocidad en km/h en vez de m/s, o calcularla a partir de otros dos campos, y ningún llamador se entera, mientras que cada línea que toca `car.speed` habría que encontrarla y editarla una por una. Y puedes **observar**: pon un breakpoint o una línea de log en un único método y ves cada lectura de ese valor en toda la aplicación; un campo público no te da dónde plantarte. La regla "campos `private`, acceso a través de métodos" no es ceremonia — es lo que convierte una clase en algo que puedes cambiar sin miedo.

Ten esta pareja presente, porque las dos se confunden constantemente: la encapsulación protege el *estado*, mientras que la abstracción — el cuarto pilar, más abajo — oculta el *comportamiento*. Los campos `private` son encapsulación; "el controlador no sabe cómo hace su trabajo el servicio" es abstracción.

**Herencia** — una clase puede extender otra y reutilizar su código. La clase hija obtiene todo lo que tiene el padre, más sus propias adiciones. Dibujada, la relación es un árbol, y la flecha siempre apunta del hijo *hacia arriba*, hacia el padre — el hijo sabe quién es su padre, nunca al revés:

```
            Animal              ← el padre (superclase)
        ┌── name: String
        └── breathe()
              ▲
              │ extends
        ┌─────┴─────┐
      Dog          Cat          ← los hijos (subclases)
      bark()       meow()         cada uno añade su propio comportamiento,
                                   los dos ya tienen name + breathe()
```

Lee el diagrama como *"un Dog es un Animal"* — todo lo dibujado dentro de la caja `Animal` también existe en cada objeto `Dog`, sin volver a escribirse en `Dog`. Esa es la reutilización. `Animal` no tiene ni idea de que `Dog` existe, por eso puedes añadir un `Bird` mañana sin cambiar nada por encima.

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

**Polimorfismo** — el mismo código puede trabajar con distintos tipos de objetos. Si tienes una variable de tipo `Animal`, puedes guardar ahí un `Dog`, un `Cat`, o cualquier otro animal. Cuando llamas a un método, la JVM decide en runtime qué versión ejecutar según el objeto real:

```java
Animal a = new Dog("Rex");   // Dog extiende Animal — cabe perfectamente en la variable
a.breathe();                 // la JVM ejecuta el breathe() que corresponda al objeto real
```

Las interfaces (cubiertas en [05-interfaces-abstractas.md](05-interfaces-abstractas.md)) llevan esto más lejos. Es el mecanismo detrás de la inyección de dependencias de Spring: declaras el tipo como una interfaz, y el framework inyecta la implementación concreta en runtime.

**Abstracción** — exponer lo que algo hace, ocultar cómo lo hace. La distinción con la encapsulación es sutil: la encapsulación protege el estado interno de un objeto; la abstracción oculta el comportamiento interno para simplificar lo que el exterior necesita saber. El controlador es quien practica la abstracción — llama al servicio sin saber nada de cómo ese método obtiene los datos:

File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/controller/ProjectController.java`

```java
// El controlador solo sabe que getAll() devuelve las respuestas de proyecto — no cómo lo hace
public ResponseEntity<List<ProjectResponse>> getAll(){
    return ResponseEntity.ok(projectService.getAll());
}
```

Una línea, y todo lo que hay debajo es invisible desde aquí: que ese `getAll()` le pide las filas a un repositorio, que el repositorio lo convierte en SQL, que cada entidad `Project` se transforma después en un `ProjectResponse`. El controlador no podría describir nada de eso, y ese es justo el objetivo — el día que cambie la consulta, esta línea no cambia.

> **En TimeTrack:** la llamada `projectService.getAll()` desde el controlador es abstracción en acción — el controlador no sabe nada del repositorio ni de la consulta SQL que hay debajo. El campo `private final ProjectRepository projectRepository` dentro de `ProjectService` es encapsulación. Cada capa de Spring Boot abstrae la que tiene por debajo: controlador → servicio → repositorio → base de datos.

---

## Java vs JavaScript — el cambio de modelo mental

Docs: [MDN — JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures) → lee: "Dynamic and weak typing" — el comportamiento exacto del lenguaje que estás desaprendiendo, contado por su propia documentación.

Dado que vienes de JavaScript, estos son los puntos que más te van a desconcertar:

Lee cada fila como un hábito que tienes que desaprender: la columna del medio es lo que tu instinto de JS espera, y la de la derecha es lo que Java hace en realidad. Cuando algo te sorprenda en Spring Boot, casi siempre es una de estas filas mordiéndote.

| Concepto              | JavaScript                                      | Java                                        |
| ---------------------- | ------------------------------------------------ | -------------------------------------------- |
| Tipos                  | Dinámico — las variables pueden cambiar de tipo | Estático — el tipo se fija en compile time  |
| Estructura del código  | Las funciones pueden existir en cualquier sitio | Todo el código vive dentro de una clase     |
| Clases                 | Patrón opcional                                 | Obligatorio — la unidad básica              |
| Errores de null        | `undefined is not a function` en runtime        | `NullPointerException` en runtime           |
| Punto de entrada       | Node ejecuta el fichero de arriba a abajo       | La JVM llama a `main()`                     |
| Compilación             | No hace falta (interpretado)                    | Obligatoria antes de ejecutar               |

El mayor cambio de modelo mental: **en JavaScript, las funciones son ciudadanos de primera clase**. En Java, **las clases son las ciudadanas de primera clase**. Todo lo demás sale de esa diferencia.

---

## El camino que viene — cómo están ordenadas estas notas

Estas notas están numeradas en el orden que construye la comprensión desde los cimientos, no por orden alfabético ni por importancia. El recorrido es deliberado: cada fichero solo da por sabido lo que los anteriores ya enseñaron. Se recorre en cuatro tramos.

**La materia prima (01–03).** [01-variables-tipos.md](01-variables-tipos.md) cubre los tipos primitivos y de referencia con los que está hecha cada línea de Java, [02-flujo-de-control.md](02-flujo-de-control.md) el `if`/`for`/`switch` que decide qué se ejecuta, y [03-metodos.md](03-metodos.md) cómo se empaqueta el comportamiento en un método y cómo se llama. Nada de esto necesita objetos todavía — es el vocabulario en el que está escrito todo lo demás.

**El corazón del lenguaje: la orientación a objetos (04–06).** Tres ficheros que se apoyan uno en otro y convierten el adelanto de arriba en la cosa real: [04-poo-clases.md](04-poo-clases.md) (clases, objetos, constructores, `this`), [05-interfaces-abstractas.md](05-interfaces-abstractas.md) (los contratos contra los que inyecta Spring) y [06-herencia-polimorfismo.md](06-herencia-polimorfismo.md) (`extends`, `super`, y el dispatch de métodos en runtime que viste en esta página). La sección de OOP de arriba es solo el tráiler de esos tres.

**Las herramientas del día a día (07–12).** A lo que recurres de verdad dentro de un método de servicio: [07-colecciones.md](07-colecciones.md) (`List`, `Map`, `Set`), [08-excepciones.md](08-excepciones.md) — el fichero más profundo del tema, y el modelo del listón de calidad de todos los demás —, [09-streams-lambdas.md](09-streams-lambdas.md) (pipelines de datos de estilo funcional), [10-genericos.md](10-genericos.md) (`<T>` y `Optional`, en los que se apoyan tanto las colecciones como los repositorios), [11-enums.md](11-enums.md) y [12-fechas.md](12-fechas.md) (`LocalDate`/`LocalDateTime`).

**Cómo se ensamblan los proyectos reales (13–16).** [13-anotaciones.md](13-anotaciones.md) explica el mecanismo de `@` que mueve todo el framework, [14-maven.md](14-maven.md) las dependencias y el build. Luego [15-modelo-de-memoria.md](15-modelo-de-memoria.md) — stack, heap y garbage collection — colocado cerca del final a propósito, porque explica *por qué* todo lo que viste antes (las referencias, `null`, la identidad de los objetos) se comporta como se comporta. El tema cierra con `16-concurrency-awareness.md` — el único fichero de esta ruta que todavía no está escrito, así que no hay nada a lo que enlazar todavía —, que lleva ese modelo de memoria un paso más allá: tu aplicación Spring Boot atiende muchas peticiones a la vez, en muchos hilos, a través de objetos que solo creó una vez — y saber qué implica eso es una pregunta estándar de entrevista para un junior, aunque tú no vayas a escribir hilos.

Léelos en orden la primera vez; después, trata cada uno como una referencia independiente.

Empieza por [01-variables-tipos.md](01-variables-tipos.md) — convierte la idea del tipado estático de esta página en el conjunto concreto de tipos que declararás en cada clase de aquí en adelante.
