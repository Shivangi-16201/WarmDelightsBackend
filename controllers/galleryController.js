const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

// Get all gallery images
const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload gallery image (admin only) - now uses Cloudinary via Multer
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    const { title, description, category } = req.body;
    const galleryImage = new Gallery({
      title: title || 'Gallery Image',
      description: description || '',
      category: category || '',
      imageUrl: req.file.path,           // Cloudinary image URL
      cloudinaryId: req.file.filename,   // Cloudinary public ID
      isActive: true,
    });
    const savedImage = await galleryImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete gallery image (admin only)
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image) {
      await cloudinary.uploader.destroy(image.cloudinaryId);
      await Gallery.findByIdAndDelete(req.params.id);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update gallery image (admin only)
const updateGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image) {
      image.title = req.body.title || image.title;
      image.description = req.body.description || image.description;
      image.isActive = req.body.isActive !== undefined ? req.body.isActive : image.isActive;
      image.category = req.body.category || image.category;
      const updatedImage = await image.save();
      res.json(updatedImage);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
};
