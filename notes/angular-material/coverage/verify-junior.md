# Coverage Verify — Angular Material Junior

Verdict: gaps
Coverage SHA-256: 26635841e160194a93285e01c2e6a08a6a4926898585981371dd6369abeb608a
Verified: 2026-07-29

## Open gaps

- Table refresh after collection changes — emit or assign a new data array, or call `renderRows()` after mutating a raw array, because `mat-table` does not observe in-place structural changes automatically [Tables, sorting, filtering, and pagination]
- Server-side paginator state — bind `length` to the backend's total matching count and treat `pageIndex` and `pageSize` as request state so the controls remain correct when only one page of rows is loaded [Tables, sorting, filtering, and pagination]
- Datepicker constraints and validation — use `min`, `max`, and `matDatepickerFilter` for selectable-date rules and surface the resulting Material validation errors instead of validating only after submission [Navigation and information containers]
