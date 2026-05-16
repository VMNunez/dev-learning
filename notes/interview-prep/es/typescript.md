# TypeScript — Preguntas de entrevista

## Fundamentos de TypeScript

**¿Qué es TypeScript y por qué lo usas?**

Un superconjunto de JavaScript que añade tipos estáticos. Detecta errores en tiempo de compilación en lugar de en tiempo de ejecución, hace el refactoring más seguro y mejora el autocompletado del IDE. Angular usa TypeScript por defecto — en bases de código grandes se vuelve esencial.

> **Junior tip:** If they ask "why not just use JavaScript?", say: TypeScript's main value is catching errors before they reach the browser. In a team, that matters a lot.
> **Consejo de entrevista:** Si te preguntan "¿por qué no usar JavaScript?", di: el principal valor de TypeScript es detectar errores antes de que lleguen al navegador. En un equipo, eso importa mucho.

**¿Cuál es la diferencia entre `interface` y `type` en TypeScript?**

Ambos definen la forma de un objeto. `interface` se puede extender con `extends` y admite la combinación de declaraciones (declaration merging) — es el estándar para modelos de datos. `type` es más flexible: puede definir union types, intersection types y alias para primitivos. Uso `interface` para modelos de datos y `type` para uniones y combinaciones.

> **Junior tip:** The most important practical difference is that `type` can define union types and `interface` cannot. Mention this first — it shows you understand the real trade-off.
> **Consejo de entrevista:** La diferencia práctica más importante es que `type` puede definir union types e `interface` no. Menciona esto primero — muestra que entiendes el trade-off real.

Red flag answer: "Son lo mismo, ambos definen formas de objeto" — esto ignora los union types, el declaration merging y la extensión, que son las diferencias reales.

**¿Cuándo elegirías `type` en lugar de `interface` para definir la forma de un objeto?**

Uso `type` cuando necesito una intersección (`Admin = Employee & { permissions: string[] }`) o cuando el tipo es local a un solo fichero y quiero una sintaxis más corta. Para modelos de datos compartidos prefiero `interface` porque se extiende de forma natural y las herramientas lo gestionan mejor.

Red flag answer: "Siempre uso uno u otro" — muestra que no tienes conciencia de cuándo cada uno es la elección correcta.

**¿Qué es un union type?**

Un tipo que puede ser uno de varios valores: `type Status = 'pending' | 'active' | 'inactive'`. En Angular los uso en todas partes para campos de estado, estados de filtro y tipos de rol — hacen imposible asignar un valor inválido en tiempo de compilación.

> **Junior tip:** Give a project example: "In the HR portal I typed the employee role as `'admin' | 'employee'` — if I wrote `'admine'` by accident, TypeScript caught it immediately."
> **Consejo de entrevista:** Da un ejemplo de proyecto: "En el HR portal tipé el rol del empleado como `'admin' | 'employee'` — si escribía `'admine'` por error, TypeScript lo detectaba de inmediato."

**¿Qué es un literal type?**

Un tipo que es un valor específico, no solo un tipo general: `type Direction = 'left' | 'right' | 'up' | 'down'` — solo esos strings exactos son válidos. Los literal types son los bloques fundamentales de los union types y las discriminated unions. TypeScript los usa para saber, dentro de un bloque `case 'loading':`, que el valor es definitivamente `'loading'`.

> **Junior tip:** Literal types are what make union types useful. Without literals you can only say "it is a string" — with literals you say "it is exactly this string." The distinction is what gives you compile-time safety.
> **Consejo de entrevista:** Los literal types son lo que hace útiles los union types. Sin literales solo puedes decir "es un string" — con literales dices "es exactamente este string." Esa distinción es lo que te da seguridad en tiempo de compilación.

**¿Qué es un intersection type y cuándo lo usas?**

Un intersection type combina varios tipos en uno — el valor debe satisfacer todos ellos: `type Admin = Employee & { permissions: string[] }`. Lo uso cuando quiero componer tipos de diferentes fuentes sin crear una nueva interface.

> **Junior tip:** The `&` operator means "this AND that". Contrast it with union `|` which means "this OR that" — that contrast is usually what the question is testing.
> **Consejo de entrevista:** El operador `&` significa "esto Y aquello". Contrástalo con el union `|` que significa "esto O aquello" — ese contraste es normalmente lo que evalúa la pregunta.

**¿Qué es la inferencia de tipos y cuándo la hace TypeScript automáticamente?**

TypeScript infiere tipos a partir de la asignación en variables, a partir del return en funciones y a partir del parámetro genérico en los utility types. Solo necesitas escribir tipos explícitamente cuando TypeScript no puede inferirlos: parámetros de función, arrays vacíos y tipos compuestos complejos. En la práctica, la mayoría de variables en Angular no necesitan anotaciones explícitas.

> **Junior tip:** Say "TypeScript is smart enough that I don't annotate every variable — I only annotate where it cannot figure it out on its own, like function parameters." That shows confidence and real experience.
> **Consejo de entrevista:** Di "TypeScript es lo suficientemente inteligente como para no anotar cada variable — solo anoto donde no puede deducirlo solo, como los parámetros de función." Eso transmite confianza y experiencia real.

**¿Cuál es la diferencia entre `any`, `unknown` y `never`?**

`any` desactiva la comprobación de tipos por completo — el valor puede usarse como cualquier tipo sin errores. `unknown` es la alternativa segura — debes reducir el tipo antes de usarlo. `never` representa un valor que nunca puede existir — una función que siempre lanza un error tiene tipo de retorno `never`, y aparece en los switch exhaustivos para detectar casos no gestionados. Evito `any` en código real y uso `unknown` para datos externos como respuestas de API.

> **Junior tip:** The `any` vs `unknown` distinction is what the question is really about. `any` is a TypeScript escape hatch; `unknown` keeps you safe by forcing a type check. Mention `never` in exhaustive checks to show depth.
> **Consejo de entrevista:** La distinción `any` vs `unknown` es de lo que realmente trata la pregunta. `any` es una escotilla de escape de TypeScript; `unknown` te mantiene seguro al obligarte a comprobar el tipo. Menciona `never` en los checks exhaustivos para mostrar profundidad.

**¿Qué son los modificadores de acceso en TypeScript y cuándo usas cada uno?**

`public` significa accesible desde cualquier lugar — es el valor por defecto. `private` significa accesible solo dentro de la misma clase. `protected` significa accesible en la clase y sus subclases. `readonly` significa que el valor solo se puede establecer una vez, en la declaración o en el constructor. En Angular marco los servicios inyectados como `private` porque nada fuera del componente debería llamarlos directamente, y uso `readonly` para valores que no deben cambiar tras la inicialización.

> **Junior tip:** In practice you use `private` the most in Angular services. Say "I mark injected services as `private` so that only the class itself can use them — it is the same idea as encapsulation in OOP."
> **Consejo de entrevista:** En la práctica usas `private` con más frecuencia en los servicios de Angular. Di "marco los servicios inyectados como `private` para que solo la propia clase pueda usarlos — es la misma idea que la encapsulación en OOP."

---

## Aserciones de tipo y operadores

**¿Qué es una type assertion y cuándo es seguro usarla?**

`value as Type` le dice a TypeScript que trate un valor como un tipo específico, anulando su inferencia. Es seguro usarla cuando sabes más que el compilador — por ejemplo, `event.target as HTMLInputElement` tras un evento del DOM. Evítala para silenciar errores que no entiendes — desactiva la seguridad de tipos por completo.

> **Junior tip:** The `event.target as HTMLInputElement` example is what every Angular developer does. Explain why it is safe: "The DOM types `event.target` as `EventTarget` because the event could come from any element — I know from context it is always an input."
> **Consejo de entrevista:** El `event.target as HTMLInputElement` es lo que hace todo desarrollador Angular. Explica por qué es seguro: "El DOM tipa `event.target` como `EventTarget` porque el evento podría venir de cualquier elemento — yo sé por contexto que siempre es un input."

Red flag answer: "Uso `as` cuando TypeScript se queja" — muestra que lo usas para silenciar errores en lugar de para expresar lo que realmente sabes sobre los datos.

**¿Qué es `as const` y cuándo es útil?**

`as const` le dice a TypeScript que infiera el tipo más estrecho posible — literales en lugar de tipos generales. Sin él, `const config = { mode: 'edit' }` da `{ mode: string }`. Con `as const`, da `{ readonly mode: 'edit' }`. Lo uso para objetos de configuración y definiciones de rutas donde los valores no deben cambiar y quiero que TypeScript aplique el valor literal exacto.

> **Junior tip:** The key effect is converting `string` into a specific literal like `'edit'`. This matters when the value is used as a discriminant in a union type — TypeScript needs the exact literal to narrow correctly.
> **Consejo de entrevista:** El efecto clave es convertir `string` en un literal específico como `'edit'`. Esto importa cuando el valor se usa como discriminante en un union type — TypeScript necesita el literal exacto para hacer el narrowing correctamente.

**¿Qué es el optional chaining (`?.`) y cuándo es útil?**

Permite acceder de forma segura a una propiedad que podría ser `null` o `undefined` sin lanzar un error — `user?.address?.city` devuelve `undefined` si alguna parte es null. Lo uso constantemente con datos de API que pueden tener campos vacíos y con getters de formularios de Angular que devuelven `AbstractControl | null`.

> **Junior tip:** Combine it with `??` in the same answer: `user?.name ?? 'Unknown'`. It shows you know how the two operators work together, which is the common real-world pattern.
> **Consejo de entrevista:** Combínalo con `??` en la misma respuesta: `user?.name ?? 'Unknown'`. Muestra que sabes cómo funcionan juntos los dos operadores, que es el patrón habitual en el mundo real.

**¿Qué es el operador nullish coalescing (`??`)?**

Devuelve el lado derecho solo si el lado izquierdo es `null` o `undefined`. Es diferente de `||`, que también se activa con `0`, `false` o `''`. Lo uso en el servicio de autenticación del HR portal: `JSON.parse(localStorage.getItem('user') ?? 'null')` — si no hay nada guardado, parsea el string `'null'` para obtener `null`.

> **Junior tip:** The `??` vs `||` distinction is what the question tests. Say: "`||` replaces all falsy values; `??` only replaces `null` and `undefined`. That means `??` keeps `0`, `false`, and empty string — which is what you want when those are valid values."
> **Consejo de entrevista:** La distinción `??` vs `||` es lo que evalúa la pregunta. Di: "`||` reemplaza todos los valores falsy; `??` solo reemplaza `null` y `undefined`. Eso significa que `??` conserva `0`, `false` y la cadena vacía — que es lo que quieres cuando esos son valores válidos."

**¿Qué es el operador de non-null assertion (`!`) y cuándo deberías evitarlo?**

`value!` le dice a TypeScript que el valor definitivamente no es `null` ni `undefined`. El único uso legítimo que conozco es `@ViewChild(MatSort) sort!: MatSort` — Angular lo establece antes de que lo use, pero TypeScript no puede verificarlo. En cualquier otro lugar prefiero el optional chaining `?.` o una comprobación de null adecuada — si la suposición es incorrecta, `!` da un error en runtime sin ninguna advertencia de TypeScript.

> **Junior tip:** Name the one safe use first, then explain why you avoid it everywhere else. That order shows you understand when it is justified — not just that you know what the operator does.
> **Consejo de entrevista:** Nombra primero el único uso seguro, luego explica por qué lo evitas en el resto de casos. Ese orden demuestra que entiendes cuándo está justificado, no solo qué hace el operador.

Red flag answer: "Uso `!` cuando TypeScript sigue quejándose de null" — este es exactamente el uso incorrecto. Silencia TypeScript pero no soluciona el problema y causará un crash en runtime si la suposición es incorrecta.

---

## Utility types

**¿Qué es `Omit<T, K>` y cuándo lo usas?**

Un utility type que crea un nuevo tipo a partir de uno existente, eliminando campos específicos. Lo uso en el HR portal para tipar el payload de "crear empleado" — `Omit<Employee, 'id'>` me da todos los campos excepto el ID, que genera el servidor. Puedes omitir varios campos con una unión: `Omit<Employee, 'id' | 'createdAt'>`.

> **Junior tip:** Always explain why you omit `id`: "The server generates the ID — the client never sends it when creating a new record." This shows you understand the REST pattern, not just the TypeScript syntax.
> **Consejo de entrevista:** Explica siempre por qué omites `id`: "El servidor genera el ID — el cliente nunca lo envía al crear un nuevo registro." Esto demuestra que entiendes el patrón REST, no solo la sintaxis de TypeScript.

**¿Qué hace `Partial<T>` y cuándo lo usas?**

`Partial<T>` hace que todos los campos de un tipo sean opcionales. Lo uso cuando solo necesito actualizar parte de un objeto — un formulario de edición que solo cambia algunos campos. Encaja de forma natural con `patchValue()` en los formularios reactivos de Angular: el método acepta `Partial<FormValue>` para que solo tengas que proporcionar los campos que quieres actualizar, no el objeto completo.

> **Junior tip:** Connect it to `patchValue()` — every Angular developer who has built an edit form knows this pattern. It shows you understand the TypeScript behind the Angular API.
> **Consejo de entrevista:** Conéctalo con `patchValue()` — todo desarrollador Angular que haya construido un formulario de edición conoce este patrón. Muestra que entiendes el TypeScript detrás de la API de Angular.

**¿Qué hace `Pick<T, K>`?**

`Pick<T, K>` crea un nuevo tipo con solo los campos que especificas — lo contrario de `Omit`. `Pick<Employee, 'id' | 'name'>` da un tipo con solo esos dos campos. Lo uso cuando un componente solo necesita un subconjunto de un modelo más grande — hace el contrato explícito y evita pasar datos que el receptor no debería ver.

> **Junior tip:** Contrast it with `Omit` in your answer: "If there are only a few fields to keep, use `Pick` and name them. If there are only a few fields to remove, use `Omit`." That rule of thumb shows practical judgment.
> **Consejo de entrevista:** Contrástalo con `Omit` en tu respuesta: "Si hay solo algunos campos que mantener, usa `Pick` y nómbralos. Si hay solo algunos que eliminar, usa `Omit`." Esa regla práctica muestra criterio.

**¿Cuándo usarías `Pick` en lugar de `Omit` para crear un tipo derivado?**

Uso `Pick` cuando solo necesito un número pequeño de campos específicos de un modelo grande — es más explícito en cuanto a la intención. Uso `Omit` cuando quiero casi todos los campos y solo necesito eliminar unos pocos. La pregunta es: ¿es más corto nombrar lo que quiero conservar, o lo que quiero eliminar?

Red flag answer: "Siempre creo una nueva interface manualmente" — muestra que no estás usando las herramientas de composición de TypeScript y acabarás con definiciones de tipos duplicadas que pueden desincronizarse.

**¿Qué es `Record<K, V>` y cuándo es útil?**

`Record<K, V>` crea un tipo de objeto donde todas las claves son de tipo `K` y todos los valores son de tipo `V`. Lo uso para tablas de búsqueda — por ejemplo, `Record<string, Employee>` para indexar empleados por su ID. Es más explícito que escribir `{ [key: string]: Employee }` y comunica la intención con claridad.

> **Junior tip:** Think of it as "a typed dictionary". Say: "I use it when I need a map from one type to another — all keys the same type, all values the same type." That is enough for a junior screening.
> **Consejo de entrevista:** Piénsalo como "un diccionario tipado". Di: "Lo uso cuando necesito un mapa de un tipo a otro — todas las claves del mismo tipo, todos los valores del mismo tipo." Con eso es suficiente para una primera entrevista de junior.

---

## Genéricos

**¿Qué es un generic y por qué es útil?**

Un generic es un parámetro de tipo que permite escribir código reutilizable que funciona con diferentes tipos y sigue siendo type-safe. `function getFirst<T>(items: T[]): T` funciona con cualquier array y siempre devuelve el tipo correcto — no hace falta escribir una versión separada para strings, números y objetos. En Angular, `HttpClient.get<Employee[]>('/api/employees')` es un generic — el parámetro de tipo le dice a TypeScript cuál será la forma de la respuesta.

> **Junior tip:** Use the `HttpClient.get<Employee[]>()` example — it is concrete, it is Angular, and every interviewer who knows the framework will immediately see the connection.
> **Consejo de entrevista:** Usa el ejemplo de `HttpClient.get<Employee[]>()` — es concreto, es Angular, y todo entrevistador que conozca el framework verá de inmediato la conexión.

**¿Qué es una generic constraint (`extends`) y cuándo es útil?**

Una generic constraint limita qué tipos están permitidos como parámetro de tipo. `function findById<T extends { id: number }>(items: T[], id: number)` significa "T puede ser cualquier tipo, siempre que tenga un campo `id` de tipo number". Esto evita llamar a la función con un array de números simples — solo son válidos los objetos con un `id`. Uso constraints cuando una función genérica necesita acceder a una propiedad específica para hacer su trabajo.

> **Junior tip:** Say "the constraint is what the function needs to be able to do its job — if it needs to read `.id`, the constraint says `T must have an id`." That makes the concept concrete and easy to follow.
> **Consejo de entrevista:** Di "la constraint es lo que la función necesita para poder hacer su trabajo — si necesita leer `.id`, la constraint dice `T debe tener un id`." Eso hace el concepto concreto y fácil de entender.

---

## Enums y union types

**¿Qué es un enum y cuándo lo usas en lugar de un union type?**

Un enum es un conjunto de constantes con nombre — `enum Role { Admin = 'admin', Employee = 'employee' }`. Lo uso cuando los valores se comparten entre muchos ficheros y necesitan iterarse — `Object.values(Role)` da todas las opciones para un `<mat-select>`. Para casos locales simples uso un union type — `type Status = 'active' | 'inactive'` — es más corto y no genera JavaScript extra. La regla: union type para casos locales simples, enum para constantes compartidas y reutilizadas.

> **Junior tip:** The iteration point is what separates enum from union type in practice. Say "I use `Object.values(MyEnum)` to build the options list in a mat-select — that is something a union type cannot do without defining a separate array."
> **Consejo de entrevista:** El punto de la iteración es lo que separa el enum del union type en la práctica. Di "uso `Object.values(MyEnum)` para construir la lista de opciones de un mat-select — eso es algo que un union type no puede hacer sin definir un array separado."

---

## Type narrowing

**¿Qué es el type narrowing y por qué TypeScript lo necesita?**

Cuando una variable tiene un union type, TypeScript no sabe en tiempo de ejecución cuál es el tipo específico. El narrowing es usar una comprobación para reducir el tipo — `if (typeof value === 'string')` le dice a TypeScript que dentro de ese bloque, `value` es definitivamente un string. Uso `typeof` para primitivos, `instanceof` para instancias de clase e `in` para distinguir entre formas de objetos.

> **Junior tip:** The key insight is: "TypeScript cannot know at compile time which branch of a union you are in — a runtime check is how you tell it." Lead with `typeof`, then mention `in` and discriminated unions to show depth.
> **Consejo de entrevista:** La clave es: "TypeScript no puede saber en tiempo de compilación en qué rama de un union estás — una comprobación en runtime es cómo se lo dices." Empieza con `typeof`, luego menciona `in` y las discriminated unions para mostrar profundidad.

**¿Qué es una discriminated union y por qué es útil para los estados asíncronos?**

Una discriminated union es un patrón en el que cada tipo de una unión tiene una propiedad compartida con un valor literal único. `type State = { status: 'loading' } | { status: 'success'; data: Employee[] } | { status: 'error'; message: string }`. TypeScript usa el campo `status` para hacer el narrowing automáticamente — dentro de `case 'success':`, sabe que `data` existe. Uso este patrón en Angular para los estados de carga/éxito/error en lugar de flags booleanos separados.

> **Junior tip:** Say why it beats boolean flags: "With separate `isLoading` and `hasError` flags, you can end up with both being `true` at the same time — an impossible state. A discriminated union makes that structurally impossible."
> **Consejo de entrevista:** Di por qué supera a los flags booleanos: "Con flags `isLoading` y `hasError` separados, puedes acabar con ambos siendo `true` al mismo tiempo — un estado imposible. Una discriminated union lo hace estructuralmente imposible."

**¿Qué es un custom type guard y cuándo lo usas?**

Un custom type guard es una función con tipo de retorno `value is Type` — si devuelve `true`, TypeScript hace el narrowing del tipo automáticamente. `function isEmployee(user: Employee | Admin): user is Employee { return 'department' in user; }`. Lo uso cuando la lógica de narrowing es lo suficientemente compleja como para merecer una función con nombre, o cuando necesito validar datos de una fuente externa como una respuesta de API.

> **Junior tip:** The key syntax is `value is Type` as the return type — without it, TypeScript treats the function as a normal boolean and does not narrow. Mention the `user is Employee` syntax specifically.
> **Consejo de entrevista:** La sintaxis clave es `value is Type` como tipo de retorno — sin ella, TypeScript trata la función como un booleano normal y no hace el narrowing. Menciona específicamente la sintaxis `user is Employee`.

**¿Por qué usarías una discriminated union en lugar de flags booleanos para el estado asíncrono?**

Con flags booleanos separados como `isLoading: boolean` e `hasError: boolean`, puedes acabar en estados imposibles — que ambos sean `true` al mismo tiempo no tiene sentido. Una discriminated union con `status: 'loading' | 'success' | 'error'` hace que los estados imposibles sean estructuralmente imposibles, y TypeScript hace el narrowing automáticamente para que solo accedas a `data` cuando el status es `'success'`.

Red flag answer: "Uso flags booleanos porque son más simples" — muestra que aún no has experimentado el bug de estado imposible. La simplicidad que permite estados imposibles no es realmente simple de depurar cuando falla en producción.

---

## TypeScript en Angular

**¿Qué es el constructor shorthand en TypeScript y cómo se relaciona con Angular?**

Declarar un parámetro con un modificador de acceso (`private`, `public`, `readonly`) en el constructor crea y asigna automáticamente una propiedad de clase. `constructor(private http: HttpClient)` es equivalente a declarar `private http: HttpClient` y escribir `this.http = http` en el cuerpo. En Angular este era el patrón estándar para la inyección de dependencias. El Angular moderno (v14+) también admite `inject()` como alternativa, que elimina el constructor por completo.

> **Junior tip:** Mention both: "The constructor shorthand is the classic pattern — you will see it in older codebases. `inject()` is the modern way and removes the constructor completely." This shows you know the evolution of Angular DI.
> **Consejo de entrevista:** Menciona ambos: "El constructor shorthand es el patrón clásico — lo verás en codebases antiguas. `inject()` es la forma moderna y elimina el constructor por completo." Muestra que conoces la evolución del DI de Angular.

---

## Preguntas de presión

**Un compañero dice "Yo uso `any` para las respuestas de la API — TypeScript complica las cosas y enviamos más rápido." ¿Cómo respondes?**

Entiendo la frustración — tipar estrictamente una respuesta de API desconocida puede ralentizarte al principio. Pero `any` elimina toda la seguridad de tipos para ese valor en todos los sitios por donde fluye el código. La alternativa segura es `unknown`, que te obliga a validar la forma una sola vez antes de usarla. Después de esa comprobación, TypeScript conoce el tipo y te ayuda en todos los demás sitios. Le mostraría el patrón: `const data = response as unknown; if (isEmployee(data)) { ... }` — un poco más de trabajo al principio, pero previene toda una categoría de bugs en runtime.

Red flag answer: "Tienen razón — a veces `any` está bien para ir más rápido" — muestra que no entiendes cómo se propaga `any`. Un `any` se convierte en diez `any`s y entonces no tienes seguridad de tipos en ningún sitio por donde fluye.

**Tu code review muestra cinco sitios donde has escrito `value as any`. ¿Cómo lo justificas?**

No puedo justificarlo. `as any` es un code smell — significa que silencié el type checker en lugar de solucionar el desajuste de tipos subyacente. La corrección correcta es bien definir el tipo adecuado, usar `unknown` y reducirlo, o usar una doble aserción a través de `unknown` cuando los tipos son genuinamente incompatibles. Corregiría cada caso antes de que se mergee el PR.

Red flag answer: "TypeScript era demasiado estricto en esos casos" — esto es exactamente lo que dice un junior que no entiende TypeScript. `as any` no soluciona el problema; lo esconde hasta el runtime.
