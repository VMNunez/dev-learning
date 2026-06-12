# Minimum Coverage — Java

Only the Java concepts needed to write and understand Spring Boot code.
Skip anything that does not appear in a Spring Boot context.

## Classes and objects
- [ ] Classes, fields, constructors — how to define and instantiate
- [ ] Access modifiers: `public`, `private`, `protected` — what each one restricts
- [ ] `this` keyword — when and why to use it

## Interfaces and inheritance
- [ ] Interfaces: how to define and implement — why Spring uses them everywhere
- [ ] `@Override` — what it does and when it appears in Spring Boot code
- [ ] Abstract classes vs interfaces — when each is appropriate

## Annotations
- [ ] What annotations are — metadata that Spring reads at runtime
- [ ] How to read an annotation in Spring code without panicking
- [ ] Marker annotations vs annotations with values (`@Entity` vs `@Column(name = "user_id")`)

## Generics
- [ ] `List<String>`, `Optional<T>`, `Page<T>` — reading and using generics
- [ ] Why `Optional` exists and how to use it: `orElseThrow`, `isPresent`, `map`

## Exceptions
- [ ] Checked vs unchecked exceptions — why Spring Boot prefers unchecked
- [ ] `try/catch`, `throws` — reading exception handling in Spring code
- [ ] Creating a custom exception class

## Enums
- [ ] Defining an enum — used everywhere in Spring Boot (status, role, type)
- [ ] Using enums in `switch` statements and JPA `@Enumerated`

## Collections
- [ ] `List`, `Map`, `Set` — basic operations (add, get, put, contains, stream)
- [ ] When to use each in a Spring Boot service

## Modern Java (used in Spring Boot code)
- [ ] Records — compact DTOs, immutable data carriers
- [ ] `var` — local variable type inference
- [ ] Stream basics: `filter`, `map`, `collect` — reading service layer logic
- [ ] Lambda expressions — used in stream chains and Mockito

## Maven
- [ ] `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `plugins`
- [ ] How to add a dependency from Maven Central
- [ ] Build lifecycle: `clean`, `compile`, `test`, `package`, `install`
