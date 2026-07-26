# Coverage Verify — Spring Boot junior

Verdict: gaps
Coverage SHA-256: 2de211f12f97915dfcd4ced03554f2897e3012fc0d854f44463814594bd791e2
Verified: 2026-07-26

## Open gaps

- Service interface plus `Impl` implementation — recognise the pervasive maintained-codebase split where the injected type is an interface and the behaviour lives in a separate implementation class, and state what it buys for proxying and for substituting the collaborator in tests [Maintained-code recognition]
- Entity-to-DTO mapping implementation — decide between a hand-written mapping method and an annotation-processor-generated mapper whose implementation class only exists after a build, so a missing generated class is a build problem rather than missing code [REST controllers]
- Nested and collection cascading — constraints declared inside a nested object or on collection elements are evaluated only when the containing field is itself marked for cascading, so a validated outer DTO can silently accept an invalid inner payload [Request validation]
