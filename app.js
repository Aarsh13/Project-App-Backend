import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import { server, front } from './config/config.js';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

// Connect to DB
connectDB();

// Whitelist from config
const whitelist = [front.URL];

// Safe CORS config
const corsOptions = {
  origin: 'https://project-app-frontend-ivory.vercel.app',
  credentials: true
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests globally
app.options('*', cors(corsOptions));

// API Routes
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

// Start server
const httpServer = app.listen(server.PORT, () => {
  console.log(`Backend running on port ${server.PORT}`);
});

// Socket.io
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: front.URL,
    credentials: true
  }
});

// Socket.io events
io.on('connection', (socket) => {
  socket.on('open project', (project) => {
    socket.join(project);
  });

  socket.on('create task', (task) => {
    socket.to(task.project).emit('task created', task);
  });

  socket.on('delete task', (task) => {
    socket.to(task.project).emit('task deleted', task);
  });

  socket.on('update task', (task) => {
    socket.to(task.project).emit('task updated', task);
  });

  socket.on('toggle task', (task) => {
    socket.to(task.project._id).emit('task toggled', task);
  });
});
