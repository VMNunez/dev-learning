# Senior Coverage — HTML

Platform-level markup work and accessibility responsibility beyond a single feature: encapsulation primitives, authoring a widget nobody has an element for, and owning conformance across a product.

- Custom elements and the shadow DOM — define an element with its own lifecycle and an encapsulated subtree, and account for what encapsulation does to the accessibility tree, focus delegation and form participation
- `<template>` and `<slot>` composition — distribute light-DOM content into a shadow tree and reason about which tree a selector, an event and an accessible name each resolve against
- Authoring a widget to the ARIA Authoring Practices — implement a pattern the platform has no element for, to its full published keyboard, role and state contract, and accept the maintenance that contract implies
- Cross-AT verification — validate a flow across several screen-reader and browser pairings, where the same correct markup is announced differently and the specification does not settle which is right
- Accessibility conformance ownership — run an audit against WCAG 2.2 AA and the applicable legal instrument, produce the conformance statement, and sequence remediation across a product rather than a page
- A document usable without its scripts — design markup that carries the content and the core interactions before any script runs, so a failed bundle degrades the page instead of blanking it; the rendering and hydration strategy that ships it is the framework's decision, not the document's
- Bidirectional and internationalised markup — `dir`, `bdi` and locale-driven document structure for scripts whose reading order the layout cannot assume
