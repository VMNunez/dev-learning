/*
 * Exercise 3 — JJ009 — Primitive vs wrapper types
 *
 * Task
 * Convert a present Integer to a primitive and diagnose a null-unboxing
 * example supplied in comments.
 *
 * What to do
 * 1. `storedStock` is an Integer, as if it came from a database column that
 *    allows null; here it holds a value. Where "Your answer" marks it, put it
 *    into an int variable named `stock`, add `incoming` to it, and print the
 *    line shown under "Expected output".
 * 2. In a comment next to your code, say on which line the Integer is turned
 *    into an int.
 * 3. Read the four commented-out lines A–D under the class. Exactly one of
 *    them throws NullPointerException when run. In the diagnosis below them,
 *    name that line and the exact expression that throws, and say why the
 *    other three do not throw.
 * 4. Optional: uncomment A–D, run once to confirm, paste the first line of the
 *    error under "Error seen", then comment them out again. The final file
 *    must compile and run with A–D commented out.
 * 5. Run the file and paste what it printed under "My output".
 *
 * Pass condition
 * The present Integer is unboxed and used in arithmetic with the expected
 * result; the comment names the exact expression where unboxing null throws
 * NullPointerException; the failing lines stay commented so the file compiles
 * and runs.
 */

public class Ex009 {
    public static void main(String[] args) {
        Integer storedStock = 42;
        int incoming = 8;

        // Your answer:
        int stock = storedStock; // unboxing: Integer -> int happens here
        System.out.printf("Stock after delivery: " +  (stock + incoming));

         // Integer missingStock = null;                    // A
         // Integer copy = missingStock;                    // B
         // boolean isMissing = missingStock == null;       // C
         // int total = copy + 8;                           // D

    }
}

// Lines to diagnose (keep them commented out in the final file):
// Integer missingStock = null;                    // A
// Integer copy = missingStock;                    // B
// boolean isMissing = missingStock == null;       // C
// int total = copy + 8;                           // D

// Your answer (diagnosis):
// The line that throws, and the exact expression:
// Line D throws NullPointerException at `copy + 8`. copy holds the same null
// as missingStock, and the + forces Java to unbox it to an int, but there is
// no number inside to extract.
//
// Why the other three do not throw:
// A and B only store or copy a null reference in an Integer variable, which
// is legal. C compares the reference with null without unboxing it, so it
// just evaluates to true.

// Error seen (optional):
// Exception in thread "main" java.lang.NullPointerException: Cannot invoke "java.lang.Integer.intValue()" because "<local5>" is null
//        at Ex009.main(Ex009.java:43)

// Expected output:
// Stock after delivery: 50

// My output:
// Stock after delivery: 50
