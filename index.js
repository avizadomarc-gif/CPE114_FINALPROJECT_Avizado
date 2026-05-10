require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
require('./models'); // initialize associations

const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authorRoutes = require('./routes/authors');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Body parser ──────────────────────────────────────────────────
app.use(express.json());

// ── Logger middleware ─────────────────────────────────────────────
app.use(logger);

// ── Routes ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Library System API is running 📚', version: '1.0.0' });
});

app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// ── 404 catch-all (must come after all routes) ────────────────────
app.use(notFound);

// ── Global error handler (4 params — must be last) ────────────────
app.use(errorHandler);

// ── Database sync & server start ─────────────────────────────────
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Library API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });
