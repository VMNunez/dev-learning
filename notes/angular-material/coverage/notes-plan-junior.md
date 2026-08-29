# Angular Material Junior Notes Plan

Plan status: current
Coverage: notes/angular-material/coverage/junior.md
Coverage SHA-256: ca01a9b5f6e2680c0af721e19918c15d90706af48aeb3f4c511a755953bc2e4e
Generated: 2026-08-02

## 00 — Introduction to Angular Material

Status: pending
Action: create
English: notes/angular-material/junior/en/00-introduction.md
Spanish: notes/angular-material/junior/es/00-introduccion.md
Depends on: none
Pending additions: none

Narrative role: Orient the learner before any component API appears.

Learning outcome: Explain what Angular Material is, how it fits Angular, and the route through the junior component system.

Prerequisites: none

Must answer:

- What problem does Angular Material solve, and what does it deliberately not solve?
- What high-level component, theme, overlay, and accessibility characteristics recur throughout Material?
- Which three things share the name "Material", and which of them is this topic actually about?
- Which Angular fundamentals — reactive forms, Router, view queries, TestBed — does this route assume rather than teach, and in which chapter does each one first appear?
- Which React or ordinary TypeScript ideas transfer, and what changes because Material components use Angular templates, dependency injection, and forms?
- Where does Angular Material fit in Victor’s Angular + Spring Boot stack and ordinary consultancy business interfaces?
- How does the canonical 01–15 route progress from setup and theming through controls, data, overlays, layout, and production-readiness, and why is it ordered that way?

Coverage concepts:

none — introductory orientation contract, no coverage bullet is assigned to this entry

Rationale: Introduction to Angular Material is one coherent learning unit at this point in the route.

Handoff: This unlocks setup, component model, and theming boundaries in entry 01.

## 01 — Setup, component model, and theming boundaries

Status: pending
Action: create
English: notes/angular-material/junior/en/01-setup-theming.md
Spanish: notes/angular-material/junior/es/01-configuracion-temas.md
Depends on: 00
Pending additions: none

Narrative role: Establish a correct installation and styling mental model before using components. This chapter also owns the canonical account of `mat.theme()`: the "Customizing button colors (Angular Material v19+)" block currently living in `02-button.md` is theming content and migrates here, leaving 02 with a cross-link only, so the route never carries two competing accounts of the same API.

Learning outcome: Install, configure, theme, and style Material without depending on private implementation details.

Prerequisites: 00

Must answer:

- What exactly is the CDK, and what does Angular Material add on top of it?
- What does the Material schematic configure?
- Which features need imports, providers, or both?
- Why must the docs and migrations match the installed major version?
- How are core and component colour, typography, and density styles emitted exactly once?
- Where should page CSS end and Material theming begin?
- Why will dialogs, menus, selects, tooltips, and snack bars later ignore your component's scoped CSS?

Coverage concepts:

- [ ] Angular Material, Material Design, and the CDK — distinguish the styled Angular component library, the design system it implements, and the lower-level behaviour primitives it builds upon
- [ ] `ng add @angular/material` — use the library schematic to install Material and the CDK and apply the selected animation, typography, and theme setup
- [ ] Material-specific imports and providers — recognise which components need a template import and which features, such as date handling, also need a provider
- [ ] Material composition boundary — combine Material interaction primitives with ordinary Angular state, forms, templates, and CSS instead of treating the library as page architecture
- [ ] Version-matched documentation and migrations — consult the docs for the installed Angular Material major version and use official update tooling instead of copying obsolete selectors or theming APIs
- [ ] Prebuilt vs custom themes — choose a prebuilt theme for fast setup or a Sass theme when the product needs controlled colour, typography, or density
- [ ] Theme application — recognise that a Material theme controls colour, typography, and density, and ensure the application emits the required core and component styles once
- [ ] `mat.theme()` — apply a supported Material 3 theme without depending on the generated component DOM
- [ ] Supported theming vs internal selectors — prefer theme tokens, mixins, and public host classes because internal DOM and CSS classes are private and may change between releases
- [ ] Page layout vs component theming — use application CSS for layout, spacing, and responsive composition while using Material APIs for component internals
- [ ] Overlay styling boundary — recognise that dialogs, menus, selects, tooltips, and snack bars render in an overlay container outside the opener's component subtree

Rationale: Installation, theming, and the styling boundary are one unit because they answer a single question the learner cannot postpone — "where does my CSS stop and the library begin?". The schematic decides which styles exist, the theme decides what they contain, and the overlay/private-selector rules decide what the application may touch; teaching any one without the others produces the two classic junior failures, a theme emitted twice and a page styled through internal Material classes.

Handoff: This unlocks buttons and icons in entry 02. The overlay boundary stated abstractly here is re-applied concretely against real components in entries 03, 05, 10, and 11.

## 02 — Buttons and icons

Status: pending
Action: audit
English: notes/angular-material/junior/en/02-button.md
Spanish: notes/angular-material/junior/es/02-botones.md
Depends on: 01
Pending additions: none

Narrative role: Introduce the smallest Material actions and their accessible meaning. The existing file's "Customizing button colors (Angular Material v19+)" block is theming scope owned by entry 01 and leaves this chapter as a cross-link, so the audit removes it rather than restating it.

Learning outcome: Choose and implement an appropriate labelled button or icon action.

Prerequisites: 01

Must answer:

- How does action emphasis determine the button variant?
- Why does an icon button still need an accessible name?
- When is a FAB appropriate?
- Where do mat-icon glyphs come from?

Coverage concepts:

- [ ] Material button variants — choose a visually prominent button for the primary action and lower-emphasis variants for secondary or tertiary actions
- [ ] Icon buttons and accessible names — pair `matIconButton` actions with an `aria-label` or equivalent name because an icon or tooltip alone is not a reliable accessible label
- [ ] FAB vs ordinary button — reserve `matFab` or `matMiniFab` for a dominant screen-level action rather than every positive action
- [ ] `mat-icon` and icon fonts — understand that the component renders an icon name from a loaded icon font or registered SVG set rather than bundling every icon automatically

Rationale: Buttons and icons is one coherent learning unit at this point in the route.

Handoff: This unlocks menus and tooltips in entry 03.

## 03 — Menus and tooltips

Status: pending
Action: audit
English: notes/angular-material/junior/en/03-menu.md
Spanish: notes/angular-material/junior/es/03-menus.md
Depends on: 02
Pending additions: none

Narrative role: Build contextual actions and supplementary help on top of basic buttons. This chapter absorbs the tooltip half of the retired `17-tooltip-progress.md`; its progress-indicator half belongs to entry 11.

Learning outcome: Choose correctly between a menu, a tooltip, and a visible label for a contextual action.

Prerequisites: 02

Must answer:

- Why is a menu for invoking commands rather than for capturing a value?
- How does a trigger identify its menu, and what goes wrong when several rows share one reference?
- Why can a tooltip never replace an accessible name or essential instruction?

Coverage concepts:

- [ ] `mat-menu` composition — connect a trigger to a menu reference and use labelled menu items when several contextual actions should not remain inline
- [ ] Tooltip purpose — use `matTooltip` for short supplementary help on hover or focus, never as the only name or as a container for essential instructions

Rationale: A menu and a tooltip are the two things a button can reveal without leaving the page — one carries actions, the other carries words — so they share the trigger-and-overlay mental model introduced by entry 01 and are cheapest to contrast side by side. The menu-versus-select decision deliberately waits for entry 05, where the select exists and the comparison is teachable rather than promissory.

Handoff: This unlocks form-field composition in entry 04, where the page stops invoking commands and starts capturing values.

## 04 — Form-field composition

Status: pending
Action: audit
English: notes/angular-material/junior/en/04-forms.md
Spanish: notes/angular-material/junior/es/04-campos-formulario.md
Depends on: 03
Pending additions: none

Narrative role: Connect Material presentation to Angular reactive-form state. This chapter assumes reactive-forms fundamentals — `FormGroup`, `FormControl`, validators, `touched` and `dirty` — from the `angular` junior topic, and must bridge them explicitly before the first Material binding, because every control chapter from here to entry 14 rests on them.

Learning outcome: Compose labelled inputs with guidance and validation while keeping the form control authoritative.

Prerequisites: 03

Must answer:

- What responsibility belongs to mat-form-field and what remains Angular Forms state?
- When does Material display an error?
- Why is a parallel value binding a second source of truth?

Coverage concepts:

- [ ] `mat-form-field` composition — combine a compatible control with its label, hint, prefix or suffix, and error presentation while Angular forms remain the state authority
- [ ] `matInput` — enhance a native input or textarea inside a form field while preserving its native value, type, and form semantics
- [ ] `mat-label` and `mat-error` — distinguish identification of a control from conditional validation feedback shown under the field
- [ ] `mat-hint` — attach persistent guidance to a form field without confusing it with a validation error
- [ ] Material controls with reactive forms — bind controls through `formControl` or `formControlName` and avoid a second source of truth through parallel value bindings
- [ ] Error-state timing — understand when Material displays form-field errors and connect that presentation to the form's validity and interaction or submission policy

Rationale: Form-field composition is one coherent learning unit at this point in the route.

Handoff: This unlocks selects and autocomplete in entry 05.

## 05 — Selects and autocomplete

Status: pending
Action: audit
English: notes/angular-material/junior/en/05-select.md
Spanish: notes/angular-material/junior/es/05-seleccion-autocompletado.md
Depends on: 04
Pending additions: none

Narrative role: Move from free text to typed single, multiple, grouped, and suggested choices.

Learning outcome: Choose and wire a select, native select, or autocomplete with correctly typed form values.

Prerequisites: 04

Must answer:

- When should a native select win over mat-select?
- When is autocomplete a better model than select?
- What should selectionChange do, and where is the selected value stored?
- How do display labels differ from stored object identity?
- When does `value` need to be a property binding rather than a literal attribute?
- What does `mat-optgroup` group, and why is a group label never a selectable value?
- Now that both exist, when is the right control a menu and when is it a select?

Coverage concepts:

- [ ] `mat-select` and `mat-option` — model single or multiple selection with values whose types match the form control and distinguish literal attributes from property bindings
- [ ] Menu vs select — use a menu to invoke commands and a select to choose a value owned by a form or application state
- [ ] Material select vs native select — choose `mat-select` for Material-specific presentation and a native `<select matNativeControl>` when native accessibility, performance, or platform behaviour is the better fit
- [ ] Select vs autocomplete — use a select for a closed choice set and `mat-autocomplete` when users type into an input and choose from matching suggestions
- [ ] Basic `mat-autocomplete` — connect an input to a local option panel and distinguish the displayed label from the stored object or identifier
- [ ] Selection events vs form values — react to `selectionChange` only for side effects and read the form control for the authoritative selected value
- [ ] `mat-optgroup` — group a long option set semantically without pretending group labels are selectable values

Rationale: Select, native select, and autocomplete are three answers to one question — how a closed or suggested choice becomes a typed form value — so the choice between them, and against a menu, is only teachable once all four are on the table. Grouping and the literal-versus-bound `value` distinction belong here because both are properties of the option list, not of the field wrapper taught in 04.

Handoff: This unlocks checkboxes, radio buttons, and slide toggles in entry 06, where the choice set is small enough to stay visible instead of collapsing into a panel.

## 06 — Checkboxes, radio buttons, and slide toggles

Status: pending
Action: audit
English: notes/angular-material/junior/en/06-checkbox-radio.md
Spanish: notes/angular-material/junior/es/06-checkbox-radio.md
Depends on: 05
Pending additions: none

Narrative role: Teach boolean, multi-choice, and visible single-choice controls before date input.

Learning outcome: Select the correct control for confirmation, immediate settings, partial selection, and fixed choices.

Prerequisites: 05

Must answer:

- When should checkbox, radio, select, or slide toggle represent the choice?
- When is a slide toggle semantically different from a checkbox?
- What does indeterminate communicate, and is it a third submitted value?
- When should radio buttons replace a compact select?

Coverage concepts:

- [ ] Checkbox vs slide toggle — use a checkbox for selection or confirmation and `mat-slide-toggle` for a boolean setting whose change is presented as immediately active
- [ ] Checkbox indeterminate state — represent partial aggregate selection visually without confusing it with a third submitted boolean value
- [ ] Checkbox, radio, and select choice — use checkboxes for independent booleans or multi-select, radio buttons for a small visible single-choice set, and a select when compactness or option count warrants it

Rationale: Checkboxes, radio buttons, and slide toggles is one coherent learning unit at this point in the route.

Handoff: This unlocks datepicker and date constraints in entry 07.

## 07 — Datepicker and date constraints

Status: pending
Action: audit
English: notes/angular-material/junior/en/07-datepicker.md
Spanish: notes/angular-material/junior/es/07-selector-fecha.md
Depends on: 06
Pending additions: none

Narrative role: Apply the form-field model to dates, where representation and validation add new constraints.

Learning outcome: Configure a date adapter and enforce selectable-date rules with compatible control values.

Prerequisites: 06

Must answer:

- Why does a datepicker require an adapter?
- How do the input, toggle, picker reference, and adapter compose one control?
- What type must the control hold for the configured adapter?
- How do min, max, filters, and Material validation errors work together?

Coverage concepts:

- [ ] Datepicker composition — connect the input, toggle, picker reference, and a configured date adapter as one control
- [ ] Date-adapter compatibility — keep the datepicker control value compatible with its configured `DateAdapter` rather than hiding a representation mismatch with type assertions
- [ ] Datepicker selectable-date constraints — use `min`, `max`, and `matDatepickerFilter` to declare which dates the calendar and the input will accept
- [ ] Datepicker validation feedback — surface the validation errors those constraints produce instead of letting an out-of-range value fail only after submission

Rationale: Datepicker and date constraints is one coherent learning unit at this point in the route.

Handoff: This unlocks table structure and row lifecycle in entry 08.

## 08 — Table structure and row lifecycle

Status: pending
Action: audit
English: notes/angular-material/junior/en/08-table.md
Spanish: notes/angular-material/junior/es/08-tablas.md
Depends on: 07
Pending additions: none

Narrative role: Build the table mental model — columns, rows, refresh, and per-row interaction — before any transformation is layered on top. The existing file's sorting, filtering, and pagination sections are entry 09's scope and migrate out during the audit, so the two chapters never ship the same content twice.

Learning outcome: Define stable columns, render rows, refresh changed collections, act on the correct record from inside a row, and distinguish empty from loading or failure.

Prerequisites: 07

Must answer:

- How do column identifiers connect every table definition?
- What do you configure when the displayed value does not map directly to a row property?
- What can `[dataSource]` be given at this stage, and why is a plain array enough until entry 09?
- Why does an in-place array mutation not necessarily refresh the table?
- When is matNoDataRow actually the correct state?
- How is row identity kept explicit, so a per-row control operates on the record it belongs to?
- How do nested row actions avoid triggering row selection or navigation?

Coverage concepts:

- [ ] Material table structure — connect column definitions, header and cell templates, displayed column order, and header/data row definitions through matching column identifiers
- [ ] `matColumnDef` identity — keep the column ID consistent with `displayedColumns` and configure an accessor when the displayed value does not map directly to a row property
- [ ] Header and cell definition roles — use `matHeaderCellDef` for column labels and `matCellDef` for per-row values rather than mixing structural and data concerns
- [ ] Table refresh after collection changes — assign or emit a new data array, or call `renderRows()` after mutating a raw array, because `mat-table` does not observe in-place structural changes automatically
- [ ] Empty table state — use `matNoDataRow` or an equivalent full-width row only after distinguishing an empty successful result from loading and failure
- [ ] Table row actions — keep row identity explicit so a per-row control operates on the record it belongs to
- [ ] Nested interactive controls in rows — prevent action buttons inside a row from accidentally triggering row selection or navigation

Rationale: Everything here is the table's own anatomy — what a column is, what a row is, how the collection is refreshed, and what a control placed inside a row acts upon. Row identity and nested controls belong with the row that defines them, not with the transformation layer in 09: a junior who can sort a table but wires the delete button to the wrong record has learned the two in the wrong order.

Handoff: A row that renders correctly still cannot be searched, ordered, or paged. Entry 09 adds that transformation layer on top of the anatomy established here.

## 09 — Table data sources, sorting, filtering, and pagination

Status: pending
Action: audit
English: notes/angular-material/junior/en/09-paginator.md
Spanish: notes/angular-material/junior/es/09-paginacion-tablas.md
Depends on: 08
Pending additions: none

Narrative role: Add client- or server-owned transformations without mixing the two models. This chapter assumes Angular view queries — `@ViewChild` and `ngAfterViewInit` — from the `angular` junior topic, and must bridge the view-initialisation timing before connecting `MatSort` or `MatPaginator`, because "connect it after the view exists" is meaningless without it. It also absorbs the sorting, filtering, and pagination sections currently held by `08-table.md`.

Learning outcome: Choose a data source and integrate sorting, filtering, and pagination coherently under a single owner.

Prerequisites: 08

Must answer:

- When is MatTableDataSource appropriate and when is it not?
- Why are MatSort and MatPaginator connected after the view exists, and how are nested values adapted?
- How do client-side and server-side pagination differ?
- How do backend `length`, `pageIndex`, and `pageSize` keep a server-side paginator truthful?
- Why must filtering define fields and normalisation explicitly?
- Why must filtering reset an invalid current page?

Coverage concepts:

- [ ] Table data-source choices — choose a plain array, observable/custom `DataSource`, or `MatTableDataSource` according to who owns retrieval, transformation, and lifecycle
- [ ] `MatTableDataSource` scope — use the convenience class for simple client-side sorting, filtering, and pagination, not as a server-side data-access abstraction
- [ ] Sort integration — connect `MatSort` after the view exists, mark only sortable headers, and handle nested or derived values through a sorting accessor or server query
- [ ] Paginator integration — connect `MatPaginator` for client data or translate page events into backend parameters without paginating the same result twice
- [ ] Server-side paginator state — bind `length` to the backend's total matching count and treat `pageIndex` and `pageSize` as request state so the controls remain correct when only one page of rows is loaded
- [ ] Filter semantics — define which fields and normalisation rules filtering uses instead of assuming the default row stringification matches the product
- [ ] Reset pagination after filtering — return to a valid first page when a narrower client-side filter can make the current page empty
- [ ] Client-side vs server-side table operations — let `MatTableDataSource` transform an in-memory collection or translate sort, filter, and page events into backend queries, never both for the same dataset

Rationale: Sorting, filtering, and paging are not three features but one decision made three times — who owns the transformation, the browser or the backend. They are taught together because the failure they produce is shared: paginating an already-paginated result, or filtering a page instead of the set. Splitting them would hide the single question that governs all three.

Handoff: The row action established in entry 08 can now operate on a filtered, sorted page — but a destructive one must not fire on an unconfirmed click. That decision belongs in an overlay, which is entry 10.

## 10 — Dialogs and confirmation flows

Status: pending
Action: audit
English: notes/angular-material/junior/en/10-dialog.md
Spanish: notes/angular-material/junior/es/10-dialogos.md
Depends on: 09
Pending additions: none

Narrative role: Use overlays for focused input and decisions with explicit typed boundaries.

Learning outcome: Open, size, focus, close, and consume a dialog while handling every dismissal path safely.

Prerequisites: 09

Must answer:

- What crosses MAT_DIALOG_DATA and what returns through MatDialogRef?
- How should cancellation, backdrop, and Escape differ from confirmation?
- When is disableClose justified?
- Why must title, content, and actions be siblings rather than nested?
- When is `mat-dialog-close` enough, and when do you need a handler instead?
- What keeps a dialog usable and accessible on a small viewport?

Coverage concepts:

- [ ] `MatDialog` and `MatDialogRef` — open overlay content from the caller and control its lifecycle and result through the returned reference
- [ ] Dialog component input — use `MAT_DIALOG_DATA` for an explicit, typed input boundary rather than reaching into caller state
- [ ] Dialog result channel — close with an explicit typed result and consume `afterClosed()` so the caller distinguishes success, cancellation, and dismissal
- [ ] Confirm/cancel semantics — perform destructive work only after an affirmative result and treat backdrop, Escape, and cancel-button dismissal consistently
- [ ] Default dismissal vs `disableClose` — preserve backdrop and Escape dismissal by default and disable them only when the interaction has a justified alternative exit because dialogs are expected to remain keyboard operable
- [ ] Dialog content structure — keep title, content, and actions as sibling regions so layout, scrolling, labelling, and action placement remain correct
- [ ] Declarative vs programmatic closing — use `mat-dialog-close` for simple results and a handler when validation, unsaved changes, or asynchronous work must run before closing
- [ ] Dialog focus management — preserve an accessible name, focus trap, sensible initial focus, focus restoration, and Escape behaviour unless a justified accessible alternative exists
- [ ] Dialog viewport constraints — use width and maximum-size configuration so overlay content remains usable without overflowing small viewports

Rationale: Dialogs and confirmation flows is one coherent learning unit at this point in the route.

Handoff: This unlocks snack bars and progress feedback in entry 11.

## 11 — Snack bars and progress feedback

Status: pending
Action: audit
English: notes/angular-material/junior/en/11-snackbar.md
Spanish: notes/angular-material/junior/es/11-snackbar.md
Depends on: 10
Pending additions: none

Narrative role: Separate transient feedback from blocking decisions and measurable progress. This chapter absorbs the progress-indicator half of the retired `17-tooltip-progress.md`; its tooltip half belongs to entry 03.

Learning outcome: Choose an appropriate feedback or progress component and configure its lifecycle accessibly.

Prerequisites: 10

Must answer:

- When should feedback block the user?
- How do you inject and call `MatSnackBar.open()`, and what does each part of its configuration control?
- When should a snack bar time out or expose an action?
- When is progress determinate rather than indeterminate?

Coverage concepts:

- [ ] Snack bar vs dialog — use a snack bar for brief non-blocking feedback and a dialog for focused input or a decision that requires interaction
- [ ] `MatSnackBar.open()` lifecycle — provide concise content and ensure the feature imports the snack-bar API it uses
- [ ] Timed vs actionable snack bars — auto-dismiss informational feedback after a suitable duration but keep an action available long enough for the user to perceive and operate it
- [ ] Progress spinner vs progress bar — choose a spinner for local indeterminate waiting, an indeterminate bar for page or section activity, and a determinate bar only when a real percentage exists

Rationale: Snack bars and progress feedback is one coherent learning unit at this point in the route.

Handoff: This unlocks toolbar, sidenav, and routed navigation in entry 12.

## 12 — Toolbar, sidenav, and routed navigation

Status: pending
Action: audit
English: notes/angular-material/junior/en/12-sidenav.md
Spanish: notes/angular-material/junior/es/12-navegacion-lateral.md
Depends on: 11
Pending additions: none

Narrative role: Compose an application shell while leaving navigation authority with Angular Router. This chapter assumes Angular Router fundamentals from the `angular` junior topic and must bridge route activity before using any Material navigation state. It also absorbs the whole of the retired `16-toolbar.md`.

Learning outcome: Build a responsive toolbar and sidenav shell and choose correctly between routes and tabs.

Prerequisites: 11

Must answer:

- What does `mat-toolbar` actually own, and what is ordinary flex layout still responsible for?
- How do the three sidenav elements share layout context?
- How do side, push, and over change content behaviour?
- Why does Router remain responsible for active navigation?
- When are tabs not a substitute for routes?

Coverage concepts:

- [ ] Toolbar composition — use `mat-toolbar` for persistent application-level actions and ordinary flex layout to position its content
- [ ] Sidenav structure — compose `mat-sidenav-container`, `mat-sidenav`, and `mat-sidenav-content` so the drawer and main content share the required layout context
- [ ] Sidenav modes — choose `side`, `push`, or `over` according to available space and whether content should resize, shift, or sit behind an overlay
- [ ] Navigation lists and active state — use `mat-nav-list` and Material list items for navigation while Angular Router remains responsible for navigation and route activity
- [ ] Tabs vs route navigation — use `mat-tab-group` for related in-page views and routes for destinations that need navigation history, deep links, or independent URLs

Rationale: Toolbar, sidenav, and routed navigation is one coherent learning unit at this point in the route.

Handoff: Once the application shell defines the page regions, cards provide the next-level content grouping inside those regions.

## 13 — Cards and information grouping

Status: pending
Action: audit
English: notes/angular-material/junior/en/13-card.md
Spanish: notes/angular-material/junior/es/13-tarjetas.md
Depends on: 12
Pending additions: none

Narrative role: Introduce a restrained visual container after the page shell exists.

Learning outcome: Group related content with the right card regions and emphasis.

Prerequisites: 12

Must answer:

- Which card regions are optional?
- When should a card be outlined rather than raised?
- When does a card add hierarchy, and when is it unnecessary decoration?

Coverage concepts:

- [ ] Card structure and appearance — group related content with optional header, content, and actions and choose raised or outlined emphasis consistently

Rationale: Cards and information grouping is one coherent learning unit at this point in the route.

Handoff: Cards close the page-composition branch; entry 14 deliberately returns to the form model from entries 04–07 to coordinate it across several stages.

## 14 — Linear steppers

Status: pending
Action: audit
English: notes/angular-material/junior/en/14-stepper.md
Spanish: notes/angular-material/junior/es/14-pasos.md
Depends on: 04, 05, 06, 07
Pending additions: none

Narrative role: Apply form validity to a multi-stage interaction after individual controls are understood.

Learning outcome: Build a linear stepper whose form controls, not button handlers alone, govern progression.

Prerequisites: 04, 05, 06, 07

Must answer:

- What makes a stepper genuinely linear?
- How do reactive-form validity and `stepControl` share responsibility?
- Why is manual navigation not a replacement for stepControl validity?
- How should validation errors be surfaced before moving forward?

Coverage concepts:

- [ ] Stepper linear flow — pair `linear` with step controls so validity governs progression rather than relying only on button handlers

Rationale: Linear steppers is one coherent learning unit at this point in the route.

Handoff: This unlocks accessibility, responsiveness, and component harnesses in entry 15.

## 15 — Accessibility, responsiveness, and component harnesses

Status: pending
Action: create
English: notes/angular-material/junior/en/15-accessibility-testing.md
Spanish: notes/angular-material/junior/es/15-accesibilidad-pruebas.md
Depends on: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14
Pending additions: none

Narrative role: Close the junior route by testing public behaviour and adapting components to real users and screens. This chapter assumes Angular TestBed fundamentals from the `angular` junior topic, and must introduce the harness environment and loader before any component-specific harness API.

Learning outcome: Audit application-owned accessibility and responsiveness and test Material behaviour through harnesses.

Prerequisites: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14

Must answer:

- What accessibility does Material provide, and what remains the application responsibility?
- Why does a Material page still need explicit responsive composition?
- How are the same carried-through business page and critical flow audited for accessibility, responsive layout, and public behaviour?
- How do the harness environment and loader reach a Material component under TestBed?
- Why are harnesses more stable than private DOM selectors?
- Which user-visible flows deserve harness interaction tests?

Coverage concepts:

- [ ] Built-in accessibility vs application responsibility — rely on supported Material semantics and keyboard behaviour while still providing labels, logical focus order, and meaningful state communication
- [ ] Responsive Material composition — adapt sidenav mode, dialog dimensions, action density, and wide-table presentation because Material components do not make a page responsive automatically
- [ ] Material component harnesses — test supported user-visible behaviour through stable harness APIs instead of querying private DOM structure or CSS classes
- [ ] Harness interaction tests — use component-specific harness methods to verify critical validation feedback, dialog results, and table interactions rather than snapshotting generated markup

Rationale: Accessibility, responsiveness, and component harnesses is one coherent learning unit at this point in the route.

Handoff: This closes the junior journey by making the component knowledge testable, accessible, responsive, and ready for consolidation.

## Unassigned existing notes

- notes/angular-material/junior/en/16-toolbar.md — junior material to be absorbed into entry 12 and retired by the notes author/reviewer pipeline; it is not part of the canonical 00–15 route.
- notes/angular-material/junior/en/17-tooltip-progress.md — junior material to be split between entries 03 and 11 and retired by the notes author/reviewer pipeline; it is not part of the canonical 00–15 route.
