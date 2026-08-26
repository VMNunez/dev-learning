## Índice de esta nota

- [Fundamentos de la ejecución en Java](#fundamentos-de-la-ejecución-en-java)
- [1. Qué es Java y qué papel juega en tu stack](#qué-es-java-y-qué-papel-juega-en-tu-stack)
  - [Java es un lenguaje orientado a objetos](#java-es-un-lenguaje-orientado-a-objetos)
  - [Dónde vive Java en tu stack](#dónde-vive-java-en-tu-stack)
- [2. Del código fuente al bytecode y a la ejecución en la JVM](#del-código-fuente-al-bytecode-y-a-la-ejecución-en-la-jvm)
- [3. Fallos en tiempo de compilación frente a fallos en runtime](#fallos-en-tiempo-de-compilación-frente-a-fallos-en-runtime)
  - [Errores de sintaxis y de tipos — rechazados en tiempo de compilación](#errores-de-sintaxis-y-de-tipos--rechazados-en-tiempo-de-compilación)
  - [Excepciones — código fuente válido que falla en runtime](#excepciones--código-fuente-válido-que-falla-en-runtime)
  - [Errores de lógica — la ejecución termina, pero la respuesta es incorrecta](#errores-de-lógica--la-ejecución-termina-pero-la-respuesta-es-incorrecta)
  - [Cuál de los tres es más barato de encontrar](#cuál-de-los-tres-es-más-barato-de-encontrar)
- [4. Cinco rasgos que reaparecen en cada capítulo](#cinco-rasgos-que-reaparecen-en-cada-capítulo)
- [5. Viniendo de JavaScript — dónde ayuda la comparación y dónde miente](#viniendo-de-javascript--dónde-ayuda-la-comparación-y-dónde-miente)
  - [Lo que funciona igual en los dos lenguajes](#lo-que-funciona-igual-en-los-dos-lenguajes)
  - [Lo que parece funcionar igual, y no es así](#lo-que-parece-funcionar-igual-y-no-es-así)
  - [Tabla resumen](#tabla-resumen)
- [6. El programa Java más pequeño que se ejecuta](#el-programa-java-más-pequeño-que-se-ejecuta)
- [7. La ruta de aquí a Maven, y por qué sigue ese orden](#la-ruta-de-aquí-a-maven-y-por-qué-sigue-ese-orden)

# Fundamentos de la ejecución en Java

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) y «Java Virtual Machine» (sección 5) para ver las dos etapas que llevan del código fuente a la ejecución

---

JavaScript puede empezar a ejecutar un archivo y no descubrir que existe una operación incorrecta hasta llegar a esa línea. Java añade una comprobación previa a la ejecución: un compilador revisa primero todo el código fuente, antes de que se ejecute ni una sola línea. Esa comprobación previa explica por qué algunos errores te detienen antes de arrancar y otros solo aparecen después.

Esta nota es el mapa de todo lo que vas a estudiar después, y sus siete secciones están ordenadas para que cada una prepare la siguiente. La primera responde qué tipo de lenguaje es Java, explica el modelo en el que se apoya todo el lenguaje — la programación orientada a objetos — y sitúa qué papel juega Java en el stack que estás construyendo. La segunda sigue un archivo `.java` a través de las dos etapas que se llevan a cabo hasta que se convierte en un programa en ejecución, porque de ahí sale todo lo demás. Esa frontera entre las dos etapas es justo lo que explica las tres formas distintas en que tu código puede fallar, y ese es el tema de la tercera sección. Con eso ya claro, la cuarta repasa los cinco rasgos de Java que reaparecen en cada capítulo, y la quinta los enfrenta a lo que ya sabes de JavaScript: qué hábitos puedes traerte tal cual y cuáles te van a costar un error. La sexta muestra el programa más pequeño que se puede ejecutar en Java, señalando qué capítulo de estas notas explica cada una de sus piezas. Y la séptima traza la ruta completa de lectura, del capítulo `01` al `16`.

## Qué es Java y qué papel juega en tu stack

Docs: [Baeldung — Spring Boot Tutorial: Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → lee: la visión general inicial y la primera aplicación arrancada, para ver que un servicio Spring Boot es Java normal, compilado y arrancado como cualquier otro programa Java

Java es un **lenguaje de propósito general, con tipado estático, basado en clases, que compila a bytecode y se ejecuta sobre una JVM**. Es una frase densa, así que vayamos parte por parte:

- **De propósito general** — Java no está atado a un único tipo de programa. Se usa para crear backends web, apps Android, herramientas de escritorio y procesos batch — programas sin pantalla ni nadie delante, que se lanzan solos a una hora fijada y procesan de una tacada un lote entero de datos — que mueven millones de filas de un sistema a otro cada noche.
- **Con tipado estático** — cada variable se declara con un tipo (`int`, `String`, `User`, etc), ese tipo queda fijado desde ese momento, y el compilador comprueba cada uso de esa variable durante la compilación, antes de que el programa pueda arrancar, precisamente para detectar errores de tipo antes de que lleguen a ejecutarse.
- **Basado en clases** — en Java no existen funciones sueltas en un archivo. Cada línea de código ejecutable pertenece a una clase, y la clase es la unidad elemental que el compilador necesita para compilar y producir una salida.
- **Compila a bytecode y se ejecuta sobre una JVM** — el proceso completo se explica en la sección siguiente. Por ahora quédate con esto: una herramienta comprueba y traduce tu código fuente, y un segundo programa distinto ejecuta esa traducción.

### Java es un lenguaje orientado a objetos

De los cuatro rasgos de arriba, el que más te va a cambiar la forma de escribir código es «basado en clases», porque detrás de esa palabra hay un modelo entero: la **programación orientada a objetos** (POO). Su idea es una sola. En lugar de tener por un lado los datos y por otro las funciones que los manipulan, la POO junta las dos cosas en la misma unidad.

Esa unidad es el **objeto**: un valor que guarda datos dentro — su **estado** — y que además sabe hacer cosas con ellos — su **comportamiento**, escrito en forma de métodos. Y la **clase** es la plantilla desde la que se fabrican los objetos: declara qué campos va a tener cada objeto y qué métodos va a poder ejecutar. Con una única clase `Invoice` puedes crear mil facturas distintas, cada una con sus propios datos y todas con los mismos métodos.

```java
public class Invoice {

    private int quantity;      // estado: los datos que guarda cada factura
    private int unitPrice;

    public int total() {       // comportamiento: lo que la factura sabe hacer con sus datos
        return quantity * unitPrice;
    }
}
```

Fíjate en lo que no hace falta escribir: `total()` no recibe ningún parámetro. No lo necesita, porque `quantity` y `unitPrice` ya están dentro del objeto que está ejecutando el método. En JavaScript sueles escribir `calcularTotal(quantity, unitPrice)`, con la función por un lado y los datos por otro, y es quien llama el que tiene que juntarlos; en Java escribes `invoice.total()`, y los datos viajan ya dentro del objeto.

De ese modelo salen cuatro ideas que aparecen por su nombre en cualquier entrevista junior:

| Idea              | Qué significa                                                                                                   | Dónde se estudia              |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Encapsulación** | Los campos se declaran `private` y solo se leen o se cambian a través de los métodos de la propia clase         | `06-poo-clases.md`            |
| **Abstracción**   | Describir qué métodos hay que tener sin decir cómo se implementan — eso es una interfaz                         | `07-interfaces-abstractas.md` |
| **Herencia**      | Una clase parte de otra y se queda con sus campos y sus métodos, en lugar de repetirlos                         | `08-herencia-polimorfismo.md` |
| **Polimorfismo**  | Varias clases responden al mismo método cada una a su manera, y Java decide en ejecución cuál de ellas se llama | `08-herencia-polimorfismo.md` |

La tercera columna es la que hay que leer con calma: ninguna de las cuatro ideas se aprende aquí. Aquí solo necesitas reconocer los nombres, porque los vas a oír antes de llegar a estudiarlos; cada uno se explica entero en el archivo que indica esa columna.

> **Por qué juntar los datos y el comportamiento cambia algo de verdad.** Al declarar los campos `private`, el único código del mundo que puede modificar el `quantity` de una factura son los métodos de la clase `Invoice`. Eso deja a la clase como el único sitio por el que se puede colar un dato incorrecto, así que ahí, y solo ahí, escribes las comprobaciones — «la cantidad no puede ser negativa» — y quedan garantizadas para todas las facturas del programa. Si los datos estuvieran sueltos en un objeto que cualquiera puede tocar, esa comprobación habría que repetirla en cada sitio que lo modifica, y bastaría con olvidarla una vez.
>
> Un matiz que conviene fijar ya: no todo en Java es un objeto. Los tipos **primitivos** — `int`, `double`, `boolean` y unos pocos más — son valores puros, sin métodos ni estado dentro, y son la excepción a la regla. Todo lo demás que manejes es un objeto de alguna clase. La lista completa está en [01-variables-tipos.md](01-variables-tipos.md).

### Dónde vive Java en tu stack

Así encaja este lenguaje en el stack que estás construyendo: Angular es dueño del navegador, Java es dueño del servidor, y la base de datos está detrás de Java y solo se alcanza a través de él.

```text
  ┌──────────────┐               ┌────────────────────┐        ┌────────────┐
  │   Angular    │  HTTP + JSON  │ Spring Boot (Java) │  SQL   │ PostgreSQL │
  │ (TypeScript) │ ────────────► │ reglas, seguridad, │ ─────► │   tablas   │
  │  pantallas   │ ◄──────────── │   acceso a datos   │ ◄───── │            │
  └──────────────┘               └────────────────────┘        └────────────┘
```

El navegador no tiene ninguna conexión con la base de datos, y no puede tenerla. Lo único que hace es enviar una petición HTTP al servidor Java y quedarse esperando la respuesta. El servidor Java recibe esa petición, consulta la base de datos por su cuenta, y le devuelve al navegador el resultado ya convertido en JSON.

Ese reparto tiene una consecuencia directa. Como el servidor Java es lo único que mantiene la conexión a la base de datos, es también el único sitio donde se puede hacer cumplir de verdad una **regla de negocio** — una condición que decide qué puede hacer cada usuario. Poner esa misma comprobación en Angular no está mal como primera barrera, para mejorar la experiencia de usuario y evitar peticiones innecesarias, pero no es seguridad real: cualquiera puede abrir la pestaña _Network_ del navegador y llamar al endpoint directamente, saltándose por completo el código Angular. La única regla que cuenta de verdad es la que vive en el backend.

> **Java es el lenguaje; Spring Boot es un framework escrito en ese lenguaje.** Al principio es fácil mezclar los dos conceptos, y separarlos ahora te ahorra mucha confusión más adelante. Java te da clases, tipos, métodos y excepciones. Spring Boot es un montón de Java que ya han escrito otras personas y que tú te descargas para usarlo, igual que en Node te descargas paquetes de npm.
>
> Esas descargas llegan en forma de archivos `.jar`. Un `.jar` no tiene nada de mágico: es un archivo comprimido que dentro lleva clases ya compiladas, esos archivos `.class` de los que habla la sección siguiente. Tú no lo abres nunca ni lo descargas a mano: escribes en un archivo de configuración qué librerías necesitas, tu herramienta de build las descarga a una carpeta de tu ordenador, y a partir de ahí el compilador y la JVM buscan clases dentro de esos `.jar` igual que buscan las tuyas. Esa herramienta de build es Maven, y cómo se le declara la lista de librerías es el tema de [17-maven.md](17-maven.md).
>
> Lo que Spring Boot te resuelve con todo ese código son las partes que nadie quiere escribir a mano: abrir un puerto para que el servidor se quede escuchando peticiones, traducir el texto de una petición HTTP a objetos Java, y **mapear una fila de la base de datos a un objeto**. Esto último significa coger una fila de una tabla, por ejemplo la fila `(3, 'Ana', 'ana@mail.com')` de la tabla `users`, y construir con ella un objeto `User` de Java cuyos campos `id`, `name` y `email` ya valgan `3`, `"Ana"` y `"ana@mail.com"`. Sin ese mapeo tendrías que leer columna por columna y asignarlas tú a mano en cada consulta; con él trabajas con objetos normales y te olvidas de que debajo hay filas y columnas.
>
> Por ejemplo, cuando escribes `@RestController`, no estás usando una sintaxis nueva de Java — estás usando una **anotación**, una característica normal y corriente del lenguaje: una marca que Java te permite poner sobre una clase o un método, y que después alguna otra herramienta lee y usa para decidir qué hacer. En este caso, esa herramienta es el propio código de Spring Boot, que busca `@RestController` y, al encontrarla, registra esa clase como un controlador que atiende peticiones HTTP. Las anotaciones como característica propia del lenguaje se explican en [16-anotaciones.md](16-anotaciones.md). Todo lo que hay en estas notas es Java puro, independiente de cualquier framework — como las propias anotaciones —, y por eso sigue siendo válido sin importar con qué framework acabes trabajando.

---

## Del código fuente al bytecode y a la ejecución en la JVM

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) para la compilación y «Java Virtual Machine» (sección 5) para la ejecución

Esta sección va tan al principio porque todo lo demás se apoya en ella: **Java es un lenguaje compilado**. Ese único hecho es el que explica por qué el lenguaje te obliga a declarar tipos, por qué unos errores te paran antes de arrancar y otros no, y por qué el mismo archivo compilado funciona igual en tu portátil que en un servidor de producción.

Escribir un archivo `.java` no basta para que sus instrucciones se ejecuten. El código que escribes es **código fuente**, pensado para que lo lean las personas y el compilador de Java. Un procesador no ejecuta directamente ese archivo fuente, por lo que Java utiliza dos etapas distintas:

1. **Compilación:** el compilador de Java, llamado `javac`, lee el código fuente. Comprueba la sintaxis y las reglas de tipos de Java; si estas comprobaciones se superan, traduce el código fuente a **bytecode** y escribe ese bytecode en un archivo `.class`.
2. **Ejecución:** una **JVM** (_Java Virtual Machine_, «máquina virtual de Java») carga el bytecode y ejecuta sus instrucciones como un programa Java.

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

Las dos etapas están separadas aunque IntelliJ las oculte detrás de un único botón verde de Run. El compilador tiene que aceptar el código fuente antes de que la JVM pueda ejecutar la nueva versión, siempre.

> **Hay un único caso en el que no aparece ningún archivo `.class` en el disco.** Es el atajo para ejecutar un único archivo suelto sin compilarlo tú antes, que verás más abajo en la sección «El programa Java más pequeño que se ejecuta». Al lanzar `java Hello.java`, el compilador sigue haciendo exactamente su trabajo, pero deja el bytecode en memoria en lugar de escribirlo, así que en la carpeta solo queda el `.java` con el que empezaste. El atajo esconde el compilador; no se lo salta. Cualquier build real sí escribe los archivos: en el caso de Maven, dentro de la carpeta `target/classes/`.

> **Una JVM no comprueba tu código fuente original.** Al llegar a la etapa de ejecución, el compilador ya ha traducido el código fuente aceptado a bytecode. Por eso, un mensaje de `javac` y un fallo durante la ejecución en la JVM pertenecen a momentos distintos.

---

## Fallos en tiempo de compilación frente a fallos en runtime

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) y «Java Virtual Machine» (sección 5) para ver la frontera entre el rechazo del compilador y la ejecución

Las dos etapas que acabas de ver dibujan una frontera, y cada tipo de error aparece en un lado distinto de ella. La forma más rápida de clasificar un fallo es preguntarte:

> **¿`javac` rechazó el código fuente, o llegó una JVM a empezar a ejecutar su bytecode?**

Utilizaremos el mismo cálculo de precio para comparar los tres resultados.

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

**Cómo saber, delante de la pantalla, si lo que estás viendo es un fallo de compilación o uno de runtime.** No hace falta razonarlo: el propio mensaje te lo dice, y en IntelliJ además aparece en dos sitios distintos. Estas son las tres señales:

| Señal                      | Fallo en tiempo de compilación                                           | Fallo en runtime                                                                   |
| -------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Cómo empieza el mensaje    | `error:` seguido del archivo, la línea y un `^` señalando el carácter    | `Exception in thread "main"` seguido del nombre completo de una clase de excepción |
| ¿Se llegó a ver la salida? | No. El programa no ha arrancado, así que no ha impreso ni una línea      | Sí. Todo lo que el programa imprimió antes de fallar está ahí, encima del error    |
| Dónde aparece en IntelliJ  | Subrayado rojo en el editor antes de pulsar Run, y en la pestaña _Build_ | En la pestaña _Run_, la misma consola donde estabas viendo la salida del programa  |

La fila del medio es la que resuelve casi todos los casos dudosos: si por la consola ha salido alguna línea de tu programa, es que el programa arrancó, y si arrancó es que `javac` ya había dicho que sí. Todo lo que falle a partir de ese punto es runtime.

> **El tiempo de compilación es un punto de control, no un programa en ejecución.** Mientras `javac` comprueba el código fuente, no se está ejecutando ninguna instrucción de tu aplicación. Por tanto, el código de gestión de errores en runtime no puede capturar un fallo de compilación: todavía no hay ninguna ejecución en la que capturarlo.

### Excepciones — código fuente válido que falla en runtime

Parte del código fuente es válido aunque determinados valores en runtime hagan imposible una operación. Dividir un entero entre otro es una operación válida en Java, por lo que este código supera la compilación:

```java
int unitPrice = 15;
int divisor = 0;
int total = unitPrice / divisor;
System.out.println(total);
```

El problema solo aparece cuando una JVM ejecuta la división con un `divisor` igual a cero. Java crea y lanza una **excepción**: un objeto que informa de un problema encontrado mientras el programa se está ejecutando. El mensaje exacto de la excepción comienza así:

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
```

La ejecución del programa llegó hasta la división, así que se trata de un **fallo en runtime**. Si nadie captura esa excepción, el programa se detiene justo ahí e imprime esa línea junto con la lista de métodos que estaban en marcha en ese momento, que es lo que te permite localizar dónde ocurrió.

> **¿Por qué no puede el compilador rechazar esto antes?** La operación `int / int` está permitida. En un programa real, `divisor` podría proceder de la entrada del usuario, de un cálculo o de una base de datos mientras el programa está en ejecución, por lo que su valor real no suele estar fijado por la línea de código fuente. El compilador comprueba si la operación es válida para los tipos declarados; la ejecución revela si los valores hacen que esa operación válida falle.

La mecánica de lanzar, capturar y propagar excepciones pertenece a [11-excepciones.md](11-excepciones.md). Por ahora, quédate con que una excepción solo puede aparecer después de que haya comenzado la ejecución.

### Errores de lógica — la ejecución termina, pero la respuesta es incorrecta

Un programa también puede compilar y terminar sin lanzar nada y, aun así, producir un resultado incorrecto. El requisito dice que el total es la cantidad **multiplicada** por el precio unitario; si por descuido escribes una suma en lugar de una multiplicación, el programa compila y se ejecuta sin quejarse:

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

Los tres no cuestan lo mismo, y la diferencia entre ellos es lo bastante grande.

Un **fallo en tiempo de compilación** te cuesta segundos. `javac` lee todas las líneas del código fuente, se lleguen a ejecutar algún día o no, así que encuentra el error sin que haga falta que se den antes las condiciones exactas que lo provocan. Además te dice el archivo, la línea y el carácter exacto, con un `^` debajo. Y hace todo eso antes de que el programa se haya ejecutado ni una sola vez, así que nadie más que tú llega a verlo.

Una **excepción** cuesta más, porque no la encuentra nadie hasta que la línea que falla se ejecuta de verdad. La división de arriba es invisible hasta que llega una petición en la que el `divisor` vale realmente `0`; con cualquier otro valor ese mismo código funciona bien. Lo bueno es que, cuando por fin ocurre, no pasa desapercibida: la ejecución se detiene y Java imprime el tipo de excepción, su mensaje y la lista de métodos que estaban en marcha en ese momento — el **stack trace** —, que te señala la línea exacta.

Un **error de lógica** es el caro, y por una razón muy concreta: ninguna de las dos comprobaciones lo está buscando siquiera. El compilador comprueba que el código respeta las reglas de Java. La JVM comprueba que cada operación es posible con los valores que le han llegado. En ningún punto de ese proceso hay una copia de lo que tú _querías_ que hiciera el programa. `quantity + unitPrice` es una suma perfectamente legal de dos `int`, así que el programa compila, se ejecuta, termina bien e imprime `17` tan tranquilo. Lo único que lo detecta es comparar el resultado con el esperado: que tú leas la salida, que un compañero revise el código, o que haya un test que compruebe que eso tenía que dar `30`. Si nadie lo detecta, no se cae nada; simplemente le factura al cliente el importe equivocado, en silencio, durante meses.

| Fallo                        | Qué lo encuentra                                          | Cuándo                                     | Qué cuesta si se pasa por alto            |
| ---------------------------- | --------------------------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| Error de sintaxis o de tipos | `javac`                                                   | Antes de que el programa arranque siquiera | Segundos, y solo tu propio tiempo         |
| Excepción                    | La JVM, cuando se ejecuta esa línea                       | Solo en el camino que realmente falla      | Un crash visible con una stack trace      |
| Error de lógica              | Una persona o un test que compara lo esperado con lo real | Puede que nunca                            | Datos incorrectos, producidos en silencio |

Lee esta tabla de arriba abajo como una escalera de coste, no como una lista de tres cosas equivalentes: cuanto más abajo, más tarde se descubre el fallo y más caro sale. La columna «cuándo» es en realidad la columna del precio, porque un fallo cuesta poco de arreglar en el momento en que lo escribes y mucho cuando lleva un mes corriendo en producción.

> **Esta escalera explica dos hábitos que parecen trabajo extra.** Todo lo que Java te obliga a escribir de más — declarar un tipo en cada variable, no dejarte compilar por un punto y coma que falta — sirve para llevar a la fila de arriba tantos fallos como sea posible: los convierte en errores del compilador, que son los baratos. Y los tests son lo único que cubre la fila de abajo, porque un error de lógica no tiene ningún otro detector. Por eso precisamente el proyecto 07 es el primero de tus proyectos que planifica tests de verdad. Su Step 8 escribe un test de JUnit por cada método de servicio, comprobando las propias reglas de negocio — que aprobar una entrada que nunca se envió lanza una excepción, que las horas aprobadas del resumen coinciden con la suma por proyecto. Los proyectos 01 a 06 solo entregaron los specs vacíos `should be created` que genera el CLI de Angular, que no comprueban nada sobre lo que se suponía que debía calcular el código.

---

## Cinco rasgos que reaparecen en cada capítulo

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → lee: la sección sobre lenguajes de tipado estático, para entender por qué la comprobación de tipos ocurre antes de la ejecución en lugar de durante ella

Java tiene una personalidad, y es sorprendentemente consistente. Cinco rasgos explican casi todos los momentos de «¿por qué me obliga a hacer esto?» que vas a tener. Cada uno de ellos se detalla a fondo en un archivo posterior.

**1. Tipado estático — el tipo forma parte de la declaración, y nunca cambia.** Cuando escribes `int quantity = 2;`, el nombre `quantity` queda ligado al tipo `int` para el resto de su vida. Esto no es solo una regla que hay que memorizar, es un mecanismo concreto: como el tipo queda escrito en el propio código fuente, el compilador puede razonar sobre una línea _sin llegar a ejecutarla nunca_. No necesita saber que `quantity` valdrá `2` en un momento y `40` en otro — solo necesita el tipo declarado para decidir si una operación es legal. Por eso Java puede rechazar código antes de arrancar, en lugar de dejar que ese mismo error solo aparezca en tiempo de ejecución, el día en que el programa por fin llega a ejecutar la operación no permitida. Esta característica se explica en [01-variables-tipos.md](01-variables-tipos.md), y vuelve con fuerza en [09-genericos.md](09-genericos.md), donde el tipo de los valores _dentro_ de una colección también se declara y se comprueba.

**2. Todo el código ejecutable vive dentro de una clase.** Es la consecuencia directa del modelo orientado a objetos que has visto en la primera sección. En JavaScript puedes poner una función sola en un archivo y exportarla. Java no tiene equivalente: `main`, y cualquier otro método, tiene que pertenecer a alguna clase. La razón tiene que ver con cómo el compilador guarda el resultado: genera un archivo `.class` independiente por cada clase, así que una clase es la unidad más pequeña que se puede compilar y cargar por separado. Qué es realmente una clase, qué contiene y cómo se diseña está en [06-poo-clases.md](06-poo-clases.md).

**3. Primero compilar, luego ejecutar — siempre dos momentos.** Es el proceso que acabas de recorrer en las dos secciones anteriores. Aunque IntelliJ oculte ambas etapas detrás de un único botón verde, siguen siendo dos momentos separados con dos tipos de error distintos, y saber cuál de los dos te está hablando — el compilador, o el programa ya en marcha — te dice de inmediato dónde buscar el problema. [17-maven.md](17-maven.md) es la herramienta que automatiza ambos pasos una vez que un proyecto real tiene docenas de archivos fuente y librerías externas que descargar antes de poder compilar.

**4. El compilador genera código para la JVM, no para tu procesador.** Lo que `javac` produce no son instrucciones para tu procesador concreto, sino bytecode para una máquina abstracta: la JVM. Existe una JVM distinta para Windows, para macOS, para Linux y para lo que sea que tu empresa use en producción, y todas ellas ejecutan ese mismo bytecode. Este es el origen del viejo eslogan de Java, _write once, run anywhere_ («escríbelo una vez, ejecútalo en cualquier sitio»), y no es solo marketing: el archivo `.class` que generas en tu portátil con Windows — el bytecode compilado, también llamado el «artefacto» — es exactamente el mismo archivo que ejecuta un servidor Linux en producción, sin cambios y sin volver a compilarlo. La JVM también es quien gestiona la memoria por ti mientras el programa corre, en lugar de tener que reservarla y liberarla tú a mano, y ese es el tema de [05-modelo-de-memoria.md](05-modelo-de-memoria.md).

> **JDK, JRE y JVM: qué es cada uno.** Los tres nombres aparecen juntos constantemente y se confunden con facilidad, así que conviene fijarlos ahora. El **JDK** (_Java Development Kit_, «kit de desarrollo de Java») es lo que instalaste, y es el paquete completo: trae las herramientas para **desarrollar**, entre ellas `javac` (el compilador), `jar` (el empaquetador que crea los archivos `.jar`), `javadoc` (el generador de documentación a partir de tus comentarios) y `jdb` (el depurador). El **JRE** (_Java Runtime Environment_, «entorno de ejecución de Java») es el subconjunto que solo sirve para **ejecutar** programas ya compilados: el lanzador `java` y la librería estándar, es decir, todas las clases que Java te regala hechas, como `String`, `List` o `LocalDate`. Y la **JVM** es la máquina virtual que va dentro de los dos: el motor que carga el bytecode y lo ejecuta. Es decir, JDK ⊃ JRE ⊃ JVM.
>
> Un detalle práctico: desde Java 9 el JRE ya no se distribuye por separado, así que hoy instalas un JDK y punto. La distinción sigue apareciendo en entrevistas y en documentación antigua, y por eso merece la pena tenerla clara. El desglose completo está en [Baeldung — Difference Between JVM, JRE, and JDK](https://www.baeldung.com/jvm-vs-jre-vs-jdk).

**5. Más código explícito, por decisión de diseño.** Java escribe explícitamente muchas cosas que en JavaScript o TypeScript se dan por sobrentendidas. Por ejemplo, una forma de datos que en TypeScript declaras como una interfaz de cuatro campos:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
```

en Java clásico se convierte en esto:

```java
public class User {

    private final int id;
    private final String name;
    private final String email;
    private final int age;

    public User(int id, String name, String email, int age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getAge() { return age; }
}
```

Compara los dos bloques: cuatro campos privados, un constructor que los recibe y los asigna uno por uno, y cuatro métodos _getter_ — uno por campo, para poder leer ese campo desde fuera de la clase — frente a las siete líneas de TypeScript. Es bastante más código para representar exactamente la misma información.

Esto es una decisión de diseño, no un descuido. Java está optimizado para la persona que _lee_ un código que no escribió, años después, por encima de la persona que lo está escribiendo hoy: cuanto más explícito es el código, menos hace falta adivinar. El lenguaje también ha ido recortando ese código extra donde ha podido. Los _records_, en [06-poo-clases.md](06-poo-clases.md), reducen esa misma clase de datos — una clase cuyo único trabajo es guardar varios valores relacionados, sin lógica propia — a una sola línea. Y las _lambdas_, en [12-streams-lambdas.md](12-streams-lambdas.md), hacen lo mismo cuando lo que quieres pasar no es un dato sino una acción, como la propia función que decide cómo comparar dos elementos al ordenarlos.

| Característica              | Qué te obliga a hacer                                                                                           | Dónde se examina a fondo                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Tipado estático             | Declarar un tipo y mantenerlo; el compilador comprueba cada uso antes de arrancar                               | `01-variables-tipos.md`, `09-genericos.md`  |
| El código vive en una clase | No hay funciones sueltas; una clase es la unidad de compilación                                                 | `06-poo-clases.md`                          |
| Compilar y luego ejecutar   | Dos pasos separados — primero compilar, después ejecutar —, dos momentos, dos tipos de mensaje de error         | este archivo, y después `17-maven.md`       |
| El objetivo es la JVM       | El compilador produce bytecode para la JVM, no para tu procesador; y es la JVM quien gestiona la memoria por ti | `05-modelo-de-memoria.md`                   |
| Más código explícito        | Más tecleo, optimizado para quien lee en lugar de para quien escribe                                            | `06-poo-clases.md`, `12-streams-lambdas.md` |

---

## Viniendo de JavaScript — dónde ayuda la comparación y dónde miente

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → lee: la sección sobre lenguajes de tipado dinámico, que es el lado de JavaScript de cada contraste de más abajo

### Lo que funciona igual en los dos lenguajes

La sintaxis de `if`, `while` y `for` es la misma. También lo es la forma de recorrer una **colección**, que es el nombre que Java le da a cualquier objeto que guarda varios elementos dentro. Hay tres formas básicas: una **lista**, que guarda los elementos en orden y admite repetidos; un **conjunto** (_set_), que no garantiza ningún orden y no admite repetidos — si añades dos veces el mismo elemento, dentro se queda uno solo —; y un **array**, la más simple de las tres, una fila de longitud fija que se decide en el momento de crearla y que ya no cambia. Las otras dos sí pueden crecer y encoger, y todas ellas se estudian en [10-colecciones.md](10-colecciones.md).

Para recorrer una colección entera, de principio a fin, JavaScript tiene el bucle `for...of`: en cada vuelta mete el siguiente elemento en la variable que has declarado y ejecuta el cuerpo del bucle con ella.

```javascript
const names = ['Ana', 'Luis'];
for (const name of names) {
  console.log(name);
}
```

Java hace exactamente lo mismo y solo cambia la puntuación: donde JavaScript escribe `of`, Java escribe dos puntos, y la variable se declara con su tipo delante.

```java
List<String> names = List.of("Ana", "Luis");
for (String name : names) {
    System.out.println(name);
}
```

Los dos bucles imprimen `Ana` y después `Luis`. En ninguno de los dos llevas tú la cuenta con un índice ni preguntas cuántos elementos hay: el bucle recorre la colección entera y se para solo cuando se acaba. En Java a ese bucle se le llama _for-each_, «para cada uno». (`List.of(...)` crea una lista con los elementos que le pases; las listas son el tema de [10-colecciones.md](10-colecciones.md).)

Sumar un número a un trozo de texto con `+` concatena en los dos lenguajes, así que `"total: " + 30` produce `"total: 30"` tal como esperas. Y `final` sobre una variable hace lo mismo que `const`: las dos bloquean la variable, no el contenido de lo que hay dentro. Si declaras `final List<String> names = new ArrayList<>();`, no puedes reasignar `names` a otra lista distinta, pero sí puedes añadirle y quitarle elementos a la lista que ya tiene. [01-variables-tipos.md](01-variables-tipos.md) lo desarrolla.

`try { } catch (e) { }` también se escribe igual en los dos lenguajes, y justo por eso merece el aviso siguiente antes de seguir.

> **El `try/catch` se escribe igual en Java y en JavaScript, pero el modelo de excepciones que hay debajo es distinto.** La sintaxis se ve idéntica, así que es tentador leer uno como el otro. Por debajo no se parecen en nada.
>
> Una **excepción** es la forma que tiene Java de avisar de que algo ha ido mal mientras el programa se ejecuta. Cuando una operación no puede terminar — un archivo que no existe, una división entre cero —, el código **lanza** (`throw`) un objeto que describe ese fallo; el método en el que ocurrió se interrumpe justo ahí, y ese objeto va pasando hacia atrás, de método en método, hasta que alguno lo **captura** (`catch`) y decide qué hacer con él. Si no lo captura nadie, el programa se detiene.
>
> Hasta aquí, JavaScript hace algo parecido. La diferencia está en que Java reparte las excepciones en dos familias, y con una de ellas el compilador se mete de por medio: las **comprobadas** (_checked_) y las **no comprobadas** (_unchecked_).
>
> Con las comprobadas, el compilador se pone estricto: si tu método llama a algo que puede lanzar una de ellas — leer un archivo, por ejemplo, que es lo que hace `Files.readString` en el código de abajo —, no te deja compilar hasta que digas qué piensas hacer con ese fallo. Y solo tienes dos respuestas posibles, las dos escritas en el código:
>
> - la capturas ahí mismo con un `try/catch` y te encargas tú del problema:
>
>   ```java
>   public String readConfig() {
>       try {
>           return Files.readString(Path.of("config.txt"));   // lee un archivo entero como texto
>       } catch (IOException e) {
>           return "";   // no hay archivo: sigo adelante con la configuración por defecto
>       }
>   }
>   ```
>
> - o escribes `throws IOException` en la firma de tu método, que significa «yo no me encargo»:
>
>   ```java
>   public String readConfig() throws IOException {
>       return Files.readString(Path.of("config.txt"));   // si falla, el problema es de quien me llamó
>   }
>   ```
>
>   Entonces el fallo pasa al método que llamó al tuyo, y ese método se encuentra con la misma obligación: o lo captura, o lo vuelve a declarar. Así va subiendo de método en método hasta que alguno lo captura, o hasta que llega arriba del todo y el programa se detiene.
>
> Las **no comprobadas** son justo las que el compilador no vigila — la `ArithmeticException` de la división entre cero es una de ellas —: no tienes que declarar nada ni capturar nada, y si nadie las captura, el programa se detiene al llegar a ese punto.
>
> Lo importante no es qué opción elijas, sino que elegir es obligatorio: es una condición para que el programa llegue a compilar, y no hay nada parecido en JavaScript. Por eso, aplicar aquí tus hábitos de JS produce código que directamente no compila, con un mensaje que no significa nada hasta que conoces este modelo:
>
> ```text
> error: unreported exception IOException; must be caught or declared to be thrown
> ```
>
> Las excepciones al completo — los dos tipos, cómo se lanza una, por dónde viaja hasta que alguien la captura y cómo se lee la traza que imprime cuando no la captura nadie — se explican desde cero en [11-excepciones.md](11-excepciones.md).

### Lo que parece funcionar igual, y no es así

#### `var` no significa lo mismo en Java que en JavaScript

Java reutilizó la palabra clave, pero le dio un significado casi opuesto. En JavaScript, `var` declara una variable sin tipo alguno. En Java, `var` significa «deduce el tipo a partir de lo que te estoy asignando, y luego mantente fiel a él para siempre», por ejemplo:

```java
// ✅ bien — javac, el compilador de Java, infiere int a partir del valor inicial
var total = 30;

// ❌ MAL — total es un int, para siempre
total = "thirty";
```

```text
error: incompatible types: String cannot be converted to int
```

Así que `var` no comete ningún error de tipado: el tipo sigue quedando fijado en el momento en que escribes la línea, simplemente no has tenido que escribirlo explícitamente — es un atajo _dentro_ del sistema de tipos, no un hueco en él. Se recomienda usarlo cuando el tipo ya es obvio por el lado derecho de la asignación, como en el ejemplo de arriba; evítalo cuando esconde el tipo real y hace el código más difícil de leer. [01-variables-tipos.md](01-variables-tipos.md) tiene la sección completa.

#### La forma de un objeto queda fija en tiempo de compilación

En JavaScript puedes añadirle una propiedad a un objeto cuando quieras y el objeto simplemente crece. En Java, el conjunto de campos lo decide la clase: solo existen los campos que la clase declaró, y uno que no declaró no existe. Por ejemplo, esta clase `Customer` declara únicamente `name` y `email`:

```java
public class Customer {
    private String name;
    private String email;
}
```

```java
Customer customer = new Customer();

// ❌ MAL — la clase Customer no declara ningún campo llamado age
customer.age = 30;
```

```text
error: cannot find symbol
        customer.age = 30;
                ^
  symbol:   variable age
  location: variable customer of type Customer
```

Vale la pena reconocer ese mensaje pronto, porque `cannot find symbol` es el error que más te vas a encontrar en tus primeras semanas. Siempre significa lo mismo: el compilador buscó un nombre — una variable, un método, una clase — y no existe nada con ese nombre en ningún sitio donde el compilador pueda verlo desde esa línea.

#### `==` no está haciendo la misma pregunta en Java que en JavaScript

En JavaScript tienes dos operadores de igualdad. `===` es el de **igualdad estricta**: compara si el tipo y el valor coinciden a ambos lados. `==` es el de **igualdad débil** (también llamada abstracta o no estricta): primero intenta convertir uno de los dos lados para que los tipos coincidan, y solo entonces compara — eso es lo que se conoce como coerción de tipos.

En Java no existe `===`, y el `==` de Java no hace ninguna coerción. Cuando se usa sobre objetos — por ejemplo, sobre dos variables de tipo `String` — pregunta «¿estas dos variables apuntan al mismo objeto en memoria?». Y esa casi nunca es la pregunta que querías hacer al comparar dos textos, porque dos textos con el mismo contenido pueden ser perfectamente dos objetos distintos guardados en dos sitios distintos de la memoria. Equivocarse aquí es el bug de principiante más común en Java.

Este tipo de comparaciones aparecen en dos sitios, y en cada sitio se resuelve de una forma.

El primero es comparar el contenido de dos variables de tipo `String`, es decir, de dos textos, que es con el que te vas a encontrar antes. Se responde en el archivo siguiente: [01-variables-tipos.md](01-variables-tipos.md) muestra que el método que de verdad querías usar para comparar dos `String` es `.equals()`, que compara el contenido real, carácter a carácter, en vez de la dirección de memoria. Ese archivo explica también por qué escribir dos literales de texto sueltos, como `"hola" == "hola"`, hace que `==` parezca funcionar correctamente justo las veces suficientes como para engañarte: Java reutiliza el mismo objeto en memoria para literales de texto idénticos, así que ese caso concreto sí apunta al mismo sitio, aunque la regla general siga sin ser esa.

El segundo sitio donde te encuentras esta comparación es al comparar dos objetos de una clase escrita por ti — por ejemplo un `User` con otro `User` —. Ahí no basta con llamar a `.equals()` y ya está, porque Java no puede adivinar qué significa que dos usuarios sean «el mismo». ¿Que tengan el mismo `id`? ¿El mismo email? Esa decisión la tomas tú y se la escribes a Java dentro de la clase. Cómo se hace está en [06-poo-clases.md](06-poo-clases.md).

#### Los tipos de TypeScript desaparecen antes de ejecutarse; los de Java no

TypeScript no llega a ejecutarse nunca: antes de llegar al navegador se **transpila**, es decir, se traduce a JavaScript normal, y en esa traducción los tipos se caen porque JavaScript no sabría qué hacer con ellos. El archivo que corre en el navegador no contiene ni un solo tipo, así que durante la ejecución no queda nadie comprobando nada. En Java pasa justo lo contrario: los tipos que declaras sobreviven a la compilación, quedan escritos dentro del archivo `.class`, y la propia JVM rechaza en tiempo de ejecución una conversión que no cuadre.

Hay una única excepción, y son los genéricos. El **argumento de tipo** de un genérico — que es el término correcto: el tipo concreto que escribes entre los signos `<` y `>`, el `String` de `List<String>` — se comprueba durante la compilación y después se descarta. Así que, en tiempo de ejecución, un `List<String>` y un `List<Integer>` son exactamente el mismo tipo: una `List` a secas. Ese descarte se llama _type erasure_ (borrado de tipos).

Lo que ese borrado te impide es preguntar por el argumento de tipo una vez el programa ya está corriendo. En la práctica son tres cosas que no compilan:

```java
// ❌ MAL — en ejecución esa información ya no existe
if (lista instanceof List<String>) { }

// ❌ MAL — nadie sabe ya qué era T
T[] copia = new T[10];

// ❌ MAL — después del borrado son el mismo método escrito dos veces
void procesar(List<String> nombres) { }
void procesar(List<Integer> edades) { }
```

[09-genericos.md](09-genericos.md) lo desarrolla entero.

### Tabla resumen

| Hábito de JS/TS                             | Qué hace JavaScript/TypeScript                                   | Qué hace Java                                                                                 | ¿Se comporta igual?             |
| ------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------- |
| `for...of` sobre un array                   | `for (const name of names)` itera sus elementos uno a uno        | `for (String name : names)` itera igual sobre una colección                                   | Sí                              |
| `const`                                     | Bloquea la variable, no lo que contiene                          | `final` hace lo mismo                                                                         | Sí; el matiz se explica en `01` |
| Sintaxis de `try / catch`                   | `try { } catch (e) { }`                                          | Se escribe igual, pero el modelo de excepciones de debajo es distinto                         | Solo en la sintaxis             |
| `var`                                       | Declara una variable sin ningún tipo                             | Infiere un único tipo fijo y lo impone para siempre                                           | No — significado casi opuesto   |
| Añadir una propiedad en tiempo de ejecución | El objeto crece con cualquier propiedad nueva                    | Los campos los declara solo la clase; no se pueden añadir después                             | No — lanza `cannot find symbol` |
| `==` frente a `===`                         | Compara con coerción de tipos o sin ella                         | `==` sobre objetos compara si apuntan al mismo objeto en memoria, no si el contenido es igual | No — usa `.equals()`            |
| Tipos borrados al compilar                  | Los tipos desaparecen al compilar; nada los comprueba en runtime | Los tipos sobreviven hasta el bytecode                                                        | No — excepto en los genéricos   |

Lee la última columna como el veredicto de cada fila: «Sí» significa que puedes traer tu hábito de JavaScript tal cual, y cualquier otra cosa significa que ese hábito te va a costar un error, ya sea del compilador o un resultado equivocado.

---

## El programa Java más pequeño que se ejecuta

Docs: [Baeldung — Java main() Method Explained](https://www.baeldung.com/java-main-method) → lee: la explicación inicial de la firma habitual, donde se desmontan `public` y `static` palabra por palabra

En JavaScript, un archivo con una sola línea ya es un programa. El programa ejecutable más pequeño de Java está formado por tres piezas: una clase cuyo nombre coincide con el del archivo, un método `main` con una firma exacta — que es por donde la JVM empieza a ejecutar —, y algo que produzca una salida para que puedas ver que ha pasado algo.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}
```

Para verlo funcionar hay que guardarlo en un archivo llamado `Hello.java` y pasar por las dos etapas de la sección «Del código fuente al bytecode»: primero compilar, después ejecutar. En IntelliJ eso es un único botón verde de Run, y es lo que vas a usar siempre. Debajo, ese botón lanza dos programas distintos que vienen dentro del JDK que instalaste: `javac`, que convierte `Hello.java` en `Hello.class`, y `java`, que arranca una JVM y ejecuta ese `.class`. Escritos a mano en una terminal serían estos dos comandos, y verlos ayuda a entender qué hace el botón, aunque tú no vayas a teclearlos nunca:

```text
javac Hello.java     ← javac es el compilador: lee Hello.java, lo comprueba y genera Hello.class
java Hello           ← java es el lanzador: arranca una JVM, carga Hello.class y lo ejecuta
```

Fíjate en un detalle que despista al principio: al compilar escribes el nombre del **archivo** con su extensión (`Hello.java`), y al ejecutar escribes el nombre de la **clase** sin extensión (`Hello`), porque a partir de ahí ya no trabajas con tu archivo de texto sino con la clase compilada. El resultado en la consola es:

```text
Hello from Java
```

**El nombre del archivo no es una convención, es una regla.** Si declaras `public class PriceCalculator`, el archivo tiene que llamarse `PriceCalculator.java`: el mismo nombre exacto, mayúsculas incluidas, más la extensión `.java`. Si guardas esa misma clase en un archivo con otro nombre, por ejemplo `Wrong.java`, no compila:

```java
// archivo: Wrong.java
// ❌ MAL — este archivo debería llamarse PriceCalculator.java
public class PriceCalculator {
}
```

```text
error: class PriceCalculator is public, should be declared in a file named PriceCalculator.java
```

La razón es que tanto el compilador como la JVM encuentran una clase _por su nombre_: cuando algo pide `PriceCalculator`, la herramienta va a buscar `PriceCalculator.class`, producido a partir de `PriceCalculator.java`. Que los dos nombres coincidan convierte la tarea de «encontrar esta clase» en una búsqueda de archivo predecible, en vez de una búsqueda entre todos los archivos del disco.

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

> **¿Por qué siempre `String[] args`?** Porque un programa se puede arrancar pasándole datos escritos justo detrás del nombre de la clase: `java Hello Ana 30`. Esos dos valores llegan a tu `main` dentro de `args`, que en ese caso valdría `["Ana", "30"]`. Y es de tipo `String` porque todo lo que se teclea en una terminal es texto: ese `30` llega como el texto `"30"`, no como el número `30`, y si lo necesitas como número tienes que convertirlo tú. `args` tiene que aparecer en la firma aunque no lo uses nunca — como pasa en el 99% de los casos —, porque esta es la forma exacta que la JVM y las herramientas de build reconocen como punto de entrada.
>
> **Y un array, siendo de longitud fija, ¿no es justo lo que no sirve aquí?** Es la duda razonable, y la respuesta está en _cuándo_ se fija esa longitud. «De longitud fija» no significa que el tamaño esté escrito en tu código fuente; significa que el tamaño se decide en el instante en que el array se crea, y a partir de ahí ya no cambia. Y ese array no lo creas tú: lo crea la JVM al arrancar, cuando ya sabe perfectamente cuántos valores has escrito detrás del nombre de la clase. Con `java Hello Ana 30` cuenta dos, crea un array de tamaño 2, lo rellena y se lo pasa a tu `main`. Durante toda la ejecución esos argumentos ya no van a aumentar ni disminuir, así que un array encaja perfectamente: lo que no puedes hacer es añadirle un tercer argumento a mitad de programa, y eso es algo que nadie necesita hacer.

Queda una palabra por desmontar de esa última línea: **paquete**. Un paquete (_package_) es la carpeta a la que pertenece una clase, pero escrita con puntos en lugar de barras. Las clases de tu proyecto TimeTrack viven en el disco dentro de `src/main/java/com/victor/timetrack/`, y por eso la primera línea de código de cada una de ellas es:

```java
package com.victor.timetrack;
```

Es la misma ruta `com/victor/timetrack`, con puntos en el sitio de las barras. Las clases que están en subcarpetas pertenecen a subpaquetes: `.../timetrack/service/TimeEntryService.java` está en el paquete `com.victor.timetrack.service`. La ruta de carpetas y el nombre del paquete tienen que coincidir siempre, y la razón es la misma de antes: así el compilador y la JVM saben en qué carpeta buscar el archivo de una clase a partir de su nombre.

Para qué sirve todo esto: el paquete es el apellido de la clase. El nombre completo de tu servicio no es `TimeEntryService`, sino `com.victor.timetrack.service.TimeEntryService`. Eso permite que existan dos clases con el mismo nombre sin chocar entre sí. Podrías tener perfectamente una segunda clase `TimeEntryService` en un paquete distinto — por ejemplo `com.victor.timetrack.admin.TimeEntryService` — y las dos convivirían sin problema, porque su nombre completo es distinto. Es lo mismo que te permitiría escribir tu propia clase `List` sin chocar con la `List` que usarás a diario, que en realidad se llama `java.util.List`. A eso se le llama **espacio de nombres** (_namespace_): un ámbito dentro del cual cada nombre identifica una sola cosa.

**Y los paquetes son también la frontera de la visibilidad, que es lo que estaba midiendo `public` en la firma de `main`.** La regla: una clase o un método marcado `public` se puede usar desde cualquier paquete; sin `public`, solo se puede usar desde clases que estén en ese mismo paquete. Es decir, `public` abre la puerta hacia fuera y su ausencia la deja cerrada dentro del paquete.

Aplicado a `main`, eso explica por qué lleva `public`: quien llama a `main` no es otra clase tuya, es la JVM, que es código que está fuera de tu proyecto y por tanto fuera de todos tus paquetes. Sin `public`, la JVM no podría llamarlo. Las reglas completas de visibilidad — hay cuatro niveles, no dos — están en [06-poo-clases.md](06-poo-clases.md).

Si a la clase que intentas lanzar le falta el método `main`, la clase compila perfectamente — como clase no le pasa nada —, y el fallo llega después, desde la JVM, justo en el momento en que intentas arrancarla:

```text
Error: Main method not found in class NoMain, please define the main method as:
   public static void main(String[] args)
```

> **¿Por qué falla al arrancar y no al compilar?** Porque una clase sin `main` es una clase completamente normal y útil: en cualquier proyecto, la inmensa mayoría de las clases no tienen `main` y se compilan y se usan constantemente. Tener un punto de entrada no es algo que se le pueda exigir a toda clase; solo hace falta en la clase por la que arranca el programa. Y el compilador no puede saber cuál va a ser esa clase, porque eso lo decides tú más tarde, al ejecutar `java Hello`. La JVM sí lo sabe, porque acabas de darle el nombre. Por eso el mensaje de arriba no dice «esta clase está mal escrita», sino algo mucho más literal: «he cargado la clase que me has pedido, he buscado dentro un método `main` y no lo he encontrado».

**De momento te vale con lo que acabas de leer sobre `public`, `static` y `String[]`.** Cada una de esas tres palabras es un concepto entero por sí misma, y cada una tiene su propio capítulo más adelante: las reglas completas de `public` y de `static` — quién puede ver un miembro de una clase, y si ese miembro pertenece a la clase entera o a cada objeto por separado — están en [06-poo-clases.md](06-poo-clases.md); `String[]` se explica junto a las demás formas de guardar varios valores, en [10-colecciones.md](10-colecciones.md). Aquí basta con que reconozcas la plantilla y sepas copiarla, porque todos los ejemplos de los capítulos siguientes imprimen algo por consola y, para probarlos tú, vas a tener que meterlos dentro de un `main` como este.

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

`Hello` no es un ejemplo de juguete que en la vida real se haga de otra manera. Cualquier aplicación Java arranca exactamente igual, por un método `main`, y una aplicación Spring Boot no es ninguna excepción. El archivo `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/TimetrackApplication.java` tiene apenas una docena de líneas, y la que importa es la firma que acabas de ver:

```java
@SpringBootApplication
public class TimetrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimetrackApplication.class, args);
	}

}
```

Todo el backend de TimeTrack — cada controller, cada regla de seguridad, la conexión a la base de datos — se pone en marcha desde esa única llamada a `SpringApplication.run`. Spring Boot no sustituye el punto de entrada de Java: se monta encima de él.

> **Desde Java 25 existe una forma abreviada de escribir un programa, y te la vas a encontrar en tutoriales.** Todo lo que has leído hasta aquí describe la forma completa: una clase, y dentro un `public static void main(String[] args)`. Java 25 — que es la versión que tienes instalada y la que usa el proyecto 07 — añadió un atajo que permite escribir solo esto en un archivo, sin clase alrededor y sin `static`:
>
> ```java
> // forma abreviada — válida solo desde Java 25
> void main() {
>     System.out.println("Hello from Java");
> }
> ```
>
> Y lanzarlo directamente con `java Hello.java`, sin compilar antes a mano. Por debajo Java sigue creando la clase y el `main` completo por ti; simplemente te deja no escribirlos.
>
> Se añadió por un motivo pedagógico: para que la primera lección de Java de un principiante no tenga que empezar explicando `public`, `static` y `String[]`, tres palabras que en ese momento no se pueden entender todavía. El problema es que ningún proyecto real lo usa — ni el proyecto 07 ni los ejemplos de estas notas —, porque en cuanto tienes más de un archivo necesitas clases de verdad. Así que tu regla es sencilla: si te lo encuentras en un tutorial, reconócelo y sabe que es lo mismo; pero escribe siempre la forma completa.

---

## La ruta de aquí a Maven, y por qué sigue ese orden

Docs: [Baeldung — Get Started with Java](https://www.baeldung.com/get-started-with-java-series) → lee: la lista ordenada de artículos de la serie, como una segunda opinión sobre cómo se suele secuenciar el mismo terreno

La ruta de aprendizaje empieza por la pieza más pequeña que puede haber dentro de un programa escrito en Java — un valor — y termina con la herramienta que construye el proyecto entero. Cada archivo está colocado justo delante del archivo que lo necesita, y el recorrido va en cuatro tramos.

Cada archivo se nombra abajo con su nombre completo, y el número con el que empieza es su posición en la ruta.

**Lecturas 01 a 04 — los datos y las instrucciones que los manipulan.** [01-variables-tipos.md](01-variables-tipos.md) te enseña los tipos de valor básicos de Java: los números enteros y decimales, los booleanos, cuándo un `int` se convierte en un `long`, y por qué un número decimal casi nunca vale exactamente lo que escribiste. Va primero porque todas las líneas que escribas después manipulan algún valor, y en Java todo valor tiene un tipo concreto y declarado. `02-cadenas-de-texto.md` coge el tipo de valor que más vas a tocar, el texto, y explica por qué un `String` que parece que modificas es en realidad uno nuevo cada vez. [03-flujo-de-control.md](03-flujo-de-control.md) introduce los condicionales y los bucles: `if` para elegir qué líneas se ejecutan según una condición, y `for` y `while` para repetir un bloque de código. Y [04-metodos.md](04-metodos.md) te enseña los **métodos**, que son el equivalente en Java a las funciones de JavaScript: un bloque de código con nombre, que recibe parámetros y devuelve un valor. La única diferencia de fondo es que un método siempre vive dentro de una clase.

**Lecturas 05 a 08 — la memoria y los objetos.** [05-modelo-de-memoria.md](05-modelo-de-memoria.md) te enseña qué ocurre por debajo cuando llamas a un método: qué se copia exactamente al pasarle un argumento, en qué zona de memoria vive cada objeto, y cómo lleva la JVM la cuenta de qué método llamó a cuál. Va aquí porque es el mecanismo sobre el que se apoyan después los objetos, las excepciones y las colecciones: entendiéndolo, esos tres temas se razonan en vez de memorizarse. Solo entonces [06-poo-clases.md](06-poo-clases.md) construye objetos de verdad, y lo hace apoyándose en el **constructor**: el método que se ejecuta en el momento de crear el objeto y que puede rechazar los datos que no valgan, de forma que nunca llegue a existir una factura sin importe ni un usuario sin email. Ese archivo responde además a la pregunta que los objetos plantean nada más aparecer: cuándo se consideran iguales dos de ellos. [07-interfaces-abstractas.md](07-interfaces-abstractas.md) te enseña las **interfaces**: una lista de métodos que una clase se compromete a tener, sin decir cómo los implementa; así, el código que llama a esos métodos no depende de ninguna clase concreta y puedes cambiar la implementación sin tocar a quien la usa. Y [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md) explica cómo decide Java, ya en ejecución, cuál de esas implementaciones se ejecuta.

**Lecturas 09 a 12 — guardar muchos objetos, y gestionar los fallos.** [09-genericos.md](09-genericos.md) te enseña los **genéricos**: lo que se escribe entre los signos `<` y `>` de `List<String>`, que es la forma de decirle al compilador qué tipo de elementos guarda una colección. Va antes que las colecciones a propósito, para que cuando llegues a [10-colecciones.md](10-colecciones.md) no te encuentres con una sintaxis que aún no sabes leer. [10-colecciones.md](10-colecciones.md) ya son las **colecciones** propiamente dichas: las listas, los conjuntos y los mapas, cómo se elige uno u otro, y por qué buscar dentro de ellos es rápido. [11-excepciones.md](11-excepciones.md) desarrolla entera la **gestión de errores**: cómo se lanza una excepción, por dónde viaja, dónde se captura y cómo se lee la traza que aparece cuando no la captura nadie. Llega justo en este punto porque los archivos anteriores ya te han enseñado un buen puñado de operaciones que pueden fallar — buscar un elemento que no está, convertir un texto a número, recorrer una colección saliéndote del último índice —, así que ya tienes fallos concretos sobre los que practicar. Y [12-streams-lambdas.md](12-streams-lambdas.md) cierra con las **lambdas** y los **streams**: hasta ese momento a un método solo le pasabas datos, y una lambda te permite pasarle además una acción — por ejemplo, la condición por la que quieres filtrar —, que es lo que hace legible recorrer y filtrar una colección entera en tres líneas.

**Lecturas 13 a 16 — los tipos especiales y el build.** [14-enums.md](14-enums.md) te enseña los **enums**: cuando un valor solo puede ser uno de un conjunto cerrado — `PENDIENTE`, `APROBADO`, `RECHAZADO` —, un enum escribe esa lista completa en el código, y a partir de ahí el compilador sabe que no existe ningún otro valor posible y puede avisarte si te has dejado uno de los casos sin tratar. [15-fechas.md](15-fechas.md) coge las **fechas y las horas**, que son valores que tampoco cambian una vez creados: cuando le sumas un día a una fecha no modificas la que tenías, obtienes otra distinta. La diferencia con un enum es que aquí los valores posibles son infinitos, así que el compilador no puede comprobar la lista y no hay ninguna red de seguridad que te avise de que la fecha que has calculado no era la que querías. [16-anotaciones.md](16-anotaciones.md) parte de `@Override`, la única anotación que habrás usado hasta entonces, y explica las **anotaciones** en general: marcas que tú pones en el código y que alguna herramienta lee después. Con eso, las anotaciones de Spring que ves a diario dejan de parecer sintaxis secreta del lenguaje: son marcas normales de Java, y la herramienta que las lee es el propio código de Spring. Y [17-maven.md](17-maven.md) cierra con **Maven**, la herramienta que descarga las librerías, compila, ejecuta los tests y empaqueta todo lo que produjeron los quince archivos anteriores.

> **El número del nombre de un archivo es su posición en esta ruta.** `01-variables-tipos.md` es la lectura 01, `11-excepciones.md` es la lectura 11, y así con todos, de modo que abrir la carpeta ordenada alfabéticamente ya te da el orden correcto. Hoy solo falta el `02`: ese número está reservado para el capítulo del texto y el archivo todavía no está escrito. Por eso la tabla de abajo no tiene columna de orden — ya lo lleva el nombre del archivo. La segunda columna da la única razón por la que ese archivo no se puede leer antes.

| Archivo en `es/`              | Por qué va aquí                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `01-variables-tipos.md`       | Toda línea posterior manipula un valor tipado                                                   |
| `02-cadenas-de-texto.md`      | El texto es el tipo de valor que tocas en cada petición                                         |
| `03-flujo-de-control.md`      | Elegir y repetir necesita valores entre los que elegir                                          |
| `04-metodos.md`               | Empaqueta ese comportamiento detrás de un contrato invocable                                    |
| `05-modelo-de-memoria.md`     | Abre la frontera del método: copias, referencias, la pila de llamadas                           |
| `06-poo-clases.md`            | Construye objetos a partir de métodos y referencias, y define la igualdad                       |
| `07-interfaces-abstractas.md` | Separa el comportamiento necesario de la clase que lo proporciona                               |
| `08-herencia-polimorfismo.md` | Decide en tiempo de ejecución qué implementación se ejecuta                                     |
| `09-genericos.md`             | Enseña la sintaxis de corchetes angulares antes de que las colecciones la usen por todas partes |
| `10-colecciones.md`           | Grupos de objetos, y el hashing que hace rápida la búsqueda                                     |
| `11-excepciones.md`           | Los fallos que hicieron posibles los capítulos anteriores                                       |
| `12-streams-lambdas.md`       | Comportamiento como valor, y los pipelines construidos con él                                   |
| `14-enums.md`                 | Un conjunto cerrado de valores que el compilador puede comprobar de forma exhaustiva            |
| `15-fechas.md`                | La misma inmutabilidad aplicada donde no existe ninguna comprobación del compilador             |
| `16-anotaciones.md`           | Metadatos que lee una herramienta — la forma de cada anotación de Spring                        |
| `17-maven.md`                 | El build que compila, testea y empaqueta todo lo anterior                                       |

Con esto ya puedes situar cualquier problema dentro del ciclo de vida básico de Java: el código fuente se comprueba y se compila a bytecode, y después una JVM ejecuta ese bytecode. La primera parada de la ruta, [01-variables-tipos.md](01-variables-tipos.md), examina los tipos declarados que sustentan esas comprobaciones del compilador: qué valores permite Java que contenga cada variable, y por qué los tipos incompatibles se rechazan antes de la ejecución.
