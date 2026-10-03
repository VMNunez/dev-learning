# Angular Material Junior Notes Plan

Plan status: current
Coverage: notes/angular-material/coverage/junior.md
Coverage SHA-256: d0d8de6e0fbfcf7d9883c5e1d29d3c4dbdb27e7614d18b020c8412d0c938dcf0
Generated: 2026-10-03

## 00 — Introduction to Angular Material

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/00-introduction.md
Spanish: notes/angular-material/junior/es/00-introduccion.md

Depends on: none

Pending additions: none

Narrative role: Orient Victor before any component API appears: what the library is, what it is for in an ordinary business interface, the handful of ideas every later chapter repeats, and the route through chapters 01 to 24. It also names the business screen the route keeps returning to — a list of records with row actions, an add/edit dialog and a shell around it — so that later chapters extend a known example instead of starting a new one.

Learning outcome: Victor can say what Angular Material is and what it leaves to the application, name the ideas that recur in every chapter — a component imported where it is used, a theme behind every colour, panels that open outside the page, accessibility shared between the library and the application — and describe the order of chapters 01 to 24 and why it runs that way.

Prerequisites: none

Must answer:

- Which sections does this introduction itself walk through, in what order, and why does each one come before the next?
- What problem does Angular Material solve in a business interface — the buttons, forms, tables and dialogs every screen needs — and what does it deliberately leave to the application?
- What does the word "Material" name — the Material Design system and its current version, Material 3, and the Angular Material library that implements it — which of them is this topic about, and what is the CDK that ships beside the library (named here, taught in chapter 01)?
- Which ideas come back in every chapter — a component imported where it is used, a theme behind every colour, panels that open outside the page, accessibility split between the library and the application — and what does each one look like the first time it is met?
- What changes for someone used to styling with Tailwind or a CSS class library, given that Material delivers Angular components with behaviour rather than class names?
- Where does Angular Material sit in Victor's Angular + Spring Boot stack, and in the screens a consultancy project is made of?
- Which Angular knowledge does this route assume rather than teach — a standalone component's `imports`, component style encapsulation, signals, `inject()` and injection tokens, reactive forms, observables with `subscribe` and `toSignal`, the Router, a destroy callback, view queries, HTTP calls, TestBed — and which chapter is the first to lean on each?
- What must already be in place and understood before chapter 01 is readable — an Angular CLI project, what a schematic is, a standalone component's `imports` array, the application's providers, the global stylesheet and the `angular.json` entry that lists it, `index.html`, and `package.json` with what a major version is — and what is each, in one line?
- How do chapters 01 to 24 progress — setup and a first component, theming and styling rules, then menus, forms, tables, dialogs and feedback, then the layout of a page and its shell, and finally responsiveness, accessibility and testing — and why is that the order?

Coverage concepts: none

Rationale: This chapter carries no coverage bullet by design. It is the orientation that makes the rest of the route readable, and every concept it names is taught in the chapter that owns it. Two of its questions are ones the rest of the route cannot supply: the map of the introduction's own sections, and the things chapter 01 assumes without saying so.

Handoff: The map starts where the library enters a project: chapter 01 installs Angular Material and establishes what it is made of.

## 01 — Setup and the component model

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/01-setup-component-model.md
Spanish: notes/angular-material/junior/es/01-configuracion-modelo-componentes.md

Depends on: 00

Pending additions: none

Narrative role: Put the library into a real project and establish what it is made of, so that every later chapter can say "import this, provide that" without explaining it again.

Learning outcome: Victor can install Angular Material with its schematic and say what the schematic changed, explain how the component library, the Material Design system and the CDK relate, add a component's import and a feature's provider where each belongs, and find the documentation that matches the installed version.

Prerequisites: 00

Must answer:

- What is Material Design, what is Angular Material, and what is the CDK — and which of the three does an import such as `MatButtonModule` come from?
- What does `ng add @angular/material` do to a project that installing the package alone would not — which files does it change, what does it ask in the installed version, and which of the things older guides show it setting up (typography, animations) does it still set up?
- Why does a Material component have to be imported in the component whose template uses it, and what makes a feature such as date handling need a provider as well as an import?
- What does the library decide for a page, what stays ordinary Angular — state, forms, templates, layout CSS — and what goes wrong when a page is designed around the library's components instead of around its own data?
- How do you find out which major version of Angular Material a project uses, why does an example written for another major version fail, and what does the official update command do that editing `package.json` by hand does not?

Coverage concepts:

- [ ] Angular Material, Material Design, and the CDK — distinguish the styled Angular component library, the design system it implements, and the lower-level behaviour primitives it builds upon
- [ ] `ng add @angular/material` — use the library schematic to install Material and the CDK and apply the selected animation, typography, and theme setup
- [ ] Material-specific imports and providers — recognise which components need a template import and which features, such as date handling, also need a provider
- [ ] Material composition boundary — combine Material interaction primitives with ordinary Angular state, forms, templates, and CSS instead of treating the library as page architecture
- [ ] Version-matched documentation and migrations — consult the docs for the installed Angular Material major version and use official update tooling instead of copying obsolete selectors or theming APIs

Rationale: These five are what has to be true before any component can be used: what the library is, how it enters the project, how a component and a provider are made available, what the library is not responsible for, and which documentation applies. They come first because every later chapter opens with an import and assumes the reader knows why it is there.

Handoff: The library is installed. Chapter 02 puts its smallest component on the page: the button.

## 02 — Buttons and icons

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/02-button.md
Spanish: notes/angular-material/junior/es/02-botones.md

Depends on: 01

Pending additions: none

Narrative role: Introduce the first component — the action a user clicks — and the icon it often carries, as the first concrete use of an import from chapter 01. Its colours come from the theme the schematic installed, which chapter 03 opens.

Learning outcome: Victor can choose the button variant that matches an action's importance, say when a floating action button is justified, write an icon-only button with a name, and explain where an icon's glyph comes from and why it fails to render when its source is missing.

Prerequisites: 01

Must answer:

- Which button variants exist, how does the importance of an action decide between them, and what does a screen with three equally prominent buttons get wrong?
- What is `matIconButton`, what is an accessible name and who reads it, and how is a button whose only content is an icon given one?
- What is a floating action button for, how do `matFab` and `matMiniFab` differ, and why is "this is a positive action" not a reason to use one?
- What does `mat-icon` actually render, where does the glyph come from — an icon font the page has loaded, or an SVG icon the application has registered — why is no icon available until one of the two is in place, and what appears on screen when the icon font was never loaded?

Coverage concepts:

- [ ] Material button variants — choose a visually prominent button for the primary action and lower-emphasis variants for secondary or tertiary actions
- [ ] FAB vs ordinary button — reserve `matFab` or `matMiniFab` for a dominant screen-level action rather than every positive action
- [ ] `mat-icon` and icon fonts — understand that the component renders an icon name from a loaded icon font or registered SVG set rather than bundling every icon automatically

Audit note: Move the `Customizing button colors — the correct way (Angular Material v19+)` section, with its five subsections, to 03; retain `Basic usage`, `Button types`, `Rule of thumb` and `Icon buttons — matIconButton, matFab, matMiniFab` here.

Rationale: A button and its icon are one unit because they answer one question — how an action is presented and how much attention it claims. The variants, the FAB and the icon are three settings of that same decision, and the icon's source is the one thing that can make a correct button render as a word instead of a glyph. The button comes before the theme so that chapters 03 and 04 can show every effect on a component the reader has already written.

Handoff: The button arrived with a colour, a shape and a font nobody chose. Chapter 03 shows where they come from: the theme.

## 03 — Theming with `mat.theme()` and system tokens

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/03-theming.md
Spanish: notes/angular-material/junior/es/03-temas.md

Depends on: 01, 02

Pending additions: none

Narrative role: Explain where every Material colour, font and spacing value comes from, so that changing the look of the application is done in one place rather than component by component. This chapter leans on Sass, which no entry of this plan teaches: before the first theme it restates, in a short bridge, the pieces of Sass syntax a theme file uses — `@use … as mat`, `@include` of a mixin, a `$variable` and a map written in parentheses — and nothing more of the language. Its examples show the theme on the button of chapter 02; where one names a form field, it is introduced in one line and marked as a preview of chapter 06.

Learning outcome: Victor can read and write a Material 3 theme with `mat.theme()`, say what a seed colour, a system token, a density step and a prebuilt theme are, change a design value through the theme's own overrides, and read a `--mat-sys-*` colour role from application CSS.

Prerequisites: 01, 02

Must answer:

- What do the lines of a theme file mean to someone who has only written plain CSS — `@use '@angular/material' as mat`, an `@include` of `mat.theme` with its map, a `$variable` — and why does a theme live in a `.scss` file?
- What does a theme control, where are its styles emitted, and what happens — on screen and in the size of the CSS — when they are emitted twice or not at all?
- When is a prebuilt theme enough, and what does a Sass theme let the product control that a prebuilt one does not?
- What does `mat.theme()` take and what does it produce, and why does a theme written this way keep working when a component's internal markup changes?
- Why is the primary colour on screen not the brand colour that was given as the seed, and what is lost by forcing the seed back with CSS?
- How is one design value — a corner radius, a colour role — changed for the whole application at once, and what happens when its token name is misspelled?
- How is one region of the page, or one kind of button, given different colours by applying a theme to a narrower selector rather than by overriding the component's CSS?
- What is density, which values does its scale take, where is it declared so that every component inherits it, and why is padding tuned per table or per form field the wrong tool?
- Which roles does the theme already expose as `--mat-sys-*` custom properties, and when should application CSS read one of them instead of defining a variable of its own?

Coverage concepts:

- [ ] Theme application — recognise that a Material theme controls colour, typography, and density, and ensure the application emits the required core and component styles once
- [ ] Prebuilt vs custom themes — choose a prebuilt theme for fast setup or a Sass theme when the product needs controlled colour, typography, or density
- [ ] `mat.theme()` — apply a supported Material 3 theme without depending on the generated component DOM
- [ ] A palette generated from one seed colour — a Material 3 theme derives a whole tonal ramp from a single brand colour, so the rendered primary is a tone of that ramp rather than the seed itself, and forcing the seed back with CSS discards the contrast relationships the ramp guarantees
- [ ] System token overrides — change a theme value through the theme's own override map rather than restyling components, so one declaration moves every place that token is read and a misspelled token fails the build instead of being silently ignored
- [ ] Density as a single inherited scale — density is one negative step on a 0 to -5 scale declared with the theme and inherited by every component, not padding tuned per table or per form field
- [ ] System colour roles over ad-hoc custom properties — express a role the theme already defines (surface, outline, secondary text) with its `--mat-sys-*` token so one theme change moves every use of that role at once

Audit note: Absorb the `Customizing button colors — the correct way (Angular Material v19+)` section, with its five subsections, from 02.

Rationale: A theme is one mental model: a set of named values — colour roles, typography, shape, density — computed once and read by every component. The seven concepts are that model seen through its practical questions: what a theme controls and how it is applied, which kind of theme to start from, how it is written, where its colours come from, how one value is changed, how compactness is set, and how application CSS reads the same values. It comes directly after the button and before every other component because each component's look is this theme, and a learner who has only a button to restyle is the one who can still be shown the right place to do it.

Handoff: The theme is the supported way to change how Material looks. Chapter 04 covers what remains: where application CSS is still needed, and the places where it does not reach a Material component the way it reaches an ordinary element.

## 04 — Styling boundaries: where application CSS reaches and where it does not

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/04-styling-boundaries.md
Spanish: notes/angular-material/junior/es/04-limites-de-estilos.md

Depends on: 01, 02, 03

Pending additions: none

Narrative role: Draw the line between the application's CSS and the library's before the route moves past the button, by explaining how a Material component's styles actually reach the page. This chapter assumes Angular's component style encapsulation from the `angular` junior topic and restates it in a short bridge before building on it. Some of its examples name components the route has not taught yet — a form-field error, a dialog, a menu — and each is introduced in one line and marked as a preview of the chapter that teaches it.

Learning outcome: Victor can decide, for any visual change, whether it belongs to layout CSS, to the theme or to a public class, and can explain three behaviours that otherwise look like bugs: an override that loses to the component's own stylesheet, a borrowed library class that carries no style, and a panel that the opener's ancestor selectors and inherited values do not reach.

Prerequisites: 01, 02, 03

Must answer:

- Which visual changes belong to application CSS — layout, spacing between components, responsive composition — and which belong to Material's own APIs?
- What makes a class or an element inside a Material component "internal", why may it change between releases, and what are the supported alternatives — theme tokens, mixins, public host classes?
- When does a Material component's own stylesheet enter the document, why does a global rule of equal specificity then lose to it, and what is the fix that does not reach for `!important`?
- Why does a library class placed on a plain element render unstyled on a page where no instance of its component exists, and what does that look like on screen?
- Where in the document do dialogs, menus, select panels, tooltips and snack bars render; which of the opener's styles still reach them — rules on elements written in the opener's own template — and which do not — selectors that depend on an ancestor in the opener, values inherited from it, the panel the library generates — and where does a rule for the panel have to live?

Coverage concepts:

- [ ] Page layout vs component theming — use application CSS for layout, spacing, and responsive composition while using Material APIs for component internals
- [ ] Supported theming vs internal selectors — prefer theme tokens, mixins, and public host classes because internal DOM and CSS classes are private and may change between releases
- [ ] A component's own styles arrive after the global stylesheet — a Material component adds its stylesheet to the document when it first renders, so a global rule of equal specificity that restyles its public class loses the tie on source order; the override names the component's class as well, or goes through its token, rather than reaching for `!important`
- [ ] A library class only carries styles while its component is on the page — the same stylesheet that arrives when a component first renders is the *only* place its public classes are styled, so borrowing one for a plain element on a view that renders no instance of that component leaves the element unstyled and inheriting; the visible symptom is an error message that renders in the body's colour on the one page whose failure state contains no field
- [ ] Overlay styling boundary — recognise that dialogs, menus, selects, tooltips, and snack bars render in an overlay container outside the opener's component subtree

Rationale: All five concepts follow from three facts about how a Material component is delivered: it brings its own stylesheet when it first renders, it keeps part of its markup private, and it opens its panels in a container outside the page. Layout versus theming, supported versus internal selectors, a source-order tie the application loses, a borrowed class with no styles behind it, and an overlay the opener's CSS only partly reaches are their consequences. Learning them as one model, with one component already in hand, is what stops a junior from reaching into private markup or for `!important` in every later chapter.

Handoff: The last of those facts is still only a claim: no component so far has opened anything outside the page. Chapter 05 opens the first one that lives in that overlay container: the menu.

## 05 — Menus, tooltips, and badges

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/05-menu.md
Spanish: notes/angular-material/junior/es/05-menus.md

Depends on: 02, 04

Pending additions: none

Narrative role: Add the three things that attach to a host element — a menu of commands, a tooltip, a badge — and state for each what it tells a user who cannot see it. It restates in a short bridge what a screen reader announces about an element — its name, its role and its state — and what `aria-expanded`, `aria-describedby` and `aria-hidden` each do, because chapters 05, 16, 17 and 23 lean on them and no entry of this plan teaches them.

Learning outcome: Victor can connect a trigger to a menu and reflect its open state, add a tooltip and a badge to an element, and say for each of the three what it exposes to assistive technology and what the application still has to provide.

Prerequisites: 02, 04

Must answer:

- How does a trigger find its menu, what is a menu item, and when are several actions better placed in a menu than left inline?
- When each row of a list has its own trigger, how does a menu item know which row it acts on — one menu per row, or one shared menu that receives the row through `matMenuTriggerData`?
- What does the trigger change about itself when its menu opens, what does it leave unchanged, and how does an arrow inside the trigger learn that the menu is open or closed, however it was closed?
- What is a tooltip for, when does it appear, and why can it be neither the only name of a control nor the place for an instruction the user needs?
- What does `matBadge` render, why is its number not read by a screen reader, and where does the count have to be stated — on an interactive host, and on plain text?

Coverage concepts:

- [ ] `mat-menu` composition — connect a trigger to a menu reference and use labelled menu items when several contextual actions should not remain inline
- [ ] Menu trigger open state — `MatMenuTrigger` sets `aria-expanded` on its host but never changes the host's content, so an indicator inside the trigger, such as a dropdown arrow, shows the open menu only when bound to the trigger's `menuOpened` and `menuClosed` outputs, which fire however the menu closes
- [ ] Tooltip purpose — use `matTooltip` for short supplementary help on hover or focus, never as the only name or as a container for essential instructions
- [ ] Badge content is hidden from assistive technology — `matBadge` renders its count `aria-hidden`, so the number needs its own accessible statement: `matBadgeDescription` becomes an `aria-describedby` on an interactive host, while on plain text the host's own text has to carry it

Audit note: Absorb the `matTooltip — a hint on hover or focus` section from 17; retain `The two pieces — trigger and menu`, `One menu per row — the gotcha` and `When to use a menu vs inline icon buttons` here.

Rationale: A menu, a tooltip and a badge are each a directive placed on a host element that adds something the host did not have — commands, a hint, a count. They share one question that is easy to skip and expensive later: what the addition tells a user who cannot see it. Taught together, the answer has the same shape three times — the menu trigger announces that it is expanded but changes nothing inside itself, the tooltip is supplementary and never a name, the badge is hidden outright. The menu-versus-select decision waits for chapter 07, where the select exists and the comparison can be made rather than promised.

Handoff: So far the page invokes commands. Chapter 06 starts the other half of a business screen — capturing values — with the form field.

## 06 — Form-field composition

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/06-forms.md
Spanish: notes/angular-material/junior/es/06-campos-formulario.md

Depends on: 01, 02

Pending additions: none

Narrative role: Connect Material's presentation of a field to Angular's reactive-form state. This chapter assumes reactive-forms fundamentals — `FormGroup`, `FormControl`, validators, `touched` and `dirty` — from the `angular` junior topic, and restates them in a short bridge before the first Material binding, because every control chapter up to 11 rests on them.

Learning outcome: Victor can build a labelled field with a hint and validation errors inside `mat-form-field`, say which controls a form field accepts, bind it to a reactive form without keeping a second copy of its value, and say exactly when Material shows an error and why.

Prerequisites: 01, 02

Must answer:

- What does `mat-form-field` add around a control — label, hint, prefix, suffix, error area — and what stays the reactive form's job?
- Which controls can sit inside a `mat-form-field` and which cannot — a checkbox, a radio group, a slide toggle — and what error appears when the field wraps something that is not a form-field control?
- What does `matInput` change about a native input or textarea, and what does it leave native?
- How do `mat-label` and `mat-error` differ in purpose, and what decides whether an error message is rendered at all?
- Where does guidance that should stay visible — a format, a limit — go, and what happens to it while the field is showing an error?
- Why does a form field keep an empty line beneath it, and what does `subscriptSizing` change?
- How is a Material control bound to a reactive form, and what breaks when a second value binding is added beside `formControlName`?
- At what moment does Material start showing a field's error — while typing, on leaving the field, on submit — and how does that follow from the control's validity, its `touched` state and the form's submission?

Coverage concepts:

- [ ] `mat-form-field` composition — combine a compatible control with its label, hint, prefix or suffix, and error presentation while Angular forms remain the state authority
- [ ] `matInput` — enhance a native input or textarea inside a form field while preserving its native value, type, and form semantics
- [ ] `mat-label` and `mat-error` — distinguish identification of a control from conditional validation feedback shown under the field
- [ ] `mat-hint` — attach persistent guidance to a form field without confusing it with a validation error
- [ ] Material controls with reactive forms — bind controls through `formControl` or `formControlName` and avoid a second source of truth through parallel value bindings
- [ ] Error-state timing — understand when Material displays form-field errors and connect that presentation to the form's validity and interaction or submission policy

Audit note: Absorb from 07 what its `mat-form-field` section says about the wrapper in general, `subscriptSizing` included. Absorb `Controlling when errors appear — ErrorStateMatcher` from 14 as the account of when an error appears by default; its subsection `Show errors only after the user tries to submit` builds a custom matcher, which is the middle-level concept `Custom error-state policies` — no entry of this plan owns it, and the junior pair names it without teaching how to write one. Retain every section of this file.

Rationale: The form field is one unit because its parts only make sense together: a wrapper that draws the label, the hint and the error, a control inside it that keeps its native behaviour, and a reactive form that stays the only owner of the value and its validity. Error timing closes the chapter because it is the first place a junior sees the two sides disagree — the form is invalid and the screen shows nothing.

Handoff: A text field accepts whatever is typed. Chapter 07 covers the first control that restricts the value to a fixed list: the select.

## 07 — Selects

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/07-select.md
Spanish: notes/angular-material/junior/es/07-select.md

Depends on: 04, 05, 06

Pending additions: none

Narrative role: Move from free text to a choice from a closed list, where the stored value has a type and the list of options opens in a panel outside the form.

Learning outcome: Victor can wire a `mat-select` whose option values match the type of its form control, including an "all" option, group its options and size its panel, decide between `mat-select` and a native select, and say why a list of commands is a menu and not a select.

Prerequisites: 04, 05, 06

Must answer:

- How do `mat-select` and `mat-option` produce a single value or several, and what type does the form control receive in each case?
- When must an option's `value` be a property binding rather than a plain attribute, and what does the control hold when it is not?
- Why does an "All" option whose value is `null` leave the field looking empty although the filter is unset, and what makes that option selectable?
- What is `selectionChange` for, and where is the selected value read from?
- What does `mat-optgroup` group, and why can a group label never be chosen?
- Why does a long option wrap inside the panel, how is the panel's width set, and why does the class that bounds it have to live in a global stylesheet?
- When is a native select with `matNativeControl` the better control?
- Now that both exist, when is the right control a menu and when a select?

Coverage concepts:

- [ ] `mat-select` and `mat-option` — model single or multiple selection with values whose types match the form control and distinguish literal attributes from property bindings
- [ ] A `null` option value is not a selection — `mat-select` skips an option whose value is `null` both when matching the control's value and when the user picks it, so an "all" option written that way leaves the field reading empty while its filter is in fact unset; opting in with `canSelectNullableOptions` is what makes the option selectable
- [ ] Selection events vs form values — react to `selectionChange` only for side effects and read the form control for the authoritative selected value
- [ ] `mat-optgroup` — group a long option set semantically without pretending group labels are selectable values
- [ ] Select panel width — a `mat-select` panel copies its trigger's width by default, so an option longer than the field wraps onto two lines; `panelWidth` set to `null` lets the panel size to its longest option, and any bound on it goes on a `panelClass` in a global stylesheet, because the panel renders in the overlay container
- [ ] Material select vs native select — choose `mat-select` for Material-specific presentation and a native `<select matNativeControl>` when native accessibility, performance, or platform behaviour is the better fit
- [ ] Menu vs select — use a menu to invoke commands and a select to choose a value owned by a form or application state

Audit note: Move what the `mat-form-field` section says about the wrapper in general — `subscriptSizing` included — to 06, keeping here only what a select needs from it; retain `Basic usage`, `Two ways to handle the selected value`, `Dynamic options with @for`, `Resetting the select`, `Grouping options with mat-optgroup` and `Multiple selection` here.

Rationale: Everything here is a property of one control and its option list: what an option's value is and what type it has, what counts as a selection, where the value is read, how the options are grouped and how wide their panel is. The two comparisons close the chapter because both need the select to exist — a native select is the same choice with the browser's own control, and a menu is a list that looks the same and stores nothing.

Handoff: A select makes the user open a list and scan it. When the list is long, or the user already knows the name, typing is faster — chapter 08 adds the autocomplete.

## 08 — Autocomplete

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/08-autocomplete.md
Spanish: notes/angular-material/junior/es/08-autocompletado.md

Depends on: 06, 07

Pending additions: none

Narrative role: Add the control that sits between free text and a closed list: a text input that suggests matching options as the user types.

Learning outcome: Victor can connect an input to a local autocomplete panel, narrow its options as the user types, display a label while storing an object or an identifier, and decide between a select and an autocomplete for a given field.

Prerequisites: 06, 07

Must answer:

- What does `mat-autocomplete` attach to, and how does an ordinary input become its trigger?
- When the options are a list already held by the component, what narrows them as the user types?
- When the options are objects, what does the input display, what does the form control store, and what connects the two?
- What does the control hold when the user types text that matches no option?
- When is a closed list a select, and when is typing with suggestions the better model?

Coverage concepts:

- [ ] Basic `mat-autocomplete` — connect an input to a local option panel and distinguish the displayed label from the stored object or identifier
- [ ] Select vs autocomplete — use a select for a closed choice set and `mat-autocomplete` when users type into an input and choose from matching suggestions

Rationale: An autocomplete is a different control from a select rather than a variant of it: the field is a text input the user may fill freely, the panel is a set of suggestions, and the value can be text the list never contained. Who decides the value — the list or the keyboard — is the single idea of the chapter, and it is why the select-versus-autocomplete decision is taught here, once both exist. Options loaded from a server as the user types are middle-level coverage and stay out.

Handoff: A select and an autocomplete hide their options until asked. Chapter 09 covers the controls that keep every option on screen: checkboxes, radio buttons and slide toggles.

## 09 — Checkboxes, radio buttons, and slide toggles

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/09-checkbox-radio.md
Spanish: notes/angular-material/junior/es/09-checkbox-radio.md

Depends on: 06, 07

Pending additions: none

Narrative role: Teach the controls whose options stay visible — a boolean, several independent choices, one choice from a few — and the decision between them and the select of chapter 07. They are the controls chapter 06 said a form field does not wrap.

Learning outcome: Victor can write a checkbox, a radio group and a slide toggle and bind each to a reactive form, choose between them and a select for a given choice, and use the indeterminate state of a checkbox without mistaking it for a value.

Prerequisites: 06, 07

Must answer:

- How are a `mat-checkbox`, a `mat-radio-group` with its `mat-radio-button`s and a `mat-slide-toggle` written, what value does each give its form control, and how is each bound to a reactive form?
- Which control fits an independent yes or no, several choices at once, one choice from a few visible options, and one choice from many?
- What does a slide toggle tell the user that a checkbox does not, and when is each the honest choice?
- What does the indeterminate state of a checkbox show, when is it set, and what value does the form hold while it is shown?

Coverage concepts:

- [ ] Checkbox, radio, and select choice — use checkboxes for independent booleans or multi-select, radio buttons for a small visible single-choice set, and a select when compactness or option count warrants it
- [ ] Checkbox vs slide toggle — use a checkbox for selection or confirmation and `mat-slide-toggle` for a boolean setting whose change is presented as immediately active
- [ ] Checkbox indeterminate state — represent partial aggregate selection visually without confusing it with a third submitted boolean value

Rationale: These three concepts are one decision table — which visible control represents which kind of choice — and its two traps: a toggle promises that the change is already in effect, and an indeterminate checkbox shows a state that is never a value.

Handoff: Every control so far holds text, a boolean or an option. Chapter 10 covers the one whose value needs a library to interpret it: a date.

## 10 — Datepicker and date adapters

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/10-datepicker.md
Spanish: notes/angular-material/junior/es/10-selector-fecha.md

Depends on: 01, 06

Pending additions: none

Narrative role: Apply the form-field model to dates, where the control's value has a representation that a configured adapter decides — the provider that chapter 01 announced.

Learning outcome: Victor can assemble a datepicker from its input, toggle and picker, provide a date adapter and keep the control's value in that adapter's type, make typed dates parse in the user's locale, and restrict the selectable dates with errors the user sees.

Prerequisites: 01, 06

Must answer:

- Which pieces make one datepicker, and how are the input, the toggle and the calendar connected?
- Why does a datepicker fail without a date adapter, and where is the adapter provided?
- What type does the form control hold under a given adapter, and what goes wrong when the code treats it as a string or silences the mismatch with a type assertion?
- Why is a date typed as `18/09/2026` misread or rejected under the default adapter, and which two things — an adapter that parses by locale, and the locale given in that library's own form — fix it?
- How do `min`, `max` and a filter function limit what the calendar offers and what the input accepts?
- Which validation errors do those limits produce, and how are they shown under the field before the form is submitted?
- When the limit of one date depends on another field — an end date that must follow a start date — how is that case handled next to `min` and `max`?

Coverage concepts:

- [ ] Datepicker composition — connect the input, toggle, picker reference, and a configured date adapter as one control
- [ ] Date-adapter compatibility — keep the datepicker control value compatible with its configured `DateAdapter` rather than hiding a representation mismatch with type assertions
- [ ] The adapter decides what a typed date means — `NativeDateAdapter` parses typed input with `Date.parse`, which reads only the formats the browser guesses, so a locale whose short date is day-first needs an adapter that parses by locale, such as the date-fns adapter, with `MAT_DATE_LOCALE` given in that library's own locale form
- [ ] Datepicker selectable-date constraints — use `min`, `max`, and `matDatepickerFilter` to declare which dates the calendar and the input will accept
- [ ] Datepicker validation feedback — surface the validation errors those constraints produce instead of letting an out-of-range value fail only after submission

Rationale: A datepicker is the form field of chapter 06 plus one new idea: the value is not text, and an adapter decides what it is, how typed text becomes it, and which dates are valid. The five concepts are that idea in order — the parts, the adapter and the type it imposes, how typing is parsed, what can be selected, and how a refused date is reported.

Handoff: Every control a form needs now exists. Chapter 11 puts several forms in sequence: the stepper.

## 11 — Linear steppers

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/11-stepper.md
Spanish: notes/angular-material/junior/es/11-pasos.md

Depends on: 02, 06

Pending additions: none

Narrative role: Close the forms branch by spreading one long form over several stages, where the validity of each stage decides whether the user may move on.

Learning outcome: Victor can build a linear stepper in which each step's form control, not a button handler alone, governs progression, and can show the user why a step cannot be left.

Prerequisites: 02, 06

Must answer:

- What is a stepper, what does each step contain, and how do the next and previous buttons move between steps?
- What makes a stepper linear, and what does a step's `stepControl` give it?
- Why is a "Next" handler that checks validity by hand not a replacement for a linear stepper with step controls?
- How does the user learn why they cannot move forward?

Coverage concepts:

- [ ] Stepper linear flow — pair `linear` with step controls so validity governs progression rather than relying only on button handlers

Rationale: The stepper is one concept with one rule: progression belongs to the form's validity. It sits directly after the controls because it adds nothing new to a form except the order in which its parts may be completed.

Handoff: Forms capture one record at a time. Chapter 12 turns to showing many records at once: the table.

## 12 — Table structure, rows, and row actions

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/12-table.md
Spanish: notes/angular-material/junior/es/12-tablas.md

Depends on: 02, 05

Pending additions: none

Narrative role: Build the table's own anatomy — columns, rows, refresh, and the controls placed inside a row — before any sorting, filtering or paging is layered on top.

Learning outcome: Victor can define a table's columns and rows, refresh it when its data changes, tell an empty result from loading or failure, act on the correct record from inside a row, and keep a column of actions in view while the table scrolls.

Prerequisites: 02, 05

Must answer:

- What are the pieces of a `mat-table` — column definitions, header and cell templates, row definitions, the list of displayed columns — and which single identifier ties them together?
- What must agree between `matColumnDef` and `displayedColumns`, and what error appears when a displayed column has no definition? When the value a column shows is not a property of the row under that column's name, what is the accessor that covers it — named here, and used when chapter 13 sorts?
- In a column definition, which template draws the label once and which is repeated for every row, and through which variable does the cell template read its row?
- What does `[dataSource]` accept, and what is the simplest thing to give it?
- Why does pushing into the array not add a row, and what are the two ways of making the table render the change?
- When is the "no data" row the truth, and how is an empty result told apart from data still loading or a request that failed?
- How is a column shown only in some states — a role, a mode — without touching its definition?
- How does a button inside a row know which record it acts on?
- How does a button inside a clickable row avoid also triggering the row's own click?
- How does a column of actions at the end, or an identifier column at the start, stay visible while the rest of the table scrolls sideways, and why does anything drawn over the table need a `z-index` above the pinned cells?

Coverage concepts:

- [ ] Material table structure — connect column definitions, header and cell templates, displayed column order, and header/data row definitions through matching column identifiers
- [ ] `matColumnDef` identity — keep the column ID consistent with `displayedColumns` and configure an accessor when the displayed value does not map directly to a row property
- [ ] Header and cell definition roles — use `matHeaderCellDef` for column labels and `matCellDef` for per-row values rather than mixing structural and data concerns
- [ ] Table refresh after collection changes — assign or emit a new data array, or call `renderRows()` after mutating a raw array, because `mat-table` does not observe in-place structural changes automatically
- [ ] Empty table state — use `matNoDataRow` or an equivalent full-width row only after distinguishing an empty successful result from loading and failure
- [ ] Table row actions — keep row identity explicit so a per-row control operates on the record it belongs to
- [ ] Nested interactive controls in rows — prevent action buttons inside a row from accidentally triggering row selection or navigation
- [ ] Sticky table columns — `stickyEnd` or `sticky` on a column definition pins that column with `position: sticky` inside the table's scroll container, so row actions or identifiers stay in view while the other columns scroll; the CDK writes an inline `z-index` on every pinned cell, which anything layered over the table must exceed

Audit note: Move `MatTableDataSource — sorting and filtering`, `Sorting — MatSort` with its three subsections, `Centering sort header text — view encapsulation` and `Pagination — MatPaginator` to 13; retain `Basic usage`, `Empty state — \*matNoDataRow`, `Empty state — contextual messages` and `Conditional columns — show/hide based on role or state` here.

Rationale: Everything here is the table's own anatomy: what a column is, what a row is, how the collection is refreshed, and what a control placed inside a row acts upon. Row identity, nested controls and pinned action columns belong with the row that defines them and not with the transformation layer of chapter 13 — a junior who can sort a table but wires the delete button to the wrong record has learned the two in the wrong order.

Handoff: The table renders rows and acts on the right one. It cannot yet be sorted, filtered or paged — chapter 13 adds that layer, and the one decision behind it: whether the browser or the server does the work.

## 13 — Table data sources, sorting, filtering, and pagination

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/13-paginator.md
Spanish: notes/angular-material/junior/es/13-paginacion-tablas.md

Depends on: 04, 12

Pending additions: none

Narrative role: Add sorting, filtering and paging to the table, with one owner for each — the browser or the server, never both. This chapter assumes Angular view queries and the moment the view exists from the `angular` junior topic, and restates that timing in a short bridge before connecting `MatSort` or `MatPaginator`, because "connect it after the view exists" means nothing without it. Its server-side half also assumes an HTTP call with query parameters and a paged response that carries a total, from the same topic.

Learning outcome: Victor can choose a data source for a table and integrate sorting, filtering and pagination under a single owner, on the client with `MatTableDataSource` or on the server through request parameters.

Prerequisites: 04, 12

Must answer:

- What can a table's data source be — a plain array, an observable or custom `DataSource`, a `MatTableDataSource` — and who fetches, transforms and cleans up in each case?
- What does `MatTableDataSource` do for a list held in memory, and why is it the wrong tool once the server pages the data?
- Why are `MatSort` and `MatPaginator` connected only after the view exists, which headers become sortable, how is a column sorted when its value is nested or computed, and how does a sort header tell a user who cannot see the arrow what activating it will do?
- How is a paginator connected for client-side data, and what does its page event become when the server pages the data?
- With a server-paged table, where do `length`, `pageIndex` and `pageSize` come from, and what does the paginator show when `length` is the size of the current page instead of the total?
- What does the default filter compare, and how are a filter's fields and its normalisation defined explicitly?
- Why can a filter leave the user on an empty page, and what resets it?
- When the server owns the data, what do a sort change, a filter change and a page change each become in the request — and what happens when one dataset is sorted, filtered or paged both in the browser and on the server?

Coverage concepts:

- [ ] Table data-source choices — choose a plain array, observable/custom `DataSource`, or `MatTableDataSource` according to who owns retrieval, transformation, and lifecycle
- [ ] `MatTableDataSource` scope — use the convenience class for simple client-side sorting, filtering, and pagination, not as a server-side data-access abstraction
- [ ] Sort integration — connect `MatSort` after the view exists, mark only sortable headers, and handle nested or derived values through a sorting accessor or server query
- [ ] Paginator integration — connect `MatPaginator` for client data or translate page events into backend parameters without paginating the same result twice
- [ ] Server-side paginator state — bind `length` to the backend's total matching count and treat `pageIndex` and `pageSize` as request state so the controls remain correct when only one page of rows is loaded
- [ ] Filter semantics — define which fields and normalisation rules filtering uses instead of assuming the default row stringification matches the product
- [ ] Reset pagination after filtering — return to a valid first page when a narrower client-side filter can make the current page empty
- [ ] Client-side vs server-side table operations — let `MatTableDataSource` transform an in-memory collection or translate sort, filter, and page events into backend queries, never both for the same dataset

Audit note: Absorb `MatTableDataSource — sorting and filtering`, `Sorting — MatSort` with its three subsections, `Centering sort header text — view encapsulation` and `Pagination — MatPaginator` from 12; retain `Setup`, `Template`, `Connect to the data source` and `Reset to page 1 after filtering` here. `Centering sort header text — view encapsulation` styles a sort header through an internal selector, so it is absorbed under chapter 04's rule on supported and internal selectors; `sortActionDescription — accessibility` and `LiveAnnouncer — accessibility announcements` are absorbed under the sorting question.

Rationale: Sorting, filtering and paging are not three features but one decision made three times — who owns the transformation, the browser or the backend. They are taught together because the failure they produce is shared: paginating a result that is already a page, or filtering a page instead of the whole set. Splitting them would hide the single question that governs all three.

Handoff: A row action can now run on a sorted, filtered page — but deleting a record on one click is not acceptable. The question "are you sure?" needs a surface of its own, and chapter 14 opens it: the dialog.

## 14 — Dialogs: opening, input, structure, and result

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/14-dialog.md
Spanish: notes/angular-material/junior/es/14-dialogos.md

Depends on: 02, 04, 06

Pending additions: none

Narrative role: Introduce the component that is opened from code on top of the page, as a call with a typed input and a typed result — the overlay that chapter 04 announced, now built. It picks up the delete button chapter 12 left without a question and the form of chapter 06. It assumes `inject()`, injection tokens and subscribing to an observable from the `angular` junior topic and restates them in a short bridge. Its first template writes the title on a heading element (`<h2 mat-dialog-title>`), with the reason given in one sentence and left to chapter 23.

Learning outcome: Victor can open a component as a dialog, pass it typed data, lay out its title, content and actions, size it so that it fits a small screen, and read a typed result that tells a saved form from a dismissal.

Prerequisites: 02, 04, 06

Must answer:

- What is a dialog in Angular Material — which service opens it, what exactly is opened, and where does it render?
- What is the `MatDialogRef` that `open()` returns and that the dialog component injects, and what can each side do with it?
- How does data reach a dialog, how is it typed, and why does the dialog not read the opener's state directly?
- Which three regions make up a dialog's template, and what breaks when one is nested inside another?
- How is a dialog's width set, and what keeps its content usable on a narrow screen?
- What does the opener receive when the dialog closes, how is that result typed, and how does it tell a saved form from a cancel or a click outside?
- How does one dialog component serve both "add" and "edit"?

Coverage concepts:

- [ ] `MatDialog` and `MatDialogRef` — open overlay content from the caller and control its lifecycle and result through the returned reference
- [ ] Dialog component input — use `MAT_DIALOG_DATA` for an explicit, typed input boundary rather than reaching into caller state
- [ ] Dialog content structure — keep title, content, and actions as sibling regions so layout, scrolling, labelling, and action placement remain correct
- [ ] Dialog viewport constraints — use width and maximum-size configuration so overlay content remains usable without overflowing small viewports
- [ ] Dialog result channel — close with an explicit typed result and consume `afterClosed()` so the caller distinguishes success, cancellation, and dismissal

Audit note: Move `Confirmation dialog pattern` to 15 and `Controlling when errors appear — ErrorStateMatcher`, with its subsection, to 06; retain `How it works`, `Build the dialog component template`, `Close the dialog and return data`, `Open the dialog from the parent` and `Edit flow — one dialog for add and edit` here.

Rationale: These five concepts are the dialog's contract, and they read like a function call with a screen in the middle: a component is opened, data goes in, the template has a fixed shape and a size, and a result comes back. They are taught before any rule about closing because every such rule is a statement about what that result is.

Handoff: The dialog opens, receives data and returns a result. What it returns depends on how it was closed, and there are more ways out than its two buttons — chapter 15 covers every one.

## 15 — Closing a dialog: confirmation, dismissal, and where the save runs

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/15-dialog-closing.md
Spanish: notes/angular-material/junior/es/15-cierre-de-dialogos.md

Depends on: 06, 14

Pending additions: none

Narrative role: Take the dialog's exits one at a time — the confirm button, the cancel button, the backdrop, Escape — and settle what each returns and which side performs the work. It assumes an HTTP write and a server that answers with per-field validation errors, from the `angular` junior topic.

Learning outcome: Victor can build a confirmation dialog that runs destructive work only on an affirmative result, decide when `disableClose` is justified, choose between `mat-dialog-close` and a close handler, and decide whether a form dialog saves itself or returns its value to the opener.

Prerequisites: 06, 14

Must answer:

- In which ways can a dialog be closed, and what does the opener receive from each?
- Where does the destructive work run in a confirmation flow, and what must cancel, the backdrop and Escape have in common?
- What does `disableClose` switch off, what does the user lose, and what must the dialog offer in exchange?
- When is `mat-dialog-close` enough, and when must closing go through a handler — for validation, unsaved changes, a request still running?
- When a dialog holds a form the server may refuse field by field, why does the dialog send the request itself and close only on success, and what is lost when it returns the raw form for the opener to save?
- Which kind of dialog should save nothing and only return an answer?

Coverage concepts:

- [ ] Confirm/cancel semantics — perform destructive work only after an affirmative result and treat backdrop, Escape, and cancel-button dismissal consistently
- [ ] Default dismissal vs `disableClose` — preserve backdrop and Escape dismissal by default and disable them only when the interaction has a justified alternative exit because dialogs are expected to remain keyboard operable
- [ ] Declarative vs programmatic closing — use `mat-dialog-close` for simple results and a handler when validation, unsaved changes, or asynchronous work must run before closing
- [ ] Where a form dialog's save runs — a dialog that submits a form the server can refuse field by field issues the write itself and closes with the result only on success, because the in-flight state, the dismissal lock and the per-field errors all belong to the form that is still open; returning the raw form through `close()` for the opener to save delivers those errors after the form is gone, while a dialog that only asks for confirmation returns its answer and saves nothing

Audit note: Absorb `Confirmation dialog pattern` from 14.

Rationale: The four concepts answer one question from four sides: when a dialog goes away, who decided it and who does the work that follows. Confirmation fixes what an affirmative result is, dismissal fixes what every other exit must mean, the closing directive and the handler are the two ways to leave, and the place where a form's save runs decides which side owns the request and its errors.

Handoff: The dialog now opens and closes on purpose. Two things it does on its own remain: it moves keyboard focus when it opens and closes, and it stays on screen after the component that opened it is gone. Chapter 16 explains both.

## 16 — Dialog focus and lifetime

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/16-dialog-focus-lifetime.md
Spanish: notes/angular-material/junior/es/16-foco-y-vida-del-dialogo.md

Depends on: 05, 14, 15

Pending additions: none

Narrative role: Explain the two behaviours of a dialog that come from its being an overlay rather than part of the page: what it does with keyboard focus, and how long it lives. It assumes programmatic Router navigation and a component's destroy callback from the `angular` junior topic, each restated in one line where it is first used.

Learning outcome: Victor can say where focus goes when a dialog opens and when it closes, name what an accessible dialog must keep, give focus a target that still exists after closing, protect state that an asynchronous focus move would disturb, and close dialogs when the area that opened them is destroyed.

Prerequisites: 05, 14, 15

Must answer:

- What does a dialog do with keyboard focus while it is open, and which of its behaviours — an accessible name, the focus trap, a sensible first focus, focus returned on close, Escape — must survive any customisation?
- When exactly does focus move into a dialog, why is that later than the notification that it has opened, and what does the blur it causes do to a form in the view underneath?
- Why is undoing that effect "just after opening" unreliable, and what guards the state reliably?
- Where does focus go when a dialog closes, why does it land on the document body when the dialog was opened from a menu item, and how does the opener name a target that still exists?
- Why is a dialog still on screen after the component that opened it has been destroyed, which navigations close it automatically and which do not, and who is responsible for closing it?

Coverage concepts:

- [ ] Dialog focus management — preserve an accessible name, focus trap, sensible initial focus, focus restoration, and Escape behaviour unless a justified accessible alternative exists
- [ ] Initial dialog focus moves asynchronously — the overlay traps focus after its enter animation, which is later than the ref's own "opened" notification, so the blur it causes in the view underneath lands after any handler subscribed there; state that has to survive the question is guarded by reacting to the change itself, never by undoing it at a moment believed to be "just after"
- [ ] Focus restoration needs a target that still exists — the dialog records the element focused when it opens and focuses it again on close, so a dialog launched from a menu item restores into a node the closing menu has already removed and focus falls to the document body; `restoreFocus` also accepts an element or a selector, which lets the caller name a persistent target such as the menu trigger
- [ ] Dialog lifetime is not the opener's — the dialog lives in the overlay container, so destroying the component that opened it leaves it on screen, and `closeOnNavigation` reacts only to browser history changes, not to a programmatic router navigation; whoever opens dialogs from an area the user can leave closes them when that area is destroyed, for example with `closeAll()` from a destroy callback

Rationale: All four concepts are consequences of one fact chapter 04 stated and chapter 14 used: a dialog lives in the overlay container, not inside the component that opened it. Because of that it takes focus from the page and has to give it back, it takes it later than the code expects, it gives it back to an element that may be gone, and it outlives its opener. They are separated from chapters 14 and 15 because none of them can be seen in a first dialog — each appears only once a dialog is opened from a menu, over a form, or in an area the user can leave.

Handoff: Dialogs ask before acting. Once the user has confirmed, the request takes time — chapter 17 covers what the screen shows while it runs.

## 17 — Progress indicators and the loading state of a control

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/17-tooltip-progress.md
Spanish: notes/angular-material/junior/es/17-indicadores-de-progreso.md

Depends on: 02, 05

Pending additions: none

Narrative role: Show the user that work is under way, choose the indicator that says truthfully how much is known about it, and put the control that started the work into a loading state without stranding the person who pressed it.

Learning outcome: Victor can choose between a spinner and a progress bar, and between determinate and indeterminate modes, for a given wait, and can show a loading state on the control that started the request without taking keyboard focus away from the user.

Prerequisites: 02, 05

Must answer:

- What is the difference between a spinner and a progress bar, which fits a wait inside one control, and which fits a page or a section?
- What do determinate and indeterminate mean, and why is a determinate bar wrong for an ordinary HTTP request?
- How is a loading state shown on the control that started the request, and what must be reset on both success and failure?
- What happens to keyboard focus when the button the user has just pressed is disabled for a loading state, what does `disabledInteractive` change, and what does it hand back to the code?

Coverage concepts:

- [ ] Progress spinner vs progress bar — choose a spinner for local indeterminate waiting, an indeterminate bar for page or section activity, and a determinate bar only when a real percentage exists
- [ ] Disabled controls cannot hold focus — expressing a loading state by disabling the control the user has just activated moves focus to the document body and leaves a keyboard user with no anchor to continue from; `disabledInteractive` keeps a Material button focusable and announces its state through `aria-disabled` instead of the native attribute, which in exchange makes preventing the action the code's job rather than the browser's

Audit note: Move `matTooltip — a hint on hover or focus` to 05; retain `mat-progress-spinner — circular loading indicator`, `mat-progress-bar — horizontal loading indicator` and `Loading-state pattern with Material` here.

Rationale: The shape of the indicator, its mode and the state of the control that started the wait are one decision: showing a wait honestly without stranding the user. The disabled-control concept is taught here rather than with the rest of accessibility because this is the chapter that teaches the loading pattern, and a pattern taught wrong here would stay wrong for six chapters.

Handoff: A progress indicator covers the wait. Chapter 18 covers the moment after it: telling the user what happened without stopping them.

## 18 — Snack bars

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/18-snackbar.md
Spanish: notes/angular-material/junior/es/18-snackbar.md

Depends on: 04, 14

Pending additions: none

Narrative role: Give the application a way to report an outcome that does not interrupt the user, and set it against the dialog, which does.

Learning outcome: Victor can open a snack bar from code with a message, an action and a duration, decide whether a piece of feedback is a snack bar or a dialog, and keep an actionable snack bar on screen long enough to be used.

Prerequisites: 04, 14

Must answer:

- What is a snack bar, where does it render, and how is it opened from code?
- What does `MatSnackBar.open()` take — message, action, configuration — how short must the message be, and what must the feature inject or import to use it?
- When is a snack bar the right feedback, and when must it be a dialog?
- How long should a snack bar stay on screen, what changes when it carries an action the user may want to press, and how does the code learn that it was pressed?
- From which part of the application should the snack bar be opened, and what happens when a second one is opened while the first is still showing?

Coverage concepts:

- [ ] Snack bar vs dialog — use a snack bar for brief non-blocking feedback and a dialog for focused input or a decision that requires interaction
- [ ] `MatSnackBar.open()` lifecycle — provide concise content and ensure the feature imports the snack-bar API it uses
- [ ] Timed vs actionable snack bars — auto-dismiss informational feedback after a suitable duration but keep an action available long enough for the user to perceive and operate it

Rationale: The snack bar is the non-blocking half of feedback, and its three concepts are how to open one, when it is the right surface instead of a dialog, and how long it must live. The comparison with the dialog is taught here rather than in chapter 14 because it needs both to exist.

Handoff: Actions, forms, tables, dialogs and feedback are what a page contains. The remaining chapters arrange and frame that content, starting in chapter 19 with the container that groups related content inside a page: the card.

## 19 — Cards

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/19-card.md
Spanish: notes/angular-material/junior/es/19-tarjetas.md

Depends on: 02, 06

Pending additions: none

Narrative role: Introduce the container that groups related content inside a page, now that there is content — text, forms, actions — worth grouping.

Learning outcome: Victor can group related content in a card with the regions it needs, choose between a raised and an outlined card, and keep that choice consistent across a screen.

Prerequisites: 02, 06

Must answer:

- Which regions can a card have — header, content, actions — which of them are optional, and on which element is its title written so that it is a real heading?
- When is a card outlined rather than raised, and why does the choice have to be the same across a screen?
- When does a card add hierarchy to a page, and when is it only decoration?

Coverage concepts:

- [ ] Card structure and appearance — group related content with optional header, content, and actions and choose raised or outlined emphasis consistently

Rationale: The card is one concept: a visual group with optional regions and one of two levels of emphasis. It opens the layout chapters because it is the smallest unit of page arrangement, and the only one that lives inside a page rather than around it.

Handoff: A card arranges content inside one page. Chapter 20 begins the frame that every page shares: the toolbar across the top.

## 20 — Toolbar

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/20-toolbar.md
Spanish: notes/angular-material/junior/es/20-toolbar.md

Depends on: 02, 03

Pending additions: none

Narrative role: Start the application shell with its top bar: the place for the application's name and the actions that are available on every page.

Learning outcome: Victor can build a toolbar with a title on one side and actions on the other, give it one of the theme's colour roles, and say what the toolbar lays out by itself and what ordinary flex layout still has to do.

Prerequisites: 02, 03

Must answer:

- What is `mat-toolbar` for, and which actions belong in it rather than in a page?
- What does the toolbar position by itself, and how are a title on the left and actions on the right placed?
- How does a toolbar hold more than one row?
- What does the `color` attribute do on a toolbar under a Material 3 theme, and how is a toolbar given one of the theme's colour roles instead?
- How is the toolbar shown only when a user is logged in, and why is that an ordinary Angular condition around the toolbar rather than something the toolbar does?

Coverage concepts:

- [ ] Toolbar composition — use `mat-toolbar` for persistent application-level actions and ordinary flex layout to position its content

Rationale: The toolbar is a container with one rule worth learning — it holds application-level actions and leaves their placement to flex layout. It is taught before the sidenav so that the shell of chapter 21 places a toolbar the reader already knows, rather than introducing two containers and a layout at once.

Handoff: The toolbar runs across the top. Moving between the application's pages needs a panel at the side that shares the screen with the content — chapter 21 builds it.

## 21 — Sidenav and routed navigation

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/angular-material/junior/en/21-sidenav.md
Spanish: notes/angular-material/junior/es/21-navegacion-lateral.md

Depends on: 20

Pending additions: none

Narrative role: Complete the application shell: a drawer of navigation links beside the page content, with Angular Router still deciding what is shown. This chapter assumes Router fundamentals — routes, the outlet, `routerLink` and the active route — from the `angular` junior topic, and restates route activity in a short bridge before any Material navigation state is used.

Learning outcome: Victor can build a toolbar-and-sidenav shell around a router outlet, choose the drawer's mode and control its open state, mark the active link while the Router remains the authority on navigation, and decide between tabs and routes for a set of views.

Prerequisites: 20

Must answer:

- Which three elements make a sidenav layout, what does each contain, and why must the drawer and the content sit inside the same container?
- How do `side`, `push` and `over` differ in what happens to the content, and which suits a wide screen and which a phone?
- How is the drawer opened and closed — from a toolbar button, from the backdrop in `over` mode, from code — and where does its open state live?
- How are navigation links built with `mat-nav-list`, and who decides which link is active — Material or the Router?
- What is a `mat-tab-group`, how are its tabs written, and what does switching tabs change — and not change — in the URL and the browser history?
- When is a set of views a tab group, and when must each view be a route?
- How does the shell fill the full height of the window without the page scrolling twice?

Coverage concepts:

- [ ] Sidenav structure — compose `mat-sidenav-container`, `mat-sidenav`, and `mat-sidenav-content` so the drawer and main content share the required layout context
- [ ] Sidenav modes — choose `side`, `push`, or `over` according to available space and whether content should resize, shift, or sit behind an overlay
- [ ] Navigation lists and active state — use `mat-nav-list` and Material list items for navigation while Angular Router remains responsible for navigation and route activity
- [ ] Tabs vs route navigation — use `mat-tab-group` for related in-page views and routes for destinations that need navigation history, deep links, or independent URLs

Rationale: The four concepts are the navigation half of the shell: the layout that lets a drawer and the content share the screen, how the drawer behaves, what its links are, and when a group of views does not need navigation at all. They share one boundary the chapter keeps restating — Material draws the navigation, the Router performs it.

Handoff: The shell is built for one screen width: the drawer's mode was chosen by hand. Chapter 22 makes that choice follow the size of the screen, and does the same for the other components that do not adapt by themselves.

## 22 — Responsive composition and `BreakpointObserver`

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/22-responsive-composition.md
Spanish: notes/angular-material/junior/es/22-composicion-responsive.md

Depends on: 12, 14, 20, 21

Pending additions: none

Narrative role: Make the finished page adapt to the screen, by turning the screen's width into state the components can read. It assumes observables and `toSignal()` from the `angular` junior topic, restated in a short bridge.

Learning outcome: Victor can name what a Material page does not adapt on its own, turn a media query into reactive state with `BreakpointObserver`, and use that state to change a sidenav's mode and open state, a dialog's size and the presentation of a wide table.

Prerequisites: 12, 14, 20, 21

Must answer:

- Which parts of a Material page do not adapt to a narrow screen by themselves — the sidenav's mode, a dialog's dimensions, a row of actions, a wide table — and what has to change in each?
- Why can these not be solved with a CSS media query alone?
- How does component code learn that the screen has crossed a width, and how does that become state the template reacts to?
- What is the difference between `observe()` and `isMatched()`, and what breaks when the second is used for layout?
- When do the predefined `Breakpoints` fit, and when does a design pass its own media query?

Coverage concepts:

- [ ] Responsive Material composition — adapt sidenav mode, dialog dimensions, action density, and wide-table presentation because Material components do not make a page responsive automatically
- [ ] `BreakpointObserver` — turn a media query into reactive layout state with `observe()`, which emits on every crossing of the width, where `isMatched()` answers once and never again; the predefined `Breakpoints` sets encode Material's widths, so a design with its own cut-off passes its own query

Rationale: The two concepts are a problem and its tool. Material components do not respond to the viewport on their own, and several of the things that must change — a mode, a size, which controls are rendered — are inputs and template decisions rather than CSS, so the width of the screen has to exist as state. It comes after the shell, the dialog and the table because those are the components it adapts.

Handoff: The page now fits the screen. Chapter 23 asks whether everyone can operate it: what Material already does for keyboard and screen-reader users, and what it leaves to the application.

## 23 — Accessibility: what Material provides and what the application owes

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/23-accessibility.md
Spanish: notes/angular-material/junior/es/23-accesibilidad.md

Depends on: 02, 03, 05, 06, 07, 13, 14, 16, 17, 19, 20, 21

Pending additions: none

Narrative role: Gather the accessibility boundary that chapters 05, 16 and 17 met one component at a time into a single rule — the library supplies behaviour, the application supplies meaning — and add the two places where Material's defaults fall short of it.

Learning outcome: Victor can say what Material gives every component for keyboard and screen-reader users and what the application must add, make keyboard focus visible on every control, and give card and dialog titles real heading semantics.

Prerequisites: 02, 03, 05, 06, 07, 13, 14, 16, 17, 19, 20, 21

Must answer:

- What does Material give every component without being asked — roles, keyboard behaviour, focus handling — and what does it leave to the application: names, focus order, the announcement of state?
- Why is keyboard focus almost invisible on a Material button by default, what contrast does a focus indicator need, which components are affected and which show focus another way, and what does including strong focus indicators change?
- Why does the focus ring of a button inside a coloured toolbar need a colour of its own?
- What do `mat-card-title` and `mat-dialog-title` add, what do they not add, and how is a real heading produced with them?

Coverage concepts:

- [ ] Built-in accessibility vs application responsibility — rely on supported Material semantics and keyboard behaviour while still providing labels, logical focus order, and meaningful state communication
- [ ] Strong focus indicators are opt-in — Material's buttons, list and menu items, options and sort headers ship a focus ring that stays hidden until the application includes `strong-focus-indicators`, while a form field shows focus through its own outline instead, so without it keyboard focus shows only through the translucent state layer, far below the 3:1 a focus indicator needs; a button's ring is drawn outside the control, so its colour is judged against the surface around it and a coloured container needs a ring colour of its own
- [ ] Title directives carry no heading semantics — `mat-card-title` and `mat-dialog-title` supply typography and spacing only, so used as an element they render a generic container that never enters the heading outline, while used as an attribute on `<h1>`–`<h6>` they leave the heading level where it belongs, with the application

Rationale: The first concept is the rule and the other two are its sharpest cases: a focus indicator the library ships hidden, and a title directive that looks like a heading and is not one. They come this late because each needs components the route has already taught — buttons, options, sort headers, list items, cards, dialogs, a coloured toolbar — and they come as one chapter because the junior failure is the same in both: assuming that a Material component is accessible because it is a Material component.

Handoff: Error messages, dialog results, table interactions and focus behaviour are now things the application promises. Chapter 24 closes the route by testing those promises through Material's own test API.

## 24 — Component harnesses

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/angular-material/junior/en/24-component-harnesses.md
Spanish: notes/angular-material/junior/es/24-harnesses-de-componentes.md

Depends on: 06, 10, 13, 14, 15

Pending additions: none

Narrative role: Close the junior route by testing Material behaviour the way a user meets it. This chapter assumes TestBed fundamentals — configuring the testing module, creating a fixture, detecting changes — from the `angular` junior topic, and introduces the harness loader before any component-specific harness API.

Learning outcome: Victor can test a form's validation feedback, a dialog's result and a table's interactions through component harnesses rather than private markup, and can give a component mounted alone the application-wide configuration it depends on.

Prerequisites: 06, 10, 13, 14, 15

Must answer:

- What is a component harness, and what does a test that uses one stop depending on?
- How does a test obtain a harness — what is the loader, and how does it reach a component rendered under TestBed, including a dialog that renders outside the fixture?
- Why does a test that queries Material's internal classes break on a library upgrade when a harness test does not?
- How are a field's validation message, a dialog's result and a table's interactions — reading its rows, sorting by a header, changing page, pressing a button in a row — checked through harness methods instead of a snapshot of the generated markup?
- Why does a component with a datepicker fail in a bare test although it works in the application, and what must the test provide?
- Which flows of a business page deserve a harness test?

Coverage concepts:

- [ ] Material component harnesses — test supported user-visible behaviour through stable harness APIs instead of querying private DOM structure or CSS classes
- [ ] Harness interaction tests — use component-specific harness methods to verify critical validation feedback, dialog results, and table interactions rather than snapshotting generated markup
- [ ] Application-wide Material dependencies under test — a component configured once for the whole application, such as a date-entry control and the adapter that decides its value representation, has none of that configuration in a bare test environment and must be given it again wherever it is mounted alone

Rationale: The three concepts are one practice: test what the user can see and do, through an API the library keeps stable, in an environment that has what the application gave the component. It is the last chapter because a harness test is written against components already understood, and because it is where the private-markup rule of chapter 04 comes back as a testing rule.

Handoff: This closes the junior route. Victor can install and theme Angular Material, build the actions, forms, tables, dialogs, feedback and shell of a business page, make that page responsive and accessible, and prove its behaviour with tests that survive a library upgrade.
