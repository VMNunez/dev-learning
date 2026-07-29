# Error Handling

## try / catch / finally

```js
try {
  // code that might throw an error
  const data = JSON.parse(invalidJson);
} catch (error) {
  // runs if an error is thrown in try
  console.error(error.message);
} finally {
  // always runs, whether or not an error occurred
  console.log('done');
}
```

- `try` — the code you want to run
- `catch` — what to do if it fails
- `finally` — cleanup that must always happen (close a connection, hide a spinner)

`finally` runs even if you `return` inside `try` or `catch`.

---

## The Error object

```js
try {
  throw new Error('Something went wrong');
} catch (error) {
  error.message  // 'Something went wrong'
  error.name     // 'Error'
  error.stack    // stack trace — useful for debugging
}
```

### Built-in error types

```js
new TypeError('Expected a string')        // wrong type
new RangeError('Index out of bounds')     // value out of valid range
new ReferenceError('x is not defined')    // accessing undefined variable
new SyntaxError('Unexpected token')       // invalid syntax (usually from eval/JSON.parse)
```

---

## throw

You can throw any value, but always throw an `Error` object so you get a stack trace:

```js
function divide(a, b) {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.error(error.message);  // 'Cannot divide by zero'
}
```

---

## Custom error classes

Extend `Error` to create your own error types — useful for distinguishing errors in `catch`:

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

try {
  throw new ValidationError('Email is required', 'email');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Field ${error.field}: ${error.message}`);
  } else if (error instanceof HttpError) {
    console.log(`HTTP ${error.statusCode}: ${error.message}`);
  } else {
    throw error;  // re-throw unexpected errors
  }
}
```

---

## Error handling in async/await

With async/await, use `try/catch` — it catches both synchronous errors and rejected Promises:

```js
async function loadEmployee(id) {
  try {
    const response = await fetch(`/api/employees/${id}`);

    if (!response.ok) {
      throw new HttpError('Failed to load employee', response.status);
    }

    return await response.json();
  } catch (error) {
    console.error('Load failed:', error.message);
    throw error;  // re-throw so the caller knows it failed
  }
}
```

**Common mistake:** catching an error and then silently swallowing it — the caller has no idea something went wrong. Always either handle it completely (show a message to the user) or re-throw it.

---

## In Angular

Angular uses RxJS `catchError` operator for Observable error handling:

```ts
this.http.get<Employee[]>('/api/employees').pipe(
  catchError(error => {
    this.hasError.set(true);
    return throwError(() => error);
  })
).subscribe({ ... });
```

For signals and regular async code, use `try/catch` in the component or service:

```ts
async loadEmployees() {
  try {
    this.isLoading.set(true);
    const data = await firstValueFrom(this.http.get<Employee[]>('/api/employees'));
    this.employees.set(data);
  } catch {
    this.hasError.set(true);
  } finally {
    this.isLoading.set(false);
  }
}
```

The `isLoading` / `hasError` signal pattern from the HR portal is exactly `try/catch/finally` translated to reactive state.
