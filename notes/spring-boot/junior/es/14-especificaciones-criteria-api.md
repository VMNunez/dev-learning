# Specifications y la Criteria API

Docs: https://www.baeldung.com/rest-api-search-language-spring-data-specifications → leer: "Specifications" y "Multiple Specifications"

Ya conoces `@Query` con parámetros nombrados (archivo [03-spring-data-jpa.md](03-spring-data-jpa.md)) — escribes la JPQL como un string fijo y Spring rellena los `:nombreParametro` en el momento de ejecutar. Eso funciona genial cuando la query nunca cambia de forma. Pero `GET /api/entries` del proyecto 07 tiene cuatro filtros *opcionales* — `userId`, `projectId`, `status`, `month` — y puede llegar cualquier combinación de ellos: a veces solo `status`, a veces los cuatro, a veces ninguno. El `WHERE` necesita una forma distinta según lo que haya llegado. Ese es el problema que resuelve este archivo.

## El arreglo tentador, y por qué se rompe

El primer instinto es mantener un único string JPQL fijo y simular "opcional" con un truco booleano:

```java
// MAL
@Query("""
        SELECT te FROM TimeEntry te
        WHERE (:status IS NULL OR te.status = :status)
        AND (:start IS NULL OR :end IS NULL OR te.date BETWEEN :start AND :end)
        """)
List<TimeEntry> findByFilters(@Param("status") EntryStatus status, @Param("start") LocalDate start, @Param("end") LocalDate end);
```

La idea: si `:status` es `null`, `:status IS NULL` es verdadero, así que el `OR` hace que todo el paréntesis sea verdadero sin importar la segunda mitad — en la práctica, "no filtres por status". Suena correcto al leerlo, e incluso funciona en algunas bases de datos. Pero ejecuta esto contra PostgreSQL y puedes toparte con:

```
ERROR: 42P18: could not determine data type of parameter $1
```

> **Por qué pasa esto exactamente.** Antes de ejecutar una query, PostgreSQL tiene que decidir el *tipo de dato* de cada placeholder (`$1`, `$2`, …) para saber cómo compararlo. Normalmente infiere el tipo por contexto — `te.status = :status` le dice que `:status` tiene que ser del tipo mapeado a `EntryStatus`, porque eso es lo que compara el `=`. El problema es `:status IS NULL`: `IS NULL` es una comprobación genérica que funciona con *cualquier* tipo, así que por sí sola no le da a Postgres ninguna pista de qué tipo debería tener `:status`. El planner de Postgres lee la expresión de izquierda a derecha y, según cómo quede agrupado el `OR` y cómo lo optimice, puede llegar a la rama `IS NULL` sin haber fijado nunca un tipo desde la rama `=`. Cuando eso pasa, tiene un placeholder sin tipo inferible — y se niega a adivinar, porque adivinar mal podría comparar tipos incorrectos en silencio. La JPQL solo traduce tu `WHERE` a texto SQL; no puede arreglar una limitación de inferencia de tipos del propio planner de Postgres.

El arreglo que no depende de la base de datos es dejar de escribir una única query con texto condicional dentro, y en su lugar **construir la query como objetos Java**, añadiendo un trozo al `WHERE` solo cuando ese filtro realmente tiene valor. Eso es exactamente lo que te da `Specification`.

## La idea central: construir la query, no escribirla

Con `@Query`, el SQL/JPQL existe como string desde el momento en que compilas la clase — fijo, incondicional. Con la **Criteria API**, construyes la query como un árbol de objetos Java en tiempo de ejecución, usando `if` normales. Si un filtro está ausente, simplemente nunca creas el objeto que lo habría representado — no hay ningún placeholder con el que Postgres pueda atragantarse, porque esa condición nunca se añadió a la query en primer lugar.

```
String JPQL fijo                      Criteria API (construida en Java)
──────────────────                    ─────────────────────────────
"WHERE (:x IS NULL OR ...)"           if (x != null) { añadir condición }
   ↑ mismo texto enviado                ↑ el WHERE cambia en cada llamada,
     siempre a Postgres, el truco         construido con if/else reales,
     depende de cómo Postgres infiere      sin trucos
     tipos
```

## Las tres piezas

Para traducir una condición `WHERE` a objetos Java, JPA te da tres tipos que colaboran entre sí. Imagina la frase SQL `te.status = 'DRAFT'` y mira cómo cada palabra se traduce a uno de ellos:

| Trozo de SQL | Objeto Java | Qué representa |
|---|---|---|
| `time_entries te` (la tabla que consultas, con alias `te`) | `Root<TimeEntry> root` | El punto de partida — "estoy consultando la entidad `TimeEntry`". Desde aquí navegas hacia columnas y relaciones: `root.get("status")` es el equivalente Java de escribir `te.status` |
| toda la condición `WHERE`, ya construida por completo | `Predicate` | Un objeto de condición booleana terminado y listo para usar. Nunca escribes un `Predicate` a mano — siempre te lo devuelve un método de `CriteriaBuilder` |
| la "fábrica" de operadores de comparación | `CriteriaBuilder cb` | Un objeto con un método por cada operador SQL: `cb.equal(...)`, `cb.between(...)`, `cb.greaterThan(...)`, `cb.and(...)`, `cb.or(...)`. Nunca escribes un operador como string — siempre llamas a un método |
| la query completa que se está ensamblando (joins, `SELECT`, `ORDER BY`) | `CriteriaQuery<?> query` | Rara vez la necesitas para filtros simples — en general la vas a ignorar |

> **Cómo leer la tabla de arriba.** Cada fila es una traducción directa: el fragmento SQL de la izquierda no tiene forma de texto en tu código Java — solo existe como el objeto de la derecha, construido llamando a métodos. `root.get("user").get("id")` no es un string que se parsea después; es una llamada a método real, ahora mismo, que produce un objeto `Path` que JPA convierte más tarde en `te.user_id` dentro del SQL generado.

## `Specification<T>` — empaquetar un fragmento de `WHERE` como objeto reutilizable

`Specification<T>` es una **interfaz funcional** — una interfaz con exactamente un método abstracto:

```java
public interface Specification<T> {
    Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb);
}
```

Como tiene un solo método, Java te deja implementarla con una **lambda** en vez de una clase anónima completa. La lista de parámetros de la lambda — `(root, query, cb)` — es exactamente esa firma de método; Java infiere los tipos de los parámetros a partir del `Specification<TimeEntry>` al que se asigna la lambda.

> **La parte que más confunde al principio: nada se ejecuta todavía.** Escribir `Specification<TimeEntry> spec = (root, query, cb) -> cb.equal(root.get("status"), status);` no consulta nada. Construye y guarda *una receta* — "cuando alguien necesite un `Predicate` mío, así es como se fabrica". Spring Data JPA solo llama a `toPredicate(...)` más tarde, cuando pasas el `Specification` a `repository.findAll(spec)` y toca ensamblar el SQL de verdad.

Este es `TimeEntrySpecifications.java` del proyecto 07 — un método factoría estático por filtro:

Propósito: Construir un fragmento de `WHERE` reutilizable por cada filtro opcional de `GET /api/entries`, para que el servicio pueda combinar solo los fragmentos cuyo valor esté realmente presente.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntrySpecifications.java`
Docs: https://www.baeldung.com/rest-api-search-language-spring-data-specifications → leer: "Specifications"

```java
public class TimeEntrySpecifications {

    public static Specification<TimeEntry> hasUserId(Long userId) {
        return ((root, query, criteriaBuilder) ->
                userId == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("user").get("id"), userId));
    }

    public static Specification<TimeEntry> hasProjectId(Long projectId) {
        return ((root, query, criteriaBuilder) ->
                projectId == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("project").get("id"), projectId));
    }

    public static Specification<TimeEntry> hasStatus(EntryStatus status) {
        return ((root, query, criteriaBuilder) ->
                status == null ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("status"), status));
    }

    public static Specification<TimeEntry> dateBetween(LocalDate start, LocalDate end) {
        return ((root, query, criteriaBuilder) ->
                (start == null || end == null) ?
                        criteriaBuilder.conjunction() :
                        criteriaBuilder.between(root.get("date"), start, end));
    }
}
```

**`hasUserId(userId)`** — un método factoría estático: dado un `Long` que puede ser `null`, devuelve un `Specification<TimeEntry>` que sabe filtrar por él más adelante, cuando JPA se lo pida.

**`root.get("user").get("id")`** — recorre el grafo de entidades exactamente igual que lo hacía el path JPQL `te.user.id`, pero como llamadas a método sobre el `Root` en vez de un string. `TimeEntry` tiene un campo `user` (`@ManyToOne User user`), y `User` tiene un campo `id` — `.get("user")` entra en la relación, `.get("id")` entra un paso más, en la columna de esa relación.

**`criteriaBuilder.equal(A, B)`** — construye el `Predicate` de `A = B`. Aquí produce el equivalente SQL de `te.user.id = ?`, con `?` ligado a `userId`.

**`criteriaBuilder.conjunction()`** — el `Predicate` "siempre verdadero". Cuando combinas varios predicados con `AND` y uno de ellos es `conjunction()`, ese no aporta nada al filtro — el conjunto de filas resultante no cambia. Así es como se expresa "este filtro no llegó": no omitiendo el predicado de una lista (también se podría hacer así), sino aportando uno neutro que desaparece al combinarse.

> **¿Por qué `conjunction()` y no simplemente no añadir el predicado?** Ambos enfoques funcionan; aquí se usa `conjunction()` porque permite que los cuatro métodos factoría tengan siempre el mismo tipo de retorno y que puedas encadenarlos con `.and()` sin necesidad de un `if` extra en quien los llama, por cada filtro. Su opuesto lógico es `cb.disjunction()` — el predicado "siempre falso", útil cuando quieres que un filtro excluya todo si su condición está ausente (caso raro; no se usa aquí).

**`criteriaBuilder.between(A, start, end)`** — construye `A BETWEEN start AND end`, el equivalente directo en objetos de la JPQL `te.date BETWEEN :start AND :end` que tenías antes.

## `JpaSpecificationExecutor<T>` — de dónde sale `findAll(Specification)`

Una `Specification` no sirve de nada sin algo que sepa ejecutarla. `JpaRepository<T, ID>` por sí sola no tiene la sobrecarga `findAll(Specification<T>)` — la consigues haciendo que tu interfaz de repositorio *también* extienda `JpaSpecificationExecutor<T>`:

Propósito: Darle a `TimeEntryRepository` la sobrecarga `findAll(Specification<TimeEntry>)` usada para ejecutar un filtro construido dinámicamente.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java`
Docs: https://www.baeldung.com/rest-api-search-language-spring-data-specifications → leer: "The Repository"

```java
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long>, JpaSpecificationExecutor<TimeEntry> {
    // findByFilters(...) y su @Query desaparecen — se reemplazan por findAll(Specification<TimeEntry>)
}
```

> Esto es herencia múltiple de interfaces, que Java permite sin problema (a diferencia de la herencia múltiple de *clases*) — `TimeEntryRepository` ahora tiene todos los métodos que da `JpaRepository` (`save`, `findById`, `deleteById`, …) más todos los que da `JpaSpecificationExecutor` (`findAll(Specification)`, `count(Specification)`, …).

## Combinar specifications: `.and(...)`

`Specification<T>` tiene métodos por defecto `and(...)`, `or(...)` y `not(...)` — esta es la segunda razón por la que es una interfaz y no un simple tipo funcional: puede llevar comportamiento adicional además del único método abstracto. Los encadenas para construir una `Specification` combinada a partir de varias:

```java
Specification<TimeEntry> spec = Specification
        .where(TimeEntrySpecifications.hasUserId(userId))
        .and(TimeEntrySpecifications.hasProjectId(projectId))
        .and(TimeEntrySpecifications.hasStatus(status))
        .and(TimeEntrySpecifications.dateBetween(start, end));

List<TimeEntry> entries = timeEntryRepository.findAll(spec);
```

`Specification.where(...)` es un punto de partida seguro frente a `null` (funciona incluso si le pasas `null` como primer argumento), y cada `.and(...)` produce una *nueva* `Specification` combinada cuyo `toPredicate` llama a `cb.and(...)` sobre los predicados subyacentes de ambos lados — incluyendo los neutros `conjunction()`, que desaparecen sin efecto.

> **Traza esto para una request con solo `?status=SUBMITTED`.** `userId`, `projectId`, `start` y `end` son todos `null`. `hasUserId`, `hasProjectId` y `dateBetween` evalúan su ternario a `cb.conjunction()`; `hasStatus` evalúa a la condición real `cb.equal(root.get("status"), SUBMITTED)`. Una vez que `.and()` encadena las cuatro, el `WHERE` SQL efectivo es solo `te.status = 'SUBMITTED'` — los tres predicados "siempre verdadero" desaparecen del efecto práctico del SQL generado, aunque técnicamente estuvieran combinados con `AND`.

## Contraste: `@Query` vs `Specification` — cuándo usar cada uno

| | `@Query` (JPQL/nativa) | `Specification` |
|---|---|---|
| Forma de la query | Fija en tiempo de compilación | Se construye en tiempo de ejecución, condicionalmente |
| Buena para | Una query cuyo `WHERE`/`SELECT` nunca cambia de forma (p. ej. las agregaciones de reportes de `03-spring-data-jpa.md`) | Una query cuyo `WHERE` necesita un subconjunto distinto de condiciones en cada llamada |
| Legibilidad | Se lee como SQL — fácil de revisar a simple vista | Se lee como Java — más código de estructura, pero componible |
| El truco `IS NULL OR` para filtros opcionales | Frágil — puede provocar errores de inferencia de tipos de Postgres como `42P18` | No hace falta — los filtros ausentes simplemente nunca aportan un predicado |

La fila que más importa de este archivo: **usa `@Query` cuando la forma es fija, `Specification` cuando la forma depende de qué filtros opcionales llegaron.** `GET /api/entries` es el segundo caso — por eso exactamente pasó de JPQL a `Specification` en el proyecto 07.

## Juntando todo — los cuatro pasos, en orden

Este es el checklist práctico para la próxima vez que un recurso necesite filtros opcionales dinámicos. Cada paso apunta al archivo exacto donde aterrizó para `GET /api/entries`:

1. **Decidir que hace falta:** el endpoint tiene 2+ filtros opcionales que pueden llegar en cualquier combinación, y o bien haría falta un `@Query` con trucos `IS NULL OR`, o ya existe uno y es frágil.
2. **Crear `XxxSpecifications.java`** en `repository/` — un método factoría `static Specification<Entidad>` por filtro, cada uno devolviendo `cb.conjunction()` cuando su argumento es `null`. → `TimeEntrySpecifications.java`
3. **Hacer que el repositorio extienda `JpaSpecificationExecutor<Entidad>`** además de `JpaRepository<Entidad, Id>` — esto es lo que te da `findAll(Specification<Entidad>)`. Borrar el método `@Query` antiguo que reemplaza. → `TimeEntryRepository.java`
4. **En el servicio, construir la `Specification` combinada y llamar a `findAll(spec)`:** empezar con `Specification.where(...)`, encadenar `.and(...)` una vez por filtro, pasar el resultado a `repository.findAll(spec)`. → `TimeEntryService.findByFilter(...)`

> La lógica de negocio que decide *qué valor* debe tener cada filtro (por ejemplo, sobrescribir `userId` con el id del usuario autenticado cuando quien llama no es manager) nunca se mueve — se queda exactamente donde ya estaba, en el servicio, antes de construir la `Specification`. Solo cambia *cómo se ejecuta la query*; *qué se filtra* se decide igual que antes.
