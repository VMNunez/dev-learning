/*
 * Exercise 4 — the detail page (interface)
 *
 * Concept: A route parameter is always text — `paramMap.get()` yields `string | null` whatever the
 * model declares, so converting it is a decision that has to agree with the identifier's real type.
 *
 * The route `/ex04/:id` shows this component. The template is given: it shows `book()` when it holds a
 * book and `Libro no encontrado.` otherwise, and its links move between books. Those links keep you on
 * the same route, so Angular REUSES this component instance: read the parameter through
 * `this.route.paramMap` (an Observable), not once.
 *
 * Task: replace the placeholder `book` below so that it holds the book whose `id` equals the `:id`
 * parameter, or `undefined` when no book matches. `Book.id` is a number and the parameter is text:
 * convert it before comparing. Something that is not a whole number (`abc`, `2.5`) matches no book.
 *
 * Manual check — run `ng serve lote-01` and open http://localhost:4200/ex04/2:
 *   1. `/ex04/2` shows `Dune` by Frank Herbert.
 *   2. Click the «Fundación» link → the page shows `Fundación` without a full page reload.
 *   3. Open `/ex04/abc` → `Libro no encontrado.`
 *   4. Open `/ex04/2.5` and then `/ex04/99` → `Libro no encontrado.` both times.
 * Write what the browser actually did, step by step, in `<!-- Observed: … -->` at the end of
 * `book-detail.html`. In a comment below your code, say in Spanish what would happen with a strict
 * `book.id === param` comparison and why.
 *
 * Answer files: book-detail.ts, book-detail.html (the `Observed:` comment only)
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { BOOKS } from '../books';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetail {
  private readonly route = inject(ActivatedRoute);
  protected readonly books = BOOKS;

  protected readonly book = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const id = Number(params.get('id'));
        return this.books.find((book) => book.id === id);
      }),
    ),
  );
}

// Qué pasaría con book.id === param y por qué:
// nunca encontraría ningún libro, ni siquiera con /ex04/2. El parámetro de la ruta siempre
// es texto ('2') y book.id es un número (2). === compara también el tipo, así que
// 2 === '2' da false. Por eso hay que convertir el parámetro con Number() antes de comparar.
