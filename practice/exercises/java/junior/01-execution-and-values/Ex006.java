/*
 * Exercise 3 — JJ006 — Variables, declared types, initialization, and scope
 *
 * Task
 * Compute a basket subtotal from fixed prices: a local declared without a
 * value must receive it on both branches of a supplied if/else, a helper local
 * must live only inside a supplied inner block, and a supplied commented-out
 * line reads that helper after its block.
 *
 * What to do
 * 1. `discountCents` is declared for you without a value. Give it its value
 *    inside the supplied if/else: 50 when the customer has a member card,
 *    0 otherwise. Do not change its declaration.
 * 2. Inside the supplied inner block, declare a helper local named
 *    `applesLineCents` holding the cost of the apples, and use it to give
 *    `subtotalCents` its value: apples + bread - discount. The helper must
 *    exist only inside that block.
 * 3. Leave the commented-out line after the block commented, and write a
 *    comment under it saying why it would not compile.
 * 4. Print the subtotal in the format shown under "Expected output", run the
 *    file and paste what it printed under "My output".
 *
 * Pass condition
 * The file compiles with no local read before assignment; the branch-assigned
 * local has no dummy initial value; a comment says the commented-out read
 * fails because the variable's scope ended with its block; My output matches
 * the expected subtotal.
 */
public class Ex006 {
    public static void main(String[] args) {
        int applePriceCents = 120;
        int appleCount = 3;
        int breadPriceCents = 250;
        boolean hasMemberCard = true;

        int discountCents;
        if (hasMemberCard) {
            // Your answer:
            discountCents = 50;
        } else {
            // Your answer:
            discountCents = 0;
        }

        int subtotalCents;
        {
            // Your answer:
            int applesLineCents = appleCount* applePriceCents;
            subtotalCents = applesLineCents + breadPriceCents - discountCents;

        }
        // System.out.println("Apples: " + applesLineCents + " cents");
        // Your answer (why the line above would not compile):
        // the line would not compile because applesLineCents has block scope, so the variable does not exist
        // outside the inner block

        // Your answer (print the subtotal):
        System.out.println("Subtotal: %d cents".formatted(subtotalCents));
    }
}

// Expected output:
// Subtotal: 560 cents

// My output:
// Subtotal: 560 cents
