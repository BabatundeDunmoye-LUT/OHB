require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();

// Allow all origins or restrict to specific domains
const corsOptions = {
  origin: 'https://dynamic-mooncake-87aa69.netlify.app', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
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
  try {
    const { title } = req.query;
    const hymns = title
      ? await Hymn.find({ title: new RegExp(title, 'i') }) // Case-insensitive search
      : await Hymn.find();
    res.json(hymns);
  } catch (error) {
    console.error('Error fetching hymns:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/hymns', async (req, res) => {
  try {
    let { title, lyrics } = req.body;

    // Automatically add line breaks for better formatting
    lyrics = lyrics.replace(/(Verse \d+|Chorus)/g, '\n$1\n').replace(/(?:\. )/g, '.\n');

    const hymn = new Hymn({ title, lyrics });
    await hymn.save();
    res.status(201).json(hymn);
  } catch (error) {
    console.error('Error saving hymn:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
