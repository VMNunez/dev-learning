# Angular Material — Introduction

Official docs: https://material.angular.io/

## What is Angular Material

A component library made by the Angular team. It gives you ready-made UI components — buttons, tables, dialogs, forms — that follow Google's Material Design guidelines.

Used in enterprise Angular apps in Spain (NTT Data, Capgemini, etc.).

## Install

```bash
ng add @angular/material
```

This installs the package and updates `angular.json` and `styles.css` automatically. Choose a color theme when prompted.

## How to use components

Each component has its own import. Import only what you need in your component's `imports` array.

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
```

## Files in this folder

| File | Component |
|------|-----------|
| `01-button.md` | Button — `matButton`, `matIconButton`, `matFab` |
| `02-select.md` | Select — `mat-select` + `mat-form-field` |
| `03-table.md` | Table — `mat-table` |
| `04-dialog.md` | Dialog — `MatDialog` |