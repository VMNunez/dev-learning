# Herencia y Polimorfismo

> 📖 [Baeldung — Guide to Inheritance in Java](https://www.baeldung.com/java-inheritance) → leer: "Class Inheritance" y "Class Inheritance and Access Modifiers"
> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

En [05-interfaces-abstractas.md](05-interfaces-abstractas.md) viste cómo las clases pueden compartir un *contrato*: una interfaz enumera los métodos que una clase promete tener, y una clase abstracta puede incluso ofrecer un padre a medio construir para que otras lo terminen. Pero un contrato solo dice *qué* métodos deben existir — no le entrega a la subclase un comportamiento listo para usar tal cual. Este archivo trata de la otra mitad: cómo una subclase **hereda comportamiento real y funcional** de un padre y lo reutiliza sin reescribir una sola línea.

Recurres a la herencia cuando dos o más clases son del mismo *tipo* de cosa y comparten la mayor parte de su comportamiento, pero difieren en algunos métodos concretos. Sin ella, escribirías los mismos métodos `eat()`, `breathe()` y `sleep()` en cada clase animal — y cada vez que necesites cambiar uno, tendrías que actualizar cada copia por separado. La herencia te permite escribir el comportamiento compartido una sola vez en una **clase padre**, y cada **subclase** lo recibe automáticamente.

## Herencia — `extends`

> Docs: [Baeldung — Guide to Inheritance in Java](https://www.baeldung.com/java-inheritance) → leer: "Class Inheritance" para `extends` en sí, y luego "Class Inheritance and Access Modifiers" para entender por qué `protected` aparece en las clases padre.

Una subclase hereda todos los campos y métodos `public` y `protected` de la clase padre y también puede añadir los suyos propios.

Los campos `private` del padre son la excepción, y merece la pena precisar cómo quedan excluidos: técnicamente viven dentro del objeto de la subclase — ocupan memoria en cada `Dog` que creas — pero la subclase no puede *nombrarlos*. Solo llega a ellos a través de los getters y setters que el padre expone. Esa es la razón completa de que `protected` exista como ajuste intermedio: es el modificador que eliges cuando quieres que las subclases lean el campo directamente, sin pasar por un getter. Por eso a lo largo de este archivo verás `protected String name` en vez de `private String name` en las clases padre.

La clase padre no tiene por qué ser abstracta. Si tiene sentido crear instancias directas de ella (`new Animal()`), déjala como clase normal; `abstract` es una decisión que tomas aparte, y solo cuando instanciar el padre produciría un objeto sin sentido.

> **¿Cuándo debería ser `abstract` el padre?** Pregúntate si algún objeto real de tu sistema es "solo un padre". En TimeTrack, `new User()` tiene sentido — un usuario es algo concreto con un nombre, un email y un rol — así que `User` se queda como clase normal. Una `BaseEntity` que solo contenga `id`, `createdAt` y `updatedAt` es el caso opuesto: nada en el sistema es nunca "solo una entidad base", siempre es un `User`, un `Project` o un `TimeEntry`. Esa clase debería ser `abstract`, para que el compilador rechace `new BaseEntity()` en vez de dejar la puerta abierta a un objeto a medias. La mecánica de `abstract` está en [05-interfaces-abstractas.md](05-interfaces-abstractas.md) — en resumen, una clase abstracta puede declarar métodos sin cuerpo, así que el objeto tendría huecos sin nada que ejecutar.

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
        super(name);    // llama al constructor del padre — siempre la primera línea, por convención
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

Java solo permite **herencia simple** — una clase puede extender solo una clase. Las clases de TypeScript funcionan igual, así que aquí no hay nada nuevo: `class A extends B, C` también es ilegal allí. Lo que TypeScript sí te deja combinar libremente son los *tipos* (`type X = A & B`), y eso es una descripción en tiempo de compilación de una forma, no un padre entregando código funcional — así que no equivale a lo que hace `extends` en ninguno de los dos lenguajes.

> **¿Por qué herencia simple?** Que una clase tenga dos padres crea el "problema del diamante": si ambos padres definen `save()`, ¿cuál hereda la subclase? Java evita la ambigüedad por completo permitiendo un solo padre. Cuando de verdad necesitas comportamiento de varias fuentes, implementas varias *interfaces* (05) en su lugar — una clase puede firmar muchos contratos aunque solo pueda extender una clase.

---

## `super`

> Docs: [Baeldung — Guide to the `super` Java Keyword](https://www.baeldung.com/java-super) → leer las secciones sobre acceder a un método de la superclase y sobre invocar el constructor de la superclase — los dos usos que se muestran a continuación.

Ya conociste `super()` como llamada al constructor en [05-interfaces-abstractas.md](05-interfaces-abstractas.md) — aquí se aplica la misma regla, así que esto es un recordatorio y no un concepto nuevo. Cuando una subclase tiene su propio constructor, normalmente necesita que el padre inicialice primero sus propios campos. `super()` activa esa inicialización, y se escribe como la primera línea:

```java
// super() — llama al constructor del padre
public Dog(String name, String breed) {
    super(name);   // primera línea — la forma que debes usar por defecto
    this.breed = breed;
}

// super.method() — llama al método del padre
@Override
public void eat() {
    super.eat();                          // ejecuta primero la versión del padre
    System.out.println("...and more!");   // luego añade comportamiento extra
}
```

En la práctica, `super.method()` aparece cuando quieres ampliar el comportamiento del padre, no sustituirlo por completo. Cuando quieres reemplazarlo del todo, sobreescribes sin llamar a `super` — y ese es, con diferencia, el caso más habitual, tanto en la lógica de negocio como en el código de framework.

> **Cómo se ve esto en TimeTrack en la práctica — y por qué `super.method()` no aparece en ninguna parte.** El proyecto extiende clases del framework en dos sitios, y ninguno de los dos llama a un método del padre. `JwtFilter extends OncePerRequestFilter` sobreescribe `doFilterInternal(...)` *sin* llamar a `super.doFilterInternal(...)`, porque el padre declara ese método como `abstract` — no hay cuerpo del padre que ejecutar, la clase existe precisamente para darte un hueco que rellenar. `ResourceNotFoundException extends RuntimeException` usa la forma del *constructor*, `super(message)`, que se cubre al final de este archivo. Así que la regla honesta que te llevas es: `super(...)` en constructores lo usarás constantemente; `super.method()` lo usas solo cuando el método del padre tiene comportamiento real que merece la pena conservar — que es justo lo que te está diciendo una clase base de framework que declara su hook como `abstract`: que no lo hagas.

> **¿Por qué `super(...)` va primero?** Porque un objeto de subclase se construye de padre hacia dentro: los campos del padre tienen que existir e inicializarse antes de que la subclase pueda tocar nada con seguridad. Hasta Java 21 el compilador lo imponía de forma literal — `super(...)` en cualquier sitio que no fuera la línea uno se rechazaba con `call to super must be first statement in constructor`. Java 25 termina de asentar los **cuerpos de constructor flexibles** ([JEP 513](https://openjdk.org/jeps/513); explicado con ejemplos en [Baeldung — Flexible Constructor Bodies in Java 25](https://www.baeldung.com/java-25-flexible-constructor-bodies)), así que ahora es legal un breve *prólogo* antes de la delegación, y la regla que el compilador aplica de verdad es más estrecha: antes de que `super(...)` se haya ejecutado, no puedes leer ni llamar a nada que pertenezca al padre. Escribir `super(...)` primero sigue siendo la forma que debes usar por defecto; la excepción es validar o normalizar un argumento antes de entregarlo. [05-interfaces-abstractas.md](05-interfaces-abstractas.md) trabaja ese caso con un ejemplo completo — la versión corta es que calcular un `String normalized = name.trim();` local antes de `super(normalized)` compila sin problema, mientras que tocar el objeto no:
>
> ```java
> public Dog(String name, String breed) {
>     this.name = name;   // MAL — name es un campo de Animal, y Animal todavía no existe
>     super(name);
> }
> ```
> ```
> error: cannot reference name before supertype constructor has been called
> ```
>
> Llamar a un método heredado falla de la misma forma (`cannot reference breathe() before supertype constructor has been called`), y cualquier uso suelto de `this` reporta `cannot reference this before supertype constructor has been called`.

> **¿Y si no escribes ningún `super(...)`?** Java inserta por ti un `super()` silencioso sin argumentos, como lo primero que se ejecuta. Esa línea oculta es lo que hace que un error por lo demás desconcertante cobre sentido: si el padre declara *solo* un constructor con parámetros, el `super()` que Java insertó está pidiendo algo que no existe.
>
> ```java
> class Animal { Animal(String n) { } }
> class Dog extends Animal { Dog() { } }   // MAL — el super() implícito no tiene qué llamar
> ```
> ```
> error: constructor Animal in class Animal cannot be applied to given types;
>   required: String
>   found:    no arguments
>   reason: actual and formal argument lists differ in length
> ```
>
> IntelliJ marca el mismo fallo antes de compilar con su propia redacción — *"There is no default constructor available in 'Animal'"* — así que te encontrarás con este error bajo dos nombres distintos. La solución es delegar explícitamente: `public Dog(String name) { super(name); }`.

---

## Sobreescritura de métodos — `@Override`

> Docs: [Baeldung — Method Overloading and Overriding in Java](https://www.baeldung.com/java-method-overload-override) → leer: "3. Method Overriding" para las reglas de abajo, y luego "2. Method Overloading" para el contraste en la siguiente subsección.

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

`@Override` es opcional pero siempre recomendable — le dice al compilador que verifique que realmente estás sobreescribiendo un método del padre, no creando accidentalmente uno nuevo. Esa verificación es lo que importa de verdad: una errata convierte tu override en un método nuevo sin relación que nadie llama jamás, y el programa igual compila y se ejecuta, usando en silencio la versión del padre para siempre. Con la anotación, el error se marca en la línea exacta donde lo escribiste:

```java
public class Dog extends Animal {
    @Override
    public String Speak() { return "Woof!"; }   // MAL — S mayúscula, esto no sobreescribe nada
}
```
```
error: method does not override or implement a method from a supertype
```

### Las reglas que debe cumplir un override válido

"La firma debe coincidir exactamente" es la versión corta, y esconde tres reglas con las que te vas a encontrar de verdad. Lo que debe coincidir exactamente es el **nombre del método y la lista de parámetros** — la parte que Java usa para identificar el método. Alrededor de eso, el compilador permite que una cosa cambie y prohíbe otras dos, y en todos los casos la razón es la misma: el código que sostiene el objeto a través del tipo *padre* debe seguir funcionando, porque se escribió contra las promesas del padre.

- **El tipo de retorno puede ser más estrecho — un retorno *covariante*.** Si `Animal.copy()` devuelve `Animal`, `Dog.copy()` puede devolver `Dog`. Nadie sale perjudicado: un llamador que espera un `Animal` sigue recibiendo uno, ya que todo `Dog` es un `Animal`. Ir en la otra dirección — devolver algo más amplio — se rechaza, porque el llamador recibiría menos de lo que se le prometió.
- **El modificador de acceso no puede ser más estrecho.** Un método `public` del padre no puede convertirse en `protected` en la subclase. Si pudiera, un llamador que tuviera una referencia `Animal` podría llamar a `speak()` mientras el objeto de debajo se negara a responder.
- **El override no puede declarar una excepción comprobada *más amplia*.** Si el `speak()` del padre no declara nada, la subclase no puede declarar de pronto `throws IOException` — el código que llamó a la versión del padre nunca escribió un `try/catch` para eso. (Las excepciones comprobadas se cubren en [08-excepciones.md](08-excepciones.md); por ahora, lee "comprobada" como "el compilador obliga al llamador a manejarla".) Las excepciones no comprobadas no tienen esta restricción, porque el compilador nunca obligó a nadie a manejarlas en primer lugar.

El compilador reporta las tres bajo la misma frase de titular, con la razón real en la línea de abajo — lee la segunda línea, no la primera:

```
error: speak() in Dog cannot override speak() in Animal
  attempting to assign weaker access privileges; was public
```
```
error: speak() in Dog cannot override speak() in Animal
  overridden method does not throw IOException
```

> **¿Por qué el tipo de retorno es lo único que se permite cambiar?** Porque no forma parte de lo que identifica al método — solo el nombre y los parámetros lo hacen. Un tipo de retorno más estrecho es una *promesa reforzada*: el padre dijo "recibirás un `Animal`", la subclase dice "recibirás un `Dog`, que también es un `Animal`". Todo llamador existente sigue satisfecho. El acceso y las excepciones funcionan en la dirección contraria: son *exigencias sobre el llamador*, y una subclase nunca puede exigir más de lo que ya exigía el padre.

### Overriding vs Overloading

**Overriding** es lo que acabas de ver: una subclase reemplaza un método del padre con el mismo nombre y exactamente la misma firma. Lo que Java decide en runtime no es el tipo de la variable, sino el tipo real del objeto que hay en memoria: si guardas un `Dog` en una variable `Animal`, Java ejecuta la versión de `Dog`, no la de `Animal`. **Overloading** (cubierto en [03-metodos.md](03-metodos.md)) es distinto: varios métodos con el mismo nombre en la misma clase, cada uno con parámetros diferentes — distinto número o distintos tipos. Java resuelve la sobrecarga en tiempo de compilación mirando los argumentos que le pasas. Ambos reutilizan el mismo nombre de método, pero son conceptos completamente separados.

|          | Overriding                       | Overloading                                        |
| -------- | --------------------------------- | ---------------------------------------------------- |
| Dónde    | Subclase                          | Misma clase                                          |
| Firma    | Debe coincidir exactamente        | Distinto número de parámetros o distintos tipos      |
| Herencia | Sí (requiere subclase)            | No                                                    |
| Runtime  | Se decide en tiempo de ejecución  | Se decide en tiempo de compilación                   |

Dos filas concentran todo el peso. La fila **`Herencia`** dice si el concepto necesita una jerarquía de clases: la sobreescritura sí — sin una subclase que extienda algo, no hay nada que sobreescribir; la sobrecarga no — `calculate(int x)` y `calculate(double x)` pueden convivir en la misma clase independiente.

La fila **`Runtime`** es la que hay que leer a través del mecanismo descrito arriba. "Se decide en runtime" significa que la sobreescritura se resuelve mediante la tabla de métodos del objeto — la JVM solo sabe qué `speak()` ejecutar una vez que puede ver el objeto real. "Se decide en tiempo de compilación" significa que la sobrecarga la resuelve el compilador a partir de los tipos de los argumentos que escribiste, antes de que el programa se ejecute nunca: `calculate(2)` frente a `calculate(2.0)` se decide al compilar, sin ningún objeto de por medio. Esa es la diferencia profunda — una espera al objeto, la otra nunca lo necesita.

---

## Polimorfismo

> Docs: [Baeldung — Polymorphism in Java](https://www.baeldung.com/java-polymorphism) → leer la sección "Dynamic (Runtime) Polymorphism" — el mecanismo de dispatch dinámico que se explica más abajo — y "Static Polymorphism" para el contraste con la sobrecarga de la sección anterior.

El problema que resuelve el polimorfismo: tienes una lista de tipos relacionados pero distintos — `Dog`, `Cat` y `Bird`, todos subclases de `Animal` — y necesitas llamar al mismo método en todos ellos. Sin polimorfismo escribirías un `if` para cada tipo — y cada vez que añades un tipo nuevo, modificas ese `if`. Con polimorfismo, los declaras todos como `Animal` y llamas a `speak()` una sola vez: Java elige la versión correcta para cada objeto automáticamente.

La clave es que el tipo de la **variable** y el tipo del **objeto** pueden ser distintos:

```java
Animal a = new Dog("Rex", "Labrador");  // variable: Animal  /  objeto real: Dog
```

Cuando llamas a `a.speak()`, Java no mira el tipo de la variable (`Animal`) — mira el tipo real del objeto en memoria (`Dog`) y ejecuta la versión de `speak()` de `Dog`. A esto se le llama **dispatch dinámico**: la decisión de qué método ejecutar ocurre en runtime, no en tiempo de compilación.

Pero, ¿cómo *sabe* Java, en runtime, qué versión ejecutar? La variable `a` es solo una referencia — no dice nada sobre si el objeto real es un `Dog` o un `Cat`. El mecanismo es una tabla de búsqueda oculta. Cuando la JVM carga una clase, construye una **tabla de métodos** para esa clase (a menudo llamada *vtable*, por "virtual method table"): una lista que asocia cada nombre de método con el código exacto que debe ejecutarse para esa clase. La tabla de `Dog` apunta `speak()` al código de `Dog`; la tabla de `Cat` apunta `speak()` al código de `Cat`. Cada objeto que creas lleva un puntero oculto a la tabla de su propia clase — un objeto `Dog` apunta a la tabla de `Dog`, un objeto `Cat` a la de `Cat`. Así que `a.speak()` compila a: "sigue el puntero de tabla del objeto, busca `speak()` en esa tabla, salta al código que indique." El tipo de la variable es irrelevante en ese momento — el propio objeto lleva el mapa.

> **Analogía — el objeto lleva su propia agenda telefónica.** Piensa en la tabla de métodos como una pequeña agenda que cada objeto guarda en el bolsillo. Llamar a `speak()` significa "abre tu agenda, busca la entrada `speak`, marca ese número". Un `Dog` y un `Cat` tienen ambos una entrada `speak`, pero sus agendas listan números distintos — así que la *misma* llamada llega a código distinto. Java nunca tiene que adivinar el tipo; simplemente deja que el objeto lea de su propia agenda.

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
List<Animal> animals = new ArrayList<>();
animals.add(new Dog("Rex", "Labrador"));
animals.add(new Cat("Whiskers"));

// MAL — sin polimorfismo: cada tipo nuevo obliga a cambiar aquí
for (Animal a : animals) {
    if (a instanceof Dog) System.out.println("Woof!");
    else if (a instanceof Cat) System.out.println("Meow!");
    // ¿añades Bird? vuelves aquí y añades otro else if
}

// BIEN — con polimorfismo: añades Bird y este bucle no cambia nunca
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

> Docs: [Baeldung — The Java `instanceof` Operator](https://www.baeldung.com/java-instanceof) → leer: "The `instanceof` Operator", y luego [Baeldung — Pattern Matching for `instanceof`](https://www.baeldung.com/java-pattern-matching-instanceof) → leer: "Pattern Matching for `instanceof`" para la forma de Java 16+.

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

Saltarte la comprobación es lo que hace que la `ClassCastException` sea real en vez de teórica. El compilador no te lo impide, porque, hasta donde puede ver, el cast es *plausible*: `animal` está declarado como `Animal`, y un `Dog` es un `Animal`, así que podría serlo. Solo *podría* serlo — y la comprobación que lo resuelve ocurre en runtime, sobre el propio objeto:

```java
Animal pet = new Cat("Whiskers");

// MAL — sin comprobación: compila limpio, explota solo cuando se ejecuta esta línea
Dog d = (Dog) pet;
d.fetch();

// BIEN — instanceof le pregunta primero al objeto; si dice que no, el bloque simplemente se salta
if (pet instanceof Dog dog) {
    dog.fetch();
}
```

La versión mala falla en la línea del cast, antes de que `fetch()` llegue a alcanzarse:

```
Exception in thread "main" java.lang.ClassCastException: class Cat cannot be cast to class Dog (Cat and Dog are in unnamed module of loader 'app')
```

> **¿Por qué el compilador deja pasar el cast malo?** Porque un cast eres tú anulando su criterio. El compilador solo comprueba que el cast sea *posible* a lo largo del árbol de clases — convertir `Animal` en `Dog` es un downcast, y los downcasts son exactamente para lo que existe el casting. Si *este objeto en concreto* es realmente un `Dog` solo se puede saber cuando el objeto existe, así que la JVM lo vuelve a comprobar en runtime y lanza una excepción si mentiste. Por eso una `ClassCastException` es una `RuntimeException` y no un error de compilación — mira [08-excepciones.md](08-excepciones.md), donde se sitúa en la mitad no comprobada de la jerarquía: el compilador no puede preverla, así que no te obliga a manejarla.

> **Trata el `instanceof` frecuente como una señal de mal diseño, no como una herramienta a la que recurrir.** Cada cadena de `instanceof` es el "gran `if`" de la sección anterior con otra forma: pone la decisión de tipo en tu código que llama en vez de en la tabla de métodos del objeto, así que cada subclase nueva te obliga a volver a editarla. Los usos legítimos son pocos — implementar `equals(Object o)`, que debe aceptar cualquier cosa (viste esa forma en [04-poo-clases.md](04-poo-clases.md)), y manejar un objeto genuinamente ajeno que no diseñaste tú. En cualquier otro sitio, la solución es añadir un método al padre y dejar que el dispatch dinámico elija la versión.

---

## Clases, métodos y campos `final`

> Docs: [Baeldung — The `final` Keyword in Java](https://www.baeldung.com/java-final) → leer: "`final` Classes", "`final` Methods" y "`final` Variables" — uno por cada significado de abajo.

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
        this.radius = radius;  // la única asignación permitida
    }
}
```

Cada uno de los tres produce su propio error, y merece la pena reconocerlos porque las palabras apenas se parecen. Extender una clase `final` se rechaza en la propia cláusula `extends` — este es el que más probablemente te encuentres primero, normalmente al intentar heredar de algo de la librería estándar:

```java
class MyString extends String { }   // MAL
```
```
error: cannot inherit from final String
```

Sobreescribir un método `final` reporta el mismo titular que cualquier otro override ilegal, con la razón real debajo:

```
error: breathe() in Dog cannot override breathe() in Animal
  overridden method is final
```

Y reasignar un campo `final` te da uno de dos mensajes según *dónde* lo hagas — fuera de un constructor es un rechazo directo, dentro de un constructor que ya lo asignó el texto cambia para reflejar que la primera asignación fue legal:

```java
class Circle {
    private final double radius = 1;
    void grow() { radius = 2; }     // MAL
}
```
```
error: cannot assign a value to final variable radius
```
```
error: variable radius might already have been assigned
```

> **`final` en un campo es el `const` de JavaScript, y se aplica la misma advertencia.** `final double radius` y `const radius` se comportan de forma idéntica: una asignación, y luego el nombre queda bloqueado. Y en ambos lenguajes el bloqueo está en la *variable*, no en el objeto al que apunta — un `final List<String> tags` nunca puede apuntar a una lista distinta, pero `tags.add("x")` funciona exactamente igual que antes. Es la misma distinción entre valor y referencia de [01-variables-tipos.md](01-variables-tipos.md): lo que `final` congela es la casilla, no lo que hay dentro de ella.

> **¿Por qué está `final` aquí, en un archivo de herencia?** Porque dos de sus tres usos van de *frenar* la herencia: una `final class` cierra la puerta a heredar de ella, y un `final method` cierra la puerta a sobreescribirlo. Es lo deliberadamente opuesto a todo lo anterior — recurres a ello cuando una clase o un método nunca deben extenderse ni reemplazarse, normalmente por seguridad (`String` es `final` para que nadie pueda heredar de ella y romper las garantías sobre las que se apoya todo el lenguaje). El significado de `final field` no tiene relación con la herencia; solo comparte la palabra clave.

En Spring Boot verás `final` constantemente en los campos de las clases de servicio, guardando las dependencias que se entregan por constructor. Es la forma recomendada de escribir los beans, y la razón es exactamente la regla de "se asigna una sola vez" de arriba, no una preferencia de estilo:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;   // se asigna una vez, en el constructor

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
}
```

> **Qué te da `final` en una dependencia inyectada.** Tres cosas, todas impuestas por el compilador en vez de fiarte de la buena voluntad. Primero, el campo *tiene* que quedar asignado antes de que termine cada constructor, así que no hay forma de construir un `ProjectService` cuyo repositorio sea `null` — el objeto o queda completamente cableado o no compila. Segundo, nada puede cambiar el repositorio más tarde, lo cual importa porque un servicio de Spring es un único objeto compartido que atiende todas las peticiones a la vez; un campo que pudiera reasignarse a mitad de vuelo sería un bug que nunca podrías reproducir. Tercero, documenta la intención: leer `final` al principio de un servicio te dice de inmediato que eso es una dependencia, no estado mutable. La inyección por campo (`@Autowired` directamente sobre el campo) renuncia a las tres cosas, y por eso está desaconsejada — el campo no puede ser `final`, porque no hay ningún constructor haciendo la asignación.

---

## Lo que no se puede sobreescribir — métodos `static`, `private` y `final`

> Docs: [Baeldung — Variable and Method Hiding in Java](https://www.baeldung.com/java-variable-method-hiding) → leer: "Method Hiding" para el caso `static`, y luego [Baeldung — Static and Dynamic Binding in Java](https://www.baeldung.com/java-static-dynamic-binding) → leer: "Static Binding" para entender por qué los tres casos de abajo comparten una sola causa.

Todo lo visto hasta ahora apunta en la misma dirección: pones un método en el padre, lo reemplazas en la subclase, y el objeto decide qué cuerpo se ejecuta. Tres tipos de método quedan silenciosamente fuera de ese sistema, y el peligroso es `static` — porque redeclarar un método `static` en una subclase *parece* exactamente un override, compila sin quejarse, y luego se comporta de forma distinta.

El mecanismo de §Polimorfismo es lo que explica los tres a la vez. El dispatch dinámico funciona porque el objeto lleva un puntero a la tabla de métodos de su clase. Un método que nunca necesita un objeto, o que ninguna subclase puede siquiera ver, no tiene entrada que buscar — así que no hay nada sobre lo que la JVM pueda hacer dispatch, y la decisión recae en el compilador, que solo conoce el **tipo de la referencia** que escribiste.

### Los métodos `static` se *ocultan*, no se sobreescriben

Un método `static` pertenece a la clase, no a ninguna instancia ([04-poo-clases.md](04-poo-clases.md) explica por qué — hay una única copia compartida, y no existe `this`). Cuando una subclase declara un método `static` con la misma firma, no reemplaza la versión del padre; la **oculta**. Los dos cuerpos siguen existiendo, y cuál de ellos se ejecuta se decide en tiempo de compilación según qué nombre esté a la izquierda del punto:

```java
public class Animal {
    static String describe() { return "Some animal"; }
}

public class Dog extends Animal {
    static String describe() { return "A dog"; }   // oculta — NO sobreescribe
}
```

La trampa clásica es llamar a un método oculto a través de una referencia, porque la sintaxis es idéntica a la de una llamada de instancia:

```java
Animal a = new Dog("Rex", "Labrador");

Animal.describe();   // "Some animal"
Dog.describe();      // "A dog"
a.describe();        // "Some animal"  ← el objeto es un Dog, pero se ejecuta la versión de Animal
```

Esa tercera línea es la lección completa. Si `describe()` fuera un método de instancia, se consultaría la tabla del objeto y se imprimiría `"A dog"` — es el comportamiento que viste con `speak()`. Como es `static`, el compilador lo resuelve a partir del tipo declarado de `a`, que es `Animal`, y el objeto real en memoria nunca se consulta. IntelliJ subraya `a.describe()` con una advertencia ("Static method accessed via instance reference") precisamente porque la llamada se lee como algo que no es.

> **¿Por qué un método `static` no se puede hacer dispatch dinámico?** El dispatch parte del objeto: "sigue el puntero de este objeto hasta la tabla de métodos de su clase". Un método `static` se puede llamar sin que exista ningún objeto — `Animal.describe()` funciona perfectamente antes de que escribas `new` alguna vez — así que no hay ningún objeto del que partir ni ninguna tabla por instancia que consultar. Por eso el compilador tiene que elegir un cuerpo mientras compila, y la única información de tipo que tiene en ese momento es la que declaraste para la variable.

Java te da dos barreras de seguridad alrededor de esto, y merece la pena saber que existen para que los errores no sean una sorpresa. Marcar la versión de la subclase con `@Override` se rechaza de forma directa, que es el compilador diciéndote que los dos métodos no están relacionados como crees:

```
error: static methods cannot be annotated with @Override
```

Y no puedes mezclar los dos — un método de instancia en la subclase no puede ocupar el lugar de uno `static` en el padre, ni al revés:

```
error: describe() in Dog cannot override describe() in Animal
  overridden method is static
```

> **`static` en el padre suele ser el verdadero error.** El ocultamiento casi nunca es algo que quieras; produce dos métodos con un solo nombre y una regla que nadie recuerda. Si el comportamiento de un método debe variar según la subclase, tiene que ser un método de instancia. Si de verdad no depende del objeto, déjalo `static` y llámalo a través del nombre de la clase (`Animal.describe()`) para que la resolución sea visible en el código en vez de esconderse detrás de una referencia.

### Los métodos `private` son invisibles, así que nada puede sobreescribirlos

Un método `private` no forma parte de lo que hereda una subclase — la subclase no puede verlo, y mucho menos reemplazarlo. Declarar un método con el mismo nombre en la subclase crea, por tanto, un método nuevo completamente sin relación, y el padre sigue llamando al suyo:

```java
public class Animal {
    private String secret() { return "animal secret"; }
    String reveal() { return secret(); }        // siempre llama al secret() de Animal
}

public class Dog extends Animal {
    private String secret() { return "dog secret"; }   // método sin relación, mismo nombre
}

Animal a = new Dog("Rex", "Labrador");
a.reveal();   // "animal secret" — la versión de Dog nunca se alcanza
```

> **¿Por qué `reveal()` no llega a la versión de `Dog`?** Porque un método `private` se vincula en tiempo de compilación, por la misma razón estructural que `static`: ninguna subclase puede verlo, así que nunca puede existir una entrada de subclase para él en la tabla, así que no hay nada sobre lo que hacer dispatch. El compilador resuelve `secret()` dentro de `Animal` al propio cuerpo de `Animal`, y eso es definitivo. Añadir `@Override` a `Dog.secret()` produce `method does not override or implement a method from a supertype` — el mismo error que el caso de la errata anterior, y por la misma razón de fondo: no hay ningún método del padre visible que sobreescribir.

### Los métodos `final` se hacen dispatch, pero están bloqueados

`final` es el raro de los tres. Un método `final` *es* un método de instancia normal — tiene una entrada en la tabla y se hace dispatch dinámico como cualquier otro. Lo que `final` elimina es la capacidad de una subclase de poner un cuerpo distinto en esa entrada, y el compilador lo impone en el momento del intento (`overridden method is final`, de la sección anterior). Úsalo cuando el comportamiento de un método es una garantía de la que depende el resto de la clase y una subclase no debe poder romperla.

|                   | ¿Se puede sobreescribir? | Se resuelve por                              |
| ----------------- | ------------------------- | --------------------------------------------- |
| Método de instancia | Sí                       | el tipo real del objeto (runtime)             |
| Método `static`     | No — se *oculta*         | el tipo de la referencia (tiempo de compilación) |
| Método `private`    | No — invisible para las subclases | la clase que lo declara (tiempo de compilación) |
| Método `final`      | No — bloqueado por el compilador | el tipo real del objeto (runtime)             |

Lee la columna `Se resuelve por` como "qué decide qué cuerpo se ejecuta". Solo las filas que dicen *runtime* participan del polimorfismo; las dos filas de tiempo de compilación se deciden a partir del texto que escribiste, que es por lo que te pueden sorprender cuando el tipo declarado de la variable y el tipo real del objeto difieren. `final` está deliberadamente en el grupo de runtime: es la única restricción que limita *quién puede escribir* el método, no *cómo se elige*.

---

## La clase `Object`

> Docs: [Baeldung — `equals()` and `hashCode()` Contracts](https://www.baeldung.com/java-equals-hashcode-contracts) → leer: "2.1. Overriding equals()" y "3. The .hashCode() Method" — los dos métodos de `Object` que de verdad vas a sobreescribir. Ya trabajaste ambos en [04-poo-clases.md](04-poo-clases.md); léelos aquí solo como métodos *heredados*.

Existe una clase en lo más alto de toda jerarquía de herencia en Java: `Object`. Todas las clases la extienden automáticamente, aunque no la declares. Esto significa que cualquier objeto que crees lleva consigo un conjunto de métodos heredados de `Object` — los hayas definido tú o no.

Los tres que más aparecen en proyectos reales son:

- **`toString()`** — se llama automáticamente cuando imprimes un objeto con `System.out.println(obj)` o lo concatenas en un `String`. Sin sobreescribirlo obtienes algo como `com.victor.timetrack.model.User@1a2b3c` — el nombre de la clase y una dirección de memoria, que no dice nada útil. Lo sobreescribes para devolver algo legible como `"User{name='Victor'}"`.
- **`equals()`** — compara si dos objetos son "iguales". Sin sobreescribirlo, Java compara referencias de memoria: dos objetos distintos con los mismos datos no son iguales aunque representen la misma entidad. Lo sobreescribes cuando quieres que la comparación se base en los valores de los campos.
- **`hashCode()`** — usado internamente por `HashMap` y `HashSet` para organizar objetos en memoria. La regla es: si sobreescribes `equals()`, siempre debes sobreescribir también `hashCode()` — si no, tus objetos se comportarán de forma inesperada dentro de colecciones.

> **¿Por qué `equals()` y `hashCode()` deben cambiar siempre juntos?** Porque un `HashMap` usa el hash code como dirección y `equals()` solo para confirmar la coincidencia una vez que llega ahí — así que dos objetos que son `equals()` con hash codes distintos quedan archivados en direcciones distintas y nunca se encuentran. El mecanismo completo, el contrato de `equals()` y qué se rompe en una entidad JPA se explican con detalle en [04-poo-clases.md](04-poo-clases.md); aquí, quédate solo con la regla: sobreescribe uno y sobreescribe el otro.

Ya escribiste los tres a mano en [04-poo-clases.md](04-poo-clases.md) — la forma de la implementación, qué campos elegir, y qué se rompe en una entidad JPA viven todos ahí, y este archivo no los repite. Lo nuevo *aquí* es solo la frase que hace que todo eso tenga sentido: nunca estabas añadiendo esos métodos, estabas **sobreescribiendo métodos heredados**. `User` recibe un `toString()` gratis en el momento en que se compila, porque `User extends Object` se escribió por ti; tu `@Override` cambia el cuerpo en la tabla de métodos, y el dispatch dinámico — el mecanismo de §Polimorfismo — es lo que hace que `System.out.println(user)` llegue a *tu* versión en vez de a la de `Object`.

Merece la pena fijarlo, porque `println` nunca menciona tu clase:

```java
User u = new User("Victor", "victor@example.com");
System.out.println(u);   // sin override: "com.victor.timetrack.model.User@3a4b5c"
                         // con override: "User{name='Victor', email='victor@example.com'}"
```

`System.out.println(Object x)` está compilado contra el tipo de parámetro `Object` y llama a `x.toString()`. No tiene ni idea de que `User` existe — simplemente sigue la propia tabla de métodos del objeto, encuentra el cuerpo de `toString()` que esa clase registró, y lo ejecuta. Cada `toString()` "mágico" que hayas visto en tu vida es esta misma regla, y lo mismo pasa con `equals()`: `List.contains()` y `HashMap.get()` llaman a `equals(Object)` sobre un parámetro tipado como `Object`, y aterrizan en tu cuerpo exactamente por la misma razón.

> **Esto también explica por qué IntelliJ puede generarte los tres (`Alt+Insert` → *equals() and hashCode()*).** Las firmas están fijadas por `Object` — `public String toString()`, `public boolean equals(Object o)`, `public int hashCode()` — así que la única decisión que queda es qué campos comparar o imprimir. En Spring Boot, `@Data` o `@EqualsAndHashCode` de Lombok los genera en tiempo de compilación en su lugar, que es por lo que una entidad de TimeTrack tiene los tres sin una sola línea de ellos en el código fuente.

> **Como toda clase desciende de `Object`, siempre puedes guardar cualquier objeto en una variable `Object`:** `Object obj = new User("Victor", "victor@example.com");` es válido, ya que `User` extiende `Object` implícitamente. Es el mismo upcasting que viste con `Animal a = new Dog(...)` — solo que ahora el padre es la raíz universal. Es exactamente por eso que métodos como `equals(Object o)` reciben un parámetro `Object`: se les puede pasar cualquier objeto, y `instanceof` lo estrecha de vuelta al tipo real dentro.

---

## Conexión con Spring Boot

> Docs: [Baeldung — Spring Data Repositories compared](https://www.baeldung.com/spring-data-repositories) → leer: "Spring Data Repositories" y "JpaRepository" — qué heredas al extender, y para qué sirven los dos parámetros de tipo.

> **Vista previa — Spring Boot:** Esta sección usa `JpaRepository` y `RuntimeException` en un contexto de Spring Boot. `JpaRepository` se explica en las notas de Spring Boot. `RuntimeException` es una clase Java que se cubre en [08-excepciones.md](08-excepciones.md) — si aún no has leído ese archivo, vuelve aquí después.

La herencia no es una técnica ocasional en Spring Boot — es la forma de conectarte al framework en absoluto. Los dos sitios donde te la encuentras el primer día son los repositorios y tus propios tipos de excepción, y la usan de formas opuestas: en el primero heredas comportamiento que nunca escribiste, en el segundo heredas *identidad* para que el framework reconozca tu clase.

### Heredar comportamiento — un repositorio que extiende `JpaRepository`

Un repositorio en TimeTrack es una interfaz con casi nada dentro — el archivo de abajo es la clase completa, tal cual existe en el proyecto:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

- **`extends JpaRepository`** — la misma palabra clave que `Dog extends Animal`, usada entre dos interfaces (las interfaces extienden interfaces; `implements` es solo para clases). Todo lo que `JpaRepository` declara ahora también lo declara `UserRepository`: `save()`, `findById()`, `findAll()`, `deleteById()`, `count()` y más, ninguno de los cuales escribiste tú.
- **`<User, Long>`** — los dos *parámetros de tipo*, y esta es la parte que es fácil pasar por alto. El primero dice **qué entidad guarda este repositorio**: filas de la tabla `users`, cargadas como objetos `User`. El segundo dice **de qué tipo es la clave primaria de esa entidad** — `User` declara `private Long id`, así que el tipo de la clave es `Long`. Juntos son lo que hace concretos los métodos heredados: como le pasaste `User` y `Long`, `findById()` en *este* repositorio recibe un `Long` y devuelve un `User`, no algún objeto genérico que tendrías que castear. Si te equivocas en el segundo — escribes `<User, String>` mientras el `id` de la entidad es un `Long` — la aplicación se niega a arrancar: Spring construye el repositorio cuando el contexto se levanta, ve el desajuste contra el campo `@Id`, y falla ahí en vez de dejar que se convierta en una sorpresa a mitad de una petición. La sintaxis `<...>` en sí misma son los **genéricos**, cubiertos por completo en [10-genericos.md](10-genericos.md); por ahora lee `JpaRepository<User, Long>` como "un repositorio de `User` cuyo id es un `Long`".
- **`Optional<User> findByEmail(String email)`** — el tipo de retorno `Optional<User>` es una pequeña caja que contiene un `User` o está vacía, así que una fila que falta llega como "no se encontró nada" en vez de un `null` que podrías olvidarte de comprobar; se cubre en [10-genericos.md](10-genericos.md). El método en sí no tiene cuerpo, lo cual es legal aquí porque las interfaces declaran en vez de implementar ([05-interfaces-abstractas.md](05-interfaces-abstractas.md)). Spring Data lee el *nombre* al arrancar y genera la consulta a partir de él: `findBy` + el campo de entidad `email` se convierte en `SELECT * FROM users WHERE email = ?`.

> **¿Dónde está la clase que hace el trabajo de verdad?** No hay ninguna que puedas abrir. `UserRepository` es una interfaz sin ninguna implementación en el proyecto — al arrancar, Spring genera una clase que la implementa y registra ese objeto como el bean que inyectas. Ese es el premio de toda la cadena `extends`: declaraste un contrato, el framework te suministró el comportamiento detrás.

### Heredar identidad — una excepción personalizada que extiende `RuntimeException`

El segundo patrón usa la herencia por una razón completamente distinta. Aquí no vas detrás de comportamiento heredado — quieres que tu clase *sea* una excepción, para que `throw` la acepte y el manejo de errores de Spring pueda capturarla por tipo:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/ResourceNotFoundException.java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

- **`extends RuntimeException`** — esta única palabra es lo que hace que la clase sea lanzable. Java solo te deja hacer `throw` de algo que descienda de `Throwable`, así que sin el `extends` tu clase es solo una clase. También decide *en qué mitad* del mundo de excepciones caes: `RuntimeException` es la rama no comprobada, así que los llamadores no están obligados a envolver la llamada en un `try/catch` ([08-excepciones.md](08-excepciones.md)).
- **`super(message)`** — la misma llamada al constructor del padre del principio de este archivo, haciendo trabajo real en vez de mero formalismo. `RuntimeException` es donde vive de verdad el campo del mensaje; pasarlo hacia arriba es lo que hace que `getMessage()` devuelva tu texto más tarde, en el handler que convierte la excepción en un HTTP 404. En este proyecto el mensaje lo construye quien llama, así que `ProjectService` lanza `new ResourceNotFoundException("Project not found with id: " + id)` y el único trabajo del constructor es entregarle esa cadena al padre.

> **¿Por qué la clase no se llama `EmployeeNotFoundException`?** Porque un tipo de excepción por entidad significaría escribir las mismas tres líneas para `User`, `Project` y `TimeEntry`, y luego registrar tres handlers que todos produzcan un 404. TimeTrack declara una sola `ResourceNotFoundException` y deja que el *mensaje* diga qué recurso faltaba. Eso es una decisión de diseño, no una regla — un proyecto con manejo genuinamente distinto por entidad las separaría — pero es la forma con la que te encontrarás más a menudo, y merece la pena notar que solo funciona porque el mensaje se pasa hacia arriba al padre en vez de estar fijado aquí.

---

Ahora tienes objetos que comparten comportamiento a través de un padre, lo sobreescriben donde difieren, y se manejan de forma uniforme mediante polimorfismo. La necesidad natural siguiente es un sitio donde *guardar muchos de ellos* — una lista de `Animal`, un conjunto de `User` únicos, un mapa de id a `Project`. Guardar grupos de objetos es de lo que trata [07-colecciones.md](07-colecciones.md), y se apoya directamente en lo que acabas de aprender: una `List<Animal>` guarda perros y gatos uno al lado del otro precisamente porque el polimorfismo permite que un único tipo de variable contenga muchos tipos de objeto.
