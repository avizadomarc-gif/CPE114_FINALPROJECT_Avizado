const Author = require('./Author');
const Book = require('./Book');
const Member = require('./Member');
const Borrow = require('./Borrow');

// One-to-Many: Author has many Books; Book belongs to one Author
Author.hasMany(Book, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Book.belongsTo(Author, { foreignKey: 'authorId' });

// Many-to-Many: Members borrow many Books through Borrow junction
Member.belongsToMany(Book, { through: Borrow, foreignKey: 'memberId' });
Book.belongsToMany(Member, { through: Borrow, foreignKey: 'bookId' });

// Direct associations on Borrow for easy querying
Borrow.belongsTo(Member, { foreignKey: 'memberId' });
Borrow.belongsTo(Book, { foreignKey: 'bookId' });
Member.hasMany(Borrow, { foreignKey: 'memberId' });
Book.hasMany(Borrow, { foreignKey: 'bookId' });

module.exports = { Author, Book, Member, Borrow };
