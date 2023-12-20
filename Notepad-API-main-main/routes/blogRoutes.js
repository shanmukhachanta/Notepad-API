const express = require('express')
// const blogController = require('../controllers/blogController')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/Blog')
const { requireAuth, checkUser } = require('../middleware/authMiddleware');


const verifyToken = async (token) => {
    try {
      const decoded = await jwt.verify(token, 'net ninja secret');
      return decoded.id;
    } catch (err) {
      throw new Error('Token authentication failed');
    }
  };
  


router.post('/', async (req, res) => {
    try {
        const userId = await verifyToken(req.cookies.jwt);
        if (!userId) {
            return res.status(401).json({ message: 'Token authentication failed' });
        }

        const newBlog = new Blog({
            title: req.body.title,
            snippet: req.body.snippet,
            body : req.body.body,
            createdBy: userId,
           
        });

        const savedBlog = await newBlog.save();

        console.log(savedBlog); 

        res.redirect('/blogs/index')

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'An error occurred' });
    }
});
router.get('/index', requireAuth, async (req, res) => {
  try {
      const userId = await verifyToken(req.cookies.jwt);

      const userBlogs = await Blog.find({ createdBy: userId });

      res.render('index', { blogs: userBlogs, title: 'Main page' });
  } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'An error occurred' });
  }
});

router.get('/:id',requireAuth, async(req,res)=>{
  try {
    const bodyId = req.params.id
    const userId = await verifyToken(req.cookies.jwt)
    const userblog = await Blog.findOne({ _id: req.params.id, createdBy: userId });
    if (!userblog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.render('details', { blog : userblog, title: 'Blog Details' });
  } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred' });
  }
} );
 router.delete('/:id',requireAuth, async(req,res)=>{
  try {
    const bodyId = req.params.id
    const userId = await verifyToken(req.cookies.jwt)
    const userblog = await Blog.findOneAndDelete({ _id: req.params.id, createdBy: userId });
    
    if (!userblog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred' });
  }
} );

module.exports = router;