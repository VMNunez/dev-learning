/*
 * Exercise 5 — JJ008 — `int` vs `long`
 *
 * Task
 * Calculate a population sum exceeding the int range with a suitable numeric
 * type.
 *
 * Data (people)
 *   India:  1428627663
 *   China:  1425671352
 *   World:  8045311447
 *
 * What to do
 * 1. Declare one variable per figure above, choosing the type of each and
 *    writing each literal so that the file compiles.
 * 2. Compute the combined population of India and China, and the population
 *    of the rest of the world (world minus that combined figure).
 * 3. Print both results in the format shown under "Expected output".
 * 4. Run the file and paste what it printed under "My output".
 *
 * Pass condition
 * Large literals compile and arithmetic preserves values beyond int range.
 */
public class Ex008 {
    public static void main(String[] args) {
        // Your answer:
        int indiaPopulation = 1428627663;
        int chinaPopulation = 1425671352;
        long worldPopulation = 8045311447L;

        long indiaAndChinaPopulation  =(long) indiaPopulation + chinaPopulation;
        long  restOfWorldPopulation = worldPopulation - indiaAndChinaPopulation;

        System.out.println("India + China: %d".formatted(indiaAndChinaPopulation));
        System.out.println("Rest of the world: %d".formatted(restOfWorldPopulation));
    }
}

// Expected output:
// India + China: 2854299015
// Rest of the world: 5191012432

// My output:
// India + China: 2854299015
// Rest of the world: 5191012432
