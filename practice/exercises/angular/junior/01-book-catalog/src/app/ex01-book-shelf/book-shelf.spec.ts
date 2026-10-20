// Given spec — not an answer file. Do not edit: an edited spec is not evidence.
import { TestBed } from '@angular/core/testing';

import { BookShelf } from './book-shelf';

describe('Exercise 1 — BookShelf', () => {
  let shelf: BookShelf;

  beforeEach(() => {
    shelf = TestBed.inject(BookShelf);
  });

  it('add appends the new book last, with the next id', () => {
    shelf.add('Neuromante', 'William Gibson');

    const books = shelf.books();
    expect(books.length).toBe(4);
    expect(books[3]).toEqual({ id: 4, title: 'Neuromante', author: 'William Gibson' });
  });

  it('add gives the signal a new array instead of changing the old one', () => {
    const before = shelf.books();

    shelf.add('Neuromante', 'William Gibson');

    expect(shelf.books()).not.toBe(before);
    expect(before.length).toBe(3);
  });

  it('remove takes only that book off and keeps the order; an unknown id changes nothing', () => {
    shelf.remove(2);
    shelf.remove(99);

    expect(shelf.books().map((book) => book.id)).toEqual([1, 3]);
  });

  it('the next id follows the highest id left on the shelf, and is 1 on an empty shelf', () => {
    shelf.remove(1);
    shelf.add('Neuromante', 'William Gibson');
    expect(shelf.books().map((book) => book.id)).toEqual([2, 3, 4]);

    shelf.remove(2);
    shelf.remove(3);
    shelf.remove(4);
    shelf.add('Solaris', 'Stanisław Lem');
    expect(shelf.books().map((book) => book.id)).toEqual([1]);
  });
});
