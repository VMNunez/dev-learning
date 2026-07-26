# Coverage Verify — Java junior

Verdict: gaps
Coverage SHA-256: cd2fea0375be7f34dab50decf298fa9b7c82121d0436d4160d548e6ff2b13f25
Verified: 2026-07-26

## Open gaps

- Floating-point behaviour and comparison — `double` and `float` cannot represent most decimals exactly, `==` on them is unreliable, `NaN` is not equal to itself, and floating-point division by zero yields `Infinity` or `NaN` while integer division by zero throws `ArithmeticException` [Strings and decimal values]
