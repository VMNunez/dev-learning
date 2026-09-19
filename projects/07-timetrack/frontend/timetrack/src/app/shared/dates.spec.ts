import { fromIsoDate, recentMonths, toIsoDate, toIsoMonth } from './dates';

describe('dates', () => {
  it('formats a local date as YYYY-MM-DD without shifting it through UTC', () => {
    expect(toIsoDate(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });

  it('parses YYYY-MM-DD back to the same local calendar day', () => {
    const date = fromIsoDate('2026-03-09');

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(9);
  });

  it('formats the month as YYYY-MM', () => {
    expect(toIsoMonth(new Date(2026, 8, 18))).toBe('2026-09');
  });

  it('lists recent months newest first, crossing the year boundary', () => {
    const months = recentMonths(new Date(2026, 1, 10), 3);

    expect(months.map((month) => month.value)).toEqual(['2026-02', '2026-01', '2025-12']);
    expect(months[0].label).toBe('February 2026');
  });
});
