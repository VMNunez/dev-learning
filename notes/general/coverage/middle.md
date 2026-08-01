# Middle Coverage — General Engineering

Framework-neutral concepts expected when a developer owns integration and operational decisions across features.

## API evolution and communication

- API versioning — evolve a contract through URL, header, or media-type strategies according to consumer independence
- OpenAPI contract governance — manage compatibility, validation, and generated consumers from a machine-readable description instead of only rendering documentation
- Redirect code selection — choose among `301`, `302`, `303`, `307`, and `308` from permanence and whether the original method and body must be preserved
- WebSockets vs Server-Sent Events — choose bidirectional or server-push communication from the actual interaction model
- GraphQL vs REST — compare client-selected graphs with resource-oriented HTTP contracts and their operational trade-offs

## Runtime and performance reasoning

- Caching layers — choose among browser, HTTP, application, and distributed caches and define invalidation after mastering HTTP freshness and validators
- Image tag vs digest — choose a movable version label or exact immutable image identity according to the deployment's reproducibility requirement
- Big O reasoning — compare time and space growth while recognising that real input sizes and constants still matter
- Functional-programming principles — apply purity, immutability, and composition where they reduce hidden state rather than as a style mandate
- Backpressure awareness — recognise when producers can outpace consumers in streams, queues, or real-time connections
- Request correlation and trace context — propagate identifiers across services so production logs and traces can reconstruct one distributed request
- Verification vs validation in testing — distinguish conformance to a specification from evidence that the delivered behaviour solves the intended user need
- Test-double boundary design — choose among dummy, stub, fake, mock, and spy roles and decide which dependency boundary should be replaced rather than treating every collaborator as a mock
