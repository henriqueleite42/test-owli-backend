// Dependencies
import { Request } from 'express'

//Models
import Message from '../schemas/Message'
import User from '../schemas/User'

// Get All Messages from an User to another
export async function search (req: Request) {
  try {
    const { user } = req.query;

    if (!user) throw new Error('User is Required');

    const messages = await Message.find({
      $or: [
        { from: req.body.USER, to: user },
        { from: user, to: req.body.USER }
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
}

// Create a New Message
export async function create (req: Request) {
  try {
    const {
      to,
      msg
    } = req.body;

    // Simple Validation
    if (!to) {
      throw new Error('User Who Received The Message is Required');
    } else if (req.body.USER == to) {
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
      from: req.body.USER,
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
}

// Get Unread Messages
export async function getNotRead (user: string) {
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
