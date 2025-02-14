const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/postController');

const post_route = express.Router();

// Middleware
post_route.use(bodyParser.json());
post_route.use(bodyParser.urlencoded({ extended: true }));
post_route.use(express.static('public'));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/postImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

// Routes
post_route.post('/create-post', upload.single('image'), postController.createPost);
post_route.get('/posts', postController.getAllPosts); // Add GET route to fetch all posts
post_route.get('/post/:id', postController.getPostById);  // Get single post by ID
post_route.put('/post/:id', upload.single('image'), postController.updatePost);  // Update post
post_route.delete('/post/:id', postController.deletePost);  // Delete post

module.exports = post_route;
