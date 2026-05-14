# Modules

## What is a module?

A module is a file that explicitly exports what it wants to share and imports what it needs from other files. Before modules, everything was in the global scope — any script could access and overwrite any variable. Modules fix this by giving each file its own private scope.

Every Angular file is a module — components, services, pipes, guards all use `import` and `export`.

---

## Named exports

You can export multiple things from one file:

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;
```

```js
// main.js
import { add, subtract, PI } from './math.js';
import { add as sum } from './math.js';  // rename with 'as'
import * as math from './math.js';       // import all as namespace
math.add(1, 2);
```

---

## Default export

One default export per file — the "main thing" the file provides:

```js
// employee.service.js
export default class EmployeeService {
  getAll() { ... }
}
```

```js
// main.js
import EmployeeService from './employee.service.js';      // any name works
import MyService from './employee.service.js';            // also valid
```

---

## Named vs default — when to use each

| | Named export | Default export |
|---|-------------|----------------|
| Per file | Multiple allowed | Only one |
| Import syntax | `import { name }` | `import anything` |
| Refactoring safety | Better — editors auto-rename | Riskier — name is arbitrary |
| Angular convention | Always | Never in Angular |

**Angular never uses default exports.** Everything is a named export:

```ts
// Angular convention — always named
export class EmployeeComponent { ... }
export class EmployeeService { ... }
export interface Employee { ... }
```

---

## Re-exporting

Export something from another module without importing it into the current file's scope:

```js
// index.ts — a barrel file
export { EmployeeComponent } from './employee.component';
export { EmployeeService } from './employee.service';
export { Employee } from './employee.model';
```

This is the **barrel pattern** — one `index.ts` per folder that re-exports everything. Imports become cleaner:

```ts
// Without barrel
import { EmployeeComponent } from './employees/employee.component';
import { EmployeeService } from './employees/employee.service';

// With barrel
import { EmployeeComponent, EmployeeService } from './employees';
```

---

## Dynamic imports

Load a module only when it is needed — not at startup:

```js
const button = document.querySelector('button');

button.addEventListener('click', async () => {
  const { default: Chart } = await import('./chart.js');  // loads only on click
  new Chart();
});
```

**In Angular this is called lazy loading** — Angular uses dynamic imports under the hood when you use `loadComponent:` in routing:

```ts
{
  path: 'employees',
  loadComponent: () => import('./employees/employee-list.component')
    .then(m => m.EmployeeListComponent)
}
```

The component code only downloads when the user navigates to `/employees` — the initial bundle is smaller and the app starts faster.

---

## Tree-shaking

When you build an Angular app for production, the bundler (esbuild / webpack) removes all exported code that is never imported anywhere. This is called tree-shaking.

Named exports enable tree-shaking — the bundler can see exactly what is and is not used. Default exports are harder to analyse and can reduce tree-shaking effectiveness.

This is one reason Angular always uses named exports.
