# Middle Coverage — CSS

Concepts expected when a developer owns component-system styling and responsive behaviour beyond ordinary page layouts.

## Modern cascade and authoring

- `:has()` relational selector — read and write simple parent- or sibling-state selectors while keeping a class or state attribute as the clearer option when application logic already owns the state
- `:is()` vs `:where()` — both group selector alternatives, but `:is()` takes the specificity of its most specific argument while `:where()` always contributes zero specificity
- Cascade layers with `@layer` — order style origins deliberately without escalating selector specificity
- Native CSS nesting — organise related selectors without changing the resulting specificity unintentionally
- Sass nesting vs native CSS nesting — compare their parsing and emitted-selector behaviour before migrating build-time Sass syntax to the platform
- Deep BEM structures — keep element names flat rather than encoding DOM depth when a team chooses BEM for a large global stylesheet

## Component-responsive layout

- Intrinsic sizing — recognise `min-content`, `max-content`, and `fit-content()` as sizes derived from content rather than arbitrary fixed dimensions
- Container queries — adapt a component to its available container rather than the global viewport
- Subgrid — align nested content with an ancestor grid when independent nested tracks would drift
- Registered custom properties with `@property` — give custom properties syntax, inheritance, and animatable initial values
