const { Member, Book, Borrow } = require('../models');

// GET /members
const getAllMembers = async (req, res, next) => {
  try {
    const members = await Member.findAll();
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};

// GET /members/:id
const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{ model: Book }],
    });
    if (!member) {
      return res.status(404).json({ error: 'Not Found', message: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (err) {
    next(err);
  }
};

// POST /members
const createMember = async (req, res, next) => {
  try {
    const { name, email, phone, membershipDate } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Validation Error', message: 'name and email are required' });
    }
    const member = await Member.create({ name, email, phone, membershipDate });
    res.status(201).json(member);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Validation Error', message: 'Email already exists' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation Error', message: err.errors.map(e => e.message).join(', ') });
    }
    next(err);
  }
};

// PUT /members/:id
const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Not Found', message: 'Member not found' });
    }
    const { name, email, phone, membershipDate } = req.body;
    await member.update({ name, email, phone, membershipDate });
    res.status(200).json(member);
  } catch (err) {
    next(err);
  }
};

// DELETE /members/:id
const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Not Found', message: 'Member not found' });
    }
    await member.destroy();
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /members/:id/borrow  — borrow a book
const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ error: 'Validation Error', message: 'bookId is required' });
    }

    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Not Found', message: 'Member not found' });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Not Found', message: 'Book not found' });
    }

    if (book.copiesAvailable < 1) {
      return res.status(400).json({ error: 'Validation Error', message: 'No copies available for this book' });
    }

    const borrow = await Borrow.create({ memberId: member.id, bookId: book.id, borrowDate: new Date() });
    await book.update({ copiesAvailable: book.copiesAvailable - 1 });

    res.status(201).json({ message: 'Book borrowed successfully', borrow });
  } catch (err) {
    next(err);
  }
};

// POST /members/:id/return  — return a book
const returnBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ error: 'Validation Error', message: 'bookId is required' });
    }

    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Not Found', message: 'Member not found' });
    }

    const borrow = await Borrow.findOne({
      where: { memberId: member.id, bookId, status: 'borrowed' },
    });

    if (!borrow) {
      return res.status(404).json({ error: 'Not Found', message: 'No active borrow record found for this member and book' });
    }

    await borrow.update({ status: 'returned', returnDate: new Date() });

    const book = await Book.findByPk(bookId);
    await book.update({ copiesAvailable: book.copiesAvailable + 1 });

    res.status(200).json({ message: 'Book returned successfully', borrow });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllMembers, getMemberById, createMember, updateMember, deleteMember, borrowBook, returnBook };
