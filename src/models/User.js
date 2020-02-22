const mongoose = require('../config/db');
const bcrypt = require('bcryptjs');

const UserModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
    validate: {
      validator: name => /^[a-zA-Z0-9_-]{3,20}$/.test(name)
    }
  },
  address: {
    type: String,
    maxlength: 40,
    default: ''
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 35,
    required: true,
    unique: true,
    validate: {
      validator: email => /\b[\w.!#$%&’*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)*\b/.test(email)
    }
  },
  phone: {
    type: Number,
    validate: {
      validator: phone => {
        if (phone.toString().replace(/[^0-9]/g, '').length == 11) return true;
        else return false
      }
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
    unique: true,
    minlength: 6,
    maxlength: 30,
    validate: {
      validator: pass => /(?=^.{6,}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/.test(pass)
    }
  },
  created: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, { versionKey: false });

UserModel.pre('save', async function(next) {
  this.phone = this.phone.toString().replace(/[^0-9]/g, '');
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model('users', UserModel);