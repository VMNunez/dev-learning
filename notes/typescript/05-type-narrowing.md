# Type Narrowing

## What is narrowing?

When you have a union type, TypeScript does not know which specific type the value is at runtime. Narrowing is the process of using a check to reduce (narrow) the type to something more specific — TypeScript then knows what methods and properties are available.

```ts
function process(value: string | number) {
  // here TypeScript only knows value is string | number
  value.toUpperCase();  // ❌ error — number does not have toUpperCase

  if (typeof value === 'string') {
    value.toUpperCase();  // ✅ TypeScript knows value is string here
  }
}
```

---

## typeof narrowing

Works for primitive types:

```ts
function format(value: string | number | boolean) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return String(value);  // boolean case
}
```

`typeof` returns: `'string'`, `'number'`, `'boolean'`, `'undefined'`, `'object'`, `'function'`, `'symbol'`, `'bigint'`.

Note: `typeof null === 'object'` — always check `=== null` separately before using `typeof` on a value that could be null.

---

## instanceof narrowing

Works for class instances:

```ts
class ValidationError extends Error {
  field: string;
  constructor(message: string, field: string) {
    super(message);
    this.field = field;
  }
}

function handleError(error: unknown) {
  if (error instanceof ValidationError) {
    console.log(error.field);    // ✅ TypeScript knows it's a ValidationError
  } else if (error instanceof Error) {
    console.log(error.message);  // ✅ TypeScript knows it's an Error
  }
}
```

---

## in narrowing

Checks if a property exists on an object — useful for distinguishing between object shapes:

```ts
interface Employee { name: string; department: string; }
interface Admin    { name: string; permissions: string[]; }

function display(user: Employee | Admin) {
  if ('permissions' in user) {
    console.log(user.permissions);  // ✅ TypeScript knows it's Admin
  } else {
    console.log(user.department);   // ✅ TypeScript knows it's Employee
  }
}
```

---

## Truthiness narrowing

A simple null/undefined check narrows the type:

```ts
function greet(name: string | null) {
  if (name) {
    console.log(name.toUpperCase());  // ✅ name is string here — null was excluded
  }
}

// With optional chaining — shorter but same concept
function greet(name?: string) {
  console.log(name?.toUpperCase());  // returns undefined if name is undefined
}
```

---

## Discriminated unions

A pattern where every type in a union has a shared property with a unique literal value — TypeScript uses it to narrow automatically:

```ts
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: Employee[] };
type ErrorState   = { status: 'error'; message: string };

type State = LoadingState | SuccessState | ErrorState;

function render(state: State) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data;   // ✅ TypeScript knows state is SuccessState
    case 'error':
      return state.message; // ✅ TypeScript knows state is ErrorState
  }
}
```

The `status` property is the **discriminant** — its literal value tells TypeScript which type in the union this is. This pattern is used in Angular for managing async states (loading / success / error).

---

## Custom type guards

A function that returns a boolean and tells TypeScript what the type is if it returns `true`:

```ts
function isEmployee(user: Employee | Admin): user is Employee {
  return 'department' in user;
}

function display(user: Employee | Admin) {
  if (isEmployee(user)) {
    console.log(user.department);  // ✅ TypeScript knows it's Employee
  }
}
```

The return type `user is Employee` is the **type predicate**. It tells TypeScript: "if this function returns true, narrow the type of `user` to `Employee`".

---

## Exhaustiveness check with never

In a `switch` with a discriminated union, you can use `never` to ensure all cases are handled — TypeScript will error if you add a new variant and forget to handle it:

```ts
function render(state: State) {
  switch (state.status) {
    case 'loading': return '...';
    case 'success': return state.data;
    case 'error':   return state.message;
    default:
      const _exhaustive: never = state;  // ❌ error if State has an unhandled case
      return _exhaustive;
  }
}
```
