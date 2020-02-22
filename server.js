const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV != 'production') {
  require('dotenv');
}

// Controllers
const User = require('./src/models/User');
const Message = require('./src/models/Message');

const app = express();

// Set CORS headers
app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./src/router')(app);

const server = require('http').createServer(app);
const io = require('socket.io').listen(server, {
  log: false,
  agent: false,
  origins: '*:*'
});

// Socket

const userList = {};
const socketList = {};
const socketByUser = {};

io.on('connect', socket => {
  socket.on('LOGIN', async user => {
    if (user.id.length > 0) {
      var newUser;

      if (socketByUser[user.id]) {
        newUser = userList[user.id];
        delete socketList[socketByUser[user.id].id];
        socketByUser[user.id].emit('NEW_LOGIN');
      } else {
        newUser = await User.findById(user.id);
      }

      if (newUser) {
        userList[newUser._id] = {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          messages: []
        };

        socketList[socket.id] = newUser._id;
        socketByUser[newUser._id] = socket;

        socket.broadcast.emit('ADD_USER', userList[newUser._id]);
        socket.emit('SET_USER_LIST', userList);
      }
    }
  });

  socket.on('SEND_MESSAGE', async msg => {
    const message = await Message.create(msg);

    if (message && socketByUser[message.to]) {
      socketByUser[message.to].emit('NEW_MESSAGE', message);

      if (msg.to != msg.from) {
        socketByUser[message.from].emit('NEW_MESSAGE', message);
      }
    }
  });

  const disconnect = () => {
    if (socketList[socket.id]) {
      socket.broadcast.emit('REMOVE_USER', socketList[socket.id]._id);

      delete socketList[socket.id];
    }
  };

  socket.on('LOGOUT', disconnect);
  socket.on('disconnect', disconnect);
});

// Start Server

server.listen(process.env.PORT);