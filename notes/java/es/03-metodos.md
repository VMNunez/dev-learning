# Métodos

> 📖 [Baeldung — Guide to Methods in Java](https://www.baeldung.com/java-methods) → leer el artículo completo
> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) (referencia oficial)

## Declaración de un método

> Docs: https://www.baeldung.com/java-method-signature-return-type → leer la página completa: es corta y deja claro exactamente qué partes de una declaración forman la signature

En [02-flujo-de-control.md](02-flujo-de-control.md) cada bucle y cada `if` que escribiste vivía dentro de un método `main` — ese `main` era en sí mismo un método, igual que las llamadas a `System.out.println` que invocaba. Esta nota da un paso atrás y examina esa pieza fundamental directamente: de qué está hecho un método y cómo escribes los tuyos.

> **¿Dónde viven los métodos?** Siempre dentro de una clase — no pueden existir fuera de una clase en Java. Los explicamos aquí antes de ver las clases completas porque ya los has encontrado en los ejemplos de control de flujo. La estructura completa de una clase (campos, constructores, encapsulación) se cubre en [04-poo-clases.md](04-poo-clases.md).

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

> **La signature — la parte de un método que Java usa para identificarlo.** La **signature** de un método es su nombre más el tipo y el orden de sus parámetros: `add(int, int)`. Eso es todo — el tipo de retorno *no* forma parte de la signature, y tampoco el modificador de acceso. Ahora suena a trivia, pero es exactamente la regla que decide qué método llama Java cuando varios comparten nombre (§"Sobrecarga de métodos" más abajo) y qué método reemplaza una subclase (`06-herencia-polimorfismo.md`). Cada vez que este archivo diga "la signature", se refiere a esa huella de nombre-más-tipos-de-parámetros.

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

---

## Modificadores de acceso

> Docs: https://www.baeldung.com/java-access-modifiers → leer: "Private", "Protected" y "Comparison"

Un modificador de acceso controla desde dónde se puede llamar a un método (o acceder a un campo). Es la forma en que Java protege el código interno de una clase y decide qué partes son visibles desde fuera.

> **Los mismos cuatro modificadores se aplican por igual a métodos, campos y clases.** Nada de esta sección es específico de los métodos: `private String name;` oculta un campo exactamente igual que `private ProjectResponse toResponse(...)` oculta un método, y una `public class` frente a una `class Foo` package-private (sin modificador) decide qué clases pueden siquiera nombrar el tipo. La única restricción es que una clase de nivel superior no puede ser `private` ni `protected` — no hay un ámbito exterior en el que esos modificadores signifiquen algo. Los métodos son solo donde te encuentras con los modificadores primero.

Lee la tabla como "quién tiene permiso para llamar a este método": cada fila es un modificador y el alcance de los llamadores que permite, del más abierto (`public`) al más cerrado (`private`).

| Modificador | Quién puede acceder |
|----------|------------------|
| `public` | Todos |
| `private` | Solo dentro de la misma clase (las subclases tampoco pueden acceder) |
| `protected` | Misma clase + subclases + mismo paquete |
| (ninguno) | Solo el mismo paquete |

En Spring Boot usarás principalmente `public` para endpoints REST y métodos de servicio, y `private` para métodos auxiliares internos. Es exactamente la división que aplicaste en el servicio de TimeTrack: los cinco métodos que llama el controlador son `public`, y el que convierte una entidad `Project` en el DTO que se devuelve por HTTP es `private`, porque nadie fuera del servicio tiene motivo para llamarlo:

**Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

```java
@Service
public class ProjectService {
    // public — el controlador llama a estos
    public ProjectResponse getById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toResponse(project);
    }

    // private — un helper interno; el mundo exterior no sabe que existe
    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        return response;
    }
}
```

> `ProjectResponse`, `@Service` y `ResourceNotFoundException` son clases de Spring Boot / del proyecto, no palabras clave de Java — las conocerás bien en las notas de Spring Boot. Lee el fragmento solo por la división entre `public` y `private`, que es Java puro.

```java
// protected — útil en herencia (cubierta en 06-herencia-polimorfismo.md):
// las subclases pueden acceder, el mundo exterior no
public class Animal {
    protected String sound;
}

public class Dog extends Animal {
    public void bark() {
        System.out.println(this.sound);  // ✓ — Dog hereda de Animal y puede ver sound
    }
}
```

Los dos mensajes de fallo merecen memorizarse, porque IntelliJ te muestra la cadena de texto pero no la regla. Llamar a un método `private` desde fuera de su clase:

```java
ProjectService service = new ProjectService(projectRepository);
service.toResponse(project);
// error: toResponse(Project) has private access in ProjectService
```

Fíjate en *cuándo* pasa esto: en **tiempo de compilación**. `private` no es una barrera en tiempo de ejecución que lanza una excepción — el código que contiene la llamada ilegal nunca llega a convertirse en un `.class`.

> **`protected` tiene un alcance más afilado que "las subclases pueden acceder".** Divide la fila de la tabla en dos, porque las dos mitades se comportan distinto. **Mismo paquete:** cualquier clase del paquete llega a un miembro `protected`, sea subclase o no — ahí se comporta exactamente como el default sin modificador. **Paquete distinto:** solo una subclase llega a él, y solo *a través de su propia herencia* — es decir, a través de `this` (o de una referencia cuyo tipo declarado sea la propia subclase). Una subclase en otro paquete todavía no puede leer el miembro sobre *otro* `Animal` cualquiera que le hayan pasado:
>
> ```java
> // paquete p2 — Dog extiende p1.Animal
> public void bark() { System.out.println(this.sound); }             // ✓ su propia copia heredada
> public void peek(Animal other) { System.out.println(other.sound); } // ❌
> // error: sound has protected access in Animal
> ```
>
> La razón es para qué *sirve* `protected`: abre el miembro a una subclase para que haga su propio trabajo con su propio estado — no para que inspeccione instancias ajenas del padre. Dentro del mismo paquete Java relaja esto, dando por hecho que las clases que se distribuyen juntas las escribe la misma gente y confían entre sí.

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

> **Devolver un objeto entrega una flecha viva, y eso tiene una consecuencia.** Si `getName()` devuelve el campo `String`, quien llama no puede hacerte daño — `String` es inmutable, así que no hay nada que cambiar. Pero si un método devuelve el campo `List` interno, quien llama ahora puede llamar a `.add()` sobre la propia lista de tu objeto desde fuera, a tus espaldas. La solución (una *copia defensiva* — devolver `new ArrayList<>(this.items)` en lugar del campo directo) va de la mano de la encapsulación y se cubre en [04-poo-clases.md](04-poo-clases.md); lo señalo ahora para que la línea "devuelve una colección" de arriba no se lea como inofensiva.

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

Este es exactamente el patrón de Spring Boot para `delete` — el servicio devuelve `void`, pero el controlador devuelve `ResponseEntity<Void>` para poder enviar igualmente un estado 204 sin cuerpo (ver [spring-boot/02-controladores-rest.md](../../spring-boot/es/02-controladores-rest.md)):

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

## Métodos estáticos

> Docs: https://www.baeldung.com/java-static → leer: "The static Methods (Or Class Methods)" y "Understanding the 'Non-static variable' Error"

Para entender `static`, primero necesitas la diferencia entre una **clase** y un **objeto** (también llamado instancia). La clase es el molde — la definición de cómo son los objetos. Los objetos son las copias concretas creadas a partir de ese molde.

Un método normal (de instancia) pertenece a cada objeto individual. Cada `Employee` que crees tiene su propio `getName()`, porque devuelve el nombre de *ese* empleado en concreto — necesita el objeto para hacer su trabajo.

Un método `static` pertenece a la **clase en sí**, no a ningún objeto individual. No necesitas crear un objeto para llamarlo — lo llamas directamente sobre el nombre de la clase:

```java
public class MathUtils {
    public static int square(int n) {
        return n * n;
    }
}

// No necesitas crear un MathUtils para usarlo
int result = MathUtils.square(5);   // 25
```

¿Cuándo tiene sentido `static`? Cuando el método realiza una operación que no depende de ningún dato guardado por un objeto en particular — solo de los argumentos que le pasas. `MathUtils.square(5)` no necesita saber nada de ningún `Employee` ni del estado de ningún otro objeto.

Aquí está la imagen que hace obvio el resto de esta sección, y usa al `Employee` que vienes viendo desde las secciones anteriores. Dale un método static — `Employee.count()`, que devuelve cuántos empleados se han creado hasta ahora. Ese número pertenece a la *clase* en su conjunto, no a Ana ni a Luis individualmente, y por eso precisamente es `static`. La clase se carga en memoria una sola vez; cada objeto creado a partir de ella es una caja aparte con sus propios valores de campo. Un método `static` vive arriba, en la caja de la clase, junto a nada que pertenezca a ningún objeto en particular:

```
   ┌──────────────────────────────────────────────────┐
   │  class Employee                                  │
   │     static count()   ← UNA copia, sin objeto necesario│
   └──────────────────────────────────────────────────┘
              │ crea                   │ crea
              ▼                       ▼
   ┌──────────────────────┐  ┌──────────────────────┐
   │ Employee objeto #1   │  │ Employee objeto #2   │
   │   name = "Ana"       │  │   name = "Luis"      │
   │   getName()  ← this  │  │   getName()  ← this  │
   └──────────────────────┘  └──────────────────────┘
```

Ese esquema es todo el mecanismo, y explica el error con el que estás a punto de tropezar. Un método de instancia siempre se llama *sobre* un objeto (`ana.getName()`), así que Java le entrega en silencio una referencia oculta a ese objeto, llamada `this` — así es como `getName()` sabe de quién devolver el nombre. Un método `static` se llama sobre la clase (`Employee.count()`), y en esa llamada no hay ningún objeto en absoluto, así que **no hay `this` que entregar**. Cualquier línea dentro que lea un campo de instancia estaría preguntando "el nombre de *cuál* empleado?" sin ninguna respuesta disponible. El compilador lo detiene:

```java
public class Employee {
    private String name = "Ana";

    public static void print() {
        System.out.println(name);   // ❌
    }
}
// error: non-static variable name cannot be referenced from a static context
```

La solución es una de dos cosas, y elegir entre ellas es la decisión real: o el método de verdad necesita un empleado, en cuyo caso quitas `static` y lo llamas sobre un objeto — o no lo necesita, en cuyo caso pasas lo que hace falta como parámetro (`print(String name)`).

> **La regla solo funciona en un sentido.** Un método `static` no puede alcanzar miembros de instancia, pero un método de *instancia* sí puede llamar libremente a los `static` — `getName()` puede llamar a `Employee.count()` sin ningún problema. La asimetría se sigue del diagrama: ir de un objeto hacia arriba, a la caja de la clase, siempre es posible, porque el objeto se creó a partir de ella. Ir en el sentido contrario significa elegir un objeto entre miles, y nada en una llamada static dice cuál.

> **Por qué `main` es `static` — la pregunta que arrastras desde [00-intro-java.md](00-intro-java.md).** `public static void main(String[] args)` es el método que la JVM llama para arrancar tu programa. Ahora pregúntate qué tendría que hacer la JVM si `main` fuera un método de instancia: tendría que crear primero un objeto de tu clase, lo cual implica elegir un constructor e inventarse argumentos para él — sin que tu programa esté aún corriendo para decirle cuáles. `static` elimina el problema por completo. La clase se carga, y `main` puede invocarse directamente sobre ella **antes de que exista un solo objeto**. Todo lo demás en tu programa se crea desde dentro de `main`, río abajo de esa primera llamada. En el backend de TimeTrack ese punto de entrada es `TimetrackApplication.main(...)`, y hace exactamente esto: `SpringApplication.run(...)` desde un contexto static construye todo el grafo de objetos.

Ya has usado métodos estáticos sin darte cuenta — `Integer.parseInt("42")` y `String.valueOf(42)` son static: los llamas sobre la clase `Integer` o `String`, no sobre un objeto concreto. Recuerda que las clases wrapper (`Integer`, `Long`, `Boolean`…) son clases de Java reales. Eso es exactamente lo que las distingue de un `int` primitivo — son objetos, tienen métodos, y pueden ser `null`. El nombre "wrapper" es literal: envuelven un valor primitivo dentro de un objeto.

> **En Spring Boot:** los métodos de tus services y repositories son métodos de instancia — los llamas sobre objetos que Spring inyecta (`projectService.getAll()`, `projectRepository.save(project)`). Necesitan el objeto porque guardan estado que Spring puso ahí: el repository, la conexión a base de datos, la configuración. `static` aparece en las clases de ayuda genuinamente sin estado. En TimeTrack esa es `TimeEntrySpecifications`, cuyos métodos son todos `public static Specification<TimeEntry> hasUserId(Long userId)` y similares — no se guarda nada, la respuesta depende solo del argumento, así que un objeto no aportaría nada.
>
> **Archivo:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntrySpecifications.java`
>
> El contraejemplo del mismo proyecto es la lección más afilada. `JwtUtil` *suena* como una clase de utilidad, pero `generateToken(String username)` es un método de **instancia** — porque la clase guarda configuración inyectada (`@Value("${app.jwt.secret}") private String secret;`). En el momento en que un helper necesita un valor de `application.properties`, necesita un objeto en el que Spring pueda inyectar ese valor, y `static` queda descartado. "Utility" en el nombre no es lo que lo decide; guardar estado sí.

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

> **Overloading vs overriding — no los confundas.** Suenan parecido y ambas hablan de "dos métodos con el mismo nombre", pero son ideas opuestas. **Overloading** (esta sección) es *una* clase que define varias versiones de un método que se diferencian en sus parámetros — la elección se hace en tiempo de compilación según los argumentos que pasas. **Overriding** es una *subclase* que reemplaza un método que heredó de su padre, manteniendo *exactamente los mismos* parámetros, para cambiar el comportamiento — la elección se hace en tiempo de ejecución según el tipo real del objeto. Regla práctica: mismo nombre + parámetros distintos + misma clase = overloading; mismo nombre + mismos parámetros + subclase = overriding. Overriding se cubre en [06-herencia-polimorfismo.md](06-herencia-polimorfismo.md).

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

---

## Llamar a métodos

> Docs: https://www.baeldung.com/java-pass-by-value-or-pass-by-reference → leer: "Parameter Passing in Java" — tanto "Passing Primitive Types" como "Passing Object References"

Antes de ver cómo se llama a un método, juntemos todo lo visto hasta ahora en un ejemplo completo — primero la clase con sus métodos, luego cómo se usan desde fuera:

```java
public class Calculator {
    // campos de la clase — el estado que carga cada objeto; se cubre en 04-oop-clases.md
    private String name;
    private List<String> history = new ArrayList<>();

    // constructor — se ejecuta cuando haces new Calculator("MyCalc"); se cubre en detalle en 04-oop-clases.md
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

Cada método es ahora del tipo correcto para lo que hace, y ese es el sentido del ejemplo: `add()` toca `this.name` y `this.history`, así que *tiene* que ser un método de instancia; `square()` no toca nada más que su argumento, así que `static` es lo correcto. Decidir esto no es cuestión de estilo — es el mecanismo de la sección anterior aplicado.

> `List<String>` y `ArrayList` son la lista redimensionable de Java — se cubren a fondo en [07-colecciones.md](07-colecciones.md). Por ahora léelo como "un array que puede crecer", y `history.add(...)` como "añadir un elemento al final".

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

### Cómo se pasan realmente los argumentos — Java siempre es pass-by-value

Aquí está la pregunta que todo lector se hace llegado este punto, y es la que hacen los entrevistadores precisamente porque la mayoría de candidatos la acierta solo a medias: *si cambio un parámetro dentro de un método, ¿lo ve quien llamó?* La respuesta honesta es "depende de qué entiendas por cambiar" — y en cuanto ves el mecanismo, deja de ser una moneda al aire.

La regla, en una línea: **Java copia el argumento en el parámetro. Siempre. Para un primitivo copia el valor; para un objeto copia la *referencia* — la flecha que apunta al objeto — nunca el objeto en sí.** No existe pass-by-reference en Java, para ningún tipo.

Empieza con un primitivo, donde no hay ninguna sorpresa:

```java
static void tryToChange(int hours) {
    hours = 999;              // edita la copia propia de este método
}

int worked = 8;
tryToChange(worked);
System.out.println(worked);   // 8 — no 999
```

`hours` es una variable completamente nueva que durante un instante guardó una copia de `8`. Asignarle un valor sobrescribió la copia. El `worked` de quien llamó nunca estuvo en la sala.

Los objetos son donde vive la confusión, así que separa lo que un método puede hacer con uno en dos casos — porque dan respuestas **opuestas**:

```java
// El objeto que pasamos: un Project con un name mutable
Project project = new Project();
project.setName("TimeTrack");
```

```java
// ✅ MUTAR el objeto — quien llamó LO VE
static void rename(Project p) {
    p.setName("Renamed");     // sigue la flecha, edita el único objeto compartido
}

rename(project);
System.out.println(project.getName());   // "Renamed"
```

```java
// ❌ REASIGNAR el parámetro — quien llamó NO lo ve
static void replace(Project p) {
    p = new Project();        // reapunta solo la flecha copiada de ESTE método
    p.setName("Renamed");
}

replace(project);
System.out.println(project.getName());   // "TimeTrack" — sin cambios
```

Los dos métodos parecen "cambiar el project". Dibuja lo que cada uno hace con las flechas y la diferencia se vuelve mecánica. Al entrar, la copia significa que dos flechas apuntan a un único objeto:

```
`project` de quien llama ──┐
                     ├──►  [ Project: name="TimeTrack" ]
`p` del método      ──┘
```

`rename` sigue la flecha y edita el objeto que comparten, así que ambos nombres ven el valor nuevo. `replace` construye un segundo objeto y reapunta **solo** la flecha propia del método hacia él — la flecha de quien llamó nunca se movió, y el objeto nuevo se descarta en cuanto el método termina:

```
`project` de quien llama ──────►  [ Project: name="TimeTrack" ]   ← quien llama sigue viendo esto

`p` del método      ──────►  [ Project: name="Renamed"   ]   ← se descarta al terminar
```

> **La única pregunta que responde cualquier variante de esta cuestión.** Pregúntate: *¿seguí la flecha, o la reapunté?* Llamar a un método sobre el parámetro o tocar sus campos (`p.setName(...)`, `list.add(...)`) sigue la flecha → quien llamó **lo ve**. Asignar al propio parámetro (`p = ...`) reapunta la copia → quien llamó **no lo ve**. Nada más importa, y vale para cualquier tipo de objeto.

> **Un parámetro `String` nunca te puede sorprender.** `String` es inmutable — no existe un equivalente a `setName()` sobre él — así que el caso de "mutar" no existe y solo es posible la reasignación, que es invisible para quien llama. Por eso pasar un `String` se siente como pasar un primitivo aunque sea un objeto. Los arrays, en cambio, *sí* son objetos con casillas mutables: `arr[0] = 99` dentro de un método es una mutación, y quien llamó lo ve.

> **Hacia dónde va esto después.** Dos preguntas se quedan deliberadamente abiertas aquí porque son preguntas de memoria, no de métodos: *por qué* se copia la flecha en lugar del objeto entero, y *dónde* se sitúan físicamente la flecha copiada y el objeto compartido. [15-modelo-de-memoria.md](15-modelo-de-memoria.md) retoma exactamente este tema y responde ambas trazando la división entre el stack y el heap — versión corta por ahora: una referencia es un único valor pequeño de tamaño fijo sin importar lo grande que sea el objeto, así que copiarla sale gratis. Todo lo de arriba sigue siendo cierto allí; solo gana una dirección de memoria. Ese archivo es también donde vive el enfoque de entrevista, así que si estás repasando para una, léelo ahí en lugar de volver a deducirlo aquí.

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

Esos getters y setters son tu primera pista de un patrón mayor: los métodos rara vez viven solos — envuelven los *campos* de una clase y controlan cómo el mundo exterior los lee y los modifica. Ese acoplamiento entre campos y métodos, junto con los constructores y la encapsulación, es justo el tema de la siguiente nota. Continúa en [04-poo-clases.md](04-poo-clases.md), donde el `Calculator` que acabas de ver se convierte en una clase completa con estado.
