# Generics

## What is a generic?

A generic is a placeholder type — you write the function or interface once and it works with any type, while still being type-safe.

Without generics, you would either repeat the same function for every type, or use `any` and lose type safety.

---

## Generic functions

```ts
// Without generics — only works for strings
function getFirst(arr: string[]): string {
  return arr[0];
}

// With generics — works for any type
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst<string>(['a', 'b', 'c']);   // 'a'
getFirst<number>([1, 2, 3]);          // 1
getFirst(['x', 'y']);                 // TypeScript infers T = string
```

`T` is the conventional name for a generic type parameter. You can use any letter or word, but `T` (Type), `K` (Key), `V` (Value), `E` (Element) are common conventions.

---

## Generic interfaces

```ts
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Use it for different data shapes
const employeeResponse: ApiResponse<Employee> = {
  data: { id: 1, name: 'Victor', ... },
  status: 200,
  message: 'OK',
};

const listResponse: ApiResponse<Employee[]> = {
  data: [...],
  status: 200,
  message: 'OK',
};
```

This is the standard pattern for typing HTTP responses in Angular services.

---

## Generic constraints

You can restrict what types are allowed with `extends`:

```ts
// T must have an id property
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

findById(employees, 1);    // ✅ Employee has an id
findById([1, 2, 3], 1);    // ❌ numbers do not have an id property
```

---

## Utility types — review

These are built-in generics that transform existing types. Already covered in `01-typescript-utilities.md`, but the connection to generics:

```ts
Partial<Employee>       // makes all properties optional
Required<Employee>      // makes all properties required
Readonly<Employee>      // makes all properties readonly
Pick<Employee, 'name' | 'email'>  // keep only some properties
Omit<Employee, 'id'>              // remove some properties
Record<string, number>            // object with string keys and number values
```

Each of these is a generic type — `Partial<T>`, `Omit<T, K>`, etc. TypeScript ships with them built in.

---

## In Angular

Generics appear constantly in Angular:

```ts
// Signals are generic
const employees = signal<Employee[]>([]);
const selected = signal<Employee | null>(null);

// HttpClient is generic
this.http.get<Employee[]>('/api/employees')

// MatDialog data injection
inject<EmployeeDialogData | undefined>(MAT_DIALOG_DATA)

// EventEmitter
@Output() selected = new EventEmitter<Employee>();
output<Employee>();
```

When you write `signal<Employee[]>([])`, you are telling TypeScript: "this signal holds an array of Employee objects". TypeScript then enforces that everywhere you read or write the signal.
