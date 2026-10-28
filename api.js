const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.getElementById('load-btn');
const statusEl = document.getElementById('status');
const notesList = document.getElementById('notes-list');

let notesData = [];

// Reusable async request function
async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Render notes securely using textContent only
function renderNotes() {
  notesList.innerHTML = '';

  if (notesData.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-state';
    emptyLi.textContent = "Your notes list is empty.";
    notesList.appendChild(emptyLi);
    return;
  }

  notesData.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item';

    const titleH3 = document.createElement('h3');
    titleH3.textContent = note.title;

    const bodyP = document.createElement('p');
    bodyP.textContent = note.body;

    li.appendChild(titleH3);
    li.appendChild(bodyP);
    notesList.appendChild(li);
  });
}

// Load 10 notes via GET
async function loadNotes() {
  loadBtn.disabled = true;
  statusEl.textContent = "Loading notes...";
  statusEl.className = "status-loading";

  try {
    notesData = await request(`${API_URL}?_limit=10`);
    renderNotes();
    statusEl.textContent = `Loaded ${notesData.length} notes from the server.`;
    statusEl.className = "status-success";
  } catch (error) {
    statusEl.textContent = `Failed to load notes: ${error.message}`;
    statusEl.className = "status-error";
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener('click', loadNotes);
// Select Form Elements
const noteForm = document.getElementById('note-form');
const submitBtn = document.getElementById('submit-btn');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');

// Task 2: Create note (POST)
async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  // Validation: Title required, max 100 characters
  if (!title) {
    statusEl.textContent = "Error: Note title is required.";
    statusEl.className = "status-error";
    return;
  }
  if (title.length > 100) {
    statusEl.textContent = "Error: Title must be 100 characters or less.";
    statusEl.className = "status-error";
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = "Creating note...";
  statusEl.className = "status-loading";

  const payload = {
    title: title,
    body: body,
    userId: 1
  };

  try {
    const newNote = await request(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(payload)
    });

    /*
      NOTE ON JSONPLACEHOLDER:
      JSONPlaceholder simulates creation by returning id: 101, but does not 
      permanently store it on their backend. We prepend it to our local 
      'notesData' array so it appears immediately at the top of the UI.
    */
    notesData.unshift(newNote);
    renderNotes();

    statusEl.textContent = `Note created (status 201, id ${newNote.id}).`;
    statusEl.className = "status-success";

    // Clear form inputs
    noteForm.reset();
  } catch (error) {
    statusEl.textContent = `Failed to create note: ${error.message}`;
    statusEl.className = "status-error";
  } finally {
    submitBtn.disabled = false;
  }
}

// Event Listener for Form Submission
noteForm.addEventListener('submit', createNote);
// Updated renderNotes function with Delete button
function renderNotes() {
  notesList.innerHTML = '';

  if (notesData.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-state';
    emptyLi.textContent = "Your notes list is empty.";
    notesList.appendChild(emptyLi);
    return;
  }

  notesData.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item';

    const titleH3 = document.createElement('h3');
    titleH3.textContent = note.title;

    const bodyP = document.createElement('p');
    bodyP.textContent = note.body;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => deleteNote(note.id));

    li.appendChild(titleH3);
    li.appendChild(bodyP);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });
}

// Task 3: Delete note (DELETE)
async function deleteNote(id) {
  statusEl.textContent = `Deleting note ${id}...`;
  statusEl.className = "status-loading";

  try {
    await request(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    /*
      NOTE ON JSONPLACEHOLDER:
      JSONPlaceholder simulates deletion by returning status 200, 
      but it does not persist changes on their backend. We filter the deleted 
      note out of our local 'notesData' array and re-render the list.
    */
    notesData = notesData.filter(note => note.id !== id);
    renderNotes();

    statusEl.textContent = `Note ${id} deleted successfully (Status: 200 OK).`;
    statusEl.className = "status-success";
  } catch (error) {
    statusEl.textContent = `Failed to delete note ${id}: ${error.message}`;
    statusEl.className = "status-error";
  }
}