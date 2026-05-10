# Angular — Unit Testing

Angular uses **Jasmine** as the test framework and **Karma** as the test runner. Tests live next to the file they test — `employee.service.spec.ts` next to `employee.service.ts`.

Official docs: https://angular.dev/guide/testing

---

## Jasmine basics

```typescript
describe('MyService', () => {       // group of related tests
  it('should do something', () => { // one test
    expect(2 + 2).toBe(4);          // assertion
  });
});
```

| Function | What it does |
| --- | --- |
| `describe('name', fn)` | Groups related tests together |
| `it('name', fn)` | One individual test |
| `expect(value)` | Start of an assertion |
| `.toBe(x)` | Strict equality (`===`) |
| `.toEqual(x)` | Deep equality (for objects and arrays) |
| `.toBeTruthy()` | Value is truthy |
| `.toBeFalsy()` | Value is falsy |
| `.toHaveBeenCalled()` | A spy was called |
| `.toHaveBeenCalledWith(x)` | A spy was called with a specific argument |
| `beforeEach(fn)` | Runs before each `it` — use to reset state |

---

## TestBed — Angular's testing module

`TestBed` creates a mini Angular environment for the test. You configure it with the same providers and imports you would use in the real app.

```typescript
import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});  // configure the test module
    service = TestBed.inject(TaskService); // get the service instance
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

`TestBed.inject(Token)` is the same as `inject()` in a component — it gives you the singleton instance from the test module's injector.

---

## Testing a service — no HTTP

When the service has no dependencies, the setup is minimal:

```typescript
describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should add a task', () => {
    service.addTask({ title: 'Buy milk', priority: 'low' });
    expect(service.tasks().length).toBe(1);
  });

  it('should delete a task', () => {
    service.addTask({ title: 'Buy milk', priority: 'low' });
    const id = service.tasks()[0].id;
    service.deleteTask(id);
    expect(service.tasks().length).toBe(0);
  });
});
```

Each `it` starts clean because `beforeEach` creates a new `TestBed` and a new service instance.

---

## spyOn — mock a method

`spyOn` replaces a method with a fake that you can control and inspect. Use it to test that a method was called, or to avoid running real logic in a dependency.

```typescript
it('should call the service when deleting', () => {
  const spy = spyOn(service, 'deleteTask');
  service.deleteTask(1);
  expect(spy).toHaveBeenCalledWith(1);
});
```

You can also control what the spy returns:

```typescript
spyOn(service, 'getAll').and.returnValue([]);        // return a value
spyOn(service, 'save').and.throwError('Network error'); // throw an error
```

---

## Testing a service with HTTP

Use `HttpClientTestingModule` to intercept HTTP calls without making real network requests.

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // fails the test if any unexpected requests were made
  });

  it('should return all employees', () => {
    const mockEmployees: Employee[] = [
      { id: 1, name: 'Ana García', email: 'ana@test.com', role: 'employee' }
    ];

    service.getAll().subscribe(employees => {
      expect(employees.length).toBe(1);
      expect(employees[0].name).toBe('Ana García');
    });

    const req = httpMock.expectOne('http://localhost:3000/employees');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees); // send the mock response
  });
});
```

**What happens here:**
1. `HttpClientTestingModule` intercepts all HTTP requests — nothing goes to the network
2. `service.getAll()` triggers the HTTP call, which is intercepted
3. `httpMock.expectOne(url)` asserts that exactly one request was made to that URL
4. `req.flush(data)` sends the mock response — this triggers the `subscribe` callback
5. `httpMock.verify()` in `afterEach` fails the test if any request was made but not expected

---

## Run the tests

```bash
ng test
```

Karma opens a browser and runs all `*.spec.ts` files. Results appear in the terminal and the browser.

To run once without watching:

```bash
ng test --watch=false
```
