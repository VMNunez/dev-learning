# Angular — Test 02: User Search

**Time limit:** 60 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

You are building a user search screen for an admin panel. As the user types, results appear automatically — no submit button.

## What to build

1. A `UserSearchComponent` with a text input
2. Search fires automatically after the user stops typing for **400ms** (debounce)
3. Do not search if the input is empty or has fewer than 2 characters
4. Do not fire duplicate requests if the value has not changed
5. A `UserService` with a `searchUsers(query: string)` method that calls `GET /api/users?q=query`
6. Show a loading spinner while the request is in flight
7. Show results in a list — each item shows: name, email, and role
8. Show "No users found" when the response is an empty array
9. Show an error message if the request fails

## Interfaces and mock

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
```

Mock response for the service (use `of([...]).pipe(delay(600))` to simulate):

```typescript
const MOCK_USERS: User[] = [
  { id: 1, name: 'Ana García', email: 'ana@example.com', role: 'ADMIN' },
  { id: 2, name: 'Carlos López', email: 'carlos@example.com', role: 'USER' },
  { id: 3, name: 'María Torres', email: 'maria@example.com', role: 'USER' },
];
```

## Evaluation — what a good solution looks like

- [ ] Debounce of 400ms is implemented with RxJS operators
- [ ] Requests are not fired for empty or very short inputs
- [ ] Duplicate requests are avoided
- [ ] Loading state is shown while the request is in flight
- [ ] Results list renders correctly
- [ ] Empty state and error state are both handled
- [ ] The service call is triggered reactively — no manual subscribe in a click handler

## Bonus (if done before time)

- Cancel the previous request if a new one starts before it finishes (`switchMap`)
- Highlight the search term inside the result names
