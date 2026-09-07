# User Management REST API

A simple User Management REST API built with **Node.js** and **Express**, using **PostgreSQL** (via Sequelize) for database persistence and **bcryptjs** for password hashing.

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
- Sequelize ORM + PostgreSQL
- bcryptjs for password hashing
- express-validator for input validation

## Project Structure
```
user-management-api/
├── config/
│   └── db.js              # Sequelize + PostgreSQL connection setup
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
├── .env                      # Database credentials (not committed to Git)
└── README.md
```

## Setup & Run

1. Make sure PostgreSQL is installed and running locally, and that the target database already exists (Sequelize creates tables, not the database itself). Example:
   ```sql
   CREATE DATABASE mimic_demo;
   ```

2. Create a `.env` file in the project root with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=mimic_demo
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server runs on `http://localhost:3000` by default (override with the `PORT` env variable).

   On first run, Sequelize will automatically create the `app_users` table in the connected PostgreSQL database based on the User model.

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
- Database credentials are read from environment variables (`.env`) rather than hardcoded — the `.env` file is excluded from version control via `.gitignore`.
- Data is stored in the `app_users` table, kept separate from any other tables in the same database to avoid naming conflicts.

## Git Workflow
This project was version-controlled using Git and GitHub. `git status` was used throughout development to review changes before staging them with `git add`, and `git commit` was used with clear, descriptive messages at each meaningful stage (initial setup, database migration, feature additions). `git push` and `git pull` were used to sync with the remote repository, and `git clone` was used to verify the repository could be checked out cleanly.