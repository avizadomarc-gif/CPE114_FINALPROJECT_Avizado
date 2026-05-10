const { Author, Book } = require('../models');

// GET /authors
const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.findAll();
    res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
};

// GET /authors/:id
const getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: [{ model: Book }],
    });
    if (!author) {
      return res.status(404).json({ error: 'Not Found', message: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
};

// POST /authors
const createAuthor = async (req, res, next) => {
  try {
    const { name, bio, nationality } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Validation Error', message: 'name is required' });
    }
    const author = await Author.create({ name, bio, nationality });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
};

// PUT /authors/:id
const updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Not Found', message: 'Author not found' });
    }
    const { name, bio, nationality } = req.body;
    await author.update({ name, bio, nationality });
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
};

// DELETE /authors/:id
const deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Not Found', message: 'Author not found' });
    }
    await author.destroy();
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
