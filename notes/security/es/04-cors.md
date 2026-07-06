# CORS — Cross-Origin Resource Sharing

Docs: [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) · [Spring — CORS](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)

---

## ¿Qué es un origin?

Un origin es la combinación de **protocolo + dominio + puerto**.

```
http://localhost:4200   ← servidor de desarrollo de Angular
http://localhost:8080   ← API de Spring Boot
```

Son dos origins distintos — puerto diferente. Cualquier request de `4200` a `8080` es una **petición cross-origin**.

---

## ¿Por qué el navegador bloquea las peticiones cross-origin?

El navegador aplica la **Same-Origin Policy** — por defecto, el JavaScript que corre en un origin no puede leer respuestas de un origin distinto. Esto protege al usuario: un script malicioso en `evil.com` no puede hacer peticiones a `tu-banco.com` y leer los datos de tu cuenta.

CORS es el mecanismo que permite a los servidores **decidir explícitamente** qué peticiones cross-origin permiten. Sin las cabeceras CORS en la respuesta, el navegador la bloquea.

> El servidor siempre recibe la petición y la procesa. El navegador bloquea la **respuesta** para que no llegue al JavaScript. Por eso puedes llamar a la API desde Postman (no hay navegador, no hay Same-Origin Policy) pero no directamente desde Angular sin configurar CORS.

---

## Cómo funciona CORS

Para una petición simple (GET sin cabeceras especiales), el navegador envía la petición y comprueba si la respuesta trae la cabecera `Access-Control-Allow-Origin`:

```
Angular (4200) → GET /api/projects → Spring Boot (8080)
Spring Boot → Access-Control-Allow-Origin: http://localhost:4200
Navegador → permitido ✓
```

Para una **petición preflight** — cualquier POST con body JSON, o cualquier petición con cabecera `Authorization` — el navegador primero envía una petición `OPTIONS` para pedir permiso:

```
Navegador → OPTIONS /api/projects (preflight)
Spring Boot → Access-Control-Allow-Origin: http://localhost:4200
             Access-Control-Allow-Methods: GET, POST, PUT, DELETE
             Access-Control-Allow-Headers: Authorization, Content-Type
Navegador → ok, ahora envío la petición real
Navegador → POST /api/projects
Spring Boot → 200 OK
```

La cabecera `Authorization` dispara un preflight — por eso cada llamada protegida de la API en Angular genera primero una petición OPTIONS en la pestaña Network.

---

## Cómo se configura en Spring Boot

En TimeTrack, CORS se configura en `SecurityConfig`:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(request -> {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        return config;
    }));
    // ...
}
```

Sin esto, cada petición de Angular queda bloqueada por el navegador con:
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 
'http://localhost:4200' has been blocked by CORS policy.
```

---

## Puntos clave para entrevistas

- CORS es una medida de seguridad del navegador — no afecta a Postman ni a llamadas servidor-a-servidor
- El navegador bloquea la **respuesta**, no la petición — el servidor ya la procesó
- La cabecera `Authorization` dispara un preflight OPTIONS incluso para un GET
- Spring Boot debe permitir explícitamente el origin, los métodos y las cabeceras de Angular
- En producción, sustituye `http://localhost:4200` por el dominio real del frontend
