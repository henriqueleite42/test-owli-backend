// Controllers
const Auth = require('./Auth');

//Models
const Message = require('../models/Message');
const User = require('../models/User');

module.exports = {
  search: async req  => {
    try {
      const { user } = req.query;

      if (!user) throw new Error('User is Required');

      const messages = await Message.find({
        $or: [
          { from: req.user, to: user },
          { from: user, to: req.user }
        ]
      })
      .sort({ sentAt: 1 })

      return {
        status: true,
        data: messages
      }
    } catch (e) {
      return {
        status: false,
        msg: e.message,
        data: []
      }
    }
  },

  create: async req => {
    try {
      const {
        to,
        msg
      } = req.body;

      // Simple Validation
      if (!to) {
        throw new Error('User Who Received The Message is Required');
      } else if (req.user == to) {
        throw new Error('You Can\'t Send a Message To Yourself');
      } else if (!msg || msg.length < 1 || msg.length > 500) {
        throw new Error('Invalid Message');
      }

      // Validation
      const users = await User.findOne({ _id: to }, {
        _id: 1,
        username: 1
      });

      if (!users) throw new Error('Invalid User');

      // Save
      const message = await Message.create({
        from: req.user,
        to,
        msg
      });

      return { status: true, data: message };
    } catch (e) {
      return {
        status: false,
        msg: e.message
      };
    }
  },

  getNotRead: async user => {
    try {
      const notRead = await Message.find(
        {
          to: user,
          readAt: { $exists: false }
        },
        {
          from: 1
        }
      );

      return notRead;
    } catch (e) {
      return [];
    }
  }
}