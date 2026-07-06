# Angular — Test 04: Login Form

**Time limit:** 60 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

You are building the login screen for a web app. The form must validate inputs, call the auth service, and handle both success and error responses correctly.

## What to build

1. A `LoginComponent` with a reactive form containing:
   - `email` — required, valid email format
   - `password` — required, minimum 8 characters
2. Show validation error messages below each field on submit attempt
3. An `AuthService` with a `login(email, password)` method that calls `POST /api/auth/login`
4. Disable the submit button while the request is loading
5. On success (the API returns `{ token: string }`): store the token in `localStorage` and navigate to `/dashboard`
6. On 401 error: show "Invalid email or password"
7. On any other error: show "Something went wrong. Please try again."

## Interfaces and mock

```typescript
export interface LoginResponse {
  token: string;
}
```

Simulate responses in the service:

```typescript
// Success
return of({ token: 'fake-jwt-token' }).pipe(delay(800));

// 401 error
return throwError(() => ({ status: 401 })).pipe(delay(800));
```

## Evaluation — what a good solution looks like

- [ ] Both validators are correct (email format, min length on password)
- [ ] Errors appear on submit, not while typing
- [ ] Button is disabled during the request
- [ ] Token is stored in localStorage on success
- [ ] Navigation to /dashboard happens after success
- [ ] 401 and generic errors show different messages
- [ ] Form does not submit again while a request is already in flight

## Bonus (if done before time)

- Add a show/hide toggle for the password field
- After a failed login, clear only the password field (not the email)
