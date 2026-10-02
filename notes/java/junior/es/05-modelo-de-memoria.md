## Índice de esta nota

- [Modelo de memoria — Stack, Heap y Garbage Collection](#modelo-de-memoria--stack-heap-y-garbage-collection)
- [La call stack — un frame por cada llamada a un método](#la-call-stack--un-frame-por-cada-llamada-a-un-método)
  - [El frame de arriba es el único que se está ejecutando, así que es el único que puede fallar](#el-frame-de-arriba-es-el-único-que-se-está-ejecutando-así-que-es-el-único-que-puede-fallar)
  - [Devolver un valor y lanzar una excepción quitan frames, los dos hacia el método que hizo la llamada](#devolver-un-valor-y-lanzar-una-excepción-quitan-frames-los-dos-hacia-el-método-que-hizo-la-llamada)
  - [Un método que se llama a sí mismo recibe un frame por llamada, y el stack puede quedarse sin sitio](#un-método-que-se-llama-a-sí-mismo-recibe-un-frame-por-llamada-y-el-stack-puede-quedarse-sin-sitio)
- [Paso por valor — Java no tiene paso por referencia](#paso-por-valor--java-no-tiene-paso-por-referencia)
  - [Caso 1 — primitivos: la copia es el valor, así que quien llama nunca ve un cambio](#caso-1--primitivos-la-copia-es-el-valor-así-que-quien-llama-nunca-ve-un-cambio)
  - [Caso 2 — objetos: la copia es la referencia, así que la mutación se ve pero la reasignación no](#caso-2--objetos-la-copia-es-la-referencia-así-que-la-mutación-se-ve-pero-la-reasignación-no)
  - [Caso 3 — un argumento `String`: el objeto no se puede cambiar, así que quien llama nunca ve un cambio](#caso-3--un-argumento-string-el-objeto-no-se-puede-cambiar-así-que-quien-llama-nunca-ve-un-cambio)
  - [Caso 4 — un array como argumento: un elemento cambiado dentro del método queda cambiado para quien llama](#caso-4--un-array-como-argumento-un-elemento-cambiado-dentro-del-método-queda-cambiado-para-quien-llama)
- [Stack vs heap — dónde viven de verdad las variables y los objetos](#stack-vs-heap--dónde-viven-de-verdad-las-variables-y-los-objetos)
  - [Un objeto sobrevive al frame que lo creó](#un-objeto-sobrevive-al-frame-que-lo-creó)
  - [De dónde sale realmente una NullPointerException](#de-dónde-sale-realmente-una-nullpointerexception)
  - [Por qué la excepción nombra la línea que usa el `null` y no la que lo guardó](#por-qué-la-excepción-nombra-la-línea-que-usa-el-null-y-no-la-que-lo-guardó)
- [Garbage collection — limpieza automática de los objetos inalcanzables](#garbage-collection--limpieza-automática-de-los-objetos-inalcanzables)
  - [Qué necesitas saber de la garbage collection en este nivel, y por qué el ajuste y el diagnóstico quedan para más adelante](#qué-necesitas-saber-de-la-garbage-collection-en-este-nivel-y-por-qué-el-ajuste-y-el-diagnóstico-quedan-para-más-adelante)
- [Aliasing — dos referencias a un mismo objeto](#aliasing--dos-referencias-a-un-mismo-objeto)
  - [El aliasing solo causa un bug cuando el objeto puede cambiar](#el-aliasing-solo-causa-un-bug-cuando-el-objeto-puede-cambiar)
  - [De dónde sale una segunda referencia a un objeto](#de-dónde-sale-una-segunda-referencia-a-un-objeto)
  - [Los arrays también hacen alias, y una copia de un array de objetos sigue compartiendo los objetos](#los-arrays-también-hacen-alias-y-una-copia-de-un-array-de-objetos-sigue-compartiendo-los-objetos)
- [Qué sabes hacer después de este capítulo](#qué-sabes-hacer-después-de-este-capítulo)

# Modelo de memoria — Stack, Heap y Garbage Collection

> 📖 [Baeldung — Stack Memory and Heap Space in Java](https://www.baeldung.com/java-stack-heap)
> 📖 [Baeldung — Memory Management in Java Interview Questions (+Answers)](https://www.baeldung.com/java-memory-management-interview-questions)

[04-metodos.md](04-metodos.md) terminó con tres preguntas que dejó abiertas a propósito. Cuando escribes `buildPage(title)`, ¿el método recibe una copia del `String` que guarda `title`, o ese mismo `String`? Cuando un método recibe un objeto y lo cambia, ¿cambia también el objeto que tiene el código que llamó al método? ¿Y cómo sabe Java a qué línea tiene que volver cuando un método termina? Este capítulo responde a las tres. Las respuestas salen de un hecho que ya tienes de [01-variables-tipos.md](01-variables-tipos.md): una variable guarda o bien un valor, o bien una **referencia**, que es la dirección de memoria de un objeto guardado en otro sitio.

Los capítulos anteriores ya han usado ese hecho sin enseñar el mecanismo que hay detrás. [01-variables-tipos.md](01-variables-tipos.md) dibujó una variable que guarda una dirección en vez de un valor, y nombró las dos zonas de memoria implicadas, el stack y el heap. [02-cadenas-de-texto.md](02-cadenas-de-texto.md) mostró que `name = name.toUpperCase()` deja el objeto `String` antiguo sin ninguna variable que apunte a él, y dijo que la JVM recupera la memoria de ese objeto más tarde. [04-metodos.md](04-metodos.md) leyó un stack trace en el que había tres llamadas a métodos abiertas a la vez. Este es el capítulo donde esas piezas se explican juntas: cómo lleva la JVM la cuenta de las llamadas en curso, qué se copia cuando se llama a un método y dónde se guarda el objeto en sí.

Viene en este punto, antes de que escribas tu primera clase, porque [06-poo-clases.md](06-poo-clases.md) construye objetos que guardan datos dentro. Para diseñar uno de esos objetos, primero tienes que ser capaz de predecir quién puede cambiarlo una vez que una referencia a él se ha pasado a un método o se ha guardado en una segunda variable. Los entrevistadores preguntan justo eso, porque separa a quien ha escrito Java de quien solo lo ha leído. Suelen preguntarlo como tres preguntas: *"¿ve quien llama el cambio si modifico un objeto dentro de un método?"*, *"¿de dónde sale realmente una `NullPointerException`?"* y *"¿cómo se libera la memoria en Java si nunca la liberas tú?"*.

El capítulo empieza con la **call stack**, la estructura en la que la JVM guarda un bloque de memoria, llamado frame, por cada llamada a un método que todavía no ha terminado. Después viene el **paso por valor** (_pass-by-value_): qué se copia en un parámetro cuando llamas a un método con un primitivo, con un objeto, con un `String` y con un array. A continuación se ponen el **stack y el heap** uno al lado del otro, para ver dónde se guarda una variable local y dónde se guarda el objeto al que apunta, y desde ahí qué pasa en memoria cuando se lanza una `NullPointerException`. Tras ello llega la **garbage collection**, el mecanismo por el que la JVM libera los objetos que el programa ya no puede alcanzar. El capítulo cierra con el **aliasing**, que es lo que tienes cuando dos variables guardan una referencia al mismo objeto, junto con el bug que produce cuando una de ellas cambia ese objeto.

**En este archivo se usan dos ejemplos.** La sección de la call stack sigue `Payroll`, un programa pequeño cuyos tres métodos solo calculan con números, de modo que todas las variables que sigues en un frame guardan un número. A partir de la sección de paso por valor, el ejemplo es un objeto `User` con un único campo, `name`, porque es el objeto más pequeño en el que se ve la diferencia entre cambiar un objeto y cambiar una variable.

> **Por qué razonas sobre la memoria en un lenguaje que la gestiona por ti.** En un lenguaje como C, el programador pide la memoria de cada dato con una función llamada `malloc`, y tiene que devolverla con otra función llamada `free`. Java no tiene ninguna de las dos: la JVM reserva la memoria y la libera por ti. Eso no significa que puedas ignorar dónde se guardan las cosas. Que un método pueda cambiar un objeto que le pasaste, por qué una línea lanza una `NullPointerException` y por qué cambiar un objeto a través de una variable cambia lo que lee otra variable dependen de lo que guarda cada variable y de dónde está guardado el objeto. En Java no gestionas la memoria a mano, pero necesitas saber dónde se guardan las cosas para predecir qué hace tu código.

---

## La call stack — un frame por cada llamada a un método

> 📖 Docs: [Baeldung — The StackOverflowError in Java](https://www.baeldung.com/java-stack-overflow-error) → leer: "Stack Frames and How StackOverflowError Occurs" — qué guarda un frame, y qué pasa cuando no hay sitio para uno más.
> 📖 Docs: [Baeldung on Computer Science — The Call Stack](https://www.baeldung.com/cs/call-stack) → leer: "The Call Stack" y "Simple Example" — el mismo mecanismo fuera de Java, con un diagrama de los frames.
> 📖 Docs: [The Java Virtual Machine Specification (SE 25) — §2.6 Frames](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.6) → leer: los dos primeros párrafos — la afirmación oficial de que se crea un frame cada vez que se invoca un método y se destruye cuando esa invocación termina.

[04-metodos.md](04-metodos.md) te enseñó un stack trace de tres líneas, `slug`, `buildPage` y `main`, y dijo que cada línea era una llamada a un método que había empezado y todavía no había terminado. Lo que dejó abierto es cómo guarda la JVM esas llamadas sin terminar. El problema que tiene que resolver la JVM es concreto. Cuando `main` llama a otro método, `main` no ha terminado: todavía le quedan líneas por ejecutar y variables que volverá a necesitar. Así que la JVM tiene que mantener intactas las variables de `main` mientras se ejecuta el otro método, y tiene que recordar el punto exacto de `main` desde el que continuar después. La estructura que usa para las dos cosas es la **call stack** (o *pila de llamadas*).

Este es el programa que sigue toda la sección. A un empleado se le pagaron 800 por 40 horas, y el programa calcula cuánto valen 5 horas extra si cada una se paga el doble:

```java
public class Payroll {
    static int hourlyRate(int pay, int hours) {
        int rate = pay / hours;                     // línea 3
        return rate;                                // línea 4
    }
    static int overtimeBonus(int pay, int hours, int extraHours) {
        int rate = hourlyRate(pay, hours);          // línea 7
        int bonus = rate * extraHours * 2;          // línea 8
        return bonus;                               // línea 9
    }
    public static void main(String[] args) {
        int bonus = overtimeBonus(800, 40, 5);      // línea 12
        System.out.println(bonus);                  // línea 13 — imprime 200
    }
}
```

Cada vez que se llama a un método, la JVM reserva un bloque de memoria para esa llamada. Ese bloque se llama **frame** (o *stack frame*). [01-variables-tipos.md](01-variables-tipos.md) nombró el frame de pasada, en la sección _El compilador no te deja leer una variable local que nunca asignaste_; esta sección muestra qué guarda un frame y en qué orden se crean y se quitan los frames. Un frame guarda lo que su llamada necesita para ejecutarse:

- **Los parámetros del método**, cada uno con una copia del argumento que se le pasó. En la llamada `hourlyRate(800, 40)`, el frame tiene un `pay` que guarda `800` y un `hours` que guarda `40`.
- **Las variables locales** declaradas en el cuerpo del método, como `rate`.
- **El punto al que ha llegado la llamada dentro de su propio código.** Para el método que se está ejecutando ahora mismo, ese punto es la línea que se está ejecutando. Para un método que ha llamado a otro y lo está esperando, ese punto es la llamada que espera.
- **Los resultados parciales de la línea en curso.** Por ejemplo, en `rate * extraHours * 2` el resultado de `rate * extraHours` tiene que guardarse en algún sitio hasta que se multiplique por `2`.

La JVM guarda los frames en una pila, y esa pila es la call stack. Un frame nuevo siempre va encima de la pila, lo que se llama *apilarlo* (en inglés, *push*). El único frame que se puede quitar es el que está encima, lo que se llama *desapilarlo* (en inglés, *pop*). Así que el último frame que entró es el primero que sale: ese orden se llama **LIFO**, *last in, first out* (el último en entrar es el primero en salir). Funciona como una pila de platos: pones un plato encima, y el único plato que puedes coger sin mover los demás es el de arriba.

Esto es lo que le pasa al stack cuando se ejecuta `Payroll`, paso a paso:

1. La JVM arranca el programa llamando a `main`. Crea un frame para `main`, con su parámetro `args` y sitio para su variable local `bonus`. El stack tiene un frame.
2. La línea 12 llama a `overtimeBonus(800, 40, 5)`. `main` no puede terminar la línea 12 hasta que esa llamada le dé un valor, así que `main` se queda en pausa en la línea 12. La JVM apila un frame para `overtimeBonus` encima del frame de `main` y copia los tres argumentos en sus parámetros: `pay` guarda `800`, `hours` guarda `40` y `extraHours` guarda `5`.
3. La línea 7 llama a `hourlyRate(pay, hours)`. `overtimeBonus` se queda en pausa en la línea 7, y la JVM apila un tercer frame, cuyo `pay` guarda `800` y cuyo `hours` guarda `40`.
4. En el frame de arriba se ejecuta la línea 3: `800 / 40` da `20`, y ese `20` se guarda en el `rate` del frame de `hourlyRate`.
5. La línea 4, `return rate;`, termina la llamada. La JVM entrega el valor `20` al frame de debajo, como resultado de la llamada que ese frame estaba esperando, y desapila el frame de `hourlyRate`. Su `pay`, su `hours` y su `rate` dejan de existir.
6. `overtimeBonus` vuelve a estar arriba y continúa exactamente donde estaba en pausa. La línea 7 guarda el `20` en su propio `rate`. La línea 8 calcula `20 * 5 * 2` y guarda `200` en `bonus`.
7. La línea 9 devuelve `200`. La JVM entrega el `200` al frame de `main` y desapila el frame de `overtimeBonus`.
8. `main` continúa en la línea 12 y guarda el `200` en su propio `bonus`. La línea 13 imprime `200`. `main` llega a su llave de cierre, la JVM desapila su frame, el stack queda vacío y el programa termina.

Este es el stack en el paso 4, el momento en que tiene más frames. El frame más nuevo se dibuja arriba:

```
[arriba]  ┌─────────────────────────────────────────────────┐
          │ hourlyRate          ejecuta la línea 3          │
          │    pay = 800    hours = 40    rate = 20         │
          ├─────────────────────────────────────────────────┤
          │ overtimeBonus       en pausa en la línea 7      │
          │    pay = 800    hours = 40    extraHours = 5    │
          │    rate y bonus todavía no tienen valor         │
          ├─────────────────────────────────────────────────┤
          │ main                en pausa en la línea 12     │
          │    args    bonus todavía no tiene valor         │
[abajo]   └─────────────────────────────────────────────────┘
```

Y esta es la ejecución completa. Léela de izquierda a derecha: cada columna es el stack una vez terminado ese paso, con el frame más nuevo arriba de la columna. Los pasos 4 y 6 no se dibujan porque no apilan ni desapilan ningún frame:

```
 paso 1     paso 2            paso 3            paso 5            paso 7     paso 8

                              hourlyRate
            overtimeBonus     overtimeBonus     overtimeBonus
 main       main              main              main              main       (vacío)
```

Los frames salen en el orden contrario al que entraron: `hourlyRate` fue el último en entrar y es el primero en salir, y `main` fue el primero en entrar y es el último en salir. Eso responde a la tercera pregunta que dejó abierta [04-metodos.md](04-metodos.md), cómo sabe Java a qué línea volver cuando un método termina. No tiene que buscarla: el frame del método que hizo la llamada es el que está justo debajo, y ha conservado el punto donde quedó en pausa.

> **Dos variables con el mismo nombre en frames distintos no chocan.** `hourlyRate` declara un `rate` y `overtimeBonus` también, pero cada uno se guarda en un frame distinto, así que son dos variables diferentes que solo comparten nombre. Se ve en los pasos 5 y 6: el `rate` de `hourlyRate` deja de existir cuando se desapila su frame, y justo después el `rate` de `overtimeBonus` recibe el `20`. Lo mismo pasa con `pay` y `hours`: `overtimeBonus` tiene los suyos, y `hourlyRate` recibió copias de ellos. Es la regla de scope de [01-variables-tipos.md](01-variables-tipos.md), vista mientras el programa se ejecuta: una variable local existe solo dentro de su método porque se guarda en el frame de una llamada a ese método.

### El frame de arriba es el único que se está ejecutando, así que es el único que puede fallar

En cada momento, la JVM está ejecutando una línea de exactamente un método: el que tiene su frame arriba del stack. Todos los frames de debajo pertenecen a métodos que están en pausa en una llamada, esperando un resultado. Un método en pausa no hace nada, así que no puede fallar mientras espera. Un error aparece cuando una línea que se está ejecutando no puede hacer lo que dice, y la única línea que se está ejecutando está en el frame de arriba. Por eso un fallo siempre empieza en el frame más nuevo.

Puedes verlo haciendo fallar a `Payroll`. Cambia la línea 12 para que las horas sean `0`:

```java
int bonus = overtimeBonus(800, 0, 5);      // línea 12
```

Ahora la línea 3 tiene que calcular `800 / 0`, y dividir un `int` entre cero lanza una `ArithmeticException`, como viste en [01-variables-tipos.md](01-variables-tipos.md). El programa imprime esto y se detiene:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Payroll.hourlyRate(Payroll.java:3)
	at Payroll.overtimeBonus(Payroll.java:7)
	at Payroll.main(Payroll.java:12)
```

La primera línea nombra el fallo: el tipo de la excepción, `java.lang.ArithmeticException`, y su mensaje, `/ by zero`. Las tres líneas que empiezan por `at` son el stack en el momento del fallo, una línea por frame, con el frame más nuevo primero. Es la misma pila que en el dibujo del paso 4, en el mismo orden. Cada una de esas líneas nombra el método de ese frame y, entre paréntesis, el archivo y la línea a la que había llegado ese frame. Para el frame de arriba, esa es la línea que falló, la 3. Para los otros dos, es la llamada en la que estaban en pausa: la línea 7 y la línea 12.

> **Qué significa `in thread "main"`.** Un **hilo** (_thread_) es una secuencia de instrucciones que la JVM ejecuta una detrás de otra. Un programa puede tener varios hilos ejecutándose a la vez, y cada hilo tiene su propia call stack. El código de los programas de este capítulo se ejecuta en un único hilo, que la JVM crea para llamar a `main` y que también se llama `main`. Así que `Exception in thread "main"` te dice de qué stack se tomó el trace que viene debajo.

Un método que estaba en pausa todavía puede fallar más tarde, cuando el método que esperaba ya ha terminado y su propio frame vuelve a estar arriba. Por ejemplo, vuelve a la línea 12 original, con 40 horas, y supón que la línea 8 fuera `int bonus = rate / (extraHours - 5);`. Como `extraHours` vale `5`, esa línea divide entre cero, y el fallo ocurre en `overtimeBonus`. Para entonces `hourlyRate` ya ha terminado y su frame se ha desapilado, así que el stack trace tiene dos líneas `at`, `Payroll.overtimeBonus(Payroll.java:8)` y `Payroll.main(Payroll.java:12)`, y ninguna línea para `hourlyRate`.

### Devolver un valor y lanzar una excepción quitan frames, los dos hacia el método que hizo la llamada

Una llamada puede terminar de dos formas. Termina con normalidad cuando llega a un `return` o a la llave de cierre del método. Termina con una excepción cuando una de sus líneas lanza una y el método no la captura. Capturar una excepción significa detenerla con un `try/catch`, la construcción cuya forma te mostró [00-intro-java.md](00-intro-java.md). `Payroll` no tiene ningún `try/catch`, así que ninguno de sus métodos captura nada. En los dos casos la JVM desapila el frame, y en los dos casos lo que viene a continuación afecta al método que hizo la llamada, que es el del frame de justo debajo. La diferencia es lo que recibe ese método.

Esto es lo que pasa en la versión de `Payroll` que divide entre cero:

1. La línea 3 no puede calcular `800 / 0`. La JVM crea un objeto `ArithmeticException` y lo lanza en el frame de arriba, el de `hourlyRate`.
2. `hourlyRate` no captura la excepción, así que la JVM desapila su frame. La línea 4 nunca se ejecuta, y la llamada no devuelve ningún valor.
3. La excepción llega a `overtimeBonus` en la línea 7, la llamada en la que estaba en pausa. `overtimeBonus` esperaba un valor y recibe una excepción en su lugar. Tampoco la captura, así que la JVM desapila también su frame. Las líneas 8 y 9 nunca se ejecutan.
4. Lo mismo ocurre en `main`, en la línea 12. La línea 13 nunca se ejecuta, así que el programa no imprime ningún número.
5. No queda ningún frame en el stack. El hilo termina, y la JVM imprime la excepción con el stack trace que viste arriba.

El stack trace sigue listando los tres frames, aunque los tres ya estaban desapilados cuando se imprimió. La razón es que el objeto de la excepción registró el stack en el paso 1, cuando se creó, y lo que imprime la JVM en el paso 5 es ese registro.

La tabla pone los dos finales uno al lado del otro: qué le pasa al frame del método que termina, qué recibe el método que lo llamó y si ese método continúa.

| | El método termina con `return` | El método termina con una excepción que no captura |
|---|---|---|
| Su frame | se desapila | se desapila |
| Qué recibe el método que lo llamó | el valor devuelto, o nada si el método es `void` | la excepción, y ningún valor |
| Qué hace a continuación el método que lo llamó | continúa justo después de la llamada | no continúa: su propio frame también se desapila, salvo que capture la excepción |

Un método que sí captura la excepción conserva su frame y continúa desde su bloque `catch`, y los frames de debajo no se tocan. Cómo se escribe un `try/catch`, en qué método tiene sentido capturar y cómo se lee un stack trace largo se explica en [11-excepciones.md](11-excepciones.md).

### Un método que se llama a sí mismo recibe un frame por llamada, y el stack puede quedarse sin sitio

Un frame pertenece a una llamada, no a un método. Si el mismo método se llama tres veces una detrás de otra, recibe un frame tres veces, una detrás de otra. Y si un método se llama a sí mismo, lo que se llama **recursión**, en el stack hay a la vez varios frames de ese mismo método, cada uno con sus propios parámetros y variables locales. El stack de cada hilo tiene un tamaño máximo, así que un método que se llama a sí mismo sin parar acaba llenándolo:

```java
public class Countdown {
    static int count(int n) {
        return count(n - 1);     // línea 3 — se llama a sí mismo, y nada hace que pare
    }
    public static void main(String[] args) {
        count(3);
    }
}
```

`count(3)` llama a `count(2)`, que llama a `count(1)`, luego a `count(0)`, luego a `count(-1)`, y así sucesivamente. Ninguna de esas llamadas llega nunca al final de la línea 3, porque cada una está en pausa esperando a la siguiente. Así que ningún frame se desapila, y cada llamada apila uno más, con su propia `n`. Cuando no queda sitio para otro frame, la JVM lanza una `StackOverflowError`:

```
Exception in thread "main" java.lang.StackOverflowError
	at Countdown.count(Countdown.java:3)
	at Countdown.count(Countdown.java:3)
	at Countdown.count(Countdown.java:3)
	...
```

La misma línea `at` se imprime 1.024 veces. Ese es el mayor número de frames que la JVM imprime en un stack trace por defecto; el stack tenía muchos más. Cuando veas una línea repetida así, busca un método que se llame a sí mismo y revisa la condición que debería hacerlo parar. Un método recursivo correcto tiene una rama que devuelve sin volver a llamarse: aquí, por ejemplo, `if (n == 0) return 0;` antes de la línea 3.

---

## Paso por valor — Java no tiene paso por referencia

> Docs: https://www.baeldung.com/java-pass-by-value-or-pass-by-reference → leer: la página entera, especialmente "Passing Object References"
> 📖 Docs: [Oracle Docs — Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → leer: "Passing Primitive Data Type Arguments" y "Passing Reference Data Type Arguments" — el tutorial oficial dice de ambos que se pasan *por valor*.

La primera sección dijo que cada parámetro de un frame guarda una copia del argumento que se le pasó. Esta sección mira qué es esa copia, porque de ella depende lo que un método puede cambiar para el código que lo llamó. El problema aparece en cuanto escribes un método que recibe un objeto y lo cambia: a veces el cambio sigue ahí cuando el método termina, y a veces no. Parece arbitrario hasta que sabes qué se copió, y desde ese momento puedes predecirlo siempre.

Dos términos nombran las dos formas en que un lenguaje puede entregar un argumento a un método:

- **Paso por valor** (_pass-by-value_): el método recibe una copia de lo que guarda la variable del código que llama. El parámetro es una variable aparte, así que asignarle algo al parámetro nunca cambia la variable del código que llama.
- **Paso por referencia** (_pass-by-reference_): el método recibe la propia variable del código que llama, con otro nombre. Asignarle algo al parámetro cambia esa variable.

Java es **siempre** paso por valor, para los primitivos y para los objetos. Los entrevistadores preguntan por ello porque mucha gente responde lo contrario, **"Java es paso por referencia para los objetos"**, y eso es falso. La confusión viene de qué es el valor que se copia cuando pasas un objeto.

La regla es esta, y los cuatro casos de abajo la muestran en código: **Java copia en el parámetro lo que guarda el argumento. Para un primitivo, copia el valor. Para un objeto, copia la *referencia*, que es la dirección de memoria del objeto, y nunca el objeto en sí.**

### Caso 1 — primitivos: la copia es el valor, así que quien llama nunca ve un cambio

Una variable de un tipo primitivo, como los `int`, `long`, `double` y `boolean` que viste en [01-variables-tipos.md](01-variables-tipos.md), guarda su valor directamente. Cuando la pasas a un método, Java copia ese valor en el parámetro, y el método trabaja con su propia copia:

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

`main` imprime `30`. La línea `x = 999` parece que debería cambiar `age`, porque `tryToChange` se llamó con `age`. No lo hace, porque `x` y `age` son dos variables distintas: `x` es una variable de `tryToChange` que recibió una copia del `30`, y asignarle `999` a `x` sustituye esa copia y nada más. Con los frames de la primera sección de este archivo, este es el stack en el momento en que se ejecuta `x = 999`:

```
[arriba]  ┌──────────────────────────────┐
          │ tryToChange                  │
          │    x = 999                   │   ← `x = 999` escribió aquí, encima del 30 copiado
          ├──────────────────────────────┤
          │ main                         │
          │    age = 30                  │   ← ninguna línea de tryToChange puede escribir aquí
[abajo]   └──────────────────────────────┘
```

`age` y `x` se guardan en dos frames distintos. La llamada copió el `30` del frame de `main` al frame de `tryToChange`, y desde ese momento nada conecta las dos variables. El código de un método no tiene forma de asignar a un parámetro o a una variable local de otro frame, así que ninguna asignación dentro de `tryToChange` puede llegar a `age`. Cuando `tryToChange` termina, su frame se desapila y `x` deja de existir, con su `999`.

> **Paso por valor en una frase: el método recibe una copia del valor, no la variable del código que lo llamó.** Esa frase es verdad en cada uno de los cuatro casos de esta sección. Lo que cambia de un caso al siguiente es qué es el valor copiado.

### Caso 2 — objetos: la copia es la referencia, así que la mutación se ve pero la reasignación no

Una variable de un tipo objeto no guarda el objeto. Guarda una **referencia**: la dirección de memoria del objeto, que está guardado en otro sitio de la memoria. La sección siguiente muestra dónde. Cuando pasas un objeto a un método, Java copia esa referencia en el parámetro. Desde ese momento hay dos variables, la del código que llama y el parámetro, y las dos apuntan al **mismo** objeto.

> **Lo que se copia cuando pasas un objeto es su referencia, que es mucho más pequeña que el objeto.** Una referencia es el valor escrito dentro de la variable, como mostró el diagrama de [01-variables-tipos.md](01-variables-tipos.md) con la dirección `0x7f3a20`. Es un valor pequeño de tamaño fijo, y ese tamaño es el mismo tanto si el objeto al que apunta tiene un campo como si tiene mil. Eso es todo lo que copia una llamada. El objeto en sí no se copia, no se mueve y la llamada no lo toca: una vez empezada la llamada sigue habiendo un solo objeto, y hay dos variables que guardan su dirección. En los dibujos de esta sección, cada flecha es una de esas referencias: va desde la variable que guarda la dirección hasta el objeto guardado en esa dirección.

Un método que quiere cambiar el objeto que recibió puede hacer dos cosas distintas, y las dos tienen resultados opuestos para el código que lo llamó. Las dos se muestran con el mismo ejemplo: un `User` cuyo campo `name` se puede cambiar.

```java
class User {
    String name;
    User(String name) { this.name = name; }
}
```

> **`User` está escrito con tres cosas que [06-poo-clases.md](06-poo-clases.md) explica en detalle.** Las dos primeras ya las has leído, en la clase `Calculator` de [04-metodos.md](04-metodos.md). `String name;` es un **campo**: una variable que pertenece a cada objeto `User` y guarda uno de sus datos. `User(String name) { this.name = name; }` es el **constructor**: el código que se ejecuta cuando escribes `new User("Alice")`, y que guarda `"Alice"` en el campo `name` del objeto que se está creando. La tercera es `user.name`, que lee o cambia ese campo desde fuera de la clase: escribes la variable que apunta al objeto, un punto y el nombre del campo. `Calculator` no lo permitía, porque sus campos estaban declarados `private`. El campo de `User` no está declarado `private` a propósito, para que los ejemplos puedan escribir `user.name = ...` directamente. Por qué las clases reales no lo permiten se explica en [06-poo-clases.md](06-poo-clases.md), con el encapsulamiento.

**Acción A — mutación: el método cambia un campo del objeto → quien llama LO VE.** El parámetro y la variable del código que llama apuntan al mismo objeto, así que cambiar un campo a través del parámetro cambia el único objeto que existe.

```java
static void rename(User u) {
    u.name = "Bob";           // cambia el objeto al que apuntan las dos variables
}

public static void main(String[] args) {
    User user = new User("Alice");
    rename(user);
    System.out.println(user.name);   // Bob — quien llama lo ve
}
```

**Acción B — reasignación: el método asigna otro objeto al parámetro → quien llama NO lo ve.** La asignación guarda otra referencia en el parámetro, que es la copia propia del método. La variable del código que llama sigue guardando la referencia al objeto original.

```java
static void replace(User u) {
    u = new User("Bob");      // solo el parámetro de ESTE método apunta ahora a un objeto nuevo
}

public static void main(String[] args) {
    User user = new User("Alice");
    replace(user);
    System.out.println(user.name);   // Alice — sin cambios
}
```

Los dibujos muestran por qué las dos acciones son distintas. Cuando el método empieza, la variable `user` de `main` y el parámetro `u` guardan la misma referencia, así que las dos apuntan al mismo objeto `User`, el que se llama Alice:

```
`user` de main   ──┐
                   ├──►  [ User: name="Alice" ]      (un objeto, dos referencias)
`u` del método   ──┘
```

La **acción A** (`u.name = "Bob"`) va al objeto al que apunta `u` y cambia su campo. Es el mismo objeto al que apunta `user`:

```
`user` de main   ──┐
                   ├──►  [ User: name="Bob" ]        ← main ve "Bob"
`u` del método   ──┘
```

La **acción B** (`u = new User("Bob")`) crea un segundo objeto y guarda su referencia en `u`. Solo cambia el parámetro. La variable `user` de `main` sigue guardando la referencia al primer objeto:

```
`user` de main   ──────►  [ User: name="Alice" ]     ← main sigue viendo "Alice"

`u` del método   ──────►  [ User: name="Bob" ]        ← nada apunta a él cuando el método termina
```

Eso responde a la segunda pregunta que dejó abierta [04-metodos.md](04-metodos.md). Cuando un método recibe un objeto y lo cambia, el objeto que tiene el código que llamó al método cambia también, porque es el mismo objeto. Lo que el método no puede hacer es lograr que la variable de ese código apunte a otro objeto.

> **La única prueba que responde a "¿ve quien llama el cambio?"** Pregunta: *¿la línea cambió el objeto, o cambió el parámetro?* Una línea que cambia algo dentro del objeto al que apunta el parámetro (`u.name = ...`, `u.setName(...)`, `list.add(...)`) cambia el único objeto que comparten las dos variables, así que el cambio es **visible** para el código que llama. Una línea que asigna al propio parámetro (`u = ...`) cambia solo a qué objeto apunta el parámetro, así que es **invisible** para el código que llama. Esa única distinción responde a todas las versiones de esta pregunta.

> **Por qué la acción B demuestra que Java no es paso por referencia.** En un lenguaje que pasa por referencia, el parámetro es la variable del código que llama con otro nombre. C++ es uno de ellos: allí, un parámetro declarado con `&` funciona así. En un lenguaje así, la acción B *sí* cambiaría la variable del código que llama: después de `replace(user)`, `user` apuntaría al `User` que se llama Bob. En Java, `main` sigue imprimiendo `Alice`, así que `u` era una variable distinta que guardaba una copia. Los dos términos se confunden fácilmente porque la palabra *referencia* significa una cosa distinta en cada uno. En el *paso por referencia*, significa la variable del código que llama. En Java, una referencia es la dirección de un objeto, y esa dirección es el valor que se copia. "Paso por valor, donde el valor es una referencia" es la forma precisa de decirlo, y es la respuesta que esperan los entrevistadores.

> **JavaScript pasa los argumentos exactamente de la misma manera.** Asignar al parámetro dentro de una función no afecta a la variable del código que la llamó, y cambiar una propiedad del objeto que recibió sí:
>
> ```javascript
> function rename(u)  { u.name = "Bob"; }        // quien llama lo ve
> function replace(u) { u = { name: "Bob" }; }   // quien llama no lo ve
>
> const user = { name: "Alice" };
> replace(user);   // user.name sigue siendo "Alice"
> rename(user);    // user.name ahora es "Bob"
> ```
>
> Si ya tenías esa intuición de JavaScript, te sirve tal cual en Java.

### Caso 3 — un argumento `String`: el objeto no se puede cambiar, así que quien llama nunca ve un cambio

El caso 2 usó un `User`, un objeto cuyo campo se puede cambiar. Un `String` también es un objeto, así que se pasa exactamente igual que el `User`: el método recibe una copia de la referencia, y el parámetro apunta al mismo objeto `String` que la variable de quien llama. Eso responde a la primera pregunta que dejó abierta [04-metodos.md](04-metodos.md): en `buildPage(title)`, el método no recibe una copia del texto, recibe una copia de la referencia a ese mismo `String`.

Lo que cambia es lo que el método puede hacer con él. La acción A no existe para un `String`, porque un `String` es inmutable: ningún método puede cambiar su texto, como viste en [02-cadenas-de-texto.md](02-cadenas-de-texto.md). Lo único que queda es la acción B, y la acción B nunca es visible para quien llama:

```java
// ❌ MAL — el String nuevo nunca llega a main
static void shout(String text) {
    text = text.toUpperCase();    // construye un String nuevo, y solo el parámetro de este método apunta a él
}

public static void main(String[] args) {
    String name = "ana";
    shout(name);
    System.out.println(name);     // ana — sin cambios
}
```

Esto es lo que pasa, paso a paso:

1. La llamada copia la referencia que guarda `name` en el parámetro `text`. Las dos variables apuntan al mismo objeto `String`, `"ana"`.
2. `text.toUpperCase()` no cambia ese objeto. Crea un objeto `String` nuevo, `"ANA"`, y devuelve una referencia a él.
3. `text = ...` guarda esa referencia nueva en `text`, que está en el frame de `shout`. La variable `name`, en el frame de `main`, sigue guardando la referencia a `"ana"`.
4. `shout` termina y su frame se desapila. `text` era la única variable que apuntaba a `"ANA"`, así que ya nada apunta a ese objeto.

Un método no puede lograr que una variable del código que llama apunte a otro objeto. Lo que sí puede hacer es devolver el objeto nuevo, para que el código que llama lo guarde en su propia variable:

```java
// ✅ BIEN — el método devuelve el String nuevo, y main lo guarda
static String shout(String text) {
    return text.toUpperCase();    // devuelve la referencia al String nuevo
}

String name = "ana";
name = shout(name);               // main hace que su propia variable apunte al String nuevo
System.out.println(name);         // ANA
```

> **Por qué un `String` parece pasarse "como un primitivo".** El resultado es el mismo que en el caso 1: haga lo que haga el método, la variable de quien llama conserva lo que tenía. La causa es distinta. En el caso 1 el método recibió una copia del valor. Aquí recibió una copia de la referencia, y el objeto al que apunta esa referencia no se puede modificar. Lo mismo vale para cualquier objeto inmutable. `BigDecimal` es uno, como viste en [01-variables-tipos.md](01-variables-tipos.md), y también lo son los wrappers de ese mismo archivo, como `Integer` y `Long`: ningún método cambia el número que guarda un objeto `Integer`. Por ejemplo, en un método `static void addOne(Integer n) { n = n + 1; }`, la línea `n = n + 1` no cambia el objeto `Integer` que tiene quien llama. Guarda en `n` una referencia a otro objeto `Integer`, el que guarda `6`. Después de `Integer count = 5; addOne(count);`, `count` sigue valiendo `5`.

### Caso 4 — un array como argumento: un elemento cambiado dentro del método queda cambiado para quien llama

El último caso es el array, y se mantiene aparte del caso 2 porque sus elementos pueden ser primitivos. Un array es un objeto, sea cual sea el tipo de sus elementos. Un `int[]` guarda primitivos en sus posiciones, pero el array en sí es un objeto, y una variable de tipo `int[]` guarda una referencia a él. Así que un array se pasa como el `User` del caso 2, y las dos acciones dan los mismos dos resultados:

```java
import java.util.Arrays;

public class Timesheet {
    static void clearFirst(int[] hours) {
        hours[0] = 0;                      // Acción A: escribe dentro del array al que apuntan las dos variables
    }

    static void replaceAll(int[] hours) {
        hours = new int[] {0, 0, 0};       // Acción B: solo el parámetro de este método apunta al array nuevo
    }

    public static void main(String[] args) {
        int[] weekHours = {8, 8, 6};

        clearFirst(weekHours);
        System.out.println(Arrays.toString(weekHours));   // [0, 8, 6] — quien llama ve el cambio

        replaceAll(weekHours);
        System.out.println(Arrays.toString(weekHours));   // [0, 8, 6] — sigue siendo el mismo array
    }
}
```

`Arrays.toString(...)` devuelve los elementos de un array como texto; aquí solo sirve para imprimirlos. `clearFirst` escribe un `0` en la posición 0 del único array que existe, así que `main` lee ese `0` después. `replaceAll` crea un segundo array y guarda su referencia en su propio parámetro, así que `weekHours`, en el frame de `main`, sigue apuntando al primer array. El código usa `new int[] {0, 0, 0}` y no solo `{0, 0, 0}` porque la forma corta solo se permite en la línea que declara la variable del array, como en `int[] weekHours = {8, 8, 6};`. En una asignación a una variable que ya existe, los valores tienen que ir después de `new int[]`.

> **Este es el caso que sorprende a quien ha aprendido "los primitivos se copian".** Los elementos de un `int[]` son primitivos, y es tentador concluir que un método no puede cambiarlos para quien llama. Lo que se pasa no son los elementos sino el array, y el array es un objeto. Solo se copia su referencia, así que el método llega a las mismas posiciones a las que llega quien llama.

La tabla junta los cuatro casos. Léela por su última columna, que responde a la pregunta de toda la sección:

| Qué pasas | Qué se copia en el parámetro | ¿Puede el método cambiar lo que ve quien llama? |
|---|---|---|
| Un primitivo (`int`, `double`, `boolean`…) | el valor | No |
| Un objeto cuyo contenido puede cambiar (un `User`, una `List`, un `StringBuilder`) | la referencia | Sí, cambiando el contenido del objeto. Nunca asignando al parámetro |
| Un objeto inmutable (un `String`, un `Integer`, un `BigDecimal`) | la referencia | No: nada dentro del objeto se puede cambiar |
| Un array, de primitivos o de objetos | la referencia | Sí, cambiando sus elementos. Nunca asignando al parámetro |

Estas cuatro filas cubren todos los argumentos que puedes pasar en Java, porque todo tipo es o bien un tipo primitivo o bien un tipo de referencia, y un array es un tipo más de objeto.

> **La comprobación clásica de entrevista: un método `swap` que no intercambia nada.**
>
> ```java
> static void swap(User a, User b) {
>     User tmp = a;
>     a = b;
>     b = tmp;
> }
>
> User first = new User("Alice");
> User second = new User("Bob");
> swap(first, second);
> System.out.println(first.name + " " + second.name);   // Alice Bob
> ```
>
> Las tres líneas de `swap` son tres asignaciones a variables de su propio frame: `tmp`, `a` y `b`. Las tres son acción B. Cuando `swap` termina, `first` sigue apuntando al `User` que se llama Alice y `second` al que se llama Bob. Un método no puede intercambiar dos variables del código que lo llamó. Lo que sí puede intercambiar es el contenido de los dos objetos, con la acción A: por ejemplo, intercambiando los valores de `a.name` y `b.name`.

---

## Stack vs heap — dónde viven de verdad las variables y los objetos

> Docs: https://www.baeldung.com/java-stack-heap → leer: "Stack Memory in Java" y "Heap Space in Java"

La sección anterior no dejaba de decir que un objeto está guardado "en otro sitio de la memoria" y que una variable solo guarda su dirección. Esta sección nombra los dos sitios. La JVM, el programa que ejecuta tu Java compilado, como viste en [00-intro-java.md](00-intro-java.md), divide la memoria que usa para los datos de tu programa en dos zonas, y cada una tiene un trabajo distinto:

- **El stack** es donde están los frames. Guarda los parámetros y las **variables locales** de cada llamada en curso. Una variable de un tipo primitivo tiene su valor escrito ahí. Una variable de un tipo objeto tiene ahí escrita una **referencia**, nunca el objeto.
- **El heap** es donde están los objetos. Todo objeto se guarda ahí, sea cual sea el método que lo creó. El heap no está dividido por llamadas: un objeto que está en él no pertenece a ningún método, y cualquier código que tenga una referencia a él puede usarlo.

El stack es la **call stack** de la primera sección de este archivo, [La call stack — un frame por cada llamada a un método](#la-call-stack--un-frame-por-cada-llamada-a-un-método), con `main` abajo y `overtimeBonus` y `hourlyRate` encima. Como viste allí, cuando un método termina su frame se desapila, y sus parámetros y variables locales dejan de existir.

**El objeto que está en el heap no deja de existir cuando un método termina.** Lo que se desapila es el frame, y con él la variable que guardaba la referencia. Por eso un objeto se puede seguir usando después de que el método que lo creó haya terminado, y por eso se puede pasar de un método a otro. Este es el ejemplo del `User` con las dos zonas dibujadas a la vez:

```java
public static void main(String[] args) {
    int count = 3;                       // primitivo → el valor está en el stack
    User user = new User("Alice");       // referencia en el stack, objeto en el heap
}
```

```
        STACK (un frame por llamada)             HEAP (compartido por todas las llamadas)
   ┌──────────────────────────────┐        ┌──────────────────────────┐
   │ frame de main():             │        │                          │
   │    count = 3                 │        │  [ User: name="Alice" ]  │
   │    user  = ●─────────────────┼───────►│                          │
   └──────────────────────────────┘        └──────────────────────────┘
   `count` guarda su valor directamente.   El objeto en sí se guarda aquí.
   `user` solo guarda una referencia,      La referencia que guarda `user`
   dibujada como la flecha.                es lo que lleva hasta él.
```

Este dibujo es la razón de la regla de la sección anterior. Pasar un argumento copia lo que guarda la variable en su frame. Para `count`, eso es un número, así que el parámetro recibe un número. Para `user`, eso es una referencia, así que el parámetro recibe una referencia, y las dos referencias apuntan al mismo objeto del heap. La acción A pasa por la referencia hasta ese único objeto, y por eso `main` ve el cambio. La acción B escribe otra referencia en el parámetro, que está en el frame del método al que se llamó, así que ningún otro frame resulta afectado.

> **¿Por qué dos zonas en vez de una?** Porque los dos tipos de datos dejan de hacer falta en momentos distintos, y eso decide cómo se puede liberar su memoria.
>
> 1. Un parámetro o una variable local solo hace falta mientras se ejecuta su llamada. Las llamadas terminan en el orden inverso al que empezaron, así que la memoria de la última llamada que empezó es siempre la primera que se puede liberar. Eso es exactamente lo que da un stack: liberar la memoria de una llamada es desapilar su frame, sin nada que buscar y sin nada que decidir.
> 2. Un objeto puede hacer falta después de que la llamada que lo creó haya terminado, como muestra `createUser` en el siguiente apartado, y varias variables en varios frames pueden apuntar a él a la vez. Si el objeto se guardara en el frame de la llamada que lo creó, dejaría de existir cuando ese frame se desapilara, y las demás variables se quedarían guardando la dirección de algo que ya no está.
> 3. Así que los objetos se guardan en una zona aparte, el heap, donde no se libera nada cuando un método termina. El precio es que la JVM necesita otra forma de averiguar cuándo un objeto ya no hace falta. Esa forma es el garbage collector, que tiene su propia sección más abajo en este archivo.

> **Hay un stack por hilo, y un solo heap para todo el programa.** La primera sección de este archivo dijo que cada hilo tiene su propia call stack. El heap es lo contrario: hay un único heap, y todos los hilos del programa crean sus objetos en él. Esa es la razón de una regla que te dio [02-cadenas-de-texto.md](02-cadenas-de-texto.md), que un `StringBuilder` tiene que ser una variable local y nunca un campo de un objeto compartido. Una variable local se guarda en un frame, el frame está en el stack de un hilo, y ningún otro hilo puede leer ese stack. Así que mientras la única referencia al builder esté en esa variable local, ningún otro hilo tiene forma de llegar al builder, aunque el builder en sí esté en el heap compartido.

> **Un campo no es una variable local: se guarda dentro de su objeto, en el heap.** El dibujo del stack y el heap, más arriba en esta sección, escribe `name="Alice"` dentro del recuadro de `User` para abreviar. En completo, el campo `name` forma parte del objeto `User`, y lo que guarda el campo es una referencia a un objeto `String`, que es un segundo objeto en el heap:
>
> ```
>         STACK                           HEAP
>    ┌──────────────────┐
>    │ frame de main(): │
>    │    count = 3     │
>    │    user  = ●─────┼────►  [ User:  name = ●──────►  [ String "Alice" ] ]
>    └──────────────────┘
> ```
>
> Así que "primitivos en el stack, objetos en el heap" es una regla solo sobre las variables locales. Un campo, sea primitivo o no, se guarda dentro del objeto al que pertenece. [01-variables-tipos.md](01-variables-tipos.md) lo explicó en la sección _El compilador no te deja leer una variable local que nunca asignaste_, junto con el valor por defecto con el que empieza un campo.

### Un objeto sobrevive al frame que lo creó

Antes, en esta misma sección, leíste que el objeto del heap no deja de existir cuando un método termina. Este apartado traza esa afirmación en un método que crea un `User` y lo devuelve:

```java
static User createUser(String name) {
    User created = new User(name);     // el objeto va al heap, su referencia en el frame de createUser
    return created;                    // la referencia se entrega al frame de debajo
}

public static void main(String[] args) {
    User user = createUser("Alice");
    System.out.println(user.name);     // Alice
}
```

1. `main` llama a `createUser("Alice")`, y la JVM apila un frame para `createUser`.
2. `new User(name)` crea el objeto en el heap. Su referencia se guarda en la variable local `created`, en el frame de `createUser`.
3. `return created;` entrega una copia de esa referencia al frame de `main`, exactamente como el paso 5 de la traza de `Payroll` entregó el `20`. Después la JVM desapila el frame de `createUser`, y `created` deja de existir.
4. `main` guarda en `user` la referencia que recibió. El objeto nunca estuvo en el frame desapilado, así que sigue en el heap, y ahora `user` apunta a él.

```
   mientras createUser se ejecuta                 después de que createUser haya terminado

      STACK                HEAP                      STACK                HEAP
 ┌─────────────────┐                            ┌─────────────────┐
 │ createUser      │                            │ main            │
 │   created = ●───┼──►  [ User "Alice" ]       │   user = ●──────┼──►  [ User "Alice" ]
 ├─────────────────┤                            └─────────────────┘
 │ main            │
 │   user (todavía │
 │   sin valor)    │
 └─────────────────┘
```

Lo que decide si el objeto se puede seguir usando no es el frame desde el que se creó, sino si alguna variable sigue guardando una referencia a él. Si `main` hubiera escrito `createUser("Alice");` en una línea sola, sin guardar el resultado, la referencia devuelta se habría descartado. Ninguna variable apuntaría al objeto, y se quedaría en el heap sin forma de llegar a él. Lo que hace la JVM con un objeto en ese estado es el tema de la siguiente sección, sobre la garbage collection.

### De dónde sale realmente una NullPointerException

> 📖 Docs: [Baeldung — Helpful NullPointerExceptions in Java](https://www.baeldung.com/java-14-nullpointerexception) → leer: "Detailed Exception Message" — cómo se construye el mensaje a partir de la operación que falló y la referencia que era `null`.

[04-metodos.md](04-metodos.md) te mostró qué aspecto tiene este fallo y en qué método hay que rechazar el `null`. Con el stack y el heap ya puedes ver qué ocurre en memoria, que además es una pregunta de entrevista muy frecuente. Una variable de un tipo objeto no tiene por qué apuntar a un objeto. Cuando no apunta a ninguno, el valor que guarda es `null`:

```
        STACK                              HEAP
   ┌──────────────────┐
   │ user = null      │   ✗  no apunta a nada — no hay ningún objeto en el heap
   └──────────────────┘
```

`null` no es un objeto, y guardarlo no es un error: es un valor legal para una variable de un tipo objeto. El fallo ocurre cuando una línea usa esa variable para llegar al objeto, llamando a un método suyo o leyendo uno de sus campos. [04-metodos.md](04-metodos.md) llamó a esa operación **desreferenciar** (_dereferencing_). Con `null` no hay ninguna dirección a la que ir, y no hay ningún objeto al otro lado:

```java
User user = null;
System.out.println(user.name);   // NullPointerException
```

El programa se detiene con este mensaje, que nombra la operación que falló y la variable que era `null`:

```
Exception in thread "main" java.lang.NullPointerException: Cannot read field "name" because "user" is null
```

> **Una `NullPointerException` no significa que un objeto esté roto: significa que no hay objeto.** La variable existe y guarda un valor legal, `null`. Lo que falta está en el heap: la línea necesita un objeto del que leer el campo, o sobre el que ejecutar el método, y ahí no hay ninguno. Por eso las protecciones que viste en [04-metodos.md](04-metodos.md) se reducen todas a asegurarse de que hay un objeto antes de que una línea use la referencia. `Objects.requireNonNull` detiene el método en su primera línea si falta el objeto. Un simple `if (user != null)` comprueba la referencia antes de usarla. Y `Optional`, que verás en [09-genericos.md](09-genericos.md), declara en el tipo de retorno de un método que el valor puede faltar.

### Por qué la excepción nombra la línea que usa el `null` y no la que lo guardó

[04-metodos.md](04-metodos.md) te mostró el comportamiento: una `NullPointerException` se lanza donde se usa el `null`, y su stack trace no muestra de dónde vino el `null`. Con los frames y las referencias ya puedes ver por qué no puede ser de otra manera. En este programa un método busca a un usuario, no encuentra a nadie y devuelve `null`, y otro método usa el resultado:

```java
public class Greeter {
    static User findUser(String name) {
        return null;                           // línea 3 — nadie tiene ese nombre
    }
    static String greet(User u) {
        return "Hello, " + u.name;             // línea 6
    }
    public static void main(String[] args) {
        User user = findUser("Bob");           // línea 9
        String text = greet(user);             // línea 10
        System.out.println(text);              // línea 11
    }
}
```

```
Exception in thread "main" java.lang.NullPointerException: Cannot read field "name" because "u" is null
	at Greeter.greet(Greeter.java:6)
	at Greeter.main(Greeter.java:10)
```

El `null` se produjo en la línea 3, y ni esa línea ni el método al que pertenece, `findUser`, aparecen en ningún sitio de la salida. Esto es lo que ocurrió, paso a paso:

1. La línea 9 llama a `findUser("Bob")`, y la JVM apila un frame para él. La línea 3 devuelve `null`. Devolver `null` es entregar un valor como cualquier otro: la referencia que no apunta a ningún objeto. No se comprueba nada, porque ninguna operación ha necesitado todavía un objeto. La JVM desapila el frame de `findUser`.
2. `main` guarda ese `null` en `user`. Es la copia de un valor en una variable, y tampoco necesita ningún objeto.
3. La línea 10 llama a `greet(user)`. El paso por valor copia el `null` que guarda `user` en el parámetro `u`. Sigue siendo solo una copia.
4. La línea 6 evalúa `u.name`. Esta es la primera operación que necesita el objeto: para leer el campo `name`, la JVM tiene que ir a la dirección que guarda `u` y mirar dentro del objeto que hay allí. `u` guarda `null`, así que no hay ninguna dirección a la que ir. La JVM no puede completar la línea, y lanza una `NullPointerException` en el frame que se está ejecutando, el frame de `greet`.
5. El stack trace lista los frames que estaban en el stack en ese momento: `greet`, en la línea 6, y `main`, en pausa en la línea 10.

Dos hechos de este capítulo explican por qué la línea 3 no puede aparecer:

- **Una referencia no registra de dónde vino.** El `null` que guarda `u` es solo un valor. Nada en la variable dice qué línea produjo ese valor, igual que un `int` que guarda `0` no dice qué línea lo calculó. Así que cuando falla la línea 6, la JVM sabe qué variable es `null`, y el mensaje lo dice (`because "u" is null`), pero no tiene forma de saber que ese `null` se escribió por primera vez en la línea 3.
- **El stack solo guarda llamadas que no han terminado.** La llamada a `findUser` terminó en el paso 1 y su frame se desapiló. Un stack trace es una lista de los frames que hay en el stack, así que un método que ya ha terminado no puede estar en él. Esa es la diferencia con el ejemplo `Report` de [04-metodos.md](04-metodos.md), donde el método que creó el `null` era `main` y seguía en el stack. Incluso allí, el trace mostraba la línea en la que `main` estaba en pausa, nunca la línea que creó el `null`.

La JVM no comprueba antes porque, hasta la línea 6, no hay nada mal. Como dijo el apartado anterior, `null` no es un error por sí mismo: es un valor legal para cualquier variable de referencia, y un programa puede guardarlo, pasarlo y devolverlo. Lo que no se puede es usar un objeto que no está. La tabla muestra qué operaciones sobre una variable que guarda `null` necesitan el objeto y cuáles no. Lista las operaciones que te vas a encontrar con más frecuencia, no todas las que tiene el lenguaje:

| Operación sobre una variable que guarda `null` | ¿Necesita el objeto? | Resultado |
|---|---|---|
| Asignarla: `User other = user;` | No | `other` también guarda `null` |
| Pasarla como argumento: `greet(user)` | No | el parámetro guarda `null` |
| Devolverla: `return user;` | No | el código que llama recibe `null` |
| Compararla: `user == null`, `user != null` | No | `true` o `false` |
| Concatenarla: `"Hello, " + user` | No | el texto `"Hello, null"` |
| Leer o escribir un campo: `user.name` | Sí | `NullPointerException` |
| Llamar a un método sobre ella: `user.getName()` | Sí | `NullPointerException` |
| Leer un elemento o la longitud de un array: `weekHours[0]`, `weekHours.length` | Sí | `NullPointerException` |
| Hacerle unboxing: `int n = count;` cuando `count` es un `Integer` que guarda `null` | Sí | `NullPointerException` |

Las cinco primeras filas solo copian o comparan la referencia, y una referencia que es `null` se puede copiar y comparar como cualquier otra. Las cuatro últimas tienen que llegar al objeto, y ahí es donde se lanza la excepción. La última fila es la única en la que no escribes ni punto ni corchetes. [01-variables-tipos.md](01-variables-tipos.md) la explicó en la sección _Autoboxing y unboxing_: el compilador añade una llamada a `intValue()` que tú no escribiste, y esa llamada es la que necesita el objeto.

---

## Garbage collection — limpieza automática de los objetos inalcanzables

> Docs: https://www.baeldung.com/java-memory-management-interview-questions → leer: Q2 "What Is Garbage Collection and What Are Its Advantages?", Q8 "When Does an Object Become Eligible for Garbage Collection?" y Q9 "How Do You Trigger Garbage Collection from Java Code?"
> 📖 Docs: [Oracle Docs — Using Objects](https://docs.oracle.com/javase/tutorial/java/javaOO/usingobject.html) → leer: "The Garbage Collector" — tres párrafos: cuándo un objeto pasa a ser elegible, y que primero hay que soltar todas las referencias a él.

Todo objeto que creas ocupa sitio en el heap, y el heap tiene un tamaño limitado. Un programa que solo creara objetos y nunca liberara ninguno acabaría llenándolo. En un lenguaje como C, liberar la memoria es trabajo del programador: cada trozo de memoria que el programa pidió hay que devolverlo con una llamada a `free`, la función que mencionó la introducción de este archivo, y esa llamada se escribe a mano. Si el programador se olvida de ella, esa memoria no se devuelve nunca. Si la llamada se hace mientras alguna variable sigue apuntando a esa memoria, la variable se queda guardando la dirección de algo que ya no está. Java no tiene `free()` ni nada equivalente: nunca escribes código para liberar un objeto.

En su lugar lo hace la JVM, con el **garbage collector** (a menudo abreviado **GC**): una parte de la JVM que se ejecuta de vez en cuando, por su cuenta, mientras tu programa corre. Su regla es la respuesta a la pregunta de entrevista *"¿cómo se gestiona la memoria en Java?"*: **el garbage collector recupera un objeto cuando el programa ya no puede alcanzarlo.** Un objeto es **alcanzable** (_reachable_) mientras alguna cadena de referencias lleve hasta él. La cadena empieza en una variable que el programa puede usar en ese momento: un parámetro o una variable local de un frame que está en el stack, o un campo estático. Un campo estático es una variable que pertenece a una clase y no a uno de sus objetos, y se explica en [06-poo-clases.md](06-poo-clases.md). Desde esa primera variable, la cadena puede continuar por los campos de los objetos a los que llega. Cuando desaparece la última referencia que llevaba a un objeto, el objeto es **inalcanzable** (_unreachable_), y pasa a ser elegible para que se recupere. Tú no inicias ese proceso y no puedes saber cuándo se ejecutará. Dejas de referirte a un objeto, y la JVM lo recupera en algún momento posterior.

Este es un objeto volviéndose inalcanzable, con el mismo `User`:

```java
User user = new User("Alice");   // se crea el objeto, y una referencia apunta a él
user = new User("Bob");          // user apunta ahora a un objeto nuevo
```

Después de la segunda línea, el `User` que se llama Alice sigue en el heap, pero **ninguna referencia apunta ya a él**: la única estaba en `user`, y la segunda línea la sobrescribió.

```
        STACK                       HEAP
   ┌──────────────┐          [ User: name="Alice" ]   ← inalcanzable → el GC lo recuperará
   │ user = ●─────┼───────►  [ User: name="Bob"   ]   ← alcanzable, en uso
   └──────────────┘
```

Ninguna línea del programa puede volver a usar ese objeto, porque ninguna variable lleva hasta él, así que el sitio que ocupa en el heap se desaprovecha. En algún momento posterior el garbage collector descubre que es inalcanzable y recupera ese sitio, sin ningún código tuyo.

Un `String` que reconstruyes deja el mismo tipo de basura: [02-cadenas-de-texto.md](02-cadenas-de-texto.md) mostró, en su sección _Acumulando texto — cuándo `+` se convierte en la herramienta equivocada_, que `report += ...` dentro de un bucle abandona un objeto `String` en cada vuelta. Cada uno de esos objetos abandonados es inalcanzable, igual que el `User` que se llama Alice: ocupa sitio en el heap hasta que se ejecuta el garbage collector, y encontrarlo y recuperarlo es trabajo que el garbage collector tiene que hacer.

Recuperar un objeto no lo borra. Como explicó [01-variables-tipos.md](01-variables-tipos.md) en la sección _El compilador no te deja leer una variable local que nunca asignaste_, la JVM marca como disponible el espacio que ese objeto ocupaba en el heap, y se lo da a un `new` posterior.

> **Por qué Java puede liberar la memoria por ti, y por qué no te deja hacerlo a mano.** Un programa solo puede usar un objeto a través de una referencia, y la JVM sabe dónde está cada referencia: en los frames que están en los stacks, en los campos estáticos y en los campos de los objetos. Así que el garbage collector puede hacer lo que dice la definición de *alcanzable*: partir de las variables de los frames y de los campos estáticos, seguir cada referencia hasta su objeto, y desde ese objeto seguir las referencias que guardan sus campos. Todo objeto al que llega así todavía lo puede usar alguna línea del programa. Todo objeto al que no llega no se podrá usar nunca más, porque ninguna variable lleva hasta él, así que liberarlo es seguro. Eso incluye un objeto al que solo hace referencia otro objeto inalcanzable. Por ejemplo, si la única referencia a un `User` está dentro de un array, y ninguna variable apunta ya a ese array, entonces ni el array ni el `User` se pueden alcanzar, y los dos son basura.
>
> Un `free()` escrito a mano rompería esa garantía. Si pudieras liberar un objeto mientras otra variable todavía apunta a él, esa variable guardaría la dirección de una memoria que ya no contiene el objeto. Java descarta ese caso: una referencia o bien es `null`, o bien apunta a un objeto que existe.

> **¿Puedes ejecutar tú mismo el garbage collector?** Hay un método para ello, `System.gc()`, y lo único que hace es pedirlo. Su documentación dice que llamarlo *sugiere* que la JVM haga un esfuerzo por recuperar los objetos sin usar, y que no hay ninguna garantía de que recupere un número concreto de ellos, ni de que termine en un momento concreto, si es que termina. Tu código no lo llama. La JVM decide cuándo recolectar, normalmente cuando necesita sitio en el heap para objetos nuevos.

> **Un memory leak (fuga de memoria) en Java es un objeto que sigue siendo alcanzable y que ya nadie necesita.** El garbage collector solo recupera lo inalcanzable. No puede saber que has terminado con un objeto mientras alguna variable siga llevando hasta él. Por ejemplo, si añades objetos a una `List` que existe mientras dura el programa, y nunca los quitas, cada uno de ellos sigue siendo alcanzable a través de esa lista, y el garbage collector nunca podrá recuperarlos. Un programa que sigue haciendo eso usa cada vez más heap. Así que el garbage collector te libera de tener que liberar la memoria a mano, pero no de esto: cuando ya no necesitas un objeto, ninguna referencia tuya debería seguir llevando hasta él.

### Qué necesitas saber de la garbage collection en este nivel, y por qué el ajuste y el diagnóstico quedan para más adelante

La garbage collection está en este capítulo como un mecanismo que hay que reconocer, porque las preguntas de este capítulo acaban en ella: qué le pasa a un objeto que el programa ya no puede alcanzar. Para el código que escribes en este nivel, bastan cuatro cosas:

1. Un objeto se convierte en basura cuando es inalcanzable, y la JVM lo libera automáticamente en algún momento posterior. No escribes ningún código para liberarlo.
2. Tú no decides cuándo ocurre, y ninguna línea de tu código puede depender de que ya haya ocurrido.
3. Un objeto que ya no necesitas pero que sigue siendo alcanzable no se libera nunca. Eso es un memory leak, un objeto que sigue siendo alcanzable aunque ya nadie lo necesita, y evitarlo es cosa tuya.
4. Cada una de las dos zonas de memoria tiene su propio error cuando se queda sin sitio, y deberías ser capaz de distinguirlos por su primera línea.

La tabla muestra esos dos errores: qué zona se quedó sin sitio en cada uno, y qué suele causarlo.

| Error que nombra la primera línea de la salida | La zona que se quedó sin sitio | La causa habitual |
|---|---|---|
| `java.lang.StackOverflowError` | la call stack de un hilo | un método que se llama a sí mismo y nunca para, de modo que se apilan frames y no se desapila ninguno |
| `java.lang.OutOfMemoryError: Java heap space` | el heap | demasiados objetos que siguen siendo alcanzables, de modo que el garbage collector no puede liberar ninguno |

Lo que este capítulo deja fuera es todo lo relativo a cómo hace su trabajo el garbage collector y a cómo se ajusta: los distintos collectors que ofrece la JVM, cómo se divide el heap por dentro, las opciones que fijan el tamaño del heap y del stack, y cómo se diagnostica un memory leak en una aplicación que está en ejecución. Se deja fuera por dos razones. La primera es que nada de eso cambia cómo escribes un método o una clase: la JVM elige esos ajustes por sí misma, y un proyecto funciona con ellos hasta que alguien mide un problema. La segunda es que ajustarlos es un trabajo que se hace sobre una aplicación en producción, con herramientas de medición, cuando hay un problema real de memoria que resolver, y en estas notas eso pertenece a un nivel profesional posterior. La parte de la garbage collection que sí cambia cómo escribes código ya está en esta sección: no guardes referencias a objetos que ya no necesitas, y no crees miles de objetos desechables dentro de un bucle cuando basta con uno solo.

---

## Aliasing — dos referencias a un mismo objeto

> 📖 Docs: [Oracle Docs — Creating Objects](https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html) → leer: "Initializing an Object" — la frase "an object can have multiple references to it" y la figura que viene después, donde dos referencias apuntan al mismo objeto `Point`.
> 📖 Docs: [Baeldung — How to Make a Deep Copy of an Object in Java](https://www.baeldung.com/java-deep-copy) → leer: "Shallow Copy" — el bug que describe esta sección, en un `User` que comparte un objeto `Address` con su copia.

En la sección de paso por valor, apareció una segunda referencia a un objeto cuando llamaste a un método: el parámetro. No hace falta ninguna llamada a un método para eso. Una simple asignación entre dos variables hace lo mismo, y produce un bug que nadie escribe a propósito. En este fragmento, un programa guarda un `User` para usarlo como punto de partida de cada usuario nuevo:

```java
// ❌ MAL — alice y bob no son copias de template: son el propio template
User template = new User("New user");

User alice = template;               // la intención: empezar a Alice desde el template
alice.name = "Alice";

User bob = template;                 // la intención: empezar a Bob desde el template
System.out.println(bob.name);        // Alice
System.out.println(template.name);   // Alice — el propio template ha cambiado de nombre
```

Ninguna línea de ese código dice "cambia el nombre del template", y cada línea parece correcta cuando la lees por separado. Aun así, Bob empieza con el nombre de Alice, y lo mismo les pasará a todos los usuarios que se creen desde el template a partir de ahora.

La causa es lo que hace `=`. Una asignación copia lo que guarda la variable de la derecha en la variable de la izquierda. Con dos variables `int`, `int b = a;` copia el número, y desde entonces las dos variables son independientes. Con dos variables de un tipo objeto la regla es la misma, y lo que guarda la variable de la derecha es una referencia. Así que `User alice = template;` copia la referencia, no el objeto. Cuenta los `new` del fragmento: hay uno, así que hay un objeto `User`. Hay tres variables, y las tres guardan la misma referencia:

```
        STACK                              HEAP
   ┌──────────────────────┐
   │ frame de main():     │
   │    template = ●──────┼────┐
   │    alice    = ●──────┼────┼────►  [ User: name="Alice" ]
   │    bob      = ●──────┼────┘
   └──────────────────────┘
```

Cuando dos o más referencias apuntan al mismo objeto, cada una se llama **alias** de las otras, y la situación se llama **aliasing**. La línea `alice.name = "Alice"` no escribe en un `User` que pertenezca a Alice, porque no existe tal objeto. Escribe en el único objeto `User` que hay, y `template` y `bob` leen ese mismo objeto.

Puedes comprobar si dos variables son alias con `==`. [01-variables-tipos.md](01-variables-tipos.md) te dijo que, entre dos variables de un tipo objeto, `==` compara las direcciones de memoria que guardan, que son sus referencias. Así que responde exactamente a esta pregunta: ¿apuntan las dos al mismo objeto?

```java
System.out.println(alice == template);   // true — un solo objeto
```

Qué significa que dos objetos distintos sean iguales es otra pregunta. Se explica en [06-poo-clases.md](06-poo-clases.md), junto con los casos en los que `==` es la comparación equivocada.

¿Qué cambios ve el otro alias? La prueba es la de la sección de paso por valor: ¿la línea cambió el objeto, o cambió la variable? La tabla la aplica a las operaciones que escribirás con más frecuencia:

| Qué hace el código a través de un alias | ¿Lo ve el otro alias? | Por qué |
|---|---|---|
| Escribe un campo: `alice.name = "Alice";` | Sí | el campo está dentro del único objeto al que apuntan los dos |
| Llama a un método que cambia el objeto: `names.add("Ana");` sobre una lista | Sí | el método cambia ese mismo objeto |
| Escribe un elemento de un array: `backup[0] = 0;` | Sí | el elemento está dentro del único array al que apuntan los dos |
| Asigna otro objeto a la variable: `alice = new User("Alice");` | No | solo cambia la variable `alice`; el otro alias sigue apuntando al primer objeto |
| Asigna `null` a la variable: `alice = null;` | No | el objeto no se toca, y el otro alias sigue apuntando a él |

La solución es crear un segundo objeto cuando lo que quieres es un segundo objeto. Con este `User`, eso significa llamar a `new` y pasarle los datos del template:

```java
// ✅ BIEN — cada usuario es un objeto nuevo que empieza con los datos del template
User template = new User("New user");

User alice = new User(template.name);    // un segundo objeto, que empieza con el mismo nombre
alice.name = "Alice";

User bob = new User(template.name);      // un tercer objeto
System.out.println(bob.name);            // New user
System.out.println(template.name);       // New user
System.out.println(alice == template);   // false — dos objetos distintos
```

> **El aliasing no es un bug en sí mismo.** Compartir un objeto es a menudo exactamente lo que quieres. En la sección de paso por valor, `rename(user)` funcionaba porque el parámetro `u` era un alias de la variable `user`: la acción A es aliasing usado a propósito. El bug aparece cuando el código trata un alias como si fuera una copia independiente, como hizo el ejemplo del template. Así que la pregunta que tienes que hacerte cada vez que asignas una variable de objeto a otra, o pasas un objeto a un método, es si un cambio hecho a través de una referencia debería verse a través de la otra. Si debería verse, comparte la referencia. Si no debería, crea un segundo objeto.

### El aliasing solo causa un bug cuando el objeto puede cambiar

La versión corregida de arriba todavía contiene un alias, y es inofensivo. `new User(template.name)` copia en el campo `name` del objeto nuevo la referencia que guarda `template.name`, así que durante un momento los dos objetos `User` apuntan al mismo objeto `String`, `"New user"`. Ese `String` compartido no puede causar ningún bug, porque un `String` es inmutable: ninguna operación a través de una referencia puede cambiar lo que lee la otra. La línea `alice.name = "Alice"` no cambia ese `String`. Guarda en el campo del segundo `User` una referencia a otro `String`.

Lo mismo pasa con dos variables locales:

```java
String first = "ana";
String second = first;              // dos referencias al mismo String
second = second.toUpperCase();      // crea otro String, y solo `second` apunta a él
System.out.println(first);          // ana
```

[02-cadenas-de-texto.md](02-cadenas-de-texto.md) dio esto como la primera ventaja de la inmutabilidad: un `String` se puede compartir sin riesgo, porque ningún código que lo reciba puede alterarlo.

Así que un bug de aliasing necesita tres cosas a la vez: dos referencias al mismo objeto, un objeto cuyo contenido puede cambiar, y código que lo cambia a través de una referencia mientras otro código sigue contando con lo que leyó a través de la otra. Quita cualquiera de las tres y el bug no puede ocurrir, y de ahí salen las tres formas de evitarlo:

- **Copiar el objeto**, como hace la versión corregida de arriba, de modo que haya dos objetos y ningún alias.
- **Usar un objeto que no puede cambiar**, como hace `String`. Cómo escribir una clase cuyos objetos no se puedan cambiar después de crearlos se explica en [06-poo-clases.md](06-poo-clases.md).
- **No cambiar un objeto que te dieron, salvo que ese sea el trabajo declarado de tu método.** Un método llamado `clearFirst` o `rename` anuncia el cambio en su nombre. Un método que recibe un array solo para encontrar su valor mayor, y ordena el array para encontrarlo, deja el array del código que lo llamó en un orden distinto, y nada en la llamada lo dice.

### De dónde sale una segunda referencia a un objeto

Todo alias es una copia de una referencia. En el código de todos los días, una referencia se copia en cuatro sitios:

1. **Una asignación entre dos variables**, como `User alice = template;` en esta sección.
2. **Pasar el objeto como argumento.** El parámetro es un alias de la variable del código que llama, como viste en el caso 2 de la sección de paso por valor.
3. **Devolver el objeto desde un método.** En [04-metodos.md](04-metodos.md), en la sección _Tipos de retorno_, `getMembers()` devolvía una referencia a la propia lista que guarda un objeto `Team`, y el código que lo llamó añadió un elemento a esa lista desde fuera.
4. **Guardar el objeto dentro de otro objeto, de un array o de una colección.** Un campo, una posición de un array y una lista guardan cada uno una referencia al objeto, no el objeto. Después de `team[0] = alice;`, la posición 0 del array y la variable `alice` son dos alias de un mismo `User`.

Estos cuatro son todas las formas en que se copia una referencia en el código que escribirás en este nivel.

### Los arrays también hacen alias, y una copia de un array de objetos sigue compartiendo los objetos

> 📖 Docs: [Baeldung — How to Copy an Array in Java](https://www.baeldung.com/java-array-copy) → leer: "Array Copy With Object.clone()" — los dos resultados de abajo: una copia independiente con primitivos, y objetos compartidos con un array de objetos.

Un array es un objeto, así que dos variables de array pueden ser alias como cualquier otra. El caso típico es una "copia de seguridad" que no lo es:

```java
// ❌ MAL — backup y weekHours son el mismo array
int[] weekHours = {8, 8, 6};
int[] backup = weekHours;            // la intención: conservar los valores originales
weekHours[2] = 0;
System.out.println(backup[2]);       // 0 — la "copia de seguridad" también cambió
```

Hay un array y dos variables que apuntan a él. Para obtener un segundo array, llama a `clone()`, un método que tiene todo array. Crea un array nuevo de la misma longitud y copia en él cada posición del original:

```java
// ✅ BIEN — clone() crea un segundo array
int[] weekHours = {8, 8, 6};
int[] backup = weekHours.clone();    // un segundo array, con los mismos tres números
weekHours[2] = 0;
System.out.println(backup[2]);       // 6
```

> **`clone()` copia lo que guarda cada posición, y en un array de objetos cada posición guarda una referencia.** Con un `int[]`, cada posición guarda el número en sí, así que los dos arrays son totalmente independientes. Con un array de objetos, cada posición guarda una referencia, y `clone()` copia esas referencias. El resultado son dos arrays cuyas posiciones apuntan a los mismos objetos:
>
> ```java
> User[] team = { new User("Alice"), new User("Bob") };
> User[] teamCopy = team.clone();               // un segundo array, con copias de las dos referencias
>
> teamCopy[0].name = "Zoe";
> System.out.println(team[0].name);             // Zoe — los dos arrays apuntan al mismo User
> System.out.println(team == teamCopy);         // false — los dos arrays son objetos distintos
> System.out.println(team[0] == teamCopy[0]);   // true — la posición 0 de ambos apunta al mismo User
> ```
>
> Una copia como esta, que copia el primer nivel y comparte los objetos a los que apunta ese nivel, se llama **shallow copy** (copia superficial). Una copia que además crea objetos nuevos para todo lo que hay por debajo se llama **deep copy** (copia profunda). Las listas se comportan igual que los arrays en esto: cómo copiar una lista, y qué comparte la copia con el original, se explica en [10-colecciones.md](10-colecciones.md).

---

## Qué sabes hacer después de este capítulo

Hasta el capítulo anterior podías escribir un método y decir si una llamada a él compila. No podías decir qué pasa con los valores una vez hecha la llamada. Ahora puedes seguir una llamada en memoria: en qué frame está cada variable, qué se copia en ella y a qué objeto apunta cada referencia. En la práctica, ya puedes:

- Trazar una cadena de llamadas como frames. Puedes decir qué frames hay en el stack en una línea dada, qué guarda cada uno y en qué orden se desapilan, tanto si un método devuelve un valor como si lanza una excepción. Y puedes leer un stack trace como esa misma pila, con el frame más nuevo primero.
- Predecir qué puede cambiar un método para el código que lo llama. Nunca puede cambiar una variable del código que llama, haga lo que haga con sus propios parámetros. Sí puede cambiar el contenido de un objeto o de un array que recibe, porque su parámetro guarda una copia de la referencia a ese mismo objeto. Con un `String`, o con cualquier otro objeto inmutable, no puede cambiar nada.
- Decir dónde se guarda cada cosa: los parámetros y las variables locales en el frame de su llamada, los objetos en el heap y los campos dentro del objeto al que pertenecen.
- Explicar por qué una `NullPointerException` se lanza en la línea que usa el `null` y no en la línea que lo guardó, y por qué el stack trace no puede mostrar de dónde vino el `null`.
- Explicar qué convierte a un objeto en basura, que es que ninguna referencia lleva ya hasta él, por qué nunca lo liberas tú, y por qué conservar una referencia que ya no necesitas es un memory leak.
- Reconocer el aliasing, dos referencias al mismo objeto, decidir si las dos deben compartir ese objeto y crear un segundo objeto cuando no deban.

Mira otra vez el `User` de este capítulo. Su campo `name` lo puede escribir cualquier código que tenga una referencia al objeto: `rename` lo hizo desde otro método, y `alice.name = "Alice"` lo hizo a través de un alias. Nada en la clase puede rechazar un cambio, y nada impide que se cree un `User` con `null` como nombre. Eso fue deliberado, porque te permitió estudiar las referencias de forma aislada: qué le permite hacer a un trozo de código el hecho de tener una referencia a un objeto.

[06-poo-clases.md](06-poo-clases.md) usa esas referencias para construir clases cuyo estado se mantiene válido. Allí escribirás una clase completa, con campos que solo sus propios métodos pueden cambiar y un constructor que rechaza los datos que nunca deberían entrar. Ese capítulo responde también a la pregunta que `alice == template` dejó abierta en este: `==` te dice si dos referencias apuntan al mismo objeto, y lo que significa que dos objetos distintos sean iguales se define allí.
