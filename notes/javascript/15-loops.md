# Loops

Array methods like `map`, `filter`, and `reduce` handle most iteration in Angular. But loops still matter — knowing when to use each one is part of writing real JavaScript.

[MDN — for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) | [MDN — for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) | [MDN — while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while)

---

## for loop — the classic

Iterate a fixed number of times, or when you need the index.

```js
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}

// Iterate an array with index
const employees = ['Ana', 'Luis', 'Marta'];
for (let i = 0; i < employees.length; i++) {
  console.log(`${i}: ${employees[i]}`);
}
```

**Use when:** you need the index, or you are generating a fixed-size structure (like 10 placeholder rows).

---

## for...of — values from an iterable

Iterates over the **values** of any iterable: arrays, strings, Sets, Maps.

```js
const employees = ['Ana', 'Luis', 'Marta'];

for (const name of employees) {
  console.log(name);  // Ana, Luis, Marta
}

// Works on strings too
for (const char of 'hello') {
  console.log(char);  // h, e, l, l, o
}

// Works on Sets
const uniqueRoles = new Set(['admin', 'employee', 'manager']);
for (const role of uniqueRoles) {
  console.log(role);
}
```

**Use when:** you need to loop over values AND you need `break` or `continue` — because array methods cannot do early exit.

```js
// Early exit — find the first admin and stop
for (const emp of employees) {
  if (emp.role === 'admin') {
    console.log('Found admin:', emp.name);
    break;  // stop immediately — map/filter cannot do this
  }
}
```

---

## for...in — keys of an object

Iterates over the **property names** (keys) of an object. Returns strings.

```js
const user = { name: 'Victor', role: 'admin', age: 31 };

for (const key in user) {
  console.log(key, user[key]);
  // 'name' Victor
  // 'role' admin
  // 'age' 31
}
```

> **Do NOT use `for...in` on arrays.** It gives you the index strings (`'0'`, `'1'`, `'2'`), not the values, and it can also pick up inherited properties. Use `for...of` or array methods for arrays.

```js
const arr = ['a', 'b', 'c'];

for (const i in arr) {
  console.log(i);  // '0', '1', '2'  — strings, not numbers
}

// What you actually want:
for (const value of arr) {
  console.log(value);  // 'a', 'b', 'c'
}
```

In practice, `Object.keys(obj).forEach(...)` or `Object.entries(obj).forEach(...)` is cleaner than `for...in` for most object iteration.

---

## while loop

Repeats as long as a condition is true. Use when you don't know in advance how many times it should run.

```js
let attempts = 0;
while (attempts < 3) {
  console.log('Trying...');
  attempts++;
}
```

**Use when:** the number of iterations depends on a runtime condition (retrying an operation, reading a stream, waiting for state).

---

## do...while loop

Like `while`, but always runs the body at least once before checking the condition.

```js
let input;
do {
  input = prompt('Enter a number:');
} while (isNaN(input));  // keeps asking until a valid number is entered
```

Rarely used in modern JavaScript — most interactive loops are replaced by reactive patterns in Angular.

---

## break and continue

`break` — exits the loop immediately.
`continue` — skips the rest of the current iteration and moves to the next one.

```js
const tasks = [
  { id: 1, done: false },
  { id: 2, done: true },
  { id: 3, done: false },
];

for (const task of tasks) {
  if (task.done) continue;  // skip completed tasks
  console.log('Pending:', task.id);  // 1, 3
}
```

---

## Loops vs array methods — when to use which

| Situation | Use |
|-----------|-----|
| Transform every element | `map` |
| Keep elements that match | `filter` |
| Accumulate into one value | `reduce` |
| Check if any/all match | `some` / `every` |
| Find one specific item | `find` / `findIndex` |
| Need early exit (`break`) | `for...of` |
| Iterate over object keys | `Object.keys().forEach()` or `for...in` |
| Generate N items | `for` loop |
| Unknown number of iterations | `while` |

In Angular, array methods win almost always — they chain with `computed()` signals cleanly. A `for...of` with `break` is the main exception.
