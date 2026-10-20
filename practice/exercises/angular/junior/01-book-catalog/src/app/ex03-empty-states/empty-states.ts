/*
 * Exercise 3 — why is the list empty? (interface)
 *
 * Concept: `@empty` — attach a collection's empty case to the loop instead of a sibling condition,
 * and recognise that it reports only that the loop's own expression rendered nothing, so a filtered
 * list must consult its unfiltered source to say why it is empty.
 *
 * This component is given: it holds the shelf (`books`), the search text (`query`) and the filtered
 * view (`visible`), and the template already has the search box and the two buttons.
 *
 * Task: in `empty-states.html`, under `<!-- Your answer: -->`, render `visible()` as a list with
 * `@for` (tracking each book by its id), showing title and author. Attach an `@empty` block that
 * says WHY nothing is shown:
 *   - the shelf itself is empty → `Todavía no hay libros en la estantería.`
 *   - the shelf has books but the search hid them all → `Sin resultados para «<query>».`
 *
 * Manual check — run `ng serve lote-01` and open http://localhost:4200/ex03:
 *   1. The five titles are listed, each with its author.
 *   2. Type `xyz` in the search box → only `Sin resultados para «xyz».` is shown.
 *   3. With `xyz` still typed, click «Vaciar estantería» → only
 *      `Todavía no hay libros en la estantería.` is shown — not the "sin resultados" message.
 *   4. Click «Restaurar estantería» and clear the search box → the five titles are back.
 * Write what the browser actually did, step by step, in `<!-- Observed: … -->` at the end of the
 * template. In a comment, say in Spanish why `@empty` alone cannot tell the two cases apart.
 *
 * Answer files: empty-states.html
 */
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { BOOKS, Book } from '../books';

@Component({
  selector: 'app-empty-states',
  templateUrl: './empty-states.html',
  styleUrl: './empty-states.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStates {
  protected readonly books = signal<readonly Book[]>(BOOKS);
  protected readonly query = signal('');
  protected readonly visible = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.books().filter((book) => book.title.toLowerCase().includes(query));
  });

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected emptyShelf(): void {
    this.books.set([]);
  }

  protected restoreShelf(): void {
    this.books.set(BOOKS);
  }
}
