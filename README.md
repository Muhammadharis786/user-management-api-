# User Management REST API

A simple User Management REST API built with **Node.js** and **Express**, using **SQLite** (via Sequelize) for database persistence and **bcryptjs** for password hashing.

## Features
- Full CRUD for users: Create, Read (list + single), Update, Delete
- Request validation (`express-validator`)
- Consistent JSON responses
- Proper HTTP status codes (200, 201, 400, 404, 409, 500)
- Centralized error handling
- Passwords are hashed with bcrypt before being stored — never saved in plain text
- Passwords are never included in any API response
- Optional pagination on the list endpoint (`?page=1&limit=10`)

## Tech Stack
- Node.js + Express
- Sequelize ORM + SQLite (file-based database, no separate DB server needed)
- bcryptjs for password hashing
- express-validator for input validation

## Project Structure
```
user-management-api/
├── config/
│   └── db.js              # Sequelize + SQLite connection setup
├── controllers/
│   └── userController.js  # CRUD logic
├── middleware/
│   └── validate.js        # Validation rules + error formatter
├── models/
│   └── User.js             # User model (Sequelize schema)
├── routes/
│   └── userRoutes.js       # /api/users routes
├── server.js                # App entry point
├── package.json
└── README.md
```

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   The server runs on `http://localhost:3000` by default (override with a `PORT` env variable).

   A `database.sqlite` file will be created automatically the first time you run it — no separate database installation needed.

## API Endpoints

| Method | Endpoint            | Description         |
|--------|---------------------|----------------------|
| POST   | /api/users           | Create a new user    |
| GET    | /api/users           | List all users (supports `?page=&limit=`) |
| GET    | /api/users/:id        | Get a single user by ID |
| PUT    | /api/users/:id        | Update a user (full or partial) |
| PATCH  | /api/users/:id        | Update a user (partial) |
| DELETE | /api/users/:id        | Delete a user         |

### Example: Create a user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Haris","email":"haris@example.com","password":"secret123"}'
```

Response (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "Haris",
    "email": "haris@example.com",
    "createdAt": "2026-09-07T09:40:13.841Z",
    "updatedAt": "2026-09-07T09:40:13.841Z"
  }
}
```

### Example: Validation error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "A valid email is required" }
  ]
}
```

### Example: Not found (404)
```json
{
  "success": false,
  "message": "User with id 999 not found"
}
```

## Notes
- Passwords are hashed using bcrypt (10 salt rounds) before being saved.
- Passwords are always excluded from API responses.
- Duplicate emails are rejected with a 409 Conflict status.
- All unhandled errors are caught and return a 500 with a JSON error message instead of crashing the server.
