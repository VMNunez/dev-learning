# Array Methods

All modern array methods return a new array or value — they do not mutate the original (except `sort` and `splice`).

---

## map

Transforms every element. Returns a new array of the same length.

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6]

const employees = [{ name: 'Ana', salary: 30000 }, { name: 'Luis', salary: 40000 }];
const names = employees.map(e => e.name);  // ['Ana', 'Luis']
```

**Use when:** you need to transform every element into something else.

---

## filter

Keeps only elements that pass the test. Returns a new array (shorter or empty).

```js
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(n => n % 2 === 0);  // [2, 4]

const tasks = [{ title: 'A', done: true }, { title: 'B', done: false }];
const pending = tasks.filter(t => !t.done);  // [{ title: 'B', done: false }]
```

**Use when:** you need a subset of the array.

---

## find

Returns the **first** element that matches. Returns `undefined` if nothing matches.

```js
const users = [{ id: 1, name: 'Ana' }, { id: 2, name: 'Luis' }];
const user = users.find(u => u.id === 2);  // { id: 2, name: 'Luis' }
```

**find vs filter:**
- `find` — returns one element or `undefined`
- `filter` — returns an array (always)

---

## findIndex

Returns the index of the first element that matches. Returns `-1` if not found.

```js
const tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];
const index = tasks.findIndex(t => t.id === 2);  // 1
```

**Use when:** you need the position to update or remove an element from the array.

---

## some

Returns `true` if **at least one** element passes the test.

```js
const tasks = [{ done: true }, { done: false }];
const hasCompleted = tasks.some(t => t.done);  // true
```

**Use when:** you need to know if anything matches — email duplicate check, permission checks.

---

## every

Returns `true` if **all** elements pass the test.

```js
const tasks = [{ done: true }, { done: true }];
const allDone = tasks.every(t => t.done);  // true
```

---

## reduce

Accumulates all elements into a single value — a number, an object, a string, another array.

```js
const numbers = [1, 2, 3, 4];
const total = numbers.reduce((acc, n) => acc + n, 0);  // 10

// Group by a property
const employees = [
  { name: 'Ana', dept: 'IT' },
  { name: 'Luis', dept: 'HR' },
  { name: 'Marta', dept: 'IT' },
];
const byDept = employees.reduce((acc, e) => {
  if (!acc[e.dept]) acc[e.dept] = [];
  acc[e.dept].push(e.name);
  return acc;
}, {});
// { IT: ['Ana', 'Marta'], HR: ['Luis'] }
```

`reduce(callback, initialValue)` — the initial value is the starting accumulator (`acc`).

---

## forEach

Iterates over the array. Returns `undefined` — use only for side effects.

```js
employees.forEach(e => console.log(e.name));
```

**forEach vs map:** `map` returns a new array (use for transformation). `forEach` returns nothing (use for side effects like logging or updating DOM).

---

## includes

Returns `true` if the value exists in the array. Uses strict equality.

```js
const roles = ['admin', 'employee', 'manager'];
roles.includes('admin');   // true
roles.includes('unknown'); // false
```

---

## flat and flatMap

```js
const nested = [1, [2, 3], [4, [5]]];
nested.flat();    // [1, 2, 3, 4, [5]]  — one level deep
nested.flat(2);   // [1, 2, 3, 4, 5]   — two levels deep
nested.flat(Infinity);  // fully flattens any depth
```

---

## sort — careful, it mutates

`sort` sorts the original array in place and returns it. By default it converts elements to strings and sorts lexicographically.

```js
[10, 9, 2, 1].sort();              // [1, 10, 2, 9]  ← wrong for numbers
[10, 9, 2, 1].sort((a, b) => a - b);  // [1, 2, 9, 10]  ← correct
```

To sort without mutating: `[...array].sort(...)`.

---

## Chaining

Methods can be chained — each method runs on the result of the previous one:

```js
const result = employees
  .filter(e => e.dept === 'IT')
  .map(e => e.name)
  .sort();
```

This pattern appears constantly in Angular `computed()` signals.
