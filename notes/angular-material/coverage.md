# Minimum Coverage — Angular Material

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the projects. Angular Material is standard in Spanish consultancies — interviewers expect you to have used it in a real app, not just read the docs.

---

## Setup and module wiring

- `ng add @angular/material` — the correct way to install Angular Material; interviewers may ask what it does (adds the package, configures theming, imports fonts and icons in `index.html`)
- `ng add` vs `npm install @angular/material` — `ng add` runs a schematic that edits `angular.json`, `index.html` and the app config; `npm install` only downloads the package; interviewers ask why Material "doesn't work at all" after a plain install
- Standalone `imports: []` array — every Material component or directive used in a template must be listed in that component's own `imports`; interviewers ask why a Material component renders as plain markup when the import is missing
- Missing component module vs missing directive module — a missing component module fails loudly (`'mat-x' is not a known element`), a missing directive module (`matInput`, `matTooltip`, `matButton`) fails silently with unstyled output; interviewers ask why an input "looks wrong" but nothing errors
- Mapping a symbol back to its `Mat*Module` — `mat-option` comes from `MatSelectModule`, `matInput` from `MatInputModule` (not `MatFormFieldModule`); interviewers test whether you can unblock yourself without searching
- `MatFormFieldModule` + `MatInputModule` as a required pair — importing one without the other leaves the field broken; the most common first-render failure in a take-home
- `provideAnimations()` / `provideAnimationsAsync()` in `app.config.ts` — dialogs, menus and ripples depend on it; interviewers ask which app-level provider Material needs before anything animates
- `provideNativeDateAdapter()` in `app.config.ts` — required for `MatDatepicker`; missing it causes a runtime error; interviewers test whether you know where providers go in a standalone app
- Angular Material vs Angular CDK — the CDK is the unstyled behaviour layer (overlay, a11y, portal, table) that Material is built on; interviewers ask what the CDK is and when you would use it directly
- Shared `MaterialModule` barrel — the pre-standalone pattern still found in legacy consultancy codebases; interviewers ask what it was for and why a v19 app imports per component instead (tree-shaking, explicit dependencies)
- `ng update @angular/material` — the migration schematic that rewrites deprecated APIs and theme syntax on a major bump, and the things it cannot fix for you (custom overrides of internal classes); interviewers ask how you would upgrade the Material app you inherited
- Angular Material vs PrimeNG, ng-zorro, or a hand-built component set — interviewers ask why a consultancy standardises on Material and what you would argue when the client already owns a design system

---

## Theming — palettes and tokens

- `mat.theme()` in `material-theme.scss` — the v19+ way to define the app's color palette; interviewers ask why you use this instead of overriding CSS classes directly (CSS variables, upgrade-safe)
- Context-specific theme — scoping `mat.theme()` to a CSS class (e.g. `.btn-danger`) to apply a different palette to one component; interviewers ask how to make a red delete button without hardcoding colors
- `mat.$red-palette` and other prebuilt palettes — used inside a scoped `mat.theme()` to change a component's color variant; interviewers ask which approach to use vs `var(--mat-sys-error)` for a single color
- `--mat-sys-*` design tokens — the CSS custom properties `mat.theme()` emits; interviewers ask how you reuse the app's palette inside your own components' CSS instead of hardcoding hex values
- Typography and density options in `mat.theme()` — the same mixin controls the font stack and how compact components are; interviewers ask how you fit more rows on an enterprise data screen without overriding heights by hand
- Generating a theme from the client's brand colour — the palette is derived from a source hex rather than picked from the prebuilt set; interviewers ask what you do when the corporate blue is not one of Material's palettes
- Angular Material vs Bootstrap or Tailwind — interviewers ask why a consultancy app picks a component library (accessible, tested components, design consistency) and what you give up (bundle size, opinionated look, harder visual customisation)
- When NOT to use a Material component — plain HTML and CSS for simple layout, static text, or a purely decorative box; interviewers ask why you would not import `MatCardModule` just to draw a border

---

## Theming — legacy syntax, dark mode and overrides

- Material Design 2 vs Material Design 3 — the design-system generation behind the API you are looking at; M2 apps configure theme *maps* in Sass, M3 apps emit CSS *system tokens*; interviewers ask which generation the codebase is on and what changed for you as a developer
- Legacy theme syntax (`mat.define-palette()`, `mat.define-light-theme()`, `@include mat.all-component-themes($theme)`) — the shape of most existing consultancy codebases; interviewers hand you that Sass file and ask you to read it and describe the path to `mat.theme()`
- Prebuilt theme CSS in `angular.json` styles (e.g. `indigo-pink.css`) vs a custom Sass theme — the prebuilt file is what `ng add` wires up by default; interviewers ask when a real project has to move off it
- Dark mode with `mat.theme()` — one theme definition plus a `color-scheme` and a root class or `prefers-color-scheme` query, rather than a duplicated set of styles; interviewers ask how you ship a theme switcher without writing every rule twice
- The theme stylesheet must be global — a theme included only inside a component's stylesheet never reaches the CDK overlay container, so dialogs, menus and selects render unthemed; interviewers ask why the dialog came out white in a dark app
- `[color]="primary | accent | warn"` — the M2-era colouring input, reduced or removed for many components under M3; interviewers show it in a snippet and ask whether it still does anything in a v19 app
- `mat.<component>-overrides()` mixins — the supported per-component token API for changing one component's radius, height, or colour; interviewers ask the safe way to restyle the card without touching `.mat-mdc-card`

---

## Form fields

- `mat-form-field` — wrapper that gives Material styling to an input; interviewers ask why it must always contain a control (`matInput` or `mat-select`) and cannot be used alone
- `mat-label` — floating label that animates up when the field has focus or a value; interviewers ask what makes it float (focus or non-empty value)
- `matInput` — directive on `<input>` or `<textarea>` to style it inside `mat-form-field`; interviewers ask why you write `matInput` on a native `<input>` instead of using a Material component directly
- `mat-error` — shows validation error text; interviewers ask when it appears by default (invalid + touched) and how to change that behaviour (`ErrorStateMatcher`)
- `mat-hint` — helper text always visible below the field; interviewers ask the difference between `mat-hint` and `mat-error` (hint is always visible; error appears conditionally)
- `mat-label` vs `placeholder` — a placeholder disappears as soon as the user types and is not announced as the control's label; interviewers ask why placeholder-as-label is an accessibility failure
- `appearance="fill"` vs `appearance="outline"` — the two supported values in current Material and what an enterprise form typically uses; interviewers ask what happens with an unsupported value
- `subscriptSizing="dynamic"` on `mat-form-field` — removes the reserved space for hint/error; interviewers ask why a form field and a button won't align vertically in a flex row (the reserved space is the reason)
- `ErrorStateMatcher` — interface that controls when `mat-error` appears; interviewers ask how to make errors show only after the user clicks submit, not on blur — this is a standard dialog pattern
- `mat-error` placed outside `mat-form-field` — renders as unstyled text and is never tied to the control's `aria-describedby`; interviewers test placement
- `matPrefix` and `matSuffix` — place an icon, a currency symbol, or a password-visibility toggle inside the field rather than beside it; interviewers ask how you build a show/hide password input without breaking the floating label
- Several `mat-error` elements on one field — Material renders only the first *visible* one, so each message must be gated on its own error key with `@if`; interviewers ask how "required" and "invalid format" show up as distinct messages instead of one always winning
- The `required` attribute vs `Validators.required` — the attribute draws the asterisk, the validator is what actually blocks submission, and a field carrying only one of them looks or behaves wrong; interviewers show a field marked required that submits empty and ask which half is missing

---

## Material with reactive forms

- `ControlValueAccessor` — the interface every Material control implements, which is why `formControlName` binds to `matInput`, `mat-select` and `mat-checkbox` unchanged; interviewers ask what makes a component usable inside a reactive form
- `ReactiveFormsModule` in the standalone `imports` — omitting it makes `formGroup` an unknown attribute and the form silently never binds; interviewers ask what error you actually get
- `formControlName` without an enclosing `[formGroup]` — throws `formControlName must be used with a parent formGroup`; a classic snippet bug in the code-review round
- `[disabled]` on a `formControlName` control — triggers Angular's reactive-forms warning; the correct way is `control.disable()`; a gotcha interviewers use to separate copy-paste from understanding
- Server-side validation errors in `mat-error` — calling `setErrors()` on the control after an API 400; interviewers ask how a backend "email already exists" error reaches the Material field
- Cross-field validation with Material — a `FormGroup`-level validator (e.g. password confirmation) has no single field to attach `mat-error` to; interviewers ask where that message is rendered
- `FormArray` with Material — rendering N repeated `mat-form-field` rows the user can add and remove; interviewers ask how a dynamic form is built

---

## Select and options

- `mat-select` + `mat-option` — styled dropdown inside `mat-form-field`; interviewers ask the difference between `value="pending"` (literal string) and `[value]="status"` (property binding from a variable)
- `(selectionChange)` vs `[(value)]` — `selectionChange` fires on user pick and requires a method; `[(value)]` is two-way binding and keeps the signal in sync automatically; interviewers ask when to use each
- `mat-optgroup` — groups options under a label; interviewers may ask how to visually separate options without disabling them
- `multiple` attribute on `mat-select` — makes the value an array; interviewers ask what changes in the form value when `multiple` is enabled
- `[compareWith]` on `mat-select` — required when options are objects, because the pre-selected value is a different reference than the option; interviewers ask why an edit dialog shows an empty select even though the value is set
- Form value vs displayed text — `mat-select` stores the bound `[value]`, not the option's label; interviewers ask what actually gets sent to the API when options are objects
- `mat-option` used outside `mat-select` or `mat-autocomplete` — renders unstyled and does nothing; interviewers ask what parent an option requires
- A select with thousands of options — every `mat-option` is a real DOM node, so the dropdown freezes the browser; the answer is a server-side searched autocomplete or CDK virtual scroll, not a bigger select; interviewers ask what happens to your status dropdown when the lookup table has 5,000 rows

---

## Autocomplete and chips

- `mat-autocomplete` + `[matAutocomplete]` on a `matInput` — the type-ahead control; interviewers ask which Material component you reach for on a "search as you type" field and why it is not `mat-select` (the user types free text, the option list is filtered and may come from the server)
- `[displayWith]` on `mat-autocomplete` — the function that converts the selected object back into the text shown in the input; interviewers ask why the field shows `[object Object]` after picking an option
- `requireSelection` on `mat-autocomplete` — clears text the user typed but never selected, so the control cannot hold a string that matches no option; interviewers ask what the form submits when the user types half a name and tabs away
- Validating that an autocomplete holds a real option — a custom validator comparing the control value against the option list, for the cases `requireSelection` does not cover; interviewers ask how you stop an invalid free-text value reaching the API
- `mat-chip-grid` + `matChipInput` — the input-style chip list bound to a `FormControl`, used for tag and recipient fields; interviewers ask how you build a "add a tag and press Enter" input
- `mat-chip-set` vs `mat-chip-listbox` vs `mat-chip-grid` — display-only, selectable, and editable-input variants of the same visual element; interviewers ask which one a read-only filter summary uses and which one a tag editor uses

---

## Table — structure

- `mat-table` attribute on `<table>` — turns a native table into a Material table; interviewers ask what the four required pieces are (`displayedColumns`, `ng-container matColumnDef`, `*matCellDef`, the two `<tr>` rows at the bottom)
- `matColumnDef` on `ng-container` — defines one column; value must match exactly one string in `displayedColumns`; interviewers ask what happens if the name doesn't match (column does not render)
- `*matHeaderCellDef` / `*matCellDef` — structural directives that define the header and data cell templates for a column; interviewers ask why both are needed
- `*matHeaderRowDef` / `*matRowDef` — render the header row and one data row per item; both reference `displayedColumns`; interviewers ask why you don't need to change these when adding or removing columns
- `*matNoDataRow` — empty state row shown when `dataSource` has no items; interviewers ask why `[attr.colspan]="displayedColumns.length"` is used (to span all columns)
- `<table mat-table>` vs `<mat-table>` — the native-table and flex rendering modes; interviewers ask why mixing `<tr>` row definitions with the flex form breaks the layout
- `trackBy` on `matRowDef` — tells Angular how to identify a row so it is not destroyed and rebuilt on every refresh; interviewers ask why the whole table flickers when data reloads
- `@if` vs `computed()` for conditional columns — wrapping `ng-container matColumnDef` in `@if` causes a Material error because the column is never registered; the correct pattern is `displayColumns = computed(...)` that includes or excludes the column name
- Sticky header and sticky columns — `sticky` on the header row definition and `sticky` / `stickyEnd` on a `matColumnDef`; interviewers ask how the header stays visible down a long table and what the scroll container must provide for it to work
- Expandable detail rows — `multiTemplateDataRows` on the table plus a second `matRowDef` with a `when` predicate; interviewers ask how a row expands to reveal detail without opening a dialog
- A row-level click competing with a control inside the row — the button's event bubbles to the row handler unless you call `$event.stopPropagation()`; interviewers show a delete button inside a clickable row and ask why deleting also navigates

---

## Table — data source and data flow

- `MatTableDataSource` — wrapper around an array that handles sorting, filtering, and pagination; interviewers ask why you use it instead of a plain array (automatic sort + paginate behaviour)
- `MatTableDataSource` with `effect()` — when data comes from a signal input, use `effect()` to assign `dataSource.data = tasks()` and keep the source in sync
- Raw array bound to `[dataSource]` while `sort` and `paginator` are assigned — sorting and paging silently do nothing because they only work through `MatTableDataSource`; interviewers show this and ask why clicking a header has no effect
- Mutating the array in place instead of reassigning `dataSource.data` — the table does not re-render; interviewers ask why a newly pushed row never appears
- `filterPredicate` on `MatTableDataSource` — customises which fields the filter string matches; interviewers ask how to filter on one column only instead of the whole row
- Client-side vs server-side sorting and pagination — `MatTableDataSource` sorts and pages an in-memory array; interviewers ask what changes when the API paginates (bind `[length]`, react to `(page)`, drop the in-memory data source)
- `mat-table` vs a plain `<table>` vs a grid library — interviewers ask when Material's table is enough and what you would do with a hundred thousand rows
- `sortingDataAccessor` on `MatTableDataSource` — customises which value is read when sorting, which is what makes a nested property or a date string sort correctly; interviewers ask why clicking the header of a `user.name` column reorders nothing
- The default `filterPredicate` behaviour — it concatenates every field into one lowercase string, so the filter term must be lowercased and trimmed before assignment; interviewers ask why searching "Ana" returns no rows while "ana" works
- `SelectionModel` from `@angular/cdk/collections` — the supported holder for multi-row selection, including the header select-all and its indeterminate state; interviewers ask how you build bulk delete on a table
- Server-side sorting with `(matSortChange)` — you stop assigning `dataSource.sort` and instead send the active column and direction to the API; interviewers ask what the request looks like and why the in-memory sort must be disabled at the same time

---

## Sorting

- `MatSort` + `MatSortModule` — add column sorting to a Material table; interviewers ask the difference between `MatSort` (the class, needed for `@ViewChild`) and `MatSortModule` (the module, needed in the `imports` array)
- `matSort` on `<table>` and `mat-sort-header` on `<th>` — `mat-sort-header` goes on the `<th>` element, not on the `ng-container`; a common mistake interviewers test for
- `@ViewChild(MatSort)` in `ngAfterViewInit` — interviewers ask why you must connect `dataSource.sort = this.sort` in `ngAfterViewInit` and not in the constructor (template doesn't exist yet in the constructor)
- `matSortActive` + `matSortDirection` — set the initially sorted column declaratively; interviewers ask how a table can arrive already sorted
- Column name vs data property key — `MatSort` sorts by the `matColumnDef` name, so a mismatch with the object's property leaves the header toggling with no reordering; interviewers ask what `MatSort` actually reads
- View encapsulation and `styles.css` — sort header internals cannot be styled from component CSS because Angular's scoped attributes don't reach directive-generated elements; global `styles.css` is required; interviewers ask why centering a sort header column from component CSS doesn't work
- `disableClear` and the three-state sort cycle — by default a header cycles ascending → descending → unsorted, and `disableClear` removes that third state; interviewers ask whether a table should be allowed to return to "no sort" and what the user sees in each case

---

## Paginator

- `MatPaginator` + `MatPaginatorModule` — adds page controls to a table; same `@ViewChild` + `ngAfterViewInit` pattern as `MatSort`; interviewers ask why the paginator must be placed outside and after the `</table>` closing tag
- `[pageSize]` + `[pageSizeOptions]` — configure default rows per page and the size options the user can pick
- `[length]` on `MatPaginator` — the total row count, required when the API pages server-side; interviewers ask why the page count is wrong when the response only contains one page
- Reset to first page after filter — `this.dataSource.paginator.firstPage()` after applying a filter; interviewers ask what happens without it (user stays on the page they were on, which may now be empty)
- `@ViewChild` on an element inside `@if` — the reference is `undefined` in `ngAfterViewInit` because the element does not exist yet; interviewers show a paginator inside a loading `@if` and ask why it never binds
- `MatPaginatorIntl` — the injection token that supplies the paginator's labels; interviewers at Spanish consultancies ask how you translate "Items per page" to Spanish
- The `@ViewChild` setter pattern for sort and paginator — assigning inside a setter (`@ViewChild(MatPaginator) set paginator(p) { ... }`) keeps working when the element appears later because it was inside an `@if` or arrived after loading, which `ngAfterViewInit` alone does not; interviewers ask for the robust alternative once the table is behind a loading flag
- Client-side `MatPaginator` vs paging driven by the API — deciding by dataset size and by who owns filtering: in-memory paging is one line and dies past a few thousand rows, server paging needs `[length]`, a `(page)` handler and query params but is the only option at scale; interviewers ask where your cut-off is and why

---

## Tabs, cards and expansion panels

- `mat-card` structure — `mat-card-header`, `mat-card-content`, `mat-card-actions`; interviewers ask what each section is for and which are optional
- `appearance="outlined"` vs default `raised` — `outlined` is flat with a border; `raised` has a shadow; interviewers ask when to use each (outlined for forms and panels; raised for stat cards that need to stand out)
- `mat-tab-group` + `mat-tab` — the tabbed panel every settings and detail screen ends up needing; interviewers ask how you build one and how it differs from routing to separate pages
- `<ng-template matTabContent>` — makes a tab's content build only when the tab is first opened; without it every tab renders on load and all four fire their HTTP calls at once; interviewers ask why opening the page triggered four requests
- A tab selection that survives a reload — binding `[selectedIndex]` and `(selectedIndexChange)` to a query param so the tab is linkable and the back button behaves; interviewers ask why resetting to tab 0 on refresh counts as a defect
- `mat-expansion-panel` and `mat-accordion` (with `multi`) — collapsible sections for a long settings or summary page; interviewers ask when an accordion is a better fit than tabs (many sections, several open at once, no equal footing)

---

---

## Dialog

- `MatDialog` service + `MatDialogRef` — the two-part system for dialogs; `MatDialog` is injected in the parent to open; `MatDialogRef` is injected in the dialog to close and return data
- `dialog.open(ComponentClass, config)` — interviewers ask what the first argument is (the component class itself, not a string or template)
- `afterClosed().subscribe()` — where the parent listens for the dialog result; interviewers ask what value is emitted when the user clicks Cancel or clicks outside (`undefined`)
- `MAT_DIALOG_DATA` — injection token to read data passed from the parent into the dialog; interviewers ask how the dialog knows it is in add vs edit mode (check if `data` is `null`)
- `patchValue()` vs `setValue()` — `patchValue()` fills only the fields you pass; `setValue()` requires all fields; interviewers ask which one to use when pre-filling a dialog for edit
- `mat-dialog-title` / `mat-dialog-content` / `mat-dialog-actions` — must be siblings, never nested; interviewers ask what breaks if you nest them (Material applies different padding and scroll to each — nesting corrupts the layout)
- `mat-dialog-close` attribute on Cancel button — closes the dialog immediately with no data and no TypeScript needed; interviewers ask when you would replace it with a custom `onCancel()` method (when you need to check for unsaved changes)
- `disableClose: true` in the dialog config — blocks Esc and backdrop dismissal; interviewers ask how you stop a user losing typed data by clicking outside a form dialog
- `autoFocus: false` in the dialog config — prevents the focus ring appearing on the first button when the dialog opens; interviewers ask why a button looks selected when the dialog opens (autoFocus is on by default)
- Confirmation dialog pattern — reusable dialog that takes `title`, `message`, `confirmLabel` as `MAT_DIALOG_DATA` and returns `true` on confirm; interviewers ask where the destructive action button goes (always last, on the right)
- Typing the dialog generically — `dialog.open<TComponent, TData, TResult>(...)` is what makes `afterClosed()` emit a typed result instead of `any`; interviewers ask how the caller knows the shape of what came back
- Dialog sizing and small screens — a fixed `width: '600px'` makes the dialog unusable on a phone, so real config pairs it with `maxWidth: '95vw'` and a `maxHeight`; interviewers ask what happens to your dialog on mobile

---

## Snackbar

- `MatSnackBar` is a service — no `imports` array entry needed; interviewers ask how it differs from other Material components (it is injected directly, not declared in imports)
- `snackBar.open(message, actionLabel, { duration })` — the three parameters; interviewers ask what happens if `duration` is omitted (snackbar stays open until the user clicks the action)
- `MatSnackBar` vs `MatDialog` — snackbar does not block the user and closes automatically; dialog blocks the user and requires interaction; interviewers ask which to use after a successful form submit (snackbar)
- Coordinator pattern for snackbar — always call `snackBar.open()` in the page component after `afterClosed()` returns a result, never inside the dialog; interviewers ask why calling it inside the dialog is wrong (the dialog doesn't know if the save succeeded)
- `panelClass` on a snackbar — the supported way to style it, because the snackbar renders in the overlay container where component CSS never reaches; interviewers ask why a custom success/error colour silently has no effect
- `openFromComponent()` + `MAT_SNACK_BAR_DATA` — how you render a snackbar with an icon or any markup, once `open(message, action)` is not enough; interviewers ask how you show a branded error toast
- `snackBarRef.onAction()` — the stream that fires when the user clicks the action label, which is how "Undo" after a delete is implemented; interviewers ask how you give the user a way back from a destructive action
- Only one snackbar shows at a time — opening a second immediately dismisses the first, so two operations finishing together lose a message; interviewers ask what the user actually sees when a bulk save reports per-item results

---

## Buttons and icons

- `matButton` variants (`filled`, `outlined`, `elevated`, `tonal`) — when to use each; interviewers ask which variant is for the primary action (`filled`) and which for secondary (`outlined`)
- `<button mat-button>` (component syntax, pre-v19) vs `matButton` (directive on a native button, v19+) — interviewers show the old form in a modern app and ask which is current
- `matIconButton` — circle icon-only button used in table rows and toolbars; interviewers ask why you pair it with `aria-label` (no visible text — screen readers need the description)
- `matFab` / `matMiniFab` — floating action button for the one dominant page action; interviewers ask when you would use FAB vs a regular button
- `matButton` on a `<div>` — the element is not focusable or keyboard-activatable; interviewers ask why a "button" cannot be reached with Tab
- `disabled` on a Material button does not stop a click on a wrapping element — the event still reaches a clickable parent row; interviewers show a disabled button inside a clickable row and ask why the row action still fires
- `<mat-icon>` — how Material icons work; icon names come from Google Material Symbols; interviewers may ask how you add an icon to a button and where the font is loaded
- `<mat-icon>` rendering the literal word instead of a glyph — the Material Symbols font link is missing from `index.html`; interviewers show the broken output and ask what is missing
- Material Icons vs Material Symbols — the two icon fonts have different names and ligatures, which is why every icon breaks at once after an upgrade or a copied `index.html`; interviewers show a page of literal words and ask which font the app is actually loading
- `MatIconRegistry.addSvgIcon()` with `DomSanitizer.bypassSecurityTrustResourceUrl` — how the designer's own SVG set becomes usable as `<mat-icon svgIcon="logo">`; interviewers ask why the sanitizer call is required and whether it is safe here (it is, because the URL is yours, not user input)
- Icon font vs self-hosted SVG icons — the Google font link is a request to an external CDN, which fails on an air-gapped intranet and is often blocked by a bank's CSP or privacy review; interviewers on enterprise accounts ask why an internal app does not use the CDN link

---

## Navigation shell — Toolbar, Sidenav

- `mat-toolbar` — persistent app header; `justify-content: space-between` or a flex spacer element (`flex: 1 1 auto`) to push title left and actions right; interviewers ask how to position items on opposite sides
- `mat-sidenav-container` / `mat-sidenav` / `mat-sidenav-content` — the three-element structure that is always required; interviewers ask what each one does and why you cannot put just `mat-sidenav` on its own
- `mode="side"` vs `mode="over"` — `side` shows next to content with no backdrop; `over` floats above content with a backdrop; interviewers ask which mode an enterprise app shell uses
- `[opened]="!!currentUser()"` — how to show/hide the sidenav reactively; `!!` converts `User | null` to `boolean`; interviewers ask why `[opened]="currentUser()"` causes a type error
- Keep `mat-sidenav-container` always in the DOM — if you wrap it in `@if`, the `router-outlet` inside disappears on logout; the sidenav itself uses `[opened]` to hide; interviewers ask why the login page goes blank after logout (container was removed)
- Full-height app shell CSS — the height chain (`html → body → app-root → mat-sidenav-container`); `overflow: hidden` on `app-root` is the key rule; interviewers ask why the toolbar scrolls away with the content (missing `overflow: hidden`)
- `mat-nav-list` + `mat-list-item` — correct elements for navigation links inside the sidenav; interviewers ask what `routerLinkActive` adds (a CSS class when the route matches)
- `mat-nav-list` vs `mat-list` for links — `mat-list` renders items that are not navigable or announced as links; interviewers ask the difference and why it matters for a screen reader
- `routerLinkActive` + `[activated]` pattern — `#rla="routerLinkActive"` gives access to `rla.isActive`, which is passed to Material's built-in active style via `[activated]`; interviewers ask the difference between the class approach and the `[activated]` approach
- `BreakpointObserver` — CDK service used to switch the sidenav between `side` and `over` by viewport width; interviewers ask how the app shell adapts on mobile

---

## Menu

- `mat-menu` + `MatMenuModule` — a dropdown list of actions triggered by a button; interviewers ask when to use it over several separate `matIconButton` elements in a table row (too many actions to show inline, or actions that need labels)
- `[matMenuTriggerFor]="menuRef"` — connects a trigger button to the menu using a template reference variable; interviewers ask how the button knows which menu to open when there are several menus on the same page (one `#ref` per row)
- `mat-menu-item` — each clickable row inside the menu; behaves like a button and can call a method directly with `(click)`
- `[matMenuTriggerData]` — passes per-row context to a single shared menu template; interviewers show every row opening the same menu with the wrong item and ask how the row data is supplied

---

## Datepicker

- `MatDatepicker` three-element structure — `[matDatepicker]="ref"` on the input, `<mat-datepicker-toggle [for]="ref">` for the icon, and `<mat-datepicker #ref>` as the popup; interviewers ask why all three are needed
- Value is a `Date` object, not a string — when the `FormControl` is typed as `string | null`, the cast requires `as unknown as Date`; interviewers ask how to format the date for an API call (`.toISOString().split('T')[0]`)
- `MAT_DATE_LOCALE` set to `es-ES` — the calendar and, crucially, the *parser* follow this token, so without it a Spanish user typing `31/12/2026` gets a validation error because the field is reading it as month 31; interviewers at Spanish consultancies ask why the date input rejects a perfectly valid date
- `DateAdapter` implementations (native vs Luxon vs Moment) and `MAT_DATE_FORMATS` — the adapter decides what a "date" is and the formats token decides how it is displayed and parsed, independently of the locale; interviewers ask how you get `dd/MM/yyyy` on screen while the API receives ISO
- `[min]`, `[max]` and `[matDatepickerFilter]` — restricting the selectable range and blocking individual days such as weekends; interviewers ask how you stop a booking form accepting a past date
- The datepicker's own error keys (`matDatepickerParse`, `matDatepickerMin`, `matDatepickerMax`) — which `mat-error` fires depends on whether the user typed something unparseable or picked something out of range; interviewers ask how you show a different message for each
- The timezone off-by-one — the picker returns local midnight, so `toISOString()` shifts the date back a day for any negative UTC offset and forward for some positive ones; interviewers ask why the saved date is one day earlier than the one the user clicked
- `mat-date-range-input` + `mat-date-range-picker` — a start/end pair bound to a `FormGroup` with `matStartDate` and `matEndDate`; interviewers ask how you build a "from–to" filter on a report screen

---

## Stepper

- `[linear]="true"` + `[stepControl]="formGroup"` — forces the user to complete each step in order; interviewers ask what `[linear]="true"` does without `[stepControl]` (allows skipping — `[stepControl]` is what blocks invalid steps)
- `stepper.next()` does not validate — when navigation buttons are outside the stepper, `stepper.next()` moves unconditionally; you must call `markAllAsTouched()` and check `form.valid` manually before calling it; interviewers ask what happens if you just call `stepper.next()` directly
- `stepper.selectedIndex` — used to show different buttons per step (Next on step 0, Back + Submit on step 1); available in the template because `#stepper` is a template reference variable
- `[completed]` and `[editable]` on a `mat-step` — mark a step done manually, or lock it so the user cannot go back and change it; interviewers ask how you stop someone editing the payment step after it was charged
- `showError` on the stepper plus `<ng-template matStepLabel>` — how an invalid step is surfaced in the header instead of failing silently on submit; interviewers ask how the user learns *which* step is wrong

---

## Selection controls — checkbox, radio, toggle

- `mat-checkbox` + `MatCheckboxModule` — styled checkbox bound with `formControlName` or `[(ngModel)]`; interviewers ask how to bind it inside a reactive form the same way as a text input
- `indeterminate` state on `mat-checkbox` — a third visual state (dash, not check) used for a "select all" checkbox when only some child rows are selected; interviewers ask how a table header checkbox shows partial selection
- `mat-radio-group` + `mat-radio-button` — radio buttons must be wrapped in `mat-radio-group` so only one can be selected at a time; interviewers ask what breaks if you skip the group wrapper (every button becomes independently selectable)
- Checkbox vs radio button — checkbox is for independent boolean choices or multi-select; radio is for picking exactly one option from a fixed set; interviewers ask which one to use for a status field with 3 fixed values (radio, or `mat-select` if there are many options)
- `mat-slide-toggle` vs `mat-checkbox` — a toggle signals a setting that takes effect immediately, a checkbox signals a value submitted later with the form; interviewers ask which one belongs on a settings screen and which inside a create dialog
- `(change)` on `mat-checkbox` emits a `MatCheckboxChange`, not a boolean — a handler written as `onChange($event)` writes the whole event object into the model; reviewers show it and ask what actually ends up in the form value (the fix is `$event.checked`)
- `mat-slider` with a nested `<input matSliderThumb>` — the v17+ structure replaced the old single-element `<mat-slider [value]>`; interviewers show the legacy form and ask why it renders nothing after an upgrade

---

## Tooltip and progress indicators

- `matTooltip` directive — shows a short text hint on hover or focus; interviewers ask why you would add it to an icon-only button even though it already has `aria-label` (tooltip is for sighted users on hover, `aria-label` is for screen readers — they serve different users)
- `matTooltipPosition` — controls where the tooltip appears (`above`, `below`, `left`, `right`); interviewers rarely test the syntax but expect you to know the directive exists
- `matTooltip` on a disabled button — never appears, because a disabled element receives no pointer events; interviewers show the snippet and ask why the hint never shows (the fix is a wrapper element)
- `mat-progress-spinner` — circular loading indicator; interviewers ask where you would use it (while waiting for an HTTP response, same role as the CSS spinner used in earlier Angular projects)
- `mat-progress-bar` — horizontal loading indicator; `mode="indeterminate"` for unknown duration, `mode="determinate"` with `[value]` for a known percentage; interviewers ask the difference between the two modes
- Loading state pattern with Material — disable the submit button and show `mat-progress-spinner` while a signal like `isLoading()` is true; interviewers ask how you prevent a double form submission while a request is in flight
- A tooltip must never be the only place information lives — it is unreachable on touch devices and unreliable for assistive technology, so a label that exists only as a tooltip is inaccessible; interviewers show "the explanation is in the tooltip" and ask why that fails review

---

## Choosing the right component

- Dialog vs snackbar vs inline `mat-error` — matching the level of interruption to the message; interviewers give a scenario (validation failure, delete confirmation, background save succeeded) and ask which surface you use
- `mat-menu` vs `mat-select` — a menu triggers actions, a select edits a form value; interviewers ask why a status dropdown inside a form is not a menu
- `mat-tab-group` vs `mat-stepper` — tabs let the user jump between independent views in any order; a stepper enforces a sequence; interviewers ask which fits a multi-step create flow
- `MatDialog` vs a hand-rolled modal `div` — Material's dialog service brings a focus trap, backdrop, Esc handling and ARIA roles for free; interviewers ask what you would have to reimplement yourself
- Wrapping a Material component in your own — when a project-specific wrapper (confirm dialog, page header, table shell) is worth it and when it is over-abstraction; interviewers ask how you decide
- `<ng-content>` content projection over Material — building a reusable panel that accepts arbitrary content instead of a dozen `@Input()` strings; interviewers ask why projection is the better boundary
- The cost of a wrapper component — it must re-expose every input and output of the component it hides; interviewers ask the downside of wrapping `matButton` in an `<app-button>`
- What a component library actually provides — tested keyboard interaction, focus management, ARIA wiring and a consistent visual language, none of which is what a junior first notices (the styling); interviewers ask what you would lose by hand-building the same control and expect the behaviour answer, not the CSS one
- Choosing a control by the size of the option set — a handful of options is radio buttons, a few dozen is `mat-select`, hundreds with free text is `mat-autocomplete`, and many simultaneous values is chips; interviewers give you "one of 3", "one of 500", and "several tags" and ask which control for each
- Reaching for Material when the client rejects the Material look — the ladder is theme it, then wrap it, then drop to the unstyled CDK primitives, and only then hand-build; interviewers ask how far Material can be pushed before it stops being the right choice

---

## Accessibility with Material

- What Material gives you for free vs what you must still add — roles, focus trap and keyboard navigation are built in; `aria-label`, label association and colour contrast are still your job; interviewers ask what accessibility work remains after choosing Material
- `aria-label` on an icon-only control — a `matIconButton` has no visible text, so without it a screen reader announces nothing useful; interviewers ask how a screen-reader user perceives your table row actions
- `aria-hidden="true"` on a decorative `<mat-icon>` — without it the ligature text is read out loud; interviewers ask how to hide a purely decorative icon from assistive tech
- Clickable `<div>` vs a real `<button>` — a div with `(click)` is not focusable and not activatable by keyboard even when it looks identical; interviewers ask why it is a defect
- Dialog focus management — Material traps focus inside the dialog on open and restores it to the trigger on close; interviewers ask what `autoFocus: false` costs in accessibility terms
- `LiveAnnouncer` (`@angular/cdk/a11y`) — announces a change that causes no focus shift (a sort change, an async result, a snackbar) to a screen reader; interviewers ask how a non-sighted user learns the snackbar appeared
- What `mat-form-field` wires for you automatically — it generates the control's `id`, points the label's `for` at it, and links hint and error text through `aria-describedby`; interviewers ask what accessibility work is already done for you, and why adding your own `<label>` beside a Material input is redundant or actively harmful
- Colour contrast of a custom theme — a brand palette fed into `mat.theme()` can still fail WCAG AA, because Material generates a coherent palette, not a compliant one; interviewers ask how you verify contrast and what you tell the client when their corporate colour fails

---

## Reading Material runtime errors

- `mat-form-field must contain a MatFormFieldControl` — the most common Material runtime error; interviewers show it and ask the causes (no `matInput` on the input, the directive misspelled, or `MatInputModule` not imported)
- `'mat-x' is not a known element` — the standalone-component symptom of a missing module in the `imports` array; interviewers show the message and ask which single line fixes it
- `NullInjectorError: No provider for MatDialogRef` — thrown when a dialog component is rendered directly by a route or a test instead of being opened through `MatDialog`; interviewers ask why the ref cannot be injected outside a dialog context
- `NullInjectorError: No provider for DateAdapter` — the concrete failure of a missing `provideNativeDateAdapter()`; interviewers ask how you read a `NullInjectorError` to identify which provider is missing
- `Could not find column with id "x"` — `displayedColumns` names a column that has no `matColumnDef`; interviewers ask how this differs from the reverse case (an extra `matColumnDef` renders nothing and throws nothing)
- `ExpressionChangedAfterItHasBeenCheckedError` — Angular's dev-mode change-detection guard, hit when Material state is mutated during the same tick a parent binding is read; interviewers ask what change detection is doing when it throws and why it never appears in production
- Where the real cause sits in a Material stack trace — the first framework frame rather than the last application frame; interviewers ask how you start debugging an error you have never seen before
- A `MatTableDataSource` rebuilt on every change-detection pass — constructing it in a getter or inline in the template hands the table a brand-new instance each tick, so sort and page state silently reset and nothing errors; reviewers show it and ask why the table "forgets" the sorted column
- `[(ngModel)]` on a control inside a reactive `[formGroup]` — mixing the two form APIs on one control; Angular warns and the reactive value is the one that counts; interviewers show the snippet and ask which API wins
- Fixing the symptom vs fixing the cause on a Material error — adding the missing module clears `'mat-x' is not a known element`, but the same message on a component that *is* imported points at a stale build or a wrong selector instead; interviewers ask how you decide whether the obvious fix is the real one

---

## Styling Material — overlays and tokens

- The CDK overlay container — dialogs, menus, selects, tooltips and datepickers render in a container appended to `<body>`, outside your component's DOM subtree; interviewers ask why styling a dialog from the parent's CSS has no effect
- `panelClass` config option — the supported way to style an overlay component, by attaching a class that the global stylesheet targets
- Overriding a `--mat-sys-*` token vs overriding a `.mat-mdc-*` class — the token is a public, upgrade-safe surface; the internal class name can change on any version bump; interviewers ask what breaks on the next Material upgrade
- Specificity against Material's own classes — why a component override "does nothing" and why reaching for `!important` is a symptom, not a fix
- The MDC layer underneath Material (`.mdc-*` and `.mat-mdc-*` class names) — since v15 Material wraps Google's Material Components for Web, which is why the inspected DOM looks unfamiliar and why those class names are explicitly not a public API; interviewers ask what changed in Material v15 and why your old overrides stopped working
- `ViewEncapsulation.None` to reach Material internals — it works, but it removes scoping for *every* rule in that component, so the styles leak app-wide; interviewers ask the cost and when it is still the defensible choice
- Bundle impact of Material imports — standalone per-component imports let unused components tree-shake, which is the real argument against the old `MaterialModule` barrel; interviewers ask whether importing twenty `Mat*Module`s costs anything

---

## The CDK beyond Material

- `@angular/cdk` as the unstyled behaviour layer — overlay, accessibility, drag-drop, virtual scroll and the table primitives Material itself is built on; interviewers ask what you reach for when the client's design rules out the Material look but you still want the behaviour and a11y for free
- `cdkDrag` + `cdkDropList` + `moveItemInArray` — drag-and-drop reordering, where the drop handler must reorder the *array* and not merely accept the DOM move; interviewers ask why a list that looks reordered reverts on the next render
- `cdk-virtual-scroll-viewport` + `*cdkVirtualFor` with `itemSize` — renders only the visible rows for very large lists; interviewers ask why `itemSize` is required and what breaks when rows have variable heights
- `cdkTrapFocus` / `FocusTrap` — the accessibility primitive `MatDialog` uses internally, keeping Tab inside an open modal; interviewers ask what a focus trap prevents and where you would need one outside a dialog
- `BreakpointObserver` with the `Breakpoints` constants (`Handset`, `Web`, `TabletPortrait`) — named breakpoints instead of pixel values hardcoded in TypeScript; interviewers ask how the sidenav switches between `side` and `over` as the window resizes
- `Clipboard` service / `cdkCopyToClipboard` — copying a value with user feedback; interviewers ask how you implement "copy the invoice number" and confirm it happened

---

## Layout and overflow with Material

- The height chain for scroll containers — a Material component that scrolls needs every ancestor to have a defined height; interviewers ask why `height: 100%` does nothing when the parent has no height
- `mat-sidenav-container` owns its own scroll context — a page-level `overflow` rule on top of it produces a double scrollbar or a dead scroll; interviewers ask why the page scrolls twice
- Horizontal overflow on a wide `mat-table` — the table breaks the layout unless wrapped in a container with `overflow-x: auto`; interviewers ask how you make a table responsive without hiding columns
- `mat-dialog-content` max-height and internal scroll — long content must live inside it and not in `mat-dialog-actions`; interviewers ask what breaks visually when it does not
- Flex children and the `min-width: auto` default — it stops a table or form field from shrinking and causes overflow; interviewers ask why `min-width: 0` fixes a broken flex row

---

## Testing Material components

- Material modules in `TestBed.configureTestingModule({ imports: [...] })` — the component under test needs its Material modules imported in the test too; interviewers ask why the test throws an unknown-element error when the app itself runs fine
- `NoopAnimationsModule` in tests — replaces real animations so dialogs and menus resolve synchronously; interviewers ask why a Material test hangs or the overlay never appears
- `fixture.detectChanges()` before querying the DOM — Material renders on change detection, so a query before it returns null; the most common cause of a failing first Material test
- Component harnesses (`@angular/cdk/testing`) — the supported way to drive Material UI, loaded through `TestbedHarnessEnvironment.loader(fixture)`; interviewers ask why `By.css('.mat-mdc-button')` is a brittle test (internal classes are not a public API)
- Harness vs `DebugElement` querying — a harness expresses intent (`await button.click()`) instead of DOM structure; the decision question in any Material testing round
- Testing overlay-rendered components — a dialog, menu or snackbar renders outside the fixture, so `fixture.nativeElement` finds nothing; the document root loader is needed instead
- `TestbedHarnessEnvironment.documentRootLoader(fixture)` vs `.loader(fixture)` — the plain loader only sees the component's own DOM, so anything in the overlay container (dialog, menu, select panel, snackbar) is invisible to it; interviewers ask which loader finds an open dialog and why there are two
- `HarnessPredicate` filters such as `MatButtonHarness.with({ text: 'Guardar' })` — selects one instance among several by intent rather than by index or CSS class; interviewers ask how you click the right button when the page has five
- Harness calls are asynchronous — every harness method returns a promise, so specs are `async`/`await`, and a forgotten `await` produces a test that asserts nothing and still goes green; interviewers ask why the harness spec passes when the behaviour is broken
- Overlay cleanup between specs — a dialog or menu left open leaks into the next test's document; interviewers ask why one spec passes alone and fails inside the suite
- Mocking `MatDialog` in a parent component test — a spy whose `open()` returns an object with `afterClosed: () => of(result)`; interviewers ask how you test "the user confirmed" without opening a real dialog
- Testing a dialog component in isolation — providing `MAT_DIALOG_DATA` and a `MatDialogRef` spy through `TestBed` providers; interviewers ask how the dialog gets its data when there is no parent
- Asserting `MatSnackBar` was called — spying on the injected service instead of reading the overlay DOM; interviewers ask which assertion is more stable and why
