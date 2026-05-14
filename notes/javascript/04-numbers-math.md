# Numbers and Math

## Number type

JavaScript has a single number type for both integers and floats — all numbers are 64-bit floating point (IEEE 754).

```js
typeof 42       // 'number'
typeof 3.14     // 'number'
typeof NaN      // 'number'  ← NaN is technically a number
typeof Infinity // 'number'
```

---

## Converting to number

```js
Number('42')       // 42
Number('3.14')     // 3.14
Number('')         // 0
Number('hello')    // NaN
Number(true)       // 1
Number(false)      // 0
Number(null)       // 0
Number(undefined)  // NaN

parseInt('42px')   // 42   — stops at the first non-numeric character
parseInt('3.99')   // 3    — ignores decimal part
parseFloat('3.99') // 3.99
+'42'              // 42   — unary plus, shortest conversion
```

---

## NaN and Infinity

```js
NaN === NaN        // false — NaN is not equal to itself (JS quirk)
isNaN(NaN)         // true
isNaN('hello')     // true  — converts to number first, then checks
Number.isNaN(NaN)  // true
Number.isNaN('hello') // false  — only true for actual NaN, not coerced values

1 / 0              // Infinity
-1 / 0             // -Infinity
isFinite(Infinity) // false
isFinite(42)       // true
```

**Rule:** use `Number.isNaN()` instead of `isNaN()` — it does not coerce the value first, so it is more predictable.

---

## Number methods

```js
(3.14159).toFixed(2)    // '3.14'   — rounds to N decimal places, returns string
(1234567).toLocaleString('es-ES')  // '1.234.567' — locale-formatted string

Number.isInteger(42)    // true
Number.isInteger(3.14)  // false
Number.MAX_SAFE_INTEGER // 9007199254740991  — largest safe integer
```

---

## The floating point problem

```js
0.1 + 0.2  // 0.30000000000000004
0.1 + 0.2 === 0.3  // false
```

This is not a JavaScript bug — it is how floating point arithmetic works in every language. Fix it with `toFixed()` when displaying, or multiply to integers when calculating:

```js
// For display
(0.1 + 0.2).toFixed(1)  // '0.3'

// For calculation (work in cents, not euros)
const total = (price * 100 + tax * 100) / 100;
```

---

## Math object

Common Math methods:

```js
Math.round(4.5)    // 5   — rounds to nearest integer
Math.floor(4.9)    // 4   — always rounds down
Math.ceil(4.1)     // 5   — always rounds up
Math.trunc(4.9)    // 4   — removes decimal (no rounding)
Math.abs(-5)       // 5   — absolute value

Math.max(1, 5, 3)  // 5
Math.min(1, 5, 3)  // 1
Math.max(...[1, 5, 3])  // 5  — spread to pass an array

Math.random()          // random float 0 (inclusive) to 1 (exclusive)
Math.floor(Math.random() * 10)     // random integer 0–9
Math.floor(Math.random() * 10) + 1 // random integer 1–10

Math.pow(2, 10)    // 1024  — same as 2 ** 10
Math.sqrt(16)      // 4
Math.PI            // 3.141592653589793
```

---

## Common patterns in Angular

```ts
// Round a price for display
const display = expense.amount.toFixed(2);  // '29.99'

// Generate a temporary ID (use Date.now() in real code)
const tempId = Math.floor(Math.random() * 1000000);

// Clamp a value between min and max
const clamped = Math.min(Math.max(value, min), max);

// Percentage
const percentage = Math.round((done / total) * 100);
```
