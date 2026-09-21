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
