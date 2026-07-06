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

## bind, call, apply — set `this` manually

Because a regular function's `this` depends on *how* it is called, you sometimes need to set it explicitly. Three methods do that:

```js
const user = { name: 'Victor' };

function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

greet.call(user, 'Hello');       // 'Hello, Victor'  — calls now, args one by one
greet.apply(user, ['Hello']);    // 'Hello, Victor'  — calls now, args as an array
const bound = greet.bind(user);  // returns a NEW function with this fixed to user
bound('Hello');                  // 'Hello, Victor'  — call it later
```

- **`call`** — invokes the function immediately, passing arguments one by one.
- **`apply`** — invokes immediately, passing arguments as an array. (Memory hook: **a**pply = **a**rray.)
- **`bind`** — does *not* invoke; it returns a new function with `this` permanently fixed, to call later.

The classic problem they solve: passing a class method as a callback loses its `this`. `bind` fixes it — `setTimeout(this.tick.bind(this), 1000)`. In modern Angular/TypeScript you rarely write these — an arrow function (`() => this.tick()`) does the same thing more cleanly — but you must recognise them in older code and interview questions.

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

## Higher-order functions

A higher-order function is a function that **takes a function as an argument, returns a function, or both**. They are the foundation of `map`, `filter`, `reduce`, and every RxJS operator.

```js
// takes a function — map receives a transform function
[1, 2, 3].map(n => n * 2);

// returns a function — a factory that builds a configured function
function makePrefixer(prefix) {
  return (text) => `${prefix}${text}`;
}
const withDollar = makePrefixer('$');
withDollar('100'); // '$100'
```

You already use higher-order functions constantly: every array callback and every `computed(() => ...)` passes a function to another function. Interview answer: "a function that takes or returns another function — like `map`, or a factory that returns a configured function."

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
