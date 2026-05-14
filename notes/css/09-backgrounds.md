# CSS — Backgrounds and Images

Official docs:
- Background: https://developer.mozilla.org/en-US/docs/Web/CSS/background
- Object-fit: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit

---

## background-color

Sets the background color of an element. Uses any color format.

```css
background-color: var(--surface);
background-color: #fff;
background-color: rgba(0, 0, 0, 0.5);
background-color: transparent;
```

---

## background-image

Sets an image or gradient as the background.

```css
background-image: url('image.jpg');
background-image: url('/assets/hero.png');
```

When using a background image, always set a fallback color:

```css
background-color: var(--background);  /* shows while image loads */
background-image: url('hero.jpg');
```

---

## background-size

Controls how the background image is sized inside the element.

```css
background-size: cover;    /* fills the element completely — may crop the image */
background-size: contain;  /* fits the whole image — may leave empty space */
background-size: auto;     /* natural image size (default) */
background-size: 100% 100%; /* stretches to fill — distorts the image */
background-size: 300px;    /* fixed size */
```

**`cover` vs `contain`:**

```
Original image: 400×200

cover  → fills 300×300 container, crops top/bottom:
         ┌──────────┐
         │ [image]  │  ← no empty space, image may be cropped
         └──────────┘

contain → fits inside 300×300, leaves empty space:
         ┌──────────┐
         │          │  ← empty space on sides
         │ [image]  │
         │          │
         └──────────┘
```

`cover` is the standard choice for hero sections and card images.

---

## background-position

Controls where the background image is positioned inside the element.

```css
background-position: center;         /* centered both axes */
background-position: top;            /* aligned to top, centered horizontally */
background-position: center top;     /* centered horizontally, top vertically */
background-position: 50% 30%;        /* 50% from left, 30% from top */
```

### Hero section pattern

```css
.hero {
  background-image: url('hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 60vh;
}
```

---

## background-repeat

```css
background-repeat: no-repeat;  /* show image once (most common with photos) */
background-repeat: repeat;     /* tile the image (default) */
background-repeat: repeat-x;   /* tile horizontally only */
background-repeat: repeat-y;   /* tile vertically only */
```

---

## background shorthand

```css
background: color image position / size repeat;

/* Example */
background: var(--background) url('hero.jpg') center / cover no-repeat;
```

---

## Gradients

Gradients are background images — no `url()` needed.

### Linear gradient

```css
/* top to bottom (default) */
background: linear-gradient(var(--primary), #fff);

/* left to right */
background: linear-gradient(to right, #667eea, #764ba2);

/* diagonal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* multiple stops */
background: linear-gradient(to right, #f093fb 0%, #f5576c 50%, #4facfe 100%);
```

### Radial gradient

```css
background: radial-gradient(circle, #667eea, #764ba2);
```

---

## object-fit — for `<img>` elements

`object-fit` controls how an `<img>` fills its container. The container must have an explicit `width` and `height`.

```css
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;    /* fills the box, may crop */
}
```

| Value | Behaviour |
|-------|-----------|
| `cover` | Fills the container, maintains aspect ratio — may crop |
| `contain` | Fits inside the container, maintains aspect ratio — may leave space |
| `fill` | Stretches to fill — distorts the image |
| `none` | Natural size — may overflow or leave space |
| `scale-down` | Like `contain` but never enlarges the image |

`object-fit: cover` is the standard choice for card images and avatars.

### object-position

Controls where the image is anchored when `object-fit: cover` crops it.

```css
object-fit: cover;
object-position: center;   /* default */
object-position: top;      /* keep the top of the image */
object-position: 50% 20%;  /* 50% from left, 20% from top */
```

### Pattern — card with image

```css
.card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: center;
  display: block;  /* removes gap below image */
}
```

---

## `background-color` vs `background`

`background` is a shorthand. If you only want to set the color, use `background-color` — using the shorthand resets all other background properties.

```css
/* ✅ Safe — only changes the color */
background-color: var(--surface);

/* ⚠️ Resets background-image, position, size, etc. */
background: var(--surface);
```
