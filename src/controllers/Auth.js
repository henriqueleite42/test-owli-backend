const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Models
const User = require('../models/User');

const Auth = {
  generatorToken: id => jwt.sign({ id }, process.env.SECRET, { expiresIn: 86400 }),

  auth: async req => {
    try {
      const { user, password } = req.body;

      if (!user) throw new Error('Invalid User');
      if (!password) throw new Error('Invalid Password');

      const userLogged = await User.findOne({
        $or: [{ email: user }, { username: user }]
      }).select('+password');

      if (!userLogged) throw new Error('User Not Found');

      if (!await bcrypt.compare(password, userLogged.password)) throw new Error('Invalid Password');

      return {
        status: true,
        user: {
          id: userLogged._id,
          username: userLogged.username,
          email: userLogged.email,
          phone: userLogged.phone,
          address: userLogged.address,
          token: Auth.generatorToken(userLogged._id)
        }
      }
    } catch (e) {
      return {
        status: false,
        msg: e.message
      }
    }
  }
}

module.exports = Auth;