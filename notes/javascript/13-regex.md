# Regular Expressions

A regular expression (regex) is a pattern used to search, validate, or replace text. In JavaScript you will use them most in form validation — Angular's `Validators.pattern()` takes a regex.

---

## Creating a regex

```js
const pattern = /hello/;           // literal syntax — most common
const pattern = new RegExp('hello'); // constructor — use when the pattern comes from a variable
```

### Flags

Flags go after the closing `/` and change how the match works.

```js
/hello/i    // i — case insensitive: matches "Hello", "HELLO", "hello"
/hello/g    // g — global: find ALL matches, not just the first
/hello/gi   // combine flags
```

---

## Testing and matching

### `.test()` — does the pattern match? Returns boolean

```js
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailPattern.test('user@example.com');  // true
emailPattern.test('not-an-email');       // false
```

Use `.test()` when you only need to know yes or no — for validation.

### `.match()` — extract the matches. Returns array or null

```js
const text = 'Call 123-456-7890 or 098-765-4321';
const phonePattern = /\d{3}-\d{3}-\d{4}/g;

text.match(phonePattern);  // ['123-456-7890', '098-765-4321']
'no numbers'.match(phonePattern);  // null
```

### `.replace()` — replace matched text

```js
'Hello World'.replace(/world/i, 'Victor');  // 'Hello Victor'
'aaa bbb ccc'.replace(/\s+/g, '-');         // 'aaa-bbb-ccc'
```

---

## Pattern syntax — the essentials

| Symbol | Meaning | Example |
|--------|---------|---------|
| `.` | Any character except newline | `/c.t/` matches "cat", "cut", "c3t" |
| `\d` | Any digit (0–9) | `/\d+/` matches "123" |
| `\w` | Any word character (a-z, A-Z, 0-9, _) | `/\w+/` matches "hello_123" |
| `\s` | Any whitespace | `/\s/` matches space, tab |
| `^` | Start of string | `/^Hello/` must start with "Hello" |
| `$` | End of string | `/world$/` must end with "world" |
| `+` | One or more | `/\d+/` matches "1", "123", "9999" |
| `*` | Zero or more | `/\d*/` matches "" or "123" |
| `?` | Zero or one | `/colou?r/` matches "color" and "colour" |
| `{n}` | Exactly n times | `/\d{4}/` matches exactly 4 digits |
| `{n,m}` | Between n and m times | `/\d{2,4}/` matches 2, 3, or 4 digits |
| `[abc]` | Any of these characters | `/[aeiou]/` matches any vowel |
| `[^abc]` | None of these characters | `/[^0-9]/` matches anything not a digit |
| `(abc)` | Group | `/(ab)+/` matches "ab", "abab" |
| `\|` | Or | `/cat\|dog/` matches "cat" or "dog" |

---

## Common patterns

```js
// Email — good enough for most forms
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Numbers only
/^\d+$/

// Numbers with optional decimal
/^\d+(\.\d+)?$/

// Spanish phone (9 digits)
/^\d{9}$/

// Minimum 8 characters, at least one letter and one number
/^(?=.*[A-Za-z])(?=.*\d).{8,}$/

// No spaces allowed
/^\S+$/
```

---

## Angular — `Validators.pattern()`

Pass a regex to `Validators.pattern()` to validate a form field:

```ts
// In a reactive form
this.form = new FormGroup({
  phone: new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{9}$/)   // exactly 9 digits
  ]),
  email: new FormControl('', [
    Validators.required,
    Validators.email                 // Angular has a built-in email validator
  ])
});
```

```html
<!-- Show the error -->
<mat-error *ngIf="form.get('phone')?.hasError('pattern')">
  Phone must be 9 digits
</mat-error>
```

`Validators.email` is simpler for email. Use `Validators.pattern()` for custom rules — phone formats, no spaces, alphanumeric only.

---

## When to use regex

| Situation | Regex? |
|-----------|--------|
| Validate a phone format | Yes — `Validators.pattern(/^\d{9}$/)` |
| Validate an email | No — use `Validators.email` |
| Check if a string is all digits | Yes — `/^\d+$/.test(value)` |
| Check if a string includes a word | No — use `.includes()` |
| Replace multiple spaces with one | Yes — `str.replace(/\s+/g, ' ')` |
| Extract numbers from a string | Yes — `str.match(/\d+/g)` |
