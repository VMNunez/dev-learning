# Streams y Lambdas

> 📖 [Baeldung — Java 8 Streams](https://www.baeldung.com/java-8-streams)
> 📖 [Baeldung — Lambda Expressions](https://www.baeldung.com/java-8-lambda-expressions-tips)

---

## Dónde encaja esto en la historia

En el archivo 08 aprendiste a manejar los fallos: un método puede lanzar (`throw`) una excepción y algo más arriba en la pila de llamadas la captura. Aquello trataba de qué pasa cuando una única operación sale mal.

Casi todo lo demás que hace un backend real es justo lo contrario de una única operación — es *trabajo en bloque sobre una colección*. Rara vez tienes un solo empleado; tienes una `List<Employee>` y necesitas quedarte con los activos, extraer sus emails, ordenarlos o convertir cada uno en una forma distinta antes de enviarlo al frontend. Hacer eso con bucles `for` escritos a mano funciona, pero es ruidoso y la intención queda sepultada bajo el trabajo de gestión (listas temporales, variables de índice, bloques `if`).

Los streams y las lambdas son las herramientas de Java para exactamente esto: expresar "transforma toda esta colección" como una cadena corta y legible. Este archivo los construye desde cero — primero *por qué existen las lambdas*, luego *qué es un stream*, y por último el puñado de patrones que escribirás de verdad cada día.

---

## Por qué esto importa en Spring Boot

Abre cualquier servicio de Spring Boot y encontrarás streams y lambdas dentro de los primeros métodos. No son un tema avanzado que aprendes más adelante — son la forma por defecto de trabajar con datos en Java. Esto es lo que hace un método de servicio muy típico, paso a paso:

- **Trae las filas de la base de datos.** Un repositorio (el objeto que habla con la base de datos — lo estudiarás en las notas de Spring Boot) te devuelve una `List` de *entidades*. Una entidad no es más que un objeto Java normal que refleja una fila de la base de datos: una entidad `Project` tiene un campo `name` porque la tabla `projects` tiene una columna `name`. Así que "traer una lista de entidades" significa "obtener una `List<Project>` llena con las filas de la tabla".
- **Descarta las filas que no quieres** — por ejemplo, quédate solo con los proyectos activos.
- **Remodela cada fila** en un DTO, un objeto más pequeño que expone solo los campos que la API debe devolver (más sobre esto en la sección de DTO, más abajo).
- **O busca una fila concreta** por id, y si no está, lanza el tipo de excepción que viste en el archivo 08.

Cada uno de esos pasos se escribe con un *pipeline de stream* y una *lambda*. No te preocupes todavía por esas dos palabras — el propósito entero de este archivo es definirlas bien. Al final se leerán como lenguaje corriente. Empezamos por las lambdas, porque un stream se construye a partir de ellas.

---

## El problema que resuelven las lambdas

Una lambda es una forma de pasar **un trozo de comportamiento** — un pequeño bloque de código — a un método, igual que pasarías un número o una cadena. Esa es toda la idea. Normalmente el argumento que le pasas a un método son *datos* (`sort(list)`). Una lambda permite que el argumento sea *una acción* ("...y aquí tienes cómo comparar dos elementos mientras ordenas").

¿Y para qué necesitarías eso? Piensa en ordenar una lista. El método `sort` conoce el *algoritmo* para poner las cosas en orden, pero no conoce *tu* regla de cuál de dos elementos va primero — ¿por nombre? ¿por edad? ¿descendente? Esa decisión es tuya, así que tienes que entregársela a `sort`. Lo que le entregas es comportamiento: "dados dos elementos `a` y `b`, dime cuál va primero".

Antes de Java 8 no había una manera ligera de pasar comportamiento. Tenías que envolver esa única línea de lógica en una **clase anónima** entera — una clase sin nombre, escrita en línea solo para albergar un único método:

```java
// Forma antigua — una clase anónima cuyo único trabajo es albergar una regla de comparación
List<String> names = Arrays.asList("Luis", "Ana", "Victor");

Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);   // negativo si a < b, 0 si son iguales, positivo si a > b
    }
});
```

Lee eso de dentro hacia afuera. `Collections.sort` necesita una regla para comparar dos strings. La regla vive en el método `compare`, que devuelve un número negativo si `a` debe ir antes que `b`, cero si son iguales, y un número positivo si `a` debe ir después de `b` (ese es el contrato que sigue toda comparación en Java — `a.compareTo(b)` ya lo implementa para strings, alfabéticamente). Para entregar ese único método, la sintaxis antigua te obliga a escribir `new Comparator<String>() { @Override public int compare... }` — seis líneas de ceremonia alrededor de una sola línea de lógica real.

> **¿Por qué tanta ceremonia para una línea?** Porque antes de Java 8 la única forma de pasar código era pasar un *objeto*, y para hacer un objeto necesitas una *clase*. La lógica de `compare` tenía que ser un método, el método tenía que vivir en una clase, y como esa clase solo la usas una vez, la escribes en línea y sin nombre. Las cinco líneas de `new Comparator...` `@Override` `public int compare` son puro envoltorio — nada de eso es la regla que de verdad te importa.

Java 8 introdujo las **expresiones lambda** para quitar ese envoltorio. Una lambda es una función anónima — una función sin nombre que escribes en línea y pasas como un valor. La misma regla, en una línea:

```java
Collections.sort(names, (a, b) -> a.compareTo(b));
```

`(a, b) -> a.compareTo(b)` *es* la regla de comparación, y nada más. La flecha `->` la parte en dos mitades: a la izquierda, los parámetros que la función recibe (`a` y `b`, las dos strings que se comparan); a la derecha, el cuerpo — qué hacer con ellos y devolver. No nombraste la función, no escribiste `class`, y no escribiste `@Override`. Tampoco escribiste los tipos de `a` y `b`: Java mira dónde se está pasando la lambda (`Collections.sort` sobre una `List<String>`), ve que la comparación tiene que ser entre dos `String`, y rellena los tipos por ti. Esto se llama **inferencia de tipos**, y es la razón por la que las lambdas se mantienen cortas.

---

## Interfaces funcionales — la regla que hace funcionar las lambdas

Hay una sola regla detrás de las lambdas: una lambda solo se puede usar donde Java espera una **interfaz funcional** — una interfaz con *exactamente un método abstracto*. (Recuerda del archivo 05 que una interfaz es un contrato: una lista de firmas de métodos sin cuerpo. "Método abstracto" significa simplemente uno de esos métodos sin cuerpo que una implementación debe rellenar.)

La regla del único método es lo que hace posible la forma abreviada. Cuando solo hay un método que implementar, Java sabe *de qué* método es cuerpo tu lambda — no hay ambigüedad. `(a, b) -> a.compareTo(b)` solo puede ser el cuerpo de `compare`, porque `compare` es el único método que tiene `Comparator`.

Entonces, ¿qué es `Comparator<T>`? Es una interfaz funcional que **viene con Java** — no la escribes tú, vive en `java.util` y lleva ahí años. Su único método abstracto es `compare(T a, T b)`, la regla de "cuál de estos dos va primero" de la sección anterior. El `<T>` significa que funciona para cualquier tipo: `Comparator<String>` compara strings, `Comparator<Employee>` compara empleados. (La sintaxis `<T>` de ángulos son los *generics* — los estudiarás a fondo en [10-genericos.md](10-genericos.md); por ahora lee `Comparator<Employee>` como "un comparador para objetos `Employee`".) `Runnable` es otra interfaz funcional integrada — su único método es `run` — que es la razón por la que puedes pasar una lambda a cualquier sitio donde se espere un `Runnable`.

Casi nunca defines tu propia interfaz funcional. Lo que *sí* haces constantemente es pasar lambdas a métodos que ya piden una de las cuatro integradas de abajo. Cada una es simplemente una interfaz funcional con un único método, nombrada según la forma de ese método:

| Interfaz      | Su único método recibe… | …y devuelve  | La usas para…                           | Ejemplo de lambda         |
| ------------- | ----------------------- | ------------ | --------------------------------------- | ------------------------- |
| `Predicate<T>`  | un `T`                | `boolean`    | probar una condición (quedar / descartar) | `e -> e.isActive()`     |
| `Function<T,R>` | un `T`                | una `R`      | transformar un `T` en otra cosa         | `e -> e.getName()`        |
| `Consumer<T>`   | un `T`                | nada         | hacer algo con cada elemento            | `e -> System.out.println(e)` |
| `Supplier<T>`   | nada                  | una `T`      | producir un valor bajo demanda          | `() -> new Employee()`    |

Normalmente no escribirás tú estos nombres — los métodos de stream de las próximas secciones los piden internamente. Cuando escribes `.filter(e -> e.isActive())`, el parámetro del método `filter` es un `Predicate`, y tu lambda se convierte en su método `test`. Cuando escribes `.map(e -> e.getName())`, el parámetro de `map` es una `Function`, y tu lambda se convierte en su método `apply`. Esa es toda la conexión entre lambdas y streams: **cada operación de stream recibe una interfaz funcional, y tú la satisfaces con una lambda.**

> **Cómo leer la tabla:** las columnas "recibe / devuelve" son toda la personalidad de cada interfaz. Un `Predicate` devuelve `boolean`, así que encaja de forma natural para filtrar (quedarse con el elemento o no). Una `Function` devuelve un tipo *distinto*, así que encaja para transformar (convertir un `Employee` en un `String`). No memorizas los nombres — reconoces, cuando un método quiere "algo que devuelva un boolean por elemento", que quiere un `Predicate` y que una lambda servirá.

---

## Sintaxis de lambdas

La forma con flecha se dobla un poco según cuántos parámetros haya y cómo de largo sea el cuerpo. Estas son todas las formas con las que te vas a encontrar:

```java
// Sin parámetros — paréntesis vacíos a la izquierda
() -> System.out.println("Hello")

// Un parámetro — los paréntesis son opcionales, así que esto es común
name -> name.toUpperCase()

// Múltiples parámetros — paréntesis obligatorios
(a, b) -> a + b

// Cuerpo con múltiples líneas — llaves obligatorias, y debes escribir return explícitamente
(a, b) -> {
    int sum = a + b;
    return sum * 2;
}
```

Dos cosas en las que fijarte. Primera, cuando el cuerpo es una única expresión (las tres primeras), no hay llaves ni `return` — el valor de esa expresión se devuelve automáticamente. En el momento en que necesitas llaves (la última), estás escribiendo un cuerpo de método normal, así que debes hacer `return` explícitamente. Segunda, los tipos de los parámetros casi siempre se omiten, porque Java los infiere de la interfaz funcional a la que se está pasando la lambda (la inferencia de tipos de la primera sección). Solo los escribes en la rara ocasión en que el compilador no puede deducirlos.

---

## Method references — una lambda aún más corta

A veces una lambda no hace *nada por su cuenta* — simplemente reenvía su argumento directamente a un método existente y devuelve lo que ese método devuelva. Cuando eso es todo lo que hace, Java te deja soltar la lambda entera y nombrar el método directamente con `::`. Esa abreviatura es una **referencia a método** (method reference).

```java
// Lambda: toma cada nombre, y llama a System.out.println sobre él
list.forEach(name -> System.out.println(name));

// Method reference: "para cada elemento, llama a System.out.println" — lo mismo, sin código de relleno
list.forEach(System.out::println);
```

La regla, dicha con precisión: puedes usar una referencia a método **solo cuando el cuerpo entero de la lambda es una única llamada a método cuyo argumento es exactamente el parámetro de la lambda, pasado tal cual sin ningún cambio.** La lambda `name -> System.out.println(name)` recibe `name` e inmediatamente mete ese mismo `name`, intacto, en `println`. Como el parámetro solo pasa de largo, nombrar el método (`System.out::println`) dice todo lo que decía la lambda. Si la lambda altera el argumento primero, o llama al método sobre algo que no es el argumento, se rompe la regla del paso directo y debes mantener la lambda:

```java
// ✅ La method reference funciona — project entra directo a toResponse, sin cambios
.map(project -> toResponse(project))   // lambda
.map(this::toResponse)                 // method reference — idéntico

// ❌ Method reference imposible — project se transforma primero (.getName()), así que el
//    argumento NO pasa de largo sin cambios. Debe seguir siendo una lambda.
.map(project -> toResponse(project.getName()))
```

### Por qué los dos ejemplos parecen distintos: `System.out::println` vs `this::toResponse`

Estas dos referencias parecen distintas, y la razón es *dónde vive el método* — la parte antes de `::` es siempre aquello **sobre lo que** estás llamando al método:

- `System.out::println` — `println` es un método sobre el objeto `System.out` (la consola). Así que la referencia es `objeto::método`. Léela como "llama a `println` sobre `System.out`".
- `this::toResponse` — `toResponse` es un método privado sobre el objeto actual (`this` — la instancia del servicio dentro de la que estás). Así que la referencia es `this::método`, un caso especial de `objeto::método` donde el objeto es `this`. Léela como "llama a *mi propio* método `toResponse`".

Ambas son la misma categoría — *llamar a un método de instancia sobre un objeto concreto y ya conocido* — solo se diferencian en qué objeto (`System.out` vs `this`). No hay ningún salto entre ellas; son dos casos de la misma forma.

### Las cuatro formas, cada una mostrada primero como lambda

Una referencia a método siempre corresponde a alguna lambda — la lambda es lo que significa. Ver ambas lado a lado es la forma más rápida de leer un `::` con el que no te has topado antes: expándelo mentalmente de vuelta a su lambda.

**1. Método estático** — `NombreClase::método`. El método pertenece a la clase misma, no a un objeto.

```java
// Tienes una List<String> de números como texto y los quieres como Integers.
.map(s -> Integer.parseInt(s))   // lambda: toma s, llama al estático Integer.parseInt sobre él
.map(Integer::parseInt)          // method reference: lo mismo — parseInt es estático en Integer
```

**2. Método de instancia sobre un objeto conocido** — `objeto::método`. El objeto ya existe y es el mismo para cada elemento; solo cambia el argumento.

```java
// Imprime cada elemento en la consola. System.out es el único objeto fijo; cada elemento es el argumento.
.forEach(x -> System.out.println(x))   // lambda
.forEach(System.out::println)          // method reference
```

**3. Método de instancia llamado *sobre cada elemento*** — `NombreClase::método`. Esta es la enrevesada: se ve idéntica a la forma estática (`NombreClase::método`), pero aquí el elemento mismo es el objeto sobre el que corre el método, no un argumento.

```java
// Pon en mayúsculas cada string. No hay objeto fijo — cada elemento ES el objeto sobre el que corre toUpperCase.
.map(s -> s.toUpperCase())   // lambda: el parámetro s es el receptor de toUpperCase
.map(String::toUpperCase)    // method reference: "llama a toUpperCase sobre cada String"
```

> **`String::toUpperCase` vs `Integer::parseInt` — por qué la misma forma significa dos cosas distintas.** Ambas se leen `NombreClase::método`, y sin embargo una llama a un método estático (`parseInt`, que pertenece a la clase `Integer`) y la otra llama a un método de instancia sobre cada elemento (`toUpperCase`, que pertenece a cada objeto `String`). Java las distingue mirando el método real: `parseInt` está declarado `static`, así que el elemento se le pasa *a* él; `toUpperCase` no es estático, así que el elemento es la cosa *sobre* la que corre. No tienes que resolver esto a mano — pero explica por qué dos referencias que se ven iguales se comportan de forma distinta.

**4. Constructor** — `NombreClase::new`. Una referencia a un constructor, usada cuando cada elemento debe alimentar a `new`.

```java
// Convierte cada String de nombre en un nuevo Employee (asumiendo un constructor Employee(String name)).
.map(name -> new Employee(name))   // lambda
.map(Employee::new)                // method reference: "llama al constructor de Employee"
```

Aquí están las mismas cuatro en una tabla, ahora que ya se ha mostrado cada una:

| Forma                                  | Sintaxis            | Se lee como           | Lambda equivalente           |
| -------------------------------------- | ------------------- | --------------------- | ---------------------------- |
| Método estático                        | `NombreClase::método` | `Integer::parseInt`   | `s -> Integer.parseInt(s)`   |
| Método de instancia (objeto conocido)  | `objeto::método`    | `System.out::println` | `x -> System.out.println(x)` |
| Método de instancia (sobre cada elemento) | `NombreClase::método` | `String::toUpperCase` | `s -> s.toUpperCase()`       |
| Constructor                            | `NombreClase::new`  | `Employee::new`       | `n -> new Employee(n)`       |

En Spring Boot la que más escribirás es `this::toResponse` — forma 2, siendo el objeto `this` — porque mapear una entidad a un DTO es un método privado en el servicio y lo llamas una vez por elemento. Siempre que un `::` te confunda, expándelo a su lambda con esta tabla y se vuelve obvio.

---

## Qué es un stream

Un **stream** no es una estructura de datos — no almacena nada y no es "la lista". Es una *descripción de una secuencia de operaciones* que ejecutar sobre los elementos de una fuente (normalmente una `List`). Tomas una lista, abres un stream sobre ella, encadenas las operaciones que quieres, y al final pides un resultado; solo entonces Java recorre de verdad los elementos.

La cadena de operaciones se llama **pipeline** — la palabra es literal (una tubería). Los datos entran por un extremo, pasan por cada operación por turno, y un resultado sale por el otro extremo. Cada eslabón del pipeline o descarta algunos elementos, o los cambia, o los reordena, y entrega lo que queda al siguiente eslabón.

```
List<Employee>  ──►  filter  ──►  map  ──►  sorted  ──►  collect  ──►  List<String>
   (fuente)         (descarta    (convierte (pone en     (recoge      (resultado)
                     los          cada uno   orden)       en una
                     inactivos)   en su                   nueva
                                  nombre)                 lista)
```

Lee de izquierda a derecha: la lista fuente entra, `filter` tira los elementos que no pasan una prueba, `map` reemplaza cada elemento superviviente por algo derivado de él, `sorted` los reordena, y `collect` empaqueta los elementos finales en una lista real que puedes usar. Ese último paso es donde los datos salen del pipeline.

```java
List<Employee> employees = getEmployees();

List<String> activeNames = employees
    .stream()
    .filter(e -> e.isActive())
    .map(e -> e.getName())
    .sorted()
    .collect(Collectors.toList());
```

Línea por línea: `.stream()` abre el pipeline sobre la lista. `.filter(e -> e.isActive())` se queda solo con los empleados cuyo `isActive()` devuelve `true` (su lambda es un `Predicate` — devuelve un boolean). `.map(e -> e.getName())` reemplaza cada `Employee` restante por su nombre `String` (su lambda es una `Function` — devuelve un tipo distinto, así que a partir de este punto el pipeline lleva `String`, no `Employee`). `.sorted()` ordena esas strings alfabéticamente. `.collect(Collectors.toList())` termina el pipeline y recoge los resultados en una nueva `List<String>`.

El resultado es una `List<String>` completamente nueva. La lista original `employees` nunca se toca — un stream lee de su fuente pero no la modifica.

> **`.collect(...)` vs `.toList()` — qué significa siquiera "collect".** Dentro del pipeline los elementos están en movimiento; todavía no son una lista. El paso final tiene que *recogerlos* (collect) en un contenedor real. `.collect(Collectors.toList())` es la forma de propósito general de hacerlo: `collect` es la operación, y le entregas una *receta* (un `Collector`) que describe el contenedor a construir — `Collectors.toList()` para una lista, `Collectors.toSet()` para un conjunto, y así. Como "recoger en una lista" es tan común, Java 16 añadió un atajo, `.toList()`, que hace exactamente eso sin argumento de receta. Así que `.collect(Collectors.toList())` y `.toList()` producen los mismos elementos — la diferencia es solo que `.toList()` devuelve una lista **inmutable**, cubierta en la sección de DTO. Usa `.toList()` por defecto; recurre a `.collect(Collectors.toList())` cuando específicamente necesites una lista a la que aún puedas añadir o de la que puedas quitar.

> **Un stream se puede usar solo una vez.** Una vez que corre una operación terminal (el `.collect` / `.toList` del final), el stream queda *consumido* — ha empujado sus elementos a través y ha terminado. Intentar reutilizar la misma variable de stream para un segundo pipeline lanza `IllegalStateException: stream has already been operated upon or closed`. En la práctica esto nunca te muerde, porque casi siempre escribes el pipeline entero en una cadena que empieza desde un `.stream()` fresco. Pero explica por qué nunca guardas un stream en un campo y lo reutilizas — guardas la *lista* y llamas a `.stream()` de nuevo cada vez.

---

## Operaciones intermedias vs terminales

Las operaciones de un pipeline vienen en dos clases, y distinguirlas es lo que te permite leer cualquier cadena. La distinción es simplemente *qué devuelve cada operación*.

Una **operación intermedia** devuelve otro stream. Como te devuelve un stream, puedes llamar inmediatamente a la siguiente operación sobre él — por eso encadenan (`.filter(...).map(...).sorted()`). `filter`, `map` y `sorted` de arriba son todas intermedias. Esta primera tabla es un menú de las operaciones intermedias que puedes apilar entre abrir el stream y terminarlo:

| Operación                         | Qué hace                                                       |
| --------------------------------- | -------------------------------------------------------------- |
| `filter(predicate)`               | Mantiene solo los elementos donde la condición es verdadera    |
| `map(function)`                   | Transforma cada elemento en otra cosa                          |
| `sorted()` / `sorted(comparator)` | Ordena los elementos                                           |
| `distinct()`                      | Elimina elementos duplicados                                   |
| `limit(n)`                        | Mantiene solo los primeros `n` elementos                       |
| `peek(consumer)`                  | Inspecciona cada elemento sin cambiarlo — útil para depuración |

Una **operación terminal** *no* devuelve un stream — devuelve un resultado final (una lista, un número, un boolean, un `Optional`) o nada en absoluto. Se sienta al final de la cadena y es lo que hace que el pipeline se ejecute de verdad. Una vez que corre, el stream queda consumido (la regla de un solo uso de arriba). Esta segunda tabla es el menú de formas de *terminar* un pipeline — la mayoría de estas son nuevas para ti, así que trátala como una referencia a la que volver; las que usarás de inmediato son `collect`, `count` y `findFirst`:

| Operación                             | Qué produce                                           |
| ------------------------------------- | ----------------------------------------------------- |
| `collect(collector)`                  | Recoge elementos en una colección (List, Set, Map…)   |
| `forEach(consumer)`                   | Ejecuta una acción en cada elemento, no devuelve nada |
| `count()`                             | Devuelve el número de elementos como `long`           |
| `findFirst()`                         | Devuelve el primer elemento envuelto en un `Optional<T>` |
| `anyMatch(predicate)`                 | Devuelve `true` si al menos un elemento coincide      |
| `allMatch(predicate)`                 | Devuelve `true` si todos los elementos coinciden      |
| `noneMatch(predicate)`                | Devuelve `true` si ningún elemento coincide           |
| `min(comparator)` / `max(comparator)` | Encuentra el elemento más pequeño o más grande        |
| `reduce(identity, accumulator)`       | Pliega todos los elementos en un único valor          |

> **Las operaciones intermedias son perezosas (lazy) — no hacen nada hasta que una operación terminal lo pide.** Esta es la parte sorprendente. Cuando escribes `.filter(...).map(...)`, ningún filtrado y ningún mapeo ocurren en ese momento. Cada operación intermedia solo *registra* lo que quieres hacer y devuelve un stream que lleva ese plan registrado. Nada corre hasta que añades una operación terminal; en ese instante Java ejecuta el pipeline registrado entero en una única pasada sobre los elementos. La razón de este diseño es la eficiencia: como Java ve el plan completo antes de empezar, puede empujar cada elemento a través de *todos* los pasos de una vez en lugar de construir una lista intermedia desechable después de cada operación — y una operación como `limit(3)` puede parar pronto tras tres elementos en lugar de procesar la fuente entera. Un pipeline sin operación terminal es código muerto: compila, pero ni un solo elemento se toca jamás.

---

## `reduce` — plegar un stream en un único valor

Los streams de `int` o `double` tienen un `.sum()` incorporado. Un `Stream<BigDecimal>` no lo tiene — `BigDecimal` es una clase normal, no un primitivo, así que Java no tiene ninguna noción automática de "suma estos objetos". `BigDecimal` se usa en vez de `double` precisamente *porque* `double` pierde precisión con los decimales (la misma trampa `0.1 + 0.2 != 0.3` que quizá ya conoces de JavaScript), algo inaceptable para dinero u horas facturables — pero el precio de esa precisión es perder el `.sum()` gratuito de los streams primitivos. `reduce` es la herramienta general que llena ese hueco: pliega todos los elementos en un único resultado, y tú le dices exactamente **cómo** combinarlos.

```java
BigDecimal approvedHours = entries.stream()
    .filter(e -> e.getStatus() == EntryStatus.APPROVED)
    .map(TimeEntry::getHours)
    .reduce(BigDecimal.ZERO, BigDecimal::add);
```

`reduce(identity, accumulator)` recibe dos argumentos:

- **`identity`** — el valor de arranque, lo que "llevas acumulado" antes de mirar el primer elemento. Para una suma tiene que ser el elemento neutro de la suma, `BigDecimal.ZERO` (para un producto sería `BigDecimal.ONE` en su lugar — el valor que, al combinarse, no cambia nada).
- **`accumulator`** — una función que combina "lo que llevas acumulado hasta ahora" con "el elemento actual" para dar el nuevo valor en curso. `BigDecimal::add` es la method reference del propio método `.add(BigDecimal otro)` de `BigDecimal` — `reduce` lo llama como `acumulado.add(elemento)` en cada paso.

**Trazado a mano**, sobre tres valores `BigDecimal` `[4.00, 21.00, 6.00]` (las horas de tres entries `APPROVED`):

```
acumulado (inicio) = BigDecimal.ZERO        → 0.00

paso 1: acumulado = acumulado.add(4.00)   →  0.00.add(4.00)   = 4.00
paso 2: acumulado = acumulado.add(21.00)  →  4.00.add(21.00)  = 25.00
paso 3: acumulado = acumulado.add(6.00)   →  25.00.add(6.00)  = 31.00

resultado final: 31.00
```

> Es exactamente la misma forma que el bucle con variable acumuladora que ya conoces — `reduce` es solo el nombre que le da el stream:
> ```java
> BigDecimal total = BigDecimal.ZERO;
> for (BigDecimal hours : listaDeHoras) {
>     total = total.add(hours);
> }
> ```
> `reduce(identity, accumulator)` es `total = identity`, y luego `total = accumulator.apply(total, elemento)` una vez por elemento, con el bucle en sí escondido dentro de la maquinaria del stream.

> **¿Por qué no la sobrecarga de un solo argumento, `reduce(accumulator)`?** Existe (la ves en la familia que devuelve `Optional`, en la siguiente sección), pero no tiene ningún `identity` al que recurrir, así que devuelve `Optional<BigDecimal>` — vacío si el stream tenía cero elementos, porque no hay nada que combinar. La forma de dos argumentos que usaste arriba evita eso: `BigDecimal.ZERO` **es** la respuesta correcta para "la suma de nada", así que puede devolver un `BigDecimal` normal en vez de un `Optional`, nunca vacío, sin necesitar un `orElse(...)` después. Prefiere la forma de dos argumentos siempre que tu valor `identity` sea una respuesta genuina y con sentido para "no pasó nada" — suma y conteo cumplen esto; "el máximo de una lista vacía" no, por eso `max()` sigue devolviendo `Optional`.

Este patrón exacto — `filter` por un status de enum, `map` al campo que te interesa, `reduce` a un único `BigDecimal` — es el código real detrás de `ReportService.getSummary()` en el proyecto 07: `approvedHours` y `pendingHours` son cada uno un pipeline `filter → map → reduce`, diferenciándose solo en qué `EntryStatus` se queda el `filter`.

---

## Optional — el resultado "quizá vacío"

Algunas operaciones pueden honestamente volver con *nada*. Si buscas en una lista el primer empleado con un id dado y ningún empleado lo tiene, no hay valor que devolver. En la mayoría de los lenguajes ese hueco se rellena con `null`, y olvidar comprobar el `null` es la fuente más común de fallos. La respuesta de Java es `Optional<T>`: una pequeña caja que o bien contiene un valor o bien está explícitamente vacía, y que *te obliga en tiempo de compilación a decir qué pasa en el caso vacío* antes de poder tocar el valor.

La sección lleva el nombre de `Optional` porque es el tipo que devuelven estas operaciones de "quizá no encuentren nada", y `findFirst()` es la primera con la que te topas — pero no es la única. `findAny()`, `min()`, `max()` y `reduce()` (la forma de un solo argumento) devuelven todas `Optional<T>` por la misma razón: podrían llamarse sobre un stream vacío, o no encontrar coincidencia, y no habría elemento que devolver. Cualquier cosa que devuelva *un elemento que podría no existir* lo devuelve envuelto en un `Optional`.

`findFirst()` es una operación terminal: ejecuta el pipeline y devuelve el **primer elemento que sobrevivió** a todas las operaciones anteriores, envuelto en `Optional<T>`. Recurres a él cuando quieres un único resultado de un stream — el caso clásico es "encuentra el único elemento que cumple una condición", así que casi siempre viene justo después de un `filter` que estrecha el stream hasta las coincidencias. En el ejemplo de abajo el pipeline se queda solo con el empleado cuyo id es igual a `targetId`, luego `findFirst()` saca esa única coincidencia (o un `Optional` vacío si el filtro no dejó nada):

```java
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))   // estrecha hasta el/los empleado(s) que coinciden
    .findFirst();                               // toma el primero — puede estar vacío

// Decidir qué hacer con la caja:
found.isPresent();                     // true si hay un valor dentro
found.get();                           // saca el valor — LANZA si está vacío, así que solo tras isPresent()
found.orElse(null);                    // dame el valor, o null si está vacío
found.orElseThrow(() -> new EmployeeNotFoundException(targetId));  // valor, o lanza si está vacío
```

> **`Optional` te obliga a manejar el caso vacío.** Con un resultado `null` plano nada te impide llamar a `found.getName()` sobre un valor que nunca se asignó — el fallo llega más tarde, en tiempo de ejecución, como un `NullPointerException`. `Optional` cierra ese hueco por construcción: el valor está *dentro* de la caja, y cada forma de abrir la caja (`get`, `orElse`, `orElseThrow`, `isPresent`) te hace declarar, ahí mismo, qué hace el caso vacío. No puedes saltarte la comprobación por accidente, porque no hay valor que alcanzar hasta que abres la caja. Ese es el propósito entero del tipo.

En los servicios de Spring Boot la última línea es el patrón que escribirás constantemente — `repository.findById(id).orElseThrow(...)` — "encuentra la fila por id, o lanza la excepción de no encontrado del archivo 08". `orElseThrow` es el puente natural entre "esto podría estar vacío" y "entonces esta petición debería fallar con un 404".

---

## Patrones comunes que escribirás cada día

Estos son los pipelines de stream a los que recurrirás más en un servicio Spring Boot. Un par usan métodos introducidos solo aquí, así que se señalan en línea; todo lo demás se ha construido arriba. Las referencias a método (`Employee::isActive`, `Employee::getEmail`) son la forma corta de la sección de method references — cada una equivale a una lambda como `e -> e.isActive()`.

```java
List<Employee> employees = getEmployees();

// Filtrar y recoger — quédate con los activos
List<Employee> active = employees.stream()
    .filter(Employee::isActive)
    .collect(Collectors.toList());

// Transformar a un tipo distinto — una lista solo de los emails
List<String> emails = employees.stream()
    .map(Employee::getEmail)
    .collect(Collectors.toList());

// Contar coincidencias — cuántos admins
long adminCount = employees.stream()
    .filter(e -> e.getRole().equals("admin"))
    .count();

// Comprobar si alguno coincide — ¿hay al menos un admin?
boolean hasAdmin = employees.stream()
    .anyMatch(e -> e.getRole().equals("admin"));

// Encontrar uno por id — devuelve Optional, manejado con orElseThrow (ver la sección Optional)
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))
    .findFirst();

// Ordenar por un campo
List<Employee> sorted = employees.stream()
    .sorted(Comparator.comparing(Employee::getName))
    .collect(Collectors.toList());

// Sumar un campo numérico
int totalAge = employees.stream()
    .mapToInt(Employee::getAge)
    .sum();
```

Dos de estos usan algo nuevo:

**`Comparator.comparing(Employee::getName)`** construye un comparador sin escribir a mano el `(a, b) -> ...` de dos argumentos. Como vimos en la primera sección, un comparador era "dados `a` y `b`, decide cuál va primero". Casi siempre esa decisión es "compáralos *por algún campo*" — por nombre, por edad. `Comparator.comparing` es un ayudante que construye exactamente eso: le das *cómo extraer el campo* (`Employee::getName`, "obtén el nombre de cada empleado") y devuelve un `Comparator` completo que ordena los empleados por ese campo. Así que `.sorted(Comparator.comparing(Employee::getName))` se lee como "ordena por nombre", y es mucho más limpio que deletrear `(a, b) -> a.getName().compareTo(b.getName())`.

**`.mapToInt(Employee::getAge).sum()`** es cómo totalizas un número a lo largo de un stream. Un `Stream<Employee>` normal no tiene `.sum()` — sumar solo tiene sentido para números, y el stream contiene empleados. `mapToInt` convierte el stream en un `IntStream`, un stream especializado de valores primitivos `int` (aquí, la edad de cada empleado). Como un `IntStream` tiene garantizado contener números, *sí* ofrece terminales numéricas como `.sum()`, `.average()` y `.max()`. Así que los dos pasos se leen como "saca cada edad como un int, luego súmalas todas". La misma idea te da `mapToLong` y `mapToDouble` para los otros tipos numéricos.

---

## Agrupar y unir — Collectors que construyen más que una lista plana

`collect` puede construir mucho más que una lista. Le pasas una receta `Collector` distinta y ensambla un resultado distinto. Estas dos aparecen constantemente en servicios reales:

```java
// Agrupar elementos en un Map, indexado por un campo
Map<String, List<Employee>> byDepartment = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// Unir los nombres en una sola string con un separador
String names = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.joining(", "));
// resultado: "Victor, Ana, Luis"
```

**`Collectors.groupingBy(Employee::getDepartment)`** reparte los elementos en cubos. Le das una función que extrae una clave de cada elemento (el departamento), y devuelve un `Map` donde cada clave apunta a la *lista* de elementos que la comparten — así que `Map<String, List<Employee>>` se lee como "para cada nombre de departamento, la lista de empleados que hay en él". Es la forma stream de escribir "agrupa estas filas por la columna X", que reconocerás si has escrito `GROUP BY` en SQL.

**`Collectors.joining(", ")`** funciona solo sobre un stream de strings (de ahí el `.map(Employee::getName)` primero) y las pega en una sola string con el separador que le des — la herramienta de cada día para convertir una lista en una línea legible `"a, b, c"`.

---

## Mapeo de entidad a DTO — el patrón que usarás en cada servicio

> **Vista previa — Spring Boot:** Esta sección usa `projectRepository`, `ProjectResponse` y patrones de servicio de Spring Boot que aún no has estudiado. Léela para ver los streams aplicados a un proyecto real — implementarás exactamente este patrón en las notas de Spring Boot.

En Spring Boot, un método de servicio nunca debe devolver la entidad cruda de la base de datos — devuelve un DTO (Data Transfer Object) que solo expone los campos que la API necesita. La forma estándar de convertir una lista de entidades en una lista de DTOs es un pipeline de stream:

```java
// ProjectService — getAll()
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(project -> {
            ProjectResponse response = new ProjectResponse();
            response.setId(project.getId());
            response.setName(project.getName());
            response.setDescription(project.getDescription());
            response.setActive(project.getActive());
            response.setCreatedAt(project.getCreatedAt());
            return response;
        })
        .toList();
}
```

`findAll()` devuelve la `List<Project>` de filas de la base de datos; `.stream()` abre el pipeline; `.map(...)` convierte cada entidad `Project` en un DTO `ProjectResponse` (la lambda usa la forma multilínea, con llaves y `return`, porque hace varias asignaciones); `.toList()` recoge los DTOs.

> **`.toList()` devuelve una lista inmutable.** `.toList()` (Java 16+) es la alternativa más corta a `.collect(Collectors.toList())`, y ambas funcionan en Java 25 — pero no son idénticas. La lista de `.toList()` es **inmutable**: llamar a `.add(...)` o `.remove(...)` sobre ella lanza `UnsupportedOperationException` en tiempo de ejecución. Esto es una característica, no una limitación — el resultado de una consulta suele ser algo que devuelves y lees, nunca modificas, así que la inmutabilidad te protege de un cambio accidental. Solo cuando genuinamente necesites seguir añadiendo al resultado deberías recurrir a `.collect(Collectors.toList())`, que da un `ArrayList` mutable normal.

A medida que la lógica de mapeo crece, típicamente la extraes a un método privado y usas una referencia a método — esta es la verdadera razón por la que `this::toResponse` de la sección de method references aparece por todas partes:

```java
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(this::toResponse)
        .toList();
}

private ProjectResponse toResponse(Project project) {
    ProjectResponse response = new ProjectResponse();
    response.setId(project.getId());
    response.setName(project.getName());
    // ...
    return response;
}
```

---

## Stream vs bucle for — cuándo usar cada uno

Los streams hacen que la _intención_ del código sea clara — filtrar, transformar, ordenar — de una forma que un bucle for no hace. Pero un bucle for es a veces la herramienta correcta.

```java
// Bucle for
List<String> result = new ArrayList<>();
for (Employee e : employees) {
    if (e.isActive()) {
        result.add(e.getName().toUpperCase());
    }
}

// Stream — mismo resultado, la intención es inmediatamente visible
List<String> result = employees.stream()
    .filter(Employee::isActive)
    .map(e -> e.getName().toUpperCase())
    .collect(Collectors.toList());
```

Usa un stream cuando el pipeline es claro y cada paso cabe en una o dos líneas. Usa un bucle for cuando:

- la lógica interna es compleja y ocupa muchas líneas
- necesitas salir del bucle antes con `break`
- estás actualizando una variable externa dentro del bucle (los streams desaconsejan los efectos secundarios)

---

## Referencia rápida de Collectors

`Collectors` es una clase de utilidad que provee recetas listas para usar en la operación terminal `collect()`. Cada método estático devuelve un `Collector` que describe qué contenedor construir. Ya conociste `groupingBy` y `joining` arriba; este es el menú completo en un solo sitio, como referencia.

```java
// Recoger en una List
.collect(Collectors.toList())

// Recoger en un Set (duplicados eliminados automáticamente)
.collect(Collectors.toSet())

// Recoger en un Map — dale cómo derivar la clave y el valor de cada elemento
.collect(Collectors.toMap(
    Employee::getId,    // el id de cada elemento se convierte en la clave
    Employee::getName   // el nombre de cada elemento se convierte en el valor
))
// resultado: Map<Long, String> — id → nombre

// Unir strings
.collect(Collectors.joining(", "))             // "a, b, c"
.collect(Collectors.joining(", ", "[", "]"))   // "[a, b, c]"

// Agrupar en Map<clave, List<elemento>>
.collect(Collectors.groupingBy(Employee::getDepartment))
// resultado: Map<String, List<Employee>>

// Agrupar y contar por grupo
.collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()))
// resultado: Map<String, Long> — departamento → cuántos empleados
```

Dos de estas merecen una nota. **`Collectors.toMap`** convierte el stream en un `Map` — le das dos funciones, una que produce la clave para cada elemento y otra que produce el valor, así que `toMap(Employee::getId, Employee::getName)` construye una búsqueda "id → nombre". (Cuidado: si dos elementos producen la misma clave, `toMap` lanza — espera que las claves sean únicas.) **`Collectors.groupingBy(..., Collectors.counting())`** es `groupingBy` con un segundo argumento que dice *qué hacer con cada cubo* en lugar de quedarse con la lista entera: `counting()` reemplaza la lista de cada grupo por su tamaño, dándote `Map<String, Long>` — "cuántos empleados por departamento". Este anidamiento de un segundo collector dentro de `groupingBy` es una forma común cuando necesitas cuentas o sumas por grupo.

---

## Hacia dónde lleva esto

Ya puedes transformar colecciones enteras con fluidez — la última pieza central de la sintaxis Java de cada día. Habrás notado los ángulos por todas partes en este archivo: `List<String>`, `Optional<Employee>`, `Comparator<T>`, `Function<T, R>`, `Stream<T>`. Esa notación `<...>` son los **generics**, y hasta ahora los has estado leyendo por instinto ("una lista *de* strings", "un optional *de* employee"). El archivo 10 explica qué son en realidad esos ángulos — cómo `<T>` deja que una sola clase como `Optional` o `Comparator` funcione para cualquier tipo sin dejar de ser type-safe — y retoma `Optional` para cubrir el resto de sus métodos. Ese es el siguiente paso natural ahora que has visto los generics usados en cada línea sin que aún se te haya dicho la regla que hay detrás.
</content>
</invoke>
