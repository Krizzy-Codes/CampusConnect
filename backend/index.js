const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
const groupRoutes = require('./src/routes/groupRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CampusConnect API is running! 🚀' });
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected! ✅'))
  .catch((err) => console.log('MongoDB error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});