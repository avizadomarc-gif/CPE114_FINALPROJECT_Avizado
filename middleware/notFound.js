const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} does not exist`,
  });
};

module.exports = notFound;
