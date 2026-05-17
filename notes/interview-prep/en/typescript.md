# TypeScript — Interview Questions

## TypeScript fundamentals

**What is TypeScript and why do you use it?**

A superset of JavaScript that adds static types. It catches errors at compile time instead of at runtime, makes refactoring safer, and gives you better IDE autocompletion. Angular uses TypeScript by default — in large codebases it becomes essential.

> **Junior tip:** If they ask "why not just use JavaScript?", say: TypeScript's main value is catching errors before they reach the browser. In a team, that matters a lot.
> **Consejo de entrevista:** Si te preguntan "¿por qué no usar JavaScript?", di: el principal valor de TypeScript es detectar errores antes de que lleguen al navegador. En un equipo, eso importa mucho.

**What is the difference between `interface` and `type` in TypeScript?**

Both define the shape of an object. `interface` can be extended with `extends` and supports declaration merging — it is the standard for data models. `type` is more flexible: it can define union types, intersection types, and aliases for primitives. I use `interface` for data models and `type` for unions and combinations.

> **Junior tip:** The most important practical difference is that `type` can define union types and `interface` cannot. Mention this first — it shows you understand the real trade-off.
> **Consejo de entrevista:** La diferencia práctica más importante es que `type` puede definir union types e `interface` no. Menciona esto primero — muestra que entiendes el trade-off real.

Red flag answer: "They are the same thing, both define object shapes" — this ignores union types, declaration merging, and extension, which are the real differences.

**When would you choose `type` over `interface` for an object shape?**

I use `type` when I need an intersection (`Admin = Employee & { permissions: string[] }`) or when the type is local to one file and I want shorter syntax. For shared data models I prefer `interface` because it extends naturally and tooling handles it better.

Red flag answer: "I always use one or the other" — shows no awareness of when each is the right choice.

**What is a union type?**

A type that can be one of several values: `type Status = 'pending' | 'active' | 'inactive'`. In Angular I use them everywhere for status fields, filter states, and role types — they make it impossible to assign an invalid value at compile time.

> **Junior tip:** Give a project example: "In the HR portal I typed the employee role as `'admin' | 'employee'` — if I wrote `'admine'` by accident, TypeScript caught it immediately."
> **Consejo de entrevista:** Da un ejemplo de proyecto: "En el HR portal tipé el rol del empleado como `'admin' | 'employee'` — si escribía `'admine'` por error, TypeScript lo detectaba de inmediato."

**What is a literal type?**

A type that is one specific value, not just a general type: `type Direction = 'left' | 'right' | 'up' | 'down'` — only those exact strings are valid. Literal types are the building blocks of union types and discriminated unions. TypeScript uses them to know, inside a `case 'loading':` block, that the value is definitely `'loading'`.

> **Junior tip:** Literal types are what make union types useful. Without literals you can only say "it is a string" — with literals you say "it is exactly this string." The distinction is what gives you compile-time safety.
> **Consejo de entrevista:** Los literal types son lo que hace útiles los union types. Sin literales solo puedes decir "es un string" — con literales dices "es exactamente este string." Esa distinción es lo que te da seguridad en tiempo de compilación.

**What is an intersection type and when do you use it?**

An intersection type combines multiple types into one — the value must satisfy all of them: `type Admin = Employee & { permissions: string[] }`. I use it when I want to compose types from different sources without creating a new interface.

> **Junior tip:** The `&` operator means "this AND that". Contrast it with union `|` which means "this OR that" — that contrast is usually what the question is testing.
> **Consejo de entrevista:** El operador `&` significa "esto Y aquello". Contrástalo con el union `|` que significa "esto O aquello" — ese contraste es normalmente lo que evalúa la pregunta.

**What is type inference and when does TypeScript do it automatically?**

TypeScript infers types from assignment for variables, from the return statement for functions, and from generic parameters for utility types. You only need to write types explicitly when TypeScript cannot infer them: function parameters, empty arrays, and complex composed types. In practice, most variables in Angular do not need explicit annotations.

> **Junior tip:** Say "TypeScript is smart enough that I don't annotate every variable — I only annotate where it cannot figure it out on its own, like function parameters." That shows confidence and real experience.
> **Consejo de entrevista:** Di "TypeScript es lo suficientemente inteligente como para no anotar cada variable — solo anoto donde no puede deducirlo solo, como los parámetros de función." Eso transmite confianza y experiencia real.

**What is the difference between `any`, `unknown`, and `never`?**

`any` disables type checking completely — the value can be used as any type with no errors. `unknown` is the safe alternative — you must narrow the type before using it. `never` represents a value that can never exist — a function that always throws has return type `never`, and it appears in exhaustive switch checks to catch unhandled cases. I avoid `any` in real code and use `unknown` for external data like API responses.

> **Junior tip:** The `any` vs `unknown` distinction is what the question is really about. `any` is a TypeScript escape hatch; `unknown` keeps you safe by forcing a type check. Mention `never` in exhaustive checks to show depth.
> **Consejo de entrevista:** La distinción `any` vs `unknown` es de lo que realmente trata la pregunta. `any` es una escotilla de escape de TypeScript; `unknown` te mantiene seguro al obligarte a comprobar el tipo. Menciona `never` en los checks exhaustivos para mostrar profundidad.

**What are access modifiers in TypeScript and when do you use each one?**

`public` means accessible from anywhere — it is the default. `private` means only accessible inside the same class. `protected` means accessible in the class and its subclasses. `readonly` means the value can only be set once, at declaration or in the constructor. In Angular I mark injected services as `private` because nothing outside the component should call them directly, and I use `readonly` for values that must not change after initialization.

> **Junior tip:** In practice you use `private` the most in Angular services. Say "I mark injected services as `private` so that only the class itself can use them — it is the same idea as encapsulation in OOP."
> **Consejo de entrevista:** En la práctica usas `private` con más frecuencia en los servicios de Angular. Di "marco los servicios inyectados como `private` para que solo la propia clase pueda usarlos — es la misma idea que la encapsulación en OOP."

---

## Type assertions and operators

**What is a type assertion and when is it safe to use?**

`value as Type` tells TypeScript to treat a value as a specific type, overriding its inference. It is safe when you know more than the compiler — for example, `event.target as HTMLInputElement` after a DOM event. Avoid it to silence errors you do not understand — it bypasses type safety completely.

> **Junior tip:** The `event.target as HTMLInputElement` example is what every Angular developer does. Explain why it is safe: "The DOM types `event.target` as `EventTarget` because the event could come from any element — I know from context it is always an input."
> **Consejo de entrevista:** El `event.target as HTMLInputElement` es lo que hace todo desarrollador Angular. Explica por qué es seguro: "El DOM tipa `event.target` como `EventTarget` porque el evento podría venir de cualquier elemento — yo sé por contexto que siempre es un input."

Red flag answer: "I use `as` whenever TypeScript is complaining" — shows you use it to silence errors rather than to express what you genuinely know about the data.

**What is `as const` and when is it useful?**

`as const` tells TypeScript to infer the narrowest possible type — literals instead of general types. Without it, `const config = { mode: 'edit' }` gives `{ mode: string }`. With `as const`, it gives `{ readonly mode: 'edit' }`. I use it for configuration objects and route definitions where the values should never change and I want TypeScript to enforce the exact literal value.

> **Junior tip:** The key effect is converting `string` into a specific literal like `'edit'`. This matters when the value is used as a discriminant in a union type — TypeScript needs the exact literal to narrow correctly.
> **Consejo de entrevista:** El efecto clave es convertir `string` en un literal específico como `'edit'`. Esto importa cuando el valor se usa como discriminante en un union type — TypeScript necesita el literal exacto para hacer el narrowing correctamente.

**What is optional chaining (`?.`) and when is it useful?**

It lets you safely access a property that might be `null` or `undefined` without throwing an error — `user?.address?.city` returns `undefined` if any part is null. I use it constantly with API data that may have missing fields and with Angular form getters that return `AbstractControl | null`.

> **Junior tip:** Combine it with `??` in the same answer: `user?.name ?? 'Unknown'`. It shows you know how the two operators work together, which is the common real-world pattern.
> **Consejo de entrevista:** Combínalo con `??` en la misma respuesta: `user?.name ?? 'Unknown'`. Muestra que sabes cómo funcionan juntos los dos operadores, que es el patrón habitual en el mundo real.

**What is the nullish coalescing operator (`??`)?**

Returns the right side only if the left side is `null` or `undefined`. Different from `||`, which also triggers on `0`, `false`, or `''`. I use it in the HR portal auth service: `JSON.parse(localStorage.getItem('user') ?? 'null')` — if nothing is saved, parse the string `'null'` to get `null`.

> **Junior tip:** The `??` vs `||` distinction is what the question tests. Say: "`||` replaces all falsy values; `??` only replaces `null` and `undefined`. That means `??` keeps `0`, `false`, and empty string — which is what you want when those are valid values."
> **Consejo de entrevista:** La distinción `??` vs `||` es lo que evalúa la pregunta. Di: "`||` reemplaza todos los valores falsy; `??` solo reemplaza `null` y `undefined`. Eso significa que `??` conserva `0`, `false` y la cadena vacía — que es lo que quieres cuando esos son valores válidos."

**What is the non-null assertion operator (`!`) and when should you avoid it?**

`value!` tells TypeScript the value is definitely not `null` or `undefined`. The one legitimate use I know is `@ViewChild(MatSort) sort!: MatSort` — Angular sets it before I use it but TypeScript cannot verify that. Everywhere else I prefer optional chaining `?.` or a proper null check — if the assumption is wrong, `!` gives a runtime error with no TypeScript warning.

> **Junior tip:** Name the one safe use first, then explain why you avoid it everywhere else. That order shows you understand when it is justified — not just that you know what the operator does.
> **Consejo de entrevista:** Nombra primero el único uso seguro, luego explica por qué lo evitas en el resto de casos. Ese orden demuestra que entiendes cuándo está justificado, no solo qué hace el operador.

Red flag answer: "I use `!` when TypeScript keeps complaining about null" — this is exactly the wrong use. It silences TypeScript but does not fix the problem and will crash at runtime if the assumption is wrong.

---

## Utility types

**What is `Omit<T, K>` and when do you use it?**

A utility type that creates a new type from an existing one, removing specific fields. I use it in the HR portal to type the "create employee" payload — `Omit<Employee, 'id'>` gives me all fields except the ID, which the server generates. You can omit multiple fields with a union: `Omit<Employee, 'id' | 'createdAt'>`.

> **Junior tip:** Always explain why you omit `id`: "The server generates the ID — the client never sends it when creating a new record." This shows you understand the REST pattern, not just the TypeScript syntax.
> **Consejo de entrevista:** Explica siempre por qué omites `id`: "El servidor genera el ID — el cliente nunca lo envía al crear un nuevo registro." Esto demuestra que entiendes el patrón REST, no solo la sintaxis de TypeScript.

**What does `Partial<T>` do and when do you use it?**

`Partial<T>` makes all fields of a type optional. I use it when updating only part of an object — an edit form that only changes some fields. It pairs naturally with `patchValue()` in Angular reactive forms: the method accepts `Partial<FormValue>` so you only provide the fields you want to update, not the entire object.

> **Junior tip:** Connect it to `patchValue()` — every Angular developer who has built an edit form knows this pattern. It shows you understand the TypeScript behind the Angular API.
> **Consejo de entrevista:** Conéctalo con `patchValue()` — todo desarrollador Angular que haya construido un formulario de edición conoce este patrón. Muestra que entiendes el TypeScript detrás de la API de Angular.

**What does `Pick<T, K>` do?**

`Pick<T, K>` creates a new type with only the fields you specify — the opposite of `Omit`. `Pick<Employee, 'id' | 'name'>` gives a type with just those two fields. I use it when a component only needs a subset of a larger model — it makes the contract explicit and prevents passing data the receiver should not see.

> **Junior tip:** Contrast it with `Omit` in your answer: "If there are only a few fields to keep, use `Pick` and name them. If there are only a few fields to remove, use `Omit`." That rule of thumb shows practical judgment.
> **Consejo de entrevista:** Contrástalo con `Omit` en tu respuesta: "Si hay solo algunos campos que mantener, usa `Pick` y nómbralos. Si hay solo algunos que eliminar, usa `Omit`." Esa regla práctica muestra criterio.

**When would you use `Pick` instead of `Omit` to create a derived type?**

I use `Pick` when I only need a small number of specific fields from a large model — it is more explicit about intent. I use `Omit` when I want almost all the fields and only need to remove a few. The question is: is it shorter to name what to keep, or name what to remove?

Red flag answer: "I always create a new interface manually" — this shows you are not using TypeScript's composition tools and will end up with duplicate type definitions that can drift out of sync.

**What is `Record<K, V>` and when is it useful?**

`Record<K, V>` creates an object type where all keys are type `K` and all values are type `V`. I use it for lookup tables — for example, `Record<string, Employee>` to index employees by their ID. It is more explicit than writing `{ [key: string]: Employee }` and communicates intent clearly.

> **Junior tip:** Think of it as "a typed dictionary". Say: "I use it when I need a map from one type to another — all keys the same type, all values the same type." That is enough for a junior screening.
> **Consejo de entrevista:** Piénsalo como "un diccionario tipado". Di: "Lo uso cuando necesito un mapa de un tipo a otro — todas las claves del mismo tipo, todos los valores del mismo tipo." Con eso es suficiente para una primera entrevista de junior.

---

## Generics

**What is a generic and why is it useful?**

A generic is a type parameter that lets you write reusable code that works with different types while still being type-safe. `function getFirst<T>(items: T[]): T` works with any array and always returns the correct type — no need to write a separate version for strings, numbers, and objects. In Angular, `HttpClient.get<Employee[]>('/api/employees')` is a generic — the type parameter tells TypeScript what shape the response will be.

> **Junior tip:** Use the `HttpClient.get<Employee[]>()` example — it is concrete, it is Angular, and every interviewer who knows the framework will immediately see the connection.
> **Consejo de entrevista:** Usa el ejemplo de `HttpClient.get<Employee[]>()` — es concreto, es Angular, y todo entrevistador que conozca el framework verá de inmediato la conexión.

**What is a generic constraint (`extends`) and when is it useful?**

A generic constraint limits what types are allowed as the type parameter. `function findById<T extends { id: number }>(items: T[], id: number)` means "T can be any type, as long as it has an `id` field of type number". This prevents calling the function with a plain number array — only objects with an `id` are valid. I use constraints when a generic function needs to access a specific property to do its job.

> **Junior tip:** Say "the constraint is what the function needs to be able to do its job — if it needs to read `.id`, the constraint says `T must have an id`." That makes the concept concrete and easy to follow.
> **Consejo de entrevista:** Di "la constraint es lo que la función necesita para poder hacer su trabajo — si necesita leer `.id`, la constraint dice `T debe tener un id`." Eso hace el concepto concreto y fácil de entender.

---

## Enums and union types

**What is an enum and when do you use it instead of a union type?**

An enum is a set of named constants — `enum Role { Admin = 'admin', Employee = 'employee' }`. I use it when the values are shared across many files and need to be iterated — `Object.values(Role)` gives all options for a `<mat-select>`. For simple local cases I use a union type — `type Status = 'active' | 'inactive'` — it is shorter and does not generate extra JavaScript. The rule: union type for local simple cases, enum for shared reused constants.

> **Junior tip:** The iteration point is what separates enum from union type in practice. Say "I use `Object.values(MyEnum)` to build the options list in a mat-select — that is something a union type cannot do without defining a separate array."
> **Consejo de entrevista:** El punto de la iteración es lo que separa el enum del union type en la práctica. Di "uso `Object.values(MyEnum)` para construir la lista de opciones de un mat-select — eso es algo que un union type no puede hacer sin definir un array separado."

---

## Type narrowing

**What is type narrowing and why does TypeScript need it?**

When a variable has a union type, TypeScript does not know at runtime which specific type it is. Narrowing is using a check to reduce the type — `if (typeof value === 'string')` tells TypeScript that inside that block, `value` is definitely a string. I use `typeof` for primitives, `instanceof` for class instances, and `in` to distinguish between object shapes.

> **Junior tip:** The key insight is: "TypeScript cannot know at compile time which branch of a union you are in — a runtime check is how you tell it." Lead with `typeof`, then mention `in` and discriminated unions to show depth.
> **Consejo de entrevista:** La clave es: "TypeScript no puede saber en tiempo de compilación en qué rama de un union estás — una comprobación en runtime es cómo se lo dices." Empieza con `typeof`, luego menciona `in` y las discriminated unions para mostrar profundidad.

**What is a discriminated union and why is it useful for async states?**

A discriminated union is a pattern where every type in a union has a shared property with a unique literal value. `type State = { status: 'loading' } | { status: 'success'; data: Employee[] } | { status: 'error'; message: string }`. TypeScript uses the `status` field to narrow automatically — inside `case 'success':`, it knows `data` exists. I use this pattern in Angular for loading/success/error states instead of separate boolean flags.

> **Junior tip:** Say why it beats boolean flags: "With separate `isLoading` and `hasError` flags, you can end up with both being `true` at the same time — an impossible state. A discriminated union makes that structurally impossible."
> **Consejo de entrevista:** Di por qué supera a los flags booleanos: "Con flags `isLoading` y `hasError` separados, puedes acabar con ambos siendo `true` al mismo tiempo — un estado imposible. Una discriminated union lo hace estructuralmente imposible."

**What is a custom type guard and when do you use one?**

A custom type guard is a function with a return type of `value is Type` — if it returns `true`, TypeScript narrows the type automatically. `function isEmployee(user: Employee | Admin): user is Employee { return 'department' in user; }`. I use them when the narrowing logic is complex enough to deserve a named function, or when I need to validate data from an external source like an API response.

> **Junior tip:** The key syntax is `value is Type` as the return type — without it, TypeScript treats the function as a normal boolean and does not narrow. Mention the `user is Employee` syntax specifically.
> **Consejo de entrevista:** La sintaxis clave es `value is Type` como tipo de retorno — sin ella, TypeScript trata la función como un booleano normal y no hace el narrowing. Menciona específicamente la sintaxis `user is Employee`.

**Why would you use a discriminated union instead of boolean flags for async state?**

With separate boolean flags like `isLoading: boolean` and `hasError: boolean`, you can end up in impossible states — both `true` at the same time makes no sense. A discriminated union with `status: 'loading' | 'success' | 'error'` makes impossible states structurally impossible, and TypeScript narrows the type automatically so you only access `data` when status is `'success'`.

Red flag answer: "I use boolean flags because they are simpler" — this shows you have not yet hit the impossible-state bug. Simplicity that allows impossible states is not actually simple to debug when it goes wrong in production.

---

## TypeScript in Angular

**What is the constructor shorthand in TypeScript and how does it relate to Angular?**

Declaring a parameter with an access modifier (`private`, `public`, `readonly`) in the constructor automatically creates and assigns a class property. `constructor(private http: HttpClient)` is equivalent to declaring `private http: HttpClient` and writing `this.http = http` in the body. In Angular this was the standard pattern for dependency injection. Modern Angular (v14+) also supports `inject()` as an alternative, which removes the constructor entirely.

> **Junior tip:** Mention both: "The constructor shorthand is the classic pattern — you will see it in older codebases. `inject()` is the modern way and removes the constructor completely." This shows you know the evolution of Angular DI.
> **Consejo de entrevista:** Menciona ambos: "El constructor shorthand es el patrón clásico — lo verás en codebases antiguas. `inject()` es la forma moderna y elimina el constructor por completo." Muestra que conoces la evolución del DI de Angular.

---

## Pressure questions

**A teammate says "I just use `any` for API responses — TypeScript gets in the way and we ship faster." How do you respond?**

I understand the frustration — strict typing on an unknown API response can slow you down at first. But `any` removes all type safety for that value everywhere it flows through the code. The safe alternative is `unknown`, which forces you to validate the shape once before using it. After that one check, TypeScript knows the type and helps you everywhere else. I would show the pattern: `const data = response as unknown; if (isEmployee(data)) { ... }` — slightly more work upfront, but it prevents entire classes of runtime bugs.

Red flag answer: "They have a point — sometimes `any` is fine to move fast" — this shows you do not understand how `any` spreads. One `any` becomes ten `any`s and then you have no type safety anywhere it flows.

**Your code review shows five places where you wrote `value as any`. How do you justify it?**

I cannot justify it. `as any` is a code smell — it means I silenced the type checker instead of fixing the underlying type mismatch. The correct fix is either to define the right type, use `unknown` and narrow it, or use a double assertion through `unknown` when the types are genuinely unrelated. I would fix each case before the PR is merged.

Red flag answer: "TypeScript was being too strict in those cases" — this is exactly what a junior who does not understand TypeScript says. `as any` does not fix the problem; it hides it until runtime.
