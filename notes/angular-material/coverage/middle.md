# Middle Coverage — Angular Material

Concepts expected when a developer can adapt Angular Material to a production design system and select components beyond the junior table/form/dialog floor.

## Theming and custom controls

- Custom theme palettes — define product palettes and semantic colours instead of relying only on prebuilt themes
- Component and theme token overrides — customise a narrow visual contract without depending on brittle internal selectors
- Runtime dark mode — switch complete theme token sets while preserving contrast and user preference
- Material custom form controls — integrate a `ControlValueAccessor` with `mat-form-field`, validation, focus, and error state

## CDK and scale-oriented components

- Angular CDK — choose low-level overlay, portal, drag-drop, and accessibility primitives when Material has no suitable component
- Virtual scrolling — render large collections through `CdkVirtualScrollViewport` and understand its fixed/dynamic sizing trade-offs
- `MatAutocomplete` with remote data — combine form streams, cancellation, loading, and option identity for production lookup fields
- Hierarchical and dense navigation — choose `MatTree`, tabs, or expansion panels according to information structure rather than appearance
- Multi-value inputs — implement chips, selection, removal, keyboard interaction, and validation for tag-like data
