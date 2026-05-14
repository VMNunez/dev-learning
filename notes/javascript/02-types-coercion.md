# Types and Coercion

## Primitive types

JavaScript has 7 primitive types:

| Type | Example | Notes |
|------|---------|-------|
| `string` | `'hello'` | Immutable sequence of characters |
| `number` | `42`, `3.14`, `NaN`, `Infinity` | All numbers are floats internally |
| `boolean` | `true`, `false` | |
| `null` | `null` | Intentional absence of a value |
| `undefined` | `undefined` | Variable declared but not assigned |
| `symbol` | `Symbol('id')` | Unique identifier — rarely used |
| `bigint` | `9007199254740991n` | For integers larger than Number can handle |

Everything else (arrays, objects, functions) is an **object** — a reference type.

---

## typeof

```js
typeof 'hello'      // 'string'
typeof 42           // 'number'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof null         // 'object'  ← famous bug in JS, never fixed
typeof {}           // 'object'
typeof []           // 'object'
typeof function(){} // 'function'
```

`typeof null === 'object'` is a known bug from the original JavaScript implementation. To check for null: `value === null`.

---

## null vs undefined

```js
let x;          // undefined — declared but never assigned
let y = null;   // null — deliberately set to "no value"
```

| | null | undefined |
|---|------|-----------|
| Meaning | Intentional empty value | Not yet assigned |
| Set by | You (the developer) | JavaScript |
| typeof | `'object'` (bug) | `'undefined'` |

In practice: use `null` when you want to explicitly say "this has no value". `undefined` appears automatically when a variable is declared but not assigned, or when a function has no return statement.

---

## == vs ===

`==` — loose equality — performs **type coercion** before comparing
`===` — strict equality — compares value AND type, no coercion

```js
0 == '0'    // true  — '0' is coerced to 0
0 === '0'   // false — different types

null == undefined   // true  — special case
null === undefined  // false — different types

1 == true   // true  — true is coerced to 1
1 === true  // false
```

**Always use `===`.** Type coercion makes `==` unpredictable. The only common exception: `value == null` catches both `null` and `undefined` in one check, which some developers use intentionally.

---

## Truthy and falsy

Every value in JavaScript is either truthy or falsy — it evaluates to `true` or `false` in a boolean context.

**Falsy values** (there are only 6):
```js
false
0
''        // empty string
null
undefined
NaN
```

Everything else is truthy — including `[]`, `{}`, `'0'`, `-1`.

```js
if ([]) console.log('truthy');   // prints — empty array is truthy
if ('') console.log('truthy');   // does not print — empty string is falsy
```

---

## Type coercion — common cases

```js
'5' + 3     // '53'  — + with string concatenates
'5' - 3     // 2     — - converts '5' to a number
+'5'        // 5     — unary + converts to number
+true       // 1
+false      // 0
+null       // 0
+undefined  // NaN
```

**Rule:** avoid relying on implicit coercion. Use `Number()`, `String()`, `Boolean()` for explicit conversions.
