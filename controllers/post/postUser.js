const { connectDB } = require('../../config/database');
const { ObjectId } = require('mongodb');
const { tryCatch } = require('../../utils/tryCatch');

// Post Something
const postUser = tryCatch(async (req, res) => {
  const { name, email, photoURL } = req.body;

  const collection = await connectDB('users');

  const isExistsUser = await collection.findOne({ email });

  if (!isExistsUser) {
    const result = await collection.insertOne({ name, email, photoURL });
    return res.send(result);
  }

  res.send({ acknowledged: true, message: 'User already exists.' });
});

module.exports = {
  postUser,
};
