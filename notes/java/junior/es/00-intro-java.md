# Fundamentos de la ejecución en Java

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) y «Java Virtual Machine» (sección 5) para ver las dos etapas que llevan del código fuente a la ejecución

---

Todas las aplicaciones que has construido hasta el proyecto 07 se quedaban en el navegador. Angular dibujaba la pantalla y guardaba los datos en lo que el propio navegador podía ofrecer — memoria, y como mucho un rincón de almacenamiento local que solo ese ordenador concreto podía ver. Un producto real necesita una segunda mitad: un programa corriendo en un servidor, que sea el dueño de la base de datos, decida si quien pregunta tiene permiso para preguntar, y siga respondiendo mientras hay muchos navegadores conectados a la vez. Java es el lenguaje en el que se escribe esa segunda mitad, y en las consultoras españolas a las que apuntas se elige para ese trabajo con mucha más frecuencia que cualquier otra cosa. Para eso lo estás aprendiendo.

Ya sabes que JavaScript puede empezar a ejecutar un archivo y no descubrir que existe una operación incorrecta hasta llegar a esa línea. Java añade una verificación previa a la ejecución: un compilador comprueba primero el código fuente. Esa verificación explica tanto cómo un archivo `.java` se convierte en un programa en ejecución como por qué algunos errores te detienen antes de arrancar y otros solo aparecen después de arrancar.

Esta nota es el mapa de todo lo que viene después. Empieza por qué tipo de lenguaje es Java y qué características suyas reaparecen una y otra vez, compara esas características con las que ya conoces de JavaScript, y luego muestra el programa más pequeño que se puede ejecutar en Java y nombra el capítulo dueño de cada una de sus piezas. Después traza la ruta completa de `01` a `16`. Solo entonces sigue un archivo `.java` a través de las dos etapas que lo convierten en un proceso en ejecución, y usa esa frontera para separar las tres formas distintas en que tu código puede estar mal.

---

## Qué es Java y qué papel juega en tu stack

Propósito: Usas esta orientación cada vez que necesitas decir qué es Java realmente y por qué la mitad servidor de tus proyectos está escrita en él, porque cada capítulo posterior asume que ya sabes qué parte del trabajo hace el lenguaje.

Docs: [Baeldung — Spring Boot Tutorial: Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → lee: la visión general inicial y la primera aplicación arrancada, para ver que un servicio Spring Boot es Java normal, compilado y arrancado como cualquier otro programa Java

Java es un **lenguaje de propósito general, con tipado estático, basado en clases, que compila a bytecode y se ejecuta sobre una JVM**. Es una frase densa, así que vayamos palabra por palabra — cada una de ellas es una decisión que tomó el lenguaje, y cada una determina cómo se leerá el resto de estas notas.

- **De propósito general** — Java no está atado a un único tipo de programa. Se usa para backends web, apps Android, herramientas de escritorio y trabajos batch que procesan grandes volúmenes de datos, muchas veces leyendo y escribiendo directamente contra una base de datos. Lo estás aprendiendo para lo primero de esa lista.
- **Con tipado estático** — cada variable se declara con un tipo (`int`, `String`, `User`), ese tipo queda fijado desde ese momento, y una herramienta comprueba cada uso de esa variable *antes* de que se permita arrancar el programa. Esa comprobación ocurre durante la compilación — la sección de más abajo, [Del código fuente al bytecode y a la ejecución en la JVM](#del-código-fuente-al-bytecode-y-a-la-ejecución-en-la-jvm), es donde ves ese proceso paso a paso.
- **Basado en clases** — en Java no existen funciones sueltas en un archivo. Cada línea de código ejecutable pertenece a una clase, y una clase es la unidad elemental para que la aplicación compile y genere una salida.
- **Compila a bytecode y se ejecuta sobre una JVM** — el pipeline de dos etapas que recorre a fondo la sección de más abajo. Por ahora: una herramienta comprueba y traduce tu código fuente, y un segundo programa ejecuta esa traducción.

Así encaja este lenguaje en el stack que estás construyendo: Angular es dueño del navegador, Java es dueño del servidor, y la base de datos está detrás de Java y solo se alcanza a través de él.

```text
  ┌──────────────┐               ┌────────────────────┐        ┌────────────┐
  │   Angular    │  HTTP + JSON  │ Spring Boot (Java) │  SQL   │ PostgreSQL │
  │ (TypeScript) │ ────────────► │ reglas, seguridad, │ ─────► │   tablas   │
  │  pantallas   │ ◄──────────── │   acceso a datos   │ ◄───── │            │
  └──────────────┘               └────────────────────┘        └────────────┘
```

Lee las flechas como dos conversaciones separadas. El navegador nunca habla directamente con la base de datos: envía una petición HTTP al servidor Java y recibe JSON de vuelta. El servidor Java es lo único que mantiene la conexión a la base de datos, y por eso es también el único sitio donde se puede hacer cumplir de verdad una **regla de negocio** — un fragmento de lógica sobre quién puede hacer qué, como «un empleado solo puede ver sus propias entradas de tiempo». Escribir esa misma comprobación en Angular también merece la pena, como primera barrera que evita de entrada una petición obviamente incorrecta — pero nunca basta por sí sola, porque cualquiera puede abrir la pestaña de red del navegador y llamar al endpoint directamente, saltándose Angular por completo. La regla solo se sostiene de verdad si el servidor la aplica.

Esa separación ya está en tu propio repositorio. `projects/07-timetrack/frontend` es la mitad de Angular, y `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/` es la mitad de Java, con sus carpetas `controller`, `service` y `repository`. El proyecto 07 es el primer proyecto donde existe siquiera esa segunda mitad — los proyectos 01 a 06 eran solo Angular, y por eso ninguno podía mostrar los mismos datos a dos personas distintas, o desde dos ordenadores distintos.

> **Java es el lenguaje; Spring Boot es un framework construido encima de él.** Al principio es fácil confundir los dos conceptos en uno solo, y separarlos ahora te ahorra mucha confusión más adelante. Java te da clases, tipos, métodos y excepciones — el lenguaje puro. Spring Boot es un montón de Java ya escrito que tu build descarga como archivos `.jar`, y se encarga de las partes que nadie quiere escribir a mano: abrir un puerto, parsear una petición HTTP, mapear una fila de base de datos a un objeto. Cuando escribes `@RestController`, no estás usando sintaxis secreta de Java — estás usando una **anotación** de Java normal y corriente: una marca que el lenguaje te permite poner sobre una clase o un método, que después lee y usa alguna herramienta *distinta*. `@RestController` no viene incluida en el propio Java; es una anotación de Spring, y la herramienta que la lee y actúa sobre ella es el propio código de Spring, que se ejecuta cuando arranca tu aplicación. Las anotaciones como característica del lenguaje — el mecanismo que hace posible todo esto — son el paso 15 de la ruta de más abajo, en [13-anotaciones.md](13-anotaciones.md). Todo lo demás en estas notas es Java puro por debajo, sin ningún framework de por medio, y por eso sigue siendo cierto sin importar con qué framework acabes trabajando.

> **¿Por qué no Node, que ya conoces?** Node serviría HTTP perfectamente bien, y tu prácticas demuestran que sabes construir con él. La elección es una apuesta de mercado más que un veredicto técnico: las grandes consultoras españolas a las que apuntas tienen equipos de Java, y hay muchos menos candidatos junior que ofrecen Angular más Java que candidatos que ofrecen React más Node. También hay una mitad técnica en esa apuesta, y es el tipado estático de arriba — los sistemas que mantienen esas empresas son grandes, viven muchos años, y pasan de mano en mano entre desarrolladores que nunca conocieron a quien los escribió, y un lenguaje que se niega a compilar una llamada incorrecta vale mucho en ese contexto.

---

## Cinco rasgos que reaparecen en cada capítulo posterior

Propósito: Usas estos cinco rasgos como el hilo conductor de todo el tema, porque cada capítulo posterior es esencialmente uno de ellos examinado de cerca — reconocerlos aquí es lo que evita que un capítulo aparezca de la nada.

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → lee: la sección sobre lenguajes de tipado estático, para entender por qué la comprobación de tipos ocurre antes de la ejecución en lugar de durante ella

Java tiene una personalidad, y es sorprendentemente consistente. Cinco rasgos explican casi todos los momentos de «¿por qué me obliga a hacer esto?» que vas a tener, y cada uno se detalla a fondo en un archivo posterior.

**1. Tipado estático — el tipo forma parte de la declaración, y nunca cambia.** Cuando escribes `int quantity = 2;`, el nombre `quantity` queda ligado al tipo `int` para el resto de su vida. Lo que importa aquí no es solo la regla, sino el mecanismo detrás de ella: como el tipo queda escrito en el código fuente, el compilador puede razonar sobre una línea *sin llegar a ejecutarla nunca*. No necesita saber que `quantity` valdrá `2` a las nueve de la mañana y `40` a la hora de comer — solo necesita el tipo declarado para decidir que multiplicarlo por un trozo de texto no es una operación legal. Por eso Java puede rechazar código que, de otro modo, solo fallaría el único martes al año en que se ejecuta el camino malo — es decir, código que solo fallaría en el momento de la ejecución, cuando de verdad se llega a hacer esa operación no permitida. Este rasgo es el tema entero de [01-variables-tipos.md](01-variables-tipos.md), y vuelve con fuerza en [10-genericos.md](10-genericos.md), donde el tipo de los valores *dentro* de una colección también se declara y se comprueba.

**2. Todo el código ejecutable vive dentro de una clase.** En JavaScript puedes poner una función sola en un archivo y exportarla. Java no tiene equivalente: `main`, y cualquier otro método, tiene que pertenecer a alguna clase. La razón tiene que ver con cómo guarda el compilador el resultado: genera un archivo `.class` por cada clase, así que una clase es lo más pequeño que se puede compilar y cargar. Lo puedes ver en tu propio proyecto: `target/classes/com/victor/timetrack/TimetrackApplication.class` es la forma compilada de `TimetrackApplication.java`. Un archivo fuente entra, un archivo de clase sale. Qué es realmente una clase, qué contiene y cómo se diseña está en [04-poo-clases.md](04-poo-clases.md).

**3. Primero compilar, luego ejecutar — siempre dos momentos.** Aunque IntelliJ oculte ambos detrás de un único botón verde, siguen siendo dos cosas separadas, y saber cuál de los dos te está hablando es la mitad del trabajo al depurar. La sección de más abajo recorre ese pipeline paso a paso; [14-maven.md](14-maven.md) es lo que lo automatiza una vez que un proyecto real tiene docenas de archivos y librerías externas que descargar antes.

**4. El destino final es la JVM, no tu máquina.** El compilador no produce instrucciones para tu procesador concreto. Produce bytecode para una máquina abstracta — la JVM — y existe una JVM para Windows, macOS, Linux y lo que sea que tu empresa use en producción. Este es el origen del viejo eslogan de Java, *write once, run anywhere* («escríbelo una vez, ejecútalo en cualquier sitio»), y no es solo marketing: el artefacto — el archivo compilado, el bytecode — que construyes en tu portátil con Windows es exactamente el mismo que ejecuta un servidor Linux en producción, sin cambios y sin volver a compilar, porque ambas máquinas ejecutan ese mismo bytecode dentro de una JVM en lugar de ejecutar tu código fuente directamente. La JVM también es quien gestiona la memoria por ti mientras el programa corre, que es el tema de [15-modelo-de-memoria.md](15-modelo-de-memoria.md). Para un desglose preciso de la JVM frente al JRE y el JDK que instalaste, mira [Baeldung — Difference Between JVM, JRE, and JDK](https://www.baeldung.com/jvm-vs-jre-vs-jdk). Resumido: el **JDK** (Java Development Kit) es el kit completo que instalaste — `javac`, la JVM, y todo lo necesario para escribir y compilar Java; el **JRE** (Java Runtime Environment) es un JDK reducido, con solo la JVM y las librerías necesarias para *ejecutar* un programa ya compilado, sin compilador incluido. Tú instalaste el JDK, porque además necesitas compilar.

**5. Un exceso de código deliberado.** Java dice en voz alta lo que JavaScript infiere en silencio. Una forma de datos que TypeScript declara como una interfaz de cuatro campos se convierte, en Java clásico, en cuatro campos privados, un constructor que nombra cada uno de ellos dos veces, y cuatro getters — mucho más código para decir lo mismo. Esto es una decisión de diseño, no un descuido: Java está optimizado para la persona que _lee_ un código que no escribió, años después, por encima de la persona que lo está tecleando hoy. Una vez que sabes eso, ese exceso de código deja de sentirse como fricción y empieza a ser predecible. El lenguaje también ha ido recortándolo donde puede — los records en [04-poo-clases.md](04-poo-clases.md) reducen toda una **clase de datos** (una clase que solo existe para agrupar y guardar valores, como `User`) a una sola línea, y las lambdas en [09-streams-lambdas.md](09-streams-lambdas.md) hacen lo mismo con el **comportamiento** (código que actúa, como una función que pasas como argumento a otra).

| Rasgo | Qué te obliga a hacer | Dónde se examina a fondo |
| --- | --- | --- |
| Tipado estático | Declarar un tipo y mantenerlo; el compilador comprueba cada uso antes de arrancar | `01-variables-tipos.md`, `10-genericos.md` |
| El código vive en una clase | No hay funciones sueltas; una clase es la unidad de compilación | `04-poo-clases.md` |
| Compilar y luego ejecutar | Dos momentos separados, dos tipos de mensaje de error | este archivo, y después `14-maven.md` |
| El destino final es la JVM | El bytecode es portable; la memoria la gestiona la JVM, no tú | `15-modelo-de-memoria.md` |
| Exceso de código deliberado | Más tecleo, optimizado para quien lee en lugar de para quien escribe | `04-poo-clases.md`, `09-streams-lambdas.md` |

La tercera columna es la que sirve en la práctica: cuando un archivo posterior te parezca arbitrario, busca a qué rasgo pertenece aquí, y el capítulo suele dejar de ser una lista de reglas sueltas para convertirse en una sola idea aplicada.

---

## Viniendo de JavaScript — dónde ayuda la comparación y dónde miente

Propósito: Usas esto cuando una construcción de Java se parece a algo que ya conoces de JavaScript o TypeScript, porque más o menos la mitad de esos parecidos son reales y la otra mitad te va a costar una tarde entera.

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → lee: la sección sobre lenguajes de tipado dinámico, que es el lado de JavaScript de cada contraste de más abajo

> **Adelanto — el nombre del compilador.** Algunos ejemplos de más abajo muestran al compilador rechazando código malo con un comentario del tipo `// javac infiere...`. `javac` es el nombre real, el que usarías en una terminal, del compilador de Java — la etapa «Compilación» de la sección [Del código fuente al bytecode y a la ejecución en la JVM](#del-código-fuente-al-bytecode-y-a-la-ejecución-en-la-jvm), más abajo, explica qué hace paso a paso. Por ahora, lee `javac` simplemente como «el compilador de Java».

Tu experiencia con React y TypeScript es una ventaja aquí — no estás aprendiendo a programar, estás llevando ideas que ya conoces a un lenguaje nuevo. El riesgo es que parte de ese mapeo esté mal de una forma que parece correcta, y esos son justo los casos que te van a costar una tarde entera.

**Esto se traslada casi sin cambios.** La sintaxis de `if`, `while` y `for` es la misma. `try { } catch (e) { }` se ve idéntico (lo que Java hace _por dentro_ es otra historia — mira el aviso de más abajo). Un bucle sobre una colección se lee como un `for...of`. Sumar un número a un trozo de texto con `+` concatena en los dos lenguajes, así que `"total: " + 30` produce `"total: 30"` tal como esperas. Y `final` sobre una variable se comporta lo bastante parecido a `const` como para que la analogía merezca la pena, con una salvedad que [01-variables-tipos.md](01-variables-tipos.md) explica bajo «la media verdad de que es `const`».

**Esto parece igual y no lo es.** Los cuatro casos de abajo son los que de verdad te van a morder.

*`var` no es `var`.* Java tomó prestada la palabra y le dio un significado casi opuesto. En JavaScript, `var` declara una variable sin tipo alguno. En Java, `var` significa «deduce el tipo a partir de lo que te estoy asignando, y luego mantenme fiel a él para siempre». Por ejemplo:

```java
// ✅ bien — el compilador infiere int a partir del valor inicial
var total = 30;

// ❌ MAL — total es un int, para siempre
total = "thirty";
```

```text
error: incompatible types: String cannot be converted to int
```

Así que `var` no es un error en el sistema de tipos, es un atajo _dentro_ de él — el tipo sigue quedando fijado en el momento en que escribes la línea, simplemente no has tenido que escribirlo explícitamente. No hay ninguna recomendación general sobre si usarlo o no: es cuestión de estilo, y [01-variables-tipos.md](01-variables-tipos.md) tiene la sección completa, incluidas las dos formas de dejar el lado derecho sin información suficiente que `javac` rechaza directamente.

*La forma de un objeto queda fija en tiempo de compilación.* En JavaScript puedes añadirle una propiedad a un objeto cuando quieras y el objeto simplemente crece. En Java, el conjunto de campos lo decide la clase, y un campo que la clase nunca declaró no existe. Imagina una clase `User` que solo declara un campo `name`:

```java
public class User {
    public String name;
    // no hay ningún campo "age" declarado
}
```

Intentar asignarle un campo que esa clase nunca declaró falla así:

```java
User user = new User();

// ❌ MAL — la clase User no tiene ningún campo llamado age
user.age = 30;
```

```text
error: cannot find symbol
        user.age = 30;
            ^
  symbol:   variable age
  location: variable user of type User
```

Vale la pena reconocer ese mensaje pronto, porque `cannot find symbol` es el error que más te vas a encontrar en tus primeras semanas. Siempre significa lo mismo: el compilador buscó un nombre — una variable, un método, una clase — y no existe nada con ese nombre en el sitio donde lo buscó.

*`==` está haciendo una pregunta distinta.* En JavaScript la distinción interesante es `==` frente a `===`, y va sobre **coerción de tipos** — `==` convierte en silencio un lado para que coincida con el tipo del otro antes de comparar (`1 == "1"` da `true`), mientras que `===` se niega a convertir nada. En Java no existe `===`, y su `==` no tiene nada que ver con coerción: sobre objetos pregunta «¿estas dos variables apuntan al mismo objeto en memoria?», que casi nunca es la pregunta que querías hacer sobre dos valores `String`. Equivocarse aquí es el bug de principiante más común en Java, y se resuelve en dos sitios. El caso con el que te vas a topar primero, comparar dos trozos de texto, se responde en el archivo siguiente: [01-variables-tipos.md](01-variables-tipos.md) muestra por qué `.equals()` — y no `==` — es el método que en realidad quieres usar para comparar el *contenido* de dos strings, y por qué los literales de texto sueltos hacen que `==` _parezca_ correcto justo las veces suficientes como para engañarte (Java reutiliza en silencio los literales idénticos desde un pool compartido, un detalle que [01-variables-tipos.md](01-variables-tipos.md) cubre a fondo). La regla general para tus propias clases — decidir qué debería significar «igual» para dos objetos `User`, y escribir el método que responde a esa pregunta — espera a [04-poo-clases.md](04-poo-clases.md).

*Los tipos de TypeScript y los de Java no sobreviven el mismo tiempo.* TypeScript comprueba tus tipos y luego los **borra**: el JavaScript que realmente se ejecuta en el navegador no contiene ningún tipo, y nada vuelve a comprobar nada mientras corre. Los tipos declarados en Java sobreviven a la compilación — quedan registrados en el archivo `.class`, y la propia JVM rechaza una conversión inválida en tiempo de ejecución. La única característica de Java que aquí se comporta como TypeScript son los genéricos, cuyos argumentos de tipo _sí_ se descartan después de comprobarse; [10-genericos.md](10-genericos.md) explica ese borrado de tipos (_type erasure_) y qué te impide hacer.

| Hábito de JS/TS | Qué hace JS/TS | Qué hace Java | Veredicto |
| --- | --- | --- | --- |
| `for...of` sobre una colección | Recorre los valores de la colección | `for (String name : names)` | Igual |
| `const` | Fija el nombre, no el contenido | `final` | Igual, con una salvedad en `01` |
| Sintaxis de `try / catch` | Solo en runtime, sin que el compilador intervenga | Forma idéntica, pero comprobado por el compilador para algunas excepciones | Igual |
| `var` | Sin ningún tipo — puede guardar cualquier cosa, siempre | Infiere un único tipo fijo y lo impone para siempre | **Cuidado — distinto** — significado casi opuesto |
| Añadir una propiedad en tiempo de ejecución | El objeto simplemente crece | Los campos los declara solo la clase | **Cuidado — distinto** — `cannot find symbol` |
| `==` frente a `===` | `==` convierte tipos antes de comparar | `==` sobre objetos compara identidad, no contenido | **Cuidado — distinto** — usa `equals` |
| Tipos de TS borrados al compilar | Desaparecen antes de que el código corra | Los tipos sobreviven hasta el bytecode | **Cuidado — distinto** — excepto los genéricos |

Usa la columna Veredicto como permiso. En una fila «Igual», confía en tu instinto y sigue adelante. En una fila «Cuidado — distinto», párate y lee el capítulo enlazado antes de escribir código que dependa de tu suposición — no son trampas del lenguaje, simplemente se comportan de forma distinta a lo que ya conoces.

> **Una comparación que hay que rechazar del todo: las excepciones.** Es tentador leer el `try/catch` de Java como el de JavaScript porque la sintaxis coincide. El mecanismo no es el mismo. Java tiene toda una jerarquía de tipos de excepciones, y para una parte de esa jerarquía el propio *compilador* se niega a construir tu programa hasta que hagas una de estas dos cosas: gestionar el fallo tú mismo dentro del método, con un `catch`, o declarar en la firma del método que el fallo se propaga hacia quien lo llamó, para que lo gestione más arriba. Esa es una obligación en tiempo de compilación que no tiene ningún equivalente en JavaScript. Trasladar tus hábitos de errores de JS a esto produce código que no compila, con un mensaje que no tiene sentido hasta que conoces el modelo completo. Empieza ese tema desde cero en [08-excepciones.md](08-excepciones.md).

---

## El programa Java más pequeño que se ejecuta

Propósito: Usas este esqueleto como el marco en el que vive cada ejemplo de cada archivo posterior, porque Java tiene un mínimo fijo antes de que se pueda ejecutar una sola línea de tu propia lógica.

Docs: [Baeldung — Java main() Method Explained](https://www.baeldung.com/java-main-method) → lee: la explicación inicial de la firma habitual, donde se desmontan `public` y `static` palabra por palabra

En JavaScript, un archivo con una sola línea ya es un programa. Java tiene un mínimo, y son tres cosas: una clase cuyo nombre coincide con el del archivo, un punto de entrada con una firma exacta, y algo que produzca una salida para que puedas ver que ha pasado algo.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}
```

Guardado como `Hello.java`, compilado con `javac Hello.java` y arrancado con `java Hello`, esto imprime:

```text
Hello from Java
```

**El nombre del archivo no es una convención, es una regla.** Una clase `public` tiene que vivir en un archivo con exactamente su propio nombre más `.java`. Pon la clase `PriceCalculator` en un archivo llamado `Wrong.java` y nada compila:

```text
error: class PriceCalculator is public, should be declared in a file named PriceCalculator.java
```

La razón es que tanto el compilador como la JVM encuentran una clase _por su nombre_: cuando algo pide `PriceCalculator`, la herramienta va a buscar `PriceCalculator.class`, producido a partir de `PriceCalculator.java`. Que los dos nombres coincidan convierte «encontrar esta clase» en una búsqueda de archivo predecible, en vez de una búsqueda entre todos los archivos del disco.

**`main` es la puerta, y la JVM solo conoce una puerta.** Cuando ejecutas `java Hello`, la JVM carga esa clase y busca un método con exactamente esta forma. Cada palabra de esa firma está haciendo un trabajo:

```text
public static void main(String[] args)
  │      │     │    │      │
  │      │     │    │      └─ los argumentos de línea de comandos, entregados como un array de texto
  │      │     │    └─ el nombre fijo que busca la JVM — no vale ningún otro
  │      │     └─ no devuelve nada; no hay ningún llamador en tu código al que devolverle algo
  │      └─ se puede llamar sin crear antes un objeto de la clase
  └─ visible desde cualquier sitio, incluso desde fuera del propio paquete de esta clase
```

Hay una palabra en esa última línea que necesita desmontarse antes de poder leerla del todo: un **paquete** (_package_) es el espacio de nombres en el que se declara una clase, escrito como un nombre con puntos que refleja su ruta de carpetas en disco. Tus clases de TimeTrack están en `com.victor.timetrack` y sus subpaquetes, que es exactamente la cadena de carpetas `com/victor/timetrack/` que viste más arriba. Es el límite contra el que se mide «visible desde cualquier sitio».

Si falta ese método, la clase compila perfectamente igual — no le pasa nada _como clase_ — y el fallo llega después, desde la JVM, en el momento en que intentas arrancarla:

```text
Error: Main method not found in class NoMain, please define the main method as:
   public static void main(String[] args)
```

> **¿Por qué falla ahí, y no en tiempo de compilación?** Porque una clase sin método `main` es una clase completamente normal y útil — la mayoría de las clases del proyecto 07 no tienen ningún `main` y se compilan y se usan constantemente. «Tener un punto de entrada» no es una propiedad que el compilador pudiera exigirle razonablemente a cada clase; es una exigencia que la JVM le hace a la _única_ clase que nombras en la línea de comandos, en el momento en que la nombras.

**Todavía no desmontes esa firma — y es deliberado.** Acabas de conocer `public`, `static` y `String[]`, y cada uno es un concepto real con su propio capítulo. `public` y `static` son visibilidad y pertenencia a nivel de clase, que van junto a las clases en [04-poo-clases.md](04-poo-clases.md). `String[]` es un array, una fila de valores de longitud fija, que va junto a las demás formas de guardar muchos valores en [07-colecciones.md](07-colecciones.md). Léelos aquí como una fórmula fija que puedes reconocer. Todo ejemplo desde `01` en adelante imprime algo, así que este es el marco donde viven esos ejemplos — y deja de ser una fórmula en los dos capítulos que son dueños de ella.

**`System.out.println` es cómo ves absolutamente cualquier cosa.** `System.out` es el flujo de salida estándar, que para ti es la consola de IntelliJ, y `println` escribe ahí su argumento y luego salta a una línea nueva. Su hermano `print` escribe sin el salto de línea. Para toda tu ruta junior, esta es la herramienta de depuración por defecto; una aplicación real usa en su lugar una librería de logging, para poder apagar esa salida, ponerle marca de tiempo y redirigirla a un archivo en producción.

> **Adelanto — Spring Boot:** el fragmento de abajo es de tu propio proyecto y usa clases de Spring Boot que todavía no has estudiado. Está aquí solo para mostrarte que la misma firma de `main` está por debajo de una aplicación con framework — `@SpringBootApplication` y `SpringApplication.run` se explican como es debido en las notas de Spring Boot.

`Hello` no es una versión de juguete de algo que los programas de verdad hacen distinto. Es exactamente lo que hace una aplicación Spring Boot. `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/TimetrackApplication.java` tiene apenas una docena de líneas, y la importante es la firma que acabas de leer:

```java
@SpringBootApplication
public class TimetrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimetrackApplication.class, args);
	}

}
```

Todo el back end de TimeTrack — cada controller, cada regla de seguridad, la conexión a la base de datos — arranca desde esa única llamada. Spring Boot no reemplaza el punto de entrada de Java; arranca encima de él.

> **Puede que veas código Java sin ninguna clase alrededor.** Desde Java 25, la versión que corre tanto en tu máquina como en el proyecto 07, un archivo que contiene solo `void main() { ... }` se puede lanzar directamente con `java file.java`, sin clase y sin `static`. Funciona, y existe para acortar una primera lección. No es lo que usa ningún proyecto real — todos los archivos del proyecto 07, y todos los ejemplos de estas notas, usan la forma completa — así que trata la forma corta como una curiosidad que hay que reconocer, no como la forma que hay que aprender.

---

## La ruta de aquí a Maven, y por qué sigue ese orden

Propósito: Usas este mapa para saber por qué los dieciséis capítulos siguientes llegan en el orden en que llegan y, más en la práctica, qué archivo del disco es realmente cada paso — porque los números de los nombres de archivo no son el orden de lectura.

Docs: [Baeldung — Get Started with Java](https://www.baeldung.com/get-started-with-java-series) → lee: la lista ordenada de artículos de la serie, como una segunda opinión sobre cómo se suele secuenciar el mismo terreno

La ruta empieza con lo más pequeño que puede contener un programa y termina con la herramienta que construye todo el conjunto, y cada paso se coloca justo antes del paso que lo necesita. El `01` te da los valores — números, booleanos, las reglas que deciden cuándo un `int` se convierte en un `long`, y por qué un decimal nunca es exactamente el número que escribiste — porque toda línea posterior manipula un valor de algún tipo. El `02` coge el único tipo de valor lo bastante grande como para merecer su propio capítulo, el texto, y muestra por qué un `String` que parece que modificas es en realidad un objeto nuevo cada vez. Con los valores individuales ya entendidos, el `03` deja de evaluar expresiones una a una y empieza a elegir entre ellas y a repetirlas, y el `04` empaqueta ese comportamiento en métodos con nombre y un contrato que cada llamada tiene que cumplir. El `05` abre entonces esa frontera del método y muestra la maquinaria: qué se copia en un parámetro, dónde vive realmente el objeto en sí, y cómo rastrea la JVM una cadena de llamadas — el mecanismo sobre el que razonan más adelante los objetos, las excepciones y las colecciones. Solo entonces el `06` construye objetos reales con estado válido y responde a la pregunta que los objetos plantean de inmediato: ¿cuándo son iguales dos de ellos? El `07` separa el comportamiento que necesita quien llama de la clase que resulta proporcionarlo, y el `08` explica cómo decide Java en tiempo de ejecución qué implementación se ejecuta de verdad. El `09` te enseña a leer `Map<String, List<Order>>` _antes_ de que el `10` llene la pantalla con exactamente eso, para que ningún ejemplo de colecciones contenga nunca una sintaxis que no puedas interpretar. El `11` desarrolla el modelo completo del fallo — cómo viaja, dónde se gestiona, cómo se lee la traza — ahora que las búsquedas, las conversiones y la iteración ya te han dado varias formas de fallar. El `12` le da a Java la capacidad de pasar comportamiento como si fuera un valor, que es lo que hace legibles los pipelines de streams. El `13` cierra un conjunto de valores en un enum que el compilador puede comprobar de forma exhaustiva; el `14` aplica la misma idea de valor inmutable a fechas y horas, donde el conjunto de valores posibles es ilimitado y ninguna comprobación del compilador puede salvarte; el `15` generaliza `@Override` a las anotaciones como metadatos que lee alguna herramienta concreta, que es lo que hace que las anotaciones de Spring que ves a diario dejen de parecer sintaxis oculta de Java. El `16` cierra con Maven, el build que resuelve, compila, testea y empaqueta todo lo que produjeron los quince capítulos anteriores.

> **Los números en los nombres de archivo no son el orden de lectura.** Solo `00` y `01` coinciden. Los archivos se escribieron antes de planificar esta ruta, y renumerarlos rompería varios cientos de enlaces por todo el repositorio, así que los nombres se dejaron tal cual a propósito. Lee el orden en la tabla de abajo e ignora el número del archivo — la tabla es la autoridad, no el listado de la carpeta.

| Orden de lectura | Archivo en `es/`              | Por qué va aquí                                                                                 |
| ----------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
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

Propósito: Usas este proceso cada vez que compilas o ejecutas código Java, porque te permite identificar qué herramienta comprueba el código fuente, qué produce y qué ejecuta realmente el resultado.

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

Propósito: Usas esta distinción al leer un error o depurar un resultado incorrecto, porque el momento del fallo te indica si el compilador rechazó el código fuente o si el problema apareció durante la ejecución.

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

La ejecución llegó hasta la división, por lo que se trata de un **fallo en runtime**. Si la excepción no se gestiona, la operación actual se detiene y Java muestra información sobre el fallo.

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
| -------------------------------- | ---------------------------------: | ------------------------: | ------------------------------------------------ |
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

Un **fallo en tiempo de compilación** te cuesta segundos. `javac` lee cada línea del código fuente se llegue o no a ejecutar esa línea alguna vez, así que encuentra el error sin necesitar que llegue primero la entrada correcta, el usuario correcto o el día del mes correcto. Te indica el archivo, la línea, y un símbolo `^` bajo el carácter exacto — y hace todo eso antes de que el programa se haya ejecutado ni una vez, así que nadie más que tú lo llega a ver nunca.

Una **excepción** cuesta más, porque nada la encuentra hasta que la línea que falla realmente se ejecuta. La división de arriba es invisible hasta que llega una petición cuyo `divisor` es de verdad `0`; en cualquier otra petición ese mismo código funciona bien. Su punto a favor es que, cuando por fin ocurre, es ruidosa: la ejecución se detiene, y Java imprime el tipo de excepción, su mensaje, y la lista de métodos que estaban activos en ese momento — la **stack trace** — que señala la línea exacta.

Un **error de lógica** es el caro, y por una razón muy concreta: ninguno de los dos puntos de control lo está siquiera buscando. El compilador comprueba que el código fuente respeta las reglas de Java. La JVM comprueba que cada operación es posible con los valores que realmente recibió. Nada en ningún punto de ese pipeline guarda una copia de lo que tú _querías decir_. `quantity + unitPrice` es una suma perfectamente legal de dos valores `int`, así que el programa compila, se ejecuta, termina con éxito, e imprime `17` con total confianza. Lo único que puede detectarlo es comparar contra un resultado esperado — que tú leas la salida, que un compañero revise el código, o un test que compruebe que debería dar `30`. Si no se detecta, no provoca un crash; le factura al cliente el importe equivocado, en silencio, durante meses.

| Fallo                        | Qué lo encuentra                                          | Cuándo                                     | Qué cuesta si se pasa por alto            |
| ------------------------------ | ------------------------------------------------------------ | --------------------------------------------- | -------------------------------------------- |
| Error de sintaxis o de tipos | `javac`                                                   | Antes de que el programa arranque siquiera | Segundos, y solo tu propio tiempo         |
| Excepción                    | La JVM, cuando se ejecuta esa línea                       | Solo en el camino que realmente falla      | Un crash visible con una stack trace      |
| Error de lógica              | Una persona o un test que compara lo esperado con lo real | Puede que nunca                            | Datos incorrectos, producidos en silencio |

La tercera columna es la que importa: «cuándo» es en realidad «cuánto cuesta», porque un fallo es más barato de arreglar en el momento en que se crea y más caro cuando lleva un mes corriendo en producción. Lee la tabla de arriba abajo como una escalera de coste, no como una lista de tres cosas equivalentes.

> **Esta escalera es el argumento detrás de dos hábitos que parecen trabajo extra.** El exceso de código deliberado de Java — declarar un tipo en cada variable, que te riñan por un punto y coma que falta — es lo que te compra la fila de arriba: convierte tantos errores como puede en errores del compilador, que son los baratos. Los tests son lo que te compra la fila de abajo, porque un error de lógica no tiene ningún otro detector; por eso precisamente el proyecto 07 es el primero de tus proyectos que planifica tests de verdad. Su Step 8 escribe un test de JUnit por cada método de servicio, comprobando las propias reglas de negocio — que aprobar una entrada que nunca se envió lanza una excepción, que las horas aprobadas del resumen coinciden con la suma por proyecto. Los proyectos 01 a 06 solo entregaron los specs vacíos `should be created` que genera el CLI de Angular, que no comprueban nada sobre lo que se suponía que debía calcular el código.

Ahora puedes situar un problema en el ciclo de vida básico de Java: el código fuente se comprueba y se compila a bytecode; después, una JVM ejecuta ese bytecode. A continuación, [01-variables-tipos.md](01-variables-tipos.md) examina los tipos declarados que sustentan esas comprobaciones del compilador: qué valores permite Java que contenga cada variable y por qué los tipos incompatibles se rechazan antes de la ejecución.
