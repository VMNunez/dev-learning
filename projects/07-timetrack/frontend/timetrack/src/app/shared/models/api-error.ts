import { HttpErrorResponse } from '@angular/common/http';

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
