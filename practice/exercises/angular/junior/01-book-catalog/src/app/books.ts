// Given data for every exercise of this batch. Not an answer file — do not edit.

export interface Book {
  readonly id: number;
  readonly title: string;
  readonly author: string;
}

export const BOOKS: readonly Book[] = [
  { id: 1, title: 'El Hobbit', author: 'J. R. R. Tolkien' },
  { id: 2, title: 'Dune', author: 'Frank Herbert' },
  { id: 3, title: 'Fundación', author: 'Isaac Asimov' },
  { id: 4, title: 'Harry Potter y la piedra filosofal', author: 'J. K. Rowling' },
  { id: 5, title: 'El nombre del viento', author: 'Patrick Rothfuss' },
];
