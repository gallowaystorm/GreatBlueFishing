const Product = require('../models/product-model');


exports.addProduct = (req, res, next) => {
    //get image url
    const url = req.protocol + '://' + req.get('host');
    //change back to number for database
    //TODO: format price to always be in x.xx format
    const price = parseFloat(req.body.price, 10);
    const product = new Product({ 
        name: req.body.name,
        description: req.body.description,
        imagePath: url + '/images/' + req.file.filename,
        price: price
    });
    //saves to database and get result back of save
    product.save().then(createdProduct => {
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Product added successfully',
            product: {
                ...createdProduct,
                id: createdProduct._id
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Creating a product failed!"
        });
    });
};

exports.getAllProducts = (req, res, next) => {
    //to find all posts in database
    Product.find()
        .then(products => {
            res.status(200).json({
                message: "Products fetched successfully!",
                products: products
            });
        })
        //to catch technical issues
        .catch( error => {
            res.status(500).json({
                message: "Fetching products failed!"
            });
        });
    };

exports.getSingleProduct = (req, res, next) => {
    Product.findById(req.params.id).then( product => {
        //check if exist
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({message: 'Product not found!'})
        }
    })
    //to catch technical issues
    .catch( error => {
        res.status(500).json({
            message: "Fetching product failed!"
        });
    });
};

exports.updateSingleProduct = (req, res, next) => {
    //check if string or req already has the path
    let imagePath = req.body.imagePath;
    const price = parseFloat(req.body.price, 10);
    if (req.file) {
        //set image path to url of image
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename; 
    }
    //creates new post
    const product = new Product ({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        imagePath: imagePath,
        price: price
    });
    //update product based off id passed in through browser
    //creator checks to see if the id of one updating matches the one creating
    Product.updateOne( {_id: req.params.id }, product )
        //if post is successfully updated
        .then( result => {
            //for error catching
            if (result.n > 0){
                res.status(200).json({message: 'Update Successful'});
            } else {
                res.status(401).json({message: 'Not Authroized!'});
            }
        })
        //to catch tecnical errors as well
        .catch(error => {
            res.status(500).json({
                message: "Couldn't update product!"
            });
        });  
};

exports.deleteSingleProduct = (req, res, next) => {
    //params pulls id from url
    Product.deleteOne( {_id: req.params.id})
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
            message: "Deleting product failed!"
        });
    });
};