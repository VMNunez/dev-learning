# Coverage Verify — Java junior

Verdict: gaps
Coverage SHA-256: 212137ab34b0e8e99b6c2259206921868f3ec1f241077afeee63bd0ac46692d0
Verified: 2026-07-26

## Open gaps

- Array access and bounds — index elements with `[i]` and read length via the `.length` field (a field, not a method, unlike `String.length()` or `List.size()`), knowing that an out-of-range index throws `ArrayIndexOutOfBoundsException` [Collections and generics]
