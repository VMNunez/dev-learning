# Java junior — conversions and arithmetic

Topic: java
Level: junior
Block: 01 — Values, types, conversion, and arithmetic
Date: 2026-10-15
Objective: Make five small programs print their Expected output and, for every surprising value, name in a comment the stage (compiler, run, stale class file) or the conversion (unboxing, cast, integer division) that produced it, without opening the notes.
Time budget: 30 minutes
Note: notes/java/junior/es/01-variables-tipos.md (Status: refined)
Exercise plan: practice/exercises/java/junior/PLANNING-junior.md

| Ex | Plan ID | Kind | Block | Concept | File |
|---|---|---|---|---|---|
| 1 | JJ003 | variant | 00 | Source, bytecode, and JVM execution | Ex003.java |
| 2 | JJ004 | variant | 00 | Compile-time vs runtime failure | Ex004.java |
| 3 | JJ009 | first | 01 | Primitive vs wrapper types | Ex009.java |
| 4 | JJ010 | first | 01 | Numeric conversions and casts | Ex010.java |
| 5 | JJ011 | first | 01 | Integer arithmetic | Ex011.java |

## Study notes

- 00 — Java execution foundations: [notes/java/junior/es/00-intro-java.md](../../../../../notes/java/junior/es/00-intro-java.md) (Status: refined)
- 01 — Values, types, conversion, and arithmetic: [notes/java/junior/es/01-variables-tipos.md](../../../../../notes/java/junior/es/01-variables-tipos.md) (Status: refined)

## Plan snapshot

### JJ003

- Concepts: Source, bytecode, and JVM execution
- Task: Change the greeting and demonstrate why running an old class differs from compiling the changed source.
- Pass condition: My output shows two runs of the class: before recompiling it still prints the old greeting, after javac it prints the new one; a comment attributes the stale output to the unrecompiled class file rather than to the source.

### JJ004

- Concepts: Compile-time vs runtime failure
- Task: Correct a program that compiles but calculates the wrong total, recording why compilation did not detect it.
- Pass condition: A comment states the program compiled and ran without any exception yet printed a wrong total, so no compiler check could catch it; the corrected total matches Expected output.

### JJ009

- Concepts: Primitive vs wrapper types
- Task: Convert a present Integer to a primitive and diagnose a null-unboxing example supplied in comments.
- Pass condition: The present Integer is unboxed and used in arithmetic with the expected result; the comment names the exact expression where unboxing null throws NullPointerException; the failing lines stay commented so the file compiles and runs.

### JJ010

- Concepts: Numeric conversions and casts
- Task: Convert decimal measurements to integral units and demonstrate the discarded fractional part.
- Pass condition: Widening and narrowing outcomes are shown, including a value outside the target range.

### JJ011

- Concepts: Integer arithmetic
- Task: Compute an average that must retain its fractional part.
- Pass condition: The average of the supplied ints prints with its fractional part (a sum of 7 over a count of 2 gives 3.5, not 3 or 3.0); the promotion is applied to an operand before the division, not to the already truncated quotient; My output matches.
