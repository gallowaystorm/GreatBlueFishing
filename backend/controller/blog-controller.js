const Blog = require('../models/blog-model');

exports.createBlogPost = (req, res, next) => {
    //get image url
    const url = req.protocol + '://' + req.get('host');
    const blog = new Blog({ 
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    //saves to database and get result back of save
    blog.save().then(createdBlog => {
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Blog added successfully',
            blog: {
                ...createdBlog,
                id: createdBlog._id
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Creating a blog failed!"
        });
    });
};