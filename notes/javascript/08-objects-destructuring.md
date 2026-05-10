# Objects and Destructuring

## Object basics

```js
const user = {
  name: 'Victor',
  age: 31,
  role: 'developer',
};

// Access
user.name       // 'Victor'   — dot notation
user['name']    // 'Victor'   — bracket notation (useful for dynamic keys)

// Add or update
user.city = 'Madrid';
user.age = 32;

// Delete
delete user.city;
```

---

## Shorthand property names

When the variable name matches the key name, you can write it once:

```js
const name = 'Victor';
const role = 'admin';

// Old way
const user = { name: name, role: role };

// Shorthand
const user = { name, role };
```

This appears everywhere in Angular when building objects from component variables.

---

## Object destructuring

Extract properties from an object into variables:

```js
const user = { name: 'Victor', age: 31, role: 'admin' };

const { name, role } = user;
console.log(name);  // 'Victor'
console.log(role);  // 'admin'

// Rename while destructuring
const { name: userName } = user;
console.log(userName);  // 'Victor'

// Default value if property is undefined
const { city = 'Madrid' } = user;
console.log(city);  // 'Madrid'
```

**In function parameters:**

```js
function display({ name, role }) {
  console.log(`${name} — ${role}`);
}
display(user);
```

---

## Array destructuring

```js
const colors = ['red', 'green', 'blue'];

const [first, second] = colors;
console.log(first);   // 'red'
console.log(second);  // 'green'

// Skip elements
const [, , third] = colors;
console.log(third);  // 'blue'

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
// a = 2, b = 1
```

---

## Spread operator (...)

**Copy an array:**

```js
const original = [1, 2, 3];
const copy = [...original];        // new array, not a reference
const extended = [...original, 4]; // [1, 2, 3, 4]
```

**Merge arrays:**

```js
const merged = [...arr1, ...arr2];
```

**Copy an object:**

```js
const user = { name: 'Victor', role: 'admin' };
const updated = { ...user, role: 'manager' };  // { name: 'Victor', role: 'manager' }
```

The spread on objects creates a shallow copy — nested objects are still references.

**In Angular:** used constantly for immutable state updates in signals.

```ts
employees.update(list => [...list, newEmployee]);
employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e));
```

---

## Rest (in destructuring)

Collects the remaining properties or elements:

```js
const { name, ...rest } = { name: 'Victor', age: 31, role: 'admin' };
// name = 'Victor'
// rest = { age: 31, role: 'admin' }

const [first, ...others] = [1, 2, 3, 4];
// first = 1
// others = [2, 3, 4]
```

---

## Optional chaining (?.)

Safely accesses a nested property without throwing if an intermediate value is `null` or `undefined`:

```js
const user = { address: { city: 'Madrid' } };

user.address?.city      // 'Madrid'
user.contact?.phone     // undefined — no error
user.contact?.phone ?? 'N/A'  // 'N/A'
```

**Without it:**

```js
user.contact && user.contact.phone  // old way
```

Used heavily in Angular templates and component code when data might not be loaded yet.

---

## Nullish coalescing (??)

Returns the right side only when the left side is `null` or `undefined` — NOT when it is `0`, `false`, or `''`.

```js
null ?? 'default'       // 'default'
undefined ?? 'default'  // 'default'
0 ?? 'default'          // 0      ← 0 is not null/undefined
false ?? 'default'      // false  ← false is not null/undefined
'' ?? 'default'         // ''     ← empty string is not null/undefined
```

**vs || (OR):** `||` returns the right side when the left side is **any falsy value**, which incorrectly catches `0` and `''`.

```js
0 || 'default'   // 'default'  ← wrong if 0 is a valid value
0 ?? 'default'   // 0          ← correct
```

Used in Angular when reading from localStorage or optional signal values.

---

## Object static methods

Methods on `Object` itself (not on instances) for inspecting and transforming objects.

```js
const employee = { name: 'Victor', role: 'admin', salary: 30000 };

Object.keys(employee)     // ['name', 'role', 'salary']   — array of keys
Object.values(employee)   // ['Victor', 'admin', 30000]   — array of values
Object.entries(employee)  // [['name','Victor'], ['role','admin'], ['salary',30000]]
```

**`Object.entries` is the most useful** — lets you iterate an object like an array:

```js
Object.entries(employee).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Convert object to Map
const map = new Map(Object.entries(employee));

// Filter an object's entries
const filtered = Object.fromEntries(
  Object.entries(employee).filter(([key]) => key !== 'salary')
);
// { name: 'Victor', role: 'admin' }
```

**`Object.assign`** — copies properties from one or more objects into a target:

```js
const defaults = { role: 'employee', active: true };
const overrides = { name: 'Victor', role: 'admin' };

const result = Object.assign({}, defaults, overrides);
// { role: 'admin', active: true, name: 'Victor' }
```

Prefer the spread operator for the same result — it is shorter and more readable:

```js
const result = { ...defaults, ...overrides };  // same thing
```

**`Object.freeze`** — makes an object immutable. Properties cannot be added, removed, or changed:

```js
const config = Object.freeze({ apiUrl: 'https://api.example.com', timeout: 5000 });
config.timeout = 10000;  // silently ignored (or throws in strict mode)
```

Useful for constants — configuration objects, lookup tables, role definitions.

---

## JSON

JSON (JavaScript Object Notation) is the standard format for sending and receiving data from APIs. It looks like a JavaScript object but is a string.

```js
// Object → JSON string
const employee = { name: 'Victor', role: 'admin', active: true };
const json = JSON.stringify(employee);
// '{"name":"Victor","role":"admin","active":true}'

// With formatting (useful for debugging)
JSON.stringify(employee, null, 2);
// {
//   "name": "Victor",
//   "role": "admin",
//   "active": true
// }

// JSON string → Object
const parsed = JSON.parse(json);
parsed.name  // 'Victor'
```

**What JSON can contain:** strings, numbers, booleans, null, arrays, objects.

**What JSON cannot contain:** `undefined`, functions, `Date` objects (dates become strings), `Symbol`.

```js
JSON.stringify({ a: undefined, b: () => {}, c: 1 })
// '{"c":1}'  — undefined and functions are silently dropped
```

**In Angular — localStorage pattern:**

```ts
// Save signal state to localStorage
effect(() => {
  localStorage.setItem('user', JSON.stringify(this.user()));
});

// Restore on load
const stored = localStorage.getItem('user');
const user = stored ? JSON.parse(stored) : null;
```

**Careful with `JSON.parse`** — it throws a `SyntaxError` if the string is invalid JSON. Always wrap it in `try/catch` when parsing external data:

```ts
try {
  const data = JSON.parse(stored);
} catch {
  localStorage.removeItem('user');  // corrupt data — clean up
}
