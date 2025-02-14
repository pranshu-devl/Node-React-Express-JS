const Post = require ('../models/postModel')

const createPost = async(req,res)=>{

    try {

       const post = new Post({
            title: req.body.title,
            date: req.body.date,
            image: req.file.filename
        });
       const postData = await post.save();

       res.status(200).send({ success:true,msg:'Post Data',data: postData });
       
    } catch (error) {
        res.status(400).send({ success:false,msg:error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).send({ success: true, data: posts });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ success: false, msg: 'Post not found' });
        }
        res.status(200).send({ success: true, data: post });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};

// Update a post by ID
const updatePost = async (req, res) => {
    try {
        const updatedData = {
            title: req.body.title,
            date: req.body.date,
            image: req.file ? req.file.filename : req.body.image, // Only update the image if it's provided
        };

        const post = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!post) {
            return res.status(404).send({ success: false, msg: 'Post not found' });
        }
        res.status(200).send({ success: true, msg: 'Post updated successfully!', data: post });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

// Delete a post by ID
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send({ success: false, msg: 'Post not found' });
        }
        res.status(200).send({ success: true, msg: 'Post deleted successfully!' });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };