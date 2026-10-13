/*
 * Exercise 2 — JJ002 — Compile-time vs runtime failure
 *
 * Task
 * Uncomment a supplied statement the compiler rejects, record its message and
 * fix it; then run a supplied integer division by zero, record the exception,
 * and correct the divisor to the stated value so the program completes.
 *
 * What to do
 * Work from this folder with `javac Ex002.java` and then `java Ex002`, as two
 * separate commands, so you can see at which of the two each failure appears.
 * 1. Uncomment the two lines of step 1 and compile. Record the message in the
 *    failure log below the class, then fix the declaration so `itemCount`
 *    holds the number 5.
 * 2. Compile again and run. Record what the run printed in the failure log.
 * 3. The bill is split between 4 people: correct `people` to that value so
 *    the program completes.
 * 4. In the failure log, classify each of the two failures and paste the
 *    output of the corrected version under "My output".
 *
 * Pass condition
 * A comment classifies the first failure as compile-time (javac rejected it,
 * nothing ran) and the second as runtime (it compiled, then threw
 * ArithmeticException); the final file compiles and My output matches the
 * expected output of the corrected version.
 */
public class Ex002 {
    public static void main(String[] args) {
        int totalCents = 1200;

        // Step 1 — uncomment the two lines below.
         int itemCount = 5;
         System.out.println("Items: " + itemCount);

        // Step 2 — supplied as is.
        int people = 4;
        int sharePerPersonCents = totalCents / people;
        System.out.println("Share per person: " + sharePerPersonCents + " cents");
    }
}

// Your answer (failure log):
// Failure 1 — message printed:
// Ex002.java:32: error: incompatible types: String cannot be converted to int
//         int itemCount = "5";
//                         ^
//1 error
// Failure 1 — which command printed it, and did any line of the program run? javac Ex002.java. It fails at
// compile time, so no line of the program runs
// Failure 1 — kind of failure: compile-time error
// Failure 2 — what was printed:
//Items: 5
//Exception in thread "main" java.lang.ArithmeticException: / by zero
//        at Ex002.main(Ex002.java:37)
// Failure 2 — which command printed it, and had the file compiled? java Ex002; the file had compiled
// Failure 2 — kind of failure: runtime failure

// Expected output:
// Items: 5
// Share per person: 300 cents

// My output:
// Items: 5
// Share per person: 300 cents
