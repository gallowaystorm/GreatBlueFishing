const Product = require('../models/product-model');


exports.addProduct = (req, res, next) => {
    //get image url
    const url = req.protocol + '://' + req.get('host');
    //change back to number for database
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