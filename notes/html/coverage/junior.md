# Minimum Coverage — HTML

Markup semantics, native element behaviour, forms and labelling, and framework-neutral accessibility a junior or junior-mid developer must explain confidently in a 2026 Spanish consultancy screening. Browser styling mechanics belong to CSS, template syntax and bindings to Angular, library-supplied behaviour to Angular Material, and HTTP itself to General.

## Document structure and metadata

- `<!DOCTYPE html>` — the first line switches the browser into standards mode; omitting it triggers quirks mode, where a set of legacy layout behaviours is reinstated and the page renders differently for no visible reason in the markup
- `<html lang>` — declares the document's natural language, which is what selects the screen reader's pronunciation rules and the browser's hyphenation and spell-check dictionaries; an unset or wrong `lang` makes a Spanish page read aloud with English phonetics
- `lang` on a fragment — a quotation or term in another language carries its own `lang` on the element that wraps it, so pronunciation switches for that span and returns afterwards
- `<meta charset="utf-8">` — declares the byte encoding, and the specification requires it within the document's first 1024 bytes because the parser has to commit to an encoding before it reaches the content; declared late or not at all, accented characters arrive as replacement glyphs
- `<meta name="viewport">` — without it a mobile browser lays the page out at a virtual desktop width and scales the result down, so a responsive stylesheet has nothing to respond to
- `<title>` — names the document in the tab, the history, the bookmark and the search result, and is the first thing a screen reader announces on load, so it identifies the page rather than the site
- The title after a client-side route change — a single-page application swaps the view without a document load, so unless the title is set on navigation every route keeps announcing the name of the page the user arrived on
- `<head>` vs `<body>` — metadata, the title, stylesheets and scripts describe the document; only `<body>` content is rendered, and an element placed in the wrong one is silently relocated by the parser
- Landmark elements — `<header>`, `<nav>`, `<main>`, `<aside>` and `<footer>` define navigable regions a screen-reader user can jump between, which a page built from anonymous `<div>`s does not have at all
- One `<main>` per document — the element marks the page's primary content so a skip link and assistive navigation have a single unambiguous destination; a second visible `<main>` makes that target undefined
- Naming repeated landmarks — two `<nav>` elements in one page are announced identically unless each carries its own `aria-label`, so the primary navigation and a breadcrumb or footer menu are distinguishable in the landmark list
- One `<h1>` per page, and it names the page — headings are the document's outline, not a size scale, so every routed view owns exactly one `<h1>` stating what that view is; a brand or logo in the site chrome is a link, not a heading
- Heading order without skips — `<h1>` through `<h6>` express nesting depth, so jumping from `<h2>` to `<h4>` because the smaller size looked right breaks the outline a screen reader navigates by
- `id` vs `class` — an `id` is unique in the document and is the anchor that `for`, `aria-labelledby`, `aria-describedby` and fragment links point at; a `class` is a repeatable hook with no such role
- A duplicated `id` silently breaks its references — `for`, `aria-labelledby` and `aria-describedby` resolve to the first match in the document, so a component rendered twice with a hard-coded `id` gives every later copy the first copy's label
- Script loading position — a classic `<script>` in `<head>` blocks parsing where it sits, `defer` postpones execution until the document is parsed while preserving source order, and `async` runs it as soon as it arrives in whatever order the network delivers; both attributes apply only to a script with `src`, and a module script defers by default
- `<iframe title>` — an embedded document is a landmark in the host page and is announced by its `title`, so a map, a video player or a payment frame without one is offered to the user as an unnamed region

## Element semantics and content model

- Semantic element vs `<div>` — choosing the element that describes the content gives the browser a role, default behaviour and keyboard contract for free; `<div>` and `<span>` are the deliberate choice of *no* semantics, correct only when nothing more specific applies
- `<article>` vs `<section>` vs `<div>` — `<article>` is a block that would still make sense distributed on its own, `<section>` is a thematic group that owns a heading, and `<div>` is a styling hook with no meaning at all
- Content model and invalid nesting — the specification says which elements may contain which, and a browser handed invalid markup does not error but silently repairs the tree, so a `<div>` inside a `<p>` or a stray `<li>` produces a DOM that no longer matches the source
- Interactive content does not nest — a `<button>` inside an `<a>` is invalid markup whose activation target is ambiguous and whose accessibility tree browsers repair inconsistently, so a secondary action inside a linked card is a sibling of the link overlaid by positioning, never a child of it
- Void elements — `<img>`, `<input>`, `<br>` and `<hr>` have no closing tag and no children because the content model gives them none, which is why writing `<input></input>` is meaningless rather than merely verbose
- Boolean attributes — `disabled`, `required`, `checked`, `readonly` and `hidden` are true by their presence, so `disabled="false"` disables the control; only removing the attribute clears it
- Character entities — `&lt;`, `&gt;` and `&amp;` write characters the parser would otherwise read as markup, while `&nbsp;` and the named entities for typographic characters exist to write a character the source encoding or the eye cannot distinguish; text that may contain `<` or `&` is escaped before it becomes part of the document
- `<strong>`/`<em>` vs `<b>`/`<i>` — the first pair states importance and emphasis, which reaches the accessibility tree and can change intonation; the second pair marks text set apart by convention with no added meaning

## Text, lists, and tables

- Lists — `<ul>` for an unordered set, `<ol>` where the sequence is part of the meaning, and `<dl>` for name–value pairs; the element is what makes assistive technology announce the item count and position
- Data tables — `<table>` with `<caption>`, `<thead>`, `<tbody>` and `<th scope>` binds each cell to its header, which is what lets a screen-reader user hear the column name with the value instead of a bare number; a table used for page layout destroys that reading order and is never the layout tool
- `<figure>` and `<figcaption>` — associate a caption with the image, chart or code block it describes, so the relationship survives when the two are read out of visual context
- `<time datetime>` — carries a machine-readable timestamp alongside the human-readable text, so "next Tuesday" is also an unambiguous date for tooling

## Images

- Informative image `alt` — the attribute carries the information the image conveys, in the words a sighted reader would take from it; restating the filename, writing "image of", or leaving it empty on a meaningful image all lose that information
- Decorative vs informative images — an image whose information is already carried by adjacent text is decorative and takes `alt=""`, which gives it `role="presentation"` and removes it from the accessibility tree, whereas an *absent* `alt` leaves the image with `role="img"` and no computed name at all, which is why screen readers commonly fall back to announcing the `src` filename
- `width` and `height` on `<img>` — the intrinsic dimensions let the browser reserve the right box before the bytes arrive, which is what stops the content below from jumping when the image finally loads

## Links, buttons, and native interactive elements

- Navigating elements must be links — an element that takes the user to another URL has to be an `<a>` with a real `href`, because keyboard reachability, the `link` role, Enter activation and the browser's own affordances (open in a new tab, copy link address) are all derived from the tag and its attributes, never from a click listener
- Acting elements must be buttons — an element that performs an in-page action has to be a `<button>`, because focusability, the `button` role and activation by both Enter and Space come from the tag; the mirror of the rule above, and the reason a click handler on a `<div>` works with the mouse and with nothing else
- `<a>` without `href` — an anchor with no `href` is not in the tab order, computes no `link` role and cannot be activated from the keyboard, so it is a styled span that only the mouse reaches
- `role` declares semantics but supplies no behaviour — `role="button"` plus `tabindex="0"` tells assistive technology what the element claims to be while the browser still supplies none of the promised behaviour, so the announced Space-bar activation scrolls the page instead; the fix is the right element, not more attributes
- Link text meaningful out of context — a screen-reader user can pull up the list of links on a page with no surrounding prose, so "read more" repeated six times identifies nothing; the destination belongs in the link text or in the name that replaces it
- `<button>` defaults to `type="submit"` — a button inside a form submits it unless `type="button"` is stated, which is the classic accidental page reload; stating `type` explicitly on every button removes the whole class of bug
- `<button>` vs `<input type="submit">` — the button element has content, so it can hold markup and an icon and its label is its children, while the input is void and its label is the `value` attribute that is also submitted
- `target="_blank"` and `rel` — the specification now gives `target="_blank"` an implicit `noopener`, so the historic tab-nabbing hardening is a legacy concern; what remains a decision is that the link takes the user out of their current context without warning, and `rel="noreferrer"` still has to be asked for separately
- Relative vs absolute URLs — a relative `href` resolves against the current document's URL, so the same markup points somewhere different once the page moves to a nested route
- `<details>` and `<summary>` — a native disclosure widget whose open and closed state, keyboard operation and announcement are supplied by the browser, which is the baseline any hand-built accordion has to match
- `<dialog>` and `showModal()` — the platform's own modal, supplying the top layer, the inert backdrop, focus containment and Escape-to-close, and the reference point for what a component library's dialog is reimplementing

## Forms and labelling

- Accessible name of a form control — a `<label for>` bound to the control's `id` is what names the field in the accessibility tree, while a `placeholder` sits at the bottom of the name computation and is used only when nothing better exists, so a placeholder-only control is announced by an example value rather than by what it is, and loses even that hint the moment the user types
- Wrapping label vs `for` — a `<label>` that contains its control associates implicitly, which avoids inventing an `id`, but the explicit `for`/`id` pair survives markup that has to place the label elsewhere in the DOM
- Clicking the label focuses the control — the association is not only for assistive technology; it enlarges the hit target of every checkbox and radio in the form, which is a visible defect when it is missing
- `input` `type` — `text`, `email`, `number`, `password`, `date`, `checkbox`, `radio` and `file` each change the control the browser renders, the mobile keyboard it raises, the value it parses and the native validation it applies, so the type is a data decision rather than a cosmetic one
- `name` and form submission — a control without a `name` is not submitted at all, and on radios and checkboxes it is `value` that reaches the server while the visible label never does
- Form `method` — `get` puts the fields in the query string, which makes the result linkable and bookmarkable and is why a search form uses it, while `post` puts them in the request body for anything that changes state or should not appear in a URL or a history entry
- `<fieldset>` and `<legend>` — group related controls, especially a radio set, so the group's question is announced together with each option instead of every option arriving without its context
- `<select>` and `<option>` — the option's `value` is what is submitted while its text is only what is displayed, and `selected` chooses the initial option rather than the browser's default of the first one
- `<textarea>` value semantics — the control's value is its child text, not a `value` attribute, so its initial content is written between the tags and any whitespace there is part of the value
- `disabled` vs `readonly` — a disabled control is skipped by the keyboard and not submitted, while a readonly control is focusable, copyable and still submitted; choosing the wrong one silently drops a field from the payload
- Native validation attributes — `required`, `min`/`max`, `step` and `pattern` make the browser block submission and show its own message before any script runs, while `maxlength` works differently by preventing the keystroke rather than failing the submit, and `novalidate` on the form turns the whole native gate off
- Client validation is never the server's guarantee — every native constraint is a user-experience affordance a user can bypass with devtools or by posting directly, so the same rule exists again on the server
- `autocomplete` tokens — `email`, `name`, `current-password` and `one-time-code` let the browser and password manager fill the field correctly, which is a few characters of markup and a measurable difference on a real form
- `inputmode` — selects the mobile keyboard layout independently of `type`, for the cases where the value is digits but not a number the browser should parse
- Error messaging tied to its field — an invalid control carries `aria-invalid` and points at its message with `aria-describedby`, so the error is announced with the field; a red border and red text alone reach only the eye
- A form that would still submit without JavaScript — an `action`, a `method` and a real `<button type="submit">` mean the browser can post the form on its own, which is what makes intercepting the submit event a decision rather than the only thing holding the form together

## The accessibility tree and accessible names

- The accessibility tree — the browser derives a second tree from the DOM, holding each node's role, name, state and value, and that tree is what a screen reader reads; an element can look correct on screen and be absent, unnamed or mislabelled in it
- Implicit roles — every native element already carries a role (`<button>` is `button`, `<a href>` is `link`, `<nav>` is `navigation`), which is the whole reason choosing the right element removes work rather than adding it
- ARIA's first rule — use a native element instead of an ARIA attribute wherever one exists, because ARIA changes only what is announced and never what the browser does; ARIA is for the cases the platform has no element for
- ARIA that contradicts its element — an author role that fights the tag it sits on is at best ignored and at worst believed: `role="presentation"` on a focusable control is discarded by the browser under the conflict-resolution rules, while `role="button"` on a link is honoured and leaves the announced semantics disagreeing with what Enter and Space actually do
- Accessible-name precedence — the name is computed from an ordered set of sources, with `aria-labelledby` above `aria-label`, above the control's own label or content, above the `title` and `placeholder` fallbacks, so adding `aria-label` silently replaces the visible text a sighted user reads
- `title` vs `aria-label` — the `title` attribute is a last-resort name source that appears as a mouse tooltip, is unreachable by touch and inconsistently announced, so it is a supplement and never the way a control gets its name
- Accessible name of an icon-only control — a control whose only content is a glyph or an icon font computes to an unusable accessible name or none at all, so it needs an explicit `aria-label` naming the action it performs
- Pressed state of a toggle control — a button that turns a setting on and off carries `aria-pressed`, which is what puts the on/off state in the accessibility tree; the control therefore states its state twice, once for the eye through a class and once for the tree through the attribute, because a colour or a filled-versus-outlined shape reaches only the eye
- Expanded state of a disclosure — a trigger that shows and hides a panel, menu or submenu carries `aria-expanded` and points at what it controls with `aria-controls`, which is what a rotated chevron does not express; it is the state most often missing from a hand-built dropdown
- Current item in a set — `aria-current` marks the active navigation link, step or page as the current one, which a background colour or a heavier weight cannot express
- Live regions — an asynchronous change is announced only from inside a region marked `aria-live`, `role="status"` or `role="alert"`, so a result count, a save confirmation or a validation summary that simply appears is read only if the user happens to move there; `polite` waits for a pause and `assertive`, which `role="alert"` implies, interrupts, which is why it is reserved for errors
- Hiding from the layout, from the tree, or from both — the `hidden` attribute and `display: none` remove an element from both, `visibility: hidden` also removes it from both while keeping its space, and `aria-hidden="true"` removes it only from the tree while leaving it visible and focusable; hiding a focusable control with `aria-hidden` produces a control the keyboard reaches and the screen reader cannot announce
- Visually hidden but announced — the opposite case: text meant only for assistive technology has to leave the visual layout while staying in the accessibility tree, which none of the properties above can do because each removes it from both; the pattern is a positioned one-pixel box that is clipped rather than sized to zero

## Focus and keyboard operability

- Everything interactive is keyboard operable — a feature that can only be reached or triggered with a pointer is unusable for keyboard and screen-reader users, and it is the fastest defect to find: put the mouse down and Tab through the page
- Sequential focus order follows DOM order — the tab sequence comes from the document, not from the visual arrangement, so a control moved on screen by layout is still reached where its markup sits, and a visual order that no longer matches the source is a reading-order defect rather than a styling detail
- `tabindex` values — `0` puts a non-interactive element into the natural tab order, `-1` makes it focusable only from script for programmatic focus, and any positive value jumps it ahead of the whole document and is an anti-pattern in every real page
- A visible focus indicator is required — a keyboard user has no other way to tell where they are, so an indicator removed for aesthetics is replaced rather than deleted; that it must exist and be perceivable is an accessibility obligation, while how it is drawn is a CSS decision
- Moving focus deliberately — opening a dialog, revealing a panel or navigating in a single-page application leaves focus where it was unless code moves it, so focus is sent to the new content and returned to the trigger when it closes
- Skip link to main content — a first focusable link that jumps past the navigation spares a keyboard user tabbing through the whole menu on every page, and it is the cheapest evidence that the page was actually used from the keyboard

## Reading and reviewing markup

- Reviewing markup for the recurring defects — the ones worth reading a snippet for are a click handler on a non-interactive element, a field whose only text is a placeholder, an `alt` restating the filename, a heading level chosen for its size, and `role`, `tabindex` and `aria-label` piled onto `<div>`s where three native elements would have done the job; the last is the canonical shape of generated markup, announced correctly and behaving wrongly
- Inspecting the accessibility tree — browser devtools show the computed role, name and state of the selected element, which answers "what will a screen reader say here" without installing one
- Automated accessibility checks and their limit — a Lighthouse or axe pass finds missing names, contrast failures and invalid ARIA cheaply, and cannot tell whether the reading order makes sense or the labels are honest, so the keyboard pass is not replaced by it
