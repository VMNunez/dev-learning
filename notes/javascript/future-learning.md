# JavaScript — Future Learning Roadmap

Topics to study once the current 14 files are solid. Nothing here is needed for the first interview — needed to work comfortably in a professional team and grow into a mid-level developer.

---

## Phase 1 — After landing the first job

### Throttling

Debouncing is now fully in coverage — both the concept and the raw `setTimeout`/`clearTimeout` closure implementation, because a vanilla live-coding round asks you to write it. What stays here is **throttling**: running a function at most once every N milliseconds regardless of how often the event fires. It is the sibling pattern, but it is asked far less often at junior level, and in Angular you reach for `RxJS throttleTime()` rather than writing it by hand.

### Writing a custom iterator

**The boundary:** *knowing the iterable protocol* is in coverage — that `for...of`, spread and destructuring all consume `Symbol.iterator`, which is why they work on `Set` and `Map` but throw `TypeError: x is not iterable` on a plain object. What stays here is *implementing* one yourself, which a junior is never asked to do:

```js
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

for (const num of range) console.log(num); // 1 2 3 4 5
```

You will encounter this when reading library source code and when working with RxJS internals.

### Generators

Functions that can pause and resume execution with `yield`:

```js
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}

const gen = idGenerator();
gen.next().value; // 1
gen.next().value; // 2
```

Used internally by some state management libraries. Rarely written by hand in Angular apps, but you will see them in library code.

### Retry and backoff strategies

Retrying a failed request a bounded number of times with an increasing delay, plus request deduplication and circuit-breaker style resilience. Knowing that blind infinite retry is worse than failing fast is worth having as an instinct, but designing the policy is a mid-level concern — at junior level the expected answer is "surface the error to the user".

### Structural sharing and immutability libraries

Immer and Immutable.js make deep updates cheap by reusing the untouched parts of the previous state instead of copying everything. Coverage already carries shallow vs deep copy and `structuredClone`, which is the whole junior surface; this is the library-level strategy you meet in a large state-managed codebase.

### `Object.defineProperty` and property descriptors

Controlling whether a property is writable, enumerable, or configurable, and defining accessors programmatically. This is the older mechanism underneath getters/setters and the reason some library objects behave unexpectedly with `Object.keys` or spread.

### Regex beyond the basics

Lookahead and lookbehind, named capture groups, and the stateful `lastIndex` of a `/g` regex — the last one being why calling `.test()` twice on the same global regex returns alternating results. Coverage carries the flags and `.test`/`.match` surface a junior is actually filtered on.

---

## Phase 2 — After 6–12 months

### `WeakMap` and `WeakRef` — memory-aware data structures

`WeakMap` holds keys by weak reference — if the key object is garbage collected, the entry disappears automatically. Useful for attaching private data to objects without preventing GC.

```js
const cache = new WeakMap();

function process(element) {
  if (cache.has(element)) return cache.get(element);
  const result = heavyComputation(element);
  cache.set(element, result);
  return result;
}
```

You will encounter this in advanced Angular performance patterns and in library internals.

### `Proxy` and `Reflect` — intercepting object operations

`Proxy` wraps an object and intercepts operations (get, set, delete, etc.):

```js
const handler = {
  get(target, key) {
    console.log(`reading property: ${key}`);
    return Reflect.get(target, key);
  }
};

const proxied = new Proxy({ name: 'Victor' }, handler);
proxied.name; // logs "reading property: name", returns "Victor"
```

This is how Vue 3's reactivity system works under the hood. Understanding it gives you a deeper understanding of how frameworks track state changes.

### Advanced closures and memory leaks

Closures keep a reference to their outer scope — if that scope contains large objects or DOM elements, they stay in memory as long as the closure exists. This causes memory leaks in Angular when you forget to unsubscribe from Observables.

Knowing this at a deeper level helps you debug memory issues in long-running apps.

### `Symbol` — unique property keys

Symbols are unique, non-enumerable values. They are used as special property keys to avoid naming collisions:

```js
const id = Symbol('id');
const user = { [id]: 42, name: 'Victor' };

user[id];           // 42
Object.keys(user);  // ['name'] — Symbol properties are hidden
```

The built-in well-known symbols (`Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.hasInstance`) are how JavaScript lets you customise language behaviour for your own objects.

---

## Phase 3 — Mid-level

### Async generators

Combine generators with async/await — useful for streaming data:

```js
async function* paginate(url) {
  let page = 1;
  while (true) {
    const data = await fetch(`${url}?page=${page}`).then(r => r.json());
    if (!data.length) break;
    yield data;
    page++;
  }
}

for await (const page of paginate('/api/items')) {
  console.log(page);
}
```

Relevant when building data pipelines or working with streaming APIs.

### JavaScript engine internals (V8)

Understanding how V8 compiles and optimises JavaScript — hidden classes, inline caches, JIT compilation. This knowledge helps you write code that the engine can optimise well and avoid patterns that accidentally deoptimise hot paths.

Not needed until you are working on performance-critical code.

---

## What NOT to study prematurely

- **WebAssembly** — running compiled C++/Rust in the browser. Only relevant in very specific performance-critical domains (games, image processing). Not needed in Angular + Spring Boot apps.
- **Service Workers / PWA** — making web apps work offline. Useful but a separate specialisation. Study only if a project explicitly requires it.
- **Web Workers** — running JavaScript in a background thread. Relevant only when you have genuinely CPU-heavy work on the frontend, which is rare in Angular business apps.
- **TC39 proposals (stage 0–2)** — JavaScript features that are not finalised yet. Follow them passively if you are curious, but do not study them as they can change or be dropped before reaching the language.
