const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'warmdelights11@gmail.com',
      password: 'admin123456', // This will be hashed automatically
      phone: '8847306427',
      role: 'admin' // This is crucial!
    });
    
    await adminUser.save();
    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
