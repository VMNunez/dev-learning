# Strings

## Basics

Strings are immutable — you cannot change a character in place. Every method returns a new string.

```js
const name = 'Victor';
name[0] = 'v';  // does nothing — strings are immutable
```

Three ways to write strings — single quotes, double quotes, and backticks (template literals). The first two are interchangeable. Backticks add extra power.

---

## Template literals

Use backticks to embed expressions and write multiline strings:

```js
const name = 'Victor';
const age = 31;

// Interpolation
const message = `Hello, ${name}. You are ${age} years old.`;

// Any expression inside ${}
const price = `Total: ${(quantity * unitPrice).toFixed(2)} €`;

// Multiline — no need for \n
const html = `
  <div class="card">
    <h2>${name}</h2>
  </div>
`;
```

Always prefer template literals over string concatenation with `+`.

---

## Common methods

### Searching

```js
const text = 'Hello, world!';

text.includes('world')       // true
text.startsWith('Hello')     // true
text.endsWith('!')           // true
text.indexOf('o')            // 4  — first occurrence, -1 if not found
text.lastIndexOf('o')        // 8  — last occurrence
```

### Extracting

```js
const text = 'Hello, world!';

text.slice(7, 12)   // 'world'  — start index, end index (not included)
text.slice(7)       // 'world!' — from index to end
text.slice(-6)      // 'orld!'  — negative index counts from the end
text.at(-1)         // '!'     — last character (modern, cleaner than [length-1])
text.charAt(0)      // 'H'
text.length         // 13
```

### Transforming

```js
'  hello  '.trim()          // 'hello'        — removes whitespace from both ends
'  hello  '.trimStart()     // 'hello  '      — left side only
'  hello  '.trimEnd()       // '  hello'      — right side only

'hello'.toUpperCase()       // 'HELLO'
'HELLO'.toLowerCase()       // 'hello'

'ha'.repeat(3)              // 'hahaha'
'5'.padStart(3, '0')        // '005'  — pad to length 3 with '0'
'5'.padEnd(3, '0')          // '500'
```

### Replacing

```js
'hello world'.replace('world', 'Victor')    // 'hello Victor'  — first match only
'aabbcc'.replaceAll('b', 'x')              // 'aaxxcc'         — all matches
'hello'.replace(/l/g, 'r')                 // 'herro'          — regex with global flag
```

### Splitting and joining

```js
'a,b,c'.split(',')          // ['a', 'b', 'c']  — string to array
'hello'.split('')           // ['h', 'e', 'l', 'l', 'o']
'hello'.split('', 3)        // ['h', 'e', 'l']  — limit

['a', 'b', 'c'].join(',')   // 'a,b,c'  — array to string (opposite of split)
['a', 'b', 'c'].join(' ')   // 'a b c'
['a', 'b', 'c'].join('')    // 'abc'
```

---

## String to number and back

```js
// String to number
Number('42')      // 42
parseInt('42px')  // 42  — stops at first non-numeric character
parseFloat('3.14') // 3.14
+'42'             // 42  — unary plus, shortest way

// Number to string
String(42)        // '42'
(42).toString()   // '42'
(3.14159).toFixed(2)  // '3.14'  — fixed decimal places
```

---

## Common patterns in Angular

```ts
// Build a display name
const fullName = `${employee.firstName} ${employee.lastName}`;

// Truncate for display
const preview = text.length > 100 ? `${text.slice(0, 100)}...` : text;

// Format a date string
const year = isoDate.split('-')[0];  // '2026-05-10' → '2026'

// Check user input
if (!email.includes('@') || !email.includes('.')) { ... }

// Normalize input before saving
const normalized = name.trim().toLowerCase();
```
