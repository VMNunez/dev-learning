# Middle Coverage — CSS

Concepts expected when a developer owns component-system styling and responsive behaviour beyond ordinary page layouts.

## Modern cascade and authoring

- Cascade layers with `@layer` — order style origins deliberately without escalating selector specificity
- `:has()` relational selectors — style an element from descendant or sibling state while considering selector cost and browser support
- Native CSS nesting — organise related selectors without changing the resulting specificity unintentionally

## Component-responsive layout

- Container queries — adapt a component to its available container rather than the global viewport
- Subgrid — align nested content with an ancestor grid when independent nested tracks would drift
- Registered custom properties with `@property` — give custom properties syntax, inheritance, and animatable initial values
