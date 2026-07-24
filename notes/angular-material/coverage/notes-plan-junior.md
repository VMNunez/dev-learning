# Angular Material Junior Notes Plan

Plan status: current
Coverage: notes/angular-material/coverage/junior.md
Coverage SHA-256: 8ea3c5c8f8db41eeb352dd85a3dfc559b58e8a16401c29cf279a24f2a9ff1259
Generated: 2026-07-24

## 01 — Theming and setup

Status: pending
Action: create
English: notes/angular-material/junior/en/16-theming-and-setup.md
Spanish: notes/angular-material/junior/es/16-theming-and-setup.md
Depends on: none

Coverage concepts:

- `ng add @angular/material` — the correct way to install Angular Material; interviewers may ask what it does (adds the package, configures theming, imports fonts and icons in `index.html`)
- `mat.theme()` in `material-theme.scss` — the v19+ way to define the app's color palette; interviewers ask why you use this instead of overriding CSS classes directly (CSS variables, upgrade-safe)
- `provideNativeDateAdapter()` in `app.config.ts` — required for `MatDatepicker`; missing it causes a runtime error; interviewers test whether you know where providers go in a standalone app

Rationale: These concepts form the coherent coverage group “Theming and setup”.

## 02 — Buttons and icons

Status: pending
Action: audit
English: notes/angular-material/junior/en/01-button.md
Spanish: notes/angular-material/junior/es/01-button.md
Depends on: 01

Coverage concepts:

- `matButton` variants (`filled`, `outlined`, `elevated`, `tonal`) — when to use each; interviewers ask which variant is for the primary action (`filled`) and which for secondary (`outlined`)
- `matIconButton` — circle icon-only button used in table rows and toolbars; interviewers ask why you pair it with `aria-label` (no visible text — screen readers need the description)
- `matFab` / `matMiniFab` — floating action button for the one dominant page action; interviewers ask when you would use FAB vs a regular button
- `<mat-icon>` — how Material icons work; icon names come from Google Material Symbols; interviewers may ask how you add an icon to a button and where the font is loaded

Rationale: These concepts form the coherent coverage group “Buttons and icons”.

## 03 — Form fields

Status: pending
Action: audit
English: notes/angular-material/junior/en/05-forms.md
Spanish: notes/angular-material/junior/es/05-forms.md
Depends on: 02

Coverage concepts:

- `mat-form-field` — wrapper that gives Material styling to an input; interviewers ask why it must always contain a control (`matInput` or `mat-select`) and cannot be used alone
- `mat-label` — floating label that animates up when the field has focus or a value; interviewers ask what makes it float (focus or non-empty value)
- `matInput` — directive on `<input>` or `<textarea>` to style it inside `mat-form-field`; interviewers ask why you write `matInput` on a native `<input>` instead of using a Material component directly
- `mat-error` — shows validation error text; interviewers ask when it appears by default (invalid + touched) and how to change that behaviour (`ErrorStateMatcher`)
- `mat-hint` — helper text always visible below the field; interviewers ask the difference between `mat-hint` and `mat-error` (hint is always visible; error appears conditionally)

Rationale: These concepts form the coherent coverage group “Form fields”.

## 04 — Select and options

Status: pending
Action: audit
English: notes/angular-material/junior/en/06-select.md
Spanish: notes/angular-material/junior/es/06-select.md
Depends on: 03

Coverage concepts:

- `mat-select` + `mat-option` — styled dropdown inside `mat-form-field`; interviewers ask the difference between `value="pending"` (literal string) and `[value]="status"` (property binding from a variable)
- `(selectionChange)` vs `[(value)]` — `selectionChange` fires on user pick and requires a method; `[(value)]` is two-way binding and keeps the signal in sync automatically; interviewers ask when to use each
- `mat-optgroup` — groups options under a label; interviewers may ask how to visually separate options without disabling them
- `multiple` attribute on `mat-select` — makes the value an array; interviewers ask what changes in the form value when `multiple` is enabled

Rationale: These concepts form the coherent coverage group “Select and options”.

## 05 — Table

Status: pending
Action: audit
English: notes/angular-material/junior/en/09-table.md
Spanish: notes/angular-material/junior/es/09-table.md
Depends on: 04

Coverage concepts:

- `mat-table` attribute on `<table>` — turns a native table into a Material table; interviewers ask what the four required pieces are (`displayedColumns`, `ng-container matColumnDef`, `*matCellDef`, the two `<tr>` rows at the bottom)
- `matColumnDef` on `ng-container` — defines one column; value must match exactly one string in `displayedColumns`; interviewers ask what happens if the name doesn't match (column does not render)
- `*matHeaderCellDef` / `*matCellDef` — structural directives that define the header and data cell templates for a column; interviewers ask why both are needed
- `*matHeaderRowDef` / `*matRowDef` — render the header row and one data row per item; both reference `displayedColumns`; interviewers ask why you don't need to change these when adding or removing columns
- `*matNoDataRow` — empty state row shown when `dataSource` has no items; interviewers ask why `[attr.colspan]="displayedColumns.length"` is used (to span all columns)
- `MatTableDataSource` — wrapper around an array that handles sorting, filtering, and pagination; interviewers ask why you use it instead of a plain array (automatic sort + paginate behaviour)
- `MatSort` + `MatSortModule` — add column sorting to a Material table; interviewers ask the difference between `MatSort` (the class, needed for `@ViewChild`) and `MatSortModule` (the module, needed in the `imports` array)
- `matSort` on `<table>` and `mat-sort-header` on `<th>` — `mat-sort-header` goes on the `<th>` element, not on the `ng-container`; a common mistake interviewers test for
- `@ViewChild(MatSort)` in `ngAfterViewInit` — interviewers ask why you must connect `dataSource.sort = this.sort` in `ngAfterViewInit` and not in the constructor (template doesn't exist yet in the constructor)
- View encapsulation and `styles.css` — sort header internals cannot be styled from component CSS because Angular's scoped attributes don't reach directive-generated elements; global `styles.css` is required; interviewers ask why centering a sort header column from component CSS doesn't work

Rationale: These concepts form the coherent coverage group “Table, Sorting”.

## 06 — Paginator

Status: pending
Action: audit
English: notes/angular-material/junior/en/10-paginator.md
Spanish: notes/angular-material/junior/es/10-paginator.md
Depends on: 05

Coverage concepts:

- `MatPaginator` + `MatPaginatorModule` — adds page controls to a table; same `@ViewChild` + `ngAfterViewInit` pattern as `MatSort`; interviewers ask why the paginator must be placed outside and after the `</table>` closing tag
- `[pageSize]` + `[pageSizeOptions]` — configure default rows per page and the size options the user can pick
- Reset to first page after filter — `this.dataSource.paginator.firstPage()` after applying a filter; interviewers ask what happens without it (user stays on the page they were on, which may now be empty)

Rationale: These concepts form the coherent coverage group “Paginator”.

## 07 — Dialog

Status: pending
Action: audit
English: notes/angular-material/junior/en/11-dialog.md
Spanish: notes/angular-material/junior/es/11-dialog.md
Depends on: 06

Coverage concepts:

- `MatDialog` service + `MatDialogRef` — the two-part system for dialogs; `MatDialog` is injected in the parent to open; `MatDialogRef` is injected in the dialog to close and return data
- `dialog.open(ComponentClass, config)` — interviewers ask what the first argument is (the component class itself, not a string or template)
- `afterClosed().subscribe()` — where the parent listens for the dialog result; interviewers ask what value is emitted when the user clicks Cancel or clicks outside (`undefined`)
- `MAT_DIALOG_DATA` — injection token to read data passed from the parent into the dialog; interviewers ask how the dialog knows it is in add vs edit mode (check if `data` is `null`)
- `patchValue()` vs `setValue()` — `patchValue()` fills only the fields you pass; `setValue()` requires all fields; interviewers ask which one to use when pre-filling a dialog for edit
- `mat-dialog-title` / `mat-dialog-content` / `mat-dialog-actions` — must be siblings, never nested; interviewers ask what breaks if you nest them (Material applies different padding and scroll to each — nesting corrupts the layout)
- `mat-dialog-close` attribute on Cancel button — closes the dialog immediately with no data and no TypeScript needed; interviewers ask when you would replace it with a custom `onCancel()` method (when you need to check for unsaved changes)
- `autoFocus: false` in the dialog config — prevents the focus ring appearing on the first button when the dialog opens; interviewers ask why a button looks selected when the dialog opens (autoFocus is on by default)
- Confirmation dialog pattern — reusable dialog that takes `title`, `message`, `confirmLabel` as `MAT_DIALOG_DATA` and returns `true` on confirm; interviewers ask where the destructive action button goes (always last, on the right)

Rationale: These concepts form the coherent coverage group “Dialog”.

## 08 — Snackbar

Status: pending
Action: audit
English: notes/angular-material/junior/en/12-snackbar.md
Spanish: notes/angular-material/junior/es/12-snackbar.md
Depends on: 07

Coverage concepts:

- `MatSnackBar` is a service — no `imports` array entry needed; interviewers ask how it differs from other Material components (it is injected directly, not declared in imports)
- `snackBar.open(message, actionLabel, { duration })` — the three parameters; interviewers ask what happens if `duration` is omitted (snackbar stays open until the user clicks the action)
- `MatSnackBar` vs `MatDialog` — snackbar does not block the user and closes automatically; dialog blocks the user and requires interaction; interviewers ask which to use after a successful form submit (snackbar)
- Coordinator pattern for snackbar — always call `snackBar.open()` in the page component after `afterClosed()` returns a result, never inside the dialog; interviewers ask why calling it inside the dialog is wrong (the dialog doesn't know if the save succeeded)

Rationale: These concepts form the coherent coverage group “Snackbar”.

## 09 — Navigation shell — Toolbar, Sidenav

Status: pending
Action: audit
English: notes/angular-material/junior/en/04-sidenav.md
Spanish: notes/angular-material/junior/es/04-sidenav.md
Depends on: 08

Coverage concepts:

- `mat-toolbar` — persistent app header; `justify-content: space-between` or a flex spacer element (`flex: 1 1 auto`) to push title left and actions right; interviewers ask how to position items on opposite sides
- `mat-sidenav-container` / `mat-sidenav` / `mat-sidenav-content` — the three-element structure that is always required; interviewers ask what each one does and why you cannot put just `mat-sidenav` on its own
- `mode="side"` vs `mode="over"` — `side` shows next to content with no backdrop; `over` floats above content with a backdrop; interviewers ask which mode an enterprise app shell uses
- `[opened]="!!currentUser()"` — how to show/hide the sidenav reactively; `!!` converts `User | null` to `boolean`; interviewers ask why `[opened]="currentUser()"` causes a type error
- Keep `mat-sidenav-container` always in the DOM — if you wrap it in `@if`, the `router-outlet` inside disappears on logout; the sidenav itself uses `[opened]` to hide; interviewers ask why the login page goes blank after logout (container was removed)
- Full-height app shell CSS — the height chain (`html → body → app-root → mat-sidenav-container`); `overflow: hidden` on `app-root` is the key rule; interviewers ask why the toolbar scrolls away with the content (missing `overflow: hidden`)
- `mat-nav-list` + `mat-list-item` — correct elements for navigation links inside the sidenav; interviewers ask what `routerLinkActive` adds (a CSS class when the route matches)
- `routerLinkActive` + `[activated]` pattern — `#rla="routerLinkActive"` gives access to `rla.isActive`, which is passed to Material's built-in active style via `[activated]`; interviewers ask the difference between the class approach and the `[activated]` approach

Rationale: These concepts form the coherent coverage group “Navigation shell — Toolbar, Sidenav”.

## 10 — Additional UI components

Status: pending
Action: create
English: notes/angular-material/junior/en/17-additional-ui-components.md
Spanish: notes/angular-material/junior/es/17-additional-ui-components.md
Depends on: 09

Coverage concepts:

- `mat-card` structure — `mat-card-header`, `mat-card-content`, `mat-card-actions`; interviewers ask what each section is for and which are optional
- `appearance="outlined"` vs default `raised` — `outlined` is flat with a border; `raised` has a shadow; interviewers ask when to use each (outlined for forms and panels; raised for stat cards that need to stand out)
- `MatDatepicker` three-element structure — `[matDatepicker]="ref"` on the input, `<mat-datepicker-toggle [for]="ref">` for the icon, and `<mat-datepicker #ref>` as the popup; interviewers ask why all three are needed
- Datepicker value type — with the native adapter the control should be typed `Date | null`; forcing a
  `string | null` control through `as unknown as Date` hides a modelling error instead of converting
  the date deliberately at the API boundary

Rationale: These concepts form the coherent coverage group “Additional UI components”.

## 11 — Stepper

Status: pending
Action: audit
English: notes/angular-material/junior/en/08-stepper.md
Spanish: notes/angular-material/junior/es/08-stepper.md
Depends on: 10

Coverage concepts:

- `[linear]="true"` + `[stepControl]="formGroup"` — forces the user to complete each step in order; interviewers ask what `[linear]="true"` does without `[stepControl]` (allows skipping — `[stepControl]` is what blocks invalid steps)
- Programmatic step navigation — a linear stepper still enforces completion rules; calling
  `markAllAsTouched()` before `next()` is a UX choice for surfacing errors, not a replacement for the
  stepper's validity checks
- `stepper.selectedIndex` — used to show different buttons per step (Next on step 0, Back + Submit on step 1); available in the template because `#stepper` is a template reference variable
- `FormBuilder.group({ field: ['default', validators] })` — shorthand for creating form groups; interviewers ask what the array syntax means (first element is the default value, second is validators)

Rationale: These concepts form the coherent coverage group “Stepper”.

## 12 — Checkbox and radio button

Status: pending
Action: audit
English: notes/angular-material/junior/en/13-checkbox-radio.md
Spanish: notes/angular-material/junior/es/13-checkbox-radio.md
Depends on: 11

Coverage concepts:

- `mat-checkbox` + `MatCheckboxModule` — styled checkbox bound with `formControlName` or `[(ngModel)]`; interviewers ask how to bind it inside a reactive form the same way as a text input
- `indeterminate` state on `mat-checkbox` — a third visual state (dash, not check) used for a "select all" checkbox when only some child rows are selected; interviewers ask how a table header checkbox shows partial selection
- `mat-radio-group` + `mat-radio-button` — radio buttons must be wrapped in `mat-radio-group` so only one can be selected at a time; interviewers ask what breaks if you skip the group wrapper (every button becomes independently selectable)
- Checkbox vs radio button — checkbox is for independent boolean choices or multi-select; radio is for picking exactly one option from a fixed set; interviewers ask which one to use for a status field with 3 fixed values (radio, or `mat-select` if there are many options)

Rationale: These concepts form the coherent coverage group “Checkbox and radio button”.

## 13 — Tooltip and progress indicators

Status: pending
Action: audit
English: notes/angular-material/junior/en/14-tooltip-progress.md
Spanish: notes/angular-material/junior/es/14-tooltip-progress.md
Depends on: 12

Coverage concepts:

- `matTooltip` directive — shows a short text hint on hover or focus; interviewers ask why you would add it to an icon-only button even though it already has `aria-label` (tooltip is for sighted users on hover, `aria-label` is for screen readers — they serve different users)
- `matTooltipPosition` — controls where the tooltip appears (`above`, `below`, `left`, `right`); interviewers rarely test the syntax but expect you to know the directive exists
- `mat-progress-spinner` — circular loading indicator; interviewers ask where you would use it (while waiting for an HTTP response, same role as the CSS spinner used in earlier Angular projects)
- `mat-progress-bar` — horizontal loading indicator; `mode="indeterminate"` for unknown duration, `mode="determinate"` with `[value]` for a known percentage; interviewers ask the difference between the two modes
- Loading state pattern with Material — disable the submit button and show `mat-progress-spinner` while a signal like `isLoading()` is true; interviewers ask how you prevent a double form submission while a request is in flight

Rationale: These concepts form the coherent coverage group “Tooltip and progress indicators”.

## 14 — Menu

Status: pending
Action: audit
English: notes/angular-material/junior/en/15-menu.md
Spanish: notes/angular-material/junior/es/15-menu.md
Depends on: 13

Coverage concepts:

- `mat-menu` + `MatMenuModule` — a dropdown list of actions triggered by a button; interviewers ask when to use it over several separate `matIconButton` elements in a table row (too many actions to show inline, or actions that need labels)
- `[matMenuTriggerFor]="menuRef"` — connects a trigger button to the menu using a template reference variable; interviewers ask how the button knows which menu to open when there are several menus on the same page (one `#ref` per row)
- `mat-menu-item` — each clickable row inside the menu; behaves like a button and can call a method directly with `(click)`

Rationale: These concepts form the coherent coverage group “Menu”.

## Unassigned existing notes

- notes/angular-material/junior/en/02-card.md — no junior coverage group is assigned to this legacy file.
- notes/angular-material/junior/en/03-toolbar.md — no junior coverage group is assigned to this legacy file.
- notes/angular-material/junior/en/07-datepicker.md — no junior coverage group is assigned to this legacy file.
