const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Vanilla Cake",
    category: "cakes",
    price: 450.00,
    minQuantity: 1,
    unit: "pc",
    description: "Classic vanilla flavor with creamy frosting",
    image: "/images/vanilla-cake.jpg",
    allergens: ["dairy", "gluten"],
    isActive: true
  },
  {
    name: "Chocolate Cake",
    category: "cakes",
    price: 500.00,
    minQuantity: 1,
    unit: "pc",
    description: "Rich chocolate cake with chocolate ganache",
    image: "/images/chocolate-cake.jpg",
    allergens: ["dairy", "gluten"],
    isActive: true
  },
  {
    name: "Strawberry Cake",
    category: "cakes",
    price: 550.00,
    minQuantity: 1,
    unit: "pc",
    description: "Fresh strawberry cake with cream cheese frosting",
    image: "/images/strawberry-cake.jpg",
    allergens: ["dairy", "gluten"],
    isActive: true
  },
  {
    name: "Peanut Butter Cookies",
    category: "cookies",
    price: 50.00,
    minQuantity: 1,
    unit: "box",
    description: "Crunchy peanut butter cookies, 250g per box",
    image: "/images/peanut-cookies.jpg",
    allergens: ["nuts", "dairy", "gluten"],
    isActive: true
  },
  {
    name: "Chocolate Cookies",
    category: "cookies",
    price: 40.00,
    minQuantity: 1,
    unit: "box",
    description: "Chocolate chip cookies, 250g per box",
    image: "/images/chocolate-cookies.jpg",
    allergens: ["dairy", "gluten"],
    isActive: true
  },
  {
    name: "Chocolate Cupcakes",
    category: "cupcakes",
    price: 40.00,
    minQuantity: 4,
    unit: "pc",
    description: "Moist chocolate cupcakes with buttercream frosting",
    image: "/images/chocolate-cupcakes.jpg",
    allergens: ["dairy", "gluten"],
    isActive: true
  },
  {
    name: "Whole Wheat Banana Muffins",
    category: "muffins",
    price: 35.00,
    minQuantity: 4,
    unit: "pc",
    description: "Healthy whole wheat banana muffins",
    image: "/images/banana-muffins.jpg",
    allergens: ["gluten"],
    isActive: true
  }
];

const initDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    console.log('Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();