# Angular — Pipes

A pipe transforms a value in the template without changing the original data. You use pipes with the `|` symbol.

Official docs: https://angular.dev/guide/templates/pipes

```html
{{ value | pipeName }} {{ value | pipeName:argument }}
```

## Import pipes in your component first

Built-in pipes must be imported in the `imports` array of the component — without this they will not work in the template.

The most commonly used pipes:

| Pipe         | Import class    | What it does                                     |
| ------------ | --------------- | ------------------------------------------------ |
| `number`     | `DecimalPipe`   | Format numbers with decimal places               |
| `currency`   | `CurrencyPipe`  | Format numbers as money (€, $, etc.)             |
| `date`       | `DatePipe`      | Format dates into readable strings               |
| `uppercase`  | `UpperCasePipe` | Convert text to uppercase                        |
| `lowercase`  | `LowerCasePipe` | Convert text to lowercase                        |
| `titlecase`  | `TitleCasePipe` | Capitalise the first letter of each word         |
| `slice`      | `SlicePipe`     | Cut an array or string to a given length         |
| `json`       | `JsonPipe`      | Show an object as JSON text — useful for debug   |
| `async`      | `AsyncPipe`     | Subscribe to an Observable directly in the template |

```typescript
import { DatePipe, CurrencyPipe, SlicePipe, UpperCasePipe, DecimalPipe } from '@angular/common';

@Component({
  imports: [DatePipe, CurrencyPipe, SlicePipe, UpperCasePipe, DecimalPipe],
  ...
})
```

Only import the pipes you actually use.

---

## Built-in pipes

### `number` — format numbers `import: DecimalPipe`

```html
{{ 1234.5678 | number:'1.0-1' }} → 1,234.6 {{ 1234.5678 | number:'1.2-2' }} → 1,234.57
```

Format string: `'minIntegerDigits.minFractionDigits-maxFractionDigits'`

| Part | Meaning                  |
| ---- | ------------------------ |
| `1`  | minimum 1 integer digit  |
| `0`  | minimum 0 decimal digits |
| `1`  | maximum 1 decimal digit  |

### `currency` — format money `import: CurrencyPipe`

```html
{{ 1234.5 | currency }} → $1,234.50 {{ 1234.5 | currency:'EUR' }} → €1,234.50 {{ 1234.5 |
currency:'EUR':'symbol':'1.2-2' }} → €1,234.50
```

The pipe accepts up to three arguments in this order:

```
currency : currencyCode : display : numberFormat
```

**`currencyCode`** — the ISO code of the currency: `'EUR'`, `'USD'`, `'GBP'`, etc.

**`display`** — how the currency label appears next to the number:

| Value             | Result        | When to use                                                        |
| ----------------- | ------------- | ------------------------------------------------------------------ |
| `'symbol'`        | `€1,234.50`   | Default — use in most cases                                        |
| `'code'`          | `EUR1,234.50` | When you need the code to be explicit                              |
| `'symbol-narrow'` | `€1,234.50`   | Some currencies have a long symbol — this forces the short version |

**`numberFormat`** — same format string as the `number` pipe: `'minIntegers.minDecimals-maxDecimals'`. Example: `'1.2-2'` means at least 1 integer digit, exactly 2 decimal places.

The arguments are positional — you cannot skip one. If you want to set `numberFormat`, you must also write `display` even if you just want the default:

```html
{{ 1234.5 | currency:'EUR':'symbol':'1.2-2' }} → €1,234.50
```

### `date` — format dates `import: DatePipe`

You can build your own format by combining tokens in any order:

```html
{{ date | date:'dd/MM/yyyy' }} → 17/04/2026 {{ date | date:'yyyy-MM-dd' }} → 2026-04-17 {{ date |
date:'dd/MM/yyyy HH:mm' }} → 17/04/2026 14:30
```

Common tokens:

| Token  | Meaning                        | Example |
| ------ | ------------------------------ | ------- |
| `dd`   | Day with leading zero          | `07`    |
| `d`    | Day without leading zero       | `7`     |
| `MM`   | Month number with leading zero | `04`    |
| `MMM`  | Month abbreviation             | `Apr`   |
| `MMMM` | Full month name                | `April` |
| `yyyy` | 4-digit year                   | `2026`  |
| `yy`   | 2-digit year                   | `26`    |
| `HH`   | Hours (24h)                    | `14`    |
| `hh`   | Hours (12h)                    | `02`    |
| `mm`   | Minutes                        | `30`    |
| `ss`   | Seconds                        | `05`    |

Angular also has preset formats you can use instead of building your own:

```html
{{ date | date:'short' }} → 4/17/26, 2:30 PM {{ date | date:'medium' }} → Apr 17, 2026, 2:30:00 PM
{{ date | date:'longDate' }} → April 17, 2026 {{ date | date:'shortTime' }} → 2:30 PM
```

### `uppercase` / `lowercase` / `titlecase` `import: UpperCasePipe, LowerCasePipe, TitleCasePipe`

```html
{{ 'hello world' | uppercase }} → HELLO WORLD {{ 'HELLO WORLD' | lowercase }} → hello world {{
'hello world' | titlecase }} → Hello World
```

### `slice` — cut an array or string `import: SlicePipe`

```html
{{ 'Hello World' | slice:0:5 }} → Hello {{ items | slice:0:3 }} → first 3 items
```

Arguments: `start:end` — same as JavaScript `Array.slice()`.

### `json` — display an object as JSON (useful for debugging) `import: JsonPipe`

```html
{{ myObject | json }}
```

### `async` — subscribe to an Observable or Promise in the template `import: AsyncPipe`

```html
{{ data$ | async }}
```

Subscribes automatically and unsubscribes when the component is destroyed. You will use this when you work with Observables directly in templates.

---

## Chaining pipes

You can chain multiple pipes:

```html
{{ 'hello world' | titlecase | slice:0:5 }} → Hello
```

---

## Custom pipes

Create your own pipe when Angular does not have what you need — for example, truncating long text.

Official docs: https://angular.dev/guide/templates/pipes#creating-pipes

### Generate a pipe

```bash
ng generate pipe shared/pipes/truncate
```

### Pipe structure

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength) + '...';
  }
}
```

- `name` — the string you use in the template after `|`
- `transform()` — the method Angular calls; the first argument is always the value being piped
- Additional arguments map to the arguments you pass in the template: `| truncate:100`

### Use it in a template

Import the pipe in the component, then use it in the template:

```typescript
@Component({
  imports: [TruncatePipe],
  ...
})
```

```html
{{ task.description | truncate }}
{{ task.description | truncate:100 }}
```

The first call uses the default (`50`). The second passes `100` as `maxLength`.
