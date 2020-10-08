
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
        console.log(createdGalleryImage)
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Gallery image added successfully',
            product: {
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