# Middle Coverage — CSS

Concepts expected when a developer owns component-system styling and responsive behaviour beyond ordinary page layouts.

## Modern cascade and authoring

- Cascade layers with `@layer` — order style origins deliberately without escalating selector specificity
- Native CSS nesting — organise related selectors without changing the resulting specificity unintentionally
- Sass nesting vs native CSS nesting — compare their parsing and emitted-selector behaviour before migrating build-time Sass syntax to the platform
- Deep BEM structures — keep element names flat rather than encoding DOM depth when a team chooses BEM for a large global stylesheet

## Component-responsive layout

- Container queries — adapt a component to its available container rather than the global viewport
- Subgrid — align nested content with an ancestor grid when independent nested tracks would drift
- Registered custom properties with `@property` — give custom properties syntax, inheritance, and animatable initial values
