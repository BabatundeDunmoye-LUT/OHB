require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Define Hymn Schema and Model
const hymnSchema = new mongoose.Schema({
  title: String,
  lyrics: String,
});
const Hymn = mongoose.model('Hymn', hymnSchema);

// API Endpoints
app.get('/hymns', async (req, res) => {
  const hymns = await Hymn.find();
  res.json(hymns);
});

app.post('/hymns', async (req, res) => {
  const hymn = new Hymn(req.body);
  await hymn.save();
  res.status(201).json(hymn);
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
