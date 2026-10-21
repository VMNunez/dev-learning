/*
 * Exercise 1 — the shelf (logic)
 *
 * Concept: Immutable updates with signals — replace object or array references so state changes
 * remain predictable across signals and `OnPush` views.
 *
 * `BookShelf` keeps the shelf in a private writable signal and exposes it read-only as `books`.
 * It starts with the first three books of `BOOKS`.
 *
 * Task: implement the two methods.
 *   - `add(title, author)` appends a new book at the end of the shelf. Its `id` is the highest id on
 *     the shelf plus one, or 1 when the shelf is empty.
 *   - `remove(id)` takes that book off the shelf and keeps the others in their order. An id that is
 *     not on the shelf changes nothing.
 * Both must produce a NEW array for the signal — never `push` into, or `splice` out of, the array the
 * signal currently holds.
 *
 * Pass condition: the given spec `book-shelf.spec.ts` passes. In a comment below your code, say in
 * Spanish why mutating the current array would leave `books()` returning the same reference.
 *
 * Run (from the workspace folder): ng test lote-01 --include app/ex01-book-shelf --watch=false
 * Then paste what it printed under `// My output:` at the end of this file.
 *
 * Answer files: book-shelf.ts
 */
import { Injectable, signal } from '@angular/core';

import { BOOKS, Book } from '../books';

@Injectable({ providedIn: 'root' })
export class BookShelf {
  private readonly shelf = signal<readonly Book[]>(BOOKS.slice(0, 3));
  readonly books = this.shelf.asReadonly();

  add(title: string, author: string): void {
    this.shelf.update((books) => {
      const nextId = books.length === 0 ? 1 : Math.max(...books.map((book) => book.id)) + 1;
      return [...books, { id: nextId, title, author }];
    });
  }

  remove(id: number): void {
    this.shelf.update((books) => books.filter((book) => book.id !== id));
  }
}

// Por qué mutar el array actual deja la misma referencia:
// Por qué mutar el array actual deja la misma referencia:
// push mete el libro en el mismo array que ya tiene el signal, no crea uno nuevo.
// Por eso books() devuelve el mismo array, y el signal, al ver la misma referencia,
// cree que nada ha cambiado y no avisa ni a la vista ni a los computed que dependen de él.

// My output:
//  ✓  lote-01  01-book-catalog/src/app/ex01-book-shelf/book-shelf.spec.ts (4 tests) 21ms
//    ✓ Exercise 1 — BookShelf (4)
//      ✓ add appends the new book last, with the next id 15ms
//      ✓ add gives the signal a new array instead of changing the old one 2ms
//      ✓ remove takes only that book off and keeps the order; an unknown id changes nothing 2ms
//      ✓ the next id follows the highest id left on the shelf, and is 1 on an empty shelf 1ms

//  Test Files  1 passed (1)
//       Tests  4 passed (4)
//    Start at  11:56:29
//    Duration  13.00s (transform 55ms, setup 592ms, import 26ms, tests 21ms, environment 12.05s)
