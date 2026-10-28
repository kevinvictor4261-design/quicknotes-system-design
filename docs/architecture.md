# QuickNotes System Architecture & Scaling Plan

## Requirements

### Functional Requirements
* Users can register, log in, and securely manage their notes.
* Users can create, read, update, and delete (CRUD) notes.
* Notes can be tagged and filtered.

### Non-Functional Requirements
* **High Availability:** 99.99% uptime.
* **Low Latency:** Feed and note list loads under 100ms.
* **Durability:** Zero data loss for saved notes.

---

## Load Estimates (1 Million Users)
* **Daily Active Users (DAU):** 10% of 1,000,000 = 100,000 active users/day.
* **Writes (Note creations/updates):** Assume each active user creates/updates 5 notes per day.
  * $100,000 \times 5 = 500,000\text{ writes/day} \approx \mathbf{5.8\text{ writes/sec}}$
* **Reads (Note views):** Assume each active user views their note lists 30 times per day.
  * $100,000 \times 30 = 3,000,000\text{ reads/day} \approx \mathbf{34.7\text{ reads/sec}}$ (Peak at $5\times = \mathbf{\sim174\text{ reads/sec}}$)
* **Storage per Year:** Assume average note size is 2 KB.
  * $500,000\text{ writes/day} \times 2\text{ KB} = 1,000,000\text{ KB/day} \approx 1\text{ GB/day} \approx \mathbf{365\text{ GB/year}}$

---

## Architecture Diagram

```text
[ Clients / Web & Mobile Apps ]
               │
               ▼
         [ DNS (Route 53) ]
               │
               ▼
         [ CDN (Cloudflare) ] ──(Cached Static Assets)
               │
               ▼
     [ Load Balancer (Nginx / ALB) ]
               │
       ┌───────┴───────┐
       ▼               ▼
    [ App Server 1 ] [ App Server 2 ] ──(Cache: Redis)
       │                       │
       ├───────────────────────┼─────────────┐
       ▼                       ▼             ▼
  [ Primary DB ]       [ Read Replica ]  [ Message Queue (RabbitMQ) ]
  (Writes / Updates)   (Read Queries)    (Background Sync / Analytics)
  Component Explanations
DNS: Resolves domain names to IP addresses, routing users to the nearest edge location.

CDN: Caches and serves static frontend assets (HTML, CSS, JS) globally with minimal latency.

Load Balancer: Distributes incoming API traffic across multiple application servers to prevent overloading.

App Servers: Stateless compute nodes running backend application logic and request validation.

Cache (Redis): In-memory data store for caching user session tokens and recent note queries.

Primary Database: Handles all transactional write operations (INSERT, UPDATE, DELETE).

Read Replica: Synchronized read-only database copy that absorbs high-volume read traffic.

Message Queue & Worker: Handles asynchronous background jobs (such as export tasks or search indexing) outside the request thread.

Step-by-Step Request Flows
1. GET /notes Flow
Client sends request to Load Balancer.

Load Balancer routes request to an App Server.

App Server checks Redis cache for pre-computed user note lists. If cached, returns immediately.

If cache miss, App Server queries the Database Read Replica and populates the cache.

Response returned to client.

2. POST /notes Flow
Client sends POST request with title and body to Load Balancer.

App Server validates authentication token and payload length.

App Server executes INSERT statement on the Primary Database.

Primary Database replicates the new record to the Read Replica.

App Server invalidates user cache in Redis and returns 201 Created response.

Trade-offs & Single Points of Failure (SPOF) Prevention
Trade-off: Eventual Consistency on Read Replicas vs. Primary DB Load. We route reads to replicas to scale read traffic, meaning a newly created note might take a fraction of a second to appear if queried against a lagging replica.

Avoiding SPOFs:

App Servers: Deployed across multiple redundant instances behind a load balancer. If one server crashes, traffic automatically routes to healthy servers.

Database: Configured with automated failover from the Primary DB to the Standby Read Replica if the primary node fails.