// Dependencies
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Request } from 'express'

// Models
import User from '../schemas/User'

// Enable Environment Variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Generate a Token thar contains the User ID
export function generateToken (id: mongoose.Schema.Types.ObjectId) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: 86400 })
}

// Validate User Login
export async function auth (req: Request) {
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
        token: generateToken(userLogged._id)
      }
    }
  } catch (e) {
    return {
      status: false,
      msg: e.message
    }
  }
}