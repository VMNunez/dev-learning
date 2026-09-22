import { afterNextRender, Injector } from '@angular/core';

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
