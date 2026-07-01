# Collections

> 📖 [Baeldung — Java Collections](https://www.baeldung.com/java-collections)
> 📖 [Oracle Docs — Collections framework](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

El Collections Framework proporciona estructuras de datos ya construidas. Las tres que más usas son `List`, `Map` y `Set`.

---

## List — ordenada, permite duplicados

```java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();

// Añadir
names.add("Victor");
names.add("Ana");
names.add("Luis");

// Leer
names.get(0);          // "Victor" — acceso por índice
names.size();          // 3
names.isEmpty();       // false
names.contains("Ana"); // true

// Eliminar
names.remove("Ana");        // eliminar por valor
names.remove(0);            // eliminar por índice

// Iterar
for (String name : names) {
    System.out.println(name);
}

// Crear con valores (inmutable — no se puede añadir/eliminar)
List<String> fixed = List.of("Victor", "Ana", "Luis");

// Crear mutable a partir de List.of
List<String> mutable = new ArrayList<>(List.of("Victor", "Ana"));
```

### List vs Array

| | Array | List |
|---|-------|------|
| Tamaño | Fijo | Dinámico |
| Sintaxis | `String[]` | `List<String>` |
| Métodos | Ninguno | add, remove, contains, etc. |
| Usado en | Datos de bajo nivel y tamaño fijo | Casi todo lo demás |

Usa `List` en casi todos los casos. Usa arrays solo cuando el tamaño es fijo y el rendimiento es crítico.

### ArrayList vs LinkedList

Ambas implementan `List`, pero almacenan datos de forma distinta:

| | ArrayList | LinkedList |
|---|-----------|------------|
| Estructura interna | Array | Cadena de nodos |
| `get(i)` | Rápido — índice directo | Lento — debe recorrer |
| `add` al final | Rápido | Rápido |
| `add`/`remove` en el medio | Lento — desplaza elementos | Rápido — solo reenlaza nodos |
| Memoria | Menos | Más (cada nodo almacena dos punteros) |
| Cuándo usar | Casi siempre | Raramente — solo si hay muchas inserciones en el medio |

En la práctica, usa `ArrayList` para todo. `LinkedList` es una respuesta teórica en entrevistas — en código real de Spring Boot casi nunca la verás.

---

## Map — pares clave-valor, las claves son únicas

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();

// Añadir / actualizar
scores.put("Victor", 95);
scores.put("Ana", 88);
scores.put("Victor", 97);   // reemplaza el valor anterior de "Victor"

// Leer
scores.get("Victor");                    // 97
scores.getOrDefault("Luis", 0);          // 0 — la clave no existe, devuelve el valor por defecto
scores.containsKey("Ana");              // true
scores.containsValue(88);              // true
scores.size();                          // 2

// Eliminar
scores.remove("Ana");

// Iterar
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Solo claves o solo valores
scores.keySet();    // Set de claves
scores.values();    // Collection de valores
```

### HashMap vs LinkedHashMap vs TreeMap

| | HashMap | LinkedHashMap | TreeMap |
|---|---------|---------------|---------|
| Orden | Sin orden | Orden de inserción | Ordenado por clave |
| Velocidad | Más rápido | Ligeramente más lento | Más lento (ordenación) |
| Cuándo usar | La mayoría de casos | Necesitas orden de inserción | Necesitas claves ordenadas |

---

## Set — valores únicos, sin duplicados

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

### Comparable — orden natural definido por la clase

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

`Comparator` se define fuera de la clase — lo pasas a `sort()`. Útil cuando necesitas múltiples opciones de ordenación o no puedes modificar la clase.

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

| | Comparable | Comparator |
|---|------------|------------|
| Dónde se define | Dentro de la clase | Fuera de la clase |
| Método | `compareTo()` | `compare()` |
| Opciones de ordenación | Una (el orden natural) | Muchas |
| Cuándo usar | Ordenación por defecto, eres dueño de la clase | Múltiples ordenaciones, o la clase no es tuya |

---

## ConcurrentModificationException

Esta excepción ocurre cuando eliminas elementos de una List **dentro de un bucle for-each**:

```java
// Esto lanza ConcurrentModificationException
for (Employee e : employees) {
    if (!e.isActive()) {
        employees.remove(e);  // cambio estructural mientras se itera — no permitido
    }
}
```

El bucle for-each usa un iterador internamente. El iterador rastrea el tamaño de la lista. Cuando `remove()` cambia ese tamaño, el iterador detecta un cambio estructural y lanza la excepción.

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

| Situación | Usar |
|-----------|------|
| Lista ordenada de elementos | `List<T>` (ArrayList) |
| Búsqueda clave-valor | `Map<K, V>` (HashMap) |
| Solo valores únicos | `Set<T>` (HashSet) |
| Necesitas orden de inserción en Map | `LinkedHashMap` |
| Necesitas claves ordenadas en Map | `TreeMap` |
| Necesitas Set ordenado | `TreeSet` |

---

## Conexión con Spring Boot

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
