const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) res.json({ status: 401, msg: 'No Token Provided' });

  const parts = authHeader.split(' ');

  if (parts.length !== 2) res.json({ status: 401, msg: 'Token Malformated' });

  const [ scheme, token ] = parts;

  if (!token) res.json({ status: 401, msg: 'Token Malformated' });

  if (!/Bearer/i.test(scheme)) res.json({ status: 401, msg: 'Token Malformated' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) res.json({ status: 401, msg: 'Invalid Token' });

    req.user = decoded.id;

    return next();
  })
}