import { afterNextRender, Injector } from '@angular/core';

// A refetch can remove or move the control a write started from — the empty state's button once the
// first item lands, a row the new order moves — and taking a node out of the document takes the focus
// with it, down to `<body>`. Once the new rows have rendered, focus goes to the first target still in
// the page: the control the write started from, then the page's own primary action, which no refetch
// removes (§14). Only while focus is on `<body>`: a user who has tabbed on, or opened a dialog meanwhile,
// is not dragged back.
export function refocusAfterRender(
  injector: Injector,
  targets: readonly (HTMLElement | null | undefined)[],
): void {
  afterNextRender(
    () => {
      if (document.activeElement !== document.body) return;
      targets.find((target) => target?.isConnected)?.focus();
    },
    { injector },
  );
}

// A failed save hands focus to what the user has to fix (§14). Once the server's errors have rendered —
// Material writes `aria-invalid` in that render — focus goes to the first control that carries one, or
// else to the dialog's own error line, which takes `tabindex="-1"` for it. From wherever the save left
// it: a form dialog disables its fields while it saves, so Enter in a field drops focus to `<body>`, while
// a click on Save leaves it on that button, which `disabledInteractive` keeps focusable. Nothing else in
// the dialog can hold focus meanwhile — Cancel is natively disabled — so focus on `<body>` or in the
// dialog's actions is still where the save started, and anywhere else the user has moved on.
export function refocusAfterFailedSave(injector: Injector, host: HTMLElement): void {
  afterNextRender(
    () => {
      const active = document.activeElement;
      const actions = host.querySelector('mat-dialog-actions');
      if (active !== document.body && !actions?.contains(active)) return;
      const target =
        host.querySelector<HTMLElement>('[aria-invalid="true"]') ??
        host.querySelector<HTMLElement>('.dialog-error');
      target?.focus();
    },
    { injector },
  );
}
