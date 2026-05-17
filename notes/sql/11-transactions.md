# Transactions

Official docs: [PostgreSQL Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)

---

Imagine you are building a money transfer: subtract €100 from account A, then add €100 to account B. What happens if the server crashes after the first statement? Account A loses €100 and account B never receives it. The data is now corrupted.

Transactions solve this. All statements in a transaction are treated as a single unit — either all succeed, or none of them do.

---

## Basic syntax

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

- `BEGIN` — starts the transaction
- `COMMIT` — saves all changes permanently
- `ROLLBACK` — undoes all changes since `BEGIN`

If anything goes wrong, you roll back:

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- Something went wrong...
ROLLBACK;  -- account A balance is restored, as if nothing happened
```

---

## ACID properties

ACID describes the four guarantees that a database transaction must provide:

| Property | Meaning |
|----------|---------|
| **Atomicity** | All statements succeed or none do — no partial results |
| **Consistency** | The database moves from one valid state to another — constraints are never violated mid-transaction |
| **Isolation** | Concurrent transactions do not interfere with each other — they behave as if they ran one at a time |
| **Durability** | Once committed, the data survives a crash or power failure |

> Atomicity and Durability are the most important for a junior to know. Isolation is what causes "concurrent transaction" bugs in production — worth understanding once you get to Spring Boot.

---

## Transactions in Spring Boot

In Spring Boot you rarely write `BEGIN` / `COMMIT` manually. The `@Transactional` annotation does it for you:

```java
@Transactional
public void transferMoney(int fromId, int toId, double amount) {
    accountRepo.debit(fromId, amount);
    accountRepo.credit(toId, amount);
    // If credit() throws, Spring automatically rolls back the debit
}
```

If the method throws an unchecked exception (a `RuntimeException` or subclass), Spring rolls back the entire transaction. This is the same guarantee as writing `BEGIN` / `ROLLBACK` manually.

> This is why knowing SQL transactions matters for Spring Boot — `@Transactional` is just a wrapper around the same database mechanism. When something goes wrong in a service method, you need to understand why the data was rolled back (or why it was not).

---

## SAVEPOINT — partial rollback

Inside a transaction, you can set a named checkpoint. If something goes wrong after the savepoint, you roll back only to that point — not all the way to the start.

```sql
BEGIN;

INSERT INTO orders (customer_id) VALUES (5);
SAVEPOINT order_created;

INSERT INTO order_items (order_id, book_id, quantity) VALUES (1, 3, 2);
-- Something failed with the item...
ROLLBACK TO order_created;  -- the order is kept, only the item is undone

COMMIT;
```

> SAVEPOINTs are rarely used directly. They appear in some ORM frameworks (like Hibernate) internally. Good to know they exist.

---

## Quick reference

| Command | What it does |
|---------|-------------|
| `BEGIN` | Start a transaction |
| `COMMIT` | Save all changes permanently |
| `ROLLBACK` | Undo all changes since BEGIN |
| `SAVEPOINT name` | Mark a checkpoint inside a transaction |
| `ROLLBACK TO name` | Undo changes since the named savepoint |
