# Coverage Verify — Java junior

Verdict: gaps
Coverage SHA-256: 1eb8aae194e75b06d0fb853deda965c823b9e36f49720289318ccc28b7edb866
Verified: 2026-07-26

## Open gaps

- String and number conversion — parse text into numbers with `Integer.parseInt` / `Integer.valueOf` and render with `String.valueOf`, knowing malformed input throws the unchecked `NumberFormatException` [Strings and decimal values]
- Anonymous inner classes — recognise inline implementations such as `new Runnable() {...}` or `new Comparator<>() {...}` in maintained code and read them as the pre-lambda form of a functional-interface instance [Classes and object-oriented behaviour]
- Text blocks — read a triple-quoted `"""` multi-line String literal as ordinary String content used for embedded JSON, SQL, or HTML in modern (Java 17+) code [Strings and decimal values]
- Map accumulator idioms — use `getOrDefault` and `computeIfAbsent` for the common count-or-group pattern instead of manual null checks, distinguishing a missing key from one mapped to `null` [Collections and generics]
