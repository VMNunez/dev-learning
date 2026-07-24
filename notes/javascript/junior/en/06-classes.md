# Classes

## What is a class?

A class is a template for creating objects with the same structure and behaviour. JavaScript classes are syntactic sugar over prototype-based inheritance — under the hood it still uses prototypes, but the syntax is much cleaner and closer to other languages like Java.

In Angular you write classes constantly — components, services, pipes, and guards are all classes.

---

## Basic syntax

```js
class Employee {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  greet() {
    return `Hello, I am ${this.name} (${this.role})`;
  }
}

const emp = new Employee('Victor', 'developer');
emp.greet();  // 'Hello, I am Victor (developer)'
```

- `constructor` runs automatically when you create an instance with `new`
- Methods go directly on the class body — no `function` keyword needed
- `this` inside a class refers to the instance

---

## Class fields (ES2022)

You can declare properties directly on the class body, without the constructor:

```js
class Employee {
  name = '';           // public field with default value
  #salary = 0;         // private field — only accessible inside the class

  constructor(name, salary) {
    this.name = name;
    this.#salary = salary;
  }

  getSalary() {
    return this.#salary;  // accessible here
  }
}

const emp = new Employee('Victor', 30000);
emp.name         // 'Victor'
emp.#salary      // SyntaxError — private, cannot access from outside
emp.getSalary()  // 30000
```

Private fields use `#` as a prefix. TypeScript has its own `private` keyword that works at compile time, but `#` is the native JavaScript version that enforces privacy at runtime.

---

## Getters and setters

Control how a property is read and written:

```js
class Employee {
  #salary = 0;

  get salary() {
    return `${this.#salary} €`;   // computed on read
  }

  set salary(value) {
    if (value < 0) throw new Error('Salary cannot be negative');
    this.#salary = value;          // validated on write
  }
}

const emp = new Employee();
emp.salary = 30000;   // calls setter
emp.salary;           // calls getter → '30000 €'
```

---

## Static methods and properties

`static` members belong to the class itself, not to instances:

```js
class MathUtils {
  static PI = 3.14159;

  static double(n) {
    return n * 2;
  }
}

MathUtils.double(5);  // 10   — called on the class, not on an instance
MathUtils.PI;         // 3.14159
```

In Angular, `static` is used for configuration objects and factory methods.

---

## Inheritance — extends and super

A class can inherit from another class with `extends`:

```js
class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  describe() {
    return `${this.name} (${this.email})`;
  }
}

class Employee extends Person {
  constructor(name, email, department) {
    super(name, email);  // must call super() before using this
    this.department = department;
  }

  describe() {
    return `${super.describe()} — ${this.department}`;  // call parent method
  }
}

const emp = new Employee('Victor', 'v@example.com', 'IT');
emp.describe();  // 'Victor (v@example.com) — IT'
```

- `super()` calls the parent constructor — required before you can use `this`
- `super.method()` calls a method from the parent class

---

## Classes and TypeScript

TypeScript builds directly on JavaScript classes and adds:
- Type annotations on properties and constructor parameters
- `private`, `protected`, `public` access modifiers (compile-time only)
- `readonly` properties
- Interfaces that classes can implement

```ts
class EmployeeService {
  private employees: Employee[] = [];

  add(employee: Employee): void {
    this.employees.push(employee);
  }

  getAll(): Employee[] {
    return this.employees;
  }
}
```

Every Angular service, component, and pipe is a TypeScript class with decorators (`@Injectable`, `@Component`, etc.) — decorators are just functions that add metadata to the class.
