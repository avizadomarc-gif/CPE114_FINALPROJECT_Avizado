const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  borrowBook,
  returnBook,
} = require('../controllers/membersController');

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

// Relationship endpoints (Many-to-Many)
router.post('/:id/borrow', borrowBook);
router.post('/:id/return', returnBook);

module.exports = router;
