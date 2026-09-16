# CampusFind – Student Lost & Found Portal

A small, resume-worthy full-stack web app that lets students report and browse
lost/found items on campus. Built with a simple frontend + backend + lightweight
database architecture — no frameworks, no build tools, no unnecessary complexity.

## Tech Stack

| Layer      | Technology                                            |
|------------|--------------------------------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript (no build step)         |
| Backend    | Node.js + Express.js (REST API)                        |
| Database   | Lightweight JSON file storage (`backend/data/items.json`) |
| Auth       | Simple hardcoded demo login (no real user system)       |

The backend also serves the frontend as static files, so the whole app runs
from **one single server on one single port**.

## Features

- Login page with demo credentials shown on screen
- Dashboard with a responsive grid of Lost & Found item cards
- Add Item form (name, category, description, location, date, image URL, contact)
- Live search + filter by item type (Lost/Found) and category
- Item Details page with full info and a "Contact Reporter" action
- Edit and Delete reported items (with a delete confirmation dialog)
- Logout functionality
- Pre-loaded sample data (8 items) so the app looks populated immediately
- Empty state (no search results) and error state (API/server unreachable) handling
- Image fallback: if an image URL fails to load, a placeholder is shown automatically

## Demo Login Credentials

```
Username: student
Password: 1234
```

These are shown directly on the login page as well.

## Project Structure

```
CampusFind/
├── backend/
│   ├── data/
│   │   ├── db.js          # JSON-file read/write helper
│   │   └── items.json     # Sample data / "database"
│   ├── routes/
│   │   ├── auth.js        # POST /api/auth/login
│   │   └── items.js       # CRUD routes for /api/items
│   ├── server.js          # Express app entry point (serves API + frontend)
│   └── package.json
├── frontend/
│   ├── index.html          # Login page
│   ├── dashboard.html      # Lost & Found item listing
│   ├── add-item.html       # Report a new item
│   ├── item-details.html   # Full item details + contact
│   ├── edit-item.html      # Edit an existing item
│   ├── css/style.css
│   └── js/
│       ├── api.js          # Shared fetch/API helper
│       ├── auth.js         # Client-side session handling
│       ├── dashboard.js
│       ├── addItem.js
│       ├── itemDetails.js
│       └── editItem.js
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) version 16 or higher (includes npm)

Check your version:
```bash
node -v
npm -v
```

## Installation & Run Instructions

1. **Extract the ZIP file** and open a terminal in the extracted `CampusFind` folder.

2. **Move into the backend folder:**
   ```bash
   cd backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   You should see:
   ```
   CampusFind server running at http://localhost:5000
   Login page:            http://localhost:5000/index.html
   Demo credentials ->    username: student | password: 1234
   ```

5. **Open the app in your browser:**
   ```
   http://localhost:5000
   ```

6. **Log in** using the demo credentials above, then explore the dashboard,
   report a new item, view item details, edit/delete items, and log out.

> The server runs on port `5000` by default. To use a different port, set the
> `PORT` environment variable before starting, e.g. `PORT=8080 npm start`.

## API Endpoints (for reference)

| Method | Endpoint            | Description                          |
|--------|----------------------|---------------------------------------|
| POST   | `/api/auth/login`    | Validate demo credentials             |
| GET    | `/api/items`         | List items (supports `?search=&category=&type=`) |
| GET    | `/api/items/:id`     | Get a single item                     |
| POST   | `/api/items`         | Create a new item                     |
| PUT    | `/api/items/:id`     | Update an existing item               |
| DELETE | `/api/items/:id`     | Delete an item                        |

## Notes

- This project intentionally uses a **JSON file as the database** and a
  **hardcoded demo login** to keep things lightweight and easy to run —
  there is no real authentication, hashing, or session management, and no
  external database server is required.
- Data changes (add/edit/delete) are saved to `backend/data/items.json` and
  persist across server restarts. Delete that file's contents (reset to `[]`)
  or restore the original sample data to reset the app to its initial state.
- No AI, payments, maps, notifications, or other heavy features are included
  by design — this project is meant to stay small and portfolio-friendly.
