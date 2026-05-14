# Functions

## Function declaration vs function expression

```js
// Function declaration — hoisted, can be called before it is defined
function greet(name) {
  return `Hello, ${name}`;
}

// Function expression — not hoisted
const greet = function(name) {
  return `Hello, ${name}`;
};

// Arrow function (also an expression)
const greet = (name) => `Hello, ${name}`;
```

---

## Arrow functions

Shorter syntax. Two important differences from regular functions:
1. **No own `this`** — they inherit `this` from the surrounding scope
2. **No `arguments` object**

```js
// Single parameter — parentheses optional
const double = x => x * 2;

// Multiple parameters — parentheses required
const add = (a, b) => a + b;

// Body with multiple lines — need curly braces and return
const process = (x) => {
  const result = x * 2;
  return result;
};

// Returning an object — wrap in parentheses to avoid confusion with block
const makeUser = (name) => ({ name, active: true });
```

**Why arrow functions are used in Angular:**
- Component methods that use `this` — arrow functions capture the component's `this` correctly
- `computed(() => ...)`, `effect(() => ...)` — all use arrow functions
- Array callbacks — `tasks().filter(t => t.done)`

---

## this

`this` refers to the object that is calling the function. Its value depends on **how** the function is called, not where it is defined.

```js
const user = {
  name: 'Victor',
  greet() {
    console.log(this.name);  // 'Victor' — this is user
  }
};
user.greet();

function standalone() {
  console.log(this);  // undefined (strict mode) or window (non-strict)
}
standalone();
```

**Arrow functions do not have their own `this`** — they use the `this` of the scope where they were defined:

```js
const user = {
  name: 'Victor',
  greet: () => {
    console.log(this.name);  // undefined — arrow function, this is not user
  }
};
```

**Rule in Angular:** use arrow functions for callbacks and array methods. Use regular methods for component methods defined in the class — TypeScript classes handle `this` correctly.

---

## Default parameters

```js
function createUser(name, role = 'employee') {
  return { name, role };
}

createUser('Victor');           // { name: 'Victor', role: 'employee' }
createUser('Victor', 'admin');  // { name: 'Victor', role: 'admin' }
```

---

## Rest parameters

Collects all remaining arguments into an array. Must be the last parameter.

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4);  // 10
```

---

## Closures in practice

A closure is a function that retains access to variables from its outer scope even after the outer function has returned.

```js
function makeMultiplier(factor) {
  return (number) => number * factor;  // factor is remembered
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

double(5);  // 10
triple(5);  // 15
```

Each call to `makeMultiplier` creates a new closure with its own `factor`. This pattern is used in Angular for factory services, for configurable pipes, and for event handler generators.
