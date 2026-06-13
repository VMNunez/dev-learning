# Future Learning — Angular Material

Concepts that are real and worth knowing, but not needed to pass a junior screening in 2026. Revisit these after landing the first job or when they appear in a project.

---

## Phase 1 — After the first job

- **Custom theme from scratch** — defining your own `$primary`, `$accent`, `$warn` palettes with custom hues instead of using prebuilt palettes; not tested at junior level but needed if you join a team with a design system
- **`mat.button-overrides()` and `mat.theme-overrides()`** — granular token overrides for specific components; useful when you need to change one visual detail without redefining the whole palette; post-junior refinement
- **Dark mode support** — defining a dark palette and switching themes at runtime; common in production apps but not a junior interview topic
- **Custom form controls** — implementing `ControlValueAccessor` to make a non-standard component work inside `mat-form-field` with reactive forms; mid-level topic, not needed until you build design system components

---

## Phase 2 — Mid-level growth

- **CDK (Component Dev Kit)** — the low-level toolkit behind Angular Material (`DragDropModule`, `OverlayModule`, `A11yModule`, `PortalModule`); used when you need to build custom Material-style components from scratch
- **Virtual scrolling (`CdkVirtualScrollViewport`)** — renders only visible rows in a very large list; needed for performance in apps with thousands of rows; not a junior concern
- **`MatTree`** — hierarchical data display; used in file explorers and nested menus; appears in enterprise apps but rarely tested at junior level
- **`MatChips`** — tag input for multi-value fields (e.g. skills, tags, filters); common in enterprise UIs but not in the projects done so far
- **`MatAutocomplete`** — search input with live dropdown suggestions; useful in large forms but requires integration with an API or a large dataset to be meaningful
- **`MatBottomSheet`** — like `MatDialog` but slides up from the bottom; mobile-first pattern; not common in desktop enterprise apps

---

## Phase 3 — Post-hire senior path

- **Custom MDC-based component theming** — using Material Design Components web tokens directly instead of Angular Material's wrapper; advanced customisation for teams that need pixel-level control
- **Accessibility audit** — full `aria-*` attribute coverage, screen reader testing with NVDA or VoiceOver, keyboard-only navigation through the whole app; important for public-sector and government contracts in Spain (legally required in some cases)
- **Animation customisation** — overriding Angular Material's built-in enter/leave animations with custom Angular `AnimationBuilder` transitions; post-senior refinement
