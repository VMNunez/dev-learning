# Fundamentos de la ejecución en Java

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) y «Java Virtual Machine» (sección 5) para ver las dos etapas que llevan del código fuente a la ejecución

---

JavaScript puede empezar a ejecutar un archivo y no descubrir que existe una operación incorrecta hasta llegar a esa línea. Java añade una comprobación previa a la ejecución: un compilador revisa primero todo el código fuente, antes de que se ejecute ni una sola línea. Esa comprobación previa explica por qué algunos errores te detienen antes de arrancar y otros solo aparecen después.

Esta nota es el mapa de todo lo que vas a estudiar después. Empieza por qué tipo de lenguaje es Java y qué características suyas reaparecen una y otra vez, compara esas características con las que ya conoces de JavaScript, y después muestra un ejemplo concreto: el programa más pequeño que se puede ejecutar en Java, señalando qué capítulo de estas notas explica cada una de sus piezas. A continuación traza la ruta completa de lectura, del capítulo `01` al `16`. Solo entonces sigue un archivo `.java` a través de las dos etapas que lo convierten en un programa en ejecución, y usa esa frontera para explicar las tres formas distintas en que tu código puede fallar.

---

## Qué es Java y qué papel juega en tu stack

Docs: [Baeldung — Spring Boot Tutorial: Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → lee: la visión general inicial y la primera aplicación arrancada, para ver que un servicio Spring Boot es Java normal, compilado y arrancado como cualquier otro programa Java

Java es un **lenguaje de propósito general, con tipado estático, basado en clases, que compila a bytecode y se ejecuta sobre una JVM**. Es una frase densa, así que vayamos palabra por palabra:

- **De propósito general** — Java no está atado a un único tipo de programa. Se usa para crear backends web, apps Android, herramientas de escritorio y procesos batch — programas sin pantalla ni nadie delante, que se lanzan solos a una hora fijada y procesan de una tacada un lote entero de datos — que mueven millones de filas de un sistema a otro cada noche.
- **Con tipado estático** — cada variable se declara con un tipo (`int`, `String`, `User`), ese tipo queda fijado desde ese momento, y el compilador comprueba cada uso de esa variable durante la compilación, antes de que el programa pueda arrancar, precisamente para detectar errores de tipo antes de que lleguen a ejecutarse.
- **Basado en clases** — en Java no existen funciones sueltas en un archivo. Cada línea de código ejecutable pertenece a una clase, y la clase es la unidad elemental que el compilador necesita para compilar y producir una salida.
- **Compila a bytecode y se ejecuta sobre una JVM** — el proceso completo se explica en la sección de más abajo. Por ahora quédate con esto: una herramienta comprueba y traduce tu código fuente, y un segundo programa distinto ejecuta esa traducción.

Así encaja este lenguaje en el stack que estás construyendo: Angular es dueño del navegador, Java es dueño del servidor, y la base de datos está detrás de Java y solo se alcanza a través de él.

```text
  ┌──────────────┐               ┌────────────────────┐        ┌────────────┐
  │   Angular    │  HTTP + JSON  │ Spring Boot (Java) │  SQL   │ PostgreSQL │
  │ (TypeScript) │ ────────────► │ reglas, seguridad, │ ─────► │   tablas   │
  │  pantallas   │ ◄──────────── │   acceso a datos   │ ◄───── │            │
  └──────────────┘               └────────────────────┘        └────────────┘
```

El navegador nunca habla directamente con la base de datos: envía una petición HTTP al servidor Java y recibe JSON de vuelta. El servidor Java es lo único que mantiene la conexión a la base de datos, y por eso es también el único sitio donde se puede hacer cumplir de verdad una **regla de negocio** — una condición que decide qué puede hacer cada usuario. Poner esa misma comprobación en Angular no está mal como primera barrera, para mejorar la experiencia y evitar peticiones innecesarias, pero no es seguridad real: cualquiera puede abrir la pestaña _Network_ del navegador y llamar al endpoint directamente, saltándose por completo el código Angular. La única regla que cuenta de verdad es la que vive en el backend.

> **Java es el lenguaje; Spring Boot es un framework escrito en ese lenguaje.** Al principio es fácil mezclar los dos conceptos, y separarlos ahora te ahorra mucha confusión más adelante. Java te da clases, tipos, métodos y excepciones. Spring Boot es un montón de Java que ya han escrito otras personas y que tú te descargas para usarlo, igual que en Node te descargas paquetes de npm.
>
> Esas descargas llegan en forma de archivos `.jar`. Un `.jar` no tiene nada de mágico: es un archivo comprimido — literalmente un `.zip` con otra extensión — que dentro lleva clases ya compiladas, esos archivos `.class` de los que habla la última sección de esta nota. Tú no lo abres nunca ni lo descargas a mano: escribes en un archivo de configuración qué librerías necesitas, tu herramienta de build las descarga a una carpeta de tu ordenador, y a partir de ahí el compilador y la JVM buscan clases dentro de esos `.jar` igual que buscan las tuyas. Esa herramienta de build es Maven, y cómo se le declara la lista de librerías es el tema de [14-maven.md](14-maven.md).
>
> Lo que Spring Boot te resuelve con todo ese código son las partes que nadie quiere escribir a mano: abrir un puerto para que el servidor se quede escuchando peticiones, traducir el texto de una petición HTTP a objetos Java, y **mapear una fila de la base de datos a un objeto**. Esto último significa coger una fila de una tabla, por ejemplo la fila `(3, 'Ana', 'ana@mail.com')` de la tabla `users`, y construir con ella un objeto `User` de Java cuyos campos `id`, `name` y `email` ya valgan `3`, `"Ana"` y `"ana@mail.com"`. Sin ese mapeo tendrías que leer columna por columna y asignarlas tú a mano en cada consulta; con él trabajas con objetos normales y te olvidas de que debajo hay filas y columnas.
>
> Cuando escribes `@RestController`, no estás usando una sintaxis nueva de Java — estás usando una **anotación**, una característica normal y corriente del lenguaje: una marca que Java te permite poner sobre una clase o un método, y que después alguna otra herramienta lee y usa para decidir qué hacer. En este caso, esa herramienta es el propio código de Spring Boot, que busca `@RestController` y, al encontrarla, registra esa clase como un controlador que atiende peticiones HTTP. Las anotaciones como característica propia del lenguaje se explican en [13-anotaciones.md](13-anotaciones.md). Todo lo que hay en estas notas es Java puro, independiente de cualquier framework — como las propias anotaciones —, y por eso sigue siendo válido sin importar con qué framework acabes trabajando.

---

## Cinco rasgos que reaparecen en cada capítulo posterior

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → lee: la sección sobre lenguajes de tipado estático, para entender por qué la comprobación de tipos ocurre antes de la ejecución en lugar de durante ella

Java tiene una personalidad, y es sorprendentemente consistente. Cinco rasgos explican casi todos los momentos de «¿por qué me obliga a hacer esto?» que vas a tener. Cada uno de ellos se detalla a fondo en un archivo posterior.

**1. Tipado estático — el tipo forma parte de la declaración, y nunca cambia.** Cuando escribes `int quantity = 2;`, el nombre `quantity` queda ligado al tipo `int` para el resto de su vida. Esto no es solo una regla que hay que memorizar, es un mecanismo concreto: como el tipo queda escrito en el propio código fuente, el compilador puede razonar sobre una línea _sin llegar a ejecutarla nunca_. No necesita saber que `quantity` valdrá `2` en un momento y `40` en otro — solo necesita el tipo declarado para decidir si una operación es legal. Por eso Java puede rechazar código antes de arrancar, en lugar de dejar que ese mismo error solo aparezca en tiempo de ejecución, el día en que el programa por fin llega a ejecutar la operación no permitida. Esta característica se explica en [01-variables-tipos.md](01-variables-tipos.md), y vuelve con fuerza en [10-genericos.md](10-genericos.md), donde el tipo de los valores _dentro_ de una colección también se declara y se comprueba.

**2. Todo el código ejecutable vive dentro de una clase.** En JavaScript puedes poner una función sola en un archivo y exportarla. Java no tiene equivalente: `main`, y cualquier otro método, tiene que pertenecer a alguna clase. La razón tiene que ver con cómo el compilador guarda el resultado: genera un archivo `.class` independiente por cada clase, así que una clase es la unidad más pequeña que se puede compilar y cargar por separado. Qué es realmente una clase, qué contiene y cómo se diseña está en [04-poo-clases.md](04-poo-clases.md).

**3. Primero compilar, luego ejecutar — siempre dos momentos.** Aunque IntelliJ oculte ambos detrás de un único botón verde, siguen siendo dos momentos separados con dos tipos de error distintos, y saber cuál de los dos te está hablando — el compilador, o el programa ya en marcha — te dice de inmediato dónde buscar el problema. La sección de más abajo recorre ese proceso paso a paso; [14-maven.md](14-maven.md) es la herramienta que automatiza ambos pasos una vez que un proyecto real tiene docenas de archivos fuente y librerías externas que descargar antes de poder compilar.

**4. El compilador apunta a la JVM, no a tu procesador.** No produce instrucciones para tu procesador concreto, sino bytecode para una máquina abstracta — la JVM — existe una JVM distinta para Windows, macOS, Linux y lo que sea que tu empresa use en producción. Este es el origen del viejo eslogan de Java, _write once, run anywhere_ («escríbelo una vez, ejecútalo en cualquier sitio»), y no es solo marketing: el archivo `.class` que generas en tu portátil con Windows — el bytecode compilado, también llamado el «artefacto» — es exactamente el mismo que ejecuta un servidor Linux en producción, sin cambios y sin volver a compilarlo, porque ambas máquinas ejecutan ese mismo bytecode dentro de su propia JVM, en vez de ejecutar tu código fuente directamente. La JVM también es quien gestiona la memoria por ti mientras el programa corre — no tienes que hacerlo tú —, que es el tema de [15-modelo-de-memoria.md](15-modelo-de-memoria.md). Para un desglose preciso de la JVM frente al JRE y el JDK que instalaste — a grandes rasgos, el JDK trae las herramientas para desarrollar y compilar, el JRE trae solo lo necesario para ejecutar, y la JVM es la máquina virtual que hay dentro de ambos —, mira [Baeldung — Difference Between JVM, JRE, and JDK](https://www.baeldung.com/jvm-vs-jre-vs-jdk).

**5. Más código explícito, por decisión de diseño.** Java escribe explícitamente muchas cosas que en JavaScript o TypeScript el propio lenguaje da por sobrentendidas. Por ejemplo, una forma de datos que en TypeScript declaras como una interfaz de cuatro campos:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
```

en Java clásico se convierte en una clase con cuatro campos privados, un constructor que los recibe y los asigna uno por uno, y cuatro métodos _getter_ — uno por campo, para poder leerlo desde fuera de la clase —: bastante más código para representar exactamente la misma información. Esto es una decisión de diseño, no un descuido: Java está optimizado para la persona que _lee_ un código que no escribió, años después, por encima de la persona que lo está escribiendo hoy — cuanto más explícito es el código, menos hace falta adivinar. El lenguaje también ha ido recortando ese código de más donde ha podido: los _records_, en [04-poo-clases.md](04-poo-clases.md), reducen esa misma clase de datos — una clase cuyo único trabajo es guardar varios valores relacionados, sin lógica propia — a una sola línea, y las _lambdas_, en [09-streams-lambdas.md](09-streams-lambdas.md), hacen lo mismo cuando lo que quieres pasar no es un dato sino una acción, como la propia función que decide cómo comparar dos elementos al ordenarlos.

| Característica              | Qué te obliga a hacer                                                                                   | Dónde se examina a fondo                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Tipado estático             | Declarar un tipo y mantenerlo; el compilador comprueba cada uso antes de arrancar                       | `01-variables-tipos.md`, `10-genericos.md`  |
| El código vive en una clase | No hay funciones sueltas; una clase es la unidad de compilación                                         | `04-poo-clases.md`                          |
| Compilar y luego ejecutar   | Dos pasos separados — primero compilar, después ejecutar —, dos momentos, dos tipos de mensaje de error | este archivo, y después `14-maven.md`       |
| El objetivo es la JVM       | El bytecode es portable; la memoria la gestiona la JVM por ti, no tú                                    | `15-modelo-de-memoria.md`                   |
| Más código explícito        | Más tecleo, optimizado para quien lee en lugar de para quien escribe                                    | `04-poo-clases.md`, `09-streams-lambdas.md` |

---

## Viniendo de JavaScript — dónde ayuda la comparación y dónde miente

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → lee: la sección sobre lenguajes de tipado dinámico, que es el lado de JavaScript de cada contraste de más abajo

**Esto se usa igual en los dos lenguajes.** La sintaxis de `if`, `while` y `for` es la misma. `try { } catch (e) { }` se ve idéntico — aunque lo que Java hace por dentro al lanzar y capturar una excepción es distinto, y el aviso de más abajo lo explica. Recorrer una **colección** se lee igual que un `for...of` de JavaScript: `for (String name : names)`. «Colección» es el nombre que Java le da a cualquier objeto que guarda varios elementos dentro: una lista, un conjunto, y también un array. Un array es la más simple de todas, una fila de longitud fija que se decide al crearla y ya no cambia; las demás pueden crecer y encoger, y las tienes todas en [07-colecciones.md](07-colecciones.md). Sumar un número a un trozo de texto con `+` concatena en los dos lenguajes, así que `"total: " + 30` produce `"total: 30"` tal como esperas. Y `final` sobre una variable hace lo mismo que `const`: las dos bloquean la variable, no el contenido de lo que hay dentro. Si declaras `final List<String> names = new ArrayList<>();`, no puedes reasignar `names` a otra lista distinta, pero sí puedes añadirle y quitarle elementos a la lista que ya tiene. [01-variables-tipos.md](01-variables-tipos.md) lo desarrolla.

**Esto parece funcionar igual en los dos lenguajes, y no es así.**

_`var` no es `var`._ Java reutilizó la palabra clave, pero le dio un significado casi opuesto. En JavaScript, `var` declara una variable sin tipo alguno. En Java, `var` significa «deduce el tipo a partir de lo que te estoy asignando, y luego mantenme fiel a él para siempre», por ejemplo:

```java
// ✅ bien — javac (el compilador de Java) infiere int a partir del valor inicial
var total = 30;

// ❌ MAL — total es un int, para siempre
total = "thirty";
```

```text
error: incompatible types: String cannot be converted to int
```

Así que `var` no comete ningún error de tipado: el tipo sigue quedando fijado en el momento en que escribes la línea, simplemente no has tenido que escribirlo explícitamente — es un atajo _dentro_ del sistema de tipos, no un hueco en él. Se recomienda usarlo cuando el tipo ya es obvio por el lado derecho de la asignación, como en el ejemplo de arriba; evítalo cuando esconde el tipo real y hace el código más difícil de leer. [01-variables-tipos.md](01-variables-tipos.md) tiene la sección completa.

_La forma de un objeto queda fija en tiempo de compilación._ En JavaScript puedes añadirle una propiedad a un objeto cuando quieras y el objeto simplemente crece. En Java, el conjunto de campos lo decide la clase: solo existen los campos que la clase declaró, y uno que no declaró no existe. Por ejemplo, con una clase `User` que solo declara `name` y `email`:

```java
public class User {
    private String name;
    private String email;
}
```

```java
User user = new User();

// ❌ MAL — la clase User no declara ningún campo llamado age
user.age = 30;
```

```text
error: cannot find symbol
        user.age = 30;
            ^
  symbol:   variable age
  location: variable user of type User
```

Vale la pena reconocer ese mensaje pronto, porque `cannot find symbol` es el error que más te vas a encontrar en tus primeras semanas. Siempre significa lo mismo: el compilador buscó un nombre — una variable, un método, una clase — y no existe nada con ese nombre en ningún sitio donde el compilador pueda verlo desde esa línea.

_`==` está haciendo una pregunta distinta._ En JavaScript la distinción interesante es `==` frente a `===`: `===` compara si el tipo y el valor coinciden a ambos lados, mientras que `==` primero intenta convertir uno de los dos lados para que los tipos coincidan y solo entonces compara — eso es la coerción de tipos. En Java no existe `===`, y el `==` de Java no hace ninguna coerción: cuando se usa sobre objetos — por ejemplo, dos variables de tipo `String` — pregunta «¿estas dos variables apuntan al mismo objeto en memoria?», que casi nunca es la pregunta que querías hacer al comparar dos textos. Equivocarse aquí es el bug de principiante más común en Java, y se resuelve en dos sitios. El caso con el que te vas a topar primero, comparar el contenido de dos trozos de texto, se responde en el archivo siguiente: [01-variables-tipos.md](01-variables-tipos.md) muestra por qué `.equals()` — que compara el contenido real del texto, carácter a carácter, en vez de la dirección de memoria — es el método que de verdad querías usar, y por qué escribir dos literales de texto sueltos, como `"hola" == "hola"`, hace que `==` parezca funcionar correctamente justo las veces suficientes como para engañarte (Java reutiliza el mismo objeto en memoria para literales de texto idénticos, así que ese caso concreto sí apunta al mismo sitio, aunque la regla general siga sin ser esa). Y comparar dos objetos de una clase escrita por ti — un `User` con otro `User` — es el segundo sitio: ahí no basta con llamar a `.equals()` y ya está, porque Java no puede adivinar qué significa que dos usuarios sean «el mismo». ¿Que tengan el mismo `id`? ¿El mismo email? Esa decisión la tomas tú y se la escribes a Java dentro de la clase. Cómo se hace está en [04-poo-clases.md](04-poo-clases.md).

_Los tipos de TypeScript desaparecen antes de ejecutarse; los de Java no._ TypeScript no llega a ejecutarse nunca: antes de llegar al navegador se **transpila**, es decir, se traduce a JavaScript normal, y en esa traducción los tipos se caen porque JavaScript no sabría qué hacer con ellos. El archivo que corre en el navegador no contiene ni un solo tipo, así que durante la ejecución no queda nadie comprobando nada. En Java pasa justo lo contrario: los tipos que declaras sobreviven a la compilación, quedan escritos dentro del archivo `.class`, y la propia JVM rechaza en tiempo de ejecución una conversión que no cuadre.

Hay una única excepción, y son los genéricos. El argumento de tipo de un genérico — el `String` que va dentro de `List<String>` — se comprueba durante la compilación y después se descarta, así que en tiempo de ejecución un `List<String>` y un `List<Integer>` son exactamente el mismo tipo: una `List` a secas. Ese descarte se llama _type erasure_ (borrado de tipos), y lo que te impide es preguntar por ese tipo una vez el programa ya está corriendo. En la práctica son tres cosas que no compilan: no puedes preguntar `if (lista instanceof List<String>)`, porque en ejecución esa información ya no existe; no puedes crear un array de un tipo genérico con `new T[10]`, porque nadie sabe ya qué era `T`; y no puedes tener dos métodos que se diferencien solo en que uno recibe `List<String>` y el otro `List<Integer>`, porque después del borrado son el mismo método escrito dos veces. [10-genericos.md](10-genericos.md) lo desarrolla entero.

| Hábito de JS/TS                             | Qué hace JavaScript/TypeScript                                   | Qué hace Java                                                                                 | ¿Se comporta igual?             |
| ------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------- |
| `for...of` sobre un array                   | Itera sus elementos uno a uno                                    | `for (String name : names)` itera igual sobre una colección                                   | Sí                              |
| `const`                                     | Bloquea la variable, no lo que contiene                          | `final` hace lo mismo                                                                         | Sí, con un matiz en `01`        |
| Sintaxis de `try / catch`                   | `try { } catch (e) { }`                                          | Misma forma                                                                                   | Sí, en la sintaxis              |
| `var`                                       | Declara una variable sin ningún tipo                             | Infiere un único tipo fijo y lo impone para siempre                                           | No — significado casi opuesto   |
| Añadir una propiedad en tiempo de ejecución | El objeto crece con cualquier propiedad nueva                    | Los campos los declara solo la clase; no se pueden añadir después                             | No — lanza `cannot find symbol` |
| `==` frente a `===`                         | Compara con coerción de tipos o sin ella                         | `==` sobre objetos compara si apuntan al mismo objeto en memoria, no si el contenido es igual | No — usa `.equals()`            |
| Tipos de TS borrados al compilar            | Los tipos desaparecen al compilar; nada los comprueba en runtime | Los tipos sobreviven hasta el bytecode                                                        | No — excepto en los genéricos   |

> **Una comparación que hay que rechazar del todo: las excepciones.** Es tentador leer el `try/catch` de Java como el de JavaScript porque la sintaxis se ve igual. Por debajo no se parecen en nada. En Java, una excepción es un objeto de una clase, y Java reparte esas clases en dos grupos. Con el primero, las llamadas excepciones **comprobadas** (_checked_), el compilador se pone estricto: si tu método llama a algo que puede lanzar una de ellas, no te deja compilar hasta que digas qué piensas hacer con ese fallo. Y solo tienes dos respuestas posibles, las dos escritas en el código:
>
> - la capturas ahí mismo con un `try/catch` y te encargas tú del problema;
> - o escribes `throws IOException` en la firma de tu método, que significa «yo no me encargo». Entonces el fallo pasa al método que te llamó a ti, y ese método se encuentra con la misma obligación: o lo captura, o lo vuelve a declarar. Así va subiendo de método en método hasta que alguno lo captura, o hasta que llega arriba del todo y el programa se detiene.
>
> Lo importante no es qué opción elijas, sino que elegir es obligatorio: es una condición para que el programa llegue a compilar, y no hay nada parecido en JavaScript. Por eso, aplicar aquí tus hábitos de JS produce código que directamente no compila, con un mensaje que no significa nada hasta que conoces este modelo:
>
> ```text
> error: unreported exception IOException; must be caught or declared to be thrown
> ```
>
> El modelo completo — los dos grupos, cómo viaja el fallo, cómo se lee la traza — se explica desde cero en [08-excepciones.md](08-excepciones.md).

---

## El programa Java más pequeño que se ejecuta

Docs: [Baeldung — Java main() Method Explained](https://www.baeldung.com/java-main-method) → lee: la explicación inicial de la firma habitual, donde se desmontan `public` y `static` palabra por palabra

En JavaScript, un archivo con una sola línea ya es un programa. Java tiene un mínimo, y son tres cosas: una clase cuyo nombre coincide con el del archivo, un punto de entrada con una firma exacta, y algo que produzca una salida para que puedas ver que ha pasado algo.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}
```

Para verlo funcionar hay que guardarlo en un archivo llamado `Hello.java` y pasar por los dos pasos que recorre la última sección de esta nota. Cada paso tiene su propio comando de terminal, y cada comando lo lanza un programa distinto que viene dentro del JDK que instalaste:

```text
javac Hello.java     ← javac es el compilador: lee Hello.java, lo comprueba y genera Hello.class
java Hello           ← java es el lanzador: arranca una JVM, carga Hello.class y lo ejecuta
```

Fíjate en un detalle que despista al principio: al compilar escribes el nombre del **archivo** con su extensión (`Hello.java`), y al ejecutar escribes el nombre de la **clase** sin extensión (`Hello`), porque a partir de ahí ya no trabajas con tu archivo de texto sino con la clase compilada. En IntelliJ nunca escribes ninguno de los dos comandos — el botón verde de Run los lanza por ti —, pero lo que ocurre por debajo es exactamente esto. El resultado en la consola es:

```text
Hello from Java
```

**El nombre del archivo no es una convención, es una regla.** Si declaras `public class PriceCalculator`, el archivo tiene que llamarse `PriceCalculator.java`: el mismo nombre exacto, mayúsculas incluidas, más la extensión `.java`. Guardar esa misma clase en un archivo llamado `Wrong.java` no compila:

```java
// archivo: Wrong.java
// ❌ MAL — este archivo debería llamarse PriceCalculator.java
public class PriceCalculator {
}
```

```text
error: class PriceCalculator is public, should be declared in a file named PriceCalculator.java
```

La razón es que tanto el compilador como la JVM encuentran una clase _por su nombre_: cuando algo pide `PriceCalculator`, la herramienta va a buscar `PriceCalculator.class`, producido a partir de `PriceCalculator.java`. Que los dos nombres coincidan convierte «encontrar esta clase» en una búsqueda de archivo predecible, en vez de una búsqueda entre todos los archivos del disco.

**`main` es el punto de entrada: por ahí empieza a ejecutarse el programa.** Un programa tiene que empezar por alguna línea concreta, y en Java esa línea está siempre dentro de un método llamado `main`. Cuando ejecutas `java Hello`, la JVM carga la clase `Hello`, busca dentro de ella un método con exactamente esta forma y lo llama; ahí arranca tu programa, y cuando ese método termina, el programa termina.

Puede haber muchas clases con `main` en el mismo proyecto — cada una sería un programa arrancable por separado —, pero en una ejecución concreta solo se usa el `main` de la clase que has lanzado. Cada palabra de esa firma está haciendo un trabajo:

```text
public static void main(String[] args)
  │      │     │    │      │
  │      │     │    │      └─ los datos que se le pasan al programa al arrancarlo, en un array de texto
  │      │     │    └─ el nombre fijo que busca la JVM — no vale ningún otro
  │      │     └─ no devuelve nada
  │      └─ se puede llamar sin crear antes un objeto de la clase
  └─ visible desde cualquier sitio, incluso desde fuera del propio paquete de esta clase
```

> **¿Por qué siempre `String[] args`?** Porque un programa se puede arrancar pasándole datos escritos justo detrás del nombre de la clase: `java Hello Ana 30`. Esos dos valores llegan a tu `main` dentro de `args`, que en ese caso valdría `["Ana", "30"]`. Es un **array** — una fila de valores de longitud fija — porque cuántos valores va a escribir el usuario no se sabe hasta el momento de arrancar. Y es de tipo `String` porque todo lo que se teclea en una terminal es texto: ese `30` llega como el texto `"30"`, no como el número `30`, y si lo necesitas como número tienes que convertirlo tú. `args` tiene que aparecer en la firma aunque no lo uses nunca — como pasa en el 99% de los casos —, porque esta es la forma exacta que la JVM y las herramientas de build reconocen como punto de entrada.

Queda una palabra por desmontar de esa última línea: **paquete**. Un paquete (_package_) es la carpeta a la que pertenece una clase, pero escrita con puntos en lugar de barras. Las clases de tu proyecto TimeTrack viven en el disco dentro de `src/main/java/com/victor/timetrack/`, y por eso la primera línea de código de cada una de ellas es:

```java
package com.victor.timetrack;
```

Es la misma ruta `com/victor/timetrack`, con puntos en el sitio de las barras. Las clases que están en subcarpetas pertenecen a subpaquetes: `.../timetrack/service/TimeEntryService.java` está en el paquete `com.victor.timetrack.service`. La ruta de carpetas y el nombre del paquete tienen que coincidir siempre, y la razón es la misma de antes: así el compilador y la JVM saben en qué carpeta buscar el archivo de una clase a partir de su nombre.

Para qué sirve todo esto: el paquete es el apellido de la clase. Su nombre completo no es `TimeEntryService`, sino `com.victor.timetrack.service.TimeEntryService`, y eso permite que existan dos clases con el mismo nombre corto sin chocar entre sí — la `List` que usarás a diario es en realidad `java.util.List`, y si mañana escribes tu propia clase `List` dentro de tu paquete, las dos pueden convivir. A eso se le llama **espacio de nombres** (_namespace_): un ámbito dentro del cual cada nombre identifica una sola cosa.

Y esto es lo que estaba midiendo `public` en la firma de `main`. Los paquetes son también la frontera de la visibilidad: una clase o un método sin `public` solo se pueden usar desde clases del mismo paquete, mientras que con `public` se pueden usar desde cualquier paquete. `main` es `public` porque quien lo llama es la JVM, que está fuera de tu código y por tanto fuera de todos tus paquetes. Las reglas completas de visibilidad están en [04-poo-clases.md](04-poo-clases.md).

Si a la clase que intentas lanzar le falta el método `main`, la clase compila perfectamente — como clase no le pasa nada —, y el fallo llega después, desde la JVM, justo en el momento en que intentas arrancarla:

```text
Error: Main method not found in class NoMain, please define the main method as:
   public static void main(String[] args)
```

> **¿Por qué falla al arrancar y no al compilar?** Porque una clase sin `main` es una clase completamente normal y útil: en cualquier proyecto, la inmensa mayoría de las clases no tienen `main` y se compilan y se usan constantemente. Tener un punto de entrada no es algo que se le pueda exigir a toda clase; solo hace falta en la clase por la que arranca el programa. Y el compilador no puede saber cuál va a ser esa clase, porque eso lo decides tú más tarde, al ejecutar `java Hello`. La JVM sí lo sabe, porque acabas de darle el nombre — y por eso la comprobación cae ahí y no antes.

**De momento te vale con lo que acabas de leer sobre `public`, `static` y `String[]`.** Cada una de esas tres palabras es un concepto entero por sí misma, y cada una tiene su propio capítulo más adelante: las reglas completas de `public` y de `static` — quién puede ver un miembro de una clase, y si ese miembro pertenece a la clase entera o a cada objeto por separado — están en [04-poo-clases.md](04-poo-clases.md); `String[]` se explica junto a las demás formas de guardar varios valores, en [07-colecciones.md](07-colecciones.md). Aquí basta con que reconozcas la plantilla y sepas copiarla, porque todos los ejemplos de los capítulos siguientes imprimen algo por consola y, para probarlos tú, vas a tener que meterlos dentro de un `main` como este.

**`System.out.println` es la forma de imprimir algo por pantalla.** `System.out` es la salida estándar del programa, que en tu caso es la consola de IntelliJ, y `println` escribe ahí lo que le pases y después salta a la línea siguiente. Su hermano `print` escribe exactamente lo mismo pero sin ese salto, así que dos `print` seguidos dejan el texto pegado en la misma línea:

```java
System.out.print("Hola ");
System.out.print("Ana");
System.out.println("!");
System.out.println("Segunda línea");
```

```text
Hola Ana!
Segunda línea
```

Durante toda tu ruta junior esta va a ser tu herramienta principal para ver qué está pasando dentro del programa: imprimes el valor de una variable en mitad de un método y compruebas si es el que esperabas.

> **En una aplicación real no se imprime con `System.out.println`, se usa un logger.** El problema de `System.out.println` es que no hay forma de apagarlo: está escrito en el código, así que imprime siempre, también en producción. Una librería de logging — Spring Boot ya trae una configurada de serie — escribe lo mismo, pero añadiéndole la fecha y la hora, la clase que lo escribió y un nivel de importancia (`INFO`, `WARN`, `ERROR`). Eso te permite decir «en producción quiero ver solo los `ERROR`» cambiando una línea de configuración, sin tocar el código, y mandar esa salida a un archivo en vez de a la pantalla — que es justo lo que necesitas cuando el programa lleva semanas corriendo en un servidor al que nadie está mirando.

> **Adelanto:** el fragmento de abajo es de tu propio proyecto y usa clases de Spring Boot que todavía no has estudiado. Está aquí solo para que veas que la firma de `main` que acabas de leer es también la que arranca una aplicación con framework. `@SpringBootApplication` y `SpringApplication.run` se explican a su debido tiempo en las notas de Spring Boot.

`Hello` no es una versión de juguete de algo que los programas de verdad hacen de otra manera: una aplicación Spring Boot arranca exactamente igual. El archivo `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/TimetrackApplication.java` tiene apenas una docena de líneas, y la que importa es la firma que acabas de ver:

```java
@SpringBootApplication
public class TimetrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimetrackApplication.class, args);
	}

}
```

Todo el backend de TimeTrack — cada controller, cada regla de seguridad, la conexión a la base de datos — se pone en marcha desde esa única llamada a `SpringApplication.run`. Spring Boot no sustituye el punto de entrada de Java: se monta encima de él.

> **Puede que veas por ahí código Java sin ninguna clase alrededor.** Desde Java 25, que es la versión que tienes instalada y la que usa el proyecto 07, un archivo que contenga solo `void main() { ... }` se puede lanzar directamente con `java archivo.java`, sin escribir la clase y sin `static`. Funciona, y se añadió para que una primera lección de Java no empiece con tres palabras que aún no se pueden explicar. No lo usa ningún proyecto real — ni el proyecto 07 ni los ejemplos de estas notas —, así que reconócelo si te lo encuentras, pero aprende la forma completa.

---

## La ruta de aquí a Maven, y por qué sigue ese orden

Docs: [Baeldung — Get Started with Java](https://www.baeldung.com/get-started-with-java-series) → lee: la lista ordenada de artículos de la serie, como una segunda opinión sobre cómo se suele secuenciar el mismo terreno

La ruta empieza por lo más pequeño que puede contener un programa y termina con la herramienta que construye el proyecto entero. Cada paso está colocado justo delante del paso que lo necesita, y va en cuatro tramos.

**Pasos 01 a 04 — los valores y las frases básicas.** El `01` te da los valores: números, booleanos, cuándo un `int` se convierte en un `long`, y por qué un decimal casi nunca es exactamente el número que escribiste. Va primero porque todas las líneas que escribas después manipulan algún valor. El `02` coge el tipo de valor que más vas a tocar, el texto, y explica por qué un `String` que parece que modificas es en realidad uno nuevo cada vez. Con los valores sueltos ya entendidos, el `03` empieza a elegir entre ellos y a repetirlos con `if`, `for` y `while`, y el `04` empaqueta ese comportamiento dentro de métodos con nombre, con sus parámetros y su valor de retorno.

**Pasos 05 a 08 — la maquinaria y los objetos.** El `05` abre por dentro esa frontera del método y enseña la maquinaria: qué se copia exactamente cuando pasas un argumento, dónde vive el objeto en memoria, y cómo lleva la JVM la cuenta de qué método llamó a cuál. Va aquí porque es el mecanismo sobre el que después se apoyan los objetos, las excepciones y las colecciones: entendiéndolo, esos tres temas se razonan en vez de memorizarse. Solo entonces el `06` construye objetos de verdad, con un estado que nace siendo válido, y responde a la pregunta que los objetos plantean nada más aparecer: cuándo se consideran iguales dos de ellos. El `07` separa el comportamiento que necesita quien llama de la clase concreta que se lo proporciona, y el `08` explica cómo decide Java, ya en ejecución, cuál de las implementaciones se ejecuta.

**Pasos 09 a 12 — guardar muchas cosas, y fallar.** El `09` te enseña a leer `Map<String, List<Order>>` _antes_ de que el `10` llene la pantalla de esa misma sintaxis, para que ningún ejemplo de colecciones contenga signos que aún no sabes interpretar. El `11` desarrolla entonces el modelo completo del fallo — cómo viaja una excepción, dónde se gestiona, cómo se lee la traza —, y llega en este punto porque las búsquedas, las conversiones y los bucles de los capítulos anteriores ya te han dado varias formas distintas de fallar. El `12` le da a Java la capacidad de pasar comportamiento como si fuera un dato, que es lo que hace legibles los pipelines de streams.

**Pasos 13 a 16 — el cierre.** El `13` encierra un conjunto fijo de valores en un enum que el compilador puede comprobar entero. El `14` aplica esa misma idea de valor que no cambia a las fechas y las horas, donde los valores posibles son infinitos y ninguna comprobación del compilador puede salvarte. El `15` generaliza `@Override` a las anotaciones en general: metadatos que alguna herramienta concreta lee, que es lo que hace que las anotaciones de Spring que ves a diario dejen de parecer sintaxis secreta de Java. Y el `16` cierra con Maven, la herramienta que descarga las librerías, compila, ejecuta los tests y empaqueta todo lo que produjeron los quince capítulos anteriores.

> **Los números en los nombres de archivo no son el orden de lectura.** Solo `00` y `01` coinciden. Los archivos se escribieron antes de planificar esta ruta, y renumerarlos rompería varios cientos de enlaces por todo el repositorio, así que los nombres se dejaron tal cual a propósito. Lee el orden en la tabla de abajo e ignora el número del archivo — la tabla es la autoridad, no el listado de la carpeta.

| Orden de lectura | Archivo en `es/`              | Por qué va aquí                                                                                 |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| 01               | `01-variables-tipos.md`       | Toda línea posterior manipula un valor tipado                                                   |
| 02               | `16-cadenas-de-texto.md`      | El texto es el tipo de valor que tocas en cada petición                                         |
| 03               | `02-flujo-de-control.md`      | Elegir y repetir necesita valores entre los que elegir                                          |
| 04               | `03-metodos.md`               | Empaqueta ese comportamiento detrás de un contrato invocable                                    |
| 05               | `15-modelo-de-memoria.md`     | Abre la frontera del método: copias, referencias, la pila de llamadas                           |
| 06               | `04-poo-clases.md`            | Construye objetos a partir de métodos y referencias, y define la igualdad                       |
| 07               | `05-interfaces-abstractas.md` | Separa el comportamiento necesario de la clase que lo proporciona                               |
| 08               | `06-herencia-polimorfismo.md` | Decide en tiempo de ejecución qué implementación se ejecuta                                     |
| 09               | `10-genericos.md`             | Enseña la sintaxis de corchetes angulares antes de que las colecciones la usen por todas partes |
| 10               | `07-colecciones.md`           | Grupos de objetos, y el hashing que hace rápida la búsqueda                                     |
| 11               | `08-excepciones.md`           | Los fallos que hicieron posibles los capítulos anteriores                                       |
| 12               | `09-streams-lambdas.md`       | Comportamiento como valor, y los pipelines construidos con él                                   |
| 13               | `11-enums.md`                 | Un conjunto cerrado de valores que el compilador puede comprobar de forma exhaustiva            |
| 14               | `12-fechas.md`                | La misma inmutabilidad aplicada donde no existe ninguna comprobación del compilador             |
| 15               | `13-anotaciones.md`           | Metadatos que lee una herramienta — la forma de cada anotación de Spring                        |
| 16               | `14-maven.md`                 | El build que compila, testea y empaqueta todo lo anterior                                       |

Dos apuntes sobre cómo leer esta tabla. La columna del medio es el archivo que hay que abrir en `notes/java/junior/es/`, y es la única columna en la que confiar — el orden de lectura `05` es de verdad el archivo llamado `15-modelo-de-memoria.md`. Y el paso `02`, `16-cadenas-de-texto.md`, todavía no se ha escrito: hasta que exista, el material sobre texto sigue viviendo dentro de `01-variables-tipos.md`, en su sección `## String`, que es donde leerlo cuando llegues a ese paso.

---

## Del código fuente al bytecode y a la ejecución en la JVM

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) para la compilación y «Java Virtual Machine» (sección 5) para la ejecución

Escribir un archivo `.java` no basta para que sus instrucciones se ejecuten. El texto que escribes es **código fuente**, pensado para que lo lean las personas y el compilador de Java. Un procesador no ejecuta directamente ese archivo fuente, por lo que Java utiliza dos etapas distintas:

1. **Compilación:** el compilador de Java, llamado `javac`, lee el código fuente. Comprueba la sintaxis y las reglas de tipos de Java; si estas comprobaciones se superan, traduce el código fuente a **bytecode** y escribe ese bytecode en un archivo `.class`. (Hay exactamente un caso en el que no aparece ningún archivo `.class` en disco: el atajo de un solo archivo de la sección anterior. `java Hello.java` compila en memoria y se ejecuta al instante, dejando en la carpeta solo el `.java` con el que empezaste. Todo build real sí escribe los archivos — `target/classes/` en el proyecto 07 es esa salida.)
2. **Ejecución:** una **JVM** (Java Virtual Machine) carga el bytecode y ejecuta sus instrucciones como un programa Java.

```text
PriceCalculator.java
        │
        │ javac comprueba la sintaxis y los tipos,
        │ y después compila el código fuente
        ▼
PriceCalculator.class
        │
        │ una JVM carga y ejecuta el bytecode
        ▼
programa en ejecución
```

Lee el diagrama de arriba abajo. El archivo `.java` es la entrada, `javac` actúa como punto de control y traductor, el archivo `.class` contiene el bytecode resultante y una JVM es el motor que lo ejecuta.

> **El bytecode es el formato de entrega.** No es ni el código fuente Java que has escrito ni el código máquina específico del procesador que ejecuta directamente tu CPU. Es el formato de instrucciones que el compilador entrega a una JVM. Para trabajar con Java a nivel junior, esta relación es suficiente: no necesitas aprender las instrucciones individuales del bytecode, la carga de clases ni las optimizaciones de la JVM para entender este proceso.

Imagina que tu código fuente contiene un pequeño cálculo de precio:

```java
int quantity = 2;
int unitPrice = 15;
int total = quantity * unitPrice;
System.out.println(total);
```

Cuando el código fuente respeta las reglas de Java, `javac` puede producir bytecode para esas instrucciones. Después, cuando una JVM ejecuta ese bytecode, el programa muestra:

```text
30
```

Las dos etapas están separadas aunque IntelliJ las oculte detrás de un único botón verde de Run, y lo mismo vale para el atajo de un solo archivo: los dos ocultan el compilador, ninguno se lo salta. El compilador tiene que aceptar el código fuente antes de que la JVM pueda ejecutar la nueva versión, siempre.

> **Una JVM no comprueba tu código fuente original.** Al llegar a la etapa de ejecución, el compilador ya ha traducido el código fuente aceptado a bytecode. Por eso, un mensaje de `javac` y un fallo durante la ejecución en la JVM pertenecen a momentos distintos.

---

## Fallos en tiempo de compilación frente a fallos en runtime

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) y «Java Virtual Machine» (sección 5) para ver la frontera entre el rechazo del compilador y la ejecución

Cada tipo de error aparece en un punto diferente del proceso. La forma más rápida de clasificarlo es preguntarte:

> **¿`javac` rechazó el código fuente o llegó una JVM a empezar a ejecutar su bytecode?**

Utiliza el mismo cálculo de precio para comparar los tres resultados.

### Errores de sintaxis y de tipos — rechazados en tiempo de compilación

Un **error de sintaxis** incumple la gramática de Java: el código fuente no está escrito de una forma que el lenguaje acepte. Quitar el punto y coma de la primera línea es un ejemplo:

```java
// MAL — a la sentencia le falta el punto y coma obligatorio
int quantity = 2
int unitPrice = 15;
```

`javac` lo rechaza con un mensaje del compilador como este:

```text
error: ';' expected
```

Un **error de tipos** combina valores de una manera que las reglas de tipos de Java no permiten. Aquí el operador de multiplicación recibe un entero en un lado y texto en el otro:

```java
// MAL — "15" es texto, no un entero
int quantity = 2;
int total = quantity * "15";
```

`javac` informa de lo siguiente:

```text
error: bad operand types for binary operator '*'
```

En ambos casos, el motivo es distinto, pero el resultado es el mismo: `javac` rechaza el código fuente modificado antes de que una JVM pueda ejecutar esa versión.

```text
código fuente
    │
    ├── sintaxis no válida ──► javac lo rechaza
    │
    └── tipos incompatibles ─► javac lo rechaza
```

> **El tiempo de compilación es un punto de control, no un programa en ejecución.** Mientras `javac` comprueba el código fuente, no se está ejecutando ninguna instrucción de tu aplicación. Por tanto, el código de gestión de errores en runtime no puede capturar un fallo de compilación: todavía no hay ninguna ejecución en la que capturarlo.

### Excepciones — código fuente válido que falla durante la ejecución

Parte del código fuente es válido aunque determinados valores en runtime hagan imposible una operación. Dividir un entero entre otro es una operación válida en Java, por lo que este código supera la compilación:

```java
int unitPrice = 15;
int divisor = 0;
int total = unitPrice / divisor;
System.out.println(total);
```

El problema solo aparece cuando una JVM ejecuta la división con `divisor` igual a cero. Java crea y lanza una **excepción**: un objeto que informa de un problema encontrado mientras el programa se está ejecutando. El mensaje exacto de la excepción comienza así:

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
```

La ejecución llegó hasta la división, así que se trata de un **fallo en runtime**. Si nadie captura esa excepción, el programa se detiene justo ahí e imprime esa línea junto con la lista de métodos que estaban en marcha en ese momento, que es lo que te permite localizar dónde ocurrió.

> **¿Por qué no puede el compilador rechazar esto antes?** La operación `int / int` está permitida. En un programa real, `divisor` podría proceder de la entrada del usuario, de un cálculo o de una base de datos mientras el programa está en ejecución, por lo que su valor real no suele estar fijado por la línea de código fuente. El compilador comprueba si la operación es válida para los tipos declarados; la ejecución revela si los valores hacen que esa operación válida falle.

La mecánica de lanzar, capturar y propagar excepciones pertenece a [08-excepciones.md](08-excepciones.md). Por ahora, quédate con que una excepción solo puede aparecer después de que haya comenzado la ejecución.

### Errores de lógica — la ejecución termina, pero la respuesta es incorrecta

Un programa también puede compilar y terminar sin lanzar nada y, aun así, producir un resultado incorrecto. Cambia la multiplicación por una suma:

```java
int quantity = 2;
int unitPrice = 15;

// MAL para el requisito «cantidad multiplicada por precio unitario»
int total = quantity + unitPrice;
System.out.println(total); // muestra 17
```

Todas las instrucciones son válidas. `javac` acepta la suma de enteros y una JVM la ejecuta correctamente. El fallo está en el razonamiento expresado por el código: el programa hace lo que has escrito, pero no lo que pedía el requisito. Esto es un **error de lógica**, que se encuentra comparando el resultado real con el esperado, a menudo mediante un test.

> **La compilación demuestra que el código fuente respeta las reglas de Java, no que resuelva el problema correcto.** El compilador no conoce el requisito de negocio «multiplicar la cantidad por el precio unitario», por lo que no puede decidir que debería haberse usado `*` en lugar de `+`.

La siguiente tabla clasifica el mismo ejemplo según la frontera que cruza:

| Problema                        | ¿Acepta `javac` el código fuente? | ¿Comienza la ejecución? | Cómo aparece                                    |
| ------------------------------- | --------------------------------: | ----------------------: | ----------------------------------------------- |
| Falta `;`                       |                                No |                      No | Mensaje del compilador por error de sintaxis    |
| `int * String`                  |                                No |                      No | Mensaje del compilador por error de tipos       |
| División entera entre cero      |                                Sí |                      Sí | `ArithmeticException` interrumpe la ejecución   |
| Suma en lugar de multiplicación |                                Sí |                      Sí | El programa termina con un resultado incorrecto |

Lee juntas las dos primeras columnas: si `javac` dice que no, el fallo ocurre en tiempo de compilación; si ambas dicen que sí, solo ejecutar y observar el programa puede revelar una excepción o un error de lógica.

```text
código fuente
  │
  ├── javac lo rechaza ──────────────► fallo en tiempo de compilación
  │                                     error de sintaxis o error de tipos
  │
  └── aceptado ─► bytecode ─► JVM
                              ├────────► excepción: la ejecución se interrumpe
                              └────────► error de lógica: la ejecución termina,
                                                          pero el resultado es incorrecto
```

### Cuál de los tres es más barato de encontrar

Los tres no cuestan lo mismo, y la diferencia entre ellos es lo bastante grande como para cambiar cómo escribes código.

Un **fallo en tiempo de compilación** te cuesta segundos. `javac` lee todas las líneas del código fuente, se lleguen a ejecutar algún día o no, así que encuentra el error sin que haga falta que se den antes las condiciones exactas que lo provocan. Además te dice el archivo, la línea y el carácter exacto, con un `^` debajo. Y hace todo eso antes de que el programa se haya ejecutado ni una sola vez, así que nadie más que tú llega a verlo.

Una **excepción** cuesta más, porque no la encuentra nadie hasta que la línea que falla se ejecuta de verdad. La división de arriba es invisible hasta que llega una petición en la que `divisor` vale realmente `0`; con cualquier otro valor ese mismo código funciona bien. Lo bueno es que, cuando por fin ocurre, no pasa desapercibida: la ejecución se detiene y Java imprime el tipo de excepción, su mensaje y la lista de métodos que estaban en marcha en ese momento — la **stack trace** —, que te señala la línea exacta.

Un **error de lógica** es el caro, y por una razón muy concreta: ninguna de las dos comprobaciones lo está buscando siquiera. El compilador comprueba que el código respeta las reglas de Java. La JVM comprueba que cada operación es posible con los valores que le han llegado. En ningún punto de ese proceso hay una copia de lo que tú _querías_ que hiciera el programa. `quantity + unitPrice` es una suma perfectamente legal de dos `int`, así que el programa compila, se ejecuta, termina bien e imprime `17` tan tranquilo. Lo único que lo detecta es comparar el resultado con el esperado: que tú leas la salida, que un compañero revise el código, o que haya un test que compruebe que eso tenía que dar `30`. Si nadie lo detecta, no se cae nada; simplemente le factura al cliente el importe equivocado, en silencio, durante meses.

| Fallo                        | Qué lo encuentra                                          | Cuándo                                     | Qué cuesta si se pasa por alto            |
| ---------------------------- | --------------------------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| Error de sintaxis o de tipos | `javac`                                                   | Antes de que el programa arranque siquiera | Segundos, y solo tu propio tiempo         |
| Excepción                    | La JVM, cuando se ejecuta esa línea                       | Solo en el camino que realmente falla      | Un crash visible con una stack trace      |
| Error de lógica              | Una persona o un test que compara lo esperado con lo real | Puede que nunca                            | Datos incorrectos, producidos en silencio |

Lee esta tabla de arriba abajo como una escalera de coste, no como una lista de tres cosas equivalentes: cuanto más abajo, más tarde se descubre el fallo y más caro sale. La columna «cuándo» es en realidad la columna del precio, porque un fallo cuesta poco de arreglar en el momento en que lo escribes y mucho cuando lleva un mes corriendo en producción.

> **Esta escalera explica dos hábitos que parecen trabajo extra.** Todo lo que Java te obliga a escribir de más — declarar un tipo en cada variable, no dejarte compilar por un punto y coma que falta — es lo que te compra la fila de arriba: convierte en errores del compilador, que son los baratos, tantos fallos como puede. Y los tests son lo que te compra la fila de abajo, porque un error de lógica no tiene ningún otro detector. Por eso precisamente el proyecto 07 es el primero de tus proyectos que planifica tests de verdad. Su Step 8 escribe un test de JUnit por cada método de servicio, comprobando las propias reglas de negocio — que aprobar una entrada que nunca se envió lanza una excepción, que las horas aprobadas del resumen coinciden con la suma por proyecto. Los proyectos 01 a 06 solo entregaron los specs vacíos `should be created` que genera el CLI de Angular, que no comprueban nada sobre lo que se suponía que debía calcular el código.

Ahora puedes situar un problema en el ciclo de vida básico de Java: el código fuente se comprueba y se compila a bytecode; después, una JVM ejecuta ese bytecode. A continuación, [01-variables-tipos.md](01-variables-tipos.md) examina los tipos declarados que sustentan esas comprobaciones del compilador: qué valores permite Java que contenga cada variable y por qué los tipos incompatibles se rechazan antes de la ejecución.
