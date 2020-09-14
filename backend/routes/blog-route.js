const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const extractFile = require('../middleware/multer');
const BlogController = require('../controller/blog-controller');

//create posts
    //extractFile will store in storage and expects a single file with the propery "image"
    // checkAuth is to verify token
router.post('', checkAuth, extractFile, BlogController.createBlogPost);

//get all posts
router.get('', BlogController.getAllBlogPosts);

//get single post
router.get('/:id', checkAuth, BlogController.getSinglePost)

//delete single post
router.delete('/:id', checkAuth, BlogController.deleteBlogPost);

//update single post
router.put('/:id', checkAuth, extractFile, BlogController.updateSingleBlogPost)

//export all routes
module.exports = router;