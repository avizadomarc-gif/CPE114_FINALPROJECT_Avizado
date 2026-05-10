const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  publishedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  copiesAvailable: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
