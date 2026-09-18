export interface MonthOption {
  value: string;
  label: string;
}

const MONTH_LABEL = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoMonth(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function recentMonths(today: Date, count: number): MonthOption[] {
  return Array.from({ length: count }, (_, offset) => {
    const month = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    return { value: toIsoMonth(month), label: MONTH_LABEL.format(month) };
  });
}
