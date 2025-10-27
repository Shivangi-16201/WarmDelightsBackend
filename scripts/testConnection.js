const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('🗄️ Testing MongoDB Connection...\n');
  
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI is not set in environment variables');
    console.log('Please check your .env file');
    return false;
  }

  console.log('📋 Connection Details:');
  console.log('──────────────────────────────');
  console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':********@')); // Hide password
  console.log('──────────────────────────────\n');

  try {
    // Set connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    };

    console.log('🔗 Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Get database information
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    
    // Get server info
    const serverInfo = await adminDb.serverInfo();
    console.log('📊 Server Version:', serverInfo.version);
    console.log('🏷️ Host:', serverInfo.host);
    
    // Get database stats
    const stats = await db.stats();
    console.log('💾 Database Name:', stats.db);
    console.log('📦 Collections:', stats.collections);
    console.log('📄 Documents:', stats.objects);
    console.log('🗃️ Storage Size:', (stats.storageSize / 1024 / 1024).toFixed(2), 'MB');
    
    // List all collections
    console.log('\n📋 Collections in database:');
    const collections = await db.listCollections().toArray();
    collections.forEach((collection, index) => {
      console.log(`  ${index + 1}. ${collection.name}`);
    });
    
    // Test basic database operations
    console.log('\n🧪 Testing database operations...');
    
    // Try to read from products collection
    const productsCount = await db.collection('products').countDocuments();
    console.log('🛍️ Products in database:', productsCount);
    
    // Try to read from users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log('👥 Users in database:', usersCount);
    
    console.log('\n🎉 MongoDB connection test completed successfully!');
    console.log('Your database is ready to use.');
    
    return true;

  } catch (error) {
    console.log('\n❌ MongoDB connection failed:');
    console.log('Error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔍 Troubleshooting tips:');
      console.log('1. Check your MongoDB Atlas connection string');
      console.log('2. Verify your IP is whitelisted in MongoDB Atlas');
      console.log('3. Check your internet connection');
      console.log('4. Ensure MongoDB Atlas cluster is running');
      console.log('5. Verify username and password in connection string');
    } else if (error.name === 'MongoNetworkError') {
      console.log('\n🌐 Network error:');
      console.log('1. Check your internet connection');
      console.log('2. Firewall might be blocking the connection');
      console.log('3. Try pinging mongodb.net to test connectivity');
    }
    
    return false;
  } finally {
    // Close the connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('\n🔌 Connection closed.');
    }
  }
};

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ All database tests passed!');
    } else {
      console.log('\n❌ Database connection test failed.');
      console.log('Please check the error messages above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });