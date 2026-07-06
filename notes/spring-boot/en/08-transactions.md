# Transactions — @Transactional

> 📖 [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring)
> 📖 [Spring Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction.html)

## What is a transaction

A transaction is a group of database operations that either all succeed or all fail together. Without transactions, a partial failure leaves the database in an inconsistent state:

```
// Without @Transactional — if step 2 fails, step 1 is already committed
1. Save the new transaction record  ✓ (saved to DB)
2. Update the account balance       ✗ (throws an exception)
→ The transaction record exists but the balance is wrong
```

`@Transactional` wraps the method in a database transaction. If any exception is thrown, everything done inside the method is rolled back automatically.

---

## Where to put @Transactional

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html → read: "Using @Transactional"

On **service methods** that do more than one database operation. Not on controllers (they do not touch the database directly). Not on repository methods (Spring Data JPA already wraps each repository call in its own transaction).

```java
@Service
public class TransactionService {

    @Transactional
    public TransactionDTO create(TransactionCreateDTO dto) {
        // Step 1 — save the transaction record
        Transaction t = new Transaction(dto.amount(), dto.description(), dto.date());
        repository.save(t);

        // Step 2 — update the account balance (separate table)
        accountService.updateBalance(dto.userId(), dto.amount());

        // If step 2 throws, step 1 is rolled back — no orphaned records
        return mapper.toDto(t);
    }
}
```

---

## Read-only transactions — @Transactional(readOnly = true)

Docs: https://www.baeldung.com/transaction-configuration-with-jpa-and-spring → read: the section on `readOnly = true` and its performance effect

For methods that only read data, mark them as read-only. Hibernate skips dirty-checking (comparing entity state to detect changes) at the end of the transaction, which makes reads faster.

```java
@Transactional(readOnly = true)
public List<TransactionDTO> getAll() {
    return repository.findAll().stream()
        .map(mapper::toDto)
        .collect(Collectors.toList());
}
```

Good practice: annotate every service method. Write methods get `@Transactional`, read methods get `@Transactional(readOnly = true)`.

---

## @Transactional does not work on private methods

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html → read: the note on method visibility and self-invocation

`@Transactional` works through a Spring proxy — a wrapper that intercepts the method call and manages the transaction. If the method is private, the proxy cannot intercept it. The annotation is silently ignored with no error.

```java
// Wrong — @Transactional on a private method has no effect
@Transactional
private void saveAndUpdateBalance(Transaction t) { ... }

// Correct — public so the proxy can intercept it
@Transactional
public void saveAndUpdateBalance(Transaction t) { ... }
```

> **Same root cause, sneakier form — calling it from inside the same class.** Even a `public @Transactional` method loses its transaction if you call it *from another method in the same class* instead of going through Spring:
>
> ```java
> @Service
> public class TransactionService {
>
>     public void createWithBalance(TransactionCreateDTO dto) {
>         save(dto);   // ← self-call: bypasses the proxy entirely, @Transactional on save() never runs
>     }
>
>     @Transactional
>     public void save(TransactionCreateDTO dto) { ... }
> }
> ```
>
> Here's why: when Spring creates the `TransactionService` bean, what other classes actually get injected is not your raw class — it's a **proxy**, a generated subclass (or JDK dynamic proxy) that wraps your class and adds the transaction logic around each method call. Calls that arrive *from outside* the bean (e.g. a controller calling `transactionService.createWithBalance(...)`) go through this proxy first, so the transaction logic runs. But `save(dto)` above is called as `this.save(dto)` from *inside* the same object — Java resolves that call directly against the real class, never touching the proxy that wraps it. No proxy in the path means no transaction, exactly like the private-method case, just harder to spot because the method itself is `public` and looks correctly annotated. There is no way to fix this from inside the same class — the standard fix is to move `save()` into a different `@Service` and inject that bean, so the call is forced to go through its proxy.

---

## LazyInitializationException — the most common JPA mistake

Docs: https://www.baeldung.com/hibernate-lazy-initialization-exception

When you access a `FetchType.LAZY` relationship after the Hibernate session is closed, you get a `LazyInitializationException`. The session closes at the end of the `@Transactional` method:

```java
// Service — session is open while @Transactional is running
@Transactional(readOnly = true)
public Transaction getById(Long id) {
    return repository.findById(id).orElseThrow(...);
}

// Controller — session is already closed here
Transaction t = service.getById(1L);
t.getUser().getName();  // LazyInitializationException — session is gone, cannot run the extra query
```

**Two fixes:**

**Fix 1 — convert to DTO inside the transaction** (the correct approach):

```java
@Transactional(readOnly = true)
public TransactionDTO getById(Long id) {
    Transaction t = repository.findById(id).orElseThrow(...);
    // Access user.getName() here — the session is still open
    return new TransactionDTO(t.getId(), t.getAmount(), t.getUser().getName());
}
```

**Fix 2 — use JOIN FETCH** when you need the relationship loaded with the query:

```java
@Query("SELECT t FROM Transaction t JOIN FETCH t.user WHERE t.id = :id")
Optional<Transaction> findByIdWithUser(@Param("id") Long id);
```

Using DTOs is the better fix — it keeps the controller layer clean and prevents the entity from leaking to the HTTP layer (see [02-rest-controllers.md](02-rest-controllers.md) on the DTO pattern).

---

## Transaction propagation — REQUIRED (the default)

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html

Propagation controls what happens when a `@Transactional` method calls another `@Transactional` method.

| Propagation | Behaviour |
|-----------|----------|
| `REQUIRED` (default) | Join the existing transaction if there is one; create a new one if not |
| `REQUIRES_NEW` | Always start a new transaction; suspend the existing one |
| `SUPPORTS` | Join if there is one; run without a transaction if not |

In most cases you never set propagation explicitly — the default `REQUIRED` is correct. The only case where you need `REQUIRES_NEW` is when you want an operation to commit even if the outer transaction rolls back. Example: writing to an audit log when a business operation fails — you still want the audit entry, even though the main transaction was rolled back.

---

## Common mistake — catching the exception inside the method

Docs: https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html → read: "Rolling Back a Declarative Transaction"

`@Transactional` rolls back on unchecked exceptions (extending `RuntimeException`) by default. If you catch the exception inside the method and do not re-throw it, Spring does not see it and does not roll back:

```java
// Wrong — the catch swallows the exception, Spring sees no error, no rollback happens
@Transactional
public void createWithBalance(TransactionCreateDTO dto) {
    repository.save(mapper.toEntity(dto));
    try {
        accountService.updateBalance(dto.userId(), dto.amount());
    } catch (Exception e) {
        log.error("Balance update failed", e);  // exception swallowed — no rollback!
    }
}

// Correct — let exceptions propagate so @Transactional can roll back
@Transactional
public void createWithBalance(TransactionCreateDTO dto) {
    repository.save(mapper.toEntity(dto));
    accountService.updateBalance(dto.userId(), dto.amount());
    // exception propagates → @ControllerAdvice catches it → 500 response → transaction rolled back
}
```
