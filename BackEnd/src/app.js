const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://code-reviewer-cfni.onrender.com',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Code Reviewer Backend is running 🚀');
});

app.use('/ai', aiRoutes);

module.exports = app;
