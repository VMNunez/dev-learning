# Future Learning — Angular Material

Concepts that are real and worth knowing, but not needed to pass a junior screening in 2026. Revisit these after landing the first job or when they appear in a project.

> **Promotions on 2026-07-19 (coverage audit).** Dark mode, `mat.<component>-overrides()`, `MatChips`, `MatAutocomplete`, `MatExpansionPanel`, `MatIconRegistry` with SVG, `ng update` migration schematics, generating a palette from a brand colour, and the CDK's drag-drop / virtual-scroll / focus-trap / `BreakpointObserver` surface all moved **out of this file and into `coverage.md`**. The market and the adversarial-interviewer pass agreed they are now junior-level: Material v19 makes dark mode a token switch rather than a second theme, and the CDK items are the ones interviewers use to test whether a candidate has built a real screen. What stays below is the deeper authoring work behind each.

---

## Phase 1 — After the first job

- **Custom form controls** — *implementing* `ControlValueAccessor` and `MatFormFieldControl` (with `stateChanges`, `errorState`, `setDescribedByIds`) so a non-standard component works inside `mat-form-field`; mid-level topic, not needed until you build design-system components. Knowing *what* `ControlValueAccessor` is and why Material controls bind to `formControlName` is in coverage — writing one is not
- **The MDC rewrite internals** — what actually changed under the hood in Material v15 and how the wrapper maps to the underlying web components; recognising `.mat-mdc-*` classes and knowing they are not a public API is in coverage, the internals are not
- **`MatBadge`** — small numeric or status indicator overlaid on an icon (e.g. notification count); cosmetic addition, not a junior interview topic
- **`MatBottomSheet`** — like `MatDialog` but slides up from the bottom; mobile-first pattern, not common in desktop enterprise apps

---

## Phase 2 — Mid-level growth

- **CDK Overlay authoring** — the `Overlay` service, `OverlayConfig`, `FlexibleConnectedPositionStrategy`, and `ComponentPortal` vs `TemplatePortal`; building your own floating panel from scratch. Knowing that overlays render outside your component's DOM (and what that does to styling) is in coverage — constructing one is not
- **`ScrollDispatcher` / `cdkScrollable`** — registering custom scroll containers so overlays reposition or close correctly inside them
- **`ListKeyManager` / `ActiveDescendantKeyManager`** — the CDK helpers that give arrow-key navigation to a custom listbox or menu; needed only when hand-building a keyboard-navigable control
- **`MediaMatcher` vs `BreakpointObserver`** — the imperative one-shot alternative to the observable stream that is in coverage
- **`MatTree`** — hierarchical data display with flat and nested data sources; used in file explorers and permission trees, rarely tested at junior level
- **`mat-tab-nav-bar` + `router-outlet`** — routed tabs where each tab owns a URL, versus the in-component `mat-tab-group` that is in coverage
- **Custom `ComponentHarness` subclasses** — writing your own harness for your own components; using Material's built-in harnesses is in coverage, authoring one is not
- **Custom `DateAdapter` implementation** — writing a Luxon or date-fns adapter rather than configuring the ones that ship; knowing the adapter and `MAT_DATE_FORMATS` exist and what each controls is in coverage
- **`MatPaginatorIntl` / `MatDatepickerIntl` subclassing** — wiring Material's label tokens into a full i18n pipeline; knowing the token exists and why it is the translation hook is in coverage, implementing the subclass is not
- **Custom `DataSource` subclass** — extending the CDK `DataSource` with `connect()`/`disconnect()` for server-side paged or streaming tables; the junior-level version is binding `[length]` and reacting to `(page)` and `(matSortChange)`, which is in coverage
- **`MAT_RIPPLE_GLOBAL_OPTIONS` and `matRipple`** — tuning or disabling Material's ripple feedback globally

---

## Phase 3 — Post-hire senior path

- **Material under SSR and hydration** — overlays, `BreakpointObserver`, and direct `window` access are the usual breakages when server rendering is switched on; only relevant once the project actually needs SSR (which most internal consultancy apps do not)
- **Material under zoneless change detection** — the library's compatibility story as Angular moves off Zone.js; the concept of zoneless is in the Angular coverage, the Material migration is senior work
- **Performance of Material at scale** — the cost of a `matTooltip` and a `mat-menu` on every row of a 500-row table (hundreds of listeners and overlay triggers), and the patterns that avoid it
- **Custom MDC-based component theming** — using Material Design Components web tokens directly instead of Angular Material's wrapper; advanced customisation for teams that need pixel-level control
- **Accessibility audit** — full `aria-*` coverage, screen-reader testing with NVDA or VoiceOver, keyboard-only navigation through the whole app, and `forced-colors` / Windows high-contrast support; legally required for some Spanish public-sector contracts, so it arrives on the job rather than in the screening
- **Animation customisation** — overriding Angular Material's built-in enter/leave animations with custom Angular `AnimationBuilder` transitions; post-senior refinement
