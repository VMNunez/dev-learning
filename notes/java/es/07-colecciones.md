# Collections

> 📖 [Baeldung — Java Collections](https://www.baeldung.com/java-collections)
> 📖 [Oracle Docs — Collections framework](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

Antes de que existieran las colecciones, tenías que gestionar tus propios arrays — tamaño fijo, sin búsqueda integrada, sin forma de añadir ni eliminar elementos. El Collections Framework es un conjunto de interfaces y clases que viene incluido en el JDK de Java (en el paquete `java.util`) — no tienes que descargar nada, ya está ahí. Te da estructuras de datos listas para usar para lo que haces constantemente en cualquier aplicación: listas ordenadas de elementos, búsquedas por clave y conjuntos de valores únicos. Las tres que usarás en casi todos los servicios Spring Boot son `List`, `Map` y `Set`.

---

## List — ordenada, permite duplicados

`List` es la elección por defecto cuando necesitas una secuencia ordenada y dinámica — como las filas que devuelve una consulta a la base de datos. A diferencia de un array, se redimensiona automáticamente a medida que añades o eliminas elementos. Los métodos que más usarás son: `add(valor)` para añadir al final, `get(índice)` para leer por posición, `remove(valor)` o `remove(índice)` para eliminar, `contains(valor)` para comprobar si un elemento existe, `size()` para saber cuántos elementos hay, e `isEmpty()` para saber si está vacía.

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

`Map<String, Integer>` se lee así: el primer tipo entre los `<>` es el tipo de la clave (`String` — el nombre del empleado) y el segundo es el tipo del valor (`Integer` — la puntuación). Siempre declaras el tipo de la clave primero y el del valor segundo.

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

Para iterar sobre todas las entradas del mapa necesitas `Map.Entry<K, V>`, que es el tipo que Java usa para representar un par clave-valor concreto. `scores.entrySet()` devuelve un `Set<Map.Entry<String, Integer>>` — es decir, un conjunto de pares clave-valor, donde cada elemento del conjunto es un par completo (clave y valor juntos). Por eso en el for-each se declara `Map.Entry<String, Integer> entry`: es el tipo de cada elemento que el bucle va sacando de ese conjunto (`scores.entrySet()`).

Dentro del bucle, `entry` ya tiene la clave y el valor en el mismo objeto, así que no necesitas volver al mapa a buscar nada. `entry.getKey()` te da la clave que tiene ese par, y `entry.getValue()` te da su valor directamente. `scores.get("Victor")` funciona cuando ya tienes la clave y quieres el valor — pero al iterar con `entrySet()` tienes los dos a la vez, y los métodos `getKey()` / `getValue()` son los que los extraen de ese objeto par:

```java
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
    // imprime: Victor: 97
}
```

Si solo necesitas las claves, `scores.keySet()` te devuelve un `Set<String>` — útil cuando quieres recorrer solo los nombres sin necesitar sus puntuaciones. Si solo necesitas los valores, `scores.values()` te devuelve una `Collection<Integer>`. `Collection` es la interfaz raíz de la que heredan `List`, `Set` y otras estructuras del framework — `values()` la usa porque el mapa no garantiza un orden concreto para los valores, así que no puede comprometerse a devolver una `List`. En la práctica no cambia nada: puedes recorrerla con un for-each igual que cualquier otra colección. Esto es útil cuando quieres operar sobre todos los valores — sumarlos, buscar el máximo — sin importar a qué clave pertenece cada uno:

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

Usa un `Set` cuando los duplicados serían un error — por ejemplo, la lista de roles que tiene un usuario o el conjunto de etiquetas de un artículo. Añadir un valor duplicado no hace nada en silencio, que es exactamente lo que quieres.

La implementación por defecto es `HashSet`, que internamente funciona igual que un `HashMap` — convierte cada valor en un número (hash) para saber dónde guardarlo, lo que hace que `contains()` sea instantáneo aunque tengas miles de elementos. A cambio, no garantiza ningún orden al iterar.

Si necesitas orden de inserción, usa `LinkedHashSet`. Si necesitas los valores ordenados alfabéticamente o numéricamente, usa `TreeSet`. En la práctica, `HashSet` cubre el 95% de los casos.

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

---

## Métodos de utilidad de Collections

`Collections` (con s) es una clase de utilidad del JDK — distinta de la interfaz `Collection` (sin s). No creas instancias de ella, simplemente llamas a sus métodos estáticos sobre listas que ya tienes. Te da operaciones que necesitas con frecuencia pero que `List` no incluye directamente: ordenar, invertir, barajar, y buscar el máximo o mínimo.

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

Cuando llamas a `Collections.sort(employees)` o `employees.sort(...)`, Java necesita saber cómo comparar dos objetos `Employee` para decidir cuál va antes. Con `String` o `Integer` ya sabe — tienen un orden natural obvio. Con tus propias clases, tienes que decírselo tú. Para eso existen `Comparable` y `Comparator`: dos mecanismos para definir reglas de ordenación en Java.

### Comparable — orden natural definido por la clase

Implementas `Comparable<T>` directamente en tu clase cuando hay un orden por defecto obvio — el que cualquiera esperaría al ordenar una lista de ese tipo. El método `compareTo()` recibe otro objeto del mismo tipo y devuelve un número negativo si `this` va antes, cero si son iguales, y positivo si `this` va después.

La propia clase implementa `Comparable<T>` para definir su orden de clasificación por defecto:

```java
public class Employee implements Comparable<Employee> {
    private String name;

    @Override
    public int compareTo(Employee other) {
        return this.name.compareTo(other.name);  // ordenar alfabéticamente por nombre
    }
}

// Ahora puedes ordenar un List<Employee> sin pasar nada
Collections.sort(employees);
employees.sort(null);  // usa el orden natural
```

Usa `Comparable` cuando hay una ordenación por defecto obvia para la clase (por ejemplo, empleados por nombre, productos por precio).

### Comparator — ordenación externa y flexible

El problema con `Comparable` es que solo puedes definir un orden por clase. Si quieres ordenar empleados por nombre en una pantalla y por fecha de alta en otra, `Comparable` no es suficiente. `Comparator` resuelve esto: defines la regla de ordenación fuera de la clase, al vuelo, y se la pasas directamente a `sort()`. Puedes tener tantos `Comparator` como quieras para la misma clase.

La sintaxis `Employee::getName` se llama **referencia a método** — una forma más corta de escribir `e -> e.getName()`. Se explica en detalle en `09-streams-lambdas.md`. Por ahora, léela simplemente como "el método `getName` de `Employee`".

```java
// Ordenar por nombre alfabéticamente
employees.sort(Comparator.comparing(Employee::getName));

// Ordenar por edad descendente
employees.sort(Comparator.comparingInt(Employee::getAge).reversed());

// Ordenar por múltiples campos
employees.sort(Comparator.comparing(Employee::getDepartment)
                         .thenComparing(Employee::getName));
```

### Comparable vs Comparator

|                        | Comparable                                     | Comparator                                    |
| ---------------------- | ---------------------------------------------- | --------------------------------------------- |
| Dónde se define        | Dentro de la clase                             | Fuera de la clase                             |
| Método                 | `compareTo()`                                  | `compare()`                                   |
| Opciones de ordenación | Una (el orden natural)                         | Muchas                                        |
| Cuándo usar            | Ordenación por defecto, eres dueño de la clase | Múltiples ordenaciones, o la clase no es tuya |

---

## ConcurrentModificationException

Esta es una trampa clásica de Java que cae todo el mundo la primera vez. Parece totalmente lógico recorrer una lista y eliminar los elementos que no quieres — pero Java no lo permite y lanza `ConcurrentModificationException`.

El motivo: el bucle for-each usa un iterador internamente. Ese iterador guarda un contador de versión de la lista en el momento en que empieza a recorrerla. Cada vez que llamas a `remove()` directamente sobre la lista, ese contador cambia. En la siguiente iteración, el iterador compara su contador con el de la lista, los ve distintos, y lanza la excepción — porque no puede saber si los índices siguen siendo válidos.

```java
// Esto lanza ConcurrentModificationException
for (Employee e : employees) {
    if (!e.isActive()) {
        employees.remove(e);  // cambio estructural mientras se itera — no permitido
    }
}
```

### Cómo solucionarlo

```java
// Opción 1 — removeIf (la más limpia)
employees.removeIf(e -> !e.isActive());

// Opción 2 — recopilar primero, luego eliminar
List<Employee> toRemove = employees.stream()
    .filter(e -> !e.isActive())
    .collect(Collectors.toList());
employees.removeAll(toRemove);

// Opción 3 — usar un Iterator explícito
Iterator<Employee> it = employees.iterator();
while (it.hasNext()) {
    if (!it.next().isActive()) {
        it.remove();  // seguro — el propio iterador hace la eliminación
    }
}
```

Usa `removeIf()` — es la más corta y legible.

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

Las colecciones están en todas partes en Spring Boot:

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
