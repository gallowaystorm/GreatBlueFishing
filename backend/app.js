const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blog-route');
const customerUserRoutes = require('./routes/customer-user-route');
const globalUserRoutes = require('./routes/global-user-route');
const adminUserRoutes = require('./routes/admin-user-route');

const app = express();

//connect to database
mongoose.connect('mongodb+srv://great-blue-fishing-dev:' + process.env.MONGO_ATLAS_PASSWORD + '@greatbluefishingdb.4vsmj.mongodb.net/great-blue-fishing?retryWrites=true&w=majority')
.then( () => {
    console.log('Connected to great blue fishing database successful!');
})
.catch( () => {
    console.log('Connected to database failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//to grant backend access to images folder and forwards requests to images to backend images
app.use('/images', express.static(path.join('../backend/images')))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PATCH, DELETE, PUT"
    );
    next();
  });

  //routes
  app.use('/api/blog', blogRoutes);
  app.use('/api/customer', customerUserRoutes);
  app.use('/api/global/user', globalUserRoutes);
  app.use('/api/admin/user', adminUserRoutes);


  module.exports = app;