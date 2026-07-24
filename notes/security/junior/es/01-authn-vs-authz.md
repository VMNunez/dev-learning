# Autenticación vs Autorización

Docs: [Spring Security — Authentication](https://docs.spring.io/spring-security/reference/features/authentication/index.html) · [Spring Security — Authorization](https://docs.spring.io/spring-security/reference/features/authorization/index.html)

---

Dos conceptos que siempre van juntos pero hacen cosas completamente distintas.

**Autenticación (AuthN)** — "¿Quién eres?" Demostrar tu identidad. Aportas credenciales (email + contraseña), el sistema las verifica y emite un token.

**Autorización (AuthZ)** — "¿Qué puedes hacer?" Comprobar tus permisos. El sistema ya sabe quién eres — ahora decide si tienes permiso para realizar esta acción concreta.

La autenticación siempre ocurre primero. No puedes comprobar los permisos de alguien cuya identidad todavía no conoces.

```
1. POST /api/auth/login → email + password verificados → JWT emitido      ← Autenticación
2. GET  /api/projects   → JWT validado → rol comprobado → acceso concedido ← Autorización
```

---

## Cómo encaja esto en TimeTrack

### Autenticación

`JwtFilter` se ejecuta en cada request y valida el token:

```
JwtFilter: ¿hay un JWT válido en la cabecera Authorization?
→ Sí → extrae el email, carga el usuario, establece SecurityContextHolder
→ No → no hace nada (SecurityFilterChain bloqueará las rutas protegidas)
```

Esto es autenticación — confirmar que el JWT fue emitido por este servidor y que no ha expirado ni ha sido manipulado.

### Autorización

Después de la autenticación, Spring Security comprueba si el usuario autenticado puede acceder a ese endpoint concreto:

**Backend** — `@PreAuthorize` en el endpoint:
```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) { ... }
```

**Frontend** — route guards:
```typescript
canActivate: [authGuard, adminGuard]
```

`authGuard` comprueba que el usuario ha iniciado sesión (autenticación). `adminGuard` comprueba que el usuario tiene el rol de administrador (autorización).

---

## 401 vs 403 — la señal HTTP

| Código | Significado | Cuándo |
|------|---------|------|
| `401 Unauthorized` | No autenticado | Sin token, token expirado, token inválido |
| `403 Forbidden` | Autenticado pero no autorizado | Token válido, pero rol incorrecto o permisos insuficientes |

El nombre confunde — "Unauthorized" en realidad significa "no autenticado". Pero así es el estándar y cualquier entrevistador espera que lo sepas.

> Spring Security devuelve 403 por defecto en ambos casos, a menos que configures un `AuthenticationEntryPoint` personalizado. En TimeTrack, `GlobalExceptionHandler` gestiona esta distinción.

---

## Errores de autenticación genéricos — prevenir la enumeración de usuarios

Cuando el login falla, devuelve **un único mensaje genérico** — "Invalid email or password" — nunca "email no encontrado" o "contraseña incorrecta". Un mensaje específico permite que un atacante enumere tus usuarios: prueba un email, y si el error dice "contraseña incorrecta" en vez de "email no encontrado", ya sabe que ese email está registrado. Repite el proceso con una lista de emails y termina con una lista de cuentas reales a las que atacar.

Por eso Spring Security lanza una única `BadCredentialsException` para ambos casos — email incorrecto *o* contraseña incorrecta — y por eso `GlobalExceptionHandler` la traduce a un único 401 con un cuerpo genérico:

```java
@ExceptionHandler(BadCredentialsException.class)
public ResponseEntity<Map<String, String>> handle(BadCredentialsException e) {
    return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
}
```

> Respuesta de entrevista a "¿por qué un mensaje genérico?": para prevenir la **enumeración de usuarios** — filtrar qué emails están registrados.

---

## La diferencia clave en una frase

La autenticación demuestra que eres quien dices ser. La autorización decide qué se te permite hacer una vez que tu identidad ya está confirmada.
