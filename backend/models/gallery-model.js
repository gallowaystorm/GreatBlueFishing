const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
})


module.exports = mongoose.model('gallery', gallerySchema, 'gallery');