# TypeScript — Preguntas de entrevista

## Fundamentos de TypeScript

**¿Qué es TypeScript y por qué lo usas?**
Un superconjunto de JavaScript que añade tipos estáticos. Detecta errores en tiempo de compilación en lugar de en tiempo de ejecución, hace el refactoring más seguro y mejora el autocompletado del IDE. Angular usa TypeScript por defecto — en bases de código grandes se vuelve esencial.

**¿Cuál es la diferencia entre `interface` y `type` en TypeScript?**
Ambos definen la forma de un objeto. `interface` se puede extender y combinar — es bueno para modelos. `type` es más flexible y puede definir union types como `type Status = 'active' | 'inactive'`. Uso `interface` para modelos de datos y `type` para uniones y combinaciones.

**¿Qué es `Omit<T, 'field'>` y cuándo lo usas?**
Un utility type que crea un nuevo tipo a partir de uno existente, eliminando campos específicos. Lo uso en el HR portal para tipar el payload de "crear empleado" — `Omit<Employee, 'id'>` me da todos los campos excepto el ID, que genera el servidor.

**¿Qué es el optional chaining (`?.`) y cuándo es útil?**
Permite acceder de forma segura a una propiedad que podría ser `null` o `undefined` sin lanzar un error — `user?.address?.city` devuelve `undefined` si alguna parte es null. Lo uso cuando trabajo con datos de API que pueden tener campos vacíos.

**¿Qué es el operador nullish coalescing (`??`)?**
Devuelve el lado derecho solo si el lado izquierdo es `null` o `undefined`. Es diferente de `||`, que también se activa con `0` o `''`. Lo uso en el servicio de autenticación del HR portal: `JSON.parse(localStorage.getItem('user') ?? 'null')` — si no hay nada guardado, parsea el string `'null'` para obtener `null`.

**¿Qué es un union type?**
Un tipo que puede ser uno de varios valores: `type Status = 'pending' | 'active' | 'inactive'`. En Angular los uso en todas partes para campos de estado, estados de filtro y tipos de rol — hacen imposible asignar un valor inválido.

**¿Qué es una type assertion y cuándo es seguro usarla?**
`value as Type` le dice a TypeScript que trate un valor como un tipo específico, anulando su inferencia. Es seguro usarla cuando sabes más que el compilador — por ejemplo, haciendo cast de `event.target as HTMLInputElement` tras un evento de click. Evítala para silenciar errores que no entiendes — desactiva la seguridad de tipos por completo.

**¿Qué es un generic y por qué es útil?**
Un generic es un parámetro de tipo que permite escribir código reutilizable que funciona con diferentes tipos y sigue siendo type-safe. `function getFirst<T>(items: T[]): T` funciona con cualquier array y siempre devuelve el tipo correcto — no hace falta escribir una versión separada para strings, números y objetos. En Angular, `HttpClient.get<Employee[]>()` es un generic — el parámetro de tipo le dice a TypeScript cuál será la forma de la respuesta.

**¿Cuál es la diferencia entre `any`, `unknown` y `never`?**
`any` desactiva la comprobación de tipos por completo — el valor puede usarse como cualquier tipo sin errores. `unknown` es la alternativa segura — debes reducir el tipo antes de usarlo. `never` representa un valor que nunca puede existir — una función que siempre lanza un error tiene tipo de retorno `never`. Evito `any` en código real porque elimina todos los beneficios de TypeScript. Uso `unknown` para datos externos como resultados de `JSON.parse` y los reduzco antes de usarlos.

**¿Qué es un enum y cuándo lo usas en lugar de un union type?**
Un enum es un conjunto de constantes con nombre — `enum Role { Admin = 'admin', Employee = 'employee' }`. Lo uso cuando los valores se comparten entre muchos archivos y necesitan iterarse — `Object.values(Role)` da todas las opciones para un `<mat-select>`. Para casos locales simples uso un union type — `type Status = 'active' | 'inactive'` — es más corto y no genera JavaScript extra. La regla: union type para casos locales simples, enum para constantes compartidas y reutilizadas.

**¿Qué es el type narrowing y por qué TypeScript lo necesita?**
Cuando una variable tiene un union type, TypeScript no sabe en tiempo de ejecución cuál es el tipo específico. El narrowing es usar una comprobación para reducir el tipo — `if (typeof value === 'string')` le dice a TypeScript que dentro de ese bloque, `value` es definitivamente un string. Uso `typeof` para primitivos, `instanceof` para instancias de clase e `in` para distinguir entre formas de objetos. El patrón de discriminated union — un campo `status` compartido con valores literales — es el enfoque más limpio para gestionar estados de carga/éxito/error en Angular.

**¿Qué es el operador de non-null assertion (`!`) y cuándo deberías evitarlo?**
`value!` le dice a TypeScript que el valor definitivamente no es `null` ni `undefined`. Lo uso con `@ViewChild` — `@ViewChild(MatSort) sort!: MatSort` — porque Angular lo establece antes de que lo use pero TypeScript no puede verificarlo. Lo evito en cualquier otro lugar y prefiero el optional chaining `?.` o una comprobación de null adecuada — si la suposición es incorrecta, `!` da un error en runtime sin ninguna advertencia de TypeScript.

**¿Qué es el constructor shorthand en TypeScript y cómo se relaciona con Angular?**
Declarar un parámetro con un modificador de acceso (`private`, `public`, `readonly`) en el constructor crea y asigna automáticamente una propiedad de clase. `constructor(private http: HttpClient)` es equivalente a declarar `private http: HttpClient` y escribir `this.http = http` en el cuerpo. En Angular este es el patrón estándar para la inyección de dependencias. El Angular moderno también admite `inject()` como alternativa, que elimina completamente el constructor.
