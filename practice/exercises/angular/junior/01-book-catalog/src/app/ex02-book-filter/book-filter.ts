/*
 * Exercise 2 — the filter (logic)
 *
 * Concept: `computed()` — derive read-only state from signals so the value stays consistent without
 * manual synchronisation.
 *
 * `BookFilter` holds the five given books and the search text in the writable signal `query`.
 *
 * Task: implement the two computed signals.
 *   - `visible` returns the books whose title contains the query, ignoring upper/lower case and any
 *     spaces around the query. An empty or blank query shows every book.
 *   - `summary` reads `"<shown> de <total> libros"`, for example `"1 de 5 libros"`.
 * Nothing else may update them: after `query.set(...)` they must already be right, with no extra call.
 *
 * Pass condition: the given spec `book-filter.spec.ts` passes. In a comment below your code, say in
 * Spanish why `summary` stays correct without you ever assigning it.
 *
 * Run (from the workspace folder): ng test lote-01 --include app/ex02-book-filter --watch=false
 * Then paste what it printed under `// My output:` at the end of this file.
 *
 * Answer files: book-filter.ts
 */
import { Injectable, computed, signal } from '@angular/core';

import { BOOKS, Book } from '../books';

@Injectable({ providedIn: 'root' })
export class BookFilter {
  readonly books: readonly Book[] = BOOKS;
  readonly query = signal('');

  readonly visible = computed<readonly Book[]>(() => {
    // Your answer:
    return [];
  });

  readonly summary = computed<string>(() => {
    // Your answer:
    return '';
  });
}

// My output:
