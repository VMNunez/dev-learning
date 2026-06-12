# SQL — Test 04: University

**Time limit:** 45 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Schema

```sql
CREATE TABLE professors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100)
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    credits INT NOT NULL,
    professor_id INT REFERENCES professors(id)
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    enrollment_year INT NOT NULL
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    course_id INT REFERENCES courses(id),
    grade NUMERIC(4,2),  -- NULL if not yet graded; 0–10 scale
    semester VARCHAR(20) NOT NULL  -- e.g. '2026-S1'
);
```

## Queries to write

1. All students with the number of courses they are currently enrolled in
2. Average grade per course — exclude enrollments with no grade (NULL)
3. Students who are failing (grade < 5) in more than one course
4. The professor teaching the most students across all their courses
5. Students who have completed more than 60 credits — a course is completed when grade >= 5
6. Courses with no students enrolled
7. For each semester, the student with the highest average grade

## Evaluation — what a good solution looks like

- [ ] Query 1 uses COUNT + GROUP BY + LEFT JOIN to include students with 0 courses
- [ ] Query 2 uses AVG + WHERE grade IS NOT NULL
- [ ] Query 3 uses GROUP BY student + HAVING COUNT > 1 with a WHERE grade < 5 filter
- [ ] Query 4 joins professors → courses → enrollments and uses COUNT(DISTINCT student_id)
- [ ] Query 5 uses SUM of credits with a WHERE grade >= 5 filter and HAVING SUM > 60
- [ ] Query 6 uses LEFT JOIN + WHERE enrollment id IS NULL
- [ ] Query 7 uses a window function (RANK or ROW_NUMBER PARTITION BY semester) or a correlated subquery

## Bonus (if done before time)

- Query 8: Professors whose students have an average grade below 5 across all their courses
- Query 9: Students enrolled in all courses taught by a specific professor (professor_id = 1)
