# QuickNotes System Design & API Client

## Description
QuickNotes is a full-stack capstone project featuring a fully interactive vanilla JavaScript REST API client (`index.html`, `api.js`, `style.css`) and comprehensive production system design documentation (`docs/`) engineered to scale a note-taking application to 1 million users.

---

## How to Run the API Client
1. Clone the repository to your local machine.
2. Open the project folder in **Visual Studio Code**.
3. Install and open the **Live Server** extension.
4. Right-click `index.html` and select **Open with Live Server** to launch the app in your browser and test `GET`, `POST`, and `DELETE` operations.

---

## Documentation Links
* [API Design Specification](docs/api-design.md)
* [Data Model Specification](docs/data-model.md)
* [System Architecture & Scaling Plan](docs/architecture.md)

---

## What I Learned
1. **Asynchronous API Integration:** Mastered `fetch`, `async/await`, and robust error handling with `try/catch/finally` blocks to manage network latency and server errors gracefully.
2. **Security & DOM Manipulation:** Learned how to safely render dynamic content using `textContent` to prevent Cross-Site Scripting (XSS) vulnerabilities.
3. **Enterprise System Design:** Gained practical experience calculating traffic estimates (reads/writes per second), designing normalized relational database schemas with foreign keys and indexes, and architecting fault-tolerant cloud infrastructures with load balancers, CDNs, and database read replicas.