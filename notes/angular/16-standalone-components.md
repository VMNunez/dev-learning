# Angular — Standalone Components vs NgModules

Official docs: https://angular.dev/guide/components/importing

## What does "standalone" mean?

Before Angular 14, every component had to belong to a **NgModule**. The module declared the component, imported what it needed, and provided services. In large apps this created complex module trees — and huge `SharedModule` files.

Angular 14 introduced standalone components. A standalone component **declares its own `imports`** instead of depending on a module. Angular 17 made standalone the default for all new projects.

**All of Victor's projects use standalone components.** This is the modern, recommended approach.

---

## The `imports` array on `@Component`

Every directive, component, and pipe you use in the template must be listed in the component's `imports` array.

```typescript
@Component({
  selector: 'app-employee-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    NgClass,
    DatePipe,
  ],
  templateUrl: './employee-list.html',
})
export class EmployeeListComponent {}
```

If you forget an import, Angular gives you a clear error in the console:

```
'mat-button' is not a known element. If 'mat-button' is an Angular component...
```

### What to import for common things

| What you use in the template | What to import |
|---|---|
| `@if`, `@for` | Nothing — Angular 17+ built-in control flow |
| `ngClass`, `NgStyle` | `NgClass`, `NgStyle` from `@angular/common` |
| `routerLink`, `routerLinkActive` | `RouterLink`, `RouterLinkActive` from `@angular/router` |
| `router-outlet` | `RouterOutlet` from `@angular/router` |
| Reactive forms | `ReactiveFormsModule` from `@angular/forms` |
| `[(ngModel)]` | `FormsModule` from `@angular/forms` |
| Any Material component | Its specific module, e.g. `MatButtonModule` |
| Any custom component | The component class directly (e.g. `TaskFilters`) |
| Built-in pipes | The pipe class, e.g. `DatePipe`, `CurrencyPipe` |

---

## NgModules — the old pattern

In a module-based app, you never imported things at the component level. A `NgModule` file managed everything for all components inside it:

```typescript
// OLD pattern — NgModule
@NgModule({
  declarations: [EmployeeListComponent, EmployeeCardComponent],  // register components
  imports: [CommonModule, MatTableModule, RouterModule],          // import modules
  exports: [EmployeeListComponent],                               // expose to others
  providers: [EmployeeService],                                   // register services
})
export class EmployeeModule {}
```

This module had to be imported by `AppModule` before its components could be used anywhere.

### Why Angular moved away from NgModules

- `declarations` + `imports` + `exports` at the module level was confusing — it was not obvious which component needed which import
- Modules were often pass-through files that declared one component and immediately exported it
- Standalone components make dependencies explicit — if you see the import, you know it is used
- Tree-shaking improved — unused code is easier to detect and remove
- Lazy loading became simpler — a single component can be lazy-loaded with `loadComponent:` without needing a module wrapper

---

## Reading legacy code

In an existing enterprise codebase you will see components with no `imports` array:

```typescript
// legacy component — module-based
@Component({
  selector: 'app-employee-list',
  // no standalone: true → it belongs to a NgModule
  // no imports: [] → the module provides what it needs
  templateUrl: './employee-list.html',
})
export class EmployeeListComponent {}
```

You also see `NgModule` files that group these components. To migrate to standalone:

1. Add `standalone: true` (or remove if using Angular 17+ where it is assumed)
2. Add the needed `imports: []` to the component
3. Remove the component from its module's `declarations`
4. If nothing else uses the module, you can delete the module file

---

## `providers` in standalone components

You can scope a service to a component's subtree instead of the whole app:

```typescript
@Component({
  standalone: true,
  providers: [EmployeeService],  // fresh instance only for this component and its children
})
```

`providedIn: 'root'` (the default in services) gives one shared instance for the whole app — correct for almost every case. Component-level providers are rare and only make sense when each route or subtree needs isolated state.

---

## The `standalone: true` flag

In Angular 17+, `standalone: true` is assumed and optional. In Angular 14–16, you had to write it explicitly to opt into standalone mode. When you read older project code, the presence of `standalone: true` tells you the component was intentionally written as standalone in that version.

```typescript
// Angular 14–16 — explicit flag required
@Component({ standalone: true, imports: [...] })

// Angular 17+ — flag is optional, standalone is the default
@Component({ imports: [...] })
```
