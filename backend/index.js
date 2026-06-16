const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);

// Middleware
app.use(cors({
  origin: 'https://campus-connect-chi-neon.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Models
require('./src/models/User');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const noticeRoutes = require('./src/routes/noticeRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/upload', uploadRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CampusConnect API is running! 🚀' });
});

const errorHandler = require('./src/middleware/errorMiddleware');
app.use(errorHandler);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected! ✅'))
  .catch((err) => console.log('MongoDB error:', err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});