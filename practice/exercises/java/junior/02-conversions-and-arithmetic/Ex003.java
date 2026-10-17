/*
 * Exercise 1 — JJ003 — Source, bytecode, and JVM execution
 *
 * Task
 * Change the greeting and demonstrate why running an old class differs from
 * compiling the changed source.
 *
 * What to do
 * 1. From this folder, compile the file as given with `javac Ex003.java`, then
 *    run it with `java Ex003`. It prints "Good morning, Victor." — this first
 *    run is only setup; you do not need to paste it.
 * 2. In the source, change the greeting text to "Good afternoon, Victor."
 *    (where "Your answer" marks it). Save the file.
 * 3. WITHOUT running javac again, run `java Ex003`. Paste what it printed
 *    under "Run 1" in "My output".
 * 4. Now run `javac Ex003.java`, then `java Ex003` again. Paste what it
 *    printed under "Run 2".
 * 5. Fill in the explanation below the class.
 *
 * Use `javac` + `java Ex003` for every run. Do not use the single-file
 * launcher (`java Ex003.java`) in this exercise: it compiles the source in
 * memory each time, so it would hide exactly what you are asked to observe.
 *
 * Pass condition
 * My output shows two runs of the class: before recompiling it still prints
 * the old greeting, after javac it prints the new one; a comment attributes
 * the stale output to the unrecompiled class file rather than to the source.
 */

public class Ex003 {
    public static void main(String[] args) {
        // Your answer (change the greeting text in step 2):
        String greeting = "Good afternoon, Victor.";

        System.out.println(greeting);
    }
}

// Your answer (explanation):
// Which file did `java Ex003` execute in Run 1, and why did it still print
// the old greeting even though the source already said "afternoon"?
// Run 1 executed Ex003.class, the bytecode compiled from the old source.
// The JVM runs the .class file, not the .java file, so editing the source
// changes nothing until it is recompiled. That is why it still printed
// "Good morning, Victor."
//
// What changed between Run 1 and Run 2, and which tool made that change?
// Between Run 1 and Run 2, javac recompiled Ex003.java and overwrote
// Ex003.class with new bytecode, so Run 2 printed "Good afternoon, Victor."
//

// Expected output:
// Run 1 (source edited, class not recompiled):
// Good morning, Victor.
// Run 2 (after javac):
// Good afternoon, Victor.

// My output:
// Run 1 (source edited, class not recompiled):
// Good morning, Victor.
// Run 2 (after javac):
// Good afternoon, Victor.
