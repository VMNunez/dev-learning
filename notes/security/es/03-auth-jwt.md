# Autenticación — JWT

JWT (JSON Web Token) es el estándar de autenticación en APIs REST. Es stateless — el servidor no guarda sesiones. El propio token contiene toda la información necesaria para verificar al usuario.

Docs oficiales: https://jwt.io/introduction

---

## El problema que resuelve JWT

HTTP es stateless — cada request es independiente. Sin autenticación, el servidor no tiene forma de saber quién hace una petición. La solución clásica eran las sesiones: el servidor guarda al usuario logueado y le entrega al cliente una cookie con un ID de sesión. El problema: el servidor debe guardar estado, lo que complica escalar.

JWT resuelve esto metiendo la información del usuario dentro del propio token. El servidor verifica la firma del token — sin necesidad de consultar la base de datos.

---

## Estructura de un JWT

Un JWT son tres partes codificadas en Base64 separadas por puntos:

```
header.payload.signature
```

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2aWN0b3JAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MTcwMDAwMDB9.abc123signature
```

| Parte | Contiene |
| --- | --- |
| **Header** | Algoritmo usado para firmar (`HS256`) |
| **Payload** | Claims — datos del usuario: `sub` (email), `role`, `exp` (fecha de expiración) |
| **Signature** | Hash del header + payload usando una clave secreta — demuestra que el token es genuino |

El payload está codificado en Base64, no cifrado — cualquiera puede leerlo. Nunca metas datos sensibles (contraseñas, números de tarjeta) dentro de un JWT.

---

## Cómo la firma demuestra que el token es genuino

La firma es un **HMAC** — un hash del header + payload calculado con la clave secreta del servidor. La verificación es simple: cuando llega un token, el servidor recalcula el HMAC del header + payload recibidos usando su propio secreto, y lo compara con la firma que trae el token. Si coinciden, el token es genuino y no ha sido tocado.

Por eso **no puedes falsificar un JWT sin el secreto**: cambia un solo carácter del payload (`"role":"USER"` → `"role":"ADMIN"`) y el HMAC recalculado ya no coincide con la firma — el servidor lo rechaza. Como tú no tienes el secreto, tampoco puedes calcular una firma nueva y válida para tu payload manipulado. No hace falta consultar la base de datos; el secreto por sí solo demuestra la autenticidad.

---

## Flujo de autenticación

```
1. El usuario hace login
   Angular  →  POST /api/auth/login { email, password }  →  Spring Boot

2. El servidor valida las credenciales
   Spring Boot consulta la BD → genera JWT → devuelve el token

3. Angular guarda el token
   localStorage.setItem('token', jwt)

4. Cada request siguiente incluye el token
   El interceptor de Angular añade: Authorization: Bearer <token>

5. El servidor valida en cada request
   Spring Boot lee el token → verifica la firma → comprueba la expiración → lee el rol
   No hace falta consultar la BD

6. El token expira
   El usuario debe volver a hacer login (o usar un refresh token)
```

---

## Lado de Angular

El interceptor añade el token a cada request saliente automáticamente:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(authReq);
};
```

El token se lee de localStorage en cada request — por eso el HR portal persiste el usuario en localStorage.

---

## Lado de Spring Boot (nivel de familiaridad)

Spring Boot usa un filtro que intercepta cada request antes de que llegue al controller:

```
Request → JWT Filter → valida el token → extrae el usuario → Controller
```

Si el token falta, es inválido o ha expirado, el filtro devuelve `401 Unauthorized` antes de que el controller se ejecute.

Librerías usadas en producción: `spring-security` + `jjwt` (librería Java para JWT).

---

## Dónde guardar el token

| Almacenamiento | Ventajas | Inconvenientes |
| --- | --- | --- |
| `localStorage` | Simple, persiste entre pestañas | Vulnerable a XSS — JavaScript puede leerlo |
| `sessionStorage` | Se borra al cerrar la pestaña | No se comparte entre pestañas |
| `httpOnly cookie` | JavaScript no puede leerlo — más seguro | Requiere protección CSRF |

Para proyectos de aprendizaje, `localStorage` es el estándar. En producción, las `httpOnly cookies` son más seguras. Las consultoras españolas que construyen herramientas internas usan mayoritariamente `localStorage` con una prevención de XSS adecuada.

---

## Expiración del token y refresh tokens

Un JWT tiene un tiempo de expiración (claim `exp`). Cuando expira, el usuario debe volver a hacer login.

**Patrón de refresh token** — el servidor emite dos tokens:
- **Access token** — vida corta (15 min, 1 hora) — se usa en cada request
- **Refresh token** — vida larga (7 días, 30 días) — se usa solo para obtener un nuevo access token

Cuando el access token expira, el cliente envía el refresh token para obtener uno nuevo sin obligar al usuario a volver a loguearse.

Para proyectos junior, un único token con una expiración más larga es más simple y aceptable.

---

## Puntos clave para entrevistas

- JWT es **stateless** — no se guarda ninguna sesión en el servidor
- La **firma** demuestra que el token no fue manipulado
- El **payload es legible** — nunca metas contraseñas ahí
- El **interceptor** de Angular añade el token a cada request automáticamente
- **401** = no autenticado (sin token o inválido), **403** = autenticado pero no autorizado
- En el HR portal, la autenticación está **simulada** — el interceptor añade el token pero `json-server` no lo valida
