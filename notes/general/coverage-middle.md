# Middle Coverage — General Engineering

Framework-neutral concepts expected when a developer owns integration and operational decisions across features.

## API evolution and communication

- API versioning — evolve a contract through URL, header, or media-type strategies according to consumer independence
- OpenAPI as a shared contract — use machine-readable API descriptions for documentation, validation, and client generation
- WebSockets vs Server-Sent Events — choose bidirectional or server-push communication from the actual interaction model
- GraphQL vs REST — compare client-selected graphs with resource-oriented HTTP contracts and their operational trade-offs

## Runtime and performance reasoning

- Caching layers — distinguish browser, HTTP, application, and distributed caches and define invalidation before adding one
- Big O reasoning — compare time and space growth while recognising that real input sizes and constants still matter
- Functional-programming principles — apply purity, immutability, and composition where they reduce hidden state rather than as a style mandate
- Backpressure awareness — recognise when producers can outpace consumers in streams, queues, or real-time connections
