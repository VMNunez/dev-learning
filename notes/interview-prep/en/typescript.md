# TypeScript — Interview Questions

## TypeScript basics

**What is TypeScript and why do you use it?**
A superset of JavaScript that adds static types. It catches errors at compile time instead of at runtime, makes refactoring safer, and gives you better IDE autocompletion. Angular uses TypeScript by default — in large codebases it becomes essential.

**What is the difference between `interface` and `type` in TypeScript?**
Both define the shape of an object. `interface` can be extended and merged — good for models. `type` is more flexible and can define union types like `type Status = 'active' | 'inactive'`. I use `interface` for data models and `type` for unions and combinations.

**What is `Omit<T, 'field'>` and when do you use it?**
A utility type that creates a new type from an existing one, removing specific fields. I use it in the HR portal to type the "create employee" payload — `Omit<Employee, 'id'>` gives me all fields except the ID, which the server generates.

**What is optional chaining (`?.`) and when is it useful?**
It lets you safely access a property that might be `null` or `undefined` without throwing an error — `user?.address?.city` returns `undefined` if any part is null. I use it when working with API data that may have missing fields.

**What is the nullish coalescing operator (`??`)?**
Returns the right side only if the left side is `null` or `undefined`. Different from `||`, which also triggers on `0` or `''`. I use it in the HR portal auth service: `JSON.parse(localStorage.getItem('user') ?? 'null')` — if nothing is saved, parse the string `'null'` to get `null`.

**What is a union type?**
A type that can be one of several values: `type Status = 'pending' | 'active' | 'inactive'`. In Angular I use them everywhere for status fields, filter states, and role types — they make it impossible to assign an invalid value.

**What is a type assertion and when is it safe to use?**
`value as Type` tells TypeScript to treat a value as a specific type, overriding its inference. It is safe when you know more than the compiler does — for example, casting `event.target as HTMLInputElement` after a click event. Avoid it to silence errors you do not understand — it bypasses type safety completely.

**What is a generic and why is it useful?**
A generic is a type parameter that lets you write reusable code that works with different types while still being type-safe. `function getFirst<T>(items: T[]): T` works with any array and always returns the correct type — no need to write a separate version for strings, numbers, and objects. In Angular, `HttpClient.get<Employee[]>()` is a generic — the type parameter tells TypeScript what the response shape will be.

**What is the difference between `any`, `unknown`, and `never`?**
`any` disables type checking completely — the value can be used as any type with no errors. `unknown` is the safe alternative — you must narrow the type before using it. `never` represents a value that can never exist — a function that always throws has return type `never`. I avoid `any` in real code because it removes all the benefits of TypeScript. I use `unknown` for external data like `JSON.parse` results and narrow it before using.

**What is an enum and when do you use it instead of a union type?**
An enum is a set of named constants — `enum Role { Admin = 'admin', Employee = 'employee' }`. I use it when the values are shared across many files and need to be iterated — `Object.values(Role)` gives all options for a `<mat-select>`. For simple local cases I use a union type — `type Status = 'active' | 'inactive'` — it is shorter and does not generate extra JavaScript. The rule: union type for local simple cases, enum for shared reused constants.

**What is type narrowing and why does TypeScript need it?**
When a variable has a union type, TypeScript does not know at runtime which specific type it is. Narrowing is using a check to reduce the type — `if (typeof value === 'string')` tells TypeScript that inside that block, `value` is definitely a string. I use `typeof` for primitives, `instanceof` for class instances, and `in` to distinguish between object shapes. The discriminated union pattern — a shared `status` field with literal values — is the cleanest approach for loading/success/error states in Angular.

**What is the non-null assertion operator (`!`) and when should you avoid it?**
`value!` tells TypeScript the value is definitely not `null` or `undefined`. I use it with `@ViewChild` — `@ViewChild(MatSort) sort!: MatSort` — because Angular sets it before I use it but TypeScript cannot verify that. I avoid it everywhere else and prefer optional chaining `?.` or a proper null check — if the assumption is wrong, `!` gives a runtime error with no warning from TypeScript.

**What is the constructor shorthand in TypeScript and how does it relate to Angular?**
Declaring a parameter with an access modifier (`private`, `public`, `readonly`) in the constructor automatically creates and assigns a class property. `constructor(private http: HttpClient)` is equivalent to declaring `private http: HttpClient` and writing `this.http = http` in the body. In Angular this is the standard pattern for dependency injection. Modern Angular also supports `inject()` as an alternative, which removes the constructor entirely.
