import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { ApiError, apiErrorMessage, placeFieldErrors } from './api-error';

function apiError(body: Partial<ApiError>, status = 400): HttpErrorResponse {
  return new HttpErrorResponse({
    status,
    error: { timestamp: '', status, error: 'Bad Request', message: 'Validation failed', ...body },
  });
}

describe('apiErrorMessage', () => {
  it('returns the server message when the body is an ApiError', () => {
    expect(apiErrorMessage(apiError({ message: 'Invalid email or password' }, 401), 'x')).toBe(
      'Invalid email or password',
    );
  });

  it('returns the fallback when the server sent no ApiError', () => {
    const offline = new HttpErrorResponse({ status: 0, error: new ProgressEvent('error') });

    expect(apiErrorMessage(offline, 'Could not reach the server')).toBe(
      'Could not reach the server',
    );
  });
});

describe('placeFieldErrors', () => {
  it('puts each listed field error under its control and reports it placed one', () => {
    const controls = { hours: new FormControl(1), description: new FormControl('') };
    const error = apiError({ fieldErrors: { hours: ['Hours must be at most 24'] } });

    expect(placeFieldErrors(error, controls, ['hours', 'description'])).toBe(true);
    expect(controls.hours.getError('server')).toBe('Hours must be at most 24');
    expect(controls.description.hasError('server')).toBe(false);
  });

  it('ignores a field the form did not list and reports nothing placed', () => {
    const controls = { hours: new FormControl(1) };
    const error = apiError({ fieldErrors: { userId: ['Unknown user'] } });

    expect(placeFieldErrors(error, controls, ['hours'])).toBe(false);
    expect(controls.hours.hasError('server')).toBe(false);
  });

  it('reports nothing placed when the body carries no fieldErrors', () => {
    const controls = { hours: new FormControl(1) };

    expect(placeFieldErrors(apiError({}, 409), controls, ['hours'])).toBe(false);
  });
});
