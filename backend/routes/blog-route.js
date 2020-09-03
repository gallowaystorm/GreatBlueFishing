const express = require('express');
const router = express.Router();

const extractFile = require('../middleware/multer');
const BlogController = require('../controller/blog-controller');

//create posts
    //extractFile will store in storage and expects a single file with the propery "image"
    // checkAuth is to verify token
router.post('', extractFile, BlogController.createBlogPost);

//get all routes
//get all posts
router.get('', BlogController.getAllBlogPosts);

//export all routes
module.exports = router;