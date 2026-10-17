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
        long boxesLong = boxes;
        System.out.println("boxes as long: " + boxesLong);
        double boxesDouble = boxes;
        System.out.println("boxes as double: " + boxesDouble);

        int lengthCmInt = (int) lengthCm;
        System.out.println("lengthCm as int: " + lengthCmInt);
        System.out.println("discarded part: " + (lengthCm - lengthCmInt));

        int driftCmInt = (int) driftCm;
        System.out.println("driftCm as int: " + driftCmInt);

        int distanceMmInt = (int) distanceMm;
        System.out.println("distanceMm as int: " + distanceMmInt);

    }
}

// Your answer (questions):
// What does javac say about `int noCast = lengthCm;`, and why did steps 2-4
// need a cast while step 1 did not?
// javac says "incompatible types: possible lossy conversion from double to int".
// Steps 2-4 are narrowing conversions (double to int): the value can lose its
// fractional part or not fit, so Java requires an explicit cast. Step 1 is
// widening (int to long/double): no information is lost, so it is implicit.
//
// Did the conversion of lengthCm and driftCm round, or cut? In which
// direction does it cut a negative number?
// It cuts: the fractional part is discarded, with no rounding. It always
// cuts toward zero, so -2.75 becomes -2, not -3.
//
// Why is distanceMm as int not 3000000000?
// Because 3000000000 is above the int range. A double that is too large is
// clamped to the largest int, Integer.MAX_VALUE (2147483647), with no error.

// Expected output:
// boxes as long: 12
// boxes as double: 12.0
// lengthCm as int: 187
// discarded part: 0.75
// driftCm as int: -2
// distanceMm as int: 2147483647

// My output:
// boxes as long: 12
// boxes as double: 12.0
// lengthCm as int: 187
// discarded part: 0.75
// driftCm as int: -2
// distanceMm as int: 2147483647
