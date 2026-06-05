# EVALUATION — BitePlate Design Pattern Decisions

*Unit 27: Advanced Programming | Task 3c (Distinction)*

---

## Were the three patterns the best fit?

### Command Pattern (Kitchen Queue)
The Command pattern was an excellent fit for the kitchen queue. The core requirement — encapsulate kitchen actions as reversible objects — maps directly to Command's intent. Each `PrepareOrderCommand`, `CancelOrderCommand`, and `ReadyOrderCommand` stores its previous state, making `undo()` trivial to implement without the `KitchenQueue` needing to know the details of any action.

**Alternative considered: Chain of Responsibility.** This could route different order types through different kitchen stations (hot, cold, dessert). It was not chosen because the primary requirement was undo/redo, not routing. Chain of Responsibility could complement Command in a future multi-station enhancement (Scenario E in Task 4).

**Alternative considered: Queue data structure only.** A simple FIFO queue with status flags could simulate order progress but would require bespoke undo logic scattered across the codebase, violating the Open/Closed Principle.

### Singleton (Order History Log)
The Singleton is appropriate here because the entire business rationale for the history log is a single global audit trail: all subsystems (billing, kitchen, manager dashboard) must read from and write to the same record. Two separate instances would produce split, inconsistent logs.

**Alternative considered: Dependency Injection (DI).** Injecting a shared `OrderHistoryLog` instance through constructors would solve the same problem with better testability. In a production system with a DI container (e.g., InversifyJS), this would be the preferred approach.

**Alternative considered: Event Bus / Observer.** Orders could emit events that a listener writes to the log. This is more decoupled but adds indirection that makes debugging harder in a prototype context.

### Strategy (Pricing Engine)
The Strategy pattern is the canonical solution here. The requirement explicitly states "swap pricing algorithms at runtime without changing the Bill class," which is precisely what Strategy guarantees via the `PricingStrategy` interface. Adding a new pricing mode requires only a new concrete class — no changes to `Bill` or any existing strategy.

**Alternative considered: Template Method.** A base `PricingCalculator` class could define a fixed algorithm skeleton with overridable steps. This is less flexible than Strategy because the algorithm structure is fixed by the parent class — unsuitable when pricing rules are completely different (e.g., Happy Hour applies to everything, Loyalty Card applies a fixed amount for a free drink).

---

## Singleton Trade-offs: Testability & Thread Safety

**Testability problem:** Because `OrderHistoryLog.getInstance()` returns a module-level singleton, unit tests that run sequentially will share state between test cases. A test that appends a record will affect assertions in the next test. The conventional fix is to expose a `reset()` method for test environments only, or to use dependency injection so tests can pass a fresh instance.

**Thread safety:** Node.js is single-threaded, so the classic Singleton race condition (two threads simultaneously checking `_instance === null`) does not apply. In a multi-threaded environment (Java, C#), the naive implementation would require double-checked locking or an enum-based singleton. If BitePlate were ported to a Worker Threads model in Node.js, each worker would have its own memory space and a separate Singleton instance — breaking the "single log" guarantee. The solution there would be to use a shared database or message queue (Redis, PostgreSQL) as the log store, with the Singleton acting as a thin client wrapper.

---

## Scaling to 50 Restaurants

If BitePlate were deployed across a chain of 50 restaurants sharing one central database, the following design decisions would need to change:

1. **Singleton → Database-backed repository.** The in-memory `OrderHistoryLog` would be replaced by a PostgreSQL or MongoDB collection. The Singleton would become a repository class injected with a DB connection, keeping the same interface but persisting records durably. The "one instance" guarantee would be enforced by the database transaction layer, not JavaScript's module cache.

2. **In-memory order/table Maps → Database tables.** All `Map<string, Order>` stores would become database tables with indexing on `tableId`, `status`, and `createdAt` to support the date-range and table-filter queries.

3. **Command pattern → Persistent command log.** The command history (`_history` array) would be written to a `command_log` table so that undo operations survive server restarts and work across horizontally scaled API instances.

4. **Strategy pattern → Configuration-driven.** Pricing strategies would be configured per-branch in a database table rather than hard-coded, allowing the head office to set pricing rules for each franchise location without a code deployment.

5. **REST API → Event-driven microservices.** At scale, the monolithic Express server would split into services: Order Service, Kitchen Service, Billing Service, and Analytics Service. The Observer pattern (notifications between services) would be implemented via a message broker (RabbitMQ, Kafka) rather than in-process function calls.

---

*Word count: ~620 words*
