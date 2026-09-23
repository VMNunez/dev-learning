import { afterNextRender, Injector } from '@angular/core';

/** The document's focused element, narrowed to the interface that can be focused back. */
export function activeElement(): HTMLElement | null {
  const active = document.activeElement;
  return active instanceof HTMLElement ? active : null;
}

/**
 * The focus hand-back of a row action, decided the moment the write resolves.
 *
 * The refetch that follows is what removes the pressed control, so the move is made *before* it,
 * while the control still holds focus — which is why this rule is synchronous and
 * `refocusAfterRender` below is not. The two are not interchangeable: measured after the next
 * render, focus is still on a control nothing has removed yet, and the move would never happen.
 *
 * It moves only while focus is where the write left it, or has already fallen to the body, so a
 * user who tabbed away — or opened a dialog whose focus trap an unconditional move would break —
 * keeps their place.
 */
export function refocusAfterWrite(
  pressed: Element | null,
  target: HTMLElement | null | undefined,
): void {
  const active = document.activeElement;
  if (active !== pressed && active !== document.body) return;
  target?.focus();
}

/**
 * The focus hand-back of a reload, decided once the new rows are on screen.
 *
 * Here the control is already gone — the failed load replaced it with the error block, or the
 * refetch re-rendered the row — so focus has fallen to the body and the first target still
 * connected takes it.
 */
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
