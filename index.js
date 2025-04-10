import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/AuthRoutes.js';
import tentRoutes from './routes/TentRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import loadRoutes from './routes/LoadRoutes.js';
import mutatedRoutes from './routes/MutatedRoutes.js';
import jobRoutes from './routes/JobRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

//MONGOOSE
mongoose.connect(process.env.MONGO_URI);

let connectionObj = mongoose.connection;

connectionObj.on('connected', () => {
  console.log('Connected to MongoDB');
});

connectionObj.on('error', () => {
  console.log('Error connecting to MongoDB');
});

//WEB SOCKETS
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  if (!onlineUsers.some((user) => user.username === username)) {
    onlineUsers.push({ username, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected from line 45`);

  socket.on('addUser', (username) => {
    console.log('USERNAME: ', username);
    addNewUser(username, socket.id);
    console.log('ONLINE USERS: ', onlineUsers);
  });

  socket.on('toggleItemComplete', async ({ part, user }) => {
    // console.log('Received toggleItemComplete event:', part, user);
    // Broadcast the update to all connected clients
    io.emit('itemToggled', { part, user });
  });

  // Notifications

  socket.on('sendNotification', ({ senderName, receiverNames, loadId, title, type }) => {
    // console.log("RECEIVER NAMES: ", receiverNames)
    receiverNames?.forEach((receiverName) => {
      const receiver = getUser(receiverName.username);

      // console.log("RECEIVERS ADDED IN SERVER: ", receiver)
      if (receiver) {
        console.log(`Sending notification to socketId: ${receiver.socketId}`);
        io.to(receiver?.socketId).emit('getNotification', {
          senderName,
          loadId,
          title,
          type,
        });
      }
    });
  });

  socket.on('orderNotification', ({ senderName, receiverNames, loadId, title, type }) => {
    // console.log("RECEIVER NAMES: ", receiverNames)
    receiverNames?.forEach((receiverName) => {
      const receiver = getUser(receiverName.username);

      // console.log("RECEIVERS ADDED IN SERVER: ", receiver)
      if (receiver) {
        console.log(`Sending notification to socketId: ${receiver.socketId}`);
        io.to(receiver?.socketId).emit('getOrderNotification', {
          senderName,
          loadId,
          title,
          type,
        });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    removeUser(socket.id);
    console.log('ONLINE USERS AFTER DISCONNECT: ', onlineUsers);
  });
});

//ROUTING
app.use('/api/auth', authRoutes);
app.use('/api/tents', tentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/mutated', mutatedRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/', (req, res) => {
  res.send('welcome to the server home page');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
