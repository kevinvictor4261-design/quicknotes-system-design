# QuickNotes Data Model & Database Specification

## Entities & Schema

### 1. `users`
* `id`: `INTEGER` (Primary Key, Auto-increment)
* `username`: `VARCHAR(50)` (NOT NULL, UNIQUE)
* `email`: `VARCHAR(255)` (NOT NULL, UNIQUE)
* `created_at`: `TIMESTAMP` (NOT NULL)

### 2. `notes`
* `id`: `INTEGER` (Primary Key, Auto-increment)
* `user_id`: `INTEGER` (Foreign Key referencing `users(id)`, NOT NULL)
* `title`: `VARCHAR(100)` (NOT NULL)
* `body`: `TEXT`
* `created_at`: `TIMESTAMP` (NOT NULL)
* `updated_at`: `TIMESTAMP` (NOT NULL)

### 3. `tags`
* `id`: `INTEGER` (Primary Key, Auto-increment)
* `name`: `VARCHAR(50)` (NOT NULL, UNIQUE)

### 4. `note_tags` (Junction Table)
* `note_id`: `INTEGER` (Foreign Key referencing `notes(id)`, NOT NULL)
* `tag_id`: `INTEGER` (Foreign Key referencing `tags(id)`, NOT NULL)
* Composite Primary Key: `(note_id, tag_id)`

---

## Relationships Explanation
* **Users to Notes (One-to-Many):** One user can create and own multiple notes, but each note belongs to exactly one user.
* **Notes to Tags (Many-to-Many):** A single note can have multiple descriptive tags (e.g., #work, #urgent), and a single tag can be applied to many different notes. This requires the `note_tags` junction table.

---

## CREATE TABLE Statements

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE note_tags (
  note_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (note_id, tag_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
Example SQL Queries
1. Retrieve all notes for a specific user
SQL
SELECT id, title, body, created_at 
FROM notes 
WHERE user_id = 1 
ORDER BY created_at DESC;
2. Retrieve all notes associated with a specific tag (JOIN query)
SQL
SELECT n.id, n.title, n.body 
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
JOIN tags t ON nt.tag_id = t.id
WHERE t.name = 'work';
3. Count total notes per user
SQL
SELECT u.username, COUNT(n.id) AS total_notes
FROM users u
LEFT JOIN notes n ON u.id = n.user_id
GROUP BY u.id, u.username;
Database Indexing
Index: CREATE INDEX idx_notes_user_id ON notes(user_id);

Reason: Because users frequently query their own personal list of notes (SELECT * FROM notes WHERE user_id = ?), indexing the user_id foreign key prevents full table scans and ensures lightning-fast retrieval even when the table grows to millions of rows.

SQL vs. NoSQL Architecture Decision
For the QuickNotes service, SQL (Relational Database) is chosen. Note-taking systems require rigid structural integrity, foreign key constraints (ensuring orphan notes cannot exist if a user is deleted), ACID transaction guarantees during note updates, and complex multi-table joins across tags and user ownership. A relational model guarantees this consistency, which is paramount for user data durability.