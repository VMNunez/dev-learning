# Minimum Coverage — TypeScript

TypeScript as used in Angular — not a general TypeScript course.

## Types
- [ ] Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `void`
- [ ] `any` vs `unknown` — why `unknown` is safer and when to use each
- [ ] Union types: `string | number`, `'admin' | 'user'`
- [ ] Type inference — TypeScript guesses the type, you do not always need to declare it

## Interfaces and types
- [ ] `interface` vs `type` — when each is preferred and the practical difference
- [ ] Optional properties: `name?: string`
- [ ] Readonly properties
- [ ] Extending interfaces

## Generics
- [ ] `Array<T>`, `Observable<T>`, `Signal<T>` — reading generics in Angular code
- [ ] Writing a simple generic function or interface

## Utility types
- [ ] `Partial<T>` — all properties optional (used in update DTOs)
- [ ] `Readonly<T>` — immutable version
- [ ] `Pick<T, K>` and `Omit<T, K>` — selecting or removing fields from a type

## Narrowing and guards
- [ ] `typeof`, `instanceof` — narrowing inside conditionals
- [ ] Optional chaining `?.` and nullish coalescing `??`
- [ ] Non-null assertion `!` — when to use it and why it is dangerous

## Functions
- [ ] Arrow functions vs function declarations — the `this` difference
- [ ] Default parameters, rest parameters
- [ ] Return type annotations

## Decorators
- [ ] What a decorator is in the context of Angular (`@Component`, `@Injectable`)
- [ ] How TypeScript decorators work conceptually — not how to write one

## Modules
- [ ] `import` / `export` — named vs default exports
- [ ] Barrel files (`index.ts`) — what they do and when they help
