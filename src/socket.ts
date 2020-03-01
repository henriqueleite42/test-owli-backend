// Dependencies
import http from 'http'
import SocketIO from 'socket.io'
import { Document } from 'mongoose'

// Models
import User from './schemas/User'
import Message from './schemas/Message'

// Interfaces
interface UserInterface {
  id: string,
  username: string,
  address: string,
  email: string,
  phone: number,
  password: string,
  created: string
}
interface NewUserInterface extends Document {
  _id: string,
  username: string,
  address: string,
  email: string,
  phone: number,
  password: string,
  created: string
}

class Socket {
  private socket: SocketIO.Socket
  private userList = {};
  private socketList = {};
  private socketByUser = {};

  public constructor (server: http.Server) {
    const io = SocketIO.listen(server, { origins: '*:*' });

    io.on('connect', socket => {
      this.socket = socket

      socket.on('LOGIN', this.login)
      socket.on('LOGOUT', this.disconnect)

      socket.on('SEND_MESSAGE', this.sendMessage)

      socket.on('disconnect', this.disconnect)
    })
  }

  private async login (user: UserInterface) {
    if (user.id.length > 0) {
      var newUser: NewUserInterface;

      if (this.socketByUser[user.id]) {
        newUser = this.userList[user.id];
        delete this.socketList[this.socketByUser[user.id].id];
        this.socketByUser[user.id].emit('NEW_LOGIN');
      } else {
        newUser = await User.findById(user.id);
      }

      if (newUser) {
        this.userList[newUser._id] = {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          messages: []
        };

        this.socketList[this.socket.id] = newUser._id;
        this.socketByUser[newUser._id] = this.socket;

        this.socket.broadcast.emit('ADD_USER', this.userList[newUser._id]);
        this.socket.emit('SET_USER_LIST', this.userList);
      }
    }
  }

  private async sendMessage (msg: Object) {
    const message = await Message.create(msg);

    if (message && this.socketByUser[message.to]) {
      this.socketByUser[message.to].emit('NEW_MESSAGE', message);

      if (message.to != message.from) {
        this.socketByUser[message.from].emit('NEW_MESSAGE', message);
      }
    }
  }

  private async disconnect () {
    if (this.socketList[this.socket.id]) {
      this.socket.broadcast.emit('REMOVE_USER', this.socketList[this.socket.id]._id);

      delete this.socketList[this.socket.id];
    }
  }
}

export default Socket