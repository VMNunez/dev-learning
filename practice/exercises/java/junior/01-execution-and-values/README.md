# Java junior — execution and first values

Topic: java
Level: junior
Block: 00 — Java execution foundations
Date: 2026-10-13
Objective: Get five small programs to compile and print their expected output, saying for each failure whether the compiler or the run revealed it, without opening the notes.
Time budget: 30 minutes
Note: notes/java/junior/es/00-intro-java.md (Status: refined)
Exercise plan: practice/exercises/java/junior/PLANNING-junior.md

| Ex | Plan ID | Kind | Block | Concept | File |
|---|---|---|---|---|---|
| 1 | JJ001 | first | 00 | Source, bytecode, and JVM execution | Ex001.java |
| 2 | JJ002 | first | 00 | Compile-time vs runtime failure | Ex002.java |
| 3 | JJ006 | first | 01 | Variables, declared types, initialization, and scope | Ex006.java |
| 4 | JJ007 | first | 01 | Primitive vs reference types | Ex007.java |
| 5 | JJ008 | first | 01 | `int` vs `long` | Ex008.java |

## Plan snapshot

### JJ001

- Concepts: Source, bytecode, and JVM execution
- Task: Complete a tiny greeting program, compile it with javac, run the generated class with java, and record in a comment which file is the source and which file the compiler generated.
- Pass condition: My output matches the expected greeting; the comment names the .java file as source and the .class file as the compiler's bytecode output, and says javac produced it and the JVM started by java executed it.

### JJ002

- Concepts: Compile-time vs runtime failure
- Task: Uncomment a supplied statement the compiler rejects, record its message and fix it; then run a supplied integer division by zero, record the exception, and correct the divisor to the stated value so the program completes.
- Pass condition: A comment classifies the first failure as compile-time (javac rejected it, nothing ran) and the second as runtime (it compiled, then threw ArithmeticException); the final file compiles and My output matches the expected output of the corrected version.

### JJ006

- Concepts: Variables, declared types, initialization, and scope
- Task: Compute a basket subtotal from fixed prices: a local declared without a value must receive it on both branches of a supplied if/else, a helper local must live only inside a supplied inner block, and a supplied commented-out line reads that helper after its block.
- Pass condition: The file compiles with no local read before assignment; the branch-assigned local has no dummy initial value; a comment says the commented-out read fails because the variable's scope ended with its block; My output matches the expected subtotal.

### JJ007

- Concepts: Primitive vs reference types
- Task: Copy a primitive and a supplied mutable reference, then compare the effect of changing each copy.
- Pass condition: After the changes the primitive copy and its original print different values while both references print the same mutated content; My output matches.

### JJ008

- Concepts: `int` vs `long`
- Task: Calculate a population sum exceeding the int range with a suitable numeric type.
- Pass condition: Large literals compile and arithmetic preserves values beyond int range.
