// Given spec — not an answer file. Do not edit: an edited spec is not evidence.
import { TestBed } from '@angular/core/testing';

import { BookFilter } from './book-filter';

describe('Exercise 2 — BookFilter', () => {
  let filter: BookFilter;

  const titles = () => filter.visible().map((book) => book.title);

  beforeEach(() => {
    filter = TestBed.inject(BookFilter);
  });

  it('shows every book while the query is empty or blank', () => {
    expect(titles().length).toBe(5);

    filter.query.set('   ');
    expect(titles().length).toBe(5);
  });

  it('matches titles ignoring case and the spaces around the query', () => {
    filter.query.set('  HAR ');
    expect(titles()).toEqual(['Harry Potter y la piedra filosofal']);

    filter.query.set('el');
    expect(titles()).toEqual(['El Hobbit', 'El nombre del viento']);
  });

  it('keeps the summary in step with the query, with no other call', () => {
    expect(filter.summary()).toBe('5 de 5 libros');

    filter.query.set('dune');
    expect(filter.summary()).toBe('1 de 5 libros');

    filter.query.set('xyz');
    expect(titles()).toEqual([]);
    expect(filter.summary()).toBe('0 de 5 libros');
  });
});
