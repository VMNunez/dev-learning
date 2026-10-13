/*
 * Exercise 4 — JJ007 — Primitive vs reference types
 *
 * Task
 * Copy a primitive and a supplied mutable reference, then compare the effect
 * of changing each copy.
 *
 * What to do
 * 1. Copy `stock` into a new int variable named `stockCopy`, then add 5 to
 *    `stockCopy` only.
 * 2. Copy `label` into a new StringBuilder variable named `labelCopy` by
 *    plain assignment (no `new`), then call `append("-fragile")` through
 *    `labelCopy` only.
 * 3. Print the four variables, one per line, in the format shown under
 *    "Expected output".
 * 4. Run the file and paste what it printed under "My output".
 *
 * Pass condition
 * After the changes the primitive copy and its original print different
 * values while both references print the same mutated content; My output
 * matches.
 */
public class Ex007 {
    public static void main(String[] args) {
        int stock = 10;
        StringBuilder label = new StringBuilder("box");

        // Your answer:
        int stockCopy = stock;
        stockCopy+=5;

        StringBuilder labelCopy = label;
        labelCopy = labelCopy.append("-fragile");

        System.out.println("stock = %d".formatted(stock));
        System.out.println("stockCopy = %d".formatted(stockCopy));
        System.out.println("label = %s".formatted(label));
        System.out.println("labelCopy = %s".formatted(labelCopy));

    }
}

// Expected output:
// stock = 10
// stockCopy = 15
// label = box-fragile
// labelCopy = box-fragile

// My output:
// stock = 10
// stockCopy = 15
// label = box-fragile
// labelCopy = box-fragile
