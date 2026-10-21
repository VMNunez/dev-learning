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
    const query = this.query().trim().toLowerCase();
    return this.books.filter((book) => book.title.toLowerCase().includes(query));
  });

  readonly summary = computed<string>(
    () => `${this.visible().length} de ${this.books.length} libros`,
  );
}

// Por qué summary sigue siendo correcto sin asignarlo nunca:
// porque un computed se recalcula solo cuando cambia un signal que lee. summary lee visible(), y visible lee query(). Al hacer query.set(...), query avisa a visible, visible se recalculay avisa a summary, que también se recalcula. Nadie tiene que asignarle el valor a mano.

// My output:
//  ✓  lote-01  01-book-catalog/src/app/ex02-book-filter/book-filter.spec.ts (3 tests) 18ms
//    ✓ Exercise 2 — BookFilter (3)
//      ✓ shows every book while the query is empty or blank 13ms
//      ✓ matches titles ignoring case and the spaces around the query 2ms
//      ✓ keeps the summary in step with the query, with no other call 2ms

//  Test Files  1 passed (1)
//       Tests  3 passed (3)
//    Start at  12:12:15
//    Duration  978ms (transform 60ms, setup 252ms, import 30ms, tests 18ms, environment 522ms)
