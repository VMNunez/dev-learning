# Coverage Verify — HTML Junior

Verdict: gaps
Coverage SHA-256: 29b2ba5de53e5768e72f35f660591788520919dc2d90bbe998193f2e03c71648
Verified: 2026-09-08

## Open gaps

- [junior] `data-*` attributes — the only standard way to attach author-defined data to an element without inventing a non-conforming attribute, read back through `dataset` and conventionally used to mark elements for tests (`data-testid`), so application state is not smuggled into `class` or `id` [Element semantics and content model]
- [junior] Implicit form submission — pressing Enter in a text field submits the form through its first submit button, so a form with no submit button silently does nothing on Enter while a stray default-`type` button submits when it was never meant to [Forms and labelling]
- [junior] Inline `<svg>` and icon markup — an SVG is not an `<img>` and has no `alt`, so a decorative icon is removed from the tree with `aria-hidden="true"` and a meaningful one is named with `role="img"` plus an `aria-label`; left as-is it is announced as an unnamed graphic or as its raw text nodes [Images]

## Locked placement conflicts

*(none)*
