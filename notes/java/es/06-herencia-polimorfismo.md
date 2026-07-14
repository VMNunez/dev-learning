# Herencia y Polimorfismo

> 📖 [Baeldung — Guide to Java inheritance](https://www.baeldung.com/java-inheritance) → leer: "Types of Inheritance" y "Polymorphism"
> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

En [05-interfaces-abstractas.md](05-interfaces-abstractas.md) viste cómo las clases pueden compartir un *contrato*: una interfaz enumera los métodos que una clase promete tener, y una clase abstracta puede incluso ofrecer un padre a medio construir para que otras lo terminen. Pero un contrato solo dice *qué* métodos deben existir — no le entrega a la subclase un comportamiento listo para usar tal cual. Este archivo trata de la otra mitad: cómo una subclase **hereda comportamiento real y funcional** de un padre y lo reutiliza sin reescribir una sola línea.

Usas la herencia cuando dos o más clases son del mismo *tipo* de cosa y comparten la mayor parte de su comportamiento, pero difieren en algunos métodos concretos. Sin ella, escribirías los mismos métodos `eat()`, `breathe()` y `sleep()` en cada clase animal — y al cambiar uno, tendrías que actualizarlo en todas las copias. La herencia te permite escribir el comportamiento compartido una sola vez en una **clase padre**, y cada **subclase** lo hereda automáticamente.

## Herencia — `extends`

Una subclase hereda todos los campos y métodos `public` y `protected` de la clase padre y también puede añadir los suyos propios. Los campos `private` del padre técnicamente forman parte del objeto de la subclase — ocupan espacio en memoria — pero la subclase no puede acceder a ellos directamente: solo a través de los getters y setters que el padre exponga. `protected` es el modificador que eliges precisamente cuando quieres que las subclases lean el campo directamente sin necesidad de un getter — por eso en los ejemplos de herencia verás campos `protected` en la clase padre. La clase padre no tiene por qué ser abstracta: si tiene sentido crear instancias directas de ella (`new Animal()`), déjala como clase normal. La declaras abstracta solo cuando no tiene sentido instanciarla directamente — cuando `Animal` es un concepto demasiado genérico y ningún objeto concreto debería ser "solo un Animal" sin ser un tipo más específico. En TimeTrack tiene sentido crear `new User()` directamente — un usuario es un objeto concreto con datos reales. En cambio, una clase `BaseEntity` que solo tenga `id`, `createdAt` y `updatedAt` debería ser abstracta: nunca crearías `new BaseEntity()` porque no existe ningún objeto del sistema que sea "solo una entidad base" — siempre es un `User`, un `Project` o algo similar:

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

Cada clase de este archivo vive en algún punto de un único árbol. `Animal` es el padre compartido; `Dog` y `Cat` se ramifican a partir de él; y — como verás al final del archivo — todo desciende en última instancia de una clase raíz llamada `Object`. Tener presente esta forma hace que el resto del archivo encaje:

```
            Object          ← la raíz que toda clase extiende automáticamente
              │
            Animal          ← padre: define eat(), speak()
            ╱     ╲
         Dog       Cat      ← subclases: heredan + sobreescriben
```

> **¿Por qué `Object` está por encima de `Animal` si nunca escribiste `extends Object`?** Porque Java lo inserta por ti. Cualquier clase que no extienda explícitamente algo extiende `Object` de forma silenciosa, así que el árbol siempre tiene una única raíz. La última sección de este archivo trata por completo de lo que eso te da.

Java solo permite **herencia simple** — una clase solo puede extender una clase. Esto es diferente de TypeScript, donde puedes componer tipos con intersecciones.

> **¿Por qué herencia simple?** Que una clase tenga dos padres crea el "problema del diamante": si ambos padres definen `save()`, ¿cuál de los dos hereda la subclase? Java evita la ambigüedad por completo permitiendo un solo padre. Cuando de verdad necesitas comportamiento de varias fuentes, implementas varias *interfaces* (05) en su lugar — una clase puede firmar muchos contratos aunque solo pueda extender una clase.

---

## `super`

Ya conociste `super()` como llamada al constructor en [05-interfaces-abstractas.md](05-interfaces-abstractas.md) — aquí se aplica la misma regla, así que esto es un recordatorio y no un concepto nuevo. Cuando una subclase tiene su propio constructor, normalmente necesita que el padre inicialice primero sus propios campos. `super()` activa esa inicialización — y debe ser la primera línea:

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

En la práctica, `super.method()` aparece cuando quieres ampliar el comportamiento del padre, no sustituirlo por completo. El caso más habitual en Spring Boot es cuando extiendes una clase de configuración: llamas a `super.configure(...)` para que el padre aplique su configuración base y luego añades tus propias reglas encima. También verás este patrón al final de este archivo: `super("Employee not found: " + id)` en el constructor de `EmployeeNotFoundException` llama al constructor de `RuntimeException` para inicializar el mensaje de error estándar — tú solo añades la parte personalizada. Cuando quieres sustituir el comportamiento por completo, sobreescribes el método sin llamar a `super` — eso es lo más habitual en la lógica de negocio.

> **¿Por qué `super()` tiene que ser la primerísima línea?** Porque el objeto de la subclase se construye de padre hacia dentro: los campos del padre tienen que existir e inicializarse antes de que la subclase pueda tocar nada con seguridad. Java impone el orden negándose a compilar si `super()` aparece en cualquier sitio que no sea la línea uno. Si no escribes ninguna llamada a `super(...)`, Java inserta un `super()` silencioso sin argumentos — por eso una subclase compila sin problemas solo cuando el padre tiene un constructor sin argumentos.

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

**Overriding** (sobreescritura) es lo que acabas de ver: una subclase reemplaza un método del padre con el mismo nombre y la misma firma exacta. Lo que Java decide en runtime no es el tipo de la variable, sino el tipo real del objeto que hay en memoria: si guardas un `Dog` en una variable `Animal`, Java ejecuta la versión de `Dog`, no la de `Animal`. **Overloading** (sobrecarga), que se cubrió en [03-metodos.md](03-metodos.md), es distinto: varios métodos con el mismo nombre dentro de la misma clase, cada uno con parámetros distintos — distinto número o distintos tipos. Java resuelve la sobrecarga en tiempo de compilación mirando los argumentos que le pasas. Ambos reutilizan el mismo nombre de método, pero son conceptos completamente separados.

> **Lee la fila `Runtime` a través del mecanismo anterior.** "Se decide en runtime" significa que la sobreescritura se resuelve mediante la tabla de métodos del objeto — la JVM solo sabe qué `speak()` ejecutar cuando puede ver el objeto real. "Se decide en compilación" significa que la sobrecarga la resuelve el compilador a partir de los tipos de los argumentos que escribiste, antes de que el programa se ejecute: `calculate(2)` frente a `calculate(2.0)` se decide al compilar, sin objeto de por medio. Esa es la diferencia profunda — una espera al objeto, la otra nunca lo necesita.

La fila "Herencia" de la tabla indica si el concepto requiere una jerarquía de clases: la sobreescritura sí — sin una subclase que extienda a otra, no hay nada que sobreescribir; la sobrecarga no requiere herencia — puedes definir `calculate(int x)` y `calculate(double x)` en la misma clase sin extender nada.

|          | Overriding                       | Overloading                              |
| -------- | -------------------------------- | ---------------------------------------- |
| Dónde    | Subclase                         | Misma clase                              |
| Firma    | Debe coincidir exactamente       | Distinto número de parámetros o distintos tipos |
| Herencia | Sí (requiere subclase)           | No                                       |
| Runtime  | Se decide en tiempo de ejecución | Se decide en tiempo de compilación       |

---

## Polimorfismo

El problema que resuelve el polimorfismo: tienes una lista de tipos relacionados pero distintos — `Dog`, `Cat` y `Bird`, todos subclases de `Animal` — y necesitas llamar al mismo método en todos ellos. Sin polimorfismo tendrías que escribir un `if` para cada tipo — y cada vez que añades un tipo nuevo, modificas ese `if`. Con polimorfismo, los declaras todos como `Animal` y llamas a `speak()` una sola vez: Java elige la versión correcta para cada objeto automáticamente.

La clave es que el tipo de la **variable** y el tipo del **objeto** pueden ser distintos:

```java
Animal a = new Dog("Rex", "Labrador");  // variable: Animal  /  objeto real: Dog
```

Cuando llamas a `a.speak()`, Java no mira el tipo de la variable (`Animal`) — mira el tipo real del objeto en memoria (`Dog`) y ejecuta la versión de `speak()` definida en `Dog`. A esto se le llama **dispatch dinámico**: la decisión de qué método ejecutar ocurre en runtime, no en tiempo de compilación.

¿Pero cómo *sabe* Java, en runtime, qué versión ejecutar? La variable `a` es solo una referencia — no dice nada sobre si el objeto real es un `Dog` o un `Cat`. El mecanismo es una tabla de búsqueda oculta. Cuando la JVM carga una clase, construye una **tabla de métodos** para esa clase (a menudo llamada *vtable*, por "virtual method table"): una lista que asocia cada nombre de método con el código exacto que debe ejecutarse para esa clase. La tabla de `Dog` apunta `speak()` al código de `Dog`; la tabla de `Cat` apunta `speak()` al código de `Cat`. Cada objeto que creas lleva un puntero oculto a la tabla de su propia clase — un objeto `Dog` apunta a la tabla de `Dog`, un objeto `Cat` a la de `Cat`. Así que `a.speak()` compila a: "sigue el puntero de tabla del objeto, busca `speak()` en esa tabla, salta al código que indique." El tipo de la variable es irrelevante en ese momento — el propio objeto lleva el mapa.

> **Analogía — el objeto lleva su propia agenda telefónica.** Piensa en la tabla de métodos como una pequeña agenda que cada objeto guarda en el bolsillo. Llamar a `speak()` significa "abre tu agenda, busca la entrada `speak`, marca ese número." Un `Dog` y un `Cat` tienen ambos una entrada `speak`, pero sus agendas listan números distintos — así que la *misma* llamada llega a código distinto. Java nunca tiene que adivinar el tipo; simplemente deja que el objeto lea de su propia agenda.

> **Por qué esto gana a un gran `if`.** La versión con `if (a instanceof Dog)` de más abajo hay que editarla cada vez que aparece un tipo nuevo. El dispatch dinámico no, porque la búsqueda la dirige la propia tabla del objeto — añade una clase `Bird` con su propia tabla y el código existente llama a `speak()` sin cambios. La extensibilidad viene directamente de *dónde* vive la decisión: en el objeto, no en tu código que llama.

```java
Animal a1 = new Dog("Rex", "Labrador");
Animal a2 = new Cat("Whiskers");

a1.speak();   // "Woof!" — versión de Dog
a2.speak();   // "Meow!" — versión de Cat
```

No siempre tienes que declarar la variable con el tipo padre. Usas `Animal a = new Dog(...)` cuando quieres tratar tipos distintos de forma uniforme — ahí es donde el polimorfismo compensa. Si necesitas comportamiento específico de `Dog` de inmediato, declara `Dog dog = new Dog(...)`. La regla práctica: usa el tipo más general que aún te dé lo que necesitas.

El caso que más aclara la idea es una lista de tipos mixtos. Sin polimorfismo compruebas cada tipo a mano — y el código se rompe cada vez que añades uno nuevo:

```java
// Sin polimorfismo — frágil: cada tipo nuevo obliga a cambiar aquí
for (Animal a : animals) {
    if (a instanceof Dog) System.out.println("Woof!");
    else if (a instanceof Cat) System.out.println("Meow!");
    // ¿añades Bird? tienes que venir aquí y añadir otro else if
}

// Con polimorfismo — extensible: añades Bird y este bucle no cambia nunca
List<Animal> animals = new ArrayList<>();
animals.add(new Dog("Rex", "Labrador"));
animals.add(new Cat("Whiskers"));

for (Animal a : animals) {
    System.out.println(a.speak());  // Dog → "Woof!", Cat → "Meow!" — sin if
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

Si mañana añades `WhatsAppNotification`, este servicio no cambia ni una sola línea.

---

## `instanceof` y pattern matching

Cuando trabajas con polimorfismo, puede que en algún momento necesites acceder a un método que existe solo en una subclase concreta — no en el padre. Por ejemplo, tienes una variable `Animal` que en realidad contiene un `Dog`, y necesitas llamar a `fetch()`, que solo `Dog` tiene.

Si intentas llamar a `animal.fetch()` directamente, el compilador lo rechaza — `Animal` no tiene ese método. Para llamarlo, necesitas hacer un **cast** — decirle al compilador "trata esta variable como un `Dog`". Pero si el objeto no es realmente un `Dog`, el cast lanzaría una `ClassCastException` en runtime. `instanceof` existe precisamente para evitar ese error: comprueba el tipo real antes del cast.

```java
Animal animal = new Dog("Rex", "Labrador");  // tipo de la variable: Animal — objeto real en memoria: Dog

// Forma clásica (hasta Java 15)
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;  // cast explícito — ya sabemos que es seguro
    dog.fetch();
}

// Pattern matching (Java 16+) — más limpio, hace el cast automáticamente
if (animal instanceof Dog dog) {
    dog.fetch();   // dog ya está disponible como Dog, sin cast manual
}
```

> Dicho esto, si te encuentras usando `instanceof` con frecuencia, es una señal de que el diseño podría mejorar — el polimorfismo está pensado precisamente para evitar estas comprobaciones manuales de tipo.

---

## Clases, métodos y campos `final`

`final` puede aplicarse a tres cosas distintas, cada una con un significado diferente:

- `final class` — la clase no puede ser extendida: ninguna subclase puede heredar de ella
- `final method` — el método no puede ser sobreescrito por ninguna subclase
- `final field` — el campo solo puede asignarse una vez; normalmente en el constructor o en la propia declaración. A partir de ese momento su valor no puede cambiar

```java
public final class String { ... }  // ninguna clase puede heredar de String

public class Animal {
    public final void breathe() { ... }  // ninguna subclase puede sobreescribir esto
}

public class Circle {
    private final double radius;  // solo puede asignarse una vez

    public Circle(double radius) {
        this.radius = radius;  // única asignación permitida
    }
}
```

> **¿Por qué está `final` aquí, en un archivo sobre herencia?** Porque dos de sus tres usos van de *frenar* la herencia: una `final class` cierra la puerta a heredar de ella, y un `final method` cierra la puerta a sobreescribirlo. Es lo deliberadamente opuesto a todo lo anterior — recurres a ello cuando una clase o un método nunca deben extenderse ni reemplazarse, normalmente por seguridad (`String` es `final` para que nadie pueda heredar de ella y romper las garantías sobre las que se apoya todo el lenguaje). El significado de `final field` no tiene relación con la herencia; solo comparte la palabra clave.

En Spring Boot verás `final` con frecuencia en los campos de las clases de servicio cuando las dependencias se inyectan por constructor — es la forma recomendada de escribir los beans.

---

## La clase Object

Existe una clase en lo más alto de toda jerarquía de herencia en Java: `Object`. Todas las clases la extienden automáticamente, aunque no lo declares. Esto significa que cualquier objeto que crees lleva consigo un conjunto de métodos heredados de `Object` — los hayas definido tú o no.

Los tres que más aparecen en proyectos reales son:

- **`toString()`** — se llama automáticamente cuando imprimes un objeto con `System.out.println(obj)` o lo concatenas en un `String`. Sin sobreescribirlo obtienes algo como `com.victor.timetrack.model.User@1a2b3c` — el nombre de la clase y una dirección de memoria, que no dice nada útil. Lo sobreescribes para devolver algo legible como `"User{name='Victor'}"`.
- **`equals()`** — compara si dos objetos son "iguales". Sin sobreescribirlo, Java compara referencias de memoria: dos objetos distintos con los mismos datos no son iguales aunque representen la misma entidad. Lo sobreescribes cuando quieres que la comparación se base en los valores de los campos.
- **`hashCode()`** — usado internamente por `HashMap` y `HashSet` para organizar objetos en memoria. La regla es: si sobreescribes `equals()`, siempre debes sobreescribir `hashCode()` también — si no, tus objetos se comportarán de forma inesperada dentro de colecciones.

> **¿Por qué `equals()` y `hashCode()` deben cambiar siempre juntos?** Un `HashMap` encuentra un objeto en dos pasos: primero usa `hashCode()` para saltar al "bucket" correcto, y luego usa `equals()` para confirmar la coincidencia dentro de ese bucket. Si dos objetos son `equals()` pero devuelven hash codes distintos, caen en buckets *diferentes* — así que el mapa busca en el sitio equivocado y nunca encuentra la entrada, aunque tu `equals()` diga que coinciden. Sobreescribir uno sin el otro rompe las búsquedas de forma silenciosa; por eso la regla es absoluta, no una preferencia de estilo.

Sobreescribir los tres es muy habitual en proyectos reales: `toString()` casi siempre, porque facilita mucho el debugging al imprimir objetos; `equals()` y `hashCode()` juntos cuando los objetos se comparan por valor o se usan como claves en un `HashMap`. En Spring Boot, Lombok puede generarlos todos automáticamente con `@Data` o `@EqualsAndHashCode`, así que rara vez los escribes a mano.

Para ver cómo se sobreescriben en la práctica, imagina una clase `User` de TimeTrack. Sin ningún `@Override`, imprimir un usuario o comparar dos usuarios con los mismos datos no se comporta como esperarías:

```java
User u1 = new User("Victor", "victor@example.com");
User u2 = new User("Victor", "victor@example.com");

System.out.println(u1);             // → "com.victor.timetrack.model.User@3a4b5c" — inútil en logs
System.out.println(u1 == u2);       // → false — referencias distintas en memoria
System.out.println(u1.equals(u2));  // → false — sin override, equals también compara referencias
```

Sobreescribiendo los tres (IntelliJ lo genera por ti con `Alt+Insert`): IntelliJ escribe todo el código — el `@Override`, la firma del método, y toda la lógica interna (`if (this == o)`, el `instanceof`, el cast, `Objects.equals()`, `Objects.hash()`). Lo único que haces tú es elegir qué campos incluir en la comparación o en el texto de salida — en este caso, `name` y `email`.

```java
public class User {
    private String name;
    private String email;

    // toString() — para que los logs y el debugging sean legibles
    @Override
    public String toString() {
        return "User{name='" + name + "', email='" + email + "'}";
    }

    // equals() — dos User son iguales si tienen el mismo email
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User other = (User) o;
        return Objects.equals(email, other.email);
    }

    // hashCode() — obligatorio siempre que sobreescribes equals()
    @Override
    public int hashCode() {
        return Objects.hash(email);
    }
}
```

Ahora el comportamiento es el esperado:

```java
System.out.println(u1);             // → "User{name='Victor', email='victor@example.com'}"
System.out.println(u1.equals(u2));  // → true — mismo email, mismo usuario
```

En proyectos reales con Spring Boot, las entidades JPA casi siempre tienen estos tres métodos — o usan `@Data` de Lombok para generarlos automáticamente.

> **Como toda clase desciende de `Object`, siempre puedes guardar cualquier objeto en una variable `Object`:** `Object obj = new User("Victor", "victor@example.com");` es válido, ya que `User` extiende `Object` implícitamente. Es el mismo upcasting que viste con `Animal a = new Dog(...)` — solo que ahora el padre es la raíz universal. Es exactamente por eso que métodos como `equals(Object o)` reciben un parámetro `Object`: se les puede pasar cualquier objeto, y `instanceof` lo estrecha de vuelta al tipo real dentro.

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa `JpaRepository` y `RuntimeException` en un contexto de Spring Boot. `JpaRepository` se explica en las notas de Spring Boot. `RuntimeException` es una clase Java que se cubre en `08-excepciones.md` — si aún no has leído ese archivo, vuelve aquí después.

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

---

Ahora tienes objetos que comparten comportamiento a través de un padre, lo sobreescriben donde difieren, y se manejan de forma uniforme mediante polimorfismo. La necesidad natural siguiente es un sitio donde *guardar muchos de ellos* — una lista de `Animal`s, un conjunto de `User`s únicos, un mapa de id a `Project`. Almacenar grupos de objetos es de lo que trata [07-colecciones.md](07-colecciones.md), y se apoya directamente en lo que acabas de aprender: una `List<Animal>` guarda perros y gatos uno al lado del otro precisamente porque el polimorfismo permite que un tipo de variable contenga muchos tipos de objeto.
