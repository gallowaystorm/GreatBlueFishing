
const Gallery = require('../models/gallery-model');


exports.addGalleryImage = (req, res, next) => {

    //get image url
    const url = req.protocol + '://' + req.get('host');
    const galleryImage = new Gallery({ 
        title: req.body.title,
        imagePath: url + '/images/' + req.file.filename
    });
    //saves to database and get result back of save
    galleryImage.save().then(createdGalleryImage => {
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Gallery image added successfully',
            gallery: {
                ...createdGalleryImage,
                id: createdGalleryImage._id
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Creating a gallery image failed!"
        });
    });
}

exports.getAllGalleryImages = (req, res, next) => {
    Gallery.find()
        .then(gallery => {
            res.status(200).json({
                message: "Gallery fetched successfully!",
                gallery: gallery
            });
        })
        //to catch technical issues
        .catch( error => {
            res.status(500).json({
                message: "Fetching gallery failed!"
            });
        });
}

exports.getSingleGalleryImage = (req, res, next) => {
    Gallery.findById(req.params.id).then( gallery => {
        //check if exist
        if (gallery) {
            res.status(200).json(gallery)
        } else {
            res.status(404).json({message: 'Image not found!'})
        }
    })
    //to catch technical issues
    .catch( error => {
        res.status(500).json({
            message: "Fetching image failed!"
        });
    });
};

exports.deleteGalleryImage = (req, res, next) => {
    //params pulls id from url
    Gallery.deleteOne( {_id: req.params.id})
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

exports.updateSingleImage = (req, res, next) => {
    //check if string or req already has the path
    let imagePath = req.body.imagePath;
    if (req.file) {
        //set image path to url of image
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename; 
    }
    //creates new image
    const gallery = new Gallery ({
        _id: req.body.id,
        title: req.body.title,
        imagePath: imagePath
    });
    //update gallery image based off id passed in through browser
    //creator checks to see if the id of one updating matches the one creating
    Gallery.updateOne( {_id: req.params.id }, gallery )
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
                message: "Couldn't update image!"
            });
        });  
};