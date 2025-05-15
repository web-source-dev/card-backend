const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = mongoose.Types;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for image data
app.use(express.json());

// MongoDB Connection
// Increase buffer timeout and add connection options for reliability
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cardShuffler', {
  bufferCommands: true, // Enable command buffering
  bufferTimeoutMS: 30000, // Increase timeout to 30 seconds
  connectTimeoutMS: 30000, // Connection timeout
  socketTimeoutMS: 45000, // Socket timeout
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 30000, // Timeout for server selection
  heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Card Schema
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Number, default: Date.now }
});

const Card = mongoose.model('Card', cardSchema);

// Validate ObjectId middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: 'No ID provided' });
  }
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ObjectId format' });
  }
  
  next();
};

// Routes
// Get all cards
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ message: 'Failed to fetch cards', error: error.message });
  }
});

// Add a new card
app.post('/api/cards', async (req, res) => {
  try {
    const { name, imageUrl, link } = req.body;
    
    if (!imageUrl || !link) {
      return res.status(400).json({ message: 'Image URL and link are required' });
    }
    
    const newCard = new Card({
      name: name || 'Unnamed Card',
      imageUrl,
      link,
      createdAt: Date.now()
    });
    
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ message: 'Failed to add card', error: error.message });
  }
});

// Update a card
app.put('/api/cards/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, link } = req.body;
    
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { name, imageUrl, link },
      { new: true }
    );
    
    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ message: 'Failed to update card', error: error.message });
  }
});

// Delete a card
app.delete('/api/cards/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findByIdAndDelete(id);
    
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ message: 'Failed to delete card', error: error.message });
  }
});

// Delete all cards
app.delete('/api/cards', async (req, res) => {
  try {
    await Card.deleteMany({});
    res.json({ message: 'All cards deleted successfully' });
  } catch (error) {
    console.error('Error deleting all cards:', error);
    res.status(500).json({ message: 'Failed to delete all cards', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
