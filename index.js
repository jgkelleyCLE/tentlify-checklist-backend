import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/AuthRoutes.js'
import tentRoutes from './routes/TentRoutes.js'
import userRoutes from './routes/UserRoutes.js'
import loadRoutes from './routes/LoadRoutes.js'
import mutatedRoutes from './routes/MutatedRoutes.js'
import jobRoutes from './routes/JobRoutes.js'
import { Server } from 'socket.io'
import http from 'http'


const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001;

//MONGOOSE
mongoose.connect(process.env.MONGO_URI)

let connectionObj = mongoose.connection

connectionObj.on('connected', ()=> {
    console.log('Connected to MongoDB')
})

connectionObj.on("error", ()=> {
    console.log('Error connecting to MongoDB')
})

// Function to get part by ID
// const getPartById = async (partId) => {
//     try {
//         const tent = await MutatedTent.findOne({ 'parts._id': partId }).populate('parts.completedBy');
//         if (!tent) return null;
//         const part = tent.parts.id(partId);
//         return part;
//     } catch (error) {
//         console.error('Error fetching part by ID:', error);
//         return null;
//     }
// };



//WEB SOCKETS
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})

let onlineUsers = []

const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
      onlineUsers.push({ username, socketId });
  };
  
  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
  };


io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected from line 45`);

    socket.on('toggleItemComplete', async({ part, user }) => {
        console.log('Received toggleItemComplete event:', part, user);
        // Broadcast the update to all connected clients
        io.emit('itemToggled', { part, user });

        
    });

     // Notifications
     socket.on('addUser', (username)=> {
        console.log("USERNAME: ", username)
        addNewUser(username, socket.id)
        console.log("ONLINE USERS: ", onlineUsers);
    })

    // socket.on("sendNotification", ({ senderName, receiverName, loadId, title,  }) => {
    //     const receiver = getUser(receiverName);
    //     io.to(receiver?.socketId).emit("getNotification", {
    //       senderName,
    //       loadId,
    //       title,

    //     });
    //   });

    socket.on("sendNotification", ({ senderName, receiverNames, loadId, title }) => {

        console.log("RECEIVER NAMES: ", receiverNames)
        receiverNames.forEach(receiverName => {
          const receiver = getUser(receiverName.username);

          console.log("RECEIVERS ADDED IN SERVER: ", receiver)
          if (receiver) {
            io.to(receiver?.socketId).emit("getNotification", {
              senderName,
              loadId,
              title
            });
          }
        });
      });


    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // socket.on('disconnect', () => {
    //     console.log('A user disconnected');
    //     // Remove the disconnected user's socket ID from the map
    //     for (const [userId, socketId] of Object.entries(userSocketMap)) {
    //         if (socketId === socket.id) {
    //             delete userSocketMap[userId];
    //             console.log(`User ${userId} with socket ID ${socket.id} removed from userSocketMap`);
    //             break;
    //         }
    //     }
    // });
});


//ROUTING
app.use('/api/auth', authRoutes)
app.use('/api/tents', tentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/loads', loadRoutes)
app.use('/api/mutated', mutatedRoutes)
app.use('/api/jobs', jobRoutes)

server.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})