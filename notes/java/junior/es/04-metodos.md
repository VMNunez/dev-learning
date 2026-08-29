# Métodos

> 📖 [Baeldung — Guide to Methods in Java](https://www.baeldung.com/java-methods) → leer el artículo completo
> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) (referencia oficial)

## Declaración de un método

> Docs: https://www.baeldung.com/java-method-signature-return-type → leer la página completa: es corta y deja claro exactamente qué partes de una declaración forman la signature

En [03-flujo-de-control.md](03-flujo-de-control.md) cada bucle y cada `if` que escribiste vivía dentro de un método `main` — ese `main` era en sí mismo un método, igual que las llamadas a `System.out.println` que invocaba. Esta nota da un paso atrás y examina esa pieza fundamental directamente: de qué está hecho un método y cómo escribes los tuyos.

> **¿Dónde viven los métodos?** Siempre dentro de una clase — no pueden existir fuera de una clase en Java. Los explicamos aquí antes de ver las clases completas porque ya los has encontrado en los ejemplos de control de flujo. La estructura completa de una clase (campos, constructores, encapsulación) se cubre en [06-poo-clases.md](06-poo-clases.md).

Un método es un bloque de código con nombre que realiza una tarea concreta. Lo defines una vez y lo llamas desde cualquier parte del programa.

```java
public int add(int a, int b) {
    return a + b;
}
```

Este método tiene cuatro partes: `public` es el modificador de acceso (quién puede llamarlo), `int` es el tipo que devuelve, `add` es su nombre, e `int a, int b` son los parámetros de entrada. La estructura general queda así:

```java
accessModifier returnType methodName(parameters) {
    // body
    return value;
}
```

Dos palabras para el mismo hueco, y en el mundo Java se usan con precisión, así que aprende el par desde ya. Un **parámetro** (*parameter*) es la variable escrita en la declaración — el `int a` de arriba; solo existe dentro del método. Un **argumento** (*argument*) es el valor real que entregas en el punto de la llamada — el `3` de `add(3, 4)`. Los parámetros son las cajas vacías; los argumentos son lo que metes dentro. Ambas palabras vuelven a aparecer más adelante en este archivo, y el compilador también las usa en sus mensajes de error.

Esas tres partes no son decoración: juntas son el **contrato** que quien llama tiene que cumplir, y el compilador lo comprueba llamada por llamada antes de que tu programa llegue a ejecutarse. La lista de parámetros fija cuántos argumentos debes entregar y de qué tipo; el nombre más esa lista es lo que Java usa para localizar el método; y el tipo de retorno decide qué se puede hacer con el resultado en el punto de la llamada. Rompe cualquiera de los tres y el archivo no compila:

```java
public int add(int a, int b) { return a + b; }

add(3, 4);              // ✅ dos int, exactamente como se declaró
add(3);                 // ❌ error: method add in class Calculator cannot be applied to given types;
                        //    required: int,int   found: int   reason: actual and formal argument lists differ in length
add("3", "4");          // ❌ error: incompatible types: String cannot be converted to int
String s = add(3, 4);   // ❌ error: incompatible types: int cannot be converted to String
```

Lee las cuatro líneas como una sola regla vista desde cuatro ángulos: una llamada compila cuando los argumentos coinciden con la lista de parámetros en número y tipo, y cuando lo que hagas con el resultado coincide con el tipo de retorno. No se comprueba nada sobre los *valores* — solo los tipos declarados, que es justo por lo que todos estos errores llegan antes de que el programa se ejecute.

> **La signature — la parte de un método que Java usa para identificarlo.** La **signature** de un método es su nombre más el tipo y el orden de sus parámetros: `add(int, int)`. Eso es todo — el tipo de retorno *no* forma parte de la signature, y tampoco el modificador de acceso. Ahora suena a trivia, pero es exactamente la regla que decide qué método llama Java cuando varios comparten nombre (§"Sobrecarga de métodos" más abajo) y qué método reemplaza una subclase (`08-herencia-polimorfismo.md`). Cada vez que este archivo diga "la signature", se refiere a esa huella de nombre-más-tipos-de-parámetros.

La sentencia `return` hace dos cosas a la vez, y la segunda es fácil de pasar por alto. Devuelve el valor a quien llamó al método — *y sale del método de inmediato, ahí mismo*. Nada de lo que venga después se ejecuta; el control salta directamente de vuelta a la línea que hizo la llamada, que continúa con el valor devuelto en la mano.

```java
public int add(int a, int b) {
    return a + b;
    // System.out.println("done");   // ❌ inalcanzable — el método ya se fue
}
```

Esa inmediatez es una herramienta, no solo una regla: la usas deliberadamente para salir antes de tiempo (ver §"Tipos de retorno"). Y trae consigo una obligación — si declaras un tipo de retorno distinto de `void`, **todos** los caminos de salida del método deben devolver un valor. Te olvidas de uno y el archivo no compila:

```java
public int getAgeOrZero(Integer age) {
    if (age != null) {
        return age;
    }
    // sin else, sin return aquí
}
// error: missing return statement
```

> **¿Por qué el compilador se niega en lugar de devolver 0 sin más?** Porque quien llama escribió `int x = getAgeOrZero(null);`, y el sistema de tipos prometió que `x` recibiría un `int`. Si Java inventara un valor en silencio, cumpliría la promesa con un número que tú nunca elegiste — exactamente la clase de bug que el tipado estático existe para prevenir. El compilador recorre cada rama y, al encontrar una que llega a la llave de cierre sin devolver nada, detiene la compilación. La solución es devolver algo también en ese camino, nunca quitar el tipo de retorno.

Más ejemplos:

```java
public void printName(String name) {
    System.out.println(name);
    // sin return — los métodos void no devuelven nada
}

public static double calculateTax(double price, double rate) {
    return price * rate;
}
```

> **Tres cosas visibles en esa declaración quedan deliberadamente fuera de este capítulo.** La primera es
> `public`. Es un **modificador de acceso** — la palabra que dice *quién tiene permiso para llamar* al
> método — y el conjunto completo (`public`, `private`, `protected`, y no escribir nada) se resuelve en
> [06-poo-clases.md](06-poo-clases.md), porque la visibilidad solo se convierte en una decisión real una
> vez que una clase tiene estado que merezca la pena ocultar. La segunda es `static`, una palabra que
> verás en algunas declaraciones más abajo: cambia si llamas al método sobre un objeto o sobre el nombre
> de la clase, y pertenece a ese mismo capítulo por la misma razón. La tercera es qué viaja físicamente
> cuando le entregas un valor a `int a` — una copia, una referencia, y por qué "Java siempre es
> pass-by-value" es la respuesta que buscan los entrevistadores; ese es el tema de
> [05-modelo-de-memoria.md](05-modelo-de-memoria.md), y necesita el stack y el heap para poder explicarse
> con sentido. Hasta entonces, lee `public` como "llamable desde cualquier sitio" y `static` como "se
> llama sobre el nombre de la clase, no sobre un objeto". Eso es todo lo que este capítulo les pide.

---

## Tipos de retorno

> Docs: https://www.baeldung.com/java-missing-return-statement → leer la página completa: cada ejemplo es una variante del error "no todos los caminos devuelven", que es la regla sobre la que se construye esta sección

El tipo de retorno indica qué tipo de valor devuelve el método cuando termina. Si el método no calcula nada que devolver — simplemente hace algo — su tipo de retorno es `void`.

```java
public String getName() { return this.name; }   // devuelve un String
public int getAge() { return this.age; }         // devuelve un int
public boolean isActive() { return this.active; }// devuelve boolean — por convención empieza con "is"
public void save(Employee e) { ... }             // no devuelve nada
public Employee findById(int id) { ... }         // devuelve un objeto
public List<Employee> findAll() { ... }          // devuelve una colección
```

Lee esa lista como tres grupos, no como seis líneas. Las tres primeras devuelven **primitivos** — se copia un valor en bruto de vuelta a quien llamó. Las dos siguientes devuelven **objetos** (`Employee`, `List<Employee>`) — y lo que viaja de vuelta no es el objeto sino una *referencia* a él, la misma distinción valor-vs-referencia que viste en [01-variables-tipos.md](01-variables-tipos.md): quien llama termina con una flecha que apunta exactamente al mismo objeto con el que trabajaba el método, nunca con una copia de él. `void` no devuelve nada en absoluto, lo cual es una categoría aparte.

> **Lo único que devuelve un método `void` es control, y nada más.** Vale la pena ser precisos, porque "no devuelve nada" suena a que devuelve una especie de cosa vacía. No hay ningún valor en absoluto — ni `null`, ni un objeto vacío — así que la llamada es una *sentencia*, nunca una expresión de la que se pueda leer un valor. `printName("Ana");` es una línea completa; `String s = printName("Ana");` no compila, y el compilador dice `error: incompatible types: void cannot be converted to String`. Lo que sí vuelve es lo único que devuelve cualquier llamada: el flujo de ejecución, que se retoma en la línea de después de la llamada. Por eso también un método `void` puede terminar antes de tiempo con un `return;` a secas — la sentencia que conociste en [03-flujo-de-control.md](03-flujo-de-control.md) — porque hay un salto que dar aunque no haya ningún valor que llevar: `return;` devuelve el control de inmediato, y escribir `return something;` ahí falla con `error: incompatible types: unexpected return value`.

> **Devolver un objeto entrega una flecha viva, y eso tiene una consecuencia.** Si `getName()` devuelve el campo `String`, quien llama no puede hacerte daño — `String` es inmutable, así que no hay nada que cambiar. Pero si un método devuelve el campo `List` interno, quien llama ahora puede llamar a `.add()` sobre la propia lista de tu objeto desde fuera, a tus espaldas. La solución (una *copia defensiva* — devolver `new ArrayList<>(this.items)` en lugar del campo directo) va de la mano de la encapsulación y se cubre en [06-poo-clases.md](06-poo-clases.md); lo señalo ahora para que la línea "devuelve una colección" de arriba no se lea como inofensiva.

Como `return` sale del método en el acto, la forma natural para un método con un caso especial es resolverlo primero y salir, en lugar de envolver el trabajo real en un `else`. Este es el patrón de **retorno anticipado** (*early return*, o *guard clause*), y es lo que leerás en casi todos los métodos de servicio de un código real:

```java
// MAL — el trabajo real se desplaza a la derecha con cada condición nueva
public String describe(Employee e) {
    if (e != null) {
        if (e.isActive()) {
            return e.getName() + " (active)";
        } else {
            return e.getName() + " (inactive)";
        }
    } else {
        return "unknown";
    }
}

// BIEN — resuelve los casos excepcionales y sal; el camino principal queda plano al final
public String describe(Employee e) {
    if (e == null) return "unknown";
    if (!e.isActive()) return e.getName() + " (inactive)";
    return e.getName() + " (active)";
}
```

Las dos compilan y las dos son correctas; la segunda es la que sobrevive cuando se añaden tres condiciones más. También cumple visiblemente la regla de "todo camino debe devolver" — la última línea es incondicional, así que no queda ninguna rama que pueda caer fuera del método sin devolver nada.

---

## void vs Void

> Docs: https://www.baeldung.com/java-void-type → leer la página completa: es corta, y explica por qué `Void` no se puede instanciar y por qué `null` es su único valor posible

`void` (minúsculas) es una **palabra clave** de Java — significa que un método no devuelve nada:

```java
public void delete(Long id) { ... }  // no devuelve nada
```

`Void` (mayúsculas) es una **clase** — técnicamente la clase wrapper de `void`, igual que `Integer` es la wrapper de `int`. A diferencia de `Integer`, no guarda ningún valor útil; solo existe para que los genéricos puedan escribir `<Void>` cuando no hay nada que devolver. ¿Por qué es necesaria? Porque en algunos sitios Java te obliga a poner un tipo entre `<>` — por ejemplo `ResponseEntity<T>` o `Callable<T>` — y Java solo acepta una clase dentro de `<>`, nunca la palabra clave `void`:

```java
ResponseEntity<Void>   // ✓ — Void es una clase
ResponseEntity<void>   // ✗ — void es una palabra clave, no válida dentro de < >
```

> **Para aclarar la confusión:** usa `void` (minúsculas) como tipo de retorno de un método. Usa `Void` (mayúsculas) solo cuando un genérico te obliga a poner un tipo entre los **angle brackets** — los `<>`, que la mayoría de desarrolladores también llama *diamantes* — y no hay nada real que devolver. La distinción no tiene nada que ver con null — ambas significan "sin valor". La diferencia es puramente de contexto: `void` es la palabra clave para tipos de retorno; `Void` es la clase para cuando un genérico exige un tipo.

> **Vista previa — Spring Boot:** El ejemplo de abajo usa `ResponseEntity`, una clase de Spring Boot que aún no has estudiado. Léelo para ver dónde importa la diferencia entre `void` y `Void` en la práctica — lo implementarás tú mismo en las notas de Spring Boot.

Este es exactamente el patrón de Spring Boot para `delete` — el servicio devuelve `void`, pero el controlador devuelve `ResponseEntity<Void>` para poder enviar igualmente un estado 204 sin cuerpo (ver [spring-boot/02-controladores-rest.md](../../../spring-boot/junior/es/02-controladores-rest.md)):

**Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/controller/ProjectController.java`

```java
@PreAuthorize("hasRole('MANAGER')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id){
    projectService.delete(id);                  // void — no devuelve nada
    return ResponseEntity.noContent().build();  // 204, sin cuerpo
}
```

---

## Sobrecarga de métodos (overloading)

> Docs: https://www.baeldung.com/java-method-overload-override → leer: "Method Overloading", especialmente "Type Promotion" y "Static Binding"

Mismo nombre de método, parámetros distintos. Java elige la versión correcta según los argumentos que pasas:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
public int add(int a, int b, int c) { return a + b + c; }

add(1, 2);         // llama a la primera versión — devuelve 3
add(1.5, 2.5);     // llama a la segunda versión — devuelve 4.0
add(1, 2, 3);      // llama a la tercera versión — devuelve 6
```

Java decide qué versión llamar mirando los **parámetros** — su número y sus tipos. El tipo de retorno no cuenta para esa decisión. Si defines dos métodos con los mismos parámetros pero distinto tipo de retorno, Java no puede distinguirlos y el compilador rechaza el archivo antes incluso de ejecutarlo — en el punto de la llamada no hay forma de saber cuál de los dos quieres. Cuando escribes `add(1, 2)` nunca indicas un tipo de retorno, así que los parámetros son la única señal que Java tiene — dos métodos que los compartieran serían indistinguibles.

```java
public int add(int a, int b) { return a + b; }
public double add(int a, int b) { return a + b; }   // ❌ mismo nombre, mismos parámetros
// error: method add(int,int) is already defined in class Calculator
```

### Qué sobrecarga gana cuando varias encajan

Los ejemplos de arriba coincidían de forma exacta, así que no había nada que decidir. El caso interesante es `add(1, 2)` cuando ninguna sobrecarga toma `(int, int)` — varias podrían aceptar la llamada de todos modos, porque un `int` puede convertirse en `long`, o en `Integer`, o en un elemento de un `int...`. Java no elige "la más parecida" a ojo; ejecuta tres pasadas en un orden fijo y se detiene en la primera que produce una coincidencia:

| Pasada | Qué intenta Java | Ejemplo que gana aquí |
|---|---|---|
| 1 | Coincidencia exacta, o **widening** (ampliar) un primitivo a uno más grande | `add(long, long)` |
| 2 | **Boxing / unboxing** — envolver el primitivo en su clase wrapper | `add(Integer, Integer)` |
| 3 | **Varargs** — recoger los argumentos en un array | `add(int...)` |

Lee la tabla de arriba abajo como una lista de prioridad, no como tres opciones independientes: si la pasada 1 encuentra un candidato, las pasadas 2 y 3 nunca se ejecutan, aunque una sobrecarga "más obvia" viva más abajo. Así que, con `add(long, long)` y `add(Integer, Integer)` declaradas ambas, `add(1, 2)` llama a la versión **`long`** — widening le gana a boxing. El orden no es arbitrario: ampliar un primitivo es gratis en tiempo de ejecución, boxing reserva un objeto, y varargs reserva un array, así que Java prefiere la conversión más barata que pueda usar. Toda la decisión ocurre en **tiempo de compilación**, únicamente a partir de los tipos declarados en el punto de la llamada.

El modo de fallo es dos sobrecargas igual de buenas en la misma pasada, sin que ninguna sea alcanzable sin una conversión que la otra también necesita:

```java
static void add(int a, long b) { }
static void add(long a, int b) { }

add(1, 2);   // ❌ ninguna es preferible — cada una necesita una ampliación
// error: reference to add is ambiguous
//   both method add(int,long) in Calculator and method add(long,int) in Calculator match
```

> **Cómo desatascar una llamada ambigua.** No borres ninguna sobrecarga — haz que el punto de la llamada indique cuál quieres dando a los argumentos su tipo declarado exacto: `add(1, 2L)` elige `add(int, long)` sin necesitar conversión en el segundo argumento, así que la pasada 1 encuentra un único ganador. La lección general es que la resolución de sobrecargas lee *tipos declarados*, nunca valores, que es también por qué `add(1, 2)` y `add(x, y)` pueden resolverse distinto cuando `x` e `y` están declaradas como `long`.

> **Overloading vs overriding — no los confundas.** Suenan parecido y ambas hablan de "dos métodos con el mismo nombre", pero son ideas opuestas. **Overloading** (esta sección) es *una* clase que define varias versiones de un método que se diferencian en sus parámetros — la elección se hace en tiempo de compilación según los argumentos que pasas. **Overriding** es una *subclase* que reemplaza un método que heredó de su padre, manteniendo *exactamente los mismos* parámetros, para cambiar el comportamiento — la elección se hace en tiempo de ejecución según el tipo real del objeto. Regla práctica: mismo nombre + parámetros distintos + misma clase = overloading; mismo nombre + mismos parámetros + subclase = overriding. Overriding se cubre en [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md).

---

## Varargs — número variable de argumentos

> Docs: https://www.baeldung.com/java-varargs → leer: "Use of Varargs" y "Rules"

Normalmente un método con dos parámetros exige exactamente dos argumentos. Varargs (`...`) te deja pasar cualquier cantidad en su lugar — cero, uno, cinco, tantos como quieras — y Java los recoge en un array internamente. Verás esto en utilidades como `String.format()` — el mismo patrón que el `.formatted()` que viste en [01-variables-tipos.md](01-variables-tipos.md) — y en frameworks de logging, donde `log.info("User {} not found", id)` recibe el mensaje más una lista varargs de valores para encajar en cada `{}`.

> **Vista previa — logging:** `log` no es una característica del lenguaje Java. Es un logger de SLF4J, la librería de logging que Spring Boot trae de serie, y el estilo de placeholder `{}` es de esa propia librería. Aparece aquí solo porque es la API con varargs que más te vas a encontrar en un backend real — la configurarás como es debido en las notas de Spring Boot.

La sintaxis es `Tipo... nombre`, y debe ser el **último** parámetro del método. La razón es que Java tiene que saber dónde termina la lista de longitud variable: si un parámetro fijo viniera después, Java no podría distinguir qué argumento pertenece a la lista varargs y cuál es el siguiente argumento fijo.

```java
public int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) total += n;  // numbers es un array — recórrelo con for-each igual que cualquier array
    return total;
}

sum(1, 2);           // 3
sum(1, 2, 3, 4, 5);  // 15
sum();               // 0
```

Dentro del método, `numbers` no "se comporta como" un array — **es** uno. `int... numbers` e `int[] numbers` son el mismo parámetro en lo que respecta al cuerpo del método; el `...` solo cambia qué se permite escribir en el *punto de la llamada*. Java construye el array por ti en el momento de la llamada y te lo entrega. De ahí se siguen directamente dos consecuencias, y ambas son cosas que un junior falla al menos una vez:

**Un array ya existente se puede pasar directamente.** Como el parámetro es un `int[]`, puedes saltarte el paso de recolectar y entregar un array que ya tengas — sin desempaquetar, sin bucle:

```java
int[] scores = {1, 2, 3};
sum(scores);   // 6 — el array ES el parámetro varargs
```

**Una llamada sin argumentos te da un array vacío, nunca `null`.** Aquí está la trampa: parece que "no se pasó nada", así que el instinto es hacer un null-check. Java garantiza en su lugar un array de longitud `0`, que es por lo que el `for (int n : numbers)` de `sum()` de arriba simplemente se ejecuta cero veces y devuelve `0` en lugar de lanzar una excepción.

```java
sum();                       // 0 — numbers.length == 0
// numbers == null           // ❌ nunca es true; un null-check aquí es código muerto
```

> **¿Por qué un array vacío en vez de `null`?** Porque todo el sentido de varargs es que el cuerpo del método no tenga que preocuparse de cómo lo llamaron. Si una llamada sin argumentos produjera `null`, cada método varargs tendría que abrir con un `if (numbers == null)` defensivo antes de poder recorrerlo, y olvidarlo significaría una `NullPointerException` en la llamada *más fácil* de todas. Entregar un array vacío hace que el caso sin argumentos sea el mismo camino de código que cualquier otro caso. (Sí *puedes* forzar un `null` pasándolo explícitamente — `sum((int[]) null)` — pero eso eres tú anulando la garantía, no Java rompiéndola.)

### El mismo mecanismo en la librería estándar

> 📖 Docs: [Oracle Docs — Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → lee: "Arbitrary Number of Arguments" — tres párrafos, y la signature de `printf` al final es la misma que ya usas cada día.

Llevas llamando a métodos varargs desde tu primer `System.out.printf`, así que vale la pena abrir los dos que más te vas a encontrar y ver el `...` en sus declaraciones reales. Los dos son un solo mecanismo, no dos convenciones que casualmente se parecen:

```java
public static String format(String format, Object... args)   // java.lang.String
static <E> List<E> of(E... elements)                          // java.util.List
```

`String.format("Hi %s, you have %d messages", name, count)` compila en exactamente una llamada con dos argumentos: el `String` de formato, y un `Object[]` de longitud 2 que Java construyó en el punto de la llamada. `List.of("a", "b", "c")` es el mismo movimiento — las tres cadenas se empaquetan en un array y se entregan como un único parámetro — que es la razón entera por la que ambos aceptan "cualquier cantidad" sin declarar cientos de versiones.

> **`List` y el `<E>` no son de este capítulo, y puedes leer la línea sin ellos.** `List.of` aparece aquí solo como una declaración varargs que vas a reconocer. Qué es realmente una `List` llega en [10-colecciones.md](10-colecciones.md), y el `<E>` — un *type parameter* (parámetro de tipo), el placeholder que deja que una sola declaración funcione para `String`, `Integer` o cualquier otra cosa — es de [09-genericos.md](09-genericos.md). Por ahora lee `static <E> List<E> of(E... elements)` como "dale cualquier cantidad de elementos de un tipo y te devuelvo una lista con ellos".

Hay un detalle en `List.of` que conecta esta sección con la anterior, y es del tipo de cosa que parece un error hasta que conoces las reglas de resolución. Java declara `of` **doce** veces: once versiones de aridad fija, desde `of()` hasta `of(E e1, ..., E e10)`, *más* la varargs `of(E... elements)`. ¿Para qué molestarse, si la varargs sola ya aceptaría cualquier llamada?

Por la pasada 3. La resolución de sobrecargas solo llega a varargs después de que las pasadas 1 y 2 hayan fallado, así que `List.of("a", "b")` coincide con el `of(E e1, E e2)` de dos parámetros fijos en la pasada 1 y se detiene ahí — nunca se reserva ningún array. Solo un `List.of` con once elementos o más cae hasta la versión varargs y paga por el array. Las once declaraciones extra existen para que las llamadas cortas habituales sean gratis, y el orden de resolución de la sección anterior es lo que hace que esa optimización sea invisible para ti en el punto de la llamada.

> **Esta es la razón por la que `sum(scores)` y `sum(1, 2, 3)` pueden compilar los dos.** El atajo de pasar un array directamente, visto antes en esta sección, es el mismo hecho mirado desde el otro extremo: la pasada 3 no tanto *convierte* tus argumentos en un array como *acepta* uno, y si ya tienes un `int[]` no queda nada por construir. Un solo mecanismo, dos formas de llamar.

---

## Llamar a métodos

> 📖 Docs: [Oracle Docs — Defining Methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) → lee: "Naming a Method" y los dos párrafos justo antes, sobre cómo se llama — luego salta a [Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → lee: "Parameter Names", que es la regla de shadowing detrás de cada `this.name = name;` que estás a punto de ver.

Antes de ver cómo se llama a un método, juntemos todo lo visto hasta ahora en un ejemplo completo — primero la clase con sus métodos, luego cómo se usan desde fuera:

```java
public class Calculator {
    // campos de la clase — el estado que carga cada objeto; se cubre en 06-poo-clases.md
    private String name;
    private List<String> history = new ArrayList<>();

    // constructor — se ejecuta cuando haces new Calculator("MyCalc"); se cubre en detalle en 06-poo-clases.md
    public Calculator(String name) {
        this.name = name;
    }

    // Método de instancia — necesita el objeto, porque lee this.name
    public String getName() {
        return this.name;
    }

    // También de instancia — añade a la propia history de esta calculadora
    public int add(int a, int b) {
        int result = a + b;
        this.history.add(this.name + ": " + a + " + " + b + " = " + result);
        return result;
    }

    // Método estático — depende solo de su argumento, así que no hace falta objeto
    public static double square(double n) {
        return n * n;
    }
}
```

Cada método es ahora del tipo correcto para lo que hace, y ese es el sentido del ejemplo: `add()` toca `this.name` y `this.history`, así que *tiene* que llamarse sobre una calculadora en concreto; `square()` no toca nada más que su argumento, así que se declara `static` y no necesita ningún objeto. Qué significa `static` en realidad, y por qué esa división es una decisión de diseño y no una cuestión de gusto, se resuelve en [06-poo-clases.md](06-poo-clases.md) — aquí solo marca cuál de las dos formas de llamar de abajo le toca a cada método.

> `List<String>` y `ArrayList` son la lista redimensionable de Java — se cubren a fondo en [10-colecciones.md](10-colecciones.md). Por ahora léelo como "un array que puede crecer", y `history.add(...)` como "añadir un elemento al final".

Llamándolos:

```java
// Método de instancia — primero hay que crear un objeto
Calculator calc = new Calculator("MyCalc");
int result = calc.add(3, 4);           // 7
String name = calc.getName();          // "MyCalc"

// Método estático — se llama directamente sobre la clase, sin objeto
double squared = Calculator.square(5); // 25.0

// Method chaining — cada llamada devuelve un valor sobre el que puedes llamar el siguiente método de inmediato
String result2 = "  hello  "
    .trim()
    .toUpperCase()
    .replace("HELLO", "HI");           // "HI"
```

Eso último es **method chaining** (encadenamiento de métodos), y funciona por una razón concreta, no por magia de sintaxis. Cada uno de esos métodos de `String` devuelve un `String` *nuevo* — `String` es inmutable, así que `trim()` no puede editar `"  hello  "` en el sitio y en su lugar produce `"hello"` como un objeto aparte (el mecanismo se explica en [01-variables-tipos.md](01-variables-tipos.md): cada "modificación" de un String reserva uno nuevo). Como la expresión `"  hello  ".trim()` por tanto *es* un `String`, puedes poner `.toUpperCase()` justo después, y así sucesivamente por toda la cadena. Encadenar no es más que llamar a un método sobre el valor que devolvió la llamada anterior; se lee como una sola operación pero son cuatro llamadas que crean cuatro objetos. Cualquier método que devuelva un objeto se puede encadenar del mismo modo — así es exactamente como funcionaba `ResponseEntity.noContent().build()` más arriba.

---

## Paquetes e imports

> 📖 Docs: [Oracle Docs — Creating and Using Packages](https://docs.oracle.com/javase/tutorial/java/package/packages.html) → lee: "Creating a Package" — qué es un paquete y por qué existe la convención del dominio invertido.
> 📖 Docs: [Oracle Docs — Using Package Members](https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html) → lee: "Referring to a Package Member by Its Qualified Name", "Importing a Package Member" y "Name Ambiguities" — los tres casos de abajo, con las propias palabras del compilador.

Un método tiene un nombre. También lo tiene la clase que lo contiene. En cuanto un proyecto crece más allá de un puñado de archivos, esos nombres empiezan a chocar: tu `User` y el `User` que trae alguna librería se llaman los dos `User`, y Java tiene que poder distinguir uno del otro o no puede compilar ni una sola llamada. Ese es el problema que resuelven los **paquetes** (*packages*), y por eso todo archivo Java real abre con una línea que has estado ignorando hasta ahora.

Un paquete es un **namespace** (espacio de nombres) — un prefijo que convierte un nombre corto y reutilizable en uno único a nivel global. Se declara en la primera línea del archivo:

```java
package com.victor.timetrack.service;

public class ProjectService {
    public ProjectResponse getById(Long id) { ... }
}
```

El nombre real y sin ambigüedad de esa clase es ahora `com.victor.timetrack.service.ProjectService`. Java llama a eso el **nombre completamente cualificado** (*fully qualified name*): el paquete, un punto, y el nombre propio de la clase. El `ProjectService` corto es su **nombre simple** (*simple name*). Los dos se refieren a la misma clase; el completamente cualificado es con el que Java trabaja realmente por dentro.

> **El prefijo `com.victor` es un dominio de internet escrito al revés, y esa convención tiene un único trabajo.** Los paquetes solo sirven si dos organizaciones nunca eligen el mismo por accidente, así que la convención es partir de un dominio que controlas y darle la vuelta: `victor.com` se convierte en `com.victor`. Nada lo obliga — el compilador acepta `package banana;` sin quejarse — pero toda librería que vayas a añadir alguna vez sigue esta convención, por eso lees `org.springframework.stereotype`, `com.fasterxml.jackson.databind` y `java.util`. Darle la vuelta pone primero la parte más general, para que todo el árbol se ordene con sentido.

### La línea del paquete y la estructura de carpetas son el mismo hecho escrito dos veces

La declaración del paquete no es de forma libre: las carpetas en disco tienen que reflejarla, una carpeta por cada punto. Así es exactamente como se ve el backend de TimeTrack, y puedes leer cada nombre de paquete directamente de su ruta:

```
src/main/java/
  └── com/
      └── victor/
          └── timetrack/
              ├── controller/    → package com.victor.timetrack.controller;
              ├── service/       → package com.victor.timetrack.service;
              ├── model/         → package com.victor.timetrack.model;
              ├── repository/    → package com.victor.timetrack.repository;
              ├── exception/     → package com.victor.timetrack.exception;
              ├── dto/
              │   ├── request/   → package com.victor.timetrack.dto.request;
              │   └── response/  → package com.victor.timetrack.dto.response;
              └── config/, security/, util/   → same rule, one package each
```

**Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

Lee la ruta y la declaración juntas: todo lo que va después de `src/main/java/` **es** el nombre del paquete, cambiando `/` por `.`. Fíjate también en que `dto.request` no es un "subpaquete" de `dto` en ningún sentido técnico — Java no tiene ninguna relación de anidamiento entre paquetes, y `com.victor.timetrack.dto.request` no obtiene ningún acceso especial a `com.victor.timetrack.dto`. Los puntos solo *parecen* una jerarquía; para el compilador, cada paquete es un nombre plano e independiente que da la casualidad de que comparte un prefijo con sus vecinos.

Esa regla de ruta-igual-a-nombre es el mecanismo detrás de un error con el que tropezarás la primera vez que arrastres un archivo entre carpetas en IntelliJ y arregles la línea `package` a mano:

```java
// el archivo ahora vive en .../timetrack/service/ pero su primera línea sigue diciendo:
package com.victor.timetrack.controller;
```

Dos herramientas distintas se quejan, en dos momentos distintos, y saber cuál es cuál te ahorra la búsqueda. IntelliJ marca el propio archivo de inmediato, con `Package name 'com.victor.timetrack.controller' does not correspond to the file path 'com.victor.timetrack.service'`. El compilador no dice nada de esa línea — el problema aparece por el *otro* lado, en cada archivo que intentó usar la clase con el nombre que implica su carpeta: `error: cannot find symbol` sobre el tipo, o `error: package com.victor.timetrack.service does not exist` sobre el import. La clase no ha desaparecido; simplemente no está en la dirección donde todo el mundo la busca.

> **¿Por qué le importa a Java dónde está físicamente el archivo?** Porque así es como encuentra las clases. Cuando tu código nombra `com.victor.timetrack.model.Project`, el compilador no recorre todos los archivos buscando una clase que coincida — convierte el nombre en una ruta, `com/victor/timetrack/model/Project.class`, y mira exactamente ahí. La búsqueda es una traducción directa de dirección, por eso sigue siendo instantánea en un proyecto con diez mil clases, y por eso un archivo en la carpeta equivocada no es "difícil de encontrar" sino sencillamente invisible. El **Refactor → Move** de IntelliJ (`F6`) existe precisamente para mover el archivo y reescribir la línea en un solo paso; moverlo en el explorador de archivos y parchear la línea después es justo cómo se produce el desajuste en primer lugar.

### Los imports — un apodo, resuelto en tiempo de compilación

Los nombres completamente cualificados son correctos e ilegibles. *Puedes* escribir código con ellos, y compila:

```java
// ✅ legal, y nadie escribe esto así
com.victor.timetrack.model.Project project = new com.victor.timetrack.model.Project();
```

Un **import** te deja usar el nombre simple en su lugar. Va después de la línea `package` y antes de la clase, y esta es la apertura real del servicio de TimeTrack que ya has leído dos veces en este archivo:

```java
package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    public List<ProjectResponse> getAll() { ... }   // ✅ nombres simples de principio a fin
}
```

**Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

> **Un import no copia nada dentro de tu archivo, y no cuesta nada en tiempo de ejecución.** Esta es la lectura errónea más común de la palabra clave, y viene directamente de JavaScript, donde `import { x } from './y'` de verdad trae un módulo y el bundler rastrea cada uno. El `import` de Java es puro papeleo para el compilador: dice "en este archivo, cuando escribo `Project`, me refiero a `com.victor.timetrack.model.Project`". Para cuando el archivo se ha convertido en un `.class`, cada nombre dentro de él ya ha sido reescrito a su forma completamente cualificada y la línea de import ya no existe. Así que un import sin usar es un descuido de orden, nunca algo lento; `import java.util.*;` no "carga todo un paquete"; y borrar un import nunca puede cambiar lo que hace tu programa en tiempo de ejecución — solo si compila o no.

Hay tres casos que no necesitan ningún import, y saber cuáles explica por qué `String` nunca te ha pedido uno:

| Caso | Ejemplo | Por qué no hace falta import |
|---|---|---|
| Clases de `java.lang` | `String`, `Integer`, `System`, `Object`, `Math` | Java importa `java.lang.*` en cada archivo automáticamente |
| Clases en el **mismo paquete** | `ProjectService` usando `AuthenticatedUserProvider` | Mismo namespace, así que el nombre simple ya es inequívoco |
| Un uso completamente cualificado | `java.sql.Date now = ...` | Escribiste el nombre entero, así que no hay nada que traducir |

Lee la tabla como tres razones distintas por las que un nombre simple ya puede ser inequívoco — no están ordenadas por prioridad, y no eliges entre ellas. La primera fila es la que hay que memorizar: `java.lang` guarda las clases que ningún programa puede evitar, así que el lenguaje te las regala. Esa es toda la razón por la que `System.out.println` funciona en un archivo sin imports, y por la que `Integer.parseInt`, allá en [01-variables-tipos.md](01-variables-tipos.md), tampoco necesitó nunca uno. La segunda fila explica por qué `ProjectService` importa `Project` y `ProjectRepository` pero nunca importa `AuthenticatedUserProvider` — esa clase también vive en `com.victor.timetrack.service`.

### Cuando dos clases comparten el mismo nombre simple

Tarde o temprano necesitarás tanto `java.util.Date` como `java.sql.Date` en un mismo archivo. Importar los dos no es una decisión que el compilador tome por ti — la rechaza directamente:

```java
import java.util.Date;
import java.sql.Date;   // ❌
// error: a type with the same simple name is already defined by the single-type-import of Date
```

Dentro de un archivo, un nombre simple significa exactamente una clase, siempre. La solución es importar el que más uses y escribir el otro completo en los dos o tres sitios donde aparezca:

```java
import java.util.Date;

Date utilDate = new Date();                          // ✅ el importado
java.sql.Date sqlDate = new java.sql.Date(millis);   // ✅ completamente cualificado, sin ambigüedad
```

> **`import java.util.*;` no es un atajo que merezca la pena, y esta regla es la razón.** Un import con comodín trae cada clase de un paquete bajo su nombre simple, así que añadir uno te apunta en silencio a un choque con cualquier otro paquete importado de la misma forma — y el choque puede aparecer el día que una *actualización de una librería* añade una clase que tú nunca escribiste, en código que nunca tocaste. IntelliJ escribe imports explícitos de un solo tipo por defecto, y solo los colapsa a partir de un umbral que puedes subir (`Settings → Editor → Code Style → Java → Imports`). Mantenlos explícitos: el bloque de imports entonces funciona también como un resumen honesto de lo que depende el archivo, que es lo primero que lees al abrir una clase que no conoces.

---

## `null`, `NullPointerException`, y dónde rechazar un argumento ausente

> 📖 Docs: [Oracle Docs — `java.lang.NullPointerException`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/NullPointerException.html) → lee: la "Implementation Note" al final del todo — son dos frases, y es la declaración oficial de que el mensaje moderno se calcula por ti en lugar de escribirse a mano.
> 📖 Docs: [Oracle Docs — `java.util.Objects.requireNonNull(T, String)`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html) → lee: la entrada `requireNonNull(T obj, String message)` — "designed primarily for doing parameter validation in methods", que es exactamente el uso de más abajo.
> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → lee: las secciones iniciales sobre de dónde vienen los valores null y sobre cómo validar los argumentos de un método.

[03-flujo-de-control.md](03-flujo-de-control.md) te dejó con el guard de null — el simple `if (name != null)` que frena un crash — y aplazó una pregunta hasta este capítulo, porque no es en absoluto una pregunta sobre `if`: **¿dónde**, en un programa, debe rechazarse un valor ausente? Es una pregunta sobre el contrato entre un método y quien lo llama, que es justo de lo que ha ido todo este capítulo, así que pertenece aquí.

`null` significa "esta referencia no apunta a ningún objeto". Es un valor legal para cualquier tipo de referencia — `String`, `Project`, `Integer`, un array — y nunca para un primitivo; `int x = null;` no compila, porque una variable `int` guarda un número directamente, y un número no tiene ningún estado de "no apunto a nada" en el que pueda estar. El fallo ocurre en el momento en que **desreferencias** (*dereference*) una referencia `null` — es decir, sigues la flecha para llegar a algo al otro lado: llamar a un método sobre ella, leer un campo suyo, indexarla como un array. No hay nada al otro lado, así que la JVM detiene el hilo y lanza una `NullPointerException`.

```java
String name = null;
name.toUpperCase();   // ❌ NullPointerException en tiempo de ejecución — el archivo compila sin problema
```

> **¿Por qué esto es un fallo en tiempo de ejecución y no un error del compilador?** Porque el compilador rastrea *tipos*, no *valores*. Sabe que `name` es un `String`, y que `String` tiene un `toUpperCase()`, así que la llamada es correcta de tipos y el archivo compila. Lo que no puede saber es cuál de los muchos caminos de tu programa llega realmente a esa línea, y con qué valor en la variable — `name` podría ser un resultado de base de datos, un campo del cuerpo de una petición, una búsqueda que no encontró nada. El "ser null" es una propiedad de la ejecución, no del tipo, así que se comprueba cuando la flecha realmente se sigue. Y por eso nada en la sintaxis te avisa: la línea peligrosa se ve exactamente igual que la segura.

### El problema real: el crash señala la línea equivocada

La excepción en sí nunca es lo difícil. Lo difícil es que un `null` viaja en silencio, y el crash ocurre donde sea que se *use* por primera vez — que puede estar a varios métodos de distancia de donde se *aceptó* por primera vez. Aquí está esa distancia, reducida a un tamaño que se puede ver de un vistazo:

```java
public class Report {
    static String slug(String title) {
        return title.toLowerCase().replace(' ', '-');   // línea 3 — aquí aterriza el crash
    }
    static String buildPage(String title) {
        return "<h1>" + slug(title) + "</h1>";          // línea 6 — lo pasó de largo
    }
    public static void main(String[] args) {
        String titleFromRequest = null;                 // línea 9 — el verdadero culpable
        System.out.println(buildPage(titleFromRequest)); // línea 10
    }
}
```

Ejecútalo y Java te dice esto, literalmente:

```
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toLowerCase()" because "title" is null
	at Report.slug(Report.java:3)
	at Report.buildPage(Report.java:6)
	at Report.main(Report.java:10)
```

Lee las dos mitades por separado, porque responden a preguntas distintas. El **mensaje** responde *qué salió mal*: `Cannot invoke "String.toLowerCase()" because "title" is null` — el método que intentaste llamar, y la expresión exacta que era `null`. El **stack trace** de debajo responde *dónde estabas*: la lista de métodos que estaban en marcha, el más reciente primero, así que `slug` estaba corriendo, llamado desde `buildPage`, llamado desde `main`.

Ahora fíjate en la trampa. La línea de arriba del trace es `Report.java:3`, y esa línea no tiene nada de incorrecta — `slug` es un método perfectamente correcto al que le entregaron un valor malo. El error se cometió en la línea 9, dos frames más abajo, y nada en el informe apunta ahí. En un backend real esos tres frames son más bien quince, repartidos entre un controlador, dos servicios y un mapper, y el archivo que abre el trace es un archivo que no tenías ningún motivo para sospechar.

> **El mensaje se calcula por ti, y es más joven que la mayoría de los tutoriales.** Antes de Java 14, esa primera línea decía exactamente `java.lang.NullPointerException` y nada más — sin nombre de método, sin variable — así que una línea con tres llamadas encadenadas no te daba forma de saber qué eslabón era null. El Java moderno recorre el bytecode de la instrucción que falló para reconstruir una descripción de la expresión que era `null`, por eso ahora obtienes `because "title" is null` gratis. Un matiz que vale la pena conocer: el nombre que imprime depende de lo que haya guardado el compilador. Con la información de depuración que IntelliJ y Maven incluyen por defecto obtienes el nombre real, `"title"`. Compilado sin ella, el mismo fallo imprime `because "<parameter1>" is null` — mismo mecanismo, con menos con lo que trabajar.

### La solución: rechazar el valor ausente en la frontera que lo necesita

La lección no es "añade más null-checks". Salpicar `if (x != null)` por cada método esconde el bug en lugar de reportarlo, y produce el segundo peor resultado posible: una página que renderiza `<h1>null</h1>` y nadie se da cuenta durante un mes.

La lección es **dónde**. Un método que no puede hacer su trabajo sin un argumento debería decirlo *al entrar*, antes de hacer cualquier otra cosa — esta es la forma de **guard clause** que ya conociste en §"Tipos de retorno", ahora aplicada al contrato del método en lugar de a su flujo de control. La frontera correcta es el método más externo que declara ese valor como obligatorio. En el ejemplo es `buildPage`, el punto de entrada público de esta pequeña funcionalidad: es el que tiene el contrato que dice "dame un título y te doy una página".

```java
import java.util.Objects;

static String buildPage(String title) {
    Objects.requireNonNull(title, "title must not be null");   // ✅ la frontera
    return "<h1>" + slug(title) + "</h1>";
}
```

Ejecútalo otra vez con `null` y el informe cambia por completo:

```
Exception in thread "main" java.lang.NullPointerException: title must not be null
	at java.base/java.util.Objects.requireNonNull(Objects.java:246)
	at Report2.buildPage(Report2.java:8)
	at Report2.main(Report2.java:13)
```

Dos cosas mejoraron, y las dos importan más de lo que parece. El mensaje ahora es una frase que escribiste *tú*, que nombra el parámetro que faltaba en lugar de describir una llamada a un método que resultó fallar. Y el trace tiene tres líneas, con `Report2.main(Report2.java:13)` — el verdadero culpable, la línea que pasó el `null` — justo ahí, como segundo frame. Ya no estás depurando; estás leyendo.

> **`Objects.requireNonNull(x, "…")` queda declarado como andamiaje en este capítulo, y esto es exactamente lo que hace.** Es un método `static` normal y corriente de `java.util.Objects` que recibe tu valor y un mensaje. Si el valor no es `null`, te lo devuelve tal cual y la ejecución sigue como si esa línea no estuviera; si *es* `null`, lanza la `NullPointerException` con tu mensaje como texto. Ese es el comportamiento entero, y es todo lo que necesitas para leer y escribir la línea. Qué significa "lanzar" mecánicamente — la palabra clave `throw`, qué es un objeto excepción, cómo desenrolla el stack, y cuándo capturar una — es el tema de [11-excepciones.md](11-excepciones.md) y no se da por sabido aquí. Usa la forma de una línea por ahora; el capítulo dueño de la maquinaria volverá a por ella.

> **¿Por qué preferirlo sobre `if (title == null) { ... }`?** No hay nada malo con el `if` — los dos son equivalentes y Baeldung muestra ambos. `requireNonNull` gana en tres detalles pequeños que se acumulan a lo largo de un código real: es una línea en vez de tres, así que un constructor que valida cuatro parámetros sigue siendo legible; el nombre expresa la *intención* ("esto es obligatorio") donde un `if` solo expresa un mecanismo; y **devuelve el valor**, lo que te deja validar y asignar en una sola expresión — `this.field = Objects.requireNonNull(field, "…");`. Esa forma de asignación es la que te vas a encontrar más a menudo, porque la frontera más afilada en código real es aquella en la que se construye un objeto. TimeTrack lo usa exactamente ahí:

**Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/InvalidPasswordException.java`

```java
public class InvalidPasswordException extends RuntimeException {
    private final String field;

    public InvalidPasswordException(String field, String message) {
        super(message);
        this.field = Objects.requireNonNull(field, "field must not be null");
    }
}
```

> **Ese fragmento usa un constructor, y los constructores son de [06-poo-clases.md](06-poo-clases.md).** Léelo aquí solo por *dónde se sitúa la comprobación*: al entrar, antes de guardar el valor. Por qué la frontera de construir el objeto es la más fuerte disponible — un objeto que nunca podría ser válido se rechaza antes de existir, en lugar de fallar más tarde en el consumidor que sea que lo toque primero — es una regla sobre invariantes de clase, y ese es el capítulo que la enuncia. `extends RuntimeException` es de [11-excepciones.md](11-excepciones.md).

### Las tres reglas que vale la pena llevarte de esta sección

Léelas como una sola decisión tomada en tres sitios, no como una checklist:

1. **Valida lo que necesitas, en el método más externo que lo necesita.** Una comprobación en la frontera vale más que cinco comprobaciones defensivas río abajo, porque los métodos de más abajo se pueden escribir entonces como si sus argumentos siempre estuvieran presentes — lo que hace que `slug(String title)`, de arriba, sea un método de dos líneas en lugar de uno de cuatro.
2. **No hagas un guard sobre un valor que de verdad es opcional.** A veces la ausencia es la respuesta correcta — un segundo nombre, una descripción que nadie rellenó — y rechazarla convierte una entrada válida en un crash. Cuando la ausencia es un resultado normal en vez de un error, la herramienta es `Optional<T>` en lugar de un guard, y se cubre en [12-streams-lambdas.md](12-streams-lambdas.md).
3. **Nunca devuelvas `null` de un método para significar "no se encontró nada".** Estás entregándole a quien te llama la misma trampa de la que trata esta sección, y el crash señalará su línea, no la tuya. Devuelve una colección vacía, un `Optional`, o rechaza la llamada — cualquier cosa que no se pueda desreferenciar por accidente.

---

## Convenciones de nombres

> Docs: https://www.baeldung.com/java-naming-conventions → leer: "Methods" y "Variables"
> Docs: https://www.baeldung.com/java-pojo-javabeans-dto-vo → leer: "JavaBeans" — la convención de la que depende el callout de abajo

- Nombres de métodos: `camelCase`, empiezan con un verbo — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Getters booleanos: empiezan con `is` o `has` — `isActive()`, `hasRole()`, `isEmpty()`
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`

> **La forma get/set/is no es una preferencia de estilo — las librerías la leen.** Java tiene una convención con nombre propio, **JavaBeans**: una clase con un constructor sin argumentos cuyas propiedades se alcanzan mediante `getX()` / `setX()` / `isX()`. Importa porque las librerías principales localizan una propiedad *buscando exactamente esos nombres de método* en tiempo de ejecución. Jackson convierte tu objeto en JSON encontrando `getName()` y publicando un campo `"name"` — renómbralo a `fetchName()` y el campo desaparece en silencio de la respuesta de la API. JPA mapea una fila de `Project` de la misma manera. El `@Data` de Lombok, que usan los DTOs de TimeTrack, existe precisamente para generarte este boilerplate: `@Data class ProjectResponse { private String name; }` compila a una clase que ya trae `getName()` y `setName()`. Así que la convención es el contrato del que dependen tres herramientas distintas, y por eso romperla produce bugs que parecen magia.
>
> **Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/dto/response/ProjectResponse.java`

Esos getters y setters son tu primera pista de un patrón mayor: los métodos rara vez viven solos — envuelven los *campos* de una clase y controlan cómo el mundo exterior los lee y los modifica. Ese acoplamiento entre campos y métodos, junto con los constructores, `static`, los modificadores de acceso que este capítulo ha ido aplazando, y la encapsulación, es el tema entero de [06-poo-clases.md](06-poo-clases.md), donde el `Calculator` que viste arriba se convierte en una clase completa con estado.

Pero antes viene un archivo, y responde a una pregunta que este capítulo dejó deliberadamente en el aire. Ahora conoces el **contrato** completo de una llamada: la signature que quien llama tiene que cumplir, qué sobrecarga gana cuando varias podrían encajar, qué recibe realmente un parámetro `Type...`, el nombre por el que se alcanza la clase, y dónde debe rechazarse un argumento obligatorio. Lo que no sabes es qué *cruza* físicamente esa frontera cuando ocurre la llamada. Cuando escribes `buildPage(title)`, ¿se copia el `String`? ¿Se copia el `Project`? ¿Dónde vive realmente el valor validado mientras `slug` está en marcha, y cómo sabe Java a qué línea volver cuando termina — el mismo stack trace que acabas de leer tres veces en la sección de `null`? [05-modelo-de-memoria.md](05-modelo-de-memoria.md) abre la frontera del método y la dibuja: el stack y el heap, qué es una referencia, qué se copia dentro de un parámetro y qué no, y por qué "Java siempre es pass-by-value" es la frase que resuelve cualquier versión de ese argumento.
