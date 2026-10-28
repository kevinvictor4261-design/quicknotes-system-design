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