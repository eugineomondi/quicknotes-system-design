// ---------- Element references ----------
const loadBtn = document.querySelector("#load-btn");
const status = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitBtn = document.querySelector("#submit-btn");

// ---------- Config ----------
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// ---------- State ----------
let notes = [];

// ---------- Helpers ----------
function setStatus(message, state = "") {
  status.textContent = message;
  status.className = state;
}

function renderNotes() {
  notesList.textContent = "";

  if (notes.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No notes yet.";
    notesList.appendChild(li);
    return;
  }

  for (const note of notes) {
    const li = document.createElement("li");
    li.className = "note-card";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "Delete";
    del.dataset.id = note.id;

    li.appendChild(title);
    li.appendChild(body);
    li.appendChild(del);
    notesList.appendChild(li);
  }
}

// ---------- Generic request helper ----------
async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  // DELETE returns no body in some cases
  if (response.status === 204) return null;
  return response.json();
}

// ---------- GET ----------
async function loadNotes() {
  loadBtn.disabled = true;
  setStatus("Loading notes...");

  try {
    const data = await request(`${API_URL}?_limit=10`);
    notes = data;
    renderNotes();
    setStatus(`Loaded ${data.length} notes from the server.`, "success");
  } catch (error) {
    setStatus(`Could not load notes: ${error.message}`, "error");
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadNotes);

// Boot
renderNotes();