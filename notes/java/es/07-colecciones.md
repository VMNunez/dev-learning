# Collections

> 📖 [Baeldung — Java Collections](https://www.baeldung.com/java-collections)
> 📖 [Oracle Docs — Collections framework](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

Antes de que existieran las colecciones, tenías que gestionar tus propios arrays — tamaño fijo, sin búsqueda integrada, sin forma de añadir ni eliminar elementos. El Collections Framework es un conjunto de interfaces y clases que viene incluido en el JDK de Java (en el paquete `java.util`) — no tienes que descargar nada, ya está ahí. Te da estructuras de datos listas para usar para lo que haces constantemente en cualquier aplicación: listas ordenadas de elementos, búsquedas por clave y conjuntos de valores únicos. Las tres que usarás en casi todos los servicios Spring Boot son `List`, `Map` y `Set`.

---

## List — ordenada, permite duplicados

`List` es la elección por defecto cuando necesitas una secuencia ordenada y dinámica — como las filas que devuelve una consulta a la base de datos. A diferencia de un array, se redimensiona automáticamente a medida que añades o eliminas elementos. Un array tiene **tamaño fijo**: cuando lo creas reservas de golpe un número concreto de posiciones en memoria (`new String[5]` aparta cinco huecos contiguos) y ese número ya no puede cambiar — si luego necesitas un sexto elemento, tienes que crear un array nuevo más grande y copiar todos los valores a mano. Esos huecos ocupan memoria estén llenos o vacíos: un array de 100 posiciones con 3 valores sigue reservando las 100. Una `List` es **dinámica**: por dentro gestiona ese redimensionado por ti — pide más memoria y copia los elementos cuando se llena — de forma que desde fuera solo llamas a `add()` y la estructura crece sola. Los métodos que más usarás son: `add(valor)` para añadir al final, `get(índice)` para leer por posición, `remove(valor)` o `remove(índice)` para eliminar, `contains(valor)` para comprobar si un elemento existe, `size()` para saber cuántos elementos hay, e `isEmpty()` para saber si está vacía.

```java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();

// Añadir — add() siempre inserta al final
names.add("Victor");   // → ["Victor"]
names.add("Ana");      // → ["Victor", "Ana"]
names.add("Luis");     // → ["Victor", "Ana", "Luis"]

// Leer
names.get(0);          // "Victor" — los índices empiezan en 0
names.size();          // 3 — número de elementos
names.isEmpty();       // false — hay al menos un elemento
names.contains("Ana"); // true — "Ana" está en la lista

// Eliminar
names.remove("Ana");   // elimina la primera aparición del valor "Ana"
names.remove(0);       // elimina el elemento en la posición 0

// Iterar — recorrer todos los elementos en orden
for (String name : names) {
    System.out.println(name);
}
```

### List.of() — lista inmutable vs ArrayList — lista mutable

Hay dos formas de crear una lista con valores iniciales y es importante saber cuándo usar cada una.

`List.of()` crea una lista **inmutable** — no puedes añadir ni eliminar elementos después de crearla. Si lo intentas, Java lanza `UnsupportedOperationException` en tiempo de ejecución:

```java
List<String> fixed = List.of("Victor", "Ana", "Luis");
fixed.add("Pedro");    // ❌ UnsupportedOperationException — esta lista no se puede modificar
fixed.remove("Ana");   // ❌ igual — inmutable significa que no cambia nunca
```

Si quieres una lista que puedas modificar pero que ya tenga valores de partida, envuelves el `List.of()` en un `new ArrayList<>()`. Esto crea una copia mutable con los mismos elementos:

```java
List<String> mutable = new ArrayList<>(List.of("Victor", "Ana"));
mutable.add("Luis");    // ✅ funciona — esta sí es modificable
mutable.remove("Ana");  // ✅ funciona
```

Usa `List.of()` cuando los datos no van a cambiar (por ejemplo, una lista fija de valores en un test). Usa `new ArrayList<>()` cuando vayas a añadir o quitar elementos después. La inmutabilidad solo bloquea las operaciones de _modificación estructural_ — `add()`, `remove()`, `set()` y `clear()`. Los métodos de solo lectura (`get()`, `contains()`, `size()`, iterar con for-each) funcionan perfectamente en listas creadas con `List.of()`.

### List vs Array

|          | Array                             | List                        |
| -------- | --------------------------------- | --------------------------- |
| Tamaño   | Fijo                              | Dinámico                    |
| Sintaxis | `String[]`                        | `List<String>`              |
| Métodos  | Ninguno                           | add, remove, contains, etc. |
| Usado en | Datos de bajo nivel y tamaño fijo | Casi todo lo demás          |

Usa `List` en casi todos los casos. Usa arrays solo cuando el tamaño es fijo y el rendimiento es crítico.

### ArrayList vs LinkedList

Ambas son implementaciones de `List`, pero guardan los datos en memoria de forma completamente distinta — y eso afecta a su rendimiento según lo que hagas con ellas.

`ArrayList` internamente es un array que crece automáticamente. Cuando creas un `ArrayList`, Java reserva un bloque contiguo de posiciones en memoria. Leer un elemento por índice (`get(0)`, `get(5)`) es instantáneo porque Java calcula la posición exacta en memoria directamente. El problema aparece cuando insertas o eliminas en el medio: tiene que desplazar todos los elementos posteriores una posición.

`LinkedList` internamente es una cadena de nodos. Cada nodo guarda el valor del elemento más dos referencias: una al nodo anterior y otra al siguiente. Para leer el elemento en la posición 5, Java tiene que recorrer 5 nodos desde el principio — por eso el acceso por índice es lento. Pero insertar o eliminar en el medio es rápido: solo hay que actualizar dos referencias, sin mover nada más.

|                            | ArrayList                  | LinkedList                                             |
| -------------------------- | -------------------------- | ------------------------------------------------------ |
| Estructura interna         | Array                      | Cadena de nodos                                        |
| `get(i)`                   | Rápido — índice directo    | Lento — debe recorrer                                  |
| `add` al final             | Rápido                     | Rápido                                                 |
| `add`/`remove` en el medio | Lento — desplaza elementos | Rápido — solo reenlaza nodos                           |
| Memoria                    | Menos                      | Más (cada nodo almacena dos referencias)               |
| Cuándo usar                | Casi siempre               | Raramente — solo si hay muchas inserciones en el medio |

En la práctica, usa `ArrayList` para todo. `LinkedList` es una respuesta teórica en entrevistas — en código real de Spring Boot casi nunca la verás.

---

## Map — pares clave-valor, las claves son únicas

Un `Map` es la estructura que usas cuando necesitas buscar algo por un identificador único en lugar de recorrer una lista entera. Piensa en él como un diccionario: das una palabra (la clave) y obtienes su definición (el valor) de forma instantánea, sin mirar página por página.

Esto es útil, por ejemplo, cuando quieres **cachear** un resultado — es decir, guardar algo que ya calculaste o recuperaste para no repetir ese trabajo. Si tienes una lista de 1000 empleados y necesitas buscar el mismo empleado varias veces por ID, guardas los resultados en un `Map<Integer, Employee>` y los recuperas en tiempo constante, en lugar de recorrer la lista cada vez.

`Map<String, Integer>` se lee así: el primer tipo entre los `<>` (esos ángulos son la sintaxis de **genéricos** de Java — no es un operador con nombre propio; sirven para decirle a la clase con qué tipos va a trabajar, y se explican a fondo en [10-generics.md](10-generics.md)) es el tipo de la clave (`String` — el nombre del empleado) y el segundo es el tipo del valor (`Integer` — la puntuación). Siempre declaras el tipo de la clave primero y el del valor segundo.

Creas un `Map` con `new HashMap<>()` — la interfaz es `Map<K, V>` y la implementación concreta es `HashMap`. Los métodos que más usarás son: `put(clave, valor)` para añadir o actualizar una entrada (si la clave ya existe, `put()` reemplaza el valor anterior en lugar de añadir una segunda entrada), `get(clave)` para recuperar el valor de una clave, `getOrDefault(clave, valorPorDefecto)` para leer con un fallback si la clave no existe, `containsKey(clave)` para saber si una clave está en el mapa, `containsValue(valor)` para saber si un valor concreto aparece en alguna entrada, `remove(clave)` para eliminar una entrada, y `size()` para contar cuántas hay.

```java
import java.util.HashMap;
import java.util.Map;

// Map<K, V>: K = tipo de la clave, V = tipo del valor
Map<String, Integer> scores = new HashMap<>();

// Añadir / actualizar — put(clave, valor)
scores.put("Victor", 95);       // añade la entrada: "Victor" → 95
scores.put("Ana", 88);          // añade la entrada: "Ana" → 88
scores.put("Victor", 97);       // "Victor" ya existe → reemplaza 95 por 97

// Leer
scores.get("Victor");           // 97 — devuelve el valor de la clave "Victor"
scores.getOrDefault("Luis", 0); // 0 — "Luis" no existe, devuelve el valor por defecto
scores.containsKey("Ana");      // true — ¿existe esta clave en el mapa?
scores.containsValue(88);       // true — ¿existe este valor en alguna entrada?
scores.size();                  // 2 — número de entradas (recordatorio: "Victor" reemplazó, no añadió)

// Eliminar
scores.remove("Ana");           // elimina la entrada con clave "Ana"
```

Para iterar sobre todas las entradas del mapa necesitas `Map.Entry<K, V>`, que es el tipo que Java usa para representar un par clave-valor concreto. `scores.entrySet()` devuelve un `Set<Map.Entry<String, Integer>>` — es decir, un conjunto de pares clave-valor. Un `Set` no es una lista ni un array: es una colección de elementos **únicos, sin duplicados y sin acceso por índice** (lo ves en detalle más abajo). Devuelve un `Set` precisamente porque las claves de un mapa ya son únicas, así que los pares también lo son; no tiene nada que ver con permitir o no repetidos en el resultado. Cada elemento del conjunto es un par completo (clave y valor juntos). Por eso en el for-each se declara `Map.Entry<String, Integer> entry`: es el tipo de cada elemento que el bucle va sacando de ese conjunto (`scores.entrySet()`).

Dentro del bucle, `entry` ya tiene la clave y el valor en el mismo objeto, así que no necesitas volver al mapa a buscar nada. `entry.getKey()` te da la clave que tiene ese par, y `entry.getValue()` te da su valor directamente. `scores.get("Victor")` funciona cuando ya tienes la clave y quieres el valor — pero al iterar con `entrySet()` tienes los dos a la vez, y los métodos `getKey()` / `getValue()` son los que los extraen de ese objeto par:

```java
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
    // imprime: Victor: 97
}
```

Las tres opciones —`entrySet()`, `keySet()` y `values()`— sí son formas de **recorrer** el mapa; lo que cambia es qué parte necesitas en cada caso. Usas `entrySet()` cuando necesitas la clave y el valor a la vez. Si solo necesitas las claves, `scores.keySet()` te devuelve un `Set<String>` — útil cuando quieres recorrer solo los nombres sin necesitar sus puntuaciones. Si solo necesitas los valores, `scores.values()` te devuelve una `Collection<Integer>`. `Collection` es la interfaz raíz de la que heredan `List`, `Set` y otras estructuras del Collections Framework del JDK — `values()` la usa porque el mapa no garantiza un orden concreto para los valores, así que no puede comprometerse a devolver una `List`. En la práctica no cambia nada: puedes recorrerla con un for-each igual que cualquier otra colección. Esto es útil cuando quieres operar sobre todos los valores — sumarlos, buscar el máximo — sin importar a qué clave pertenece cada uno:

```java
// keySet() — recorrer solo las claves
for (String name : scores.keySet()) {
    System.out.println("Empleado: " + name);  // imprime: Victor, Ana
}

// values() — operar sobre todos los valores
int total = 0;
for (int score : scores.values()) {
    total += score;
}
System.out.println("Suma: " + total);  // 185
```

### HashMap vs LinkedHashMap vs TreeMap

Hay tres implementaciones de `Map` que verás en entrevistas y en código real. Las tres guardan pares clave-valor, pero difieren en el **orden** en que almacenan y recorren las entradas.

`HashMap` es la implementación por defecto. Internamente usa una **tabla hash** — una técnica que convierte la clave en un número para calcular en qué posición del array interno guardarla. El resultado es inserción y búsqueda muy rápidas (tiempo constante), pero sin ningún orden garantizado: si iteras sobre un `HashMap`, los elementos pueden salir en cualquier orden.

`LinkedHashMap` funciona igual que `HashMap` internamente (misma velocidad), pero además mantiene una lista enlazada que recuerda el orden de inserción. Cuando iteras, los elementos salen en el mismo orden en que los añadiste.

`TreeMap` ordena las claves automáticamente — alfabéticamente si son `String`, numéricamente si son números. Internamente usa un árbol binario de búsqueda equilibrado, lo que hace la inserción y búsqueda algo más lentas que `HashMap`.

|             | HashMap             | LinkedHashMap                | TreeMap                    |
| ----------- | ------------------- | ---------------------------- | -------------------------- |
| Orden       | Sin orden           | Orden de inserción           | Ordenado por clave         |
| Velocidad   | Más rápido          | Ligeramente más lento        | Más lento (ordenación)     |
| Cuándo usar | La mayoría de casos | Necesitas orden de inserción | Necesitas claves ordenadas |

---

## Set — valores únicos, sin duplicados

Usa un `Set` cuando los duplicados serían un error — por ejemplo, la lista de roles que tiene un usuario o el conjunto de etiquetas de un artículo. Un `Set` no es una `List` sin duplicados — es una estructura distinta. La diferencia clave: `Set` no tiene acceso por índice, no existe `get(0)` ni `get(2)`. Está diseñado para una sola pregunta: ¿existe este valor? Cuando intentas añadir un valor que ya está en el set, Java simplemente lo ignora **en silencio**: no lanza ninguna excepción, nada explota y nada te avisa. Eso es exactamente lo que quieres: los duplicados desaparecen solos sin que tengas que comprobarlos tú antes de cada `add()`.

Los métodos que usarás son: `add(valor)` para añadir (si ya existe, se ignora), `remove(valor)` para eliminar, `contains(valor)` para comprobar si un valor existe — esto es lo que más se usa, `size()` para contar cuántos elementos hay, e `isEmpty()` para saber si está vacío.

La implementación por defecto es `HashSet`. Debajo tienes los métodos típicos; las tres implementaciones de `Set` y cuándo elegir cada una las verás justo después del código.

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();

tags.add("java");
tags.add("spring");
tags.add("java");   // duplicado — se ignora silenciosamente

tags.size();           // 2
tags.contains("java"); // true
tags.remove("spring");

// Iterar
for (String tag : tags) {
    System.out.println(tag);
}

// Uso más común — eliminar duplicados de una List
List<String> withDuplicates = List.of("a", "b", "a", "c", "b");
Set<String> unique = new HashSet<>(withDuplicates);
List<String> deduplicated = new ArrayList<>(unique);
```

### HashSet vs LinkedHashSet vs TreeSet

Igual que con `Map`, hay tres implementaciones de `Set` y la diferencia entre ellas es el **orden** en que recorren los elementos.

`HashSet` es la implementación por defecto. Internamente funciona igual que un `HashMap` — convierte cada valor en un número (hash) para saber dónde guardarlo, lo que hace que `contains()` sea instantáneo aunque tengas miles de elementos. A cambio, no garantiza ningún orden al iterar.

`LinkedHashSet` funciona igual de rápido que `HashSet`, pero además recuerda el orden de inserción: cuando lo recorres, los valores salen en el mismo orden en que los añadiste. Úsalo cuando necesites recuperar los elementos en el orden en que los insertaste.

`TreeSet` mantiene los valores ordenados automáticamente — alfabéticamente si son `String`, numéricamente si son números. Internamente usa un árbol binario de búsqueda equilibrado, lo que hace la inserción y la búsqueda algo más lentas que `HashSet`.

|             | HashSet             | LinkedHashSet                | TreeSet                     |
| ----------- | ------------------- | ---------------------------- | --------------------------- |
| Orden       | Sin orden           | Orden de inserción           | Ordenado por valor          |
| Velocidad   | Más rápido          | Ligeramente más lento        | Más lento (ordenación)      |
| Cuándo usar | La mayoría de casos | Necesitas orden de inserción | Necesitas valores ordenados |

En la práctica, `HashSet` cubre el 95% de los casos.

---

## Métodos comunes — List, Map y Set

Las tres estructuras comparten un conjunto de operaciones básicas porque las tres implementan la interfaz `Collection`. `Map` usa nombres ligeramente distintos para algunas porque necesita diferenciar entre claves y valores, pero la idea es la misma:

| Operación                   | List              | Set               | Map                                    |
| --------------------------- | ----------------- | ----------------- | -------------------------------------- |
| Añadir                      | `add(valor)`      | `add(valor)`      | `put(clave, valor)`                    |
| Eliminar                    | `remove(valor)`   | `remove(valor)`   | `remove(clave)`                        |
| Comprobar si existe         | `contains(valor)` | `contains(valor)` | `containsKey(clave)`                   |
| Número de elementos         | `size()`          | `size()`          | `size()`                               |
| ¿Está vacío?                | `isEmpty()`       | `isEmpty()`       | `isEmpty()`                            |
| Vaciar                      | `clear()`         | `clear()`         | `clear()`                              |
| Leer por posición / clave   | `get(índice)`     | —                 | `get(clave)`                           |
| Leer con valor por defecto  | —                 | —                 | `getOrDefault(clave, def)`             |
| Recorrer                    | for-each          | for-each          | `entrySet()` / `keySet()` / `values()` |

En `Map`, `remove(clave)` elimina **por clave**, no por valor: le pasas la clave y borra el par entero. No hay un método que borre "el primer par cuyo valor sea X" recorriendo el mapa; si necesitas eso, tienes que localizar tú la clave primero. (Existe una variante `remove(clave, valor)` que solo borra si esa clave tiene exactamente ese valor, pero sigue encontrando la entrada por la clave.) En `List` y `Set`, en cambio, `remove(valor)` sí elimina por el propio valor.

## Métodos de utilidad de Collections

`Collections` (con s) es una clase de utilidad del JDK — distinta de la interfaz `Collection` (sin s). No creas instancias de ella, simplemente llamas a sus métodos estáticos. Los métodos más habituales son:

- `Collections.sort(lista)` — ordena la lista de menor a mayor. **Solo funciona con `List`** — `Set` y `Map` no tienen orden posicional.
- `Collections.reverse(lista)` — invierte el orden de los elementos. **Solo `List`**.
- `Collections.shuffle(lista)` — mezcla los elementos en orden aleatorio. **Solo `List`**.
- `Collections.max(colección)` — devuelve el elemento mayor. Funciona con `List` y `Set`.
- `Collections.min(colección)` — devuelve el elemento menor. Funciona con `List` y `Set`.
- `Collections.frequency(colección, valor)` — cuenta cuántas veces aparece un valor. Funciona con `List` y `Set`.

```java
import java.util.Collections;

List<Integer> numbers = new ArrayList<>(List.of(3, 1, 4, 1, 5));

Collections.sort(numbers);           // [1, 1, 3, 4, 5]
Collections.reverse(numbers);        // [5, 4, 3, 1, 1]
Collections.shuffle(numbers);        // orden aleatorio
Collections.max(numbers);            // 5
Collections.min(numbers);            // 1
Collections.frequency(numbers, 1);   // 2
```

---

## Ordenación — Comparable y Comparator

Cuando ordenas una lista de `String` o `Integer`, Java ya sabe cómo compararlos — "Ana" va antes que "Luis", el 3 va antes que el 7. Pero si tienes una `List<Employee>` y llamas a `sort()`, Java no sabe por qué campo comparar a dos empleados. ¿Por nombre? ¿Por edad? ¿Por departamento? Para eso existen `Comparable` y `Comparator`: dos mecanismos distintos para enseñarle a Java cómo ordenar tus propias clases. Es decir, sirven para ordenar colecciones de objetos tuyos —una `List<Employee>`, no una lista de primitivos— por alguna de sus propiedades (nombre, edad, etc.). `sort()` solo existe en `List`, así que la ordenación explícita que ves aquí es cosa de listas. `Set` y `Map` no se ordenan con `sort()`: si necesitas un conjunto o un mapa siempre ordenado, usas `TreeSet` o `TreeMap`, que se apoyan en este mismo `Comparable`/`Comparator` para saber cómo colocar cada elemento.

> Hay dos formas equivalentes de ordenar una lista: `Collections.sort(employees)` y `employees.sort(...)`. Las dos hacen lo mismo — la segunda es más moderna (añadida en Java 8) y es la que más verás en código Spring Boot actual. Puedes usar cualquiera de las dos.

### Comparable — la clase sabe ordenarse a sí misma

Usas `Comparable` cuando hay un orden por defecto obvio para tu clase — uno que cualquiera esperaría. Por ejemplo, empleados ordenados por nombre. Lo implementas dentro de la propia clase y solo puedes definir uno: ese único orden —el campo que elijas en `compareTo()`— pasa a ser el orden "natural" de la clase, el que se usa siempre que ordenes sin especificar otra regla.

Para implementarlo, tu clase añade `implements Comparable<Employee>` y define el método `compareTo()`. Java llama a ese método internamente cuando ordena la lista — tú no lo llamas directamente. El método compara `this` (el objeto actual) con `other` (el otro objeto de la lista con el que Java lo está comparando en ese momento — no lo creas tú ni lo pasas: durante la ordenación Java va tomando los elementos de la lista de dos en dos y le entrega el segundo a tu método como `other`) y devuelve: un número negativo si `this` debe ir antes, cero si son iguales, y un número positivo si `this` debe ir después.

En la práctica casi nunca calculas ese número a mano — delegas en el `compareTo()` de `String`, que ya sabe ordenar alfabéticamente. Y esa es justo la razón por la que tú tienes que escribir `compareTo()` en `Employee`: `String` e `Integer` ya lo traen implementado de fábrica (por eso Java sabe ordenar listas de textos o números sin que hagas nada), pero tu clase `Employee` es nueva para Java y no tiene ningún orden por defecto, así que eres tú quien lo define implementando el método. Puedes comparar por más de un campo si quieres —por ejemplo, por nombre y, en caso de empate, por edad— encadenando comparaciones dentro de `compareTo()`; más abajo verás que `Comparator` hace esto mismo de forma más limpia con `thenComparing()`.

`compareTo()` no ordena ninguna lista — define cómo se comparan dos objetos `Employee` entre sí. La lista sigue siendo externa: cuando llamas a `employees.sort()`, Java toma la lista e internamente llama a `compareTo()` sobre pares de empleados para decidir quién va antes. Lo hace automáticamente: el algoritmo de ordenación va comparando elementos de dos en dos (no siempre los dos contiguos —eso depende del algoritmo—, pero siempre de dos en dos: uno hace de `this` y el otro de `other`) y, según el número que devuelve tu `compareTo()`, los coloca en la posición correcta. La regla de comparación vive en la clase; la lista solo la usa. Piénsalo así: la lista pregunta "¿quién va primero?" y el `Employee` responde "pregúntame a mí — yo te lo digo".

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// 1. La clase define cómo se comparan dos Employee entre sí
public class Employee implements Comparable<Employee> {
    private String name;
    private int age;

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge()     { return age; }

    @Override
    public int compareTo(Employee other) {
        return this.name.compareTo(other.name);  // delega en el compareTo de String
    }
}

// 2. La lista usa esa regla al ordenar — sin que tú pases nada
// En Spring Boot este bloque iría dentro de un método de servicio:
// los empleados vendrían de repository.findAll(), no añadidos a mano
List<Employee> employees = new ArrayList<>();
employees.add(new Employee("Luis", 30));
employees.add(new Employee("Ana", 25));
employees.add(new Employee("Victor", 28));

Collections.sort(employees);   // llama a compareTo() internamente — resultado: Ana, Luis, Victor
employees.sort(null);          // equivalente: null = "usa el orden natural de Comparable"
```

El `<>` vacío en `new ArrayList<>()` se llama **operador diamante** y es una abreviatura: Java puede deducir el tipo genérico a partir de la declaración de la variable (`List<Employee>`), así que no hace falta repetirlo. `new ArrayList<>()` y `new ArrayList<Employee>()` son exactamente lo mismo — la segunda forma existía antes de Java 7; desde entonces se usa el diamante vacío para no repetir el tipo.

`List<Employee> employees` crea una lista vacía que solo puede contener objetos de la clase `Employee` (la que defines justo arriba). Cada `employees.add(new Employee("Luis", 30))` crea un objeto `Employee` y lo añade a esa lista. Esa es la lista que `Collections.sort()` ordena llamando a `compareTo()` sobre cada par de empleados.

`employees.sort(null)` puede parecer extraño, pero `null` aquí significa: "no te estoy pasando una regla externa, usa la que la propia clase tiene definida". Es equivalente a `Collections.sort(employees)`. `employees.sort()` sin argumentos no existe — `sort()` exige exactamente un argumento: o un `Comparator` con la regla, o `null` para indicar "usa el orden natural de `Comparable`". No hay forma de llamarlo vacío.

### Comparator — una regla de ordenación definida fuera de la clase

El problema con `Comparable` es que solo puedes definir un orden por clase. Si quieres ordenar empleados por nombre en una pantalla y por edad en otra, `Comparable` no es suficiente — solo tienes uno. `Comparator` resuelve esto: defines la regla fuera de la clase y se la pasas directamente a `sort()`. Puedes crear tantos `Comparator` distintos como quieras para la misma clase.

`Comparator` tiene tres métodos de fábrica que usarás siempre:

- **`Comparator.comparing(función)`** — ordena por el campo que devuelve la función. Úsalo para `String` u objetos.
- **`Comparator.comparingInt(función)`** — igual pero optimizado para campos `int` (evita convertir el primitivo `int` a objeto `Integer`). Úsalo para edad, precio, cantidad.
- **`.reversed()`** — encadena al comparator anterior para invertir el orden (de mayor a menor en lugar de menor a mayor).
- **`.thenComparing(función)`** — desempate: cuando dos elementos son iguales según el primer criterio, aplica un segundo criterio. Para campos `int` existe `.thenComparingInt(función)`, igual que `comparingInt` — es la variante optimizada para primitivos.

La sintaxis `Employee::getName` se llama **referencia a método** — una forma corta de escribir `e -> e.getName()`. Se explica en `09-streams-lambdas.md`. Por ahora léela como "el método `getName` de `Employee`".

En Spring Boot, este código iría dentro de un método de servicio — la lista llegaría de `repository.findAll()` y tú la ordenarías antes de devolverla:

```java
// En un servicio de Spring Boot
public List<Employee> getEmployeesSortedByName() {
    List<Employee> employees = repository.findAll(); // viene de la base de datos

    // Opción 1 — ordenar por nombre alfabéticamente (A → Z)
    employees.sort(Comparator.comparing(Employee::getName));
    // resultado: Ana, Luis, Victor

    return employees;
}

public List<Employee> getEmployeesSortedByAgeDesc() {
    List<Employee> employees = repository.findAll();

    // Opción 2 — ordenar por edad de mayor a menor
    employees.sort(Comparator.comparingInt(Employee::getAge).reversed());
    // resultado: Luis (30), Victor (28), Ana (25)

    return employees;
}

// Combinar dos criterios — ordenar por nombre y, si los nombres son iguales, desempatar por edad
employees.sort(Comparator.comparing(Employee::getName)
                         .thenComparingInt(Employee::getAge));
```

### Comparable vs Comparator

|                        | Comparable                                     | Comparator                                                                |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| Dónde se define        | Dentro de la clase                             | Fuera de la clase                                                         |
| Método                 | `compareTo()`                                  | `compare()`                                   |
| Opciones de ordenación | Una (el orden natural)                         | Muchas                                        |
| Cuándo usar            | Ordenación por defecto, eres dueño de la clase | Múltiples ordenaciones, o la clase no es tuya |

Ojo con el nombre del método: el que define la interfaz `Comparator` se llama `compare(a, b)` — recibe los dos objetos y devuelve el número negativo/cero/positivo, igual que `compareTo()`. `comparing()` y `comparingInt()` son otra cosa: métodos de fábrica estáticos que **construyen** un `Comparator` por ti a partir de un campo, y por dentro son ellos los que implementan ese `compare()`. Por eso en la tabla el método es `compare()` — es el que de verdad hace la comparación; `comparing()` solo es el atajo para crearlo.

---

## ConcurrentModificationException

Esta es una trampa clásica de Java que cae todo el mundo la primera vez. Parece totalmente lógico recorrer una lista y eliminar los elementos que no quieres — pero Java no lo permite y lanza `ConcurrentModificationException`.

El motivo: el bucle for-each usa un iterador internamente. Ese contador de versión (Java lo llama `modCount`) es simplemente un número entero que la lista guarda por dentro y aumenta en uno cada vez que su estructura cambia — cada `add()` o `remove()`. El iterador anota ese número en el momento en que empieza a recorrer la lista. Cada vez que llamas a `remove()` directamente sobre la lista, ese contador cambia. En la siguiente iteración, el iterador compara su contador con el de la lista, los ve distintos, y lanza la excepción — porque no puede saber si los índices siguen siendo válidos.

```java
// Esto lanza ConcurrentModificationException
for (Employee e : employees) {
    if (!e.isActive()) {
        employees.remove(e);  // cambio estructural mientras se itera — no permitido
    }
}
```

### Cómo solucionarlo

Hay tres formas de eliminar mientras recorres sin provocar la excepción. Van de la más recomendable a la más manual.

**Opción 1 — `removeIf()` (la más limpia).** Es un método de la propia `List` que recibe una condición y borra todos los elementos que la cumplen, en una sola línea. Por dentro usa un iterador correctamente, así que no hay riesgo de excepción — y no tienes que escribir el bucle tú. La `e -> !e.isActive()` es una expresión lambda: "para cada empleado `e`, bórralo si no está activo" (las lambdas se explican en [09-streams-lambdas.md](09-streams-lambdas.md)).

```java
employees.removeIf(e -> !e.isActive());
```

**Opción 2 — recopilar primero y borrar después.** El truco es no tocar la lista mientras la recorres: primero construyes una lista aparte (`toRemove`) con los que quieres quitar, y solo cuando has terminado de recorrer llamas a `removeAll()` para borrarlos de golpe. `stream()` abre un flujo sobre la lista, `filter()` se queda con los que cumplen la condición y `collect()` los junta en una nueva lista (todo esto es de streams — [09-streams-lambdas.md](09-streams-lambdas.md)). Como el borrado ocurre fuera del recorrido, no hay conflicto.

```java
List<Employee> toRemove = employees.stream()
    .filter(e -> !e.isActive())
    .collect(Collectors.toList());
employees.removeAll(toRemove);
```

**Opción 3 — usar un `Iterator` explícito.** Es la versión "a mano" de lo que `removeIf()` hace por dentro, y ayuda a entender por qué funciona. En vez del for-each, pides el iterador a la lista con `iterator()` y lo manejas tú: `hasNext()` pregunta si quedan elementos, `next()` te da el siguiente y avanza, y —esta es la clave— `it.remove()` borra a través del **propio iterador**, no de la lista. Al borrar por el iterador, este actualiza su contador de versión a la vez que el de la lista, así que nunca se descuadran y no salta la excepción.

```java
Iterator<Employee> it = employees.iterator();
while (it.hasNext()) {
    if (!it.next().isActive()) {
        it.remove();  // seguro — el propio iterador hace la eliminación
    }
}
```

Usa `removeIf()` — es la más corta y legible. Las otras dos son útiles cuando ya tienes un stream montado (opción 2) o cuando necesitas más control durante el recorrido (opción 3).

---

## Referencia rápida — cuál usar

| Situación                           | Usar                  |
| ----------------------------------- | --------------------- |
| Lista ordenada de elementos         | `List<T>` (ArrayList) |
| Búsqueda clave-valor                | `Map<K, V>` (HashMap) |
| Solo valores únicos                 | `Set<T>` (HashSet)    |
| Necesitas orden de inserción en Map | `LinkedHashMap`       |
| Necesitas claves ordenadas en Map   | `TreeMap`             |
| Necesitas Set ordenado              | `TreeSet`             |

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa métodos de `JpaRepository` y patrones de servicio que aún no has estudiado. Léela para ver cómo aparecen las colecciones en una aplicación real — lo implementarás en las notas de Spring Boot.

Las colecciones no son un tema aparte que estudias y luego olvidas: son el tipo con el que se mueven los datos por toda una aplicación Spring Boot. Cuando consultas la base de datos, el repositorio te devuelve los resultados en una `List` — una fila por elemento. Esa `List` sube a la capa de servicio, donde normalmente la transformas: la recorres con un `stream()` para convertir cada entidad `Employee` en un `EmployeeDTO` (el objeto "de salida" que expones al cliente, sin los campos internos), y vuelves a juntar el resultado en otra `List` con `collect()`. Los `Map` aparecen cuando necesitas agrupar o indexar datos por una clave, y los `Set` cuando modelas algo que no admite duplicados, como los roles de un usuario. En otras palabras: casi todo lo que devuelve o procesa un servicio es una de estas tres estructuras.

```java
// El repositorio devuelve una List
List<Employee> findAll();
List<Employee> findByDepartment(String department);

// El servicio procesa una List
public List<EmployeeDTO> getAllEmployees() {
    return repository.findAll()
        .stream()
        .map(e -> new EmployeeDTO(e.getName(), e.getEmail()))
        .collect(Collectors.toList());
}
```
