# Variables and Scope

## var, let, const

| | var | let | const |
|---|-----|-----|-------|
| Scope | Function | Block | Block |
| Hoisted? | Yes (as `undefined`) | Yes (but not initialized — TDZ) | Yes (but not initialized — TDZ) |
| Reassignable? | Yes | Yes | No |
| Redeclarable? | Yes | No | No |

**Block scope** means the variable only exists inside the `{}` where it was declared:

```js
if (true) {
  let x = 10;
  var y = 20;
}
console.log(y);  // 20 — var leaks out of the block
console.log(x);  // ReferenceError — let stays inside
```

**Rule:** always use `const` by default. Use `let` only when you need to reassign. Never use `var`.

---

## Hoisting

JavaScript moves variable and function declarations to the top of their scope before executing the code. This is called hoisting.

```js
console.log(name);  // undefined — var is hoisted but not initialized
var name = 'Victor';

console.log(age);   // ReferenceError — let is hoisted but in TDZ
let age = 31;
```

**Function declarations are fully hoisted** — you can call them before they are defined:

```js
greet();  // 'Hello' — works

function greet() {
  console.log('Hello');
}
```

**Function expressions are NOT fully hoisted:**

```js
greet();  // TypeError — greet is undefined at this point

var greet = function() {
  console.log('Hello');
};
```

---

## Temporal Dead Zone (TDZ)

`let` and `const` are hoisted but not initialized. The period between the start of the block and the declaration line is the TDZ — accessing the variable there throws a `ReferenceError`.

```js
{
  // TDZ starts here
  console.log(x);  // ReferenceError
  let x = 5;       // TDZ ends here — x is now accessible
}
```

---

## Scope types

**Global scope** — variables declared outside any function or block. Available everywhere. Avoid polluting the global scope.

**Function scope** — variables declared inside a function. Only available inside that function.

**Block scope** — variables declared with `let` or `const` inside `{}`. Only available inside that block.

```js
const global = 'I am global';

function example() {
  const functionScoped = 'only inside this function';

  if (true) {
    const blockScoped = 'only inside this if block';
    console.log(functionScoped);  // ✅
    console.log(global);          // ✅
  }

  console.log(blockScoped);  // ❌ ReferenceError
}
```

---

## Closure

A closure is a function that remembers the variables from its outer scope, even after the outer function has finished executing.

```js
function makeCounter() {
  let count = 0;            // outer variable

  return function() {
    count++;                // inner function remembers count
    return count;
  };
}

const counter = makeCounter();
counter();  // 1
counter();  // 2
counter();  // 3
```

`makeCounter` has finished, but `count` is still alive because the returned function holds a reference to it. That is a closure.

**Where closures appear in Angular:**
- `computed(() => tasks().filter(...))` — the arrow function closes over `tasks`
- Event handlers in components — they close over component properties
- Service methods that use private state
