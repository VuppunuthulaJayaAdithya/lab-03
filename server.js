const express = require('express');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// HOME ROUTE
app.get('/', (req, res) => {
    res.json({
        message: 'Books REST API is running'
    });
});


// GET ALL BOOKS WITH SEARCH, SORTING AND FILTERING
app.get('/books', (req, res) => {

    let {
        search_q = '',
        order_by = 'id',
        order = 'ASC',
        limit = '10',
        offset = '0',
        min_price,
        max_price
    } = req.query;

    const allowedColumns = ['id', 'title', 'author', 'price'];

    if (!allowedColumns.includes(order_by)) {
        order_by = 'id';
    }

    order = order.toUpperCase();

    if (!['ASC', 'DESC'].includes(order)) {
        order = 'ASC';
    }

    limit = Number(limit);
    offset = Number(offset);

    if (
        !Number.isInteger(limit) || limit < 1 ||
        !Number.isInteger(offset) || offset < 0
    ) {
        return res.status(400).json({
            message: 'Invalid limit or offset'
        });
    }

    let sql = 'SELECT * FROM books WHERE 1=1';
    let params = [];

    // SEARCH BY TITLE
    if (search_q) {
        sql += ' AND title LIKE ?';
        params.push(`%${search_q}%`);
    }

    // MINIMUM PRICE
    if (min_price !== undefined) {
        if (min_price === '' || !Number.isFinite(Number(min_price))) {
            return res.status(400).json({
                message: 'Invalid minimum price'
            });
        }

        sql += ' AND price >= ?';
        params.push(Number(min_price));
    }

    // MAXIMUM PRICE
    if (max_price !== undefined) {
        if (max_price === '' || !Number.isFinite(Number(max_price))) {
            return res.status(400).json({
                message: 'Invalid maximum price'
            });
        }

        sql += ' AND price <= ?';
        params.push(Number(max_price));
    }

    // VALIDATE PRICE RANGE
    if (
        min_price !== undefined &&
        max_price !== undefined &&
        Number(min_price) > Number(max_price)
    ) {
        return res.status(400).json({
            message: 'Minimum price cannot exceed maximum price'
        });
    }

    // SORTING AND PAGINATION
    sql += ` ORDER BY ${order_by} ${order} LIMIT ? OFFSET ?`;

    params.push(limit, offset);

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(rows);
    });
});


// GET BOOK BY ID
app.get('/books/:id', (req, res) => {
    db.get(
        'SELECT * FROM books WHERE id = ?',
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.json(row);
        }
    );
});

// CREATE BOOK
app.post('/books', (req, res) => {
    const { title, author, price } = req.body;

    if (!title || !author || title.trim() === '' || author.trim() === '') {
        return res.status(400).json({
            message: 'Title and author are required'
        });
    }

    if (
        price === undefined ||
        price === null ||
        price === '' ||
        !Number.isFinite(Number(price))
    ) {
        return res.status(400).json({
            message: 'Price must be a valid number'
        });
    }

    db.run(
        'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
        [title, author, Number(price)],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: 'Book created successfully',
                id: this.lastID
            });
        }
    );
});
// UPDATE BOOK
app.put('/books/:id', (req, res) => {
    const { title, author, price } = req.body;
    const id = req.params.id;

    db.run(
        'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?',
        [title, author, price, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.json({
                message: 'Book updated successfully'
            });
        }
    );
});
// DELETE BOOK
app.delete('/books/:id', (req, res) => {
    const id = req.params.id;

    db.run(
        'DELETE FROM books WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.json({
                message: 'Book deleted successfully'
            });
        }
    );
});

// START SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});