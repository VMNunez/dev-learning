# OOP — Clases

> 📖 [Baeldung — A guide to Java classes and objects](https://www.baeldung.com/java-classes-objects) → leer: "2. Classes" y "3. Objects"
> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## Qué es la programación orientada a objetos

> Docs: https://www.baeldung.com/java-oop → leer: "1. Overview" y "4. Abstraction" — los cuatro pilares nombrados en un solo sitio; te encontrarás con cada uno a lo largo de este archivo y de los dos siguientes

Al final de [03-metodos.md](03-metodos.md) convertiste la `Calculator` en algo con un campo y un constructor — un pequeño objeto que guarda estado *y* los métodos que trabajan sobre él. Eso no es un detalle de un ejemplo suelto; es la idea entera de la que trata este archivo.

La **programación orientada a objetos** (OOP) es una forma de organizar el código agrupando los datos y el comportamiento que actúa sobre ellos en unidades únicas llamadas **objetos**. En lugar de funciones sueltas flotando junto a variables sueltas, defines **clases** que juntan ambas cosas.

Tomemos un `Employee`. En un estilo no orientado a objetos podrías tener un string `name` por aquí, un string `email` por allá, y funciones separadas `getName(name)`, `setEmail(...)` en otro lado — nada que las ate entre sí. En OOP el `Employee` *es* una sola cosa que lleva sus propios datos (`name`, `email`, `age`) **y** los métodos que operan sobre esos datos (`getName()`, `setEmail()`, `isActive()`). Los datos y el comportamiento viven en la misma caja.

> **¿Por qué juntarlos siquiera?** Porque los métodos que cambian un dato deberían estar al lado de ese dato, protegiéndolo. Si `age` y `setAge()` viven juntos en un objeto, el objeto puede rechazar una edad inválida (ver *Encapsulación* más abajo). Sepáralos y nada impide que el mundo exterior ponga `age = -500` directamente. La OOP es lo que hace que un objeto pueda *protegerse a sí mismo* — el tema recurrente de todo este archivo.

Java es orientado a objetos casi al 100%: casi todo lo que escribes vive dentro de una clase. Ya lo has estado haciendo sin ponerle nombre — cada método `main` estaba dentro de una clase, y cada `String` o `Integer` que tocaste era un objeto. Este archivo por fin mira la clase misma de frente.

## Qué es una clase

> Docs: https://www.baeldung.com/java-classes-objects → leer: "2. Classes" y "3. Objects" — el par mínimo clase/instancia, explicado paso a paso

Una clase es el molde (blueprint) para crear objetos. Un objeto es una instancia de esa clase.

```java
// Blueprint
public class Employee {
    // Campos — los datos que guarda el objeto (siempre private)
    private String name;
    private String email;
    private int age;

    // Constructor — se ejecuta al crear un objeto nuevo con new
    public Employee(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // Getters — leen los campos private
    public String getName() { return name; }  // this.name también funciona; sin ambigüedad, Java entiende name como this.name
    public String getEmail() { return email; }
    public int getAge() { return age; }

    // Setters — modifican los campos private
    public void setEmail(String email) { this.email = email; }
}

// Creando un objeto a partir del blueprint
Employee emp = new Employee("Victor", "victor@example.com", 31);
System.out.println(emp.getName());   // "Victor"
```

La clase se escribe una vez; los objetos se estampan a partir de ella tantas veces como llames a `new`. Cada objeto obtiene su **propia** copia de los campos — cambia uno y los demás quedan intactos:

```
        class Employee            <- el molde (una definición, escrita una vez)
        ┌──────────────────┐
        │ name  : String   │
        │ email : String   │
        │ age   : int      │
        └──────────────────┘
                 │  new Employee(...)  new Employee(...)
                 ▼                 ▼
   emp1 ┌──────────────────┐   emp2 ┌──────────────────┐
        │ name  = "Victor" │        │ name  = "Ana"    │   <- objetos separados (instancias),
        │ email = "v@e.com"│        │ email = "a@e.com"│      cada uno con sus propios valores de campo
        │ age   = 31       │        │ age   = 28       │
        └──────────────────┘        └──────────────────┘
```

> **El blueprint es literal.** La clase no guarda datos propios — `name`/`email`/`age` son solo *huecos* que el molde promete que todo objeto tendrá. Los valores reales solo existen una vez que haces `new` de un objeto. Piensa en la clase como el plano de un arquitecto y en cada objeto como una casa construida a partir de él: el plano dice "aquí hay una puerta de entrada", cada casa tiene su propia puerta real.

### Lo que hace `new` en realidad

`new` está haciendo tres trabajos distintos en una sola palabra, y el resto de este archivo solo cobra sentido en cuanto puedes nombrarlos:

1. **Reserva memoria** para un objeto nuevo — suficiente espacio para una copia de cada campo que declara la clase. Esa memoria viene de una región compartida llamada el **heap**, y los huecos de los campos empiezan con sus valores por defecto (`null` para objetos, `0` para números, `false` para `boolean`) antes de que tu código los toque.
2. **Ejecuta el constructor** sobre esa memoria en bruto, que es lo que rellena los huecos con valores reales.
3. **Devuelve una referencia** al objeto terminado — no el objeto en sí, sino la dirección donde vive.

Ese tercer paso es el que más importa. Cuando escribes `Employee emp = new Employee(...)`, la variable `emp` no *contiene* al empleado: contiene una flecha que apunta a él. Dos variables pueden guardar flechas hacia un mismo objeto único, y precisamente por eso `==` y `equals()` responden preguntas distintas más adelante en este archivo — `==` compara las flechas, `equals()` compara aquello a lo que apuntan.

```
   emp  ●───────────►  ┌────────────────────────┐
                       │ Employee               │   el objeto en sí, en el heap
   emp2 ●───────────►  │  name  = "Victor"      │   ambas variables guardan una flecha
                       │  email = "v@e.com"     │   hacia la MISMA caja
                       └────────────────────────┘
```

> **¿Y a dónde va esa memoria después?** Nada en tu código la libera. Java rastrea si alguna flecha sigue apuntando al objeto y lo recupera automáticamente en cuanto ninguna lo hace — el recolector de basura (garbage collector). El cuadro completo de stack, heap y recolección es el último archivo de estas notas, [15-modelo-de-memoria.md](15-modelo-de-memoria.md); por ahora te basta con "`new` pone el objeto en el heap y te da una flecha hacia él".

---

## `this`

> Docs: https://www.baeldung.com/java-this → leer: "2. Disambiguating Field Shadowing" y "3. Referencing Constructors of the Same Class" — los dos usos que cubre esta sección, en ese orden

Mira el constructor de *Qué es una clase*: el parámetro se llama `name` y el campo también se llama `name`. Entonces, ¿qué significa un simple `name = name`? Java resuelve cualquier nombre hacia el *más cercano* que esté en el ámbito, y el parámetro está más cerca que el campo — así que `name` a secas siempre significa el parámetro, y `name = name` se limita a asignarse el parámetro a sí mismo, dejando el campo intacto. Necesitas una forma de decir "el campo, no el parámetro". Esa palabra es `this`.

`this` es una referencia al objeto actual — la instancia concreta cuyo constructor o método se está ejecutando en este momento. Anteponer `this.` a un campo pasa por encima del parámetro y apunta al hueco propio del objeto:

```java
public Employee(String name) {
    this.name = name;   // this.name = el campo de este objeto; name = el parámetro
}
```

> **¿Por qué mantener el mismo nombre siquiera — por qué no llamar al parámetro `n`?** Podrías, pero nombrar el parámetro igual que el campo que rellena es el convenio estándar en Java: documenta a qué campo va el valor, y `this.` elimina el único inconveniente (la ambigüedad). Leer `this.email = email` te dice de un vistazo "el email entrante pasa a ser el email de este objeto".

También se usa para llamar a otro constructor desde dentro de un constructor. Ambos constructores pertenecen a la misma clase — es una forma de reutilizar la lógica de inicialización cuando uno de los constructores es un caso especial del otro:

```java
public class Employee {
    private String name;
    private String email;

    // Constructor de un parámetro — delega en el de dos para no duplicar código
    public Employee(String name) {
        this(name, "unknown@email.com");   // llama al constructor de dos parámetros de esta misma clase
    }

    // Constructor de dos parámetros — contiene la lógica de inicialización real
    public Employee(String name, String email) {
        this.name = name;
        this.email = email;
    }
}

new Employee("Victor");                        // name="Victor", email="unknown@email.com"
new Employee("Victor", "victor@example.com"); // name="Victor", email="victor@example.com"
```

Siempre que veas `this(...)` dentro de un constructor, significa "llama a otro constructor de esta misma clase con estos argumentos." En la práctica casi siempre lo escribirás como la **primera línea**, y hasta hace poco el compilador te obligaba a hacerlo.

> **Por qué la delegación va primero.** El único trabajo de un constructor es llevar al objeto desde memoria cruda y sin inicializar hasta un estado completamente válido. Las sentencias que se ejecutan *antes* de la delegación están trabajando sobre un objeto a medio construir, y el constructor delegado luego se ejecuta y sobrescribe lo que hicieran — tirando en silencio ese trabajo. Por eso "delega primero, y añade tus propias líneas encima de un objeto ya correctamente inicializado" es la forma que quieres, y la que usará cualquier código que leas.

> **La regla se relajó en Java 25 — pero la razón sigue vigente.** Hasta Java 21, `this(...)` (y `super(...)`) tenía que ser literalmente la primera sentencia, y cualquier cosa antes era un error de compilación. Java 25 consolidó los **cuerpos de constructor flexibles**: ahora puedes ejecutar un *prólogo* antes de delegar — validación de argumentos, un valor calculado una vez y pasado a ambas ramas — siempre que no toque el objeto que se está construyendo. En el momento en que el prólogo lee un campo o llama a un método de instancia, el compilador te detiene, porque ese objeto todavía no existe:
>
> ```java
> public Employee(String name) {
>     System.out.println(this.name);   // ❌ lee un campo que todavía no se ha creado
>     this(name, "unknown@email.com");
> }
> ```
>
> ```
> error: cannot reference this before supertype constructor has been called
>     System.out.println(this.name);
>                        ^
> ```
>
> Fíjate en lo que el compilador *no* te impide: escribir `this.name = "early";` antes de la delegación compila sin problema, y el constructor delegado luego lo sobrescribe. La regla antigua hacía imposible ese error; ahora es legal y silencioso. Mantén `this(...)` como primera línea salvo que tengas una razón concreta para no hacerlo.

---

## Constructores

> Docs: https://www.baeldung.com/java-constructors → leer: "3. A No-Argument Constructor" y "4. A Parameterized Constructor" — las dos formas que contrasta esta sección

Un constructor es el método especial que se ejecuta cuando creas un objeto con `new`. Dos reglas fijas: (1) debe llamarse exactamente igual que la clase, y (2) no tiene tipo de retorno — ni siquiera `void`. Así es como el compilador lo distingue de un método normal.

```java
public class Employee {
    private String name;
    private int age;

    // Constructor — mismo nombre que la clase, sin tipo de retorno
    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// Se invoca con new — Java ejecuta el constructor automáticamente
Employee emp = new Employee("Victor", 31);
```

### Cómo es el objeto antes de que se ejecute el constructor

El cuerpo del constructor no es el lugar donde los campos empiezan a existir — `new` ya ha reservado los huecos para entonces (ver *Lo que hace `new` en realidad* más arriba). Cada hueco arranca con el **valor por defecto** de su tipo, y el trabajo del constructor es sobrescribir esos valores por defecto con datos reales. Puedes ver esto en vivo imprimiendo los campos en la primerísima línea del constructor, antes de cualquier asignación:

```java
public class Employee {
    private String name;      // el hueco existe, contiene null
    private int age;          // el hueco existe, contiene 0
    private boolean active;   // el hueco existe, contiene false

    public Employee(String name) {
        System.out.println(this.name + " " + age + " " + active);  // imprime: null 0 false
        this.name = name;
    }
}
```

> **El `this.` de esa primera línea está haciendo un trabajo real.** Quítalo y imprimirías `Victor 0 false`, no `null 0 false` — porque un `name` a secas resuelve al parámetro, exactamente como explicó §`this`, y el parámetro ya tiene el valor que le pasaste a `new`. Solo `this.name` mira dentro del hueco propio del objeto, que es lo que todavía está vacío en ese momento. `age` y `active` no necesitan prefijo porque ningún parámetro los tapa.

> **Esta es la diferencia entre un campo y una variable local.** Una variable local dentro de un método no tiene valor por defecto — léela antes de asignarla y el compilador se niega a construir (`variable count might not have been initialized`). Un *campo*, en cambio, siempre tiene valor por defecto, porque `new` pone a cero la memoria que entrega. Por eso un campo `int` es `0` y nunca basura, y por eso olvidar asignar un campo en el constructor te da un `null` silencioso en lugar de un error de compilación — un bug que el compilador no te va a atrapar.

### El constructor por defecto, y cómo lo pierdes

Si no escribes ningún constructor, el compilador te ofrece uno en silencio: sin parámetros, cuerpo vacío. Esa es la razón entera por la que `new Employee()` funciona en una clase donde nunca escribiste `Employee()`.

La regla de fondo es más estrecha de lo que parece: **el compilador solo te ofrece ese constructor cuando no declaraste ninguno.** Es un respaldo, no un añadido. Declara cualquier constructor — aunque sea uno solo — y ese respaldo deja de generarse, así que la forma sin argumentos deja de existir:

```java
public class Employee {
    private String name;
    private int age;

    public Employee(String name, int age) {   // en cuanto este existe, Employee() deja de existir
        this.name = name;
        this.age = age;
    }
}

Employee emp = new Employee();   // ❌ no compila
```

```
error: constructor Employee in class Employee cannot be applied to given types;
        Employee emp = new Employee();
                       ^
  required: String,int
  found:    no arguments
  reason: actual and formal argument lists differ in length
```

> **¿Por qué el compilador te lo quita en lugar de conservar ambos?** Porque un constructor con parámetros es una afirmación sobre lo que un objeto necesita para ser válido. Si exiges un `name` y una `age`, un `Employee` vacío con `null` y `0` dentro es exactamente el objeto que estabas intentando impedir. Dejar la puerta sin argumentos abierta en silencio anularía el constructor que acabas de escribir. Si *sí* quieres ambos — el parametrizado y uno vacío — escribes el vacío tú mismo; de eso trata más abajo §"Sobrecarga de constructores". Esto también muerde en Spring Boot: JPA necesita un constructor sin argumentos para reconstruir una entidad a partir de una fila de la base de datos, que es por lo que la clase `User` de TimeTrack lleva `@NoArgsConstructor` de Lombok junto a `@AllArgsConstructor` (`projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/User.java`) — escribir solo el que recibe todos los argumentos habría eliminado el vacío que JPA necesita.

### Un constructor `private` — cuando nadie puede instanciar

Los constructores son *normalmente* `public`, ya que el propósito de la mayoría de las clases es que otro código cree objetos a partir de ellas. Pero el modificador es una elección real, no una formalidad, y marcar un constructor como `private` significa "ningún código fuera de esta clase puede llamar a `new` sobre mí":

```java
public final class ValidationUtils {
    private ValidationUtils() {}   // nadie instancia esto — es una bolsa de helpers static

    public static boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}

new ValidationUtils();   // ❌ error: ValidationUtils() has private access in ValidationUtils
```

> **¿Por qué molestarse en prohibirlo?** Una clase cuyos métodos son todos `static` no tiene nada por-objeto que guardar — una instancia suya sería una caja vacía sin propósito, y crear una le indicaría a quien lea el código que lleva estado cuando no es así. El constructor privado convierte esa intención en algo que el compilador impone, en lugar de un comentario. El mismo truco es cómo funciona el patrón singleton: la clase esconde su constructor y reparte una única instancia compartida a través de un método estático, para que nadie pueda crear una segunda a sus espaldas.

---

## Encapsulación

> Docs: https://www.baeldung.com/java-oop → leer: "5. Encapsulation" — la forma campo-privado-más-accesor, y por qué es uno de los cuatro pilares

Los campos son siempre `private` — solo se puede acceder a ellos a través de los propios métodos de la clase (getters/setters). Esto protege los datos de ser cambiados directamente desde fuera:

```java
public class Employee {
    private String name;   // private — nadie fuera puede tocarlo directamente
    private int age;       // private — solo se accede a través de getters/setters

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return this.name; }   // getter — acceso de lectura controlado
    public int getAge() { return this.age; }         // getter — acceso de lectura controlado
    public void setAge(int age) {                    // setter con validación
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        this.age = age;
    }
}
```

La protección no es una convención que se confía en que quien llama respete — `private` la impone el compilador, y el código fuera de la clase ni siquiera compila:

```java
// ❌ MAL — acceder al campo directamente, desde fuera de la clase
emp.age = -500;
// error: age has private access in Employee
//     emp.age = -500;
//        ^

// ✅ BIEN — la única puerta de entrada es el setter, que valida primero
emp.setAge(-500);   // throws IllegalArgumentException: Age cannot be negative
```

> **Fíjate dónde ocurre cada fallo.** La primera línea no es un bug que encuentras en producción — es una subraya roja en IntelliJ; la clase es inalcanzable desde fuera, punto. La segunda línea *compila*, porque llamar a `setAge` es legal; falla en tiempo de ejecución, en los propios términos del objeto, con el mensaje que el objeto eligió. Ese es todo el trato que hace la encapsulación: convierte "cualquiera puede poner cualquier cosa en este campo" en "el campo solo puede cambiar a través de un método que tiene derecho a decir que no".

### La fuga que rompe la encapsulación de todos modos

Hacer los campos `private` es la parte que todo el mundo recuerda. La parte que realmente sale mal en código real es esta: **un getter que devuelve el objeto interno le entrega a quien llama una flecha viva hacia tu estado.** Nada se hizo público, y aun así el mundo exterior ahora puede cambiar el objeto por la espalda:

```java
public class Employee {
    private final List<String> skills = new ArrayList<>();

    // ❌ MAL — devuelve la lista PROPIA del objeto
    public List<String> getSkills() {
        return skills;
    }
}

Employee emp = new Employee();
emp.getSkills().add("Java");   // compila, se ejecuta y muta la lista interna del employee
```

El campo es `private`. Incluso es `final`. Ninguna de las dos cosas ayuda, porque — como estableció *Lo que hace `new` en realidad* — el getter devuelve la flecha, no una copia, así que quien llama y el objeto ahora apuntan a una única lista. `final` solo congela hacia qué lista apunta el campo; no dice nada sobre qué se le puede añadir.

```java
public class Employee {
    private final List<String> skills = new ArrayList<>();

    // ✅ BIEN — entrega una foto de solo lectura; la lista interna sigue siendo private
    public List<String> getSkills() {
        return List.copyOf(skills);
    }

    // la única forma soportada de cambiar el estado: un método que el objeto controla
    public void addSkill(String skill) {
        if (skill == null || skill.isBlank()) throw new IllegalArgumentException("Skill required");
        skills.add(skill);
    }
}

emp.getSkills().add("Angular");   // lanza UnsupportedOperationException — la copia es inmutable
```

A esta jugada se le llama **copia defensiva**: nunca dejas que una referencia a tu estado mutable se escape. `List.copyOf(...)` devuelve una lista no modificable, así que un intento de escribir a través de ella falla de forma ruidosa en lugar de corromper el objeto en silencio.

> **¿Por qué un campo `String` es seguro sin nada de esto?** Porque `String` es inmutable — no hay ningún método sobre él que cambie su contenido, así que entregar la referencia no le da a quien llama nada que romper. La regla se deduce de ahí: devuelve las cosas inmutables libremente, copia las mutables. `List`, `Map`, `Date` y tus propias clases con setters son mutables; `String`, `Integer`, `LocalDate` y los records de componentes inmutables no lo son.

> **Los objetos de solo lectura llevan la idea más lejos.** Elimina los setters por completo y marca cada campo como `final`, y el objeto no puede cambiar después de la construcción en absoluto — sin validación que escribir, sin fuga que vigilar, y es seguro compartirlo en cualquier sitio. Eso es exactamente lo que §"Records" al final de este archivo te da como una sola línea.

> **La forma `getX()` / `setX()` / `isX()` no es solo estilo.** Es la convención **JavaBeans**, y Jackson, JPA y Lombok localizan una propiedad buscando esos nombres exactos de método en tiempo de ejecución — renombra `getName()` a `fetchName()` y el campo desaparece en silencio de tu JSON. Se explica en detalle en [03-metodos.md](03-metodos.md) §"Naming conventions"; la versión de una línea es: nombra los accesores así o tres herramientas distintas dejan de ver tus datos.

---

## Campos y métodos estáticos

> Docs: https://www.baeldung.com/java-static → leer: "2. The static Fields (Or Class Variables)", "3. The static Methods (Or Class Methods)" y "6. Understanding the 'Non-static variable' Error"

"Miembros" es el término general para los campos y métodos de una clase. Los miembros `static` pertenecen a la clase en sí, no a ningún objeto individual. `static` tiene sentido en dos situaciones: (1) cuando el método solo trabaja con sus argumentos y no necesita datos de la instancia — como `Integer.parseInt("42")`; (2) cuando quieres un campo compartido entre todas las instancias — como un contador de cuántos objetos se han creado.

"Pertenece a la clase, no a ningún objeto" no es solo un eslogan — es un hecho sobre *dónde vive físicamente el valor en memoria*. Un campo normal (no estático) obtiene **un hueco por objeto**: crea tres `Employee` y hay tres huecos `name` separados, uno dentro de cada objeto, como mostró el diagrama de *Qué es una clase*. Un campo `static` es distinto — Java reserva **exactamente un hueco**, ligado a la clase misma, y todos los objetos comparten ese mismo hueco:

```
   static int count  ──►  ┌─────────┐   un hueco compartido, propiedad de la clase
                          │   3     │   (todas las instancias leen/escriben la MISMA caja)
                          └─────────┘
                             ▲  ▲  ▲
                             │  │  │
        emp1 ────────────────┘  │  └──────────────── emp3
        (name="Victor")     emp2 (name="Ana")   (name="Leo")
        cada uno tiene su PROPIO hueco name, pero todos apuntan al ÚNICO count
```

Esto es exactamente por qué funciona el contador: como solo hay una caja `count` en todo el programa, cada constructor que hace `count++` está incrementando la *misma* caja. Si cada objeto tuviera su propio `count`, todos se quedarían en `1` y el total se perdería. Un método `static` funciona igual — hay una copia del método ligada a la clase, y como no está atada a ningún objeto no puede leer campos por objeto (no hay ningún "este objeto" dentro del que mirar).

```java
public class Employee {
    private static int count = 0;   // compartido por TODAS las instancias
    private String name;

    public Employee(String name) {
        this.name = name;
        count++;   // cada Employee nuevo incrementa el contador compartido
    }

    public static int getCount() {
        return count;
    }
}

Employee.getCount();   // se llama sobre la clase, no sobre una instancia
```

### Un método `static` no tiene `this`

La consecuencia de "una copia, ligada a la clase" aparece la primera vez que intentas tocar un campo normal desde un método `static`. No hay ningún objeto involucrado en la llamada — `Employee.getCount()` nombra a la clase, no a una instancia — así que no hay ningún `this` dentro del que el método pueda mirar, y por lo tanto ningún `name` que leer:

```java
public class Employee {
    private String name;

    public static String shout() {
        return name.toUpperCase();   // ❌ ¿el name de qué employee? aquí no hay ningún objeto
    }
}
```

```
error: non-static variable name cannot be referenced from a static context
    public static String shout() { return name.toUpperCase(); }
                                          ^
```

La solución es hacer que el valor llegue como argumento (`shout(String name)`) o quitar `static` para que el método se llame sobre un objeto. Ya te encontraste con el mismo error desde el otro lado en [03-metodos.md](03-metodos.md) §"Static methods" — también es la razón por la que `main` debe ser `static`: la JVM tiene que llamarlo antes de que exista un solo objeto.

### Cuándo se inicializa el campo estático

Un campo `static` se configura **una sola vez, cuando se carga la clase** — antes de que exista ninguna instancia, y antes de que `main` ejecute una sola línea de tu lógica. Los campos de instancia se inicializan por objeto, cada vez que llamas a `new`; un campo estático se inicializa por *clase*, exactamente una vez, durante toda la vida del programa.

Para algo más elaborado que una sola asignación, hay un lugar dedicado para poner esa configuración de una sola vez: un **bloque de inicialización estático** — un bloque `static { ... }` a secas en el cuerpo de la clase, que se ejecuta en el momento de cargar la clase, en el orden en que aparece:

```java
public class Employee {
    private static final Map<String, Integer> LEVELS = new HashMap<>();

    static {                       // se ejecuta una vez, al cargar la clase, antes de que exista ningún Employee
        LEVELS.put("junior", 1);
        LEVELS.put("mid", 2);
        LEVELS.put("senior", 3);
    }
}
```

> **¿Por qué un bloque en lugar de escribirlo directamente en el constructor?** Porque el constructor se ejecuta en cada `new` — poner ahí la configuración compartida reconstruiría la misma tabla para el décimo empleado igual que para el primero, y peor aún, la tabla no existiría hasta que alguien creara un objeto por casualidad. El bloque estático ata ese trabajo al momento en que se carga la clase, que es cuando el hueco compartido realmente pasa a existir. Se ejecuta como máximo una vez, tanto si creas mil objetos como si no creas ninguno.

---

## Sobrecarga de constructores

> Docs: https://www.baeldung.com/java-constructors → leer: "6. A Chained Constructor" — el par que delega, y cómo el compilador distingue las sobrecargas

Ya has escrito un par de constructores sobrecargados: el ejemplo de los dos constructores de `Employee` en §`this` — una forma de un parámetro que delega en una de dos — *es* sobrecarga de constructores. El nombre viene de la sobrecarga de métodos en [03-metodos.md](03-metodos.md): varios miembros que comparten nombre, distinguidos por su **firma**, es decir, el tipo y el orden de sus parámetros. Los constructores comparten a la fuerza el nombre de la clase, así que la lista de parámetros es lo único que puede distinguirlos, y puedes declarar tantos como quieras.

Lo que esa sección no cubrió es cómo decide Java *cuál* de ellos ejecuta un `new` concreto. Esa es la pieza que vale la pena añadir aquí, porque es donde la sobrecarga deja de ser obvia.

### Qué constructor gana

El compilador resuelve la llamada en tiempo de compilación, a partir de los tipos estáticos de los argumentos, en el mismo orden que para los métodos: primero una coincidencia exacta, luego una conversión de **ensanchamiento** (widening) (un argumento `int` aceptado por un parámetro `long`), luego **boxing** (un `int` aceptado por un `Integer`), y por último los **varargs** como último recurso. Nunca adivina en tiempo de ejecución — la elección queda fijada dentro del código compilado.

La regla se rompe cuando dos candidatos son igual de buenos, y el compilador se niega en lugar de elegir uno:

```java
public class Employee {
    public Employee(String name) { }
    public Employee(Integer id) { }
}

new Employee(null);   // ❌ ¿String o Integer? los dos aceptan null
```

```
error: reference to Employee is ambiguous
    Employee e = new Employee(null);
                 ^
  both constructor Employee(String) in Employee and constructor Employee(Integer) in Employee match
```

> **¿Cómo sales de ahí?** Dile al compilador cuál quieres decir tipando el `null`: `new Employee((String) null)` compila y elige el primero. Pero el cast es una señal, no una solución — si quien llama necesita un cast para decir lo que quiere decir, los dos constructores también son ambiguos *para los humanos*. La solución habitual de verdad es un método de fábrica estático con un nombre que diga cuál es cuál (`Employee.fromName(...)` / `Employee.fromId(...)`), porque un nombre puede distinguir dos cosas que una forma de parámetros compartida no puede.

---

## `toString()`

> Docs: https://www.baeldung.com/java-tostring → leer: "2. Default Behavior" y "3. Overriding Default Behavior" — qué obtienes gratis y qué cambia cuando lo sobrescribes

Cuando haces `System.out.println(emp)`, Java necesita convertir el objeto a texto. Busca un método llamado exactamente `toString()` en tu clase — si no lo encuentra, recurre al de `Object`, que imprime algo ilegible como `Employee@1b6d3586` (nombre de la clase + dirección de memoria, inútil para depurar).

> **¿De dónde sale ese recurso de respaldo, si tu clase no tiene padre?** Toda clase en Java extiende implícitamente una clase llamada `Object`, la escribas o no — `public class Employee { }` se compila como si dijera `extends Object`. `Object` ya define `toString()`, `equals()` y `hashCode()`, así que esos tres métodos existen en *todo* objeto que se haya creado alguna vez, incluido el tuyo, antes de que escribas una sola línea. Ese es el mecanismo detrás de esta sección entera y la siguiente: nunca estás añadiendo estos métodos, siempre estás reemplazando uno heredado. La herencia en sí — qué significa `extends`, cómo una subclase reemplaza el método de un padre — es el tema de [06-herencia-polimorfismo.md](06-herencia-polimorfismo.md), que vuelve a `Object` en su propia sección. Por ahora solo necesitas el dato: tu clase ya hereda estos tres, y se comportan mal por defecto.

El nombre `toString()` no lo eliges tú — es el nombre que Java espera por convenio. Siempre devuelve `String` y no recibe parámetros.

`@Override` le dice al compilador "estoy reemplazando este método de una clase padre." Si escribes mal el nombre (por ejemplo `tostring()` en minúsculas), sin `@Override` Java lo trataría como un método nuevo sin relación y tu `println` seguiría mostrando la dirección de memoria. Con `@Override` el compilador detecta el error de tipografía de inmediato, porque busca un método con esa firma exacta en `Object` y no lo encuentra:

```
error: method does not override or implement a method from a supertype
    @Override
    ^
```

Ese error es todo el valor de la anotación: sin ella, el método mal escrito compila perfectamente y no hace nada, y te pasas una tarde preguntándote por qué tus logs siguen mostrando direcciones de memoria. Aprenderás las anotaciones en detalle en [13-anotaciones.md](13-anotaciones.md) — por ahora, basta con saber que `@Override` va encima de cualquier método que estés reemplazando intencionalmente.

```java
@Override
public String toString() {
    return "Employee{name='" + name + "', email='" + email + "'}";
}

System.out.println(emp);   // Employee{name='Victor', email='victor@example.com'}
```

---

## `equals()` y `hashCode()`

> Docs: https://www.baeldung.com/java-equals-hashcode-contracts → leer: "2.1. Overriding equals()" y "3. The .hashCode() Method" — la forma de la implementación; el contrato en sí es la siguiente sección de aquí

Ambos también se heredan de `Object` (ver el callout en §`toString()` más arriba), que es por lo que llamar a `emp1.equals(emp2)` compila en una clase donde nunca escribiste `equals` — siempre estás sobrescribiendo, nunca inventando.

Ya sabes que para los Strings usas `.equals()` en lugar de `==` porque `==` compara referencias (direcciones de memoria), no contenido. El mismo problema existe con cualquier objeto que tú definas.

Por defecto, si haces `emp1.equals(emp2)`, Java comprueba si son el mismo objeto en memoria — no si tienen los mismos datos. Si quieres que dos empleados sean "iguales" cuando tienen el mismo email, sobrescribes `equals()` en tu clase para definir qué significa "igual":

```java
// Dentro de la clase Employee:
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;                        // mismo objeto — trivialmente iguales
    if (!(obj instanceof Employee other)) return false;  // tipos distintos — no pueden ser iguales
    return Objects.equals(this.email, other.email);      // tu criterio de igualdad: mismo email
}
```

> **¿Qué es `other`, y por qué aparece de la nada?** El parámetro llega tipado como `Object` (esa es la firma que Java impone a `equals`), así que no puedes leer `obj.email` — el tipo `Object` no tiene `email`. Necesitas verlo como un `Employee`. `obj instanceof Employee other` hace dos trabajos en una línea: comprueba si `obj` es realmente un `Employee`, y *si lo es* declara una variable nueva `other` ya casteada a `Employee`, para que la línea siguiente pueda leer `other.email` con seguridad. Esta forma de "declarar la variable casteada en línea" es el **pattern matching para `instanceof`**, añadido en Java 16. Antes, escribías la comprobación y el cast como dos pasos separados:
>
> ```java
> if (!(obj instanceof Employee)) return false;
> Employee other = (Employee) obj;   // la forma antigua en dos pasos — comprobar, y luego castear a mano
> ```
>
> Ambas hacen lo mismo; la forma de Java 16 solo dobla el cast dentro de la comprobación para que nunca repitas el tipo.

> **¿Qué es `Objects`?** `Objects` (de `java.util`) es una pequeña clase de utilidad con helpers estáticos para exactamente este tipo de código. `Objects.equals(a, b)` compara dos valores pero sobrevive a `null` — si ambos son `null` devuelve `true`, y nunca lanza una `NullPointerException` como sí haría `a.equals(b)` cuando `a` es `null`. `Objects.hash(...)` toma cualquier número de campos y los combina en un solo `int` hash. Los usas para no tener que escribir a mano los null-checks y la aritmética de mezclado del hash.

`hashCode()` va siempre junto a `equals()` — las colecciones como `HashMap` y `HashSet` usan ambos para organizar los objetos. La regla es simple: si dos objetos son iguales según `equals()`, deben tener el mismo `hashCode()`. Si sobrescribes uno sin el otro, esas colecciones dejan de funcionar correctamente:

```java
@Override
public int hashCode() {
    return Objects.hash(email);  // el mismo campo que usaste en equals()
}
```

> **¿Por qué un `HashMap` necesita siquiera `hashCode()`?** Un `HashMap` no recorre cada clave una por una cuando buscas algo — eso sería lento. En su lugar mantiene un array de "buckets" (cubos), y usa el `hashCode()` de la clave como una dirección: aproximadamente `bucketIndex = hashCode % numberOfBuckets`. Para guardar o encontrar una clave salta directo a ese único bucket en vez de buscar por todo el mapa. Solo *dentro* de ese bucket recurre a `equals()` para distinguir claves que casualmente cayeron juntas. Ahora la regla cobra sentido mecánicamente: si dos objetos iguales devolvieran hash codes *distintos*, se enviarían a buckets *distintos* — guardarías una entrada bajo una dirección y luego la buscarías en otra, y el mapa juraría que la clave no está aunque una igual sí lo esté. Por eso los objetos iguales deben compartir `hashCode()`: es lo que garantiza que caigan en el mismo bucket donde `equals()` luego puede emparejarlos.

En la práctica, IntelliJ genera ambos automáticamente: `Code → Generate → equals() and hashCode()`.

---

## El contrato de `equals()`

> Docs: https://www.baeldung.com/java-equals-hashcode-contracts → leer: "2.2. The .equals() Contract" y "3.1. The .hashCode() Contract" — las cinco reglas y la regla del hash, con las violaciones explicadas

`equals()` parece un método que puedes implementar como quieras: recibe un `Object`, devuelve un `boolean`, nada te lo impide. Pero `HashMap`, `HashSet`, `List.contains()` y `List.remove()` lo llaman todos y todos asumen que se comporta con sensatez. Esas asunciones están escritas como un **contrato** — cinco reglas que tu implementación debe satisfacer. Rompe una y nada falla en tiempo de compilación; las colecciones simplemente empiezan a dar respuestas incorrectas.

| Regla | Qué exige | La rompe |
|---|---|---|
| Reflexiva | `x.equals(x)` es siempre `true` | comparar un campo que es `NaN`, o una marca de tiempo de "frescura" |
| Simétrica | si `x.equals(y)` entonces `y.equals(x)` | una subclase que acepta a su padre, mientras el padre rechaza a la subclase |
| Transitiva | si `x.equals(y)` y `y.equals(z)` entonces `x.equals(z)` | comparar sobre campos distintos según el tipo del argumento |
| Consistente | llamadas repetidas dan la misma respuesta, mientras nada de lo usado en la comparación haya cambiado | comparar sobre un campo mutable, o sobre la hora actual |
| Falso con null | `x.equals(null)` es `false`, nunca una excepción | leer un campo del argumento antes de la comprobación `instanceof` |

Lee la tabla como *obligaciones sobre tu código*, no como comportamiento que Java te da gratis: la columna del medio es lo que quien llama tiene derecho a asumir, y la columna de la derecha es el error que le quita esa garantía. El patrón `instanceof` de la sección anterior satisface la última regla sin esfuerzo, porque `null instanceof Employee` es `false` — que es exactamente por qué la implementación estándar empieza con esa comprobación en vez de con un test de `null`.

Hay una regla más, y conecta los dos métodos:

> **Los objetos iguales deben tener hash codes iguales — pero hash codes iguales NO implican objetos iguales.** La flecha solo apunta en un sentido, y la asimetría no es un defecto, es aritmética: un `hashCode()` devuelve un `int`, así que hay unos cuatro mil millones de valores posibles y una cantidad ilimitada de objetos posibles. Que dos objetos distintos caigan en el mismo número es inevitable — eso es una **colisión**, y un `HashMap` la resuelve manteniendo varias entradas en el mismo bucket y usando `equals()` para distinguirlas. Lo que un mapa no puede permitirse es la dirección contraria: dos objetos *iguales* con hash codes *distintos* se envían a buckets distintos, y `equals()` nunca llega a ejecutarse.

Esa asimetría tiene una consecuencia que merece verse, porque es una pregunta de entrevista clásica:

```java
@Override
public int hashCode() {
    return 42;   // técnicamente legal — nunca rompe el contrato
}
```

Este `hashCode()` es *correcto*. Los objetos iguales sin duda devuelven hash codes iguales, ya que todo devuelve 42. Lo que destruye es el rendimiento: cada clave cae en el mismo bucket, así que el mapa tiene una única cadena larga que recorrer y `get()` degenera de "saltar directo a la entrada" a "comparar contra cada clave que hayas guardado nunca". Un `HashMap` con un hash constante es una `List` disfrazada.

> **¿Qué campos deben ir en `equals()` entonces?** Los que identifican al objeto, y nada más — normalmente el identificador de negocio (`email` para un usuario, un número de factura para una factura). Nunca incluyas un campo mutable que cambia durante la vida del objeto, o rompes la *consistencia*: un objeto guardado en un `HashSet` bajo un hash se vuelve imposible de encontrar en cuanto cambias ese campo, porque el set sigue mirando en el bucket viejo. Y elijas los campos que elijas para `equals()`, usa exactamente los mismos en `hashCode()` — eso es lo que mantiene a los dos sincronizados.

---

## `equals()` y `hashCode()` en una entidad JPA

> Docs: https://www.baeldung.com/jpa-entity-equality → leer: "2.2. Transient Entities" y "3.3. Using a Business Key" — el problema del id nulo y la respuesta a la que llega esta sección

> **Vista previa — Spring Boot:** esta sección usa entidades JPA — clases que Spring mapea a filas de la base de datos. Las estudiarás en detalle en las notas de Spring Boot; aquí son el caso que muestra por qué el contrato de arriba no es solo académico. La clase de la que habla es real: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/User.java`.

La respuesta obvia a "¿qué campo identifica a un `User`?" es el id de la base de datos. En TimeTrack, `User` lleva uno:

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    // name, email, password, role, active
}
```

`@GeneratedValue` significa que la base de datos asigna el id, y la base de datos solo ve el objeto cuando lo guardas. Así que un `User` que acabas de crear con `new` tiene `id == null`, y sigue así hasta el momento en que se persiste. Escribe el `equals()` natural sobre `id` y las dos mitades del contrato se desmoronan:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof User other)) return false;
    return Objects.equals(id, other.id);   // ❌ null == null antes de que ninguno se haya guardado
}

@Override
public int hashCode() {
    return Objects.hash(id);
}
```

```java
// el constructor de 6 argumentos es el que @AllArgsConstructor genera sobre User:
// (Long id, String name, String email, String password, Role role, boolean active)
Set<User> batch = new HashSet<>();
batch.add(new User(null, "Ana",    "ana@e.com",    "hash", Role.EMPLOYEE, true));
batch.add(new User(null, "Victor", "victor@e.com", "hash", Role.EMPLOYEE, true));
System.out.println(batch.size());   // imprime 1 — dos users distintos, ambos con id null, "iguales"
```

El segundo fallo es peor, porque ocurre después de que el objeto ya está dentro de una colección:

```java
Set<User> batch = new HashSet<>();
User u = new User(null, "Victor", "victor@e.com", "hash", Role.EMPLOYEE, true);
batch.add(u);                  // se calcula el hash con id == null
userRepository.save(u);        // JPA rellena id = 1
System.out.println(batch.contains(u));   // imprime false — el set sigue conteniéndolo, en el bucket viejo
```

Nada lanza una excepción. El set contiene un objeto que jura no contener, porque `hashCode()` cambió por debajo mientras la búsqueda ahora va a otro bucket. Esta es la regla de *consistencia* de la tabla de arriba, rota por un campo que el framework muta por ti.

> **¿Entonces por qué no comparar todos los campos, como hace `@Data` de Lombok?** Eso es exactamente lo que el `User` de TimeTrack tiene ahora mismo — `@Data` genera `equals`/`hashCode` sobre todos los campos, `password` y `active` incluidos. De ahí surgen dos problemas. Primero, la misma rotura de consistencia: cambia el `role` del usuario y el objeto se vuelve imposible de encontrar en cualquier set que ya lo contenga. Segundo, y específico de JPA: un campo de la entidad puede ser una relación **lazy** que el framework todavía no ha cargado, y tocarla dentro de `equals()` dispara una consulta extra a la base de datos — o lanza una excepción, si la sesión de persistencia ya está cerrada. `@Data` sobre una entidad es rápido de escribir y silenciosamente incorrecto; la recomendación estándar es `@EqualsAndHashCode(onlyExplicitlyIncluded = true)`, o escribir los dos métodos a mano.

La respuesta a la que ha llegado el ecosistema es una **clave de negocio**: un campo que identifica la fila en el mundo real, que existe antes de que intervenga la base de datos, y que nunca cambia. Para `User` esa es la `email` — y fíjate que ya está declarada `@Column(nullable = false, unique = true)`, que es la base de datos diciendo lo mismo:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof User other)) return false;
    return Objects.equals(email, other.email);   // estable antes y después de guardar
}

@Override
public int hashCode() {
    return Objects.hash(email);
}
```

> **¿Por qué el `hashCode()` sobre una clave de negocio sobrevive a un guardado cuando la versión con id no lo hacía?** Porque nada del email cambia cuando se escribe la fila. El hash del objeto es el mismo valor antes de `save()` y después, así que se queda en el bucket bajo el que fue archivado, y un `contains()` después de persistir lo encuentra. Ese es el criterio entero para elegir el campo: no "qué es único en la base de datos", sino "qué es único *y ya se conoce* en el instante en que el objeto existe".

---

## Records (Java 16+) — clases de datos inmutables

> Docs: https://www.baeldung.com/java-record-keyword → leer: "3. The Basics" para lo que se genera y "4. Constructors" para el constructor compacto

Cuando tienes una clase que solo transporta datos — sin lógica de negocio, solo campos y sus getters — acabas escribiendo mucho código repetitivo: constructor, `toString`, `equals`, `hashCode`, y un getter por cada campo. Java 16 introdujo los records para eliminar todo ese boilerplate.

Antes (clase normal):

```java
public class EmployeeDTO {
    private final String name;
    private final String email;

    public EmployeeDTO(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }

    @Override public boolean equals(Object o) { ... }
    @Override public int hashCode() { ... }
    @Override public String toString() { ... }
}
```

Ahora (record):

```java
public record EmployeeDTO(String name, String email) {}

// Genera automáticamente todo lo de arriba:
// - constructor: new EmployeeDTO("Victor", "v@e.com")
// - getters: name(), email()   ← sin prefijo "get" en los records
// - equals(), hashCode(), toString()
```

Los records son inmutables — sin setters. Son perfectos para transportar datos entre capas de una aplicación web (este patrón se llama DTO — Data Transfer Object).

### Qué significa "inmutable" aquí, y qué no significa

Los componentes de un record son implícitamente `final`. Eso no es una convención que el compilador espera que sigas — intenta asignar uno, incluso desde dentro del propio record, y la compilación se detiene:

```java
public record EmployeeDTO(String name) {
    void rename() { this.name = "other"; }   // ❌
}
```

```
error: cannot assign a value to final variable name
    void rename() { this.name = "other"; }
                        ^
```

Pero `final` congela la *referencia*, exactamente igual que hizo con el getter con fuga de §"Encapsulación" — así que la inmutabilidad de un record es solo tan profunda como sus componentes. Guarda una `List` en uno y la lista sigue siendo perfectamente mutable a través del accesor que el record generó por ti:

```java
public record EmployeeDTO(String name, List<String> skills) {}

List<String> skills = new ArrayList<>(List.of("Java"));
EmployeeDTO dto = new EmployeeDTO("Victor", skills);
dto.skills().add("Angular");
System.out.println(dto);   // EmployeeDTO[name=Victor, skills=[Java, Angular]]
```

A esto se le llama **inmutabilidad superficial**: nadie puede hacer que el record apunte a una lista *distinta*, y cualquiera puede cambiar la lista a la que apunta. Si necesitas que la garantía llegue hasta el fondo, los componentes del record deben ser en sí mismos tipos inmutables (`String`, `int`, `LocalDate`, `List.copyOf(...)`) — la misma regla de copia defensiva de §"Encapsulación", aplicada ahora en el momento de la construcción en lugar del getter.

### El constructor compacto — validar un record

"Sin setters" plantea la pregunta obvia: si el único momento en que se pueden fijar los datos de un record es la construcción, ¿dónde pones la validación? En un **constructor compacto** — el constructor escrito sin lista de parámetros, cuyo cuerpo se ejecuta *antes* de que se asignen los componentes:

```java
public record EmployeeDTO(String name, List<String> skills) {
    public EmployeeDTO {                 // sin paréntesis con parámetros — esa es la forma compacta
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name required");
        skills = List.copyOf(skills);    // reasignando el PARÁMETRO — esto es lo que se guarda
    }
}

new EmployeeDTO("", List.of());
// Exception in thread "main" java.lang.IllegalArgumentException: name required
```

> **¿Por qué `skills = ...` es legal aquí cuando `this.skills = ...` no lo era?** Porque dentro de un constructor compacto los nombres a secas son los **parámetros** entrantes, no los campos — los campos todavía no existen. Java asigna cada parámetro a su componente correspondiente automáticamente, en la última línea, después de que tu cuerpo se haya ejecutado. Así que lo que dejes en el parámetro es lo que se guarda: este es el único sitio donde puedes sanear o copiar un valor en su camino de entrada, y por eso la copia defensiva de arriba hace que el record sea genuinamente inmutable en lugar de solo superficialmente.

> **Dos límites más que vale la pena conocer antes de recurrir a un record.** Un record no puede extender otra clase — ya extiende `java.lang.Record` internamente, y Java solo permite un padre, así que `public record F(String n) extends Base {}` ni siquiera se llega a parsear (`error: '{' expected`). *Sí* puede implementar interfaces, que es normalmente lo que en realidad querías. Y un record no puede declarar campos de instancia extra más allá de sus componentes: todo lo que el objeto guarda está en la cabecera, por diseño, que es lo que le permite al compilador generar un `equals`/`hashCode`/`toString` correcto sin que tú tengas que elegir los campos.

> **Vista previa — Spring Boot:** El ejemplo a continuación usa un `repository` y un `controller`, que son conceptos de Spring Boot que aún no has estudiado. Léelo para ver cómo encajan los records en un proyecto real — lo construirás en las notas de Spring Boot.

```java
// Patrón DTO clásico en Spring Boot
public record EmployeeDTO(String name, String email) {}

// En un controller:
public EmployeeDTO getEmployee(int id) {
    Employee emp = repository.findById(id);
    return new EmployeeDTO(emp.getName(), emp.getEmail());
}
```

---

## Clases anidadas — una clase declarada dentro de otra clase

> Docs: https://www.baeldung.com/java-nested-classes → leer: "2. Static Nested Classes", "3. Non-Static Nested Classes" y "3.2. Anonymous Classes"

Cada clase de este archivo ha sido una clase de nivel superior: una clase, un archivo, su propio nombre. Tarde o temprano te encuentras con una clase auxiliar que solo tiene sentido dentro de otra — un nodo dentro de una lista enlazada, un builder para el objeto al que pertenece, una pequeña regla de comparación usada en un único método. Darle su propio archivo dispersa algo que solo tiene sentido en un lugar, así que Java te deja declarar una clase **dentro** de otra clase.

Hay tres formas, y la diferencia entre ellas es enteramente sobre **si el objeto anidado está ligado a una instancia de la clase exterior**. Esa única distinción decide cómo lo creas, qué puede ver, y — como muestra la última parte de esta sección — si puede provocar una fuga de memoria.

```
   class Outer
   ├── static class Nested      → independiente; se crea con new Outer.Nested()
   ├── class Inner              → ligada a un objeto Outer; se crea con outer.new Inner()
   └── new Runnable() { ... }   → anónima: se declara y se crea en una sola expresión
```

### Clase anidada `static` — independiente, solo organizada por espacio de nombres

Una clase anidada `static` es una clase normal que simplemente vive dentro de otra por organización. No tiene ninguna conexión con ningún objeto `Outer` y no puede ver los campos de instancia de `Outer`, así que la creas sin uno:

```java
public class Employee {
    private String name;

    public static class Address {          // static — sin ligadura a ningún Employee en particular
        private String city;
        public Address(String city) { this.city = city; }
    }
}

Employee.Address addr = new Employee.Address("Madrid");   // no hace falta ningún Employee
```

> **Por qué `static` es la opción por defecto a la que deberías recurrir.** La palabra clave aquí no significa "una única copia compartida" como significaba para los campos — significa "no ligada a una instancia exterior". Como la clase no necesita un `Employee` para existir, el compilador no le da uno, y esa es exactamente la propiedad que la mantiene ligera y segura. Si tu clase anidada no lee los campos del objeto exterior, hazla `static`; IntelliJ te lo sugerirá.

### Clase interna (inner class) — lleva una referencia oculta a su objeto exterior

Quita el `static` y la clase se convierte en una **clase interna**, y ocurre algo invisible: cada instancia suya guarda en silencio una referencia al objeto `Outer` que la creó. Eso es lo que le permite a sus métodos leer `name` directamente, sin cualificar:

```java
public class Employee {
    private String name = "Victor";

    public class Badge {                    // sin static — esto es una inner class
        public String label() {
            return "Badge of " + name;      // lee el campo del objeto EXTERIOR, gratis
        }
    }
}

Employee emp = new Employee();
Employee.Badge badge = emp.new Badge();     // fíjate en la sintaxis: un employee EXISTENTE crea el badge
System.out.println(badge.label());          // Badge of Victor
```

La sintaxis `emp.new Badge()` parece rara la primera vez, y es el mecanismo hecho visible: un `Badge` no puede existir sin un `Employee` al que pertenecer, así que tienes que decir *cuál* empleado. Intenta crear uno desde un contexto `static` y el compilador te lo dice directamente:

```
error: non-static variable this cannot be referenced from a static context
        Badge bad = new Badge();
                    ^
```

> **La fuga de memoria que se esconde en esa comodidad.** La referencia oculta al objeto exterior es una flecha real, y el recolector de basura la respeta. Así que si un `Badge` sobrevive a su `Employee` — guardado en una caché de vida larga, registrado como listener, entregado a una tarea en segundo plano — el `Employee` **no puede recolectarse**, aunque nada en tu código lo referencie ya, porque el badge todavía apunta hacia él. Un objeto pequeño ancla a uno grande, y repetido a lo largo de la vida de un servidor eso es una fuga que crece en silencio bajo carga. La solución es casi siempre la misma: si la clase anidada no necesita realmente la instancia exterior, márcala `static` y la flecha nunca se crea. Baeldung lo lista en "3.4. Inner Classes That Reference Outer Classes" en https://www.baeldung.com/java-memory-leaks.

### Clase anónima — declarada y creada de una vez

La tercera forma no tiene ningún nombre en absoluto. Cuando necesitas exactamente un objeto que implemente una interfaz, y nombrar una clase para él sería pura ceremonia, escribes la implementación en línea como parte de la expresión `new`:

```java
Runnable task = new Runnable() {          // sin nombre de clase — el cuerpo ES la clase
    @Override
    public void run() {
        System.out.println("Sending the weekly report");
    }
};
task.run();
```

Una **interfaz** es un contrato que una clase promete cumplir — el tema del siguiente archivo, [05-interfaces-abstractas.md](05-interfaces-abstractas.md); por ahora lee `Runnable` como "algo con un método `run()`". Lo que hace el compilador aquí es generar una clase sin nombre que la implementa, crear una instancia de ella, y devolvértela. Una clase anónima es una forma de clase interna, así que lleva la misma referencia oculta a lo que sea que la creó — y por lo tanto el mismo riesgo de fuga cuando se guarda en algún sitio de vida larga.

> **Casi nunca volverás a escribir esta forma.** Cuando la interfaz tiene exactamente un método, la lambda de Java 8 expresa el mismo objeto en una línea: `Runnable task = () -> System.out.println("Sending the weekly report");`. Eso se cubre en [09-streams-lambdas.md](09-streams-lambdas.md), que abre precisamente con esta comparación. Las clases anónimas todavía importan por dos razones: te las encontrarás constantemente en código antiguo, y siguen siendo la única opción cuando la interfaz tiene más de un método que implementar.

---

Ya puedes modelar una sola cosa como una clase: sus datos (campos), cómo se construye (constructores), qué puede hacer (métodos), cómo se protege a sí misma (encapsulación), cómo dice si es igual a otra (el contrato `equals`/`hashCode`), y dónde puede vivir una clase auxiliar dentro de ella (clases anidadas). Pero cada clase hasta ahora ha estado sola — y la última sección dejó una deuda pendiente: el `Runnable` que implementaba una clase anónima era una *interfaz*, una palabra usada pero nunca explicada. Los sistemas reales tienen *familias* de cosas relacionadas — un `Employee` y un `Manager` que comparten casi todo el comportamiento, o una docena de clases sin relación que deben prometer todas que saben hacer `print()`. Hacer que las clases compartan comportamiento, o que acuerden un contrato común, es el siguiente paso. De eso trata [05-interfaces-abstractas.md](05-interfaces-abstractas.md): las interfaces (un contrato que una clase firma) y las clases abstractas (un padre a medio construir que otros completan).
