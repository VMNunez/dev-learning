# Modelo de memoria — Stack, Heap y Garbage Collection

> 📖 [Baeldung — Stack Memory and Heap Space in Java](https://www.baeldung.com/java-stack-heap)
> 📖 [Baeldung — Java Memory Management](https://www.baeldung.com/java-memory-management)

Todos los archivos anteriores se han apoyado sin decirlo en cómo Java guarda las cosas en memoria, sin llegar a nombrarlo nunca. Cuando aprendiste que una variable de un tipo padre puede contener cualquier objeto de una subclase (archivo [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md), dynamic dispatch), o que una `List<User>` contiene un montón de objetos `User` (archivo [10-colecciones.md](10-colecciones.md)), o que `result += name` dentro de un bucle es lento porque cada `+` crea un `String` *nuevo* (archivo [01-variables-tipos.md](01-variables-tipos.md)) — los tres hechos son en realidad afirmaciones sobre *dónde viven los objetos* y *cómo apuntan las referencias hacia ellos*. Este es el archivo donde por fin encajan todas esas piezas.

La razón de que esto venga al final es que necesitabas haber visto los objetos, las referencias y la pila de llamadas en acción antes de que la imagen de la memoria signifique algo. Ahora ya lo has visto. Este archivo responde a tres preguntas que los entrevistadores hacen precisamente porque separan a quien ha escrito Java de quien solo lo ha leído: *"¿ve el llamador el cambio si modifico un objeto dentro de un método?"*, *"¿de dónde sale realmente un `NullPointerException`?"* y *"¿cómo se libera la memoria en Java si no hay `free()`?"*. Las tres tienen la misma raíz: la división entre el **stack** y el **heap**.

> **Por qué debería importarte la memoria en un lenguaje que la gestiona por ti.** Java esconde la gestión de memoria — nunca llamas a `malloc` ni a `free` como en C. Pero "escondido" no es "desaparecido". La división stack/heap es lo que hace que el paso por valor se comporte como lo hace, lo que hace posible el `null`, y lo que hace que `StringBuilder` sea más rápido que `+` en un bucle. No gestionas la memoria a mano, pero razonas sobre ella constantemente — cada una de esas preguntas de entrevista es en realidad una pregunta de memoria disfrazada.

---

## Paso por valor — Java no tiene paso por referencia

> Docs: https://www.baeldung.com/java-pass-by-value-or-pass-by-reference → read: la página entera, especialmente "Passing Object Types"

Esto es lo peor entendido de Java, y los entrevistadores lo preguntan exactamente *porque* se malinterpreta. La afirmación a la que quieren que reacciones es: **"Java es paso por referencia para los objetos."** No lo es. Java es **siempre** paso por valor — para primitivos *y* para objetos. La confusión viene de qué es realmente ese "valor" cuando pasas un objeto.

Empieza por el dolor. Escribes un método que recibe un objeto, lo cambia, y no estás seguro de si el cambio sobrevive después de que el método termine. A veces sobrevive, a veces no, y la regla parece arbitraria hasta que ves el mecanismo. Una vez lo ves, es completamente predecible.

Aquí está la regla en una sola frase, y el resto de la sección la demuestra: **Java copia el argumento dentro del parámetro. Para un primitivo, copia el valor. Para un objeto, copia la *referencia* (la flecha que apunta al objeto) — nunca el objeto en sí.**

### Caso 1 — primitivos: la copia es el valor, así que el llamador nunca ve un cambio

Una variable primitiva (`int`, `long`, `boolean`, `double` — los tipos del archivo [01-variables-tipos.md](01-variables-tipos.md)) *es* su valor. Cuando la pasas a un método, Java copia ese valor dentro del parámetro. El método trabaja sobre su propia copia; el original queda intacto.

```java
public class Demo {
    static void tryToChange(int x) {
        x = 999;              // cambia solo la copia de este método
    }

    public static void main(String[] args) {
        int age = 30;
        tryToChange(age);
        System.out.println(age);   // 30 — NO 999
    }
}
```

El llamador ve `30`. Dentro de `tryToChange`, `x` es una variable totalmente nueva que contiene una *copia* de `30`; asignarle `999` sobreescribe la copia y nada más. El `age` de `main()` nunca estuvo en la sala.

> **¿Por qué no es esto obvio?** Porque dentro de un solo método, `x = 999` obviamente cambia `x`. Lo que no es obvio es que `x` y `age` son dos variables *distintas* que durante un instante contuvieron el mismo número. El `=` solo reasigna el nombre local. Esta es la idea completa del paso por valor en una línea: **el método recibe una copia del valor, no la variable del llamador.**

### Caso 2 — objetos: la copia es la referencia, así que la mutación se ve pero la reasignación no

Los objetos viven en algún lugar de la memoria, y tu variable no contiene el objeto — contiene una **referencia**, una flecha que apunta a donde vive el objeto. (La siguiente sección dibuja exactamente dónde.) Cuando pasas un objeto a un método, Java copia *la flecha*. Ahora dos flechas — la del llamador y la del parámetro del método — apuntan al **mismo** objeto.

Esto produce el comportamiento que hace tropezar a todo el mundo, así que lo separamos en las dos cosas que un método puede hacer con ese objeto. Usa un único ejemplo recurrente: un `User` con un campo `name` mutable.

```java
class User {
    String name;
    User(String name) { this.name = name; }
}
```

**Acción A — mutar los campos del objeto → el llamador lo VE.** Como ambas flechas apuntan al mismo objeto, cambiar un campo *a través* del parámetro cambia el único objeto compartido.

```java
static void rename(User u) {
    u.name = "Bob";           // sigue la flecha, edita el objeto compartido
}

public static void main(String[] args) {
    User user = new User("Alice");
    rename(user);
    System.out.println(user.name);   // Bob — el llamador lo ve
}
```

**Acción B — reasignar el parámetro → el llamador NO lo ve.** Apuntar el parámetro a un objeto *nuevo* solo reorienta la copia de la flecha que tiene el método. La flecha del llamador sigue apuntando al original.

```java
static void replace(User u) {
    u = new User("Bob");      // reorienta solo la flecha de ESTE método
}

public static void main(String[] args) {
    User user = new User("Alice");
    replace(user);
    System.out.println(user.name);   // Alice — sin cambios
}
```

Aquí está, dibujado, por qué difieren los dos casos. Al entrar en el método, ambas flechas apuntan al mismo objeto `Alice`:

```
main's `user`   ──┐
                  ├──►  [ User: name="Alice" ]      (un objeto, dos flechas)
method's `u`    ──┘
```

**Acción A** (`u.name = "Bob"`) sigue la flecha y edita el objeto que ambas flechas comparten:

```
main's `user`   ──┐
                  ├──►  [ User: name="Bob" ]        ← main ve "Bob"
method's `u`    ──┘
```

**Acción B** (`u = new User("Bob")`) crea un segundo objeto y reorienta *solo* la flecha del método hacia él. La flecha del llamador nunca se movió:

```
main's `user`   ──────►  [ User: name="Alice" ]     ← main sigue viendo "Alice"

method's `u`    ──────►  [ User: name="Bob" ]        ← se descarta cuando el método termina
```

> **La única prueba que responde a "¿ve el llamador el cambio?"** Pregúntate: *¿seguí la flecha, o reorienté la flecha?* Editar un campo (`u.name = ...`, `list.add(...)`, `u.setName(...)`) sigue la flecha → **visible**. Asignar el parámetro en sí (`u = ...`) reorienta la flecha copiada → **invisible**. Esa única distinción resuelve todas las versiones de esta pregunta.

> **Por qué esto demuestra que Java no es paso por referencia.** En un lenguaje de verdadero paso por referencia (como C++ con `&`), la Acción B *sí* cambiaría la variable del llamador, porque el método tendría la variable real del llamador, no una copia de su flecha. La Acción B de Java demostrablemente no lo hace — así que la flecha tuvo que ser copiada. El valor que se copió resultó ser una referencia, pero aun así se copió por valor. "Paso por valor donde el valor es una referencia" es la formulación precisa y correcta, y es la respuesta que los entrevistadores están esperando oír.

> **Ancla con JS/TS — esta sí es realmente idéntica.** JavaScript se comporta exactamente igual: reasignar un parámetro dentro de una función no afecta al llamador, pero mutar la propiedad de un objeto sí. Si ya tenías esta intuición desde JS, se transfiere directamente — Java solo hace explícita la razón stack/heap que hay detrás, que es lo que dibuja la siguiente sección.

---

## Stack vs heap — dónde viven de verdad las variables y los objetos

> Docs: https://www.baeldung.com/java-stack-heap → read: "Stack Memory in Java" y "Heap Space in Java"

La sección anterior repetía "el objeto vive en algún lugar" y "la variable contiene una flecha". Ahora nombramos los dos lugares. La JVM (el programa que ejecuta tu Java compilado — presentado en la sección de la jerarquía de excepciones del archivo [11-excepciones.md](11-excepciones.md)) divide la memoria que gestiona en dos regiones con trabajos completamente distintos:

- **El stack** — un cuaderno de borrador por método. Contiene las **variables locales** de cada método: los primitivos guardan aquí su valor real, y las variables de objeto guardan aquí la **referencia** (la flecha).
- **El heap** — un único gran pool compartido. Cada objeto que creas con `new` vive aquí. El heap no tiene noción de "qué método" — los objetos que hay en él los comparte cualquiera que tenga una flecha hacia ellos.

Ya conociste el stack en el archivo [11-excepciones.md](11-excepciones.md): es la misma **pila de llamadas** (_call stack_) donde cada llamada a un método se apila encima de la anterior y se quita (LIFO) cuando el método termina. La pila exacta de aquel archivo — `main()` abajo, `methodA()`, `methodB()` encima — es la estructura de la que estamos hablando. Cada uno de esos frames apilados lleva las variables locales de ese método. Cuando el método termina y su frame se saca de la pila, todas las variables locales *de ese frame* desaparecen con él. (Si quieres el mecanismo completo de la pila de llamadas otra vez, es la primera sección de `11-excepciones.md` — no hace falta releerla para seguir esto.)

Aquí está la parte crucial: **el objeto que está en el heap no desaparece cuando un método termina.** Solo desaparece el frame — y la flecha que contenía. Esta es toda la razón por la que los objetos pueden sobrevivir al método que los creó y pasarse de un lado a otro. Coge el ejemplo del `User` y dibuja ambas regiones a la vez:

```java
public static void main(String[] args) {
    int count = 3;                       // primitivo → el valor vive en el stack
    User user = new User("Alice");       // flecha en el stack, objeto en el heap
}
```

```
        STACK (por método, LIFO)                 HEAP (pool compartido)
   ┌──────────────────────────────┐        ┌──────────────────────────┐
   │ main() frame:                │        │                          │
   │    count = 3                 │        │  [ User: name="Alice" ]  │
   │    user  = ●─────────────────┼───────►│                          │
   └──────────────────────────────┘        └──────────────────────────┘
   `count` guarda su valor directamente.    El objeto en sí vive aquí,
   `user` guarda solo una flecha (una       alcanzable a través de la flecha
   referencia) hacia el heap.               que está en el stack.
```

Este único diagrama explica todo lo de la sección anterior: el paso por valor copia el *slot del stack*. Para `count`, el slot contiene un número, así que copias un número. Para `user`, el slot contiene una flecha, así que copias una flecha — y ambas flechas aterrizan en el mismo objeto del heap. La mutación llega a través de la flecha hasta el objeto compartido del heap (visible); la reasignación solo sobreescribe la flecha en el slot local del stack (invisible). La regla y la imagen son el mismo hecho.

> **¿Por qué dos regiones en vez de una?** Velocidad y tiempo de vida. La reserva en el stack es trivialmente rápida — apilar y desapilar un frame es solo mover un puntero, y el tiempo de vida de una variable es exactamente la ejecución de su método, así que la limpieza es automática (desapilar el frame). El heap tiene que sobrevivir entre métodos y ser compartido, así que no puede estar atado al tiempo de vida de ningún frame concreto — que es exactamente por lo que necesita un mecanismo de limpieza aparte, el garbage collector de la siguiente sección.

### De dónde sale realmente un NullPointerException

Este es el resultado concreto, y es una pregunta de entrevista garantizada (también aparece listada en `11-excepciones.md` como el fallo en tiempo de ejecución más común — aquí está el *porqué* a nivel de memoria que hay detrás). Una variable de referencia en el stack no tiene por qué apuntar a nada. Cuando no apunta a nada, su valor es `null` — una flecha apuntando al vacío.

```
        STACK                              HEAP
   ┌──────────────────┐
   │ user = null      │   ✗  no apunta a nada — ningún objeto en el heap
   └──────────────────┘
```

`null` no es un objeto y no es un error por sí mismo — a un slot del stack se le permite contener "ninguna flecha". El fallo ocurre en el instante en que intentas **seguir** una flecha que no apunta a nada — es decir, desreferenciarla — llamando a un método o leyendo un campo sobre ella:

```java
User user = null;
System.out.println(user.name);   // NullPointerException
```

En Java moderno, el mensaje exacto que lanza en tiempo de ejecución es muy preciso al respecto:

```
Exception in thread "main" java.lang.NullPointerException:
    Cannot read field "name" because "user" is null
```

> **Así que un `NullPointerException` no es "un objeto roto" — es "ningún objeto en absoluto".** La variable existe (es un slot del stack válido), pero no hay nada en el heap al otro extremo de la flecha sobre lo que ejecutar el método. Por eso todas las soluciones que viste en `11-excepciones.md` se reducen a *garantizar que hay un objeto antes de seguir la flecha*: `Optional` hace explícito en el tipo el "puede ser null", `Objects.requireNonNull` falla ruidosamente en la frontera, y un simple `if (user != null)` comprueba la flecha antes de desreferenciarla. El mismo mecanismo, tres maneras de evitarlo.

> **`==` vs `.equals()`, revisitado desde la memoria.** Ahora puedes ver *por qué* `==` compara "direcciones de memoria" (la frase del archivo [01-variables-tipos.md](01-variables-tipos.md)). `==` sobre dos variables de objeto compara las dos flechas — ¿apuntan al *mismo* objeto del heap? `.equals()` sigue ambas flechas y compara el *contenido* de los objetos. Esa es toda la razón por la que `==` sobre dos objetos `String` distintos-pero-iguales da `false`: dos flechas, dos objetos del heap, mismo texto.

---

## Garbage collection — limpieza automática de los objetos inalcanzables

> Docs: https://www.baeldung.com/java-memory-management → read: "Garbage Collection"

El heap se va llenando a medida que creas objetos, pero un programa que corriera lo suficiente acabaría por agotarlo — a menos que algo recupere los objetos que ya no usas. En C o C++ lo haces *tú* a mano: cada `new`/`malloc` necesita su `delete`/`free` correspondiente, y olvidar uno filtra memoria mientras que hacerlo dos veces la corrompe. Java te quita ese trabajo por completo. **No hay `free()` ni `delete`** en Java — nunca escribes código de limpieza para los objetos.

En su lugar, la JVM ejecuta un proceso en segundo plano llamado el **garbage collector (GC)**. Su regla es simple y vale la pena memorizarla porque es la respuesta exacta a *"¿cómo se gestiona la memoria en Java?"*: **el GC recupera un objeto del heap en cuanto ya nada puede alcanzarlo.** "Alcanzable" significa que todavía existe alguna cadena de flechas que lleva hasta él — partiendo de la variable local de un frame vivo del stack, de un campo estático, y así. En el momento en que desaparece la última flecha que apunta a un objeto, el objeto queda **inalcanzable**, y pasa a ser elegible para liberarse. Tú no disparas esto y no puedes predecir exactamente cuándo se ejecuta — simplemente dejas de referenciar un objeto y confías en que el GC lo note.

Observa cómo un objeto se vuelve inalcanzable usando el mismo `User`:

```java
User user = new User("Alice");   // objeto del heap creado, una flecha hacia él
user = new User("Bob");          // flecha reorientada hacia un objeto nuevo
```

Después de la segunda línea, el objeto `Alice` sigue en el heap pero **ninguna flecha apunta ya hacia él** — la única referencia fue sobreescrita:

```
        STACK                       HEAP
   ┌──────────────┐          [ User: name="Alice" ]   ← inalcanzable → el GC lo recuperará
   │ user = ●─────┼───────►  [ User: name="Bob"   ]   ← alcanzable, en uso
   └──────────────┘
```

Nada podrá volver a tocar el objeto `Alice`, así que mantenerlo desperdicia memoria. El GC acabará por detectar que es inalcanzable y recuperará el espacio — sin ningún código por tu parte.

### Por qué `result += name` en un bucle es un desperdicio — el quid de la cuestión, por fin explicado

Allá en el archivo [01-variables-tipos.md](01-variables-tipos.md) aprendiste que `String` es inmutable: cada operación devuelve un `String` *nuevo* en vez de cambiar el original, y que `result += name` en un bucle "rinde mal". Ahora tienes el mecanismo para ver *por qué* es malo, y es una historia de garbage collection.

Como `String` es inmutable, `result += name` no puede editar `result` en el sitio. Construye un objeto `String` **totalmente nuevo** en el heap (el texto viejo más el texto nuevo), y reorienta `result` hacia él. El objeto anterior queda ahora inalcanzable — basura al instante. Haz eso mil veces en un bucle y creas mil objetos desechables en el heap, cada uno abandonado en el momento en que corre el siguiente `+=`:

```java
// MAL — un String nuevo por iteración, 999 de ellos dejados para el GC
String result = "";
for (String name : names) {   // digamos que names tiene 1000 entradas
    result += name;           // cada += construye un String nuevo, abandona el viejo
}
```

```
iteración 1:  "A"          ← basura tras la iter 2
iteración 2:  "AB"         ← basura tras la iter 3
iteración 3:  "ABC"        ← basura tras la iter 4
   ...        (997 objetos abandonados más) ...
```

La solución es `StringBuilder` (archivo [01-variables-tipos.md](01-variables-tipos.md)) — un único buffer mutable al que sigues añadiendo, de modo que hay **un** objeto durante todo el rato en vez de uno nuevo por iteración:

```java
// BIEN — un StringBuilder, se le añade en el sitio, sin basura por iteración
StringBuilder sb = new StringBuilder();
for (String name : names) {
    sb.append(name);          // edita el mismo buffer, sin objeto nuevo
}
String result = sb.toString();   // un único String final al terminar
```

> **Lo que "desperdicio" cuesta de verdad.** Son dos costes, no uno. Primero, la *reserva*: construir 1000 objetos de vida corta lleva tiempo y espacio de heap. Segundo, la *recolección*: cada uno de esos objetos abandonados es trabajo que el GC tiene ahora que hacer para recuperarlo. `StringBuilder` elimina ambos — una reserva, nada que recolectar. Por eso el consejo es "bucles, no concatenación en una sola línea": un `a + b` puntual crea un objeto de todas formas y el compilador ya lo convierte en un `StringBuilder` por debajo; solo el caso *repetido* dentro de un bucle acumula basura.

> **Automático no significa gratis, y no significa a prueba de fugas.** El GC te salva del `free()`, pero no es magia. Si *mantienes* una referencia a un objeto que ya no necesitas — digamos que añades objetos a una `List` que vive durante todo el programa y nunca los quitas — el objeto sigue siendo alcanzable, así que el GC nunca puede recuperarlo. Eso es una fuga de memoria en Java: no un `free()` que falta, sino una flecha accidental que olvidaste soltar. La conclusión a nivel junior: el GC recolecta lo *inalcanzable*; mantener las cosas alcanzables para siempre sigue siendo tu responsabilidad.

---

## Cómo cierra esto las notas de Java

Esa es toda la superficie del lenguaje que necesitas para leer, escribir y razonar sobre código de Spring Boot — y este archivo es el suelo sobre el que se apoyaba todo lo demás. El modelo de memoria ata el tema entero: los objetos y las referencias (archivos 04–06) son flechas del stack hacia objetos del heap; las colecciones (archivo 07) son objetos del heap que contienen más flechas; la inmutabilidad y `StringBuilder` (archivo 01) son una historia de basura; y los dos fallos que la JVM lanza cuando una región se queda sin espacio — `StackOverflowError` cuando la pila de llamadas no tiene sitio para apilar otro frame (recursión desbocada), y `OutOfMemoryError` cuando el heap está lleno de objetos alcanzables que el GC no puede recuperar — ahora se leen exactamente como lo que dicen. Esos dos viven en la jerarquía de excepciones del archivo [11-excepciones.md](11-excepciones.md); vuelve a esa sección ahora y debería calar más fuerte, porque por fin sabes qué son físicamente un "stack" y un "heap".

Desde aquí el camino deja el Java puro y se adentra en Spring Boot, donde cada uno de estos conceptos reaparece con sombrero de framework: los beans son objetos del heap que Spring crea y hacia los que mantiene flechas por ti, la inyección de dependencias es Spring entregando a tu constructor la flecha correcta, y `NullPointerException` sigue siendo el fallo que más depurarás. La base de Java está completa.
