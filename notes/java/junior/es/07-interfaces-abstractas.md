# Interfaces y Clases Abstractas

> 📖 [Baeldung — Interfaces in Java](https://www.baeldung.com/java-interfaces) → leer: "2. What Are Interfaces in Java?" y "4. Default Methods in Interfaces"
> 📖 [Oracle Docs — Interfaces and inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/index.html)
> 📖 [Spring Security — DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) — cómo encaja `UserDetailsService` en el flujo de login completo

En [06-poo-clases.md](06-poo-clases.md) aprendiste a modelar una sola cosa como una clase: sus datos, su constructor, sus métodos y cómo se protege a sí misma. Pero cada clase de allí estaba sola. En cuanto tienes una *familia* de clases relacionadas, o un grupo de clases sin relación entre sí que deben prometer todas que saben hacer lo mismo, una clase aislada no basta — necesitas una forma de que las clases **compartan un contrato** o **compartan implementación**. De eso trata exactamente este archivo: las interfaces (un contrato que una clase firma) y las clases abstractas (un padre a medio construir que otros completan).

## Interface

> Docs: [Baeldung — Interfaces in Java](https://www.baeldung.com/java-interfaces) → leer: "2.1. Rules for Creating Interfaces" — la lista de lo que una interfaz puede y no puede contener, y qué modificadores añade Java por ti.

Imagina que quieres escribir un método que pueda imprimir cualquier cosa — un empleado, un pedido, un informe. No sabes qué tipo de objeto le llegará, pero sí sabes que necesita tener un método `print()`. Esas tres clases no tienen nada más en común, así que no pueden compartir un padre — pero sí pueden firmar todas el mismo contrato. Las interfaces resuelven exactamente este problema.

Una interfaz define un **contrato**: una lista de métodos que cualquier clase que la implemente está obligada a tener. La interfaz no dice cómo se implementan esos métodos — solo exige que existan. Piénsalo como una promesa escrita: "cualquier clase que firme este contrato garantiza que tiene estos métodos."

```java
public interface Printable {
    void print();        // sin cuerpo — solo la firma del método
    String getSummary(); // cualquier clase que implemente Printable DEBE tener estos dos
}
```

Cuando una clase implementa una interfaz con `implements`, **debe** proporcionar todos los métodos declarados en ella — sin excepción. No puedes implementar la interfaz y dejar algún método sin escribir: el compilador rechaza la clase entera, no solo el método que falta, y te dice exactamente cuál olvidaste. Escribe `Employee implements Printable` con solo `print()` y `javac` responde:

```
error: Employee is not abstract and does not override abstract method getSummary() in Printable
class Employee implements Printable {
^
```

Lee ese mensaje como una bifurcación en el camino, porque literalmente eso es lo que te ofrece: o bien *sobreescribes* el método que falta (lo que normalmente quieres), o bien declaras la propia `Employee` como `abstract` — una clase sin terminar que traslada la obligación a quien la extienda. Java no deja que una clase se declare completa mientras siga faltando un método firmado. La única excepción son los métodos `default` (ver más abajo), que ya tienen su propia implementación y son opcionales de sobreescribir.

Una clase que implementa la interfaz debe proporcionar todos los métodos:

```java
public class Employee implements Printable {
    private final String name;

    public Employee(String name) {
        this.name = name;
    }

    @Override
    public void print() {
        System.out.println("Employee: " + name);
    }

    @Override
    public String getSummary() {
        return "Name: " + name;
    }
}

Printable p = new Employee("Ana");
p.print();   // "Employee: Ana"
```

Fíjate en el constructor: sin él, `name` seguiría teniendo su valor por defecto `null` y `print()` produciría alegremente `Employee: null` — un campo solo es `null` porque nada lo asignó nunca, no porque las interfaces le hagan algo. La interfaz nunca toca el estado; solo obliga a que existan los dos métodos.

> **Los métodos de una interfaz son implícitamente `public` — y eso tiene consecuencias.** Escribiste `void print();` sin ningún modificador dentro de `Printable`, pero todo método declarado en una interfaz es `public` lo escribas o no (el mismo mecanismo de "Java añade la palabra clave por debajo" que verás con `abstract` más adelante). Eso importa cuando lo implementas: una sobreescritura nunca puede *reducir* la visibilidad que heredó, porque cualquier código que tenga una referencia `Printable` tiene derecho a llamar a `print()` — si tu clase pudiera convertirlo silenciosamente en package-private, esa promesa se rompería en tiempo de ejecución. Por eso omitir `public` en la implementación es un error de compilación, y uno que la primera vez confunde:
>
> ```java
> public class Employee implements Printable {
>     void print() { }   // MAL — sin modificador significa package-private, más restrictivo que public
> }
> ```
> ```
> error: print() in Employee cannot implement print() in Printable
>     void print() {}
>          ^
>   attempting to assign weaker access privileges; was public
> ```
>
> El arreglo es siempre el mismo: escribe `public` en cada método que implemente una interfaz.

> **Sobre los métodos implícitamente abstractos:** todos los métodos que declaras en una interfaz sin cuerpo son implícitamente `abstract` — Java añade esa palabra clave en segundo plano. Por eso cada clase que implementa la interfaz tiene que definir todos sus métodos. Nunca escribes `abstract` de forma explícita en una interfaz, pero siempre está ahí. La única excepción son los métodos `default`, que ya tienen cuerpo y son opcionales.

### Una clase puede implementar múltiples interfaces

> Docs: [Baeldung — Inheritance in Java](https://www.baeldung.com/java-inheritance) → leer: "4.1. Implementing Multiple Interfaces" y "4.2. Issues With Multiple Inheritance" — por qué Java permite muchas interfaces pero solo una clase padre.

Un `Employee` real rara vez es solo una cosa. El código de informes quiere imprimirlo, el endpoint de exportación lo quiere como CSV, y el módulo de cumplimiento quiere un registro de auditoría a partir de él. Esas son tres capacidades sin relación entre sí, propiedad de tres partes de la aplicación sin relación entre sí, y ninguna debería tener que saber de las otras dos. En lugar de inventar un único padre `EmployeeBase` gordo que cargue con las tres responsabilidades, dejas que `Employee` firme tres contratos separados — uno por capacidad — y cada parte de la aplicación depende entonces solo del contrato que le importa.

```java
public class Employee implements Printable, Exportable, Auditable {
    private final String name;
    private final String department;

    public Employee(String name, String department) {
        this.name = name;
        this.department = department;
    }

    @Override                                  // de Printable
    public void print() {
        System.out.println("Employee: " + name);
    }

    @Override                                  // de Printable
    public String getSummary() {
        return "Name: " + name;
    }

    @Override                                  // de Exportable
    public String toCsvRow() {
        return name + ";" + department;
    }

    @Override                                  // de Auditable
    public String auditId() {
        return "EMP-" + name.toUpperCase();
    }
}
```

La regla no se suaviza al añadir interfaces: **todos** los métodos de las **tres** deben implementarse, y el mismo error `Employee is not abstract and does not override abstract method …` te nombra el primero que olvides. Solo los métodos `default` son opcionales, porque ya llevan un cuerpo.

La recompensa es que un método ahora puede pedir exactamente la capacidad que necesita, no la clase concreta. Un método de informes declara `void render(Printable item)` y acepta un `Employee`, una `Invoice` o un `Report` — cualquier cosa que haya firmado *ese* contrato — mientras que el trabajo de exportación toma `Exportable` y nunca ve `print()` en absoluto. Un solo objeto, tres vistas distintas de él según qué tipo de referencia tengas en la mano.

> **Esto es el reemplazo de Java para la herencia múltiple de clases.** Algunos lenguajes dejan que una clase tenga varias clases padre; Java deliberadamente no lo permite (verás que `extends` acepta exactamente una clase más adelante). La razón es la ambigüedad que crea un segundo padre — si dos padres aportan ambos un *cuerpo* para el mismo método, el compilador tiene que adivinar cuál ejecuta tu objeto, y cualquier suposición que haga estará silenciosamente equivocada la mitad de las veces. Las interfaces evitan eso porque, clásicamente, no llevan **ningún cuerpo**: firmar diez contratos añade diez obligaciones y cero implementaciones, así que no hay nada que colisione. Los métodos `default` de Java 8 reabrieron esa puerta una rendija — que es exactamente el problema del diamante que trata el callout de abajo, y por qué el lenguaje obliga a que seas *tú*, no el compilador, quien rompa el empate.

### Métodos default (Java 8+)

> Docs: [Baeldung — Static and Default Methods in Interfaces](https://www.baeldung.com/java-static-default-methods) → leer: "2. Why Interfaces Need Default Methods" y "5. Static Interface Methods" — el problema de compatibilidad hacia atrás que los creó, y la segunda forma con cuerpo.

Antes de Java 8, las interfaces solo podían tener métodos sin implementación. Java 8 introdujo los métodos `default`: métodos con una implementación dentro de la interfaz que las clases que la implementan **no están obligadas a sobreescribir**. Si la clase no lo sobreescribe, hereda la implementación de la interfaz. Si lo sobreescribe, usa la suya propia.

Esto permite añadir nuevos métodos a una interfaz sin romper todas las clases que ya la implementan — si añades un método `default`, las clases existentes lo heredan sin necesitar ningún cambio:

```java
public interface Printable {
    void print();

    default String getLabel() {
        return "Printable item";   // implementación por defecto
    }
}
```

> **`getSummary()` desapareció — a propósito.** De aquí en adelante, `Printable` se muestra con un único método abstracto (`print()`) en lugar de los dos que tenía al principio del archivo. No es un descuido: los ejemplos que siguen necesitan una interfaz con *exactamente un* método sin implementar, tanto para la fábrica `static` que devuelve una lambda unos callouts más abajo como para la sección de interfaces funcionales al final. Todo lo dicho sobre `default` aplica igual a la versión de dos métodos — son solo los ejemplos con lambdas los que exigen la versión recortada.

> **¿Y si dos interfaces declaran el mismo método default?** Si una clase implementa dos interfaces que aportan ambas un método `default` con la misma firma, el compilador no puede decidir cuál gana — es el clásico *problema del diamante*. Java se niega a compilar y te obliga a resolver la ambigüedad sobreescribiendo el método en tu clase. Dentro de tu sobreescritura puedes elegir uno explícitamente con `InterfaceName.super.methodName()`:
>
> ```java
> public interface A { default String hi() { return "from A"; } }
> public interface B { default String hi() { return "from B"; } }
>
> public class C implements A, B {
>     @Override
>     public String hi() {
>         return A.super.hi();   // DEBES sobreescribir; eliges a qué padre llamar
>     }
> }
> ```
>
> Si omites la sobreescritura, el compilador te dice exactamente qué colisionó — fíjate en que culpa a la *clase*, no a ninguna de las dos interfaces, porque los dos contratos están bien cada uno por su cuenta y solo entran en conflicto en cuanto una clase firma ambos:
>
> ```
> error: types A and B are incompatible;
> public class C implements A, B { }
> ^
>   class C inherits unrelated defaults for hi() from types A and B
> ```
>
> "Unrelated" es la palabra clave: si `B extendiera A`, la versión de `B` simplemente ganaría por ser la más específica y no habría ningún error. La ambigüedad solo existe cuando ninguno de los dos `default` puede argumentarse como una sobreescritura del otro.
>
> Por esto implementar varias interfaces es seguro donde la herencia múltiple de clases no lo es: con interfaces la colisión es un error de compilación que estás obligado a corregir, nunca una suposición silenciosa del compilador.

> **`default` no es la única forma con cuerpo.** Es fácil terminar el párrafo de arriba pensando "interfaz = sin cuerpos, salvo `default`". El alcance real es más amplio: una interfaz puede contener **tres** tipos de método con cuerpo.
>
> ```java
> public interface Printable {
>     void print();                                   // abstracto — implícitamente public, sin cuerpo
>
>     default String getLabel() {                     // Java 8 — heredado por quien lo implementa, sobreescribible
>         return decorate("Printable item");
>     }
>
>     static Printable empty() {                      // Java 8 — pertenece a la interfaz misma
>         return () -> System.out.println("(nothing)");
>     }
>
>     private String decorate(String text) {          // Java 9 — ayudante, invisible fuera de la interfaz
>         return "» " + text;
>     }
> }
> ```
>
> Los tres se diferencian en *quién* puede llamarlos. Un método `default` lo hereda cada clase que implementa, así que lo llamas sobre el objeto: `employee.getLabel()`. Un método `static` de interfaz **no** se hereda — pertenece a la interfaz misma y se llama a través de su nombre, `Printable.empty()`, exactamente igual que un método static de una clase; ahí es donde viven los helpers de fábrica (`List.of(...)` y `Comparator.comparing(...)` son ejemplos reales del patrón). Un método `private` de interfaz existe solo para que los métodos `default` y `static` puedan compartir código sin exponer ese ayudante como parte del contrato — Java 9 lo añadió precisamente porque los métodos `default` empezaban a duplicar lógica entre ellos.

> **¿`default` convierte una interfaz en una clase abstracta?** No, y la razón es lo único que la interfaz sigue sin poder tener: **campos**. Un método `default` solo puede trabajar con los argumentos que recibe y con otros métodos del contrato — no tiene estado por objeto que leer, porque una interfaz no tiene dónde guardar ninguno (el callout de más abajo sobre "por qué una interfaz solo puede tener constantes" rastrea eso). Una clase abstracta conserva sus campos, su constructor y su capacidad de guardar estado a medio terminar; un método `default` es solo *comportamiento* compartido, atornillado a un contrato para que añadir un método a una interfaz ya publicada deje de ser un cambio incompatible.

---

## Clase abstracta

> Docs: [Baeldung — Abstract Classes in Java](https://www.baeldung.com/java-abstract-class) → leer: "2. Key Concepts for Abstract Classes" y "3. When to Use Abstract Classes" — las reglas que impone el compilador, y las situaciones que justifican usar una.

> **Referencia adelantada — mecánica de la herencia.** Esta sección usa `extends`, `super(...)` y la relación padre/subclase (la jerarquía Animal/Dog) para mostrar para qué *sirve* una clase abstracta. La mecánica completa de la herencia — cómo `extends` conecta una subclase con su padre, cómo funcionan `super(...)` y `@Override` por debajo, la clase `Object` de la que hereda toda clase — es el tema de [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md). Aquí, léelo simplemente como `super(name)` = "ejecuta primero el constructor del padre" y `extends Animal` = "Dog es un tipo de Animal"; la versión profunda llega en el siguiente archivo.

Usa una clase abstracta cuando varias clases comparten la misma *implementación* — no solo el mismo contrato. Una interfaz dice "debes tener este método"; una clase abstracta dice "aquí tienes parte de la implementación, rellena el resto". No puedes crear una instancia de una clase abstracta directamente — solo existe para ser extendida.

Una clase abstracta es esencialmente una clase padre que agrupa campos y métodos compartidos por todas sus subclases — eso es herencia. La clave es la palabra `abstract` delante de un método: significa que ese método **no tiene cuerpo en la clase padre**. La clase abstracta solo declara que el método existe, sin implementarlo. Cada subclase tiene que escribir su propia versión. Piénsalo como un contrato interno: "yo te doy `breathe()` ya implementado, pero tú debes implementar `makeSound()` porque solo cada animal sabe cuál es su propio sonido." Un método `abstract` solo puede declararse dentro de una clase abstracta — si intentas añadir `abstract` a un método en una clase normal, el compilador te da un error. Lo contrario también es cierto: si una clase tiene aunque sea un método `abstract`, esa clase también debe declararse `abstract`.

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Método concreto — ya implementado; todas las subclases lo heredan
    public void breathe() {
        System.out.println(name + " is breathing");
    }

    // Método abstracto — sin cuerpo; las subclases DEBEN implementarlo
    public abstract void makeSound();
}
```

Una subclase que extiende una clase abstracta debe implementar todos los métodos abstractos. Los métodos concretos — los que ya tienen cuerpo en la clase abstracta — se heredan automáticamente sin hacer nada. La diferencia de palabra clave: `extends` para extender una clase (abstracta o no), `implements` para implementar una interfaz.

```java
public class Dog extends Animal {
    public Dog(String name) {
        super(name);   // llama al constructor del padre
    }

    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof!");
    }
}

Dog dog = new Dog("Rex");
dog.breathe();      // "Rex is breathing"  — de Animal
dog.makeSound();    // "Rex says: Woof!"   — de Dog
```

Así queda la forma de lo que acabas de construir:

```
        Animal  (abstracta — no se puede instanciar)
        ├── breathe()      concreto → se hereda tal cual
        └── makeSound()    abstracto → cada hijo DEBE rellenarlo
              │
              ▼  extends
        Dog  (concreta — se puede instanciar)
        ├── breathe()      heredado sin cambios de Animal
        └── makeSound()    escrito aquí: "Woof!"
```

Léelo de arriba abajo: el padre entrega a cada hijo el `breathe()` ya terminado, pero deja `makeSound()` como un hueco que cada hijo está obligado a rellenar. `Dog` rellena el hueco; un `Cat` lo rellenaría con "Meow". Ese es todo el sentido de una clase abstracta — compartir las partes terminadas, obligar a rellenar el resto.

> **¿Por qué no puedes simplemente escribir `new Animal("Rex")`?** No porque Java sea estricto porque sí — porque el objeto saldría con un agujero dentro. Crear un objeto significa que la JVM reserva un bloque real de memoria con un hueco para cada campo y, junto a la clase, una tabla de "qué cuerpo ejecuto para cada método". Para `Animal`, la entrada de `makeSound()` apunta a nada: no hay ningún cuerpo en ningún sitio que ejecutar. Así que en el momento en que alguien llamara a `animal.makeSound()` no habría código al que despachar, y la única respuesta honesta sería un fallo en tiempo de ejecución. Java lo evita un paso antes, en tiempo de compilación, negándose directamente a construir el objeto:
>
> ```
> error: Animal is abstract; cannot be instantiated
> Animal x = new Animal("Rex");
>            ^
> ```
>
> El diagrama es la misma imagen: la flecha solo apunta *hacia abajo*, de la clase con el hueco a la clase que lo rellena. `new` es legal exactamente en el nivel donde no queda ningún hueco — `new Dog("Rex")` funciona porque `Dog` aportó `makeSound()`. Y por eso también una subclase que olvida rellenar el hueco recibe el rechazo con el mismo mensaje que ya viste con las interfaces, solo que nombrando a la clase padre en lugar del contrato:
>
> ```
> error: Dog is not abstract and does not override abstract method makeSound() in Animal
> class Dog extends Animal { }
> ^
> ```
>
> Una clase, dos salidas: rellenar el hueco, o declarar `Dog` también `abstract` y empujar la obligación una generación más abajo.

> **`super(name)`** llama al constructor de la clase padre. Cuando creas un objeto `Dog`, Java necesita inicializar primero la parte `Animal` — sus campos y su constructor. `super(...)` hace exactamente eso: ejecuta el constructor del padre con los argumentos que le pasas. Escríbelo como primera línea y nunca podrás equivocarte de orden; esa es la forma que verás en prácticamente todo el código Java, y la que debes usar por defecto. Después de `super(...)`, el constructor de la subclase añade sus propios campos e inicializaciones — se cubre con un ejemplo en la sección "Constructores en subclases" más abajo.

> **Sobre los tipos en Java:** cuando escribes `Dog dog = new Dog("Rex")`, `Dog` es el tipo porque definiste la clase `Dog`. En Java, cualquier clase que definas se convierte en un tipo válido — no hay inferencia ni magia del compilador. Es exactamente igual que `String name = "Rex"` o `int count = 5`, solo que usando tu propia clase como tipo en lugar de un primitivo o un tipo de la librería estándar.

Una clase solo puede extender **una** clase abstracta. Esta es la diferencia clave con las interfaces.

---

## Interface vs Clase abstracta

> Docs: [Baeldung — Java Interfaces vs Abstract Classes](https://www.baeldung.com/java-interface-vs-abstract-class) → leer: "4. When to Use an Interface" y "5. When to Use an Abstract Class" — la misma decisión, argumentada caso por caso.

La decisión se reduce a una pregunta: ¿estás definiendo una *capacidad* que una clase puede tener, o un *tipo base* del que derivan otras clases? Usa una interfaz cuando clases sin relación entre sí necesitan compartir un contrato (`Printable` puede implementarlo `Employee`, `Invoice` o `Report` — no tienen nada más en común). Usa una clase abstracta cuando un grupo de clases relacionadas comparten código de implementación real que de otro modo se duplicaría.

Sí: una clase puede extender una clase abstracta e implementar varias interfaces al mismo tiempo. El orden en el código es fijo — primero `extends`, luego `implements`:

```java
public class Dog extends Animal implements Printable, Auditable {
    // hereda breathe() de Animal
    // debe implementar makeSound() (método abstracto de Animal)
    // debe implementar los métodos de Printable y Auditable
}
```

|             | Interface                                        | Clase abstracta                            |
| ----------- | ------------------------------------------------- | ------------------------------------------- |
| Métodos     | Abstractos por defecto; cuerpos solo vía `default`, `static` o `private` | Puede tener abstractos y concretos          |
| Campos      | Solo constantes `public static final`             | Puede tener cualquier campo                 |
| ¿Múltiples? | Una clase puede implementar muchas                | Una clase solo puede extender una           |
| Constructor | No                                                 | Sí                                          |
| Cuándo usar | Definir una capacidad que una clase puede tener   | Definir un tipo base con lógica compartida  |

Lee cada fila como *"aquí está en qué difieren las dos, y por qué existe la diferencia"* — la última fila es la que de verdad guía tu decisión (capacidad vs tipo base); las filas de arriba son las consecuencias mecánicas de esa elección.

> **¿Por qué una interfaz solo puede tener constantes `public static final`?** Porque una interfaz no tiene instancias propias — nunca escribes `new Printable()`. Los campos de instancia (`private String name`) solo tienen sentido sobre un objeto, ya que cada objeto necesita su propia copia; una interfaz nunca produce un objeto, así que no tiene dónde poner estado por objeto. Los únicos campos que sobreviven sin una instancia son los `static` (una copia compartida, no una por objeto) y los `final` (un valor fijo, ya que no hay constructor que se los asigne después). Java hace que todo campo que declaras en una interfaz sea `public static final` automáticamente — una constante compartida es el *único* tipo de campo con sentido cuando no hay instancia. Una clase abstracta es lo contrario: *sí* participa en la creación de objetos (su constructor se ejecuta como parte de construir la subclase), así que puede tener campos de instancia normales como `protected String name`.

Desde que Java 8 le dio a las interfaces los métodos `default`, la pregunta obvia que sigue es: si una interfaz ahora también puede llevar implementaciones reales, ¿por qué seguiría alguien escribiendo una clase abstracta? La respuesta es la fila `Campos` de la tabla, expresada como regla de decisión en lugar de como diferencia mecánica — el **estado**. Un método `default` es comportamiento sin memoria: puede llamar a otros métodos del contrato, pero no hay ningún campo por objeto que pueda leer o actualizar, porque una interfaz no produce objetos y por tanto no tiene dónde guardar uno. En el momento en que tu lógica compartida necesita *recordar* algo por objeto — un `name`, un contador, una dependencia inyectada — una interfaz no puede expresarlo, y solo una clase con campos y constructor puede. La segunda razón es el propio constructor: una clase abstracta puede obligar a cada subclase a pasar por un constructor parametrizado (`super(name)`), de modo que ningún `Animal` pueda existir jamás sin un nombre. Una interfaz no tiene constructor, así que no puede exigir nada así.

En concreto: `Comparable` es una interfaz porque "poder compararse" es una capacidad, no guarda datos, y debe poder firmarla tanto `String` como `LocalDate` y tu propia `Employee` — ninguna de las cuales puede permitirse gastar su único slot de `extends` en ello. `Animal` es una clase abstracta porque cada animal realmente *tiene* un campo `name` y un `breathe()` funcional que de otro modo se copiaría y pegaría en cada subclase.

> **La regla que aplicar por defecto:** recurre a una interfaz salvo que necesites *estado* compartido o un constructor. No le cuesta nada a la clase que la implementa (una clase puede firmar cualquier cantidad de contratos), mientras que `extends` es un único slot no renovable — gástalo solo cuando el padre aporte campos reales e implementación real. Esta es también la razón por la que casi todos los tipos de Spring que te encontrarás — `UserDetailsService`, `JpaRepository`, `Filter` — son interfaces: tu clase debe seguir libre para extender lo que necesite.

**Interface:** "Esta clase puede hacer X" — `Printable`, `Exportable`, `Comparable`
**Clase abstracta:** "Esta clase ES un tipo de X" — `Animal`, `Shape`, `BaseService`

---

## Constructores en subclases

> Docs: [Baeldung — A Guide to Java Constructors](https://www.baeldung.com/java-constructors) → leer: "6. A Chained Constructor" — cómo un constructor delega en otro antes de ejecutar su propio cuerpo.

Esto amplía el callout de `super(name)` de la sección *Clase abstracta* de arriba, siguiendo con la misma pareja `Animal`/`Dog`. Vive aquí en lugar de repetirse en línea para que la sección anterior se mantenga centrada en *qué* es una clase abstracta. La mecánica completa de la herencia — por qué la delegación al padre va primero, qué ejecuta realmente el constructor del padre — pertenece a [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md); el punto de abajo es solo que un constructor de subclase puede añadir sus *propios* campos sobre los del padre.

Cuando una subclase define su propio constructor, puede añadir sus propios campos además de los del padre. La regla que gobierna el orden es que `super(...)` se ejecuta antes de que nada toque el objeto, para que el padre quede totalmente inicializado antes de que el hijo añada lo suyo:

```java
public class Dog extends Animal {
    private String breed;   // campo propio de Dog — no existe en Animal

    public Dog(String name, String breed) {
        super(name);        // primero inicializas al padre
        this.breed = breed; // luego tus propios campos
    }
}

// Al crear el objeto, pasas los argumentos de ambos constructores en una sola llamada
Dog dog = new Dog("Rex", "Labrador");
dog.breathe();  // "Rex is breathing"  — método heredado de Animal
```

> **¿Y si simplemente no escribes `super(...)`?** Java lo escribe por ti. Cuando el cuerpo de un constructor no empieza delegando — ni en un padre con `super(...)` ni en un constructor hermano con `this(...)` — el compilador inserta silenciosamente un `super()` sin argumentos como primera línea. Esa única línea oculta explica un error de compilación que a primera vista parece no tener nada que ver con lo que escribiste: si el padre solo tiene un constructor parametrizado, el `super()` que Java insertó pide un constructor que no existe.
>
> ```java
> public class Dog extends Animal {
>     public Dog() { }        // MAL — nada delega, así que Java inserta super()
> }                           //       pero Animal solo tiene Animal(String)
> ```
> ```
> error: constructor Animal in class Animal cannot be applied to given types;
>     public Dog(){ }
>                 ^
>   required: String
>   found:    no arguments
>   reason: actual and formal argument lists differ in length
> ```
>
> (IntelliJ muestra su propia redacción para el mismo problema incluso antes de compilar — *"There is no default constructor available in 'Animal'"* — así que te encontrarás el mismo fallo bajo dos nombres distintos.) El arreglo es delegar explícitamente, `public Dog(String name) { super(name); }`, que es lo que hace el ejemplo funcional de arriba. Fíjate también en *por qué* `Animal` no tenía un constructor sin argumentos al que recurrir: en cuanto una clase declara cualquier constructor propio, Java deja de darte gratis el constructor por defecto.

> **¿`super(...)` tiene que ser literalmente la primera línea?** Hasta Java 21 sí lo era, y el compilador lo decía así (`call to super must be first statement in constructor`). Java 25 finaliza los **cuerpos de constructor flexibles** ([JEP 513](https://openjdk.org/jeps/513), en preview desde Java 22), que permiten un *prólogo* de sentencias antes de la delegación — así que validar un argumento o normalizarlo antes de pasárselo al padre ahora es legal:
>
> ```java
> public Dog(String name, String breed) {
>     if (breed == null) throw new IllegalArgumentException("breed required");  // legal en Java 25
>     String normalized = breed.trim();
>     super(name);
>     this.breed = normalized;
> }
> ```
>
> Lo que *no* ha cambiado es por qué la delegación va primero: hasta que el constructor del padre no se ha ejecutado, la mitad `Animal` del objeto todavía no existe, así que nada del prólogo puede tocar el objeto en construcción. El compilador lo impone con precisión, y el error que realmente te encuentras en Java 25 habla de `this`, no de orden de líneas:
>
> ```java
> public Dog(String name) {
>     breathe();          // MAL — un método heredado, sobre un objeto a medio construir
>     super(name);
> }
> ```
> ```
> error: cannot reference breathe() before supertype constructor has been called
>         breathe();
>         ^
> ```
>
> El mismo rechazo reaparece con otras dos redacciones, y merece la pena conocer ambas porque parecen errores distintos. Si tocas el objeto explícitamente, el compilador nombra `this`:
>
> ```
> error: cannot reference this before supertype constructor has been called
>         System.out.println(this);
>                            ^
> ```
>
> Si tocas un campo que viene del padre, nombra directamente el *campo* — `this.name = name;` antes de `super(name)` se rechaza como `cannot reference name before supertype constructor has been called`, porque `name` es el slot de `Animal` y `Animal` todavía no existe. Asignar un campo que la subclase declara ella misma, como `this.breed`, sí está permitido: ese slot pertenece a `Dog` y no depende de que el padre exista — que es exactamente por qué el ejemplo funcional de arriba puede calcular `normalized` en el prólogo y asignarlo después. La conclusión práctica sigue siendo la regla que ya aprendiste: pon `super(...)` primero salvo que tengas una razón concreta — validar argumentos — para ejecutar un par de líneas antes.

---

## Interfaces funcionales (Java 8+)

> Docs: [Baeldung — Functional Interfaces in Java 8](https://www.baeldung.com/java-8-functional-interfaces) → leer: "3. Functional Interfaces" para la regla en sí, y luego "7. Suppliers", "8. Consumers" y "9. Predicates" para las integradas de la tabla de abajo.

Antes de Java 8, pasar comportamiento a un método implicaba crear una clase entera solo para contener una línea de lógica. Las interfaces funcionales hacen posible eso sin tanto código de más: cualquier interfaz con exactamente **un** método abstracto puede implementarse con una lambda en lugar de con una clase. Ese método único es el destino al que apunta Java cuando escribes la lambda — sabe a qué método llamar porque solo hay uno.

> Las lambdas aún no se han visto en detalle — se explican en [12-streams-lambdas.md](12-streams-lambdas.md). Por ahora, piensa en ellas como funciones anónimas compactas: una forma de escribir la implementación de un único método sin crear una clase entera.

> La anotación `@FunctionalInterface` es opcional, pero úsala: el compilador te dará un error si añades accidentalmente un segundo método abstracto y rompes el contrato. Sin ella, añadir ese segundo método compila sin problemas y la rotura solo aparece mucho más lejos, en cada sitio donde alguien pasaba una lambda. Con ella, el error aparece en la propia interfaz:
>
> ```
> error: Unexpected @FunctionalInterface annotation
> @FunctionalInterface
> ^
>   Validator is not a functional interface
>     multiple non-overriding abstract methods found in interface Validator
> ```
>
> Lee la anotación como una declaración de intención — "esta interfaz está pensada para usarse como lambda" — que luego el compilador se encarga de que cumplas.

```java
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}
```

> **"Exactamente un método" significa exactamente un método *abstracto*.** La regla solo cuenta los que no están implementados, lo cual es más estrecho de lo que parece a primera vista y es por lo que interfaces reales que ya conoces siguen calificando. Tres tipos de miembro **no** cuentan contra el presupuesto: los métodos `default` y los métodos `static` (llevan cuerpo, así que una lambda no tiene nada que aportarles), y las redeclaraciones de métodos que toda clase ya hereda de `Object` — `equals`, `hashCode`, `toString`. Esa última excepción es lo que salva a `Comparator`, el ejemplo de la librería estándar: declara `int compare(T a, T b)` *y* `boolean equals(Object o)` *y* una larga lista de métodos `default` como `reversed()` y `thenComparing()`, y aun así `Comparator` es una interfaz funcional y `(a, b) -> a.getName().compareTo(b.getName())` es un `Comparator` válido. Solo `compare` es genuinamente abstracto; `equals` se heredaría de `Object` de todos modos, así que nunca se le podría pedir a una lambda que lo implemente.

Una lambda es una función anónima escrita en línea. Antes de Java 8, para implementar una interfaz funcional tenías que crear una clase anónima entera. Con lambdas, eso se reduce a una sola línea:

```java
// Sin lambda — una clase anónima que implementa Validator
Validator emailValidator = new Validator() {
    @Override
    public boolean validate(String value) {
        return value.contains("@");
    }
};

// Con lambda — exactamente lo mismo en una línea
Validator emailValidator = value -> value.contains("@");
```

La sintaxis es `parámetro -> expresión`: lo que está a la izquierda de la flecha es el parámetro de entrada, y lo que está a la derecha es lo que se devuelve. Java sabe a qué método apunta porque la interfaz solo tiene uno — en este caso `validate(String value)`.

Una vez asignada la lambda, `emailValidator` es de tipo `Validator`, por lo que puedes llamar a cualquier método que declare esa interfaz — en este caso `validate()`:

```java
emailValidator.validate("test@email.com");   // true
emailValidator.validate("no-at-sign");        // false
```

Las interfaces funcionales integradas más comunes ya vienen en Java — no las defines tú, simplemente las usas. Son contratos genéricos para los cuatro patrones que se repiten en todas partes con streams y lambdas:

| Interface | Método | Usada para |
|-----------|--------|---------|
| `Predicate<T>` | `boolean test(T t)` | filtrar — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)` | transformar — `list.stream().map(e -> e.getName())` |
| `Consumer<T>` | `void accept(T t)` | consumir — `list.forEach(e -> save(e))` |
| `Supplier<T>` | `T get()` | producir — `() -> new Employee()` |

Lee la tabla emparejando tu tarea con la columna `Método`: si tu lambda recibe un valor y responde true/false quieres `Predicate`; si recibe un valor y devuelve otro distinto quieres `Function`; si recibe un valor y no devuelve nada quieres `Consumer`; si no recibe nada y produce un valor quieres `Supplier`. La forma de ese único método es lo que te dice a cuál acudir.

La `T` y la `R` son genéricos — significan "cualquier tipo". `Predicate<Employee>` es un predicado que recibe un `Employee`; `Function<Employee, String>` es una función que recibe un `Employee` y devuelve un `String`. Los genéricos se explican en detalle en [09-genericos.md](09-genericos.md).

Ejemplos concretos sin streams, para ver cómo funciona cada una por sí sola:

```java
// Predicate<String> — el tipo genérico indica lo que recibe: aquí recibe un String
Predicate<String> isLong = s -> s.length() > 10;
isLong.test("Hi");            // false
isLong.test("Hello, World!"); // true

// Function — transforma un valor en otro
Function<String, Integer> toLength = s -> s.length();
toLength.apply("Hi");  // 2

// Consumer — recibe un valor y hace algo con él (sin devolver nada)
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hi");  // imprime "Hi"

// Supplier — no recibe nada y produce un valor
Supplier<String> greeting = () -> "Hello";
greeting.get();  // "Hello"
```

Las usarás cada vez que trabajes con streams y lambdas. Lo que tienes aquí es la mitad de *interfaz* de la historia — la regla de que un solo método abstracto es lo que puede apuntar una lambda, y las cuatro formas que esa regla produce. La mitad de *lambda* — cómo funciona realmente la sintaxis de la flecha, las referencias a métodos, y cómo estas cuatro interfaces son lo que en secreto pide cada operación de un stream — está en [12-streams-lambdas.md](12-streams-lambdas.md), que retoma las mismas cuatro desde el lado de quien las llama.

---

## Conexión con Spring Boot

> Docs: [Baeldung — Spring Data Repositories Compared](https://www.baeldung.com/spring-data-repositories) → leer: "2. Spring Data Repositories" — cómo extender una interfaz basta para que Spring genere la implementación.

> **Vista previa — Spring Boot:** Esta sección usa clases de Spring Boot y Spring Security (`JpaRepository`, `UserDetailsService`, `UserDetails`, `@Service`) que aún no has estudiado. Léela para ver cómo funcionan las interfaces en un proyecto real. Lo implementarás todo en las notas de Spring Boot — vuelve entonces para entenderlo en profundidad.

Esta sección existe porque las interfaces son el mecanismo central de Spring Boot — no teoría que usas una vez y olvidas. Cada vez que accedes a la base de datos o configuras seguridad en TimeTrack, estás siguiendo contratos de interfaz. Hay dos patrones distintos: en el primero tú defines la interfaz y Spring genera la implementación; en el segundo Spring define la interfaz y tú escribes la implementación.

---

### Patrón 1 — Tú defines la interfaz, Spring genera la implementación

JPA (Java Persistence API) es el estándar de Java para trabajar con bases de datos usando objetos en lugar de SQL directo. `JpaRepository` es una interfaz de Spring Data JPA que, cuando la extiendes, hace que Spring genere automáticamente todo el código de acceso a la base de datos en el arranque.

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

`JpaRepository<User, Long>` indica que este repositorio trabaja con la entidad `User` y que su clave primaria es de tipo `Long`. De esta interfaz heredas `save()`, `findById()`, `findAll()`, `delete()` y más — sin escribir una sola línea de SQL.

`findByEmail` no tiene cuerpo: Spring Data lee el nombre del método y genera el SQL `SELECT * FROM users WHERE email = ?` automáticamente. La convención es `findBy` seguido del nombre exacto del campo en la entidad — `findByEmail` busca por `email`, `findByName` buscaría por `name`, `findByEmailAndStatus` generaría `WHERE email = ? AND status = ?`. Spring Data interpreta el nombre y construye la consulta; si el campo no existe en la entidad, el proyecto falla al arrancar.

> En Java, las interfaces extienden otras interfaces con `extends`, nunca con `implements` — esa palabra solo la usan las clases. Por eso `UserRepository extends JpaRepository` y no `implements JpaRepository`.

---

### Patrón 2 — Spring define la interfaz, tú escribes la implementación

`UserDetailsService` es una interfaz de Spring Security — viene en la dependencia `spring-security-core` del `pom.xml`. No la encontrarás en los archivos de tu proyecto porque vive dentro del jar de Spring; puedes abrirla en IntelliJ haciendo Ctrl+clic sobre su nombre.

```java
// Definida por Spring Security — no está en los archivos de tu proyecto
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

`throws UsernameNotFoundException` significa que el método puede lanzar esa excepción si no encuentra al usuario. Las excepciones se explican en detalle en [11-excepciones.md](11-excepciones.md) — por ahora, léelo como "este método puede fallar con este tipo de error".

Spring Security sabe llamar a `loadUserByUsername` cuando llega una petición de login, pero no puede proporcionar la implementación porque no conoce tu base de datos. Tu trabajo es escribir esa implementación:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/UserDetailsServiceImpl.java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(!user.isActive())
                .build();
    }
}
```

El nombre `UserDetailsServiceImpl` es una convención — el sufijo `Impl` significa "implementation". Spring no la busca por ese nombre; la encuentra porque la clase está anotada con `@Service` e implementa `UserDetailsService`.

`findByEmail(username)` devuelve un `Optional<User>` — un contenedor que puede tener el usuario o estar vacío. `.orElseThrow()` lo abre: si hay usuario lo devuelve; si está vacío lanza la excepción que le pases. Los `Optional` se explican en [09-genericos.md](09-genericos.md).

El último bloque es donde el contrato se cumple de verdad. Tu `User` es una entidad de TimeTrack — una fila de base de datos — y la interfaz prometía devolver un `UserDetails`, que es un contrato completamente distinto (la propia visión de Spring Security de "un principal que puede iniciar sesión"): un username, un hash de contraseña, un conjunto de roles y unos cuantos flags de activo/desactivado. Así que traduces uno al otro, y la clase completamente cualificada `org.springframework.security.core.userdetails.User` es la clase ya lista de Spring que implementa `UserDetails` por ti. Se escribe en su forma completa aquí por una razón simple: el archivo ya importa *tu* entidad `User`, y dos clases distintas no pueden compartir el nombre corto en un mismo archivo.

> `@Service` es lo que hace visible esta clase a Spring en el arranque: le dice a Spring que cree una instancia y la conserve, y — como solo un bean de la aplicación implementa `UserDetailsService` — ese es el objeto que termina llamando Spring Security. El constructor que recibe `UserRepository` es inyección de dependencias: nunca llamas tú mismo a `new UserDetailsServiceImpl(...)`, Spring te pasa el repositorio. Ambos temas se cubren en profundidad en las notas de Spring Boot.

---

### El flujo completo

Cuando llega una petición de login, Spring Security llama a `loadUserByUsername(email)` en tu `UserDetailsServiceImpl`. Esto llama a `userRepository.findByEmail(email)`, que va a la base de datos. El resultado se devuelve a Spring Security, que verifica la contraseña y decide si el login es válido.

Dibujado como la cadena de traspasos que realmente es — y fíjate en que en cada flecha quien llama solo conoce una *interfaz*, nunca la clase que hay al otro lado:

```
POST /api/auth/login  { email, password }
        │
        ▼
Spring Security          ── mantiene una referencia UserDetailsService (la interfaz)
        │  loadUserByUsername(email)
        ▼
UserDetailsServiceImpl   ── TU clase (Patrón 2: contrato de Spring, tu código)
        │  findByEmail(email)
        ▼
UserRepository           ── TU interfaz, clase generada por Spring (Patrón 1)
        │  SELECT * FROM users WHERE email = ?
        ▼
     PostgreSQL
        │  fila → entidad User → mapeada a UserDetails
        ▼
Spring Security          ── compara la contraseña enviada con el hash guardado
        │
        ▼
   login aceptado / rechazado
```

Esa es la recompensa de todo este archivo en una sola imagen. Spring Security se compiló años antes de que existiera TimeTrack y no sabe nada de tu base de datos, y aun así llama a tu código — porque ambos lados acordaron un contrato, y cada uno aportó la mitad que estaba en condiciones de escribir.

> `username` en Spring Security significa el identificador de login. En TimeTrack ese es el email — no un campo username separado. El nombre del parámetro lo fija la interfaz; lo que contiene realmente depende de tu aplicación.

---

Ahora tienes las dos herramientas para hacer que las clases se relacionen: una **interfaz** es un contrato que firman clases sin relación entre sí, y una **clase abstracta** es un padre a medio construir que comparte implementación real. Pero este archivo solo *tomó prestada* la maquinaria de la herencia — `extends`, `super(...)`, `@Override` — para hacer funcionar las clases abstractas, sin explicar cómo funciona nada de eso. Ese es el siguiente paso: [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md) abre el mecanismo que aquí has seguido usando — cómo una subclase hereda realmente campos y métodos de su padre, cómo se comportan `super` y `@Override`, y cómo una misma llamada a un método puede ejecutar código distinto según el tipo real del objeto (polimorfismo).
