// Dependencies
import { NextFunction } from 'express'
import db from '../config/db'

// Relations
import './User'

// Interfaces
interface MessageInterface extends db.Document {
  msg: string,
  from: string,
  to: string,
  sentAt: Date,
  readAt: Date
}

// Schema
const MessageSchema = new db.Schema({
  msg: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  from: {
    type: db.Schema.Types.ObjectId,
    ref: "users"
  },
  to: {
    type: db.Schema.Types.ObjectId,
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

// Pre Save
MessageSchema.pre('save', function(next: NextFunction) {
  if (this.from === this.to) this.readAt = this.sentAt;

  next();
});

export default db.model<MessageInterface>('messages', MessageSchema)