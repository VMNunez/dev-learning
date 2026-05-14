# Async JavaScript

## The event loop

JavaScript is single-threaded — it can only do one thing at a time. The event loop is what makes async code possible without blocking the thread.

```
Call stack         Task queue        Microtask queue
─────────────      ──────────────    ───────────────
Running code  →    setTimeout cb     Promise .then()
                   setInterval cb    async/await
                   DOM events
```

**Order of execution:**
1. Run all synchronous code in the call stack
2. Run all microtasks (Promise callbacks) — empties the entire queue
3. Run one task from the task queue (setTimeout, etc.)
4. Repeat

```js
console.log('1');

setTimeout(() => console.log('2'), 0);  // task queue

Promise.resolve().then(() => console.log('3'));  // microtask queue

console.log('4');

// Output: 1, 4, 3, 2
```

`Promise.then()` runs before `setTimeout` even with 0ms delay, because microtasks have higher priority.

---

## Callbacks

The original async pattern. Pass a function to be called when the operation completes.

```js
setTimeout(() => {
  console.log('done after 1 second');
}, 1000);
```

**Callback hell** — nested callbacks become unreadable:

```js
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // deeply nested, hard to read and handle errors
    });
  });
});
```

Promises and async/await were created to solve this.

---

## Promises

A Promise represents a value that will be available in the future. It has three states: **pending**, **fulfilled**, **rejected**.

```js
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(data);   // fulfilled
  } else {
    reject(error);   // rejected
  }
});

promise
  .then(data => console.log(data))    // runs on resolve
  .catch(error => console.error(error))  // runs on reject
  .finally(() => console.log('done'));   // always runs
```

### Promise.all

Runs multiple promises in parallel. Resolves when ALL are done. Rejects if ANY fails.

```js
const [users, departments] = await Promise.all([
  fetchUsers(),
  fetchDepartments()
]);
```

Used in Angular with `forkJoin` — the RxJS equivalent.

### Promise.allSettled

Like `Promise.all` but never rejects — it waits for all promises and tells you which succeeded and which failed.

```js
const results = await Promise.allSettled([fetchA(), fetchB()]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  if (r.status === 'rejected') console.error(r.reason);
});
```

---

## async / await

Syntax sugar on top of Promises. Makes async code look and behave like synchronous code.

```js
async function getEmployee(id) {
  try {
    const response = await fetch(`/api/employees/${id}`);
    const employee = await response.json();
    return employee;
  } catch (error) {
    console.error('Failed to fetch employee:', error);
    throw error;
  }
}
```

- `async` before a function — it always returns a Promise
- `await` inside an async function — pauses execution until the Promise resolves
- `try/catch` — the correct way to handle errors with async/await

**Parallel execution with await:**

```js
// Sequential — fetchB waits for fetchA to finish
const a = await fetchA();
const b = await fetchB();

// Parallel — both start at the same time
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

---

## In Angular

Angular uses RxJS Observables for HTTP, which are similar to Promises but more powerful. The key differences:

| | Promise | Observable |
|---|---------|------------|
| Values | One | One or many |
| Lazy? | No — starts immediately | Yes — starts when subscribed |
| Cancellable? | No | Yes |
| Operators | .then(), .catch() | .pipe(map(), filter(), catchError()...) |

In Angular you use `subscribe()` instead of `await`, and `takeUntilDestroyed()` to cancel subscriptions when the component is destroyed. For simple cases, `toPromise()` or `firstValueFrom()` convert an Observable to a Promise.
