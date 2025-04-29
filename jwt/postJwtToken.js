const jwt = require('jsonwebtoken');

const postJwtToken = (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '31d',
  });

  res.send({ token: `Bearer ${token}` });
};

module.exports = { postJwtToken };
