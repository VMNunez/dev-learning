# Hash vs encryption

Docs: [OWASP — Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) · [Spring Security — PasswordEncoder](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)

---

Both produce unreadable output from readable input, but they work in opposite ways.

| | Hash | Encryption |
|-|------|------------|
| Reversible? | No | Yes (with the key) |
| Purpose | Verify without storing the original | Store and retrieve the original |
| Example | BCrypt for passwords | AES for encrypted messages |

---

## Hashing — one way

```
"password123"  →  BCrypt  →  "$2a$10$xyz..."
```

You cannot go back from the hash to the original. To verify a password, you hash what the user typed and compare the results — you never decrypt.

This is why Spring Security uses BCrypt for passwords. If the database is stolen, the attacker has hashes — not passwords. To crack them, they have to guess millions of passwords and hash each one to find a match.

In TimeTrack, `PasswordEncoder` is a Spring bean that wraps BCrypt:

```java
// On register — store the hash, never the plain password:
user.setPassword(passwordEncoder.encode(request.getPassword()));

// On login — DaoAuthenticationProvider calls this automatically:
BCrypt.matches(rawPassword, userDetails.getPassword())
```

---

## Encryption — two way

```
"hello"  →  AES + key  →  "Sd9f8k..."
"Sd9f8k..."  →  AES + key  →  "hello"
```

You can recover the original if you have the key. Used when you need to store data and retrieve it later — like encrypted messages, credit card numbers, or files.

---

## How this maps to TimeTrack

- **Passwords** → hashed with BCrypt. Stored in the database as `$2a$10$...`. Never stored in plain text.
- **JWT secret** → stored as Base64 in `application.properties`. This is a **signing key** — it is not a hash, and it is not encrypted data. It is a secret key used to sign tokens.
- **JWT payload** → Base64-encoded (readable by anyone). The **signature** is an HMAC hash — it proves the payload was not tampered with, but it does not hide the content.

> The common confusion: Base64 is not encryption. A JWT is not encrypted. Anyone can read a JWT payload — the signature only proves it was not modified. If you need to hide the payload content, you need JWE (JSON Web Encryption), which is a different standard.
