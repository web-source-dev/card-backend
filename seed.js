require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// MongoDB Connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cardShuffler', {
  bufferCommands: true,
  bufferTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Card Schema (same as in index.js)
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Number, default: Date.now }
});

const Card = mongoose.model('Card', cardSchema);

// Direct Unsplash image URLs with categories
const unsplashImages = [
  // Nature
  { category: 'Nature', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Nature', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Nature', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Technology
  { category: 'Technology', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Technology', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Technology', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Travel
  { category: 'Travel', url: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Travel', url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Travel', url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Food
  { category: 'Food', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Food', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Food', url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Animals
  { category: 'Animals', url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Animals', url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Animals', url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Architecture
  { category: 'Architecture', url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Architecture', url: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Architecture', url: 'https://images.unsplash.com/photo-1478066792002-98655b267d45?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Business
  { category: 'Business', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Business', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Business', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Fashion
  { category: 'Fashion', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Fashion', url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Fashion', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Health
  { category: 'Health', url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Health', url: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Health', url: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Sports
  { category: 'Sports', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Sports', url: 'https://images.unsplash.com/photo-1475440197469-e367ec8eeb19?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Sports', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Art
  { category: 'Art', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Art', url: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Art', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&h=600&auto=format&fit=crop' },
  
  // Additional images to reach 33
  { category: 'Nature', url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Travel', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&h=600&auto=format&fit=crop' },
  { category: 'Food', url: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800&h=600&auto=format&fit=crop' }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing cards
    await Card.deleteMany({});
    console.log('Existing cards cleared');
    
    // Generate and insert new cards
    const cardsToInsert = unsplashImages.map((image, index) => ({
      name: `Card ${index + 1} - ${image.category}`,
      imageUrl: image.url,
      link: `https://unsplash.com/s/photos/${image.category.toLowerCase()}`,
      createdAt: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
    }));
    
    const result = await Card.insertMany(cardsToInsert);
    
    console.log(`Successfully seeded database with ${result.length} cards`);
    console.log('Sample card:', result[0]);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seeding function
seedDatabase(); 