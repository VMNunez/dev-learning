/*
 * Exercise 2 — JJ004 — Compile-time vs runtime failure
 *
 * Task
 * Correct a program that compiles but calculates the wrong total, recording
 * why compilation did not detect it.
 *
 * What to do
 * 1. Run the file exactly as given. Paste what it printed under
 *    "Output before the fix" at the end of the file.
 * 2. Compare it with "Expected output": the line totals are right, the final
 *    total is not. Find the defect and correct it where "Your answer" marks
 *    it. Change only what is wrong.
 * 3. Fill in the explanation below the class.
 * 4. Run the corrected file and paste what it printed under "My output".
 *
 * Pass condition
 * A comment states the program compiled and ran without any exception yet
 * printed a wrong total, so no compiler check could catch it; the corrected
 * total matches Expected output.
 */

public class Ex004 {
    public static void main(String[] args) {
        int bookPrice = 12;
        int bookQuantity = 3;
        int penPrice = 2;
        int penQuantity = 5;
        int notebookPrice = 4;
        int notebookQuantity = 2;
        int shipping = 5;

        int booksLine = bookPrice * bookQuantity;
        int pensLine = penPrice * penQuantity;
        int notebooksLine = notebookPrice * notebookQuantity;

        // Your answer (correct the defect in this calculation):
        int total = booksLine + pensLine + booksLine + shipping;

        System.out.println("Books: " + booksLine);
        System.out.println("Pens: " + pensLine);
        System.out.println("Notebooks: " + notebooksLine);
        System.out.println("Shipping: " + shipping);
        System.out.println("Total: " + total);
    }
}

// Your answer (explanation):
// Did the original compile? Did it throw anything when it ran?
//
// Why could javac not detect this defect?
//

// Expected output:
// Books: 36
// Pens: 10
// Notebooks: 8
// Shipping: 5
// Total: 59

// Output before the fix:
//

// My output:
//
