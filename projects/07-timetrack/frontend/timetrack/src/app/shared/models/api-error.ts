import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<ApiError>;
  return typeof candidate.status === 'number' && typeof candidate.message === 'string';
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse && isApiError(error.error)) {
    return error.error.message;
  }
  return fallback;
}

export function placeFieldErrors<K extends string>(
  error: unknown,
  controls: Record<K, AbstractControl>,
  fields: readonly K[],
): boolean {
  const fieldErrors =
    error instanceof HttpErrorResponse && isApiError(error.error)
      ? error.error.fieldErrors
      : undefined;
  let placed = false;

  for (const field of fields) {
    const message = fieldErrors?.[field]?.[0];
    if (message) {
      controls[field].setErrors({ server: message });
      placed = true;
    }
  }

  return placed;
}
