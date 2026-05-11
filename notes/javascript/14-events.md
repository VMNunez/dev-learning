# Events and Event Propagation

## How events travel through the DOM

When you click a button, the browser does not just fire the event on that button. It travels in two phases:

1. **Capturing** — the event goes down from the document root to the target element
2. **Bubbling** — the event goes back up from the target to the root

```
document
  └── body
        └── div.card          ← 2. bubble reaches here
              └── button      ← 1. click fires here first
```

In practice you almost never need to worry about capturing. Bubbling is what matters.

---

## Event bubbling

A click on a child element also triggers click handlers on every parent element.

```html
<div class="card" (click)="openCard()">
  <button (click)="addToFavourites()">Add</button>
</div>
```

If you click the button, both `addToFavourites()` AND `openCard()` run — because the click bubbles up from the button to the div.

This is often not what you want.

---

## `stopPropagation()` — stop the bubble

Prevents the event from travelling further up the DOM tree.

```ts
addToFavourites(event: MouseEvent): void {
  event.stopPropagation();   // the click stops here — openCard() does not run
  // ... add to favourites logic
}
```

```html
<div class="card" (click)="openCard()">
  <button (click)="addToFavourites($event)">Add</button>
</div>
```

You must pass `$event` in the template so the event object is available in the method.

This is the exact pattern used in project 04 (meal finder) — clicking the favourite button on a meal card should not also open the meal detail.

---

## `preventDefault()` — stop the browser default

Some elements have a default browser behaviour. `preventDefault()` cancels it.

```ts
onSubmit(event: Event): void {
  event.preventDefault();   // stop the page from reloading on form submit
}

onLinkClick(event: MouseEvent): void {
  event.preventDefault();   // stop the browser from navigating to the href
}
```

| Element | Default behaviour |
|---------|------------------|
| `<form>` | Submit and reload the page |
| `<a href="...">` | Navigate to the URL |
| `<input type="checkbox">` | Toggle the checkbox |

In Angular, reactive forms do not submit the page by default — Angular intercepts this automatically. But `preventDefault()` is still useful for `<a>` links and custom interactions.

---

## `stopPropagation` vs `preventDefault`

| | What it stops |
|---|---------------|
| `stopPropagation()` | The event from bubbling up to parent elements |
| `preventDefault()` | The browser's default action for that element |

They are independent — you can call one, both, or neither.

---

## Angular — receiving the event object

Use `$event` in the template to pass the native event to your method:

```html
<button (click)="handleClick($event)">Click</button>
<input (input)="handleInput($event)" />
```

```ts
handleClick(event: MouseEvent): void {
  event.stopPropagation();
}

handleInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
}
```

The `$event` object is typed differently depending on the event:
- `(click)` → `MouseEvent`
- `(keyup)` / `(keydown)` → `KeyboardEvent`
- `(input)` / `(change)` → `Event` (cast `event.target` to `HTMLInputElement`)
