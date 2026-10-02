## Índice de esta nota

- [Métodos](#métodos)
- [Declaración de un método](#declaración-de-un-método)
- [Tipos de retorno](#tipos-de-retorno)
- [void vs Void](#void-vs-void)
- [Sobrecarga de métodos (overloading)](#sobrecarga-de-métodos-overloading)
  - [Qué sobrecarga gana cuando varias encajan](#qué-sobrecarga-gana-cuando-varias-encajan)
- [Varargs — número variable de argumentos](#varargs--número-variable-de-argumentos)
  - [El mismo mecanismo en la librería estándar](#el-mismo-mecanismo-en-la-librería-estándar)
- [Llamar a métodos](#llamar-a-métodos)
- [Paquetes e imports](#paquetes-e-imports)
  - [Cada parte del nombre del paquete es una carpeta](#cada-parte-del-nombre-del-paquete-es-una-carpeta)
  - [Los imports — usar el nombre simple, resuelto en tiempo de compilación](#los-imports--usar-el-nombre-simple-resuelto-en-tiempo-de-compilación)
  - [Cuando dos clases comparten el mismo nombre simple](#cuando-dos-clases-comparten-el-mismo-nombre-simple)
- [`null`, `NullPointerException`, y dónde rechazar un argumento ausente en un método](#null-nullpointerexception-y-dónde-rechazar-un-argumento-ausente-en-un-método)
  - [La `NullPointerException` salta donde se usa el `null`, no donde apareció](#la-nullpointerexception-salta-donde-se-usa-el-null-no-donde-apareció)
  - [La solución: rechazar el valor ausente en la frontera que lo necesita](#la-solución-rechazar-el-valor-ausente-en-la-frontera-que-lo-necesita)
  - [Dos formas de comprobar que un argumento no es `null`](#dos-formas-de-comprobar-que-un-argumento-no-es-null)
  - [Tres reglas para trabajar con `null` en los métodos](#tres-reglas-para-trabajar-con-null-en-los-métodos)
- [Convenciones de nombres](#convenciones-de-nombres)
- [Lo que esto desbloquea](#lo-que-esto-desbloquea)

# Métodos

> 📖 [Baeldung — Guide to Methods in Java](https://www.baeldung.com/java-methods) → leer el artículo completo
> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) (referencia oficial)

[03-flujo-de-control.md](03-flujo-de-control.md) terminó con llamadas a métodos que sabías leer pero que todavía no habías escrito tú: `loadPage(page)`, `isApproved(emp, day)`, `firstOvertimeName(employees)`. Cada una de esas llamadas invoca un **método**. También son métodos el `main` dentro del que vive cada ejemplo ejecutable y el `System.out.println` que llamas en [00-intro-java.md](00-intro-java.md). En este capítulo veremos cómo se escribe un método y cuál es el contrato que quien lo llama tiene que cumplir para que la llamada llegue a compilar. Ese contrato es la **interfaz** del método: su nombre, sus parámetros y su tipo de retorno. No la confundas con la palabra clave `interface` de Java, que es otra cosa y se explica en [07-interfaces-abstractas.md](07-interfaces-abstractas.md).

El capítulo empieza desmontando la declaración de un método y mostrando cuáles de sus partes comprueba el compilador en cada llamada. A continuación mira qué puede devolver un método, y qué pasa cuando un método se declara con `void` y no devuelve ningún valor. Después vienen las formas de llamar a dos métodos que tienen el mismo nombre pero que usan distintos argumentos. Al ver estas formas estudiaremos dos mecanismos distintos: la sobrecarga (_overloading_) y varargs. Al estudiar estos dos mecanismos veremos la regla que sigue el compilador para decidir qué método ejecuta una llamada cuando varios métodos comparten nombre. Más adelante llamas a métodos sobre un objeto y sobre una clase, y ves qué es un **paquete** (_package_), la carpeta a la que pertenece una clase, y cómo un `import` te permite usar una clase de otro paquete escribiendo solo su nombre, en lugar de su nombre completo, que lleva delante el paquete al que pertenece. Y cierra con un error que el compilador no puede detectar: pasar `null` como argumento a un método que necesita un valor real. Ese fallo solo aparece al ejecutar el programa, en runtime, así que verás dónde conviene comprobar ese `null`: al principio del método que lo recibe, para que el error salte ahí mismo y no más adelante en otra parte del código.

## Declaración de un método

> Docs: https://www.baeldung.com/java-method-signature-return-type → leer la página completa: es corta y deja claro exactamente qué partes de una declaración forman la signature

> **¿Dónde viven los métodos?** Los métodos siempre viven dentro de una clase: en Java no pueden existir fuera de una. Los explicamos aquí, antes de ver las clases completas, porque ya los has encontrado en los ejemplos de [03-flujo-de-control.md](03-flujo-de-control.md). La estructura completa de una clase (campos, constructores, métodos, encapsulación, etc.) se cubre en [06-poo-clases.md](06-poo-clases.md).

Un método es un bloque de código que realiza una tarea concreta y lleva un nombre que describe esa tarea. Lo defines una vez y lo llamas desde cualquier parte donde haga falta esa tarea.

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

Parámetro y argumento son dos palabras que se suelen confundir, pero en Java nombran cosas distintas. Un **parámetro** (_parameter_) es una variable que se declara entre los paréntesis de la declaración del método. En el `add` de arriba hay dos: `int a` e `int b`, es decir, el parámetro `a` y el parámetro `b`, los dos de tipo `int`. Un parámetro solo existe dentro de su método: el cuerpo de `add` puede usar los parámetros `a` y `b`, pero fuera de `add` esos nombres no significan nada. Es por su _scope_, la zona del código en la que existe una variable, que viste en [01-variables-tipos.md](01-variables-tipos.md): el scope de un parámetro es el cuerpo entero de su método. Un **argumento** (_argument_) es el valor real que le damos a un parámetro en el momento en que llamamos al método — el `3` y el `4` de `add(3, 4)`. Cuando la llamada se ejecuta, Java guarda cada argumento en el parámetro que ocupa su misma posición: en `add(3, 4)`, el primer argumento va al primer parámetro y el segundo al segundo, así que `a` vale `3` y `b` vale `4`. Tanto la palabra «parámetro» como «argumento» vuelven a aparecer más adelante en este archivo, y el compilador también usa las dos palabras en sus mensajes de error.

De las cuatro partes que forman la declaración de un método (el modificador de acceso, el tipo de retorno, el nombre del método y los parámetros), tres deciden cómo tiene que escribirse cada llamada: el nombre del método, la lista de parámetros y el tipo de retorno. Esas tres partes juntas son el **contrato** (_contract_) que quien llama al método tiene que cumplir, y el compilador lo comprueba llamada por llamada antes de que tu programa llegue a ejecutarse. La lista de parámetros fija cuántos argumentos debes entregar en el momento de la llamada y de qué tipo debe ser cada uno de esos argumentos. El nombre del método más esa lista de parámetros es lo que Java usa para localizar el método. Y el tipo de retorno decide qué se puede hacer con el resultado en el punto de la llamada. Si una de estas tres partes no es correcta en la llamada, entonces el archivo no compila. La cuarta parte, el modificador de acceso, también la comprueba el compilador, pero decide otra cosa: desde qué clases se puede llamar al método. Por eso no forma parte del contrato de la llamada, y se explica en [06-poo-clases.md](06-poo-clases.md). El ejemplo de abajo vuelve a las tres partes del contrato: muestra una llamada correcta y tres que no compilan porque no respetan la lista de parámetros o el tipo de retorno. Los mensajes de error nombran `Calculator` porque es la clase en la que viven estos ejemplos de `add`, que se muestra entera en la sección [Llamar a métodos](#llamar-a-métodos):

```java
public int add(int a, int b) { return a + b; }

add(3, 4);              // ✅ dos int, exactamente como se declaró
add(3);                 // ❌ error: method add in class Calculator cannot be applied to given types;
                        //    required: int,int   found: int   reason: actual and formal argument lists differ in length
add("3", "4");          // ❌ error: incompatible types: String cannot be converted to int
String s = add(3, 4);   // ❌ error: incompatible types: int cannot be converted to String
```

Lee las cuatro líneas como una sola regla vista desde cuatro ángulos: una llamada compila cuando los argumentos coinciden con la lista de parámetros en número y tipo, y cuando lo que hagas con el resultado coincide con el tipo de retorno. No se comprueba nada sobre los _valores_ — solo los tipos declarados, que es justo por lo que todos estos errores llegan antes de que el programa se ejecute.

> **La signature — la parte de un método que Java usa para identificarlo.** La **signature** (o **firma**) de un método es su nombre más el tipo y el orden de sus parámetros: `add(int, int)`. Los nombres de los parámetros no forman parte de ella, así que `add(int a, int b)` y `add(int x, int y)` tienen la misma signature: a Java solo le importa que haya dos `int`, y en ese orden. El tipo de retorno _no_ forma parte de la signature, y tampoco el modificador de acceso. Puede parecer un detalle menor, pero es exactamente la regla que decide qué método llama Java cuando varios comparten nombre (lo verás más abajo, en la sección [Sobrecarga de métodos (overloading)](#sobrecarga-de-métodos-overloading)) y qué método reemplaza una subclase (`08-herencia-polimorfismo.md`). Cada vez que este archivo diga "la signature", se refiere a esa huella de nombre más tipos de parámetros.

La sentencia `return` hace dos cosas a la vez: devuelve el valor a quien llamó al método y _sale del método de inmediato, ahí mismo_. Nada de lo que venga después del `return` se ejecuta: la siguiente línea en ejecutarse es la línea que llamaba al método, que continúa con el valor que el método haya devuelto. No siempre es obligatorio poner un `return` en el cuerpo (_body_) de un método: en un método que tenga un tipo de retorno `void` puedes no escribirlo, porque el método termina solo al llegar a su llave de cierre. En cambio, un método que declara un tipo de retorno que no sea `void` necesita un `return` en cada posible camino de salida, como verás justo después del ejemplo.

```java
public int add(int a, int b) {
    return a + b;
    System.out.println("done");   // ❌ error: unreachable statement
                                  //    el método ya finalizó en el return y nunca llegaría a ejecutar esta línea
}
```

Que `return` salga del método de inmediato también se puede aprovechar: puedes escribir un `return` antes del final del método para terminarlo antes de tiempo, en cuanto ya tienes el resultado. Lo verás en la sección [Tipos de retorno](#tipos-de-retorno). Lo que no puedes hacer es dejar un camino sin `return`: si declaras un tipo de retorno distinto de `void`, **todos** los caminos de salida del método deben devolver un valor de ese tipo. Si te olvidas de uno, el archivo no compila:

```java
public int getAgeOrZero(Integer age) {
    if (age != null) {
        return age;
    }
    // sin else, sin return aquí
}
// error: missing return statement
```

> **¿Por qué el compilador se niega en lugar de devolver 0 sin más?** Porque el método declara que devuelve un `int`, y quien lo llama cuenta con ello: si escribe `int x = getAgeOrZero(null);`, espera que `x` reciba un `int` calculado por el método. Si Java devolviera por su cuenta un valor cualquiera, por ejemplo `0`, `x` acabaría valiendo `0` sin que tú lo hubieras decidido, y el programa seguiría funcionando con un dato falso sin avisarte. Ese es exactamente el tipo de bug por el que existe el tipado estático. El compilador recorre cada rama y, al encontrar una que llega a la llave de cierre sin devolver nada, detiene la compilación. La solución es devolver algo también en ese camino, nunca quitar el tipo de retorno:
>
> ```java
> public int getAgeOrZero(Integer age) {
>     if (age != null) {
>         return age;
>     }
>     return 0;   // ✅ el camino que faltaba ahora también devuelve un int
> }
> ```
>
> Ahora `getAgeOrZero(null)` devuelve `0` y `getAgeOrZero(30)` devuelve `30`. La diferencia con lo que haría Java por su cuenta es que este `0` lo has escrito tú, a propósito, y el nombre del método ya avisa de que es lo que devuelve cuando no hay edad.

Dejando ya los caminos de salida, aquí tienes dos métodos más para practicar la lectura de las cuatro partes de una declaración: uno `void`, que no devuelve nada, y otro que devuelve un `double`:

```java
public void printName(String name) {
    System.out.println(name);
    // sin return — los métodos void no devuelven nada
}

public static double calculateTax(double price, double rate) {
    return price * rate;
}
```

> **Tres cosas visibles en esa declaración quedan deliberadamente fuera de este capítulo.**

> La primera es `public`. Es un **modificador de acceso**: la palabra que dice _quién tiene permiso para llamar_ al
> método. El conjunto completo (`public`, `private`, `protected` y no escribir ningún modificador de acceso) se resuelve en
> [06-poo-clases.md](06-poo-clases.md), porque la visibilidad solo se convierte en una decisión real una
> vez que una clase tiene un estado que merezca la pena ocultar, es decir, datos que guarda cada uno de sus objetos.

> La segunda es `static`, una palabra que
> verás en algunas declaraciones más abajo: cambia si llamas al método sobre un objeto o sobre el nombre
> de la clase, y también se explica en [06-poo-clases.md](06-poo-clases.md), por la misma razón.

> La tercera es qué recibe el método cuando le pasas un argumento. La respuesta corta es que siempre
> recibe una copia del valor del argumento, y por eso se dice que Java pasa los argumentos por valor (_pass-by-value_). Con un
> objeto, ese valor es su referencia, así que lo que se copia es la referencia, no el objeto entero. Es una pregunta típica de entrevista, y se
> explica en [05-modelo-de-memoria.md](05-modelo-de-memoria.md), junto con el stack y el heap, que hacen
> falta para entenderla. Hasta entonces, lee `public` como "llamable desde cualquier sitio" y `static` como "se
> llama sobre el nombre de la clase, no sobre un objeto". Eso es todo lo que este capítulo pide.

---

## Tipos de retorno

> Docs: https://www.baeldung.com/java-missing-return-statement → leer la página completa: cada ejemplo es una variante del error "no todos los caminos devuelven", que es la regla sobre la que se construye esta sección

La sección de la declaración mostró el tipo de retorno como una tercera parte del contrato de la llamada. Esta sección mira qué clases de tipo de retorno hay y qué entrega cada una a la línea que hizo la llamada. El tipo de retorno indica qué tipo de valor devuelve el método cuando termina. Si el método no calcula nada que devolver — simplemente hace algo — su tipo de retorno es `void`.

```java
public String getName() { return this.name; }   // devuelve un String
public int getAge() { return this.age; }         // devuelve un int
public boolean isActive() { return this.active; }// devuelve boolean — por convención, el nombre del método empieza con "is"
public void save(Employee e) { ... }             // no devuelve nada
public Employee findById(int id) { ... }         // devuelve un objeto de tipo Employee
public List<Employee> findAll() { ... }          // devuelve una colección donde cada elemento es un Employee
```

En estos ejemplos, `this.name` significa «el campo `name` del objeto sobre el que se ha llamado al método». Un campo es una variable que pertenece a un objeto y guarda uno de sus datos, como el nombre de un empleado. `this` es la palabra con la que Java se refiere a ese objeto. Los campos y `this` se explican a fondo en [06-poo-clases.md](06-poo-clases.md). Los cuerpos `{ ... }` se han omitido porque aquí solo importan los tipos de retorno.

Lee esa lista como tres grupos, no como seis líneas. `getAge()` e `isActive()` devuelven **primitivos**, así que quien llama a estos métodos recibe el valor en sí, un número o un `boolean`. `getName()`, `findById()` y `findAll()` devuelven **objetos** (`String`, `Employee`, `List<Employee>`), así que quien llama a estos métodos recibe una _referencia_ — la dirección de memoria de un objeto —, que es la misma distinción valor-frente-a-referencia que viste en [01-variables-tipos.md](01-variables-tipos.md). Eso significa que un objeto no se copia al devolverlo: `findById()` no te entrega un `Employee` nuevo, sino la dirección de un `Employee` que ya existe en la memoria. Dónde se guardan en la memoria los valores y los objetos, y qué se copia exactamente en cada llamada, se explica en [05-modelo-de-memoria.md](05-modelo-de-memoria.md). `void` no devuelve nada en absoluto, lo cual es una categoría aparte.

> **Un método `void` no devuelve ningún valor, pero al terminar la ejecución sigue en la línea que lo llamó.** Vale la pena ser precisos, porque "no devuelve nada" suena a que devuelve una especie de cosa vacía. No hay ningún valor en absoluto — ni `null`, ni un objeto vacío — así que la llamada es una _sentencia_, nunca una expresión de la que se pueda leer un valor:
>
> ```java
> printName("Ana");               // ✅ una línea completa: imprime "Ana" y no deja nada que guardar
> String s = printName("Ana");    // ❌ error: incompatible types: void cannot be converted to String
> ```
>
> La segunda línea intenta guardar en `s` el resultado de `printName`, pero no hay ningún resultado que guardar. Lo que sí pasa al terminar cualquier método, también uno `void`, es que la siguiente línea en ejecutarse es la que lo llamó. Por eso un método `void` también puede terminar antes de tiempo con un `return;` a secas, la sentencia que conociste en [03-flujo-de-control.md](03-flujo-de-control.md): no lleva ningún valor, pero termina el método en ese momento. En cambio, escribir `return something;` en un método `void` falla con `error: incompatible types: unexpected return value`.

> **Si un método devuelve un objeto, quien lo llama recibe una referencia a ese mismo objeto, no una copia, y puede modificarlo.** Por ejemplo, `getName()` es un método que devuelve el campo `name`, de tipo `String`, y un `String` es un objeto. Quien llama a `getName()` no puede cambiar ese nombre, porque un `String` es inmutable: una vez creado, ningún método puede modificar su texto, como viste en [02-cadenas-de-texto.md](02-cadenas-de-texto.md). Con una lista pasa lo contrario, porque una `List` sí es mutable: tiene métodos como `add()` que cambian su contenido. En el ejemplo de abajo, `members` es un campo de la clase `Team`. Al crear un objeto de esa clase (una _instancia_) con `new Team()` y guardarlo en la variable `team`, ese objeto tiene su propia lista `members`. `getMembers()` devuelve una referencia a esa lista, así que quien llama al método puede acceder a ella y modificarla desde fuera:
>
> ```java
> public class Team {
>     private List<String> members = new ArrayList<>();
>
>     public List<String> getMembers() {
>         return this.members;   // devuelve la referencia a la lista que guarda el propio objeto
>     }
> }
>
> Team team = new Team();
> team.getMembers().add("Ana");            // añade "Ana" a la lista que está dentro de team
> System.out.println(team.getMembers());   // [Ana]
> ```
>
> Aquí `return members;`, sin `this`, haría exactamente lo mismo: como ningún parámetro ni variable del método se llama `members`, Java entiende que hablas del campo. `this` solo se vuelve obligatorio cuando un parámetro tiene el mismo nombre que el campo, un caso que se explica en [06-poo-clases.md](06-poo-clases.md). En la llamada de abajo, `add("Ana")` no se ha llamado sobre una copia, sino sobre la misma lista que hay dentro de `team`, así que la lista del objeto ha cambiado sin que ningún método de `Team` haya decidido cambiarla. Controlar qué partes de un objeto se pueden leer o modificar desde fuera se llama **encapsulación**, y se explica en [06-poo-clases.md](06-poo-clases.md).

Como `return` termina el método en el momento en que se ejecuta, puedes usarlo para tratar primero los casos especiales. El método comprueba al principio si está ante uno de ellos y, si lo está, devuelve su resultado y termina ahí. Así, cuando la ejecución llega al trabajo normal del método, ya no se va a encontrar con casos especiales, y ese código no tiene que ir metido dentro de un `else`. Esta forma de escribir un método se llama **retorno anticipado** (_early return_, o _guard clause_), y la leerás en casi cualquier código real. Aparece sobre todo en los métodos de las clases de servicio de Spring Boot, que son las clases donde vive la lógica de negocio de una aplicación y que estudiarás en las notas de Spring Boot:

```java
// MAL — con cada condición nueva, el trabajo normal queda metido dentro de un if o de un else
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

// BIEN — resuelve primero los casos especiales y sale con return; el trabajo normal no queda metido dentro de ningún if ni else
public String describe(Employee e) {
    if (e == null) return "unknown";
    if (!e.isActive()) return e.getName() + " (inactive)";
    return e.getName() + " (active)";
}
```

Las dos compilan y las dos devuelven el mismo texto para cualquier valor de `e`, incluido `null`. La diferencia aparece cuando el método necesita comprobar algo más. En la primera versión, cada comprobación nueva añade otro `if` con su `else`, y el código que ya había queda metido dentro de él. En la segunda basta con añadir una línea más al principio, por ejemplo `if (e.getAge() < 18) return e.getName() + " (minor)";`, y el resto del método no cambia. Por eso la segunda se lee mejor: cada caso especial ocupa su propia línea, las líneas se leen de arriba abajo en el orden en que se comprueban, y para entender una de ellas no tienes que recordar dentro de qué `if` está. La segunda versión también deja ver a simple vista que cumple la regla que viste en la sección _Declaración de un método_: si un método declara un tipo de retorno distinto de `void`, todos sus caminos de salida deben devolver un valor de ese tipo. Su último `return` no está dentro de ningún `if`, así que se ejecuta siempre que la ejecución llega a esa línea, y ningún camino puede llegar al final del método sin haber devuelto un valor. Esto no significa que haya que evitar el `else` en general. Lo que sobra es el `else` que va detrás de un `if` que termina con `return`: si el `if` se cumple, el método ya ha terminado, así que el código que escribas después solo se ejecuta cuando el `if` no se cumple, exactamente igual que si estuviera dentro del `else`. Cuando ninguna de las dos ramas termina el método y las dos preparan un valor con el que el método sigue trabajando, el `else` sigue siendo la forma correcta de escribirlo, por ejemplo en `if (e.isActive()) { label = "active"; } else { label = "inactive"; }`.

---

## void vs Void

> Docs: https://www.baeldung.com/java-void-type → leer la página completa: es corta, y explica por qué `Void` no se puede instanciar y por qué `null` es su único valor posible

`void` (minúsculas) es una **palabra clave** de Java — significa que un método no devuelve nada:

```java
public void delete(Long id) { ... }  // no devuelve nada
```

`Void` (mayúsculas) es una **clase**, y aunque se parece a las clases wrapper que viste en [01-variables-tipos.md](01-variables-tipos.md), no es una de ellas. Se parece porque está junto a `void` igual que `Integer` está junto a `int`. No lo es porque un wrapper guarda un valor de su primitivo dentro de un objeto: por ejemplo, el valor `5`, que es un `int`, se guarda dentro de un objeto `Integer`. En cambio, `void` no tiene ningún valor que guardar. Su propia documentación la llama una "clase marcadora no instanciable" (_uninstantiable placeholder class_): nunca se puede crear un objeto `Void`, así que el único valor que puede guardar una variable de tipo `Void`, o devolver un método cuyo tipo de retorno sea `Void`, es `null`. Solo existe para poder escribir un tipo entre `<>` cuando no hay nada que devolver. Esos dos signos, `<` y `>`, se llaman _angle brackets_ en inglés y **corchetes angulares** en español. ¿Por qué es necesaria? Porque en algunos sitios Java te obliga a poner un tipo entre `<>`, y Java solo acepta ahí una clase, nunca un primitivo y nunca la palabra clave `void`. Es la misma regla que hizo que [01-variables-tipos.md](01-variables-tipos.md) escribiera `List<Integer>` y nunca `List<int>`; qué significan los `<>` es el tema de [09-genericos.md](09-genericos.md):

```java
ResponseEntity<Void>   // ✓ — Void es una clase
ResponseEntity<void>   // ✗ — void es una palabra clave, no válida dentro de < >
```

> **Para aclarar la confusión:** usa `void` (minúsculas) como tipo de retorno de un método. Usa `Void` (mayúsculas) solo cuando un genérico te obliga a poner un tipo entre los **angle brackets**, los `<>`. Por ejemplo, el método `delete` de tu proyecto TimeTrack, que verás un poco más abajo en esta misma sección, devuelve un `ResponseEntity<Void>`: el tipo entre `<>` indica de qué tipo es el cuerpo de la respuesta, y como esa respuesta no tiene cuerpo, no hay ningún valor que ocupe ese sitio. Por eso lo correcto es escribir `Void` entre los `<>`: el método sigue devolviendo un `ResponseEntity`, y `Void` dice que esa respuesta viaja sin cuerpo.
>
> Los dos se distinguen también por cómo tiene que terminar un método que los usa como tipo de retorno. Un método `void` no devuelve ningún valor, así que termina sin más al llegar a su llave de cierre. Si quieres que salga antes, puedes escribir `return;`, un `return` sin valor que solo termina el método. `Void`, en cambio, es una clase, así que el compilador le aplica la regla que viste en la sección _Declaración de un método_: todos los caminos de salida tienen que devolver un valor de ese tipo. Como nunca se puede crear un objeto `Void`, el único valor que el método puede devolver es `null`, así que un método `Void` tiene que acabar con un `return null;`, y no le sirve un `return;` sin nada después:
>
> ```java
> // void: no devuelve ningún valor, así que no necesita ningún return
> public void logDeletion(Long id) {
>     System.out.println("Deleted project " + id);
> }
>
> // Void: es una clase, así que hay que devolver un valor, y el único posible es null
> public Void logDeletionAsVoid(Long id) {
>     System.out.println("Deleted project " + id);
>     return null;
> }
> ```
>
> Si borras el `return null;` de `logDeletionAsVoid`, la compilación falla con el mismo error `missing return statement` que viste en la sección _Declaración de un método_. Si lo cambias por un `return;` sin valor, como el que escribirías en un método `void`, falla con `incompatible types: missing return value`, porque un `return` sin valor solo está permitido en un método `void`. Nunca vas a declarar un método `Void` por elección propia, porque `void` hace lo mismo sin obligarte a devolver nada. Lo vas a encontrar cuando un genérico fije por ti el tipo de retorno de un método, y entonces ese `return null;` es obligatorio.

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

A veces necesitas varios métodos que hacen la misma tarea con datos distintos: por ejemplo, sumar dos `int`, sumar dos `double` o sumar tres `int`. Si cada uno tuviera que llevar un nombre distinto, tendrías que crear los métodos `addInts`, `addDoubles` y `addThreeInts`, y cada persona que llame a estos métodos tendría que recordar cuál es cuál. Java permite que todos compartan el mismo nombre, `add`, porque lo que identifica a un método y permite distinguirlo de los demás es su signature, es decir, el nombre _más_ el número, el tipo y el orden de los parámetros, y no solo el nombre. Eso es la **sobrecarga** (_overloading_): que varios métodos compartan el mismo nombre pero tengan una signature distinta, para poder usar cada uno según los datos con los que trabajes. Ya has llamado a un método sobrecargado en [02-cadenas-de-texto.md](02-cadenas-de-texto.md): `String.valueOf`, que convierte en texto el valor que le pasas. `String` no tiene un único `valueOf`, sino una versión para cada tipo de valor que puede recibir: `valueOf(int)`, `valueOf(long)`, `valueOf(double)`, `valueOf(boolean)`, `valueOf(char)` y `valueOf(Object)`, entre otras. Todas se llaman igual, pero `String.valueOf(38)` ejecuta la versión que recibe un `int` y devuelve `"38"`, y `String.valueOf(true)` ejecuta la que recibe un `boolean` y devuelve `"true"`. Java elige la versión correcta según los argumentos que pasas:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
public int add(int a, int b, int c) { return a + b + c; }

add(1, 2);         // llama a la primera versión — devuelve 3
add(1.5, 2.5);     // llama a la segunda versión — devuelve 4.0
add(1, 2, 3);      // llama a la tercera versión — devuelve 6
```

Java decide qué versión llamar mirando los **parámetros** — su número, sus tipos y su orden. El tipo de retorno no cuenta para esa decisión, porque no forma parte de la signature. Si defines dos métodos con los mismos parámetros pero distinto tipo de retorno, Java no puede distinguirlos y el código falla en tiempo de compilación, antes incluso de que el programa se ejecute. Cuando escribes `add(1, 2)` nunca indicas un tipo de retorno, así que los parámetros son la única señal que Java tiene para poder distinguir los métodos.

```java
public int add(int a, int b) { return a + b; }
public double add(int a, int b) { return a + b; }   // ❌ mismo nombre, mismos parámetros
// error: method add(int,int) is already defined in class Calculator
```

### Qué sobrecarga gana cuando varias encajan

> 📖 Docs: [JLS §15.12.2 — Compile-Time Step 2: Determine Method Signature](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.2) → leer: los párrafos iniciales, hasta "The third phase allows overloading to be combined with variable arity methods" — la exposición oficial de las tres pasadas y de por qué se ejecutan en ese orden.

En los ejemplos de arriba, cada llamada tenía una versión de `add` cuyos parámetros eran exactamente los tipos de sus argumentos: `add(1, 2)` pasa dos `int`, y existía `add(int a, int b)`. Así que Java no tenía nada que decidir. Ahora imagina una clase en la que ninguna versión de `add` recibe dos `int`, pero existen estas tres:

```java
public long add(long a, long b) { return a + b; }
public int add(Integer a, Integer b) { return a + b; }
public int add(int... numbers) { ... }
```

La llamada `add(1, 2)` podría encajar en cualquiera de ellas, porque Java sabe convertir un `int` de tres formas: en un `long`, en un objeto `Integer`, o en un elemento de un array `int[]`, que es lo que significa `int...` (lo verás en la sección _Varargs — número variable de argumentos_ de este mismo archivo). Para elegir una, Java no busca a ojo la que más se parece. Prueba esas tres formas de una en una, siempre en el mismo orden, y se queda con la primera que funciona. Cada uno de esos intentos se llama **pasada**:

| Pasada | Qué intenta Java                                                                                                                    | Ejemplo que gana aquí   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 1      | Coincidencia exacta, o **widening** (ampliar) — un primitivo a uno más grande, o una referencia a un tipo más general como `Object` | `add(long, long)`       |
| 2      | **Boxing / unboxing** — envolver el primitivo en su clase wrapper                                                                   | `add(Integer, Integer)` |
| 3      | **Varargs** — recoger los argumentos en un array                                                                                    | `add(int...)`           |

Lee la tabla de arriba abajo como una lista de prioridad, no como tres opciones independientes: si en la pasada 1 encaja alguna versión de `add`, las pasadas 2 y 3 nunca se ejecutan, aunque en ellas también hubiera encajado otra versión. Así que, con `add(long, long)` y `add(Integer, Integer)` declaradas ambas, `add(1, 2)` llama a la versión **`long`** — widening le gana a boxing. Las dos conversiones las viste en [01-variables-tipos.md](01-variables-tipos.md): el widening, en la sección [Widening (automático)](01-variables-tipos.md#widening-automático), convierte un `int` en un primitivo más grande como `long` sin que escribas nada, y el boxing, en la sección [Autoboxing y unboxing](01-variables-tipos.md#autoboxing-y-unboxing), envuelve el `int` en un objeto `Integer`. El orden no es arbitrario, y no tiene que ver con la velocidad: boxing y varargs no llegaron hasta Java 5, así que el lenguaje los colocó en pasadas posteriores, lo que garantiza que toda llamada que ya compilaba antes de Java 5 siga funcionando, porque Java elige el mismo método que elegía antes. Toda la decisión ocurre en **tiempo de compilación**, únicamente a partir de los tipos declarados en el punto de la llamada.

Una misma pasada también puede encontrar varios candidatos a la vez. Con `add(long, long)` y `add(double, double)` declaradas ambas, `add(1, 2)` encaja en las dos en la pasada 1, porque un `int` se amplía a cualquiera de ellos. Java se queda entonces con la **más específica**: el candidato cuyos tipos de parámetro podrían pasarse todos al otro candidato. Un `long` se puede pasar donde se espera un `double`, pero no al revés:

```java
static void takesDouble(double d) { System.out.println(d); }
static void takesLong(long n) { System.out.println(n); }

takesDouble(5L);   // ✓ imprime 5.0 — Java convierte el long en double por su cuenta (widening)
takesLong(2.5);    // ❌ error: incompatible types: possible lossy conversion from double to long
```

Para meter `2.5` en un `long`, Java tendría que quitar el `.5`, y esa pérdida solo la hace si tú escribes el cast. Así que `add(long, long)` es más específica y gana. Es la misma regla que hizo que `String.valueOf(null)` en [02-cadenas-de-texto.md](02-cadenas-de-texto.md) eligiera `valueOf(char[])` en lugar de `valueOf(Object)`: todo `char[]` es un `Object`, pero no todo `Object` es un `char[]`.

El modo de fallo son dos candidatos en la misma pasada donde ninguno es más específico que el otro:

```java
static void add(int a, long b) { }
static void add(long a, int b) { }

add(1, 2);   // ❌ los dos encajan en la pasada 1, y ninguno es más específico:
             //    (int, long) no se puede pasar a (long, int), porque su segundo parámetro es long
             //    y un long no se puede pasar donde se espera un int sin escribir un cast;
             //    (long, int) no se puede pasar a (int, long) por lo mismo, en el primer parámetro
// error: reference to add is ambiguous
//   both method add(int,long) in Calculator and method add(long,int) in Calculator match
```

> **Cómo desatascar una llamada ambigua.** No elimines ninguno de los métodos. Lo que tienes que cambiar es la llamada: escribe los argumentos de forma que sus tipos coincidan exactamente con los tipos de los parámetros de una de las versiones. `add(1, 2L)` pasa un `int` y un `long`, porque la `L` final hace que `2L` sea un literal de tipo `long`. Esa llamada encaja en `add(int, long)` sin ninguna conversión, y no encaja en `add(long, int)`, porque su segundo parámetro es `int` y un `long` no se puede pasar ahí sin un cast. Así la pasada 1 encuentra un único candidato.
>
> Para entender por qué funciona, piensa que cada argumento que pasas a un método tiene dos cosas: un **tipo** y un **valor**. En `add(1, 2)`, los dos argumentos son de tipo `int`, y sus valores son `1` y `2`. Para elegir qué versión de `add` llama, Java solo tiene en cuenta los tipos de los argumentos, nunca sus valores. El motivo es que esa elección la hace el compilador, antes de que el programa se ejecute. En ese momento el compilador no puede contar con el valor de una variable, porque puede depender de lo que pase al ejecutar el programa, por ejemplo de lo que escriba el usuario. Del tipo, en cambio, está seguro, porque está escrito en la declaración de la variable. Así que, para Java, `add(1, 2)` es solo una llamada con un `int` y otro `int`, y por eso es ambigua. En cuanto uno de los argumentos tiene otro tipo, la elección cambia. Lo ves con dos variables de distinto tipo que guardan esos mismos números:
>
> ```java
> int x = 1;
> long y = 2;
> add(x, y);   // ✓ compila y llama a add(int, long)
> ```
>
> `add(x, y)` pasa los mismos números que la llamada ambigua `add(1, 2)`, y aun así compila, porque `y` está declarada como `long`. Que el `2` quepa de sobra en un `int` da igual: Java no mira el `2`, mira que `y` es un `long`.

> **Overloading vs overriding — no los confundas.** Suenan parecido y ambas hablan de "dos métodos con el mismo nombre", pero son ideas opuestas. **Overloading** (esta sección) es _una_ clase que define varias versiones de un método que se diferencian en sus parámetros — la elección se hace en tiempo de compilación según los argumentos que pasas. **Overriding** es una _subclase_ que reemplaza un método que heredó de su padre, manteniendo _exactamente los mismos_ parámetros, para cambiar el comportamiento — la elección se hace en tiempo de ejecución según el tipo real del objeto. Regla práctica: mismo nombre + parámetros distintos + misma clase = overloading; mismo nombre + mismos parámetros + subclase = overriding. Overriding se cubre en [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md).

---

## Varargs — número variable de argumentos

> Docs: https://www.baeldung.com/java-varargs → leer: "Use of Varargs" y "Rules"

Normalmente un método con dos parámetros exige exactamente dos argumentos. Varargs (`...`) te deja pasar cualquier cantidad en su lugar — cero, uno, cinco, tantos como quieras — y los recoge en un array internamente. Ya te has encontrado uno: [02-cadenas-de-texto.md](02-cadenas-de-texto.md) mostró que `.formatted()` se declara como `formatted(Object... args)`, que es la razón por la que acepta cualquier cantidad de valores, esos tres puntos son varargs.

```java
"Project %d deleted by %s at %s".formatted(7, "Ana", "10:42");
// devuelve: "Project 7 deleted by Ana at 10:42"
```

También lo verás en `String.format()` y en `log.info(...)`, un método de **SLF4J**, la librería de logging que Spring Boot incluye en cada proyecto. `log.info(...)` escribe en la consola una línea sobre lo que va haciendo la aplicación, y cada `{}` de su mensaje se sustituye, por orden, por los valores que pasas detrás. Para poder recibir cualquier número de valores, tiene una versión declarada con varargs: `info(String format, Object... arguments)`.

```java
log.info("Project {} deleted by {} at {}", 7, "Ana", "10:42");
// la línea que aparece en la consola termina en: Project 7 deleted by Ana at 10:42
```

La sintaxis es `Tipo... nombre`, y debe ser el **último** parámetro del método. La razón es que Java tiene que saber dónde termina la lista de longitud variable: si un parámetro fijo viniera después, Java no podría distinguir qué argumento pertenece a la lista varargs y cuál es el siguiente argumento fijo. El mismo razonamiento es lo que hace que solo se permita un parámetro varargs por método. Si pones el parámetro varargs en cualquier otro sitio, el código falla en tiempo de compilación. Por ejemplo, `void f(int... a, int b)` falla con `error: varargs parameter must be the last parameter`, mientras que `void f(int a, int... b)` sí compila.

Como el método no sabe de antemano cuántos valores le van a llegar, lo habitual es recorrerlos con un bucle, y por eso casi todos los métodos varargs tienen uno. Por ejemplo, en el siguiente código `sum` recorre los números con un for-each y va acumulando cada uno en `total`. El bucle no es obligatorio: como con cualquier array, también puedes leer una posición concreta con `numbers[0]`, siempre que haya llegado al menos un valor, o saber cuántos han llegado con `numbers.length`.

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

Dentro del método, `numbers` **es** un array. `int... numbers` e `int[] numbers` son el mismo parámetro en lo que respecta al cuerpo del método; el `...` solo cambia qué se permite escribir en el momento en que se llama al método. Java construye el array por ti en ese momento y te lo entrega. De ahí se siguen directamente dos consecuencias:

**Un array se puede pasar como argumento para el parámetro varargs.** Normalmente pasas valores sueltos, como en `sum(1, 2, 3)`, y Java los mete en un array nuevo. Pero hemos visto que un parámetro varargs es en realidad un array: en el ejemplo de `sum(int... numbers)` de esta misma sección, `numbers` es un `int[]`. Por eso un parámetro varargs también acepta como argumento un array ya creado. En ese caso Java no construye ningún array a partir del que le has pasado, sino que usa directamente el que le has pasado. No hace falta sacar sus valores uno a uno para pasarlos por separado:

```java
int[] scores = {1, 2, 3};
sum(scores);   // 6 — el array ES el parámetro varargs
```

**Una llamada sin argumentos te da un array vacío, nunca `null`.** Aquí está la trampa: parece que "no se pasó nada", así que el instinto es hacer un null-check. Java garantiza en su lugar un array de longitud `0`, que es por lo que el `for (int n : numbers)` de `sum()` de arriba simplemente se ejecuta cero veces y devuelve `0` cuando no le pasamos argumentos, en lugar de lanzar una excepción.

```java
sum();                       // 0 — numbers.length == 0
// numbers == null           // ❌ nunca es true; un null-check aquí es código muerto
```

> **¿Por qué un array vacío en vez de `null`?** Porque así el método siempre recibe un array, tanto si le pasas cero valores como si le pasas muchos, y puede recorrerlo de la misma forma en todos los casos. Si una llamada sin argumentos produjera `null`, cada método varargs tendría que abrir con un `if (numbers == null)` defensivo antes de poder recorrer el array, y olvidarlo significaría una `NullPointerException`. Entregar un array vacío hace que el caso sin argumentos sea el mismo camino de código que cualquier otro caso. `numbers` solo puede valer `null` si eres tú quien pasa un `null` en lugar del array. Por ejemplo, en `sum((int[]) null)` el `(int[])` indica que ese `null` ocupa el lugar del array entero. En ese caso el for-each de `sum` lanza una `NullPointerException`, porque el `null` lo ha puesto tu llamada. En código real nadie escribe `sum((int[]) null)` a propósito. Lo que sí te puedes encontrar es pasarle a `sum` una variable `int[]` que vale `null`, por ejemplo porque su valor venía de otro método que devolvió `null` en vez de un array:
>
> ```java
> int[] scores = null;   // la variable existe, pero no apunta a ningún array
> sum(scores);           // ❌ NullPointerException: numbers recibe ese null tal cual
> ```
>
> Java solo crea el array vacío cuando llamas sin argumentos, como en `sum()`. Una variable que vale `null` llega al método tal cual, igual que el `sum((int[]) null)` de antes, por lo que el for-each de `sum` lanza la `NullPointerException`.

### El mismo mecanismo en la librería estándar

> 📖 Docs: [Oracle Docs — Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → leer: "Arbitrary Number of Arguments" — tres párrafos, que terminan en la signature de `printf`, un tercer método construido sobre el mismo parámetro `Object...`.

Al principio de esta sección viste que `.formatted()` y `log.info(...)` aceptan cualquier número de valores porque están declarados con varargs. En la librería estándar de Java pasa lo mismo con otros dos métodos que vas a usar a menudo, `String.format()` y `List.of()`. Estas son sus declaraciones reales, y en las dos aparece el `...`:

```java
public static String format(String format, Object... args)   // java.lang.String
static <E> List<E> of(E... elements)                          // java.util.List
```

`String.format("Hi %s, you have %d messages", name, count)` compila en exactamente una llamada con dos argumentos: el `String` de formato, y un array `Object[]` que Java construyó en el momento de la llamada. Ese array tiene longitud 2 porque le hemos pasado dos valores, `name` y `count`. Con `List.of` pasa lo mismo, los elementos se meten en un array y se entregan como un único parámetro. Más abajo verás que eso solo ocurre a partir de cierto número de elementos. Por eso los dos aceptan cualquier cantidad de argumentos sin declarar cientos de versiones del mismo método.

> **`String.format()` y `.formatted()` dan el mismo resultado; lo que cambia es sobre qué los llamas.**
>
> ```java
> String.format("Project %d deleted by %s", 7, "Ana");   // "Project 7 deleted by Ana"
> "Project %d deleted by %s".formatted(7, "Ana");        // "Project 7 deleted by Ana"
> ```
>
> `String.format` se llama sobre la clase `String`, así que el texto con los `%d` y `%s` tiene que ir como primer argumento, y los valores van detrás, en el parámetro varargs. `.formatted()` se llama sobre el propio texto, así que solo recibe los valores, todos en su parámetro varargs. `.formatted()` llegó en Java 15 y hace el mismo trabajo que `String.format`, así que en código real verás los dos. Por qué uno se llama sobre la clase y el otro sobre un texto concreto (la diferencia entre un método `static` y un método de instancia) lo verás en [06-poo-clases.md](06-poo-clases.md).

> **En la declaración `static <E> List<E> of(E... elements)` hay que tener en cuenta que `List` y el `<E>` no son de este capítulo, aunque puedes leer la línea sin haber estudiado en profundidad estos conceptos.** `List.of` aparece aquí solo para mostrar el varargs de su declaración, `E... elements`. Qué es realmente una `List` llega en [10-colecciones.md](10-colecciones.md), y el `<E>` — un _type parameter_ (parámetro de tipo), es de [09-genericos.md](09-genericos.md). Por ahora lee `static <E> List<E> of(E... elements)` como "dale cualquier cantidad de elementos de un tipo y te devuelvo una lista con ellos".

`List.of` tiene un detalle que solo se entiende con las tres pasadas que viste en la sección [Sobrecarga de métodos (overloading)](#sobrecarga-de-métodos-overloading). En `List` no hay un solo método `of`, sino doce sobrecargas con ese nombre. Once reciben un número fijo de elementos, de cero a diez, y la duodécima es la versión varargs:

```java
static <E> List<E> of()                    // 0 elementos
static <E> List<E> of(E e1)                // 1 elemento
static <E> List<E> of(E e1, E e2)          // 2 elementos
// y así, una versión por cada número de elementos, hasta la de 10 (e1 a e10)
static <E> List<E> of(E... elements)       // cualquier número de elementos
```

¿Para qué tantas versiones, si la varargs sola ya aceptaría cualquier llamada?

Como vimos en la sección [Sobrecarga de métodos (overloading)](#sobrecarga-de-métodos-overloading), la resolución de sobrecargas solo llega a varargs después de que las pasadas 1 y 2 hayan fallado. Así que `List.of("a", "b")` encaja con `of(E e1, E e2)` en la pasada 1 y se queda ahí: `"a"` va directamente al parámetro `e1` y `"b"` a `e2`, sin que Java tenga que crear ningún array para meterlos, como haría con un varargs. Solo un `List.of` con once elementos o más llega hasta la versión varargs, y solo entonces Java crea un array con todos ellos. Crear un array gasta memoria y tiempo en cada llamada, así que las once versiones fijas existen para ahorrárselo a las llamadas cortas, que son las más habituales. Las pasadas, en cambio, no cuestan nada al ejecutar el programa: las hace el compilador una sola vez, al compilar, para decidir qué versión llama cada línea. Lo que se repite cada vez que se ejecuta la llamada es crear el array, y eso es lo único que estas versiones ahorran. Y como son las pasadas las que eligen la versión, tú escribes `List.of(...)` igual en todos los casos y no notas la diferencia de si se está usando una versión fija o la versión varargs.

> **Si a `List.of` le pasas un array que ya tienes, se usa la versión varargs y Java no crea otro array.**
>
> ```java
> String[] names = {"a", "b"};
> List<String> list = List.of(names);   // [a, b] — una lista con 2 elementos
> ```
>
> Funciona igual que `sum(scores)`: el parámetro varargs es en realidad un array, así que tu array encaja directamente y Java lo usa tal cual. Eso sí, `List.of` copia los elementos en la lista que devuelve, así que si después cambias `names[0]`, la lista sigue siendo `[a, b]`.
>
> En la práctica, si tienes valores sueltos, pásalos sueltos, como en `List.of("a", "b")`: con diez argumentos o menos no se crea ningún array. Meterlos antes en un array solo para llamar a `List.of` sería crear tú el array, y ahorrarse ese array es el motivo por el que existen las versiones fijas. Si el array ya lo tienes, pásalo directamente.

---

## Llamar a métodos

> 📖 Docs: [Baeldung — Methods in Java](https://www.baeldung.com/java-methods) → leer: "Calling a Method" — luego salta a [Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → leer: "Parameter Names", que es la regla de shadowing detrás de cada `this.name = name;` que estás a punto de ver.

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

En esta clase hay dos tipos de métodos: los métodos de instancia, que se declaran sin ninguna palabra especial, como `public int add(int a, int b)`, y los métodos estáticos, que usan la palabra clave `static` para declararlos, como `public static double square(double n)`. Cada uno se declara de un tipo u otro según los datos que usa:

- `add()` toca `this.name` y `this.history`. `this` es el objeto sobre el que se llama el método: en `calc.add(3, 4)`, `this` es `calc`, es decir, una instancia de la clase `Calculator`. Así que `this.name` y `this.history` son los campos de ese objeto. Los campos no se declaran en el constructor, sino arriba, en la clase (`private String name;` y `private List<String> history`), y cada objeto `Calculator` tiene los suyos propios. Los campos se suelen declarar `private`: así solo los métodos de la propia clase pueden leerlos o cambiarlos, y desde fuera se llega a ellos a través de métodos como `getName()`. Por qué esa es la norma lo verás en [06-poo-clases.md](06-poo-clases.md), con la encapsulación. Al crear el objeto, esos campos reciben su valor: `name` en el constructor, y `history` en su propia declaración, con `new ArrayList<>()`. Como `add()` necesita los campos de un objeto concreto, ya que usa `this` para acceder a ellos, _tiene_ que llamarse sobre una instancia de la clase, es decir, sobre un objeto `Calculator` ya creado. Por eso es un método de instancia.
- `square()` no toca nada más que su argumento, es decir, no le hace falta una instancia de la clase ni ningún objeto concreto, ya que tampoco usa ningún campo. Por eso se declara `static`: para poder usarlo directamente sobre la clase, como en `Calculator.square(5)`, sin crear ningún objeto.

Qué significa `static` en realidad, y por qué esa división es una decisión de diseño y no una cuestión de gusto, lo verás en [06-poo-clases.md](06-poo-clases.md). Aquí te basta con saber que `static` decide cómo se llama al método: sobre un objeto, como `calc.add(3, 4)`, o directamente sobre la clase, como `Calculator.square(5)`. Las dos formas aparecen en el código de más abajo. En el constructor, `this.name = name;` copia el parámetro `name` que recibe el constructor en el campo `name` del objeto (del objeto, no de la clase: cada objeto tiene el suyo).

> `List<String>` y `ArrayList` son la lista de longitud variable de Java — se cubren a fondo en [10-colecciones.md](10-colecciones.md). Por ahora léelo como "un array que puede crecer o decrecer". El método `add` de `history.add(...)` sirve para añadir un elemento al final de la lista. No es el `add()` de `Calculator`: es un método de la propia lista, que viene con `List` y `ArrayList`.

Así se llaman los métodos de `Calculator` desde fuera de la clase:

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

Eso último es **method chaining** (encadenamiento de métodos), que [02-cadenas-de-texto.md](02-cadenas-de-texto.md) ya usó sobre `String`: una llamada se puede encadenar a otra cuando la primera devuelve un objeto, de cualquier tipo, y la siguiente llamada tiene que ser un método que exista en ese tipo. La cadena se detiene cuando un método devuelve un primitivo, como un `int` o un `boolean`, porque los primitivos no tienen métodos, o cuando devuelve `void`, porque no queda nada sobre lo que llamar. Lo que hace posible la cadena es el tipo de retorno de cada método. Sigue el `result2` de arriba paso a paso:

1. `"  hello  ".trim()` devuelve un `String`: `"hello"`.
2. Como ese resultado es un `String`, se le puede llamar `.toUpperCase()`, que devuelve otro `String`: `"HELLO"`.
3. Sobre ese `String` se llama `.replace("HELLO", "HI")`, que devuelve `"HI"`.

Parece una sola operación, pero son tres llamadas, y cada una crea un `String` nuevo, porque un `String` es inmutable: sus métodos siempre devuelven un objeto `String` nuevo. El method chaining no es algo propio de `String`: cualquier método que devuelva un objeto se puede encadenar igual. Por ejemplo, `ResponseEntity.noContent().build()`, de la sección [void vs Void](#void-vs-void), funciona así.

---

## Paquetes e imports

> 📖 Docs: [Oracle Docs — Creating and Using Packages](https://docs.oracle.com/javase/tutorial/java/package/packages.html) → leer: la definición inicial — qué es un paquete y los tres trabajos que hace.
> 📖 Docs: [Oracle Docs — Naming a Package](https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html) → leer: "Naming Conventions" — por qué los nombres de paquete parten de un dominio de internet invertido.
> 📖 Docs: [Oracle Docs — Using Package Members](https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html) → leer: "Referring to a Package Member by Its Qualified Name", "Importing a Package Member" y "Name Ambiguities" — los tres casos de abajo, con las propias palabras del compilador.

Un método tiene un nombre. También tiene nombre la clase que lo contiene. En cuanto un proyecto crece, esos nombres empiezan a chocar: tu clase `User` y la clase `User` que trae alguna librería se llaman las dos de la misma manera, `User`, y Java tiene que poder distinguir una de la otra. Si no puede, el código no compila, porque Java no sabe a cuál de las dos clases te refieres. Ese es el problema que resuelven los **paquetes** (_packages_), y por eso todo archivo Java real abre con una línea `package`.

> **Ya has visto la línea `package` alguna vez.** [00-intro-java.md](00-intro-java.md) la explicó con el programa más pequeño que se puede ejecutar en Java. Un paquete es la carpeta a la que pertenece una clase, escrita con puntos en lugar de barras; es una forma de identificar la clase, de modo que dos clases con el mismo nombre pueden convivir; y eso convierte al paquete en un **namespace** (espacio de nombres), un ámbito en el que cada nombre identifica exactamente una cosa: dentro de un paquete, cada nombre de clase corresponde a una sola clase.
>
> Esta sección añade tres cosas que aquella primera explicación dejó fuera:
>
> 1. El **nombre completamente cualificado** de una clase (en inglés _fully qualified name_, abreviado a menudo como FQN, que es como lo oirás habitualmente): el nombre de la clase con el paquete al que pertenece delante, como `com.victor.timetrack.service.ProjectService`.
>    - El **`import`** es la forma de no tener que escribir ese nombre completo cada vez. Es una línea al principio del archivo, como `import com.victor.timetrack.service.ProjectService;`, que le dice a Java a qué clase te refieres cuando después escribes solo `ProjectService`.
> 2. Las clases que se usan sin ningún `import`, como `String`, porque Java importa su paquete, `java.lang`, en todos los archivos.
> 3. Qué hace el compilador cuando usas dos clases con el mismo nombre, como los dos `User` de arriba.

Recuerda cómo se escribe: la línea `package` es la primera línea de código del archivo, antes de la clase.

```java
package com.victor.timetrack.service;

public class ProjectService {
    public ProjectResponse getById(Long id) { ... }
}
```

El nombre real y sin ambigüedad de esa clase es ahora `com.victor.timetrack.service.ProjectService`. Java llama a eso el **nombre completamente cualificado** (_fully qualified name_): el paquete, que es `com.victor.timetrack.service`, el que se declaró en la primera línea; un punto; y el nombre propio de la clase, `ProjectService`. El `ProjectService` es su **nombre simple** (_simple name_). Los dos se refieren a la misma clase; el completamente cualificado es con el que Java trabaja realmente por dentro.

> **El prefijo `com.victor` es un dominio de internet escrito al revés.** Esta convención evita un problema concreto: que dos empresas u organizaciones creen, sin saberlo, un paquete con el mismo nombre. Tu código no se mezcla por sí solo con el de otras empresas: se junta con él cuando usas librerías. Spring, Jackson y el resto de librerías que añade tu proyecto son clases escritas por otras empresas u organizaciones, y al ejecutar la aplicación todas se cargan junto a las tuyas, en el mismo programa. Si una de esas librerías tuviera un paquete llamado `service` con una clase `ProjectService` dentro, igual que el tuyo, Java no podría distinguir una clase de la otra.
>
> La solución es empezar el paquete por algo que ya es único: un dominio de internet, porque cada dominio tiene un solo dueño. No hace falta tener comprado el dominio, porque Java no comprueba nada: en una empresa se usa el dominio de la empresa, y en un proyecto personal como TimeTrack basta con un nombre que sea tuyo y difícil de repetir, como `com.victor`. Solo si algún día publicas una librería para que la usen otros te pedirán demostrar que controlas ese nombre; para eso se suele usar el de tu cuenta de GitHub, como `io.github.vmnunez`. Y se escribe al revés, empezando por la parte más general:
>
> - `victor.com` → `com.victor`
> - `springframework.org` → `org.springframework`, en paquetes como `org.springframework.stereotype`
> - `fasterxml.com` → `com.fasterxml`, en paquetes como `com.fasterxml.jackson.databind`
>
> Al ponerlo al revés, los paquetes se ordenan de lo general a lo concreto: primero `com`, dentro `com.victor`, dentro `com.victor.timetrack`, y así sucesivamente.
>
> Es una convención, no una regla del compilador: `package banana;` compila sin problema, aunque podría llegar a dar problemas: si una librería también usara un paquete llamado `banana`, volverías al choque de nombres que esta convención evita. Por eso es la forma estándar de nombrar paquetes, y la verás en Spring, en Jackson y en prácticamente cualquier librería que añadas a un proyecto. La excepción son las clases que vienen con el propio Java, como las de `java.util`, que usan el prefijo `java.`, reservado para ellas.

### Cada parte del nombre del paquete es una carpeta

[00-intro-java.md](00-intro-java.md) ya te contó que la ruta de carpetas y el nombre del paquete siempre coinciden. Por ejemplo, la clase `ProjectService` está guardada en la carpeta `src/main/java/com/victor/timetrack/service/`, y por eso su primera línea es `package com.victor.timetrack.service;`. El `src/main/java/` del principio no forma parte del paquete: es la carpeta raíz donde Maven, la herramienta que compila el proyecto, busca todo el código Java. El nombre del paquete empieza a contarse desde dentro de esa carpeta. Qué es Maven y por qué usa esa carpeta lo verás en [17-maven.md](17-maven.md). Así se ven los nombres de los paquetes en el backend de TimeTrack, carpeta por carpeta:

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

**Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/` (el árbol de arriba, reducido a sus carpetas)

Lee la ruta y la declaración juntas: todo lo que va después de `src/main/java/` **es** el nombre del paquete, cambiando `/` por `.`. Fíjate también en que `dto.request` no es un paquete dentro del paquete `dto`, aunque su carpeta `request/` sí esté dentro de la carpeta `dto/`. Para Java son dos paquetes independientes: no hay anidamiento entre paquetes. Por eso una clase de `com.victor.timetrack.dto.request` que quiera usar una clase de `com.victor.timetrack.dto` tiene que importarla, igual que si estuviera en cualquier otro paquete. Aunque los puntos hacen que parezcan una jerarquía, para el compilador son dos nombres distintos que solo comparten el principio.

Romperás esa coincidencia la primera vez que muevas un archivo entre carpetas en el explorador de archivos de IntelliJ en lugar de hacerlo con un refactor. Digamos que arrastras `ProjectService.java` de `controller/` a `service/`, y su primera línea sigue diciendo:

```java
// el archivo ahora vive en .../timetrack/service/ pero su primera línea sigue diciendo:
package com.victor.timetrack.controller;
```

A partir de ahí, dos herramientas te avisan del problema, IntelliJ y el compilador, y cada una lo hace en un momento distinto. Este es el orden en que lo vas a ver:

1. **IntelliJ marca el archivo de inmediato**, con `Package name 'com.victor.timetrack.controller' does not correspond to the file path 'com.victor.timetrack.service'`.
2. **La compilación sigue funcionando en este punto.** Maven le entrega a `javac` cada archivo `.java` de `src/main/java/` por su ruta. Para saber a qué paquete pertenece una clase, `javac` lee la línea `package` del archivo y no mira en qué carpeta está guardado. Así que la clase sigue siendo `com.victor.timetrack.controller.ProjectService`, y todos los archivos que la importan con ese nombre siguen compilando.
3. **El compilador se queja si cambias el paquete de `com.victor.timetrack.controller` a `com.victor.timetrack.service` a mano.** Al hacerlo, todos los archivos que siguen importando el nombre antiguo fallan en su línea de import con `error: cannot find symbol`, y el `location: package com.victor.timetrack.controller` del mensaje muestra dónde buscó. La clase no ha desaparecido; simplemente ya no está con el nombre con el que esos archivos la buscan.

El **Refactor → Move** de IntelliJ (`F6`) existe precisamente para evitar eso: mueve el archivo, reescribe su línea `package` y reescribe todos los imports que lo referencian, en un solo paso.

> **Por qué la carpeta en la que se encuentra la clase sigue siendo importante si `javac` lee el paquete de la línea `package`.** Porque el compilador y la JVM buscan cada clase ya compilada en la carpeta que corresponde a su paquete.
>
> Todo empieza al compilar. Por cada clase que compila, `javac` genera un archivo `.class`, que es esa clase ya compilada, y lo guarda en la carpeta que indica su paquete. Por ejemplo, la clase `com.victor.timetrack.model.Project` se guarda en `target/classes/com/victor/timetrack/model/Project.class`. El `target/classes/` del principio es la carpeta en la que Maven deja todo lo que compila. No importa en qué carpeta estuviera `Project.java`: la carpeta del `.class` la decide siempre el paquete.
>
> Las clases de las librerías están guardadas de la misma forma. Una librería como Spring no llega a tu proyecto como código fuente, sino ya compilada, en archivos `.jar`. Un `.jar` es un archivo comprimido, parecido a un `.zip`, que contiene muchos archivos `.class` dentro de las carpetas de sus paquetes. Por ejemplo, el archivo real de `ProjectService` tiene esta línea de `import`:
>
> ```java
> import org.springframework.stereotype.Service;
> ```
>
> `org.springframework.stereotype.Service` pertenece a Spring, así que no está entre tus archivos `.java`. Su archivo `.class` está dentro de uno de los `.jar` de Spring, en `org/springframework/stereotype/Service.class`.
>
> Como todas las clases compiladas están guardadas así, para encontrar una basta con su nombre. Siguiendo con el mismo ejemplo, cuando `javac` compila `ProjectService` y llega a esa línea de `import`, hace lo siguiente con el nombre `org.springframework.stereotype.Service`:
>
> 1. Convierte el nombre en una ruta: cambia los puntos por barras y añade `.class` al final, y obtiene `org/springframework/stereotype/Service.class`.
> 2. Busca esa ruta en cada entrada del **classpath**, que es la lista de carpetas y archivos `.jar` en los que Maven le dice que hay clases compiladas.
> 3. La encuentra dentro del `.jar` de Spring, y con eso sabe que el nombre que usa `ProjectService` existe.
>
> La JVM encuentra las clases de la misma manera cuando las necesita al ejecutar el programa, y lo hace tanto con las tuyas como con las de una librería. Por ejemplo, para `com.victor.timetrack.model.Project` busca la ruta `com/victor/timetrack/model/Project.class` y la encuentra en `target/classes/`. Para `org.springframework.stereotype.Service` busca `org/springframework/stereotype/Service.class` y la encuentra en el `.jar` de Spring. Ni `javac` ni la JVM recorren todos los archivos hasta dar con la clase: van directamente a la ruta que sale de su nombre. Por eso la búsqueda sigue siendo instantánea en un proyecto con diez mil clases.
>
> Tu código fuente sigue la misma estructura por ese motivo, es decir, los nombres de los paquetes coinciden con la ruta de las carpetas en las que están los archivos `.java`, aunque `javac` no lo exija. Por ejemplo, `Project.java`, que es el archivo sin compilar, y `Project.class`, que es el compilado, tienen la misma ruta de carpetas, `com/victor/timetrack/model/`, y solo cambia la carpeta de la que parte cada uno:
>
> ```
> src/main/java/com/victor/timetrack/model/Project.java      ← código fuente
> target/classes/com/victor/timetrack/model/Project.class    ← clase compilada
> ```
>
> Así, quien busque una clase por su nombre sabe dónde está su código fuente, ya seas tú, IntelliJ o cualquier otra herramienta.

### Los imports — usar el nombre simple, resuelto en tiempo de compilación

Los _fully qualified names_ son correctos, pero son difíciles de leer. _Puedes_ escribir código con ellos, poniéndolos donde sea necesario usar una clase de otro paquete, y compila:

```java
// ✅ legal, pero difícil de leer, y no se va a escribir así
public java.util.List<com.victor.timetrack.dto.response.ProjectResponse> getAll() { ... }
```

Un **import** te deja usar el nombre simple de la clase en su lugar. Se escribe con la palabra `import`, seguida del _fully qualified name_ de la clase y de un punto y coma, por ejemplo `import com.victor.timetrack.dto.response.ProjectResponse;`. Con esto vas a poder usar el nombre simple de la clase, `ProjectResponse`, en el resto del archivo, sin tener que escribir `com.victor.timetrack.dto.response.ProjectResponse` cada vez. El import se coloca después de la línea `package`, que define el nombre del paquete en el que te encuentras, y antes de la clase. Esta es la apertura del mismo `ProjectService`, reducida a cinco de sus doce imports:

```java
package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    // ✅ el mismo método de antes: gracias a los imports de arriba, basta con escribir List y ProjectResponse
    public List<ProjectResponse> getAll() { ... }
}
```

**Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

> **Un `import` solo le sirve al compilador: no trae código a tu archivo ni cambia nada al ejecutar el programa.** Pensar lo contrario es el error más habitual con la palabra clave `import`, y viene de JavaScript. Allí, `import { x } from './y'` carga el código del archivo `./y` para que puedas usar `x`. El `import` de Java no carga nada. Solo le dice al compilador: "en este archivo, cuando escribo `ProjectResponse`, me refiero a `com.victor.timetrack.dto.response.ProjectResponse`". Al compilar, `javac` sustituye cada nombre simple por su _fully qualified name_, así que en el archivo `.class` ya no queda ninguna línea de import. De ahí salen tres consecuencias:
>
> - Un import que no se usa no hace más lento el programa. Solo es una línea que sobra.
> - `import java.util.*;`, que es la forma de importar todas las clases del paquete `java.util` con una sola línea, no carga ninguna de ellas. Solo te deja usar el nombre simple de cualquiera.
> - Borrar un import no cambia lo que hace el programa en runtime. Lo único que puede pasar es que el archivo deje de compilar.

Hay tres casos que no necesitan ningún import, y saber cuáles explica por qué `String` nunca te ha pedido uno:

| Caso                                        | Ejemplo                                                                                                                               | Por qué no hace falta import                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Clases de `java.lang`                       | `String`, `Integer`, `System`, `Object`, `Math`                                                                                       | Java importa `java.lang.*` en cada archivo automáticamente    |
| Clases en el **mismo paquete**              | `ProjectService` usa `AuthenticatedUserProvider` sin import, porque las dos clases están en el paquete `com.victor.timetrack.service` | Mismo namespace, así que el nombre simple ya es inequívoco    |
| Usar directamente el _fully qualified name_ | `java.sql.Date now = ...`                                                                                                             | Escribiste el nombre entero, así que no hay nada que importar |

La primera fila son las clases de `java.lang`, que son las que todos los programas usan, así que Java las importa por ti en todos los archivos. Por eso `System.out.println` y `Integer.parseInt` funcionan en un archivo sin imports. La segunda fila explica por qué `ProjectService` importa `Project` y `ProjectRepository` pero no `AuthenticatedUserProvider`: esa clase está en su mismo paquete, `com.victor.timetrack.service`. La tercera fila es el caso en el que escribes el _fully qualified name_ de la clase, como en `java.sql.Date now = ...`: Java ya sabe a qué clase te refieres al haberla escrito entera, así que no necesita ningún import. La siguiente sección, _Cuando dos clases comparten el mismo nombre simple_, explica en qué caso hace falta escribir el nombre entero.

### Cuando dos clases comparten el mismo nombre simple

Tarde o temprano necesitarás tanto `java.util.Date` como `java.sql.Date` en un mismo archivo. Si intentas importar las dos, el compilador rechaza el segundo import:

```java
import java.util.Date;
import java.sql.Date;   // ❌
// error: a type with the same simple name is already defined by the single-type-import of Date
```

Dentro de un archivo, el nombre simple siempre se refiere a una clase. Si dos de los nombres simples coinciden, como aquí con `Date`, el compilador no sabría a cuál de las dos clases te refieres al escribir `Date`, y por eso rechaza el segundo import. La solución es importar el que más uses y escribir el otro completo en los dos o tres sitios donde aparezca:

```java
import java.util.Date;

Date utilDate = new Date();                          // ✅ el importado
java.sql.Date sqlDate = new java.sql.Date(millis);   // ✅ completamente cualificado, sin ambigüedad
```

> **No es recomendable usar `import java.util.*;`, por el conflicto de nombres que acabamos de ver.** Un import terminado en `*` (en inglés _wildcard import_, que es como lo oirás habitualmente) te deja usar el nombre simple de todas las clases de ese paquete. Por eso puede generar conflictos: si importas así dos paquetes que tienen una clase con el mismo nombre, el compilador no sabe cuál de las dos quieres. Por ejemplo, `java.util` y `java.sql` tienen cada uno una clase `Date`:
>
> ```java
> import java.util.*;
> import java.sql.*;
>
> Date today = new Date();   // ❌ error: reference to Date is ambiguous
> ```
>
> El conflicto puede aparecer sin que tú cambies nada en el archivo: basta con que una librería añada, en una versión nueva, una clase con un nombre que ya usabas de otro paquete. Por defecto, IntelliJ escribe un import por cada clase que usas (`import java.util.List;`, `import java.util.Map;`), que es lo que el mensaje de error del primer ejemplo de esta sección llama _single-type import_. Solo los junta en un único `import java.util.*;` cuando el archivo usa cinco o más clases del mismo paquete, y ese umbral lo puedes subir en `Settings → Editor → Code Style → Java → Imports` (la opción _Class count to use import with '\*'_). La regla habitual es mantenerlos explícitos: de esta manera, el bloque de imports funciona también como un resumen honesto de lo que depende el archivo, que es lo primero que lees al abrir una clase que no conoces.

---

## `null`, `NullPointerException`, y dónde rechazar un argumento ausente en un método

> 📖 Docs: [Oracle Docs — `java.lang.NullPointerException`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/NullPointerException.html) → leer: la entrada de `getMessage()` y su "Implementation Note" — son dos frases, y es la declaración oficial de que el mensaje moderno se calcula por ti en lugar de escribirse a mano.
> 📖 Docs: [Oracle Docs — `java.util.Objects.requireNonNull(T, String)`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html) → leer: la entrada `requireNonNull(T obj, String message)` — "designed primarily for doing parameter validation in methods", que es exactamente el uso de más abajo.
> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → leer: las secciones iniciales sobre de dónde vienen los valores null y sobre cómo validar los argumentos de un método.

En [03-flujo-de-control.md](03-flujo-de-control.md), en la sección _if / else_, viste la comprobación de `null` (en inglés, _null check_, que es como lo oirás habitualmente). Consiste en preguntar si una variable es `null` antes de usarla:

```java
if (name != null) {
    System.out.println(name.toUpperCase());   // solo se ejecuta si name no es null
}
```

Si `name` vale `null`, la condición `name != null` da `false` y Java se salta el bloque entero, así que `toUpperCase()` nunca se llama sobre `null`. Sin el `if`, esa llamada detendría el programa con una `NullPointerException`, el error que explican los párrafos siguientes. [03-flujo-de-control.md](03-flujo-de-control.md) te enseñó a escribir esta comprobación, pero no en qué punto del programa hay que hacerla. Esa es la pregunta que responde esta sección: **¿dónde** hay que rechazar un argumento que llega como `null`? En la sección _Declaración de un método_ viste que el compilador comprueba en cada llamada que se cumple el contrato del método: su nombre, sus parámetros y su tipo de retorno. Pero no puede rechazar un argumento `null`, porque `null` es un valor válido para cualquier parámetro de tipo objeto. Por ejemplo, el parámetro de `printName` es un `String`, que es un tipo de objeto, así que `printName(null)` compila igual que `printName("Ana")`. Así que, cuando un método necesita de verdad un valor, la comprobación la tienes que escribir tú, y el resto de esta sección explica en qué método hay que ponerla.

Como mostró [01-variables-tipos.md](01-variables-tipos.md), `null` significa "esta referencia no apunta a ningún objeto". Es un valor válido para cualquier variable que guarda una referencia, es decir, la dirección en memoria de un objeto, como las variables de tipo `String`, `Project` o `Integer`, y las que guardan un array. En cambio, `null` no es un valor válido para una variable de tipo primitivo, que guarda directamente su valor y no una dirección de memoria. Por eso `int x = null;` no compila.

Que una variable valga `null` no es un error en sí. El error aparece cuando usas esa variable para llegar al objeto al que debería apuntar: por ejemplo, al llamar a un método sobre una variable que es `null` (`name.toUpperCase()`), al leer uno de sus campos o al leer una posición de un array (`numbers[0]`). Es decir, siempre que intentas hacer algo con el objeto al que se supone que apunta la variable. Para hacer cualquiera de esas cosas, la JVM va a la dirección de memoria que guarda la variable y trabaja con el objeto que hay allí. Esa operación se llama **desreferenciar** (en inglés, _dereference_). Si la variable vale `null`, no guarda ninguna dirección y no hay ningún objeto con el que trabajar, así que la JVM lanza una `NullPointerException`: el código esperaba un objeto y en realidad tenía un `null`.

```java
String name = null;
name.toUpperCase();   // ❌ NullPointerException en tiempo de ejecución — el archivo compila sin problema
```

> **¿Por qué esto es un fallo en tiempo de ejecución y no un error del compilador?** Porque el compilador rastrea _tipos_, no _valores_. Sabe que `name` es un `String`, y que `String` tiene un `toUpperCase()`, así que la llamada es correcta en cuanto a tipos y el archivo compila. Lo que no puede saber es cuál de los muchos caminos de tu programa llega realmente a esa línea, y con qué valor llega la variable. Por ejemplo, `name` podría ser el resultado de una petición a una base de datos, un campo del cuerpo de una petición HTTP, una búsqueda que no encontró nada, etc. Que una variable sea `null` o no depende de lo que pase al ejecutar el programa, no de su tipo, así que se comprueba en el momento en que se usa la variable. Y por eso nada en la sintaxis te avisa hasta que el programa se ejecuta y lanza la excepción.

### La `NullPointerException` salta donde se usa el `null`, no donde apareció

Lo difícil de una `NullPointerException` no es entender el error, sino encontrar de dónde viene el `null`. Un `null` puede pasar de un método a otro como argumento sin que nada falle: mientras el `null` solo se pase y no se use, no salta ningún error. La excepción salta en el primer método que lo usa, y ese método puede estar a varias llamadas de distancia del sitio donde apareció el `null`. En este ejemplo se puede ver esa distancia con solo tres métodos: `main` crea el `null` en la línea 9, `buildPage` lo recibe y se lo pasa a `slug` sin usarlo, y `slug` es el que falla en la línea 3, al llamar a `toLowerCase()` sobre él:

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

El **mensaje** responde _qué salió mal_: `Cannot invoke "String.toLowerCase()" because "title" is null` — el método que intentaste llamar, y la expresión exacta que era `null`. El **stack trace** de debajo responde _dónde estabas_: la lista de métodos que estaban en marcha, el más reciente primero, así que `slug` estaba corriendo, llamado desde `buildPage`, llamado desde `main`.

> **Cada línea del stack trace es un frame: una llamada a un método que había empezado y todavía no había terminado.** Cuando `main` llamó a `buildPage`, `main` no terminó — se quedó en pausa en la línea 10, esperando el resultado. A su vez, `buildPage` se quedó en pausa en la línea 6 mientras corría `slug`. Así que en el momento del crash había tres llamadas abiertas a la vez, y el stack trace las lista con la más reciente, `slug`, arriba y la más antigua, `main`, abajo. Por eso se dice que la línea 9, donde `main` crea el `null`, está dos frames más abajo que la línea 3, donde salta la excepción: en el stack trace hay que bajar dos llamadas, de `slug` a `buildPage` y de `buildPage` a `main`, que es el método donde está la línea 9. Cómo guarda la JVM esas llamadas en pausa — el call stack — es el tema de [05-modelo-de-memoria.md](05-modelo-de-memoria.md), y leer trazas largas con varias excepciones encadenadas es el de [11-excepciones.md](11-excepciones.md).

Ahora fíjate en la trampa. La línea de arriba del stack trace es `Report.java:3`, y esa línea no tiene nada de incorrecta — `slug` es un método perfectamente correcto al que le pasamos un valor `null` que no debíamos pasarle. El error se cometió en la línea 9, dos frames más abajo, y nada en el informe apunta ahí. En una aplicación real, entre el método donde aparece el `null` y el que lo usa puede haber muchas más llamadas, repartidas entre varias clases, y el archivo que aparece arriba del stack trace puede ser uno que no tenías ningún motivo para sospechar. Por eso, en un proyecto real, encontrar de dónde viene un `null` puede ser mucho más complicado que en este ejemplo.

> **Desde Java 15, el mensaje de la excepción dice qué método no se pudo llamar y qué valor era `null`.** En [01-variables-tipos.md](01-variables-tipos.md), en la sección _Autoboxing y unboxing_, viste un mensaje con esta misma forma al hacer unboxing de un `null`: `Cannot invoke "java.lang.Integer.intValue()" because the return value of "java.util.Map.get(Object)" is null`. Este tipo de mensaje apareció en Java 14, pero solo se mostraba si lo activabas con una opción al arrancar el programa. Desde Java 15 se muestra siempre, sin que tengas que hacer nada. Antes de Java 14, la primera línea decía exactamente `java.lang.NullPointerException` y nada más — sin nombre de método, sin variable — así que una línea con tres llamadas encadenadas no te daba forma de saber qué eslabón era null. El Java moderno recorre el bytecode de la instrucción que falló para saber qué expresión era `null`, y con eso construye un mensaje como el del ejemplo de `Report`: `Cannot invoke "String.toLowerCase()" because "title" is null`. Un matiz que vale la pena conocer: el nombre de la variable que aparece en el mensaje sale del archivo `.class`, y no siempre está ahí. Al compilar, `javac` solo guarda en el `.class` los nombres de los parámetros y de las variables locales si se lo pides con la opción `-g`, que añade lo que se llama información de depuración (en inglés, _debug information_, que es como lo oirás habitualmente). IntelliJ y Maven compilan con esa opción por defecto, así que normalmente verás el nombre real: `because "title" is null`. Si una clase se compila sin ella, la JVM no conoce el nombre `title`, solo sabe que es el primer parámetro del método, y el mismo fallo imprime `because "<parameter1>" is null`. El mensaje sigue diciendo qué valor era `null`, pero tienes que mirar tú la declaración del método para saber cuál es su primer parámetro.

### La solución: rechazar el valor ausente en la frontera que lo necesita

La solución no es llenar los métodos de comprobaciones `if (x != null)`. Si cada método se limita a saltarse su trabajo cuando recibe un `null`, el programa deja de lanzar la excepción, pero el error sigue ahí y ya nada te avisa de él. Por ejemplo, si `slug` comprobara `title` y devolviera `null` en lugar de fallar:

```java
static String slug(String title) {
    if (title == null) {
        return null;   // ❌ se salta su trabajo, pero el null sigue su camino
    }
    return title.toLowerCase().replace(' ', '-');
}
```

`buildPage` recibiría ese `null` y lo uniría con `+` a `"<h1>"` y `"</h1>"`. Al concatenar un `null`, Java escribe el texto `null`, así que la página mostraría `<h1>null</h1>`. El programa no falla, y nadie se da cuenta del error hasta que alguien ve la página. Por eso este resultado es peor que la excepción: la excepción, por lo menos, te avisa en el momento.

La solución es saber **dónde** rechazar el `null`. Un método que no puede hacer su trabajo sin un argumento debería decirlo nada más comenzar el método, antes de hacer cualquier otra cosa. Es lo que se conoce como **guard clause**, que ya viste en la sección [Tipos de retorno](#tipos-de-retorno). Esa comprobación va en el primer método que recibe el valor desde fuera y lo necesita para hacer su trabajo, es decir, el lugar por el que el valor entra en esta parte del código. En el ejemplo, las llamadas van de `main` a `buildPage` y de `buildPage` a `slug`. `main` crea el `null`, y `buildPage` es el primer método que lo recibe: es el punto de entrada público de esta pequeña funcionalidad, el que tiene el contrato que dice "dame un título y te doy una página". Si `buildPage` rechaza el `null` nada más comenzar, la excepción salta ahí y no más adelante, dentro de `slug`.

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

Con la comprobación en `buildPage`, el informe mejora en dos cosas. La primera es el mensaje: ahora es la frase que escribiste tú en `requireNonNull`, `title must not be null`, y dice directamente qué parámetro faltaba. Antes describía la llamada que había fallado dentro de `slug`, y tenías que deducir tú qué regla se había incumplido. La segunda es el stack trace. Su primera línea es `Objects.requireNonNull`. Justo debajo está `Report2.buildPage`, el método que necesitaba el título y recibió `null`. Y debajo de este está `Report2.main(Report2.java:13)`, la línea que le pasó ese `null` a `buildPage`. Es la misma llamada que la línea 10 de `Report`, porque `Report2` es lo mismo que `Report`, pero con tres líneas más: el `import java.util.Objects;`, una línea en blanco y la comprobación con `Objects.requireNonNull`. Lo que el stack trace nunca muestra es la línea que generó el `null`. Un stack trace solo muestra los métodos que no habían terminado cuando ocurre el fallo, y de cada uno, la línea en la que estaba en pausa, así que una línea que ya se había ejecutado no puede aparecer. Sin la comprobación, el stack trace te llevaba a `slug`, un método cuyo código estaba bien. Con la comprobación, te lleva directamente a la llamada que generó el fallo.

### Dos formas de comprobar que un argumento no es `null`

En el ejemplo has hecho la comprobación con `Objects.requireNonNull`, pero no es la única forma de escribirla: también puedes usar un `if (title == null) { ... }`. Esta sección explica qué hace exactamente `requireNonNull`, por qué normalmente se prefiere al `if` y dónde lo vas a encontrar en código real.

> **`Objects.requireNonNull(valor, "mensaje")` te devuelve `valor` si no es `null`, y si lo es, lanza una `NullPointerException` con tu mensaje.** Es un método `static` normal y corriente de `java.util.Objects` que recibe tu valor y un mensaje. Por ejemplo, en la línea de `buildPage`, `Objects.requireNonNull(title, "title must not be null")`, el valor es `title` y el mensaje es `"title must not be null"`. Si el valor no es `null`, te lo devuelve tal cual y la ejecución sigue como si esa línea no estuviera; si _es_ `null`, lanza la `NullPointerException` con tu mensaje como texto. Con esto ya puedes leer y escribir esta línea. Lo que pasa por dentro cuando Java lanza una excepción lo verás en [11-excepciones.md](11-excepciones.md): la palabra clave `throw`, qué es un objeto excepción, cómo la excepción va saliendo de un método a otro hasta que alguien la captura, y cuándo conviene capturarla. Hasta entonces, usa `Objects.requireNonNull` tal como aparece aquí, en una sola línea al principio del método.

> **¿Por qué preferirlo sobre `if (title == null) { ... }`?** Los dos hacen lo mismo: si `title` es `null`, lanzan una `NullPointerException` con tu mensaje y el método no sigue. Así se escribe cada uno:
>
> ```java
> // Con un if: tres líneas
> if (title == null) {
>     throw new NullPointerException("title must not be null");
> }
>
> // Con requireNonNull: una línea
> Objects.requireNonNull(title, "title must not be null");
> ```
>
> La palabra clave `throw` es la que lanza la excepción a mano, y se explica en [11-excepciones.md](11-excepciones.md). Aquí solo necesitas ver que el `if` hace lo mismo con más código. Aun así, normalmente se prefiere `requireNonNull`, por tres ventajas:
>
> 1. **Ocupa una línea en vez de tres.** Si un método tiene que comprobar cuatro parámetros, con `if` serían doce líneas; con `requireNonNull`, cuatro.
> 2. **Su nombre expresa su intención.** `requireNonNull` dice en el propio nombre del método lo que quiere hacer: exigir que el valor no sea `null`. Con un `if`, en cambio, tienes que leer la condición y su bloque para saber lo que quiere hacer.
> 3. **`requireNonNull` devuelve el valor.** Como el método te devuelve el mismo valor que le pasas, puedes comprobarlo y guardarlo en una variable en la misma línea:
>
> ```java
> String checkedTitle = Objects.requireNonNull(title, "title must not be null");
> ```
>
> Comprobar y guardar a la vez es la forma que más vas a encontrar en código real, sobre todo en los constructores, que guardan en el objeto los valores que reciben: `this.field = Objects.requireNonNull(field, "…");`. TimeTrack lo usa exactamente así:

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

> **Ese fragmento usa un constructor, que verás en [06-poo-clases.md](06-poo-clases.md).** Aquí solo fíjate en dónde está la comprobación de que el valor no es `null`: en la misma línea que guarda `field` en el objeto, así que el objeto nunca llega a guardar un `null`. `extends RuntimeException` y `super(message)` sirven para crear un tipo de excepción propio, y se explican en [11-excepciones.md](11-excepciones.md).

### Tres reglas para trabajar con `null` en los métodos

Ya has visto dónde y cómo comprobar que un argumento no es `null`. Estas tres reglas resumen qué hacer con un `null` en tus métodos: dónde rechazarlo, cuándo aceptarlo y qué devolver en su lugar.

1. **Si un método no puede hacer su trabajo sin un valor, comprueba que no es `null` en su primera línea.** Haz la comprobación con `Objects.requireNonNull` en el primer método que recibe el valor y necesita que no sea `null`. Así, si llega un `null`, el error salta en ese mismo método, con un mensaje que dice qué valor falta, y no más adelante en otro método. Además, los métodos a los que llama después ya no tienen que comprobarlo otra vez, porque nunca les va a llegar un `null`. En el ejemplo de esta sección, la comprobación está en `buildPage`, y por eso `slug` puede usar `title` directamente.
2. **Si un valor puede faltar sin que sea un error, no lo rechaces: decide qué hacer cuando falta.** Algunos valores son opcionales, como un segundo apellido o una descripción que nadie ha rellenado. Que lleguen como `null` es normal, así que si los rechazas con `requireNonNull`, el programa falla con datos que son correctos. En lugar de rechazarlos, comprueba si son `null` y trata ese caso para devolver una respuesta, como hace el método `describe` de la sección [Tipos de retorno](#tipos-de-retorno), que devuelve `"unknown"` cuando el empleado es `null`: `if (e == null) return "unknown";`.
3. **No devuelvas nunca `null` para decir que no hay resultado.** Si un método devuelve `null` cuando no encuentra nada, quien lo llama tiene que acordarse de comprobarlo antes de usar el resultado. Si se le olvida, la `NullPointerException` salta en su código, lejos del método que devolvió el `null`, que es el mismo problema que has visto en esta sección. Por eso, en lugar de `null`:
   - Si el método devuelve una lista, devuelve una lista vacía con `List.of()`. Así, quien llame al método puede recorrer el resultado con un `for` sin comprobar nada: si la lista está vacía, el bucle no se ejecuta ninguna vez y el programa sigue sin errores.
   - Si devuelve un solo valor que puede no existir, usa `Optional<T>` como tipo de retorno. Es un tipo que indica que el valor puede faltar y obliga a quien llama al método a decidir qué hacer en ese caso. Lo verás en [09-genericos.md](09-genericos.md), y los métodos que se usan con él, en [12-streams-lambdas.md](12-streams-lambdas.md).

   ```java
   return null;        // ❌ quien recorra el resultado con un for recibe una NullPointerException
   return List.of();   // ✅ una lista vacía: el for no da ninguna vuelta y nada falla
   ```

---

## Convenciones de nombres

> Docs: https://www.baeldung.com/java-naming-conventions → leer: "Method Naming Conventions" y "Variable Naming Conventions"
> Docs: https://www.baeldung.com/java-pojo-javabeans-dto-vo → leer: "JavaBeans" — la convención de la que depende el callout de abajo

Cuando lees una llamada como `employee.getName()`, del método solo ves su nombre y los argumentos que le pasas: no ves qué tipo devuelve ni qué código ejecuta. Por eso en Java los nombres de los métodos siguen unas convenciones fijas, para que el nombre te diga qué hace el método. Además, algunas librerías dependen de estas convenciones para funcionar, como verás un poco más abajo en esta sección. Estas son las convenciones:

- Nombres de métodos: se escriben en `camelCase`, es decir, con las palabras juntas, la primera en minúscula y cada una de las siguientes empezando por mayúscula (`calculateTotal`). Los nombres empiezan con un verbo, porque un método hace algo — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Getters booleanos: empiezan con `is` cuando preguntan si el objeto está en un estado o tiene una característica (`isActive()`, `isEmpty()`), y con `has` cuando preguntan si el objeto tiene algo (`hasRole()`, `hasChildren()`)
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`

> **Vista previa — tres librerías de Spring Boot que aparecen en el siguiente aviso.** El siguiente aviso, **La forma get/set/is no es una preferencia de estilo — las librerías la leen**, nombra tres librerías que aún no has estudiado: **Jackson**, que convierte objetos Java en JSON; **JPA** (_Jakarta Persistence API_, que antes se llamaba _Java Persistence API_), que guarda objetos Java como filas de una base de datos, junto con **Hibernate**, la implementación de JPA que usa Spring Boot; y **Lombok**, que escribe por ti métodos repetitivos en tiempo de compilación. Léelo para entender por qué la convención de nombres no es solo una cuestión de estilo: estas librerías buscan tus métodos por su nombre, así que si un método no se llama como ellas esperan, no lo encuentran. Usarás las tres en las notas de Spring Boot.

> **La forma get/set/is no es una preferencia de estilo — las librerías la leen.** Java tiene una convención con nombre propio, **JavaBeans**: una clase con un constructor sin argumentos cuyas propiedades se alcanzan mediante `getX()` / `setX()` / `isX()`. Importa porque las librerías principales localizan una propiedad _buscando exactamente esos nombres de método_ en tiempo de ejecución. Jackson convierte tu objeto en JSON encontrando `getName()` y publicando un campo `"name"` — renómbralo a `fetchName()` y el campo desaparece en silencio de la respuesta de la API. JPA puede hacer lo mismo, pero solo con una entidad cuyas anotaciones de mapeo estén sobre sus getters; el `Project` de TimeTrack pone `@Id` sobre el campo, así que Hibernate lee y escribe sus campos directamente. El `@Data` de Lombok, que usan los DTOs de TimeTrack, existe precisamente para generarte este boilerplate: `@Data class ProjectResponse { private String name; }` compila a una clase que ya trae `getName()` y `setName()`. Así que la convención es un contrato del que dependen herramientas como estas, y por eso romperla produce bugs que parecen magia.
>
> **Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/dto/response/ProjectResponse.java`

Esos getters y setters son tu primera pista de un patrón mayor: los métodos rara vez viven solos — envuelven los _campos_ de una clase y controlan cómo el mundo exterior los lee y los modifica. Ese acoplamiento entre campos y métodos, junto con los constructores, `static`, los modificadores de acceso que este capítulo ha ido aplazando, y la encapsulación, es el tema entero de [06-poo-clases.md](06-poo-clases.md), donde el `Calculator` que viste arriba se convierte en una clase completa con estado.

---

## Lo que esto desbloquea

Hasta el capítulo anterior podías leer una llamada; ahora puedes escribir el método que hay detrás y predecir si una llamada a él compila. En la práctica, ahora puedes:

- Leer una declaración y decir qué partes forman la signature, y por qué el compilador rechaza, antes de que el programa se ejecute, una llamada con el número o los tipos de argumentos equivocados, o con el resultado usado como un tipo equivocado.
- Decir qué devuelve a quien lo llama un método sin valor de retorno: control, sin ningún valor.
- Predecir qué sobrecarga elige una llamada, a partir de sus tres pasadas y de la regla de la más específica, y arreglar una llamada ambigua en el punto de la llamada.
- Escribir un parámetro `Type...`, sabiendo que debe ir el último y que llega al cuerpo como un array, vacío y no `null` cuando no se pasa ningún argumento.
- Leer un nombre completamente cualificado, y saber qué cambia un `import` y qué no cambia nunca.
- Rechazar un argumento `null` obligatorio al entrar en el método cuyo contrato lo necesita, para que el stack trace empiece en el frame cuyo contrato se rompió.

Antes de llegar a las clases hay un capítulo que responde a una pregunta que este dejó deliberadamente en el aire. Ahora conoces el **contrato** completo de una llamada: la signature que quien llama tiene que cumplir, qué sobrecarga gana cuando varias podrían encajar, qué recibe realmente un parámetro `Type...`, el nombre por el que se alcanza la clase, y dónde debe rechazarse un argumento obligatorio. Lo que no sabes es qué _cruza_ físicamente esa frontera cuando ocurre la llamada. Cuando escribes `buildPage(title)`, ¿se copia el `String`? Cuando un método recibe un `Project`, ¿se copia el objeto? ¿Dónde vive realmente el valor comprobado mientras `slug` está en marcha, y cómo sabe Java a qué línea volver cuando termina — la lista de llamadas abiertas que leíste en los dos stack traces de la sección de `null`? [05-modelo-de-memoria.md](05-modelo-de-memoria.md) abre la frontera del método y la dibuja: el stack y el heap, qué es una referencia, qué se copia dentro de un parámetro y qué no, y por qué "Java siempre es pass-by-value" es la frase que resuelve cualquier versión de ese argumento.
