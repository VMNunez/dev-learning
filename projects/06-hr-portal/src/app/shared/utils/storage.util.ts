/**
 * Reads a persisted collection back out of `localStorage`.
 *
 * Every domain service builds its signal from this in a **field initializer**, which runs
 * while the injector is constructing an application-wide singleton: nothing above that
 * frame can catch, so a throw there fails the whole bootstrap to a blank page, and since
 * the offending value stays in storage the failure repeats on every reload.
 *
 * Two distinct bad values have to be survived, and only one of them throws:
 * - a truncated or hand-edited entry makes `JSON.parse` raise a `SyntaxError`;
 * - a *valid* JSON value that is not an array (`{}`, `"hi"`, `7`) parses silently and then
 *   reaches every `@for` and `computed()` as something that cannot be iterated or filtered.
 *
 * Both fall back to an empty collection, which is the same state a first visit produces.
 * The elements themselves are not validated — that is a per-entity concern, and this
 * helper deliberately stops at the boundary every caller shares.
 */
export function readStoredArray<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      console.error(`Stored "${key}" is not an array; starting empty.`, parsed);
      return [];
    }

    return parsed as T[];
  } catch (error) {
    console.error(`Stored "${key}" could not be parsed; starting empty.`, error);
    return [];
  }
}
