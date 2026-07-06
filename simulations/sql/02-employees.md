# SQL — Test 02: Employees

**Time limit:** 45 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Schema

```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    budget NUMERIC(12,2) NOT NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC(10,2) NOT NULL,
    department_id INT REFERENCES departments(id),
    hire_date DATE NOT NULL,
    manager_id INT REFERENCES employees(id)  -- self-referencing: NULL if no manager
);
```

## Queries to write

1. All employees with their department name
2. Average salary per department, ordered by average salary descending
3. The employee with the highest salary in each department
4. Employees hired in the last 6 months (relative to today)
5. Departments where the total salary cost of all employees exceeds the department budget
6. Employees who are managers — i.e. their id appears as manager_id for at least one other employee
7. Number of employees per department, including departments with 0 employees

## Evaluation — what a good solution looks like

- [ ] Query 1 uses a simple JOIN
- [ ] Query 2 uses AVG + GROUP BY + ORDER BY
- [ ] Query 3 uses a subquery or window function (ROW_NUMBER or MAX with GROUP BY)
- [ ] Query 4 uses `CURRENT_DATE - INTERVAL '6 months'` or equivalent
- [ ] Query 5 uses GROUP BY + HAVING to compare SUM(salary) against budget
- [ ] Query 6 uses a subquery with DISTINCT or EXISTS
- [ ] Query 7 uses LEFT JOIN to include departments with no employees

## Bonus (if done before time)

- Query 8: For each employee, show their salary and how it compares to their department average (difference and percentage)
- Query 9: The manager with the most direct reports
