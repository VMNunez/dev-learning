# Fundamentos de la ejecución en Java

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) y «Java Virtual Machine» (sección 5) para ver las dos etapas que llevan del código fuente a la ejecución

---

Ya sabes que JavaScript puede empezar a ejecutar un archivo y no descubrir una operación incorrecta hasta llegar a esa línea. Java añade un punto de control independiente antes de la ejecución: un compilador comprueba primero el código fuente. Este punto de control explica tanto cómo un archivo `.java` se convierte en un programa en ejecución como por qué algunos errores te detienen antes de arrancar y otros solo aparecen después.

Esta primera nota sigue ese recorrido en dos pasos. Verás qué produce `javac` y qué ejecuta una JVM; después, usarás esa frontera para distinguir los fallos en tiempo de compilación de las excepciones y los errores de lógica. La siguiente nota parte de ese mismo punto de control para mostrar los tipos que comprueba el compilador.

---

## Del código fuente al bytecode y a la ejecución en la JVM

Propósito: Usas este proceso cada vez que compilas o ejecutas código Java, porque te permite identificar qué herramienta comprueba el código fuente, qué produce y qué ejecuta realmente el resultado.

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → lee: «Java Compiler» (sección 4) para la compilación y «Java Virtual Machine» (sección 5) para la ejecución

Escribir un archivo `.java` no basta para que sus instrucciones se ejecuten. El texto que escribes es **código fuente**, pensado para que lo lean las personas y el compilador de Java. Un procesador no ejecuta directamente ese archivo fuente, por lo que Java utiliza dos etapas distintas:

1. **Compilación:** el compilador de Java, llamado `javac`, lee el código fuente. Comprueba la sintaxis y las reglas de tipos de Java; si estas comprobaciones se superan, traduce el código fuente a **bytecode** y normalmente guarda ese bytecode en un archivo `.class`.
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

Las dos etapas están separadas aunque IntelliJ las oculte detrás de un único botón verde de Run. Conceptualmente, el compilador debe aceptar el código fuente antes de que la JVM pueda ejecutar la nueva versión.

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

> **El compilador no conoce de antemano el valor que provocará el fallo.** La operación `int / int` está permitida. En un programa real, `divisor` podría proceder de la entrada del usuario, de un cálculo o de una base de datos mientras el programa está en ejecución, por lo que su valor real no suele estar fijado por la línea de código fuente. El compilador comprueba si la operación es válida para los tipos declarados; la ejecución revela si los valores hacen que esa operación válida falle.

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

| Problema | ¿Acepta `javac` el código fuente? | ¿Comienza la ejecución? | Cómo aparece |
|---|---:|---:|---|
| Falta `;` | No | No | Mensaje del compilador por error de sintaxis |
| `int * String` | No | No | Mensaje del compilador por error de tipos |
| División entera entre cero | Sí | Sí | `ArithmeticException` interrumpe la ejecución |
| Suma en lugar de multiplicación | Sí | Sí | El programa termina con un resultado incorrecto |

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

Ahora puedes situar un problema en el ciclo de vida básico de Java: el código fuente se comprueba y se compila a bytecode; después, una JVM ejecuta ese bytecode. A continuación, [01-variables-tipos.md](01-variables-tipos.md) examina los tipos declarados que sustentan esas comprobaciones del compilador: qué valores permite Java que contenga cada variable y por qué los tipos incompatibles se rechazan antes de la ejecución.
