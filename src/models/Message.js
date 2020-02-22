const mongoose = require('../config/db');

// Relations
require('./User');

const MessageModel = new mongoose.Schema({
  msg: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  sentAt: {
    type: Date,
    default: Date.now()
  },
  readAt: {
    type: Date
  }
}, { versionKey: false });

MessageModel.pre('save', async function(next) {
  if (this.from === this.to) this.readAt = this.sentAt;

  next();
});

module.exports = mongoose.model('messages', MessageModel);