# Hash vs cifrado

Docs: [OWASP — Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) · [Spring Security — PasswordEncoder](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)

---

Ambos producen una salida ilegible a partir de una entrada legible, pero funcionan en direcciones opuestas.

| | Hash | Cifrado |
|-|------|------------|
| ¿Reversible? | No | Sí (con la clave) |
| Propósito | Verificar sin guardar el original | Guardar y recuperar el original |
| Ejemplo | BCrypt para contraseñas | AES para mensajes cifrados |

---

## Hashing — de un solo sentido

```
"password123"  →  BCrypt  →  "$2a$10$xyz..."
```

No puedes volver del hash al original. Para verificar una contraseña, hasheas lo que el usuario escribió y comparas los resultados — nunca descifras nada.

Por eso Spring Security usa BCrypt para las contraseñas. Si roban la base de datos, el atacante tiene hashes — no contraseñas. Para descifrarlas tendría que probar millones de contraseñas y hashear cada una hasta encontrar una coincidencia.

En TimeTrack, `PasswordEncoder` es un bean de Spring que envuelve BCrypt:

```java
// Al registrar — guarda el hash, nunca la contraseña en texto plano:
user.setPassword(passwordEncoder.encode(request.getPassword()));

// Al hacer login — DaoAuthenticationProvider llama esto automáticamente:
BCrypt.matches(rawPassword, userDetails.getPassword())
```

---

## Salting — por qué dos contraseñas idénticas dan hashes distintos

Un hash simple tiene una debilidad: la misma entrada siempre produce la misma salida. Si dos usuarios eligen `password123`, sus hashes guardados son idénticos — y un atacante puede precalcular hashes de contraseñas comunes (una "rainbow table") y compararlos en bloque.

Un **salt** es un valor aleatorio que se añade a la contraseña antes de hashear. Cada usuario recibe un salt distinto, así que contraseñas idénticas producen hashes completamente distintos:

```
"password123" + salt_A  →  BCrypt  →  "$2a$10$AAA..."
"password123" + salt_B  →  BCrypt  →  "$2a$10$BBB..."
```

Nunca gestionas el salt tú mismo — **BCrypt genera un salt aleatorio automáticamente y lo guarda dentro del propio string del hash** (forma parte de la salida `$2a$10$...`). Al hacer login, BCrypt vuelve a leer el salt desde el hash guardado para verificar la contraseña. Esta es otra razón por la que BCrypt es el estándar: el salting viene integrado, así que no puedes olvidarlo.

---

## Cifrado — de doble sentido

```
"hello"  →  AES + clave  →  "Sd9f8k..."
"Sd9f8k..."  →  AES + clave  →  "hello"
```

Puedes recuperar el original si tienes la clave. Se usa cuando necesitas guardar un dato y recuperarlo después — como mensajes cifrados, números de tarjeta de crédito o archivos.

---

## Cómo encaja esto en TimeTrack

- **Contraseñas** → hasheadas con BCrypt. Guardadas en la base de datos como `$2a$10$...`. Nunca en texto plano.
- **Secreto del JWT** → guardado en Base64 en `application.properties`. Esto es una **clave de firma** — no es un hash, y tampoco es un dato cifrado. Es una clave secreta usada para firmar tokens.
- **Payload del JWT** → codificado en Base64 (legible por cualquiera). La **firma** es un hash HMAC — demuestra que el payload no fue manipulado, pero no oculta su contenido.

> La confusión habitual: Base64 no es cifrado. Un JWT no está cifrado. Cualquiera puede leer el payload de un JWT — la firma solo demuestra que no fue modificado. Si necesitas ocultar el contenido del payload, necesitas JWE (JSON Web Encryption), que es un estándar distinto.
