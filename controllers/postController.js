const { connectDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');

// Post Something
const postSomething = tryCatch(async (req, res) => {
  const collection = await connectDB('collection_name');

  res.send({ message: 'Post' });
});

module.exports = {
  postSomething,
};
