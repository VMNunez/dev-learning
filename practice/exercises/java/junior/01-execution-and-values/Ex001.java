/*
 * Exercise 1 — JJ001 — Source, bytecode, and JVM execution
 *
 * Task
 * Complete a tiny greeting program, compile it with javac, run the generated
 * class with java, and record in a comment which file is the source and which
 * file the compiler generated.
 *
 * What to do
 * 1. Inside main, print the greeting shown under "Expected output", building
 *    it from the supplied `name` variable (do not type the name again).
 * 2. From this folder, compile the file with `javac` and then run the
 *    generated class with `java`, as two separate commands. Do not use the
 *    single-file launcher (`java Ex001.java`) for this exercise.
 * 3. Look at the folder after compiling, then fill in the toolchain record
 *    below the class.
 * 4. Paste what your run printed under "My output".
 *
 * Pass condition
 * My output matches the expected greeting; the comment names the .java file as
 * source and the .class file as the compiler's bytecode output, and says javac
 * produced it and the JVM started by java executed it.
 */

public class Ex001 {
    public static void main(String[] args) {
        String name = "Victor";

        // Your answer:
        String greeting = "Hello, %s! This class was compiled before it ran.".formatted(name);
        System.out.println(greeting);
    }
}

// Your answer (toolchain record):
// Source file: Ex001.java
// File the compiler generated, and what it contains: Ex001.class, which contains the bytecode.
// Tool that generated it: the javac compiler generates it
// What executed the program, and which command started it: the JVM executes it, started with java Ex001

// Expected output:
// Hello, Victor! This class was compiled before it ran.

// My output:
// Hello, Victor! This class was compiled before it ran.
