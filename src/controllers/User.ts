// Dependencies
import { Request } from 'express'

// Controllers
import { generateToken } from './Auth'

//Models
import User from '../schemas/User'

// Get All Users
export async function search () {
  try {
    const users = await User.find();

    return { status: true, data: users }
  } catch (e) {
    return { status: false, data: [] }
  }
}

// create a New User
export async function create (req: Request) {
  try {
    const {
      username,
      address,
      email,
      phone,
      password
    } = req.body;

    // RegEx
    const regUser = /^[a-z0-9_-]{3,20}$/;
    const regEmail = /\b[\w.!#$%&’*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)*\b/;
    const regPass = /(?=^.{6,}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/;

    // Simple Validation
    if (address.length > 40) throw new Error('Invalid Address');
    else if (!username || !regUser.test(username)) throw new Error('Invalid Username');
    else if (!email || !regEmail.test(email)) throw new Error('Invalid Email');
    else if (!phone || phone.replace(/[^0-9]/g, '').length != 11) throw new Error('Invalid Phone');
    else if (!password || !regPass.test(password)) throw new Error('Invalid Password');

    // Validation
    const checkUser = await User.findOne({ username, email, phone });
    if (checkUser) {
      if (checkUser.username == username) throw new Error('Username Already in Use');
      else if (checkUser.username == email) throw new Error('E-mail Already in Use');
      else if (checkUser.username == phone) throw new Error('Phone Already in Use');
    }

    // Save
    const user = await User.create({
      username,
      address,
      email,
      phone,
      password
    });

    return {
      status: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id)
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: e.message
    };
  }
}

// Update a User
export async function update (req: Request) {
  try {
    const {
      id,
      _id,
      username,
      address,
      email,
      phone,
      password
    } = req.body;

    // RegEx
    const regUser = /^[a-z0-9_-]{3,20}$/;
    const regEmail = /\b[\w.!#$%&’*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)*\b/;
    const regPass = /(?=^.{6,}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/;

    // Simple Validation
    if (!_id && !id) throw new Error('ID is Required');
    else if (password && !regPass.test(password)) throw new Error('Invalid Password');
    else if (address && address.length > 40) throw new Error('Invalid Address');

    interface FieldsInterface {
      _id?: Object,
      username?: string,
      email?: string,
      phone?: string,
      password?: string,
      address?: string
    }

    const fields:FieldsInterface = {};

    if (username || email || phone) {
      fields._id = { $not: { $eq: (_id || id) } }

      // Validation
      if (username) {
        if (!regUser.test(username)) throw new Error('Invalid Username');
        else fields.username = username;
      }
      if (email)  {
        if (!regEmail.test(email)) throw new Error('Invalid Email');
        else fields.email = email;
      }
      if (phone)  {
        if (phone.replace(/[^0-9]/g, '').length != 11) throw new Error('Invalid Phone');
        else fields.phone = phone;
      }

      const checkUser = await User.findOne(fields);

      if (checkUser) {
        if (checkUser.username == username) throw new Error('Username Already in Use');
        else if (checkUser.email == email) throw new Error('E-mail Already in Use');
        else if (checkUser.phone == phone) throw new Error('Phone Already in Use');
      }

      delete fields._id;
    }

    if (password) fields.password = password;
    if (address) fields.address = address;

    // Update
    const user = await User.findOneAndUpdate(
      { _id: ( _id || id )},
      fields,
      { new: true }
    );

    return {
      status: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id)
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: e.message
    };
  }
}

// Delete a User
export async function del (req: Request) {
  try {
    const { _id, id } = req.body;

    if (!_id && !id) throw new Error('ID is Required');

    await User.findByIdAndDelete((_id || id));

    return { status: true };
  } catch (e) {
    return {
      status: false,
      msg: e.message
    }
  }
}