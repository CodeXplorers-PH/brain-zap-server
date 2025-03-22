const { connectDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');

// Put Something
const putSomething = tryCatch(async (req, res) => {
  const collection = await connectDB('collection_name');

  res.send({ message: 'Put' });
});

module.exports = {
  putSomething,
};
