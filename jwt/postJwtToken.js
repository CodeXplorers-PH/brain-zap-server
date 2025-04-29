const jwt = require('jsonwebtoken');

const postJwtToken = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required!' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '31d',
  });

  res.send({ token });
};

module.exports = { postJwtToken };
