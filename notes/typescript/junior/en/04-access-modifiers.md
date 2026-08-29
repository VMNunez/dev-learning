# Access Modifiers

Official docs: https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility

Before TypeScript, JavaScript classes had no way to hide internal details — everything was public by accident. Access modifiers let you express intent: "this is internal, don't touch it from outside". This matters in Angular because services have methods and state that should only be used by the component that owns them.

---

## The four modifiers

```ts
class EmployeeService {
  public employees: Employee[] = [];    // anyone can read and write
  private _cache: Employee[] = [];      // only this class can access
  protected baseUrl: string = '/api';   // this class and subclasses
  readonly version: string = '1.0';    // set once, never changed
}
```

| Modifier | Accessible from... |
|----------|-------------------|
| `public` | Anywhere — the default if you write nothing |
| `private` | Only inside the same class |
| `protected` | The class and any class that extends it |
| `readonly` | Set once at declaration or in the constructor — then never again |

> You do not need to write `public` explicitly — it is the default. You will see it in older Angular code, but modern Angular code usually omits it.

---

## `private` in Angular services

In Angular you inject services into components. The service reference should be `private` — nothing outside the component should call it directly.

```ts
@Component({ ... })
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);  // private — only this component uses it

  employees = this.employeeService.getAll();
}
```

Why not `public`? If `employeeService` is public, another component or test could call `this.listComponent.employeeService.delete(1)` — bypassing any logic you put in the component. That is the encapsulation problem `private` solves.

---

## `readonly` for values that never change

```ts
@Component({ ... })
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  readonly title = 'HR Portal';

  // readonly also works on constructor parameters (constructor shorthand)
  constructor(private readonly router: Router) {}
}
```

`readonly` is a promise: "this will not be reassigned after initialization". TypeScript enforces it at compile time.

```ts
this.title = 'New Title';  // ❌ error — cannot assign to a readonly property
```

Use `readonly` for injected services in the constructor shorthand pattern — it makes clear the reference itself will never change.

---

## `protected` — when you need it

`protected` is rarely used in Angular application code. It appears when you have a base class that subclasses extend:

```ts
abstract class BaseDialogComponent {
  protected dialogRef = inject(MatDialogRef);

  protected close() {
    this.dialogRef.close();
  }
}

class EmployeeDialogComponent extends BaseDialogComponent {
  onCancel() {
    this.close();  // ✅ accessible — it's protected in the base class
  }
}
```

In most Angular projects you will write `private` almost everywhere and only need `protected` if you use inheritance patterns.

---

## Constructor shorthand — the full picture

When you use an access modifier in a constructor parameter, TypeScript automatically creates and assigns a class property. This is how you see access modifiers most often in older Angular code:

```ts
// Long form — explicit
class EmployeeService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;  // manual assignment
  }
}

// Shorthand — same result
class EmployeeService {
  constructor(private http: HttpClient) {}  // TypeScript creates and assigns http
}

// With readonly
class EmployeeService {
  constructor(private readonly http: HttpClient) {}  // cannot reassign this.http
}
```

Modern Angular uses `inject()` instead, which removes the need for the constructor entirely. But you will see the constructor shorthand in existing codebases — it is still valid.

---

## In practice

The rules you will follow in every Angular component and service:

- Injected services → `private` (or `private readonly`)
- Signals and state → leave as default `public` if the template needs them
- Internal methods (helpers, validators) → `private`
- Constants that should not change → `readonly`
- Inputs and outputs → always `public` (Angular requires it)
