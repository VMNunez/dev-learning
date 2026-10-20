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
    // Your answer:
  }

  remove(id: number): void {
    // Your answer:
  }
}

// My output:
