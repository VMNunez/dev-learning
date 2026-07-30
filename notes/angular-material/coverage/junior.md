# Junior Coverage — Angular Material

Concepts needed to build, explain, test, and debug ordinary business interfaces with Angular Material at junior level.

## Setup and component model

- Angular Material, Material Design, and the CDK — distinguish the styled Angular component library, the design system it implements, and the lower-level behaviour primitives it builds upon
- `ng add @angular/material` — use the library schematic to install Material and the CDK and apply the selected animation, typography, and theme setup
- Material-specific imports and providers — recognise which components need a template import and which features, such as date handling, also need a provider
- Material composition boundary — combine Material interaction primitives with ordinary Angular state, forms, templates, and CSS instead of treating the library as page architecture
- Version-matched documentation and migrations — consult the docs for the installed Angular Material major version and use official update tooling instead of copying obsolete selectors or theming APIs

## Theming and styling boundaries

- Prebuilt vs custom themes — choose a prebuilt theme for fast setup or a Sass theme when the product needs controlled colour, typography, or density
- Theme application — recognise that a Material theme controls colour, typography, and density, and ensure the application emits the required core and component styles once
- `mat.theme()` — apply a supported Material 3 theme without depending on the generated component DOM
- Supported theming vs internal selectors — prefer theme tokens, mixins, and public host classes because internal DOM and CSS classes are private and may change between releases
- Page layout vs component theming — use application CSS for layout, spacing, and responsive composition while using Material APIs for component internals
- Overlay styling boundary — recognise that dialogs, menus, selects, tooltips, and snack bars render in an overlay container outside the opener's component subtree

## Buttons, icons, menus, and tooltips

- Material button variants — choose a visually prominent button for the primary action and lower-emphasis variants for secondary or tertiary actions
- Icon buttons and accessible names — pair `matIconButton` actions with an `aria-label` or equivalent name because an icon or tooltip alone is not a reliable accessible label
- FAB vs ordinary button — reserve `matFab` or `matMiniFab` for a dominant screen-level action rather than every positive action
- `mat-icon` and icon fonts — understand that the component renders an icon name from a loaded icon font or registered SVG set rather than bundling every icon automatically
- `mat-menu` composition — connect a trigger to a menu reference and use labelled menu items when several contextual actions should not remain inline
- Menu vs select — use a menu to invoke commands and a select to choose a value owned by a form or application state
- Tooltip purpose — use `matTooltip` for short supplementary help on hover or focus, never as the only name or as a container for essential instructions

## Form-field composition and selection controls

- `mat-form-field` composition — combine a compatible control with its label, hint, prefix or suffix, and error presentation while Angular forms remain the state authority
- `matInput` — enhance a native input or textarea inside a form field while preserving its native value, type, and form semantics
- `mat-label` and `mat-error` — distinguish identification of a control from conditional validation feedback shown under the field
- `mat-hint` — attach persistent guidance to a form field without confusing it with a validation error
- Material controls with reactive forms — bind controls through `formControl` or `formControlName` and avoid a second source of truth through parallel value bindings
- Error-state timing — understand when Material displays form-field errors and connect that presentation to the form's validity and interaction or submission policy
- `mat-select` and `mat-option` — model single or multiple selection with values whose types match the form control and distinguish literal attributes from property bindings
- Material select vs native select — choose `mat-select` for Material-specific presentation and a native `<select matNativeControl>` when native accessibility, performance, or platform behaviour is the better fit
- Select vs autocomplete — use a select for a closed choice set and `mat-autocomplete` when users type into an input and choose from matching suggestions
- Basic `mat-autocomplete` — connect an input to a local option panel and distinguish the displayed label from the stored object or identifier
- Selection events vs form values — react to `selectionChange` only for side effects and read the form control for the authoritative selected value
- `mat-optgroup` — group a long option set semantically without pretending group labels are selectable values
- Checkbox, radio, and select choice — use checkboxes for independent booleans or multi-select, radio buttons for a small visible single-choice set, and a select when compactness or option count warrants it
- Checkbox vs slide toggle — use a checkbox for selection or confirmation and `mat-slide-toggle` for a boolean setting whose change is presented as immediately active
- Checkbox indeterminate state — represent partial aggregate selection visually without confusing it with a third submitted boolean value
- Datepicker composition — connect the input, toggle, picker reference, and a configured date adapter as one control
- Date-adapter compatibility — keep the datepicker control value compatible with its configured `DateAdapter` rather than hiding a representation mismatch with type assertions
- Datepicker constraints and validation — use `min`, `max`, and `matDatepickerFilter` for selectable-date rules and surface the resulting Material validation errors instead of validating only after submission

## Tables, sorting, filtering, and pagination

- Material table structure — connect column definitions, header and cell templates, displayed column order, and header/data row definitions through matching column identifiers
- `matColumnDef` identity — keep the column ID consistent with `displayedColumns` and configure an accessor when the displayed value does not map directly to a row property
- Header and cell definition roles — use `matHeaderCellDef` for column labels and `matCellDef` for per-row values rather than mixing structural and data concerns
- Table refresh after collection changes — assign or emit a new data array, or call `renderRows()` after mutating a raw array, because `mat-table` does not observe in-place structural changes automatically
- Empty table state — use `matNoDataRow` or an equivalent full-width row only after distinguishing an empty successful result from loading and failure
- Table data-source choices — choose a plain array, observable/custom `DataSource`, or `MatTableDataSource` according to who owns retrieval, transformation, and lifecycle
- `MatTableDataSource` scope — use the convenience class for simple client-side sorting, filtering, and pagination, not as a server-side data-access abstraction
- Sort integration — connect `MatSort` after the view exists, mark only sortable headers, and handle nested or derived values through a sorting accessor or server query
- Paginator integration — connect `MatPaginator` for client data or translate page events into backend parameters without paginating the same result twice
- Server-side paginator state — bind `length` to the backend's total matching count and treat `pageIndex` and `pageSize` as request state so the controls remain correct when only one page of rows is loaded
- Filter semantics — define which fields and normalisation rules filtering uses instead of assuming the default row stringification matches the product
- Reset pagination after filtering — return to a valid first page when a narrower client-side filter can make the current page empty
- Table selection and row actions — keep row identity explicit and prevent nested action buttons from accidentally triggering row selection or navigation
- Client-side vs server-side table operations — let `MatTableDataSource` transform an in-memory collection or translate sort, filter, and page events into backend queries, never both for the same dataset

## Dialogs and confirmation flows

- `MatDialog` and `MatDialogRef` — open overlay content from the caller and control its lifecycle and result through the returned reference
- Dialog component input — use `MAT_DIALOG_DATA` for an explicit, typed input boundary rather than reaching into caller state
- Dialog result channel — close with an explicit typed result and consume `afterClosed()` so the caller distinguishes success, cancellation, and dismissal
- Confirm/cancel semantics — perform destructive work only after an affirmative result and treat backdrop, Escape, and cancel-button dismissal consistently
- Default dismissal vs `disableClose` — preserve backdrop and Escape dismissal by default and disable them only when the interaction has a justified alternative exit because dialogs are expected to remain keyboard operable
- Dialog content structure — keep title, content, and actions as sibling regions so layout, scrolling, labelling, and action placement remain correct
- Declarative vs programmatic closing — use `mat-dialog-close` for simple results and a handler when validation, unsaved changes, or asynchronous work must run before closing
- Dialog focus management — preserve an accessible name, focus trap, sensible initial focus, focus restoration, and Escape behaviour unless a justified accessible alternative exists
- Dialog viewport constraints — use width and maximum-size configuration so overlay content remains usable without overflowing small viewports

## Feedback, loading, and progress

- Snack bar vs dialog — use a snack bar for brief non-blocking feedback and a dialog for focused input or a decision that requires interaction
- `MatSnackBar.open()` lifecycle — provide concise content and ensure the feature imports the snack-bar API it uses
- Timed vs actionable snack bars — auto-dismiss informational feedback after a suitable duration but keep an action available long enough for the user to perceive and operate it
- Progress spinner vs progress bar — choose a spinner for local indeterminate waiting, an indeterminate bar for page or section activity, and a determinate bar only when a real percentage exists

## Navigation and information containers

- Toolbar composition — use `mat-toolbar` for persistent application-level actions and ordinary flex layout to position its content
- Sidenav structure — compose `mat-sidenav-container`, `mat-sidenav`, and `mat-sidenav-content` so the drawer and main content share the required layout context
- Sidenav modes — choose `side`, `push`, or `over` according to available space and whether content should resize, shift, or sit behind an overlay
- Navigation lists and active state — use `mat-nav-list` and Material list items for navigation while Angular Router remains responsible for navigation and route activity
- Tabs vs route navigation — use `mat-tab-group` for related in-page views and routes for destinations that need navigation history, deep links, or independent URLs
- Card structure and appearance — group related content with optional header, content, and actions and choose raised or outlined emphasis consistently
- Stepper linear flow — pair `linear` with step controls so validity governs progression rather than relying only on button handlers

## Accessibility, responsiveness, and testing

- Built-in accessibility vs application responsibility — rely on supported Material semantics and keyboard behaviour while still providing labels, logical focus order, and meaningful state communication
- Responsive Material composition — adapt sidenav mode, dialog dimensions, action density, and wide-table presentation because Material components do not make a page responsive automatically
- Material component harnesses — test supported user-visible behaviour through stable harness APIs instead of querying private DOM structure or CSS classes
- Harness interaction tests — use component-specific harness methods to verify critical validation feedback, dialog results, and table interactions rather than snapshotting generated markup
