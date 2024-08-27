import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/AuthRoutes.js'
import tentRoutes from './routes/TentRoutes.js'
import userRoutes from './routes/UserRoutes.js'
import loadRoutes from './routes/LoadRoutes.js'
import mutatedRoutes from './routes/MutatedRoutes.js'
import { Server } from 'socket.io'
import http from 'http'
import Tent from './models/TentModel.js'

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
const getPartById = async (partId) => {
    try {
        const tent = await MutatedTent.findOne({ 'parts._id': partId }).populate('parts.completedBy');
        if (!tent) return null;
        const part = tent.parts.id(partId);
        return part;
    } catch (error) {
        console.error('Error fetching part by ID:', error);
        return null;
    }
};

//WEB SOCKETS
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})

// io.on('connection', (socket)=> {
//     console.log(`user ${socket.id} connected from line 45`)


//     socket.on('toggleItemComplete', ({ part, user }) => {
//         // Broadcast the update to all connected clients
//         io.emit('itemToggled', { part, user });
//     });


//     socket.on('disconnect', ()=> {
//         console.log('A user disconnected')
//     })
    
// })

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected from line 45`);

    socket.on('toggleItemComplete', async({ part, user }) => {
        console.log('Received toggleItemComplete event:', part, user);
        // Broadcast the update to all connected clients
        io.emit('itemToggled', { part, user });

        
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


//ROUTING
app.use('/api/auth', authRoutes)
app.use('/api/tents', tentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/loads', loadRoutes)
app.use('/api/mutated', mutatedRoutes)

server.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})