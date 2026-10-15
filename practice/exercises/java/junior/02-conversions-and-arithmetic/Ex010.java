/*
 * Exercise 4 — JJ010 — Numeric conversions and casts
 *
 * Task
 * Convert decimal measurements to integral units and demonstrate the
 * discarded fractional part.
 *
 * What to do
 * Where "Your answer" marks it, using the supplied variables:
 * 1. Widening: assign `boxes` to a long variable and to a double variable,
 *    with no cast, and print both.
 * 2. Narrowing: convert `lengthCm` to an int and print it; then print the
 *    fractional part the conversion discarded, computed from `lengthCm` and
 *    your int.
 * 3. Convert `driftCm` (a negative value) to an int and print it.
 * 4. Convert `distanceMm` to an int and print it. Its value does not fit in
 *    an int.
 * 5. Print each line in exactly the format shown under "Expected output",
 *    using string concatenation (`"label: " + value`).
 * 6. Answer the questions below the class.
 * 7. Run the file and paste what it printed under "My output".
 *
 * Pass condition
 * Widening and narrowing outcomes are shown, including a value outside the
 * target range.
 */

public class Ex010 {
    public static void main(String[] args) {
        int boxes = 12;
        double lengthCm = 187.75;
        double driftCm = -2.75;
        double distanceMm = 3_000_000_000.0;

        // This line is rejected by javac; keep it commented out:
        // int noCast = lengthCm;

        // Your answer:

    }
}

// Your answer (questions):
// What does javac say about `int noCast = lengthCm;`, and why did steps 2-4
// need a cast while step 1 did not?
//
// Did the conversion of lengthCm and driftCm round, or cut? In which
// direction does it cut a negative number?
//
// Why is distanceMm as int not 3000000000?
//

// Expected output:
// boxes as long: 12
// boxes as double: 12.0
// lengthCm as int: 187
// discarded part: 0.75
// driftCm as int: -2
// distanceMm as int: 2147483647

// My output:
//
