# Sets and Maps

## Set

A `Set` is a collection of **unique values** — duplicates are automatically ignored. Order is preserved (insertion order).

```js
const set = new Set([1, 2, 2, 3, 3]);
console.log(set);  // Set { 1, 2, 3 }  — duplicates removed

set.add(4);         // add a value
set.has(2);         // true
set.delete(2);      // remove a value
set.size;           // 3  — number of items (not .length)
set.clear();        // remove all values
```

### Iterating

```js
const roles = new Set(['admin', 'employee', 'manager']);

for (const role of roles) {
  console.log(role);
}

[...roles]             // convert to array: ['admin', 'employee', 'manager']
Array.from(roles)      // same result
```

### Most common use — remove duplicates from an array

```js
const departments = employees.map(e => e.department);
const uniqueDepts = [...new Set(departments)];
// ['IT', 'HR', 'Finance'] — no duplicates
```

This pattern appears in the HR portal to build filter options from the employee list.

---

## Map

A `Map` is a collection of key-value pairs where **keys can be any type** — not just strings. Order is preserved.

```js
const map = new Map();

map.set('name', 'Victor');
map.set(42, 'a number as key');
map.set({ id: 1 }, 'an object as key');

map.get('name');      // 'Victor'
map.has('name');      // true
map.delete('name');
map.size;             // number of entries
map.clear();
```

### Creating from an array of pairs

```js
const config = new Map([
  ['apiUrl', 'https://api.example.com'],
  ['timeout', 5000],
  ['retries', 3],
]);

config.get('timeout');  // 5000
```

### Iterating

```js
for (const [key, value] of map) {
  console.log(key, value);
}

[...map.keys()]    // array of keys
[...map.values()]  // array of values
[...map.entries()] // array of [key, value] pairs
```

---

## Set vs Array — when to use each

| | Array | Set |
|---|-------|-----|
| Allows duplicates | Yes | No |
| Has index access | Yes (`arr[0]`) | No |
| Check if value exists | `includes()` — O(n) | `has()` — O(1) fast |
| Best for | Ordered lists, transformation | Unique values, fast lookup |

**Use a Set when:** you need to eliminate duplicates, or you frequently check if a value exists.

## Map vs Object — when to use each

| | Object | Map |
|---|--------|-----|
| Key type | String or Symbol only | Any type |
| Iteration order | Not guaranteed in older JS | Always insertion order |
| Size | No built-in `.size` | `.size` built in |
| Best for | Data models, component state | Dynamic key-value lookup |

**Use a Map when:** keys are not strings, or you need to frequently add and delete entries.

In Angular, plain objects are used for most data. Sets are most useful for unique value collections like filter options.
