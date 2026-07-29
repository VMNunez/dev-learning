# Angular — Legacy patterns: Subject, BehaviorSubject, EventEmitter

Docs: https://rxjs.dev/guide/subject

Your projects use signals for shared state and `output()` for component events. But every consultancy codebase built before Angular 16 uses the older reactive primitives instead — `Subject`, `BehaviorSubject`, and `EventEmitter`. You will rarely write these from scratch, but you must recognise them on day one and be able to explain the difference in an interview. They come up constantly in technical screenings at NTT Data, Capgemini, and similar.

## The problem they solved

Before signals (Angular 16+), there was no built-in reactive value. If two unrelated components needed to share state — say, the current user after login — you could not just hold a plain variable, because changing it would not notify the other component. The answer was an RxJS `Subject` living in a service: components subscribe to it, and when one pushes a new value, every subscriber reacts.

That is exactly what a signal does today. A `signal` in a service is the modern replacement for a `BehaviorSubject` in a service.

## Subject — emits to current subscribers only

Docs: https://rxjs.dev/guide/subject — read: "Subject"

A `Subject` is both an Observable (you can subscribe to it) and an observer (you can push values into it with `.next()`).

```typescript
import { Subject } from 'rxjs';

private logoutEvent = new Subject<void>();
logout$ = this.logoutEvent.asObservable();

logout() {
  this.logoutEvent.next(); // notify all current subscribers
}
```

The key trait: a `Subject` only emits to subscribers that are **already listening**. If you subscribe after `.next()` has fired, you miss that value. That makes it right for one-off events (a logout, a "saved" toast) but wrong for shared state.

## BehaviorSubject — holds the current value

Docs: https://rxjs.dev/api/index/class/BehaviorSubject — read: the constructor and `.value`

A `BehaviorSubject` is a `Subject` that remembers the last value and replays it immediately to any new subscriber. It needs an initial value.

```typescript
import { BehaviorSubject } from 'rxjs';

private currentUser = new BehaviorSubject<User | null>(null);
currentUser$ = this.currentUser.asObservable();

setUser(user: User) {
  this.currentUser.next(user);
}

getCurrentValue(): User | null {
  return this.currentUser.value; // read the latest value synchronously
}
```

Because it always has a current value and replays it, `BehaviorSubject` is the classic pattern for **shared state** — the logged-in user, a theme, a shopping cart. A component that subscribes late still gets the current value straight away.

### Subject vs BehaviorSubject

| | `Subject` | `BehaviorSubject` |
|---|---|---|
| Initial value | None | Required |
| New subscriber gets last value | No | Yes |
| Read current value synchronously | No | Yes (`.value`) |
| Use for | One-off events | Shared state |

> **The interview question:** "What is the difference between `Subject` and `BehaviorSubject`?" Answer: a `BehaviorSubject` has an initial value and replays the latest value to every new subscriber; a plain `Subject` does not. Then add the modern note — in Angular 16+ you would hold a `signal` in the service instead of a `BehaviorSubject`.

## The signal equivalent — what you write today

```typescript
// legacy — BehaviorSubject in a service
private currentUser = new BehaviorSubject<User | null>(null);
currentUser$ = this.currentUser.asObservable();
setUser(user: User) { this.currentUser.next(user); }

// modern — signal in a service (project 06 auth.service)
currentUser = signal<User | null>(null);
setUser(user: User) { this.currentUser.set(user); }
```

The signal version needs no `asObservable()`, no manual subscription in the component, and no `takeUntilDestroyed`. The template reads `currentUser()` directly and Angular handles the rest. This is the same `currentUser` signal used in project 06 for role-aware UI (see [14-role-aware-ui.md](./_legacy/14-role-aware-ui.md)).

## EventEmitter — the legacy @Output

Docs: https://angular.dev/api/core/EventEmitter — read: "EventEmitter"

`EventEmitter` is how a child component sent events to its parent before `output()`. It is a thin wrapper around an RxJS `Subject`, used only together with the `@Output()` decorator.

```typescript
// legacy — @Output + EventEmitter
import { Output, EventEmitter } from '@angular/core';

@Output() taskDeleted = new EventEmitter<number>();

onDelete(id: number) {
  this.taskDeleted.emit(id);
}
```

```typescript
// modern — output() (see 02-components-templates.md)
taskDeleted = output<number>();

onDelete(id: number) {
  this.taskDeleted.emit(id);
}
```

The parent binding is identical in both cases — `(taskDeleted)="onTaskDeleted($event)"`. Only the declaration changed. `output()` is not an `EventEmitter` under the hood; it is a lighter signal-based API, but `.emit()` works the same way, so the migration is almost mechanical.

> **Gotcha:** never use `EventEmitter` for anything except `@Output`. People sometimes reach for it as a general-purpose event bus inside a service — that is a code smell. Use a plain `Subject` for that, or a signal.

## Summary

| Legacy | Modern replacement | Use for |
|---|---|---|
| `BehaviorSubject` in a service | `signal()` in a service | shared state |
| `Subject` + `.next()` | a `signal()`, or a `Subject` (still valid) | one-off events |
| `@Output() x = new EventEmitter<T>()` | `x = output<T>()` | child → parent events |
