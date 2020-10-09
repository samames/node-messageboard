const express = require('express');
const app = express();
require('dotenv').config({ path: './utils/.env' });
const socketio = require('socket.io');
const { connectedUsers, getKeyByValue } = require('./utils/connectedUsers');
const PORT = process.env.PORT || 5000;
require('./utils/db.js');
// routes
const userRouter = require('./routers/users');
const boardRouter = require('./routers/boards');
const postRouter = require('./routers/posts');
const messageRouter = require('./routers/messages');
app.use(express.json());
app.use(userRouter);
app.use(boardRouter);
app.use(postRouter);
app.use(messageRouter);

const expressServer = app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});

const io = socketio(expressServer);
app.io = io;
const rooms = {};

io.on('connection', (socket) => {
  socket.emit('messageFromServer');
  socket.on('messageToServer', (dataFromClient) => {
    connectedUsers[dataFromClient.username] = socket;
    console.log(Object.keys(connectedUsers), '32');
    io.emit('usersOnline', Object.keys(connectedUsers));
  });
  socket.on('join', ({ username, room }) => {
    socket.join(room);
    socket.emit('message', 'Welcome!');
    socket.broadcast
      .to(room)
      .emit('message', `${username} has joined the room!`);
  });
  socket.on('messageRoom', ({ username, room, message }) => {
    socket.broadcast.to(room).emit('message', `${username}: ${message}`);
  });
  socket.on('call', ({ username, id }) => {
    if (connectedUsers[username]) {
      connectedUsers[username].emit('recieveCall', id);
      console.log('online emitted');
    } else {
      socket.emit('userOff');
      console.log('offline emitted');
    }
  });
  socket.on('disconnect', () => {
    const key = getKeyByValue(connectedUsers, socket);
    delete connectedUsers[key];
    socket.disconnect(true);
    console.log(Object.keys(connectedUsers), '58');
    io.emit('usersOnline', Object.keys(connectedUsers));
  });

  socket.on('join room', (roomID) => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit('other user', otherUser);
      socket.to(otherUser).emit('user joined', socket.id);
    }
  });

  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', (incoming) => {
    io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  });
});
