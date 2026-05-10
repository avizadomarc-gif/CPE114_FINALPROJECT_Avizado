const { Book, Author, Member } = require('../models');

// GET /books
const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll({ include: [{ model: Author }] });
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

// GET /books/:id
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{ model: Author }, { model: Member }],
    });
    if (!book) {
      return res.status(404).json({ error: 'Not Found', message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// POST /books
const createBook = async (req, res, next) => {
  try {
    const { title, isbn, genre, publishedYear, copiesAvailable, authorId } = req.body;

    if (!title || !isbn || !authorId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'title, isbn, and authorId are required',
      });
    }

    const authorExists = await Author.findByPk(authorId);
    if (!authorExists) {
      return res.status(400).json({ error: 'Validation Error', message: 'Author not found with the given authorId' });
    }

    const book = await Book.create({ title, isbn, genre, publishedYear, copiesAvailable, authorId });
    res.status(201).json(book);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Validation Error', message: 'ISBN already exists' });
    }
    next(err);
  }
};

// PUT /books/:id
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Not Found', message: 'Book not found' });
    }
    const { title, isbn, genre, publishedYear, copiesAvailable, authorId } = req.body;
    await book.update({ title, isbn, genre, publishedYear, copiesAvailable, authorId });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// DELETE /books/:id
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Not Found', message: 'Book not found' });
    }
    await book.destroy();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
