const { connectDB } = require('../../config/database');
const { ObjectId } = require('mongodb');
const { tryCatch } = require('../../utils/tryCatch');

// Delete Something
const deleteSomething = tryCatch(async (req, res) => {
  const collection = await connectDB('collection_name');

  res.send({ message: 'Delete' });
});

module.exports = { deleteSomething };
