/*
 * Exercise 5 — JJ011 — Integer arithmetic
 *
 * Task
 * Compute an average that must retain its fractional part.
 *
 * What to do
 * Two sets of ratings are supplied as ints. Where "Your answer" marks it:
 * 1. For set A, print three lines: the plain int division `sumA / countA`;
 *    the same int division cast to double AFTER dividing; and the correct
 *    average, which keeps its fractional part.
 * 2. For set B, print only the correct average.
 * 3. Both correct averages must come from the int variables supplied — do not
 *    change their types and do not type the result by hand.
 * 4. Print each line in exactly the format shown under "Expected output".
 * 5. Answer the questions below the class.
 * 6. Run the file and paste what it printed under "My output".
 *
 * Pass condition
 * The average of the supplied ints prints with its fractional part (a sum of
 * 7 over a count of 2 gives 3.5, not 3 or 3.0); the promotion is applied to an
 * operand before the division, not to the already truncated quotient; My
 * output matches.
 */

public class Ex011 {
    public static void main(String[] args) {
        int sumA = 4 + 3;
        int countA = 2;

        int sumB = 5 + 4 + 4 + 2;
        int countB = 4;

        // Your answer:

    }
}

// Your answer (questions):
// Why does the second line print 3.0 and not 3.5, even though it is a double?
//
// In your correct version, which operand is promoted, and at what moment
// compared with the division?
//

// Expected output:
// A, int division: 3
// A, cast after dividing: 3.0
// A, average: 3.5
// B, average: 3.75

// My output:
//
