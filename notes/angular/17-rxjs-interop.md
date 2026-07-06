# Angular — RxJS Interop (toSignal, fromSignal)

Official docs: https://angular.dev/guide/rxjs-interop

## The problem it solves

In project 07 (Spring Boot backend), every HTTP call from `HttpClient` returns an **Observable**. But Angular's modern template system works best with **signals**. Without a bridge, you would write `subscribe()` everywhere and manage memory manually.

`toSignal()` and `fromSignal()` are that bridge.

---

## toSignal() — convert an Observable into a signal

`toSignal()` subscribes to an Observable and keeps a signal updated with its latest value. It unsubscribes automatically when the context (component or service) is destroyed — no `takeUntilDestroyed` needed.

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ ... })
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);

  // the service returns an Observable from HttpClient
  employees$ = this.employeeService.getAll();

  // toSignal subscribes automatically and gives you a signal
  employees = toSignal(this.employees$, { initialValue: [] });
}
```

The template reads `employees()` as a signal — no `async` pipe, no `subscribe()`.

### The `initialValue` option

The Observable has not emitted yet when the component first renders. Without `initialValue`, the signal is `undefined` at that moment, which causes errors if you loop over it.

```typescript
// without initialValue — the signal is undefined until the first emit
employees = toSignal(this.employees$);
// TypeScript type: Signal<Employee[] | undefined>  ← undefined is a real problem in templates

// with initialValue — safe from the start
employees = toSignal(this.employees$, { initialValue: [] as Employee[] });
// TypeScript type: Signal<Employee[]>  ← clean, no undefined
```

Always use `initialValue` when the Observable returns an array or a value you loop over.

### Where to call toSignal()

`toSignal()` must be called inside an **injection context** — the class body, a constructor, or a function called during construction. Never call it inside `ngOnInit`, a button click handler, or any method that runs after construction.

```typescript
// ✅ correct — called in the class body (injection context)
employees = toSignal(this.employeeService.getAll(), { initialValue: [] });

// ❌ wrong — called in ngOnInit, outside the injection context
ngOnInit() {
  this.employees = toSignal(this.employees$); // error: no injection context
}
```

---

## toSignal() with loading and error states

For HTTP calls, you often need loading and error signals alongside the data. The standard pattern:

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

employees = toSignal(
  this.employeeService.getAll().pipe(
    catchError(err => {
      this.hasError.set(true);
      return of([] as Employee[]);
    })
  ),
  { initialValue: [] as Employee[] }
);

isLoading = signal(true);
hasError = signal(false);
```

For the loading state, combine with `tap`:

```typescript
employees = toSignal(
  this.employeeService.getAll().pipe(
    tap({ next: () => this.isLoading.set(false), error: () => this.isLoading.set(false) }),
    catchError(() => { this.hasError.set(true); return of([]); })
  ),
  { initialValue: [] }
);
```

Or use a separate `isLoading` signal that you reset in `ngOnInit` when the data arrives.

---

## fromSignal() — convert a signal into an Observable

`fromSignal()` turns a signal into an Observable. Every time the signal changes, the Observable emits the new value. You use it when an RxJS operator needs a stream — for example, to pipe a search term signal through `debounceTime` and `switchMap`:

```typescript
import { fromSignal } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs/operators';

searchTerm = signal('');

searchResults = toSignal(
  fromSignal(this.searchTerm).pipe(
    debounceTime(300),
    switchMap(term => this.employeeService.search(term))
  ),
  { initialValue: [] }
);
```

Every time the user types and `searchTerm` changes, the Observable emits, waits 300ms, and fires the HTTP call. The result lands in `searchResults` as a signal.

---

## When to use toSignal() vs subscribe()

| Pattern | When to use |
|---|---|
| `toSignal()` | Template needs to display the data — simple, no manual sub management |
| `subscribe()` + `takeUntilDestroyed` | You need to trigger a side effect or update multiple signals from one response |
| `async` pipe | You are in a legacy codebase or prefer Observables throughout the template |

In project 07, the standard pattern is: service method returns an Observable → `toSignal()` converts it → template reads the signal.

---

## The full pattern used in project 07

```typescript
// service — returns Observable (HttpClient)
getAll(): Observable<Transaction[]> {
  return this.http.get<Transaction[]>('/api/transactions');
}

// component — toSignal converts to signal
transactions = toSignal(
  this.transactionService.getAll(),
  { initialValue: [] as Transaction[] }
);

// derived signal — computed() still works on top of toSignal()
total = computed(() =>
  this.transactions().reduce((sum, t) => sum + t.amount, 0)
);
```

This is the cleanest pattern: Observable at the service layer, signal at the component layer, computed for derived values. All from one `toSignal()` call.
