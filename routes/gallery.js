const express = require('express');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const Gallery = require('../models/Gallery');
const { 
  getGalleryImages, 
  uploadGalleryImage, 
  deleteGalleryImage, 
  updateGalleryImage 
} = require('../controllers/galleryController');
const router = express.Router();

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'warmdelights-gallery',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage });

// Get all gallery images
router.get('/', getGalleryImages);

// Upload new image (admin only)
router.post('/upload', upload.single('image'), uploadGalleryImage);

// Delete image (admin only)
router.delete('/:id', deleteGalleryImage);

// Update image data (admin only)
router.put('/:id', updateGalleryImage);

module.exports = router;
