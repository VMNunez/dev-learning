/**
 * The ids of the rows a page is currently writing to.
 *
 * A scalar busy id can only answer *which row was written to last*, so starting a write on one row
 * releases the guard on another: its buttons come back to life while its own request is still in
 * flight, and — with `disabledInteractive` moving the whole defence into the TypeScript guard — a
 * second write on that row goes through. A per-row question needs a set.
 *
 * Both helpers return a **new** set rather than mutating the one they were given. A signal notifies
 * by comparing with `Object.is`, so a set added to in place is the same reference, the signal stays
 * silent and the template never repaints the button it was asked to lock.
 */
export function withBusyId(ids: ReadonlySet<number>, id: number): ReadonlySet<number> {
  return new Set(ids).add(id);
}

export function withoutBusyId(ids: ReadonlySet<number>, id: number): ReadonlySet<number> {
  const next = new Set(ids);
  next.delete(id);
  return next;
}
