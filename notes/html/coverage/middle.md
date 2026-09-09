# Middle Coverage — HTML

Markup and framework-neutral accessibility concepts expected once a developer owns a feature's interface end to end: widgets the platform supplies no element for, media and metadata decisions that affect how a page loads and is shared, and conformance as a checkable claim.

## Non-trivial widgets and their contracts

- Roving `tabindex` and arrow-key navigation — a composite widget (tab list, menu, tree, toolbar) is one tab stop whose internal movement is the arrow keys, so exactly one descendant carries `tabindex="0"` at a time while the rest sit at `-1`
- `inert` — marks a subtree unfocusable, unclickable and hidden from assistive technology in one attribute, which is what makes the background behind a hand-built modal genuinely inaccessible rather than merely covered
- Complex table relationships — when a data table has spanning or multi-level headers, `scope` is no longer sufficient and cells associate through `headers` and `id`; recognising when a table has outgrown `scope` is the real decision
- `aria-describedby` beyond errors — attach persistent help text, format hints and character counters to a control so the description is announced after the name rather than living in unassociated prose
- Custom widget over native element — deciding to rebuild a select, a date picker or a dialog means taking on its entire keyboard contract, focus behaviour and announced state, so the cost of the decision is stated before it is made

## Media, loading, and document metadata

- `srcset` and `sizes` — offer the browser several resolutions of the same image and describe the layout slot it will occupy, so the device chooses a file rather than downloading a desktop-sized one for a phone
- `<picture>` and art direction — swap a genuinely different image, crop or format at a breakpoint, which `srcset` cannot do because it assumes one image at several sizes
- `loading="lazy"` and `fetchpriority` — defer offscreen media and mark the one image that is the largest contentful paint, instead of treating every image on the page as equally urgent
- Resource hints — `preload`, `preconnect` and `dns-prefetch` tell the browser about a dependency it has not discovered yet, and each one spent on the wrong resource takes bandwidth from a real one
- `<video>` and `<audio>` accessibility — captions and a transcript through `<track>` are the equivalent of `alt` for time-based media, and autoplay with sound is a documented failure rather than a preference
- Social and structured metadata — Open Graph tags and JSON-LD structured data control how a URL is rendered when it is shared or indexed, which is separate from the `<title>` and description the page shows
- Form encoding — `enctype="multipart/form-data"` is what makes a file input's bytes reach the server, and the default URL encoding silently submits only the filename

## Conformance and verification

- WCAG conformance levels — distinguish A, AA and AAA and know that AA is the level European public-sector and accessibility-act obligations are written against, so "accessible" becomes a checkable claim rather than an intention
- Testing with a real screen reader — a keyboard pass and an automated check find structural defects; only listening to a flow reveals a name that is technically present and useless
- Accessibility acceptance criteria — express the keyboard path, the announced names and the focus behaviour as testable conditions on the story, so the work is reviewable rather than retrofitted
