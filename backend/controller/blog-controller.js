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

exports.getAllBlogPosts = (req, res, next) => {
    //for paginator
        //the plus in front of variables converts to type numbers beacause they are stings comming from the url
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedBlogPosts;
    //blogQuery not executed until we call then()
    const blogQuery = Blog.find();
    if (pageSize && currentPage) {
        //to find select posts
        blogQuery
        //skip does not find all posts and skips the first given paramter posts
            //this skips for example page 2 with 10 items each so the query finds pagesize(10) * currentPage(3) - 1
        .skip(pageSize * (currentPage - 1))
        //limits the amount of documents returned
        .limit(pageSize);
    }
    //to find all posts in database
    blogQuery.find()
        //looks at documents in datatbase
        .then(documents => {
            //to store amount for fetched posts and allow in next then() statement
            fetchedBlogPosts = documents;
            //for amount of items
            return Blog.count();
            //chained then() functions to finally send posts
        }).then(count => {
            res.status(200).json({
                message: "Blog posts fetched successfully!",
                blogs: fetchedBlogPosts,
                maxBlogs: count
            });
        })
        //to catch technical issues
        .catch( error => {
            res.status(500).json({
                message: "Fetching blog posts failed!"
            });
        });
    };

exports.deleteBlogPost = (req, res, next) => {
    //params pulls id from url
    Blog.deleteOne( {_id: req.params.id})
    //to get result
    .then(result => {
        //for error catching
        if (result.n > 0){
            res.status(200).json({message: 'Deletion Successful'});
        } else {
            res.status(401).json({message: 'Not Authroized!'});
        }
    })
    //to catch technical issues
    .catch( error => {
        res.status(500).json({
            message: "Deleting post failed!"
        });
    });
};