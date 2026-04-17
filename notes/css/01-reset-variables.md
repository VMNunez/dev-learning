# Reset and Variables

## Reset — always at the top of styles.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}
```

## CSS Variables — always in :root

```css
:root {
  --primary: #e8572a;
  --background: #f9f5f0;
  --surface: #ffffff;
  --text: #1a1a1a;
  --text-muted: #6b6b6b;
  --border: #e8e0d8;
  --shadow: rgba(0, 0, 0, 0.08);
}
```

Standard variable names to reuse across projects:
- `--primary` — accent colour (buttons, links)
- `--background` — page background
- `--surface` — card/panel background (usually white)
- `--text` — main text
- `--text-muted` — secondary text (labels, hints)
- `--border` — input and card borders
- `--shadow` — box shadow colour (always low opacity)