# QuickNotes Production REST API Specification

Base URL: `https://api.quicknotes.io/v1`

---

## REST Endpoints

### 1. List All Notes
* **Method:** `GET`
* **Path:** `/notes`
* **Description:** Retrieves a paginated list of notes belonging to the authenticated user.
* **Success Status Code:** `200 OK`

### 2. List Notes by Tag (Query Parameter)
* **Method:** `GET`
* **Path:** `/notes?tag=work`
* **Description:** Retrieves notes filtered by a specific category tag.
* **Success Status Code:** `200 OK`

### 3. Get a Single Note
* **Method:** `GET`
* **Path:** `/notes/{id}`
* **Description:** Retrieves full details for a specific note by its unique ID.
* **Success Status Code:** `200 OK`

### 4. Create a Note
* **Method:** `POST`
* **Path:** `/notes`
* **Description:** Creates a new note record for the authenticated user.
* **Success Status Code:** `201 Created`

### 5. Update a Note
* **Method:** `PUT` (or `PATCH`)
* **Path:** `/notes/{id}`
* **Description:** Updates an existing note's title, body, or tags.
* **Success Status Code:** `200 OK`

### 6. Delete a Note
* **Method:** `DELETE`
* **Path:** `/notes/{id}`
* **Description:** Permanently deletes a note record by ID.
* **Success Status Code:** `204 No Content`

---

## JSON Request & Response Examples

### Creating a Note (`POST /notes`)
* **Request Body:**
  ```json
  {
    "title": "Project Architecture Review",
    "body": "Review the microservices boundary and database scaling metrics with the team.",
    "tags": ["work", "backend"]
  }
 Response Body (201 Created):

JSON
{
  "id": 4821,
  "userId": 104,
  "title": "Project Architecture Review",
  "body": "Review the microservices boundary and database scaling metrics with the team.",
  "createdAt": "2026-10-24T10:00:00Z",
  "updatedAt": "2026-10-24T10:00:00Z"
}
Listing Notes (GET /notes)
Response Body (200 OK):

JSON
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "notes": [
    {
      "id": 4821,
      "title": "Project Architecture Review",
      "body": "Review the microservices boundary...",
      "createdAt": "2026-10-24T10:00:00Z"
    }
  ]
} {
  "error": "Bad Request",
  "status": 400,
  "message": "Validation failed: 'title' is required and must not exceed 100 characters."
}