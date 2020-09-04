const express = require('express');
const router = express.Router();

const extractFile = require('../middleware/multer');
const BlogController = require('../controller/blog-controller');

//create posts
    //extractFile will store in storage and expects a single file with the propery "image"
    // checkAuth is to verify token
router.post('', extractFile, BlogController.createBlogPost);

//get all posts
router.get('', BlogController.getAllBlogPosts);

//get single post
router.get('/:id', BlogController.getSinglePost)

//delete single post
router.delete('/:id', BlogController.deleteBlogPost);

//update single post
router.put('/:id', extractFile, BlogController.updateSingleBlogPost)

//export all routes
module.exports = router;