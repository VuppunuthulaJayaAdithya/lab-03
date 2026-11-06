# Lab 03 – Books REST API

## Student Details

- **Name:** VUPPUNUTHULA JAYA ADITHYA
- **Registration Number:** 252U1R1259
- **Section:** 211

## Project Description

This project implements a Books REST API using Node.js, Express.js and SQLite. It supports CRUD operations, searching, sorting, pagination, price filtering and input validation.

## Features

- Get all books
- Search books by title
- Sort books by selected columns
- Pagination using limit and offset
- Filter books by minimum and maximum price
- Get a book by ID
- Create a new book with input validation
- Update an existing book
- Delete a book
- Appropriate HTTP status codes and JSON responses

## Technologies Used

- Node.js
- Express.js
- SQLite
- PowerShell
- Postman

## How to Run the Project

1. Open the project folder in VS Code.
2. Open the terminal.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   node server.js
   ```

5. Open the API:

   `http://localhost:3000/`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get book by ID |
| POST | `/books` | Create a book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

## Query Parameters

| Parameter | Description |
|---|---|
| `search_q` | Search books by title |
| `order_by` | Sort by id, title, author or price |
| `order` | ASC or DESC |
| `limit` | Maximum number of books |
| `offset` | Number of records to skip |
| `min_price` | Minimum book price |
| `max_price` | Maximum book price |

### Example

```text
http://localhost:3000/books?search_q=Java&order_by=price&order=ASC&limit=5&offset=0
```

## HTTP Status Codes

- **200** – Successful request
- **201** – Book created successfully
- **400** – Invalid input
- **404** – Book not found
- **500** – Internal server error

## Debugging

The following common debugging issues were addressed:

- Port conflict (`EADDRINUSE`)
- Incorrect database import path
- Incorrect table name
- Missing asynchronous handling

## Screenshots

Add your Postman and PowerShell execution screenshots inside the `screenshots` folder.

## Deployment

**Live URL:** Not deployed yet. The API was tested locally using PowerShell and Postman.

