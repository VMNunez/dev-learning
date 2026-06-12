# HTTP Fundamentals

Docs: [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) · [MDN — Status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) · [MDN — Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

---

## HTTP methods

Every HTTP request has a method that describes the intent. REST APIs follow a convention where the method matches the operation.

| Method   | Intent                        | Has body? | Idempotent? |
| -------- | ----------------------------- | --------- | ----------- |
| `GET`    | Read a resource               | No        | Yes         |
| `POST`   | Create a new resource         | Yes       | No          |
| `PUT`    | Replace a resource completely | Yes       | Yes         |
| `PATCH`  | Update part of a resource     | Yes       | No          |
| `DELETE` | Delete a resource             | No        | Yes         |
| `OPTIONS`| Ask what methods are allowed  | No        | Yes         |

**Idempotent** — calling the same request multiple times produces the same result. `GET /users/1` always returns the same user. `DELETE /users/1` deletes it once — calling it again returns 404, but the state is the same.

`POST` is not idempotent — calling `POST /users` twice creates two users.

---

## Status codes

The server always responds with a 3-digit status code that tells the client what happened.

### 2xx — Success

| Code  | Name        | When                                         |
| ----- | ----------- | -------------------------------------------- |
| `200` | OK          | Request succeeded — body contains the result |
| `201` | Created     | Resource was created — used after POST       |
| `204` | No Content  | Success but no body — used after DELETE      |

### 4xx — Client error (the request is wrong)

| Code  | Name                  | When                                                       |
| ----- | --------------------- | ---------------------------------------------------------- |
| `400` | Bad Request           | Invalid input — validation failed, malformed JSON          |
| `401` | Unauthorized          | Not authenticated — no token, or token invalid             |
| `403` | Forbidden             | Authenticated but not allowed — wrong role                 |
| `404` | Not Found             | Resource does not exist                                    |
| `409` | Conflict              | Duplicate — email already registered, name already taken   |

> **401 vs 403:** 401 = "I don't know who you are". 403 = "I know who you are, but you can't do this". Both return 403 in Spring Security by default — you need a custom `AuthenticationEntryPoint` to return 401 for missing tokens.

### 5xx — Server error (the server failed)

| Code  | Name                  | When                                    |
| ----- | --------------------- | --------------------------------------- |
| `500` | Internal Server Error | Unhandled exception, bug in the code    |

---

## Key headers

Headers are metadata sent with every request or response.

### Request headers (Angular → Spring Boot)

| Header          | Example value                         | Purpose                                     |
| --------------- | ------------------------------------- | ------------------------------------------- |
| `Authorization` | `Bearer eyJhbGci...`                  | Sends the JWT token to authenticate         |
| `Content-Type`  | `application/json`                    | Tells the server the body is JSON           |
| `Accept`        | `application/json`                    | Tells the server what format you want back  |
| `Origin`        | `http://localhost:4200`               | Browser adds this automatically — used by CORS |

### Response headers (Spring Boot → Angular)

| Header                        | Example value                     | Purpose                                   |
| ----------------------------- | --------------------------------- | ----------------------------------------- |
| `Content-Type`                | `application/json; charset=UTF-8` | Body is JSON                              |
| `Access-Control-Allow-Origin` | `http://localhost:4200`           | Spring adds this when CORS is configured  |

---

## Where does the data go in a request?

There are three places to send data to a Spring Boot endpoint:

### Path parameter — part of the URL

```
GET /api/projects/5
                 ↑
          this is the path param — identifies a specific resource
```

```java
@GetMapping("/{id}")
public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) { ... }
```

### Query parameter — after `?` in the URL

```
GET /api/projects?status=active&page=1
                  ↑ key=value pairs — used for filtering, pagination, search
```

```java
@GetMapping
public List<ProjectResponse> getAll(@RequestParam String status) { ... }
```

### Request body — JSON in the body (POST, PUT, PATCH)

```
POST /api/projects
Body: { "name": "TimeTrack", "description": "..." }
```

```java
@PostMapping
public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) { ... }
```

> Rule of thumb: path params identify **which** resource. Query params **filter or configure** the response. The body carries the **data to create or update**.

---

## Request / response lifecycle

```
Angular component calls HTTP service
        ↓
Angular HTTP interceptor adds Authorization header
        ↓
Browser sends request to Spring Boot (localhost:8080)
        ↓  (CORS preflight OPTIONS first if needed)
Spring Boot filter chain (CORS → JwtFilter → SecurityFilterChain)
        ↓
@RestController method runs
        ↓
Service layer processes the request
        ↓
Repository queries the database
        ↓
Response travels back up the same chain
        ↓
Angular receives JSON → updates the UI
```
