# Library System API

A comprehensive RESTful backend API for managing library operations including authors, books, members, and book borrowing transactions.

## 📋 About the Project

The Library System API is a RESTful backend application designed to manage a digital library's core operations — including tracking books, their authors, and library members, as well as handling book borrowing and return transactions. The system centralizes library data management, allowing any client application (web, mobile, or desktop) to create, read, update, and delete records for authors, books, and members.

### Key Features
- **Author Management**: Create, read, update, and delete author records
- **Book Management**: Manage books with ISBN, genre, publication year, and copy availability
- **Member Management**: Register and manage library members
- **Book Borrowing System**: Track book borrowings and returns with availability checks
- **Data Relationships**: Model one-to-many (Author→Books) and many-to-many (Members↔Books via Borrow) relationships
- **Input Validation**: Enforce business rules such as preventing borrowing when no copies are available
- **Error Handling**: Comprehensive error handling with meaningful HTTP status codes

## 🛠️ Tech Stack

| Technology  | Version   |
|-------------|-----------|
| Node.js     | v18+      |
| Express.js  | ^4.18.2   |
| Sequelize   | ^6.35.2   |
| MySQL2      | ^3.6.5    |
| dotenv      | ^16.3.1   |
| nodemon     | ^3.0.2    |

## 📦 Prerequisites

- Node.js v18 or higher installed
- MySQL server running (locally or remotely)
- A MySQL database created (e.g., `library_db`)
- npm or yarn package manager

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd library-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=library_db
DB_USER=root
DB_PASSWORD=yourpassword
PORT=3000
NODE_ENV=development
```

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The API will be available at `http://localhost:3000`

---

## Database Schema

### Table: `authors`

| Column      | Type         | Constraints         |
|-------------|--------------|---------------------|
| id          | INT          | PK, AUTO_INCREMENT  |
| name        | VARCHAR(150) | NOT NULL            |
| bio         | TEXT         | nullable            |
| nationality | VARCHAR(100) | nullable            |
| createdAt   | DATETIME     | auto                |
| updatedAt   | DATETIME     | auto                |

### Table: `books`

| Column          | Type         | Constraints         |
|-----------------|--------------|---------------------|
| id              | INT          | PK, AUTO_INCREMENT  |
| title           | VARCHAR(255) | NOT NULL            |
| isbn            | VARCHAR(20)  | NOT NULL, UNIQUE    |
| genre           | VARCHAR(100) | nullable            |
| publishedYear   | INT          | nullable            |
| copiesAvailable | INT          | NOT NULL, default 1 |
| authorId        | INT          | FK → authors.id     |
| createdAt       | DATETIME     | auto                |
| updatedAt       | DATETIME     | auto                |

### Table: `members`

| Column         | Type         | Constraints         |
|----------------|--------------|---------------------|
| id             | INT          | PK, AUTO_INCREMENT  |
| name           | VARCHAR(150) | NOT NULL            |
| email          | VARCHAR(200) | NOT NULL, UNIQUE    |
| phone          | VARCHAR(20)  | nullable            |
| membershipDate | DATEONLY     | NOT NULL            |
| createdAt      | DATETIME     | auto                |
| updatedAt      | DATETIME     | auto                |

### Table: `borrows` (Junction Table)

| Column     | Type                    | Constraints             |
|------------|-------------------------|-------------------------|
| id         | INT                     | PK, AUTO_INCREMENT      |
| memberId   | INT                     | FK → members.id         |
| bookId     | INT                     | FK → books.id           |
| borrowDate | DATEONLY                | NOT NULL                |
| returnDate | DATEONLY                | nullable                |
| status     | ENUM('borrowed','returned') | NOT NULL, default 'borrowed' |
| createdAt  | DATETIME                | auto                    |
| updatedAt  | DATETIME                | auto                    |

---

## Relationship Diagram (ER Diagram)

```
AUTHORS                  BOOKS                   BORROWS                MEMBERS
+----------+             +------------------+     +------------------+   +-----------+
| id (PK)  |◄────────────| authorId (FK)    |     | id (PK)          |   | id (PK)   |
| name     |   1      N  | id (PK)          |◄────| bookId (FK)      |   | name      |
| bio      |             | title            |     | memberId (FK)    |──►| email     |
| nationa..|             | isbn             |  N  |                  | 1 | phone     |
+----------+             | genre            |     | borrowDate       |   | membership|
                         | publishedYear    |     | returnDate       |   +-----------+
                         | copiesAvailable  |     | status           |
                         +------------------+     +------------------+

Relationships:
- Author has many Books (1-to-Many)
- Member borrows many Books; Book is borrowed by many Members (Many-to-Many via Borrow)
```

---

## API Reference

### Base URL
```
http://localhost:3000
```

---

### Authors

| Method | Path           | Request Body                              | Example Response            |
|--------|----------------|-------------------------------------------|-----------------------------|
| GET    | /authors       | —                                         | Array of author objects     |
| GET    | /authors/:id   | —                                         | Author with nested Books    |
| POST   | /authors       | `{ name*, bio, nationality }`             | Created author (201)        |
| PUT    | /authors/:id   | `{ name, bio, nationality }`              | Updated author              |
| DELETE | /authors/:id   | —                                         | `{ message: "..." }`        |

---

### Books

| Method | Path         | Request Body                                                      | Example Response         |
|--------|--------------|-------------------------------------------------------------------|--------------------------|
| GET    | /books       | —                                                                 | Array of books w/ Author |
| GET    | /books/:id   | —                                                                 | Book w/ Author & Members |
| POST   | /books       | `{ title*, isbn*, authorId*, genre, publishedYear, copiesAvailable }` | Created book (201)   |
| PUT    | /books/:id   | `{ title, isbn, genre, publishedYear, copiesAvailable, authorId }` | Updated book            |
| DELETE | /books/:id   | —                                                                 | `{ message: "..." }`     |

---

### Members

| Method | Path                   | Request Body                              | Example Response             |
|--------|------------------------|-------------------------------------------|------------------------------|
| GET    | /members               | —                                         | Array of member objects      |
| GET    | /members/:id           | —                                         | Member with borrowed Books   |
| POST   | /members               | `{ name*, email*, phone, membershipDate }` | Created member (201)        |
| PUT    | /members/:id           | `{ name, email, phone, membershipDate }`  | Updated member               |
| DELETE | /members/:id           | —                                         | `{ message: "..." }`         |
| POST   | /members/:id/borrow    | `{ bookId* }`                             | Borrow record (201)          |
| POST   | /members/:id/return    | `{ bookId* }`                             | Updated borrow record        |

`*` = required field

---

## Error Responses

All errors return JSON in the following format:

| Status | Meaning               | Example Body                                                   |
|--------|-----------------------|----------------------------------------------------------------|
| 400    | Bad Request / Validation Error | `{ "error": "Validation Error", "message": "name is required" }` |
| 404    | Record Not Found      | `{ "error": "Not Found", "message": "Book not found" }`       |
| 404    | Unknown Route         | `{ "error": "Not Found", "message": "Route GET /xyz does not exist" }` |
| 500    | Internal Server Error | `{ "error": "Internal Server Error", "message": "An unexpected error occurred" }` |

---

## Project Structure

```
library-api/
├── index.js                    # Entry point — Express app setup & DB sync
├── package.json
├── .env                        # Local credentials (not committed)
├── .env.example                # Placeholder credentials for reviewers
├── .gitignore
├── config/
│   └── database.js             # Sequelize instance
├── models/
│   ├── index.js                # Associations
│   ├── Author.js
│   ├── Book.js
│   ├── Member.js
│   └── Borrow.js               # Junction model
├── controllers/
│   ├── authorsController.js
│   ├── booksController.js
│   └── membersController.js
├── routes/
│   ├── authors.js
│   ├── books.js
│   └── members.js
├── middleware/
│   ├── logger.js               # Logs method, URL, timestamp
│   ├── notFound.js             # 404 catch-all
│   └── errorHandler.js         # Global error handler (4 params)
└── docs/
    └── postman_collection.json
```
