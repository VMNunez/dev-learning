# Code principles

Three principles that come up in every code review at a consultancy. They are not rules to memorise — they are names for instincts you probably already have.

---

## DRY — Don't Repeat Yourself

> Every piece of knowledge should have a single, authoritative representation in the system.

If the same logic appears in two places, a future change requires updating both — and one will be missed.

**In Angular:**
```typescript
// ❌ Repeated in every component
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') ?? 'null');

// ✅ Once, in AuthService
getToken() { return localStorage.getItem('token'); }
getCurrentUser() { return JSON.parse(localStorage.getItem('user') ?? 'null'); }
```

**In Spring Boot:**
```java
// ❌ Duplicate validation in every service method
if (email == null || email.isBlank()) throw new BadRequestException("Email required");

// ✅ Once, in the DTO with @NotBlank — @Valid handles it everywhere
public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
```

> DRY is about **knowledge**, not just code. Two similar-looking lines that express different ideas are not a DRY violation. Two identical lines that express the same idea are.

---

## KISS — Keep It Simple, Stupid

> The simplest solution that works is the right one.

Unnecessary complexity makes code harder to read, harder to test, and harder to change. If you can solve a problem in 5 lines, do not solve it in 20.

**In Angular:**
```typescript
// ❌ Overcomplicated
getFilteredEmployees(): Employee[] {
  const result: Employee[] = [];
  for (let i = 0; i < this.employees().length; i++) {
    if (this.employees()[i].department === this.selectedDept()) {
      result.push(this.employees()[i]);
    }
  }
  return result;
}

// ✅ Simple
filteredEmployees = computed(() =>
  this.employees().filter(e => e.department === this.selectedDept())
);
```

**In Spring Boot:**
If `@PreAuthorize("hasRole('ADMIN')")` solves the problem, do not build a custom permission system.

---

## YAGNI — You Ain't Gonna Need It

> Do not add functionality until it is actually needed.

Developers often build features "for the future" that are never used. Every extra feature is code to maintain, test, and debug.

**Examples:**
- Adding a `configurable` flag to a component that only ever has one configuration
- Building a plugin system for a feature that has one implementation
- Adding pagination to an endpoint that returns 10 records

**In this project:** adding Docker, tests, and a clean architecture is in scope. Building a notification system, multi-language support, or an admin audit log before they are needed is YAGNI.

---

## How they relate to SOLID

SOLID, DRY, KISS, and YAGNI address different levels of the same problem:

| Principle | Addresses |
|-----------|-----------|
| SOLID | How to structure classes and their relationships |
| DRY | How to avoid duplicating knowledge across the codebase |
| KISS | How to keep individual solutions simple |
| YAGNI | How to avoid building things you do not need yet |

A codebase can follow SOLID perfectly and still violate DRY, KISS, and YAGNI. They complement each other.
