# QuickNotes System Design

QuickNotes is a note-taking service being prepared for 1 million
users. This repository contains two halves: a **working API client**
that proves the front end can talk to a REST API (using the
JSONPlaceholder practice API), and the **system design documents**
the backend team will build from — API design, data model, and
architecture.

## Documentation

- [API design](docs/api-design.md) — the real QuickNotes REST API
- [Data model](docs/data-model.md) — tables, relationships, SQL, and index
- [Architecture](docs/architecture.md) — requirements, estimates, diagram, flows

## How to run the API client

1. Clone the repository:
   `git clone https://github.com/your-username/quicknotes-system-design.git`
2. Open the folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The app opens in your browser. Click **Load notes** to fetch 10
   sample notes from JSONPlaceholder, use the form to create a new
   note, and click **Delete** on any card to remove it.

> Note: JSONPlaceholder is a **practice** API — it does not actually
> store anything. New notes return a fake id (101), and DELETE always
> succeeds. The client removes deleted notes from its local array so
> the UI stays consistent.

You can also just double-click `index.html` to open it directly.

## What I learned

- How to build a real API client with `fetch`, `async`/`await` and a
  reusable `request()` helper that handles `response.ok`.
- How to design a REST API with consistent endpoints, status codes,
  and a uniform error body.
- How to model a small but realistic schema in SQL, including a
  many-to-many join table and a composite primary key.
- How to estimate load (reads/s, writes/s, storage/year) and reason
  about whether a system is read-heavy or write-heavy.
- How to identify single points of failure and design around them
  with redundancy and fallbacks.