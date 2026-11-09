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
// ---------- POST ----------
async function createNote(title, body) {
  submitBtn.disabled = true;
  setStatus("Creating note...");

  try {
    const created = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 }),
    });

    notes.unshift(created);
    renderNotes();
    setStatus(`Note created (status 201, id ${created.id}).`, "success");
    form.reset();
  } catch (error) {
    setStatus(`Could not create note: ${error.message}`, "error");
  } finally {
    submitBtn.disabled = false;
  }
}
// ---------- DELETE ----------
// NOTE: JSONPlaceholder does not actually persist created notes — any
// POST returns a fake object with id 101, and DELETE always succeeds
// against the fake store. So after DELETE we remove the note from the
// local array ourselves; a real API would already have removed it and
// the next GET would confirm it.
async function deleteNote(id, button) {
  button.disabled = true;
  setStatus("Deleting note...");

  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    notes = notes.filter((n) => n.id !== id);
    renderNotes();
    setStatus(`Note ${id} deleted.`, "success");
  } catch (error) {
    setStatus(`Could not delete note: ${error.message}`, "error");
    button.disabled = false;
  }
}

notesList.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;
  deleteNote(Number(btn.dataset.id), btn);
});
// ---------- Form submit ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    setStatus("Please enter a title.", "error");
    return;
  }
  if (title.length > 100) {
    setStatus("Title must be 100 characters or fewer.", "error");
    return;
  }

  createNote(title, body);
});
renderNotes();