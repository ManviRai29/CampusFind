# CampusFind – Student Lost & Found Portal

CampusFind is a lightweight full-stack web application designed to help students report, search, and manage lost and found items on campus.

The project uses a simple **HTML/CSS/JavaScript frontend**, a **Node.js + Express backend**, and a **JSON file as lightweight persistent storage**. It intentionally avoids frameworks, build tools, and external database services so that it remains easy to understand, run, and demonstrate as a portfolio project.

## Features

* 🔐 **Demo Login**

  * Simple login page with demo credentials
  * Client-side login/session handling

* 📋 **Lost & Found Dashboard**

  * Responsive grid of item cards
  * Pre-loaded sample data
  * Separate Lost and Found item types

* ➕ **Report an Item**

  * Item name
  * Category
  * Description
  * Location
  * Date
  * Image URL
  * Contact information

* 🔎 **Search & Filtering**

  * Live search
  * Filter by Lost/Found type
  * Filter by category
  * Empty-state handling when no items match

* 📄 **Item Details**

  * View complete information about an item
  * Contact Reporter action

* ✏️ **Item Management**

  * Edit existing items
  * Delete items
  * Delete confirmation dialog

* 🚪 **Logout**

  * Simple logout functionality
  * Returns the user to the login page

* 🖼️ **Image Handling**

  * Supports image URLs
  * Automatically displays a placeholder when an image fails to load

* ⚠️ **Error Handling**

  * API/server error state
  * Empty search-result state
  * Basic frontend validation

## Tech Stack

| Layer              | Technology                            |
| ------------------ | ------------------------------------- |
| **Frontend**       | HTML5, CSS3, Vanilla JavaScript       |
| **Backend**        | Node.js, Express.js                   |
| **Database**       | JSON file (`backend/data/items.json`) |
| **Authentication** | Hardcoded demo credentials            |
| **Architecture**   | REST API + Static Frontend            |

The Express server serves both the REST API and frontend files, allowing the entire application to run from **one server on one port**.

## Demo Credentials

Use the following credentials to access the application:

```text
Username: student
Password: 1234
```

> **Note:** These are demo credentials only. The project does not implement production authentication, password hashing, or server-side sessions.

## Project Structure

```text
CampusFind/
├── backend/
│   ├── data/
│   │   ├── db.js
│   │   └── items.json
│   ├── routes/
│   │   ├── auth.js
│   │   └── items.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── add-item.html
│   ├── item-details.html
│   ├── edit-item.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── addItem.js
│       ├── itemDetails.js
│       └── editItem.js
│
└── README.md
```

## How the Application Works

CampusFind follows a simple client-server architecture:

```text
┌─────────────────────────────┐
│        Frontend             │
│  HTML + CSS + JavaScript    │
└──────────────┬──────────────┘
               │
               │ REST API / HTTP
               ▼
┌─────────────────────────────┐
│      Node.js + Express      │
│        Backend Server       │
└──────────────┬──────────────┘
               │
               │ Read / Write
               ▼
┌─────────────────────────────┐
│      items.json             │
│   Lightweight Data Store    │
└─────────────────────────────┘
```

The frontend communicates with the Express REST API using JavaScript `fetch()` requests. The backend reads and writes item information to `backend/data/items.json`.

## API Endpoints

### Authentication

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| `POST` | `/api/auth/login` | Validate demo login credentials |

### Items

| Method   | Endpoint         | Description             |
| -------- | ---------------- | ----------------------- |
| `GET`    | `/api/items`     | Retrieve all items      |
| `GET`    | `/api/items/:id` | Retrieve a single item  |
| `POST`   | `/api/items`     | Create a new item       |
| `PUT`    | `/api/items/:id` | Update an existing item |
| `DELETE` | `/api/items/:id` | Delete an item          |

### Search & Filters

The item listing endpoint supports query parameters:

```text
GET /api/items?search=
GET /api/items?category=
GET /api/items?type=
```

Multiple filters can also be combined:

```text
GET /api/items?search=wallet&category=Accessories&type=Lost
```

## Prerequisites

Before running the project, make sure you have:

* **Node.js 16 or higher**
* **npm** (included with Node.js)
* A modern web browser

Check your installed versions:

```bash
node -v
npm -v
```

## Installation

### 1. Clone or Extract the Project

If you downloaded the ZIP file, extract it and open a terminal inside the `CampusFind` directory.

If using Git:

```bash
git clone <repository-url>
cd CampusFind
```

### 2. Navigate to the Backend

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

You should see output similar to:

```text
CampusFind server running at http://localhost:5000
Login page:            http://localhost:5000/index.html
Demo credentials ->    username: student | password: 1234
```

### 5. Open the Application

Open your browser and visit:

```text
http://localhost:5000
```

Log in using:

```text
Username: student
Password: 1234
```

You can then browse the dashboard, search and filter items, report new items, view details, edit/delete items, and log out.

## Changing the Port

The application runs on port `5000` by default.

You can use a different port by setting the `PORT` environment variable.

### Windows PowerShell

```powershell
$env:PORT=8080
npm start
```

### Linux / macOS

```bash
PORT=8080 npm start
```

The application will then be available at:

```text
http://localhost:8080
```

## Data Storage

CampusFind intentionally uses a JSON file instead of an external database.

Item data is stored in:

```text
backend/data/items.json
```

This provides simple persistence without requiring MySQL, PostgreSQL, MongoDB, or another database server.

Changes made through the application are saved to the JSON file and remain available after restarting the server.

### Resetting the Data

To reset the application to an empty state, replace the contents of:

```text
backend/data/items.json
```

with:

```json
[]
```

To restore the original demo dataset, restore the provided sample `items.json` file.

## Security & Project Scope

CampusFind is intended as a **learning and portfolio project**, not as a production-ready lost-and-found platform.

For simplicity, it currently uses:

* Hardcoded demo credentials
* Client-side session handling
* No password hashing
* No real user registration
* No server-side authentication/session management
* JSON-file storage instead of a production database

These decisions keep the application easy to understand and deploy locally.

## Error Handling

The application includes basic handling for common situations:

* Invalid login credentials
* API/server connection failures
* No search results
* Invalid or incomplete form input
* Missing items
* Failed image URLs
* Delete confirmation

## Future Improvements

Possible enhancements for a production-oriented version include:

* Real user registration and authentication
* Password hashing and secure sessions/JWT
* Role-based access control
* MySQL, PostgreSQL, or MongoDB integration
* Image upload and cloud storage
* Email or push notifications
* Item ownership and user profiles
* Advanced search and filtering
* Campus map/location integration
* Admin moderation dashboard
* Report/flag functionality
* Automated item matching
* Deployment with HTTPS and production security controls

## Learning Outcomes

This project demonstrates practical experience with:

* Frontend development using HTML, CSS, and Vanilla JavaScript
* REST API development with Node.js and Express
* CRUD operations
* Client-server communication using `fetch()`
* JSON-based data persistence
* Form handling and validation
* Search and filtering
* Basic authentication concepts
* Error and empty-state handling
* Responsive web design
* Organizing a full-stack project into frontend, backend, routes, and data layers

## Why CampusFind?

CampusFind demonstrates how a useful real-world problem can be addressed with a small and maintainable full-stack application without introducing unnecessary complexity.

The project is intentionally built with fundamental web technologies, making the codebase easy to understand, modify, and extend.

## License

This project is intended for educational and portfolio purposes.

